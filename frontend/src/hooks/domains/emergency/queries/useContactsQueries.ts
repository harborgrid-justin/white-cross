import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  EMERGENCY_QUERY_KEYS,
  EMERGENCY_CACHE_CONFIG,
  EmergencyContact,
} from '../config';
import { mockEmergencyAPI } from './mockEmergencyAPI';

// Emergency Contacts Queries
export const useContacts = (
  filters?: any,
  options?: UseQueryOptions<EmergencyContact[], Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.contactsList(filters),
    queryFn: () => mockEmergencyAPI.getContacts(filters),
    staleTime: EMERGENCY_CACHE_CONFIG.CONTACTS_STALE_TIME,
    ...options,
  });
};

export const useContactDetails = (
  id: string,
  options?: UseQueryOptions<EmergencyContact, Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.contactDetails(id),
    queryFn: () => mockEmergencyAPI.getContactById(id),
    staleTime: EMERGENCY_CACHE_CONFIG.CONTACTS_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

export const usePrimaryContacts = (
  options?: UseQueryOptions<EmergencyContact[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'contacts', 'primary'],
    queryFn: () => mockEmergencyAPI.getPrimaryContacts(),
    staleTime: EMERGENCY_CACHE_CONFIG.CONTACTS_STALE_TIME,
    ...options,
  });
};

export const use24x7Contacts = (
  options?: UseQueryOptions<EmergencyContact[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'contacts', '24x7'],
    queryFn: () => mockEmergencyAPI.get24x7Contacts(),
    staleTime: EMERGENCY_CACHE_CONFIG.CONTACTS_STALE_TIME,
    ...options,
  });
};
