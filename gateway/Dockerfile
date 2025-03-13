FROM node:23-alpine

WORKDIR /app

COPY gateway/package.json ./
COPY tsconfig.json ./
COPY gateway/src ./src
COPY shared/ ./shared/

# Install dependencies in the shared package first
# RUN cd ./shared && npm install && cd ..
# Install gateway dependencies and link shared package
RUN npm install && npm link ./shared

EXPOSE 3080

CMD ["node", "--experimental-strip-types", "src/index.ts"]
