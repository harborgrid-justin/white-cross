/**
 * @fileoverview System API Legacy Compatibility Layer
 * 
 * This file provides backward compatibility for the legacy systemApi import.
 * The actual implementation has been refactored into a modular structure
 * located in the ./systemApi/ directory for better maintainability.
 * 
 * @deprecated Import from './systemApi' instead for new code
 */

// Re-export everything from the modular systemApi implementation
export * from './systemApi/index';

// Default export for backward compatibility
export { default } from './systemApi/index';
