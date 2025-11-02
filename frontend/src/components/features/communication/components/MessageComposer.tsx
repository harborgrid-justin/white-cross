'use client';

/**
 * Message Composer Component
 *
 * Rich text message editor with attachments
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Send, Paperclip, X, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createMessage, uploadAttachment } from '@/lib/actions/communications.actions';
import { useTypingIndicator } from '@/lib/socket/SocketContext';
import type { CreateMessageInput, MessagePriority, Attachment } from '@/lib/validations/message.schemas';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MessageComposerProps {
  recipientIds?: string[];
  threadId?: string;
  replyToId?: string;
  onSent?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function MessageComposer({
  recipientIds = [],
  threadId,
  replyToId,
  onSent,
  onCancel,
  className
}: MessageComposerProps) {
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState<MessagePriority>('normal');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { startTyping, stopTyping } = useTypingIndicator(threadId, recipientIds);

  const handleBodyChange = (value: string) => {
    setBody(value);
    if (value.length > 0) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: `${file.name} exceeds 10MB limit`
        });
        continue;
      }

      // Upload file
      const result = await uploadAttachment(file);

      if (result.success && result.data) {
        setAttachments(prev => [
          ...prev,
          {
            id: result.data!.id,
            fileName: result.data!.fileName,
            fileSize: file.size,
            fileType: file.type,
            fileUrl: result.data!.fileUrl
          }
        ]);
      } else {
        toast({
          variant: 'destructive',
          title: 'Upload failed',
          description: result.error || `Failed to upload ${file.name}`
        });
      }
    }

    setIsUploading(false);
    // Reset input
    e.target.value = '';
  }, [toast]);

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId));
  };

  const handleSend = async () => {
    if (!body.trim()) {
      toast({
        variant: 'destructive',
        title: 'Message required',
        description: 'Please enter a message'
      });
      return;
    }

    if (recipientIds.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Recipients required',
        description: 'Please select at least one recipient'
      });
      return;
    }

    setIsSending(true);
    stopTyping();

    const messageData: CreateMessageInput = {
      recipientIds,
      subject: subject.trim() || '(No subject)',
      body: body.trim(),
      priority,
      threadId,
      replyToId,
      attachments,
      containsPhi: false, // Could implement PHI detection
      requireReadReceipt: false
    };

    const result = await createMessage(messageData);

    if (result.success) {
      toast({
        title: 'Message sent',
        description: 'Your message has been delivered'
      });

      // Reset form
      setSubject('');
      setBody('');
      setPriority('normal');
      setAttachments([]);

      onSent?.();
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to send message',
        description: result.error
      });
    }

    setIsSending(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Subject */}
      {!threadId && (
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Enter subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
      )}

      {/* Priority */}
      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={(v) => setPriority(v as MessagePriority)}>
          <SelectTrigger id="priority" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Message Body */}
      <div className="space-y-2">
        <Label htmlFor="body">Message</Label>
        <Textarea
          id="body"
          placeholder="Type your message..."
          value={body}
          onChange={(e) => handleBodyChange(e.target.value)}
          rows={8}
          className="resize-none"
        />
      </div>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <Label>Attachments</Label>
          <div className="space-y-2">
            {attachments.map(attachment => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm truncate">{attachment.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.fileSize)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={() => handleRemoveAttachment(attachment.id!)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isUploading || isSending || attachments.length >= 5}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Paperclip className="h-4 w-4 mr-2" />
            )}
            Attach Files
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
          />
          {attachments.length >= 5 && (
            <p className="text-xs text-muted-foreground">
              Maximum 5 attachments
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isSending}
            >
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSend}
            disabled={isSending || !body.trim()}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}


