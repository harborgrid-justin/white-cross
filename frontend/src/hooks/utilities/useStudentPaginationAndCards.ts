/**
 * Student Pagination and Card Expansion Hooks
 *
 * Hooks for managing pagination and card expansion state
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  studentsActions,
  selectStudentPagination,
  selectStudentPaginationInfo,
  selectExpandedStudentCards,
} from '@/stores/slices/students';

/**
 * Hook for managing student pagination
 *
 * @example
 * ```tsx
 * const {
 *   currentPage,
 *   pageSize,
 *   totalPages,
 *   setPage,
 *   setPageSize,
 *   nextPage,
 *   previousPage,
 *   canGoNext,
 *   canGoPrevious
 * } = useStudentPagination();
 * ```
 */
export const useStudentPagination = () => {
  const dispatch = useAppDispatch();
  const { currentPage, pageSize } = useAppSelector(selectStudentPagination);
  const paginationInfo = useAppSelector(selectStudentPaginationInfo);

  const setPage = useCallback((page: number) => {
    dispatch(studentsActions.setPage(page));
  }, [dispatch]);

  const setPageSize = useCallback((size: number) => {
    dispatch(studentsActions.setPageSize(size));
  }, [dispatch]);

  const nextPage = useCallback(() => {
    dispatch(studentsActions.nextPage());
  }, [dispatch]);

  const previousPage = useCallback(() => {
    dispatch(studentsActions.previousPage());
  }, [dispatch]);

  const goToFirstPage = useCallback(() => setPage(1), [setPage]);
  const goToLastPage = useCallback(() => {
    if (paginationInfo?.totalPages) {
      setPage(paginationInfo.totalPages);
    }
  }, [setPage, paginationInfo?.totalPages]);

  return {
    currentPage,
    pageSize,
    totalPages: paginationInfo?.totalPages || 0,
    totalStudents: paginationInfo?.totalStudents || 0,
    startIndex: paginationInfo?.startIndex || 0,
    endIndex: paginationInfo?.endIndex || 0,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    canGoNext: paginationInfo?.hasNextPage || false,
    canGoPrevious: paginationInfo?.hasPreviousPage || false,
    hasMultiplePages: (paginationInfo?.totalPages || 0) > 1,
  };
};

/**
 * Hook for managing student card expansion state
 *
 * @example
 * ```tsx
 * const {
 *   expandedCardIds,
 *   toggleCardExpansion,
 *   expandCard,
 *   collapseCard,
 *   collapseAllCards,
 *   isExpanded
 * } = useStudentCardExpansion();
 *
 * // Toggle card expansion
 * toggleCardExpansion('student-123');
 *
 * // Check if card is expanded
 * if (isExpanded('student-123')) {
 *   return <ExpandedStudentCard />;
 * }
 * ```
 */
export const useStudentCardExpansion = () => {
  const dispatch = useAppDispatch();
  const expandedCardIds = useAppSelector(selectExpandedStudentCards);

  const toggleCardExpansion = useCallback((studentId: string) => {
    dispatch(studentsActions.toggleCardExpansion(studentId));
  }, [dispatch]);

  const expandCard = useCallback((studentId: string) => {
    if (!expandedCardIds.includes(studentId)) {
      toggleCardExpansion(studentId);
    }
  }, [expandedCardIds, toggleCardExpansion]);

  const collapseCard = useCallback((studentId: string) => {
    if (expandedCardIds.includes(studentId)) {
      toggleCardExpansion(studentId);
    }
  }, [expandedCardIds, toggleCardExpansion]);

  const collapseAllCards = useCallback(() => {
    dispatch(studentsActions.collapseAllCards());
  }, [dispatch]);

  const isExpanded = useCallback((studentId: string) => {
    return expandedCardIds.includes(studentId);
  }, [expandedCardIds]);

  return {
    expandedCardIds,
    toggleCardExpansion,
    expandCard,
    collapseCard,
    collapseAllCards,
    isExpanded,
    expandedCount: expandedCardIds.length,
    hasExpandedCards: expandedCardIds.length > 0,
  };
};
