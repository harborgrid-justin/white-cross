/**
 * @fileoverview Message List Component - Display list of messages
 * @module app/(dashboard)/communications/_components/MessageList
 * @category Communications - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';
import { type Message } from '@/lib/validations/message.schemas';
import { MessageCard } from './MessageCard';

interface MessageListProps {
  messages: Message[];
  onFilter?: () => void;
  onSearch?: () => void;
  onViewMessage?: (messageId: string) => void;
  onReplyMessage?: (messageId: string) => void;
  onForwardMessage?: (messageId: string) => void;
}

export function MessageList({
  messages,
  onFilter,
  onSearch,
  onViewMessage,
  onReplyMessage,
  onForwardMessage
}: MessageListProps) {
  return (
    <Card>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
            <p className="text-sm text-gray-500">
              Manage and track communication across all channels
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onFilter}
              aria-label="Filter messages"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSearch}
              aria-label="Search messages"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="p-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No messages found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onView={onViewMessage}
                onReply={onReplyMessage}
                onForward={onForwardMessage}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
