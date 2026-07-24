import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as fs from 'fs/promises';
const pdf = require('pdf-parse');
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Document } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async saveFilesMetadata(files: Express.Multer.File[]) {
    const documents = [];

    let embeddings: GoogleGenerativeAIEmbeddings | null = null;
    try {
      embeddings = new GoogleGenerativeAIEmbeddings({
        model: 'gemini-embedding-2',
        apiKey: process.env.GEMINI_API_KEY,
      });
    } catch (e) {
      console.warn('OpenAI API key not found. Skipping embedding generation.');
    }

    for (const file of files) {
      // Only process PDFs for now
      if (file.mimetype !== 'application/pdf') {
        console.warn(
          `Skipping ${file.originalname}: Only PDFs are supported right now.`,
        );
        continue;
      }

      const doc = await this.prisma.document.create({
        data: {
          name: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          path: file.path,
        },
      });

      documents.push(doc);

      if (embeddings) {
        // Run indexing in background
        this.indexDocument(doc, file, embeddings).catch((err) =>
          console.error(`Failed to index ${doc.id}:`, err),
        );
      }
    }
    return documents;
  }

  private async indexDocument(
    doc: Document,
    file: Express.Multer.File,
    embeddings: GoogleGenerativeAIEmbeddings,
  ) {
    try {
      // 1. Read and parse PDF
      const dataBuffer = await fs.readFile(file.path);
      const parsedData = await pdf(dataBuffer);
      const text = parsedData.text;

      if (!text || text.trim().length === 0) {
        console.warn(`No text found in PDF ${file.originalname}`);
        return;
      }

      // 2. Split into chunks
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const chunks = await splitter.createDocuments([text]);

      // 3. Generate embeddings and save to DB
      for (const chunk of chunks) {
        const chunkText = chunk.pageContent;
        const [vector] = await embeddings.embedDocuments([chunkText]);

        // Convert array to pgvector string format: '[0.1, 0.2, ...]'
        const vectorString = `[${vector.join(',')}]`;

        await this.prisma.$executeRaw`
          INSERT INTO "DocumentChunk" ("id", "documentId", "content", "embedding", "createdAt")
          VALUES (gen_random_uuid(), ${doc.id}, ${chunkText}, ${vectorString}::vector, NOW())
        `;
      }

      // 4. Mark document as indexed
      await this.prisma.document.update({
        where: { id: doc.id },
        data: { indexed: true },
      });

      console.log(`Document ${doc.originalName} indexed successfully.`);
    } catch (error) {
      console.error(`Error indexing document ${doc.originalName}:`, error);
    }
  }

  async getDocuments() {
    return this.prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteDocument(id: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    try {
      await fs.access(doc.path);
      await fs.unlink(doc.path);
    } catch (e) {
      console.warn(`File not found on disk: ${doc.path}`);
    }

    return this.prisma.document.delete({
      where: { id },
    });
  }
}
