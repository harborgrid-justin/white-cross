'use client';

import React, { useState } from 'react';
import { MessageSquare, User, Trash2, Paperclip } from 'lucide-react';
import { ComplianceCommentsProps } from './types';

/**
 * ComplianceComments Component
 *
 * Manages comments for a compliance requirement. Supports adding new comments,
 * viewing existing comments with attachments, and deleting comments. Displays
 * an empty state when no comments are present.
 *
 * @param props - ComplianceComments component props
 * @returns JSX element representing the compliance comments tab
 */
const ComplianceComments: React.FC<ComplianceCommentsProps> = ({
  comments,
  onAddComment,
  onDeleteComment
}) => {
  const [newComment, setNewComment] = useState('');

  /**
   * Handles adding a new comment
   */
  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment?.(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Comments</h3>

      {/* Add Comment Form */}
      <div className="bg-gray-50 rounded-lg p-4">
        <textarea
          value={newComment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
          rows={3}
          placeholder="Add a comment..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                   focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white
                     bg-blue-600 border border-transparent rounded-md hover:bg-blue-700
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post Comment
          </button>
        </div>
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">{comment.authorName}</p>
                    {comment.isSystem && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        System
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{comment.content}</p>

                {comment.attachments && comment.attachments.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {comment.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center space-x-2 px-2 py-1 bg-gray-100 rounded text-xs"
                        >
                          <Paperclip className="w-3 h-3" />
                          <span>{attachment.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => onDeleteComment?.(comment.id)}
                className="p-1 text-gray-400 hover:text-red-600 rounded"
                aria-label="Delete comment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Comments</h3>
          <p className="text-gray-600">Start a conversation about this requirement.</p>
        </div>
      )}
    </div>
  );
};

export default ComplianceComments;
