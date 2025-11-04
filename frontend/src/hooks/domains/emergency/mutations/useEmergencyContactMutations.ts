import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  EMERGENCY_QUERY_KEYS,
  invalidateContactsQueries,
  EmergencyContact,
} from '../config';
import { mockEmergencyMutationAPI } from './api';
import {
  CreateContactInput,
  UpdateContactInput,
} from './types';

// Emergency Contacts Mutations
export const useCreateContact = (
  options?: UseMutationOptions<EmergencyContact, Error, CreateContactInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.createContact,
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

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.updateContact,
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

  return useMutation({
    mutationFn: mockEmergencyMutationAPI.deleteContact,
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
