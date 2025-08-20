# Stage 1: Build and run the Node.js application
# Usa uma imagem Node.js para construir e executar a aplicação.
FROM node:20-alpine

# Define o diretório de trabalho principal dentro do container
WORKDIR /app

# Copia todo o conteúdo do seu projeto (incluindo a raiz) para o container.
# Isso garante que 'index.html', 'vagas.json' e outros arquivos
# sejam copiados corretamente.
COPY . .

# Altera o diretório de trabalho para a sua subpasta 'elosaude-backend',
# onde o arquivo 'package.json' e o 'server.js' estão.
WORKDIR /app/elosaude-backend

# Instala todas as dependências do projeto. 
# Usa 'npm install' para ser mais resiliente.
RUN npm install

# Expõe a porta que a sua aplicação irá usar.
EXPOSE 3000

# Este comando inicia a sua aplicação Node.js.
# Altere 'server.js' se o seu arquivo de entrada tiver outro nome.
CMD ["node", "server.js"]
