"use strict";
/**
 * @fileoverview SEO Optimization Kit for Next.js 16/React
 * @module @reuse/frontend/seo-optimization-kit
 * @description Comprehensive SEO utilities, hooks, and components for Next.js 16 applications
 *
 * Features:
 * - Meta tag management and optimization
 * - Structured data (JSON-LD, Schema.org)
 * - Open Graph and Twitter Cards
 * - SEO analysis and scoring
 * - Keyword optimization
 * - Sitemap and RSS generation
 * - Core Web Vitals monitoring
 * - Image SEO optimization
 * - Robots and indexing control
 *
 * @example
 * ```tsx
 * // Basic usage with Next.js 16
 * import { useSEO, generateMetaTags, StructuredData } from '@reuse/frontend/seo-optimization-kit';
 *
 * export default function Page() {
 *   const { seo, updateSEO } = useSEO({
 *     title: 'My Page',
 *     description: 'Page description',
 *   });
 *
 *   return (
 *     <>
 *       <StructuredData type="Article" data={articleData} />
 *       <h1>{seo.title}</h1>
 *     </>
 *   );
 * }
 * ```
 */
'use client';
/**
 * @fileoverview SEO Optimization Kit for Next.js 16/React
 * @module @reuse/frontend/seo-optimization-kit
 * @description Comprehensive SEO utilities, hooks, and components for Next.js 16 applications
 *
 * Features:
 * - Meta tag management and optimization
 * - Structured data (JSON-LD, Schema.org)
 * - Open Graph and Twitter Cards
 * - SEO analysis and scoring
 * - Keyword optimization
 * - Sitemap and RSS generation
 * - Core Web Vitals monitoring
 * - Image SEO optimization
 * - Robots and indexing control
 *
 * @example
 * ```tsx
 * // Basic usage with Next.js 16
 * import { useSEO, generateMetaTags, StructuredData } from '@reuse/frontend/seo-optimization-kit';
 *
 * export default function Page() {
 *   const { seo, updateSEO } = useSEO({
 *     title: 'My Page',
 *     description: 'Page description',
 *   });
 *
 *   return (
 *     <>
 *       <StructuredData type="Article" data={articleData} />
 *       <h1>{seo.title}</h1>
 *     </>
 *   );
 * }
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSEO = useSEO;
exports.useMetaTags = useMetaTags;
exports.useStructuredData = useStructuredData;
exports.useCoreWebVitals = useCoreWebVitals;
exports.useSEOTracking = useSEOTracking;
exports.generateMetaTags = generateMetaTags;
exports.optimizeMetaTags = optimizeMetaTags;
exports.mergeMetaTags = mergeMetaTags;
exports.generateOpenGraphTags = generateOpenGraphTags;
exports.generateTwitterCardTags = generateTwitterCardTags;
exports.generateSocialMetaTags = generateSocialMetaTags;
exports.generateJSONLD = generateJSONLD;
exports.generateArticleSchema = generateArticleSchema;
exports.generateBreadcrumbSchema = generateBreadcrumbSchema;
exports.generateOrganizationSchema = generateOrganizationSchema;
exports.generateProductSchema = generateProductSchema;
exports.generateFAQSchema = generateFAQSchema;
exports.formatRobotsContent = formatRobotsContent;
exports.generateRobotsMetaTag = generateRobotsMetaTag;
exports.generateIndexingControl = generateIndexingControl;
exports.generateCrawlingDirectives = generateCrawlingDirectives;
exports.generateCanonicalURL = generateCanonicalURL;
exports.generateHrefLangLinks = generateHrefLangLinks;
exports.generateAlternateLinks = generateAlternateLinks;
exports.analyzeSEOScore = analyzeSEOScore;
exports.analyzeTitleSEO = analyzeTitleSEO;
exports.analyzeDescriptionSEO = analyzeDescriptionSEO;
exports.analyzeKeywordsSEO = analyzeKeywordsSEO;
exports.analyzeHeadingsSEO = analyzeHeadingsSEO;
exports.analyzeImagesSEO = analyzeImagesSEO;
exports.analyzeLinksSEO = analyzeLinksSEO;
exports.optimizeTitle = optimizeTitle;
exports.optimizeDescription = optimizeDescription;
exports.analyzeKeyword = analyzeKeyword;
exports.generateKeywordSuggestions = generateKeywordSuggestions;
exports.generateSitemap = generateSitemap;
exports.generateRSSFeed = generateRSSFeed;
exports.generateSlug = generateSlug;
exports.optimizeURL = optimizeURL;
exports.createRedirect = createRedirect;
exports.generateImageAltText = generateImageAltText;
exports.optimizeImageSEO = optimizeImageSEO;
exports.generateResponsiveImageSrcset = generateResponsiveImageSrcset;
exports.getPageSpeedInsights = getPageSpeedInsights;
exports.monitorCoreWebVitals = monitorCoreWebVitals;
exports.SEOPreview = SEOPreview;
exports.SEOScoreComponent = SEOScoreComponent;
exports.StructuredData = StructuredData;
const react_1 = require("react");
// ============================================================================
// Hooks
// ============================================================================
/**
 * Main SEO hook for managing page SEO configuration
 *
 * @param initialConfig - Initial SEO configuration
 * @returns SEO state and update function
 *
 * @example
 * ```tsx
 * function Page() {
 *   const { seo, updateSEO } = useSEO({
 *     title: 'My Page',
 *     description: 'A great page',
 *   });
 *
 *   useEffect(() => {
 *     updateSEO({ keywords: ['keyword1', 'keyword2'] });
 *   }, []);
 *
 *   return <div>{seo.title}</div>;
 * }
 * ```
 */
function useSEO(initialConfig = {}) {
    const [seo, setSEO] = (0, react_1.useState)({
        title: '',
        description: '',
        ...initialConfig,
    });
    const updateSEO = (0, react_1.useCallback)((updates) => {
        setSEO((prev) => ({ ...prev, ...updates }));
    }, []);
    const resetSEO = (0, react_1.useCallback)(() => {
        setSEO({
            title: '',
            description: '',
            ...initialConfig,
        });
    }, [initialConfig]);
    return { seo, updateSEO, resetSEO };
}
/**
 * Hook for managing meta tags
 *
 * @param tags - Initial meta tags
 * @returns Meta tags state and management functions
 *
 * @example
 * ```tsx
 * function Page() {
 *   const { tags, addTag, removeTag } = useMetaTags([
 *     { name: 'author', content: 'John Doe' },
 *   ]);
 *
 *   return <Head>{tags.map((tag, i) => <meta key={i} {...tag} />)}</Head>;
 * }
 * ```
 */
