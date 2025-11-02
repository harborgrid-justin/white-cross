'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Reply, Forward, Star, Archive, Trash2, Paperclip, Clock } from 'lucide-react';

interface Message {
  id: string;
  from: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  to: Array<{
    id: string;
    name: string;
  }>;
  subject: string;
  content: string;
  timestamp: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
  }>;
  isRead: boolean;
  isStarred: boolean;
  threadId: string;
  replyTo?: string;
}

interface MessageThreadProps {
  messages: Message[];
  onReply: (messageId: string) => void;
  onForward: (messageId: string) => void;
  onStar: (messageId: string) => void;
  onArchive: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onMarkAsRead: (messageId: string) => void;
}

export function MessageThread({
  messages,
  onReply,
  onForward,
  onStar,
  onArchive,
  onDelete,
  onMarkAsRead,
}: MessageThreadProps) {
  // Mark messages as read when viewed
  useEffect(() => {
    messages.forEach(message => {
      if (!message.isRead) {
        onMarkAsRead(message.id);
      }
    });
  }, [messages, onMarkAsRead]);

  const getPriorityColor = (priority: Message['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return timestamp.toLocaleDateString();
  };

  const sortedMessages = [...messages].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedMessages.map((message, index) => (
        <Card key={message.id} className="relative">
          <div className="p-6">
            {/* Message Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <Avatar
                  src={message.from.avatar}
                  alt={message.from.name}
                  size="sm"
                  shape="circle"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      {message.from.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {message.from.role}
                    </span>
                    {message.priority !== 'normal' && (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getPriorityColor(message.priority)}`}>
                        {message.priority.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>To: {message.to.map(recipient => recipient.name).join(', ')}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Actions */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onStar(message.id)}
                  className={`p-1 hover:bg-gray-200 rounded ${message.isStarred ? 'text-yellow-500' : 'text-gray-400'}`}
                  aria-label={message.isStarred ? 'Unstar message' : 'Star message'}
                >
                  <Star className={`h-4 w-4 ${message.isStarred ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => onReply(message.id)}
                  className="p-1 hover:bg-gray-200 rounded text-gray-500"
                  aria-label="Reply to message"
                >
                  <Reply className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onForward(message.id)}
                  className="p-1 hover:bg-gray-200 rounded text-gray-500"
                  aria-label="Forward message"
                >
                  <Forward className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onArchive(message.id)}
                  className="p-1 hover:bg-gray-200 rounded text-gray-500"
                  aria-label="Archive message"
                >
                  <Archive className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(message.id)}
                  className="p-1 hover:bg-gray-200 rounded text-red-500 hover:text-red-700"
                  aria-label="Delete message"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Subject */}
            {index === 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {message.subject}
                </h3>
              </div>
            )}

            {/* Message Content */}
            <div className="prose prose-sm max-w-none mb-4">
              <div className="whitespace-pre-wrap text-gray-700">
                {message.content}
              </div>
            </div>

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Paperclip className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {message.attachments.length} attachment{message.attachments.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-1">
                  {message.attachments.map(attachment => (
                    <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700">{attachment.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(attachment.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                        aria-label="Download attachment"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reply Indicator */}
            {message.replyTo && (
              <div className="text-xs text-gray-500 border-l-2 border-gray-200 pl-3 mb-4">
                In reply to message from {messages.find(m => m.id === message.replyTo)?.from.name}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}


