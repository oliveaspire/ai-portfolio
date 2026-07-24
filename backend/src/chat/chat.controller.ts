import { Controller, Post, Body, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma.service';
import { ChatDto, RateQueryDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  async chat(
    @Body()
    body: ChatDto,
    @Res() res: Response,
  ) {
    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Save the user's question to the database
      const queryRecord = await this.prisma.aiQuery.create({
        data: { question: body.message },
      });

      // Send the query ID to the frontend first so it knows what to rate
      res.write(`data: ${JSON.stringify({ queryId: queryRecord.id })}\n\n`);

      const stream = this.chatService.handleChatStream(
        body.message,
        body.history,
      );

      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      }

      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (e: any) {
      console.error(e);
      res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
      res.end();
    }
  }

  @Post(':id/rate')
  async rateQuery(@Param('id') id: string, @Body() body: RateQueryDto) {
    const updated = await this.prisma.aiQuery.update({
      where: { id },
      data: { rating: body.rating },
    });
    return { success: true, rating: updated.rating };
  }
}
