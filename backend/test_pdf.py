from pathlib import Path
from pypdf import PdfReader

BASE_DIR = Path(__file__).resolve().parent
PDF_PATH = BASE_DIR / "hr_docs" / "Company_HR_Policies.pdf"

reader = PdfReader(str(PDF_PATH))

print("PDF:", PDF_PATH.name)
print("Total pages:", len(reader.pages))

total_characters = 0

for page_number, page in enumerate(reader.pages, start=1):
    text = page.extract_text() or ""
    total_characters += len(text)

    print(f"\nPage {page_number}: {len(text)} characters")
    print(text[:300].replace("\n", " "))

print("\nTotal extracted characters:", total_characters)