import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: parseInt(env.VITE_PORT || "8081"),
      hmr: {
        overlay: false,
      },
      proxy: {
        "/api": {
          target: env.VITE_PROXY_TARGET || "http://142.93.167.9:8010",
          changeOrigin: true,
          secure: false,
        },
      },
    },

    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
