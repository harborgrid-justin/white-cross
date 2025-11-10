/**
 * @fileoverview Analytics Tracking Kit for Next.js 16/React
 * @module @reuse/frontend/analytics-tracking-kit
 * @description Comprehensive analytics tracking utilities, hooks, and integrations for Next.js 16 applications
 *
 * Features:
 * - Google Analytics 4 (GA4) integration
 * - Google Tag Manager (GTM) integration
 * - Custom event tracking and dimensions
 * - User identification and properties
 * - Ecommerce and transaction tracking
 * - Content engagement metrics (scroll depth, reading time)
 * - Video and media analytics
 * - Form and error tracking
 * - A/B testing and experiments
 * - Performance metrics and Web Vitals
 * - Consent management and privacy compliance
 * - Session recording and heatmap integration
 * - Real-time analytics and debugging
 *
 * @example
 * ```tsx
 * // Basic usage with Next.js 16
 * import { useTracking, usePageView, trackEvent } from '@reuse/frontend/analytics-tracking-kit';
 *
 * export default function Page() {
 *   const { track } = useTracking();
 *   usePageView(); // Auto-tracks page views
 *
 *   const handleClick = () => {
 *     trackEvent('button_click', {
 *       category: 'engagement',
 *       label: 'cta_button',
 *       value: 1
 *     });
 *   };
 *
 *   return <button onClick={handleClick}>Track Me</button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Ecommerce tracking
 * import { trackPurchase, useEcommerceTracking } from '@reuse/frontend/analytics-tracking-kit';
 *
 * function CheckoutPage() {
 *   const { trackAddToCart, trackRemoveFromCart } = useEcommerceTracking();
 *
 *   const handlePurchase = async (order) => {
 *     await trackPurchase({
 *       transactionId: order.id,
 *       value: order.total,
 *       currency: 'USD',
 *       items: order.items
 *     });
 *   };
 * }
 * ```
 */
/**
 * Analytics provider types
 */
export type AnalyticsProvider = 'ga4' | 'gtm' | 'segment' | 'mixpanel' | 'amplitude' | 'custom';
/**
 * Event parameter types
 */
export interface EventParameters {
    [key: string]: string | number | boolean | string[] | undefined;
}
/**
 * Analytics event structure
 */
export interface AnalyticsEvent {
    name: string;
    category?: string;
    label?: string;
    value?: number;
    parameters?: EventParameters;
    timestamp?: number;
    userId?: string;
    sessionId?: string;
}
/**
 * Page view event data
 */
export interface PageViewEvent {
    path: string;
    title: string;
    referrer?: string;
    search?: string;
    hash?: string;
    url?: string;
    hostname?: string;
}
/**
 * Custom dimension configuration
 */
export interface CustomDimension {
    index: number;
    name: string;
    value: string | number | boolean;
    scope?: 'hit' | 'session' | 'user' | 'product';
}
/**
 * Custom metric configuration
 */
export interface CustomMetric {
    index: number;
    name: string;
    value: number;
    type?: 'integer' | 'currency' | 'time';
}
/**
 * User properties for identification
 */
export interface UserProperties {
    userId?: string;
    email?: string;
    name?: string;
    plan?: string;
    signupDate?: string;
    totalSpent?: number;
    lifetimeValue?: number;
    segment?: string;
    [key: string]: string | number | boolean | undefined;
}
/**
 * Ecommerce item/product
 */
export interface EcommerceItem {
    itemId: string;
    itemName: string;
    affiliation?: string;
    coupon?: string;
    discount?: number;
    index?: number;
    itemBrand?: string;
    itemCategory?: string;
    itemCategory2?: string;
    itemCategory3?: string;
    itemCategory4?: string;
    itemCategory5?: string;
    itemListId?: string;
    itemListName?: string;
    itemVariant?: string;
    locationId?: string;
    price: number;
    quantity: number;
    currency?: string;
}
/**
 * Transaction/purchase data
 */
export interface TransactionData {
    transactionId: string;
    value: number;
    currency: string;
    tax?: number;
    shipping?: number;
    coupon?: string;
    affiliation?: string;
    items: EcommerceItem[];
}
/**
 * Conversion event data
 */
export interface ConversionEvent {
    name: string;
    value?: number;
    currency?: string;
    transactionId?: string;
    parameters?: EventParameters;
}
/**
 * Content engagement metrics
 */
