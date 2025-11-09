"use strict";
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
'use client';
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAnalytics = initializeAnalytics;
exports.getAnalyticsConfig = getAnalyticsConfig;
exports.setDebugMode = setDebugMode;
exports.initializeGA4 = initializeGA4;
exports.initializeGTM = initializeGTM;
exports.initializeSegment = initializeSegment;
exports.createSession = createSession;
exports.getCurrentSession = getCurrentSession;
exports.updateSessionActivity = updateSessionActivity;
exports.generateSessionId = generateSessionId;
exports.endSession = endSession;
exports.trackPageView = trackPageView;
exports.trackEvent = trackEvent;
exports.trackConversion = trackConversion;
exports.identifyUser = identifyUser;
exports.setUserProperties = setUserProperties;
exports.resetUser = resetUser;
exports.setCustomDimension = setCustomDimension;
exports.setCustomMetric = setCustomMetric;
exports.trackProductView = trackProductView;
exports.trackAddToCart = trackAddToCart;
exports.trackRemoveFromCart = trackRemoveFromCart;
exports.trackBeginCheckout = trackBeginCheckout;
exports.trackPurchase = trackPurchase;
exports.trackRefund = trackRefund;
exports.trackScrollDepth = trackScrollDepth;
exports.trackReadingTime = trackReadingTime;
exports.trackContentEngagement = trackContentEngagement;
exports.trackVideoInteraction = trackVideoInteraction;
exports.trackMediaDownload = trackMediaDownload;
exports.trackFormInteraction = trackFormInteraction;
exports.trackFormError = trackFormError;
exports.trackError = trackError;
exports.track404 = track404;
exports.trackExperimentVariant = trackExperimentVariant;
exports.trackExperimentConversion = trackExperimentConversion;
exports.trackPerformanceMetric = trackPerformanceMetric;
exports.trackWebVitals = trackWebVitals;
exports.trackSearch = trackSearch;
exports.setConsent = setConsent;
exports.getConsent = getConsent;
exports.hasConsent = hasConsent;
exports.initializeHeatmap = initializeHeatmap;
exports.triggerHeatmapEvent = triggerHeatmapEvent;
exports.useTracking = useTracking;
exports.usePageView = usePageView;
exports.useEvent = useEvent;
exports.useEcommerceTracking = useEcommerceTracking;
exports.useScrollDepth = useScrollDepth;
exports.useReadingTime = useReadingTime;
exports.useFormTracking = useFormTracking;
exports.useVideoTracking = useVideoTracking;
exports.usePerformanceTracking = usePerformanceTracking;
const react_1 = require("react");
// ============================================================================
// Global State Management
// ============================================================================
let globalConfig = null;
let globalConsent = {
    analytics: false,
    marketing: false,
    functional: false,
    necessary: true,
};
let currentUserId = null;
let currentSession = null;
let debugMode = false;
// ============================================================================
// Configuration Functions
// ============================================================================
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
function initializeAnalytics(config) {
    globalConfig = config;
    debugMode = config.debug || false;
    if (debugMode) {
        console.log('[Analytics] Initialized with config:', config);
    }
    // Initialize based on provider
    switch (config.provider) {
        case 'ga4':
            initializeGA4(config);
            break;
        case 'gtm':
            initializeGTM(config);
            break;
        case 'segment':
            initializeSegment(config);
            break;
        default:
            if (debugMode) {
                console.log('[Analytics] Custom provider initialized');
            }
    }
    // Initialize session
    currentSession = createSession();
}
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
function getAnalyticsConfig() {
    return globalConfig;
}
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
function setDebugMode(enabled) {
    debugMode = enabled;
    if (globalConfig) {
        globalConfig.debug = enabled;
    }
}
// ============================================================================
// Provider Initialization Functions
// ============================================================================
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
function initializeGA4(config) {
    if (typeof window === 'undefined' || !config.measurementId)
        return;
    // Load gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`;
    document.head.appendChild(script);
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
        window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', config.measurementId, {
        anonymize_ip: config.anonymizeIp,
        cookie_domain: config.cookieDomain,
        cookie_expires: config.cookieExpires,
        sample_rate: config.sampleRate,
        site_speed_sample_rate: config.siteSpeedSampleRate,
    });
    if (debugMode) {
        console.log('[Analytics] GA4 initialized:', config.measurementId);
    }
}
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
function initializeGTM(config) {
    if (typeof window === 'undefined' || !config.containerId)
        return;
    // Initialize data layer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
    });
    // Load GTM script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${config.containerId}`;
    document.head.appendChild(script);
    if (debugMode) {
        console.log('[Analytics] GTM initialized:', config.containerId);
    }
}
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
function initializeSegment(config) {
    if (typeof window === 'undefined' || !config.writeKey)
        return;
    const analytics = (window.analytics = window.analytics || []);
    if (analytics.initialize)
        return;
    analytics.invoked = true;
    analytics.methods = [
        'trackSubmit',
        'trackClick',
        'trackLink',
        'trackForm',
        'pageview',
        'identify',
        'reset',
        'group',
        'track',
        'ready',
        'alias',
        'debug',
        'page',
        'once',
        'off',
        'on',
    ];
    analytics.factory = function (method) {
        return function () {
            const args = Array.prototype.slice.call(arguments);
            args.unshift(method);
            analytics.push(args);
            return analytics;
        };
    };
    for (let i = 0; i < analytics.methods.length; i++) {
        const key = analytics.methods[i];
        analytics[key] = analytics.factory(key);
    }
    analytics.load = function (key, options) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = `https://cdn.segment.com/analytics.js/v1/${key}/analytics.min.js`;
        const first = document.getElementsByTagName('script')[0];
        first.parentNode?.insertBefore(script, first);
        analytics._loadOptions = options;
    };
    analytics.SNIPPET_VERSION = '4.13.2';
    analytics.load(config.writeKey);
    if (debugMode) {
        console.log('[Analytics] Segment initialized:', config.writeKey);
    }
}
// ============================================================================
// Session Management
// ============================================================================
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
function createSession() {
    return {
        sessionId: generateSessionId(),
        startTime: Date.now(),
        lastActivityTime: Date.now(),
        pageViews: 0,
        events: 0,
    };
}
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
function getCurrentSession() {
    if (!currentSession) {
        currentSession = createSession();
    }
    // Update session duration
    currentSession.duration = Date.now() - currentSession.startTime;
    return currentSession;
}
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
function updateSessionActivity() {
    if (currentSession) {
        currentSession.lastActivityTime = Date.now();
    }
}
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
function generateSessionId() {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
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
function endSession(trackSessionEnd = true) {
    if (!currentSession)
        return;
    currentSession.duration = Date.now() - currentSession.startTime;
    if (trackSessionEnd) {
        trackEvent('session_end', {
            session_id: currentSession.sessionId,
            duration: currentSession.duration,
            page_views: currentSession.pageViews,
            events: currentSession.events,
        });
    }
    currentSession = null;
}
// ============================================================================
// Core Tracking Functions
// ============================================================================
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
function trackPageView(pageData) {
    if (!globalConsent.analytics || typeof window === 'undefined')
        return;
    const session = getCurrentSession();
    session.pageViews++;
    const data = {
        path: pageData?.path || window.location.pathname,
        title: pageData?.title || document.title,
        referrer: pageData?.referrer || document.referrer,
        search: pageData?.search || window.location.search,
        hash: pageData?.hash || window.location.hash,
        url: pageData?.url || window.location.href,
        hostname: pageData?.hostname || window.location.hostname,
    };
    if (debugMode) {
        console.log('[Analytics] Page view:', data);
    }
    // Send to provider
    if (globalConfig?.provider === 'ga4' && window.gtag) {
        window.gtag('event', 'page_view', {
            page_path: data.path,
            page_title: data.title,
            page_location: data.url,
        });
    }
    else if (globalConfig?.provider === 'gtm' && window.dataLayer) {
        window.dataLayer.push({
            event: 'page_view',
            page: data,
        });
    }
    else if (globalConfig?.provider === 'segment' && window.analytics) {
        window.analytics.page(data.title, {
            path: data.path,
            url: data.url,
            referrer: data.referrer,
        });
    }
}
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
function trackEvent(eventName, parameters) {
    if (!globalConsent.analytics)
        return;
    const session = getCurrentSession();
    session.events++;
    updateSessionActivity();
    const event = {
        name: eventName,
        parameters,
        timestamp: Date.now(),
        userId: currentUserId || undefined,
        sessionId: session.sessionId,
    };
    if (debugMode) {
        console.log('[Analytics] Event:', event);
    }
    // Send to provider
    if (globalConfig?.provider === 'ga4' && window.gtag) {
        window.gtag('event', eventName, parameters);
    }
    else if (globalConfig?.provider === 'gtm' && window.dataLayer) {
        window.dataLayer.push({
            event: eventName,
            ...parameters,
        });
    }
    else if (globalConfig?.provider === 'segment' && window.analytics) {
        window.analytics.track(eventName, parameters);
    }
}
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
function trackConversion(conversion) {
    if (!globalConsent.analytics)
        return;
    if (debugMode) {
        console.log('[Analytics] Conversion:', conversion);
    }
    trackEvent(conversion.name, {
        value: conversion.value,
        currency: conversion.currency,
        transaction_id: conversion.transactionId,
        ...conversion.parameters,
    });
}
// ============================================================================
// User Identification Functions
// ============================================================================
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
function identifyUser(userId, properties) {
    if (!globalConsent.analytics)
        return;
    currentUserId = userId;
    if (debugMode) {
        console.log('[Analytics] Identify user:', userId, properties);
    }
    // Send to provider
    if (globalConfig?.provider === 'ga4' && window.gtag) {
        window.gtag('config', globalConfig.measurementId, {
            user_id: userId,
        });
        if (properties) {
            window.gtag('set', 'user_properties', properties);
        }
    }
    else if (globalConfig?.provider === 'gtm' && window.dataLayer) {
        window.dataLayer.push({
            event: 'user_identify',
            userId,
            userProperties: properties,
        });
    }
    else if (globalConfig?.provider === 'segment' && window.analytics) {
        window.analytics.identify(userId, properties);
    }
}
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
function setUserProperties(properties) {
    if (!globalConsent.analytics)
        return;
    if (debugMode) {
        console.log('[Analytics] Set user properties:', properties);
    }
    if (globalConfig?.provider === 'ga4' && window.gtag) {
        window.gtag('set', 'user_properties', properties);
    }
    else if (globalConfig?.provider === 'gtm' && window.dataLayer) {
        window.dataLayer.push({
            event: 'user_properties_update',
            userProperties: properties,
        });
    }
    else if (globalConfig?.provider === 'segment' && window.analytics) {
        window.analytics.identify(properties);
    }
}
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
function resetUser() {
    currentUserId = null;
    if (debugMode) {
        console.log('[Analytics] Reset user');
    }
    if (globalConfig?.provider === 'segment' && window.analytics) {
        window.analytics.reset();
    }
    // Start new session
    currentSession = createSession();
}
// ============================================================================
// Custom Dimensions and Metrics
// ============================================================================
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
function setCustomDimension(dimension) {
    if (!globalConsent.analytics)
        return;
    if (debugMode) {
        console.log('[Analytics] Custom dimension:', dimension);
    }
    if (globalConfig?.provider === 'ga4' && window.gtag) {
        window.gtag('set', {
            [`dimension${dimension.index}`]: dimension.value,
        });
    }
    else if (globalConfig?.provider === 'gtm' && window.dataLayer) {
        window.dataLayer.push({
            event: 'custom_dimension',
            dimensionIndex: dimension.index,
            dimensionName: dimension.name,
            dimensionValue: dimension.value,
        });
    }
}
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
function setCustomMetric(metric) {
    if (!globalConsent.analytics)
        return;
    if (debugMode) {
        console.log('[Analytics] Custom metric:', metric);
    }
    if (globalConfig?.provider === 'ga4' && window.gtag) {
        window.gtag('set', {
            [`metric${metric.index}`]: metric.value,
        });
    }
    else if (globalConfig?.provider === 'gtm' && window.dataLayer) {
        window.dataLayer.push({
            event: 'custom_metric',
            metricIndex: metric.index,
            metricName: metric.name,
            metricValue: metric.value,
        });
    }
}
// ============================================================================
// Ecommerce Tracking Functions
// ============================================================================
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
function trackProductView(item) {
    if (!globalConsent.analytics)
        return;
    trackEvent('view_item', {
        currency: item.currency || 'USD',
        value: item.price,
        items: [item],
    });
}
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
function trackAddToCart(item) {
    if (!globalConsent.analytics)
        return;
    trackEvent('add_to_cart', {
        currency: item.currency || 'USD',
        value: item.price * item.quantity,
        items: [item],
    });
}
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
function trackRemoveFromCart(item) {
    if (!globalConsent.analytics)
        return;
    trackEvent('remove_from_cart', {
        currency: item.currency || 'USD',
        value: item.price * item.quantity,
        items: [item],
    });
}
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
function trackBeginCheckout(items, value, currency = 'USD') {
    if (!globalConsent.analytics)
        return;
    trackEvent('begin_checkout', {
        currency,
        value,
        items,
    });
}
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
function trackPurchase(transaction) {
    if (!globalConsent.analytics)
        return;
    if (debugMode) {
        console.log('[Analytics] Purchase:', transaction);
    }
    trackEvent('purchase', {
        transaction_id: transaction.transactionId,
        value: transaction.value,
        currency: transaction.currency,
        tax: transaction.tax,
        shipping: transaction.shipping,
        coupon: transaction.coupon,
        affiliation: transaction.affiliation,
        items: transaction.items,
    });
}
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
function trackRefund(transactionId, value, currency = 'USD') {
    if (!globalConsent.analytics)
        return;
    trackEvent('refund', {
        transaction_id: transactionId,
        value,
        currency,
    });
}
// ============================================================================
// Content Engagement Tracking
// ============================================================================
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
function trackScrollDepth(percentage, contentId) {
    if (!globalConsent.analytics)
        return;
    trackEvent('scroll_depth', {
        scroll_percentage: percentage,
        content_id: contentId,
    });
}
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
function trackReadingTime(seconds, contentId, contentType) {
    if (!globalConsent.analytics)
        return;
    trackEvent('reading_time', {
        reading_time: seconds,
        content_id: contentId,
        content_type: contentType,
    });
}
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
function trackContentEngagement(engagement) {
    if (!globalConsent.analytics)
        return;
    trackEvent('content_engagement', {
        content_id: engagement.contentId,
        content_type: engagement.contentType,
        reading_time: engagement.readingTime,
        scroll_depth: engagement.scrollDepth,
        time_on_page: engagement.timeOnPage,
        engagement_score: engagement.engagementScore,
    });
}
// ============================================================================
// Video and Media Tracking
// ============================================================================
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
function trackVideoInteraction(video) {
    if (!globalConsent.analytics)
        return;
    trackEvent(`video_${video.action}`, {
        video_id: video.videoId,
        video_title: video.videoTitle,
        video_provider: video.provider,
        video_duration: video.duration,
        video_current_time: video.currentTime,
        video_percent: video.percentWatched,
    });
}
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
function trackMediaDownload(mediaId, mediaType, fileName) {
    if (!globalConsent.analytics)
        return;
    trackEvent('media_download', {
        media_id: mediaId,
        media_type: mediaType,
        file_name: fileName,
    });
}
// ============================================================================
// Form Tracking
// ============================================================================
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
function trackFormInteraction(form) {
    if (!globalConsent.analytics)
        return;
    trackEvent(`form_${form.action}`, {
        form_id: form.formId,
        form_name: form.formName,
        field_name: form.fieldName,
        field_type: form.fieldType,
        errors: form.errors?.join(', '),
        completion_time: form.completionTime,
    });
}
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
function trackFormError(formId, fieldName, errorMessage) {
    if (!globalConsent.analytics)
        return;
    trackFormInteraction({
        formId,
        fieldName,
        action: 'error',
        errors: [errorMessage],
    });
}
// ============================================================================
// Error Tracking
// ============================================================================
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
function trackError(error) {
    if (!globalConsent.analytics)
        return;
    trackEvent('error', {
        error_message: error.errorMessage,
        error_type: error.errorType,
        error_stack: error.errorStack,
        component_stack: error.componentStack,
        error_boundary: error.errorBoundary,
        user_id: error.userId || currentUserId,
        url: error.url || (typeof window !== 'undefined' ? window.location.href : undefined),
        user_agent: error.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : undefined),
        severity: error.severity,
    });
}
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
function track404(path, referrer) {
    if (!globalConsent.analytics)
        return;
    trackEvent('404_error', {
        path,
        referrer,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
    });
}
// ============================================================================
// A/B Testing and Experiments
// ============================================================================
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
function trackExperimentVariant(variant) {
    if (!globalConsent.analytics)
        return;
    trackEvent('experiment_variant', {
        experiment_id: variant.experimentId,
        experiment_name: variant.experimentName,
        variant_id: variant.variantId,
        variant_name: variant.variantName,
    });
    // Set as user property for segmentation
    setUserProperties({
        [`exp_${variant.experimentId}`]: variant.variantId,
    });
}
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
function trackExperimentConversion(experimentId, variantId, goalName, value) {
    if (!globalConsent.analytics)
        return;
    trackEvent('experiment_conversion', {
        experiment_id: experimentId,
        variant_id: variantId,
        goal_name: goalName,
        value,
    });
}
// ============================================================================
// Performance Metrics and Web Vitals
// ============================================================================
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
function trackPerformanceMetric(metric) {
    if (!globalConsent.analytics)
        return;
    trackEvent('web_vitals', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        metric_delta: metric.delta,
        metric_id: metric.id,
        navigation_type: metric.navigationType,
    });
}
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
function trackWebVitals() {
    if (!globalConsent.analytics || typeof window === 'undefined')
        return;
    // This would typically use the web-vitals library
    // For now, we'll track basic performance metrics
    if ('PerformanceObserver' in window) {
        // Track Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
                trackPerformanceMetric({
                    name: 'LCP',
                    value: lastEntry.renderTime || lastEntry.loadTime,
                    rating: lastEntry.renderTime < 2500 ? 'good' : lastEntry.renderTime < 4000 ? 'needs-improvement' : 'poor',
                });
            }
        });
        try {
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        }
        catch (e) {
            // LCP not supported
        }
        // Track First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                trackPerformanceMetric({
                    name: 'FID',
                    value: entry.processingStart - entry.startTime,
                    rating: entry.processingStart - entry.startTime < 100 ? 'good' : entry.processingStart - entry.startTime < 300 ? 'needs-improvement' : 'poor',
                });
            });
        });
        try {
            fidObserver.observe({ type: 'first-input', buffered: true });
        }
        catch (e) {
            // FID not supported
        }
    }
}
// ============================================================================
// Search Tracking
// ============================================================================
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
function trackSearch(search) {
    if (!globalConsent.analytics)
        return;
    trackEvent('search', {
        search_term: search.searchTerm,
        search_results: search.searchResults,
        search_category: search.searchCategory,
        search_filters: search.searchFilters ? JSON.stringify(search.searchFilters) : undefined,
        result_clicked: search.resultClicked,
    });
}
// ============================================================================
// Consent Management
// ============================================================================
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
function setConsent(consent) {
    globalConsent = {
        ...consent,
        timestamp: Date.now(),
        version: '1.0',
    };
    if (debugMode) {
        console.log('[Analytics] Consent updated:', globalConsent);
    }
    // Update GA4 consent mode
    if (globalConfig?.provider === 'ga4' && window.gtag) {
        window.gtag('consent', 'update', {
            analytics_storage: consent.analytics ? 'granted' : 'denied',
            ad_storage: consent.marketing ? 'granted' : 'denied',
            functionality_storage: consent.functional ? 'granted' : 'denied',
            security_storage: 'granted',
        });
    }
    trackEvent('consent_update', {
        analytics: consent.analytics,
        marketing: consent.marketing,
        functional: consent.functional,
    });
}
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
function getConsent() {
    return globalConsent;
}
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
function hasConsent(purpose) {
    return globalConsent[purpose] === true;
}
// ============================================================================
// Heatmap and Session Recording
// ============================================================================
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
function initializeHeatmap(config) {
    if (typeof window === 'undefined')
        return;
    if (config.provider === 'hotjar' && config.siteId) {
        (function (h, o, t, j, a, r) {
            h.hj =
                h.hj ||
                    function () {
                        (h.hj.q = h.hj.q || []).push(arguments);
                    };
            h._hjSettings = { hjid: config.siteId, hjsv: 6 };
            a = o.getElementsByTagName('head')[0];
            r = o.createElement('script');
            r.async = 1;
            r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
            a.appendChild(r);
        })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
        if (debugMode) {
            console.log('[Analytics] Hotjar initialized:', config.siteId);
        }
    }
    else if (config.provider === 'clarity' && config.trackingCode) {
        (function (c, l, a, r, i, t, y) {
            c[a] =
                c[a] ||
                    function () {
                        (c[a].q = c[a].q || []).push(arguments);
                    };
            t = l.createElement(r);
            t.async = 1;
            t.src = 'https://www.clarity.ms/tag/' + i;
            y = l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t, y);
        })(window, document, 'clarity', 'script', config.trackingCode);
        if (debugMode) {
            console.log('[Analytics] Microsoft Clarity initialized:', config.trackingCode);
        }
    }
}
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
function triggerHeatmapEvent(eventName, parameters) {
    if (typeof window === 'undefined')
        return;
    // Hotjar
    if (window.hj) {
        window.hj('event', eventName);
    }
    // Microsoft Clarity
    if (window.clarity) {
        window.clarity('set', eventName, parameters);
    }
}
// ============================================================================
// React Hooks
// ============================================================================
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
function useTracking() {
    const [isInitialized, setIsInitialized] = (0, react_1.useState)(!!globalConfig);
    (0, react_1.useEffect)(() => {
        setIsInitialized(!!globalConfig);
    }, []);
    const track = (0, react_1.useCallback)((eventName, parameters) => {
        trackEvent(eventName, parameters);
    }, []);
    const identify = (0, react_1.useCallback)((userId, properties) => {
        identifyUser(userId, properties);
    }, []);
    const reset = (0, react_1.useCallback)(() => {
        resetUser();
    }, []);
    const updateConsent = (0, react_1.useCallback)((consent) => {
        setConsent(consent);
    }, []);
    return {
        track,
        identify,
        reset,
        isInitialized,
        setConsent: updateConsent,
    };
}
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
function usePageView(pageData) {
    const hasTracked = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (!hasTracked.current) {
            trackPageView(pageData);
            hasTracked.current = true;
        }
    }, [pageData]);
}
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
function useEvent(eventName, baseParameters) {
    return (0, react_1.useCallback)((parameters) => {
        trackEvent(eventName, { ...baseParameters, ...parameters });
    }, [eventName, baseParameters]);
}
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
function useEcommerceTracking() {
    const trackView = (0, react_1.useCallback)((item) => {
        trackProductView(item);
    }, []);
    const trackAdd = (0, react_1.useCallback)((item) => {
        trackAddToCart(item);
    }, []);
    const trackRemove = (0, react_1.useCallback)((item) => {
        trackRemoveFromCart(item);
    }, []);
    const trackCheckout = (0, react_1.useCallback)((items, value, currency = 'USD') => {
        trackBeginCheckout(items, value, currency);
    }, []);
    const trackTransaction = (0, react_1.useCallback)((transaction) => {
        trackPurchase(transaction);
    }, []);
    return {
        trackView,
        trackAddToCart: trackAdd,
        trackRemoveFromCart: trackRemove,
        trackBeginCheckout: trackCheckout,
        trackPurchase: trackTransaction,
    };
}
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
function useScrollDepth(contentId, milestones = [25, 50, 75, 100]) {
    const trackedMilestones = (0, react_1.useRef)(new Set());
    (0, react_1.useEffect)(() => {
        if (!globalConsent.analytics || typeof window === 'undefined')
            return;
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            for (const milestone of milestones) {
                if (scrollPercentage >= milestone && !trackedMilestones.current.has(milestone)) {
                    trackedMilestones.current.add(milestone);
                    trackScrollDepth(milestone, contentId);
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [contentId, milestones]);
}
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
function useReadingTime(contentId, contentType) {
    const [readingTime, setReadingTime] = (0, react_1.useState)(0);
    const startTime = (0, react_1.useRef)(Date.now());
    const intervalRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!globalConsent.analytics)
            return;
        intervalRef.current = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
            setReadingTime(elapsed);
        }, 1000);
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            // Track final reading time on unmount
            const finalTime = Math.floor((Date.now() - startTime.current) / 1000);
            if (finalTime > 0) {
                trackReadingTime(finalTime, contentId, contentType);
            }
        };
    }, [contentId, contentType]);
    return readingTime;
}
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
function useFormTracking(formId, formName) {
    const startTime = (0, react_1.useRef)(null);
    const trackStart = (0, react_1.useCallback)(() => {
        startTime.current = Date.now();
        trackFormInteraction({
            formId,
            formName,
            action: 'start',
        });
    }, [formId, formName]);
    const trackComplete = (0, react_1.useCallback)(() => {
        const completionTime = startTime.current ? Math.floor((Date.now() - startTime.current) / 1000) : undefined;
        trackFormInteraction({
            formId,
            formName,
            action: 'complete',
            completionTime,
        });
    }, [formId, formName]);
    const trackAbandon = (0, react_1.useCallback)(() => {
        trackFormInteraction({
            formId,
            formName,
            action: 'abandon',
        });
    }, [formId, formName]);
    const trackFieldInteraction = (0, react_1.useCallback)((fieldName, fieldType) => {
        trackFormInteraction({
            formId,
            formName,
            fieldName,
            fieldType,
            action: 'field_interaction',
        });
    }, [formId, formName]);
    const trackErrorEvent = (0, react_1.useCallback)((fieldName, errorMessage) => {
        trackFormError(formId, fieldName, errorMessage);
    }, [formId]);
    return {
        trackStart,
        trackComplete,
        trackAbandon,
        trackFieldInteraction,
        trackError: trackErrorEvent,
    };
}
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
function useVideoTracking(videoId, videoTitle, provider) {
    const trackPlay = (0, react_1.useCallback)((currentTime, duration) => {
        trackVideoInteraction({
            videoId,
            videoTitle,
            provider,
            action: 'play',
            currentTime,
            duration,
        });
    }, [videoId, videoTitle, provider]);
    const trackPause = (0, react_1.useCallback)((currentTime, duration) => {
        trackVideoInteraction({
            videoId,
            videoTitle,
            provider,
            action: 'pause',
            currentTime,
            duration,
        });
    }, [videoId, videoTitle, provider]);
    const trackComplete = (0, react_1.useCallback)((duration) => {
        trackVideoInteraction({
            videoId,
            videoTitle,
            provider,
            action: 'complete',
            currentTime: duration,
            duration,
            percentWatched: 100,
        });
    }, [videoId, videoTitle, provider]);
    const trackSeek = (0, react_1.useCallback)((currentTime, duration) => {
        trackVideoInteraction({
            videoId,
            videoTitle,
            provider,
            action: 'seek',
            currentTime,
            duration,
        });
    }, [videoId, videoTitle, provider]);
    const trackErrorEvent = (0, react_1.useCallback)(() => {
        trackVideoInteraction({
            videoId,
            videoTitle,
            provider,
            action: 'error',
        });
    }, [videoId, videoTitle, provider]);
    return {
        trackPlay,
        trackPause,
        trackComplete,
        trackSeek,
        trackError: trackErrorEvent,
    };
}
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
function usePerformanceTracking(componentName) {
    const renderCount = (0, react_1.useRef)(0);
    const renderStartTime = (0, react_1.useRef)(Date.now());
    (0, react_1.useEffect)(() => {
        renderCount.current++;
        const renderTime = Date.now() - renderStartTime.current;
        if (renderTime > 100) {
            // Track slow renders (> 100ms)
            trackEvent('slow_render', {
                component_name: componentName,
                render_time: renderTime,
                render_count: renderCount.current,
            });
        }
        renderStartTime.current = Date.now();
    });
}
// ============================================================================
// Default Export
// ============================================================================
exports.default = {
    // Configuration
    initializeAnalytics,
    getAnalyticsConfig,
    setDebugMode,
    // Core tracking
    trackPageView,
    trackEvent,
    trackConversion,
    // User identification
    identifyUser,
    setUserProperties,
    resetUser,
    // Custom dimensions & metrics
    setCustomDimension,
    setCustomMetric,
    // Ecommerce
    trackProductView,
    trackAddToCart,
    trackRemoveFromCart,
    trackBeginCheckout,
    trackPurchase,
    trackRefund,
    // Content engagement
    trackScrollDepth,
    trackReadingTime,
    trackContentEngagement,
    // Media tracking
    trackVideoInteraction,
    trackMediaDownload,
    // Form tracking
    trackFormInteraction,
    trackFormError,
    // Error tracking
    trackError,
    track404,
    // A/B testing
    trackExperimentVariant,
    trackExperimentConversion,
    // Performance
    trackPerformanceMetric,
    trackWebVitals,
    // Search
    trackSearch,
    // Consent
    setConsent,
    getConsent,
    hasConsent,
    // Heatmap
    initializeHeatmap,
    triggerHeatmapEvent,
    // Session
    getCurrentSession,
    endSession,
    // React hooks
    useTracking,
    usePageView,
    useEvent,
    useEcommerceTracking,
    useScrollDepth,
    useReadingTime,
    useFormTracking,
    useVideoTracking,
    usePerformanceTracking,
};
//# sourceMappingURL=analytics-tracking-kit.js.map