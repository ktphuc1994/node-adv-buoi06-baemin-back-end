FROM node:20-alpine

WORKDIR /app

COPY package*.json .
COPY yarn*.lock .

RUN yarn install --frozen-lockfile

COPY ./src/prisma ./src/prisma
RUN yarn prisma generate --schema=./src/prisma/schema.prisma

COPY . .
RUN yarn run build
EXPOSE 8080
CMD [ "yarn", "run", "start:prod" ]

# docker build . -t baemin-backend-nestjs-img
# docker run -d -p 8080:8080 --name baemin-backend-nestjs-container --network node_network baemin-backend-nestjs-img