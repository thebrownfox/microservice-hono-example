import path from 'node:path';
import { loadConfig } from './config.ts';
import { EmailService } from './email-service.ts';
import { GrpcServer } from './grpc-server.ts';

async function main() {
  try {
    console.log('Starting mailer service...');

    // Load configuration
    const configPath = path.join(process.cwd(), 'config.ini');
    const config = loadConfig(configPath);

    // Initialize email service
    const emailService = new EmailService(config.smtp);

    // Verify SMTP connection
    await emailService.verifyConnection();

    // Start gRPC server
    const grpcServer = new GrpcServer(emailService, config.server.port);
    await grpcServer.start();

    // Handle graceful shutdown
    const shutdown = () => {
      console.log('Shutting down mailer service...');
      grpcServer.stop();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error(`Failed to start mailer service: ${error}`);
    process.exit(1);
  }
}

main();
