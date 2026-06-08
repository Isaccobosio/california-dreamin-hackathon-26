import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { defineMocks } from "@ice/core/mock-node";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  define: {
    "process.env": {},
    ...defineMocks(resolve(__dirname, "./.icerc.json")),
  },
  plugins: [
    react(),
    federation({
      name: "todo-list",
      filename: "remoteEntry.js",
      exposes: {
        "./remote-config": "./src/remote-config",
      },
    }),
  ],
  server: {
    cors: true,
    port: 3000,
  },
  preview: {
    cors: true,
  },
});