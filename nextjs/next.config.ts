import type { NextConfig } from "next";

/**
 * Next.js 15 Production Configuration - White Cross Healthcare Platform
 *
 * Enterprise-grade configuration optimized for:
 * - HIPAA compliance and healthcare data security
 * - Performance and bundle optimization
 * - Developer experience
 * - Production deployment (Docker/Kubernetes)
 *
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 * @version 1.0.0
 * @since 2025-10-26
 */

// Environment variable validation
const requiredEnvVars = [
  'NEXT_PUBLIC_API_BASE_URL',
] as const;

const optionalEnvVars = [
  'NEXT_PUBLIC_SENTRY_DSN',
  'NEXT_PUBLIC_DATADOG_CLIENT_TOKEN',
  'NEXT_PUBLIC_DATADOG_APPLICATION_ID',
  'ANALYZE',
] as const;

// Validate required environment variables
if (process.env.NODE_ENV === 'production') {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  });
}

// Log environment configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('📦 Next.js Configuration:');
  console.log('  - API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001');
  console.log('  - Sentry:', process.env.NEXT_PUBLIC_SENTRY_DSN ? '✓ Configured' : '✗ Not configured');
  console.log('  - DataDog:', process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN ? '✓ Configured' : '✗ Not configured');
  console.log('  - Bundle Analysis:', process.env.ANALYZE === 'true' ? '✓ Enabled' : '✗ Disabled');
}

