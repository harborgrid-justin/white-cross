/**
 * Global Type Definitions
 *
 * Provides TypeScript type definitions for Node.js globals and environment variables
 * used throughout the application.
 */

/// <reference types="node" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_API_URL?: string;
      NEXT_PUBLIC_APP_URL?: string;
      NEXT_PUBLIC_WS_URL?: string;
      NEXT_PUBLIC_SENTRY_DSN?: string;
      NEXT_PUBLIC_DATADOG_CLIENT_TOKEN?: string;
      NEXT_PUBLIC_DATADOG_APPLICATION_ID?: string;
      [key: string]: string | undefined;
    }
  }

  // Extend Window interface for browser-specific globals
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
  }
}

export {};
