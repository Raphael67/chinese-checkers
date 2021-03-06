FROM node:lts-alpine

WORKDIR /app/backend

EXPOSE 8080

ADD . /app

CMD ["node", "dist/main.js"]