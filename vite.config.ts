import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], base: './', server: {host:'127.0.0.1',watch:{ignored:['**/.toolchains/**','**/test-results/**']}, proxy: {'/api': 'http://127.0.0.1:4318'}}, build: {target:'es2022',rollupOptions:{output:{manualChunks(id){if(id.includes('node_modules/@codemirror')||id.includes('node_modules/@lezer')||id.includes('node_modules/style-mod'))return 'editor';}}}} });
