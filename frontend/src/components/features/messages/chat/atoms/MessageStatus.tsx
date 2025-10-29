'use client';

/**
 * WF-MSG-002 | MessageStatus.tsx - Message Delivery Status Component
 * Purpose: Display message delivery and read status indicators
 * Dependencies: React, lucide-react
 * Features: Sending, sent, delivered, read, failed states with icons
 * Last Updated: 2025-10-29
 * Agent: MG5X2Y - Frontend Message UI Components Architect
 */

import React from 'react';
import { Check, CheckCheck, Clock, AlertCircle, Send } from 'lucide-react';

/**
 * Message delivery status types.
 *
 * @type MessageStatusType
 * @property {'sending'} - Message is being sent (pending)
 * @property {'sent'} - Message sent to server
 * @property {'delivered'} - Message delivered to recipient's device
 * @property {'read'} - Message read by recipient(s)
 * @property {'failed'} - Message failed to send
 */
export type MessageStatusType = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

/**
 * Props for the MessageStatus component.
 *
 * @interface MessageStatusProps
 * @property {MessageStatusType} status - Current message delivery status
 * @property {boolean} [showText=false] - Show status text alongside icon
 * @property {string} [className] - Additional CSS classes
 * @property {number} [readCount] - Number of recipients who read the message (for group chats)
 * @property {() => void} [onRetry] - Callback when retry button is clicked (for failed messages)
 */
export interface MessageStatusProps {
  status: MessageStatusType;
  showText?: boolean;
  className?: string;
  readCount?: number;
  onRetry?: () => void;
}

/**
 * Status configuration for each message state.
 * Maps status to icon, color, text, and aria-label.
 */
const statusConfig = {
  sending: {
    icon: Clock,
    color: 'text-gray-400 dark:text-gray-500',
    text: 'Sending',
    ariaLabel: 'Message is being sent',
  },
  sent: {
    icon: Check,
    color: 'text-gray-400 dark:text-gray-500',
    text: 'Sent',
    ariaLabel: 'Message sent',
  },
  delivered: {
    icon: CheckCheck,
    color: 'text-gray-400 dark:text-gray-500',
    text: 'Delivered',
    ariaLabel: 'Message delivered',
  },
  read: {
    icon: CheckCheck,
    color: 'text-blue-500 dark:text-blue-400',
    text: 'Read',
    ariaLabel: 'Message read',
  },
  failed: {
    icon: AlertCircle,
    color: 'text-red-500 dark:text-red-400',
    text: 'Failed',
    ariaLabel: 'Message failed to send',
  },
};

/**
 * Message status indicator component.
 *
 * Displays visual indicators for message delivery and read status.
 * Shows appropriate icons for each state: sending, sent, delivered, read, or failed.
 * Optimized with React.memo to prevent unnecessary re-renders.
 *
 * **Features:**
 * - 5 status states with distinct icons
 * - Color coding for quick recognition
 * - Optional text labels
 * - Read count for group messages
 * - Retry functionality for failed messages
 * - Accessibility with ARIA labels
 * - Dark mode support
 * - Animated transitions
 *
 * **Status States:**
 * - **Sending**: Clock icon (gray) - Message is being sent
 * - **Sent**: Single check (gray) - Message sent to server
 * - **Delivered**: Double check (gray) - Message delivered to device(s)
 * - **Read**: Double check (blue) - Message read by recipient(s)
 * - **Failed**: Alert icon (red) - Message failed to send
 *
 * **Accessibility:**
 * - aria-label for screen readers
 * - Semantic HTML with proper attributes
 * - Keyboard accessible retry button
 * - Color not sole indicator (uses icons)
 *
 * @component
 * @param {MessageStatusProps} props - Component props
 * @returns {JSX.Element} Rendered status indicator
 *
 * @example
 * ```tsx
 * // Simple status indicator
 * <MessageStatus status="delivered" />
 *
 * // With text label
 * <MessageStatus status="read" showText />
 *
 * // Group message with read count
 * <MessageStatus status="read" readCount={3} showText />
 * // Output: "Read by 3"
 *
 * // Failed message with retry
 * <MessageStatus
 *   status="failed"
 *   showText
 *   onRetry={() => resendMessage()}
 * />
 *
 * // Custom styling
 * <MessageStatus
 *   status="sent"
 *   className="ml-2"
 * />
 * ```
 */
export const MessageStatus = React.memo<MessageStatusProps>(({
  status,
  showText = false,
  className = '',
  readCount,
  onRetry,
}) => {
  const config = statusConfig[status];
  const IconComponent = config.icon;

  // For failed status with retry option
  if (status === 'failed' && onRetry) {
    return (
      <button
        onClick={onRetry}
        className={`
          inline-flex items-center gap-1 text-xs transition-colors
          hover:text-red-600 dark:hover:text-red-300
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          dark:focus:ring-offset-gray-900 rounded
          ${config.color} ${className}
        `}
        aria-label="Retry sending message"
        title="Click to retry"
      >
        <IconComponent className="h-3 w-3" aria-hidden="true" />
        {showText && (
          <span className="font-medium">
            {config.text} - Retry
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 text-xs ${config.color} ${className}`}
      aria-label={config.ariaLabel}
      role="status"
    >
      <IconComponent
        className="h-3 w-3 transition-colors"
        aria-hidden="true"
      />
      {showText && (
        <span className="font-medium">
          {config.text}
          {status === 'read' && readCount && readCount > 1 && ` by ${readCount}`}
        </span>
      )}
    </div>
  );
});

MessageStatus.displayName = 'MessageStatus';

export default MessageStatus;
