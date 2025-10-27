'use client';

/**
 * Broadcast Manager Component
 *
 * Admin interface for managing broadcasts with targeting and scheduling
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';
import type { Broadcast } from '@/lib/validations/broadcast.schemas';
import { cancelBroadcastAction, deleteBroadcastAction } from '@/lib/actions/communications.actions';
import { toast } from 'sonner';

interface BroadcastManagerProps {
  broadcasts: Broadcast[];
  onRefresh?: () => Promise<void>;
  className?: string;
}

type StatusFilter = 'all' | 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';

export function BroadcastManager({
  broadcasts: initialBroadcasts,
  onRefresh,
  className
}: BroadcastManagerProps) {
  const router = useRouter();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(initialBroadcasts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Filter and search broadcasts
  const filteredBroadcasts = useMemo(() => {
    let result = [...broadcasts];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.message.toLowerCase().includes(query) ||
        b.targetAudience.type.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(b => b.status === statusFilter);
    }

    // Sort by created date descending
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result;
  }, [broadcasts, searchQuery, statusFilter]);

  const handleView = (broadcast: Broadcast) => {
    router.push(`/communications/broadcasts/${broadcast.id}`);
  };

  const handleEdit = (broadcast: Broadcast) => {
    if (broadcast.status === 'draft' || broadcast.status === 'scheduled') {
      router.push(`/communications/broadcasts/${broadcast.id}/edit`);
    } else {
      toast.error('Cannot edit a broadcast that has been sent');
    }
  };

  const handleDuplicate = (broadcast: Broadcast) => {
    // Navigate to new broadcast with pre-filled data
    router.push(`/communications/broadcasts/new?duplicate=${broadcast.id}`);
  };

  const handleCancel = async (broadcast: Broadcast) => {
    if (broadcast.status !== 'scheduled') {
      toast.error('Can only cancel scheduled broadcasts');
      return;
    }

    try {
      await cancelBroadcastAction({ broadcastId: broadcast.id });
      setBroadcasts(prev =>
        prev.map(b =>
          b.id === broadcast.id ? { ...b, status: 'cancelled' as const } : b
        )
      );
      toast.success('Broadcast cancelled');
    } catch (error) {
      toast.error('Failed to cancel broadcast');
    }
  };

  const handleDelete = async (broadcast: Broadcast) => {
    if (broadcast.status === 'sending' || broadcast.status === 'sent') {
      toast.error('Cannot delete a broadcast that has been sent');
      return;
    }

    try {
      await deleteBroadcastAction({ broadcastId: broadcast.id });
      setBroadcasts(prev => prev.filter(b => b.id !== broadcast.id));
      toast.success('Broadcast deleted');
    } catch (error) {
      toast.error('Failed to delete broadcast');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      draft: 'secondary',
      scheduled: 'default',
      sending: 'warning',
      sent: 'success',
      cancelled: 'destructive'
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  const getDeliveryProgress = (broadcast: Broadcast) => {
    if (!broadcast.stats) return 0;
    const { totalRecipients, delivered } = broadcast.stats;
    return totalRecipients > 0 ? (delivered / totalRecipients) * 100 : 0;
  };

  const getAcknowledgmentProgress = (broadcast: Broadcast) => {
    if (!broadcast.stats || !broadcast.requireAcknowledgment) return 0;
    const { totalRecipients, acknowledged } = broadcast.stats;
    return totalRecipients > 0 ? (acknowledged / totalRecipients) * 100 : 0;
  };

  // Statistics summary
  const stats = useMemo(() => {
    const total = broadcasts.length;
    const draft = broadcasts.filter(b => b.status === 'draft').length;
    const scheduled = broadcasts.filter(b => b.status === 'scheduled').length;
    const sent = broadcasts.filter(b => b.status === 'sent').length;
    const totalRecipients = broadcasts.reduce((sum, b) => sum + (b.stats?.totalRecipients || 0), 0);

    return { total, draft, scheduled, sent, totalRecipients };
  }, [broadcasts]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Broadcasts</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduled}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecipients.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search broadcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
          <SelectTrigger className="w-[160px]">
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

        <Button onClick={() => router.push('/communications/broadcasts/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Broadcast
        </Button>
      </div>

      {/* Broadcasts Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBroadcasts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Megaphone className="h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">No broadcasts found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBroadcasts.map((broadcast) => (
                <TableRow key={broadcast.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{broadcast.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {broadcast.message}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm capitalize">
                        {broadcast.targetAudience.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(broadcast.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {broadcast.sendAt ? (
                        <>
                          <p>{format(new Date(broadcast.sendAt), 'MMM d, yyyy')}</p>
                          <p className="text-muted-foreground">
                            {format(new Date(broadcast.sendAt), 'h:mm a')}
                          </p>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Immediate</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {broadcast.status === 'sent' && broadcast.stats && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Progress value={getDeliveryProgress(broadcast)} className="h-2 w-20" />
                          <span className="text-xs text-muted-foreground">
                            {broadcast.stats.delivered}/{broadcast.stats.totalRecipients}
                          </span>
                        </div>
                        {broadcast.requireAcknowledgment && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {broadcast.stats.acknowledged} acknowledged
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {broadcast.stats && (
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{broadcast.stats.read} read</span>
                        </div>
                        <div className="text-muted-foreground">
                          {((broadcast.stats.read / broadcast.stats.totalRecipients) * 100).toFixed(0)}% rate
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(broadcast)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {(broadcast.status === 'draft' || broadcast.status === 'scheduled') && (
                          <DropdownMenuItem onClick={() => handleEdit(broadcast)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDuplicate(broadcast)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {broadcast.status === 'scheduled' && (
                          <DropdownMenuItem onClick={() => handleCancel(broadcast)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel
                          </DropdownMenuItem>
                        )}
                        {(broadcast.status === 'draft' || broadcast.status === 'cancelled') && (
                          <DropdownMenuItem
                            onClick={() => handleDelete(broadcast)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
