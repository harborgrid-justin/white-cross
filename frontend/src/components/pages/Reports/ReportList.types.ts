import type { Report, ReportCategory, ReportStatus, ReportFrequency } from './ReportCard';

/**
 * View mode options for displaying reports
 */
export type ViewMode = 'grid' | 'list' | 'table';

/**
 * Sort options for report ordering
 */
export type SortOption = 'title' | 'category' | 'status' | 'created' | 'updated' | 'views' | 'downloads';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Filter options for reports
 */
export interface ReportFilter {
  /** Filter by category */
  category?: ReportCategory | 'all';
  /** Filter by status */
  status?: ReportStatus | 'all';
  /** Filter by frequency */
  frequency?: ReportFrequency | 'all';
  /** Filter by author ID */
  author?: string;
  /** Filter by tags */
  tags?: string[];
  /** Show only favorites */
  favoritesOnly?: boolean;
  /** Show only bookmarked reports */
  bookmarkedOnly?: boolean;
  /** Search query for filtering */
  searchQuery?: string;
}

/**
 * Props for the ReportList component
 */
export interface ReportListProps {
  /** Array of reports to display */
  reports: Report[];
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string | null;
  /** Current view mode */
  viewMode?: ViewMode;
  /** Sort configuration */
  sortBy?: SortOption;
  /** Sort direction */
  sortDirection?: SortDirection;
  /** Filter configuration */
  filters?: ReportFilter;
  /** Selected report IDs */
  selectedReports?: string[];
  /** Whether bulk selection is enabled */
  bulkSelection?: boolean;
  /** Whether user can manage reports */
  canManage?: boolean;
  /** Whether user can run reports */
  canRun?: boolean;
  /** Whether user can share reports */
  canShare?: boolean;
  /** Items per page for pagination */
  pageSize?: number;
  /** Current page number */
  currentPage?: number;
  /** Whether to show pagination */
  showPagination?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Report click handler */
  onReportClick?: (report: Report) => void;
  /** View report handler */
  onViewReport?: (reportId: string) => void;
  /** Run report handler */
  onRunReport?: (reportId: string) => void;
  /** Download report handler */
  onDownloadReport?: (reportId: string, format: 'pdf' | 'excel' | 'csv') => void;
  /** Share report handler */
  onShareReport?: (reportId: string) => void;
  /** Edit report handler */
  onEditReport?: (reportId: string) => void;
  /** Delete report handler */
  onDeleteReport?: (reportId: string) => void;
  /** Bookmark toggle handler */
  onToggleBookmark?: (reportId: string) => void;
  /** Favorite toggle handler */
  onToggleFavorite?: (reportId: string) => void;
  /** Selection change handler */
  onSelectionChange?: (reportId: string, selected: boolean) => void;
  /** Select all handler */
  onSelectAll?: (selected: boolean) => void;
  /** Bulk operation handler */
  onBulkOperation?: (operation: 'export' | 'delete' | 'archive' | 'share', reportIds: string[]) => void;
  /** Page change handler */
  onPageChange?: (page: number) => void;
  /** Refresh handler */
  onRefresh?: () => void;
}

/**
 * Props for ReportListViews components
 */
export interface ReportViewProps {
  /** Reports to display */
  reports: Report[];
  /** Whether bulk selection is enabled */
  bulkSelection: boolean;
  /** Selected report IDs */
  selectedReports: string[];
  /** Whether user can manage reports */
  canManage: boolean;
  /** Whether user can run reports */
  canRun: boolean;
  /** Whether user can share reports */
  canShare: boolean;
  /** Report click handler */
  onReportClick?: (report: Report) => void;
  /** View report handler */
  onViewReport?: (reportId: string) => void;
  /** Run report handler */
  onRunReport?: (reportId: string) => void;
  /** Download report handler */
  onDownloadReport?: (reportId: string, format: 'pdf' | 'excel' | 'csv') => void;
  /** Share report handler */
  onShareReport?: (reportId: string) => void;
  /** Bookmark toggle handler */
  onToggleBookmark?: (reportId: string) => void;
  /** Favorite toggle handler */
  onToggleFavorite?: (reportId: string) => void;
  /** Selection change handler */
  onSelectionChange?: (reportId: string, selected: boolean) => void;
  /** Select all handler */
  onSelectAll?: (selected: boolean) => void;
}
