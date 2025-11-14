'use client';

import { Send, Save } from 'lucide-react';
import { ComposeMessage } from './MessageCompose.types';

interface ComposeActionsProps {
  message: ComposeMessage;
  isSending: boolean;
  isSaving: boolean;
  onSend: () => void;
  onSaveDraft: () => void;
}

export function ComposeActions({
  message,
  isSending,
  isSaving,
  onSend,
  onSaveDraft,
}: ComposeActionsProps) {
  const isDisabled = isSending || !message.recipients.length || !message.subject || !message.content;

  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center space-x-2">
        <button
          onClick={onSend}
          disabled={isDisabled}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {message.scheduledSendTime ? 'Schedule' : 'Send'}
            </>
          )}
        </button>

        <button
          onClick={onSaveDraft}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </>
          )}
        </button>
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-500">
        {message.content && (
          <span>{message.content.length} characters</span>
        )}
        {message.attachments.length > 0 && (
          <span>• {message.attachments.length} attachment{message.attachments.length === 1 ? '' : 's'}</span>
        )}
      </div>
    </div>
  );
}
