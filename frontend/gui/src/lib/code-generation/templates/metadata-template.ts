/**
 * Next.js Metadata Template
 *
 * Provides templates for generating Next.js metadata exports.
 * Supports static and dynamic metadata generation.
 */

import type { NextJSPageConfig } from '@/types';

/**
 * Metadata configuration
 */
export interface MetadataConfig {
  title: string;
  description: string;
  keywords?: string[];
  authors?: Array<{ name: string; url?: string }>;
  openGraph?: {
    title: string;
    description: string;
    images: string[];
    type?: string;
    url?: string;
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    images: string[];
    creator?: string;
  };
  robots?: {
    index: boolean;
    follow: boolean;
  };
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
}

/**
 * Generate static metadata export
 *
 * @param config - Metadata configuration
 * @returns Metadata export code
 */
export function generateStaticMetadata(config: MetadataConfig): string {
  const metadataJson = JSON.stringify(
    {
      title: config.title,
      description: config.description,
      ...(config.keywords && { keywords: config.keywords }),
      ...(config.authors && { authors: config.authors }),
      ...(config.openGraph && { openGraph: config.openGraph }),
      ...(config.twitter && { twitter: config.twitter }),
      ...(config.robots && { robots: config.robots }),
      ...(config.alternates && { alternates: config.alternates }),
    },
    null,
    2
  );

  return `import type { Metadata } from 'next';

export const metadata: Metadata = ${metadataJson};`;
}

/**
 * Generate dynamic metadata function
 *
 * @param config - Metadata configuration
 * @param paramTypes - Dynamic parameter types
 * @returns Dynamic metadata function code
 */
export function generateDynamicMetadata(
  config: MetadataConfig,
  paramTypes: Record<string, string> = {}
): string {
  const hasParams = Object.keys(paramTypes).length > 0;

  const paramsInterface = hasParams
    ? `type Props = {
  params: {
    ${Object.entries(paramTypes)
      .map(([key, type]) => `${key}: ${type};`)
      .join('\n    ')}
  };
};

`
    : '';

  const functionParams = hasParams ? 'props: Props' : '';

  return `import type { Metadata } from 'next';

${paramsInterface}export async function generateMetadata(${functionParams}): Promise<Metadata> {
  // Fetch data or compute metadata dynamically
  ${hasParams ? 'const { params } = props;' : ''}

  return {
    title: '${config.title}',
    description: '${config.description}',
    ${config.openGraph ? `openGraph: ${JSON.stringify(config.openGraph, null, 4)},` : ''}
  };
}`;
}

/**
 * Generate metadata from page config
 *
 * @param config - Page configuration
 * @returns Metadata export code
 */
export function generateMetadataFromPageConfig(
  config: NextJSPageConfig
): string {
  return generateStaticMetadata({
    title: config.metadata.title,
    description: config.metadata.description,
    openGraph: config.metadata.openGraph,
  });
}

/**
 * Generate Open Graph metadata
 *
 * @param title - OG title
 * @param description - OG description
 * @param images - OG images
 * @param url - OG URL
 * @returns Open Graph metadata object
 */
export function generateOpenGraphMetadata(
  title: string,
  description: string,
  images: string[],
  url?: string
): string {
  const og = {
    title,
    description,
    images,
    ...(url && { url }),
    type: 'website',
  };

  return JSON.stringify(og, null, 2);
}

/**
 * Generate Twitter Card metadata
 *
 * @param title - Twitter title
 * @param description - Twitter description
 * @param images - Twitter images
 * @param creator - Twitter creator handle
 * @returns Twitter Card metadata object
 */
export function generateTwitterMetadata(
  title: string,
  description: string,
  images: string[],
  creator?: string
): string {
  const twitter = {
    card: 'summary_large_image',
    title,
    description,
    images,
    ...(creator && { creator }),
  };

  return JSON.stringify(twitter, null, 2);
}

/**
 * Generate robots meta tags
 *
 * @param index - Allow indexing
 * @param follow - Allow following links
 * @param additionalRules - Additional robot rules
 * @returns Robots metadata object
 */
export function generateRobotsMetadata(
  index: boolean = true,
  follow: boolean = true,
  additionalRules?: Record<string, boolean | string>
): string {
  const robots = {
    index,
    follow,
    ...additionalRules,
  };

  return JSON.stringify(robots, null, 2);
}

/**
 * Generate viewport configuration
 *
 * @param width - Viewport width
 * @param initialScale - Initial scale
 * @param maximumScale - Maximum scale
 * @returns Viewport export code
 */
export function generateViewportConfig(
  width: string = 'device-width',
  initialScale: number = 1,
  maximumScale?: number
): string {
  const viewport = {
    width,
    initialScale,
    ...(maximumScale && { maximumScale }),
  };

  return `import type { Viewport } from 'next';

export const viewport: Viewport = ${JSON.stringify(viewport, null, 2)};`;
}

/**
 * Generate complete metadata file with all metadata types
 *
 * @param config - Metadata configuration
 * @returns Complete metadata file code
 */
export function generateCompleteMetadata(config: MetadataConfig): string {
  return `import type { Metadata, Viewport } from 'next';

/**
 * Page Metadata
 */
export const metadata: Metadata = {
  title: '${config.title}',
  description: '${config.description}',${config.keywords ? `\n  keywords: ${JSON.stringify(config.keywords)},` : ''}${config.authors ? `\n  authors: ${JSON.stringify(config.authors)},` : ''}${
    config.openGraph
      ? `\n  openGraph: ${JSON.stringify(config.openGraph, null, 4)},`
      : ''
  }${
    config.twitter
      ? `\n  twitter: ${JSON.stringify(config.twitter, null, 4)},`
      : ''
  }${
    config.robots
      ? `\n  robots: ${JSON.stringify(config.robots, null, 4)},`
      : ''
  }${
    config.alternates
      ? `\n  alternates: ${JSON.stringify(config.alternates, null, 4)},`
      : ''
  }
};

/**
 * Viewport Configuration
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};`;
}

/**
 * Generate metadata with template literal titles
 *
 * @param baseTitle - Base title
 * @param template - Title template
 * @returns Metadata with template
 */
export function generateMetadataWithTemplate(
  baseTitle: string,
  template: string = '%s | My App'
): string {
  return `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: '${baseTitle}',
    template: '${template}',
  },
};`;
}

/**
 * Generate sitemap metadata
 *
 * @param priority - Page priority
 * @param changefreq - Change frequency
 * @returns Sitemap metadata
 */
export function generateSitemapMetadata(
  priority: number = 0.5,
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly'
): string {
  return `export const sitemap = {
  priority: ${priority},
  changefreq: '${changefreq}',
};`;
}

/**
 * Generate icon metadata
 *
 * @param favicon - Favicon path
 * @param appleTouchIcon - Apple touch icon path
 * @returns Icon metadata
 */
export function generateIconMetadata(
  favicon: string = '/favicon.ico',
  appleTouchIcon?: string
): string {
  const icons: any = {
    icon: favicon,
  };

  if (appleTouchIcon) {
    icons.apple = appleTouchIcon;
  }

  return `icons: ${JSON.stringify(icons, null, 2)}`;
}

/**
 * Generate manifest metadata
 *
 * @param manifestPath - Path to manifest.json
 * @returns Manifest metadata
 */
export function generateManifestMetadata(
  manifestPath: string = '/manifest.json'
): string {
  return `manifest: '${manifestPath}'`;
}
