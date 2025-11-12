'use client';

import { ComposeMessage } from './MessageCompose.types';
import { priorityOptions } from './MessageCompose.constants';

interface AdvancedOptionsProps {
  message: ComposeMessage;
  availableTags: string[];
  onUpdateMessage: (updates: Partial<ComposeMessage>) => void;
  onToggleTag: (tag: string) => void;
}

export function AdvancedOptions({
  message,
  availableTags,
  onUpdateMessage,
  onToggleTag,
}: AdvancedOptionsProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={message.priority}
            onChange={(e) => onUpdateMessage({
              priority: e.target.value as ComposeMessage['priority']
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Select message priority"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Scheduled Send */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Send</label>
          <input
            type="datetime-local"
            value={message.scheduledSendTime || ''}
            onChange={(e) => onUpdateMessage({ scheduledSendTime: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Schedule message send time"
          />
        </div>
      </div>

      {/* Tags */}
      {availableTags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => onToggleTag(tag)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  message.tags.includes(tag)
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Options */}
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={message.isConfidential}
            onChange={(e) => onUpdateMessage({ isConfidential: e.target.checked })}
            className="mr-2 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Mark as confidential</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={message.readReceiptRequested}
            onChange={(e) => onUpdateMessage({ readReceiptRequested: e.target.checked })}
            className="mr-2 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Request read receipt</span>
        </label>
      </div>
    </div>
  );
}
