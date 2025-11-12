/**
 * Type definitions for MedicationAlerts component
 *
 * This module contains all TypeScript interfaces and types used by the
 * medication alerts system, including alert data structures, filters,
 * and component props.
 */

/**
 * Type of medication alert
 */
export type AlertType =
  | 'expiration'
  | 'low-stock'
  | 'missed-dose'
  | 'interaction'
  | 'recall'
  | 'allergy'
  | 'critical';

/**
 * Priority level of alert
 */
export type AlertPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

/**
 * Sort options for alerts
 */
export type AlertSortBy =
  | 'priority'
  | 'created'
  | 'type'
  | 'medication';

/**
 * Sort order
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Interface for medication alert
 */
export interface MedicationAlert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  message: string;
  medicationId?: string;
  medicationName?: string;
  studentId?: string;
  studentName?: string;
  createdAt: string;
  expiresAt?: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  actionRequired: boolean;
  actionTaken?: boolean;
  relatedIds?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Interface for alert filters
 */
export interface AlertFilters {
  type: string;
  priority: string;
  status: string;
  timeRange: string;
  searchTerm: string;
}

/**
 * Interface for alert statistics
 */
export interface AlertStats {
  total: number;
  unacknowledged: number;
  critical: number;
  actionRequired: number;
}

/**
 * Props for the MedicationAlerts component
 */
export interface MedicationAlertsProps {
  /** Array of alerts to display */
  alerts?: MedicationAlert[];
  /** Whether the component is in loading state */
  loading?: boolean;
  /** Error message to display */
  error?: string;
  /** Callback when alert is acknowledged */
  onAcknowledgeAlert?: (alertId: string) => void;
  /** Callback when alert is dismissed */
  onDismissAlert?: (alertId: string) => void;
  /** Callback when action is taken on alert */
  onTakeAction?: (alertId: string, action: string) => void;
  /** Callback when alerts are bulk acknowledged */
  onBulkAcknowledge?: (alertIds: string[]) => void;
  /** Callback when alert settings are updated */
  onUpdateSettings?: (settings: Record<string, unknown>) => void;
}

/**
 * Props for AlertStatistics component
 */
export interface AlertStatisticsProps {
  stats: AlertStats;
}

/**
 * Props for AlertFilters component
 */
export interface AlertFiltersProps {
  filters: AlertFilters;
  onFiltersChange: (filters: AlertFilters) => void;
}

/**
 * Props for AlertItem component
 */
export interface AlertItemProps {
  alert: MedicationAlert;
  isSelected: boolean;
  onToggleSelection: (alertId: string) => void;
  onAcknowledge?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  onTakeAction?: (alertId: string, action: string) => void;
}

/**
 * Props for AlertList component
 */
export interface AlertListProps {
  alerts: MedicationAlert[];
  selectedAlerts: string[];
  sortBy: AlertSortBy;
  sortOrder: SortOrder;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onSortByChange: (sortBy: AlertSortBy) => void;
  onSortOrderChange: () => void;
  onToggleSelection: (alertId: string) => void;
  onAcknowledge?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  onTakeAction?: (alertId: string, action: string) => void;
}

/**
 * Props for AlertSettingsModal component
 */
export interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (settings: Record<string, unknown>) => void;
}

/**
 * Configuration for alert type display
 */
export interface AlertTypeConfig {
  icon: JSX.Element;
  bgColor: string;
  iconColor: string;
  borderColor: string;
}
