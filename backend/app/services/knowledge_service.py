from pathlib import Path


def load_knowledge_base() -> str:
    root_dir = Path(__file__).resolve().parents[3]
    kb_path = root_dir / "knowledge_base" / "knowledge_base.md"

    if not kb_path.exists():
        return "Knowledge base file not found."

    return kb_path.read_text(encoding="utf-8")