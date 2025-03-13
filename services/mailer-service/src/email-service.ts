import nodemailer from 'nodemailer';
import pug from 'pug';
import fs from 'node:fs';
import path from 'node:path';
import type { SmtpConfig } from './config.ts';

export class EmailService {
  private transporter: nodemailer.Transporter;
  private templatesDir: string;
  private fromEmail: string;

  constructor(config: SmtpConfig) {
    // Create SMTP transport
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass
      }
    });

    this.fromEmail = config.from;
    this.templatesDir = path.join(process.cwd(), 'templates');
  }

  /**
   * Send email using template
   */
  public async sendEmail(to: string, subject: string, templateName: string, data: Record<string, string>): Promise<any> {
    try {
      // Load template file
      const templatePath = path.join(this.templatesDir, `${templateName}.pug`);

      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template "${templateName}" not found`);
      }

      // Compile template with Pug
      const compiledTemplate = pug.compileFile(templatePath);
      const html = compiledTemplate({
        subject,
        ...data
      });

      // Send email
      const info = await this.transporter.sendMail({
        from: this.fromEmail,
        to,
        subject,
        html
      });

      console.log(`Email sent to ${to}: ${info.messageId}`);
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error(`Error sending email: ${error}`);
      throw error;
    }
  }

  /**
   * Verify SMTP connection
   */
  public async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error(`SMTP connection verification failed: ${error}`);
      return false;
    }
  }
}
