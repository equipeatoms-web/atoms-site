FROM node:20-alpine AS builder
WORKDIR /app

# Bust cache em cada deploy
ARG CACHEBUST=1

COPY package*.json ./
RUN npm ci
COPY . .

# Debug: mostra as env vars VITE_ disponíveis
RUN echo "=== VITE ENV VARS ===" && printenv | grep '^VITE_' || echo "NENHUMA VITE_ VAR ENCONTRADA"

# Gera .env a partir das env vars injetadas pelo Easypanel
RUN printenv | grep '^VITE_' > .env; echo "=== .env gerado ===" && cat .env

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