export interface ContentEngagement {
    contentId?: string;
    contentType?: string;
    readingTime?: number;
    scrollDepth?: number;
    timeOnPage?: number;
    engagementScore?: number;
}
/**
 * Video analytics data
 */
export interface VideoAnalytics {
    videoId: string;
    videoTitle: string;
    provider?: string;
    duration?: number;
    currentTime?: number;
    percentWatched?: number;
    action: 'play' | 'pause' | 'complete' | 'seek' | 'buffer' | 'error';
}
/**
 * Form tracking data
 */
export interface FormTracking {
    formId: string;
    formName?: string;
    fieldName?: string;
    fieldType?: string;
    action: 'start' | 'complete' | 'abandon' | 'error' | 'field_interaction';
    errors?: string[];
    completionTime?: number;
}
/**
 * Error tracking data
 */
export interface ErrorTracking {
    errorMessage: string;
    errorType?: string;
    errorStack?: string;
    componentStack?: string;
    errorBoundary?: string;
    userId?: string;
    url?: string;
    userAgent?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
}
/**
 * A/B test variant data
 */
export interface ExperimentVariant {
    experimentId: string;
    experimentName: string;
    variantId: string;
    variantName: string;
}
/**
 * Performance metrics (Web Vitals)
 */
export interface PerformanceMetrics {
    name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP';
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    delta?: number;
    id?: string;
    navigationType?: 'navigate' | 'reload' | 'back-forward' | 'prerender';
}
/**
 * Consent configuration
 */
export interface ConsentConfig {
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
    necessary: boolean;
    timestamp?: number;
    version?: string;
}
/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
    provider: AnalyticsProvider;
    measurementId?: string;
    containerId?: string;
    writeKey?: string;
    apiKey?: string;
    debug?: boolean;
    anonymizeIp?: boolean;
    cookieDomain?: string;
    cookieExpires?: number;
    sampleRate?: number;
    siteSpeedSampleRate?: number;
    consentMode?: 'basic' | 'advanced';
}
/**
 * Tracking hook return type
 */
export interface UseTrackingReturn {
    track: (eventName: string, parameters?: EventParameters) => void;
    identify: (userId: string, properties?: UserProperties) => void;
    reset: () => void;
    isInitialized: boolean;
    setConsent: (consent: ConsentConfig) => void;
}
/**
 * Session data
 */
export interface SessionData {
    sessionId: string;
    startTime: number;
    lastActivityTime: number;
    pageViews: number;
    events: number;
    duration?: number;
}
/**
 * Heatmap configuration
 */
export interface HeatmapConfig {
    provider: 'hotjar' | 'mouseflow' | 'clarity' | 'custom';
    siteId?: string;
    trackingCode?: string;
    enableRecording?: boolean;
    enableHeatmaps?: boolean;
    enableFeedback?: boolean;
}
/**
 * Search tracking data
 */
export interface SearchTracking {
    searchTerm: string;
    searchResults?: number;
    searchCategory?: string;
    searchFilters?: Record<string, string>;
    resultClicked?: string;
}
/**
 * Initialize analytics tracking
 *
 * @description Sets up analytics tracking with the specified provider and configuration
 * @param {AnalyticsConfig} config - Analytics configuration
 * @returns {void}
 *
 * @example
 * ```tsx
 * // Initialize GA4
 * initializeAnalytics({
 *   provider: 'ga4',
 *   measurementId: 'G-XXXXXXXXXX',
 *   debug: process.env.NODE_ENV === 'development'
 * });
 * ```
 */
export declare function initializeAnalytics(config: AnalyticsConfig): void;
/**
 * Get current analytics configuration
 *
 * @description Returns the current analytics configuration
 * @returns {AnalyticsConfig | null} Current configuration or null if not initialized
 *
 * @example
 * ```tsx
 * const config = getAnalyticsConfig();
 * if (config?.debug) {
 *   console.log('Debug mode enabled');
 * }
 * ```
 */
export declare function getAnalyticsConfig(): AnalyticsConfig | null;
/**
 * Enable or disable debug mode
 *
 * @description Toggles debug logging for analytics events
 * @param {boolean} enabled - Whether to enable debug mode
 * @returns {void}
 *
 * @example
 * ```tsx
 * setDebugMode(process.env.NODE_ENV === 'development');
 * ```
 */
