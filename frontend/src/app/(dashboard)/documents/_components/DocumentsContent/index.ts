// Import the main component
import DocumentsContentComponent from './DocumentsContent';

// Main component export for backward compatibility
export { default as DocumentsContent } from './DocumentsContent';

// Re-export all component pieces for flexibility
export { DocumentStatsComponent, type DocumentStats } from './DocumentStats';
export { DocumentFiltersComponent } from './DocumentFilters';
export { DocumentActionsComponent, type ViewMode } from './DocumentActions';
export { DocumentGridComponent } from './DocumentGrid';
export { DocumentListComponent } from './DocumentList';

// Re-export types and utilities
export type { Document, DocumentType, DocumentStatus, AccessLevel } from './types';
export { 
  getStatusBadgeClass, 
  getAccessLevelBadgeClass, 
  getFileIcon, 
  formatFileSize, 
  formatDate, 
  isExpiringSoon 
} from './utils';

// Default export for direct replacement
export default DocumentsContentComponent;
