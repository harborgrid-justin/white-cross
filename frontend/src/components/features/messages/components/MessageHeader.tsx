'use client';

import { X, Eye, EyeOff } from 'lucide-react';

interface MessageHeaderProps {
  isDraftMode: boolean;
  replyToId?: string;
  forwardFromId?: string;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  onCancel: () => void;
}

export function MessageHeader({
  isDraftMode,
  replyToId,
  forwardFromId,
  isPreviewMode,
  onTogglePreview,
  onCancel,
}: MessageHeaderProps) {
  const getTitle = () => {
    if (isDraftMode) return 'Edit Draft';
    if (replyToId) return 'Reply';
    if (forwardFromId) return 'Forward';
    return 'Compose Message';
  };

  const getBadgeText = () => {
    if (replyToId) return 'Reply';
    if (forwardFromId) return 'Forward';
    return null;
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <h2 className="text-lg font-semibold text-gray-900">{getTitle()}</h2>
        {(replyToId || forwardFromId) && (
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
            {getBadgeText()}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onTogglePreview}
          className="p-2 text-gray-400 hover:text-gray-600 rounded"
          title={isPreviewMode ? 'Edit mode' : 'Preview mode'}
        >
          {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>

        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 rounded"
          title="Close composer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
