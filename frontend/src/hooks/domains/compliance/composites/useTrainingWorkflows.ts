import { useMemo } from 'react';
import {
  useTrainingDetails,
  useUserTraining,
} from '../queries/useComplianceQueries';
import {
  useEnrollUserInTraining,
  useCompleteTraining,
} from '../mutations/useComplianceMutations';

// Composite hook for training enrollment and completion
export const useTrainingEnrollment = (userId: string, trainingId?: string) => {
  const userTrainingQuery = useUserTraining(userId);
  const trainingQuery = useTrainingDetails(trainingId!, { enabled: !!trainingId });
  const enrollMutation = useEnrollUserInTraining();
  const completeMutation = useCompleteTraining();

  const userTraining = userTrainingQuery.data;
  const training = trainingQuery.data;
  const userTrainingRecord = userTraining?.find(record => record.trainingId === trainingId);

  const actions = useMemo(() => ({
    enroll: () => enrollMutation.mutate({ trainingId: trainingId!, userId }),
    complete: (completionData: any) =>
      completeMutation.mutate({ trainingId: trainingId!, userId, data: completionData }),
    isEnrolled: !!userTrainingRecord,
    isCompleted: userTrainingRecord?.status === 'COMPLETED',
    isExpired: userTrainingRecord?.status === 'EXPIRED',
    needsRetake: userTrainingRecord?.status === 'EXPIRED' || userTrainingRecord?.status === 'FAILED',
    progress: userTrainingRecord?.status === 'IN_PROGRESS' ? 50 :
             userTrainingRecord?.status === 'COMPLETED' ? 100 : 0,
  }), [userTrainingRecord, trainingId, userId, enrollMutation, completeMutation]);

  return {
    training,
    userTrainingRecord,
    isLoading: trainingQuery.isLoading || userTrainingQuery.isLoading,
    error: trainingQuery.error || userTrainingQuery.error,
    actions,
    mutations: {
      enroll: enrollMutation,
      complete: completeMutation,
    },
  };
};
