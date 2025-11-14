import {
  BarChart3,
  FileText,
  CheckCircle,
  Star,
  Users,
  type LucideIcon
} from 'lucide-react';
import type { Report, ReportCategory, ReportStatus } from './ReportCard';
import type { ReportFilter, SortOption, SortDirection } from './ReportList.types';

/**
 * Category display information
 */
interface CategoryInfo {
  icon: LucideIcon;
  color: string;
  label: string;
}

/**
 * Status display information
 */
interface StatusInfo {
  color: string;
  label: string;
}

/**
 * Gets display information for a report category
 *
 * @param category - The report category
 * @returns Category display information including icon, color, and label
 */
export const getCategoryInfo = (category: ReportCategory): CategoryInfo => {
  const categoryInfo: Record<ReportCategory, CategoryInfo> = {
    clinical: { icon: BarChart3, color: 'text-blue-600', label: 'Clinical' },
    financial: { icon: FileText, color: 'text-green-600', label: 'Financial' },
    operational: { icon: Users, color: 'text-purple-600', label: 'Operational' },
    compliance: { icon: CheckCircle, color: 'text-orange-600', label: 'Compliance' },
    'patient-satisfaction': { icon: Star, color: 'text-yellow-600', label: 'Patient Satisfaction' },
    custom: { icon: FileText, color: 'text-gray-600', label: 'Custom' }
  };
  return categoryInfo[category];
};

/**
 * Gets display information for a report status
 *
 * @param status - The report status
 * @returns Status display information including color and label
 */
export const getStatusInfo = (status: ReportStatus): StatusInfo => {
  const statusInfo: Record<ReportStatus, StatusInfo> = {
    draft: { color: 'text-gray-600 bg-gray-100', label: 'Draft' },
    published: { color: 'text-green-600 bg-green-100', label: 'Published' },
    archived: { color: 'text-red-600 bg-red-100', label: 'Archived' },
    scheduled: { color: 'text-blue-600 bg-blue-100', label: 'Scheduled' }
  };
  return statusInfo[status];
};

/**
 * Filters reports based on the provided filter configuration
 *
 * @param reports - Array of reports to filter
 * @param filters - Filter configuration
 * @returns Filtered array of reports
 */
export const filterReports = (reports: Report[], filters: ReportFilter): Report[] => {
  let filtered = [...reports];

  // Apply search query filter
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(report =>
      report.title.toLowerCase().includes(query) ||
      report.description.toLowerCase().includes(query) ||
      report.author.name.toLowerCase().includes(query) ||
      report.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(report => report.category === filters.category);
  }

  // Apply status filter
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(report => report.status === filters.status);
  }

  // Apply frequency filter
  if (filters.frequency && filters.frequency !== 'all') {
    filtered = filtered.filter(report => report.frequency === filters.frequency);
  }

  // Apply author filter
  if (filters.author) {
    filtered = filtered.filter(report => report.author.id === filters.author);
  }

  // Apply tags filter
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(report =>
      filters.tags!.some(tag => report.tags.includes(tag))
    );
  }

  // Apply favorites filter
  if (filters.favoritesOnly) {
    filtered = filtered.filter(report => report.isFavorite);
  }

  // Apply bookmarked filter
  if (filters.bookmarkedOnly) {
    filtered = filtered.filter(report => report.isBookmarked);
  }

  return filtered;
};

/**
 * Sorts reports based on the provided sort configuration
 *
 * @param reports - Array of reports to sort
 * @param sortBy - Field to sort by
 * @param sortDirection - Direction to sort (asc or desc)
 * @returns Sorted array of reports
 */
export const sortReports = (
  reports: Report[],
  sortBy: SortOption,
  sortDirection: SortDirection
): Report[] => {
  const sorted = [...reports];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'created':
        comparison = a.createdDate.getTime() - b.createdDate.getTime();
        break;
      case 'updated':
        comparison = a.lastUpdated.getTime() - b.lastUpdated.getTime();
        break;
      case 'views':
        comparison = a.metrics.views - b.metrics.views;
        break;
      case 'downloads':
        comparison = a.metrics.downloads - b.metrics.downloads;
        break;
      default:
        comparison = 0;
    }

    return sortDirection === 'desc' ? -comparison : comparison;
  });

  return sorted;
};

/**
 * Paginates an array of reports
 *
 * @param reports - Array of reports to paginate
 * @param currentPage - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Paginated array of reports
 */
export const paginateReports = (
  reports: Report[],
  currentPage: number,
  pageSize: number
): Report[] => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return reports.slice(startIndex, endIndex);
};

/**
 * Calculates the total number of pages
 *
 * @param totalItems - Total number of items
 * @param pageSize - Number of items per page
 * @returns Total number of pages
 */
export const calculateTotalPages = (totalItems: number, pageSize: number): number => {
  return Math.ceil(totalItems / pageSize);
};
