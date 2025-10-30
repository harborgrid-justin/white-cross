'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  MagnifyingGlassIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

/**
 * Communication history record
 */
interface CommunicationRecord {
  id: string;
  type: 'email' | 'sms' | 'phone' | 'chat';
  subject?: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  recipients: Array<{
    id: string;
    name: string;
    email?: string;
    phone?: string;
    relationship?: string;
  }>;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'emergency' | 'routine' | 'appointment' | 'medication' | 'general';
  thread_id?: string;
  parent_id?: string;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
  }>;
  metadata: {
    student_id?: string;
    student_name?: string;
    template_id?: string;
    scheduled_at?: string;
    delivery_attempts?: number;
    read_at?: string;
    delivery_provider?: string;
  };
  created_at: string;
  updated_at: string;
}

/**
 * Filter options for communication history
 */
interface HistoryFilters {
  search: string;
  type: string;
  status: string;
  priority: string;
  category: string;
  sender: string;
  student: string;
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: 'created_at' | 'updated_at' | 'priority' | 'status';
  sortOrder: 'asc' | 'desc';
}

/**
 * Props for the CommunicationHistory component
 */
interface CommunicationHistoryProps {
  /** Additional CSS classes */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Student ID to filter communications for specific student */
  studentId?: string;
  /** Callback when communication is selected for viewing */
  onViewCommunication?: (record: CommunicationRecord) => void;
  /** Callback when communication is resent */
  onResendCommunication?: (recordId: string) => void;
  /** Callback when communication thread is opened */
  onOpenThread?: (threadId: string) => void;
}

/**
 * CommunicationHistory component for viewing communication history and logs
 * 
 * Features:
 * - Complete communication history with filtering and search
 * - Real-time status tracking (sent, delivered, read, failed)
 * - Thread-based conversation grouping
 * - Advanced filtering by type, status, priority, date range
 * - Export functionality for compliance and auditing
 * - Communication resend capabilities
 * - Attachment preview and download
 * - Delivery analytics and statistics
 * 
 * @component
 * @example
 * ```tsx
 * <CommunicationHistory
 *   studentId="student-123"
 *   onViewCommunication={(record) => handleViewCommunication(record)}
 *   onResendCommunication={(id) => handleResendCommunication(id)}
 *   onOpenThread={(threadId) => handleOpenThread(threadId)}
 * />
 * ```
 */
