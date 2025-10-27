/**
 * WF-COMP-337 | debug.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: debug
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants, named exports | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import debug from 'debug';

// Enable debug logging in development
if (process.env.NODE_ENV === 'development') {
  // Enable all debug logs in development
  debug.enable('whitecross:*');

  // You can also be more specific:
  // debug.enable('whitecross:auth*,whitecross:api*');
} else {
  // Disable debug logging in production
  debug.disable();
}

// Create namespace for the application
export const createLogger = (namespace: string) => {
  return debug(`whitecross:${namespace}`);
};

// Pre-configured loggers for different modules
export const authLogger = createLogger('auth');
export const apiLogger = createLogger('api');
export const storeLogger = createLogger('store');
export const componentLogger = createLogger('component');
export const utilsLogger = createLogger('utils');

// Utility functions for common logging patterns
export const logger = {
  info: (namespace: string, message: string, ...args: any[]) => {
    createLogger(namespace)('INFO:', message, ...args);
  },

  error: (namespace: string, message: string, error?: Error, ...args: any[]) => {
    const log = createLogger(namespace);
    log('ERROR:', message, error?.message || error, ...args);
    if (error?.stack) {
      log('STACK:', error.stack);
    }
  },

  warn: (namespace: string, message: string, ...args: any[]) => {
    createLogger(namespace)('WARN:', message, ...args);
  },

  debug: (namespace: string, message: string, ...args: any[]) => {
    createLogger(namespace)('DEBUG:', message, ...args);
  },

  // Performance logging
  time: (namespace: string, label: string) => {
    const log = createLogger(namespace);
    console.time(label);
    log('TIMER START:', label);
    return {
      end: () => {
        console.timeEnd(label);
        log('TIMER END:', label);
      }
    };
  }
};

// Export debug instance for direct use
export { debug };
export default debug;
