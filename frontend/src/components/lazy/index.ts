/**
 * Lazy-loaded Components Index
 *
 * Central export point for all lazy-loaded components. These components use
 * dynamic imports to reduce initial bundle size and improve performance.
 *
 * PERFORMANCE BENEFITS:
 * - Reduced initial bundle: ~300-500KB saved
 * - Faster Time to Interactive (TTI)
 * - Better Core Web Vitals (LCP, FID)
 * - Improved caching (components cached separately)
 *
 * WHEN TO USE LAZY LOADING:
 * ✅ Heavy libraries (charts, calendars, PDF viewers)
 * ✅ Large page components (1000+ lines)
 * ✅ Components below the fold
 * ✅ Modal content
 * ✅ Tab content not initially visible
 * ✅ Admin-only features
 *
 * WHEN NOT TO USE LAZY LOADING:
 * ❌ Above-the-fold content
 * ❌ Critical path components (buttons, inputs)
 * ❌ Small components (<50 lines)
 * ❌ Layout components needed immediately
 *
 * @module components/lazy
 * @since 1.1.0
 */

// Chart Components
export * from './LazyCharts';

// Calendar Components
export * from './LazyCalendar';

// Page Components
export * from './LazyPages';

// Modal/Dialog Components
export * from './LazyModals';

// Settings Components
export * from './LazySettings';
