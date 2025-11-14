import { useMemo } from 'react';
import type { Report } from './ReportCard';
import type { ReportFilter, SortOption, SortDirection } from './ReportList.types';
import { filterReports, sortReports, paginateReports } from './ReportList.utils';

/**
 * Custom hook for filtering and sorting reports
 *
 * @param reports - Array of reports
 * @param filters - Filter configuration
 * @param sortBy - Field to sort by
 * @param sortDirection - Direction to sort
 * @returns Filtered and sorted reports
 */
export const useReportFiltering = (
  reports: Report[],
  filters: ReportFilter,
  sortBy: SortOption,
  sortDirection: SortDirection
) => {
  return useMemo(() => {
    const filtered = filterReports(reports, filters);
    return sortReports(filtered, sortBy, sortDirection);
  }, [reports, filters, sortBy, sortDirection]);
};

/**
 * Custom hook for report pagination
 *
 * @param reports - Array of reports to paginate
 * @param currentPage - Current page number
 * @param pageSize - Number of items per page
 * @param showPagination - Whether pagination is enabled
 * @returns Paginated reports and pagination metadata
 */
export const useReportPagination = (
  reports: Report[],
  currentPage: number,
  pageSize: number,
  showPagination: boolean
) => {
  const paginatedReports = useMemo(() => {
    if (!showPagination) return reports;
    return paginateReports(reports, currentPage, pageSize);
  }, [reports, currentPage, pageSize, showPagination]);

  const totalPages = useMemo(() => {
    return Math.ceil(reports.length / pageSize);
  }, [reports.length, pageSize]);

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, reports.length);

  return {
    paginatedReports,
    totalPages,
    startIndex,
    endIndex,
    totalItems: reports.length
  };
};