export declare function setDebugMode(enabled: boolean): void;
/**
 * Initialize Google Analytics 4
 *
 * @description Sets up GA4 tracking script and configuration
 * @param {AnalyticsConfig} config - GA4 configuration
 * @returns {void}
 *
 * @example
 * ```tsx
 * initializeGA4({
 *   provider: 'ga4',
 *   measurementId: 'G-XXXXXXXXXX',
 *   anonymizeIp: true,
 *   sampleRate: 100
 * });
 * ```
 */
export declare function initializeGA4(config: AnalyticsConfig): void;
/**
 * Initialize Google Tag Manager
 *
 * @description Sets up GTM container and data layer
 * @param {AnalyticsConfig} config - GTM configuration
 * @returns {void}
 *
 * @example
 * ```tsx
 * initializeGTM({
 *   provider: 'gtm',
 *   containerId: 'GTM-XXXXXXX'
 * });
 * ```
 */
export declare function initializeGTM(config: AnalyticsConfig): void;
/**
 * Initialize Segment
 *
 * @description Sets up Segment analytics.js
 * @param {AnalyticsConfig} config - Segment configuration
 * @returns {void}
 *
 * @example
 * ```tsx
 * initializeSegment({
 *   provider: 'segment',
 *   writeKey: 'YOUR_WRITE_KEY'
 * });
 * ```
 */
export declare function initializeSegment(config: AnalyticsConfig): void;
/**
 * Create a new tracking session
 *
 * @description Generates a new session with unique ID and timestamp
 * @returns {SessionData} New session data
 *
 * @example
 * ```tsx
 * const session = createSession();
 * console.log('Session ID:', session.sessionId);
 * ```
 */
export declare function createSession(): SessionData;
/**
 * Get current session data
 *
 * @description Returns the current tracking session or creates a new one
 * @returns {SessionData} Current session data
 *
 * @example
 * ```tsx
 * const session = getCurrentSession();
 * console.log('Session duration:', Date.now() - session.startTime);
 * ```
 */
export declare function getCurrentSession(): SessionData;
/**
 * Update session activity
 *
 * @description Updates the last activity time for the current session
 * @returns {void}
 *
 * @example
 * ```tsx
 * // Update session on user interaction
 * document.addEventListener('click', () => {
 *   updateSessionActivity();
 * });
 * ```
 */
export declare function updateSessionActivity(): void;
/**
 * Generate unique session ID
 *
 * @description Creates a unique session identifier
 * @returns {string} Unique session ID
 *
 * @example
 * ```tsx
 * const sessionId = generateSessionId();
 * // Returns: "sess_1234567890_abcdef"
 * ```
 */
export declare function generateSessionId(): string;
/**
 * End current session
 *
 * @description Ends the current session and optionally tracks session data
 * @param {boolean} trackSessionEnd - Whether to track the session end event
 * @returns {void}
 *
 * @example
 * ```tsx
 * // End session when user logs out
 * const handleLogout = () => {
 *   endSession(true);
 *   // ... logout logic
 * };
 * ```
 */
export declare function endSession(trackSessionEnd?: boolean): void;
/**
 * Track a page view
 *
 * @description Records a page view event with path and metadata
 * @param {Partial<PageViewEvent>} pageData - Page view data (optional, auto-detected if not provided)
 * @returns {void}
 *
 * @example
 * ```tsx
 * // Auto-detect current page
 * trackPageView();
 *
 * // Manual page data
 * trackPageView({
 *   path: '/products',
 *   title: 'Products Page',
 *   referrer: document.referrer
 * });
 * ```
 */
export declare function trackPageView(pageData?: Partial<PageViewEvent>): void;
/**
 * Track a custom event
 *
 * @description Records a custom analytics event with parameters
 * @param {string} eventName - Event name
 * @param {EventParameters} parameters - Event parameters
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackEvent('button_click', {
 *   category: 'engagement',
 *   label: 'signup_button',
 *   value: 1
 * });
 *
 * trackEvent('video_play', {
 *   video_id: 'abc123',
 *   video_title: 'Product Demo'
 * });
 * ```
 */
export declare function trackEvent(eventName: string, parameters?: EventParameters): void;
/**
 * Track a conversion event
 *
 * @description Records a conversion event with value and transaction ID
 * @param {ConversionEvent} conversion - Conversion data
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackConversion({
 *   name: 'signup',
 *   value: 0,
 *   currency: 'USD'
 * });
 *
 * trackConversion({
 *   name: 'purchase',
 *   value: 99.99,
 *   currency: 'USD',
 *   transactionId: 'order_123'
 * });
 * ```
 */
