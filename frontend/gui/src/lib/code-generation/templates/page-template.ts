/**
 * Next.js Page Template
 *
 * Provides templates for generating Next.js app router pages.
 * Supports TypeScript, metadata, and both server/client components.
 */

import type { NextJSPageConfig } from '@/types';

/**
 * Generate a basic Next.js page template
 *
 * @param config - Page configuration
 * @param componentJSX - The JSX content for the page
 * @param imports - Additional imports needed
 * @param useClient - Whether to add 'use client' directive
 * @returns Page template string
 */
export function generatePageTemplate(
  config: NextJSPageConfig,
  componentJSX: string,
  imports: string[] = [],
  useClient = false
): string {
  const clientDirective = useClient ? "'use client';\n\n" : '';
  const importsSection = imports.length > 0 ? imports.join('\n') + '\n\n' : '';

  return `${clientDirective}${importsSection}/**
 * ${config.title}
 *
 * ${config.description}
 *
 * @page ${config.path}
 */
export default function Page() {
  return (
    ${componentJSX}
  );
}`;
}

/**
 * Generate a page with metadata export
 *
 * @param config - Page configuration
 * @param componentJSX - The JSX content for the page
 * @param imports - Additional imports needed
 * @returns Page template with metadata
 */
export function generatePageWithMetadata(
  config: NextJSPageConfig,
  componentJSX: string,
  imports: string[] = []
): string {
  const importsSection = imports.length > 0 ? imports.join('\n') + '\n\n' : '';
  const metadataJson = JSON.stringify(config.metadata, null, 2);

  return `import type { Metadata } from 'next';
${importsSection}
/**
 * Page metadata
 */
export const metadata: Metadata = ${metadataJson};

/**
 * ${config.title}
 *
 * ${config.description}
 *
 * @page ${config.path}
 */
export default function Page() {
  return (
    ${componentJSX}
  );
}`;
}

/**
 * Generate a dynamic page template with params
 *
 * @param config - Page configuration
 * @param componentJSX - The JSX content for the page
 * @param imports - Additional imports needed
 * @param paramTypes - Types for dynamic params
 * @returns Dynamic page template
 */
export function generateDynamicPageTemplate(
  config: NextJSPageConfig,
  componentJSX: string,
  imports: string[] = [],
  paramTypes: Record<string, string> = {}
): string {
  const importsSection = imports.length > 0 ? imports.join('\n') + '\n\n' : '';

  const paramsInterface = Object.keys(paramTypes).length > 0
    ? `interface PageProps {
  params: {
    ${Object.entries(paramTypes)
      .map(([key, type]) => `${key}: ${type};`)
      .join('\n    ')}
  };
}

`
    : '';

  const propsParam = Object.keys(paramTypes).length > 0 ? '{ params }: PageProps' : '';

  return `${importsSection}${paramsInterface}/**
 * ${config.title}
 *
 * ${config.description}
 *
 * @page ${config.path}
 */
export default function Page(${propsParam}) {
  return (
    ${componentJSX}
  );
}`;
}

/**
 * Generate a page with data fetching
 *
 * @param config - Page configuration
 * @param componentJSX - The JSX content for the page
 * @param imports - Additional imports needed
 * @param fetchCode - Data fetching code
 * @returns Page template with data fetching
 */
export function generatePageWithDataFetching(
  config: NextJSPageConfig,
  componentJSX: string,
  imports: string[] = [],
  fetchCode: string = ''
): string {
  const importsSection = imports.length > 0 ? imports.join('\n') + '\n\n' : '';
  const metadataJson = JSON.stringify(config.metadata, null, 2);

  const revalidateConfig = config.dataFetching?.revalidate
    ? `\n\nexport const revalidate = ${config.dataFetching.revalidate};`
    : '';

  const dynamicConfig =
    config.dataFetching?.type === 'dynamic'
      ? "\n\nexport const dynamic = 'force-dynamic';"
      : '';

  return `import type { Metadata } from 'next';
${importsSection}
/**
 * Page metadata
 */
export const metadata: Metadata = ${metadataJson};${revalidateConfig}${dynamicConfig}

/**
 * Fetch data for the page
 */
async function getData() {
  ${fetchCode || '// Add your data fetching logic here'}
}

/**
 * ${config.title}
 *
 * ${config.description}
 *
 * @page ${config.path}
 */
export default async function Page() {
  const data = await getData();

  return (
    ${componentJSX}
  );
}`;
}

/**
 * Generate a loading page template
 *
 * @returns Loading page template
 */
export function generateLoadingTemplate(): string {
  return `/**
 * Loading State
 *
 * Displayed while the page is loading.
 */
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
    </div>
  );
}`;
}

/**
 * Generate an error page template
 *
 * @returns Error page template
 */
export function generateErrorTemplate(): string {
  return `'use client';

/**
 * Error State
 *
 * Displayed when an error occurs.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}`;
}

/**
 * Generate a not-found page template
 *
 * @returns Not found page template
 */
export function generateNotFoundTemplate(): string {
  return `import Link from 'next/link';

/**
 * 404 Not Found
 *
 * Displayed when a page is not found.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-4xl font-bold mb-4">404</h2>
      <p className="text-gray-600 mb-4">Page not found</p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Home
      </Link>
    </div>
  );
}`;
}

/**
 * Generate a layout template
 *
 * @param children - Children JSX
 * @param imports - Additional imports needed
 * @returns Layout template
 */
export function generateLayoutTemplate(
  children: string = '{children}',
  imports: string[] = []
): string {
  const importsSection = imports.length > 0 ? imports.join('\n') + '\n\n' : '';

  return `import type { Metadata } from 'next';
${importsSection}
export const metadata: Metadata = {
  title: 'My App',
  description: 'Generated with Next.js Page Builder',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        ${children}
      </body>
    </html>
  );
}`;
}
