# Stage 1: Build the application
# Usa uma imagem Node.js para instalar as dependências e construir o projeto.
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de configuração do Node.js
# para que o Docker possa usar o cache.
COPY package*.json ./

# Instala todas as dependências do projeto. O 'ci' garante uma instalação limpa.
RUN npm ci

# Copia todos os outros arquivos do projeto para o container.
COPY . .

# Roda o script de 'build' do seu projeto.
# Este comando gera os arquivos estáticos (HTML, CSS, JS) para o seu site.
RUN npm run build

# Stage 2: Serve the static files
# Usa uma imagem Nginx super leve para servir os arquivos estáticos.
FROM nginx:alpine

# Copia os arquivos gerados na etapa de 'builder' para a pasta pública do Nginx.
# CRÍTICO: Se a pasta de saída do seu 'build' não for 'dist',
# você DEVE alterar o caminho '/app/dist' para o caminho correto.
COPY --from=builder /app/dist /usr/share/nginx/html

# A porta 80 é a porta padrão para o tráfego da web HTTP.
EXPOSE 80

# Este comando inicia o servidor Nginx em primeiro plano.
CMD ["nginx", "-g", "daemon off;"]