export declare function trackConversion(conversion: ConversionEvent): void;
/**
 * Identify user with ID and properties
 *
 * @description Associates analytics data with a specific user
 * @param {string} userId - Unique user identifier
 * @param {UserProperties} properties - User properties
 * @returns {void}
 *
 * @example
 * ```tsx
 * identifyUser('user_123', {
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   plan: 'premium',
 *   signupDate: '2024-01-01'
 * });
 * ```
 */
export declare function identifyUser(userId: string, properties?: UserProperties): void;
/**
 * Set user properties
 *
 * @description Updates user properties without changing user ID
 * @param {UserProperties} properties - User properties to set
 * @returns {void}
 *
 * @example
 * ```tsx
 * setUserProperties({
 *   plan: 'enterprise',
 *   totalSpent: 1500,
 *   lifetimeValue: 5000
 * });
 * ```
 */
export declare function setUserProperties(properties: UserProperties): void;
/**
 * Reset user identification
 *
 * @description Clears current user ID and starts a new anonymous session
 * @returns {void}
 *
 * @example
 * ```tsx
 * // Reset user on logout
 * const handleLogout = () => {
 *   resetUser();
 *   // ... logout logic
 * };
 * ```
 */
export declare function resetUser(): void;
/**
 * Set custom dimension
 *
 * @description Sets a custom dimension for enhanced tracking
 * @param {CustomDimension} dimension - Custom dimension configuration
 * @returns {void}
 *
 * @example
 * ```tsx
 * setCustomDimension({
 *   index: 1,
 *   name: 'user_type',
 *   value: 'premium',
 *   scope: 'user'
 * });
 * ```
 */
export declare function setCustomDimension(dimension: CustomDimension): void;
/**
 * Set custom metric
 *
 * @description Sets a custom metric for enhanced tracking
 * @param {CustomMetric} metric - Custom metric configuration
 * @returns {void}
 *
 * @example
 * ```tsx
 * setCustomMetric({
 *   index: 1,
 *   name: 'engagement_score',
 *   value: 85,
 *   type: 'integer'
 * });
 * ```
 */
export declare function setCustomMetric(metric: CustomMetric): void;
/**
 * Track product view
 *
 * @description Records when a user views a product
 * @param {EcommerceItem} item - Product/item data
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackProductView({
 *   itemId: 'SKU123',
 *   itemName: 'Premium Widget',
 *   itemCategory: 'Widgets',
 *   price: 29.99,
 *   quantity: 1,
 *   currency: 'USD'
 * });
 * ```
 */
export declare function trackProductView(item: EcommerceItem): void;
/**
 * Track add to cart
 *
 * @description Records when a user adds an item to cart
 * @param {EcommerceItem} item - Product/item data
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackAddToCart({
 *   itemId: 'SKU123',
 *   itemName: 'Premium Widget',
 *   price: 29.99,
 *   quantity: 2
 * });
 * ```
 */
export declare function trackAddToCart(item: EcommerceItem): void;
/**
 * Track remove from cart
 *
 * @description Records when a user removes an item from cart
 * @param {EcommerceItem} item - Product/item data
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackRemoveFromCart({
 *   itemId: 'SKU123',
 *   itemName: 'Premium Widget',
 *   price: 29.99,
 *   quantity: 1
 * });
 * ```
 */
export declare function trackRemoveFromCart(item: EcommerceItem): void;
/**
 * Track begin checkout
 *
 * @description Records when a user begins the checkout process
 * @param {EcommerceItem[]} items - Cart items
 * @param {number} value - Total cart value
 * @param {string} currency - Currency code
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackBeginCheckout(cartItems, 89.97, 'USD');
 * ```
 */
export declare function trackBeginCheckout(items: EcommerceItem[], value: number, currency?: string): void;
/**
 * Track purchase/transaction
 *
 * @description Records a completed purchase transaction
 * @param {TransactionData} transaction - Transaction data
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackPurchase({
 *   transactionId: 'ORDER_123',
 *   value: 99.97,
 *   currency: 'USD',
 *   tax: 8.50,
 *   shipping: 5.00,
 *   items: [...]
 * });
 * ```
 */
