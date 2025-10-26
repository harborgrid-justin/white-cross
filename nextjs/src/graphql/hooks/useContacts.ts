/**
 * @fileoverview Contact GraphQL Hooks
 *
 * Custom hooks for contact queries and mutations with error handling
 * Based on backend GraphQL schema
 *
 * @module graphql/hooks/useContacts
 * @since 1.0.0
 */

'use client';

import { useQuery, useMutation, ApolloError } from '@apollo/client';
import { useCallback } from 'react';
import {
  GET_CONTACTS,
  GET_CONTACT,
  GET_CONTACTS_BY_RELATION,
  SEARCH_CONTACTS,
} from '../queries';
import {
  CREATE_CONTACT,
  UPDATE_CONTACT,
  DELETE_CONTACT,
  DEACTIVATE_CONTACT,
} from '../mutations';
import { buildQueryVariables, handleGraphQLError } from '../utils';

/**
 * Hook to fetch contacts
 */
export const useContacts = (filters?: any, pagination?: any) => {
  const variables = buildQueryVariables(filters, pagination);

  const { data, loading, error, refetch } = useQuery(GET_CONTACTS, {
    variables,
  });

  const contacts = data?.contacts?.contacts || [];
  const paginationInfo = data?.contacts?.pagination;

  return {
    contacts,
    pagination: paginationInfo,
    loading,
    error: error ? handleGraphQLError(error) : null,
    refetch,
  };
};

/**
 * Hook to fetch single contact
 */
export const useContact = (id: string) => {
  const { data, loading, error, refetch } = useQuery(GET_CONTACT, {
    variables: { id },
    skip: !id,
  });

  return {
    contact: data?.contact,
    loading,
    error: error ? handleGraphQLError(error) : null,
    refetch,
  };
};

/**
 * Hook to fetch contacts by relation
 */
export const useContactsByRelation = (relationTo: string, type?: string) => {
  const { data, loading, error, refetch } = useQuery(GET_CONTACTS_BY_RELATION, {
    variables: { relationTo, type },
    skip: !relationTo,
  });

  return {
    contacts: data?.contactsByRelation || [],
    loading,
    error: error ? handleGraphQLError(error) : null,
    refetch,
  };
};

/**
 * Hook to search contacts
 */
export const useSearchContacts = () => {
  const [search, { data, loading, error }] = useMutation(SEARCH_CONTACTS);

  const searchContacts = useCallback(
    async (query: string, limit?: number) => {
      return await search({ variables: { query, limit } });
    },
    [search]
  );

  return {
    searchContacts,
    results: data?.searchContacts || [],
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
};

/**
 * Hook to create contact
 */
export const useCreateContact = () => {
  const [createContact, { loading, error }] = useMutation(CREATE_CONTACT, {
    refetchQueries: ['GetContacts'],
    awaitRefetchQueries: true,
  });

  const handleCreate = useCallback(
    async (input: any) => {
      try {
        const result = await createContact({ variables: { input } });
        return { data: result.data?.createContact, error: null };
      } catch (err) {
        return { data: null, error: handleGraphQLError(err as ApolloError) };
      }
    },
    [createContact]
  );

  return {
    createContact: handleCreate,
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
};

/**
 * Hook to update contact
 */
export const useUpdateContact = () => {
  const [updateContact, { loading, error }] = useMutation(UPDATE_CONTACT);

  const handleUpdate = useCallback(
    async (id: string, input: any) => {
      try {
        const result = await updateContact({ variables: { id, input } });
        return { data: result.data?.updateContact, error: null };
      } catch (err) {
        return { data: null, error: handleGraphQLError(err as ApolloError) };
      }
    },
    [updateContact]
  );

  return {
    updateContact: handleUpdate,
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
};

/**
 * Hook to delete contact
 */
export const useDeleteContact = () => {
  const [deleteContact, { loading, error }] = useMutation(DELETE_CONTACT, {
    refetchQueries: ['GetContacts'],
    update: (cache, { data }, { variables }) => {
      if (!data?.deleteContact?.success || !variables?.id) return;

      cache.evict({ id: cache.identify({ __typename: 'Contact', id: variables.id }) });
      cache.gc();
    },
  });

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const result = await deleteContact({ variables: { id } });
        return { success: result.data?.deleteContact?.success, error: null };
      } catch (err) {
        return { success: false, error: handleGraphQLError(err as ApolloError) };
      }
    },
    [deleteContact]
  );

  return {
    deleteContact: handleDelete,
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
};