function useMetaTags(initialTags = []) {
    const [tags, setTags] = (0, react_1.useState)(initialTags);
    const addTag = (0, react_1.useCallback)((tag) => {
        setTags((prev) => [...prev, tag]);
    }, []);
    const removeTag = (0, react_1.useCallback)((predicate) => {
        setTags((prev) => prev.filter((tag) => !predicate(tag)));
    }, []);
    const updateTag = (0, react_1.useCallback)((predicate, updates) => {
        setTags((prev) => prev.map((tag) => (predicate(tag) ? { ...tag, ...updates } : tag)));
    }, []);
    const clearTags = (0, react_1.useCallback)(() => {
        setTags([]);
    }, []);
    return { tags, addTag, removeTag, updateTag, clearTags };
}
/**
 * Hook for managing structured data
 *
 * @param initialData - Initial structured data array
 * @returns Structured data state and management functions
 *
 * @example
 * ```tsx
 * function ArticlePage() {
 *   const { data, addStructuredData } = useStructuredData();
 *
 *   useEffect(() => {
 *     addStructuredData({
 *       '@context': 'https://schema.org',
 *       '@type': 'Article',
 *       headline: 'My Article',
 *       author: { '@type': 'Person', name: 'John Doe' },
 *     });
 *   }, []);
 *
 *   return <script type="application/ld+json">{JSON.stringify(data)}</script>;
 * }
 * ```
 */
function useStructuredData(initialData = []) {
    const [data, setData] = (0, react_1.useState)(initialData);
    const addStructuredData = (0, react_1.useCallback)((schema) => {
        setData((prev) => [...prev, schema]);
    }, []);
    const removeStructuredData = (0, react_1.useCallback)((predicate) => {
        setData((prev) => prev.filter((schema) => !predicate(schema)));
    }, []);
    const clearStructuredData = (0, react_1.useCallback)(() => {
        setData([]);
    }, []);
    return { data, addStructuredData, removeStructuredData, clearStructuredData };
}
/**
 * Hook for monitoring Core Web Vitals
 *
 * @returns Core Web Vitals metrics
 *
 * @example
 * ```tsx
 * function PerformanceMonitor() {
 *   const vitals = useCoreWebVitals();
 *
 *   return (
 *     <div>
 *       <p>LCP: {vitals.LCP}ms</p>
 *       <p>FID: {vitals.FID}ms</p>
 *       <p>CLS: {vitals.CLS}</p>
 *     </div>
 *   );
 * }
 * ```
 */
function useCoreWebVitals() {
    const [vitals, setVitals] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        if (typeof window === 'undefined')
            return;
        // LCP - Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            setVitals((prev) => ({ ...prev, LCP: lastEntry.renderTime || lastEntry.loadTime }));
        });
        // FID - First Input Delay (deprecated, but still useful)
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                setVitals((prev) => ({ ...prev, FID: entry.processingStart - entry.startTime }));
            });
        });
        // CLS - Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    setVitals((prev) => ({ ...prev, CLS: clsValue }));
                }
            });
        });
        // INP - Interaction to Next Paint (new metric)
        const inpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                setVitals((prev) => ({ ...prev, INP: entry.duration }));
            });
        });
        try {
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
            fidObserver.observe({ type: 'first-input', buffered: true });
            clsObserver.observe({ type: 'layout-shift', buffered: true });
            inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 40 });
        }
        catch (e) {
            // Observers not supported
        }
        // FCP and TTFB from Navigation Timing
        const navEntry = performance.getEntriesByType('navigation')[0];
        if (navEntry) {
            setVitals((prev) => ({
                ...prev,
                FCP: navEntry.responseStart - navEntry.requestStart,
                TTFB: navEntry.responseStart - navEntry.requestStart,
            }));
        }
        return () => {
            lcpObserver.disconnect();
            fidObserver.disconnect();
            clsObserver.disconnect();
            inpObserver.disconnect();
        };
    }, []);
    return vitals;
}
/**
 * Hook for tracking SEO changes and analytics
 *
 * @param seoConfig - SEO configuration to track
 * @returns Tracking utilities
 *
 * @example
 * ```tsx
 * function Page() {
 *   const { seo } = useSEO({ title: 'My Page' });
 *   const { trackPageView, trackSEOChange } = useSEOTracking(seo);
 *
 *   useEffect(() => {
 *     trackPageView();
 *   }, []);
 * }
 * ```
 */
function useSEOTracking(seoConfig) {
    const previousConfig = (0, react_1.useRef)(seoConfig);
    const trackPageView = (0, react_1.useCallback)(() => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'page_view', {
                page_title: seoConfig.title,
                page_location: window.location.href,
            });
        }
    }, [seoConfig.title]);
    const trackSEOChange = (0, react_1.useCallback)((changes) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'seo_update', {
                changes: Object.keys(changes),
            });
        }
    }, []);
    (0, react_1.useEffect)(() => {
        const changed = Object.keys(seoConfig).filter((key) => seoConfig[key] !== previousConfig.current[key]);
        if (changed.length > 0) {
            const changes = {};
            changed.forEach((key) => {
                changes[key] = seoConfig[key];
            });
            trackSEOChange(changes);
        }
        previousConfig.current = seoConfig;
    }, [seoConfig, trackSEOChange]);
    return { trackPageView, trackSEOChange };
}
// ============================================================================
// Meta Tag Generation
// ============================================================================
/**
 * Generate meta tags from SEO configuration
 *
 * @param config - SEO configuration
 * @returns Array of meta tags
 *
 * @example
 * ```tsx
 * const metaTags = generateMetaTags({
 *   title: 'My Page',
 *   description: 'Page description',
 *   keywords: ['keyword1', 'keyword2'],
 * });
 * ```
 */
function generateMetaTags(config) {
    const tags = [];
    // Basic meta tags
    if (config.description) {
        tags.push({ name: 'description', content: config.description });
    }
    if (config.keywords && config.keywords.length > 0) {
        tags.push({ name: 'keywords', content: config.keywords.join(', ') });
    }
    // Robots
    if (config.robots) {
        tags.push({ name: 'robots', content: formatRobotsContent(config.robots) });
    }
    // Open Graph
    if (config.openGraph) {
        tags.push(...generateOpenGraphTags(config.openGraph));
    }
    // Twitter Card
    if (config.twitter) {
        tags.push(...generateTwitterCardTags(config.twitter));
    }
    return tags;
}
/**
 * Optimize meta tags for better SEO
 *
 * @param tags - Meta tags to optimize
 * @returns Optimized meta tags
 *
 * @example
 * ```tsx
 * const optimized = optimizeMetaTags(tags);
 * ```
 */
