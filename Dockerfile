# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Build args — configure no Easypanel em: Service > Build > Build Arguments
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_PAPERCLIP_EMBED_URL
ARG VITE_PAPERCLIP_EMBED_TOKEN
ARG VITE_GOOGLE_TTS_API_KEY

RUN echo "VITE_SUPABASE_URL=${VITE_SUPABASE_URL}" > .env && \
    echo "VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}" >> .env && \
    echo "VITE_PAPERCLIP_EMBED_URL=${VITE_PAPERCLIP_EMBED_URL}" >> .env && \
    echo "VITE_PAPERCLIP_EMBED_TOKEN=${VITE_PAPERCLIP_EMBED_TOKEN}" >> .env && \
    echo "VITE_GOOGLE_TTS_API_KEY=${VITE_GOOGLE_TTS_API_KEY}" >> .env

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
