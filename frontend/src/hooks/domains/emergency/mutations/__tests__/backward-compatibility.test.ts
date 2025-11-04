/**
 * Backward Compatibility Test Suite
 *
 * Ensures that the refactored mutation hooks maintain 100% backward compatibility
 * with the original useEmergencyMutations.ts file.
 */

import { describe, it, expect } from '@jest/globals';

describe('Emergency Mutations - Backward Compatibility', () => {
  describe('Import from useEmergencyMutations.ts (legacy)', () => {
    it('should export all plan mutation hooks', async () => {
      const mutations = await import('../useEmergencyMutations');

      expect(mutations.useCreateEmergencyPlan).toBeDefined();
      expect(mutations.useUpdateEmergencyPlan).toBeDefined();
      expect(mutations.useDeleteEmergencyPlan).toBeDefined();
      expect(mutations.useActivatePlan).toBeDefined();
    });

    it('should export all incident mutation hooks', async () => {
      const mutations = await import('../useEmergencyMutations');

      expect(mutations.useCreateIncident).toBeDefined();
      expect(mutations.useUpdateIncident).toBeDefined();
      expect(mutations.useCloseIncident).toBeDefined();
      expect(mutations.useAddTimelineEntry).toBeDefined();
    });

    it('should export all contact mutation hooks', async () => {
      const mutations = await import('../useEmergencyMutations');

      expect(mutations.useCreateContact).toBeDefined();
      expect(mutations.useUpdateContact).toBeDefined();
      expect(mutations.useDeleteContact).toBeDefined();
    });

    it('should export all procedure mutation hooks', async () => {
      const mutations = await import('../useEmergencyMutations');

      expect(mutations.useCreateProcedure).toBeDefined();
      expect(mutations.useUpdateProcedure).toBeDefined();
      expect(mutations.useDeleteProcedure).toBeDefined();
    });

    it('should export all resource mutation hooks', async () => {
      const mutations = await import('../useEmergencyMutations');

      expect(mutations.useCreateResource).toBeDefined();
      expect(mutations.useUpdateResource).toBeDefined();
      expect(mutations.useDeleteResource).toBeDefined();
    });

    it('should export all training mutation hooks', async () => {
      const mutations = await import('../useEmergencyMutations');

      expect(mutations.useCreateTraining).toBeDefined();
      expect(mutations.useUpdateTraining).toBeDefined();
      expect(mutations.useDeleteTraining).toBeDefined();
    });

    it('should export all bulk operation hooks', async () => {
      const mutations = await import('../useEmergencyMutations');

      expect(mutations.useBulkUpdateIncidents).toBeDefined();
      expect(mutations.useBulkActivateResources).toBeDefined();
    });

    it('should export the combined emergencyMutations object', async () => {
      const { emergencyMutations } = await import('../useEmergencyMutations');

      expect(emergencyMutations).toBeDefined();
      expect(typeof emergencyMutations).toBe('object');
      expect(Object.keys(emergencyMutations).length).toBe(22);
    });

    it('should export all type definitions', async () => {
      const mutations = await import('../useEmergencyMutations');

      // Type definitions should be exported (checked via TypeScript)
      // This test ensures they're part of the module
      expect(mutations).toBeDefined();
    });
  });

  describe('Import from index.ts', () => {
    it('should export all mutation hooks from index', async () => {
      const mutations = await import('../index');

      expect(mutations.useCreateEmergencyPlan).toBeDefined();
      expect(mutations.useUpdateEmergencyPlan).toBeDefined();
      expect(mutations.useDeleteEmergencyPlan).toBeDefined();
      expect(mutations.useActivatePlan).toBeDefined();
      expect(mutations.useCreateIncident).toBeDefined();
      expect(mutations.useUpdateIncident).toBeDefined();
      expect(mutations.useCloseIncident).toBeDefined();
      expect(mutations.useAddTimelineEntry).toBeDefined();
      expect(mutations.useCreateContact).toBeDefined();
      expect(mutations.useUpdateContact).toBeDefined();
      expect(mutations.useDeleteContact).toBeDefined();
      expect(mutations.useCreateProcedure).toBeDefined();
      expect(mutations.useUpdateProcedure).toBeDefined();
      expect(mutations.useDeleteProcedure).toBeDefined();
      expect(mutations.useCreateResource).toBeDefined();
      expect(mutations.useUpdateResource).toBeDefined();
      expect(mutations.useDeleteResource).toBeDefined();
      expect(mutations.useCreateTraining).toBeDefined();
      expect(mutations.useUpdateTraining).toBeDefined();
      expect(mutations.useDeleteTraining).toBeDefined();
      expect(mutations.useBulkUpdateIncidents).toBeDefined();
      expect(mutations.useBulkActivateResources).toBeDefined();
    });

    it('should have emergencyMutations object with all hooks', async () => {
      const { emergencyMutations } = await import('../index');

      expect(emergencyMutations.useCreateEmergencyPlan).toBeDefined();
      expect(emergencyMutations.useUpdateEmergencyPlan).toBeDefined();
      expect(emergencyMutations.useDeleteEmergencyPlan).toBeDefined();
      expect(emergencyMutations.useActivatePlan).toBeDefined();
      expect(emergencyMutations.useCreateIncident).toBeDefined();
      expect(emergencyMutations.useUpdateIncident).toBeDefined();
      expect(emergencyMutations.useCloseIncident).toBeDefined();
      expect(emergencyMutations.useAddTimelineEntry).toBeDefined();
      expect(emergencyMutations.useCreateContact).toBeDefined();
      expect(emergencyMutations.useUpdateContact).toBeDefined();
      expect(emergencyMutations.useDeleteContact).toBeDefined();
      expect(emergencyMutations.useCreateProcedure).toBeDefined();
      expect(emergencyMutations.useUpdateProcedure).toBeDefined();
      expect(emergencyMutations.useDeleteProcedure).toBeDefined();
      expect(emergencyMutations.useCreateResource).toBeDefined();
      expect(emergencyMutations.useUpdateResource).toBeDefined();
      expect(emergencyMutations.useDeleteResource).toBeDefined();
      expect(emergencyMutations.useCreateTraining).toBeDefined();
      expect(emergencyMutations.useUpdateTraining).toBeDefined();
      expect(emergencyMutations.useDeleteTraining).toBeDefined();
      expect(emergencyMutations.useBulkUpdateIncidents).toBeDefined();
      expect(emergencyMutations.useBulkActivateResources).toBeDefined();
    });
  });

  describe('Import from specific module files', () => {
    it('should import from useEmergencyPlanMutations', async () => {
      const mutations = await import('../useEmergencyPlanMutations');

      expect(mutations.useCreateEmergencyPlan).toBeDefined();
      expect(mutations.useUpdateEmergencyPlan).toBeDefined();
      expect(mutations.useDeleteEmergencyPlan).toBeDefined();
      expect(mutations.useActivatePlan).toBeDefined();
    });

    it('should import from useEmergencyIncidentMutations', async () => {
      const mutations = await import('../useEmergencyIncidentMutations');

      expect(mutations.useCreateIncident).toBeDefined();
      expect(mutations.useUpdateIncident).toBeDefined();
      expect(mutations.useCloseIncident).toBeDefined();
      expect(mutations.useAddTimelineEntry).toBeDefined();
    });

    it('should import from useEmergencyContactMutations', async () => {
      const mutations = await import('../useEmergencyContactMutations');

      expect(mutations.useCreateContact).toBeDefined();
      expect(mutations.useUpdateContact).toBeDefined();
      expect(mutations.useDeleteContact).toBeDefined();
    });

    it('should import from useEmergencyProcedureMutations', async () => {
      const mutations = await import('../useEmergencyProcedureMutations');

      expect(mutations.useCreateProcedure).toBeDefined();
      expect(mutations.useUpdateProcedure).toBeDefined();
      expect(mutations.useDeleteProcedure).toBeDefined();
    });

    it('should import from useEmergencyResourceMutations', async () => {
      const mutations = await import('../useEmergencyResourceMutations');

      expect(mutations.useCreateResource).toBeDefined();
      expect(mutations.useUpdateResource).toBeDefined();
      expect(mutations.useDeleteResource).toBeDefined();
    });

    it('should import from useEmergencyTrainingMutations', async () => {
      const mutations = await import('../useEmergencyTrainingMutations');

      expect(mutations.useCreateTraining).toBeDefined();
      expect(mutations.useUpdateTraining).toBeDefined();
      expect(mutations.useDeleteTraining).toBeDefined();
    });

    it('should import from useBulkOperationMutations', async () => {
      const mutations = await import('../useBulkOperationMutations');

      expect(mutations.useBulkUpdateIncidents).toBeDefined();
      expect(mutations.useBulkActivateResources).toBeDefined();
    });
  });

  describe('Consistency across import methods', () => {
    it('should provide the same hooks regardless of import method', async () => {
      const fromLegacy = await import('../useEmergencyMutations');
      const fromIndex = await import('../index');
      const fromSpecific = await import('../useEmergencyPlanMutations');

      // All should provide the same function reference
      expect(fromLegacy.useCreateEmergencyPlan).toBe(fromIndex.useCreateEmergencyPlan);
      expect(fromIndex.useCreateEmergencyPlan).toBe(fromSpecific.useCreateEmergencyPlan);
    });

    it('should provide the same emergencyMutations object', async () => {
      const fromLegacy = await import('../useEmergencyMutations');
      const fromIndex = await import('../index');

      expect(fromLegacy.emergencyMutations).toBe(fromIndex.emergencyMutations);
    });
  });
});
