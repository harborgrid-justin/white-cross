'use client';

import { Paperclip, X } from 'lucide-react';
import { Attachment } from './MessageCompose.types';
import { formatBytes } from './MessageCompose.utils';

interface AttachmentListProps {
  attachments: Attachment[];
  error?: string;
  onRemoveAttachment: (attachmentId: string) => void;
}

export function AttachmentList({
  attachments,
  error,
  onRemoveAttachment,
}: AttachmentListProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Attachments ({attachments.length})</h4>
      <div className="space-y-2">
        {attachments.map(attachment => (
          <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
            <div className="flex items-center space-x-3">
              <Paperclip className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-900">{attachment.name}</div>
                <div className="text-xs text-gray-500">{formatBytes(attachment.size)}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {attachment.uploadProgress < 100 && (
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-blue-600 h-2 rounded-full transition-all ${
                      attachment.uploadProgress === 100 ? 'w-full' :
                      attachment.uploadProgress >= 75 ? 'w-3/4' :
                      attachment.uploadProgress >= 50 ? 'w-1/2' :
                      attachment.uploadProgress >= 25 ? 'w-1/4' : 'w-1'
                    }`}
                  />
                </div>
              )}
              <button
                onClick={() => onRemoveAttachment(attachment.id)}
                className="text-red-400 hover:text-red-600"
                title={`Remove ${attachment.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
