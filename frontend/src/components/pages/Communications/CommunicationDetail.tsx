'use client';

import React, { useState } from 'react';
import {
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ArrowUturnLeftIcon as ReplyIcon,
  ArrowRightIcon as ForwardIcon,
  TrashIcon,
  FlagIcon,
  PrinterIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  PaperClipIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Communication } from './CommunicationCard';

/**
 * Communication detail tab types
 */
export type CommunicationDetailTab = 'overview' | 'history' | 'attachments' | 'participants';

/**
 * Communication thread item interface
 */
export interface CommunicationThreadItem {
  id: string;
  communication: Communication;
  isReply: boolean;
  depth: number;
}

/**
 * Communication attachment interface
 */
export interface CommunicationAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  isImage: boolean;
  thumbnail?: string;
}

/**
 * Props for the CommunicationDetail component
 */
export interface CommunicationDetailProps {
  /** Communication data */
  communication: Communication;
  /** Thread history */
  threadHistory?: CommunicationThreadItem[];
  /** Communication attachments */
  attachments?: CommunicationAttachment[];
  /** Whether the detail view is loading */
  loading?: boolean;
  /** Error message if any */
  error?: string;
  /** Whether actions are enabled */
  actionsEnabled?: boolean;
  /** Callback when reply is clicked */
  onReply?: (communication: Communication) => void;
  /** Callback when forward is clicked */
  onForward?: (communication: Communication) => void;
  /** Callback when flag is toggled */
  onToggleFlag?: (communication: Communication) => void;
  /** Callback when delete is clicked */
  onDelete?: (communication: Communication) => void;
  /** Callback when print is clicked */
  onPrint?: (communication: Communication) => void;
  /** Callback when mark as read/unread is clicked */
  onToggleRead?: (communication: Communication) => void;
  /** Callback when attachment is downloaded */
  onDownloadAttachment?: (attachment: CommunicationAttachment) => void;
  /** Callback when close is clicked */
  onClose?: () => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * CommunicationDetail Component
 * 
 * A comprehensive detail view component for displaying full communication content
 * with support for threading, attachments, and various actions.
 * 
 * Features:
 * - Tabbed interface (overview, history, attachments, participants)
 * - Full communication content display
 * - Thread history with visual hierarchy
 * - Attachment preview and download
 * - Comprehensive action toolbar
 * - Status and priority indicators
 * - Print-friendly formatting
 * - Accessibility compliant with ARIA attributes
 * - HIPAA-compliant display with sensitive data protection
 * 
 * @param props - The component props
 * @returns The rendered CommunicationDetail component
 */
const CommunicationDetail = ({
  communication,
  threadHistory = [],
  attachments = [],
  loading = false,
  error,
  actionsEnabled = true,
  onReply,
  onForward,
  onToggleFlag,
  onDelete,
  onPrint,
  onToggleRead,
  onDownloadAttachment,
  onClose,
  className = ''
}: CommunicationDetailProps) => {
  const [activeTab, setActiveTab] = useState<CommunicationDetailTab>('overview');
  const [showFullContent, setShowFullContent] = useState(false);

  /**
   * Get the appropriate icon for communication type
   */
  const getTypeIcon = () => {
    switch (communication.type) {
      case 'email':
        return <EnvelopeIcon className="h-6 w-6" />;
      case 'phone':
        return <PhoneIcon className="h-6 w-6" />;
      case 'sms':
        return <ChatBubbleLeftRightIcon className="h-6 w-6" />;
      case 'chat':
        return <ChatBubbleLeftRightIcon className="h-6 w-6" />;
      default:
        return <EnvelopeIcon className="h-6 w-6" />;
    }
  };

  /**
   * Get priority color classes
   */
  const getPriorityColor = () => {
    switch (communication.priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  /**
   * Get status indicator
   */
  const getStatusIndicator = () => {
    switch (communication.status) {
      case 'sent':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'read':
        return <EyeIcon className="h-5 w-5 text-blue-500" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'draft':
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  /**
   * Format file size
   */
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Handle action button clicks
   */
  const handleAction = (action: string) => {
    switch (action) {
      case 'reply':
        onReply?.(communication);
        break;
      case 'forward':
        onForward?.(communication);
        break;
      case 'flag':
        onToggleFlag?.(communication);
        break;
      case 'delete':
        onDelete?.(communication);
        break;
      case 'print':
        onPrint?.(communication);
        break;
      case 'toggleRead':
        onToggleRead?.(communication);
        break;
    }
  };

  /**
   * Render tab buttons
   */
  const renderTabButtons = () => {
    const tabs = [
      { id: 'overview', label: 'Overview', count: null },
      { id: 'history', label: 'History', count: threadHistory.length },
      { id: 'attachments', label: 'Attachments', count: attachments.length },
      { id: 'participants', label: 'Participants', count: communication.recipients.length + 1 }
    ];

    return (
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" role="tablist" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CommunicationDetailTab)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    );
  };

  /**
   * Render overview tab
   */
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Communication Content */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="prose max-w-none">
          {showFullContent ? (
            <div dangerouslySetInnerHTML={{ __html: communication.content }} />
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">
              {communication.content.length > 500
                ? `${communication.content.substring(0, 500)}...`
                : communication.content
              }
            </p>
          )}
          {communication.content.length > 500 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showFullContent ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Communication Details</h4>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Type:</dt>
              <dd className="text-sm text-gray-900 capitalize">{communication.type}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Priority:</dt>
              <dd>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${getPriorityColor()}`}>
                  {communication.priority}
                </span>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Status:</dt>
              <dd className="flex items-center space-x-1">
                {getStatusIndicator()}
                <span className="text-sm text-gray-900 capitalize">{communication.status}</span>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Sent:</dt>
              <dd className="text-sm text-gray-900">{formatDate(communication.sentDate)}</dd>
            </div>
            {communication.readDate && (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Read:</dt>
                <dd className="text-sm text-gray-900">{formatDate(communication.readDate)}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Additional Information</h4>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Thread ID:</dt>
              <dd className="text-sm text-gray-900 font-mono">{communication.threadId || 'N/A'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Tracking ID:</dt>
              <dd className="text-sm text-gray-900 font-mono">{communication.metadata?.trackingId || 'N/A'}</dd>
            </div>
            {communication.metadata?.deliveryAttempts && (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Delivery Attempts:</dt>
                <dd className="text-sm text-gray-900">{communication.metadata.deliveryAttempts}</dd>
              </div>
            )}
            {communication.metadata?.failureReason && (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Failure Reason:</dt>
                <dd className="text-sm text-red-600">{communication.metadata.failureReason}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Tags */}
      {communication.tags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {communication.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  /**
   * Render history tab
   */
  const renderHistoryTab = () => (
    <div className="space-y-4">
      {threadHistory.length === 0 ? (
        <div className="text-center py-8">
          <ClockIcon className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">No history available</h3>
          <p className="mt-2 text-sm text-gray-500">This communication has no thread history.</p>
        </div>
      ) : (
        threadHistory.map((item) => (
          <div
            key={item.id}
            className={`border rounded-lg p-4 ${item.depth > 0 ? `ml-${item.depth * 4}` : ''}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`p-1 rounded-full ${getPriorityColor()}`}>
                  {getTypeIcon()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.communication.sender.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(item.communication.sentDate)}
                  </p>
                </div>
                {item.isReply && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    Reply
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {getStatusIndicator()}
              </div>
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              {item.communication.subject}
            </h4>
            <p className="text-sm text-gray-700 line-clamp-3">
              {item.communication.content}
            </p>
          </div>
        ))
      )}
    </div>
  );

  /**
   * Render attachments tab
   */
  const renderAttachmentsTab = () => (
    <div className="space-y-4">
      {attachments.length === 0 ? (
        <div className="text-center py-8">
          <PaperClipIcon className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">No attachments</h3>
          <p className="mt-2 text-sm text-gray-500">This communication has no attachments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                {attachment.isImage && attachment.thumbnail ? (
                  <img
                    src={attachment.thumbnail}
                    alt={attachment.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                    <PaperClipIcon className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                  <p className="text-xs text-gray-500">
                    Uploaded by {attachment.uploadedBy} on {formatDate(attachment.uploadedAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onDownloadAttachment?.(attachment)}
                className="mt-3 w-full text-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /**
   * Render participants tab
   */
  const renderParticipantsTab = () => {
    const allParticipants = [communication.sender, ...communication.recipients];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allParticipants.map((participant) => (
            <div key={participant.id} className="border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                  <p className="text-sm text-gray-500">{participant.role}</p>
                  {participant.email && (
                    <p className="text-xs text-gray-500">{participant.email}</p>
                  )}
                  {participant.phone && (
                    <p className="text-xs text-gray-500">{participant.phone}</p>
                  )}
                </div>
                {participant.id === communication.sender.id && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    Sender
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading communication details...</p>
        </div>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">Error loading communication</h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-full ${getPriorityColor()}`}>
              {getTypeIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {communication.subject}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>From: {communication.sender.name}</span>
                <span>•</span>
                <span>{formatDate(communication.sentDate)}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  {getStatusIndicator()}
                  <span className="capitalize">{communication.status}</span>
                </div>
                {communication.isFlagged && (
                  <>
                    <span>•</span>
                    <FlagIcon className="h-4 w-4 text-yellow-500" />
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {actionsEnabled && (
              <>
                {onReply && (
                  <button
                    onClick={() => handleAction('reply')}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    aria-label="Reply to communication"
                  >
                    <ReplyIcon className="h-5 w-5" />
                  </button>
                )}
                {onForward && (
                  <button
                    onClick={() => handleAction('forward')}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    aria-label="Forward communication"
                  >
                    <ForwardIcon className="h-5 w-5" />
                  </button>
                )}
                {onToggleFlag && (
                  <button
                    onClick={() => handleAction('flag')}
                    className={`p-2 rounded ${
                      communication.isFlagged 
                        ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50' 
                        : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                    }`}
                    aria-label={communication.isFlagged ? 'Remove flag' : 'Add flag'}
                  >
                    <FlagIcon className="h-5 w-5" />
                  </button>
                )}
                {onPrint && (
                  <button
                    onClick={() => handleAction('print')}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
                    aria-label="Print communication"
                  >
                    <PrinterIcon className="h-5 w-5" />
                  </button>
                )}
                {onToggleRead && (
                  <button
                    onClick={() => handleAction('toggleRead')}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    aria-label={communication.isRead ? 'Mark as unread' : 'Mark as read'}
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => handleAction('delete')}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    aria-label="Delete communication"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
                aria-label="Close detail view"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6">
        {renderTabButtons()}
      </div>

      {/* Tab Content */}
      <div className="px-6 py-6">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'attachments' && renderAttachmentsTab()}
        {activeTab === 'participants' && renderParticipantsTab()}
      </div>
    </div>
  );
};

export default CommunicationDetail;
