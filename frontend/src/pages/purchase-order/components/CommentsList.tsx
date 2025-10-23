/**
 * CommentsList Component
 * 
 * Comments List for purchase-order module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface CommentsListProps {
  className?: string;
}

/**
 * CommentsList component - Comments List
 */
const CommentsList: React.FC<CommentsListProps> = ({ className = '' }) => {
  return (
    <div className={`comments-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Comments List functionality</p>
          <p className="text-sm mt-2">Connected to purchase-order Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default CommentsList;
