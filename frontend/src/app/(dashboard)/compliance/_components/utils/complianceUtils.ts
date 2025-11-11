/**
 * Utility functions for compliance management
 */

import type { ComplianceCategory, ComplianceStatus, CompliancePriority, ComplianceItem } from '../types/compliance.types';

/**
 * Get status badge color classes
 */
export const getStatusColor = (status: ComplianceStatus): string => {
  switch (status) {
    case 'COMPLIANT':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'NON_COMPLIANT':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'NEEDS_ATTENTION':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'UNDER_REVIEW':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'EXPIRED':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Get priority badge color classes
 */
export const getPriorityColor = (priority: CompliancePriority): string => {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-100 text-red-800';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800';
    case 'LOW':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get category badge color classes
 */
export const getCategoryColor = (category: ComplianceCategory): string => {
  switch (category) {
    case 'HIPAA':
      return 'bg-purple-100 text-purple-800';
    case 'FERPA':
      return 'bg-indigo-100 text-indigo-800';
    case 'OSHA':
      return 'bg-orange-100 text-orange-800';
    case 'FDA':
      return 'bg-green-100 text-green-800';
    case 'STATE':
      return 'bg-blue-100 text-blue-800';
    case 'INTERNAL':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Format category name for display
 */
export const formatCategory = (category: ComplianceCategory): string => {
  const names: Record<ComplianceCategory, string> = {
    HIPAA: 'HIPAA',
    FERPA: 'FERPA',
    OSHA: 'OSHA',
    FDA: 'FDA',
    STATE: 'State Regulations',
    INTERNAL: 'Internal Policy'
  };
  return names[category];
};

/**
 * Check if compliance item is expiring soon (within 30 days)
 */
export const isExpiringSoon = (expirationDate?: string): boolean => {
  if (!expirationDate) return false;
  
  const expDate = new Date(expirationDate);
  const today = new Date();
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  return expDate <= thirtyDaysFromNow && expDate > today;
};

/**
 * Check if compliance item is expired
 */
export const isExpired = (expirationDate?: string): boolean => {
  if (!expirationDate) return false;
  return new Date(expirationDate) < new Date();
};

/**
 * Calculate days until expiration
 */
export const daysUntilExpiration = (expirationDate?: string): number | null => {
  if (!expirationDate) return null;
  
  const expDate = new Date(expirationDate);
  const today = new Date();
  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

/**
 * Filter compliance items by category
 */
export const filterByCategory = (
  items: ComplianceItem[],
  category: ComplianceCategory | 'all'
): ComplianceItem[] => {
  if (category === 'all') return items;
  return items.filter(item => item.category === category);
};

/**
 * Filter compliance items by status
 */
export const filterByStatus = (
  items: ComplianceItem[],
  status: ComplianceStatus | 'all'
): ComplianceItem[] => {
  if (status === 'all') return items;
  return items.filter(item => item.status === status);
};

/**
 * Filter compliance items by priority
 */
export const filterByPriority = (
  items: ComplianceItem[],
  priority: CompliancePriority | 'all'
): ComplianceItem[] => {
  if (priority === 'all') return items;
  return items.filter(item => item.priority === priority);
};

/**
 * Search compliance items
 */
export const searchComplianceItems = (
  items: ComplianceItem[],
  query: string
): ComplianceItem[] => {
  if (!query.trim()) return items;
  
  const lowerQuery = query.toLowerCase();
  return items.filter(item =>
    item.title.toLowerCase().includes(lowerQuery) ||
    item.description?.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery) ||
    item.responsibleParty?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Sort compliance items
 */
export const sortComplianceItems = (
  items: ComplianceItem[],
  sortBy: 'title' | 'category' | 'status' | 'priority' | 'lastAudit' | 'expiration',
  order: 'asc' | 'desc' = 'asc'
): ComplianceItem[] => {
  return [...items].sort((a, b) => {
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
      case 'priority':
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'lastAudit':
        comparison = new Date(a.lastAudit).getTime() - new Date(b.lastAudit).getTime();
        break;
      case 'expiration':
        if (!a.expirationDate && !b.expirationDate) comparison = 0;
        else if (!a.expirationDate) comparison = 1;
        else if (!b.expirationDate) comparison = -1;
        else comparison = new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
};

/**
 * Calculate compliance statistics
 */
export const calculateComplianceStats = (items: ComplianceItem[]) => {
  const total = items.length;
  const compliant = items.filter(i => i.status === 'COMPLIANT').length;
  const nonCompliant = items.filter(i => i.status === 'NON_COMPLIANT').length;
  const needsAttention = items.filter(i => i.status === 'NEEDS_ATTENTION').length;
  const underReview = items.filter(i => i.status === 'UNDER_REVIEW').length;
  const expired = items.filter(i => i.status === 'EXPIRED').length;
  const highPriority = items.filter(i => i.priority === 'HIGH').length;
  
  return {
    total,
    compliant,
    nonCompliant,
    needsAttention,
    underReview,
    expired,
    complianceRate: total > 0 ? Math.round((compliant / total) * 100) : 0,
    highPriority
  };
};
