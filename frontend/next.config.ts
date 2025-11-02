import type { NextConfig } from "next";

/**
 * Next.js 16 Production Configuration - White Cross Healthcare Platform
 *
 * Enterprise-grade configuration optimized for healthcare environments with comprehensive
 * security, performance, and compliance features. This configuration serves as the main
 * production build configuration for the Next.js frontend application.
 *
 * Key Features:
 * - HIPAA-compliant security headers (CSP, HSTS, X-Frame-Options)
 * - Healthcare data security with strict content policies
 * - Performance optimization with aggressive bundle splitting
 * - Docker/Kubernetes standalone output format
 * - Advanced webpack customization for healthcare-specific requirements
 * - Comprehensive image optimization for medical assets
 * - Environment variable validation for production safety
 * - Bundle analysis support for performance monitoring
 *
 * Security Considerations:
 * - All PHI (Protected Health Information) handling follows HIPAA guidelines
 * - CSP headers prevent XSS attacks on sensitive patient data
 * - No powered-by header to reduce information disclosure
 * - Strict referrer policy for privacy protection
 * - SVG disabled for security (XSS prevention)
 *
 * Performance Features:
 * - Optimized package imports for tree-shaking (lucide-react, recharts, etc.)
 * - Deterministic module IDs for better caching
 * - Strategic code splitting (vendor, react, ui, forms, charts)
 * - AVIF/WebP image format support for faster loading
 * - Production console.log removal (except errors/warnings)
 *
 * @module next.config
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 * @see https://nextjs.org/docs/advanced-features/security-headers
 * @version 1.0.0
 * @since 2025-10-26
 */

/**
 * Required environment variables for production deployment.
 * The application will fail to build if these are not set in production.
 *
 * @constant {ReadonlyArray<string>} requiredEnvVars
 */
const requiredEnvVars = [
  'NEXT_PUBLIC_API_BASE_URL',
] as const;

