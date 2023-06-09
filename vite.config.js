import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import svgx from "@svgx/vite-plugin-react";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgx()],

  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, './index.html'),
      },

    },

  },
})

