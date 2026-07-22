import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { Resend } from 'resend';
import { HumanMessage, AIMessage, ToolMessage, AIMessageChunk } from '@langchain/core/messages';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) { }

  async *handleChatStream(message: string, history: { role: string, content: string }[] = []): AsyncGenerator<string, void, unknown> {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: 'gemini-embedding-2',
      apiKey: process.env.GEMINI_API_KEY
    });
    const chatModel = new ChatGoogleGenerativeAI({
      model: 'gemini-3.1-flash-lite',
      temperature: 0.2,
      apiKey: process.env.GEMINI_API_KEY
    });

    // 1. Embed the user message
    const [questionVector] = await embeddings.embedDocuments([message]);
    const vectorString = `[${questionVector.join(',')}]`;

    // 2. Perform semantic search using pgvector
    // <=> is cosine distance.
    const relevantChunks = await this.prisma.$queryRaw<any[]>(
      Prisma.sql`
        SELECT content
        FROM "DocumentChunk"
        ORDER BY embedding <=> ${vectorString}::vector
        LIMIT 5
      `
    );

    // 3. Prepare the context
    const contextText = relevantChunks.map(chunk => chunk.content).join('\n\n---\n\n');

    // 4. Set up the email tool
    const resend = new Resend(process.env.RESEND_API_KEY);
    const sendEmailTool = tool(
      async ({ email, userMessage }) => {
        try {
          // Fallback directly to the verified email address if env variables are cached incorrectly
          const toEmail = process.env.ALLOWED_MAILID_FOR_EMAILS || process.env.ALLOWED_MAILID_FOR_MESSAGES || 'yashtripathifelix@gmail.com';
          if (!toEmail) return "Could not send email. Admin email not configured.";
          
          const response = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: toEmail,
            subject: 'New Message from AI Portfolio Assistant',
            text: `You have received a new message.\n\nFrom: ${email}\nMessage: ${userMessage}`,
          });

          if (response.error) {
            console.error("Resend Error:", response.error);
            return `Failed to send email: ${response.error.message}`;
          }
          
          console.log("Resend Success:", response.data);
          return `Successfully sent the message to Yash!`;
        } catch (error: any) {
          console.error("Tool Execution Error:", error);
          return `Failed to send email: ${error.message}`;
        }
      },
      {
        name: 'send_email_to_yash',
        description: 'Send an email to Yash (the portfolio owner). Use this when the user wants to leave a message, contact, or email Yash. You must ask for their email address and the message content if you do not have it.',
        schema: z.object({
          email: z.string().email().describe('The email address of the person sending the message'),
          userMessage: z.string().describe('The content of the message they want to send'),
        }),
      }
    );

    const tools = [sendEmailTool];

    // 5. Ask GPT with Agent
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `You are a helpful AI assistant representing the owner of this portfolio.
You have been provided with some context documents uploaded by the user. Use them to help answer the question if they are relevant.
If the provided context does not contain the answer or isn't relevant, you should still answer the question using your general knowledge as a normal AI assistant. 

Context:
{context}`],
      new MessagesPlaceholder("chat_history"),
      ["human", "{question}"]
    ]);

    const chatModelWithTools = chatModel.bindTools(tools);
    const chain = prompt.pipe(chatModelWithTools);

    const chatHistory = history.map(h => 
      h.role === 'assistant' ? new AIMessage(h.content) : new HumanMessage(h.content)
    );

    const stream = await chain.stream({
      context: contextText,
      chat_history: chatHistory,
      question: message
    });

    let accumulatedMessage: AIMessageChunk | null = null;
    let isToolCall = false;

    for await (const chunk of stream) {
      if (!accumulatedMessage) {
        accumulatedMessage = chunk;
      } else {
        accumulatedMessage = accumulatedMessage.concat(chunk);
      }

      if (chunk.tool_call_chunks && chunk.tool_call_chunks.length > 0) {
        isToolCall = true;
      } else if (!isToolCall && chunk.content) {
        yield chunk.content.toString();
      }
    }

    // Handle tool calls if any
    if (accumulatedMessage && accumulatedMessage.tool_calls && accumulatedMessage.tool_calls.length > 0) {
      for (const toolCall of accumulatedMessage.tool_calls) {
        if (toolCall.name === 'send_email_to_yash') {
          const result = await sendEmailTool.invoke(toolCall);
          
          const followupPrompt = ChatPromptTemplate.fromMessages([
            ["system", `You are a helpful AI assistant representing the owner of this portfolio.
You have been provided with some context documents uploaded by the user. Use them to help answer the question if they are relevant.
If the provided context does not contain the answer or isn't relevant, you should still answer the question using your general knowledge as a normal AI assistant. 

Context:
{context}`],
            new MessagesPlaceholder("chat_history"),
            ["human", "{question}"],
            accumulatedMessage,
            new ToolMessage({
              tool_call_id: toolCall.id!,
              content: typeof result === 'string' ? result : JSON.stringify(result)
            })
          ]);

          const finalChain = followupPrompt.pipe(chatModel);
          const finalStream = await finalChain.stream({
            context: contextText,
            chat_history: chatHistory,
            question: message
          });
          
          for await (const chunk of finalStream) {
            if (chunk.content) {
              yield chunk.content.toString();
            }
          }
        }
      }
    }
  }
}
