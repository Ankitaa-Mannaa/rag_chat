import fitz  # PyMuPDF
import docx
from pathlib import Path

def extract_text_from_file(file_path: str) -> str:
    path = Path(file_path)
    suffix = path.suffix.lower()
    if suffix == ".pdf":
        text = ""
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text()
        return text
    elif suffix == ".docx":
        d = docx.Document(file_path)
        return "\n".join(p.text for p in d.paragraphs)
    elif suffix == ".txt":
        return Path(file_path).read_text(encoding="utf-8", errors="ignore")
    else:
        raise ValueError("Unsupported format (allowed: PDF, DOCX, TXT)")
