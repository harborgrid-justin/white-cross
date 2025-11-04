// Central export for all API functions
import { documentAPI } from './documentAPI';
import { categoryAPI } from './categoryAPI';
import { templateAPI } from './templateAPI';
import { shareAPI } from './shareAPI';
import { commentAPI } from './commentAPI';
import { bulkAPI } from './bulkAPI';

// Combined API object for backward compatibility
export const mockDocumentMutationAPI = {
  ...documentAPI,
  ...categoryAPI,
  ...templateAPI,
  ...shareAPI,
  ...commentAPI,
  ...bulkAPI,
};

// Export individual API modules for granular imports
export { documentAPI } from './documentAPI';
export { categoryAPI } from './categoryAPI';
export { templateAPI } from './templateAPI';
export { shareAPI } from './shareAPI';
export { commentAPI } from './commentAPI';
export { bulkAPI } from './bulkAPI';
