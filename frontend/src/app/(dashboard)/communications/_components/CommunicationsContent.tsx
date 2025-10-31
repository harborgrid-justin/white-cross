/**
 * @fileoverview Communications Content Component - Healthcare messaging and communication management
 * @module app/(dashboard)/communications/_components/CommunicationsContent
 * @category Communications - Components
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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

interface Message {
  id: string;
  subject: string;
  content: string;
  type: 'EMAIL' | 'SMS' | 'PUSH_NOTIFICATION' | 'BROADCAST' | 'EMERGENCY' | 'REMINDER';
  status: 'DRAFT' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'SCHEDULED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'URGENT';
  sender: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  recipients: {
    id: string;
    name: string;
    type: 'PARENT' | 'GUARDIAN' | 'STUDENT' | 'STAFF' | 'EMERGENCY_CONTACT';
    email?: string;
    phone?: string;
    status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  }[];
  sentAt: string;
  readAt?: string;
  scheduledFor?: string;
  isEmergency: boolean;
  hasAttachments: boolean;
  threadId?: string;
  replyToId?: string;
  tags: string[];
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

// Mock data for demonstration
const mockMessages: Message[] = [
  {
    id: '1',
    subject: 'EMERGENCY: Student Injury - John Doe',
    content: 'Student John Doe has sustained a minor injury during recess. Parents have been contacted and student is being monitored in the health office.',
    type: 'EMERGENCY',
    status: 'SENT',
    priority: 'URGENT',
    sender: {
      id: '1',
      name: 'Sarah Johnson',
      role: 'School Nurse'
    },
    recipients: [
      {
        id: '1',
        name: 'Mary Doe',
        type: 'PARENT',
        email: 'mary.doe@example.com',
        phone: '+1-555-0101',
        status: 'READ'
      },
      {
        id: '2',
        name: 'Principal Smith',
        type: 'STAFF',
        email: 'principal@school.edu',
        status: 'DELIVERED'
      }
    ],
    sentAt: '2024-02-01T14:30:00Z',
    readAt: '2024-02-01T14:32:00Z',
    isEmergency: true,
    hasAttachments: false,
    tags: ['injury', 'emergency', 'parent-contact']
  },
  {
    id: '2',
    subject: 'Medication Reminder - Emma Wilson',
    content: 'Reminder: Emma Wilson needs to take her daily medication at 12:00 PM. Please ensure she comes to the health office.',
    type: 'REMINDER',
    status: 'DELIVERED',
    priority: 'HIGH',
    sender: {
      id: '1',
      name: 'Sarah Johnson',
      role: 'School Nurse'
    },
    recipients: [
      {
        id: '3',
        name: 'Emma Wilson',
        type: 'STUDENT',
        status: 'DELIVERED'
      },
      {
        id: '4',
        name: 'Teacher Adams',
        type: 'STAFF',
        email: 'adams@school.edu',
        status: 'READ'
      }
    ],
    sentAt: '2024-02-01T11:45:00Z',
    isEmergency: false,
    hasAttachments: false,
    tags: ['medication', 'reminder', 'daily']
  },
  {
    id: '3',
    subject: 'Health Screening Results Available',
    content: 'Annual health screening results are now available in the parent portal. Please review and contact us with any questions.',
    type: 'EMAIL',
    status: 'SENT',
    priority: 'MEDIUM',
    sender: {
      id: '1',
      name: 'Sarah Johnson',
      role: 'School Nurse'
    },
    recipients: [
      {
        id: '5',
        name: 'All Parents Group',
        type: 'PARENT',
        status: 'SENT'
      }
    ],
    sentAt: '2024-02-01T09:00:00Z',
    isEmergency: false,
    hasAttachments: true,
    tags: ['health-screening', 'results', 'annual']
  },
  {
    id: '4',
    subject: 'Flu Season Prevention Tips',
    content: 'With flu season approaching, here are some important prevention tips to keep our school community healthy...',
    type: 'BROADCAST',
    status: 'SCHEDULED',
    priority: 'MEDIUM',
    sender: {
      id: '1',
      name: 'Sarah Johnson',
      role: 'School Nurse'
    },
    recipients: [
      {
        id: '6',
        name: 'All Families',
        type: 'PARENT',
        status: 'SENT'
      }
    ],
    sentAt: '2024-02-01T08:00:00Z',
    scheduledFor: '2024-02-02T08:00:00Z',
    isEmergency: false,
    hasAttachments: false,
    tags: ['flu-season', 'prevention', 'health-tips']
  }
];

const mockStats: CommunicationStats = {
  totalMessages: 1247,
  sentToday: 23,
  deliveredCount: 1198,
  readCount: 956,
  failedCount: 12,
  emergencyCount: 5,
  scheduledCount: 8,
  averageResponseTime: 145 // minutes
};

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'SENT': return 'success';
    case 'DELIVERED': return 'info';
    case 'READ': return 'success';
    case 'FAILED': return 'danger';
    case 'DRAFT': return 'secondary';
    case 'SCHEDULED': return 'warning';
    default: return 'secondary';
  }
}

function getPriorityBadgeVariant(priority: string) {
  switch (priority) {
    case 'URGENT': return 'danger';
    case 'HIGH': return 'warning';
    case 'MEDIUM': return 'info';
    case 'LOW': return 'secondary';
    default: return 'secondary';
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'EMAIL': return Mail;
    case 'SMS': return Phone;
    case 'PUSH_NOTIFICATION': return Bell;
    case 'BROADCAST': return Megaphone;
    case 'EMERGENCY': return AlertTriangle;
    case 'REMINDER': return Clock;
    default: return MessageCircle;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'EMAIL': return 'text-blue-600';
    case 'SMS': return 'text-green-600';
    case 'PUSH_NOTIFICATION': return 'text-purple-600';
    case 'BROADCAST': return 'text-orange-600';
    case 'EMERGENCY': return 'text-red-600';
    case 'REMINDER': return 'text-yellow-600';
    default: return 'text-gray-600';
  }
}

export function CommunicationsContent({ searchParams }: CommunicationsContentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<CommunicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  // const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setMessages(mockMessages);
      setStats(mockStats);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
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
              
              return (
                <div 
                  key={message.id}
                  className={`p-4 border rounded-lg transition-all hover:shadow-sm ${
                    message.isEmergency ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <TypeIcon className={`h-5 w-5 ${getTypeColor(message.type)}`} />
                        <h4 className={`text-lg font-medium ${
                          message.isEmergency ? 'text-red-900' : 'text-gray-900'
                        }`}>
                          {message.subject}
                        </h4>
                        <Badge variant={getStatusBadgeVariant(message.status)} className="text-xs">
                          {message.status}
                        </Badge>
                        <Badge variant={getPriorityBadgeVariant(message.priority)} className="text-xs">
                          {message.priority}
                        </Badge>
                        {message.isEmergency && (
                          <Badge variant="danger" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            EMERGENCY
                          </Badge>
                        )}
                      </div>
                      
                      <p className={`text-sm mb-3 ${
                        message.isEmergency ? 'text-red-800' : 'text-gray-600'
                      }`}>
                        {message.content}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{message.recipients.length} recipient{message.recipients.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(message.sentAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Send className="h-4 w-4" />
                          <span>From: {message.sender.name}</span>
                        </div>
                        {message.hasAttachments && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>Has attachments</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {message.tags.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {message.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Recipients Summary */}
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-700 mb-2">Recipients:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.recipients.slice(0, 3).map((recipient) => (
                            <div key={recipient.id} className="flex items-center gap-2 text-xs">
                              <span className="text-gray-600">{recipient.name}</span>
                              <Badge variant={getStatusBadgeVariant(recipient.status)} className="text-xs">
                                {recipient.status}
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
                <Badge variant="success" className="text-xs">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">SMS</p>
                    <p className="text-xs text-green-700">95.2% delivery rate</p>
                  </div>
                </div>
                <Badge variant="success" className="text-xs">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Push Notifications</p>
                    <p className="text-xs text-purple-700">92.8% delivery rate</p>
                  </div>
                </div>
                <Badge variant="success" className="text-xs">Active</Badge>
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
                <Badge variant="warning" className="text-xs">Pending</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">Weekly Health Report</p>
                  <p className="text-xs text-blue-700">Scheduled for Friday 3:00 PM</p>
                </div>
                <Badge variant="info" className="text-xs">Scheduled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-900">Medication Reminders</p>
                  <p className="text-xs text-green-700">Daily at 11:45 AM</p>
                </div>
                <Badge variant="success" className="text-xs">Recurring</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}