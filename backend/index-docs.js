const { Pool } = require('pg');
const fs = require('fs/promises');
const pdf = require('pdf-parse');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function indexFailedDocs() {
  const res = await pool.query('SELECT * FROM "Document"');
  const docs = res.rows;
  console.log(`Found ${docs.length} unindexed docs`);
  
  const embeddings = new GoogleGenerativeAIEmbeddings({ 
    model: 'gemini-embedding-2',
    apiKey: process.env.GEMINI_API_KEY
  });

  for (const doc of docs) {
    try {
      console.log(`Indexing ${doc.path}...`);
      const dataBuffer = await fs.readFile(doc.path);
      const parsedData = await pdf(dataBuffer);
      const text = parsedData.text;

      if (!text || text.trim().length === 0) {
         console.warn(`No text found in PDF ${doc.originalName}`);
         continue;
      }

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const chunks = await splitter.createDocuments([text]);

      for (const chunk of chunks) {
        const chunkText = chunk.pageContent;
        const [vector] = await embeddings.embedDocuments([chunkText]);
        
        const vectorString = `[${vector.join(',')}]`;

        await pool.query(`
          INSERT INTO "DocumentChunk" ("id", "documentId", "content", "embedding", "createdAt")
          VALUES (gen_random_uuid(), $1, $2, $3::vector, NOW())
        `, [doc.id, chunkText, vectorString]);
      }

      await pool.query('UPDATE "Document" SET indexed = true WHERE id = $1', [doc.id]);
      console.log(`Indexed ${doc.originalName} successfully with ${chunks.length} chunks!`);
    } catch (e) {
      console.error(`Failed to index ${doc.originalName}:`, e);
    }
  }
}

indexFailedDocs().catch(console.error).finally(() => pool.end());