export declare function trackPurchase(transaction: TransactionData): void;
/**
 * Track refund
 *
 * @description Records a transaction refund
 * @param {string} transactionId - Original transaction ID
 * @param {number} value - Refund amount
 * @param {string} currency - Currency code
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackRefund('ORDER_123', 99.97, 'USD');
 * ```
 */
export declare function trackRefund(transactionId: string, value: number, currency?: string): void;
/**
 * Track scroll depth
 *
 * @description Records how far a user has scrolled on a page
 * @param {number} percentage - Scroll depth percentage (0-100)
 * @param {string} contentId - Optional content identifier
 * @returns {void}
 *
 * @example
 * ```tsx
 * // Track 25%, 50%, 75%, 100% scroll milestones
 * trackScrollDepth(75, 'article_123');
 * ```
 */
export declare function trackScrollDepth(percentage: number, contentId?: string): void;
/**
 * Track reading time
 *
 * @description Records how long a user spent reading content
 * @param {number} seconds - Reading time in seconds
 * @param {string} contentId - Content identifier
 * @param {string} contentType - Type of content
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackReadingTime(120, 'article_123', 'blog_post');
 * ```
 */
export declare function trackReadingTime(seconds: number, contentId: string, contentType?: string): void;
/**
 * Track content engagement
 *
 * @description Records comprehensive content engagement metrics
 * @param {ContentEngagement} engagement - Engagement data
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackContentEngagement({
 *   contentId: 'article_123',
 *   contentType: 'blog_post',
 *   readingTime: 180,
 *   scrollDepth: 85,
 *   timeOnPage: 200,
 *   engagementScore: 92
 * });
 * ```
 */
export declare function trackContentEngagement(engagement: ContentEngagement): void;
/**
 * Track video interaction
 *
 * @description Records video player interactions
 * @param {VideoAnalytics} video - Video analytics data
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackVideoInteraction({
 *   videoId: 'video_123',
 *   videoTitle: 'Product Demo',
 *   action: 'play',
 *   currentTime: 0,
 *   duration: 300
 * });
 * ```
 */
export declare function trackVideoInteraction(video: VideoAnalytics): void;
/**
 * Track media download
 *
 * @description Records when a user downloads media
 * @param {string} mediaId - Media identifier
 * @param {string} mediaType - Type of media
 * @param {string} fileName - File name
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackMediaDownload('doc_123', 'pdf', 'whitepaper.pdf');
 * ```
 */
export declare function trackMediaDownload(mediaId: string, mediaType: string, fileName: string): void;
/**
 * Track form interaction
 *
 * @description Records form-related events
 * @param {FormTracking} form - Form tracking data
 * @returns {void}
 *
 * @example
 * ```tsx
 * // Form start
 * trackFormInteraction({
 *   formId: 'signup_form',
 *   formName: 'User Signup',
 *   action: 'start'
 * });
 *
 * // Form complete
 * trackFormInteraction({
 *   formId: 'signup_form',
 *   action: 'complete',
 *   completionTime: 45
 * });
 * ```
 */
export declare function trackFormInteraction(form: FormTracking): void;
/**
 * Track form error
 *
 * @description Records form validation errors
 * @param {string} formId - Form identifier
 * @param {string} fieldName - Field with error
 * @param {string} errorMessage - Error message
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackFormError('signup_form', 'email', 'Invalid email format');
 * ```
 */
export declare function trackFormError(formId: string, fieldName: string, errorMessage: string): void;
/**
 * Track error
 *
 * @description Records application errors
 * @param {ErrorTracking} error - Error tracking data
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackError({
 *   errorMessage: 'Failed to load data',
 *   errorType: 'NetworkError',
 *   severity: 'high',
 *   url: window.location.href
 * });
 * ```
 */
export declare function trackError(error: ErrorTracking): void;
/**
 * Track 404 error
 *
 * @description Records 404 page not found errors
 * @param {string} path - Requested path
 * @param {string} referrer - Referrer URL
 * @returns {void}
 *
 * @example
 * ```tsx
 * track404('/missing-page', document.referrer);
 * ```
 */
export declare function track404(path: string, referrer?: string): void;
/**
 * Track experiment variant
 *
 * @description Records which A/B test variant a user sees
 * @param {ExperimentVariant} variant - Experiment variant data
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackExperimentVariant({
 *   experimentId: 'exp_123',
 *   experimentName: 'Homepage CTA Test',
 *   variantId: 'variant_b',
 *   variantName: 'Green Button'
 * });
 * ```
 */
