import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: { message: string }) {
    try {
      const response = await this.chatService.handleChat(body.message);
      return { response };
    } catch (e: any) {
      console.error(e);
      return { error: e.message, stack: e.stack };
    }
  }
}
