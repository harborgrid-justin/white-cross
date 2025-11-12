import React from 'react';
import { UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  RecipientSelectorProps,
  CommunicationRecipient
} from './CommunicationComposer.types';

/**
 * RecipientSelector Component
 *
 * Handles recipient selection with search functionality,
 * displays selected recipients, and manages add/remove actions.
 *
 * @param props - The component props
 * @returns The rendered RecipientSelector component
 */
const RecipientSelector: React.FC<RecipientSelectorProps> = ({
  recipients,
  availableRecipients,
  recipientSearch,
  onRecipientSearchChange,
  onAddRecipient,
  onRemoveRecipient
}) => {
  /**
   * Filter available recipients based on search
   */
  const filteredRecipients = availableRecipients.filter(
    recipient =>
      !recipients.find(r => r.id === recipient.id) &&
      (recipient.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
        recipient.email?.toLowerCase().includes(recipientSearch.toLowerCase()) ||
        recipient.role.toLowerCase().includes(recipientSearch.toLowerCase()))
  );

  return (
    <div>
      <label htmlFor="recipients" className="block text-sm font-medium text-gray-700 mb-2">
        To
      </label>
      <div className="space-y-2">
        {/* Selected Recipients */}
        {recipients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipients.map((recipient) => (
              <div
                key={recipient.id}
                className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                <UserIcon className="h-4 w-4" />
                <span>{recipient.name}</span>
                <button
                  onClick={() => onRemoveRecipient(recipient.id)}
                  className="text-blue-500 hover:text-blue-700"
                  aria-label={`Remove ${recipient.name}`}
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Recipient Search */}
        <div className="relative">
          <input
            type="text"
            value={recipientSearch}
            onChange={(e) => onRecipientSearchChange(e.target.value)}
            placeholder="Search recipients..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Search Results */}
          {recipientSearch && filteredRecipients.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
              {filteredRecipients.slice(0, 10).map((recipient) => (
                <button
                  key={recipient.id}
                  onClick={() => onAddRecipient(recipient)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{recipient.name}</div>
                      <div className="text-xs text-gray-500">{recipient.role}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipientSelector;
