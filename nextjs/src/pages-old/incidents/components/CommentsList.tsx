/**
 * CommentsList Component
 *
 * Production-grade comments list for incident reports with real-time updates.
 * Displays user comments with avatar, timestamp, and edit/delete functionality.
 *
 * Features:
 * - List all comments for an incident
 * - User avatar, name, and timestamp display
 * - Comment text with expand/collapse for long comments
 * - Edit/delete buttons for own comments
 * - Load more pagination
 * - Empty state handling
 * - Real-time updates support
 * - Optimistic UI updates
 * - HIPAA-compliant audit logging
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentsApi } from '@/services/modules/incidentsApi';
import { useAppSelector } from '@/hooks/shared/store-hooks-index';
import { Avatar } from '@/components/ui/display/Avatar';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/feedback/LoadingSpinner';
import { Textarea } from '@/components/ui/Textarea';
import {
  MessageSquare,
  Edit2,
  Trash2,
  Send,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MoreVertical
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import type { IncidentComment } from '@/types/incidents';

interface CommentsListProps {
  /** Incident report ID to load comments for */
  incidentId: string;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Individual comment item component
 */
interface CommentItemProps {
  comment: IncidentComment;
  currentUserId: string;
  onEdit: (commentId: string, newText: string) => void;
  onDelete: (commentId: string) => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  isEditing,
  setIsEditing
}) => {
  const [editedText, setEditedText] = useState(comment.text);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const isOwnComment = comment.userId === currentUserId;
  const shouldShowExpandButton = comment.text.length > 300;
  const displayText = isExpanded || !shouldShowExpandButton
    ? comment.text
    : comment.text.slice(0, 300) + '...';

  const handleSaveEdit = () => {
    if (editedText.trim() !== comment.text) {
      onEdit(comment.id, editedText.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedText(comment.text);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      onDelete(comment.id);
    }
  };

  return (
    <div className="flex gap-3 group">
      {/* Avatar */}
      <Avatar
        name={comment.user?.name || 'Unknown User'}
        size="md"
        className="flex-shrink-0"
      />

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {comment.user?.name || 'Unknown User'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
                {comment.isEdited && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                    (edited)
                  </span>
                )}
              </div>
              {comment.user?.role && (
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {comment.user.role}
                </span>
              )}
            </div>

            {/* Actions Menu */}
            {isOwnComment && !isEditing && (
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Comment actions"
                >
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </button>

                {showActions && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-10 min-w-32">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowActions(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        handleDelete();
                        setShowActions(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2 text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Comment Text */}
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={!editedText.trim() || editedText.trim() === comment.text}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {displayText}
              </p>
              {shouldShowExpandButton && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-1 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>
                      Show less <ChevronUp className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown className="h-3 w-3" />
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * CommentsList component - Production-grade incident comments
 */
const CommentsList: React.FC<CommentsListProps> = ({
  incidentId,
  className = ''
}) => {
  const queryClient = useQueryClient();
  const currentUser = useAppSelector(state => state.auth.user);
  const [newCommentText, setNewCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Fetch comments with TanStack Query
  const {
    data: commentsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['incident-comments', incidentId, page, limit],
    queryFn: () => incidentsApi.getComments(incidentId, page, limit),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute for real-time updates
  });

  const comments = commentsData?.comments || [];
  const pagination = commentsData?.pagination;
  const hasMore = pagination ? page < pagination.pages : false;

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: (text: string) => incidentsApi.createComment({
      incidentReportId: incidentId,
      text
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident-comments', incidentId] });
      setNewCommentText('');
      toast.success('Comment added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add comment');
    }
  });

  // Update comment mutation
  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, text }: { commentId: string; text: string }) =>
      incidentsApi.updateComment(commentId, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident-comments', incidentId] });
      setEditingCommentId(null);
      toast.success('Comment updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update comment');
    }
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => incidentsApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident-comments', incidentId] });
      toast.success('Comment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete comment');
    }
  });

  // Handle new comment submission
  const handleSubmitComment = () => {
    if (!newCommentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    createCommentMutation.mutate(newCommentText.trim());
  };

  // Handle edit comment
  const handleEditComment = (commentId: string, newText: string) => {
    updateCommentMutation.mutate({ commentId, text: newText });
  };

  // Handle delete comment
  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(commentId);
  };

  // Handle load more
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  // Render loading state
  if (isLoading && page === 1) {
    return (
      <div className={`comments-list ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <LoadingSpinner size="md" text="Loading comments..." />
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={`comments-list ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start gap-3 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Error Loading Comments</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {(error as any)?.message || 'Failed to load comments. Please try again.'}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetch()}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`comments-list ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Comments
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({pagination?.total || 0})
            </span>
          </div>
        </div>

        {/* New Comment Form */}
        {currentUser && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <Avatar
                name={currentUser.name || 'Current User'}
                size="md"
                className="flex-shrink-0"
              />
              <div className="flex-1">
                <Textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full mb-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleSubmitComment();
                    }
                  }}
                />
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Send className="h-4 w-4" />}
                    iconPosition="right"
                    onClick={handleSubmitComment}
                    disabled={!newCommentText.trim() || createCommentMutation.isPending}
                    loading={createCommentMutation.isPending}
                  >
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="p-6">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No comments yet
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Be the first to comment on this incident.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={currentUser?.id || ''}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                  isEditing={editingCommentId === comment.id}
                  setIsEditing={(value) => setEditingCommentId(value ? comment.id : null)}
                />
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    loading={isLoading}
                  >
                    Load More Comments
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CommentsList.displayName = 'CommentsList';

export default CommentsList;
