import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  publicDir: false,
  plugins: [
    react(),
    vue(),
    dts({
      insertTypesEntry: true,
      exclude: ['**/__tests__/**', '**/*.test.ts', '**/*.spec.ts'],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        react: resolve(__dirname, 'src/react.ts'),
        vue: resolve(__dirname, 'src/vue.ts'),
        svelte: resolve(__dirname, 'src/svelte.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom', 'vue'],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        banner: (chunkInfo) => {
          if (chunkInfo.name === 'react') {
            return "'use client';";
          }
          return '';
        },
      },
    },
    sourcemap: true,
    minify: 'esbuild',
  },
});