function optimizeMetaTags(tags) {
    const optimized = [...tags];
    // Remove duplicate tags
    const seen = new Set();
    return optimized.filter((tag) => {
        const key = `${tag.name || tag.property}:${tag.content}`;
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
}
/**
 * Merge multiple meta tag arrays
 *
 * @param tagArrays - Arrays of meta tags to merge
 * @returns Merged meta tags
 *
 * @example
 * ```tsx
 * const merged = mergeMetaTags(defaultTags, pageTags, customTags);
 * ```
 */
function mergeMetaTags(...tagArrays) {
    const merged = tagArrays.flat();
    return optimizeMetaTags(merged);
}
// ============================================================================
// Open Graph & Twitter Cards
// ============================================================================
/**
 * Generate Open Graph meta tags
 *
 * @param config - Open Graph configuration
 * @returns Array of Open Graph meta tags
 *
 * @example
 * ```tsx
 * const ogTags = generateOpenGraphTags({
 *   title: 'My Article',
 *   description: 'Article description',
 *   type: 'article',
 *   images: [{ url: 'https://example.com/image.jpg' }],
 * });
 * ```
 */
function generateOpenGraphTags(config) {
    const tags = [];
    tags.push({ property: 'og:title', content: config.title });
    tags.push({ property: 'og:description', content: config.description });
    if (config.url) {
        tags.push({ property: 'og:url', content: config.url });
    }
    if (config.siteName) {
        tags.push({ property: 'og:site_name', content: config.siteName });
    }
    if (config.type) {
        tags.push({ property: 'og:type', content: config.type });
    }
    if (config.locale) {
        tags.push({ property: 'og:locale', content: config.locale });
    }
    // Images
    if (config.images && config.images.length > 0) {
        config.images.forEach((image) => {
            tags.push({ property: 'og:image', content: image.url });
            if (image.width) {
                tags.push({ property: 'og:image:width', content: String(image.width) });
            }
            if (image.height) {
                tags.push({ property: 'og:image:height', content: String(image.height) });
            }
            if (image.alt) {
                tags.push({ property: 'og:image:alt', content: image.alt });
            }
            if (image.type) {
                tags.push({ property: 'og:image:type', content: image.type });
            }
        });
    }
    // Article-specific tags
    if (config.type === 'article' && config.article) {
        if (config.article.publishedTime) {
            tags.push({ property: 'article:published_time', content: config.article.publishedTime });
        }
        if (config.article.modifiedTime) {
            tags.push({ property: 'article:modified_time', content: config.article.modifiedTime });
        }
        if (config.article.author) {
            config.article.author.forEach((author) => {
                tags.push({ property: 'article:author', content: author });
            });
        }
        if (config.article.section) {
            tags.push({ property: 'article:section', content: config.article.section });
        }
        if (config.article.tags) {
            config.article.tags.forEach((tag) => {
                tags.push({ property: 'article:tag', content: tag });
            });
        }
    }
    return tags;
}
/**
 * Generate Twitter Card meta tags
 *
 * @param config - Twitter Card configuration
 * @returns Array of Twitter Card meta tags
 *
 * @example
 * ```tsx
 * const twitterTags = generateTwitterCardTags({
 *   card: 'summary_large_image',
 *   site: '@mysite',
 *   creator: '@author',
 *   title: 'My Article',
 *   description: 'Article description',
 *   images: ['https://example.com/image.jpg'],
 * });
 * ```
 */
function generateTwitterCardTags(config) {
    const tags = [];
    tags.push({ name: 'twitter:card', content: config.card });
    if (config.site) {
        tags.push({ name: 'twitter:site', content: config.site });
    }
    if (config.creator) {
        tags.push({ name: 'twitter:creator', content: config.creator });
    }
    if (config.title) {
        tags.push({ name: 'twitter:title', content: config.title });
    }
    if (config.description) {
        tags.push({ name: 'twitter:description', content: config.description });
    }
    if (config.images && config.images.length > 0) {
        tags.push({ name: 'twitter:image', content: config.images[0] });
    }
    if (config.app) {
        tags.push({ name: 'twitter:app:name:iphone', content: config.app.name });
        tags.push({ name: 'twitter:app:name:ipad', content: config.app.name });
        tags.push({ name: 'twitter:app:name:googleplay', content: config.app.name });
        if (config.app.id.iphone) {
            tags.push({ name: 'twitter:app:id:iphone', content: config.app.id.iphone });
        }
        if (config.app.id.ipad) {
            tags.push({ name: 'twitter:app:id:ipad', content: config.app.id.ipad });
        }
        if (config.app.id.googleplay) {
            tags.push({ name: 'twitter:app:id:googleplay', content: config.app.id.googleplay });
        }
    }
    return tags;
}
/**
 * Generate social media meta tags (Open Graph + Twitter)
 *
 * @param config - SEO configuration
 * @returns Combined social meta tags
 *
 * @example
 * ```tsx
 * const socialTags = generateSocialMetaTags({
 *   title: 'My Page',
 *   description: 'Page description',
 *   openGraph: { ... },
 *   twitter: { ... },
 * });
 * ```
 */
function generateSocialMetaTags(config) {
    const tags = [];
    if (config.openGraph) {
        tags.push(...generateOpenGraphTags(config.openGraph));
    }
    if (config.twitter) {
        tags.push(...generateTwitterCardTags(config.twitter));
    }
    return tags;
}
// ============================================================================
// Structured Data / JSON-LD
// ============================================================================
/**
 * Generate JSON-LD structured data
 *
 * @param type - Schema.org type
 * @param data - Structured data
 * @returns JSON-LD object
 *
 * @example
 * ```tsx
 * const jsonld = generateJSONLD('Article', {
 *   headline: 'My Article',
 *   author: { '@type': 'Person', name: 'John Doe' },
 *   datePublished: '2024-01-01',
 * });
 * ```
 */
function generateJSONLD(type, data) {
    return {
        '@context': 'https://schema.org',
        '@type': type,
        ...data,
    };
}
/**
 * Generate Article schema
 *
 * @param article - Article data
 * @returns Article JSON-LD
 *
 * @example
 * ```tsx
 * const schema = generateArticleSchema({
 *   headline: 'My Article',
 *   author: 'John Doe',
 *   datePublished: '2024-01-01',
 *   image: 'https://example.com/image.jpg',
 * });
 * ```
 */
function generateArticleSchema(article) {
    return generateJSONLD('Article', {
        headline: article.headline,
        author: Array.isArray(article.author)
            ? article.author.map((name) => ({ '@type': 'Person', name }))
            : { '@type': 'Person', name: article.author },
        datePublished: article.datePublished,
        dateModified: article.dateModified || article.datePublished,
        image: article.image,
        publisher: article.publisher
            ? {
                '@type': 'Organization',
                name: article.publisher.name,
                logo: article.publisher.logo
                    ? {
                        '@type': 'ImageObject',
                        url: article.publisher.logo,
                    }
                    : undefined,
            }
            : undefined,
        description: article.description,
    });
}
/**
 * Generate BreadcrumbList schema
 *
 * @param breadcrumbs - Breadcrumb items
 * @returns BreadcrumbList JSON-LD
 *
 * @example
 * ```tsx
 * const schema = generateBreadcrumbSchema([
 *   { name: 'Home', url: '/' },
 *   { name: 'Products', url: '/products' },
 *   { name: 'Product Name', url: '/products/product-name' },
 * ]);
 * ```
 */
function generateBreadcrumbSchema(breadcrumbs) {
    return generateJSONLD('BreadcrumbList', {
        itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.url,
        })),
    });
}
/**
 * Generate Organization schema
 *
 * @param org - Organization data
 * @returns Organization JSON-LD
 *
 * @example
 * ```tsx
 * const schema = generateOrganizationSchema({
 *   name: 'My Company',
 *   url: 'https://mycompany.com',
 *   logo: 'https://mycompany.com/logo.png',
 *   contactPoint: {
 *     telephone: '+1-555-1234',
 *     contactType: 'customer service',
 *   },
 * });
 * ```
 */
