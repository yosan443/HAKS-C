import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

function tauriServer() {
  return {
    name: "tauri-server",
    configureServer(server) {
      server.httpServer?.once("listening", () => {
        const { port } = server.config.server;
        const host = "127.0.0.1";
        const hostConfig = { host: host, port: port, strictPort: true };
        server.config.server = { ...server.config.server, ...hostConfig };
        process.env.TAURI_DEV_HOST = host;
        process.env.TAURI_DEV_PORT = String(port);
      });
    },
  };
}

export default defineConfig(async () => ({
  plugins: [tauriServer(), sveltekit()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: "127.0.0.1",
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
