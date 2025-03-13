# Hono.js Microservice Example

This project demonstrates a microservice architecture using Hono.js, a lightweight framework for building web applications.

## Project Structure

- `gateway`: API Gateway service that routes requests to appropriate microservices
- `services`: Contains individual microservices
  - `mailer-service`: Handles email sending operations via gRPC
- `shared`: Shared utilities and types used across services

## Getting Started

```bash
# Install dependencies
npm install

# Start all services
npm start

# Development mode
npm run dev
```

## Development Tools

```bash
# Format code with Biome
npm run format

# Lint code with Biome
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

## Endpoints

- Gateway: http://localhost:3000
- Mailer Service: gRPC on port 50051

## Email API

Send emails via the API Gateway:

```bash
curl -X POST http://localhost:3000/api/v1/mail \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "templateName": "default",
    "templateData": {
      "message": "This is a test email from the microservice."
    }
  }'
```
