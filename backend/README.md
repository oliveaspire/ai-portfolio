# 🏗️ Backend & AI Setup Guide

Welcome to the **Backend and AI setup** documentation for the AI Portfolio project. This document provides a deep dive into the architectural decisions, tools used, alternatives considered, and the detailed breakdown of the Retrieval-Augmented Generation (RAG) pipeline and Tool Calling setup.

---

## 🎯 Overview

The goal of this backend is to serve as both a headless CMS for your portfolio and a robust AI gateway. Visitors can chat with an AI assistant that actually *knows* about your experience, resume, and projects by retrieving relevant data from uploaded documents before answering (RAG). Furthermore, the AI is empowered with tool-calling capabilities to take actions like sending an email directly to you.

---

## 🛠️ Technology Choices: Why We Chose Them & Alternatives

### 1. **NestJS** (Framework)
**Why we chose it:** NestJS provides an out-of-the-box architectural structure built around Angular-like concepts (Modules, Controllers, Providers). It enforces dependency injection and strongly typed TypeScript code, making it highly maintainable and scalable as your portfolio grows.
**Alternatives considered:**
- **Express.js:** Too barebones. Requires setting up your own architecture, routing logic, and error handling which can lead to messy code in larger projects.
- **Fastify:** Great for performance, but lacks the structured ecosystem and opinionated architecture that NestJS provides.

### 2. **PostgreSQL** (Database)
**Why we chose it:** PostgreSQL is a powerful, open-source object-relational database. Crucially, it supports the `pgvector` extension, which allows us to store our document embeddings (vectors) directly alongside our relational data (users, documents). 
**Alternatives considered:**
- **MongoDB:** A NoSQL database that is great for unstructured data, but lacks native robust vector search (without relying on MongoDB Atlas Vector Search, which adds vendor lock-in).
- **MySQL:** Excellent relational DB but lacks a mature native vector extension equivalent to `pgvector`.

### 3. **Prisma** (ORM)
**Why we chose it:** Prisma is a next-generation ORM that offers unparalleled type safety. Its schema file makes defining database models intuitive, and auto-generated TypeScript types prevent runtime errors. It also natively supports raw SQL queries, which is vital for `pgvector` operations.
**Alternatives considered:**
- **TypeORM / Sequelize:** Prone to typing issues and requires maintaining class-based models that can get out of sync with the database schema.

### 4. **pgvector** (Vector Database)
**Why we chose it:** Instead of spinning up a separate vector database just for AI, `pgvector` allows us to store vectors (arrays of floats representing text semantic meaning) directly in Postgres. We can query closest vectors using Cosine Distance (`<=>`) in raw SQL. It reduces infrastructure complexity and costs.
**Alternatives considered:**
- **Pinecone / Weaviate / Milvus:** Highly scalable dedicated vector databases, but they introduce another moving part, network latency, and potential pricing tiers, which is overkill for a personal portfolio.

### 5. **Google Gemini** (LLM & Embeddings)
**Why we chose it:** Google Gemini (`gemini-3.1-flash-lite` and `gemini-embedding-2`) offers lightning-fast inference, huge context windows, and highly capable reasoning. It is extremely cost-effective (generous free tiers) while remaining competitive with GPT-4 in tool calling and instruction following.
**Alternatives considered:**
- **OpenAI (GPT-4o / text-embedding-3):** The industry standard, but can get expensive over time and offers less free credits for side projects.
- **Anthropic Claude 3:** Great for reasoning, but Gemini provides a more unified ecosystem for embedding + generation + tools at a better price point.

---

## 🧠 The AI Pipeline Explained

Our AI implementation relies heavily on **Retrieval-Augmented Generation (RAG)** combined with **Tool Calling**. We use **LangChain** (`@langchain/google-genai`, `@langchain/core`) to orchestrate this seamlessly.

### Phase 1: Ingestion (When you upload a document)
1. **Parsing:** When a PDF is uploaded via the Admin CMS, we extract the raw text using `pdf-parse`.
2. **Chunking:** We use LangChain's text splitters to break the document into smaller, semantically meaningful chunks (e.g., 1000 characters each). This is crucial because LLMs have context limits, and we only want to fetch the *most relevant* pieces.
3. **Embedding:** We pass these text chunks to Gemini's Embedding Model (`gemini-embedding-2`), which returns a dense vector (an array of numbers representing the "meaning" of the text).
4. **Storage:** The text chunk and its vector are saved to the `DocumentChunk` table in PostgreSQL using `pgvector`.

### Phase 2: Retrieval & Chat (When a visitor asks a question)
1. **User Query:** The visitor asks, *"What is Yash's experience?"*
2. **Query Embedding:** We convert the visitor's question into a vector using the exact same Gemini embedding model.
3. **Similarity Search:** We execute a raw SQL query against PostgreSQL using `pgvector`'s Cosine Distance operator (`<=>`). It finds the top 5 chunks of text whose vectors are mathematically closest to the question's vector.
4. **Context Injection:** We append these top 5 text chunks to the LLM's system prompt as `Context: {context}`.
5. **Streaming LLM Response:** We stream the response back to the frontend in real-time via **Server-Sent Events (SSE)**, providing a typing-like experience without waiting for the full response to generate.

---

## 🛠️ Tool Calling (Agentic AI)

RAG allows the AI to answer questions, but **Tool Calling** gives the AI "hands" to take actions.

We bound specific tools to our Gemini LLM (`chatModel.bindTools([tools])`). Currently, the AI has access to a **Send Email Tool**.

**How it works:**
1. If the user says, *"I want to hire Yash, here is my email test@example.com"*, the LLM realizes it needs to trigger the email tool.
2. The LLM pauses its text generation and outputs a JSON schema requesting to use `send_email_to_yash` with the arguments: `email` and `userMessage`.
3. Our NestJS backend intercepts this tool call in the loop.
4. We execute the internal logic: utilizing **Resend** (email API) to dispatch an email to the admin/portfolio owner with the visitor's message.
5. The result of the email dispatch ("Success" or "Error") is fed *back* into the LLM as a `ToolMessage`.
6. The LLM reads the result and finally responds to the user: *"I've successfully sent your message to Yash! He will reach out to you at test@example.com soon."*

This architecture ensures the chatbot isn't just a static Q&A bot, but a proactive agent capable of driving engagement.
