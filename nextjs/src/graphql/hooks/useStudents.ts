/**
 * @fileoverview Student GraphQL Hooks
 *
 * Custom hooks for student queries and mutations with error handling
 *
 * @module graphql/hooks/useStudents
 * @since 1.0.0
 */

'use client';

import { useQuery, useMutation, useSubscription, ApolloError } from '@apollo/client';
import { useCallback } from 'react';
import {
  GET_STUDENTS,
  GET_STUDENT,
  GET_STUDENT_WITH_CONTACTS,
  SEARCH_STUDENTS,
} from '../queries';
import {
  CREATE_STUDENT,
  UPDATE_STUDENT,
  DELETE_STUDENT,
  DEACTIVATE_STUDENT,
} from '../mutations';
import {
  buildQueryVariables,
  buildOptimisticCreateResponse,
  buildOptimisticUpdateResponse,
  handleGraphQLError,
} from '../utils';

/**
 * Hook to fetch paginated students
 */
export const useStudents = (filters?: any, pagination?: any) => {
  const variables = buildQueryVariables(filters, pagination);

  const { data, loading, error, refetch, fetchMore } = useQuery(GET_STUDENTS, {
    variables,
    notifyOnNetworkStatusChange: true,
  });

  const students = data?.students?.students || [];
  const paginationInfo = data?.students?.pagination;

  const loadMore = useCallback(async () => {
    if (!paginationInfo || paginationInfo.page >= paginationInfo.totalPages) {
      return;
    }

    await fetchMore({
      variables: {
        ...variables,
        page: paginationInfo.page + 1,
      },
    });
  }, [fetchMore, paginationInfo, variables]);

  return {
    students,
    pagination: paginationInfo,
    loading,
    error: error ? handleGraphQLError(error) : null,
    refetch,
    loadMore,
  };
};

/**
 * Hook to fetch single student
 */
export const useStudent = (id: string) => {
  const { data, loading, error, refetch } = useQuery(GET_STUDENT, {
    variables: { id },
    skip: !id,
  });

  return {
    student: data?.student,
    loading,
    error: error ? handleGraphQLError(error) : null,
    refetch,
  };
};

/**
 * Hook to fetch student with contacts
 */
export const useStudentWithContacts = (id: string) => {
  const { data, loading, error, refetch } = useQuery(GET_STUDENT_WITH_CONTACTS, {
    variables: { id },
    skip: !id,
  });

  return {
    student: data?.student,
    loading,
    error: error ? handleGraphQLError(error) : null,
    refetch,
  };
};

/**
 * Hook to search students
 */
export const useSearchStudents = () => {
  const [search, { data, loading, error }] = useMutation(SEARCH_STUDENTS);

  const searchStudents = useCallback(
    async (query: string, limit?: number) => {
      return await search({
        variables: { query, limit },
      });
    },
    [search]
  );

  return {
    searchStudents,
    results: data?.searchStudents || [],
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
};

/**
 * Hook to create student
 */
export const useCreateStudent = () => {
  const [createStudent, { loading, error }] = useMutation(CREATE_STUDENT, {
    refetchQueries: ['GetStudents'],
    awaitRefetchQueries: true,
    optimisticResponse: (variables) =>
      buildOptimisticCreateResponse('createStudent', variables.input, 'Student'),
    update: (cache, { data }) => {
      if (!data?.createStudent) return;

      // Add to cache
      cache.modify({
        fields: {
          students(existing = { students: [], pagination: {} }) {
            const newStudentRef = cache.writeFragment({
              data: data.createStudent,
              fragment: gql`
                fragment NewStudent on Student {
                  id
                  studentNumber
                  firstName
                  lastName
                  fullName
                  grade
                  isActive
                }
              `,
            });
            return {
              ...existing,
              students: [newStudentRef, ...existing.students],
            };
          },
        },
      });
    },
  });

  const handleCreate = useCallback(
    async (input: any) => {
      try {
        const result = await createStudent({ variables: { input } });
        return { data: result.data?.createStudent, error: null };
      } catch (err) {
        return { data: null, error: handleGraphQLError(err as ApolloError) };
      }
    },
    [createStudent]
  );

  return {
    createStudent: handleCreate,
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
};

/**
 * Hook to update student
 */
export const useUpdateStudent = () => {
  const [updateStudent, { loading, error }] = useMutation(UPDATE_STUDENT, {
    optimisticResponse: (variables) => ({
      __typename: 'Mutation',
      updateStudent: {
        __typename: 'Student',
        id: variables.id,
        ...variables.input,
        updatedAt: new Date().toISOString(),
      },
    }),
  });

  const handleUpdate = useCallback(
    async (id: string, input: any) => {
      try {
        const result = await updateStudent({ variables: { id, input } });
        return { data: result.data?.updateStudent, error: null };
      } catch (err) {
        return { data: null, error: handleGraphQLError(err as ApolloError) };
      }
    },
    [updateStudent]
  );

  return {
    updateStudent: handleUpdate,
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
};

/**
 * Hook to delete student
 */
export const useDeleteStudent = () => {
  const [deleteStudent, { loading, error }] = useMutation(DELETE_STUDENT, {
    refetchQueries: ['GetStudents'],
    update: (cache, { data }, { variables }) => {
      if (!data?.deleteStudent?.success || !variables?.id) return;

      cache.evict({ id: cache.identify({ __typename: 'Student', id: variables.id }) });
      cache.gc();
    },
  });

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const result = await deleteStudent({ variables: { id } });
        return { success: result.data?.deleteStudent?.success, error: null };
      } catch (err) {
        return { success: false, error: handleGraphQLError(err as ApolloError) };
      }
    },
    [deleteStudent]
  );

  return {
    deleteStudent: handleDelete,
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
};

/**
 * Hook to deactivate student
 */
export const useDeactivateStudent = () => {
  const [deactivateStudent, { loading, error }] = useMutation(DEACTIVATE_STUDENT);

  const handleDeactivate = useCallback(
    async (id: string) => {
      try {
        const result = await deactivateStudent({ variables: { id } });
        return { data: result.data?.deactivateStudent, error: null };
      } catch (err) {
        return { data: null, error: handleGraphQLError(err as ApolloError) };
      }
    },
    [deactivateStudent]
  );

  return {
    deactivateStudent: handleDeactivate,
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
};

import { gql } from '@apollo/client';