function generateOrganizationSchema(org) {
    return generateJSONLD('Organization', {
        name: org.name,
        url: org.url,
        logo: org.logo,
        contactPoint: org.contactPoint
            ? {
                '@type': 'ContactPoint',
                ...org.contactPoint,
            }
            : undefined,
        sameAs: org.sameAs,
    });
}
/**
 * Generate Product schema
 *
 * @param product - Product data
 * @returns Product JSON-LD
 *
 * @example
 * ```tsx
 * const schema = generateProductSchema({
 *   name: 'Product Name',
 *   description: 'Product description',
 *   image: 'https://example.com/product.jpg',
 *   brand: 'Brand Name',
 *   offers: {
 *     price: '99.99',
 *     priceCurrency: 'USD',
 *     availability: 'in stock',
 *   },
 * });
 * ```
 */
function generateProductSchema(product) {
    return generateJSONLD('Product', {
        name: product.name,
        description: product.description,
        image: product.image,
        brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
        sku: product.sku,
        offers: product.offers
            ? {
                '@type': 'Offer',
                price: product.offers.price,
                priceCurrency: product.offers.priceCurrency,
                availability: product.offers.availability
                    ? `https://schema.org/${product.offers.availability.replace(/\s+/g, '')}`
                    : undefined,
                url: product.offers.url,
            }
            : undefined,
        aggregateRating: product.aggregateRating
            ? {
                '@type': 'AggregateRating',
                ratingValue: product.aggregateRating.ratingValue,
                reviewCount: product.aggregateRating.reviewCount,
            }
            : undefined,
    });
}
/**
 * Generate FAQPage schema
 *
 * @param faqs - FAQ items
 * @returns FAQPage JSON-LD
 *
 * @example
 * ```tsx
 * const schema = generateFAQSchema([
 *   { question: 'What is this?', answer: 'This is a product.' },
 *   { question: 'How do I use it?', answer: 'Follow the instructions.' },
 * ]);
 * ```
 */
function generateFAQSchema(faqs) {
    return generateJSONLD('FAQPage', {
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    });
}
// ============================================================================
// Robots and Indexing
// ============================================================================
/**
 * Format robots configuration to meta content string
 *
 * @param config - Robots configuration
 * @returns Robots meta content string
 *
 * @example
 * ```tsx
 * const content = formatRobotsContent({
 *   index: true,
 *   follow: true,
 *   maxSnippet: 160,
 * });
 * // Returns: "index, follow, max-snippet:160"
 * ```
 */
function formatRobotsContent(config) {
    const directives = [];
    if (config.index !== undefined) {
        directives.push(config.index ? 'index' : 'noindex');
    }
    if (config.follow !== undefined) {
        directives.push(config.follow ? 'follow' : 'nofollow');
    }
    if (config.noarchive)
        directives.push('noarchive');
    if (config.nosnippet)
        directives.push('nosnippet');
    if (config.noimageindex)
        directives.push('noimageindex');
    if (config.nocache)
        directives.push('nocache');
    if (config.maxSnippet !== undefined) {
        directives.push(`max-snippet:${config.maxSnippet}`);
    }
    if (config.maxImagePreview) {
        directives.push(`max-image-preview:${config.maxImagePreview}`);
    }
    if (config.maxVideoPreview !== undefined) {
        directives.push(`max-video-preview:${config.maxVideoPreview}`);
    }
    if (config.unavailableAfter) {
        directives.push(`unavailable_after:${config.unavailableAfter}`);
    }
    return directives.join(', ');
}
/**
 * Generate robots meta tag
 *
 * @param config - Robots configuration
 * @returns Robots meta tag
 *
 * @example
 * ```tsx
 * const robotsTag = generateRobotsMetaTag({
 *   index: true,
 *   follow: true,
 *   noarchive: true,
 * });
 * ```
 */
function generateRobotsMetaTag(config) {
    return {
        name: 'robots',
        content: formatRobotsContent(config),
    };
}
/**
 * Generate indexing control tags
 *
 * @param allow - Whether to allow indexing
 * @returns Robots meta tag
 *
 * @example
 * ```tsx
 * const tag = generateIndexingControl(false); // noindex, nofollow
 * ```
 */
function generateIndexingControl(allow) {
    return generateRobotsMetaTag({
        index: allow,
        follow: allow,
    });
}
/**
 * Generate crawling directives for specific bots
 *
 * @param directives - Bot-specific directives
 * @returns Array of meta tags
 *
 * @example
 * ```tsx
 * const tags = generateCrawlingDirectives({
 *   googlebot: { index: true, follow: true },
 *   bingbot: { index: false, follow: false },
 * });
 * ```
 */
function generateCrawlingDirectives(directives) {
    return Object.entries(directives).map(([bot, config]) => ({
        name: bot,
        content: formatRobotsContent(config),
    }));
}
// ============================================================================
// Canonical URLs and Alternates
// ============================================================================
/**
 * Generate canonical URL link tag
 *
 * @param url - Canonical URL
 * @returns Link element props
 *
 * @example
 * ```tsx
 * const canonical = generateCanonicalURL('https://example.com/page');
 * // Use in Next.js: <link rel="canonical" href={canonical.href} />
 * ```
 */
function generateCanonicalURL(url) {
    return {
        rel: 'canonical',
        href: url,
    };
}
/**
 * Generate hreflang alternate links
 *
 * @param alternates - Alternate language versions
 * @returns Array of link element props
 *
 * @example
 * ```tsx
 * const alternates = generateHrefLangLinks([
 *   { hreflang: 'en', href: 'https://example.com/en' },
 *   { hreflang: 'es', href: 'https://example.com/es' },
 * ]);
 * ```
 */
function generateHrefLangLinks(alternates) {
    return alternates.map((alt) => ({
        rel: 'alternate',
        hreflang: alt.hreflang,
        href: alt.href,
    }));
}
/**
 * Generate all link tags (canonical + alternates)
 *
 * @param config - Link configuration
 * @returns Array of link element props
 *
 * @example
 * ```tsx
 * const links = generateAlternateLinks({
 *   canonical: 'https://example.com/page',
 *   alternates: [
 *     { hreflang: 'en', href: 'https://example.com/en' },
 *   ],
 * });
 * ```
 */
