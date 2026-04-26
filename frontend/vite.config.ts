import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    // Gzip for broad browser support
    compression({ algorithm: 'gzip', exclude: [/\.(png|jpg|jpeg|webp|avif|gif|svg)$/] }),
    // Brotli for modern browsers (smaller than gzip)
    compression({ algorithm: 'brotliCompress', exclude: [/\.(png|jpg|jpeg|webp|avif|gif|svg)$/] }),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
      // Deduplicate: "motion" is an alias for framer-motion — having both installed doubles the bundle
      'motion': 'framer-motion',
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    outDir: 'dist',
    target: 'esnext',      // Modern JS — smaller output, faster parse
    sourcemap: false,       // Never ship sourcemaps to production
    minify: 'esbuild',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom')) {
              return 'v-react-dom';
            }
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-is/') || id.includes('node_modules/scheduler/')) {
              return 'v-react';
            }
            if (id.includes('react-router')) {
              return 'v-router';
            }
            if (id.includes('framer-motion') || id.includes('motion')) {
              return 'v-motion';
            }
            if (id.includes('lucide-react')) {
              return 'v-lucide';
            }
            if (id.includes('@mui')) {
              return 'v-mui';
            }
            if (id.includes('@radix-ui')) {
              return 'v-radix';
            }
            if (id.includes('@tiptap') || id.includes('prosemirror')) {
              return 'v-editor';
            }
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'v-charts';
            }
            return 'v-vendor';
          }
        }
      }
    }
  }
})

