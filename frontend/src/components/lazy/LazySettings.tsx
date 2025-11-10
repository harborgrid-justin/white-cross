/**
 * Lazy-loaded Settings Components
 *
 * This module provides lazy-loaded wrappers for settings page components.
 * Settings pages are rarely accessed and should not be in the initial bundle.
 *
 * PERFORMANCE IMPACT:
 * - Settings bundle size: ~30-40KB (including forms and validation)
 * - Initial load improvement: Settings load only when accessed
 * - Route-based code splitting: Load when user navigates to settings
 *
 * USAGE:
 * ```tsx
 * import { LazyProfileSettings } from '@/components/lazy/LazySettings'
 *
 * function SettingsPage() {
 *   return (
 *     <Suspense fallback={<SettingsSkeleton />}>
 *       <LazyProfileSettings />
 *     </Suspense>
 *   )
 * }
 * ```
 *
 * @module components/lazy/LazySettings
 * @since 1.1.0
 */

'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/feedback';

/**
 * Loading fallback for settings components
 * Provides skeleton UI matching settings layout
 */
const SettingsLoadingFallback = () => (
  <div className="space-y-6 p-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
    <div className="flex justify-end gap-2">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

/**
 * Lazy-loaded Profile Settings component
 */
export const LazyProfileSettings = dynamic(
  () => import('@/app/(dashboard)/settings/_components/ProfileSettingsContent').then((mod) => mod.ProfileSettingsContent),
  {
    loading: () => <SettingsLoadingFallback />,
    ssr: false,
  }
);

/**
 * Lazy-loaded Security Settings component
 */
export const LazySecuritySettings = dynamic(
  () => import('@/app/(dashboard)/settings/_components/SecuritySettingsContent').then((mod) => mod.SecuritySettingsContent),
  {
    loading: () => <SettingsLoadingFallback />,
    ssr: false,
  }
);

/**
 * Lazy-loaded Notifications Settings component
 */
export const LazyNotificationsSettings = dynamic(
  () => import('@/app/(dashboard)/settings/_components/NotificationsSettingsContent').then((mod) => mod.NotificationsSettingsContent),
  {
    loading: () => <SettingsLoadingFallback />,
    ssr: false,
  }
);

/**
 * Lazy-loaded Notification Settings (feature)
 */
export const LazyNotificationSettingsFeature = dynamic(
  () => import('@/features/notifications/components/NotificationSettings').then((mod) => mod.NotificationSettings),
  {
    loading: () => <SettingsLoadingFallback />,
    ssr: false,
  }
);

/**
 * Lazy-loaded Inventory Settings component
 */
export const LazyInventorySettings = dynamic(
  () => import('@/app/(dashboard)/inventory/settings/_components/InventorySettingsContent').then((mod) => mod.InventorySettingsContent),
  {
    loading: () => <SettingsLoadingFallback />,
    ssr: false,
  }
);

/**
 * Settings Skeleton Component
 * Export for use in other loading states
 */
export { SettingsLoadingFallback as SettingsSkeleton };
