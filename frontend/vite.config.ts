import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import compression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh for better DX
      fastRefresh: true,
      // Optimize JSX runtime
      jsxRuntime: 'automatic',
    }),
    // Gzip compression for production
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Only compress files > 10KB
      deleteOriginFile: false,
    }),
    // Brotli compression for production (better than gzip)
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    // Bundle analyzer - run with ANALYZE=true npm run build
    process.env.ANALYZE === 'true' && visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 5173,
    host: true,
    // Enable CORS for API requests
    cors: true,
    // Warm up frequently used modules
    warmup: {
      clientFiles: [
        './src/App.tsx',
        './src/routes/index.tsx',
        './src/stores/index.ts',
        './src/config/queryClient.ts',
      ],
    },
  },

  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020',

    // Optimize chunk size
    chunkSizeWarningLimit: 500,

    // Source maps for production debugging (optional)
    sourcemap: process.env.SOURCE_MAP === 'true',

    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      format: {
        comments: false, // Remove comments
      },
    },

    // Rollup options for advanced code splitting
    rollupOptions: {
      output: {
        // Manual chunking strategy for optimal code splitting
        manualChunks(id) {
          // Vendor chunks - separate large libraries
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }

            // Redux ecosystem
            if (id.includes('redux') || id.includes('@reduxjs')) {
              return 'vendor-redux';
            }

            // TanStack Query
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }

            // Apollo GraphQL
            if (id.includes('@apollo/client') || id.includes('graphql')) {
              return 'vendor-apollo';
            }

            // Chart libraries (recharts is heavy)
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-charts';
            }

            // PDF generation libraries
            if (id.includes('jspdf') || id.includes('html2pdf')) {
              return 'vendor-pdf';
            }

            // Icon libraries
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }

            // Date libraries
            if (id.includes('date-fns') || id.includes('moment')) {
              return 'vendor-dates';
            }

            // Form libraries
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'vendor-forms';
            }

            // UI component libraries
            if (id.includes('@headlessui')) {
              return 'vendor-ui';
            }

            // Monitoring and error tracking
            if (id.includes('@sentry') || id.includes('web-vitals')) {
              return 'vendor-monitoring';
            }

            // Socket.io
            if (id.includes('socket.io')) {
              return 'vendor-socket';
            }

            // All other vendor code
            return 'vendor-misc';
          }

          // Application code splitting by domain

          // Core application code
          if (id.includes('/src/stores/') || id.includes('/src/config/')) {
            return 'app-core';
          }

          // Authentication and security
          if (id.includes('/src/hooks/utilities/AuthContext') ||
              id.includes('/src/components/auth/')) {
            return 'app-auth';
          }

          // Students domain
          if (id.includes('/src/pages/students/') ||
              id.includes('/src/components/features/students/')) {
            return 'domain-students';
          }

          // Health records domain
          if (id.includes('/src/pages/health/') ||
              id.includes('/src/components/features/health-records/')) {
            return 'domain-health';
          }

          // Medications domain
          if (id.includes('/src/pages/medications/') ||
              id.includes('/src/components/medications/')) {
            return 'domain-medications';
          }

          // Appointments domain
          if (id.includes('/src/pages/appointments/')) {
            return 'domain-appointments';
          }

          // Incidents domain
          if (id.includes('/src/pages/incidents/')) {
            return 'domain-incidents';
          }

          // Communication domain
          if (id.includes('/src/pages/communication/') ||
              id.includes('/src/components/features/communication/')) {
            return 'domain-communication';
          }

          // Admin and settings
          if (id.includes('/src/pages/admin/') ||
              id.includes('/src/pages/settings/') ||
              id.includes('/src/components/features/settings/')) {
            return 'domain-admin';
          }

          // Dashboard and analytics
          if (id.includes('/src/pages/dashboard/') ||
              id.includes('/src/components/features/dashboard/')) {
            return 'domain-dashboard';
          }

          // Reports and analytics
          if (id.includes('/src/pages/reports/') ||
              id.includes('/src/pages/analytics/')) {
            return 'domain-reports';
          }
        },

        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];

          // Organize assets by type
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          if (/\.css$/i.test(assetInfo.name)) {
            return `assets/css/[name]-[hash][extname]`;
          }

          return `assets/[name]-[hash][extname]`;
        },

        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },

    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },

    // CSS code splitting
    cssCodeSplit: true,

    // Report compressed size (disable for faster builds)
    reportCompressedSize: true,

    // Ensure dependencies are properly externalized (if needed)
    // This is useful for libraries that should not be bundled
    // Example: rollupOptions.external: ['react', 'react-dom']
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      '@tanstack/react-query',
      '@apollo/client',
      'axios',
      'date-fns',
      'lucide-react',
      'zod',
      'react-hook-form',
      'clsx',
      'tailwind-merge',
    ],
    exclude: [
      // Exclude heavy optional dependencies
      'jspdf',
      'html2pdf.js',
      'recharts',
    ],
  },

  // Performance hints
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000, // 500KB
    maxAssetSize: 512000, // 500KB
  },
})
