'use client';

import React, { useState } from 'react';
import { Mail, X, Plus } from 'lucide-react';

/**
 * Props for the EmailDelivery component
 */
export interface EmailDeliveryProps {
  /** List of email recipients */
  recipients: string[];
  /** Callback when recipients change */
  onChange: (recipients: string[]) => void;
  /** Optional email validation function */
  onValidate?: (email: string) => boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Default email validation function
 */
const defaultEmailValidation = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * EmailDelivery Component
 *
 * Manages email recipients for export delivery.
 * Supports adding/removing recipients with email validation.
 *
 * @param props - EmailDelivery component props
 * @returns JSX element representing the email delivery configuration
 */
export const EmailDelivery: React.FC<EmailDeliveryProps> = ({
  recipients,
  onChange,
  onValidate = defaultEmailValidation,
  disabled = false,
  className = ''
}) => {
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles adding a new recipient
   */
  const handleAddRecipient = () => {
    const trimmedEmail = newEmail.trim();

    if (!trimmedEmail) {
      setError('Email address is required');
      return;
    }

    if (!onValidate(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (recipients.includes(trimmedEmail)) {
      setError('This email is already in the list');
      return;
    }

    onChange([...recipients, trimmedEmail]);
    setNewEmail('');
    setError(null);
  };

  /**
   * Handles removing a recipient
   */
  const handleRemoveRecipient = (email: string) => {
    onChange(recipients.filter(r => r !== email));
  };

  /**
   * Handles key press in email input
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRecipient();
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Mail className="w-4 h-4 inline mr-2" />
        Email Recipients
      </label>

      {/* Recipient list */}
      {recipients.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {recipients.map((email) => (
            <div
              key={email}
              className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
            >
              <span>{email}</span>
              <button
                type="button"
                onClick={() => handleRemoveRecipient(email)}
                disabled={disabled}
                className="ml-2 text-blue-600 hover:text-blue-900 focus:outline-none"
                aria-label={`Remove ${email}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add recipient input */}
      <div className="flex items-start space-x-2">
        <div className="flex-1">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              setError(null);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter email address"
            disabled={disabled}
            className={`w-full border ${
              error ? 'border-red-300' : 'border-gray-300'
            } rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'
            } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            aria-label="Email recipient"
            aria-invalid={!!error}
            aria-describedby={error ? 'email-error' : undefined}
          />
          {error && (
            <p id="email-error" className="text-xs text-red-600 mt-1">
              {error}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddRecipient}
          disabled={disabled}
          className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent
                   rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                   focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-label="Add recipient"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {recipients.length === 0 && (
        <p className="text-xs text-gray-500 mt-2">
          No recipients added. Add email addresses to deliver the export.
        </p>
      )}
    </div>
  );
};

export default EmailDelivery;