function generateAlternateLinks(config) {
    const links = [];
    if (config.canonical) {
        links.push(generateCanonicalURL(config.canonical));
    }
    if (config.alternates) {
        links.push(...generateHrefLangLinks(config.alternates));
    }
    return links;
}
// ============================================================================
// SEO Analysis and Scoring
// ============================================================================
/**
 * Analyze SEO score for a page
 *
 * @param config - SEO configuration
 * @param content - Page HTML content
 * @returns SEO score metrics
 *
 * @example
 * ```tsx
 * const score = analyzeSEOScore(seoConfig, document.documentElement.innerHTML);
 * console.log(`Overall score: ${score.overall}/100`);
 * ```
 */
function analyzeSEOScore(config, content = '') {
    const titleScore = analyzeTitleSEO(config.title);
    const descriptionScore = analyzeDescriptionSEO(config.description);
    const keywordScore = analyzeKeywordsSEO(config.keywords || [], content);
    const headingsScore = analyzeHeadingsSEO(content);
    const imagesScore = analyzeImagesSEO(content);
    const linksScore = analyzeLinksSEO(content);
    const overall = Math.round((titleScore.score +
        descriptionScore.score +
        keywordScore.score +
        headingsScore.score +
        imagesScore.score +
        linksScore.score) /
        6);
    return {
        overall,
        title: titleScore,
        description: descriptionScore,
        keywords: keywordScore,
        headings: headingsScore,
        images: imagesScore,
        links: linksScore,
        performance: {
            score: 0,
            metrics: {},
        },
    };
}
/**
 * Analyze title tag SEO
 *
 * @param title - Page title
 * @returns Title SEO analysis
 *
 * @example
 * ```tsx
 * const analysis = analyzeTitleSEO('My Great Page Title');
 * ```
 */
function analyzeTitleSEO(title) {
    const length = title.length;
    const issues = [];
    const suggestions = [];
    let score = 100;
    if (length === 0) {
        issues.push('Title is missing');
        score = 0;
    }
    else if (length < 30) {
        issues.push('Title is too short');
        suggestions.push('Aim for 30-60 characters');
        score -= 30;
    }
    else if (length > 60) {
        issues.push('Title may be truncated in search results');
        suggestions.push('Keep title under 60 characters');
        score -= 20;
    }
    if (!/[A-Z]/.test(title)) {
        suggestions.push('Consider using title case');
        score -= 10;
    }
    return { score: Math.max(0, score), length, issues, suggestions };
}
/**
 * Analyze meta description SEO
 *
 * @param description - Meta description
 * @returns Description SEO analysis
 *
 * @example
 * ```tsx
 * const analysis = analyzeDescriptionSEO('This is a great page description...');
 * ```
 */
function analyzeDescriptionSEO(description) {
    const length = description.length;
    const issues = [];
    const suggestions = [];
    let score = 100;
    if (length === 0) {
        issues.push('Meta description is missing');
        score = 0;
    }
    else if (length < 120) {
        issues.push('Description is too short');
        suggestions.push('Aim for 120-160 characters');
        score -= 30;
    }
    else if (length > 160) {
        issues.push('Description may be truncated in search results');
        suggestions.push('Keep description under 160 characters');
        score -= 20;
    }
    if (description && !description.endsWith('.')) {
        suggestions.push('Consider ending with a period for better readability');
        score -= 5;
    }
    return { score: Math.max(0, score), length, issues, suggestions };
}
/**
 * Analyze keywords SEO
 *
 * @param keywords - Keywords array
 * @param content - Page content
 * @returns Keywords SEO analysis
 *
 * @example
 * ```tsx
 * const analysis = analyzeKeywordsSEO(['seo', 'optimization'], '<html>...</html>');
 * ```
 */
function analyzeKeywordsSEO(keywords, content) {
    const density = {};
    const suggestions = [];
    let score = 100;
    if (keywords.length === 0) {
        suggestions.push('Add keywords to improve SEO');
        score -= 30;
    }
    else if (keywords.length > 10) {
        suggestions.push('Too many keywords may dilute focus');
        score -= 20;
    }
    // Calculate keyword density
    const words = content.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    keywords.forEach((keyword) => {
        const keywordLower = keyword.toLowerCase();
        const count = words.filter((word) => word.includes(keywordLower)).length;
        const densityPercent = (count / totalWords) * 100;
        density[keyword] = densityPercent;
        if (densityPercent < 0.5) {
            suggestions.push(`Keyword "${keyword}" appears too rarely (${densityPercent.toFixed(2)}%)`);
            score -= 10;
        }
        else if (densityPercent > 3) {
            suggestions.push(`Keyword "${keyword}" may be overused (${densityPercent.toFixed(2)}%) - risk of keyword stuffing`);
            score -= 15;
        }
    });
    return { score: Math.max(0, score), density, suggestions };
}
/**
 * Analyze headings structure SEO
 *
 * @param content - Page HTML content
 * @returns Headings SEO analysis
 *
 * @example
 * ```tsx
 * const analysis = analyzeHeadingsSEO(document.body.innerHTML);
 * ```
 */
function analyzeHeadingsSEO(content) {
    const h1Matches = content.match(/<h1[^>]*>/gi) || [];
    const h1Count = h1Matches.length;
    const issues = [];
    let score = 100;
    if (h1Count === 0) {
        issues.push('Missing H1 heading');
        score -= 40;
    }
    else if (h1Count > 1) {
        issues.push('Multiple H1 headings found - should have only one');
        score -= 30;
    }
    // Check heading hierarchy
    const headings = content.match(/<h[1-6][^>]*>/gi) || [];
    const levels = headings.map((h) => parseInt(h.match(/h([1-6])/)?.[1] || '0'));
    let properStructure = true;
    for (let i = 1; i < levels.length; i++) {
        if (levels[i] > levels[i - 1] + 1) {
            properStructure = false;
            issues.push('Heading hierarchy is not proper (e.g., jumping from H2 to H4)');
            score -= 20;
            break;
        }
    }
    return { score: Math.max(0, score), h1Count, structure: properStructure, issues };
}
/**
 * Analyze images SEO
 *
 * @param content - Page HTML content
 * @returns Images SEO analysis
 *
 * @example
 * ```tsx
 * const analysis = analyzeImagesSEO(document.body.innerHTML);
 * ```
 */
