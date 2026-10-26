#!/usr/bin/env python3
"""
MindFlow Repository Audit Context Generator
Portable, provider-neutral repository inventory for AI-assisted audits.

Usage:
  python audit_mindflow.py /path/to/MindAI
  python audit_mindflow.py /path/to/MindAI --include-source

Default behavior:
- Never reads or copies .env/credential/private-key files into the context package.
- Does not copy source code unless --include-source is provided.
- Generates machine-readable JSON plus human-readable Markdown.
- Uses only Python standard library.
"""

from __future__ import annotations
import argparse, hashlib, json, os, re, shutil, subprocess
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

EXCLUDED_DIRS = {
    ".git", ".hg", ".svn", "node_modules", "vendor", ".venv", "venv",
    "__pycache__", ".pytest_cache", ".mypy_cache", ".ruff_cache",
    "dist", "build", ".next", ".nuxt", "coverage", ".gradle",
    "Pods", ".dart_tool", ".idea", ".vscode", "target"
}
SECRET_NAME_PATTERNS = [
    r"^\.env($|\.)", r"secret", r"credential", r"password", r"passwd",
    r"private[_-]?key", r"service[-_]?account", r"\.pem$", r"\.key$",
    r"\.p12$", r"\.pfx$", r"id_rsa", r"id_ed25519"
]
BINARY_EXTS = {
    ".png",".jpg",".jpeg",".gif",".webp",".ico",".pdf",".zip",".7z",".rar",
    ".mp3",".mp4",".mov",".avi",".wav",".woff",".woff2",".ttf",".otf",
    ".exe",".dll",".so",".dylib",".class",".jar",".bin",".db",".sqlite",
    ".sqlite3",".pyc",".lockb"
}
SOURCE_EXTS = {
    ".py",".js",".jsx",".ts",".tsx",".java",".kt",".go",".rs",".php",".rb",
    ".cs",".cpp",".c",".h",".hpp",".swift",".dart",".vue",".svelte",
    ".html",".css",".scss",".sql",".sh",".yml",".yaml",".json",".toml",
    ".ini",".xml",".md"
}
DATA_NAME_PATTERNS = [
    r"fixture", r"seed", r"sample[-_]?data", r"mock", r"dump", r"backup",
    r"patient", r"clinical", r"medical", r"mental", r"health"
]
MAX_TEXT_BYTES = 1_500_000
MAX_SOURCE_FILE_BYTES = 250_000

def rel(root: Path, p: Path) -> str:
    return p.relative_to(root).as_posix()

def is_excluded_dir(name: str) -> bool:
    return name in EXCLUDED_DIRS

def is_secret_name(name: str) -> bool:
    low = name.lower()
    return any(re.search(p, low) for p in SECRET_NAME_PATTERNS)

def looks_like_data(name: str) -> bool:
    low = name.lower()
    return any(re.search(p, low) for p in DATA_NAME_PATTERNS)

def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def read_text(path: Path, limit=MAX_TEXT_BYTES):
    try:
        if path.stat().st_size > limit:
            return None
        return path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return None

def walk_files(root: Path):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if not is_excluded_dir(d)]
        for fn in filenames:
            p = Path(dirpath) / fn
            if p.is_symlink():
                continue
            yield p

def git_info(root: Path):
    out = {}
    try:
        def git(*args):
            return subprocess.check_output(
                ["git", "-C", str(root), *args],
                stderr=subprocess.DEVNULL, text=True, timeout=10
            ).strip()
        out["is_git_repo"] = (root / ".git").exists()
        if out["is_git_repo"]:
            out["branch"] = git("branch", "--show-current")
            out["remote"] = git("remote", "-v")
            out["last_commit"] = git("log", "-1", "--format=%H|%ad|%s", "--date=iso")
            out["commit_count"] = git("rev-list", "--count", "HEAD")
    except Exception as e:
        out["error"] = str(e)
    return out

