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
    topCommenters: Array<{
        userId: string;
        count: number;
    }>;
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
export declare function useComments(postId: string, options?: {
    autoRefresh?: boolean;
    refreshInterval?: number;
    filters?: CommentFilters;
    pagination?: PaginationOptions;
}): {
    comments: any;
    loading: any;
    error: any;
    totalCount: any;
    addComment: any;
    updateComment: any;
    deleteComment: any;
    refresh: any;
};
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
export declare function useCommentThread(postId: string, options?: {
    maxDepth?: number;
    sortBy?: CommentSortBy;
    collapseDepth?: number;
}): {
    thread: any;
    loading: any;
    addReply: any;
    toggleCollapse: any;
    loadMoreReplies: any;
    collapsedThreads: any;
};
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
export declare function useCommentForm(onSubmit: (data: CommentFormData) => Promise<void>, options?: {
    minLength?: number;
    maxLength?: number;
    requireAuth?: boolean;
    allowMentions?: boolean;
    allowAttachments?: boolean;
}): {
    content: any;
    setContent: any;
    mentions: any;
    addMention: any;
    removeMention: any;
    attachments: any;
    addAttachment: any;
    removeAttachment: any;
    errors: any;
    isValid: any;
    isSubmitting: any;
    handleSubmit: any;
    reset: any;
};
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
export declare function useModeration(options?: {
    onSuccess?: (action: ModerationAction, commentId: string) => void;
    onError?: (error: Error) => void;
}): {
    approveComment: any;
    rejectComment: any;
    markAsSpam: any;
    flagComment: any;
    unflagComment: any;
    deleteComment: any;
    editComment: any;
    isProcessing: any;
};
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
export declare function useModerationQueue(options?: {
    autoRefresh?: boolean;
    refreshInterval?: number;
    filters?: {
        status?: CommentStatus;
        priority?: 'low' | 'medium' | 'high' | 'urgent';
        assignedTo?: string;
    };
}): {
    queue: any;
    loading: any;
    stats: any;
    processComment: any;
    bulkApprove: any;
    bulkReject: any;
    assignToModerator: any;
    refresh: any;
};
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
export declare function useReportComment(): {
    submitReport: any;
    isSubmitting: any;
};
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
export declare function useUserManagement(): {
    banUser: any;
    unbanUser: any;
    muteUser: any;
    unmuteUser: any;
    warnUser: any;
    isProcessing: any;
};
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
export declare function useCommentVoting(commentId: string): {
    upvote: any;
    downvote: any;
    userVote: any;
    isVoting: any;
};
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
export declare function useCommentReactions(commentId: string): {
    addReaction: any;
    removeReaction: any;
    userReactions: any;
    isReacting: any;
};
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
export declare function useCommentNotifications(userId: string): {
    notifications: any;
    loading: any;
    unreadCount: any;
    markAsRead: any;
    markAllAsRead: any;
    refresh: any;
};
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
export declare function useUserReputation(userId: string): {
    reputation: any;
    loading: any;
    updateReputation: any;
    refresh: any;
};
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
export declare function useCommentAnalytics(options?: {
    dateRange?: {
        from: Date;
        to: Date;
    };
    postId?: string;
    userId?: string;
    groupBy?: 'hour' | 'day' | 'week' | 'month';
}): {
    analytics: any;
    loading: any;
    refresh: any;
};
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
export declare function detectSpam(content: string, config?: SpamDetectionConfig): {
    isSpam: boolean;
    confidence: number;
    reasons: string[];
    flags: AutoModerationFlag[];
};
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
export declare function filterProfanity(content: string, options?: {
    replace?: boolean;
    replacement?: string;
    customWords?: string[];
}): {
    filtered: string;
    hasProfanity: boolean;
    matches: string[];
    score: number;
};
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
export declare function applyContentFilter(content: string, config: ContentFilterConfig): {
    isAllowed: boolean;
    filteredContent: string;
    violations: string[];
    requiresModeration: boolean;
};
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
export declare function CommentList({ comments, loading, showModeration, onApprove, onReject, onReply, className }: {
    comments: Comment[];
    loading?: boolean;
    showModeration?: boolean;
    onApprove?: (commentId: string) => void;
    onReject?: (commentId: string) => void;
    onReply?: (commentId: string) => void;
    className?: string;
}): any;
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
export declare function CommentItem({ comment, showModeration, onApprove, onReject, onReply, className }: {
    comment: Comment;
    showModeration?: boolean;
    onApprove?: (commentId: string) => void;
    onReject?: (commentId: string) => void;
    onReply?: (commentId: string) => void;
    className?: string;
}): any;
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
export declare function CommentForm({ postId, parentId, onSubmit, onCancel, placeholder, className }: {
    postId: string;
    parentId?: string;
    onSubmit: (data: CommentFormData) => Promise<void>;
    onCancel?: () => void;
    placeholder?: string;
    className?: string;
}): any;
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
export declare function ThreadedComments({ thread, maxDepth, onReply, onToggle, className }: {
    thread: CommentThread[];
    maxDepth?: number;
    onReply?: (parentId: string, data: CommentFormData) => Promise<void>;
    onToggle?: (threadId: string) => void;
    className?: string;
}): any;
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
export declare function CommentThread({ thread, maxDepth, onReply, onToggle, className }: {
    thread: CommentThread;
    maxDepth?: number;
    onReply?: (parentId: string, data: CommentFormData) => Promise<void>;
    onToggle?: (threadId: string) => void;
    className?: string;
}): any;
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
export declare function ModerationPanel({ queue, onProcess, onBulkApprove, onBulkReject, className }: {
    queue: ModerationQueueItem[];
    onProcess: (commentId: string, action: ModerationAction) => Promise<void>;
    onBulkApprove?: (commentIds: string[]) => Promise<void>;
    onBulkReject?: (commentIds: string[]) => Promise<void>;
    className?: string;
}): any;
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
export declare function ModerationQueueItem({ item, selected, onToggleSelect, onProcess, className }: {
    item: ModerationQueueItem;
    selected?: boolean;
    onToggleSelect?: () => void;
    onProcess: (commentId: string, action: ModerationAction) => Promise<void>;
    className?: string;
}): any;
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
export declare function ModerationActions({ commentId, onAction, compact, className }: {
    commentId: string;
    onAction: (commentId: string, action: ModerationAction) => Promise<void>;
    compact?: boolean;
    className?: string;
}): any;
declare const _default: {
    useComments: typeof useComments;
    useCommentThread: typeof useCommentThread;
    useCommentForm: typeof useCommentForm;
    useModeration: typeof useModeration;
    useModerationQueue: typeof useModerationQueue;
    useReportComment: typeof useReportComment;
    useUserManagement: typeof useUserManagement;
    useCommentVoting: typeof useCommentVoting;
    useCommentReactions: typeof useCommentReactions;
    useCommentNotifications: typeof useCommentNotifications;
    useUserReputation: typeof useUserReputation;
    useCommentAnalytics: typeof useCommentAnalytics;
    CommentList: typeof CommentList;
    CommentItem: typeof CommentItem;
    CommentForm: typeof CommentForm;
    ThreadedComments: typeof ThreadedComments;
    CommentThread: typeof CommentThread;
    ModerationPanel: typeof ModerationPanel;
    ModerationQueueItem: typeof ModerationQueueItem;
    ModerationActions: typeof ModerationActions;
    detectSpam: typeof detectSpam;
    filterProfanity: typeof filterProfanity;
    applyContentFilter: typeof applyContentFilter;
};
export default _default;
//# sourceMappingURL=comments-moderation-kit.d.ts.map