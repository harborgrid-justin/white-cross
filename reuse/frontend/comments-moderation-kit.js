"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useComments = useComments;
exports.useCommentThread = useCommentThread;
exports.useCommentForm = useCommentForm;
exports.useModeration = useModeration;
exports.useModerationQueue = useModerationQueue;
exports.useReportComment = useReportComment;
exports.useUserManagement = useUserManagement;
exports.useCommentVoting = useCommentVoting;
exports.useCommentReactions = useCommentReactions;
exports.useCommentNotifications = useCommentNotifications;
exports.useUserReputation = useUserReputation;
exports.useCommentAnalytics = useCommentAnalytics;
exports.detectSpam = detectSpam;
exports.filterProfanity = filterProfanity;
exports.applyContentFilter = applyContentFilter;
exports.CommentList = CommentList;
exports.CommentItem = CommentItem;
exports.CommentForm = CommentForm;
exports.ThreadedComments = ThreadedComments;
exports.CommentThread = CommentThread;
exports.ModerationPanel = ModerationPanel;
exports.ModerationQueueItem = ModerationQueueItem;
exports.ModerationActions = ModerationActions;
const react_1 = require("react");
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
function useComments(postId, options = {}) {
    const [comments, setComments] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [totalCount, setTotalCount] = (0, react_1.useState)(0);
    const fetchComments = (0, react_1.useCallback)(async () => {
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
            if (!response.ok)
                throw new Error('Failed to fetch comments');
            const data = await response.json();
            setComments(data.comments);
            setTotalCount(data.totalCount);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [postId, options.filters, options.pagination]);
    (0, react_1.useEffect)(() => {
        fetchComments();
    }, [fetchComments]);
    // Auto-refresh setup
    (0, react_1.useEffect)(() => {
        if (!options.autoRefresh)
            return;
        const interval = setInterval(fetchComments, options.refreshInterval || 30000);
        return () => clearInterval(interval);
    }, [options.autoRefresh, options.refreshInterval, fetchComments]);
    const addComment = (0, react_1.useCallback)(async (formData) => {
        try {
            const response = await fetch(`/api/comments/${postId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok)
                throw new Error('Failed to add comment');
            const newComment = await response.json();
            setComments(prev => [newComment, ...prev]);
            setTotalCount(prev => prev + 1);
            return newComment;
        }
        catch (err) {
            throw err;
        }
    }, [postId]);
    const updateComment = (0, react_1.useCallback)(async (commentId, updates) => {
        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            if (!response.ok)
                throw new Error('Failed to update comment');
            const updated = await response.json();
            setComments(prev => prev.map(c => c.id === commentId ? updated : c));
            return updated;
        }
        catch (err) {
            throw err;
        }
    }, []);
    const deleteComment = (0, react_1.useCallback)(async (commentId, soft = true) => {
        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ soft })
            });
            if (!response.ok)
                throw new Error('Failed to delete comment');
            if (soft) {
                setComments(prev => prev.map(c => c.id === commentId ? { ...c, status: 'deleted', deletedAt: new Date() } : c));
            }
            else {
                setComments(prev => prev.filter(c => c.id !== commentId));
                setTotalCount(prev => prev - 1);
            }
        }
        catch (err) {
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
function useCommentThread(postId, options = {}) {
    const [thread, setThread] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [collapsedThreads, setCollapsedThreads] = (0, react_1.useState)(new Set());
    const buildThreadTree = (0, react_1.useCallback)((comments) => {
        const commentMap = new Map();
        const rootComments = [];
        // First pass: organize comments
        comments.forEach(comment => {
            commentMap.set(comment.id, comment);
            if (!comment.parentId) {
                rootComments.push(comment);
            }
        });
        // Recursive function to build thread structure
        const buildThread = (comment, depth) => {
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
    (0, react_1.useEffect)(() => {
        const fetchThread = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/comments/${postId}/thread?sortBy=${options.sortBy || 'newest'}`);
                if (!response.ok)
                    throw new Error('Failed to fetch thread');
                const comments = await response.json();
                const tree = buildThreadTree(comments);
                setThread(tree);
            }
            catch (err) {
                console.error('Error fetching thread:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchThread();
    }, [postId, options.sortBy, buildThreadTree]);
    const addReply = (0, react_1.useCallback)(async (parentId, formData) => {
        try {
            const response = await fetch(`/api/comments/${postId}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, parentId })
            });
            if (!response.ok)
                throw new Error('Failed to add reply');
            const newComment = await response.json();
            // Update thread tree with new reply
            // Simplified - in production, rebuild the tree
            return newComment;
        }
        catch (err) {
            throw err;
        }
    }, [postId]);
    const toggleCollapse = (0, react_1.useCallback)((threadId) => {
        setCollapsedThreads(prev => {
            const next = new Set(prev);
            if (next.has(threadId)) {
                next.delete(threadId);
            }
            else {
                next.add(threadId);
            }
            return next;
        });
    }, []);
    const loadMoreReplies = (0, react_1.useCallback)(async (threadId, offset) => {
        try {
            const response = await fetch(`/api/comments/${threadId}/replies?offset=${offset}`);
            if (!response.ok)
                throw new Error('Failed to load replies');
            const replies = await response.json();
            return replies;
        }
        catch (err) {
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
function useCommentForm(onSubmit, options = {}) {
    const [content, setContent] = (0, react_1.useState)('');
    const [mentions, setMentions] = (0, react_1.useState)([]);
    const [attachments, setAttachments] = (0, react_1.useState)([]);
    const [errors, setErrors] = (0, react_1.useState)({});
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const validate = (0, react_1.useCallback)(() => {
        const newErrors = {};
        const minLength = options.minLength || 1;
        const maxLength = options.maxLength || 5000;
        if (!content.trim()) {
            newErrors.content = 'Comment cannot be empty';
        }
        else if (content.length < minLength) {
            newErrors.content = `Comment must be at least ${minLength} characters`;
        }
        else if (content.length > maxLength) {
            newErrors.content = `Comment must be no more than ${maxLength} characters`;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [content, options.minLength, options.maxLength]);
    const isValid = (0, react_1.useMemo)(() => {
        return content.trim().length > 0 && Object.keys(errors).length === 0;
    }, [content, errors]);
    const handleSubmit = (0, react_1.useCallback)(async (e) => {
        if (e)
            e.preventDefault();
        if (!validate())
            return;
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
        }
        catch (err) {
            setErrors({ submit: err.message });
        }
        finally {
            setIsSubmitting(false);
        }
    }, [content, mentions, attachments, validate, onSubmit]);
    const addMention = (0, react_1.useCallback)((userId) => {
        if (options.allowMentions !== false) {
            setMentions(prev => [...new Set([...prev, userId])]);
        }
    }, [options.allowMentions]);
    const removeMention = (0, react_1.useCallback)((userId) => {
        setMentions(prev => prev.filter(id => id !== userId));
    }, []);
    const addAttachment = (0, react_1.useCallback)((file) => {
        if (options.allowAttachments !== false) {
            setAttachments(prev => [...prev, file]);
        }
    }, [options.allowAttachments]);
    const removeAttachment = (0, react_1.useCallback)((index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    }, []);
    const reset = (0, react_1.useCallback)(() => {
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
function useModeration(options = {}) {
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const performAction = (0, react_1.useCallback)(async (commentId, action, reason) => {
        setIsProcessing(true);
        try {
            const response = await fetch(`/api/moderation/comments/${commentId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, reason })
            });
            if (!response.ok)
                throw new Error(`Failed to ${action} comment`);
            const result = await response.json();
            options.onSuccess?.(action, commentId);
            return result;
        }
        catch (err) {
            options.onError?.(err);
            throw err;
        }
        finally {
            setIsProcessing(false);
        }
    }, [options]);
    const approveComment = (0, react_1.useCallback)((commentId) => {
        return performAction(commentId, 'approve');
    }, [performAction]);
    const rejectComment = (0, react_1.useCallback)((commentId, reason) => {
        return performAction(commentId, 'reject', reason);
    }, [performAction]);
    const markAsSpam = (0, react_1.useCallback)((commentId) => {
        return performAction(commentId, 'spam');
    }, [performAction]);
    const flagComment = (0, react_1.useCallback)((commentId, reason) => {
        return performAction(commentId, 'flag', reason);
    }, [performAction]);
    const unflagComment = (0, react_1.useCallback)((commentId) => {
        return performAction(commentId, 'unflag');
    }, [performAction]);
    const deleteComment = (0, react_1.useCallback)((commentId, reason) => {
        return performAction(commentId, 'delete', reason);
    }, [performAction]);
    const editComment = (0, react_1.useCallback)((commentId, newContent, reason) => {
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
function useModerationQueue(options = {}) {
    const [queue, setQueue] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [stats, setStats] = (0, react_1.useState)(null);
    const fetchQueue = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/moderation/queue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filters: options.filters })
            });
            if (!response.ok)
                throw new Error('Failed to fetch queue');
            const data = await response.json();
            setQueue(data.queue);
            setStats(data.stats);
        }
        catch (err) {
            console.error('Error fetching moderation queue:', err);
        }
        finally {
            setLoading(false);
        }
    }, [options.filters]);
    (0, react_1.useEffect)(() => {
        fetchQueue();
    }, [fetchQueue]);
    (0, react_1.useEffect)(() => {
        if (!options.autoRefresh)
            return;
        const interval = setInterval(fetchQueue, options.refreshInterval || 60000);
        return () => clearInterval(interval);
    }, [options.autoRefresh, options.refreshInterval, fetchQueue]);
    const processComment = (0, react_1.useCallback)(async (commentId, action, reason) => {
        try {
            const response = await fetch(`/api/moderation/queue/${commentId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, reason })
            });
            if (!response.ok)
                throw new Error('Failed to process comment');
            // Remove from queue
            setQueue(prev => prev.filter(item => item.comment.id !== commentId));
            return await response.json();
        }
        catch (err) {
            throw err;
        }
    }, []);
    const bulkApprove = (0, react_1.useCallback)(async (commentIds) => {
        try {
            const response = await fetch('/api/moderation/bulk/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentIds })
            });
            if (!response.ok)
                throw new Error('Failed to bulk approve');
            setQueue(prev => prev.filter(item => !commentIds.includes(item.comment.id)));
            return await response.json();
        }
        catch (err) {
            throw err;
        }
    }, []);
    const bulkReject = (0, react_1.useCallback)(async (commentIds, reason) => {
        try {
            const response = await fetch('/api/moderation/bulk/reject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentIds, reason })
            });
            if (!response.ok)
                throw new Error('Failed to bulk reject');
            setQueue(prev => prev.filter(item => !commentIds.includes(item.comment.id)));
            return await response.json();
        }
        catch (err) {
            throw err;
        }
    }, []);
    const assignToModerator = (0, react_1.useCallback)(async (commentId, moderatorId) => {
        try {
            const response = await fetch(`/api/moderation/assign/${commentId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moderatorId })
            });
            if (!response.ok)
                throw new Error('Failed to assign comment');
            setQueue(prev => prev.map(item => item.comment.id === commentId ? { ...item, assignedTo: moderatorId } : item));
            return await response.json();
        }
        catch (err) {
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
function useReportComment() {
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const submitReport = (0, react_1.useCallback)(async (commentId, report) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/comments/${commentId}/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(report)
            });
            if (!response.ok)
                throw new Error('Failed to submit report');
            return await response.json();
        }
        catch (err) {
            throw err;
        }
        finally {
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
function useUserManagement() {
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const banUser = (0, react_1.useCallback)(async (userId, reason, permanent = true) => {
        setIsProcessing(true);
        try {
            const response = await fetch(`/api/moderation/users/${userId}/ban`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason, permanent })
            });
            if (!response.ok)
                throw new Error('Failed to ban user');
            return await response.json();
        }
        catch (err) {
            throw err;
        }
        finally {
            setIsProcessing(false);
        }
    }, []);
    const unbanUser = (0, react_1.useCallback)(async (userId) => {
        setIsProcessing(true);
        try {
            const response = await fetch(`/api/moderation/users/${userId}/unban`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok)
                throw new Error('Failed to unban user');
            return await response.json();
        }
        catch (err) {
            throw err;
        }
        finally {
            setIsProcessing(false);
        }
    }, []);
    const muteUser = (0, react_1.useCallback)(async (userId, durationHours, reason) => {
        setIsProcessing(true);
        try {
            const response = await fetch(`/api/moderation/users/${userId}/mute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ durationHours, reason })
            });
            if (!response.ok)
                throw new Error('Failed to mute user');
            return await response.json();
        }
        catch (err) {
            throw err;
        }
        finally {
            setIsProcessing(false);
        }
    }, []);
    const unmuteUser = (0, react_1.useCallback)(async (userId) => {
        setIsProcessing(true);
        try {
            const response = await fetch(`/api/moderation/users/${userId}/unmute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok)
                throw new Error('Failed to unmute user');
            return await response.json();
        }
        catch (err) {
            throw err;
        }
        finally {
            setIsProcessing(false);
        }
    }, []);
    const warnUser = (0, react_1.useCallback)(async (userId, message) => {
        setIsProcessing(true);
        try {
            const response = await fetch(`/api/moderation/users/${userId}/warn`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            if (!response.ok)
                throw new Error('Failed to warn user');
            return await response.json();
        }
        catch (err) {
            throw err;
        }
        finally {
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
function useCommentVoting(commentId) {
    const [userVote, setUserVote] = (0, react_1.useState)(null);
    const [isVoting, setIsVoting] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        // Fetch user's current vote
        const fetchVote = async () => {
            try {
                const response = await fetch(`/api/comments/${commentId}/vote`);
                if (response.ok) {
                    const data = await response.json();
                    setUserVote(data.vote);
                }
            }
            catch (err) {
                console.error('Error fetching vote:', err);
            }
        };
        fetchVote();
    }, [commentId]);
    const vote = (0, react_1.useCallback)(async (type) => {
        setIsVoting(true);
        try {
            const response = await fetch(`/api/comments/${commentId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            });
            if (!response.ok)
                throw new Error('Failed to vote');
            const data = await response.json();
            setUserVote(data.vote);
            return data;
        }
        catch (err) {
            throw err;
        }
        finally {
            setIsVoting(false);
        }
    }, [commentId]);
    const upvote = (0, react_1.useCallback)(() => {
        return vote(userVote === 'up' ? null : 'up');
    }, [vote, userVote]);
    const downvote = (0, react_1.useCallback)(() => {
        return vote(userVote === 'down' ? null : 'down');
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
function useCommentReactions(commentId) {
    const [userReactions, setUserReactions] = (0, react_1.useState)([]);
    const [isReacting, setIsReacting] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        // Fetch user's current reactions
        const fetchReactions = async () => {
            try {
                const response = await fetch(`/api/comments/${commentId}/reactions`);
                if (response.ok) {
                    const data = await response.json();
                    setUserReactions(data.userReactions);
                }
            }
            catch (err) {
                console.error('Error fetching reactions:', err);
            }
        };
        fetchReactions();
    }, [commentId]);
    const addReaction = (0, react_1.useCallback)(async (type) => {
        setIsReacting(true);
        try {
            const response = await fetch(`/api/comments/${commentId}/reactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            });
            if (!response.ok)
                throw new Error('Failed to add reaction');
            setUserReactions(prev => [...prev, type]);
            return await response.json();
        }
        catch (err) {
            throw err;
        }
        finally {
            setIsReacting(false);
        }
    }, [commentId]);
    const removeReaction = (0, react_1.useCallback)(async (type) => {
        setIsReacting(true);
        try {
            const response = await fetch(`/api/comments/${commentId}/reactions/${type}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok)
                throw new Error('Failed to remove reaction');
            setUserReactions(prev => prev.filter(r => r !== type));
            return await response.json();
        }
        catch (err) {
            throw err;
        }
        finally {
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
function useCommentNotifications(userId) {
    const [notifications, setNotifications] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const fetchNotifications = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/users/${userId}/notifications`);
            if (!response.ok)
                throw new Error('Failed to fetch notifications');
            const data = await response.json();
            setNotifications(data);
        }
        catch (err) {
            console.error('Error fetching notifications:', err);
        }
        finally {
            setLoading(false);
        }
    }, [userId]);
    (0, react_1.useEffect)(() => {
        fetchNotifications();
    }, [fetchNotifications]);
    const unreadCount = (0, react_1.useMemo)(() => {
        return notifications.filter(n => !n.isRead).length;
    }, [notifications]);
    const markAsRead = (0, react_1.useCallback)(async (notificationId) => {
        try {
            const response = await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok)
                throw new Error('Failed to mark as read');
            setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
        }
        catch (err) {
            console.error('Error marking notification as read:', err);
        }
    }, []);
    const markAllAsRead = (0, react_1.useCallback)(async () => {
        try {
            const response = await fetch(`/api/users/${userId}/notifications/read-all`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok)
                throw new Error('Failed to mark all as read');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        }
        catch (err) {
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
function useUserReputation(userId) {
    const [reputation, setReputation] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const fetchReputation = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/users/${userId}/reputation`);
            if (!response.ok)
                throw new Error('Failed to fetch reputation');
            const data = await response.json();
            setReputation(data);
        }
        catch (err) {
            console.error('Error fetching reputation:', err);
        }
        finally {
            setLoading(false);
        }
    }, [userId]);
    (0, react_1.useEffect)(() => {
        fetchReputation();
    }, [fetchReputation]);
    const updateReputation = (0, react_1.useCallback)(async (delta, reason) => {
        try {
            const response = await fetch(`/api/users/${userId}/reputation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ delta, reason })
            });
            if (!response.ok)
                throw new Error('Failed to update reputation');
            const updated = await response.json();
            setReputation(updated);
            return updated;
        }
        catch (err) {
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
function useCommentAnalytics(options = {}) {
    const [analytics, setAnalytics] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const fetchAnalytics = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/analytics/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(options)
            });
            if (!response.ok)
                throw new Error('Failed to fetch analytics');
            const data = await response.json();
            setAnalytics(data);
        }
        catch (err) {
            console.error('Error fetching analytics:', err);
        }
        finally {
            setLoading(false);
        }
    }, [options]);
    (0, react_1.useEffect)(() => {
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
function detectSpam(content, config = {
    enabled: true,
    threshold: 0.7,
    checkLinks: true,
    checkDuplicates: true,
    checkRateLimit: true,
    trustedUsersExempt: true,
    autoReject: false
}) {
    const flags = [];
    const reasons = [];
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
function filterProfanity(content, options = {}) {
    // Common profanity list (simplified for demo)
    const profanityList = [
        'badword1',
        'badword2',
        'profanity',
        // Add more as needed
        ...(options.customWords || [])
    ];
    const matches = [];
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
function applyContentFilter(content, config) {
    const violations = [];
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
        const foundBanned = config.bannedWords.filter(word => lowerContent.includes(word.toLowerCase()));
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
            return !config.allowedDomains.some(domain => link.includes(domain));
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
function CommentList({ comments, loading = false, showModeration = false, onApprove, onReject, onReply, className = '' }) {
    if (loading) {
        return className = {} `comment-list-loading ${className}`;
    }
     >
        Loading;
    comments;
    /p>
        < /div>;
    ;
}
if (comments.length === 0) {
    return className = {} `comment-list-empty ${className}`;
}
 >
    No;
comments;
yet.Be;
the;
first;
to;
comment < /p>
    < /div>;
;
return className = {} `comment-list ${className}`;
role = "list" >
    { comments, : .map(comment => key = { comment, : .id }, comment = { comment }, showModeration = { showModeration }, onApprove = { onApprove }, onReject = { onReject }, onReply = { onReply }
            /  >
        ) }
    < /div>;
;
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
function CommentItem({ comment, showModeration = false, onApprove, onReject, onReply, className = '' }) {
    const { upvote, downvote, userVote } = useCommentVoting(comment.id);
    return className = {} `comment-item status-${comment.status} ${className}`;
}
role = "listitem";
data - comment - id;
{
    comment.id;
}
    >
        className;
"comment-header" >
    className;
"comment-author" >
    { comment, : .authorAvatar && src };
{
    comment.authorAvatar;
}
alt = { comment, : .authorName };
className = "author-avatar"
    /  >
;
className;
"author-name" > { comment, : .authorName } < /span>;
{
    comment.authorReputation?.isModerator && className;
    "badge moderator" > Moderator < /span>;
}
{
    comment.isPinned && className;
    "badge pinned" > Pinned < /span>;
}
/div>
    < time;
className = "comment-date";
dateTime = { comment, : .createdAt.toISOString() } >
    { comment, : .createdAt.toLocaleDateString() }
    < /time>
    < /div>
    < div;
className = "comment-content" >
    { comment, : .contentHtml ? dangerouslySetInnerHTML = {} :  };
{
    __html: comment.contentHtml;
}
/>;
({ comment, : .content } < /p>);
{
    comment.isEdited && className;
    "edited-indicator" > (edited) < /span>;
}
/div>
    < div;
className = "comment-actions" >
    onClick;
{
    () => upvote();
}
className = {} `vote-button ${userVote === 'up' ? 'active' : ''}`;
aria - label;
"Upvote"
    >
;
{
    comment.votes.up;
}
/button>
    < button;
onClick = {}();
downvote();
className = {} `vote-button ${userVote === 'down' ? 'active' : ''}`;
aria - label;
"Downvote"
    >
;
{
    comment.votes.down;
}
/button>;
{
    onReply && onClick;
    {
        () => onReply(comment.id);
    }
    className = "reply-button"
        >
            Reply;
    {
        comment.replyCount > 0 && `(${comment.replyCount})`;
    }
    /button>;
}
{
    showModeration && comment.status === 'pending' && className;
    "moderation-actions" >
        onClick;
    {
        () => onApprove?.(comment.id);
    }
    className = "approve-button"
        >
            Approve
        < /button>
        < button;
    onClick = {}();
    onReject?.(comment.id);
}
className = "reject-button"
    >
        Reject
    < /button>
    < /div>;
/div>
    < /article>;
;
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
function CommentForm({ postId, parentId, onSubmit, onCancel, placeholder = 'Write a comment...', className = '' }) {
    const { content, setContent, isValid, errors, handleSubmit, reset, isSubmitting } = useCommentForm(onSubmit, {
        minLength: 1,
        maxLength: 5000
    });
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await handleSubmit();
        reset();
    };
    return className = {} `comment-form ${className}`;
}
onSubmit = { handleFormSubmit } >
    className;
"form-group" >
    value;
{
    content;
}
onChange = {}(e);
setContent(e.target.value);
placeholder = { placeholder };
rows = { 4:  };
className = "comment-input";
aria - label;
"Comment";
aria - invalid;
{
    !!errors.content;
}
aria - describedby;
{
    errors.content ? 'comment-error' : undefined;
}
/>;
{
    errors.content && id;
    "comment-error";
    className = "error-message";
    role = "alert" >
        { errors, : .content }
        < /span>;
}
/div>
    < div;
className = "form-actions" >
    type;
"submit";
disabled = {};
isValid || isSubmitting;
className = "submit-button"
    >
        { isSubmitting, 'Submitting...': 'Submit Comment' }
    < /button>;
{
    onCancel && type;
    "button";
    onClick = { onCancel };
    className = "cancel-button"
        >
            Cancel
        < /button>;
}
/div>
    < /form>;
;
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
function ThreadedComments({ thread, maxDepth = 5, onReply, onToggle, className = '' }) {
    return className = {} `threaded-comments ${className}`;
}
 >
    { thread, : .map(t => key = { t, : .id }, thread = { t }, maxDepth = { maxDepth }, onReply = { onReply }, onToggle = { onToggle }
            /  >
        ) }
    < /div>;
;
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
function CommentThread({ thread, maxDepth = 5, onReply, onToggle, className = '' }) {
    const [showReplyForm, setShowReplyForm] = (0, react_1.useState)(false);
    const handleReply = async (data) => {
        await onReply?.(thread.id, data);
        setShowReplyForm(false);
    };
    return className = {} `comment-thread depth-${thread.depth} ${className}`;
}
style = {};
{
    marginLeft: `${thread.depth * 24}px`;
}
    >
        comment;
{
    thread.rootComment;
}
onReply = {}();
setShowReplyForm(true);
/>;
{
    showReplyForm && postId;
    {
        thread.rootComment.postId;
    }
    parentId = { thread, : .id };
    onSubmit = { handleReply };
    onCancel = {}();
    setShowReplyForm(false);
}
placeholder = "Write a reply..."
    /  >
;
{
    thread.replies.length > 0 && className;
    "thread-replies" >
        { thread, : .isCollapsed ? onClick = {}() : , onToggle }(thread.id);
}
className = "expand-button"
    >
        Show;
{
    thread.totalReplies;
}
{
    thread.totalReplies === 1 ? 'reply' : 'replies';
}
/button>;
onClick = {}();
onToggle?.(thread.id);
className = "collapse-button"
    >
        Hide;
replies
    < /button>;
{
    thread.replies.map(reply => key = { reply, : .id }, thread = { reply }, maxDepth = { maxDepth }, onReply = { onReply }, onToggle = { onToggle }
        /  >
    );
}
/>;
/div>;
/div>;
;
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
function ModerationPanel({ queue, onProcess, onBulkApprove, onBulkReject, className = '' }) {
    const [selectedIds, setSelectedIds] = (0, react_1.useState)(new Set());
    const toggleSelect = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            }
            else {
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
    return className = {} `moderation-panel ${className}`;
}
 >
    className;
"panel-header" >
    Moderation;
Queue({ queue, : .length }) < /h2>;
{
    selectedIds.size > 0 && className;
    "bulk-actions" >
        { selectedIds, : .size };
    selected < /span>;
    {
        onBulkApprove && onClick;
        {
            handleBulkApprove;
        }
        className = "bulk-approve" >
            Approve;
        Selected
            < /button>;
    }
    {
        onBulkReject && onClick;
        {
            handleBulkReject;
        }
        className = "bulk-reject" >
            Reject;
        Selected
            < /button>;
    }
    /div>;
}
/div>
    < div;
className = "queue-list" >
    { queue, : .map(item => key = { item, : .comment.id }, item = { item }, selected = { selectedIds, : .has(item.comment.id) }, onToggleSelect = {}(), toggleSelect(item.comment.id)) };
onProcess = { onProcess }
    /  >
;
/div>
    < /div>;
;
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
function ModerationQueueItem({ item, selected = false, onToggleSelect, onProcess, className = '' }) {
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const handleAction = async (action) => {
        setIsProcessing(true);
        try {
            await onProcess(item.comment.id, action);
        }
        finally {
            setIsProcessing(false);
        }
    };
    return className = {} `moderation-queue-item priority-${item.priority} ${className}`;
}
 >
    { onToggleSelect } && type;
"checkbox";
checked = { selected };
onChange = { onToggleSelect };
className = "item-checkbox";
aria - label;
"Select comment"
    /  >
;
className;
"item-content" >
    className;
"item-header" >
    className;
"author" > { item, : .comment.authorName } < /span>
    < span;
className = {} `priority-badge ${item.priority}`;
 >
    { item, : .priority }
    < /span>;
{
    item.reportCount > 0 && className;
    "report-count" >
        { item, : .reportCount };
    {
        item.reportCount === 1 ? 'report' : 'reports';
    }
    /span>;
}
/div>
    < div;
className = "comment-preview" >
    { item, : .comment.content }
    < /div>;
{
    item.autoFlags.length > 0 && className;
    "auto-flags" >
        { item, : .autoFlags.map((flag, idx) => key = { idx }, className = {} `flag ${flag.type}`) } >
        { flag, : .type }({ Math, : .round(flag.confidence * 100) } % )
        < /span>;
}
/div>;
{
    item.suggestedAction && className;
    "suggested-action" >
        Suggested;
    {
        item.suggestedAction;
    }
    /div>;
}
/div>
    < div;
className = "item-actions" >
    onClick;
{
    () => handleAction('approve');
}
disabled = { isProcessing };
className = "action-button approve"
    >
        Approve
    < /button>
    < button;
onClick = {}();
handleAction('reject');
disabled = { isProcessing };
className = "action-button reject"
    >
        Reject
    < /button>
    < button;
onClick = {}();
handleAction('spam');
disabled = { isProcessing };
className = "action-button spam"
    >
        Spam
    < /button>
    < /div>
    < /div>;
;
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
function ModerationActions({ commentId, onAction, compact = false, className = '' }) {
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const handleAction = async (action) => {
        setIsProcessing(true);
        try {
            await onAction(commentId, action);
        }
        finally {
            setIsProcessing(false);
        }
    };
    const actions = [
        { action: 'approve', label: '✓', variant: 'success' },
        { action: 'reject', label: '✗', variant: 'danger' },
        { action: 'spam', label: '🚫', variant: 'warning' },
        { action: 'flag', label: '⚑', variant: 'info' }
    ];
    if (compact) {
        return className = {} `moderation-actions compact ${className}`;
    }
     >
        { actions, : .map(({ action, label, variant }) => key = { action }, onClick = {}(), handleAction(action)) };
    disabled = { isProcessing };
    className = {} `action-btn ${variant}`;
}
title = { action };
aria - label;
{
    action;
}
    >
        { label }
    < /button>;
/div>;
;
return className = {} `moderation-actions ${className}`;
 >
    { actions, : .map(({ action, label, variant }) => key = { action }, onClick = {}(), handleAction(action)) };
disabled = { isProcessing };
className = {} `action-button ${variant}`;
    >
        { action }
    < /button>;
/div>;
;
// ============================================================================
// Exports
// ============================================================================
exports.default = {
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
//# sourceMappingURL=comments-moderation-kit.js.map