import { z } from 'zod';

// Email validation schema
export const sendEmailSchema = z.object({
  to: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(100, 'Subject is too long'),
  templateName: z.string().min(1, 'Template name is required'),
  templateData: z.record(z.string(), z.string()).optional()
});

export type SendEmailRequest = z.infer<typeof sendEmailSchema>;