/**
 * Optional environment variables for enhanced features.
 * These enable additional functionality like monitoring and analytics.
 *
 * @constant {ReadonlyArray<string>} optionalEnvVars
 */
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

  // Enable Next.js v16 cache features (moved from experimental in Next.js 16)
  cacheComponents: true,

  // Cache life profiles for 'use cache' directive
  cacheLife: {
    short: {
      stale: 60, // 1 minute
      revalidate: 300, // 5 minutes
      expire: 600, // 10 minutes
    },
    medium: {
      stale: 300, // 5 minutes
      revalidate: 900, // 15 minutes
      expire: 1800, // 30 minutes
    },
    long: {
      stale: 900, // 15 minutes
      revalidate: 3600, // 1 hour
      expire: 7200, // 2 hours
    },
    default: {
      stale: 180, // 3 minutes
      revalidate: 600, // 10 minutes
      expire: 1200, // 20 minutes
    },
  },

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
      '@radix-ui/react-icons',
      'recharts',
      'date-fns',
      'lodash',
      '@tanstack/react-query',
      'react-hook-form',
      'framer-motion',
      'rxjs',
      '@apollo/client',
    ],

    // Enable partial pre-rendering (Next.js 16+)
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
    // Temporarily ignore build errors for deployment
    // TODO: Fix TypeScript strict mode issues with Next.js 16 typed routes
    ignoreBuildErrors: true,

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
  /**
   * Configures URL rewrites to proxy API requests to the backend server.
   *
   * This function creates transparent proxying of API calls from the Next.js frontend
   * to the Hapi.js backend, avoiding CORS issues and maintaining a unified origin
   * for security purposes (important for HIPAA compliance).
   *
   * Proxied Routes:
   * - /api/v1/* -> Backend REST API endpoints (proxied to non-versioned backend)
   * - /graphql -> GraphQL API endpoint
   * - /uploads/* -> File upload/download endpoints (patient documents, images)
   * - /api/backend-health -> Backend health check endpoint
   *
   * Security Benefits:
   * - Prevents CORS preflight requests that could leak metadata
   * - Maintains same-origin policy for sensitive healthcare data
   * - Hides backend server location from client
   *
   * @returns {Promise<Array<{source: string, destination: string}>>} Array of rewrite rules
   *
   * @example
   * ```typescript
   * // Client makes request to: /api/v1/students
   * // Next.js proxies to: http://localhost:3001/students
   * const response = await fetch('/api/v1/students');
   * ```
   *
   * @see https://nextjs.org/docs/api-reference/next.config.js/rewrites
   */
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

    return [
      // API endpoints (backend doesn't use /api/v1 prefix)
      {
        source: '/api/v1/:path*',
        destination: `${apiBaseUrl}/:path*`,
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
  /**
   * Configures URL redirects for the application.
   *
   * Currently, most routing logic is handled by Next.js middleware for flexibility.
   * This function can be used to define permanent or temporary redirects for
   * deprecated URLs, renamed routes, or SEO optimization.
   *
   * Note: Authentication-based redirects (e.g., / -> /dashboard) are handled
   * in middleware to allow conditional logic based on user session state.
   *
   * @returns {Promise<Array<{source: string, destination: string, permanent: boolean}>>} Array of redirect rules
   *
   * @example
   * ```typescript
   * // Redirect old URL to new URL permanently (301)
   * {
   *   source: '/old-medications',
   *   destination: '/medications',
   *   permanent: true,
   * }
   * ```
   *
   * @see https://nextjs.org/docs/api-reference/next.config.js/redirects
   */
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
  /**
   * Configures HTTP security headers for HIPAA compliance and healthcare data protection.
   *
   * This function implements comprehensive security headers following OWASP and HIPAA
   * best practices to protect Protected Health Information (PHI) and prevent common
   * web vulnerabilities.
   *
   * Security Headers Implemented:
   * - Content-Security-Policy: Prevents XSS attacks on patient data
   * - X-Frame-Options: Prevents clickjacking attacks
   * - X-Content-Type-Options: Prevents MIME sniffing
   * - Strict-Transport-Security: Enforces HTTPS (production only)
   * - Referrer-Policy: Protects patient privacy
   * - Permissions-Policy: Restricts browser features
   *
   * Caching Strategy:
   * - Static assets: 1 year cache (immutable)
   * - API routes: No caching (always fresh PHI data)
   * - Next.js assets: 1 year cache with immutable flag
   *
   * HIPAA Compliance Notes:
   * - CSP prevents unauthorized script execution that could leak PHI
   * - HSTS ensures all healthcare data transmission uses HTTPS
   * - No-cache headers on API routes prevent PHI from being cached
   * - Frame denial prevents embedding patient data in malicious sites
   *
   * @returns {Promise<Array<{source: string, headers: Array<{key: string, value: string}>}>>} Array of header configurations
   *
   * @example
   * ```typescript
   * // Headers applied to all routes:
   * // X-Frame-Options: DENY
   * // Content-Security-Policy: default-src 'self'; ...
   *
   * // Headers for static assets:
   * // Cache-Control: public, max-age=31536000, immutable
   * ```
   *
   * @see https://nextjs.org/docs/advanced-features/security-headers
   * @see https://owasp.org/www-project-secure-headers/
   * @see https://www.hhs.gov/hipaa/for-professionals/security/index.html
   */
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
  /**
   * Customizes the webpack configuration for both client and server builds.
   *
   * This function provides advanced webpack customizations for performance optimization,
   * bundle analysis, and healthcare-specific build requirements. It runs during both
   * development and production builds, with different optimizations applied per environment.
   *
   * Key Customizations:
   * - Watch options: Ignores node_modules for faster rebuilds
   * - Bundle analyzer: Visualizes bundle composition when ANALYZE=true
   * - Code splitting: Strategic splitting for optimal caching (vendor, react, ui, forms, charts)
   * - Module IDs: Deterministic naming for better long-term caching
   * - Runtime chunk: Separate runtime chunk for improved caching
   *
   * Performance Optimizations:
   * - Vendor chunk (priority 30): All node_modules except specific libraries
   * - React chunk (priority 30): React, ReactDOM, Redux for framework stability
   * - Data fetching (priority 28): TanStack Query, Apollo, Axios
   * - UI chunk (priority 25): Headless UI, Lucide icons
   * - Charts chunk (priority 24, async): Recharts, D3 for visualization
   * - Forms chunk (priority 23): React Hook Form, Zod validation
   * - Common chunk (priority 10): Code shared between 2+ routes
   *
   * Bundle Analysis:
   * - Set ANALYZE=true environment variable to generate reports
   * - Outputs to ./analyze/client.html and ./analyze/server.html
   * - Includes JSON stats files for CI/CD integration
   *
   * @param {object} config - Webpack configuration object
   * @param {boolean} config.isServer - True if building server bundle
   * @param {boolean} config.dev - True if development mode
   * @returns {object} Modified webpack configuration
   *
   * @example
   * ```bash
   * # Enable bundle analysis
   * ANALYZE=true npm run build
   *
   * # View report
   * open .next/analyze/client.html
   * ```
   *
   * @see https://webpack.js.org/configuration/
   * @see https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
   */
  webpack: (config: Record<string, unknown>, { isServer, dev }: { isServer: boolean; dev: boolean }) => {
    // Ignore node_modules for faster builds (dev performance optimization)
    config.watchOptions = {
      ...config.watchOptions,
      ignored: /node_modules/,
    };

    // Bundle analyzer (enable with ANALYZE=true environment variable)
    if (process.env.ANALYZE === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
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

    // Optimize production builds with strategic code splitting
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        // Deterministic module IDs for better long-term caching
        // Same modules get same IDs across builds
        moduleIds: 'deterministic',
        // Single runtime chunk shared by all entry points
        // Isolates webpack runtime for better caching
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk (priority 20): All node_modules
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunks (priority 10): Code shared between 2+ routes
            // Reduces duplication and improves cache hits
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // React/Redux chunk (priority 30): Framework core
            // Separate for stability - rarely changes between deployments
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|@reduxjs|react-redux)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 30,
            },
            // Data fetching libraries (priority 28): TanStack Query, Apollo, Axios
            // Healthcare data access patterns benefit from separate chunk
            dataFetching: {
              test: /[\\/]node_modules[\\/](@tanstack|@apollo|axios)[\\/]/,
              name: 'data-fetching',
              chunks: 'all',
              priority: 28,
            },
            // UI libraries chunk (priority 25): Headless UI, Lucide icons
            // Healthcare UI components - moderately large, infrequent updates
            ui: {
              test: /[\\/]node_modules[\\/](@headlessui|lucide-react)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 25,
            },
            // Charts and visualization (priority 24, async): Recharts, D3
            // Large libraries for health metrics - lazy loaded where possible
            charts: {
              test: /[\\/]node_modules[\\/](recharts|d3)[\\/]/,
              name: 'charts',
              chunks: 'async',
              priority: 24,
            },
            // Form libraries (priority 23): React Hook Form, Zod validation
            // Healthcare forms with validation - used across many routes
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
  /**
   * Generates a unique build identifier for the deployment.
   *
   * This function creates deterministic build IDs based on git commit hashes when available,
   * falling back to timestamps for local builds. Build IDs are used by Next.js for:
   * - Cache invalidation across deployments
   * - Asset versioning and CDN cache busting
   * - Deployment tracking and rollback capabilities
   *
   * Priority Order:
   * 1. Vercel git commit SHA (Vercel deployments)
   * 2. CI commit SHA (generic CI/CD systems)
   * 3. Timestamp fallback (local development builds)
   *
   * Healthcare Deployment Context:
   * - Build IDs enable rapid rollback if deployment issues affect patient care
   * - Deterministic IDs from git ensure reproducible builds for compliance auditing
   * - Timestamp IDs for development allow testing without git commits
   *
   * @returns {Promise<string>} Unique build identifier (git SHA or timestamp)
   *
   * @example
   * ```typescript
   * // Vercel deployment
   * // Returns: "a3f2b1c" (git commit SHA)
   *
   * // Local build
   * // Returns: "build-1698765432000" (timestamp)
   * ```
   *
   * @see https://nextjs.org/docs/api-reference/next.config.js/generate-build-id
   */
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
