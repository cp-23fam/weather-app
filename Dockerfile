FROM node:25-alpine

WORKDIR /app

COPY . .
EXPOSE 3000

RUN npm install

ENTRYPOINT ["node"]
CMD ["index.js"]