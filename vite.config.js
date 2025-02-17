// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
   base: "./", // Ensures proper relative paths
   build: {
      outDir: "dist",
   },
});
