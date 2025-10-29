'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/layout/Card';
import { Avatar } from '@/components/ui/Avatar';
import {
  Inbox,
  Send,
  FileText,
  Trash2,
  Archive,
  Star,
  Paperclip,
  CheckSquare,
  Square
} from 'lucide-react';

interface Message {
  id: string;
  from: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  to: Array<{
    id: string;
    name: string;
  }>;
  subject: string;
  preview: string;
  timestamp: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
  }>;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  threadId: string;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'archive';
}

interface MessageListProps {
  messages: Message[];
  selectedMessageIds: string[];
  currentFolder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'archive';
  searchQuery: string;
  onMessageSelect: (messageId: string, selected: boolean) => void;
  onMessageClick: (messageId: string) => void;
  onBulkSelect: (selectAll: boolean) => void;
  onStar: (messageId: string) => void;
  onArchive: (messageIds: string[]) => void;
  onDelete: (messageIds: string[]) => void;
  onMarkAsRead: (messageIds: string[]) => void;
  onMarkAsUnread: (messageIds: string[]) => void;
  onSearchChange: (query: string) => void;
}

const folderIcons = {
  inbox: Inbox,
  sent: Send,
  drafts: FileText,
  trash: Trash2,
  archive: Archive,
};

export function MessageList({
  messages,
  selectedMessageIds,
  currentFolder,
  searchQuery,
  onMessageSelect,
  onMessageClick,
  onBulkSelect,
  onStar,
  onArchive,
  onDelete,
  onMarkAsRead,
  onMarkAsUnread,
  onSearchChange,
}: MessageListProps) {
  const [sortBy, setSortBy] = useState<'date' | 'sender' | 'subject'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedMessages = useMemo(() => {
    const filtered = messages.filter(message => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          message.subject.toLowerCase().includes(query) ||
          message.from.name.toLowerCase().includes(query) ||
          message.preview.toLowerCase().includes(query)
        );
      }
      return true;
    });

    // Sort messages
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'sender':
          comparison = a.from.name.localeCompare(b.from.name);
          break;
        case 'subject':
          comparison = a.subject.localeCompare(b.subject);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [messages, searchQuery, sortBy, sortOrder]);

  const getPriorityColor = (priority: Message['priority']) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'normal': return 'border-l-blue-500';
      case 'low': return 'border-l-gray-500';
      default: return 'border-l-gray-500';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return timestamp.toLocaleDateString();
  };

  const FolderIcon = folderIcons[currentFolder];
  const allSelected = filteredAndSortedMessages.length > 0 &&
    selectedMessageIds.length === filteredAndSortedMessages.length;

  return (
    <div className="space-y-4">
      {/* Header with folder info and bulk actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FolderIcon className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900 capitalize">
            {currentFolder}
          </h2>
          <span className="text-sm text-gray-500">
            ({filteredAndSortedMessages.length} messages)
          </span>
        </div>

        {selectedMessageIds.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {selectedMessageIds.length} selected
            </span>
            <button
              onClick={() => onMarkAsRead(selectedMessageIds)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Mark as Read
            </button>
            <button
              onClick={() => onMarkAsUnread(selectedMessageIds)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Mark as Unread
            </button>
            <button
              onClick={() => onArchive(selectedMessageIds)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Archive
            </button>
            <button
              onClick={() => onDelete(selectedMessageIds)}
              className="px-3 py-1 text-sm border-red-300 text-red-600 rounded-md hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                aria-label="Sort messages by"
              >
                <option value="date">Sort by Date</option>
                <option value="sender">Sort by Sender</option>
                <option value="subject">Sort by Subject</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Select */}
      <Card>
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onBulkSelect(!allSelected)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              {allSelected ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              <span>{allSelected ? 'Deselect all' : 'Select all'}</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Messages List */}
      <div className="space-y-1">
        {filteredAndSortedMessages.length === 0 ? (
          <Card>
            <div className="p-8 text-center">
              <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No messages found</p>
              <p className="text-sm text-gray-400 mt-2">
                {searchQuery ? 'Try adjusting your search terms.' : `Your ${currentFolder} is empty.`}
              </p>
            </div>
          </Card>
        ) : (
          filteredAndSortedMessages.map((message) => (
            <Card
              key={message.id}
              className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                !message.isRead ? 'bg-blue-50 border-blue-200' : ''
              } ${getPriorityColor(message.priority)} border-l-4`}
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Checkbox */}
                  <div className="pt-1">
                    <button
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onMessageSelect(message.id, !selectedMessageIds.includes(message.id));
                      }}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label={`Select message from ${message.from.name}`}
                    >
                      {selectedMessageIds.includes(message.id) ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Avatar */}
                  <Avatar
                    src={message.from.avatar}
                    alt={message.from.name}
                    size="sm"
                    shape="circle"
                  />

                  {/* Message Content */}
                  <div className="flex-1 min-w-0" onClick={() => onMessageClick(message.id)}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <span className={`font-semibold truncate ${
                          message.isRead ? 'text-gray-900' : 'text-gray-900'
                        }`}>
                          {message.from.name}
                        </span>
                        {message.priority !== 'normal' && (
                          <span className={`px-2 py-0.5 text-xs font-medium rounded border ${
                            message.priority === 'urgent' ? 'text-red-600 bg-red-50 border-red-200' :
                            message.priority === 'high' ? 'text-orange-600 bg-orange-50 border-orange-200' :
                            'text-gray-600 bg-gray-50 border-gray-200'
                          }`}>
                            {message.priority.toUpperCase()}
                          </span>
                        )}
                        {!message.isRead && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            New
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTimestamp(message.timestamp)}
                        </span>
                        <button
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onStar(message.id);
                          }}
                          className={`p-1 rounded ${
                            message.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'
                          }`}
                          aria-label={message.isStarred ? 'Unstar message' : 'Star message'}
                        >
                          <Star className={`h-3 w-3 ${message.isStarred ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-1">
                      <h3 className={`text-sm font-medium truncate ${
                        message.isRead ? 'text-gray-900' : 'text-gray-900 font-semibold'
                      }`}>
                        {message.subject}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate flex-1 ${
                        message.isRead ? 'text-gray-600' : 'text-gray-700'
                      }`}>
                        {message.preview}
                      </p>

                      <div className="flex items-center space-x-1 ml-4">
                        {message.hasAttachments && (
                          <Paperclip className="h-3 w-3 text-gray-400" />
                        )}
                        {message.attachments && message.attachments.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {message.attachments.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}