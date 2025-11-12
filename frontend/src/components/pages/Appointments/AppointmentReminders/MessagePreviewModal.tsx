'use client';

import React from 'react';
import { X } from 'lucide-react';

/**
 * Props for the MessagePreviewModal component
 *
 * @interface MessagePreviewModalProps
 */
export interface MessagePreviewModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Message content to display */
  message: string;
  /** Handler for closing the modal */
  onClose: () => void;
}

/**
 * MessagePreviewModal Component
 *
 * A modal dialog for previewing reminder message content with variable substitutions.
 * Displays the message in a read-only format with a close action.
 *
 * @param {MessagePreviewModalProps} props - Component props
 * @returns {JSX.Element | null} Modal dialog or null if not open
 *
 * @example
 * <MessagePreviewModal
 *   isOpen={showPreview}
 *   message={previewMessage}
 *   onClose={() => setShowPreview(false)}
 * />
 */
const MessagePreviewModal: React.FC<MessagePreviewModalProps> = ({
  isOpen,
  message,
  onClose
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Message Preview</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close preview"
          >
            <X size={20} />
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-800 whitespace-pre-wrap">{message}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md
                     hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2
                     focus:ring-offset-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagePreviewModal;
