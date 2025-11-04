/**
 * WF-COMM-EMERGENCY-MESSAGE-COMPOSER | EmergencyMessageComposer.tsx - Message Composition Component
 * Purpose: Subject and message content composition for emergency alerts
 * Related: CommunicationEmergencyTab component
 * Last Updated: 2025-11-04
 */

'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Input } from '@/components/ui/inputs/Input';
import { Textarea } from '@/components/ui/inputs/Textarea';
import { Card } from '@/components/ui/card';
import type { EmergencyMessageComposerProps } from './types';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Emergency Message Composer Component
 *
 * Provides subject and message input fields for emergency alert composition.
 *
 * **Features:**
 * - Subject input with validation
 * - Auto-resizing textarea for message
 * - Character count display
 * - Error display for both fields
 * - Max length enforcement (1000 characters)
 *
 * @component
 * @param {EmergencyMessageComposerProps} props - Component props
 * @returns {JSX.Element} Rendered message composer
 *
 * @example
 * ```tsx
 * <EmergencyMessageComposer
 *   subject={subject}
 *   message={message}
 *   onSubjectChange={setSubject}
 *   onMessageChange={setMessage}
 *   subjectError={errors.subject}
 *   messageError={errors.message}
 * />
 * ```
 */
export const EmergencyMessageComposer = React.memo<EmergencyMessageComposerProps>(
  ({
    subject,
    message,
    onSubjectChange,
    onMessageChange,
    subjectError,
    messageError,
    className,
  }) => {
    return (
      <Card className={cn('p-6', className)}>
        <div className="space-y-4">
          <Input
            label="Subject"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            placeholder="Enter alert subject..."
            required
            error={subjectError}
            aria-label="Emergency alert subject"
          />

          <Textarea
            label="Emergency Message"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Enter emergency alert message..."
            required
            autoResize
            minRows={6}
            maxRows={15}
            maxLength={1000}
            showCharCount
            error={messageError}
            helperText="Emergency message will be sent via all selected channels"
            aria-label="Emergency alert message content"
          />
        </div>
      </Card>
    );
  }
);

EmergencyMessageComposer.displayName = 'EmergencyMessageComposer';

export default EmergencyMessageComposer;
