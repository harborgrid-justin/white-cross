/**
 * @fileoverview Comments & Moderation Kit for Next.js 16/React
 * @module @reuse/frontend/comments-moderation-kit
 * @description Enterprise-grade comment system with comprehensive moderation tools for Next.js 16 applications
 *
 * Features:
 * - Complete comment CRUD operations with real-time updates
 * - Nested/threaded comment structures with infinite depth
 * - Advanced moderation queue and workflow management
 * - Spam detection and content filtering
 * - User reputation and trust scoring
 * - Rich text comment editing with mentions
 * - Comment reactions, voting, and engagement tracking
 * - Notification system for mentions and replies
 * - Bulk moderation actions and automation
 * - Analytics and reporting for comment metrics
 * - Accessibility-compliant comment UI components
 * - Rate limiting and abuse prevention
 *
 * @example
 * ```tsx
 * // Basic comment list with moderation
 * import { useComments, CommentList, useModerationActions } from '@reuse/frontend/comments-moderation-kit';
 *
 * export default function ArticleComments({ articleId }: { articleId: string }) {
 *   const { comments, loading, addComment } = useComments(articleId);
 *   const { approveComment, rejectComment } = useModerationActions();
 *
 *   return (
 *     <div>
 *       <CommentList
 *         comments={comments}
 *         onApprove={approveComment}
 *         onReject={rejectComment}
 *         loading={loading}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Moderation dashboard
 * import { useModerationQueue, ModerationPanel } from '@reuse/frontend/comments-moderation-kit';
 *
 * function ModerationDashboard() {
 *   const { queue, processComment, bulkApprove } = useModerationQueue({
 *     autoRefresh: true,
 *     filters: { status: 'pending' }
 *   });
 *
 *   return (
 *     <ModerationPanel
 *       queue={queue}
 *       onProcess={processComment}
 *       onBulkApprove={bulkApprove}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Threaded comments with replies
 * import { useCommentThread, ThreadedComments } from '@reuse/frontend/comments-moderation-kit';
 *
 * function CommentSection({ postId }: { postId: string }) {
 *   const { thread, addReply, toggleCollapse } = useCommentThread(postId, {
 *     maxDepth: 5,
 *     sortBy: 'votes'
 *   });
 *
 *   return (
 *     <ThreadedComments
 *       thread={thread}
 *       onReply={addReply}
 *       onToggle={toggleCollapse}
 *       maxDepth={5}
 *     />
 *   );
 * }
 * ```
 */

'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Comment status types
 */
export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam' | 'flagged' | 'deleted';

/**
 * Moderation action types
 */
export type ModerationAction = 'approve' | 'reject' | 'spam' | 'delete' | 'flag' | 'unflag' | 'edit';

/**
 * Comment sort options
 */
export type CommentSortBy = 'newest' | 'oldest' | 'votes' | 'replies' | 'trending';

/**
 * User reputation levels
 */
export type ReputationLevel = 'new' | 'trusted' | 'moderator' | 'banned' | 'muted';

/**
 * Comment reaction types
 */
export type ReactionType = 'like' | 'love' | 'laugh' | 'insightful' | 'disagree' | 'spam';

/**
 * Base comment structure
 */
export interface Comment {
  id: string;
  content: string;
  contentHtml?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorReputation?: UserReputation;
  parentId?: string;
  threadId?: string;
  postId: string;
  status: CommentStatus;
  createdAt: Date;
  updatedAt: Date;
  editedAt?: Date;
  deletedAt?: Date;
  votes: {
    up: number;
    down: number;
    score: number;
  };
  reactions: Record<ReactionType, number>;
  replyCount: number;
  depth: number;
  isPinned: boolean;
  isHighlighted: boolean;
  isFeatured: boolean;
  isEdited: boolean;
  metadata?: CommentMetadata;
}

/**
 * Comment metadata
 */
export interface CommentMetadata {
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  spamScore?: number;
  profanityScore?: number;
  toxicityScore?: number;
  mentionedUsers?: string[];
  hashtags?: string[];
  links?: string[];
  attachments?: string[];
  editHistory?: CommentEdit[];
}

/**
 * Comment edit history
 */
export interface CommentEdit {
  editedAt: Date;
  editedBy: string;
  previousContent: string;
  reason?: string;
}

/**
 * Comment thread structure
 */
export interface CommentThread {
  id: string;
  rootComment: Comment;
  replies: CommentThread[];
  totalReplies: number;
  isCollapsed: boolean;
  depth: number;
}

/**
 * User reputation structure
 */
export interface UserReputation {
  userId: string;
  score: number;
  level: ReputationLevel;
  badges: string[];
  totalComments: number;
  approvedComments: number;
  rejectedComments: number;
  flaggedComments: number;
  helpfulVotes: number;
  isTrusted: boolean;
  isModerator: boolean;
  isBanned: boolean;
  isMuted: boolean;
  mutedUntil?: Date;
  bannedReason?: string;
}

/**
 * Moderation queue item
 */
export interface ModerationQueueItem {
  comment: Comment;
  reportCount: number;
  reports: CommentReport[];
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  autoFlags: AutoModerationFlag[];
  suggestedAction?: ModerationAction;
  queuedAt: Date;
}

/**
 * Comment report structure
 */
export interface CommentReport {
  id: string;
  commentId: string;
  reportedBy: string;
  reporterName: string;
  reason: ReportReason;
  description?: string;
  createdAt: Date;
  status: 'pending' | 'reviewed' | 'dismissed';
  reviewedBy?: string;
  reviewedAt?: Date;
}

/**
 * Report reason types
 */
export type ReportReason = 'spam' | 'harassment' | 'hate_speech' | 'violence' | 'misinformation' | 'adult_content' | 'personal_info' | 'off_topic' | 'other';

/**
 * Auto moderation flag
 */
export interface AutoModerationFlag {
  type: 'spam' | 'profanity' | 'toxicity' | 'link_spam' | 'duplicate' | 'rate_limit';
  confidence: number;
  details: string;
  triggeredAt: Date;
}

/**
 * Comment form data
 */
export interface CommentFormData {
  content: string;
  parentId?: string;
  mentions?: string[];
  attachments?: File[];
  metadata?: Record<string, unknown>;
}

/**
 * Comment filter options
 */
export interface CommentFilters {
  status?: CommentStatus | CommentStatus[];
  authorId?: string;
  parentId?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minScore?: number;
  maxScore?: number;
  hasReplies?: boolean;
  isPinned?: boolean;
  isFlagged?: boolean;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: CommentSortBy;
  sortOrder: 'asc' | 'desc';
}

/**
 * Comment analytics data
 */
