/**
 * @fileoverview Compliance Component Types - Type definitions for compliance UI
 * @module app/(dashboard)/compliance/_components/compliance.types
 * @category Compliance - Types
 */

import type { ComplianceStatus, CompliancePriority, ComplianceRiskLevel, ComplianceCategory } from './compliance.utils';

/**
 * Search and filter parameters for compliance data
 */
export interface ComplianceSearchParams {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  status?: string;
  priority?: string;
  dateRange?: string;
  sortBy?: string;
  sortOrder?: string;
}

/**
 * Individual compliance requirement/item
 */
export interface ComplianceItem {
  id: string;
  title: string;
  category: ComplianceCategory;
  status: ComplianceStatus;
  priority: CompliancePriority;
  lastAudit: string;
  nextAudit: string;
  dueDate?: string;
  assignee: string;
  description: string;
  requirements: string[];
  documents: number;
  progress: number;
  riskLevel: ComplianceRiskLevel;
}

/**
 * Compliance dashboard statistics
 */
export interface ComplianceStats {
  totalRequirements: number;
  compliantCount: number;
  nonCompliantCount: number;
  needsAttentionCount: number;
  upcomingAudits: number;
  overdueTasks: number;
  riskScore: number;
  complianceRate: number;
}

/**
 * Compliance activity log entry
 */
export interface ComplianceActivity {
  id: string;
  type: 'audit_completed' | 'under_review' | 'needs_attention' | 'policy_updated';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  status?: ComplianceStatus;
}

/**
 * Props for ComplianceContent main component
 */
export interface ComplianceContentProps {
  searchParams: ComplianceSearchParams;
}

/**
 * Props for ComplianceOverview component
 */
export interface ComplianceOverviewProps {
  stats: ComplianceStats;
  loading?: boolean;
}

/**
 * Props for ComplianceRequirementCard component
 */
export interface ComplianceRequirementCardProps {
  item: ComplianceItem;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
}

/**
 * Props for ComplianceRequirementsList component
 */
export interface ComplianceRequirementsListProps {
  items: ComplianceItem[];
  loading?: boolean;
  onAddRequirement?: () => void;
}

/**
 * Props for UpcomingAudits component
 */
export interface UpcomingAuditsProps {
  items: ComplianceItem[];
  threshold?: number;
}

/**
 * Props for RecentActivity component
 */
export interface RecentActivityProps {
  activities?: ComplianceActivity[];
  limit?: number;
}
