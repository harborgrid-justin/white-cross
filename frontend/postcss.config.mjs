/**
 * PostCSS Configuration (ESM) - White Cross Healthcare Platform
 *
 * Modern ESM-based PostCSS configuration for Tailwind CSS v4 integration.
 * This configuration uses the new @tailwindcss/postcss plugin architecture
 * introduced in Tailwind CSS v4, which provides improved performance and
 * better integration with modern build tools.
 *
 * Key Features:
 * - Tailwind CSS v4 plugin with native PostCSS integration
 * - Lightning-fast CSS generation with new Oxide engine
 * - Automatic vendor prefixing built into plugin
 * - ESM module syntax for modern JavaScript ecosystem
 *
 * Differences from v3 Configuration:
 * - Single @tailwindcss/postcss plugin (replaces tailwindcss + autoprefixer)
 * - Faster build times with Rust-based Oxide compiler
 * - Better tree-shaking and smaller production CSS bundles
 * - Improved CSS-in-JS and utility extraction
 *
 * Build Process:
 * 1. Tailwind CSS v4 processes utility classes with Oxide engine
 * 2. Automatic vendor prefixing for browser compatibility
 * 3. Next.js minifies and optimizes CSS in production
 *
 * Performance Benefits:
 * - Up to 10x faster than Tailwind CSS v3
 * - Smaller CSS output due to better optimization
 * - Native CSS variable support for dynamic theming
 * - Reduced build-time overhead
 *
 * Migration Notes:
 * - This config is for Tailwind CSS v4 (when available)
 * - Use postcss.config.js for Tailwind CSS v3
 * - Ensure @tailwindcss/postcss is installed
 *
 * @module postcss.config
 * @see https://tailwindcss.com/docs/v4
 * @see https://github.com/tailwindlabs/tailwindcss
 * @version 1.0.0
 * @since 2025-10-26
 */

const config = {
  plugins: {
    // Tailwind CSS v4 plugin - unified PostCSS plugin with built-in autoprefixer
    // Replaces separate tailwindcss and autoprefixer plugins from v3
    "@tailwindcss/postcss": {},
  },
};

export default config;
