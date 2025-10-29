'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { MessageSquare, Send, Inbox, Archive, Star, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate loading messages
    setLoading(false);
    setMessages([]);
  }, [filter, searchQuery]);

  const stats = {
    unread: 7,
    total: 0,
    starred: 0,
    archived: 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="View and manage your messages"
      >
        <Link href="/messages/new">
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </Link>
      </PageHeader>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.unread}</p>
              </div>
              <Inbox className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Starred</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.starred}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Archived</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.archived}</p>
              </div>
              <Archive className="h-8 w-8 text-gray-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'unread'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unread ({stats.unread})
              </button>
              <button
                onClick={() => setFilter('starred')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'starred'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Starred
              </button>
              <button
                onClick={() => setFilter('archived')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'archived'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Archived
              </button>
            </div>

            {/* Search */}
            <div className="w-full md:w-80">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search messages..."
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Messages List */}
      <Card>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No messages found</p>
              <p className="text-sm text-gray-400 mt-2">
                {filter === 'unread'
                  ? "You're all caught up! No unread messages."
                  : "Start a conversation by sending a new message."}
              </p>
              <Link href="/messages/new">
                <Button variant="primary" className="mt-4">
                  <Send className="h-4 w-4 mr-2" />
                  Send New Message
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {/* Message preview */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{message.from}</span>
                        {message.unread && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-900 font-medium mb-1">{message.subject}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{message.preview}</p>
                      <p className="text-xs text-gray-500 mt-2">{message.date}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {message.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Archive className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
