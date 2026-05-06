import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": `${process.cwd()}/src/`,
    },
  },
  server: {
    port: 7000, // default: 3000
    browser: true, // default: false
    open: true, // default: false
  },
});
