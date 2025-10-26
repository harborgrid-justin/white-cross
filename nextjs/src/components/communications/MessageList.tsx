'use client';

/**
 * Message List Component
 *
 * List of messages with filtering and selection
 */

'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Mail, MailOpen, Paperclip, Flag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/validations/message.schemas';

interface MessageListProps {
  messages: Message[];
  selectedIds?: string[];
  onSelect?: (messageIds: string[]) => void;
  onMessageClick?: (message: Message) => void;
  selectable?: boolean;
  className?: string;
}

export function MessageList({
  messages,
  selectedIds = [],
  onSelect,
  onMessageClick,
  selectable = false,
  className
}: MessageListProps) {
  const handleSelectMessage = (messageId: string, checked: boolean) => {
    if (!onSelect) return;

    if (checked) {
      onSelect([...selectedIds, messageId]);
    } else {
      onSelect(selectedIds.filter(id => id !== messageId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onSelect) return;

    if (checked) {
      onSelect(messages.map(m => m.id));
    } else {
      onSelect([]);
    }
  };

  const isRead = (message: Message) => {
    return message.status === 'read' || message.readAt !== undefined;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'normal':
        return 'text-blue-500';
      case 'low':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <Mail className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No messages</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Your inbox is empty
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      {/* Select All */}
      {selectable && messages.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 border-b">
          <Checkbox
            checked={selectedIds.length === messages.length && messages.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedIds.length > 0
              ? `${selectedIds.length} selected`
              : 'Select all'}
          </span>
        </div>
      )}

      {/* Messages */}
      {messages.map(message => (
        <div
          key={message.id}
          className={cn(
            'flex items-start gap-3 px-4 py-3 border-b transition-colors cursor-pointer',
            'hover:bg-accent',
            !isRead(message) && 'bg-blue-50 dark:bg-blue-950/20',
            selectedIds.includes(message.id) && 'bg-accent'
          )}
          onClick={() => onMessageClick?.(message)}
        >
          {/* Checkbox */}
          {selectable && (
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedIds.includes(message.id)}
                onCheckedChange={(checked) => handleSelectMessage(message.id, checked as boolean)}
              />
            </div>
          )}

          {/* Icon */}
          <div className="flex-shrink-0 mt-1">
            {isRead(message) ? (
              <MailOpen className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Mail className="h-5 w-5 text-primary" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={cn(
                    'font-medium text-sm truncate',
                    !isRead(message) && 'font-semibold'
                  )}>
                    {message.senderName}
                  </p>
                  {message.priority !== 'normal' && (
                    <Flag className={cn('h-3 w-3', getPriorityColor(message.priority))} />
                  )}
                  {message.attachments.length > 0 && (
                    <Paperclip className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <p className={cn(
                  'text-sm truncate mt-0.5',
                  !isRead(message) ? 'font-medium' : 'text-muted-foreground'
                )}>
                  {message.subject}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                  {message.bodyPlainText || message.body.replace(/<[^>]*>/g, '')}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {message.sentAt
                    ? formatDistanceToNow(new Date(message.sentAt), { addSuffix: true })
                    : formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                </p>
                {!isRead(message) && (
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
