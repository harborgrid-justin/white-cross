// This file now re-exports all mutations from the modularized files
// Original file was 575 LOC - now broken down into logical modules

// Vendor CRUD operations
export {
  useCreateVendor,
  useUpdateVendor,
  useDeleteVendor,
  useActivateVendor,
  useSuspendVendor,
} from './useVendorCRUD';

// Vendor Contract mutations
export {
  useCreateVendorContract,
  useUpdateVendorContract,
  useApproveContract,
  useTerminateContract,
} from './useVendorContracts';

// Vendor Evaluation mutations
export {
  useCreateVendorEvaluation,
  useUpdateVendorEvaluation,
  useSubmitEvaluationForReview,
} from './useVendorEvaluations';

// Vendor Payment mutations
export {
  useCreateVendorPayment,
  useApprovePayment,
  useProcessPayment,
} from './useVendorPayments';

// Vendor Document mutations
export {
  useUploadVendorDocument,
  useDeleteVendorDocument,
  useReviewVendorDocument,
} from './useVendorDocuments';

// Bulk operations and onboarding
export {
  useBulkUpdateVendorStatus,
  useBulkApprovePayments,
  useInitiateVendorOnboarding,
} from './useVendorBulkOps';
