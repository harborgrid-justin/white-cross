/**
 * Inbox Content Component
 *
 * Client component for inbox functionality
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Archive, MailOpen, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageList } from '@/components/communications/MessageList';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getMessageThreads,
  archiveMessages,
  deleteMessages,
  markMessageAsRead
} from '@/lib/actions/communications.actions';
import type { MessageThread, MessageStatus } from '@/lib/validations/message.schemas';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export function InboxContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MessageStatus | 'all'>('all');

  useEffect(() => {
    loadThreads();
  }, [statusFilter]);

  const loadThreads = async () => {
    setIsLoading(true);

    const result = await getMessageThreads({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchQuery || undefined,
      limit: 50,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });

    if (result.success && result.data) {
      setThreads(result.data.threads);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to load messages'
      });
    }

    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadThreads();
  };

  const handleArchive = async () => {
    if (selectedIds.length === 0) return;

    const result = await archiveMessages(selectedIds);

    if (result.success) {
      toast({
        title: 'Messages archived',
        description: `${selectedIds.length} message(s) archived`
      });
      setSelectedIds([]);
      loadThreads();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to archive messages'
      });
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    const result = await deleteMessages(selectedIds, false);

    if (result.success) {
      toast({
        title: 'Messages deleted',
        description: `${selectedIds.length} message(s) deleted`
      });
      setSelectedIds([]);
      loadThreads();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to delete messages'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inbox</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your messages
          </p>
        </div>
        <Button onClick={() => router.push('/communications/compose')}>
          <Plus className="h-4 w-4 mr-2" />
          Compose
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {/* Filter */}
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as MessageStatus | 'all')}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messages</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleArchive}>
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Message List */}
      <div className="border rounded-lg bg-card">
        {isLoading ? (
          <div className="space-y-1 p-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <MessageList
            messages={threads.map(thread => ({
              id: thread.id,
              senderId: '',
              senderName: thread.participants[0]?.name || 'Unknown',
              senderEmail: thread.participants[0]?.email || '',
              recipientIds: thread.participantIds,
              recipients: thread.participants,
              subject: thread.subject,
              body: thread.lastMessagePreview || '',
              priority: 'normal' as const,
              type: 'direct' as const,
              status: thread.hasUnread ? 'sent' as const : 'read' as const,
              attachments: [],
              readReceipts: [],
              containsPhi: false,
              isEncrypted: false,
              requireReadReceipt: false,
              createdAt: thread.createdAt,
              updatedAt: thread.updatedAt,
              sentAt: thread.lastMessageAt
            }))}
            selectedIds={selectedIds}
            onSelect={setSelectedIds}
            onMessageClick={(message) => router.push(`/communications/messages/${message.id}`)}
            selectable
          />
        )}
      </div>
    </div>
  );
}
