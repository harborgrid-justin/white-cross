'use client';

/**
 * Message Inbox Component
 *
 * Advanced inbox with filtering, sorting, virtual scrolling, and real-time updates
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  Mail,
  MailOpen,
  Inbox,
  Send,
  Archive,
  Trash2,
  Star,
  Filter,
  Search,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { MessageList } from './MessageList';
import { useSocket } from '@/lib/socket/SocketContext';
import type { Message } from '@/lib/validations/message.schemas';
import { markAsReadAction, archiveMessageAction, deleteMessageAction } from '@/lib/actions/communications.actions';
import { toast } from 'sonner';

interface MessageInboxProps {
  initialMessages?: Message[];
  folder?: 'inbox' | 'sent' | 'archived' | 'starred';
  onRefresh?: () => Promise<void>;
  className?: string;
}

type SortOption = 'date-desc' | 'date-asc' | 'sender' | 'subject' | 'priority';
type FilterOption = 'all' | 'unread' | 'read' | 'starred' | 'attachments' | 'urgent';

export function MessageInbox({
  initialMessages = [],
  folder = 'inbox',
  onRefresh,
  className
}: MessageInboxProps) {
  const router = useRouter();
  const { onMessage } = useSocket();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Virtual scrolling setup
  const parentRef = React.useRef<HTMLDivElement>(null);

  // Real-time message updates
  useEffect(() => {
    const unsubscribe = onMessage((newMessage) => {
      // Add new message to the list if it belongs to current folder
      if (folder === 'inbox' || (folder === 'sent' && newMessage.direction === 'outgoing')) {
        setMessages(prev => [newMessage, ...prev]);

        // Show toast notification
        if (folder === 'inbox' && newMessage.direction === 'incoming') {
          toast.info(`New message from ${newMessage.senderName}`, {
            description: newMessage.subject
          });
        }
      }
    });

    return unsubscribe;
  }, [onMessage, folder]);

  // Filter messages
  const filteredMessages = useMemo(() => {
    let result = [...messages];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(msg =>
        msg.subject.toLowerCase().includes(query) ||
        msg.senderName.toLowerCase().includes(query) ||
        msg.body.toLowerCase().includes(query)
      );
    }

    // Status filter
    switch (filterBy) {
      case 'unread':
        result = result.filter(msg => msg.status !== 'read' && !msg.readAt);
        break;
      case 'read':
        result = result.filter(msg => msg.status === 'read' || msg.readAt);
        break;
      case 'starred':
        result = result.filter(msg => msg.isStarred);
        break;
      case 'attachments':
        result = result.filter(msg => msg.attachments && msg.attachments.length > 0);
        break;
      case 'urgent':
        result = result.filter(msg => msg.priority === 'urgent' || msg.priority === 'high');
        break;
    }

    // Sort messages
    switch (sortBy) {
      case 'date-desc':
        result.sort((a, b) => new Date(b.sentAt || b.createdAt).getTime() - new Date(a.sentAt || a.createdAt).getTime());
        break;
      case 'date-asc':
        result.sort((a, b) => new Date(a.sentAt || a.createdAt).getTime() - new Date(b.sentAt || b.createdAt).getTime());
        break;
      case 'sender':
        result.sort((a, b) => a.senderName.localeCompare(b.senderName));
        break;
      case 'subject':
        result.sort((a, b) => a.subject.localeCompare(b.subject));
        break;
      case 'priority':
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
        result.sort((a, b) => priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]);
        break;
    }

    return result;
  }, [messages, searchQuery, filterBy, sortBy]);

  // Virtual list setup
  const virtualizer = useVirtualizer({
    count: filteredMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh?.();
      toast.success('Inbox refreshed');
    } catch (error) {
      toast.error('Failed to refresh inbox');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMessageClick = (message: Message) => {
    // Mark as read optimistically
    if (message.status !== 'read' && !message.readAt) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === message.id
            ? { ...msg, status: 'read' as const, readAt: new Date().toISOString() }
            : msg
        )
      );

      // Mark as read on server
      markAsReadAction({ messageIds: [message.id] });
    }

    // Navigate to message detail
    router.push(`/communications/messages/${message.id}`);
  };

  const handleBulkAction = async (action: 'read' | 'archive' | 'delete') => {
    if (selectedIds.length === 0) return;

    try {
      switch (action) {
        case 'read':
          await markAsReadAction({ messageIds: selectedIds });
          setMessages(prev =>
            prev.map(msg =>
              selectedIds.includes(msg.id)
                ? { ...msg, status: 'read' as const, readAt: new Date().toISOString() }
                : msg
            )
          );
          toast.success(`Marked ${selectedIds.length} messages as read`);
          break;
        case 'archive':
          for (const id of selectedIds) {
            await archiveMessageAction({ messageId: id });
          }
          setMessages(prev => prev.filter(msg => !selectedIds.includes(msg.id)));
          toast.success(`Archived ${selectedIds.length} messages`);
          break;
        case 'delete':
          for (const id of selectedIds) {
            await deleteMessageAction({ messageId: id });
          }
          setMessages(prev => prev.filter(msg => !selectedIds.includes(msg.id)));
          toast.success(`Deleted ${selectedIds.length} messages`);
          break;
      }
      setSelectedIds([]);
    } catch (error) {
      toast.error(`Failed to ${action} messages`);
    }
  };

  const unreadCount = messages.filter(msg => msg.status !== 'read' && !msg.readAt).length;

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Inbox className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold capitalize">{folder}</h2>
          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount} unread</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => router.push('/communications/compose')}
          >
            Compose
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter */}
        <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
          <SelectTrigger className="w-[140px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="starred">Starred</SelectItem>
            <SelectItem value="attachments">With Attachments</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="sender">Sender</SelectItem>
            <SelectItem value="subject">Subject</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-b">
          <span className="text-sm font-medium">{selectedIds.length} selected</span>
          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBulkAction('read')}
            >
              <MailOpen className="h-4 w-4 mr-2" />
              Mark Read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBulkAction('archive')}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBulkAction('delete')}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds([])}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Message List */}
      <div ref={parentRef} className="flex-1 overflow-auto">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Mail className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || filterBy !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Your inbox is empty'}
            </p>
          </div>
        ) : (
          <MessageList
            messages={filteredMessages}
            selectedIds={selectedIds}
            onSelect={setSelectedIds}
            onMessageClick={handleMessageClick}
            selectable
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t bg-card text-sm text-muted-foreground">
        <span>{filteredMessages.length} messages</span>
        {filteredMessages.length !== messages.length && (
          <span>{messages.length} total</span>
        )}
      </div>
    </div>
  );
}