export declare function trackExperimentVariant(variant: ExperimentVariant): void;
/**
 * Track experiment conversion
 *
 * @description Records when a user completes an experiment goal
 * @param {string} experimentId - Experiment identifier
 * @param {string} variantId - Variant identifier
 * @param {string} goalName - Conversion goal name
 * @param {number} value - Optional conversion value
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackExperimentConversion('exp_123', 'variant_b', 'signup', 1);
 * ```
 */
export declare function trackExperimentConversion(experimentId: string, variantId: string, goalName: string, value?: number): void;
/**
 * Track performance metric
 *
 * @description Records Web Vitals and performance metrics
 * @param {PerformanceMetrics} metric - Performance metric data
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackPerformanceMetric({
 *   name: 'LCP',
 *   value: 2500,
 *   rating: 'good',
 *   delta: 100
 * });
 * ```
 */
export declare function trackPerformanceMetric(metric: PerformanceMetrics): void;
/**
 * Track all Web Vitals
 *
 * @description Automatically tracks all Core Web Vitals using web-vitals library
 * @returns {void}
 *
 * @example
 * ```tsx
 * // In _app.tsx or layout.tsx
 * useEffect(() => {
 *   trackWebVitals();
 * }, []);
 * ```
 */
export declare function trackWebVitals(): void;
/**
 * Track site search
 *
 * @description Records internal site search queries
 * @param {SearchTracking} search - Search tracking data
 * @returns {void}
 *
 * @example
 * ```tsx
 * trackSearch({
 *   searchTerm: 'react hooks',
 *   searchResults: 42,
 *   searchCategory: 'blog'
 * });
 * ```
 */
export declare function trackSearch(search: SearchTracking): void;
/**
 * Set user consent preferences
 *
 * @description Updates user consent for analytics tracking
 * @param {ConsentConfig} consent - Consent configuration
 * @returns {void}
 *
 * @example
 * ```tsx
 * setConsent({
 *   analytics: true,
 *   marketing: false,
 *   functional: true,
 *   necessary: true
 * });
 * ```
 */
export declare function setConsent(consent: ConsentConfig): void;
/**
 * Get current consent preferences
 *
 * @description Returns the current user consent configuration
 * @returns {ConsentConfig} Current consent configuration
 *
 * @example
 * ```tsx
 * const consent = getConsent();
 * if (consent.analytics) {
 *   // Track analytics
 * }
 * ```
 */
export declare function getConsent(): ConsentConfig;
/**
 * Check if consent is granted for a specific purpose
 *
 * @description Checks if user has consented to a specific tracking purpose
 * @param {keyof ConsentConfig} purpose - Purpose to check
 * @returns {boolean} Whether consent is granted
 *
 * @example
 * ```tsx
 * if (hasConsent('marketing')) {
 *   // Track marketing events
 * }
 * ```
 */
export declare function hasConsent(purpose: keyof ConsentConfig): boolean;
/**
 * Initialize heatmap tracking
 *
 * @description Sets up heatmap and session recording provider
 * @param {HeatmapConfig} config - Heatmap configuration
 * @returns {void}
 *
 * @example
 * ```tsx
 * initializeHeatmap({
 *   provider: 'hotjar',
 *   siteId: '12345',
 *   enableRecording: true,
 *   enableHeatmaps: true
 * });
 * ```
 */
export declare function initializeHeatmap(config: HeatmapConfig): void;
/**
 * Trigger heatmap event
 *
 * @description Manually triggers a heatmap event
 * @param {string} eventName - Event name
 * @param {EventParameters} parameters - Event parameters
 * @returns {void}
 *
 * @example
 * ```tsx
 * triggerHeatmapEvent('form_abandon', {
 *   form_id: 'signup',
 *   field: 'email'
 * });
 * ```
 */
export declare function triggerHeatmapEvent(eventName: string, parameters?: EventParameters): void;
/**
 * Hook for tracking functionality
 *
 * @description React hook for accessing tracking functions
 * @returns {UseTrackingReturn} Tracking functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { track, identify, isInitialized } = useTracking();
 *
 *   useEffect(() => {
 *     if (isInitialized) {
 *       identify('user_123', { plan: 'premium' });
 *     }
 *   }, [isInitialized]);
 *
 *   const handleClick = () => {
 *     track('button_click', { button_id: 'cta' });
 *   };
 *
 *   return <button onClick={handleClick}>Click Me</button>;
 * }
 * ```
 */
