# Stage 1: Use a Node.js base image
FROM node:20-alpine

# Define o diretório de trabalho no container
WORKDIR /app

# Copia todos os arquivos do seu projeto para o diretório de trabalho no container.
# O ponto '.' significa "copiar tudo daqui para o diretório de trabalho".
COPY . .

# Altera o diretório de trabalho para a sua subpasta de backend.
WORKDIR /app/elosaude-backend

# Instala as dependências do projeto
RUN npm install

# Expõe a porta que a sua aplicação irá usar.
EXPOSE 3000

# Inicia a sua aplicação Node.js
CMD ["node", "server.js"]
