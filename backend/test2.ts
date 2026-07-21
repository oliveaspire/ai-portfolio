import { PrismaService } from './src/prisma.service';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

async function main() {
  const prisma = new PrismaService();
  await prisma.onModuleInit();

  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: 'gemini-embedding-2',
      apiKey: process.env.GEMINI_API_KEY
    });
    
    console.log("Generating embeddings...");
    const vectors = await embeddings.embedDocuments(["I want to leave a message for Yash"]);
    const questionVector = vectors[0];
    const vectorString = `[${questionVector.join(',')}]`;
    
    console.log("Running query...");
    const relevantChunks = await prisma.$queryRaw<any[]>`
      SELECT content
      FROM "DocumentChunk"
      ORDER BY embedding <=> ${vectorString}::vector
      LIMIT 5
    `;
    console.log("Query successful, chunks:", relevantChunks.length);
  } catch (error) {
    console.error("Error occurred:");
    console.error(error);
  } finally {
    await prisma.onModuleDestroy();
  }
}

main();
