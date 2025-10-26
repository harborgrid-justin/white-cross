/**
 * NotesEditor Component
 *
 * Rich text editor for creating and editing notes.
 * Features simple formatting, character counter, and auto-save.
 *
 * @module pages/incidents/components/NotesEditor
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Save, X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../../components/ui/buttons/Button';
import { Textarea } from '../../../components/ui/inputs/Textarea';

/**
 * Component props
 */
interface NotesEditorProps {
  /** Current note value */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Callback when save is clicked */
  onSave?: (value: string) => void;
  /** Callback when cancel is clicked */
  onCancel?: () => void;
  /** Placeholder text */
  placeholder?: string;
  /** Maximum character length */
  maxLength?: number;
  /** Auto-save interval in milliseconds */
  autoSaveInterval?: number;
  /** Callback for auto-save */
  onAutoSave?: (value: string) => void;
  /** Loading state */
  loading?: boolean;
  /** Minimum rows for textarea */
  minRows?: number;
  /** Optional CSS class name */
  className?: string;
}

/**
 * NotesEditor component - Rich text note editor
 *
 * Features:
 * - Simple rich text (bold, italic, lists)
 * - Character counter
 * - Auto-save draft (optional)
 * - Cancel with confirmation if unsaved changes
 * - Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+Enter to save)
 * - Accessible with ARIA labels
 * - Responsive design
 *
 * Keyboard Shortcuts:
 * - Ctrl/Cmd + B: Bold
 * - Ctrl/Cmd + I: Italic
 * - Ctrl/Cmd + Enter: Save
 * - Escape: Cancel
 *
 * @example
 * ```tsx
 * <NotesEditor
 *   value={noteContent}
 *   onChange={setNoteContent}
 *   onSave={handleSave}
 *   onCancel={handleCancel}
 *   placeholder="Add a note..."
 *   maxLength={5000}
 *   autoSaveInterval={30000}
 * />
 * ```
 */
const NotesEditor: React.FC<NotesEditorProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
  placeholder = 'Enter your note...',
  maxLength = 5000,
  autoSaveInterval,
  onAutoSave,
  loading = false,
  minRows = 4,
  className = '',
}) => {
  const [content, setContent] = useState(value);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();

  /**
   * Update parent when content changes
   */
  useEffect(() => {
    onChange(content);
    setHasUnsavedChanges(content !== value);
  }, [content]);

  /**
   * Auto-save functionality
   */
  useEffect(() => {
    if (!autoSaveInterval || !onAutoSave || !hasUnsavedChanges) return;

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new timer
    autoSaveTimerRef.current = setTimeout(() => {
      onAutoSave(content);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    }, autoSaveInterval);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content, autoSaveInterval, onAutoSave, hasUnsavedChanges]);

  /**
   * Insert formatting at cursor position
   */
  const insertFormatting = useCallback((before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  }, [content]);

  /**
   * Format text with bold
   */
  const handleBold = useCallback(() => {
    insertFormatting('**', '**');
  }, [insertFormatting]);

  /**
   * Format text with italic
   */
  const handleItalic = useCallback(() => {
    insertFormatting('*', '*');
  }, [insertFormatting]);

  /**
   * Insert unordered list
   */
  const handleUnorderedList = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = content.substring(0, start).split('\n');
    const currentLine = lines[lines.length - 1];

    if (currentLine.trim() === '') {
      insertFormatting('- ', '');
    } else {
      insertFormatting('\n- ', '');
    }
  }, [content, insertFormatting]);

  /**
   * Insert ordered list
   */
  const handleOrderedList = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = content.substring(0, start).split('\n');
    const currentLine = lines[lines.length - 1];

    if (currentLine.trim() === '') {
      insertFormatting('1. ', '');
    } else {
      insertFormatting('\n1. ', '');
    }
  }, [content, insertFormatting]);

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

    // Ctrl/Cmd + B: Bold
    if (cmdOrCtrl && e.key === 'b') {
      e.preventDefault();
      handleBold();
    }

    // Ctrl/Cmd + I: Italic
    if (cmdOrCtrl && e.key === 'i') {
      e.preventDefault();
      handleItalic();
    }

    // Ctrl/Cmd + Enter: Save
    if (cmdOrCtrl && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }

    // Escape: Cancel
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  }, [handleBold, handleItalic]);

  /**
   * Handle save
   */
  const handleSave = useCallback(() => {
    if (!onSave || !content.trim()) return;

    onSave(content);
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
  }, [content, onSave]);

  /**
   * Handle cancel
   */
  const handleCancel = useCallback(() => {
    if (!onCancel) return;

    if (hasUnsavedChanges) {
      const confirmed = confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmed) return;
    }

    onCancel();
  }, [hasUnsavedChanges, onCancel]);

  /**
   * Character count information
   */
  const charactersUsed = content.length;
  const charactersRemaining = maxLength - charactersUsed;
  const isNearLimit = charactersRemaining < maxLength * 0.1;
  const isOverLimit = charactersUsed > maxLength;

  return (
    <div className={cn('notes-editor', className)} role="region" aria-label="Note editor">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBold}
            disabled={loading}
            title="Bold (Ctrl+B)"
            aria-label="Bold"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleItalic}
            disabled={loading}
            title="Italic (Ctrl+I)"
            aria-label="Italic"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleUnorderedList}
            disabled={loading}
            title="Bulleted List"
            aria-label="Bulleted List"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleOrderedList}
            disabled={loading}
            title="Numbered List"
            aria-label="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
        </div>

        {/* Auto-save status */}
        {autoSaveInterval && onAutoSave && (
          <div className="text-xs text-gray-500">
            {hasUnsavedChanges ? (
              <span>Unsaved changes...</span>
            ) : lastSaved ? (
              <span>Auto-saved {formatTimeSince(lastSaved)}</span>
            ) : null}
          </div>
        )}
      </div>

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={loading}
        rows={minRows}
        className={cn(
          'w-full font-mono text-sm',
          isOverLimit && 'border-red-500 focus:border-red-500 focus:ring-red-500'
        )}
        aria-label="Note content"
        aria-describedby="character-count"
      />

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
        {/* Character Counter */}
        <div
          id="character-count"
          className={cn(
            'text-xs',
            isOverLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-gray-500'
          )}
        >
          {charactersUsed.toLocaleString()} / {maxLength.toLocaleString()} characters
          {isOverLimit && <span className="ml-1 font-medium">(over limit)</span>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={loading}
              className="gap-1"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          )}
          {onSave && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={loading || !content.trim() || isOverLimit}
              className="gap-1"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save'}
            </Button>
          )}
        </div>
      </div>

      {/* Keyboard shortcuts help */}
      <div className="text-xs text-gray-500 mt-2">
        <span className="font-medium">Shortcuts:</span>{' '}
        <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+B</kbd> Bold,{' '}
        <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+I</kbd> Italic,{' '}
        <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+Enter</kbd> Save,{' '}
        <kbd className="px-1 py-0.5 bg-gray-100 rounded">Esc</kbd> Cancel
      </div>
    </div>
  );
};

/**
 * Format time since last save
 */
function formatTimeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return date.toLocaleDateString();
}

NotesEditor.displayName = 'NotesEditor';

export default React.memo(NotesEditor);
