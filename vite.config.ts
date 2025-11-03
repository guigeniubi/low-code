import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      "~antd": fileURLToPath(new URL("./node_modules/antd", import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ["@designable/react", "@formily/react", "@formily/antd", "moment"],
  },
});
