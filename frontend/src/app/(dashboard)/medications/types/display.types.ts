import type {
  Medication,
  MedicationType,
  MedicationStatus,
  AlertLevel,
  MedicationInventory,
} from './core.types';

/**
 * Display utility functions for medications
 *
 * @description Helper functions for formatting, styling, and status checks for UI display
 */
export const displayUtils = {
  /**
   * Check if medication is currently active
   *
   * @param medication - Medication to check
   * @returns True if medication status is active
   */
  isActive: (medication: Medication): boolean => medication.status === 'active',

  /**
   * Check if medication is expired
   *
   * @param medication - Medication to check
   * @returns True if status is expired or end date has passed
   */
  isExpired: (medication: Medication): boolean =>
    medication.status === 'expired' || Boolean(medication.endDate && new Date() > medication.endDate),

  /**
   * Check if medication is expiring soon
   *
   * @param medication - Medication to check
   * @param days - Number of days threshold (default: 7)
   * @returns True if medication expires within specified days
   */
  isExpiringSoon: (medication: Medication, days: number = 7): boolean => {
    if (!medication.endDate) return false;
    const daysUntilExpiration = Math.ceil((medication.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= days && daysUntilExpiration > 0;
  },

  /**
   * Check if medication inventory requires refill
   *
   * @param inventory - Medication inventory record
   * @returns True if stock is at or below minimum quantity
   */
  requiresRefill: (inventory?: MedicationInventory): boolean => {
    if (!inventory) return false;
    return inventory.quantityInStock <= inventory.minimumQuantity;
  },

  /**
   * Get Tailwind CSS classes for medication status badge
   *
   * @param status - Medication status
   * @returns Tailwind CSS class string
   */
  getStatusColor: (status: MedicationStatus): string => {
    const colors: Record<MedicationStatus, string> = {
      active: 'text-green-600 bg-green-50',
      discontinued: 'text-gray-600 bg-gray-50',
      expired: 'text-red-600 bg-red-50',
      on_hold: 'text-yellow-600 bg-yellow-50',
      completed: 'text-blue-600 bg-blue-50',
      cancelled: 'text-red-600 bg-red-50',
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  },

  /**
   * Get Tailwind CSS classes for medication type badge
   *
   * @param type - Medication type
   * @returns Tailwind CSS class string
   */
  getTypeColor: (type: MedicationType): string => {
    const colors: Record<MedicationType, string> = {
      prescription: 'text-blue-600 bg-blue-50',
      over_the_counter: 'text-green-600 bg-green-50',
      supplement: 'text-purple-600 bg-purple-50',
      emergency: 'text-red-600 bg-red-50',
      inhaler: 'text-cyan-600 bg-cyan-50',
      epipen: 'text-orange-600 bg-orange-50',
      insulin: 'text-pink-600 bg-pink-50',
      controlled_substance: 'text-red-600 bg-red-50 border border-red-200',
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
  },

  /**
   * Get Tailwind CSS classes for alert level badge
   *
   * @param level - Alert severity level
   * @returns Tailwind CSS class string
   */
  getAlertLevelColor: (level: AlertLevel): string => {
    const colors: Record<AlertLevel, string> = {
      low: 'text-blue-600 bg-blue-50',
      medium: 'text-yellow-600 bg-yellow-50',
      high: 'text-orange-600 bg-orange-50',
      critical: 'text-red-600 bg-red-50',
    };
    return colors[level] || 'text-gray-600 bg-gray-50';
  },

  /**
   * Format medication status for display
   *
   * @param status - Medication status
   * @returns Human-readable status string
   */
  formatStatus: (status: MedicationStatus): string => {
    const statusMap: Record<MedicationStatus, string> = {
      active: 'Active',
      discontinued: 'Discontinued',
      expired: 'Expired',
      on_hold: 'On Hold',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return statusMap[status];
  },

  /**
   * Format medication type for display
   *
   * @param type - Medication type
   * @returns Human-readable type string
   */
  formatType: (type: MedicationType): string => {
    const typeMap: Record<MedicationType, string> = {
      prescription: 'Prescription',
      over_the_counter: 'Over the Counter',
      supplement: 'Supplement',
      emergency: 'Emergency',
      inhaler: 'Inhaler',
      epipen: 'EpiPen',
      insulin: 'Insulin',
      controlled_substance: 'Controlled Substance',
    };
    return typeMap[type];
  },

  /**
   * Format alert level for display
   *
   * @param level - Alert level
   * @returns Human-readable level string
   */
  formatAlertLevel: (level: AlertLevel): string => {
    const levelMap: Record<AlertLevel, string> = {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical',
    };
    return levelMap[level];
  },

  /**
   * Get medication display name (prefers brand name, falls back to generic or name)
   *
   * @param medication - Medication object
   * @returns Display name string
   */
  getDisplayName: (medication: Medication): string => {
    return medication.brandName || medication.genericName || medication.name;
  },

  /**
   * Get secondary medication name for display
   *
   * @param medication - Medication object
   * @returns Secondary name or empty string
   */
  getSecondaryName: (medication: Medication): string => {
    if (medication.brandName && medication.genericName) {
      return `(${medication.genericName})`;
    }
    return '';
  },

  /**
   * Format medication strength and form
   *
   * @param medication - Medication object
   * @returns Formatted string like "500mg Tablet"
   */
  formatStrengthAndForm: (medication: Medication): string => {
    return `${medication.strength} ${medication.dosageForm}`;
  },

  /**
   * Get icon name for medication type (for use with icon libraries)
   *
   * @param type - Medication type
   * @returns Icon identifier string
   */
  getTypeIcon: (type: MedicationType): string => {
    const iconMap: Record<MedicationType, string> = {
      prescription: 'pill',
      over_the_counter: 'shopping-bag',
      supplement: 'leaf',
      emergency: 'alert-circle',
      inhaler: 'wind',
      epipen: 'syringe',
      insulin: 'droplet',
      controlled_substance: 'shield-alert',
    };
    return iconMap[type] || 'pill';
  },

  /**
   * Get icon name for medication status
   *
   * @param status - Medication status
   * @returns Icon identifier string
   */
  getStatusIcon: (status: MedicationStatus): string => {
    const iconMap: Record<MedicationStatus, string> = {
      active: 'check-circle',
      discontinued: 'x-circle',
      expired: 'calendar-x',
      on_hold: 'pause-circle',
      completed: 'check-square',
      cancelled: 'slash',
    };
    return iconMap[status] || 'circle';
  },

  /**
   * Get icon name for alert level
   *
   * @param level - Alert level
   * @returns Icon identifier string
   */
  getAlertIcon: (level: AlertLevel): string => {
    const iconMap: Record<AlertLevel, string> = {
      low: 'info',
      medium: 'alert-triangle',
      high: 'alert-octagon',
      critical: 'alert-circle',
    };
    return iconMap[level] || 'bell';
  },
};
