import path from "node:path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import qiankun from "vite-plugin-qiankun";

const useDevMode = process.env.QIANKUN_DEV === "true";

export default defineConfig({
  plugins: [vue(), qiankun("survey-reporting-app", { useDevMode })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  base: "/",
  server: {
    port: 7103,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  preview: {
    port: 7103,
  },
});
