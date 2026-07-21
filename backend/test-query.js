const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
require('dotenv').config();

const prisma = new PrismaClient({});

async function main() {
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: 'gemini-embedding-2',
      apiKey: process.env.GEMINI_API_KEY
    });
    console.log("Generating embeddings...");
    const vectors = await embeddings.embedDocuments(["I want to leave a message for Yash"]);
    const questionVector = vectors[0];
    console.log("Vector length:", questionVector?.length);
    if (!questionVector) {
      console.error("No question vector returned!");
      return;
    }
    
    const vectorString = `[${questionVector.join(',')}]`;
    
    console.log("Running query...");
    const relevantChunks = await prisma.$queryRaw`
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
    await prisma.$disconnect();
  }
}

main();
