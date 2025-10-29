'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/layout/Card';
import { Avatar } from '@/components/ui/Avatar';
import { 
  Reply, 
  Forward, 
  Star, 
  Archive, 
  Trash2, 
  Paperclip, 
  Download,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Printer,
  MoreVertical
} from 'lucide-react';

interface Message {
  id: string;
  from: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
    email: string;
  };
  to: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  cc?: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  bcc?: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  subject: string;
  content: string;
  htmlContent?: string;
  timestamp: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
  }>;
  isRead: boolean;
  isStarred: boolean;
  threadId: string;
  replyTo?: string;
  category?: string;
  tags?: string[];
  isEncrypted: boolean;
}

interface MessageDetailProps {
  message: Message;
  onReply: (messageId: string) => void;
  onReplyAll: (messageId: string) => void;
  onForward: (messageId: string) => void;
  onStar: (messageId: string) => void;
  onArchive: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onMarkAsRead: (messageId: string) => void;
  onMarkAsUnread: (messageId: string) => void;
  onPrint: (messageId: string) => void;
  onDownloadAttachment: (attachmentId: string) => void;
  onPreviousMessage?: () => void;
  onNextMessage?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export function MessageDetail({
  message,
  onReply,
  onReplyAll,
  onForward,
  onStar,
  onArchive,
  onDelete,
  onMarkAsRead,
  onMarkAsUnread,
  onPrint,
  onDownloadAttachment,
  onPreviousMessage,
  onNextMessage,
  hasPrevious = false,
  hasNext = false,
}: MessageDetailProps) {
  const [showFullHeaders, setShowFullHeaders] = useState(false);
  const [viewMode, setViewMode] = useState<'html' | 'plain'>('html');

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(timestamp);
  };

  const getPriorityColor = (priority: Message['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('document') || type.includes('word')) return '📝';
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
    if (type.includes('presentation') || type.includes('powerpoint')) return '📽️';
    if (type.includes('text')) return '📄';
    if (type.includes('zip') || type.includes('compressed')) return '🗜️';
    return '📎';
  };

  return (
    <div className="space-y-4">
      {/* Navigation Header */}
      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Navigation arrows */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={onPreviousMessage}
                  disabled={!hasPrevious}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                  aria-label="Previous message"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={onNextMessage}
                  disabled={!hasNext}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                  aria-label="Next message"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="h-4 border-l border-gray-300" />

              {/* Message actions */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onReply(message.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded"
                  aria-label="Reply"
                >
                  <Reply className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onReplyAll(message.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded"
                  aria-label="Reply all"
                >
                  <Reply className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onForward(message.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded"
                  aria-label="Forward"
                >
                  <Forward className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onStar(message.id)}
                  className={`p-2 rounded ${
                    message.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  aria-label={message.isStarred ? 'Unstar' : 'Star'}
                >
                  <Star className={`h-4 w-4 ${message.isStarred ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => onArchive(message.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded"
                  aria-label="Archive"
                >
                  <Archive className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(message.id)}
                  className="p-2 text-red-400 hover:text-red-600 rounded"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* View options */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setViewMode('html')}
                  className={`px-2 py-1 text-xs rounded ${
                    viewMode === 'html' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  HTML
                </button>
                <button
                  onClick={() => setViewMode('plain')}
                  className={`px-2 py-1 text-xs rounded ${
                    viewMode === 'plain' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Plain
                </button>
              </div>

              <div className="h-4 border-l border-gray-300" />

              {/* Additional actions */}
              <button
                onClick={() => message.isRead ? onMarkAsUnread(message.id) : onMarkAsRead(message.id)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded"
                aria-label={message.isRead ? 'Mark as unread' : 'Mark as read'}
              >
                {message.isRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={() => onPrint(message.id)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded"
                aria-label="Print"
              >
                <Printer className="h-4 w-4" />
              </button>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 rounded"
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Message Content */}
      <Card>
        <div className="p-6">
          {/* Message Header */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <Avatar
                  src={message.from.avatar}
                  alt={message.from.name}
                  size="lg"
                  shape="circle"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h1 className="text-lg font-semibold text-gray-900">
                      {message.subject}
                    </h1>
                    {message.priority !== 'normal' && (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getPriorityColor(message.priority)}`}>
                        {message.priority.toUpperCase()}
                      </span>
                    )}
                    {message.isEncrypted && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded">
                        ENCRYPTED
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      <span className="font-medium">From:</span> {message.from.name} &lt;{message.from.email}&gt;
                    </div>
                    <div>
                      <span className="font-medium">To:</span> {message.to.map(recipient => 
                        `${recipient.name} <${recipient.email}>`
                      ).join(', ')}
                    </div>
                    {message.cc && message.cc.length > 0 && (
                      <div>
                        <span className="font-medium">CC:</span> {message.cc.map(recipient => 
                          `${recipient.name} <${recipient.email}>`
                        ).join(', ')}
                      </div>
                    )}
                    {showFullHeaders && message.bcc && message.bcc.length > 0 && (
                      <div>
                        <span className="font-medium">BCC:</span> {message.bcc.map(recipient => 
                          `${recipient.name} <${recipient.email}>`
                        ).join(', ')}
                      </div>
                    )}
                    <div className="flex items-center space-x-4">
                      <div>
                        <span className="font-medium">Date:</span> {formatTimestamp(message.timestamp)}
                      </div>
                      <button
                        onClick={() => setShowFullHeaders(!showFullHeaders)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {showFullHeaders ? 'Show less' : 'Show full headers'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags and Categories */}
            {(message.category || (message.tags && message.tags.length > 0)) && (
              <div className="flex items-center space-x-4 mt-4">
                {message.category && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Category:</span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      {message.category}
                    </span>
                  </div>
                )}
                {message.tags && message.tags.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Tags:</span>
                    <div className="flex space-x-1">
                      {message.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Message Body */}
          <div className="prose prose-sm max-w-none mb-6">
            {viewMode === 'html' && message.htmlContent ? (
              <div 
                dangerouslySetInnerHTML={{ __html: message.htmlContent }}
                className="whitespace-pre-wrap"
              />
            ) : (
              <div className="whitespace-pre-wrap text-gray-700">
                {message.content}
              </div>
            )}
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Paperclip className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {message.attachments.length} attachment{message.attachments.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-2">
                {message.attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getFileIcon(attachment.type)}</span>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{attachment.name}</div>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(attachment.size)} • {attachment.type}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onDownloadAttachment(attachment.id)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reply indicator */}
          {message.replyTo && (
            <div className="border-t border-gray-200 pt-4 mt-6">
              <div className="text-xs text-gray-500 italic">
                This is a reply to a previous message in this conversation.
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}