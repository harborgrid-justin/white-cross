'use client';

/**
 * Force dynamic rendering for real-time messages - healthcare communication requires current state
 */


import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, 
  Send, 
  Inbox, 
  Archive, 
  Star, 
  Trash2, 
  Plus, 
  Filter,
  AlertTriangle,
  CheckCircle,
  User,
  Users,
  Shield,
  Stethoscope,
  Calendar,
  Bell,
  Eye,
  Reply,
  Forward,
  Paperclip,
  Download,
  Lock,
  X
} from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Badge } from '@/components/ui/Badge';

// Healthcare message types and priorities
type MessageType = 'general' | 'emergency' | 'medical' | 'appointment' | 'medication' | 'incident' | 'parent_communication' | 'staff_notification';
type MessagePriority = 'low' | 'normal' | 'high' | 'urgent' | 'emergency';
type MessageStatus = 'unread' | 'read' | 'replied' | 'forwarded' | 'archived' | 'deleted' | 'starred';

interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  isEncrypted: boolean;
}

interface HealthcareMessage {
  id: string;
  subject: string;
  content: string;
  type: MessageType;
  priority: MessagePriority;
  status: MessageStatus;
  from: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  to: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  cc?: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  timestamp: Date;
  readAt?: Date;
  repliedAt?: Date;
  attachments: MessageAttachment[];
  isEncrypted: boolean;
  requiresAcknowledgment: boolean;
  acknowledgedAt?: Date;
  relatedStudent?: {
    id: string;
    name: string;
  };
  tags: string[];
  threadId?: string;
  parentMessageId?: string;
}

interface MessageStats {
  unread: number;
  total: number;
  starred: number;
  archived: number;
  emergency: number;
  medical: number;
  appointments: number;
  parentCommunications: number;
  requiresAcknowledgment: number;
}

interface MessagesContentProps {
  initialMessages?: HealthcareMessage[];
}

