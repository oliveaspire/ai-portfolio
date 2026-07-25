import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  async sendContactEmail(body: ContactDto) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const toEmail = process.env.ALLOWED_MAILID_FOR_EMAILS || 'yashtripathifelix@gmail.com';

    try {
      const response = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: toEmail,
        subject: `New Contact from ${body.name}`,
        text: `You have received a new contact message.\n\nName: ${body.name}\nEmail: ${body.email}\nMessage: ${body.message}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 40px 20px; border-radius: 8px;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
              <h2 style="color: #111827; margin-top: 0; margin-bottom: 24px; font-size: 24px; border-bottom: 2px solid #4ade80; padding-bottom: 12px;">New Message Received</h2>
              <p style="color: #4b5563; font-size: 16px; margin-bottom: 24px;">Someone reached out via your portfolio contact form:</p>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600; width: 80px;">Name</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 500;">${body.name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;">Email</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 500;"><a href="mailto:${body.email}" style="color: #22c55e; text-decoration: none;">${body.email}</a></td>
                </tr>
              </table>
              
              <h3 style="color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Message</h3>
              <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; border-left: 4px solid #4ade80;">
                <p style="margin: 0; color: #1f2937; font-size: 16px; line-height: 1.5; white-space: pre-wrap;">${body.message}</p>
              </div>
              
              <div style="margin-top: 40px; text-align: center;">
                <a href="mailto:${body.email}" style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 16px;">Reply to ${body.name}</a>
              </div>
            </div>
            
            <p style="margin-top: 24px; text-align: center; color: #9ca3af; font-size: 12px;">
              Sent securely from your AI Portfolio backend.
            </p>
          </div>
        `,
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
