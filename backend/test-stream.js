const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { tool } = require('@langchain/core/tools');
const { z } = require('zod');
require('dotenv').config();

async function main() {
  const chatModel = new ChatGoogleGenerativeAI({
    model: 'gemini-3.1-flash-lite',
    temperature: 0.2,
    apiKey: process.env.GEMINI_API_KEY
  });

  const myTool = tool(
    async ({ input }) => `Tool executed with ${input}`,
    {
      name: 'my_tool',
      description: 'A test tool',
      schema: z.object({ input: z.string() })
    }
  );

  const modelWithTools = chatModel.bindTools([myTool]);

  console.log("Testing text generation stream...");
  const stream1 = await modelWithTools.stream("Write a 10 word poem about dogs.");
  for await (const chunk of stream1) {
    process.stdout.write(chunk.content);
  }
  console.log("\n---");

  console.log("Testing tool call stream...");
  const stream2 = await modelWithTools.stream("Use my_tool with input 'hello'.");
  for await (const chunk of stream2) {
    if (chunk.tool_call_chunks && chunk.tool_call_chunks.length > 0) {
      console.log("Tool call chunk:", JSON.stringify(chunk.tool_call_chunks));
    }
  }
}

main();
