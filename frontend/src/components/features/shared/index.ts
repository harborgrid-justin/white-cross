/**
 * Shared Feature Components
 *
 * Reusable components used across multiple domains in the healthcare application.
 * These components provide common functionality like data tables, filters, exports,
 * and other UI patterns.
 */

export { DataTable } from './DataTable';
export type { DataTableProps, DataTableColumn } from './DataTable';

export { FilterPanel } from './FilterPanel';
export type { FilterPanelProps, FilterConfig } from './FilterPanel';

export { ExportButton } from './ExportButton';
export type { ExportButtonProps, ExportFormat, ExportConfig } from './ExportButton';

export { BulkActionBar } from './BulkActionBar';
export type { BulkActionBarProps, BulkAction } from './BulkActionBar';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { ErrorState } from './ErrorState';
export type { ErrorStateProps } from './ErrorState';

export { ConfirmationDialog } from './ConfirmationDialog';
export type { ConfirmationDialogProps } from './ConfirmationDialog';

export { StatusTimeline } from './StatusTimeline';
export type { StatusTimelineProps, TimelineEvent, TimelineEventStatus } from './StatusTimeline';

export { AttachmentList } from './AttachmentList';
export type { AttachmentListProps, Attachment } from './AttachmentList';

export { TagSelector } from './TagSelector';
export type { TagSelectorProps, Tag } from './TagSelector';
