FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Cloud Run seta PORT automáticamente, Express ya lo lee.
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
