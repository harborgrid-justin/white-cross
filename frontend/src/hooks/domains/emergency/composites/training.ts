import { UseQueryOptions } from '@tanstack/react-query';
import {
  useTraining,
  useTrainingDetails,
  useUpcomingTraining,
  useRequiredTraining,
} from '../queries/useEmergencyQueries';
import {
  useCreateTraining,
  useUpdateTraining,
  useDeleteTraining,
} from '../mutations/useEmergencyMutations';

// Training management with compliance tracking
export const useTrainingManagement = (
  trainingId?: string,
  userId?: string,
  options?: UseQueryOptions<any, Error>
) => {
  const trainingQuery = useTraining(undefined, options);
  const trainingDetailsQuery = useTrainingDetails(trainingId || '', {
    ...options,
    enabled: !!trainingId
  });
  const upcomingTrainingQuery = useUpcomingTraining(userId || '', {
    ...options,
    enabled: !!userId
  });
  const requiredTrainingQuery = useRequiredTraining(userId || '', {
    ...options,
    enabled: !!userId
  });

  const createTraining = useCreateTraining();
  const updateTraining = useUpdateTraining();
  const deleteTraining = useDeleteTraining();

  return {
    // Data
    training: trainingQuery.data || [],
    trainingDetails: trainingDetailsQuery.data,
    upcomingTraining: upcomingTrainingQuery.data || [],
    requiredTraining: requiredTrainingQuery.data || [],

    // Loading states
    isLoadingTraining: trainingQuery.isLoading,
    isLoadingDetails: trainingDetailsQuery.isLoading,
    isLoadingUpcoming: upcomingTrainingQuery.isLoading,
    isLoadingRequired: requiredTrainingQuery.isLoading,
    isLoading: trainingQuery.isLoading || trainingDetailsQuery.isLoading,

    // Error states
    trainingError: trainingQuery.error,
    detailsError: trainingDetailsQuery.error,
    upcomingError: upcomingTrainingQuery.error,
    requiredError: requiredTrainingQuery.error,

    // Mutations
    createTraining: createTraining.mutate,
    updateTraining: updateTraining.mutate,
    deleteTraining: deleteTraining.mutate,

    // Mutation states
    isCreating: createTraining.isPending,
    isUpdating: updateTraining.isPending,
    isDeleting: deleteTraining.isPending,

    // Computed values
    totalTraining: trainingQuery.data?.length || 0,
    activeTraining: trainingQuery.data?.filter(t => t.isActive).length || 0,
    upcomingCount: upcomingTrainingQuery.data?.length || 0,
    requiredCount: requiredTrainingQuery.data?.length || 0,
    trainingByType: trainingQuery.data?.reduce((acc, training) => {
      acc[training.type] = (acc[training.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},

    // Utility functions
    refetch: () => {
      trainingQuery.refetch();
      trainingDetailsQuery.refetch();
      upcomingTrainingQuery.refetch();
      requiredTrainingQuery.refetch();
    },
  };
};
