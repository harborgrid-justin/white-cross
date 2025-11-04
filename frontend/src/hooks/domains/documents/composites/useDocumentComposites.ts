// Re-export all composite hooks from modular files
export {
  useDocumentManagement,
  useDocumentDetailsComposite,
} from './useDocumentManagementComposites';

export {
  useCategoryManagement,
  useTemplateManagement,
} from './useCategoryTemplateComposites';

export {
  useDocumentSharing,
  useDocumentSearch,
} from './useSharingSearchComposites';

export {
  useRecentDocumentsComposite,
  useDocumentAnalyticsComposite,
} from './useDashboardAnalyticsComposites';

export {
  useBulkDocumentOperations,
  useMultipleDocuments,
} from './useBulkOperationsComposites';

// Combined composites object for easy import
import { useDocumentManagement, useDocumentDetailsComposite } from './useDocumentManagementComposites';
import { useCategoryManagement, useTemplateManagement } from './useCategoryTemplateComposites';
import { useDocumentSharing, useDocumentSearch } from './useSharingSearchComposites';
import { useRecentDocumentsComposite, useDocumentAnalyticsComposite } from './useDashboardAnalyticsComposites';
import { useBulkDocumentOperations, useMultipleDocuments } from './useBulkOperationsComposites';

export const documentComposites = {
  useDocumentManagement,
  useDocumentDetailsComposite,
  useCategoryManagement,
  useTemplateManagement,
  useDocumentSharing,
  useDocumentSearch,
  useRecentDocumentsComposite,
  useDocumentAnalyticsComposite,
  useBulkDocumentOperations,
  useMultipleDocuments,
};
