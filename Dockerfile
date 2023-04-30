FROM node:18-alpine

WORKDIR /app

COPY *.json ./
COPY src/ src/

RUN apk add git
RUN npm install
RUN npm run build

CMD ["npm", "start"]

EXPOSE 3030