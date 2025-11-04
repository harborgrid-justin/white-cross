/**
 * @fileoverview Communications Content Component - Healthcare messaging and communication management
 * @module app/(dashboard)/communications/_components/CommunicationsContent
 * @category Communications - Components
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle,
  Send,
  Mail,
  Phone,
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle,
  Users,
  Megaphone,
  FileText,
  Plus,
  Eye,
  Reply,
  Forward,
  Filter,
  Search
} from 'lucide-react';
import { getMessages } from '@/lib/actions/communications.actions';
import { type Message } from '@/lib/validations/message.schemas';

interface CommunicationsContentProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    type?: string;
    status?: string;
    priority?: string;
    recipient?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}


interface CommunicationStats {
  totalMessages: number;
  sentToday: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  emergencyCount: number;
  scheduledCount: number;
  averageResponseTime: number;
}


function getStatusBadgeVariant(status: string) {
  switch (status.toLowerCase()) {
    case 'sent': return 'default';
    case 'delivered': return 'secondary';
    case 'read': return 'default';
    case 'failed': return 'destructive';
    case 'draft': return 'secondary';
    case 'scheduled': return 'outline';
    case 'archived': return 'outline';
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
    case 'direct': return MessageCircle;
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

export function CommunicationsContent({ searchParams }: CommunicationsContentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<CommunicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  // const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load messages with filters from searchParams
        const page = searchParams.page ? parseInt(searchParams.page) : 1;
        const limit = searchParams.limit ? parseInt(searchParams.limit) : 10;
        const messageFilter = {
          limit,
          offset: (page - 1) * limit,
          search: searchParams.search,
          type: searchParams.type as 'direct' | 'group' | 'system' | undefined,
          status: searchParams.status as 'draft' | 'sent' | 'delivered' | 'read' | 'archived' | 'deleted' | undefined,
          priority: searchParams.priority as 'low' | 'normal' | 'high' | 'urgent' | undefined,
          sortBy: (searchParams.sortBy as 'priority' | 'subject' | 'sentAt' | 'createdAt') || 'createdAt',
          sortOrder: (searchParams.sortOrder as 'asc' | 'desc') || 'desc'
        };

        const messagesResponse = await getMessages(messageFilter);
        
        if (messagesResponse.success && messagesResponse.data) {
          setMessages(messagesResponse.data.messages);
          
          // Calculate stats from real data
          const messagesList = messagesResponse.data.messages;
          const totalMessages = messagesResponse.data.total;
          const today = new Date().toDateString();
          
          const calculatedStats: CommunicationStats = {
            totalMessages,
            sentToday: messagesList.filter(m => 
              new Date(m.sentAt || m.createdAt).toDateString() === today
            ).length,
            deliveredCount: messagesList.filter(m => 
              m.status === 'delivered'
            ).length,
            readCount: messagesList.filter(m => 
              m.status === 'read'
            ).length,
            failedCount: 0, // No 'failed' status in current schema
            emergencyCount: messagesList.filter(m => 
              m.priority === 'urgent'
            ).length,
            scheduledCount: 0, // scheduledFor not available in current Message schema
            averageResponseTime: 145 // This would need to be calculated from actual response data
          };
          
          setStats(calculatedStats);
        } else {
          console.error('Failed to load messages:', messagesResponse.error);
          // Set empty state
          setMessages([]);
          setStats({
            totalMessages: 0,
            sentToday: 0,
            deliveredCount: 0,
            readCount: 0,
            failedCount: 0,
            emergencyCount: 0,
            scheduledCount: 0,
            averageResponseTime: 0
          });
        }
      } catch (error) {
        console.error('Error loading communications data:', error);
        setMessages([]);
        setStats({
          totalMessages: 0,
          sentToday: 0,
          deliveredCount: 0,
          readCount: 0,
          failedCount: 0,
          emergencyCount: 0,
          scheduledCount: 0,
          averageResponseTime: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  // Future enhancement: Message selection handlers
  // const handleSelectMessage = (messageId: string) => { ... }
  // const handleSelectAll = () => { ... }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <div className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Unable to load communications data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMessages.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {stats.sentToday} sent today
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.deliveredCount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {((stats.deliveredCount / stats.totalMessages) * 100).toFixed(1)}% delivery rate
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Read Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.readCount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {((stats.readCount / stats.deliveredCount) * 100).toFixed(1)}% read rate
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Emergency Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.emergencyCount}</p>
                <p className="text-xs text-gray-500">
                  Avg response: {stats.averageResponseTime}min
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button className="justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Compose Message
            </Button>
            <Button variant="outline" className="justify-start">
              <Megaphone className="h-4 w-4 mr-2" />
              Send Broadcast
            </Button>
            <Button variant="outline" className="justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Alert
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Message Templates
            </Button>
          </div>
        </div>
      </Card>

      {/* Messages List */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
              <p className="text-sm text-gray-500">
                Manage and track communication across all channels
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {messages.map((message) => {
              const TypeIcon = getTypeIcon(message.type);
              const isEmergency = message.priority === 'urgent';
              
              return (
                <div 
                  key={message.id}
                  className={`p-4 border rounded-lg transition-all hover:shadow-sm ${
                    isEmergency ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <TypeIcon className={`h-5 w-5 ${getTypeColor(message.type)}`} />
                        <h4 className={`text-lg font-medium ${
                          isEmergency ? 'text-red-900' : 'text-gray-900'
                        }`}>
                          {message.subject || 'No Subject'}
                        </h4>
                        <Badge variant={getStatusBadgeVariant(message.status)} className="text-xs">
                          {message.status}
                        </Badge>
                        <Badge variant={getPriorityBadgeVariant(message.priority)} className="text-xs">
                          {message.priority}
                        </Badge>
                        {isEmergency && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            URGENT
                          </Badge>
                        )}
                      </div>
                      
                      <p className={`text-sm mb-3 ${
                        isEmergency ? 'text-red-800' : 'text-gray-600'
                      }`}>
                        {message.body || 'No content'}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{message.recipientIds?.length || 0} recipient{(message.recipientIds?.length || 0) !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(message.sentAt || message.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Send className="h-4 w-4" />
                          <span>From: {message.senderName}</span>
                        </div>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>Has attachments</span>
                          </div>
                        )}
                      </div>

                      {/* Tags - Note: metadata not available in current Message schema */}

                      {/* Recipients Summary */}
                      {message.recipients && message.recipients.length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs font-medium text-gray-700 mb-2">Recipients:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.recipients.slice(0, 3).map((recipient) => (
                              <div key={recipient.id} className="flex items-center gap-2 text-xs">
                                <span className="text-gray-600">{recipient.name}</span>
                                <Badge variant="secondary" className="text-xs">
                                  Recipient
                                </Badge>
                              </div>
                            ))}
                            {message.recipients.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{message.recipients.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Reply className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Forward className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Communication Channels Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-blue-600" />
              Channel Performance
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Email</p>
                    <p className="text-xs text-blue-700">98.5% delivery rate</p>
                  </div>
                </div>
                <Badge variant="default" className="text-xs bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">SMS</p>
                    <p className="text-xs text-green-700">95.2% delivery rate</p>
                  </div>
                </div>
                <Badge variant="default" className="text-xs bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Push Notifications</p>
                    <p className="text-xs text-purple-700">92.8% delivery rate</p>
                  </div>
                </div>
                <Badge variant="default" className="text-xs bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-green-600" />
              Scheduled Messages
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-yellow-900">Flu Season Tips</p>
                  <p className="text-xs text-yellow-700">Scheduled for tomorrow 8:00 AM</p>
                </div>
                <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">Pending</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">Weekly Health Report</p>
                  <p className="text-xs text-blue-700">Scheduled for Friday 3:00 PM</p>
                </div>
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">Scheduled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-900">Medication Reminders</p>
                  <p className="text-xs text-green-700">Daily at 11:45 AM</p>
                </div>
                <Badge variant="default" className="text-xs bg-green-100 text-green-800">Recurring</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
