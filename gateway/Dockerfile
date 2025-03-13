FROM node:23-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
COPY ../shared/ /app/shared/

RUN cd /app/shared && npm install && npm run build
RUN npm install

EXPOSE 3000

CMD ["node", "--experimental-strip-types", "src/index.ts"]
