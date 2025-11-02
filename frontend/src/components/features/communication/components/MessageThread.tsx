'use client';

/**
 * Message Thread Component
 *
 * Threaded conversation view with real-time updates
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Reply,
  Forward,
  MoreVertical,
  Paperclip,
  Download,
  Trash2,
  Archive,
  Flag,
  User,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { MessageComposer } from './MessageComposer';
import { useSocket } from '@/lib/socket/SocketContext';
import type { Message } from '@/lib/validations/message.schemas';
import { archiveMessageAction, deleteMessageAction } from '@/lib/actions/communications.actions';
import { toast } from 'sonner';

interface MessageThreadProps {
  threadId: string;
  initialMessages: Message[];
  currentUserId: string;
  onReply?: (message: Message) => void;
  onForward?: (message: Message) => void;
  className?: string;
}

export function MessageThread({
  threadId,
  initialMessages,
  currentUserId,
  onReply,
  onForward,
  className
}: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [showReply, setShowReply] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { onMessage, onTyping } = useSocket();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Real-time message updates
  useEffect(() => {
    const unsubscribe = onMessage((newMessage) => {
      if (newMessage.threadId === threadId) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
        scrollToBottom();
      }
    });

    return unsubscribe;
  }, [onMessage, threadId, scrollToBottom]);

  // Typing indicators
  useEffect(() => {
    const unsubscribe = onTyping((indicator) => {
      if (indicator.threadId === threadId) {
        if (indicator.isTyping) {
          setTypingUsers(prev => {
            if (!prev.includes(indicator.userId)) {
              return [...prev, indicator.userId];
            }
            return prev;
          });
        } else {
          setTypingUsers(prev => prev.filter(id => id !== indicator.userId));
        }
      }
    });

    return unsubscribe;
  }, [onTyping, threadId]);

  // Sort messages chronologically
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.sentAt || a.createdAt).getTime() - new Date(b.sentAt || b.createdAt).getTime()
  );

  const handleReply = (message: Message) => {
    setReplyToMessage(message);
    setShowReply(true);
    onReply?.(message);
  };

  const handleForward = (message: Message) => {
    onForward?.(message);
  };

  const handleArchive = async (message: Message) => {
    try {
      await archiveMessageAction({ messageId: message.id });
      setMessages(prev => prev.filter(m => m.id !== message.id));
      toast.success('Message archived');
    } catch (error) {
      toast.error('Failed to archive message');
    }
  };

  const handleDelete = async (message: Message) => {
    try {
      await deleteMessageAction({ messageId: message.id });
      setMessages(prev => prev.filter(m => m.id !== message.id));
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const downloadAttachment = (attachmentUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = attachmentUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'warning';
      case 'normal':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      {sortedMessages.length > 0 && (
        <div className="p-4 border-b bg-card">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold truncate">
                {sortedMessages[0].subject}
              </h2>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {formatDistanceToNow(new Date(sortedMessages[0].sentAt || sortedMessages[0].createdAt), { addSuffix: true })}
                </span>
                {sortedMessages[0].priority !== 'normal' && (
                  <Badge variant={getPriorityColor(sortedMessages[0].priority)}>
                    {sortedMessages[0].priority}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {sortedMessages.map((message, index) => {
            const isCurrentUser = message.senderId === currentUserId;
            const showDate = index === 0 ||
              new Date(message.sentAt || message.createdAt).toDateString() !==
              new Date(sortedMessages[index - 1].sentAt || sortedMessages[index - 1].createdAt).toDateString();

            return (
              <div key={message.id}>
                {/* Date separator */}
                {showDate && (
                  <div className="flex items-center gap-4 my-4">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(message.sentAt || message.createdAt), 'MMMM d, yyyy')}
                    </span>
                    <Separator className="flex-1" />
                  </div>
                )}

                {/* Message */}
                <Card className={cn(
                  'p-4',
                  isCurrentUser && 'bg-primary/5'
                )}>
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={message.senderAvatar} />
                      <AvatarFallback>
                        {getInitials(message.senderName)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-semibold">{message.senderName}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(message.sentAt || message.createdAt), 'h:mm a')}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleReply(message)}>
                              <Reply className="h-4 w-4 mr-2" />
                              Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleForward(message)}>
                              <Forward className="h-4 w-4 mr-2" />
                              Forward
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleArchive(message)}>
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(message)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Body */}
                      <div
                        className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: message.body }}
                      />

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center gap-2 p-2 border rounded-md hover:bg-accent transition-colors"
                            >
                              <Paperclip className="h-4 w-4 text-muted-foreground" />
                              <span className="flex-1 text-sm truncate">{attachment.filename}</span>
                              <span className="text-xs text-muted-foreground">
                                {(attachment.size / 1024).toFixed(1)} KB
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => downloadAttachment(attachment.url, attachment.filename)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Read Receipt */}
                      {message.readAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Read {formatDistanceToNow(new Date(message.readAt), { addSuffix: true })}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
              <div className="flex gap-1">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce delay-100">•</span>
                <span className="animate-bounce delay-200">•</span>
              </div>
              <span>
                {typingUsers.length === 1
                  ? 'Someone is typing...'
                  : `${typingUsers.length} people are typing...`}
              </span>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Reply Composer */}
      {showReply && (
        <div className="border-t bg-card">
          <div className="p-4">
            {replyToMessage && (
              <div className="mb-3 p-3 bg-muted rounded-md text-sm">
                <p className="font-medium mb-1">
                  Replying to {replyToMessage.senderName}
                </p>
                <p className="text-muted-foreground line-clamp-2">
                  {replyToMessage.bodyPlainText || replyToMessage.body.replace(/<[^>]*>/g, '')}
                </p>
              </div>
            )}
            <MessageComposer
              threadId={threadId}
              replyToId={replyToMessage?.id}
              onSent={() => {
                setShowReply(false);
                setReplyToMessage(null);
              }}
              onCancel={() => {
                setShowReply(false);
                setReplyToMessage(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!showReply && sortedMessages.length > 0 && (
        <div className="p-4 border-t bg-card flex items-center gap-2">
          <Button onClick={() => handleReply(sortedMessages[sortedMessages.length - 1])}>
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </Button>
          <Button
            variant="outline"
            onClick={() => handleForward(sortedMessages[sortedMessages.length - 1])}
          >
            <Forward className="h-4 w-4 mr-2" />
            Forward
          </Button>
        </div>
      )}
    </div>
  );
}


