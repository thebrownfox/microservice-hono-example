import type { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { MailerClient } from './clients/mailer-client.ts';
import { sendEmailSchema } from './validators/mail.ts';

export function registerRoutes(app: Hono) {
  // Initialize clients
  const mailerClient = new MailerClient(process.env.MAILER_SERVICE_URL || 'localhost:50051');

  // Health check
  app.get('/health', (c) => c.json({ status: 'ok' }));

  // Email API endpoint
  app.post('/api/v1/mail', zValidator('json', sendEmailSchema), async (c) => {
    try {
      const { to, subject, templateName, templateData } = await c.req.valid('json');

      // Call mailer service via gRPC
      const response = await mailerClient.sendEmail({
        to,
        subject,
        template_name: templateName,
        template_data: templateData
      });

      return c.json({
        success: response.success,
        message: response.message,
        messageId: response.message_id
      });
    } catch (error) {
      console.error(`Error sending email: ${error}`);

      if (error.code === 3) { // INVALID_ARGUMENT in gRPC
        return c.json({
          success: false,
          error: error.details || 'Invalid request parameters'
        }, 400);
      }

      return c.json({
        success: false,
        error: 'Failed to send email'
      }, 500);
    }
  });
}