function analyzeImagesSEO(content) {
    const images = content.match(/<img[^>]*>/gi) || [];
    const withAlt = images.filter((img) => /alt\s*=\s*["'][^"']+["']/i.test(img)).length;
    const withoutAlt = images.length - withAlt;
    const issues = [];
    let score = 100;
    if (images.length === 0) {
        // No images is not necessarily bad
        return { score: 100, withAlt: 0, withoutAlt: 0, issues: [] };
    }
    if (withoutAlt > 0) {
        issues.push(`${withoutAlt} image(s) missing alt text`);
        score -= (withoutAlt / images.length) * 50;
    }
    // Check for empty alt attributes
    const emptyAlt = images.filter((img) => /alt\s*=\s*["']\s*["']/i.test(img) || /alt\s*=\s*["']""["']/i.test(img)).length;
    if (emptyAlt > 0) {
        issues.push(`${emptyAlt} image(s) have empty alt text`);
        score -= (emptyAlt / images.length) * 30;
    }
    return { score: Math.max(0, score), withAlt, withoutAlt, issues };
}
/**
 * Analyze links SEO
 *
 * @param content - Page HTML content
 * @returns Links SEO analysis
 *
 * @example
 * ```tsx
 * const analysis = analyzeLinksSEO(document.body.innerHTML);
 * ```
 */
function analyzeLinksSEO(content) {
    const links = content.match(/<a[^>]*href\s*=\s*["'][^"']+["'][^>]*>/gi) || [];
    let internal = 0;
    let external = 0;
    let broken = 0;
    links.forEach((link) => {
        const hrefMatch = link.match(/href\s*=\s*["']([^"']+)["']/i);
        if (hrefMatch) {
            const href = hrefMatch[1];
            if (href.startsWith('http://') || href.startsWith('https://')) {
                external++;
            }
            else if (href.startsWith('/') || !href.includes('://')) {
                internal++;
            }
            if (href === '#' || href === '') {
                broken++;
            }
        }
    });
    let score = 100;
    if (broken > 0) {
        score -= broken * 10;
    }
    return { score: Math.max(0, score), internal, external, broken };
}
// ============================================================================
// Content Optimization
// ============================================================================
/**
 * Optimize title for SEO
 *
 * @param title - Original title
 * @param maxLength - Maximum length (default: 60)
 * @returns Optimized title
 *
 * @example
 * ```tsx
 * const optimized = optimizeTitle('This is a very long title that needs to be optimized for SEO', 60);
 * ```
 */
function optimizeTitle(title, maxLength = 60) {
    if (title.length <= maxLength)
        return title;
    // Try to cut at word boundary
    const truncated = title.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
        return truncated.substring(0, lastSpace) + '...';
    }
    return truncated + '...';
}
/**
 * Optimize description for SEO
 *
 * @param description - Original description
 * @param maxLength - Maximum length (default: 160)
 * @returns Optimized description
 *
 * @example
 * ```tsx
 * const optimized = optimizeDescription('Long description...', 160);
 * ```
 */
function optimizeDescription(description, maxLength = 160) {
    if (description.length <= maxLength)
        return description;
    const truncated = description.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
        return truncated.substring(0, lastSpace) + '...';
    }
    return truncated + '...';
}
/**
 * Analyze keyword usage in content
 *
 * @param keyword - Keyword to analyze
 * @param content - Page content
 * @returns Keyword analysis
 *
 * @example
 * ```tsx
 * const analysis = analyzeKeyword('seo optimization', pageContent);
 * ```
 */
function analyzeKeyword(keyword, content) {
    const keywordLower = keyword.toLowerCase();
    const contentLower = content.toLowerCase();
    // Frequency
    const regex = new RegExp(`\\b${keywordLower.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    const matches = content.match(regex) || [];
    const frequency = matches.length;
    // Density
    const words = content.split(/\s+/).length;
    const density = (frequency / words) * 100;
    // Prominence (position of first occurrence)
    const firstIndex = contentLower.indexOf(keywordLower);
    const prominence = firstIndex === -1 ? 0 : 100 - (firstIndex / contentLower.length) * 100;
    // Check presence in key areas
    const inTitle = /<title[^>]*>[^<]*${keywordLower}[^<]*<\/title>/i.test(content);
    const inDescription = /<meta[^>]*name\s*=\s*["']description["'][^>]*content\s*=\s*["'][^"']*${keywordLower}[^"']*["']/i.test(content);
    const inHeadings = /<h[1-6][^>]*>[^<]*${keywordLower}[^<]*<\/h[1-6]>/i.test(content);
    const inUrl = typeof window !== 'undefined' && window.location.href.toLowerCase().includes(keywordLower);
    // Calculate score
    let score = 0;
    if (frequency > 0)
        score += 20;
    if (density >= 0.5 && density <= 2.5)
        score += 20;
    if (prominence > 50)
        score += 10;
    if (inTitle)
        score += 20;
    if (inDescription)
        score += 10;
    if (inHeadings)
        score += 10;
    if (inUrl)
        score += 10;
    return {
        keyword,
        frequency,
        density,
        prominence,
        inTitle,
        inDescription,
        inHeadings,
        inUrl,
        score,
    };
}
/**
 * Generate keyword suggestions based on content
 *
 * @param content - Page content
 * @param minFrequency - Minimum frequency (default: 3)
 * @returns Array of suggested keywords
 *
 * @example
 * ```tsx
 * const suggestions = generateKeywordSuggestions(pageContent, 3);
 * ```
 */
function generateKeywordSuggestions(content, minFrequency = 3) {
    const words = content
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((word) => word.length > 4); // Filter out short words
    const frequency = {};
    words.forEach((word) => {
        frequency[word] = (frequency[word] || 0) + 1;
    });
    return Object.entries(frequency)
        .filter(([_, count]) => count >= minFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20)
        .map(([word]) => word);
}
// ============================================================================
// Sitemap and RSS Generation
// ============================================================================
/**
 * Generate XML sitemap
 *
 * @param entries - Sitemap entries
 * @param baseUrl - Base URL for the site
 * @returns XML sitemap string
 *
 * @example
 * ```tsx
 * const sitemap = generateSitemap([
 *   { url: '/about', lastModified: new Date(), priority: 0.8 },
 *   { url: '/contact', lastModified: new Date(), priority: 0.6 },
 * ], 'https://example.com');
 * ```
 */
function generateSitemap(entries, baseUrl) {
    const urls = entries.map((entry) => {
        const lastMod = entry.lastModified instanceof Date
            ? entry.lastModified.toISOString()
            : entry.lastModified || new Date().toISOString();
        let urlTag = `  <url>
    <loc>${baseUrl}${entry.url}</loc>
    <lastmod>${lastMod}</lastmod>`;
        if (entry.changeFrequency) {
            urlTag += `\n    <changefreq>${entry.changeFrequency}</changefreq>`;
        }
        if (entry.priority !== undefined) {
            urlTag += `\n    <priority>${entry.priority}</priority>`;
        }
        if (entry.images && entry.images.length > 0) {
            entry.images.forEach((image) => {
                urlTag += `\n    <image:image>
      <image:loc>${image.url}</image:loc>`;
                if (image.title) {
                    urlTag += `\n      <image:title>${image.title}</image:title>`;
                }
                if (image.caption) {
                    urlTag += `\n      <image:caption>${image.caption}</image:caption>`;
                }
                urlTag += `\n    </image:image>`;
            });
        }
        urlTag += `\n  </url>`;
        return urlTag;
    });
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>`;
}
/**
 * Generate RSS feed
 *
 * @param items - RSS items
 * @param feedInfo - Feed information
 * @returns RSS XML string
 *
 * @example
 * ```tsx
 * const rss = generateRSSFeed(
 *   [
 *     {
 *       title: 'Article Title',
 *       link: 'https://example.com/article',
 *       description: 'Article description',
 *       pubDate: new Date(),
 *     },
 *   ],
 *   {
 *     title: 'My Blog',
 *     link: 'https://example.com',
 *     description: 'My blog description',
 *   }
 * );
 * ```
 */
function generateRSSFeed(items, feedInfo) {
    const itemsXML = items.map((item) => {
        const pubDate = item.pubDate instanceof Date ? item.pubDate.toUTCString() : new Date(item.pubDate).toUTCString();
        let itemTag = `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${pubDate}</pubDate>`;
        if (item.author) {
            itemTag += `\n      <author>${item.author}</author>`;
        }
        if (item.categories && item.categories.length > 0) {
            item.categories.forEach((category) => {
                itemTag += `\n      <category>${category}</category>`;
            });
        }
        if (item.guid) {
            itemTag += `\n      <guid>${item.guid}</guid>`;
        }
        if (item.enclosure) {
            itemTag += `\n      <enclosure url="${item.enclosure.url}" length="${item.enclosure.length}" type="${item.enclosure.type}" />`;
        }
        itemTag += `\n    </item>`;
        return itemTag;
    });
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${feedInfo.title}</title>
    <link>${feedInfo.link}</link>
    <description>${feedInfo.description}</description>
    ${feedInfo.language ? `<language>${feedInfo.language}</language>` : ''}
    ${feedInfo.copyright ? `<copyright>${feedInfo.copyright}</copyright>` : ''}
    ${feedInfo.managingEditor ? `<managingEditor>${feedInfo.managingEditor}</managingEditor>` : ''}
    ${feedInfo.webMaster ? `<webMaster>${feedInfo.webMaster}</webMaster>` : ''}
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedInfo.link}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXML.join('\n')}
  </channel>
