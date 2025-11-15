/**
 * Page Configuration Types
 *
 * This module defines types for page-level configuration including
 * metadata, SEO, layouts, and routing.
 *
 * @module gui-builder/layout/page
 */

import type { PageId, Metadata, ServerActionId } from '../core';
import type { ComponentTree } from './tree';

/**
 * Page type/purpose.
 */
export enum PageType {
  /**
   * Standard page.
   */
  Standard = 'standard',

  /**
   * Landing page.
   */
  Landing = 'landing',

  /**
   * Dashboard.
   */
  Dashboard = 'dashboard',

  /**
   * Form page.
   */
  Form = 'form',

  /**
   * Detail/view page.
   */
  Detail = 'detail',

  /**
   * List/index page.
   */
  List = 'list',

  /**
   * Error page (404, 500, etc.).
   */
  Error = 'error',

  /**
   * Authentication page (login, signup).
   */
  Auth = 'auth',

  /**
   * Settings page.
   */
  Settings = 'settings',

  /**
   * Custom page type.
   */
  Custom = 'custom',
}

/**
 * Page rendering mode (Next.js specific).
 */
export enum PageRenderMode {
  /**
   * Static generation (SSG).
   */
  Static = 'static',

  /**
   * Server-side rendering (SSR).
   */
  ServerSide = 'server-side',

  /**
   * Incremental static regeneration (ISR).
   */
  ISR = 'isr',

  /**
   * Client-side rendering (CSR).
   */
  ClientSide = 'client-side',
}

/**
 * SEO configuration for a page.
 */
export interface PageSEO {
  /**
   * Page title.
   */
  readonly title: string;

  /**
   * Meta description.
   */
  readonly description: string;

  /**
   * Keywords.
   */
  readonly keywords?: readonly string[];

  /**
   * Canonical URL.
   */
  readonly canonicalUrl?: string;

  /**
   * Open Graph metadata.
   */
  readonly openGraph?: {
    readonly title?: string;
    readonly description?: string;
    readonly image?: string;
    readonly type?: string;
    readonly siteName?: string;
  };

  /**
   * Twitter Card metadata.
   */
  readonly twitter?: {
    readonly card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    readonly site?: string;
    readonly creator?: string;
    readonly title?: string;
    readonly description?: string;
    readonly image?: string;
  };

  /**
   * Robots meta tag.
   */
  readonly robots?: {
    readonly index?: boolean;
    readonly follow?: boolean;
    readonly noarchive?: boolean;
    readonly nosnippet?: boolean;
  };

  /**
   * Structured data (JSON-LD).
   */
  readonly structuredData?: Record<string, unknown>[];
}

/**
 * Page routing configuration.
 */
export interface PageRouting {
  /**
   * URL path for the page.
   */
  readonly path: string;

  /**
   * Dynamic segments in the path.
   */
  readonly params?: readonly {
    readonly name: string;
    readonly type: 'string' | 'number' | 'slug';
    readonly optional?: boolean;
  }[];

  /**
   * Catch-all segment.
   */
  readonly catchAll?: {
    readonly name: string;
    readonly optional?: boolean;
  };

  /**
   * Query parameters.
   */
  readonly queryParams?: readonly {
    readonly name: string;
    readonly required?: boolean;
    readonly type?: string;
  }[];

  /**
   * Redirect configuration.
   */
  readonly redirect?: {
    readonly destination: string;
    readonly permanent?: boolean;
    readonly statusCode?: number;
  };

  /**
   * Middleware to apply.
   */
  readonly middleware?: readonly string[];
}

/**
 * Page layout configuration.
 */
export interface PageLayout {
  /**
   * Layout template to use.
   */
  readonly template?: string;

  /**
   * Component tree for the page content.
   */
  readonly tree: ComponentTree;

  /**
   * Header configuration.
   */
  readonly header?: {
    readonly enabled: boolean;
    readonly sticky?: boolean;
    readonly transparent?: boolean;
    readonly componentTree?: ComponentTree;
  };

