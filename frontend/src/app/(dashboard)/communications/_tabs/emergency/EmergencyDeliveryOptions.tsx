/**
 * WF-COMM-EMERGENCY-DELIVERY-OPTIONS | EmergencyDeliveryOptions.tsx - Delivery Options Component
 * Purpose: Multi-channel delivery configuration and options
 * Related: CommunicationEmergencyTab component
 * Last Updated: 2025-11-04
 */

'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import type { EmergencyDeliveryOptionsProps, DeliveryChannel } from './types';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Emergency Delivery Options Component
 *
 * Provides multi-channel delivery configuration with confirmation
 * and escalation options for emergency alerts.
 *
 * **Features:**
 * - Multi-channel selection (email, SMS, push, voice)
 * - Delivery confirmation toggle
 * - Emergency contact escalation toggle
 * - Critical alert warnings
 * - Severity-based recommendations
 *
 * @component
 * @param {EmergencyDeliveryOptionsProps} props - Component props
 * @returns {JSX.Element} Rendered delivery options
 *
 * @example
 * ```tsx
 * <EmergencyDeliveryOptions
 *   selectedChannels={['email', 'sms']}
 *   onChannelsChange={setDeliveryChannels}
 *   requireConfirmation={true}
 *   escalateToEmergency={false}
 *   onConfirmationChange={setRequireConfirmation}
 *   onEscalationChange={setEscalateToEmergency}
 *   severity="critical"
 *   error={errors.deliveryChannels}
 * />
 * ```
 */
export const EmergencyDeliveryOptions = React.memo<EmergencyDeliveryOptionsProps>(
  ({
    selectedChannels,
    onChannelsChange,
    requireConfirmation,
    escalateToEmergency,
    onConfirmationChange,
    onEscalationChange,
    severity,
    error,
    className,
  }) => {
    // Handle channel toggle
    const handleChannelToggle = (channel: DeliveryChannel, checked: boolean) => {
      if (checked) {
        onChannelsChange([...selectedChannels, channel]);
      } else {
        onChannelsChange(selectedChannels.filter((c) => c !== channel));
      }
    };

    return (
      <>
        <Card className={cn('p-6', className)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Delivery Channels <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {/* Email Channel */}
                <div className="flex items-center">
                  <Checkbox
                    id="channel-email"
                    checked={selectedChannels.includes('email')}
                    onCheckedChange={(checked) =>
                      handleChannelToggle('email', checked === true)
                    }
                    aria-label="Send via email"
                  />
                  <label
                    htmlFor="channel-email"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Email
                  </label>
                </div>

                {/* SMS Channel */}
                <div className="flex items-center">
                  <Checkbox
                    id="channel-sms"
                    checked={selectedChannels.includes('sms')}
                    onCheckedChange={(checked) =>
                      handleChannelToggle('sms', checked === true)
                    }
                    aria-label="Send via SMS"
                  />
                  <label
                    htmlFor="channel-sms"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    SMS / Text Message (Recommended for emergencies)
                  </label>
                </div>

                {/* Push Notification Channel */}
                <div className="flex items-center">
                  <Checkbox
                    id="channel-push"
                    checked={selectedChannels.includes('push')}
                    onCheckedChange={(checked) =>
                      handleChannelToggle('push', checked === true)
                    }
                    aria-label="Send via push notification"
                  />
                  <label
                    htmlFor="channel-push"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Push Notification
                  </label>
                </div>

                {/* Voice Call Channel */}
                <div className="flex items-center">
                  <Checkbox
                    id="channel-voice"
                    checked={selectedChannels.includes('voice')}
                    onCheckedChange={(checked) =>
                      handleChannelToggle('voice', checked === true)
                    }
                    aria-label="Send via voice call"
                  />
                  <label
                    htmlFor="channel-voice"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Voice Call (Critical emergencies only)
                  </label>
                </div>
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            {/* Additional Options */}
            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Checkbox
                  id="require-confirmation"
                  checked={requireConfirmation}
                  onCheckedChange={(checked) => onConfirmationChange(checked === true)}
                  aria-label="Require delivery confirmation"
                />
                <label
                  htmlFor="require-confirmation"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Require delivery confirmation
                </label>
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="escalate-emergency"
                  checked={escalateToEmergency}
                  onCheckedChange={(checked) => onEscalationChange(checked === true)}
                  aria-label="Escalate to emergency contacts"
                />
                <label
                  htmlFor="escalate-emergency"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Escalate to emergency contacts if primary contact unavailable
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Critical Warning Alert */}
        {severity === 'critical' && (
          <Alert variant="destructive">
            <strong>CRITICAL ALERT:</strong> This emergency notification will be sent via all
            available channels simultaneously. Ensure the message content is accurate before
            sending.
          </Alert>
        )}
      </>
    );
  }
);

EmergencyDeliveryOptions.displayName = 'EmergencyDeliveryOptions';

export default EmergencyDeliveryOptions;
