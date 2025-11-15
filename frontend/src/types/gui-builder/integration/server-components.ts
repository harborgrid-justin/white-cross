/**
 * Server Component Types
 *
 * This module defines types for Next.js Server Component integration.
 *
 * @module gui-builder/integration/server-components
 */

/**
 * Server Component configuration.
 */
export interface ServerComponentConfig {
  readonly isServerComponent: boolean;
  readonly async?: boolean;
  readonly cacheStrategy?: 'force-cache' | 'no-store' | 'revalidate';
  readonly revalidate?: number; // seconds
}

/**
 * Server Component props.
 */
export interface ServerComponentProps {
  readonly searchParams?: Record<string, string | string[]>;
  readonly params?: Record<string, string>;
}
