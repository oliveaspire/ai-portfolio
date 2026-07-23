import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Resend } from 'resend';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('contact')
  async submitContact(@Body() body: { name: string, email: string, message: string }) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const toEmail = process.env.ALLOWED_MAILID_FOR_EMAILS || process.env.ALLOWED_MAILID_FOR_MESSAGES || 'yashtripathifelix@gmail.com';
    
    try {
      const response = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: toEmail,
        subject: `New Contact from ${body.name}`,
        text: `You have received a new contact message.\n\nName: ${body.name}\nEmail: ${body.email}\nMessage: ${body.message}`,
      });

      if (response.error) {
         return { success: false, error: response.error.message };
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
}