def detect_stack(files, texts):
    patterns = {
        "Python": ["requirements.txt","pyproject.toml","Pipfile","manage.py"],
        "Django": ["django" ],
        "FastAPI": ["fastapi"],
        "Flask": ["flask"],
        "Node.js": ["package.json","package-lock.json","pnpm-lock.yaml","yarn.lock"],
        "React": ["react"],
        "Next.js": ["next"],
        "Vue": ["vue"],
        "Angular": ["@angular"],
        "Express": ["express"],
        "NestJS": ["@nestjs"],
        "PHP": ["composer.json","artisan"],
        "Laravel": ["laravel/framework","artisan"],
        "Java": ["pom.xml","build.gradle","gradlew"],
        "Spring": ["spring-boot"],
        "Go": ["go.mod"],
        "Rust": ["Cargo.toml"],
        "Flutter/Dart": ["pubspec.yaml"],
        "React Native": ["react-native"],
        "Docker": ["Dockerfile","docker-compose.yml","compose.yml"],
        "GitHub Actions": [".github/workflows"],
        "Terraform": ["*.tf"],
    }
    found = {}
    names = {p.name for p in files}
    paths = {p.as_posix() for p in files}
    alltext = "\n".join(texts.values()).lower()
    for tech, needles in patterns.items():
        hits = []
        for n in needles:
            if n.startswith("*"):
                if any(p.suffix == n[1:] for p in files): hits.append(n)
            elif "/" in n:
                if any(n in p.as_posix() for p in files): hits.append(n)
            elif n in names:
                hits.append(n)
            elif n.lower() in alltext:
                hits.append(n)
        if hits:
            found[tech] = sorted(set(hits))
    return found

def extract_dependencies(texts):
    result = {}
    for path, txt in texts.items():
        name = Path(path).name
        if name == "package.json":
            try:
                d = json.loads(txt)
                result[path] = {
                    "dependencies": d.get("dependencies", {}),
                    "devDependencies": d.get("devDependencies", {}),
                    "scripts": d.get("scripts", {})
                }
            except Exception:
                pass
        elif name in {"requirements.txt","requirements-dev.txt"}:
            result[path] = [x.strip() for x in txt.splitlines()
                            if x.strip() and not x.lstrip().startswith("#")]
        elif name == "pyproject.toml":
            result[path] = {"note": "TOML detected; inspect project-specific dependency tables."}
        elif name == "composer.json":
            try:
                d = json.loads(txt)
                result[path] = {
                    "require": d.get("require", {}),
                    "require-dev": d.get("require-dev", {}),
                    "scripts": d.get("scripts", {})
                }
            except Exception:
                pass
        elif name == "pubspec.yaml":
            result[path] = {"note": "Dart/Flutter manifest detected."}
    return result

