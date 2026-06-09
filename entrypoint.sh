#!/bin/sh
cat > /usr/share/nginx/html/env-config.js << EOF
window.__ENV__ = {
  VITE_SUPABASE_URL: "${VITE_SUPABASE_URL:-https://nnrvccynuegsuzfjrkzo.supabase.co}",
  VITE_SUPABASE_PUBLISHABLE_KEY: "${VITE_SUPABASE_PUBLISHABLE_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ucnZjY3ludWVnc3V6Zmpya3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4OTQwMDUsImV4cCI6MjA5NjQ3MDAwNX0.AdS6kF4qmMlkMA0rImSnLN7VP7UL7Hu8tAtG_tE9FT0}",
  VITE_PAPERCLIP_EMBED_URL: "${VITE_PAPERCLIP_EMBED_URL:-https://basededados-paperclip.g653zr.easypanel.host}",
  VITE_PAPERCLIP_EMBED_TOKEN: "${VITE_PAPERCLIP_EMBED_TOKEN:-pk-paperclip-embed-2025-TOKEN-DY5G2Z1NF1}",
  VITE_GOOGLE_TTS_API_KEY: "${VITE_GOOGLE_TTS_API_KEY:-AIzaSyD-y-l098CeeXxbXws_Kf-QsgeHYjzTbxU}"
};
EOF
nginx -g "daemon off;"
