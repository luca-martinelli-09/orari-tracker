FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY client/package*.json ./client/
RUN cd client && npm install

COPY . .

RUN cd client && npm run build

EXPOSE 5000

CMD ["npm", "start"]