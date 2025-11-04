// Export all API functions in a combined object
export { emergencyPlanApi } from './emergencyPlanApi';
export { emergencyIncidentApi } from './emergencyIncidentApi';
export { emergencyContactApi } from './emergencyContactApi';
export { emergencyProcedureApi } from './emergencyProcedureApi';
export { emergencyResourceApi } from './emergencyResourceApi';
export { emergencyTrainingApi } from './emergencyTrainingApi';
export { bulkOperationApi } from './bulkOperationApi';

import { emergencyPlanApi } from './emergencyPlanApi';
import { emergencyIncidentApi } from './emergencyIncidentApi';
import { emergencyContactApi } from './emergencyContactApi';
import { emergencyProcedureApi } from './emergencyProcedureApi';
import { emergencyResourceApi } from './emergencyResourceApi';
import { emergencyTrainingApi } from './emergencyTrainingApi';
import { bulkOperationApi } from './bulkOperationApi';

// Combined API object for backward compatibility
export const mockEmergencyMutationAPI = {
  ...emergencyPlanApi,
  ...emergencyIncidentApi,
  ...emergencyContactApi,
  ...emergencyProcedureApi,
  ...emergencyResourceApi,
  ...emergencyTrainingApi,
  ...bulkOperationApi,
};
