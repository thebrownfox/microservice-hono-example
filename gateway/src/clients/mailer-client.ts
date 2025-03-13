import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { getProtoPath } from "shared";

// TODO: We might want to generate the server and client code from the proto file
interface EmailRequest {
  to: string;
  subject: string;
  template_name: string;
  template_data?: Record<string, string>;
}

interface EmailResponse {
  success: boolean;
  message: string;
  message_id?: string;
}

export class MailerClient {
  private client: any;

  constructor(serviceUrl: string) {
    // Load proto file from shared package
    const protoPath = getProtoPath("mailer.proto");
    const packageDefinition = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });

    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
    const mailerService = protoDescriptor.mailer.MailerService;

    // Create gRPC client
    this.client = new mailerService(
      serviceUrl,
      grpc.credentials.createInsecure()
    );
  }

  public async sendEmail(request: EmailRequest): Promise<EmailResponse> {
    return new Promise((resolve, reject) => {
      this.client.sendEmail(request, (error: Error, response: EmailResponse) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
}
