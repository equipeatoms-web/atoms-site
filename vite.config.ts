import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  // Load env from .env file AND from process.env (Easypanel injects as process.env)
  const fileEnv = loadEnv(mode, process.cwd(), '');
  const env = {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || fileEnv.VITE_SUPABASE_URL || '',
    VITE_SUPABASE_PUBLISHABLE_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY || fileEnv.VITE_SUPABASE_PUBLISHABLE_KEY || '',
    VITE_PAPERCLIP_EMBED_URL: process.env.VITE_PAPERCLIP_EMBED_URL || fileEnv.VITE_PAPERCLIP_EMBED_URL || '',
    VITE_PAPERCLIP_EMBED_TOKEN: process.env.VITE_PAPERCLIP_EMBED_TOKEN || fileEnv.VITE_PAPERCLIP_EMBED_TOKEN || '',
    VITE_GOOGLE_TTS_API_KEY: process.env.VITE_GOOGLE_TTS_API_KEY || fileEnv.VITE_GOOGLE_TTS_API_KEY || '',
  };

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(env.VITE_SUPABASE_PUBLISHABLE_KEY),
      'import.meta.env.VITE_PAPERCLIP_EMBED_URL': JSON.stringify(env.VITE_PAPERCLIP_EMBED_URL),
      'import.meta.env.VITE_PAPERCLIP_EMBED_TOKEN': JSON.stringify(env.VITE_PAPERCLIP_EMBED_TOKEN),
      'import.meta.env.VITE_GOOGLE_TTS_API_KEY': JSON.stringify(env.VITE_GOOGLE_TTS_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: "es2020",
      cssCodeSplit: true,
      chunkSizeWarningLimit: 2500,
      minify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "motion-vendor": ["framer-motion"],
            "gsap-vendor": ["gsap", "@gsap/react", "lenis"],
            "spline": ["@splinetool/react-spline", "@splinetool/runtime"],
            "ui-radix": [
              "@radix-ui/react-accordion",
              "@radix-ui/react-alert-dialog",
              "@radix-ui/react-dialog",
              "@radix-ui/react-dropdown-menu",
              "@radix-ui/react-popover",
              "@radix-ui/react-select",
              "@radix-ui/react-tabs",
              "@radix-ui/react-toast",
              "@radix-ui/react-tooltip",
            ],
            "supabase": ["@supabase/supabase-js", "@tanstack/react-query"],
            "form": ["react-hook-form", "@hookform/resolvers", "zod"],
            "icons": ["lucide-react"],
            "charts": ["recharts"],
          },
        },
      },
    },
  };
});
