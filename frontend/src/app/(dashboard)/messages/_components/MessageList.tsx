/**
 * MessageList Component
 * Container for displaying list of messages
 */

'use client';

import React from 'react';
import { MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HealthcareMessage } from './types/message.types';
import { MessageListItem } from './MessageListItem';

interface MessageListProps {
  messages: HealthcareMessage[];
  selectedMessages: Set<string>;
  onSelectMessage: (messageId: string, selected: boolean) => void;
  onMessageClick: (message: HealthcareMessage) => void;
  onMarkAsRead: (messageId: string) => void;
  onStar: (messageId: string) => void;
  onAcknowledge: (messageId: string) => void;
  onArchive: (messageId: string) => void;
  searchQuery: string;
  filter: string;
}

/**
 * Message list container component
 * Displays filtered messages or empty state
 */
export const MessageList: React.FC<MessageListProps> = ({
  messages,
  selectedMessages,
  onSelectMessage,
  onMessageClick,
  onMarkAsRead,
  onStar,
  onAcknowledge,
  onArchive,
  searchQuery,
  filter
}) => {
  return (
    <Card>
      <div className="divide-y divide-gray-200">
        {messages.length === 0 ? (
          // Empty State
          <div className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-2">
              {searchQuery
                ? 'No messages match your search'
                : filter === 'unread'
                ? "You're all caught up!"
                : 'No messages found'}
            </p>
            <p className="text-sm text-gray-400 mb-4">
              {searchQuery
                ? 'Try adjusting your search terms or filters'
                : 'Start a conversation by sending a new message.'}
            </p>
            <Link href="/messages/new">
              <Button variant="default">
                <Send className="h-4 w-4 mr-2" />
                Send New Message
              </Button>
            </Link>
          </div>
        ) : (
          // Message List
          messages.map((message) => (
            <MessageListItem
              key={message.id}
              message={message}
              isSelected={selectedMessages.has(message.id)}
              onSelect={onSelectMessage}
              onClick={onMessageClick}
              onMarkAsRead={onMarkAsRead}
              onStar={onStar}
              onAcknowledge={onAcknowledge}
              onArchive={onArchive}
            />
          ))
        )}
      </div>
    </Card>
  );
};
