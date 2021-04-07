FROM node:lts-alpine

RUN apk add --no-cache mysql-client

WORKDIR /app/backend

EXPOSE 8080

ADD . /app

CMD ["node", "dist/main.js"]