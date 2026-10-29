# HR Knowledge Agent

An AI-powered HR Knowledge Agent that helps employees find answers to their HR-related questions using company HR policy documents.

## Overview

The HR Knowledge Agent uses Retrieval-Augmented Generation (RAG) to retrieve relevant information from HR policy documents and generate clear, contextual responses to employee questions.

The application combines a React frontend with a Python FastAPI backend, a FAISS vector store, Hugging Face embeddings, and a language model accessed through LangChain's ChatGroq integration.

SQLite is used to store application data, while SQLAlchemy manages database operations through Python models.

## Key Features

- HR policy question answering.
- PDF document processing and text extraction.
- Retrieval of relevant policy information using FAISS.
- Semantic text embeddings using Hugging Face.
- AI-generated responses based on retrieved policy context.
- React-based user interface.
- FastAPI backend for application and AI functionality.
- User account and chat-history storage using SQLite and SQLAlchemy.
- Conversational responses designed to be clear, professional, and easy to understand.

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Python
- FastAPI
- LangChain
- LangChain-Groq
- LangChain-HuggingFace
- LangChain Community

### AI and Retrieval

- Large Language Model through ChatGroq
- Hugging Face sentence embeddings
- FAISS vector store
- Retrieval-Augmented Generation (RAG)

### Database

- SQLite
- SQLAlchemy

### Document Processing

- PyPDF2
- PDF-based HR policy documents

## Project Structure

HR-Knowledge-Agent/
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── vite.config.js
├── backend/
│ ├── hr_docs/
│ ├── faiss_index/
│ ├── main.py
│ ├── ingest.py
│ ├── database.py
│ ├── models.py
│ └── requirements.txt
├── .gitignore
└── README.md

The exact filenames and additional folders may vary depending on the implementation.

## How It Works

1. The employee enters an HR-related question through the React interface.
2. The frontend sends the question to the FastAPI backend.
3. The backend retrieves relevant information from the indexed HR policy documents.
4. FAISS searches for relevant document chunks using vector similarity.
5. The retrieved context and employee question are passed to the language model.
6. The model generates a response based on the available policy information.
7. The backend returns the response to the frontend for display.

User accounts and chat history are managed separately through SQLite and SQLAlchemy.

## Installation and Setup

### Prerequisites

Install the following before running the application:

- Python
- Node.js and npm
- A Groq API key

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd HR-Knowledge-Agent
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual repository URL.

### 2. Set Up the Backend

Open a terminal and navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside the backend folder:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
```

Replace the example API key with your own key.

Never commit your actual API key or other credentials to GitHub.

### 4. Prepare the HR Policy Documents and Vector Index

Place the required HR policy PDF in the configured document directory.

If the FAISS index is not included in the repository, run the document-ingestion script to generate it:

```bash
python ingest.py
```

Run this command only if the script is configured to create the required index.

### 5. Start the Backend

Use the FastAPI application module configured in your project.

For example, if the application instance is defined in `main.py`:

```bash
uvicorn main:app --reload
```

The backend will start on the local development address displayed in the terminal.

### 6. Set Up the Frontend

Open a separate terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Database

The application uses SQLite for relational data storage and SQLAlchemy for database operations.

The database models support:

- Users
- Chat sessions
- Messages

The exact database file location depends on the application's configuration.

## HR Policy Documents

The application uses PDF documents as its HR policy knowledge source. The retrieved policy information provides context for generating responses to employee questions.

Sample or dummy HR policy data may be used for development, demonstration, and testing.

## Security

- Store API keys and credentials in environment variables.
- Do not commit `.env` files or other secret configuration files.
- Keep dependencies and packages appropriately managed.
- Only load trusted FAISS pickle index files.
- Avoid storing plain-text passwords; use secure password hashing.

## Future Enhancements

- Support for multiple HR policy documents.
- Improved retrieval accuracy.
- More detailed document-source tracking.
- Additional document formats.
- Enhanced chat-history management.
- Role-based access control.
- Improved response evaluation.

## Author

**Tejasvi Panoli**

AI and Gen AI Engineer Intern
