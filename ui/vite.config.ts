import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), nodePolyfills(), wasm(), topLevelAwait()],
  build: {
    commonjsOptions: {
      ignoreTryCatch: false,
    },
  },
});
