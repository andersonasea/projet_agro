from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


def md_line_to_html(line: str) -> str:
    text = (
        line.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )
    if text.startswith("### "):
        return f"<b>{text[4:]}</b>"
    if text.startswith("## "):
        return f"<b>{text[3:]}</b>"
    if text.startswith("# "):
        return f"<b>{text[2:]}</b>"
    if text.startswith("- "):
        return f"• {text[2:]}"
    if text[:2].isdigit() and text[1:3] == ". ":
        return text
    return text


def main() -> None:
    src = Path("Plan_MVP_Agro_RDC_WebFirst_10000USD.md")
    dst = Path("Plan_MVP_Agro_RDC_WebFirst_10000USD.pdf")

    lines = src.read_text(encoding="utf-8").splitlines()

    doc = SimpleDocTemplate(
        str(dst),
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    styles = getSampleStyleSheet()
    normal = ParagraphStyle(
        "NormalUtf",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=14,
        spaceAfter=4,
    )

    content = []
    for raw in lines:
        if raw.strip() == "":
            content.append(Spacer(1, 6))
            continue
        content.append(Paragraph(md_line_to_html(raw), normal))

    doc.build(content)
    print(f"PDF generated: {dst.resolve()}")


if __name__ == "__main__":
    main()