export declare function useTracking(): UseTrackingReturn;
/**
 * Hook for automatic page view tracking
 *
 * @description React hook that automatically tracks page views
 * @param {Partial<PageViewEvent>} pageData - Optional page data override
 *
 * @example
 * ```tsx
 * function Page() {
 *   usePageView(); // Auto-tracks page view
 *   return <div>Page content</div>;
 * }
 *
 * // With custom data
 * function CustomPage() {
 *   usePageView({
 *     title: 'Custom Page Title',
 *     path: '/custom-path'
 *   });
 *   return <div>Page content</div>;
 * }
 * ```
 */
export declare function usePageView(pageData?: Partial<PageViewEvent>): void;
/**
 * Hook for event tracking with memoization
 *
 * @description React hook that returns a memoized event tracking function
 * @param {string} eventName - Event name
 * @param {EventParameters} baseParameters - Base parameters to merge with each event
 * @returns {(parameters?: EventParameters) => void} Event tracking function
 *
 * @example
 * ```tsx
 * function ProductCard({ productId, productName }) {
 *   const trackProductClick = useEvent('product_click', {
 *     product_id: productId,
 *     product_name: productName
 *   });
 *
 *   return (
 *     <div onClick={() => trackProductClick({ source: 'card' })}>
 *       {productName}
 *     </div>
 *   );
 * }
 * ```
 */
export declare function useEvent(eventName: string, baseParameters?: EventParameters): (parameters?: EventParameters) => void;
/**
 * Hook for ecommerce tracking
 *
 * @description React hook for ecommerce tracking functions
 * @returns {object} Ecommerce tracking functions
 *
 * @example
 * ```tsx
 * function ProductPage({ product }) {
 *   const { trackView, trackAddToCart, trackPurchase } = useEcommerceTracking();
 *
 *   useEffect(() => {
 *     trackView(product);
 *   }, [product]);
 *
 *   const handleAddToCart = () => {
 *     trackAddToCart({ ...product, quantity: 1 });
 *   };
 *
 *   return <button onClick={handleAddToCart}>Add to Cart</button>;
 * }
 * ```
 */
export declare function useEcommerceTracking(): {
    trackView: any;
    trackAddToCart: any;
    trackRemoveFromCart: any;
    trackBeginCheckout: any;
    trackPurchase: any;
};
/**
 * Hook for scroll depth tracking
 *
 * @description React hook that automatically tracks scroll depth milestones
 * @param {string} contentId - Optional content identifier
 * @param {number[]} milestones - Scroll depth milestones to track (default: [25, 50, 75, 100])
 *
 * @example
 * ```tsx
 * function Article({ articleId }) {
 *   useScrollDepth(articleId, [25, 50, 75, 100]);
 *
 *   return (
 *     <article>
 *       <h1>Article Title</h1>
 *       <p>Content...</p>
 *     </article>
 *   );
 * }
 * ```
 */
export declare function useScrollDepth(contentId?: string, milestones?: number[]): void;
/**
 * Hook for reading time tracking
 *
 * @description React hook that tracks time spent reading content
 * @param {string} contentId - Content identifier
 * @param {string} contentType - Type of content
 * @returns {number} Current reading time in seconds
 *
 * @example
 * ```tsx
 * function BlogPost({ postId }) {
 *   const readingTime = useReadingTime(postId, 'blog_post');
 *
 *   useEffect(() => {
 *     return () => {
 *       // Track when component unmounts
 *       console.log('User spent', readingTime, 'seconds reading');
 *     };
 *   }, []);
 *
 *   return <article>...</article>;
 * }
 * ```
 */
