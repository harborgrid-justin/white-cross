/**
 * @fileoverview Compliance Utility Functions - Badge variants and icon mapping
 * @module app/(dashboard)/compliance/_components/compliance.utils
 * @category Compliance - Utils
 */

import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Lock,
  BookOpen,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Type definitions for compliance status and priorities
export type ComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'NEEDS_ATTENTION' | 'UNDER_REVIEW' | 'EXPIRED';
export type CompliancePriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type ComplianceRiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type ComplianceCategory = 'HIPAA' | 'FERPA' | 'OSHA' | 'FDA' | 'STATE' | 'INTERNAL';

// Badge variant type matching UI component variants
export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'secondary';

/**
 * Maps compliance status to appropriate badge variant for visual consistency
 * @param status - Compliance status value
 * @returns Badge variant string
 */
export function getStatusBadgeVariant(status: ComplianceStatus): BadgeVariant {
  switch (status) {
    case 'COMPLIANT':
      return 'success';
    case 'NON_COMPLIANT':
    case 'EXPIRED':
      return 'danger';
    case 'NEEDS_ATTENTION':
      return 'warning';
    case 'UNDER_REVIEW':
      return 'info';
    default:
      return 'secondary';
  }
}

/**
 * Maps compliance status to appropriate icon component
 * @param status - Compliance status value
 * @returns Lucide icon component
 */
export function getStatusIcon(status: ComplianceStatus): LucideIcon {
  switch (status) {
    case 'COMPLIANT':
      return CheckCircle;
    case 'NON_COMPLIANT':
    case 'EXPIRED':
      return XCircle;
    case 'NEEDS_ATTENTION':
      return AlertTriangle;
    case 'UNDER_REVIEW':
      return Clock;
    default:
      return Shield;
  }
}

/**
 * Maps priority level to appropriate badge variant
 * @param priority - Priority level
 * @returns Badge variant string
 */
export function getPriorityBadgeVariant(priority: CompliancePriority): BadgeVariant {
  switch (priority) {
    case 'HIGH':
      return 'danger';
    case 'MEDIUM':
      return 'warning';
    case 'LOW':
      return 'info';
    default:
      return 'secondary';
  }
}

/**
 * Maps risk level to appropriate text color class
 * @param riskLevel - Risk level assessment
 * @returns Tailwind CSS color class
 */
export function getRiskColor(riskLevel: ComplianceRiskLevel): string {
  switch (riskLevel) {
    case 'HIGH':
      return 'text-red-600';
    case 'MEDIUM':
      return 'text-yellow-600';
    case 'LOW':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Maps compliance category to appropriate icon component
 * @param category - Compliance category
 * @returns Lucide icon component
 */
export function getCategoryIcon(category: ComplianceCategory): LucideIcon {
  switch (category) {
    case 'HIPAA':
      return Shield;
    case 'FERPA':
      return Lock;
    case 'OSHA':
      return AlertTriangle;
    case 'FDA':
      return FileText;
    case 'STATE':
      return BookOpen;
    case 'INTERNAL':
      return Users;
    default:
      return Shield;
  }
}

/**
 * Determines progress bar color based on completion percentage
 * @param progress - Completion percentage (0-100)
 * @returns Tailwind CSS background color class
 */
export function getProgressBarColor(progress: number): string {
  if (progress >= 90) return 'bg-green-600';
  if (progress >= 70) return 'bg-blue-600';
  if (progress >= 50) return 'bg-yellow-600';
  return 'bg-red-600';
}

/**
 * Formats compliance status for display (removes underscores, capitalizes)
 * @param status - Raw status string
 * @returns Formatted status string
 */
export function formatStatus(status: string): string {
  return status.replace(/_/g, ' ');
}

/**
 * Calculates days until a date
 * @param dateString - ISO date string
 * @returns Number of days until the date
 */
export function daysUntil(dateString: string): number {
  const targetDate = new Date(dateString);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determines if an audit is upcoming (within specified days threshold)
 * @param auditDate - ISO date string of audit
 * @param threshold - Days threshold for "upcoming" (default: 60)
 * @returns Boolean indicating if audit is upcoming
 */
export function isUpcomingAudit(auditDate: string, threshold = 60): boolean {
  const days = daysUntil(auditDate);
  return days > 0 && days <= threshold;
}
