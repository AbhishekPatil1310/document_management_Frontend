import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          router: ["react-router-dom"],
          query: ["@tanstack/react-query"],
          redux: ["@reduxjs/toolkit", "react-redux"]
        }
      }
    }
  }
});
