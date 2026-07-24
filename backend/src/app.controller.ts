import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Resend } from 'resend';
import { ContactDto } from './dto/contact.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('contact')
  async submitContact(
    @Body() body: ContactDto,
  ) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const toEmail = process.env.CONTACT_EMAIL || 'contact@example.com';

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
    } catch (e: unknown) {
      if (e instanceof Error) {
        return { success: false, error: e.message };
      }
      return { success: false, error: 'Unknown error occurred' };
    }
  }
}
