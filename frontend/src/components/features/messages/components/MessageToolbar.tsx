'use client';

import { Bold, Italic, List, Quote, Code, Paperclip, ChevronDown } from 'lucide-react';

interface MessageToolbarProps {
  showAdvanced: boolean;
  onInsertText: (before: string, after?: string) => void;
  onAttachmentSelect: () => void;
  onToggleAdvanced: () => void;
}

export function MessageToolbar({
  showAdvanced,
  onInsertText,
  onAttachmentSelect,
  onToggleAdvanced,
}: MessageToolbarProps) {
  return (
    <div className="flex items-center justify-between py-2 border-y border-gray-200">
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onInsertText('**', '**')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          onClick={() => onInsertText('*', '*')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          onClick={() => onInsertText('> ', '')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          onClick={() => onInsertText('`', '`')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="Code"
        >
          <Code className="h-4 w-4" />
        </button>
        <button
          onClick={() => onInsertText('- ', '')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="List"
        >
          <List className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onAttachmentSelect}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="Attach files"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <button
          onClick={onToggleAdvanced}
          className={`p-2 rounded ${showAdvanced ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          title="More options"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
}