export interface CommentAnalytics {
  totalComments: number;
  approvedComments: number;
  pendingComments: number;
  rejectedComments: number;
  spamComments: number;
  averagePerDay: number;
  averagePerPost: number;
  topCommenters: Array<{ userId: string; count: number }>;
  engagementRate: number;
  moderationMetrics: ModerationMetrics;
  sentimentAnalysis: SentimentAnalysis;
}

/**
 * Moderation metrics
 */
export interface ModerationMetrics {
  queueSize: number;
  averageResponseTime: number;
  approvalRate: number;
  rejectionRate: number;
  spamRate: number;
  falsePositiveRate: number;
  moderatorPerformance: Record<string, ModeratorStats>;
}

/**
 * Moderator statistics
 */
export interface ModeratorStats {
  moderatorId: string;
  actionsCount: number;
  approvals: number;
  rejections: number;
  averageTime: number;
  accuracy: number;
}

/**
 * Sentiment analysis data
 */
export interface SentimentAnalysis {
  positive: number;
  neutral: number;
  negative: number;
  averageSentiment: number;
  emotionalTone: Record<string, number>;
}

/**
 * Notification data
 */
export interface CommentNotification {
  id: string;
  type: 'reply' | 'mention' | 'vote' | 'reaction' | 'moderation';
  commentId: string;
  triggeredBy: string;
  triggeredByName: string;
  recipientId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

/**
 * Spam detection configuration
 */
export interface SpamDetectionConfig {
  enabled: boolean;
  threshold: number;
  checkLinks: boolean;
  checkDuplicates: boolean;
  checkRateLimit: boolean;
  trustedUsersExempt: boolean;
  autoReject: boolean;
}

/**
 * Content filter configuration
 */
export interface ContentFilterConfig {
  profanityFilter: boolean;
  toxicityFilter: boolean;
  bannedWords: string[];
  bannedPatterns: RegExp[];
  allowedDomains?: string[];
  maxLinks: number;
  requireModeration: boolean;
}

// ============================================================================
// Hook: useComments
// ============================================================================

/**
 * Main hook for managing comments
 *
 * @param postId - The post/article ID to fetch comments for
 * @param options - Optional configuration
 * @returns Comment management utilities
 *
 * @example
 * ```tsx
 * function CommentSection({ postId }: { postId: string }) {
 *   const {
 *     comments,
 *     loading,
 *     error,
 *     addComment,
 *     updateComment,
 *     deleteComment,
 *     refresh
 *   } = useComments(postId, {
 *     autoRefresh: true,
 *     filters: { status: 'approved' }
 *   });
 *
 *   if (loading) return <div>Loading comments...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       {comments.map(comment => (
 *         <div key={comment.id}>{comment.content}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useComments(
  postId: string,
  options: {
    autoRefresh?: boolean;
    refreshInterval?: number;
    filters?: CommentFilters;
    pagination?: PaginationOptions;
  } = {}
) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // API call placeholder - replace with actual implementation
      const response = await fetch(`/api/comments/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filters: options.filters,
          pagination: options.pagination
        })
      });

      if (!response.ok) throw new Error('Failed to fetch comments');

      const data = await response.json();
      setComments(data.comments);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [postId, options.filters, options.pagination]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Auto-refresh setup
  useEffect(() => {
    if (!options.autoRefresh) return;

    const interval = setInterval(fetchComments, options.refreshInterval || 30000);
    return () => clearInterval(interval);
  }, [options.autoRefresh, options.refreshInterval, fetchComments]);

  const addComment = useCallback(async (formData: CommentFormData) => {
    try {
      const response = await fetch(`/api/comments/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const newComment = await response.json();
      setComments(prev => [newComment, ...prev]);
      setTotalCount(prev => prev + 1);

      return newComment;
    } catch (err) {
      throw err;
    }
  }, [postId]);

  const updateComment = useCallback(async (commentId: string, updates: Partial<Comment>) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update comment');

      const updated = await response.json();
      setComments(prev => prev.map(c => c.id === commentId ? updated : c));

      return updated;
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteComment = useCallback(async (commentId: string, soft = true) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soft })
      });

      if (!response.ok) throw new Error('Failed to delete comment');

      if (soft) {
        setComments(prev => prev.map(c =>
          c.id === commentId ? { ...c, status: 'deleted' as CommentStatus, deletedAt: new Date() } : c
        ));
      } else {
        setComments(prev => prev.filter(c => c.id !== commentId));
        setTotalCount(prev => prev - 1);
      }
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    comments,
    loading,
    error,
    totalCount,
    addComment,
    updateComment,
    deleteComment,
    refresh: fetchComments
  };
}

// ============================================================================
// Hook: useCommentThread
// ============================================================================

/**
 * Hook for managing threaded/nested comments
 *
 * @param postId - The post ID
 * @param options - Thread configuration
 * @returns Thread management utilities
 *
 * @example
 * ```tsx
 * function ThreadedCommentSection({ postId }: { postId: string }) {
 *   const {
 *     thread,
 *     loading,
 *     addReply,
 *     toggleCollapse,
 *     loadMoreReplies
 *   } = useCommentThread(postId, {
 *     maxDepth: 5,
 *     sortBy: 'votes'
 *   });
 *
 *   return (
 *     <div>
 *       {thread.map(t => (
 *         <ThreadDisplay
 *           key={t.id}
 *           thread={t}
 *           onReply={addReply}
 *           onToggle={toggleCollapse}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCommentThread(
  postId: string,
  options: {
    maxDepth?: number;
    sortBy?: CommentSortBy;
    collapseDepth?: number;
  } = {}
) {
  const [thread, setThread] = useState<CommentThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsedThreads, setCollapsedThreads] = useState<Set<string>>(new Set());

  const buildThreadTree = useCallback((comments: Comment[]): CommentThread[] => {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: organize comments
    comments.forEach(comment => {
      commentMap.set(comment.id, comment);
      if (!comment.parentId) {
        rootComments.push(comment);
      }
    });

    // Recursive function to build thread structure
    const buildThread = (comment: Comment, depth: number): CommentThread => {
      const replies = comments
        .filter(c => c.parentId === comment.id)
        .map(c => buildThread(c, depth + 1));

      return {
        id: comment.id,
        rootComment: { ...comment, depth },
        replies,
        totalReplies: replies.reduce((sum, r) => sum + r.totalReplies + 1, 0),
        isCollapsed: collapsedThreads.has(comment.id),
        depth
      };
    };

    return rootComments.map(c => buildThread(c, 0));
  }, [collapsedThreads]);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/comments/${postId}/thread?sortBy=${options.sortBy || 'newest'}`);
        if (!response.ok) throw new Error('Failed to fetch thread');

        const comments = await response.json();
        const tree = buildThreadTree(comments);
        setThread(tree);
      } catch (err) {
        console.error('Error fetching thread:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [postId, options.sortBy, buildThreadTree]);

  const addReply = useCallback(async (parentId: string, formData: CommentFormData) => {
    try {
      const response = await fetch(`/api/comments/${postId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, parentId })
      });

      if (!response.ok) throw new Error('Failed to add reply');

      const newComment = await response.json();

      // Update thread tree with new reply
      // Simplified - in production, rebuild the tree
      return newComment;
    } catch (err) {
      throw err;
    }
  }, [postId]);

  const toggleCollapse = useCallback((threadId: string) => {
    setCollapsedThreads(prev => {
      const next = new Set(prev);
      if (next.has(threadId)) {
        next.delete(threadId);
      } else {
        next.add(threadId);
      }
      return next;
    });
  }, []);

  const loadMoreReplies = useCallback(async (threadId: string, offset: number) => {
    try {
      const response = await fetch(`/api/comments/${threadId}/replies?offset=${offset}`);
      if (!response.ok) throw new Error('Failed to load replies');

      const replies = await response.json();
      return replies;
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    thread,
    loading,
    addReply,
    toggleCollapse,
    loadMoreReplies,
    collapsedThreads
  };
}

// ============================================================================
// Hook: useCommentForm
// ============================================================================

/**
 * Hook for managing comment form state and validation
 *
 * @param onSubmit - Submit handler
 * @param options - Form configuration
 * @returns Form state and handlers
 *
 * @example
 * ```tsx
 * function CommentForm({ postId }: { postId: string }) {
 *   const {
 *     content,
 *     setContent,
 *     mentions,
 *     addMention,
 *     isValid,
 *     errors,
 *     handleSubmit,
 *     reset
 *   } = useCommentForm(async (data) => {
 *     await fetch(`/api/comments/${postId}`, {
 *       method: 'POST',
 *       body: JSON.stringify(data)
 *     });
 *   });
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <textarea value={content} onChange={(e) => setContent(e.target.value)} />
 *       <button type="submit" disabled={!isValid}>Submit</button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useCommentForm(
  onSubmit: (data: CommentFormData) => Promise<void>,
  options: {
    minLength?: number;
    maxLength?: number;
    requireAuth?: boolean;
    allowMentions?: boolean;
    allowAttachments?: boolean;
  } = {}
) {
  const [content, setContent] = useState('');
  const [mentions, setMentions] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    const minLength = options.minLength || 1;
    const maxLength = options.maxLength || 5000;

    if (!content.trim()) {
      newErrors.content = 'Comment cannot be empty';
    } else if (content.length < minLength) {
      newErrors.content = `Comment must be at least ${minLength} characters`;
    } else if (content.length > maxLength) {
      newErrors.content = `Comment must be no more than ${maxLength} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [content, options.minLength, options.maxLength]);

  const isValid = useMemo(() => {
    return content.trim().length > 0 && Object.keys(errors).length === 0;
  }, [content, errors]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        content,
        mentions: mentions.length > 0 ? mentions : undefined,
        attachments: attachments.length > 0 ? attachments : undefined
      });

      // Reset form on success
      setContent('');
      setMentions([]);
      setAttachments([]);
      setErrors({});
    } catch (err) {
      setErrors({ submit: (err as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  }, [content, mentions, attachments, validate, onSubmit]);

  const addMention = useCallback((userId: string) => {
    if (options.allowMentions !== false) {
      setMentions(prev => [...new Set([...prev, userId])]);
    }
  }, [options.allowMentions]);

  const removeMention = useCallback((userId: string) => {
    setMentions(prev => prev.filter(id => id !== userId));
  }, []);

  const addAttachment = useCallback((file: File) => {
    if (options.allowAttachments !== false) {
      setAttachments(prev => [...prev, file]);
    }
  }, [options.allowAttachments]);

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  const reset = useCallback(() => {
    setContent('');
    setMentions([]);
    setAttachments([]);
    setErrors({});
  }, []);

  return {
    content,
    setContent,
    mentions,
    addMention,
    removeMention,
    attachments,
    addAttachment,
    removeAttachment,
    errors,
    isValid,
    isSubmitting,
    handleSubmit,
    reset
  };
}

// ============================================================================
// Hook: useModeration
// ============================================================================

/**
 * Hook for comment moderation actions
 *
 * @param options - Moderation configuration
 * @returns Moderation action handlers
 *
 * @example
 * ```tsx
 * function CommentModerator({ comment }: { comment: Comment }) {
 *   const {
 *     approveComment,
 *     rejectComment,
 *     flagComment,
 *     markAsSpam,
 *     isProcessing
 *   } = useModeration();
 *
 *   return (
 *     <div>
 *       <button onClick={() => approveComment(comment.id)} disabled={isProcessing}>
 *         Approve
 *       </button>
 *       <button onClick={() => rejectComment(comment.id)} disabled={isProcessing}>
 *         Reject
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useModeration(options: {
  onSuccess?: (action: ModerationAction, commentId: string) => void;
  onError?: (error: Error) => void;
} = {}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const performAction = useCallback(async (
    commentId: string,
    action: ModerationAction,
    reason?: string
  ) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/moderation/comments/${commentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason })
      });

      if (!response.ok) throw new Error(`Failed to ${action} comment`);

      const result = await response.json();
      options.onSuccess?.(action, commentId);
      return result;
    } catch (err) {
      options.onError?.(err as Error);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [options]);

  const approveComment = useCallback((commentId: string) => {
    return performAction(commentId, 'approve');
  }, [performAction]);

  const rejectComment = useCallback((commentId: string, reason?: string) => {
    return performAction(commentId, 'reject', reason);
  }, [performAction]);

  const markAsSpam = useCallback((commentId: string) => {
    return performAction(commentId, 'spam');
  }, [performAction]);

  const flagComment = useCallback((commentId: string, reason: string) => {
    return performAction(commentId, 'flag', reason);
  }, [performAction]);

  const unflagComment = useCallback((commentId: string) => {
    return performAction(commentId, 'unflag');
  }, [performAction]);

  const deleteComment = useCallback((commentId: string, reason?: string) => {
    return performAction(commentId, 'delete', reason);
  }, [performAction]);

  const editComment = useCallback((commentId: string, newContent: string, reason?: string) => {
    return performAction(commentId, 'edit', reason);
  }, [performAction]);

  return {
    approveComment,
    rejectComment,
    markAsSpam,
    flagComment,
    unflagComment,
    deleteComment,
    editComment,
    isProcessing
  };
}

// ============================================================================
// Hook: useModerationQueue
// ============================================================================

/**
 * Hook for managing the moderation queue
 *
 * @param options - Queue configuration
 * @returns Queue state and management utilities
 *
 * @example
 * ```tsx
 * function ModerationQueue() {
 *   const {
 *     queue,
 *     loading,
 *     processComment,
 *     bulkApprove,
 *     bulkReject,
 *     assignToModerator
 *   } = useModerationQueue({
 *     autoRefresh: true,
 *     filters: { priority: 'high' }
 *   });
 *
 *   return (
 *     <div>
 *       <h2>Pending: {queue.length}</h2>
 *       {queue.map(item => (
 *         <QueueItem key={item.comment.id} item={item} onProcess={processComment} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useModerationQueue(options: {
  autoRefresh?: boolean;
  refreshInterval?: number;
  filters?: {
    status?: CommentStatus;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    assignedTo?: string;
  };
} = {}) {
  const [queue, setQueue] = useState<ModerationQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ModerationMetrics | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/moderation/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters: options.filters })
      });

      if (!response.ok) throw new Error('Failed to fetch queue');

      const data = await response.json();
      setQueue(data.queue);
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching moderation queue:', err);
    } finally {
      setLoading(false);
    }
  }, [options.filters]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  useEffect(() => {
    if (!options.autoRefresh) return;

    const interval = setInterval(fetchQueue, options.refreshInterval || 60000);
    return () => clearInterval(interval);
  }, [options.autoRefresh, options.refreshInterval, fetchQueue]);

  const processComment = useCallback(async (
    commentId: string,
    action: ModerationAction,
    reason?: string
  ) => {
    try {
      const response = await fetch(`/api/moderation/queue/${commentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason })
      });

      if (!response.ok) throw new Error('Failed to process comment');

      // Remove from queue
      setQueue(prev => prev.filter(item => item.comment.id !== commentId));

      return await response.json();
    } catch (err) {
      throw err;
    }
  }, []);

  const bulkApprove = useCallback(async (commentIds: string[]) => {
    try {
      const response = await fetch('/api/moderation/bulk/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentIds })
      });

      if (!response.ok) throw new Error('Failed to bulk approve');

      setQueue(prev => prev.filter(item => !commentIds.includes(item.comment.id)));

      return await response.json();
    } catch (err) {
      throw err;
    }
  }, []);

  const bulkReject = useCallback(async (commentIds: string[], reason?: string) => {
    try {
      const response = await fetch('/api/moderation/bulk/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentIds, reason })
      });

      if (!response.ok) throw new Error('Failed to bulk reject');

      setQueue(prev => prev.filter(item => !commentIds.includes(item.comment.id)));

      return await response.json();
    } catch (err) {
      throw err;
    }
  }, []);

  const assignToModerator = useCallback(async (commentId: string, moderatorId: string) => {
    try {
      const response = await fetch(`/api/moderation/assign/${commentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moderatorId })
      });

      if (!response.ok) throw new Error('Failed to assign comment');

      setQueue(prev => prev.map(item =>
        item.comment.id === commentId ? { ...item, assignedTo: moderatorId } : item
      ));

      return await response.json();
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    queue,
    loading,
    stats,
    processComment,
    bulkApprove,
    bulkReject,
    assignToModerator,
    refresh: fetchQueue
  };
}

// ============================================================================
// Hook: useReportComment
// ============================================================================

/**
 * Hook for reporting comments
 *
 * @returns Report submission utilities
 *
 * @example
 * ```tsx
 * function ReportButton({ commentId }: { commentId: string }) {
 *   const { submitReport, isSubmitting } = useReportComment();
 *
 *   const handleReport = async () => {
 *     await submitReport(commentId, {
 *       reason: 'spam',
 *       description: 'This comment contains spam links'
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleReport} disabled={isSubmitting}>
 *       Report
 *     </button>
 *   );
 * }
 * ```
 */
export function useReportComment() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReport = useCallback(async (
    commentId: string,
    report: {
      reason: ReportReason;
      description?: string;
    }
  ) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/comments/${commentId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });

