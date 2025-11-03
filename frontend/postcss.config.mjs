/**
 * PostCSS Configuration (ESM) - White Cross Healthcare Platform
 *
 * PostCSS configuration for Tailwind CSS v3 integration.
 *
 * Key Features:
 * - Tailwind CSS v3 for utility-first CSS
 * - Autoprefixer for browser compatibility
 * - ESM module syntax for modern JavaScript ecosystem
 *
 * Build Process:
 * 1. Tailwind CSS processes utility classes
 * 2. Autoprefixer adds vendor prefixes for browser compatibility
 * 3. Next.js minifies and optimizes CSS in production
 *
 * @module postcss.config
 * @see https://tailwindcss.com/docs
 * @version 1.0.0
 */

const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
