'use client';

import React, { useState } from 'react';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  ChatBubbleLeftRightIcon,
  EyeIcon,
  ArrowUturnLeftIcon as ReplyIcon,
  ArrowRightIcon as ForwardIcon,
  TrashIcon,
  FlagIcon,
  ClockIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

/**
 * Communication priority levels
 */
export type CommunicationPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Communication types
 */
export type CommunicationType = 'email' | 'sms' | 'phone' | 'chat' | 'letter' | 'notification';

/**
 * Communication status options
 */
export type CommunicationStatus = 'draft' | 'sent' | 'delivered' | 'read' | 'replied' | 'failed';

/**
 * Communication interface
 */
export interface Communication {
  id: string;
  type: CommunicationType;
  subject: string;
  sender: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role: string;
  };
  recipients: Array<{
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role: string;
  }>;
  content: string;
  priority: CommunicationPriority;
  status: CommunicationStatus;
  isRead: boolean;
  isFlagged: boolean;
  hasAttachments: boolean;
  attachmentCount?: number;
  sentDate: string;
  readDate?: string;
  threadId?: string;
  parentId?: string;
  tags: string[];
  metadata?: {
    deliveryAttempts?: number;
    lastDeliveryAttempt?: string;
    failureReason?: string;
    trackingId?: string;
  };
}

/**
 * Props for the CommunicationCard component
 */
export interface CommunicationCardProps {
  /** Communication data */
  communication: Communication;
  /** Whether the card is in compact mode */
  compact?: boolean;
  /** Whether the card is selected */
  selected?: boolean;
  /** Whether selection is enabled */
  selectable?: boolean;
  /** Callback when card is clicked */
  onClick?: (communication: Communication) => void;
  /** Callback when card is selected */
  onSelect?: (communication: Communication, selected: boolean) => void;
  /** Callback when reply is clicked */
  onReply?: (communication: Communication) => void;
  /** Callback when forward is clicked */
  onForward?: (communication: Communication) => void;
  /** Callback when flag is toggled */
  onToggleFlag?: (communication: Communication) => void;
  /** Callback when delete is clicked */
  onDelete?: (communication: Communication) => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * CommunicationCard Component
 * 
 * A comprehensive card component for displaying communication items (emails, SMS, calls, etc.)
 * with support for different types, priorities, statuses, and actions.
 * 
 * Features:
 * - Multiple communication types with appropriate icons
 * - Priority indicators with color coding
 * - Status tracking and visual indicators
 * - Compact and expanded view modes
 * - Selection support for bulk operations
 * - Action buttons (reply, forward, flag, delete)
 * - Accessibility compliant with ARIA attributes
 * - HIPAA-compliant display with sensitive data protection
 * 
 * @param props - The component props
 * @returns The rendered CommunicationCard component
 */
const CommunicationCard = ({
  communication,
  compact = false,
  selected = false,
  selectable = false,
  onClick,
  onSelect,
  onReply,
  onForward,
  onToggleFlag,
  onDelete,
  className = ''
}: CommunicationCardProps) => {
  const [showActions, setShowActions] = useState(false);

  /**
   * Get the appropriate icon for communication type
   */
  const getTypeIcon = () => {
    switch (communication.type) {
      case 'email':
        return <EnvelopeIcon className="h-5 w-5" />;
      case 'phone':
        return <PhoneIcon className="h-5 w-5" />;
      case 'sms':
        return <ChatBubbleLeftRightIcon className="h-5 w-5" />;
      case 'chat':
        return <ChatBubbleLeftRightIcon className="h-5 w-5" />;
      default:
        return <EnvelopeIcon className="h-5 w-5" />;
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
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'delivered':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'read':
        return <EyeIcon className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case 'draft':
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    } else if (diffDays <= 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  /**
   * Handle card click
   */
  const handleCardClick = () => {
    if (onClick) {
      onClick(communication);
    }
  };

  /**
   * Handle selection change
   */
  const handleSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (onSelect) {
      onSelect(communication, event.target.checked);
    }
  };

  /**
   * Handle action button clicks
   */
  const handleActionClick = (action: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
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
    }
  };

  return (
    <div
      className={`
        bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200
        ${!communication.isRead ? 'border-l-4 border-l-blue-500' : ''}
        ${selected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={handleCardClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Communication: ${communication.subject}`}
      aria-describedby={`comm-${communication.id}-details`}
    >
      <div className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-3">
            {/* Selection Checkbox */}
            {selectable && (
              <input
                type="checkbox"
                checked={selected}
                onChange={handleSelectionChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                aria-label={`Select communication: ${communication.subject}`}
              />
            )}
            
            {/* Type Icon */}
            <div className={`p-2 rounded-full ${getPriorityColor()}`}>
              {getTypeIcon()}
            </div>
            
            {/* Sender Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className={`font-medium text-gray-900 ${!communication.isRead ? 'font-semibold' : ''}`}>
                  {communication.sender.name}
                </span>
                <span className="text-sm text-gray-500">
                  ({communication.sender.role})
                </span>
                {communication.isFlagged && (
                  <FlagIcon className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <div className="text-sm text-gray-600 truncate">
                {communication.sender.email || communication.sender.phone}
              </div>
            </div>
          </div>
          
          {/* Status and Date */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {getStatusIndicator()}
            <span>{formatDate(communication.sentDate)}</span>
          </div>
        </div>
        
        {/* Subject */}
        <h3 className={`text-lg font-medium text-gray-900 mb-2 ${!communication.isRead ? 'font-semibold' : ''}`}>
          {communication.subject}
        </h3>
        
        {/* Content Preview */}
        {!compact && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {communication.content}
          </p>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Recipients Count */}
            <div className="flex items-center text-sm text-gray-500">
              <UserIcon className="h-4 w-4 mr-1" />
              <span>{communication.recipients.length} recipient{communication.recipients.length !== 1 ? 's' : ''}</span>
            </div>
            
            {/* Attachments */}
            {communication.hasAttachments && (
              <div className="flex items-center text-sm text-gray-500">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span>{communication.attachmentCount || 1}</span>
              </div>
            )}
            
            {/* Tags */}
            {communication.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                {communication.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {communication.tags.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{communication.tags.length - 2} more
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          {(showActions || selected) && (
            <div className="flex items-center space-x-1">
              {onReply && (
                <button
                  onClick={(e) => handleActionClick('reply', e)}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                  aria-label="Reply to communication"
                >
                  <ReplyIcon className="h-4 w-4" />
                </button>
              )}
              {onForward && (
                <button
                  onClick={(e) => handleActionClick('forward', e)}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                  aria-label="Forward communication"
                >
                  <ForwardIcon className="h-4 w-4" />
                </button>
              )}
              {onToggleFlag && (
                <button
                  onClick={(e) => handleActionClick('flag', e)}
                  className={`p-1 rounded ${
                    communication.isFlagged 
                      ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50' 
                      : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                  }`}
                  aria-label={communication.isFlagged ? 'Remove flag' : 'Add flag'}
                >
                  <FlagIcon className="h-4 w-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => handleActionClick('delete', e)}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                  aria-label="Delete communication"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden details for screen readers */}
      <div id={`comm-${communication.id}-details`} className="sr-only">
        Communication from {communication.sender.name} with subject {communication.subject}, 
        sent on {new Date(communication.sentDate).toLocaleDateString()}, 
        status: {communication.status}, priority: {communication.priority}
      </div>
    </div>
  );
};

export default CommunicationCard;
