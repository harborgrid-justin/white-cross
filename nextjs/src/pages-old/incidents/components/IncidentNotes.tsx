/**
 * IncidentNotes Component
 *
 * Full notes management interface for incident reports.
 * Displays all notes/comments with CRUD operations and filtering.
 *
 * @module pages/incidents/components/IncidentNotes
 */

import React, { useState, useMemo } from 'react';
import { MessageSquare, Pin, User, Calendar, Edit2, Trash2, Filter } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../../components/ui/buttons/Button';
import { Badge } from '../../../components/ui/display/Badge';
import { EmptyState } from '../../../components/ui/feedback/EmptyState';
import NotesEditor from './NotesEditor';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

/**
 * Individual note/comment
 */
export interface IncidentNote {
  /** Note ID */
  id: string;
  /** Note content (plain text or formatted) */
  content: string;
  /** Author user ID */
  authorId: string;
  /** Author name */
  authorName: string;
  /** Author role/title */
  authorRole?: string;
  /** Created timestamp */
  createdAt: string;
  /** Updated timestamp */
  updatedAt?: string;
  /** Whether note is pinned */
  pinned?: boolean;
  /** Whether current user can edit */
  canEdit?: boolean;
  /** Whether current user can delete */
  canDelete?: boolean;
}

/**
 * Component props
 */
interface IncidentNotesProps {
  /** Incident ID to load notes for */
  incidentId: string;
  /** Optional CSS class name */
  className?: string;
  /** Initial notes data (optional - can fetch from API) */
  notes?: IncidentNote[];
  /** Callback when note is added */
  onAddNote?: (content: string) => Promise<void>;
  /** Callback when note is updated */
  onUpdateNote?: (noteId: string, content: string) => Promise<void>;
  /** Callback when note is deleted */
  onDeleteNote?: (noteId: string) => Promise<void>;
  /** Callback when note is pinned/unpinned */
  onTogglePin?: (noteId: string, pinned: boolean) => Promise<void>;
  /** Loading state */
  loading?: boolean;
  /** Read-only mode */
  readOnly?: boolean;
}

/**
 * IncidentNotes component - Notes section for incident
 *
 * Features:
 * - Display all notes/comments
 * - Add new note with rich text editor
 * - Timestamp and author for each note
 * - Edit/delete own notes
 * - Pin important notes
 * - Filter by author
 * - Responsive design
 * - Empty state handling
 * - Optimistic UI updates
 *
 * @example
 * ```tsx
 * <IncidentNotes
 *   incidentId="incident-123"
 *   onAddNote={async (content) => await createNote(content)}
 *   onUpdateNote={async (id, content) => await updateNote(id, content)}
 *   onDeleteNote={async (id) => await deleteNote(id)}
 * />
 * ```
 */