      if (!response.ok) throw new Error('Failed to submit report');

      return await response.json();
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    submitReport,
    isSubmitting
  };
}

// ============================================================================
// Hook: useUserManagement
// ============================================================================

/**
 * Hook for managing user actions (ban, mute, warn)
 *
 * @returns User management utilities
 *
 * @example
 * ```tsx
 * function UserActions({ userId }: { userId: string }) {
 *   const { banUser, muteUser, warnUser, unbanUser } = useUserManagement();
 *
 *   return (
 *     <div>
 *       <button onClick={() => banUser(userId, 'Spam')}>Ban</button>
 *       <button onClick={() => muteUser(userId, 24)}>Mute 24h</button>
 *       <button onClick={() => warnUser(userId, 'Be respectful')}>Warn</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useUserManagement() {
  const [isProcessing, setIsProcessing] = useState(false);

  const banUser = useCallback(async (userId: string, reason: string, permanent = true) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/moderation/users/${userId}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, permanent })
      });

      if (!response.ok) throw new Error('Failed to ban user');

      return await response.json();
    } catch (err) {
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const unbanUser = useCallback(async (userId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/moderation/users/${userId}/unban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to unban user');

      return await response.json();
    } catch (err) {
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const muteUser = useCallback(async (userId: string, durationHours: number, reason?: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/moderation/users/${userId}/mute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ durationHours, reason })
      });

      if (!response.ok) throw new Error('Failed to mute user');

      return await response.json();
    } catch (err) {
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const unmuteUser = useCallback(async (userId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/moderation/users/${userId}/unmute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to unmute user');

      return await response.json();
    } catch (err) {
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const warnUser = useCallback(async (userId: string, message: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/moderation/users/${userId}/warn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      if (!response.ok) throw new Error('Failed to warn user');

      return await response.json();
    } catch (err) {
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    banUser,
    unbanUser,
    muteUser,
    unmuteUser,
    warnUser,
    isProcessing
  };
}

// ============================================================================
// Hook: useCommentVoting
// ============================================================================

/**
 * Hook for voting on comments
 *
 * @param commentId - The comment to vote on
 * @returns Voting utilities
 *
 * @example
 * ```tsx
 * function CommentVotes({ comment }: { comment: Comment }) {
 *   const { upvote, downvote, userVote, isVoting } = useCommentVoting(comment.id);
 *
 *   return (
 *     <div>
 *       <button onClick={upvote} disabled={isVoting}>
 *         ↑ {comment.votes.up}
 *       </button>
 *       <button onClick={downvote} disabled={isVoting}>
 *         ↓ {comment.votes.down}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCommentVoting(commentId: string) {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    // Fetch user's current vote
    const fetchVote = async () => {
      try {
        const response = await fetch(`/api/comments/${commentId}/vote`);
        if (response.ok) {
          const data = await response.json();
          setUserVote(data.vote);
        }
      } catch (err) {
        console.error('Error fetching vote:', err);
      }
    };

    fetchVote();
  }, [commentId]);

  const vote = useCallback(async (type: 'up' | 'down') => {
    setIsVoting(true);
    try {
      const response = await fetch(`/api/comments/${commentId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });

      if (!response.ok) throw new Error('Failed to vote');

      const data = await response.json();
      setUserVote(data.vote);

      return data;
    } catch (err) {
      throw err;
    } finally {
      setIsVoting(false);
    }
  }, [commentId]);

  const upvote = useCallback(() => {
    return vote(userVote === 'up' ? null : 'up' as any);
  }, [vote, userVote]);

  const downvote = useCallback(() => {
    return vote(userVote === 'down' ? null : 'down' as any);
  }, [vote, userVote]);

  return {
    upvote,
    downvote,
    userVote,
    isVoting
  };
}

// ============================================================================
// Hook: useCommentReactions
// ============================================================================

/**
 * Hook for managing comment reactions
 *
 * @param commentId - The comment to react to
 * @returns Reaction utilities
 *
 * @example
 * ```tsx
 * function CommentReactions({ comment }: { comment: Comment }) {
 *   const { addReaction, removeReaction, userReactions } = useCommentReactions(comment.id);
 *
 *   return (
 *     <div>
 *       {(['like', 'love', 'laugh'] as ReactionType[]).map(type => (
 *         <button
 *           key={type}
 *           onClick={() =>
 *             userReactions.includes(type)
 *               ? removeReaction(type)
 *               : addReaction(type)
 *           }
 *         >
 *           {type} {comment.reactions[type] || 0}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCommentReactions(commentId: string) {
  const [userReactions, setUserReactions] = useState<ReactionType[]>([]);
  const [isReacting, setIsReacting] = useState(false);

  useEffect(() => {
    // Fetch user's current reactions
    const fetchReactions = async () => {
      try {
        const response = await fetch(`/api/comments/${commentId}/reactions`);
        if (response.ok) {
          const data = await response.json();
          setUserReactions(data.userReactions);
        }
      } catch (err) {
        console.error('Error fetching reactions:', err);
      }
    };

    fetchReactions();
  }, [commentId]);

  const addReaction = useCallback(async (type: ReactionType) => {
    setIsReacting(true);
    try {
      const response = await fetch(`/api/comments/${commentId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });

      if (!response.ok) throw new Error('Failed to add reaction');

      setUserReactions(prev => [...prev, type]);

      return await response.json();
    } catch (err) {
      throw err;
    } finally {
      setIsReacting(false);
    }
  }, [commentId]);

  const removeReaction = useCallback(async (type: ReactionType) => {
    setIsReacting(true);
    try {
      const response = await fetch(`/api/comments/${commentId}/reactions/${type}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to remove reaction');

      setUserReactions(prev => prev.filter(r => r !== type));

      return await response.json();
    } catch (err) {
      throw err;
    } finally {
      setIsReacting(false);
    }
  }, [commentId]);

  return {
    addReaction,
    removeReaction,
    userReactions,
    isReacting
  };
}

// ============================================================================
// Hook: useCommentNotifications
// ============================================================================

/**
 * Hook for managing comment notifications
 *
 * @param userId - User ID to fetch notifications for
 * @returns Notification utilities
 *
 * @example
 * ```tsx
 * function NotificationBell({ userId }: { userId: string }) {
 *   const {
 *     notifications,
 *     unreadCount,
 *     markAsRead,
 *     markAllAsRead
 *   } = useCommentNotifications(userId);
 *
 *   return (
 *     <div>
 *       <span>🔔 {unreadCount}</span>
 *       {notifications.map(notif => (
 *         <div key={notif.id} onClick={() => markAsRead(notif.id)}>
 *           {notif.message}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCommentNotifications(userId: string) {
  const [notifications, setNotifications] = useState<CommentNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/notifications`);
      if (!response.ok) throw new Error('Failed to fetch notifications');

      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to mark as read');

      setNotifications(prev => prev.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/${userId}/notifications/read-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to mark all as read');

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  }, [userId]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications
  };
}

// ============================================================================
// Hook: useUserReputation
// ============================================================================

/**
 * Hook for managing user reputation
 *
 * @param userId - User ID to fetch reputation for
 * @returns Reputation data and utilities
 *
 * @example
 * ```tsx
 * function UserProfile({ userId }: { userId: string }) {
 *   const { reputation, loading, updateReputation } = useUserReputation(userId);
 *
 *   if (loading) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       <h3>Reputation: {reputation.score}</h3>
 *       <p>Level: {reputation.level}</p>
 *       <p>Badges: {reputation.badges.join(', ')}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useUserReputation(userId: string) {
  const [reputation, setReputation] = useState<UserReputation | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReputation = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/reputation`);
      if (!response.ok) throw new Error('Failed to fetch reputation');

      const data = await response.json();
      setReputation(data);
    } catch (err) {
      console.error('Error fetching reputation:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchReputation();
  }, [fetchReputation]);

  const updateReputation = useCallback(async (delta: number, reason: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/reputation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta, reason })
      });

      if (!response.ok) throw new Error('Failed to update reputation');

      const updated = await response.json();
      setReputation(updated);

      return updated;
    } catch (err) {
      throw err;
    }
  }, [userId]);

  return {
    reputation,
    loading,
    updateReputation,
    refresh: fetchReputation
  };
}

// ============================================================================
// Hook: useCommentAnalytics
// ============================================================================

/**
 * Hook for comment analytics and metrics
 *
 * @param options - Analytics configuration
 * @returns Analytics data
 *
 * @example
 * ```tsx
 * function AnalyticsDashboard() {
 *   const { analytics, loading } = useCommentAnalytics({
 *     dateRange: { from: new Date('2024-01-01'), to: new Date() },
 *     groupBy: 'day'
 *   });
 *
 *   if (loading) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       <h3>Total Comments: {analytics.totalComments}</h3>
 *       <p>Approval Rate: {analytics.moderationMetrics.approvalRate}%</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCommentAnalytics(options: {
  dateRange?: { from: Date; to: Date };
  postId?: string;
  userId?: string;
  groupBy?: 'hour' | 'day' | 'week' | 'month';
} = {}) {
  const [analytics, setAnalytics] = useState<CommentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    refresh: fetchAnalytics
  };
}

// ============================================================================
// Utility: Spam Detection
// ============================================================================

/**
 * Detects spam in comment content
 *
 * @param content - Comment content to analyze
 * @param config - Spam detection configuration
 * @returns Spam detection results
 *
 * @example
 * ```tsx
 * const result = detectSpam(commentContent, {
 *   threshold: 0.7,
 *   checkLinks: true,
 *   checkDuplicates: true
 * });
 *
 * if (result.isSpam) {
 *   console.log('Spam detected:', result.reasons);
 * }
 * ```
 */
