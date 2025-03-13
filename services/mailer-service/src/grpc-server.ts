import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import type { EmailService } from "./email-service.ts";
import { getProtoPath } from "shared";

// TODO: We might want to generate the server and client code from the proto file
export interface SendEmailRequest {
  to: string;
  subject: string;
  template_name: string;
  template_data: Record<string, string>;
}

export class GrpcServer {
  private server: grpc.Server;
  private emailService: EmailService;
  private port: number;

  constructor(emailService: EmailService, port: number) {
    this.emailService = emailService;
    this.port = port;
    this.server = new grpc.Server();
  }

  public async start(): Promise<void> {
    const protoPath = getProtoPath("mailer.proto");
    const packageDefinition = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
    const mailerService = protoDescriptor.mailer.MailerService;

    // Implement service methods
    this.server.addService(mailerService.service, {
      sendEmail: this.sendEmail.bind(this),
    });

    // Start gRPC server
    return new Promise((resolve, reject) => {
      this.server.bindAsync(
        `0.0.0.0:${this.port}`,
        grpc.ServerCredentials.createInsecure(),
        // TODO: 
        (err: Error | null, port: number) => {
          if (err) {
            reject(err);
            return;
          }
          console.log(`gRPC server started on port ${port}`);
          resolve();
        },
      );
    });
  }

  private async sendEmail(
    call: grpc.ServerUnaryCall<SendEmailRequest, any>,
    callback: grpc.sendUnaryData<any>,
  ): Promise<void> {
    try {
      const { to, subject, template_name, template_data } = call.request;

      // Validate required fields
      if (!to || !subject || !template_name) {
        callback(
          {
            code: grpc.status.INVALID_ARGUMENT,
            message: "Missing required fields (to, subject, template_name)",
          },
          null,
        );
        return;
      }

      // Send email
      const result = await this.emailService.sendEmail(
        to,
        subject,
        template_name,
        template_data || {},
      );

      callback(null, {
        success: true,
        message: "Email sent successfully",
        message_id: result.messageId,
      });
    } catch (error) {
      console.error(`gRPC sendEmail error: ${error}`);
      callback(
        {
          code: grpc.status.INTERNAL,
          message: `Failed to send email: ${error}`,
        },
        null,
      );
    }
  }

  public stop(): void {
    this.server.forceShutdown();
    console.log("gRPC server stopped");
  }
}