const IncidentNotes: React.FC<IncidentNotesProps> = ({
  incidentId,
  className = '',
  notes = [],
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onTogglePin,
  loading = false,
  readOnly = false,
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [filterAuthor, setFilterAuthor] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current user from Redux store
  const currentUser = useAppSelector(state => state.auth.user);

  /**
   * Filter and sort notes
   */
  const displayedNotes = useMemo(() => {
    let filtered = notes;

    // Filter by author
    if (filterAuthor) {
      filtered = filtered.filter(note => note.authorId === filterAuthor);
    }

    // Sort: pinned first, then by date (newest first)
    return filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notes, filterAuthor]);

  /**
   * Get unique authors for filter
   */
  const authors = useMemo(() => {
    const authorMap = new Map<string, { id: string; name: string }>();
    notes.forEach(note => {
      if (!authorMap.has(note.authorId)) {
        authorMap.set(note.authorId, {
          id: note.authorId,
          name: note.authorName,
        });
      }
    });
    return Array.from(authorMap.values());
  }, [notes]);

  /**
   * Handle add note
   */
  const handleAddNote = async (content: string) => {
    if (!onAddNote || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddNote(content);
      setShowEditor(false);
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle edit note
   */
  const handleEditNote = async (noteId: string, content: string) => {
    if (!onUpdateNote || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await onUpdateNote(noteId, content);
      setEditingNoteId(null);
      setEditingContent('');
    } catch (error) {
      console.error('Failed to update note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle delete note
   */
  const handleDeleteNote = async (noteId: string) => {
    if (!onDeleteNote) return;

    if (!confirm('Are you sure you want to delete this note?')) return;

    setIsSubmitting(true);
    try {
      await onDeleteNote(noteId);
    } catch (error) {
      console.error('Failed to delete note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle toggle pin
   */
  const handleTogglePin = async (noteId: string, currentPinned: boolean) => {
    if (!onTogglePin) return;

    try {
      await onTogglePin(noteId, !currentPinned);
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  /**
   * Start editing note
   */
  const startEditing = (note: IncidentNote) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
    setShowEditor(false);
  };

  /**
   * Cancel editing
   */
  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditingContent('');
  };

  return (
    <div
      className={cn('incident-notes bg-white rounded-lg border border-gray-200', className)}
      role="region"
      aria-label="Incident notes"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Notes & Comments
            </h3>
            <Badge variant="default" size="sm">
              {notes.length}
            </Badge>
          </div>

          {!readOnly && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowEditor(!showEditor)}
              disabled={isSubmitting}
            >
              {showEditor ? 'Cancel' : 'Add Note'}
            </Button>
          )}
        </div>

        {/* Filters */}
        {authors.length > 1 && (
          <div className="flex items-center gap-2 mt-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterAuthor === null ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterAuthor(null)}
              >
                All ({notes.length})
              </Button>
              {authors.map(author => {
                const count = notes.filter(n => n.authorId === author.id).length;
                return (
                  <Button
                    key={author.id}
                    variant={filterAuthor === author.id ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilterAuthor(author.id)}
                  >
                    {author.name} ({count})
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Note Editor */}
      {showEditor && !readOnly && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <NotesEditor
            value=""
            onChange={() => {}}
            onSave={handleAddNote}
            onCancel={() => setShowEditor(false)}
            placeholder="Add a note or comment..."
            loading={isSubmitting}
          />
        </div>
      )}

      {/* Notes List */}
      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading notes...
          </div>
        ) : displayedNotes.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-12 h-12" />}
            title="No notes yet"
            description={
              filterAuthor
                ? 'No notes from this author'
                : 'Add the first note to this incident'
            }
            action={
              !readOnly && !filterAuthor ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowEditor(true)}
                >
                  Add Note
                </Button>
              ) : undefined
            }
          />
        ) : (
          displayedNotes.map(note => (
            <NoteItem
              key={note.id}
              note={note}
              isEditing={editingNoteId === note.id}
              editingContent={editingContent}
              onStartEdit={() => startEditing(note)}
              onCancelEdit={cancelEditing}
              onSaveEdit={(content) => handleEditNote(note.id, content)}
              onDelete={() => handleDeleteNote(note.id)}
              onTogglePin={() => handleTogglePin(note.id, note.pinned || false)}
              onContentChange={setEditingContent}
              isSubmitting={isSubmitting}
              readOnly={readOnly}
            />
          ))
        )}
      </div>
    </div>
  );
};

/**
 * Individual note item component
 */
interface NoteItemProps {
  note: IncidentNote;
  isEditing: boolean;
  editingContent: string;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: (content: string) => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onContentChange: (content: string) => void;
  isSubmitting: boolean;
  readOnly: boolean;
}

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  isEditing,
  editingContent,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onTogglePin,
  onContentChange,
  isSubmitting,
  readOnly,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={cn('p-4', note.pinned && 'bg-yellow-50')}>
      <div className="flex items-start gap-3">
        {/* Author Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-primary-600" />
        </div>

        {/* Note Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{note.authorName}</span>
                {note.authorRole && (
                  <span className="text-xs text-gray-500">({note.authorRole})</span>
                )}
                {note.pinned && (
                  <Badge variant="warning" size="sm" className="gap-1">
                    <Pin className="w-3 h-3" />
                    Pinned
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(note.createdAt)}</span>
                {note.updatedAt && note.updatedAt !== note.createdAt && (
                  <span className="italic">(edited)</span>
                )}
              </div>
            </div>

            {/* Actions */}
            {!readOnly && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onTogglePin}
                  disabled={isSubmitting}
                  className={cn(note.pinned && 'text-yellow-600')}
                  aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
                >
                  <Pin className="w-4 h-4" />
                </Button>
                {note.canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onStartEdit}
                    disabled={isSubmitting}
                    aria-label="Edit note"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
                {note.canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDelete}
                    disabled={isSubmitting}
                    className="text-red-600 hover:text-red-700"
                    aria-label="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          {isEditing ? (
            <NotesEditor
              value={editingContent}
              onChange={onContentChange}
              onSave={onSaveEdit}
              onCancel={onCancelEdit}
              loading={isSubmitting}
            />
          ) : (
            <div
              className="text-sm text-gray-700 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

IncidentNotes.displayName = 'IncidentNotes';

export default React.memo(IncidentNotes);
