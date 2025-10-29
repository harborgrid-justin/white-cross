/**
 * PostCSS Configuration - White Cross Healthcare Platform
 *
 * Configures PostCSS processing pipeline for CSS transformation and optimization.
 * This file uses CommonJS module syntax for compatibility with older build tools.
 *
 * Key Plugins:
 * - tailwindcss: Processes Tailwind CSS utility classes and generates final CSS
 * - autoprefixer: Adds vendor prefixes for cross-browser compatibility
 *
 * Build Process:
 * 1. Tailwind CSS processes utility classes and custom components
 * 2. Autoprefixer adds vendor prefixes based on browserslist config
 * 3. Next.js minifies CSS in production builds
 *
 * Browser Support:
 * - Modern browsers (Chrome, Firefox, Safari, Edge)
 * - iOS Safari 12+
 * - Android Chrome 90+
 * - Healthcare provider workstation browsers
 *
 * Performance Considerations:
 * - PostCSS runs during build time (no runtime overhead)
 * - Tailwind CSS JIT mode generates minimal CSS
 * - Autoprefixer only adds necessary prefixes
 *
 * @module postcss.config
 * @see https://postcss.org/
 * @see https://tailwindcss.com/docs/using-with-preprocessors
 * @see https://github.com/postcss/autoprefixer
 * @version 1.0.0
 * @since 2025-10-26
 */

module.exports = {
  plugins: {
    // Tailwind CSS plugin - processes utility classes and generates CSS
    tailwindcss: {},

    // Autoprefixer plugin - adds vendor prefixes for browser compatibility
    // Uses browserslist config from package.json or .browserslistrc
    autoprefixer: {},
  },
}