const MessagesContent: React.FC<MessagesContentProps> = ({ 
  initialMessages = []
}) => {
  const [messages, setMessages] = useState<HealthcareMessage[]>(initialMessages);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<HealthcareMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred' | 'archived' | 'emergency' | 'medical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<MessageType | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<MessagePriority | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());

  // Simulate loading healthcare messages with realistic data
  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock healthcare messages data
      const mockMessages: HealthcareMessage[] = [
        {
          id: 'msg-001',
          subject: 'EMERGENCY: Student Allergic Reaction - Room 204',
          content: 'Emergency alert: Student Sarah Johnson experiencing allergic reaction in classroom 204. EpiPen administered. Parent contacted. Ambulance requested.',
          type: 'emergency',
          priority: 'emergency',
          status: 'unread',
          from: { id: 'user-001', name: 'Mary Wilson', role: 'Teacher', avatar: '/avatars/teacher.jpg' },
          to: [
            { id: 'user-002', name: 'Jennifer Smith', role: 'School Nurse' },
            { id: 'user-003', name: 'Principal Davis', role: 'Principal' }
          ],
          timestamp: new Date('2024-10-31T10:15:00'),
          attachments: [],
          isEncrypted: true,
          requiresAcknowledgment: true,
          relatedStudent: { id: 'student-001', name: 'Sarah Johnson' },
          tags: ['emergency', 'allergy', 'epipen', 'ambulance']
        },
        {
          id: 'msg-002',
          subject: 'Medication Administration - Daily Report',
          content: 'Daily medication report for October 31st. 15 students received scheduled medications. 2 PRN medications administered. All documented in health records.',
          type: 'medical',
          priority: 'normal',
          status: 'read',
          from: { id: 'user-002', name: 'Jennifer Smith', role: 'School Nurse' },
          to: [{ id: 'user-004', name: 'Health Supervisor', role: 'Health Services Director' }],
          timestamp: new Date('2024-10-31T09:30:00'),
          readAt: new Date('2024-10-31T09:45:00'),
          attachments: [
            { id: 'att-001', name: 'medication-report-10-31.pdf', size: 245760, type: 'application/pdf', isEncrypted: true }
          ],
          isEncrypted: true,
          requiresAcknowledgment: false,
          tags: ['medication', 'daily-report', 'administration']
        },
        {
          id: 'msg-003',
          subject: 'Parent Conference Request - Tommy Martinez',
          content: 'Mrs. Martinez requesting conference to discuss Tommy\'s recent health concerns and medication management plan. Available next week.',
          type: 'parent_communication',
          priority: 'normal',
          status: 'unread',
          from: { id: 'parent-001', name: 'Maria Martinez', role: 'Parent' },
          to: [{ id: 'user-002', name: 'Jennifer Smith', role: 'School Nurse' }],
          timestamp: new Date('2024-10-31T08:20:00'),
          attachments: [],
          isEncrypted: false,
          requiresAcknowledgment: true,
          relatedStudent: { id: 'student-002', name: 'Tommy Martinez' },
          tags: ['parent-communication', 'conference', 'health-concerns']
        },
        {
          id: 'msg-004',
          subject: 'Appointment Reminder: Health Screening Schedule',
          content: 'Reminder: Annual health screenings scheduled for grades K-2 next week. Vision and hearing tests. Please prepare screening forms.',
          type: 'appointment',
          priority: 'normal',
          status: 'read',
          from: { id: 'system', name: 'Health System', role: 'System' },
          to: [
            { id: 'user-002', name: 'Jennifer Smith', role: 'School Nurse' },
            { id: 'user-005', name: 'Health Assistant', role: 'Health Aide' }
          ],
          timestamp: new Date('2024-10-30T16:00:00'),
          readAt: new Date('2024-10-30T16:15:00'),
          attachments: [
            { id: 'att-002', name: 'screening-schedule.pdf', size: 156432, type: 'application/pdf', isEncrypted: false }
          ],
          isEncrypted: false,
          requiresAcknowledgment: true,
          acknowledgedAt: new Date('2024-10-30T16:15:00'),
          tags: ['appointment', 'screening', 'vision', 'hearing']
        },
        {
          id: 'msg-005',
          subject: 'Incident Report: Playground Injury',
          content: 'Student Alex Chen sustained minor scrape on playground equipment. First aid administered. Parent contacted and picked up student. No further medical attention needed.',
          type: 'incident',
          priority: 'normal',
          status: 'replied',
          from: { id: 'user-006', name: 'Coach Thompson', role: 'PE Teacher' },
          to: [
            { id: 'user-002', name: 'Jennifer Smith', role: 'School Nurse' },
            { id: 'user-003', name: 'Principal Davis', role: 'Principal' }
          ],
          timestamp: new Date('2024-10-30T14:30:00'),
          readAt: new Date('2024-10-30T14:45:00'),
          repliedAt: new Date('2024-10-30T15:00:00'),
          attachments: [
            { id: 'att-003', name: 'incident-photos.jpg', size: 524288, type: 'image/jpeg', isEncrypted: true }
          ],
          isEncrypted: true,
          requiresAcknowledgment: true,
          acknowledgedAt: new Date('2024-10-30T15:00:00'),
          relatedStudent: { id: 'student-003', name: 'Alex Chen' },
          tags: ['incident', 'playground', 'first-aid', 'parent-contact']
        },
        {
          id: 'msg-006',
          subject: 'Medication Refill Needed - Inhaler Supply',
          content: 'Running low on albuterol inhalers. Current stock: 3 units. Need to reorder before next week. Emergency supply protocols in place.',
          type: 'medical',
          priority: 'high',
          status: 'starred',
          from: { id: 'user-005', name: 'Health Assistant', role: 'Health Aide' },
          to: [
            { id: 'user-002', name: 'Jennifer Smith', role: 'School Nurse' },
            { id: 'user-004', name: 'Health Supervisor', role: 'Health Services Director' }
          ],
          timestamp: new Date('2024-10-30T13:15:00'),
          readAt: new Date('2024-10-30T13:20:00'),
          attachments: [],
          isEncrypted: false,
          requiresAcknowledgment: true,
          acknowledgedAt: new Date('2024-10-30T13:25:00'),
          tags: ['medication', 'inhaler', 'supply', 'reorder']
        },
        {
          id: 'msg-007',
          subject: 'Staff Training: Updated Emergency Protocols',
          content: 'Mandatory training session on updated emergency response protocols scheduled for November 5th at 3:30 PM in the main conference room.',
          type: 'staff_notification',
          priority: 'normal',
          status: 'read',
          from: { id: 'user-003', name: 'Principal Davis', role: 'Principal' },
          to: [
            { id: 'user-002', name: 'Jennifer Smith', role: 'School Nurse' },
            { id: 'user-001', name: 'Mary Wilson', role: 'Teacher' },
            { id: 'user-006', name: 'Coach Thompson', role: 'PE Teacher' }
          ],
          timestamp: new Date('2024-10-29T11:00:00'),
          readAt: new Date('2024-10-29T11:15:00'),
          attachments: [
            { id: 'att-004', name: 'emergency-protocols-2024.pdf', size: 1048576, type: 'application/pdf', isEncrypted: false }
          ],
          isEncrypted: false,
          requiresAcknowledgment: true,
          acknowledgedAt: new Date('2024-10-29T11:20:00'),
          tags: ['training', 'emergency', 'protocols', 'mandatory']
        }
      ];

      setMessages(mockMessages);
      setLoading(false);
    };

    loadMessages();
  }, []);

  // Calculate message statistics
  const stats: MessageStats = useMemo(() => {
    return {
      unread: messages.filter(msg => msg.status === 'unread').length,
      total: messages.length,
      starred: messages.filter(msg => msg.status === 'starred').length,
      archived: messages.filter(msg => msg.status === 'archived').length,
      emergency: messages.filter(msg => msg.type === 'emergency' || msg.priority === 'emergency').length,
      medical: messages.filter(msg => msg.type === 'medical').length,
      appointments: messages.filter(msg => msg.type === 'appointment').length,
      parentCommunications: messages.filter(msg => msg.type === 'parent_communication').length,
      requiresAcknowledgment: messages.filter(msg => msg.requiresAcknowledgment && !msg.acknowledgedAt).length
    };
  }, [messages]);

  // Filter messages based on current filters
  const filteredMessages = useMemo(() => {
    let filtered = messages;

    // Apply status filter
    if (filter === 'unread') {
      filtered = filtered.filter(msg => msg.status === 'unread');
    } else if (filter === 'starred') {
      filtered = filtered.filter(msg => msg.status === 'starred');
    } else if (filter === 'archived') {
      filtered = filtered.filter(msg => msg.status === 'archived');
    } else if (filter === 'emergency') {
      filtered = filtered.filter(msg => msg.type === 'emergency' || msg.priority === 'emergency');
    } else if (filter === 'medical') {
      filtered = filtered.filter(msg => msg.type === 'medical');
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(msg => msg.type === typeFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(msg => msg.priority === priorityFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(msg =>
        msg.subject.toLowerCase().includes(query) ||
        msg.content.toLowerCase().includes(query) ||
        msg.from.name.toLowerCase().includes(query) ||
        msg.tags.some(tag => tag.toLowerCase().includes(query)) ||
        msg.relatedStudent?.name.toLowerCase().includes(query)
      );
    }

    // Sort by priority and timestamp
    return filtered.sort((a, b) => {
      // Emergency messages first
      if (a.priority === 'emergency' && b.priority !== 'emergency') return -1;
      if (b.priority === 'emergency' && a.priority !== 'emergency') return 1;
      
      // Then by timestamp (newest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [messages, filter, typeFilter, priorityFilter, searchQuery]);

  // Message action handlers
  const handleMarkAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, status: 'read' as MessageStatus, readAt: new Date() }
        : msg
    ));
  };

  const handleStarMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, status: msg.status === 'starred' ? 'read' as MessageStatus : 'starred' as MessageStatus }
        : msg
    ));
  };

  const handleArchiveMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, status: 'archived' as MessageStatus }
        : msg
    ));
  };

  const handleAcknowledgeMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, acknowledgedAt: new Date() }
        : msg
    ));
  };

  const handleBulkAction = (action: 'read' | 'unread' | 'archive' | 'delete' | 'star') => {
    const messageIds = Array.from(selectedMessages);
    
    if (action === 'delete' && !window.confirm(`Are you sure you want to delete ${messageIds.length} messages?`)) {
      return;
    }

    setMessages(prev => prev.map(msg => {
      if (!messageIds.includes(msg.id)) return msg;
      
      switch (action) {
        case 'read':
          return { ...msg, status: 'read', readAt: new Date() };
        case 'unread':
          return { ...msg, status: 'unread', readAt: undefined };
        case 'archive':
          return { ...msg, status: 'archived' };
        case 'star':
          return { ...msg, status: 'starred' };
        default:
          return msg;
      }
    }));

    if (action === 'delete') {
      setMessages(prev => prev.filter(msg => !messageIds.includes(msg.id)));
    }

    setSelectedMessages(new Set());
  };

  const getPriorityBadgeColor = (priority: MessagePriority) => {
    switch (priority) {
      case 'emergency':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'high':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: MessageType) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medical':
        return <Stethoscope className="h-4 w-4 text-blue-500" />;
      case 'appointment':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'medication':
        return <Shield className="h-4 w-4 text-purple-500" />;
      case 'incident':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'parent_communication':
        return <Users className="h-4 w-4 text-indigo-500" />;
      case 'staff_notification':
        return <Bell className="h-4 w-4 text-gray-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${Math.floor(hours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <div className="p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <div className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Healthcare Message Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.unread}</p>
                {stats.requiresAcknowledgment > 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    {stats.requiresAcknowledgment} need acknowledgment
                  </p>
                )}
              </div>
              <div className="relative">
                <Inbox className="h-8 w-8 text-blue-500" />
                {stats.unread > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.unread > 9 ? '9+' : stats.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emergency Alerts</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.emergency}</p>
                <p className="text-xs text-gray-500 mt-1">Active emergency messages</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Medical Messages</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.medical}</p>
                <p className="text-xs text-gray-500 mt-1">Health-related communications</p>
              </div>
              <Stethoscope className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Parent Communications</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.parentCommunications}</p>
                <p className="text-xs text-gray-500 mt-1">Family correspondence</p>
              </div>
              <Users className="h-8 w-8 text-indigo-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Message Actions and Filters */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Primary Actions */}
            <div className="flex items-center gap-3">
              <Link href="/messages/new">
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" />
                  New Message
                </Button>
              </Link>
              
              {selectedMessages.size > 0 && (
                <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                  <span className="text-sm text-gray-600">
                    {selectedMessages.size} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('read')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Mark Read
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('archive')}
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            {/* Search and Filter Controls */}
            <div className="flex items-center gap-3">
              <div className="w-64">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search messages, senders, or students..."
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-gray-100' : ''}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label htmlFor="message-type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Message Type
                  </label>
                  <select
                    id="message-type-filter"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as MessageType | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="emergency">Emergency</option>
                    <option value="medical">Medical</option>
                    <option value="appointment">Appointments</option>
                    <option value="medication">Medication</option>
                    <option value="incident">Incidents</option>
                    <option value="parent_communication">Parent Communication</option>
                    <option value="staff_notification">Staff Notifications</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    id="priority-filter"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as MessagePriority | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="emergency">Emergency</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTypeFilter('all');
                      setPriorityFilter('all');
                      setSearchQuery('');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Messages', count: stats.total },
              { key: 'unread', label: 'Unread', count: stats.unread },
              { key: 'emergency', label: 'Emergency', count: stats.emergency },
              { key: 'medical', label: 'Medical', count: stats.medical },
              { key: 'starred', label: 'Starred', count: stats.starred },
              { key: 'archived', label: 'Archived', count: stats.archived }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filter === tab.key
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Messages List */}
      <Card>
        <div className="divide-y divide-gray-200">
          {filteredMessages.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-2">
                {searchQuery
                  ? 'No messages match your search'
                  : filter === 'unread'
                  ? "You're all caught up!"
                  : 'No messages found'}
              </p>
              <p className="text-sm text-gray-400 mb-4">
                {searchQuery
                  ? 'Try adjusting your search terms or filters'
                  : 'Start a conversation by sending a new message.'}
              </p>
              <Link href="/messages/new">
                <Button variant="primary">
                  <Send className="h-4 w-4 mr-2" />
                  Send New Message
                </Button>
              </Link>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  message.status === 'unread' ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                } ${
                  message.priority === 'emergency' ? 'bg-red-50 border-l-4 border-l-red-500' : ''
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start gap-4">
                  {/* Selection Checkbox */}
                  <div className="flex-shrink-0 pt-1">
                    <input
                      type="checkbox"
                      aria-label={`Select message from ${message.from.name}`}
                      checked={selectedMessages.has(message.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        const newSelected = new Set(selectedMessages);
                        if (e.target.checked) {
                          newSelected.add(message.id);
                        } else {
                          newSelected.delete(message.id);
                        }
                        setSelectedMessages(newSelected);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Message Type Icon */}
                        {getTypeIcon(message.type)}
                        
                        {/* Sender Info */}
                        <span className="font-semibold text-gray-900">
                          {message.from.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({message.from.role})
                        </span>
                        
                        {/* Priority Badge */}
                        <Badge className={`${getPriorityBadgeColor(message.priority)} text-xs`}>
                          {message.priority.toUpperCase()}
                        </Badge>
                        
                        {/* Encryption Indicator */}
                        {message.isEncrypted && (
                          <div className="relative group">
                            <Lock className="h-3 w-3 text-gray-400" />
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Encrypted message
                            </span>
                          </div>
                        )}
                        
                        {/* Acknowledgment Required */}
                        {message.requiresAcknowledgment && !message.acknowledgedAt && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            ACK REQUIRED
                          </Badge>
                        )}
                      </div>
                      
                      {/* Timestamp */}
                      <span className="text-sm text-gray-500 flex-shrink-0">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>

                    {/* Subject */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {message.subject}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                      {message.content}
                    </p>

                    {/* Related Student */}
                    {message.relatedStudent && (
                      <div className="flex items-center gap-1 mb-2">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          Student: {message.relatedStudent.name}
                        </span>
                      </div>
                    )}

                    {/* Attachments */}
                    {message.attachments.length > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <Paperclip className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {message.attachments.length} attachment{message.attachments.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}

                    {/* Tags */}
                    {message.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {message.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {message.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{message.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {message.status === 'unread' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(message.id);
                        }}
                        title="Mark as read"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStarMessage(message.id);
                      }}
                      title="Star message"
                    >
                      <Star className={`h-4 w-4 ${
                        message.status === 'starred' 
                          ? 'text-yellow-500 fill-current' 
                          : 'text-gray-400'
                      }`} />
                    </Button>
                    
                    {message.requiresAcknowledgment && !message.acknowledgedAt && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcknowledgeMessage(message.id);
                        }}
                        title="Acknowledge message"
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchiveMessage(message.id);
                      }}
                      title="Archive message"
                    >
                      <Archive className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getTypeIcon(selectedMessage.type)}
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedMessage.subject}</h2>
                  <p className="text-sm text-gray-600">
                    From: {selectedMessage.from.name} ({selectedMessage.from.role})
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedMessage(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Message Metadata */}
              <div className="grid gap-4 md:grid-cols-2 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Priority</p>
                  <Badge className={getPriorityBadgeColor(selectedMessage.priority)}>
                    {selectedMessage.priority.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Type</p>
                  <p className="text-sm text-gray-900 capitalize">
                    {selectedMessage.type.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Sent</p>
                  <p className="text-sm text-gray-900">
                    {selectedMessage.timestamp.toLocaleString()}
                  </p>
                </div>
                {selectedMessage.relatedStudent && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Related Student</p>
                    <p className="text-sm text-gray-900">
                      {selectedMessage.relatedStudent.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="prose prose-sm max-w-none mb-6">
                <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>

              {/* Attachments */}
              {selectedMessage.attachments.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Attachments</h3>
                  <div className="space-y-2">
                    {selectedMessage.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Paperclip className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{attachment.name}</p>
                            <p className="text-sm text-gray-600">
                              {formatFileSize(attachment.size)} • {attachment.type}
                              {attachment.isEncrypted && (
                                <span className="ml-2 text-green-600">Encrypted</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                  <Forward className="h-4 w-4 mr-2" />
                  Forward
                </Button>
              </div>
              <div className="flex gap-2">
                {selectedMessage.requiresAcknowledgment && !selectedMessage.acknowledgedAt && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleAcknowledgeMessage(selectedMessage.id);
                      setSelectedMessage(null);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Acknowledge
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    handleArchiveMessage(selectedMessage.id);
                    setSelectedMessage(null);
                  }}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MessagesContent;