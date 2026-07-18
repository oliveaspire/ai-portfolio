import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) { }

  async handleChat(message: string): Promise<string> {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: 'gemini-embedding-2',
      apiKey: process.env.GEMINI_API_KEY
    });
    const chatModel = new ChatGoogleGenerativeAI({
      model: 'gemini-3.5-flash',
      temperature: 0.2,
      apiKey: process.env.GEMINI_API_KEY
    });

    // 1. Embed the user message
    const [questionVector] = await embeddings.embedDocuments([message]);
    const vectorString = `[${questionVector.join(',')}]`;

    // 2. Perform semantic search using pgvector
    // <=> is cosine distance.
    const relevantChunks = await this.prisma.$queryRaw<any[]>`
      SELECT content
      FROM "DocumentChunk"
      ORDER BY embedding <=> ${vectorString}::vector
      LIMIT 5
    `;

    // 3. Prepare the context
    const contextText = relevantChunks.map(chunk => chunk.content).join('\n\n---\n\n');

    // 4. Ask GPT
    const prompt = PromptTemplate.fromTemplate(`
You are a helpful AI assistant representing the owner of this portfolio.
You have been provided with some context documents uploaded by the user. Use them to help answer the question if they are relevant.
If the provided context does not contain the answer or isn't relevant, you should still answer the question using your general knowledge as a normal AI assistant.

Context:
{context}

Question:
{question}
    `);

    const chain = prompt.pipe(chatModel);

    const response = await chain.invoke({
      context: contextText,
      question: message
    });

    return (response as any).content.toString();
  }
}
