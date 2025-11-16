import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  EMERGENCY_QUERY_KEYS,
  invalidateContactsQueries,
  EmergencyContact,
} from '../config';
import { serverPost, serverPut, serverDelete } from '@/lib/api/client';
import { EMERGENCY_CONTACTS_ENDPOINTS } from '@/constants/api/students';
import { useApiError } from '@/hooks/shared/useApiError';
import {
  CreateContactInput,
  UpdateContactInput,
} from './types';

// Emergency Contacts Mutations
export const useCreateContact = (
  options?: UseMutationOptions<EmergencyContact, Error, CreateContactInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: CreateContactInput) => {
      try {
        return await serverPost(EMERGENCY_CONTACTS_ENDPOINTS.BASE, data);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (newContact) => {
      invalidateContactsQueries(queryClient);
      toast.success(`Contact "${newContact.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create contact: ${error.message}`);
    },
    ...options,
  });
};

export const useUpdateContact = (
  options?: UseMutationOptions<EmergencyContact, Error, UpdateContactInput>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (data: UpdateContactInput) => {
      try {
        return await serverPut(EMERGENCY_CONTACTS_ENDPOINTS.BY_ID(data.id), data);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: (updatedContact) => {
      queryClient.setQueryData(
        EMERGENCY_QUERY_KEYS.contactDetails(updatedContact.id),
        updatedContact
      );
      invalidateContactsQueries(queryClient);
      toast.success('Contact updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update contact: ${error.message}`);
    },
    ...options,
  });
};

export const useDeleteContact = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async (contactId: string) => {
      try {
        await serverDelete(EMERGENCY_CONTACTS_ENDPOINTS.BY_ID(contactId));
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: () => {
      invalidateContactsQueries(queryClient);
      toast.success('Contact deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete contact: ${error.message}`);
    },
    ...options,
  });
};
