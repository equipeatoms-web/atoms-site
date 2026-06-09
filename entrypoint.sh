#!/bin/sh
# Injeta variáveis de ambiente no bundle em runtime
# O Easypanel passa as env vars para o container nginx — aqui as capturamos e injetamos

INDEX=/usr/share/nginx/html/index.html

# Gera o bloco de config como variável global window.__ENV__
cat > /usr/share/nginx/html/env-config.js << EOF
window.__ENV__ = {
  VITE_SUPABASE_URL: "${VITE_SUPABASE_URL}",
  VITE_SUPABASE_PUBLISHABLE_KEY: "${VITE_SUPABASE_PUBLISHABLE_KEY}",
  VITE_PAPERCLIP_EMBED_URL: "${VITE_PAPERCLIP_EMBED_URL}",
  VITE_PAPERCLIP_EMBED_TOKEN: "${VITE_PAPERCLIP_EMBED_TOKEN}",
  VITE_GOOGLE_TTS_API_KEY: "${VITE_GOOGLE_TTS_API_KEY}"
};
EOF

echo "env-config.js gerado:"
cat /usr/share/nginx/html/env-config.js

nginx -g "daemon off;"