def regex_findings(texts):
    findings = []
    patterns = [
        ("possible_secret", re.compile(
            r"(?i)\b(api[_-]?key|secret|access[_-]?token|password|private[_-]?key)\b\s*[:=]\s*['\"][^'\"]{8,}['\"]"
        )),
        ("private_key_block", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")),
        ("hardcoded_url", re.compile(r"https?://[^\s'\"`]+")),
    ]
    for path, txt in texts.items():
        for kind, rx in patterns:
            if rx.search(txt):
                findings.append({"type": kind, "file": path, "note": "Potential sensitive/configuration finding; value intentionally omitted."})
    return findings

def route_findings(texts):
    routes = []
    rx = re.compile(
        r"""(?:
            @(?:app|router|api_router)\.(?P<method1>get|post|put|patch|delete|options|head)\s*\(\s*['"](?P<route1>[^'"]+)['"]|
            (?:router|app)\.(?P<method2>get|post|put|patch|delete)\s*\(\s*['"](?P<route2>[^'"]+)['"]|
            path\s*\(\s*['"](?P<route3>[^'"]+)['"]
        )""",
        re.X | re.I
    )
    for path, txt in texts.items():
        for m in rx.finditer(txt):
            method = m.group("method1") or m.group("method2") or "PATH"
            route = m.group("route1") or m.group("route2") or m.group("route3") or ""
            if route:
                routes.append({"file": path, "method": method.upper(), "route": route})
    return routes[:1000]

def ai_findings(texts):
    terms = re.compile(r"(?i)\b(gemini|vertex\s*ai|openai|anthropic|claude|llm|embedding|embeddings|rag|vector|langchain|llamaindex|prompt|agent)\b")
    out = []
    for path, txt in texts.items():
        hits = sorted(set(m.group(0).lower() for m in terms.finditer(txt)))
        if hits:
            out.append({"file": path, "signals": hits})
    return out

def make_tree(root: Path):
    lines = [root.name + "/"]
    for p in sorted(walk_files(root), key=lambda x: rel(root,x)):
        parts = rel(root,p).split("/")
        indent = ""
        for i, part in enumerate(parts):
            prefix = "├── " if i == len(parts)-1 else "│   "
            lines.append(indent + prefix + part)
            indent += "│   "
    return "\n".join(lines)

def write_md(path, title, body):
    path.write_text(f"# {title}\n\n{body.rstrip()}\n", encoding="utf-8")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("repo", help="Path to cloned/downloaded repository")
    ap.add_argument("-o", "--output", default=None, help="Output directory")
    ap.add_argument("--include-source", action="store_true",
                    help="Copy text source files into context/source, excluding secrets and likely sensitive fixture/data files.")
    args = ap.parse_args()

    root = Path(args.repo).expanduser().resolve()
    if not root.exists() or not root.is_dir():
        raise SystemExit(f"Repository directory not found: {root}")

    out = Path(args.output).expanduser().resolve() if args.output else root.parent / f"{root.name}_AUDIT_CONTEXT"
    if out.exists():
        shutil.rmtree(out)
    (out / "reports").mkdir(parents=True)
    (out / "data").mkdir()
    if args.include_source:
        (out / "source").mkdir()

    files = list(walk_files(root))
    text_files = {}
    inventory = []
    skipped = []
    for p in files:
        r = rel(root,p)
        if is_secret_name(p.name):
            skipped.append({"path": r, "reason": "secret/credential-like filename"})
            continue
        if p.suffix.lower() in BINARY_EXTS:
            skipped.append({"path": r, "reason": "binary/non-text"})
            continue
        txt = read_text(p)
        if txt is not None:
            text_files[r] = txt
        inventory.append({
            "path": r,
            "size_bytes": p.stat().st_size,
            "extension": p.suffix.lower(),
            "sha256": sha256(p),
            "likely_sensitive_data_name": looks_like_data(p.name)
        })

    stack = detect_stack(files, text_files)
    deps = extract_dependencies(text_files)
    security = regex_findings(text_files)
    routes = route_findings(text_files)
    ai = ai_findings(text_files)
    git = git_info(root)

    manifest = {
        "schema_version": "1.0",
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "repository": root.name,
        "source_path": str(root),
        "file_count_scanned": len(files),
        "text_files_indexed": len(text_files),
        "include_source": args.include_source,
        "git": git,
        "stack": stack,
        "security_signal_count": len(security),
        "api_route_signal_count": len(routes),
        "ai_signal_file_count": len(ai),
        "excluded_count": len(skipped),
    }
    (out / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    (out / "data" / "inventory.json").write_text(json.dumps(inventory, indent=2, ensure_ascii=False), encoding="utf-8")
    (out / "data" / "dependencies.json").write_text(json.dumps(deps, indent=2, ensure_ascii=False), encoding="utf-8")
    (out / "data" / "security_signals.json").write_text(json.dumps(security, indent=2, ensure_ascii=False), encoding="utf-8")
    (out / "data" / "api_routes.json").write_text(json.dumps(routes, indent=2, ensure_ascii=False), encoding="utf-8")
    (out / "data" / "ai_signals.json").write_text(json.dumps(ai, indent=2, ensure_ascii=False), encoding="utf-8")
    (out / "data" / "excluded_files.json").write_text(json.dumps(skipped, indent=2, ensure_ascii=False), encoding="utf-8")

    write_md(out / "reports" / "PROJECT_TREE.md", "Project Tree", "```text\n" + make_tree(root) + "\n```")
    write_md(out / "reports" / "TECH_STACK.md", "Detected Technology Stack",
             "\n".join(f"- **{k}** — signals: {', '.join(v)}" for k,v in stack.items()) or "No stack signals detected.")
    write_md(out / "reports" / "AUDIT_README.md", "MindFlow Audit Context",
             """This folder is a provider-neutral audit context generated from the repository.

## Ground rules
- `manifest.json` describes the generation run.
- `data/` contains machine-readable inventories.
- `reports/` contains human-readable summaries.
- `source/` exists only when `--include-source` was used.
- Secret-like files are excluded by filename pattern.
- Likely fixture/sample/health-data filenames are flagged; they are not automatically safe to share.
- Security signals are indicators, not confirmed vulnerabilities.
- API and AI detections are heuristic and require source verification.

## Recommended AI workflow
1. Read `manifest.json`.
2. Read all files under `reports/`.
3. Read `data/*.json`.
4. If `source/` exists, inspect source files and cite exact paths.
5. Distinguish IMPLEMENTED / PARTIAL / DOCUMENTED / ABSENT / NOT_VERIFIABLE.
6. Never infer implementation from README text alone.
""")

    if args.include_source:
        for r, txt in text_files.items():
            src = root / r
            if src.stat().st_size > MAX_SOURCE_FILE_BYTES:
                continue
            if looks_like_data(src.name):
                continue
            dest = out / "source" / r
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(txt, encoding="utf-8")

    print(f"Audit context created: {out}")
    print(f"Files scanned: {len(files)} | text indexed: {len(text_files)} | source included: {args.include_source}")
    print(f"Security signals: {len(security)} | API route signals: {len(routes)} | AI signal files: {len(ai)}")

if __name__ == "__main__":
    main()