export const CommunicationHistory: React.FC<CommunicationHistoryProps> = ({
  className = '',
  isLoading = false,
  error,
  studentId,
  onViewCommunication,
  onResendCommunication,
  onOpenThread
}): React.ReactElement => {
  // State management
  const [communications, setCommunications] = useState<CommunicationRecord[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<HistoryFilters>({
    search: '',
    type: '',
    status: '',
    priority: '',
    category: '',
    sender: '',
    student: studentId || '',
    dateRange: {
      start: '',
      end: ''
    },
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  // Mock data - replace with actual API calls
  const mockCommunications: CommunicationRecord[] = [
    {
      id: '1',
      type: 'email',
      subject: 'Appointment Reminder - Sarah Johnson',
      content: 'Dear Mrs. Johnson,\n\nThis is a reminder that Sarah has an appointment scheduled for tomorrow at 2:00 PM.\n\nPlease ensure she arrives 15 minutes early.\n\nBest regards,\nWellness Center',
      sender: {
        id: 'nurse-1',
        name: 'Lisa Chen',
        role: 'School Nurse'
      },
      recipients: [
        {
          id: 'parent-1',
          name: 'Mary Johnson',
          email: 'mary.johnson@email.com',
          relationship: 'Mother'
        }
      ],
      status: 'read',
      priority: 'medium',
      category: 'appointment',
      thread_id: 'thread-1',
      metadata: {
        student_id: 'student-1',
        student_name: 'Sarah Johnson',
        template_id: 'template-1',
        read_at: '2024-03-25T10:30:00Z'
      },
      created_at: '2024-03-25T08:00:00Z',
      updated_at: '2024-03-25T10:30:00Z'
    },
    {
      id: '2',
      type: 'sms',
      content: 'Sarah received her medication (Albuterol 2 puffs) at 11:45 AM. Administered by Nurse Chen. Any concerns? Reply STOP to opt out.',
      sender: {
        id: 'nurse-1',
        name: 'Lisa Chen',
        role: 'School Nurse'
      },
      recipients: [
        {
          id: 'parent-1',
          name: 'Mary Johnson',
          phone: '(555) 123-4567',
          relationship: 'Mother'
        }
      ],
      status: 'delivered',
      priority: 'high',
      category: 'medication',
      metadata: {
        student_id: 'student-1',
        student_name: 'Sarah Johnson',
        delivery_provider: 'Twilio',
        delivery_attempts: 1
      },
      created_at: '2024-03-25T11:45:00Z',
      updated_at: '2024-03-25T11:46:00Z'
    },
    {
      id: '3',
      type: 'phone',
      content: 'Emergency call regarding Michael\'s allergic reaction. Parents notified and student transported to hospital.',
      sender: {
        id: 'nurse-2',
        name: 'Robert Davis',
        role: 'Head Nurse'
      },
      recipients: [
        {
          id: 'parent-2',
          name: 'David Smith',
          phone: '(555) 987-6543',
          relationship: 'Father'
        }
      ],
      status: 'sent',
      priority: 'urgent',
      category: 'emergency',
      metadata: {
        student_id: 'student-2',
        student_name: 'Michael Smith'
      },
      created_at: '2024-03-24T14:20:00Z',
      updated_at: '2024-03-24T14:25:00Z'
    },
    {
      id: '4',
      type: 'email',
      subject: 'Monthly Health Summary - Emma Wilson',
      content: 'Dear Mr. Wilson,\n\nPlease find attached Emma\'s monthly health summary for March 2024.\n\nBest regards,\nWellness Center',
      sender: {
        id: 'nurse-1',
        name: 'Lisa Chen',
        role: 'School Nurse'
      },
      recipients: [
        {
          id: 'parent-3',
          name: 'John Wilson',
          email: 'john.wilson@email.com',
          relationship: 'Father'
        }
      ],
      status: 'failed',
      priority: 'low',
      category: 'routine',
      attachments: [
        {
          id: 'att-1',
          name: 'health_summary_march_2024.pdf',
          type: 'application/pdf',
          size: 245760
        }
      ],
      metadata: {
        student_id: 'student-3',
        student_name: 'Emma Wilson',
        delivery_attempts: 3
      },
      created_at: '2024-03-20T09:00:00Z',
      updated_at: '2024-03-20T09:15:00Z'
    }
  ];

  // Load communications
  useEffect(() => {
    const loadCommunications = () => {
      let data = [...mockCommunications];
      
      // Filter by student if specified
      if (studentId) {
        data = data.filter(comm => comm.metadata.student_id === studentId);
      }
      
      setCommunications(data);
    };
    
    loadCommunications();
  }, [studentId]);

  // Filter and sort communications
  const filteredCommunications = useCallback(() => {
    let result = [...communications];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(comm =>
        comm.content.toLowerCase().includes(searchLower) ||
        (comm.subject && comm.subject.toLowerCase().includes(searchLower)) ||
        comm.sender.name.toLowerCase().includes(searchLower) ||
        comm.recipients.some(r => r.name.toLowerCase().includes(searchLower)) ||
        (comm.metadata.student_name && comm.metadata.student_name.toLowerCase().includes(searchLower))
      );
    }

    // Apply type filter
    if (filters.type) {
      result = result.filter(comm => comm.type === filters.type);
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(comm => comm.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority) {
      result = result.filter(comm => comm.priority === filters.priority);
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter(comm => comm.category === filters.category);
    }

    // Apply sender filter
    if (filters.sender) {
      result = result.filter(comm => comm.sender.id === filters.sender);
    }

    // Apply student filter
    if (filters.student) {
      result = result.filter(comm => comm.metadata.student_id === filters.student);
    }

    // Apply date range filter
    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start);
      result = result.filter(comm => new Date(comm.created_at) >= startDate);
    }
    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end);
      result = result.filter(comm => new Date(comm.created_at) <= endDate);
    }

    // Sort results
    result.sort((a, b) => {
      let aValue, bValue;
      switch (filters.sortBy) {
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'updated_at':
          aValue = new Date(a.updated_at).getTime();
          bValue = new Date(b.updated_at).getTime();
          break;
        case 'priority':
          const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filters.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return filters.sortOrder === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    return result;
  }, [communications, filters]);

  // Get type icon
  const getTypeIcon = (type: CommunicationRecord['type']) => {
    switch (type) {
      case 'email':
        return <EnvelopeIcon className="h-4 w-4" />;
      case 'sms':
        return <DevicePhoneMobileIcon className="h-4 w-4" />;
      case 'phone':
        return <PhoneIcon className="h-4 w-4" />;
      case 'chat':
        return <ChatBubbleLeftRightIcon className="h-4 w-4" />;
      default:
        return <EnvelopeIcon className="h-4 w-4" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: CommunicationRecord['status']) => {
    switch (status) {
      case 'sent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Sent
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Delivered
          </span>
        );
      case 'read':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <EyeIcon className="h-3 w-3 mr-1" />
            Read
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Failed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: CommunicationRecord['priority']) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
            Urgent
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle record selection
  const handleRecordSelect = (recordId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedRecords);
    if (isSelected) {
      newSelected.add(recordId);
    } else {
      newSelected.delete(recordId);
    }
    setSelectedRecords(newSelected);
  };

  // Handle select all
  const handleSelectAll = () => {
    const filtered = filteredCommunications();
    if (selectedRecords.size === filtered.length) {
      setSelectedRecords(new Set());
    } else {
      setSelectedRecords(new Set(filtered.map(c => c.id)));
    }
  };

  // Handle export
  const handleExport = () => {
    if (selectedRecords.size === 0) return;
    
    // This would typically trigger a download of communication records
    console.log('Exporting records:', Array.from(selectedRecords));
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    ) as React.ReactElement;
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading communication history</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    ) as React.ReactElement;
  }

  const filtered = filteredCommunications();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Communication History</h2>
          <p className="text-gray-600 mt-1">
            {studentId ? 'Student-specific communication logs and history' : 'Complete communication logs and history'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Toggle filters"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
            <ChevronDownIcon className={`h-4 w-4 ml-2 transform ${showFilters ? 'rotate-180' : ''} transition-transform`} />
          </button>
          {selectedRecords.size > 0 && (
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Export selected communications"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Export ({selectedRecords.size})
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search communications..."
                value={filters.search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Search communications"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filters.type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by type"
            >
              <option value="">All Types</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="phone">Phone</option>
              <option value="chat">Chat</option>
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="read">Read</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filters.priority}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by priority"
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              <option value="emergency">Emergency</option>
              <option value="routine">Routine</option>
              <option value="appointment">Appointment</option>
              <option value="medication">Medication</option>
              <option value="general">General</option>
            </select>

            {/* Date Range Start */}
            <div className="relative">
              <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                placeholder="Start date"
                value={filters.dateRange.start}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Start date"
              />
            </div>

            {/* Date Range End */}
            <div className="relative">
              <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                placeholder="End date"
                value={filters.dateRange.end}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="End date"
              />
            </div>

            {/* Sort By */}
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setFilters(prev => ({ 
                  ...prev, 
                  sortBy: sortBy as typeof prev.sortBy,
                  sortOrder: sortOrder as 'asc' | 'desc'
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Sort communications"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="priority-desc">High Priority First</option>
              <option value="status-asc">Status A-Z</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setFilters({
                search: '',
                type: '',
                status: '',
                priority: '',
                category: '',
                sender: '',
                student: studentId || '',
                dateRange: { start: '', end: '' },
                sortBy: 'created_at',
                sortOrder: 'desc'
              })}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Communications List */}
      <div className="bg-white rounded-lg shadow">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No communications found</h3>
            <p className="text-gray-500 mb-4">
              {filters.search || filters.type || filters.status || filters.priority || filters.category || filters.dateRange.start || filters.dateRange.end
                ? 'Try adjusting your filters to see more communications.'
                : 'Communications will appear here once they are sent.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {/* Select All Header */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedRecords.size === filtered.length && filtered.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    aria-label="Select all communications"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Select All ({filtered.length})
                  </span>
                </label>
                <div className="text-sm text-gray-500">
                  {selectedRecords.size > 0 && `${selectedRecords.size} selected`}
                </div>
              </div>
            </div>

            {/* Communication Records */}
            {filtered.map((record) => (
              <div key={record.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedRecords.has(record.id)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRecordSelect(record.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    aria-label={`Select communication ${record.id}`}
                  />

                  {/* Communication Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(record.type)}
                          {record.subject ? (
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {record.subject}
                            </h3>
                          ) : (
                            <h3 className="text-lg font-medium text-gray-900">
                              {record.type.charAt(0).toUpperCase() + record.type.slice(1)} Communication
                            </h3>
                          )}
                        </div>
                        {getStatusBadge(record.status)}
                        {getPriorityBadge(record.priority)}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onViewCommunication?.(record)}
                          className="inline-flex items-center px-3 py-1 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          aria-label={`View communication ${record.id}`}
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </button>
                        {record.thread_id && (
                          <button
                            onClick={() => onOpenThread?.(record.thread_id!)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            aria-label={`Open thread for communication ${record.id}`}
                          >
                            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                            Thread
                          </button>
                        )}
                        {record.status === 'failed' && (
                          <button
                            onClick={() => onResendCommunication?.(record.id)}
                            className="inline-flex items-center px-3 py-1 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            aria-label={`Resend communication ${record.id}`}
                          >
                            <ArrowPathIcon className="h-4 w-4 mr-1" />
                            Resend
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Communication Preview */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {record.content}
                    </p>

                    {/* Recipients */}
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <UserIcon className="h-4 w-4" />
                        <span>From: {record.sender.name} ({record.sender.role})</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>To: {record.recipients.map(r => r.name).join(', ')}</span>
                      </div>
                      {record.metadata.student_name && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>Student: {record.metadata.student_name}</span>
                        </div>
                      )}
                    </div>

                    {/* Attachments */}
                    {record.attachments && record.attachments.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2">
                          {record.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                            >
                              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              {attachment.name} ({formatFileSize(attachment.size)})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-3 w-3" />
                          <span>{new Date(record.created_at).toLocaleString()}</span>
                        </div>
                        {record.metadata.read_at && (
                          <div className="flex items-center space-x-1">
                            <EyeIcon className="h-3 w-3" />
                            <span>Read: {new Date(record.metadata.read_at).toLocaleString()}</span>
                          </div>
                        )}
                        {record.metadata.delivery_attempts && record.metadata.delivery_attempts > 1 && (
                          <div className="flex items-center space-x-1">
                            <ArrowPathIcon className="h-3 w-3" />
                            <span>{record.metadata.delivery_attempts} attempts</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationHistory;
