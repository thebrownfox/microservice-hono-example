FROM node:23-alpine

WORKDIR /app

COPY services/mailer-service/package.json ./
COPY tsconfig.json ./
COPY services/mailer-service/config.ini ./
COPY services/mailer-service/templates/ ./templates/
COPY services/mailer-service/src/ ./src/
COPY shared/ ./shared/

# Install dependencies in the shared package first
# RUN cd ./shared && npm install && cd ..
# Install mailer service dependencies and link shared package
RUN npm install && npm link ./shared

EXPOSE 50051

CMD ["node", "--experimental-strip-types", "src/index.ts"]
