/**
 * LOC: USACE-DOWNSTREAM-DRW-001
 * File: /reuse/frontend/composites/usace/downstream/design-review-workflows.ts
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  useDesignReviewWorkflow,
  type DesignReviewComment,
  type ReviewType,
} from '../usace-engineering-design-composites';

export function DesignReviewDashboard({
  projectId,
  onCommentResolve,
}: {
  projectId: string;
  onCommentResolve?: (comment: DesignReviewComment) => void;
}) {
  const {
    comments,
    submitComment,
    respondToComment,
    getCommentsByReviewType,
    getMandatoryComments,
    getOpenComments,
  } = useDesignReviewWorkflow(projectId);

  const [filterType, setFilterType] = useState<ReviewType | 'all'>('all');
  const [responseText, setResponseText] = useState('');

  const openComments = useMemo(() => getOpenComments(), [getOpenComments]);
  const mandatoryComments = useMemo(() => getMandatoryComments(), [getMandatoryComments]);

  const filteredComments = useMemo(() => {
    return filterType === 'all' ? comments : getCommentsByReviewType(filterType);
  }, [comments, filterType, getCommentsByReviewType]);

  return (
    <div className="design-review-dashboard p-6">
      <h2 className="text-2xl font-bold mb-4">Design Review Dashboard</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Comments</div>
          <div className="text-3xl font-bold">{comments.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Open Comments</div>
          <div className="text-3xl font-bold text-orange-600">{openComments.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Mandatory</div>
          <div className="text-3xl font-bold text-red-600">{mandatoryComments.length}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <label className="block text-sm font-medium mb-2">Filter by Review Type</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as ReviewType | 'all')}
          className="w-full border rounded-lg p-2"
        >
          <option value="all">All Types</option>
          <option value="biddability_constructability_operability_sustainability">BCOS</option>
          <option value="antiterrorism_force_protection">AT/FP</option>
          <option value="value_engineering">Value Engineering</option>
          <option value="red_team">Red Team</option>
          <option value="peer_review">Peer Review</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-xl font-bold">Review Comments ({filteredComments.length})</h3>
        </div>
        <div className="divide-y">
          {filteredComments.map(comment => (
            <div key={comment.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="inline-block px-2 py-1 rounded text-xs font-bold mb-2 bg-orange-100 text-orange-800">
                    {comment.category.toUpperCase()}
                  </div>
                  <div className="font-bold">Comment #{comment.commentNumber}</div>
                  <div className="text-sm text-gray-600">{comment.reviewType.replace(/_/g, ' ')}</div>
                </div>
                <div className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                  {comment.status.toUpperCase()}
                </div>
              </div>

              <div className="mb-2">
                <div className="text-sm font-medium text-gray-600">Description:</div>
                <div className="text-gray-700">{comment.description}</div>
              </div>

              <div className="mb-2">
                <div className="text-sm font-medium text-gray-600">Recommendation:</div>
                <div className="text-gray-700">{comment.recommendation}</div>
              </div>

              {comment.response && (
                <div className="mt-3 p-3 bg-green-50 rounded">
                  <div className="text-sm font-medium text-gray-600">Response:</div>
                  <div className="text-gray-700">{comment.response}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    By {comment.responseBy} on {comment.responseDate?.toLocaleDateString()}
                  </div>
                </div>
              )}

              {comment.status === 'open' && (
                <div className="mt-3">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Enter response..."
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg mb-2"
                  />
                  <button
                    onClick={() => {
                      respondToComment(comment.id, responseText, 'Current User');
                      setResponseText('');
                      if (onCommentResolve) onCommentResolve(comment);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Submit Response
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default { DesignReviewDashboard };
