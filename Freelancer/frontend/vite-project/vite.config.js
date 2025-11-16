import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 👈 alias gốc cho thư mục src
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7051',
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
