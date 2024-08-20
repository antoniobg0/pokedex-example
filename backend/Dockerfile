FROM node:20.16-alpine3.20

WORKDIR /app

COPY . .

RUN npm i

RUN npm install ts-node -g

CMD ["npm", "run", "dev"]

EXPOSE 7001