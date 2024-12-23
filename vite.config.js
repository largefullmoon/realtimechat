import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import NodeGlobalsPolyfillPlugin from '@esbuild-plugins/node-globals-polyfill';
import NodeModulesPolyfillPlugin from '@esbuild-plugins/node-modules-polyfill';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  svgr({
    // svgr options: https://react-svgr.com/docs/options/
    svgrOptions: { exportType: "default", ref: true, svgo: false, titleProp: true },
    include: "**/*.svg",
  }),
  ],
  resolve: {
    alias: {
      path: 'path-browserify',
    },
  },
  server: {
    port: 9000, // Change the port to 9000
  },
})
