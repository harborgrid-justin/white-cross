/**
 * Broadcasts Content Component
 *
 * Client component for broadcasts list
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Radio } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { getBroadcasts } from '@/lib/actions/communications.actions';
import type { Broadcast, BroadcastStatus } from '@/lib/validations/broadcast.schemas';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/Skeleton';
import { format } from 'date-fns';

export function BroadcastsContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BroadcastStatus | 'all'>('all');

  useEffect(() => {
    loadBroadcasts();
  }, [statusFilter]);

  const loadBroadcasts = async () => {
    setIsLoading(true);

    const result = await getBroadcasts({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchQuery || undefined,
      limit: 50,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });

    if (result.success && result.data) {
      setBroadcasts(result.data.broadcasts);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to load broadcasts'
      });
    }

    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadBroadcasts();
  };

  const getStatusBadge = (status: BroadcastStatus) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case 'sending':
        return <Badge className="bg-yellow-500">Sending</Badge>;
      case 'sent':
        return <Badge variant="default">Sent</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return <Badge variant="destructive">Emergency</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">High</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Broadcasts</h1>
          <p className="text-muted-foreground mt-1">
            Send announcements to multiple recipients
          </p>
        </div>
        <Button onClick={() => router.push('/communications/broadcasts/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Broadcast
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search broadcasts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {/* Filter */}
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as BroadcastStatus | 'all')}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="sending">Sending</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Broadcasts List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : broadcasts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Radio className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No broadcasts</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first broadcast to get started
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push('/communications/broadcasts/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Broadcast
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {broadcasts.map(broadcast => (
            <Card
              key={broadcast.id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => router.push(`/communications/broadcasts/${broadcast.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{broadcast.title}</h3>
                      {getStatusBadge(broadcast.status)}
                      {getPriorityBadge(broadcast.priority)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {broadcast.message}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>By {broadcast.senderName}</span>
                    <span>
                      {broadcast.sentAt
                        ? `Sent ${format(new Date(broadcast.sentAt), 'PPp')}`
                        : broadcast.scheduledFor
                        ? `Scheduled for ${format(new Date(broadcast.scheduledFor), 'PPp')}`
                        : `Created ${format(new Date(broadcast.createdAt), 'PPp')}`}
                    </span>
                  </div>
                  {broadcast.stats && (
                    <div className="flex items-center gap-4">
                      <span>
                        {broadcast.stats.delivered}/{broadcast.stats.totalRecipients} delivered
                      </span>
                      <span>{broadcast.stats.read} read</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
