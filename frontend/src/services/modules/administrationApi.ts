/**
 * @fileoverview AdministrationApi Legacy Compatibility Layer
 * 
 * This file provides backward compatibility for the legacy administrationApi import.
 * The actual implementation has been refactored into a modular structure
 * located in the ./administrationApi/ directory for better maintainability.
 * 
 * @deprecated Import from './administrationApi' instead for new code
 */

// Re-export everything from the modular administrationApi implementation
export * from './administrationApi/index';

// Default export for backward compatibility
export { default } from './administrationApi/index';
