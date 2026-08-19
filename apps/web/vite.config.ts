import { resolve } from 'path';
import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { getDevToolsAliases } from '@mobile-devtools/vite-config';
import { ssePlugin } from './plugins/sse-plugin';

const plugins: PluginOption[] = [react(), ssePlugin()];

// Optionally skip Cloudflare plugin via NO_CLOUDFLARE environment variable
if (!process.env.NO_CLOUDFLARE) {
  try {
    const { cloudflare } = await import('@cloudflare/vite-plugin');
    plugins.push(cloudflare());
  } catch {
    // Skipped if cloudflare plugin fails to load
  }
}

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      ...getDevToolsAliases(__dirname, '../..'),
    },
  },
  server: {
    port: 3000,
  },
});
