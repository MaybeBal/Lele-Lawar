import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cerita: resolve(__dirname, 'cerita.html'),
        lokasi: resolve(__dirname, 'lokasi.html'),
        menu: resolve(__dirname, 'menu.html'),
      },
    },
  },
});
