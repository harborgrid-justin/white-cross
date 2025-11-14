/**
 * Type definitions for compliance management system
 */

export type ComplianceCategory = 'HIPAA' | 'FERPA' | 'OSHA' | 'FDA' | 'STATE' | 'INTERNAL';
export type ComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'NEEDS_ATTENTION' | 'UNDER_REVIEW' | 'EXPIRED';
export type CompliancePriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ComplianceItem {
  id: string;
  title: string;
  category: ComplianceCategory;
  status: ComplianceStatus;
  priority: CompliancePriority;
  lastAudit: string;
  nextAudit?: string;
  description?: string;
  requirements?: string[];
  responsibleParty?: string;
  documentationUrl?: string;
  expirationDate?: string;
  notes?: string;
}

export interface ComplianceStats {
  total: number;
  compliant: number;
  nonCompliant: number;
  needsAttention: number;
  underReview: number;
  expired: number;
  complianceRate: number;
  highPriority: number;
}

export interface ComplianceContentProps {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    status?: string;
    priority?: string;
    dateRange?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export interface ComplianceFiltersProps {
  categoryFilter: ComplianceCategory | 'all';
  statusFilter: ComplianceStatus | 'all';
  priorityFilter: CompliancePriority | 'all';
  searchQuery: string;
  onCategoryChange: (category: ComplianceCategory | 'all') => void;
  onStatusChange: (status: ComplianceStatus | 'all') => void;
  onPriorityChange: (priority: CompliancePriority | 'all') => void;
  onSearchChange: (query: string) => void;
}

export interface ComplianceStatsProps {
  stats: ComplianceStats;
}

export interface ComplianceListProps {
  items: ComplianceItem[];
  onView: (itemId: string) => void;
  onDownload: (itemId: string) => void;
}

export interface ComplianceCardProps {
  item: ComplianceItem;
  onView: (itemId: string) => void;
  onDownload: (itemId: string) => void;
}
