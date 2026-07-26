# AI Portfolio

> An AI-powered personal portfolio and headless CMS built with **NestJS**, **PostgreSQL**, **LangChain**, and **Google Gemini**. It features a Retrieval-Augmented Generation (RAG) pipeline that enables visitors to interact with an AI assistant capable of answering questions using your uploaded documents.

---

## ✨ Features

- 🤖 AI-powered chatbot using **Google Gemini**
- ✉️ Autonomous AI Agent with Tool Calling (integrates with **Resend** for email delivery)
- 📄 Retrieval-Augmented Generation (RAG) with PDF document indexing
- 🧠 Semantic search using **PostgreSQL + pgvector**
- ⚡ Real-time streaming responses via **Server-Sent Events (SSE)**
- 📂 Headless CMS for managing portfolio content
- 🔐 Google OAuth 2.0 authentication with JWT authorization
- 📊 Analytics for portfolio visits and AI interactions
- 🛡️ Secure backend with validation, Helmet, and CORS
- 🚀 Modern SSR frontend built with TanStack Start

---

# 🛠️ Tech Stack

**Backend**

- NestJS
- PostgreSQL
- Prisma ORM
- pgvector
- LangChain
- Google Gemini
- Passport.js
- Google OAuth 2.0
- JWT
- Server-Sent Events (SSE)
- Resend

**Frontend**

- TanStack Start
- React 19
- TanStack Router
- Tailwind CSS v4
- shadcn/ui

---

# 🧠 AI Pipeline

```text
        PDF Upload
             │
             ▼
     Document Parsing
             │
             ▼
      Text Chunking
             │
             ▼
 Generate Vector Embeddings
             │
             ▼
 Store in PostgreSQL (pgvector)
             │
             ▼
        User Question
             │
             ▼
   Vector Similarity Search
             │
             ▼
     Relevant Context Found
             │
             ▼
      Google Gemini (LLM)  ◄────────┐
             │                      │
             ├───────────► Tool Call: send_email
             │                      │
             ▼                      │
   Streaming AI Response (SSE) ─────┘
```

# ⚙️ Environment Variables

## Backend (`backend/.env`)

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/ai-portfolio"

# Authentication
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
JWT_SECRET="your_secure_jwt_secret"

# URLs
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3000"

# AI
GEMINI_API_KEY="your_google_gemini_api_key"

# Email
RESEND_API_KEY="your_resend_api_key"
CONTACT_EMAIL="contact@example.com"

# Admin Access
ALLOWED_ADMIN_EMAILS="admin@example.com"
```

## Frontend (`frontend/.env`)

```env
VITE_BACKEND_URL="http://localhost:3000"
```

---

# 🚀 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-portfolio.git

cd ai-portfolio
```

---

## 2. Setup PostgreSQL

Install PostgreSQL and enable the **pgvector** extension.

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## 3. Backend Setup

```bash
cd backend

npm install

npx prisma generate

npx prisma db push

npm run start:dev
```

Backend runs on:

```
http://localhost:3000
```

---

## 4. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🚦 Usage

### 1. Login

Navigate to:

```
http://localhost:5173/login
```

Sign in with a Google account included in:

```env
ALLOWED_ADMIN_EMAILS
```

---

### 2. Upload Documents

From the admin dashboard, upload PDF documents such as:

- Resume
- Portfolio
- Technical documentation
- Certificates

The backend automatically:

- Extracts document text
- Splits content into semantic chunks
- Generates vector embeddings
- Stores embeddings in PostgreSQL

---

### 3. Chat with the AI

Ask questions like:

- Tell me about your experience.
- What technologies do you specialize in?
- Summarize your resume.
- What projects have you worked on?
- What backend technologies do you use?
- Can you send a message to Yash for me?
- Email Yash and tell him I want to hire him.

The AI retrieves relevant document chunks before generating a response, ensuring answers are grounded in your uploaded knowledge base.


## ⭐ If you found this project useful, consider giving it a star!