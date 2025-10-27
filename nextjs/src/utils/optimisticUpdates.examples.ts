/**
 * WF-COMP-347 | optimisticUpdates.examples.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: @tanstack/react-query, @/hooks/useOptimisticIncidents, @/utils/optimisticHelpers
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions | Key Features: useState, component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Optimistic Updates - Usage Examples
 *
 * Comprehensive examples demonstrating how to use the optimistic update system
 * in various scenarios throughout the White Cross healthcare platform.
 *
 * @module OptimisticUpdatesExamples
 * @version 1.0.0
 */

import { useQueryClient } from '@tanstack/react-query';
import {
  useOptimisticIncidentCreate,
  useOptimisticIncidentUpdate,
  useOptimisticIncidentDelete,
  useOptimisticWitnessCreate,
  useOptimisticFollowUpCreate,
  useOptimisticFollowUpComplete,
} from '@/hooks/useOptimisticIncidents';
import {
  optimisticCreate,
  optimisticUpdate,
  optimisticDelete,
  optimisticBulkDelete,
  confirmCreate,
  rollbackUpdate,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} from '@/utils/optimisticHelpers';
import {
  RollbackStrategy,
  ConflictResolutionStrategy,
  OperationType,
} from '@/utils/optimisticUpdates';
import type {
  IncidentType,
  IncidentSeverity,
  WitnessType,
  ActionPriority,
} from '@/types/incidents';

// =====================
// EXAMPLE 1: BASIC INCIDENT CREATION
// =====================

/**
 * Example: Create incident report with optimistic update
 */
export function ExampleBasicIncidentCreate() {
  const createMutation = useOptimisticIncidentCreate({
    onSuccess: (response) => {
      console.log('Incident created:', response.report);
    },
    onError: (error) => {
      console.error('Failed to create incident:', error);
    },
  });

  const handleCreateIncident = () => {
    createMutation.mutate({
      studentId: 'student-123',
      reportedById: 'nurse-456',
      type: 'INJURY' as IncidentType,
      severity: 'MEDIUM' as IncidentSeverity,
      description: 'Student fell on playground and scraped knee',
      location: 'Playground',
      occurredAt: new Date().toISOString(),
      actionsTaken: 'Cleaned wound, applied bandage, provided ice pack',
      witnesses: ['teacher-789'],
      parentNotified: true,
      followUpRequired: true,
      followUpNotes: 'Monitor for signs of infection',
    });
  };

  return (
    <button
      onClick={handleCreateIncident}
      disabled={createMutation.isPending}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      {createMutation.isPending ? 'Creating...' : 'Report Incident'}
    </button>
  );
}

// =====================
// EXAMPLE 2: UPDATE WITH CONFLICT RESOLUTION
// =====================

/**
 * Example: Update incident with automatic conflict resolution
 */
export function ExampleIncidentUpdateWithConflictResolution() {
  const updateMutation = useOptimisticIncidentUpdate({
    onSuccess: () => {
      console.log('Incident updated successfully');
    },
  });

  const handleUpdateStatus = (incidentId: string) => {
    updateMutation.mutate({
      id: incidentId,
      data: {
        status: 'RESOLVED' as any,
        followUpNotes: 'Student recovered fully, no further issues',
      },
    });
  };

  return (
    <button
      onClick={() => handleUpdateStatus('incident-123')}
      disabled={updateMutation.isPending}
      className="px-4 py-2 bg-green-600 text-white rounded"
    >
      Mark as Resolved
    </button>
  );
}

// =====================
// EXAMPLE 3: MANUAL OPTIMISTIC UPDATE
// =====================

/**
 * Example: Manual optimistic update with custom rollback strategy
 */
export function ExampleManualOptimisticUpdate() {
  const queryClient = useQueryClient();

  const handleManualUpdate = async (incidentId: string) => {
    // Create manual optimistic update
    const updateId = optimisticUpdate(
      queryClient,
      ['incidents'],
      incidentId,
      {
        status: 'INVESTIGATING' as any,
        updatedAt: new Date().toISOString(),
      },
      {
        rollbackStrategy: RollbackStrategy.REFETCH,
        conflictStrategy: ConflictResolutionStrategy.SERVER_WINS,
        userId: 'current-user-id',
        metadata: {
          source: 'manual-update',
          reason: 'Status change',
        },
      }
    );

    // Simulate API call
    try {
      // const response = await api.updateIncident(incidentId, { status: 'INVESTIGATING' });
      // confirmUpdate(updateId, response);
    } catch (error) {
      // Rollback on error
      await rollbackUpdate(queryClient, updateId, {
        message: (error as Error).message,
      });
    }
  };

  return (
    <button onClick={() => handleManualUpdate('incident-123')} className="px-4 py-2 bg-blue-600 text-white rounded">
      Investigate
    </button>
  );
}

// =====================
// EXAMPLE 4: WITNESS STATEMENTS
// =====================

