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
/**
 * SEO meta tag configuration
 */
export interface MetaTag {
    name?: string;
    property?: string;
    content: string;
    httpEquiv?: string;
}
/**
 * Open Graph meta tags
 */
export interface OpenGraphConfig {
    title: string;
    description: string;
    url?: string;
    siteName?: string;
    images?: OpenGraphImage[];
    locale?: string;
    type?: 'website' | 'article' | 'book' | 'profile' | 'video.movie' | 'video.episode' | 'music.song' | 'music.album';
    article?: {
        publishedTime?: string;
        modifiedTime?: string;
        author?: string[];
        section?: string;
        tags?: string[];
    };
}
/**
 * Open Graph image configuration
 */
export interface OpenGraphImage {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
    type?: string;
}
/**
 * Twitter Card configuration
 */
export interface TwitterCardConfig {
    card: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    images?: string[];
    app?: {
        name: string;
        id: {
            iphone?: string;
            ipad?: string;
            googleplay?: string;
        };
        url?: {
            iphone?: string;
            ipad?: string;
            googleplay?: string;
        };
    };
}
/**
 * Robots meta tag configuration
 */
export interface RobotsConfig {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
    nocache?: boolean;
    maxSnippet?: number;
    maxImagePreview?: 'none' | 'standard' | 'large';
    maxVideoPreview?: number;
    unavailableAfter?: string;
}
/**
 * Canonical and alternate link configuration
 */
export interface LinkConfig {
    canonical?: string;
    alternates?: {
        hreflang: string;
        href: string;
    }[];
}
/**
 * Structured data types (Schema.org)
 */
export type StructuredDataType = 'Article' | 'BlogPosting' | 'NewsArticle' | 'Product' | 'Organization' | 'Person' | 'WebPage' | 'WebSite' | 'BreadcrumbList' | 'LocalBusiness' | 'Review' | 'Event' | 'VideoObject' | 'ImageObject' | 'FAQPage' | 'HowTo' | 'Recipe';
/**
 * JSON-LD structured data
 */
export interface StructuredDataConfig {
    '@context': string;
    '@type': StructuredDataType | string;
    [key: string]: any;
}
/**
 * SEO configuration
 */
export interface SEOConfig {
    title: string;
    description: string;
    keywords?: string[];
    canonical?: string;
    robots?: RobotsConfig;
    openGraph?: OpenGraphConfig;
    twitter?: TwitterCardConfig;
    alternates?: LinkConfig['alternates'];
    structuredData?: StructuredDataConfig[];
}
/**
 * SEO score metrics
 */
export interface SEOScore {
    overall: number;
    title: {
        score: number;
        length: number;
        issues: string[];
        suggestions: string[];
    };
    description: {
        score: number;
        length: number;
        issues: string[];
        suggestions: string[];
    };
    keywords: {
        score: number;
        density: Record<string, number>;
        suggestions: string[];
    };
    headings: {
        score: number;
        h1Count: number;
        structure: boolean;
        issues: string[];
    };
    images: {
        score: number;
        withAlt: number;
        withoutAlt: number;
        issues: string[];
    };
    links: {
        score: number;
        internal: number;
        external: number;
        broken: number;
    };
    performance: {
        score: number;
        metrics: CoreWebVitals;
    };
}
/**
 * Core Web Vitals metrics
 */
export interface CoreWebVitals {
    LCP?: number;
    FID?: number;
    CLS?: number;
    FCP?: number;
    TTFB?: number;
    INP?: number;
}
/**
 * Sitemap entry
 */
export interface SitemapEntry {
    url: string;
    lastModified?: Date | string;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
    images?: {
        url: string;
        title?: string;
        caption?: string;
    }[];
    videos?: {
        url: string;
        title: string;
        description: string;
        thumbnailUrl?: string;
    }[];
}
/**
 * RSS feed item
 */
export interface RSSItem {
    title: string;
    link: string;
    description: string;
    pubDate: Date | string;
    author?: string;
    categories?: string[];
    guid?: string;
    enclosure?: {
        url: string;
        length: number;
        type: string;
    };
}
/**
 * Keyword analysis result
 */
export interface KeywordAnalysis {
    keyword: string;
    frequency: number;
    density: number;
    prominence: number;
    inTitle: boolean;
    inDescription: boolean;
    inHeadings: boolean;
    inUrl: boolean;
    score: number;
}
/**
 * Image SEO configuration
 */
