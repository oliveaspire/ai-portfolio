const { Resend } = require('resend');
require('dotenv').config();

async function main() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const toEmail = process.env.ALLOWED_MAILID_FOR_EMAILS || process.env.ALLOWED_MAILID_FOR_MESSAGES || process.env.ALLOWED_ADMIN_EMAILS;
  
  console.log("Attempting to send email to:", toEmail);
  
  const response = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: toEmail,
    subject: 'Test Message',
    text: 'This is a test message to see why it fails.',
  });
  
  if (response.error) {
    console.error("Resend Error:", response.error);
  } else {
    console.log("Resend Success:", response.data);
  }
}

main();