/**
 * Example: Add witness statement with optimistic update
 */
export function ExampleWitnessStatement() {
  const createWitnessMutation = useOptimisticWitnessCreate({
    onSuccess: () => {
      console.log('Witness statement added');
    },
  });

  const handleAddWitness = () => {
    createWitnessMutation.mutate({
      incidentReportId: 'incident-123',
      witnessName: 'John Smith',
      witnessType: 'STAFF' as WitnessType,
      witnessContact: 'john.smith@school.edu',
      statement: 'I saw the student fall from the swing set at approximately 10:30 AM.',
    });
  };

  return (
    <button
      onClick={handleAddWitness}
      disabled={createWitnessMutation.isPending}
      className="px-4 py-2 bg-purple-600 text-white rounded"
    >
      Add Witness Statement
    </button>
  );
}

// =====================
// EXAMPLE 5: FOLLOW-UP ACTIONS
// =====================

/**
 * Example: Create and complete follow-up actions
 */
export function ExampleFollowUpActions() {
  const createFollowUp = useOptimisticFollowUpCreate();
  const completeFollowUp = useOptimisticFollowUpComplete();

  const handleCreateFollowUp = () => {
    createFollowUp.mutate({
      incidentReportId: 'incident-123',
      action: 'Schedule follow-up appointment with school nurse',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      priority: 'HIGH' as ActionPriority,
      assignedTo: 'nurse-456',
    });
  };

  const handleCompleteFollowUp = (actionId: string) => {
    completeFollowUp.mutate({
      id: actionId,
      notes: 'Follow-up completed. Student is healthy and fully recovered.',
    });
  };

  return (
    <div className="space-x-2">
      <button
        onClick={handleCreateFollowUp}
        disabled={createFollowUp.isPending}
        className="px-4 py-2 bg-orange-600 text-white rounded"
      >
        Create Follow-Up
      </button>
      <button
        onClick={() => handleCompleteFollowUp('action-789')}
        disabled={completeFollowUp.isPending}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Complete Follow-Up
      </button>
    </div>
  );
}

// =====================
// EXAMPLE 6: BULK OPERATIONS
// =====================

/**
 * Example: Bulk delete with optimistic updates
 */
export function ExampleBulkDelete() {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const handleBulkDelete = async () => {
    // Create optimistic bulk delete
    const updateId = optimisticBulkDelete(
      queryClient,
      ['incidents'],
      selectedIds,
      {
        rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
      }
    );

    try {
      // Simulate API call
      // await api.bulkDeleteIncidents(selectedIds);
      // confirmUpdate(updateId!, { success: true });
      setSelectedIds([]);
    } catch (error) {
      // Rollback on error
      if (updateId) {
        await rollbackUpdate(queryClient, updateId, {
          message: (error as Error).message,
        });
      }
    }
  };

  return (
    <button
      onClick={handleBulkDelete}
      disabled={selectedIds.length === 0}
      className="px-4 py-2 bg-red-600 text-white rounded"
    >
      Delete {selectedIds.length} Selected
    </button>
  );
}

// =====================
// EXAMPLE 7: TRANSACTIONS
// =====================

/**
 * Example: Transaction for multiple related updates
 */
export function ExampleTransaction() {
  const queryClient = useQueryClient();

  const handleComplexOperation = async () => {
    // Begin transaction
    const transactionId = beginTransaction();

    try {
      // Create incident
      const { updateId: incidentUpdateId, tempId: incidentTempId } = optimisticCreate(
        queryClient,
        ['incidents'],
        {
          studentId: 'student-123',
          reportedById: 'nurse-456',
          type: 'INJURY' as any,
          severity: 'MEDIUM' as any,
          description: 'Incident description',
          location: 'Classroom',
          occurredAt: new Date().toISOString(),
          actionsTaken: 'First aid provided',
        },
        {
          transactionId,
        }
      );

      // Add witness
      const { updateId: witnessUpdateId } = optimisticCreate(
        queryClient,
        ['incidents', incidentTempId, 'witnesses'],
        {
          incidentReportId: incidentTempId,
          witnessName: 'Jane Doe',
          witnessType: 'STAFF' as any,
          statement: 'Witnessed the incident',
        },
        {
          transactionId,
          dependencies: [incidentUpdateId],
        }
      );

      // Simulate API calls
      // const incidentResponse = await api.createIncident(...);
      // const witnessResponse = await api.createWitness(...);

      // Commit transaction
      commitTransaction(transactionId, queryClient);
    } catch (error) {
      // Rollback entire transaction
      await rollbackTransaction(queryClient, transactionId);
      console.error('Transaction failed:', error);
    }
  };

  return (
    <button onClick={handleComplexOperation} className="px-4 py-2 bg-indigo-600 text-white rounded">
      Create Incident with Witness
    </button>
  );
}

// =====================
// EXAMPLE 8: CUSTOM MERGE FUNCTION
// =====================

