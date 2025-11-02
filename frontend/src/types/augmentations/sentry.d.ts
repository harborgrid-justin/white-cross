/**
 * Sentry Type Extensions
 * Extends Sentry types for browser tracing and monitoring
 */

declare module '@sentry/react' {
  // Extend BrowserTracingOptions interface
  export interface BrowserTracingOptions {
    tracePropagationTargets?: (string | RegExp)[]; // URLs to propagate traces to
  }
}

declare module '@sentry/browser' {
  // Extend BrowserTracingOptions interface for @sentry/browser
  export interface BrowserTracingOptions {
    tracePropagationTargets?: (string | RegExp)[]; // URLs to propagate traces to
  }
}
