/**
 * @fileoverview Medication Detail Components Barrel Export
 * @module app/(dashboard)/medications/[id]/_components
 *
 * @description
 * Central export point for all medication detail page components.
 * Simplifies imports and maintains clean component organization.
 *
 * **Exported Components:**
 * - `MedicationActionButtons`: Header action buttons
 * - `MedicationQuickInfo`: Quick info sidebar card
 * - `StudentInfoCard`: Student information card
 * - `QuickActionsCard`: Quick actions sidebar card
 * - `RecentAdministrationsSection`: Recent administrations section
 * - `DetailsSkeleton`: Loading skeleton for details
 * - `LogSkeleton`: Loading skeleton for log
 *
 * **Exported Types:**
 * - All component prop types
 * - Shared data interfaces
 *
 * @example
 * ```tsx
 * import {
 *   MedicationActionButtons,
 *   MedicationQuickInfo,
 *   StudentInfoCard
 * } from './_components';
 * ```
 *
 * @since 1.0.0
 */

// Component exports
export { MedicationActionButtons } from './MedicationActionButtons';
export type { MedicationActionButtonsProps } from './MedicationActionButtons';

export { MedicationQuickInfo } from './MedicationQuickInfo';
export type { MedicationQuickInfoProps } from './MedicationQuickInfo';

export { StudentInfoCard } from './StudentInfoCard';
export type { StudentInfoCardProps } from './StudentInfoCard';

export { QuickActionsCard } from './QuickActionsCard';
export type { QuickActionsCardProps } from './QuickActionsCard';

export { RecentAdministrationsSection } from './RecentAdministrationsSection';
export type { RecentAdministrationsSectionProps } from './RecentAdministrationsSection';

export { DetailsSkeleton, LogSkeleton } from './MedicationDetailSkeleton';

// Type exports
export type {
  StudentInfo,
  MedicationStatus,
  MedicationQuickInfoData,
  AdministrationRecord,
  MedicationDetailData
} from './types';