</rss>`;
}
// ============================================================================
// URL Optimization
// ============================================================================
/**
 * Generate SEO-friendly slug from text
 *
 * @param text - Text to convert to slug
 * @returns SEO-friendly slug
 *
 * @example
 * ```tsx
 * const slug = generateSlug('My Great Article Title!');
 * // Returns: 'my-great-article-title'
 * ```
 */
function generateSlug(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
/**
 * Optimize URL for SEO
 *
 * @param url - Original URL
 * @returns Optimized URL
 *
 * @example
 * ```tsx
 * const optimized = optimizeURL('/products/product_123?id=456&ref=abc');
 * // Returns: '/products/product-123'
 * ```
 */
function optimizeURL(url) {
    // Remove query parameters that aren't SEO-friendly
    const [path] = url.split('?');
    // Convert underscores to hyphens
    const optimized = path.replace(/_/g, '-');
    // Remove trailing slashes (except for root)
    return optimized === '/' ? optimized : optimized.replace(/\/+$/, '');
}
/**
 * Manage redirects (client-side or for configuration)
 *
 * @param from - Source URL
 * @param to - Destination URL
 * @param permanent - Whether redirect is permanent (301 vs 302)
 * @returns Redirect configuration
 *
 * @example
 * ```tsx
 * const redirect = createRedirect('/old-page', '/new-page', true);
 * // Use in next.config.js redirects
 * ```
 */
function createRedirect(from, to, permanent = true) {
    return {
        source: from,
        destination: to,
        permanent,
    };
}
// ============================================================================
// Image SEO
// ============================================================================
/**
 * Generate optimized alt text for images
 *
 * @param filename - Image filename
 * @param context - Additional context
 * @returns Generated alt text
 *
 * @example
 * ```tsx
 * const alt = generateImageAltText('product-blue-shirt.jpg', 'clothing category');
 * // Returns: 'Product blue shirt - clothing category'
 * ```
 */
function generateImageAltText(filename, context) {
    const name = filename
        .replace(/\.[^/.]+$/, '') // Remove extension
        .replace(/[-_]/g, ' ') // Replace hyphens/underscores with spaces
        .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize words
    return context ? `${name} - ${context}` : name;
}
/**
 * Optimize image configuration for SEO and performance
 *
 * @param config - Image configuration
 * @returns Optimized image props
 *
 * @example
 * ```tsx
 * const imgProps = optimizeImageSEO({
 *   src: '/images/product.jpg',
 *   alt: 'Product image',
 *   width: 800,
 *   height: 600,
 * });
 * ```
 */
function optimizeImageSEO(config) {
    const optimized = {
        ...config,
        loading: config.loading || 'lazy',
        fetchPriority: config.fetchPriority || 'auto',
    };
    // Ensure alt text exists
    if (!optimized.alt) {
        optimized.alt = generateImageAltText(config.src);
    }
    // Add dimensions if available
    if (config.width && config.height) {
        optimized.width = config.width;
        optimized.height = config.height;
    }
    return optimized;
}
/**
 * Generate responsive image srcset
 *
 * @param baseUrl - Base image URL
 * @param widths - Array of widths
 * @returns srcset string
 *
 * @example
 * ```tsx
 * const srcset = generateResponsiveImageSrcset('/images/hero.jpg', [400, 800, 1200]);
 * // Returns: '/images/hero-400w.jpg 400w, /images/hero-800w.jpg 800w, /images/hero-1200w.jpg 1200w'
 * ```
 */
function generateResponsiveImageSrcset(baseUrl, widths) {
    const ext = baseUrl.split('.').pop();
    const base = baseUrl.replace(`.${ext}`, '');
    return widths.map((width) => `${base}-${width}w.${ext} ${width}w`).join(', ');
}
// ============================================================================
// Performance Monitoring
// ============================================================================
/**
 * Get PageSpeed Insights score (simulated - requires API in production)
 *
 * @param url - URL to analyze
 * @returns Promise with performance scores
 *
 * @example
 * ```tsx
 * const insights = await getPageSpeedInsights('https://example.com');
 * console.log(`Performance: ${insights.performance}/100`);
 * ```
 */
async function getPageSpeedInsights(url) {
    // In production, this would call the PageSpeed Insights API
    // For now, return simulated data
    return {
        performance: 85,
        accessibility: 92,
        bestPractices: 88,
        seo: 95,
        metrics: {
            LCP: 2400,
            FID: 100,
            CLS: 0.1,
            FCP: 1800,
            TTFB: 600,
        },
    };
}
/**
 * Monitor and report Core Web Vitals
 *
 * @param callback - Callback function for reporting
 * @returns Cleanup function
 *
 * @example
 * ```tsx
 * const cleanup = monitorCoreWebVitals((metric) => {
 *   console.log(`${metric.name}: ${metric.value}`);
 *   // Send to analytics
 * });
 * ```
 */
function monitorCoreWebVitals(callback) {
    if (typeof window === 'undefined') {
        return () => { };
    }
    const observers = [];
    // LCP
    const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        const value = lastEntry.renderTime || lastEntry.loadTime;
        callback({
            name: 'LCP',
            value,
            rating: value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor',
        });
    });
    // FID
    const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            const value = entry.processingStart - entry.startTime;
            callback({
                name: 'FID',
                value,
                rating: value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor',
            });
        });
    });
    // CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
                callback({
                    name: 'CLS',
                    value: clsValue,
                    rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
                });
            }
        });
    });
    try {
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        fidObserver.observe({ type: 'first-input', buffered: true });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        observers.push(lcpObserver, fidObserver, clsObserver);
    }
    catch (e) {
        // Observers not supported
    }
    return () => {
        observers.forEach((observer) => observer.disconnect());
    };
}
// ============================================================================
// React Components
// ============================================================================
/**
 * SEO Preview Component
 *
 * @example
 * ```tsx
 * <SEOPreview
 *   title="My Page Title"
 *   description="Page description"
 *   url="https://example.com/page"
 * />
 * ```
 */
function SEOPreview({ title, description, url, }) {
    return style = {};
    {
        border: '1px solid #ddd', padding;
        '16px', borderRadius;
        '8px', maxWidth;
        '600px';
    }
}
 >
    style;
{
    {
        color: '#1a0dab', fontSize;
        '20px', marginBottom;
        '4px';
    }
}
 > { title } < /div>;
{
    url && style;
    {
        {
            color: '#006621', fontSize;
            '14px', marginBottom;
            '4px';
        }
    }
     > { url } < /div>;
}
style;
{
    {
        color: '#545454', fontSize;
        '14px', lineHeight;
        '1.4';
    }
}
 > { description } < /div>
    < /div>;
;
/**
 * SEO Score Component
 *
 * @example
 * ```tsx
 * <SEOScoreComponent score={score} />
 * ```
 */
function SEOScoreComponent({ score }) {
    const getScoreColor = (value) => {
        if (value >= 80)
            return '#22c55e';
        if (value >= 50)
            return '#eab308';
        return '#ef4444';
    };
    return style = {};
    {
        padding: '16px', border;
        '1px solid #ddd', borderRadius;
        '8px';
    }
}
 >
    SEO;
Score < /h3>
    < div;
style = {};
{
    fontSize: '48px',
        fontWeight;
    'bold',
        color;
    getScoreColor(score.overall),
        marginBottom;
    '16px',
    ;
}
    >
        { score, : .overall } / 100
    < /div>
    < div;
style = {};
{
    marginBottom: '12px';
}
 >
    Title({ score, : .title.score } / 100);
/strong>
    < div > Length;
{
    score.title.length;
}
characters < /div>;
{
    score.title.issues.map((issue, i) => key = { i }, style = {}, { color: '#ef4444' });
}
 >
;
{
    issue;
}
/div>;
{
    score.title.suggestions.map((suggestion, i) => key = { i }, style = {}, { color: '#3b82f6' });
}
 >
;
{
    suggestion;
}
/div>;
/div>
    < div;
style = {};
{
    marginBottom: '12px';
}
 >
    Description({ score, : .description.score } / 100);
/strong>
    < div > Length;
{
    score.description.length;
}
characters < /div>;
{
    score.description.issues.map((issue, i) => key = { i }, style = {}, { color: '#ef4444' });
}
 >
;
{
    issue;
}
/div>;
/div>
    < div;
style = {};
{
    marginBottom: '12px';
}
 >
    Headings({ score, : .headings.score } / 100);
/strong>
    < div > H1;
count: {
    score.headings.h1Count;
}
/div>;
{
    score.headings.issues.map((issue, i) => key = { i }, style = {}, { color: '#ef4444' });
}
 >
;
{
    issue;
}
/div>;
/div>
    < div >
    Images({ score, : .images.score } / 100);
/strong>;
With;
alt: {
    score.images.withAlt;
}
Without;
alt: {
    score.images.withoutAlt;
}
/div>
    < /div>
    < /div>;
;
/**
 * Structured Data Component (renders JSON-LD script)
 *
 * @example
 * ```tsx
 * <StructuredData
 *   type="Article"
 *   data={{
 *     headline: 'My Article',
 *     author: { '@type': 'Person', name: 'John Doe' },
 *   }}
 * />
 * ```
 */
function StructuredData({ type, data, }) {
    const jsonld = generateJSONLD(type, data);
    return type = "application/ld+json";
    dangerouslySetInnerHTML = {};
    {
        __html: JSON.stringify(jsonld);
    }
}
/>;
;
/**
 * Export all utilities
 */
exports.default = {
    // Hooks
    useSEO,
    useMetaTags,
    useStructuredData,
    useCoreWebVitals,
    useSEOTracking,
    // Meta tags
    generateMetaTags,
    optimizeMetaTags,
    mergeMetaTags,
    // Social
    generateOpenGraphTags,
    generateTwitterCardTags,
    generateSocialMetaTags,
    // Structured data
    generateJSONLD,
    generateArticleSchema,
    generateBreadcrumbSchema,
    generateOrganizationSchema,
    generateProductSchema,
    generateFAQSchema,
    // Robots
    formatRobotsContent,
    generateRobotsMetaTag,
    generateIndexingControl,
    generateCrawlingDirectives,
    // URLs
    generateCanonicalURL,
    generateHrefLangLinks,
    generateAlternateLinks,
    // Analysis
    analyzeSEOScore,
    analyzeTitleSEO,
    analyzeDescriptionSEO,
    analyzeKeywordsSEO,
    analyzeHeadingsSEO,
    analyzeImagesSEO,
    analyzeLinksSEO,
    // Optimization
    optimizeTitle,
    optimizeDescription,
    analyzeKeyword,
    generateKeywordSuggestions,
    // Sitemap/RSS
    generateSitemap,
    generateRSSFeed,
    // URL optimization
    generateSlug,
    optimizeURL,
    createRedirect,
    // Image SEO
    generateImageAltText,
    optimizeImageSEO,
    generateResponsiveImageSrcset,
    // Performance
    getPageSpeedInsights,
    monitorCoreWebVitals,
    // Components
    SEOPreview,
    SEOScoreComponent,
    StructuredData,
};
//# sourceMappingURL=seo-optimization-kit.js.map