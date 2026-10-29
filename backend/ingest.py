
from pathlib import Path

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS


# Resolve paths relative to this file
BASE_DIR = Path(__file__).resolve().parent
HR_DOCS_DIR = BASE_DIR / "hr_docs"
FAISS_DIR = BASE_DIR / "faiss_index"

# Embedding model
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"


def ingest_hr_documents():
    """Load HR PDFs, split their text, and build a FAISS index."""

    if not HR_DOCS_DIR.exists():
        raise FileNotFoundError(
            f"HR documents folder not found: {HR_DOCS_DIR}"
        )

    pdf_files = list(HR_DOCS_DIR.glob("*.pdf"))

    if not pdf_files:
        raise FileNotFoundError(
            f"No PDF files found in {HR_DOCS_DIR}"
        )

    documents = []

    print(f"Found {len(pdf_files)} PDF file(s).")

    # Load each PDF
    for pdf_file in pdf_files:
        print(f"Reading: {pdf_file.name}")

        loader = PyPDFLoader(str(pdf_file))
        pages = loader.load()

        # Preserve document name and page information
        for page in pages:
            page.metadata["source"] = pdf_file.name
            page.metadata["page"] = page.metadata.get("page", 0) + 1

        documents.extend(pages)

    if not documents:
        raise ValueError(
            "No text could be extracted from the PDF files."
        )

    # Split documents into smaller chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=150,
        add_start_index=True,
    )

    chunks = splitter.split_documents(documents)

    if not chunks:
        raise ValueError(
            "No text chunks were generated from the documents."
        )

    print(f"Extracted {len(documents)} pages.")
    print(f"Created {len(chunks)} text chunks.")
    print("Loading embedding model...")

    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )

    print("Creating FAISS vector index...")

    vector_store = FAISS.from_documents(
        documents=chunks,
        embedding=embeddings,
    )

    # Save the index locally
    FAISS_DIR.mkdir(parents=True, exist_ok=True)
    vector_store.save_local(str(FAISS_DIR))

    print("\nHR document ingestion completed successfully!")
    print(f"PDF files processed: {len(pdf_files)}")
    print(f"Pages processed: {len(documents)}")
    print(f"Text chunks indexed: {len(chunks)}")
    print(f"FAISS index saved to: {FAISS_DIR}")


if __name__ == "__main__":
    ingest_hr_documents()

