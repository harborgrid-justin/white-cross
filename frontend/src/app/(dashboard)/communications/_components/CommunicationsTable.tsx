/**
 * Communications Table Component
 *
 * Client-side table with prefetching and real-time updates for healthcare communications
 *
 * @module app/(dashboard)/communications/_components/CommunicationsTable
 * @version 1.0.0
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  Reply, 
  Forward, 
  MessageCircle,
  Mail,
  Phone,
  Bell,
  Users,
  FileText
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableEmptyState,
  TableLoadingState,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ErrorDisplay } from '@/components/shared/errors/ErrorBoundary';
import { getMessages } from '@/lib/actions/communications.actions';
import type { Message, MessageFilter, MessageRecipient } from '@/lib/validations/message.schemas';

interface PaginatedMessagesResponse {
  messages: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CommunicationsTableProps {
  initialData: PaginatedMessagesResponse;
  searchParams: {
    page?: string;
    search?: string;
    type?: string;
    status?: string;
    priority?: string;
  };
}

function getStatusBadgeVariant(status: string) {
  switch (status.toLowerCase()) {
    case 'sent': return 'default';
    case 'delivered': return 'secondary';
    case 'read': return 'default';
    case 'archived': return 'outline';
    case 'draft': return 'secondary';
    case 'deleted': return 'destructive';
    default: return 'secondary';
  }
}

function getPriorityBadgeVariant(priority: string) {
  switch (priority.toLowerCase()) {
    case 'urgent': return 'destructive';
    case 'high': return 'destructive';
    case 'normal': return 'secondary';
    case 'low': return 'outline';
    default: return 'secondary';
  }
}

function getTypeIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'direct': return Mail;
    case 'group': return Users;
    case 'system': return Bell;
    default: return MessageCircle;
  }
}

function getTypeColor(type: string) {
  switch (type.toLowerCase()) {
    case 'direct': return 'text-blue-600';
    case 'group': return 'text-green-600';
    case 'system': return 'text-purple-600';
    default: return 'text-gray-600';
  }
}

export function CommunicationsTable({ initialData, searchParams }: CommunicationsTableProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<PaginatedMessagesResponse>(initialData);

  // Load messages based on search params
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const filter: MessageFilter = {
          limit: 20,
          offset: (parseInt(searchParams.page || '1') - 1) * 20,
          sortBy: 'sentAt',
          sortOrder: 'desc',
          search: searchParams.search,
          type: searchParams.type as 'direct' | 'group' | 'system' | undefined,
          status: searchParams.status as 'draft' | 'sent' | 'delivered' | 'read' | 'archived' | 'deleted' | undefined,
          priority: searchParams.priority as 'low' | 'normal' | 'high' | 'urgent' | undefined,
        };

        const result = await getMessages(filter);
        
        if (result.success && result.data) {
          setData({
            messages: result.data.messages,
            pagination: {
              page: parseInt(searchParams.page || '1'),
              limit: filter.limit || 20,
              total: result.data.total,
              totalPages: Math.ceil(result.data.total / (filter.limit || 20))
            }
          });
        } else {
          throw new Error(result.error || 'Failed to load messages');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load messages'));
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [searchParams]);

  const messages = data.messages || [];
  const pagination = data.pagination;
  const totalMessages = pagination?.total || 0;

  // Update message count in filters
  useEffect(() => {
    const countEl = document.getElementById('message-count');
    if (countEl) {
      countEl.textContent = `${totalMessages} message${totalMessages !== 1 ? 's' : ''} found`;
    }
  }, [totalMessages]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength ? `${content.substring(0, maxLength)}...` : content;
  };

  if (error) {
    return <ErrorDisplay error={error instanceof Error ? error : { message: String(error), name: 'Error' }} onRetry={() => {}} />;
  }

  const currentPage = parseInt(searchParams.page || '1');
  const totalPages = Math.ceil(totalMessages / 20);
  const startIndex = (currentPage - 1) * 20;

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first, last, and current with ellipsis
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-4">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Message</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Status & Priority</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoadingState colSpan={6} />
            ) : messages.length === 0 ? (
              <TableEmptyState colSpan={6} message="No messages found" />
            ) : (
              messages.map((message: Message) => {
                const TypeIcon = getTypeIcon(message.type);
                const isUrgent = message.priority === 'urgent';
                const hasAttachments = message.attachments && message.attachments.length > 0;
                
                return (
                  <TableRow
                    key={message.id}
                    className={isUrgent ? 'border-l-4 border-l-red-500 bg-red-50/50' : ''}
                  >
                    <TableCell className="max-w-md">
                      <div className="space-y-1">
                        <div className={`font-medium ${isUrgent ? 'text-red-900' : 'text-gray-900'}`}>
                          {message.subject}
                          {isUrgent && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              URGENT
                            </Badge>
                          )}
                          {message.containsPhi && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              PHI
                            </Badge>
                          )}
                          {hasAttachments && (
                            <FileText className="h-4 w-4 inline ml-2 text-gray-400" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {truncateContent(message.body)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          From: {message.senderName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TypeIcon className={`h-4 w-4 ${getTypeColor(message.type)}`} />
                        <span className="text-sm font-medium capitalize">{message.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {message.recipients.length} recipient{message.recipients.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        {message.recipients.slice(0, 2).map((recipient: MessageRecipient) => (
                          <div key={recipient.id} className="text-xs text-muted-foreground">
                            {recipient.name}
                            {recipient.role && (
                              <span className="ml-1 text-gray-400">({recipient.role})</span>
                            )}
                          </div>
                        ))}
                        {message.recipients.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{message.recipients.length - 2} more
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={getStatusBadgeVariant(message.status)} className="text-xs capitalize">
                          {message.status}
                        </Badge>
                        <Badge variant={getPriorityBadgeVariant(message.priority)} className="text-xs block w-fit capitalize">
                          {message.priority}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {message.sentAt && (
                          <div className="text-sm">{formatDate(message.sentAt)}</div>
                        )}
                        {message.readAt && (
                          <div className="text-xs text-green-600">
                            Read: {formatDate(message.readAt)}
                          </div>
                        )}
                        {message.expiresAt && (
                          <div className="text-xs text-orange-600">
                            Expires: {formatDate(message.expiresAt)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="View Details"
                        >
                          <Link href={`/dashboard/communications/${message.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Reply"
                          onClick={() => router.push(`/dashboard/communications/compose?replyTo=${message.id}`)}
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Forward"
                          onClick={() => router.push(`/dashboard/communications/compose?forward=${message.id}`)}
                        >
                          <Forward className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
            <span className="font-medium">{Math.min(startIndex + 20, totalMessages)}</span> of{' '}
            <span className="font-medium">{totalMessages}</span> results
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
