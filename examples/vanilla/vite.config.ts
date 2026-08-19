import { defineConfig } from 'vite';
import { getDevToolsAliases } from '@mobile-devtools/vite-config';

export default defineConfig({
  resolve: {
    alias: getDevToolsAliases(__dirname, '../..'),
  },
  server: {
    port: 3004,
  },
});
