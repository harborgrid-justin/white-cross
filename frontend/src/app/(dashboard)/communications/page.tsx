'use client';

import React, { useState, useEffect } from 'react';
import { CommunicationsApi, type Message } from '@/services/modules/communicationsApi';
import { apiClient } from '@/services/core/ApiClient';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Send, Search, Filter, Plus } from 'lucide-react';

/**
 * Communications Main Page
 * 
 * Comprehensive communications management dashboard for messages,
 * notifications, and communication history.
 */
export default function CommunicationsPage() {
  const [communications, setCommunications] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const { toast } = useToast();
  const communicationsApi = new CommunicationsApi(apiClient);

  /**
   * Load communications data from API
   */
  useEffect(() => {
    const loadCommunications = async () => {
      setLoading(true);
      
      try {
        const filters: Record<string, string | number> = {};
        
        if (searchTerm.trim()) {
          filters.search = searchTerm.trim();
        }
        
        if (selectedType) {
          filters.priority = selectedType;
        }
        
        if (selectedStatus) {
          filters.status = selectedStatus;
        }
        
        const response = await communicationsApi.getMessages(filters);
        setCommunications(response.data || []);
      } catch (error) {
        console.error('Failed to load communications:', error);
        toast({
          title: 'Error',
          description: 'Failed to load communications. Please try again.',
          variant: 'destructive',
        });
        setCommunications([]);
      } finally {
        setLoading(false);
      }
    };

    loadCommunications();
  }, [searchTerm, selectedType, selectedStatus, toast]);

  const handleCreateCommunication = () => {
    window.location.href = '/dashboard/communications/new';
  };

  const handleViewCommunication = (communication: Message) => {
    window.location.href = `/dashboard/communications/${communication.id}`;
  };

  const handleSendMessage = () => {
    window.location.href = '/dashboard/communications/compose';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      sent: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeStyles = {
      message: 'bg-blue-100 text-blue-800',
      notification: 'bg-purple-100 text-purple-800',
      alert: 'bg-red-100 text-red-800',
      reminder: 'bg-orange-100 text-orange-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeStyles[type as keyof typeof typeStyles] || typeStyles.message}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Communications</h1>
              <p className="text-gray-600 mt-2">Manage messages, notifications, and communication history</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSendMessage}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </button>
              <button
                onClick={handleCreateCommunication}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Communication
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search Communications
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                placeholder="Search by subject, recipient..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Communication Type
              </label>
              <select
                id="type"
                value={selectedType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="message">Message</option>
                <option value="notification">Notification</option>
                <option value="alert">Alert</option>
                <option value="reminder">Reminder</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="sent">Sent</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Communications List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : communications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No communications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by sending a new message or creating a communication.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {communications.map((communication) => (
                <div
                  key={communication.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleViewCommunication(communication)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {communication.subject}
                        </h3>
                        {getTypeBadge(communication.priority || 'NORMAL')}
                        {getStatusBadge(communication.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        To: {communication.recipientName}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {communication.body}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{formatDate(communication.createdAt)}</p>
                      {communication.sentAt && (
                        <p className="text-xs">Sent: {formatDate(communication.sentAt)}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700">Total Communications</h3>
            <p className="text-2xl font-bold text-blue-600">{communications.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700">Sent Today</h3>
            <p className="text-2xl font-bold text-green-600">
              {communications.filter(c => 
                c.status === 'SENT' && 
                new Date(c.sentAt || '').toDateString() === new Date().toDateString()
              ).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700">Draft</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {communications.filter(c => c.status === 'DRAFT').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700">Archived</h3>
            <p className="text-2xl font-bold text-red-600">
              {communications.filter(c => c.status === 'ARCHIVED').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
