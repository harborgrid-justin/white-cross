import React from 'react';
import {
  PaperClipIcon,
  XMarkIcon,
  DocumentIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { AttachmentManagerProps } from './CommunicationComposer.types';
import { formatFileSize } from './CommunicationComposer.utils';

/**
 * AttachmentManager Component
 *
 * Handles file attachments including upload, preview, and removal.
 * Supports file type validation and size restrictions.
 *
 * @param props - The component props
 * @returns The rendered AttachmentManager component
 */
const AttachmentManager: React.FC<AttachmentManagerProps> = ({
  attachments,
  allowedAttachmentTypes,
  maxAttachmentSize,
  onFileSelect,
  onRemoveAttachment
}) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">Attachments</label>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
        >
          <PaperClipIcon className="h-4 w-4" />
          <span>Add Files</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedAttachmentTypes.join(',')}
        onChange={onFileSelect}
        className="hidden"
        aria-label="Select files to attach"
      />

      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center space-x-3 p-2 border border-gray-200 rounded"
            >
              {attachment.preview ? (
                <img
                  src={attachment.preview}
                  alt={attachment.name}
                  className="w-8 h-8 object-cover rounded"
                />
              ) : attachment.type.startsWith('image/') ? (
                <PhotoIcon className="h-8 w-8 text-gray-400" />
              ) : (
                <DocumentIcon className="h-8 w-8 text-gray-400" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
              </div>
              <button
                onClick={() => onRemoveAttachment(attachment.id)}
                className="text-gray-400 hover:text-red-600"
                aria-label={`Remove ${attachment.name}`}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentManager;
