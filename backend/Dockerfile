FROM node:18-slim

WORKDIR /app

# 1. Copiamos los archivos de dependencias
COPY package*.json ./

# 2. Instalamos las dependencias DENTRO de la imagen
RUN npm install

# 3. Copiamos el resto del código (server.js, views, etc)
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]