/**
 * Example: Custom merge function for complex conflict resolution
 */
export function ExampleCustomMerge() {
  const queryClient = useQueryClient();

  const customMergeFn = (serverData: any, clientData: any) => {
    return {
      ...serverData,
      // Keep client's description if it's longer (more detailed)
      description:
        clientData.description.length > serverData.description.length
          ? clientData.description
          : serverData.description,
      // Merge witness arrays
      witnesses: [
        ...new Set([...(serverData.witnesses || []), ...(clientData.witnesses || [])]),
      ],
      // Keep latest timestamp
      updatedAt: new Date(Math.max(
        new Date(serverData.updatedAt).getTime(),
        new Date(clientData.updatedAt).getTime()
      )).toISOString(),
    };
  };

  const handleUpdateWithCustomMerge = (incidentId: string) => {
    optimisticUpdate(
      queryClient,
      ['incidents'],
      incidentId,
      {
        description: 'Updated description with more details',
        witnesses: ['new-witness-id'],
      },
      {
        conflictStrategy: ConflictResolutionStrategy.MERGE,
        mergeFn: customMergeFn,
      }
    );
  };

  return (
    <button onClick={() => handleUpdateWithCustomMerge('incident-123')} className="px-4 py-2 bg-teal-600 text-white rounded">
      Update with Custom Merge
    </button>
  );
}

// =====================
// EXAMPLE 9: WITH UI COMPONENTS
// =====================

/**
 * Example: Complete component with optimistic updates and UI feedback
 */
export function ExampleCompleteComponent() {
  const createMutation = useOptimisticIncidentCreate();
  const updateMutation = useOptimisticIncidentUpdate();
  const deleteMutation = useOptimisticIncidentDelete();

  return (
    <div className="space-y-4">
      {/* Optimistic Update Indicator */}
      <OptimisticUpdateIndicator position="top-right" showDetails={true} />

      {/* Update Toast */}
      <UpdateToast position="bottom-right" showConfirmed={true} showFailed={true} />

      {/* Conflict Resolution Modal */}
      <ConflictResolutionModal isOpen={false} onClose={() => {}} autoShow={true} />

      {/* Actions */}
      <div className="space-x-2">
        <button
          onClick={() =>
            createMutation.mutate({
              /* ... */
            } as any)
          }
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create
        </button>

        <button
          onClick={() =>
            updateMutation.mutate({
              id: 'incident-123',
              data: { status: 'RESOLVED' as any },
            })
          }
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Update
        </button>

        <button
          onClick={() => deleteMutation.mutate('incident-123')}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </div>

      {/* Rollback Button (if needed) */}
      {createMutation.data && (
        <RollbackButton
          updateId="update-id"
          variant="danger"
          confirmBeforeRollback={true}
        />
      )}
    </div>
  );
}

// =====================
// EXAMPLE 10: ERROR HANDLING
// =====================

/**
 * Example: Comprehensive error handling with optimistic updates
 */
export function ExampleErrorHandling() {
  const queryClient = useQueryClient();
  const [error, setError] = React.useState<string | null>(null);

  const handleCreateWithErrorHandling = async () => {
    const { updateId, tempId } = optimisticCreate(
      queryClient,
      ['incidents'],
      {
        studentId: 'student-123',
        reportedById: 'nurse-456',
        type: 'INJURY' as any,
        severity: 'LOW' as any,
        description: 'Minor scrape',
        location: 'Hallway',
        occurredAt: new Date().toISOString(),
        actionsTaken: 'Bandage applied',
      },
      {
        rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        maxRetries: 3,
      }
    );

    try {
      // Simulate API call that might fail
      // const response = await api.createIncident(...);

      // Simulate error
      throw new Error('Network error: Unable to reach server');

      // On success:
      // confirmCreate(queryClient, ['incidents'], updateId, tempId, response);
    } catch (err) {
      const error = err as Error;
      setError(error.message);

      // Rollback with error details
      await rollbackUpdate(queryClient, updateId, {
        message: error.message,
        code: 'NETWORK_ERROR',
        statusCode: 503,
        details: { originalError: error },
      });

      // Show user-friendly error message
      console.error('Failed to create incident:', {
        tempId,
        updateId,
        error: error.message,
      });
    }
  };

  return (
    <div>
      <button onClick={handleCreateWithErrorHandling} className="px-4 py-2 bg-blue-600 text-white rounded">
        Create with Error Handling
      </button>
      {error && (
        <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}
    </div>
  );
}

// Placeholder imports for example (replace with actual imports in real code)
import React from 'react';
import { OptimisticUpdateIndicator } from '@/components/ui/feedback/OptimisticUpdateIndicator';
import { UpdateToast } from '@/components/ui/feedback/UpdateToast';
import { ConflictResolutionModal } from '@/components/shared/data';
import { RollbackButton } from '@/components/ui/Buttons/RollbackButton';