export declare function useReadingTime(contentId: string, contentType?: string): number;
/**
 * Hook for form tracking
 *
 * @description React hook for comprehensive form analytics
 * @param {string} formId - Form identifier
 * @param {string} formName - Form name
 * @returns {object} Form tracking functions
 *
 * @example
 * ```tsx
 * function SignupForm() {
 *   const { trackStart, trackComplete, trackFieldInteraction, trackError } =
 *     useFormTracking('signup_form', 'User Signup');
 *
 *   useEffect(() => {
 *     trackStart();
 *   }, []);
 *
 *   const handleSubmit = async (e) => {
 *     e.preventDefault();
 *     try {
 *       await submitForm();
 *       trackComplete();
 *     } catch (error) {
 *       trackError('email', error.message);
 *     }
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export declare function useFormTracking(formId: string, formName?: string): {
    trackStart: any;
    trackComplete: any;
    trackAbandon: any;
    trackFieldInteraction: any;
    trackError: any;
};
/**
 * Hook for video tracking
 *
 * @description React hook for video player analytics
 * @param {string} videoId - Video identifier
 * @param {string} videoTitle - Video title
 * @param {string} provider - Video provider
 * @returns {object} Video tracking functions
 *
 * @example
 * ```tsx
 * function VideoPlayer({ videoId, title }) {
 *   const { trackPlay, trackPause, trackComplete, trackSeek } =
 *     useVideoTracking(videoId, title, 'youtube');
 *
 *   return (
 *     <video
 *       onPlay={trackPlay}
 *       onPause={trackPause}
 *       onEnded={trackComplete}
 *       onSeeked={(e) => trackSeek(e.target.currentTime)}
 *     >
 *       ...
 *     </video>
 *   );
 * }
 * ```
 */
export declare function useVideoTracking(videoId: string, videoTitle: string, provider?: string): {
    trackPlay: any;
    trackPause: any;
    trackComplete: any;
    trackSeek: any;
    trackError: any;
};
/**
 * Hook for performance tracking
 *
 * @description React hook that tracks component render performance
 * @param {string} componentName - Component name
 * @returns {void}
 *
 * @example
 * ```tsx
 * function ExpensiveComponent() {
 *   usePerformanceTracking('ExpensiveComponent');
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export declare function usePerformanceTracking(componentName: string): void;
declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
        analytics: any;
        hj: any;
        clarity: any;
    }
}
declare const _default: {
    initializeAnalytics: typeof initializeAnalytics;
    getAnalyticsConfig: typeof getAnalyticsConfig;
    setDebugMode: typeof setDebugMode;
    trackPageView: typeof trackPageView;
    trackEvent: typeof trackEvent;
    trackConversion: typeof trackConversion;
    identifyUser: typeof identifyUser;
    setUserProperties: typeof setUserProperties;
    resetUser: typeof resetUser;
    setCustomDimension: typeof setCustomDimension;
    setCustomMetric: typeof setCustomMetric;
    trackProductView: typeof trackProductView;
    trackAddToCart: typeof trackAddToCart;
    trackRemoveFromCart: typeof trackRemoveFromCart;
    trackBeginCheckout: typeof trackBeginCheckout;
    trackPurchase: typeof trackPurchase;
    trackRefund: typeof trackRefund;
    trackScrollDepth: typeof trackScrollDepth;
    trackReadingTime: typeof trackReadingTime;
    trackContentEngagement: typeof trackContentEngagement;
    trackVideoInteraction: typeof trackVideoInteraction;
    trackMediaDownload: typeof trackMediaDownload;
    trackFormInteraction: typeof trackFormInteraction;
    trackFormError: typeof trackFormError;
    trackError: typeof trackError;
    track404: typeof track404;
    trackExperimentVariant: typeof trackExperimentVariant;
    trackExperimentConversion: typeof trackExperimentConversion;
    trackPerformanceMetric: typeof trackPerformanceMetric;
    trackWebVitals: typeof trackWebVitals;
    trackSearch: typeof trackSearch;
    setConsent: typeof setConsent;
    getConsent: typeof getConsent;
    hasConsent: typeof hasConsent;
    initializeHeatmap: typeof initializeHeatmap;
    triggerHeatmapEvent: typeof triggerHeatmapEvent;
    getCurrentSession: typeof getCurrentSession;
    endSession: typeof endSession;
    useTracking: typeof useTracking;
    usePageView: typeof usePageView;
    useEvent: typeof useEvent;
    useEcommerceTracking: typeof useEcommerceTracking;
    useScrollDepth: typeof useScrollDepth;
    useReadingTime: typeof useReadingTime;
    useFormTracking: typeof useFormTracking;
    useVideoTracking: typeof useVideoTracking;
    usePerformanceTracking: typeof usePerformanceTracking;
};
export default _default;
//# sourceMappingURL=analytics-tracking-kit.d.ts.map