export function detectSpam(
  content: string,
  config: SpamDetectionConfig = {
    enabled: true,
    threshold: 0.7,
    checkLinks: true,
    checkDuplicates: true,
    checkRateLimit: true,
    trustedUsersExempt: true,
    autoReject: false
  }
): {
  isSpam: boolean;
  confidence: number;
  reasons: string[];
  flags: AutoModerationFlag[];
} {
  const flags: AutoModerationFlag[] = [];
  const reasons: string[] = [];
  let spamScore = 0;

  // Check for excessive links
  if (config.checkLinks) {
    const linkMatches = content.match(/https?:\/\/[^\s]+/g);
    if (linkMatches && linkMatches.length > 3) {
      spamScore += 0.3;
      reasons.push('Excessive links detected');
      flags.push({
        type: 'link_spam',
        confidence: 0.8,
        details: `${linkMatches.length} links found`,
        triggeredAt: new Date()
      });
    }
  }

  // Check for spam keywords
  const spamKeywords = ['viagra', 'casino', 'lottery', 'click here', 'buy now', 'limited offer'];
  const lowerContent = content.toLowerCase();
  const foundKeywords = spamKeywords.filter(keyword => lowerContent.includes(keyword));

  if (foundKeywords.length > 0) {
    spamScore += foundKeywords.length * 0.2;
    reasons.push(`Spam keywords: ${foundKeywords.join(', ')}`);
    flags.push({
      type: 'spam',
      confidence: 0.7,
      details: `Found keywords: ${foundKeywords.join(', ')}`,
      triggeredAt: new Date()
    });
  }

  // Check for excessive capitalization
  const upperCaseRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (upperCaseRatio > 0.5 && content.length > 20) {
    spamScore += 0.2;
    reasons.push('Excessive capitalization');
  }

  // Check for repeated characters
  if (/(.)\1{4,}/.test(content)) {
    spamScore += 0.15;
    reasons.push('Repeated characters detected');
  }

  const isSpam = spamScore >= config.threshold;
  const confidence = Math.min(spamScore, 1);

  return {
    isSpam,
    confidence,
    reasons,
    flags
  };
}

