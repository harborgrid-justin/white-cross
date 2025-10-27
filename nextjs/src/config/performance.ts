/**
 * Performance Optimization Configuration
 *
 * Centralized configuration for Next.js performance optimizations
 */

/**
 * Image optimization configuration
 */
export const imageConfig = {
  /**
   * Allowed image domains for remote images
   */
  domains: [
    'whitecross.healthcare',
    'cdn.whitecross.healthcare',
    'images.unsplash.com', // For demo/marketing images
    's3.amazonaws.com', // If using AWS S3
  ],

  /**
   * Image device sizes for responsive images
   */
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

  /**
   * Image sizes for different use cases
   */
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

  /**
   * Default image quality (1-100)
   */
  quality: 85,

  /**
   * Supported image formats
   */
  formats: ['image/webp', 'image/avif'],

  /**
   * Minimum cache TTL for optimized images (in seconds)
   */
  minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year

  /**
   * Disable static imports optimization (use for dynamic images)
   */
  disableStaticImages: false,

  /**
   * Enable dangerous use of SVG (security risk - use with caution)
   */
  dangerouslyAllowSVG: false,

  /**
   * Content security policy for SVG
   */
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
} as const;

/**
 * Font optimization configuration
 */
export const fontConfig = {
  /**
   * Google Fonts to preload
   */
  googleFonts: [
    {
      family: 'Inter',
      weights: ['300', '400', '500', '600', '700'],
      subsets: ['latin'],
      display: 'swap' as const,
    },
  ],

  /**
   * Font display strategy
   */
  display: 'swap' as const,

  /**
   * Preload fonts
   */
  preload: true,

  /**
   * Font optimization
   */
  adjustFontFallback: true,
} as const;

/**
 * Script loading configuration
 */
export const scriptConfig = {
  /**
   * Third-party scripts strategy
   */
  analytics: {
    strategy: 'afterInteractive' as const,
    defer: true,
  },

  /**
   * Critical scripts
   */
  critical: {
    strategy: 'beforeInteractive' as const,
    defer: false,
  },

  /**
   * Non-critical scripts
   */
  nonCritical: {
    strategy: 'lazyOnload' as const,
    defer: true,
  },
} as const;

/**
 * Code splitting configuration
 */
export const codeSplittingConfig = {
  /**
   * Enable automatic code splitting
   */
  enabled: true,

  /**
   * Minimum chunk size (in bytes)
   */
  minChunkSize: 20000,

  /**
   * Maximum parallel requests
   */
  maxParallelRequests: 30,

  /**
   * Maximum initial requests
   */
  maxInitialRequests: 30,

  /**
   * Chunk groups priority
   */
  priority: {
    vendor: 20,
    common: 10,
    default: 5,
  },
} as const;

/**
 * Caching configuration
 */
export const cacheConfig = {
  /**
   * Static asset caching (in seconds)
   */
  staticAssets: {
    immutable: 60 * 60 * 24 * 365, // 1 year for immutable assets
    normal: 60 * 60 * 24 * 30, // 30 days for normal assets
  },

  /**
   * API response caching
   */
  api: {
    default: 60, // 1 minute
    students: 300, // 5 minutes
    medications: 60, // 1 minute (healthcare data needs to be fresh)
    healthRecords: 60, // 1 minute
    staticData: 3600, // 1 hour for reference data
  },

  /**
   * Incremental Static Regeneration (ISR)
   */
  isr: {
    revalidate: 60, // Revalidate every 60 seconds
    fallback: 'blocking' as const,
  },
} as const;

/**
 * Compression configuration
 */
export const compressionConfig = {
  /**
   * Enable Brotli compression
   */
  brotli: true,

  /**
   * Enable Gzip compression
   */
  gzip: true,

  /**
   * Compression level (0-9)
   */
  level: 6,

  /**
   * Minimum size to compress (in bytes)
   */
  threshold: 1024,
} as const;

/**
 * Prefetching configuration
 */
export const prefetchConfig = {
  /**
   * Enable automatic link prefetching
   */
  enabled: true,

  /**
   * Prefetch priority routes
   */
  priorityRoutes: [
    '/dashboard',
    '/students',
    '/medications',
    '/health-records',
    '/appointments',
  ],

  /**
   * Prefetch strategy
   */
  strategy: 'viewport' as const, // 'hover' | 'viewport' | 'always'

  /**
   * Prefetch delay (ms)
   */
  delay: 100,
} as const;

/**
 * Bundle analysis configuration
 */
export const bundleConfig = {
  /**
   * Enable bundle analysis
   */
  analyze: process.env.ANALYZE === 'true',

  /**
   * Target bundle size limits (in KB)
   */
  limits: {
    maxPageSize: 244, // 244 KB per page
    maxAssetSize: 488, // 488 KB per asset
    maxTotalSize: 976, // 976 KB total
  },

  /**
   * Bundle splitting strategy
   */
  splitting: {
    chunks: 'all' as const,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10,
      },
      common: {
        minChunks: 2,
        priority: 5,
        reuseExistingChunk: true,
      },
    },
  },
} as const;

/**
 * Runtime configuration
 */
export const runtimeConfig = {
  /**
   * React strict mode
   */
  reactStrictMode: true,

  /**
   * Powered by header
   */
  poweredByHeader: false,

  /**
   * Generate ETags
   */
  generateEtags: true,

  /**
   * Compress responses
   */
  compress: true,

  /**
   * Enable SWC minification
   */
  swcMinify: true,

  /**
   * Experimental features
   */
  experimental: {
    /**
     * Enable App Router
     */
    appDir: true,

    /**
     * Server Actions
     */
    serverActions: {
      bodySizeLimit: '2mb',
    },

    /**
     * Optimistic client cache
     */
    optimisticClientCache: true,

    /**
     * Optimize package imports
     */
    optimizePackageImports: [
      '@/components',
      '@/lib',
      'lodash',
      'date-fns',
      'lucide-react',
    ],
  },
} as const;

/**
 * Performance monitoring thresholds
 */
export const performanceThresholds = {
  /**
   * Largest Contentful Paint (LCP) - Good: <2.5s
   */
  lcp: {
    good: 2500,
    needsImprovement: 4000,
  },

  /**
   * First Input Delay (FID) - Good: <100ms
   */
  fid: {
    good: 100,
    needsImprovement: 300,
  },

  /**
   * Cumulative Layout Shift (CLS) - Good: <0.1
   */
  cls: {
    good: 0.1,
    needsImprovement: 0.25,
  },

  /**
   * First Contentful Paint (FCP) - Good: <1.8s
   */
  fcp: {
    good: 1800,
    needsImprovement: 3000,
  },

  /**
   * Time to First Byte (TTFB) - Good: <800ms
   */
  ttfb: {
    good: 800,
    needsImprovement: 1800,
  },
} as const;

export default {
  image: imageConfig,
  font: fontConfig,
  script: scriptConfig,
  codeSplitting: codeSplittingConfig,
  cache: cacheConfig,
  compression: compressionConfig,
  prefetch: prefetchConfig,
  bundle: bundleConfig,
  runtime: runtimeConfig,
  thresholds: performanceThresholds,
};
