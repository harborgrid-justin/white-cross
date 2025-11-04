import { UseQueryOptions } from '@tanstack/react-query';
import {
  useContacts,
  useContactDetails,
  usePrimaryContacts,
  use24x7Contacts,
  useProcedures,
  useProcedureDetails,
  useProceduresByCategory,
  useResources,
  useResourceDetails,
  useAvailableResources,
  useResourcesByLocation,
} from '../queries/useEmergencyQueries';
import {
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useCreateProcedure,
  useUpdateProcedure,
  useDeleteProcedure,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
  useBulkActivateResources,
} from '../mutations/useEmergencyMutations';

// Emergency contacts management
export const useContactManagement = (
  contactId?: string,
  options?: UseQueryOptions<any, Error>
) => {
  const contactsQuery = useContacts(undefined, options);
  const contactQuery = useContactDetails(contactId || '', {
    ...options,
    enabled: !!contactId
  });
  const primaryContactsQuery = usePrimaryContacts(options);
  const contact24x7Query = use24x7Contacts(options);

  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  return {
    // Data
    contacts: contactsQuery.data || [],
    contact: contactQuery.data,
    primaryContacts: primaryContactsQuery.data || [],
    contacts24x7: contact24x7Query.data || [],

    // Loading states
    isLoadingContacts: contactsQuery.isLoading,
    isLoadingContact: contactQuery.isLoading,
    isLoadingPrimary: primaryContactsQuery.isLoading,
    isLoading24x7: contact24x7Query.isLoading,
    isLoading: contactsQuery.isLoading || contactQuery.isLoading,

    // Error states
    contactsError: contactsQuery.error,
    contactError: contactQuery.error,
    primaryError: primaryContactsQuery.error,
    error24x7: contact24x7Query.error,

    // Mutations
    createContact: createContact.mutate,
    updateContact: updateContact.mutate,
    deleteContact: deleteContact.mutate,

    // Mutation states
    isCreating: createContact.isPending,
    isUpdating: updateContact.isPending,
    isDeleting: deleteContact.isPending,

    // Computed values
    totalContacts: contactsQuery.data?.length || 0,
    activeContacts: contactsQuery.data?.filter(c => c.isActive).length || 0,
    contactsByType: contactsQuery.data?.reduce((acc, contact) => {
      acc[contact.contactType] = (acc[contact.contactType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},

    // Utility functions
    refetch: () => {
      contactsQuery.refetch();
      contactQuery.refetch();
      primaryContactsQuery.refetch();
      contact24x7Query.refetch();
    },
  };
};

// Procedure management with categorization
export const useProcedureManagement = (
  procedureId?: string,
  category?: string,
  options?: UseQueryOptions<any, Error>
) => {
  const proceduresQuery = useProcedures(undefined, options);
  const procedureQuery = useProcedureDetails(procedureId || '', {
    ...options,
    enabled: !!procedureId
  });
  const categoryProceduresQuery = useProceduresByCategory(category || '', {
    ...options,
    enabled: !!category
  });

  const createProcedure = useCreateProcedure();
  const updateProcedure = useUpdateProcedure();
  const deleteProcedure = useDeleteProcedure();

  return {
    // Data
    procedures: proceduresQuery.data || [],
    procedure: procedureQuery.data,
    categoryProcedures: categoryProceduresQuery.data || [],

    // Loading states
    isLoadingProcedures: proceduresQuery.isLoading,
    isLoadingProcedure: procedureQuery.isLoading,
    isLoadingCategory: categoryProceduresQuery.isLoading,
    isLoading: proceduresQuery.isLoading || procedureQuery.isLoading,

    // Error states
    proceduresError: proceduresQuery.error,
    procedureError: procedureQuery.error,
    categoryError: categoryProceduresQuery.error,

    // Mutations
    createProcedure: createProcedure.mutate,
    updateProcedure: updateProcedure.mutate,
    deleteProcedure: deleteProcedure.mutate,

    // Mutation states
    isCreating: createProcedure.isPending,
    isUpdating: updateProcedure.isPending,
    isDeleting: deleteProcedure.isPending,

    // Computed values
    totalProcedures: proceduresQuery.data?.length || 0,
    activeProcedures: proceduresQuery.data?.filter(p => p.isActive).length || 0,
    proceduresByCategory: proceduresQuery.data?.reduce((acc, procedure) => {
      acc[procedure.category] = (acc[procedure.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},

    // Utility functions
    refetch: () => {
      proceduresQuery.refetch();
      procedureQuery.refetch();
      categoryProceduresQuery.refetch();
    },
  };
};

// Resource management with availability tracking
export const useResourceManagement = (
  resourceId?: string,
  locationId?: string,
  options?: UseQueryOptions<any, Error>
) => {
  const resourcesQuery = useResources(undefined, options);
  const resourceQuery = useResourceDetails(resourceId || '', {
    ...options,
    enabled: !!resourceId
  });
  const availableResourcesQuery = useAvailableResources(undefined, options);
  const locationResourcesQuery = useResourcesByLocation(locationId || '', {
    ...options,
    enabled: !!locationId
  });

  const createResource = useCreateResource();
  const updateResource = useUpdateResource();
  const deleteResource = useDeleteResource();
  const bulkActivateResources = useBulkActivateResources();

  return {
    // Data
    resources: resourcesQuery.data || [],
    resource: resourceQuery.data,
    availableResources: availableResourcesQuery.data || [],
    locationResources: locationResourcesQuery.data || [],

    // Loading states
    isLoadingResources: resourcesQuery.isLoading,
    isLoadingResource: resourceQuery.isLoading,
    isLoadingAvailable: availableResourcesQuery.isLoading,
    isLoadingLocation: locationResourcesQuery.isLoading,
    isLoading: resourcesQuery.isLoading || resourceQuery.isLoading,

    // Error states
    resourcesError: resourcesQuery.error,
    resourceError: resourceQuery.error,
    availableError: availableResourcesQuery.error,
    locationError: locationResourcesQuery.error,

    // Mutations
    createResource: createResource.mutate,
    updateResource: updateResource.mutate,
    deleteResource: deleteResource.mutate,
    bulkActivateResources: bulkActivateResources.mutate,

    // Mutation states
    isCreating: createResource.isPending,
    isUpdating: updateResource.isPending,
    isDeleting: deleteResource.isPending,
    isBulkActivating: bulkActivateResources.isPending,

    // Computed values
    totalResources: resourcesQuery.data?.length || 0,
    availableCount: availableResourcesQuery.data?.length || 0,
    resourcesByStatus: resourcesQuery.data?.reduce((acc, resource) => {
      acc[resource.status] = (acc[resource.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},
    resourcesByCondition: resourcesQuery.data?.reduce((acc, resource) => {
      acc[resource.condition] = (acc[resource.condition] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},

    // Utility functions
    refetch: () => {
      resourcesQuery.refetch();
      resourceQuery.refetch();
      availableResourcesQuery.refetch();
      locationResourcesQuery.refetch();
    },
  };
};