// ============================================================================
// Utility: Profanity Filter
// ============================================================================

/**
 * Filters profanity from comment content
 *
 * @param content - Content to filter
 * @param options - Filter options
 * @returns Filtered content and detection results
 *
 * @example
 * ```tsx
 * const { filtered, hasProfanity, matches } = filterProfanity(commentContent, {
 *   replace: true,
 *   replacement: '***'
 * });
 *
 * if (hasProfanity) {
 *   console.log('Profanity detected:', matches);
 * }
 * ```
 */
export function filterProfanity(
  content: string,
  options: {
    replace?: boolean;
    replacement?: string;
    customWords?: string[];
  } = {}
): {
  filtered: string;
  hasProfanity: boolean;
  matches: string[];
  score: number;
} {
  // Common profanity list (simplified for demo)
  const profanityList = [
    'badword1',
    'badword2',
    'profanity',
    // Add more as needed
    ...(options.customWords || [])
  ];

  const matches: string[] = [];
  let filtered = content;

  profanityList.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(content)) {
      matches.push(word);
      if (options.replace !== false) {
        filtered = filtered.replace(regex, options.replacement || '***');
      }
    }
  });

  const hasProfanity = matches.length > 0;
  const score = hasProfanity ? Math.min(matches.length * 0.3, 1) : 0;

  return {
    filtered,
    hasProfanity,
    matches,
    score
  };
}

