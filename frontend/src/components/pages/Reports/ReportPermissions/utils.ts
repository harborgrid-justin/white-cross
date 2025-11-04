/**
 * Utility functions for ReportPermissions component
 * Pure functions for permission calculations, filtering, and display logic
 */

import {
  Shield,
  Users,
  UserCheck,
  UserX,
  Eye,
  Edit3,
  Trash2,
  Download,
  Share2,
  Settings,
  Lock,
  Unlock,
  Key,
  Crown,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Search,
  Filter,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Save,
  Copy,
  Loader2,
  Building,
  User,
  Globe,
  FileText,
  Calendar,
  Clock,
  type LucideIcon
} from 'lucide-react';

import type {
  PermissionLevel,
  EntityType,
  PermissionRule,
  AccessLogEntry,
  PermissionFilters
} from './types';

/**
 * Configuration for permission level display
 */
export interface PermissionLevelConfig {
  /** Tailwind CSS classes for color styling */
  color: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Human-readable label */
  label: string;
}

/**
 * Gets display configuration for a permission level
 *
 * @param level - The permission level
 * @returns Configuration object with color, icon, and label
 */
export const getPermissionLevelDisplay = (level: PermissionLevel): PermissionLevelConfig => {
  const config: Record<PermissionLevel, PermissionLevelConfig> = {
    none: { color: 'text-red-600 bg-red-100', icon: X, label: 'No Access' },
    read: { color: 'text-blue-600 bg-blue-100', icon: Eye, label: 'Read Only' },
    write: { color: 'text-green-600 bg-green-100', icon: Edit3, label: 'Read & Write' },
    admin: { color: 'text-purple-600 bg-purple-100', icon: Settings, label: 'Admin' },
    owner: { color: 'text-orange-600 bg-orange-100', icon: Crown, label: 'Owner' }
  };

  return config[level];
};

/**
 * Gets the icon component for an entity type
 *
 * @param type - The entity type
 * @returns Lucide icon component
 */
export const getEntityTypeIcon = (type: EntityType): LucideIcon => {
  const icons: Record<EntityType, LucideIcon> = {
    user: User,
    group: Users,
    role: Key,
    department: Building
  };

  return icons[type];
};

/**
 * Filters permission rules based on search term and filters
 *
 * @param rules - Array of permission rules
 * @param searchTerm - Search string (case-insensitive)
 * @param filters - Filter criteria
 * @returns Filtered array of permission rules
 */
export const filterPermissionRules = (
  rules: PermissionRule[],
  searchTerm: string,
  filters: PermissionFilters
): PermissionRule[] => {
  return rules.filter(rule => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesEntity = rule.entityName.toLowerCase().includes(searchLower);
      const matchesResource = rule.resourceName?.toLowerCase().includes(searchLower);

      if (!matchesEntity && !matchesResource) {
        return false;
      }
    }

    // Entity type filter
    if (filters.entityType !== 'all' && rule.entityType !== filters.entityType) {
      return false;
    }

    // Permission level filter
    if (filters.level !== 'all' && rule.level !== filters.level) {
      return false;
    }

    // Scope filter
    if (filters.scope !== 'all' && rule.scope !== filters.scope) {
      return false;
    }

    return true;
  });
};

/**
 * Filters access logs based on search term
 *
 * @param logs - Array of access log entries
 * @param searchTerm - Search string (case-insensitive)
 * @returns Filtered array of access log entries
 */
export const filterAccessLogs = (
  logs: AccessLogEntry[],
  searchTerm: string
): AccessLogEntry[] => {
  if (!searchTerm) {
    return logs;
  }

  const searchLower = searchTerm.toLowerCase();

  return logs.filter(log => {
    const matchesEntity = log.entityName.toLowerCase().includes(searchLower);
    const matchesResource = log.resourceName.toLowerCase().includes(searchLower);
    const matchesAction = log.action.toLowerCase().includes(searchLower);

    return matchesEntity || matchesResource || matchesAction;
  });
};

/**
 * Checks if a rule has any conditional restrictions
 *
 * @param rule - Permission rule to check
 * @returns True if rule has conditions
 */
export const hasConditions = (rule: PermissionRule): boolean => {
  return !!(
    rule.conditions?.timeRestriction ||
    rule.conditions?.ipRestriction?.length ||
    rule.conditions?.expiresAt
  );
};

/**
 * Checks if a permission rule is inherited
 *
 * @param rule - Permission rule to check
 * @returns True if rule is inherited
 */
export const isInherited = (rule: PermissionRule): boolean => {
  return !!rule.inheritedFrom;
};

/**
 * Gets a human-readable description of permission conditions
 *
 * @param rule - Permission rule
 * @returns Array of condition descriptions
 */
export const getConditionDescriptions = (rule: PermissionRule): string[] => {
  const descriptions: string[] = [];

  if (rule.conditions?.timeRestriction) {
    const { startTime, endTime, days } = rule.conditions.timeRestriction;
    descriptions.push(`Active ${days.join(', ')} from ${startTime} to ${endTime}`);
  }

  if (rule.conditions?.ipRestriction?.length) {
    descriptions.push(`IP restricted to ${rule.conditions.ipRestriction.length} addresses`);
  }

  if (rule.conditions?.expiresAt) {
    const expiryDate = new Date(rule.conditions.expiresAt);
    descriptions.push(`Expires on ${expiryDate.toLocaleDateString()}`);
  }

  return descriptions;
};

/**
 * Formats a date string for display
 *
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

/**
 * Formats a date-time string for display
 *
 * @param dateString - ISO date-time string
 * @returns Formatted date-time string
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

/**
 * Validates if a permission rule has required fields
 *
 * @param rule - Partial permission rule to validate
 * @returns True if rule is valid for creation
 */
export const validatePermissionRule = (rule: Partial<PermissionRule>): boolean => {
  return !!(
    rule.entityId &&
    rule.level &&
    rule.scope &&
    (rule.scope === 'global' || rule.resourceId)
  );
};

/**
 * Validates if a template has required fields
 *
 * @param template - Partial template to validate
 * @returns True if template is valid for creation
 */
export const validateTemplate = (template: { name?: string; level?: string }): boolean => {
  return !!(template.name && template.level);
};

/**
 * Gets the count of selected items
 *
 * @param selectedIds - Array of selected IDs
 * @returns Count of selections
 */
export const getSelectionCount = (selectedIds: string[]): number => {
  return selectedIds.length;
};

/**
 * Checks if all items are selected
 *
 * @param selectedIds - Array of selected IDs
 * @param totalItems - Total number of items
 * @returns True if all items are selected
 */
export const isAllSelected = (selectedIds: string[], totalItems: number): boolean => {
  return selectedIds.length === totalItems && totalItems > 0;
};

/**
 * Toggles an ID in the selection array
 *
 * @param selectedIds - Current selection array
 * @param id - ID to toggle
 * @returns New selection array
 */
export const toggleSelection = (selectedIds: string[], id: string): string[] => {
  if (selectedIds.includes(id)) {
    return selectedIds.filter(selectedId => selectedId !== id);
  } else {
    return [...selectedIds, id];
  }
};

/**
 * Gets all IDs from an array of items
 *
 * @param items - Array of items with id property
 * @returns Array of IDs
 */
export const getAllIds = <T extends { id: string }>(items: T[]): string[] => {
  return items.map(item => item.id);
};
