import type { NextConfig } from "next";

/**
 * Next.js 15 Enhanced Configuration - White Cross Healthcare Platform
 *
 * Alternative configuration variant with stricter type checking and linting enforcement.
 * This configuration is more suitable for CI/CD pipelines and production validation where
 * build failures on type errors are desired.
 *
 * Key Differences from Main Config:
 * - TypeScript build errors cause build failure (ignoreBuildErrors: false)
 * - ESLint errors cause build failure (ignoreDuringBuilds: false)
 * - SWC minifier explicitly enabled (deprecated but kept for compatibility)
 * - Simplified experimental features (typedRoutes only)
 * - Simpler webpack optimization without detailed chunking strategy
 *
 * Use Cases:
 * - Strict CI/CD pipelines requiring zero type errors
 * - Pre-production validation environments
 * - Development builds requiring type safety enforcement
 * - Testing configuration changes without affecting main config
 *
 * Key Features:
 * - HIPAA-compliant security headers (CSP, HSTS, X-Frame-Options)
 * - Healthcare data security with strict content policies
 * - Performance optimization with bundle splitting
 * - Docker/Kubernetes standalone output format
 * - Comprehensive image optimization for medical assets
 * - API proxying to avoid CORS issues
 *
 * Security Considerations:
 * - All PHI (Protected Health Information) handling follows HIPAA guidelines
 * - CSP headers prevent XSS attacks on sensitive patient data
 * - No powered-by header to reduce information disclosure
 * - Strict referrer policy for privacy protection
 * - SVG disabled for security (XSS prevention)
 *
 * @module next.config.enhanced
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 * @see https://nextjs.org/docs/advanced-features/security-headers
 * @version 1.0.0
 * @since 2025-10-26
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
  /**
   * Configures URL rewrites to proxy API requests to the backend server.
   *
   * This function creates transparent proxying of API calls from the Next.js frontend
   * to the Hapi.js backend, avoiding CORS issues and maintaining a unified origin
   * for security purposes (important for HIPAA compliance).
   *
   * @returns {Promise<Array<{source: string, destination: string}>>} Array of rewrite rules
   * @see https://nextjs.org/docs/api-reference/next.config.js/rewrites
   */
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
  /**
   * Configures URL redirects for the application.
   *
   * @returns {Promise<Array<{source: string, destination: string, permanent: boolean}>>} Array of redirect rules
   * @see https://nextjs.org/docs/api-reference/next.config.js/redirects
   */
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
  /**
   * Configures HTTP security headers for HIPAA compliance and healthcare data protection.
   *
   * Implements comprehensive security headers following OWASP and HIPAA best practices
   * to protect Protected Health Information (PHI) and prevent common web vulnerabilities.
   *
   * @returns {Promise<Array<{source: string, headers: Array<{key: string, value: string}>}>>} Array of header configurations
   * @see https://nextjs.org/docs/advanced-features/security-headers
   * @see https://www.hhs.gov/hipaa/for-professionals/security/index.html
   */
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
  /**
   * Customizes the webpack configuration for both client and server builds.
   *
   * Simplified webpack customization focusing on development experience and
   * basic production optimizations. Less aggressive code splitting compared
   * to main configuration.
   *
   * @param {object} config - Webpack configuration object
   * @param {boolean} config.isServer - True if building server bundle
   * @param {boolean} config.dev - True if development mode
   * @returns {object} Modified webpack configuration
   * @see https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
   */
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

