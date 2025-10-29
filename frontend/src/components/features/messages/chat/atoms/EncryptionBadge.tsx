'use client';

/**
 * WF-MSG-003 | EncryptionBadge.tsx - E2E Encryption Status Badge
 * Purpose: Display end-to-end encryption status indicator
 * Dependencies: React, lucide-react
 * Features: Encrypted, unencrypted, verifying states with visual indicators
 * Last Updated: 2025-10-29
 * Agent: MG5X2Y - Frontend Message UI Components Architect
 */

import React from 'react';
import { Lock, LockOpen, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

/**
 * Encryption status types.
 *
 * @type EncryptionStatusType
 * @property {'encrypted'} - Message is end-to-end encrypted
 * @property {'unencrypted'} - Message is not encrypted
 * @property {'verified'} - Encryption keys are verified
 * @property {'unverified'} - Encryption keys are not verified
 * @property {'warning'} - Encryption warning (e.g., key changed)
 */
export type EncryptionStatusType = 'encrypted' | 'unencrypted' | 'verified' | 'unverified' | 'warning';

/**
 * Props for the EncryptionBadge component.
 *
 * @interface EncryptionBadgeProps
 * @property {EncryptionStatusType} status - Current encryption status
 * @property {boolean} [showText=false] - Show status text alongside icon
 * @property {('sm' | 'md' | 'lg')} [size='sm'] - Badge size
 * @property {string} [className] - Additional CSS classes
 * @property {() => void} [onClick] - Callback when badge is clicked (e.g., to show encryption details)
 * @property {string} [tooltip] - Custom tooltip text
 */
export interface EncryptionBadgeProps {
  status: EncryptionStatusType;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  tooltip?: string;
}

/**
 * Encryption status configuration.
 * Maps status to icon, colors, text, and default tooltip.
 */
const encryptionConfig = {
  encrypted: {
    icon: Lock,
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-700 dark:text-green-400',
    iconColor: 'text-green-600 dark:text-green-400',
    text: 'Encrypted',
    tooltip: 'End-to-end encrypted',
  },
  unencrypted: {
    icon: LockOpen,
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    textColor: 'text-gray-700 dark:text-gray-400',
    iconColor: 'text-gray-500 dark:text-gray-400',
    text: 'Not encrypted',
    tooltip: 'This message is not encrypted',
  },
  verified: {
    icon: ShieldCheck,
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-400',
    iconColor: 'text-blue-600 dark:text-blue-400',
    text: 'Verified',
    tooltip: 'End-to-end encrypted and verified',
  },
  unverified: {
    icon: ShieldAlert,
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    textColor: 'text-yellow-700 dark:text-yellow-400',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    text: 'Unverified',
    tooltip: 'Encrypted but identity not verified',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-700 dark:text-red-400',
    iconColor: 'text-red-600 dark:text-red-400',
    text: 'Warning',
    tooltip: 'Encryption warning - keys may have changed',
  },
};

/**
 * Size configuration for badge and icon sizing.
 */
const sizeConfig = {
  sm: {
    padding: 'px-1.5 py-0.5',
    iconSize: 'h-3 w-3',
    textSize: 'text-xs',
    gap: 'gap-1',
  },
  md: {
    padding: 'px-2 py-1',
    iconSize: 'h-4 w-4',
    textSize: 'text-sm',
    gap: 'gap-1.5',
  },
  lg: {
    padding: 'px-3 py-1.5',
    iconSize: 'h-5 w-5',
    textSize: 'text-base',
    gap: 'gap-2',
  },
};

/**
 * Encryption badge component for displaying E2E encryption status.
 *
 * Displays visual indicators for end-to-end encryption status with
 * color-coded badges and optional text labels. Supports click interaction
 * for showing encryption details or verification dialogs.
 *
 * **Features:**
 * - 5 encryption states with distinct visual styles
 * - Color-coded badges for quick recognition
 * - Optional text labels
 * - Multiple sizes (sm, md, lg)
 * - Click interaction support
 * - Custom tooltips
 * - Accessibility with ARIA labels
 * - Dark mode support
 * - Smooth hover transitions
 *
 * **Encryption States:**
 * - **Encrypted**: Green lock - Basic E2E encryption
 * - **Verified**: Blue shield with check - Verified encryption keys
 * - **Unverified**: Yellow shield with alert - Encrypted but not verified
 * - **Unencrypted**: Gray open lock - No encryption
 * - **Warning**: Red alert triangle - Encryption warning
 *
 * **Accessibility:**
 * - aria-label for screen readers
 * - title attribute for tooltips
 * - Keyboard accessible when clickable
 * - Focus indicators
 * - Color not sole indicator (uses icons and text)
 *
 * @component
 * @param {EncryptionBadgeProps} props - Component props
 * @returns {JSX.Element} Rendered encryption badge
 *
 * @example
 * ```tsx
 * // Simple encrypted badge
 * <EncryptionBadge status="encrypted" />
 *
 * // Verified encryption with text
 * <EncryptionBadge status="verified" showText />
 *
 * // Large badge with click handler
 * <EncryptionBadge
 *   status="unverified"
 *   size="lg"
 *   showText
 *   onClick={() => showVerificationDialog()}
 * />
 *
 * // Warning with custom tooltip
 * <EncryptionBadge
 *   status="warning"
 *   tooltip="Bob's encryption key has changed"
 *   onClick={handleWarningClick}
 * />
 *
 * // Custom styling
 * <EncryptionBadge
 *   status="encrypted"
 *   className="ml-2"
 *   size="sm"
 * />
 * ```
 */
export const EncryptionBadge = React.memo<EncryptionBadgeProps>(({
  status,
  showText = false,
  size = 'sm',
  className = '',
  onClick,
  tooltip,
}) => {
  const config = encryptionConfig[status];
  const sizeStyles = sizeConfig[size];
  const IconComponent = config.icon;
  const isClickable = !!onClick;

  const badgeContent = (
    <>
      <IconComponent
        className={`${sizeStyles.iconSize} ${config.iconColor}`}
        aria-hidden="true"
      />
      {showText && (
        <span className={`font-medium ${sizeStyles.textSize}`}>
          {config.text}
        </span>
      )}
    </>
  );

  const commonClasses = `
    inline-flex items-center ${sizeStyles.gap} ${sizeStyles.padding}
    rounded-full ${config.bgColor} ${config.textColor}
    transition-all duration-200
    ${className}
  `;

  if (isClickable) {
    return (
      <button
        onClick={onClick}
        className={`
          ${commonClasses}
          hover:shadow-md hover:scale-105
          focus:outline-none focus:ring-2 focus:ring-offset-2
          focus:ring-blue-500 dark:focus:ring-offset-gray-900
          cursor-pointer
        `}
        title={tooltip || config.tooltip}
        aria-label={`${config.text}. Click for more details.`}
      >
        {badgeContent}
      </button>
    );
  }

  return (
    <div
      className={commonClasses}
      title={tooltip || config.tooltip}
      aria-label={config.text}
      role="status"
    >
      {badgeContent}
    </div>
  );
});

EncryptionBadge.displayName = 'EncryptionBadge';

export default EncryptionBadge;
