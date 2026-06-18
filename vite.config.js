import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the build works on GitHub Pages (served from a sub-path)
// as well as any other static host. No router, so relative asset URLs are safe.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
