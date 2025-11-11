/**
 * Inventory Management API - Unified Interface
 * 
 * This file provides backward compatibility by re-exporting all
 * inventory API functionality from the modular structure.
 * 
 * @module services/modules/inventoryApi
 */

// Re-export everything from the modular structure
export * from './inventoryApi/index';

// Default export for backward compatibility
export { inventoryApi as default } from './inventoryApi/index';