export interface ImageSEOConfig {
    src: string;
    alt: string;
    title?: string;
    width?: number;
    height?: number;
    loading?: 'lazy' | 'eager';
    fetchPriority?: 'high' | 'low' | 'auto';
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
}
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
export declare function useSEO(initialConfig?: Partial<SEOConfig>): {
    seo: any;
    updateSEO: any;
    resetSEO: any;
};
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
export declare function useMetaTags(initialTags?: MetaTag[]): {
    tags: any;
    addTag: any;
    removeTag: any;
    updateTag: any;
    clearTags: any;
};
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
export declare function useStructuredData(initialData?: StructuredDataConfig[]): {
    data: any;
    addStructuredData: any;
    removeStructuredData: any;
    clearStructuredData: any;
};
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
export declare function useCoreWebVitals(): any;
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
export declare function useSEOTracking(seoConfig: SEOConfig): {
    trackPageView: any;
    trackSEOChange: any;
};
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
export declare function generateMetaTags(config: SEOConfig): MetaTag[];
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
export declare function optimizeMetaTags(tags: MetaTag[]): MetaTag[];
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
export declare function mergeMetaTags(...tagArrays: MetaTag[][]): MetaTag[];
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
export declare function generateOpenGraphTags(config: OpenGraphConfig): MetaTag[];
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
export declare function generateTwitterCardTags(config: TwitterCardConfig): MetaTag[];
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
export declare function generateSocialMetaTags(config: SEOConfig): MetaTag[];
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
export declare function generateJSONLD(type: StructuredDataType, data: Record<string, any>): StructuredDataConfig;
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
export declare function generateArticleSchema(article: {
    headline: string;
    author: string | string[];
    datePublished: string;
    dateModified?: string;
    image?: string | string[];
    publisher?: {
        name: string;
        logo?: string;
    };
    description?: string;
}): StructuredDataConfig;
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
export declare function generateBreadcrumbSchema(breadcrumbs: Array<{
    name: string;
    url: string;
}>): StructuredDataConfig;
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
export declare function generateOrganizationSchema(org: {
    name: string;
    url: string;
    logo?: string;
    contactPoint?: {
        telephone: string;
        contactType: string;
    };
    sameAs?: string[];
}): StructuredDataConfig;
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
export declare function generateProductSchema(product: {
    name: string;
    description: string;
    image: string | string[];
    brand?: string;
    sku?: string;
    offers?: {
        price: string;
        priceCurrency: string;
        availability?: string;
        url?: string;
    };
    aggregateRating?: {
        ratingValue: number;
        reviewCount: number;
    };
}): StructuredDataConfig;
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
export declare function generateFAQSchema(faqs: Array<{
    question: string;
    answer: string;
}>): StructuredDataConfig;
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
export declare function formatRobotsContent(config: RobotsConfig): string;
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
export declare function generateRobotsMetaTag(config: RobotsConfig): MetaTag;
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
export declare function generateIndexingControl(allow: boolean): MetaTag;
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
export declare function generateCrawlingDirectives(directives: Record<string, RobotsConfig>): MetaTag[];
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
export declare function generateCanonicalURL(url: string): {
    rel: string;
    href: string;
};
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
export declare function generateHrefLangLinks(alternates: Array<{
    hreflang: string;
    href: string;
}>): Array<{
    rel: string;
    hreflang: string;
    href: string;
}>;
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
export declare function generateAlternateLinks(config: LinkConfig): Array<any>;
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
export declare function analyzeSEOScore(config: SEOConfig, content?: string): SEOScore;
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
export declare function analyzeTitleSEO(title: string): SEOScore['title'];
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
export declare function analyzeDescriptionSEO(description: string): SEOScore['description'];
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
export declare function analyzeKeywordsSEO(keywords: string[], content: string): SEOScore['keywords'];
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
export declare function analyzeHeadingsSEO(content: string): SEOScore['headings'];
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
export declare function analyzeImagesSEO(content: string): SEOScore['images'];
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
export declare function analyzeLinksSEO(content: string): SEOScore['links'];
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
export declare function optimizeTitle(title: string, maxLength?: number): string;
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
export declare function optimizeDescription(description: string, maxLength?: number): string;
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
export declare function analyzeKeyword(keyword: string, content: string): KeywordAnalysis;
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
export declare function generateKeywordSuggestions(content: string, minFrequency?: number): string[];
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
export declare function generateSitemap(entries: SitemapEntry[], baseUrl: string): string;
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
export declare function generateRSSFeed(items: RSSItem[], feedInfo: {
    title: string;
    link: string;
    description: string;
    language?: string;
    copyright?: string;
    managingEditor?: string;
    webMaster?: string;
}): string;
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
export declare function generateSlug(text: string): string;
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
export declare function optimizeURL(url: string): string;
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
export declare function createRedirect(from: string, to: string, permanent?: boolean): {
    source: string;
    destination: string;
    permanent: boolean;
};
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
export declare function generateImageAltText(filename: string, context?: string): string;
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
export declare function optimizeImageSEO(config: ImageSEOConfig): ImageSEOConfig;
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
export declare function generateResponsiveImageSrcset(baseUrl: string, widths: number[]): string;
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
export declare function getPageSpeedInsights(url: string): Promise<{
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    metrics: CoreWebVitals;
}>;
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
export declare function monitorCoreWebVitals(callback: (metric: {
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
}) => void): () => void;
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
export declare function SEOPreview({ title, description, url, }: {
    title: string;
    description: string;
    url?: string;
}): {};
/**
 * SEO Score Component
 *
 * @example
 * ```tsx
 * <SEOScoreComponent score={score} />
 * ```
 */
