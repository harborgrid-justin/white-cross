'use client';

import { X } from 'lucide-react';
import { Recipient } from './MessageCompose.types';

interface RecipientFieldProps {
  recipientSearch: string;
  searchResults: Recipient[];
  showRecipientSearch: boolean;
  recipients: Recipient[];
  showCc: boolean;
  showBcc: boolean;
  errors?: string;
  onSearchChange: (query: string) => void;
  onAddRecipient: (recipient: Recipient) => void;
  onRemoveRecipient: (recipientId: string) => void;
  onToggleCc: () => void;
  onToggleBcc: () => void;
  getRecipientsByType: (type: 'to' | 'cc' | 'bcc') => Recipient[];
}

export function RecipientField({
  recipientSearch,
  searchResults,
  showRecipientSearch,
  recipients,
  showCc,
  showBcc,
  errors,
  onSearchChange,
  onAddRecipient,
  onRemoveRecipient,
  onToggleCc,
  onToggleBcc,
  getRecipientsByType,
}: RecipientFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700 w-12">To:</label>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Enter email addresses..."
            value={recipientSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Recipient Search Results */}
          {showRecipientSearch && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {searchResults.map(recipient => (
                <button
                  key={recipient.id}
                  onClick={() => onAddRecipient(recipient)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">{recipient.name || recipient.email}</div>
                  {recipient.name && (
                    <div className="text-sm text-gray-500">{recipient.email}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onToggleCc}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Cc
        </button>
        <button
          onClick={onToggleBcc}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Bcc
        </button>
      </div>

      {/* Recipients List */}
      {recipients.length > 0 && (
        <div className="space-y-2">
          {/* To Recipients */}
          {getRecipientsByType('to').length > 0 && (
            <div className="flex items-start space-x-2">
              <span className="text-sm text-gray-500 w-12 mt-1">To:</span>
              <div className="flex-1 flex flex-wrap gap-2">
                {getRecipientsByType('to').map(recipient => (
                  <span key={recipient.id} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                    {recipient.name || recipient.email}
                    <button
                      onClick={() => onRemoveRecipient(recipient.id)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                      aria-label={`Remove ${recipient.email}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cc Recipients */}
          {showCc && getRecipientsByType('cc').length > 0 && (
            <div className="flex items-start space-x-2">
              <span className="text-sm text-gray-500 w-12 mt-1">Cc:</span>
              <div className="flex-1 flex flex-wrap gap-2">
                {getRecipientsByType('cc').map(recipient => (
                  <span key={recipient.id} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                    {recipient.name || recipient.email}
                    <button
                      onClick={() => onRemoveRecipient(recipient.id)}
                      className="ml-1 text-gray-600 hover:text-gray-800"
                      aria-label={`Remove ${recipient.email} from Cc`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bcc Recipients */}
          {showBcc && getRecipientsByType('bcc').length > 0 && (
            <div className="flex items-start space-x-2">
              <span className="text-sm text-gray-500 w-12 mt-1">Bcc:</span>
              <div className="flex-1 flex flex-wrap gap-2">
                {getRecipientsByType('bcc').map(recipient => (
                  <span key={recipient.id} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                    {recipient.name || recipient.email}
                    <button
                      onClick={() => onRemoveRecipient(recipient.id)}
                      className="ml-1 text-gray-600 hover:text-gray-800"
                      aria-label={`Remove ${recipient.email} from Bcc`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {errors && (
        <p className="text-sm text-red-600">{errors}</p>
      )}
    </div>
  );
}