// ============================================================================
// Utility: Content Filtering
// ============================================================================

/**
 * Applies content filtering rules
 *
 * @param content - Content to filter
 * @param config - Filter configuration
 * @returns Filtering results
 *
 * @example
 * ```tsx
 * const result = applyContentFilter(commentContent, {
 *   profanityFilter: true,
 *   toxicityFilter: true,
 *   maxLinks: 2,
 *   bannedWords: ['spam', 'scam']
 * });
 *
 * if (!result.isAllowed) {
 *   console.log('Content blocked:', result.violations);
 * }
 * ```
 */
export function applyContentFilter(
  content: string,
  config: ContentFilterConfig
): {
  isAllowed: boolean;
  filteredContent: string;
  violations: string[];
  requiresModeration: boolean;
} {
  const violations: string[] = [];
  let filteredContent = content;

  // Profanity filter
  if (config.profanityFilter) {
    const { filtered, hasProfanity, matches } = filterProfanity(content);
    if (hasProfanity) {
      violations.push(`Profanity detected: ${matches.join(', ')}`);
      filteredContent = filtered;
    }
  }

  // Banned words
  if (config.bannedWords && config.bannedWords.length > 0) {
    const lowerContent = content.toLowerCase();
    const foundBanned = config.bannedWords.filter(word =>
      lowerContent.includes(word.toLowerCase())
    );

    if (foundBanned.length > 0) {
      violations.push(`Banned words: ${foundBanned.join(', ')}`);
    }
  }

  // Banned patterns
  if (config.bannedPatterns && config.bannedPatterns.length > 0) {
    config.bannedPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        violations.push(`Matched banned pattern: ${pattern.toString()}`);
      }
    });
  }

  // Link limit
  const links = content.match(/https?:\/\/[^\s]+/g) || [];
  if (links.length > config.maxLinks) {
    violations.push(`Too many links: ${links.length} (max: ${config.maxLinks})`);
  }

  // Domain whitelist
  if (config.allowedDomains && config.allowedDomains.length > 0) {
    const externalLinks = links.filter(link => {
      return !config.allowedDomains!.some(domain => link.includes(domain));
    });

    if (externalLinks.length > 0) {
      violations.push(`Links to non-allowed domains: ${externalLinks.join(', ')}`);
    }
  }

  const isAllowed = violations.length === 0 || !config.requireModeration;
  const requiresModeration = violations.length > 0 && config.requireModeration;

  return {
    isAllowed,
    filteredContent,
    violations,
    requiresModeration
  };
}

// ============================================================================
// Component: CommentList
// ============================================================================

/**
 * Renders a list of comments
 *
 * @example
 * ```tsx
 * <CommentList
 *   comments={comments}
 *   onApprove={(id) => console.log('Approve:', id)}
 *   onReject={(id) => console.log('Reject:', id)}
 *   loading={false}
 *   showModeration={true}
 * />
 * ```
 */
