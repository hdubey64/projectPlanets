import { defineConfig } from "vite";

export default defineConfig({
   base: "./", // Ensures assets are served correctly
   build: {
      outDir: "dist",
   },
   server: {
      host: true, // Allows network access (optional)
   },
});
