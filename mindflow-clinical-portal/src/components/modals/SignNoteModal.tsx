import React, { useState } from 'react';

interface SignNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patientName: string;
}

export const SignNoteModal: React.FC<SignNoteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  patientName,
}) => {
  const [pin, setPin] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  if (!isOpen) return null;

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) return;
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setPin('');
      onConfirm();
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface-card w-full max-w-lg rounded-2xl shadow-2xl p-6 flex flex-col gap-5 border border-border-hairline animate-in zoom-in-95">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
              <span className="material-symbols-outlined text-[22px]">fingerprint</span>
            </div>
            <div>
              <h4 className="font-headline text-[18px] text-on-surface font-bold">Confirmación de Firma Digital</h4>
              <p className="text-[12px] text-ink-muted">Acción irreversible con validez probatoria legal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-tertiary hover:bg-surface-subtle hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="bg-surface-subtle rounded-xl p-4 flex flex-col gap-2 text-[13px] border border-border-hairline/60">
          <div className="flex justify-between text-ink-muted">
            <span>Paciente:</span>
            <span className="font-semibold text-on-surface">{patientName} (MP-4402-CT)</span>
          </div>
          <div className="flex justify-between text-ink-muted">
            <span>Tipo de Registro:</span>
            <span className="font-semibold text-on-surface">Evolución Psicológica Individual (SOAP)</span>
          </div>
          <div className="flex justify-between text-ink-muted">
            <span>Emisor Acreditado:</span>
            <span className="font-semibold text-on-surface">Dr. Alejandro Morales (TP-109482)</span>
          </div>
          <div className="flex justify-between text-ink-muted">
            <span>Estándar de Cifrado:</span>
            <span className="font-mono text-[12px] text-primary font-bold">ED25519-SHA512</span>
          </div>
        </div>

        <form onSubmit={handleSign} className="flex flex-col gap-4">
          <div>
            <label className="text-[12px] font-semibold text-on-surface block mb-1.5" htmlFor="pass-pin">
              Ingrese su Clave de Firma Criptográfica (PIN Clínico)
            </label>
            <input
              id="pass-pin"
              type="password"
              maxLength={6}
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••"
              className="w-full h-12 px-4 rounded-xl bg-canvas text-center tracking-[0.5em] font-headline text-[20px] font-bold text-on-surface focus:outline-none focus:bg-surface-card border border-border-hairline"
            />
            <p className="text-[11px] text-ink-muted text-center mt-1.5">
              Clave asignada por Colpsic Digital Signature Provider
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-surface-subtle hover:bg-surface-container text-ink-muted text-[13px] font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pin.length < 4 || isSigning}
              className="px-6 py-2.5 rounded-lg bg-primary hover:bg-border-focus text-on-primary text-[13px] font-bold flex items-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSigning ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  <span>Firmando y Sellando...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Sellar Expediente</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
