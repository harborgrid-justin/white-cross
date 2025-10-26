/**
 * @fileoverview Medication GraphQL Hooks
 *
 * Custom hooks for medication queries and mutations with error handling
 *
 * @module graphql/hooks/useMedications
 * @since 1.0.0
 */

'use client';

import { useQuery, useMutation, useSubscription, ApolloError } from '@apollo/client';
import { useCallback } from 'react';
import {
  GET_MEDICATIONS,
  GET_MEDICATION,
  GET_STUDENT_MEDICATIONS,
  GET_DUE_MEDICATIONS,
} from '../queries';
import {
  CREATE_MEDICATION,
  UPDATE_MEDICATION,
  DELETE_MEDICATION,
  ADMINISTER_MEDICATION,
  DISCONTINUE_MEDICATION,
} from '../mutations';
import { MEDICATION_REMINDER_SUBSCRIPTION } from '../subscriptions';
import {
  buildQueryVariables,
  buildOptimisticCreateResponse,
  handleGraphQLError,
} from '../utils';

/**
 * Hook to fetch medications
 */
export const useMedications = (filters?: any, pagination?: any) => {
  const variables = buildQueryVariables(filters, pagination);

  const { data, loading, error, refetch, fetchMore } = useQuery(GET_MEDICATIONS, {
    variables,
    notifyOnNetworkStatusChange: true,
  });

  const medications = data?.medications?.medications || [];
  const paginationInfo = data?.medications?.pagination;

  return {
    medications,
    pagination: paginationInfo,
    loading,
    error: error ? handleGraphQLError(error) : null,
    refetch,
  };
};

/**
 * Hook to fetch single medication
 */
export const useMedication = (id: string) => {
  const { data, loading, error, refetch } = useQuery(GET_MEDICATION, {
    variables: { id },
    skip: !id,
  });

  return {
    medication: data?.medication,
    loading,
    error: error ? handleGraphQLError(error) : null,
    refetch,
  };
};

/**
 * Hook to fetch student medications
 */
export const useStudentMedications = (studentId: string, isActive?: boolean) => {
  const { data, loading, error, refetch } = useQuery(GET_STUDENT_MEDICATIONS, {
    variables: { studentId, isActive },
    skip: !studentId,
  });

  return {
    medications: data?.studentMedications || [],
    loading,
    error: error ? handleGraphQLError(error) : null,
    refetch,
  };
};

/**
 * Hook to fetch due medications
 */
export const useDueMedications = (date?: Date, studentId?: string) => {
  const { data, loading, error, refetch } = useQuery(GET_DUE_MEDICATIONS, {
    variables: {
      date: date?.toISOString(),
      studentId,
    },
    pollInterval: 60000, // Poll every minute
  });

  return {
    dueMedications: data?.dueMedications || [],
    loading,
    error: error ? handleGraphQLError(error) : null,
    refetch,
  };
};

/**
 * Hook to create medication
 */
export const useCreateMedication = () => {
  const [createMedication, { loading, error }] = useMutation(CREATE_MEDICATION, {
    refetchQueries: ['GetMedications', 'GetStudentMedications'],
    awaitRefetchQueries: true,
  });

  const handleCreate = useCallback(
    async (input: any) => {
      try {
        const result = await createMedication({ variables: { input } });
        return { data: result.data?.createMedication, error: null };
      } catch (err) {
        return { data: null, error: handleGraphQLError(err as ApolloError) };
      }
    },
    [createMedication]
  );

  return {
    createMedication: handleCreate,
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
};

/**
 * Hook to update medication
 */
export const useUpdateMedication = () => {
  const [updateMedication, { loading, error }] = useMutation(UPDATE_MEDICATION);

  const handleUpdate = useCallback(
    async (id: string, input: any) => {
      try {
        const result = await updateMedication({ variables: { id, input } });
        return { data: result.data?.updateMedication, error: null };
      } catch (err) {
        return { data: null, error: handleGraphQLError(err as ApolloError) };
      }
    },
    [updateMedication]
  );

  return {
    updateMedication: handleUpdate,
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
};

/**
 * Hook to administer medication
 */
export const useAdministerMedication = () => {
  const [administerMedication, { loading, error }] = useMutation(ADMINISTER_MEDICATION, {
    refetchQueries: ['GetDueMedications', 'GetMedicationAdministrations'],
  });

  const handleAdminister = useCallback(
    async (input: any) => {
      try {
        const result = await administerMedication({ variables: { input } });
        return { data: result.data?.administerMedication, error: null };
      } catch (err) {
        return { data: null, error: handleGraphQLError(err as ApolloError) };
      }
    },
    [administerMedication]
  );

  return {
    administerMedication: handleAdminister,
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
};

/**
 * Hook to discontinue medication
 */
export const useDiscontinueMedication = () => {
  const [discontinueMedication, { loading, error }] = useMutation(DISCONTINUE_MEDICATION);

  const handleDiscontinue = useCallback(
    async (id: string, reason?: string) => {
      try {
        const result = await discontinueMedication({ variables: { id, reason } });
        return { data: result.data?.discontinueMedication, error: null };
      } catch (err) {
        return { data: null, error: handleGraphQLError(err as ApolloError) };
      }
    },
    [discontinueMedication]
  );

  return {
    discontinueMedication: handleDiscontinue,
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
};

/**
 * Hook to subscribe to medication reminders
 */
export const useMedicationReminders = (nurseId: string, onReminder?: (data: any) => void) => {
  const { data, loading, error } = useSubscription(MEDICATION_REMINDER_SUBSCRIPTION, {
    variables: { nurseId },
    skip: !nurseId,
    onData: ({ data }) => {
      if (data.data?.medicationReminderTriggered && onReminder) {
        onReminder(data.data.medicationReminderTriggered);
      }
    },
  });

  return {
    reminder: data?.medicationReminderTriggered,
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
};
