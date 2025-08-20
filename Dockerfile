# Stage 1: Build and run the Node.js application
# Usa uma imagem Node.js para construir e executar a aplicação.
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de configuração do Node.js da subpasta 'elosaude-backend'
# para que o Docker possa usar o cache.
COPY elosaude-backend/package*.json ./

# Instala todas as dependências do projeto. 
# Usa 'npm install' para ser mais resiliente.
RUN npm install

# Copia todos os outros arquivos da subpasta 'elosaude-backend' para o container.
# O ponto '.' final significa que todo o conteúdo da pasta de origem
# (elosaude-backend) será copiado para o diretório de trabalho atual do container (/app).
COPY elosaude-backend/. .

# Expõe a porta que a sua aplicação irá usar.
# A porta 3000 é comum para aplicações Node.js.
EXPOSE 3000

# Este comando inicia a sua aplicação Node.js.
# Altere 'server.js' se o seu arquivo de entrada tiver outro nome.
CMD ["node", "server.js"]
