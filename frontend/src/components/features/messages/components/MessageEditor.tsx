'use client';

import { useRef, useImperativeHandle, forwardRef } from 'react';

interface MessageEditorProps {
  content: string;
  isPreviewMode: boolean;
  error?: string;
  onContentChange: (content: string) => void;
}

export interface MessageEditorRef {
  focus: () => void;
  getSelectionRange: () => { start: number; end: number };
  setSelectionRange: (start: number, end: number) => void;
}

export const MessageEditor = forwardRef<MessageEditorRef, MessageEditorProps>(
  ({ content, isPreviewMode, error, onContentChange }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus();
      },
      getSelectionRange: () => {
        const textarea = textareaRef.current;
        if (!textarea) return { start: 0, end: 0 };
        return {
          start: textarea.selectionStart,
          end: textarea.selectionEnd,
        };
      },
      setSelectionRange: (start: number, end: number) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.setSelectionRange(start, end);
      },
    }));

    return (
      <div className="space-y-1">
        {isPreviewMode ? (
          <div className="min-h-64 p-3 border border-gray-300 rounded bg-gray-50">
            <div className="prose prose-sm max-w-none">
              {content ? (
                <pre className="whitespace-pre-wrap font-sans">{content}</pre>
              ) : (
                <p className="text-gray-500 italic">No content</p>
              )}
            </div>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            placeholder="Write your message..."
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className={`w-full min-h-64 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

MessageEditor.displayName = 'MessageEditor';
