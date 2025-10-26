import type { NextConfig } from "next";

/**
 * Next.js 15 Configuration - Production Optimized
 *
 * Enterprise-grade configuration for the White Cross Healthcare Platform.
 * Optimized for performance, security, and HIPAA compliance.
 *
 * Key Features:
 * - API proxying to backend (avoiding CORS issues)
 * - Security headers (HIPAA-compliant)
 * - Image optimization with healthcare use cases
 * - Bundle analysis and optimization
 * - TypeScript strict mode
 * - Standalone output for Docker deployment
 *
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */

const nextConfig: NextConfig = {
  // ==========================================
  // CORE SETTINGS
  // ==========================================

  // Enable React strict mode for better development warnings
  reactStrictMode: true,

  // Use SWC minifier (faster than Terser)
  swcMinify: true,

  // Enable experimental features
  experimental: {
    // Typed routes for better type safety
    typedRoutes: true,

    // Server Actions configuration
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000', 'localhost:3001'],
    },

    // Optimize package imports
    optimizePackageImports: [
      'lucide-react',
      '@headlessui/react',
      'recharts',
      'date-fns',
    ],
  },

  // Output standalone for Docker/container deployment
  output: 'standalone',

  // Disable powered-by header for security
  poweredByHeader: false,

  // Enable gzip compression
  compress: true,

  // ==========================================
  // COMPILER OPTIONS
  // ==========================================
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,

    // Enable emotion for styled components (if needed)
    // emotion: true,

    // Remove React properties in production
    reactRemoveProperties: process.env.NODE_ENV === 'production',

    // Remove data-testid in production
    // removeTestIds: process.env.NODE_ENV === 'production',
  },

  // ==========================================
  // TYPESCRIPT CONFIGURATION
  // ==========================================
  typescript: {
    // Fail build on type errors in production
    ignoreBuildErrors: false,

    // Run type checking during production builds
    tsconfigPath: './tsconfig.json',
  },

  // ==========================================
  // ESLINT CONFIGURATION
  // ==========================================
  eslint: {
    // Fail build on ESLint errors in production
    ignoreDuringBuilds: false,

    // Specify directories to lint
    dirs: ['src', 'app', 'components', 'lib', 'pages'],
  },

  // ==========================================
  // IMAGE OPTIMIZATION
  // ==========================================
  images: {
    // Remote patterns for external images
    remotePatterns: [
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
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        pathname: '/whitecross/**',
      },
      {
        protocol: 'https',
        hostname: 'whitecross-cdn.s3.amazonaws.com',
      },
    ],

    // Supported image formats (AVIF first for better compression)
    formats: ['image/avif', 'image/webp'],

    // Image sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for different layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Disable static image imports if not needed
    // disableStaticImages: false,

    // Minimize JPEG quality (for file size)
    minimumCacheTTL: 60,

    // Dangerously allow SVG
    dangerouslyAllowSVG: false,

    // Content security policy for images
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ==========================================
  // API ROUTES & REWRITES
  // ==========================================
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/api/v1/:path*`,
      },
      {
        source: '/graphql',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/graphql`,
      },
      {
        source: '/uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/uploads/:path*`,
      },
    ];
  },

  // ==========================================
  // REDIRECTS
  // ==========================================
  async redirects() {
    return [
      // Redirect old paths if needed
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ];
  },

  // ==========================================
  // SECURITY HEADERS (HIPAA-COMPLIANT)
  // ==========================================
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // XSS Protection (legacy but still useful)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy (restrict features)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Strict-Transport-Security (HTTPS only)
          ...(process.env.NODE_ENV === 'production' ? [{
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          }] : []),
          // Content-Security-Policy (HIPAA requirement)
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' http://localhost:3001 ws://localhost:3001",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        // Cache static assets
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // ==========================================
  // WEBPACK CONFIGURATION
  // ==========================================
  webpack: (config, { isServer, dev }) => {
    // Custom webpack config if needed

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
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
          openAnalyzer: false,
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
            // UI libraries chunk
            ui: {
              test: /[\\/]node_modules[\\/](@headlessui|lucide-react)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 25,
            },
          },
        },
      };
    }

    return config;
  },

  // ==========================================
  // ENVIRONMENT VARIABLES
  // ==========================================
  env: {
    // Custom env vars accessible via process.env.CUSTOM_KEY
    CUSTOM_KEY: process.env.CUSTOM_KEY || '',
    APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  },

  // ==========================================
  // LOGGING
  // ==========================================
  // Disable logging in production
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },

  // ==========================================
  // DEV INDICATORS
  // ==========================================
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
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
  // I18N (if needed)
  // ==========================================
  // i18n: {
  //   locales: ['en-US', 'es-ES'],
  //   defaultLocale: 'en-US',
  // },

  // ==========================================
  // TURBOPACK (Next.js 16 default)
  // ==========================================
  turbopack: {
    // Turbopack configuration (Next.js 16+)
  },
};

export default nextConfig;