export declare function SEOScoreComponent({ score }: {
    score: SEOScore;
}): {};
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
export declare function StructuredData({ type, data, }: {
    type: StructuredDataType;
    data: Record<string, any>;
}): string;
/**
 * Export all utilities
 */
declare const _default: {
    useSEO: typeof useSEO;
    useMetaTags: typeof useMetaTags;
    useStructuredData: typeof useStructuredData;
    useCoreWebVitals: typeof useCoreWebVitals;
    useSEOTracking: typeof useSEOTracking;
    generateMetaTags: typeof generateMetaTags;
    optimizeMetaTags: typeof optimizeMetaTags;
    mergeMetaTags: typeof mergeMetaTags;
    generateOpenGraphTags: typeof generateOpenGraphTags;
    generateTwitterCardTags: typeof generateTwitterCardTags;
    generateSocialMetaTags: typeof generateSocialMetaTags;
    generateJSONLD: typeof generateJSONLD;
    generateArticleSchema: typeof generateArticleSchema;
    generateBreadcrumbSchema: typeof generateBreadcrumbSchema;
    generateOrganizationSchema: typeof generateOrganizationSchema;
    generateProductSchema: typeof generateProductSchema;
    generateFAQSchema: typeof generateFAQSchema;
    formatRobotsContent: typeof formatRobotsContent;
    generateRobotsMetaTag: typeof generateRobotsMetaTag;
    generateIndexingControl: typeof generateIndexingControl;
    generateCrawlingDirectives: typeof generateCrawlingDirectives;
    generateCanonicalURL: typeof generateCanonicalURL;
    generateHrefLangLinks: typeof generateHrefLangLinks;
    generateAlternateLinks: typeof generateAlternateLinks;
    analyzeSEOScore: typeof analyzeSEOScore;
    analyzeTitleSEO: typeof analyzeTitleSEO;
    analyzeDescriptionSEO: typeof analyzeDescriptionSEO;
    analyzeKeywordsSEO: typeof analyzeKeywordsSEO;
    analyzeHeadingsSEO: typeof analyzeHeadingsSEO;
    analyzeImagesSEO: typeof analyzeImagesSEO;
    analyzeLinksSEO: typeof analyzeLinksSEO;
    optimizeTitle: typeof optimizeTitle;
    optimizeDescription: typeof optimizeDescription;
    analyzeKeyword: typeof analyzeKeyword;
    generateKeywordSuggestions: typeof generateKeywordSuggestions;
    generateSitemap: typeof generateSitemap;
    generateRSSFeed: typeof generateRSSFeed;
    generateSlug: typeof generateSlug;
    optimizeURL: typeof optimizeURL;
    createRedirect: typeof createRedirect;
    generateImageAltText: typeof generateImageAltText;
    optimizeImageSEO: typeof optimizeImageSEO;
    generateResponsiveImageSrcset: typeof generateResponsiveImageSrcset;
    getPageSpeedInsights: typeof getPageSpeedInsights;
    monitorCoreWebVitals: typeof monitorCoreWebVitals;
    SEOPreview: typeof SEOPreview;
    SEOScoreComponent: typeof SEOScoreComponent;
    StructuredData: typeof StructuredData;
};
export default _default;
//# sourceMappingURL=seo-optimization-kit.d.ts.map