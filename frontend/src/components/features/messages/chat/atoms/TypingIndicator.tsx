'use client';

/**
 * WF-MSG-004 | TypingIndicator.tsx - Typing Indicator Component
 * Purpose: Animated typing indicator for real-time chat
 * Dependencies: React
 * Features: Animated dots, multiple users, accessibility, customizable
 * Last Updated: 2025-10-29
 * Agent: MG5X2Y - Frontend Message UI Components Architect
 */

import React from 'react';

/**
 * Props for the TypingIndicator component.
 *
 * @interface TypingIndicatorProps
 * @property {string[]} [users] - Array of user names who are typing
 * @property {number} [maxUsersShown=2] - Maximum number of users to show before truncating
 * @property {boolean} [showText=true] - Show "is typing..." text
 * @property {('sm' | 'md' | 'lg')} [size='md'] - Indicator size
 * @property {string} [className] - Additional CSS classes
 */
export interface TypingIndicatorProps {
  users?: string[];
  maxUsersShown?: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Size configuration for dots and text.
 */
const sizeConfig = {
  sm: {
    dotSize: 'h-1.5 w-1.5',
    dotGap: 'gap-1',
    textSize: 'text-xs',
    padding: 'px-2 py-1',
  },
  md: {
    dotSize: 'h-2 w-2',
    dotGap: 'gap-1.5',
    textSize: 'text-sm',
    padding: 'px-3 py-2',
  },
  lg: {
    dotSize: 'h-2.5 w-2.5',
    dotGap: 'gap-2',
    textSize: 'text-base',
    padding: 'px-4 py-2',
  },
};

/**
 * Formats typing users text for display.
 *
 * Examples:
 * - 1 user: "Alice is typing..."
 * - 2 users: "Alice and Bob are typing..."
 * - 3+ users: "Alice, Bob, and 2 others are typing..."
 *
 * @param {string[]} users - Array of user names
 * @param {number} maxShown - Maximum users to show before truncating
 * @returns {string} Formatted typing text
 */
const formatTypingText = (users: string[], maxShown: number): string => {
  if (users.length === 0) return 'Someone is typing...';
  if (users.length === 1) return `${users[0]} is typing...`;
  if (users.length === 2) return `${users[0]} and ${users[1]} are typing...`;

  const shown = users.slice(0, maxShown);
  const remaining = users.length - maxShown;

  if (remaining > 0) {
    return `${shown.join(', ')}, and ${remaining} ${remaining === 1 ? 'other' : 'others'} are typing...`;
  }

  return `${shown.join(', ')} are typing...`;
};

/**
 * Typing indicator component for real-time chat.
 *
 * Displays an animated typing indicator with optional user names.
 * Shows three animated dots with a wave effect to indicate active typing.
 * Optimized with React.memo to prevent unnecessary re-renders.
 *
 * **Features:**
 * - Animated three-dot indicator
 * - Multiple user support with smart text formatting
 * - Configurable maximum users shown
 * - Optional text display
 * - Multiple sizes (sm, md, lg)
 * - Accessibility with ARIA live region
 * - Dark mode support
 * - Smooth CSS animations
 * - respects prefers-reduced-motion
 *
 * **Animation:**
 * - Three dots that animate in sequence
 * - Smooth wave effect
 * - Continuous loop
 * - Respects user motion preferences
 *
 * **Accessibility:**
 * - aria-live="polite" for screen reader announcements
 * - Descriptive aria-label
 * - Motion-reduced fallback
 * - Semantic HTML
 *
 * @component
 * @param {TypingIndicatorProps} props - Component props
 * @returns {JSX.Element} Rendered typing indicator
 *
 * @example
 * ```tsx
 * // Simple typing indicator
 * <TypingIndicator />
 *
 * // Single user typing
 * <TypingIndicator users={['Alice']} />
 * // Output: "Alice is typing..."
 *
 * // Multiple users typing
 * <TypingIndicator users={['Alice', 'Bob']} />
 * // Output: "Alice and Bob are typing..."
 *
 * // Many users (truncated)
 * <TypingIndicator
 *   users={['Alice', 'Bob', 'Charlie', 'David']}
 *   maxUsersShown={2}
 * />
 * // Output: "Alice, Bob, and 2 others are typing..."
 *
 * // Large size, dots only
 * <TypingIndicator size="lg" showText={false} />
 *
 * // Custom styling
 * <TypingIndicator
 *   users={['Alice']}
 *   className="ml-4"
 *   size="sm"
 * />
 * ```
 */
export const TypingIndicator = React.memo<TypingIndicatorProps>(({
  users = [],
  maxUsersShown = 2,
  showText = true,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = sizeConfig[size];
  const typingText = formatTypingText(users, maxUsersShown);

  return (
    <div
      className={`
        inline-flex items-center ${sizeStyles.dotGap} ${sizeStyles.padding}
        bg-gray-100 dark:bg-gray-800 rounded-2xl
        ${className}
      `}
      role="status"
      aria-live="polite"
      aria-label={typingText}
    >
      {/* Animated dots */}
      <div className={`flex items-center ${sizeStyles.dotGap}`}>
        <span
          className={`
            ${sizeStyles.dotSize}
            bg-gray-500 dark:bg-gray-400 rounded-full
            animate-typing-bounce
            motion-reduce:animate-none
          `}
          style={{ animationDelay: '0ms' }}
          aria-hidden="true"
        />
        <span
          className={`
            ${sizeStyles.dotSize}
            bg-gray-500 dark:bg-gray-400 rounded-full
            animate-typing-bounce
            motion-reduce:animate-none
          `}
          style={{ animationDelay: '150ms' }}
          aria-hidden="true"
        />
        <span
          className={`
            ${sizeStyles.dotSize}
            bg-gray-500 dark:bg-gray-400 rounded-full
            animate-typing-bounce
            motion-reduce:animate-none
          `}
          style={{ animationDelay: '300ms' }}
          aria-hidden="true"
        />
      </div>

      {/* Typing text */}
      {showText && (
        <span
          className={`
            ${sizeStyles.textSize}
            text-gray-600 dark:text-gray-400
            font-medium
          `}
        >
          {typingText}
        </span>
      )}

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes typing-bounce {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }

        :global(.animate-typing-bounce) {
          animation: typing-bounce 1.4s infinite ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.animate-typing-bounce) {
            animation: none;
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
});

TypingIndicator.displayName = 'TypingIndicator';

export default TypingIndicator;