  /**
   * Footer configuration.
   */
  readonly footer?: {
    readonly enabled: boolean;
    readonly sticky?: boolean;
    readonly componentTree?: ComponentTree;
  };

  /**
   * Sidebar configuration.
   */
  readonly sidebar?: {
    readonly enabled: boolean;
    readonly position?: 'left' | 'right';
    readonly collapsible?: boolean;
    readonly componentTree?: ComponentTree;
  };

  /**
   * Container settings.
   */
  readonly container?: {
    readonly maxWidth?: string | number;
    readonly padding?: string | number;
    readonly centered?: boolean;
  };

  /**
   * Background configuration.
   */
  readonly background?: {
    readonly color?: string;
    readonly image?: string;
    readonly gradient?: string;
  };
}

/**
 * Page data loading configuration.
 */
export interface PageDataConfig {
  /**
   * Server Actions to execute on page load.
   */
  readonly serverActions?: readonly {
    readonly id: ServerActionId;
    readonly params?: Record<string, unknown>;
    readonly runOnLoad?: boolean;
  }[];

  /**
   * Revalidation configuration (for ISR).
   */
  readonly revalidate?: {
    readonly interval?: number; // seconds
    readonly onDemand?: boolean;
  };

  /**
   * Caching configuration.
   */
  readonly cache?: {
    readonly strategy?: 'no-cache' | 'force-cache' | 'revalidate';
    readonly ttl?: number; // seconds
  };
}

/**
 * Page accessibility configuration.
 */
export interface PageAccessibility {
  /**
   * Skip to main content link.
   */
  readonly skipToMain?: boolean;

  /**
   * Landmark regions.
   */
  readonly landmarks?: {
    readonly main?: boolean;
    readonly navigation?: boolean;
    readonly search?: boolean;
    readonly banner?: boolean;
    readonly contentinfo?: boolean;
  };

  /**
   * ARIA live regions.
   */
  readonly liveRegions?: readonly {
    readonly id: string;
    readonly politeness: 'polite' | 'assertive' | 'off';
  }[];

  /**
   * Focus management.
   */
  readonly focusManagement?: {
    readonly autoFocus?: boolean;
    readonly restoreFocus?: boolean;
  };
}

/**
 * Complete page configuration.
 */
export interface PageConfig {
  /**
   * Unique identifier for the page.
   */
  readonly id: PageId;

  /**
   * Page name/title.
   */
  readonly name: string;

  /**
   * Page type.
   */
  readonly type: PageType;

  /**
   * Rendering mode.
   */
  readonly renderMode: PageRenderMode;

  /**
   * SEO configuration.
   */
  readonly seo: PageSEO;

  /**
   * Routing configuration.
   */
  readonly routing: PageRouting;

  /**
   * Layout configuration.
   */
  readonly layout: PageLayout;

  /**
   * Data loading configuration.
   */
  readonly data?: PageDataConfig;

  /**
   * Accessibility configuration.
   */
  readonly accessibility?: PageAccessibility;

  /**
   * Whether the page is published.
   */
  readonly published: boolean;

  /**
   * Scheduled publish date.
   */
  readonly publishDate?: string;

  /**
   * Whether the page requires authentication.
   */
  readonly requiresAuth?: boolean;

  /**
   * Required permissions to access the page.
   */
  readonly permissions?: readonly string[];

  /**
   * Page metadata.
   */
  readonly metadata: Metadata;

  /**
   * Custom metadata for extensions.
   */
  readonly customData?: Record<string, unknown>;
}

/**
 * Page collection/multi-page configuration.
 */
export interface PageCollection {
  /**
   * All pages in the collection.
   */
  readonly pages: ReadonlyMap<PageId, PageConfig>;

  /**
   * Home page ID.
   */
  readonly homePageId?: PageId;

  /**
   * 404 error page ID.
   */
  readonly errorPageId?: PageId;

  /**
   * Page navigation structure.
   */
  readonly navigation?: readonly {
    readonly pageId: PageId;
    readonly children?: readonly PageId[];
    readonly order?: number;
  }[];
}