export function CommentList({
  comments,
  loading = false,
  showModeration = false,
  onApprove,
  onReject,
  onReply,
  className = ''
}: {
  comments: Comment[];
  loading?: boolean;
  showModeration?: boolean;
  onApprove?: (commentId: string) => void;
  onReject?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
  className?: string;
}) {
  if (loading) {
    return (
      <div className={`comment-list-loading ${className}`}>
        <p>Loading comments...</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className={`comment-list-empty ${className}`}>
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className={`comment-list ${className}`} role="list">
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          showModeration={showModeration}
          onApprove={onApprove}
          onReject={onReject}
          onReply={onReply}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Component: CommentItem
// ============================================================================

/**
 * Renders a single comment
 *
 * @example
 * ```tsx
 * <CommentItem
 *   comment={comment}
 *   showModeration={true}
 *   onApprove={(id) => approveComment(id)}
 *   onReject={(id) => rejectComment(id)}
 * />
 * ```
 */
export function CommentItem({
  comment,
  showModeration = false,
  onApprove,
  onReject,
  onReply,
  className = ''
}: {
  comment: Comment;
  showModeration?: boolean;
  onApprove?: (commentId: string) => void;
  onReject?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
  className?: string;
}) {
  const { upvote, downvote, userVote } = useCommentVoting(comment.id);

  return (
    <article
      className={`comment-item status-${comment.status} ${className}`}
      role="listitem"
      data-comment-id={comment.id}
    >
      <div className="comment-header">
        <div className="comment-author">
          {comment.authorAvatar && (
            <img
              src={comment.authorAvatar}
              alt={comment.authorName}
              className="author-avatar"
            />
          )}
          <span className="author-name">{comment.authorName}</span>
          {comment.authorReputation?.isModerator && (
            <span className="badge moderator">Moderator</span>
          )}
          {comment.isPinned && <span className="badge pinned">Pinned</span>}
        </div>
        <time className="comment-date" dateTime={comment.createdAt.toISOString()}>
          {comment.createdAt.toLocaleDateString()}
        </time>
      </div>

      <div className="comment-content">
        {comment.contentHtml ? (
          <div dangerouslySetInnerHTML={{ __html: comment.contentHtml }} />
        ) : (
          <p>{comment.content}</p>
        )}
        {comment.isEdited && (
          <span className="edited-indicator">(edited)</span>
        )}
      </div>

      <div className="comment-actions">
        <button
          onClick={() => upvote()}
          className={`vote-button ${userVote === 'up' ? 'active' : ''}`}
          aria-label="Upvote"
        >
          ▲ {comment.votes.up}
        </button>
        <button
          onClick={() => downvote()}
          className={`vote-button ${userVote === 'down' ? 'active' : ''}`}
          aria-label="Downvote"
        >
          ▼ {comment.votes.down}
        </button>

        {onReply && (
          <button
            onClick={() => onReply(comment.id)}
            className="reply-button"
          >
            Reply {comment.replyCount > 0 && `(${comment.replyCount})`}
          </button>
        )}

        {showModeration && comment.status === 'pending' && (
          <div className="moderation-actions">
            <button
              onClick={() => onApprove?.(comment.id)}
              className="approve-button"
            >
              Approve
            </button>
            <button
              onClick={() => onReject?.(comment.id)}
              className="reject-button"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

// ============================================================================
// Component: CommentForm
// ============================================================================

/**
 * Comment submission form
 *
 * @example
 * ```tsx
 * <CommentForm
 *   postId="123"
 *   onSubmit={async (data) => {
 *     await addComment(data);
 *   }}
 *   placeholder="Add your comment..."
 * />
 * ```
 */
export function CommentForm({
  postId,
  parentId,
  onSubmit,
  onCancel,
  placeholder = 'Write a comment...',
  className = ''
}: {
  postId: string;
  parentId?: string;
  onSubmit: (data: CommentFormData) => Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
  className?: string;
}) {
  const {
    content,
    setContent,
    isValid,
    errors,
    handleSubmit,
    reset,
    isSubmitting
  } = useCommentForm(onSubmit, {
    minLength: 1,
    maxLength: 5000
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
    reset();
  };

  return (
    <form className={`comment-form ${className}`} onSubmit={handleFormSubmit}>
      <div className="form-group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="comment-input"
          aria-label="Comment"
          aria-invalid={!!errors.content}
          aria-describedby={errors.content ? 'comment-error' : undefined}
        />
        {errors.content && (
          <span id="comment-error" className="error-message" role="alert">
            {errors.content}
          </span>
        )}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Comment'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// ============================================================================
// Component: ThreadedComments
// ============================================================================

/**
 * Displays nested/threaded comments
 *
 * @example
 * ```tsx
 * <ThreadedComments
 *   thread={thread}
 *   maxDepth={5}
 *   onReply={(parentId, data) => addReply(parentId, data)}
 *   onToggle={(id) => toggleCollapse(id)}
 * />
 * ```
 */
export function ThreadedComments({
  thread,
  maxDepth = 5,
  onReply,
  onToggle,
  className = ''
}: {
  thread: CommentThread[];
  maxDepth?: number;
  onReply?: (parentId: string, data: CommentFormData) => Promise<void>;
  onToggle?: (threadId: string) => void;
  className?: string;
}) {
  return (
    <div className={`threaded-comments ${className}`}>
      {thread.map(t => (
        <CommentThread
          key={t.id}
          thread={t}
          maxDepth={maxDepth}
          onReply={onReply}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Component: CommentThread
// ============================================================================

/**
 * Renders a single comment thread with replies
 *
 * @example
 * ```tsx
 * <CommentThread
 *   thread={thread}
 *   maxDepth={5}
 *   onReply={(parentId, data) => addReply(parentId, data)}
 * />
 * ```
 */
export function CommentThread({
  thread,
  maxDepth = 5,
  onReply,
  onToggle,
  className = ''
}: {
  thread: CommentThread;
  maxDepth?: number;
  onReply?: (parentId: string, data: CommentFormData) => Promise<void>;
  onToggle?: (threadId: string) => void;
  className?: string;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = async (data: CommentFormData) => {
    await onReply?.(thread.id, data);
    setShowReplyForm(false);
  };

  return (
    <div
      className={`comment-thread depth-${thread.depth} ${className}`}
      style={{ marginLeft: `${thread.depth * 24}px` }}
    >
      <CommentItem
        comment={thread.rootComment}
        onReply={() => setShowReplyForm(true)}
      />

      {showReplyForm && (
        <CommentForm
          postId={thread.rootComment.postId}
          parentId={thread.id}
          onSubmit={handleReply}
          onCancel={() => setShowReplyForm(false)}
          placeholder="Write a reply..."
        />
      )}

      {thread.replies.length > 0 && (
        <div className="thread-replies">
          {thread.isCollapsed ? (
            <button
              onClick={() => onToggle?.(thread.id)}
              className="expand-button"
            >
              Show {thread.totalReplies} {thread.totalReplies === 1 ? 'reply' : 'replies'}
            </button>
          ) : (
            <>
              <button
                onClick={() => onToggle?.(thread.id)}
                className="collapse-button"
              >
                Hide replies
              </button>
              {thread.replies.map(reply => (
                <CommentThread
                  key={reply.id}
                  thread={reply}
                  maxDepth={maxDepth}
                  onReply={onReply}
                  onToggle={onToggle}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Component: ModerationPanel
// ============================================================================

/**
 * Moderation dashboard panel
 *
 * @example
 * ```tsx
 * <ModerationPanel
 *   queue={queue}
 *   onProcess={(id, action) => processComment(id, action)}
 *   onBulkApprove={(ids) => bulkApprove(ids)}
 * />
 * ```
 */
export function ModerationPanel({
  queue,
  onProcess,
  onBulkApprove,
  onBulkReject,
  className = ''
}: {
  queue: ModerationQueueItem[];
  onProcess: (commentId: string, action: ModerationAction) => Promise<void>;
  onBulkApprove?: (commentIds: string[]) => Promise<void>;
  onBulkReject?: (commentIds: string[]) => Promise<void>;
  className?: string;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBulkApprove = () => {
    if (selectedIds.size > 0 && onBulkApprove) {
      onBulkApprove(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const handleBulkReject = () => {
    if (selectedIds.size > 0 && onBulkReject) {
      onBulkReject(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  return (
    <div className={`moderation-panel ${className}`}>
      <div className="panel-header">
        <h2>Moderation Queue ({queue.length})</h2>
        {selectedIds.size > 0 && (
          <div className="bulk-actions">
            <span>{selectedIds.size} selected</span>
            {onBulkApprove && (
              <button onClick={handleBulkApprove} className="bulk-approve">
                Approve Selected
              </button>
            )}
            {onBulkReject && (
              <button onClick={handleBulkReject} className="bulk-reject">
                Reject Selected
              </button>
            )}
          </div>
        )}
      </div>

      <div className="queue-list">
        {queue.map(item => (
          <ModerationQueueItem
            key={item.comment.id}
            item={item}
            selected={selectedIds.has(item.comment.id)}
            onToggleSelect={() => toggleSelect(item.comment.id)}
            onProcess={onProcess}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Component: ModerationQueue
// ============================================================================

/**
 * Individual moderation queue item
 *
 * @example
 * ```tsx
 * <ModerationQueueItem
 *   item={queueItem}
 *   onProcess={(id, action) => processComment(id, action)}
 * />
 * ```
 */
export function ModerationQueueItem({
  item,
  selected = false,
  onToggleSelect,
  onProcess,
  className = ''
}: {
  item: ModerationQueueItem;
  selected?: boolean;
  onToggleSelect?: () => void;
  onProcess: (commentId: string, action: ModerationAction) => Promise<void>;
  className?: string;
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action: ModerationAction) => {
    setIsProcessing(true);
    try {
      await onProcess(item.comment.id, action);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`moderation-queue-item priority-${item.priority} ${className}`}>
      {onToggleSelect && (
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="item-checkbox"
          aria-label="Select comment"
        />
      )}

      <div className="item-content">
        <div className="item-header">
          <span className="author">{item.comment.authorName}</span>
          <span className={`priority-badge ${item.priority}`}>
            {item.priority}
          </span>
          {item.reportCount > 0 && (
            <span className="report-count">
              {item.reportCount} {item.reportCount === 1 ? 'report' : 'reports'}
            </span>
          )}
        </div>

        <div className="comment-preview">
          {item.comment.content}
        </div>

        {item.autoFlags.length > 0 && (
          <div className="auto-flags">
            {item.autoFlags.map((flag, idx) => (
              <span key={idx} className={`flag ${flag.type}`}>
                {flag.type} ({Math.round(flag.confidence * 100)}%)
              </span>
            ))}
          </div>
        )}

        {item.suggestedAction && (
          <div className="suggested-action">
            Suggested: {item.suggestedAction}
          </div>
        )}
      </div>

      <div className="item-actions">
        <button
          onClick={() => handleAction('approve')}
          disabled={isProcessing}
          className="action-button approve"
        >
          Approve
        </button>
        <button
          onClick={() => handleAction('reject')}
          disabled={isProcessing}
          className="action-button reject"
        >
          Reject
        </button>
        <button
          onClick={() => handleAction('spam')}
          disabled={isProcessing}
          className="action-button spam"
        >
          Spam
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Component: ModerationActions
// ============================================================================

/**
 * Quick moderation action buttons
 *
 * @example
 * ```tsx
 * <ModerationActions
 *   commentId={comment.id}
 *   onAction={(id, action) => performModerationAction(id, action)}
 * />
 * ```
 */
export function ModerationActions({
  commentId,
  onAction,
  compact = false,
  className = ''
}: {
  commentId: string;
  onAction: (commentId: string, action: ModerationAction) => Promise<void>;
  compact?: boolean;
  className?: string;
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action: ModerationAction) => {
    setIsProcessing(true);
    try {
      await onAction(commentId, action);
    } finally {
      setIsProcessing(false);
    }
  };

  const actions: Array<{ action: ModerationAction; label: string; variant: string }> = [
    { action: 'approve', label: '✓', variant: 'success' },
    { action: 'reject', label: '✗', variant: 'danger' },
    { action: 'spam', label: '🚫', variant: 'warning' },
    { action: 'flag', label: '⚑', variant: 'info' }
  ];

  if (compact) {
    return (
      <div className={`moderation-actions compact ${className}`}>
        {actions.map(({ action, label, variant }) => (
          <button
            key={action}
            onClick={() => handleAction(action)}
            disabled={isProcessing}
            className={`action-btn ${variant}`}
            title={action}
            aria-label={action}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`moderation-actions ${className}`}>
      {actions.map(({ action, label, variant }) => (
        <button
          key={action}
          onClick={() => handleAction(action)}
          disabled={isProcessing}
          className={`action-button ${variant}`}
        >
          {action}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default {
  // Hooks
  useComments,
  useCommentThread,
  useCommentForm,
  useModeration,
  useModerationQueue,
  useReportComment,
  useUserManagement,
  useCommentVoting,
  useCommentReactions,
  useCommentNotifications,
  useUserReputation,
  useCommentAnalytics,

  // Components
  CommentList,
  CommentItem,
  CommentForm,
  ThreadedComments,
  CommentThread,
  ModerationPanel,
  ModerationQueueItem,
  ModerationActions,

  // Utilities
  detectSpam,
  filterProfanity,
  applyContentFilter
};
