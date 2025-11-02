/**
 * Message Detail Content Component
 *
 * Client component for viewing message details
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Reply, Archive, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageComposer } from '@/components/features/communication/components/MessageComposer';
import {
  getMessageById,
  markMessageAsRead,
  archiveMessages,
  deleteMessages
} from '@/lib/actions/communications.actions';
import type { Message } from '@/lib/validations/message.schemas';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface MessageDetailContentProps {
  messageId: string;
}

export function MessageDetailContent({ messageId }: MessageDetailContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    loadMessage();
  }, [messageId]);

  const loadMessage = async () => {
    setIsLoading(true);

    const result = await getMessageById(messageId);

    if (result.success && result.data) {
      setMessage(result.data);

      // Mark as read
      if (result.data.status !== 'read' && !result.data.readAt) {
        await markMessageAsRead(messageId, result.data.threadId);
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to load message'
      });
      router.back();
    }

    setIsLoading(false);
  };

  const handleArchive = async () => {
    if (!message) return;

    const result = await archiveMessages([message.id]);

    if (result.success) {
      toast({
        title: 'Message archived',
        description: 'Message has been archived'
      });
      router.push('/communications');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to archive message'
      });
    }
  };

  const handleDelete = async () => {
    if (!message) return;

    const result = await deleteMessages([message.id], false);

    if (result.success) {
      toast({
        title: 'Message deleted',
        description: 'Message has been deleted'
      });
      router.push('/communications');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to delete message'
      });
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">High</Badge>;
      case 'normal':
        return <Badge variant="secondary">Normal</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
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

  if (!message) {
    return null;
  }

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
            <h1 className="text-3xl font-bold">{message.subject}</h1>
            <p className="text-muted-foreground mt-1">
              {format(new Date(message.createdAt), 'PPpp')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsReplying(!isReplying)}
          >
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleArchive}
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Message */}
      <Card>
        <CardContent className="pt-6">
          {/* Metadata */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={message.senderAvatarUrl} />
                <AvatarFallback>
                  {message.senderName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{message.senderName}</p>
                  {getPriorityBadge(message.priority)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {message.senderEmail}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  To: {message.recipients.map(r => r.name).join(', ')}
                </p>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Body */}
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: message.body }}
          />

          {/* Attachments */}
          {message.attachments.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="space-y-2">
                <p className="font-semibold">Attachments</p>
                <div className="space-y-2">
                  {message.attachments.map(attachment => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{attachment.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {(attachment.fileSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Read Receipts */}
          {message.readReceipts.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="space-y-2">
                <p className="font-semibold">Read By</p>
                <div className="text-sm text-muted-foreground">
                  {message.readReceipts.map(receipt => (
                    <p key={receipt.userId}>
                      Read at {format(new Date(receipt.readAt), 'PPpp')}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Reply Form */}
      {isReplying && (
        <Card>
          <CardContent className="pt-6">
            <MessageComposer
              recipientIds={[message.senderId]}
              threadId={message.threadId}
              replyToId={message.id}
              onSent={() => {
                setIsReplying(false);
                loadMessage();
              }}
              onCancel={() => setIsReplying(false)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
