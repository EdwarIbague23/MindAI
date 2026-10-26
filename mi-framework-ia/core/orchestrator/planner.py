"""Motor de planificación y descomposición de tareas para agentes clínicos."""

from typing import List, Dict, Any, Optional, Union
from dataclasses import dataclass, field


@dataclass
class Task:
    """Representa una tarea descomposable dentro del flujo clínico."""
    id: str
    description: str
    agent_type: str  # 'clinical', 'emotion', 'research', 'administrative'
    priority: int = 3  # 1 = alta, 5 = baja
    status: str = "pending"  # pending, running, completed, failed
    context: Dict[str, Any] = field(default_factory=dict)
    result: Optional[Any] = None
    error: Optional[str] = None
    created_at: str = field(default_factory=lambda __: __import__("datetime").datetime.now().isoformat())
    started_at: Optional[str] = None
    completed_at: Optional[str] = None


@dataclass
class Plan:
    """Plan estructurado de tareas a ejecutar por el orchestrator."""
    plan_id: str
    objective: str  # Objetivo general (ej: "analizar nota clínica")
    tasks: List[Task] = field(default_factory=list)
    status: str = "pending"
    created_at: str = field(default_factory=lambda __: __import__("datetime").datetime.now().isoformat())
    completed_at: Optional[str] = None


class TaskDecomposer:
    """
    Descompone objetivos clínicos complejos en subtareas delegables
    a agentes especializados siguiendo un flujo estructurado.
    """
    
    # Mapeo de objetivos a tipos de agente
    OBJECTIVE_AGENT_MAP: Dict[str, str] = {
        "emotional_analysis": "emotion",
        "cognitive_distortion": "clinical",
        "risk_assessment": "clinical", 
        "note_summary": "clinical",
        "patient_feedback": "emotion",
        "treatment_guidance": "clinical",
    }
    
    # Niveles de prioridad por tipo de tarea
    TASK_PRIORITY: Dict[str, int] = {
        "urgent": 1,
        "high": 2,
        "medium": 3,
        "low": 4,
        "background": 5,
    }
    
    def decompose_objective(self, objective: str, context: Optional[Dict] = None) -> Plan:
        """
        Descompone un objetivo en una Plan estructurado con tareas ordenadas.
        
        Args:
            objective: Descripción del objetivo a lograr (ej: "analizar estado emocional de la nota")
            context: Contexto adicional (id de nota clínica, id paciente, etc.)
            
        Returns:
            Plan con tareas descompuestas y priorizadas
        """
        if context is None:
            context = {}
        
        plan_id = f"plan_{__import__('datetime').datetime.now().timestamp()}"
        tasks: List[Task] = []
        
        # Paso 1: Análisis preliminar de clasificación
        tasks.append(Task(
            id=f"task_1_preliminary_{plan_id}",
            description="Clasificar tipo de análisis requerido y identificar agente objetivo",
            agent_type="clinical",
            priority=self.TASK_PRIORITY["high"],
            context={"objective": objective, "context": context},
        ))
        
        # Paso 2: Descomposición según tipo de objetivo
        agent_type = self._determine_agent_type(objective)
        
        if agent_type == "emotion":
            tasks.extend(self._decompose_emotional_analysis(objective, context, plan_id))
        elif agent_type == "clinical":
            tasks.extend(self._decompose_clinical_analysis(objective, context, plan_id))
        else:
            tasks.append(Task(
                id=f"task_generic_{plan_id}",
                description=f"Análisis general: {objective}",
                agent_type="research",
                priority=self.TASK_PRIORITY["medium"],
                context=context,
            ))
        
        # Paso 3: Validación y reporte final
        tasks.append(Task(
            id=f"task_validation_{plan_id}",
            description="Validar resultados y formatear salida para revisión humana",
            agent_type="clinical",
            priority=self.TASK_PRIORITY["high"],
            context={"final_output": True, "original_objective": objective},
        ))
        
        plan = Plan(
            plan_id=plan_id,
            objective=objective,
            tasks=tasks,
        )
        
        return plan
    
    def _determine_agent_type(self, objective: str) -> str:
        """Determina el tipo de agente necesario basándose en la objective."""
        objective_lower = objective.lower()
        
        for key, agent in self.OBJECTIVE_AGENT_MAP.items():
            if key in objective_lower:
                return agent
        
        return "clinical"  # Default
    
    def _decompose_emotional_analysis(self, objective: str, context: Dict, plan_id: str) -> List[Task]:
        """Descompone análisis emocional en subtareas específicas."""
        return [
            Task(
                id=f"task_emotion_extract_{plan_id}",
                description="Extraer señales emocionales crudas de la nota clínica anonimizada",
                agent_type="emotion",
                priority=self.TASK_PRIORITY["high"],
                context=context,
            ),
            Task(
                id=f"task_emotion_scoring_{plan_id}",
                description="Calcular scores de emoción (ansiedad, depresión, ira, miedo, alegría) 0-100",
                agent_type="emotion",
                priority=self.TASK_PRIORITY["high"],
                context=context,
            ),
            Task(
                id=f"task_emotion_evidence_{plan_id}",
                description="Identificar evidencia textual que sustenta cada score emocional",
                agent_type="emotion",
                priority=self.TASK_PRIORITY["medium"],
                context=context,
            ),
        ]
    
    def _decompose_clinical_analysis(self, objective: str, context: Dict, plan_id: str) -> List[Task]:
        """Descompone análisis clínico en subtareas específicas."""
        return [
            Task(
                id=f"task_clinical_extract_{plan_id}",
                description="Extraer hallazgos clínicos estructurados de la nota anonimizada",
                agent_type="clinical",
                priority=self.TASK_PRIORITY["high"],
                context=context,
            ),
            Task(
                id=f"task_clinical_distortions_{plan_id}",
                description="Identificar distorsiones cognitivas presentes (catastrofismo, todo-o-nada, generalización excesiva)",
                agent_type="clinical",
                priority=self.TASK_PRIORITY["medium"],
                context=context,
            ),
            Task(
                id=f"task_clinical_questions_{plan_id}",
                description="Generar preguntas guía para el terapeuta basadas en el análisis",
                agent_type="clinical",
                priority=self.TASK_PRIORITY["medium"],
                context=context,
            ),
        ]


# Instancia global para uso en el orchestrator
task_decomposer = TaskDecomposer()


def create_plan(objective: str, context: Optional[Dict] = None) -> Plan:
    """Función de conveniencia para crear un plan de tareas desde anywhere en el código."""
    return task_decomposer.decompose_objective(objective, context)


def get_next_task(plan: Plan) Optional[Task]:
    """Obtiene la próxima tarea pendiente de un plan, o None si todas están completadas."""
    for task in plan.tasks:
        if task.status == "pending":
            return task
    return None


def task_completed(task: Task) -> bool:
    """Marca una tarea como completada y retorna True si el resultado está presente."""
    task.status = "completed"
    task.completed_at = __import__("datetime").datetime.now().isoformat()
    return task.result is not None


def task_failed(task: Task, error: str) -> bool:
    """Marca una tarea como fallida."""
    task.status = "failed"
    task.error = error
    task.completed_at = __import__("datetime").datetime.now().isoformat()
    return False