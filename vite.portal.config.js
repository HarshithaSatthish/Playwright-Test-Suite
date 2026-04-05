import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.join(root, "portal"),
  publicDir: "public",
  build: {
    outDir: path.join(root, "portal-dist"),
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    open: true,
  },
});