const nextConfig: NextConfig = {
  // ==========================================
  // CORE SETTINGS
  // ==========================================

  // Enable React strict mode for better development warnings
  reactStrictMode: true,

  // Output standalone for Docker/container deployment
  output: 'standalone',

  // Disable powered-by header for security
  poweredByHeader: false,

  // Enable gzip compression
  compress: true,

  // Typed routes for better type safety (moved from experimental in Next.js 16)
  typedRoutes: true,

  // ==========================================
  // EXPERIMENTAL FEATURES
  // ==========================================
  experimental: {
    // Server Actions configuration
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: [
        'localhost:3000',
        'localhost:3001',
        ...(process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(',') || []),
      ],
    },

    // Optimize package imports for better tree-shaking
    optimizePackageImports: [
      'lucide-react',
      '@headlessui/react',
      'recharts',
      'date-fns',
      'lodash',
      '@tanstack/react-query',
      'react-hook-form',
    ],

    // Enable partial pre-rendering (Next.js 15+)
    // ppr: true,

    // Optimize CSS
    optimizeCss: true,
  },

  // ==========================================
  // COMPILER OPTIONS
  // ==========================================
  compiler: {
    // Remove console.log in production (keep error and warn)
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn', 'info'],
          }
        : false,

    // Remove React properties in production for smaller bundle
    reactRemoveProperties: process.env.NODE_ENV === 'production',

    // Remove data-testid attributes in production
    // Disabled for now as it may break some tests
    // removeTestIds: process.env.NODE_ENV === 'production',
  },

  // ==========================================
  // TYPESCRIPT CONFIGURATION
  // ==========================================
  typescript: {
    // Fail build on type errors (strict mode)
    ignoreBuildErrors: false,

    // Use custom tsconfig path
    tsconfigPath: './tsconfig.json',
  },

  // ==========================================
  // IMAGE OPTIMIZATION
  // ==========================================
  images: {
    // Remote patterns for external images (healthcare assets, CDN)
    remotePatterns: [
      // Local backend (development)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3001',
        pathname: '/uploads/**',
      },
      // AWS S3 (production)
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        pathname: '/whitecross/**',
      },
      {
        protocol: 'https',
        hostname: 'whitecross-cdn.s3.amazonaws.com',
      },
      // Add production CDN domains here
    ],

    // Supported image formats (AVIF first for better compression)
    formats: ['image/avif', 'image/webp'],

    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for different layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cache TTL for optimized images (60 seconds)
    minimumCacheTTL: 60,

    // Disable SVG for security (XSS risks)
    dangerouslyAllowSVG: false,

    // Content security policy for images
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // Unoptimized for development speed (remove in production)
    // unoptimized: process.env.NODE_ENV === 'development',
  },

  // ==========================================
  // API ROUTES & REWRITES
  // ==========================================
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

    return [
      // API v1 endpoints
      {
        source: '/api/v1/:path*',
        destination: `${apiBaseUrl}/api/v1/:path*`,
      },
      // GraphQL endpoint
      {
        source: '/graphql',
        destination: `${apiBaseUrl}/graphql`,
      },
      // File uploads
      {
        source: '/uploads/:path*',
        destination: `${apiBaseUrl}/uploads/:path*`,
      },
      // Health check
      {
        source: '/api/backend-health',
        destination: `${apiBaseUrl}/health`,
      },
    ];
  },

  // ==========================================
  // REDIRECTS
  // ==========================================
  async redirects() {
    return [
      // Redirect root to dashboard for authenticated users
      // (handled by middleware, keeping this for non-authenticated)
      // {
      //   source: '/',
      //   destination: '/dashboard',
      //   permanent: false,
      // },
    ];
  },

  // ==========================================
  // SECURITY HEADERS (HIPAA-COMPLIANT)
  // ==========================================
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Prevent clickjacking (deny all framing)
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // XSS Protection (legacy but still useful)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer Policy (strict for privacy)
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy (restrict browser features)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Strict-Transport-Security (HTTPS only in production)
          ...(process.env.NODE_ENV === 'production'
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=31536000; includeSubDomains; preload',
                },
              ]
            : []),
          // Content-Security-Policy (HIPAA requirement)
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://browser-intake-datadoghq.com https://js.sentry-cdn.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' http://localhost:3001 ws://localhost:3001 https://browser-intake-datadoghq.com https://*.ingest.sentry.io",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache Next.js static assets
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // No cache for API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
    ];
  },

  // ==========================================
  // WEBPACK CONFIGURATION
  // ==========================================
  webpack: (config, { isServer, dev }) => {
    // Ignore node_modules for faster builds
    config.watchOptions = {
      ...config.watchOptions,
      ignored: /node_modules/,
    };

    // Bundle analyzer (enable with ANALYZE=true)
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer ? '../analyze/server.html' : './analyze/client.html',
          openAnalyzer: !process.env.CI,
          generateStatsFile: true,
          statsFilename: isServer ? '../analyze/server-stats.json' : './analyze/client-stats.json',
        })
      );
    }

    // Optimize production builds
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunks
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // React/Redux chunk
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|@reduxjs|react-redux)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 30,
            },
            // Data fetching libraries
            dataFetching: {
              test: /[\\/]node_modules[\\/](@tanstack|@apollo|axios)[\\/]/,
              name: 'data-fetching',
              chunks: 'all',
              priority: 28,
            },
            // UI libraries chunk
            ui: {
              test: /[\\/]node_modules[\\/](@headlessui|lucide-react)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 25,
            },
            // Charts and visualization
            charts: {
              test: /[\\/]node_modules[\\/](recharts|d3)[\\/]/,
              name: 'charts',
              chunks: 'async',
              priority: 24,
            },
            // Form libraries
            forms: {
              test: /[\\/]node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/,
              name: 'forms',
              chunks: 'all',
              priority: 23,
            },
          },
        },
      };
    }

    // Custom module resolution for healthcare-specific libraries
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        // Add custom aliases here if needed
      },
    };

    return config;
  },

  // ==========================================
  // ENVIRONMENT VARIABLES
  // ==========================================
  env: {
    // Custom env vars accessible via process.env
    APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    BUILD_TIME: new Date().toISOString(),
  },

  // ==========================================
  // INTERNATIONALIZATION (i18n)
  // ==========================================
  // Uncomment and configure when i18n is needed
  // i18n: {
  //   locales: ['en-US', 'es-ES', 'fr-FR'],
  //   defaultLocale: 'en-US',
  //   localeDetection: true,
  // },

  // ==========================================
  // LOGGING
  // ==========================================
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },

  // ==========================================
  // DEV INDICATORS
  // ==========================================
  devIndicators: {
    position: 'bottom-right',
  },

  // ==========================================
  // PAGE EXTENSIONS
  // ==========================================
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'mdx'],

  // ==========================================
  // PRODUCTION SOURCE MAPS
  // ==========================================
  productionBrowserSourceMaps: process.env.NEXT_PUBLIC_SOURCE_MAPS === 'true',

  // ==========================================
  // TURBOPACK (Next.js 16 default)
  // ==========================================
  turbopack: {
    // Set the workspace root to silence lockfile warnings
    root: process.cwd().replace(/[\\/]nextjs$/, ''),
  },

  // ==========================================
  // REDIRECTS FOR TRAILING SLASHES
  // ==========================================
  trailingSlash: false,

  // ==========================================
  // DISABLE X-POWERED-BY HEADER
  // ==========================================
  // poweredByHeader: false, // Already set above

  // ==========================================
  // GENERATE BUILD ID
  // ==========================================
  generateBuildId: async () => {
    // Use git commit hash in production, timestamp in development
    if (process.env.VERCEL_GIT_COMMIT_SHA) {
      return process.env.VERCEL_GIT_COMMIT_SHA;
    }
    if (process.env.CI_COMMIT_SHA) {
      return process.env.CI_COMMIT_SHA;
    }
    return `build-${Date.now()}`;
  },
};

export default nextConfig;

