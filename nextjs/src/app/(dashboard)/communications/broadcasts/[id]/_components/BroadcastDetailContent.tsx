/**
 * Broadcast Detail Content Component
 *
 * Client component for viewing broadcast details
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, XCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Separator } from '@/components/ui/Separator';
import {
  getBroadcastById,
  cancelBroadcast,
  acknowledgeBroadcast
} from '@/lib/actions/communications.actions';
import type { Broadcast } from '@/lib/validations/broadcast.schemas';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/Skeleton';
import { format } from 'date-fns';

interface BroadcastDetailContentProps {
  broadcastId: string;
}

export function BroadcastDetailContent({ broadcastId }: BroadcastDetailContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [broadcast, setBroadcast] = useState<Broadcast | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBroadcast();
  }, [broadcastId]);

  const loadBroadcast = async () => {
    setIsLoading(true);

    const result = await getBroadcastById(broadcastId);

    if (result.success && result.data) {
      setBroadcast(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to load broadcast'
      });
      router.back();
    }

    setIsLoading(false);
  };

  const handleCancel = async () => {
    if (!broadcast) return;

    const result = await cancelBroadcast(broadcast.id);

    if (result.success) {
      toast({
        title: 'Broadcast cancelled',
        description: 'The broadcast has been cancelled'
      });
      loadBroadcast();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to cancel broadcast'
      });
    }
  };

  const handleAcknowledge = async () => {
    if (!broadcast) return;

    const result = await acknowledgeBroadcast(broadcast.id);

    if (result.success) {
      toast({
        title: 'Acknowledged',
        description: 'You have acknowledged this broadcast'
      });
      loadBroadcast();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!broadcast) {
    return null;
  }

  const deliveryRate = broadcast.stats?.deliveryRate || 0;
  const readRate = broadcast.stats?.readRate || 0;
  const acknowledgmentRate = broadcast.stats?.acknowledgmentRate || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{broadcast.title}</h1>
            <p className="text-muted-foreground mt-1">
              {broadcast.sentAt
                ? `Sent ${format(new Date(broadcast.sentAt), 'PPpp')}`
                : broadcast.scheduledFor
                ? `Scheduled for ${format(new Date(broadcast.scheduledFor), 'PPpp')}`
                : `Created ${format(new Date(broadcast.createdAt), 'PPpp')}`}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {broadcast.status === 'draft' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/communications/broadcasts/${broadcast.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {(broadcast.status === 'scheduled' || broadcast.status === 'sending') && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
          {broadcast.requireAcknowledgment && broadcast.status === 'sent' && (
            <Button
              size="sm"
              onClick={handleAcknowledge}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Acknowledge
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Message */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Message</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={broadcast.status === 'sent' ? 'default' : 'secondary'}>
                  {broadcast.status}
                </Badge>
                <Badge variant={broadcast.priority === 'urgent' || broadcast.priority === 'emergency' ? 'destructive' : 'outline'}>
                  {broadcast.priority}
                </Badge>
                <Badge variant="outline">{broadcast.category}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              {broadcast.message}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        {broadcast.stats && (
          <Card>
            <CardHeader>
              <CardTitle>Delivery Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Delivery Rate</span>
                  <span className="font-semibold">{deliveryRate.toFixed(1)}%</span>
                </div>
                <Progress value={deliveryRate} />
                <p className="text-xs text-muted-foreground mt-1">
                  {broadcast.stats.delivered}/{broadcast.stats.totalRecipients} delivered
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Read Rate</span>
                  <span className="font-semibold">{readRate.toFixed(1)}%</span>
                </div>
                <Progress value={readRate} />
                <p className="text-xs text-muted-foreground mt-1">
                  {broadcast.stats.read}/{broadcast.stats.delivered} read
                </p>
              </div>

              {broadcast.requireAcknowledgment && (
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Acknowledgment Rate</span>
                    <span className="font-semibold">{acknowledgmentRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={acknowledgmentRate} />
                  <p className="text-xs text-muted-foreground mt-1">
                    {broadcast.stats.acknowledged}/{broadcast.stats.totalRecipients} acknowledged
                  </p>
                </div>
              )}

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Recipients</span>
                  <span className="font-semibold">{broadcast.stats.totalRecipients}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-semibold">{broadcast.stats.pending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Failed</span>
                  <span className="font-semibold text-destructive">{broadcast.stats.failed}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle>Broadcast Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground">Sender</p>
              <p className="font-medium">{broadcast.senderName}</p>
              <p className="text-xs text-muted-foreground">{broadcast.senderEmail}</p>
            </div>

            <Separator />

            <div>
              <p className="text-muted-foreground mb-2">Delivery Channels</p>
              <div className="flex flex-wrap gap-2">
                {broadcast.channels.inApp && <Badge variant="outline">In-App</Badge>}
                {broadcast.channels.email && <Badge variant="outline">Email</Badge>}
                {broadcast.channels.sms && <Badge variant="outline">SMS</Badge>}
                {broadcast.channels.push && <Badge variant="outline">Push</Badge>}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-muted-foreground mb-2">Audience</p>
              <Badge>{broadcast.audience.type}</Badge>
            </div>

            <Separator />

            <div className="space-y-1">
              {broadcast.requireAcknowledgment && (
                <p className="text-xs">✓ Requires acknowledgment</p>
              )}
              {broadcast.allowReplies && (
                <p className="text-xs">✓ Replies allowed</p>
              )}
              {broadcast.containsPhi && (
                <p className="text-xs text-orange-500">⚠ Contains PHI</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
