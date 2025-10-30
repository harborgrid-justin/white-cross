'use client';

import React, { useState } from 'react';
import { 
  Bell,
  BellRing,
  BellOff,
  Settings,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  User,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Eye,
  MoreVertical,
  Filter,
  Search,
  RefreshCw,
  Send,
  Trash2,
  Archive,
  Star,
  StarOff,
  ChevronDown,
  Zap,
  CreditCard,
  FileText,
  Phone,
  Building
} from 'lucide-react';

/**
 * Notification types
 */
export type NotificationType = 'payment-received' | 'payment-overdue' | 'invoice-sent' | 'invoice-viewed' | 
  'payment-failed' | 'reminder-sent' | 'system-alert' | 'billing-update' | 'collection-notice';

/**
 * Notification priority levels
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Notification status types
 */
export type NotificationStatus = 'unread' | 'read' | 'archived' | 'starred';

/**
 * Notification delivery channel types
 */
export type NotificationChannel = 'email' | 'sms' | 'in-app' | 'push' | 'webhook';

/**
 * Billing notification interface
 */
export interface BillingNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  channels: NotificationChannel[];
  patientId?: string;
  patientName?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  amount?: number;
  relatedEntityId?: string;
  relatedEntityType?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  readAt?: string;
  archivedAt?: string;
  starredAt?: string;
  scheduledFor?: string;
  sentAt?: string;
  deliveryStatus?: {
    email?: 'pending' | 'sent' | 'delivered' | 'failed';
    sms?: 'pending' | 'sent' | 'delivered' | 'failed';
    push?: 'pending' | 'sent' | 'delivered' | 'failed';
  };
}

/**
 * Notification template interface
 */
export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  subject: string;
  content: string;
  channels: NotificationChannel[];
  enabled: boolean;
  schedule?: {
    enabled: boolean;
    delay: number;
    unit: 'minutes' | 'hours' | 'days';
    repeat?: {
      enabled: boolean;
      interval: number;
      maxRepeats: number;
    };
  };
}

/**
 * Props for the BillingNotifications component
 */
interface BillingNotificationsProps {
  /** Array of billing notifications */
  notifications?: BillingNotification[];
  /** Available notification templates */
  templates?: NotificationTemplate[];
  /** Unread notifications count */
  unreadCount?: number;
  /** Loading state */
  loading?: boolean;
  /** Search term */
  searchTerm?: string;
  /** Active filters */
  filters?: {
    type: NotificationType[];
    priority: NotificationPriority[];
    status: NotificationStatus[];
    channel: NotificationChannel[];
  };
  /** Custom CSS classes */
  className?: string;
  /** Notification click handler */
  onNotificationClick?: (notification: BillingNotification) => void;
  /** Mark as read handler */
  onMarkAsRead?: (notificationIds: string[]) => void;
  /** Mark as unread handler */
  onMarkAsUnread?: (notificationIds: string[]) => void;
  /** Star notification handler */
  onStarNotification?: (notificationId: string) => void;
  /** Archive notification handler */
  onArchiveNotification?: (notificationIds: string[]) => void;
  /** Delete notification handler */
  onDeleteNotification?: (notificationIds: string[]) => void;
  /** Send notification handler */
  onSendNotification?: (templateId: string, recipientId: string) => void;
  /** Search change handler */
  onSearchChange?: (term: string) => void;
  /** Filter change handler */
  onFilterChange?: (filters: BillingNotificationsProps['filters']) => void;
  /** Refresh handler */
  onRefresh?: () => void;
  /** Settings handler */
  onSettings?: () => void;
}

/**
 * BillingNotifications Component
 * 
 * A comprehensive notification management system for billing-related communications
 * with patients, including payment reminders, invoice notifications, and system alerts.
 * Features template management, scheduling, and multi-channel delivery.
 * 
 * @param props - BillingNotifications component props
 * @returns JSX element representing the billing notifications interface
 */
const BillingNotifications = ({
  notifications = [
    {
      id: 'NOT-001',
      type: 'payment-received',
      title: 'Payment Received',
      message: 'Payment of $350.00 received from Sarah Johnson for Invoice #INV-2024-001',
      priority: 'medium',
      status: 'unread',
      channels: ['email', 'in-app'],
      patientId: 'PAT-001',
      patientName: 'Sarah Johnson',
      invoiceId: 'INV-001',
      invoiceNumber: 'INV-2024-001',
      amount: 350,
      createdAt: '2024-10-30T10:30:00Z',
      deliveryStatus: { email: 'delivered', push: 'sent' }
    },
    {
      id: 'NOT-002',
      type: 'payment-overdue',
      title: 'Payment Overdue',
      message: 'Invoice #INV-2024-002 for Michael Chen is 5 days overdue. Amount: $275.00',
      priority: 'high',
      status: 'read',
      channels: ['email', 'sms'],
      patientId: 'PAT-002',
      patientName: 'Michael Chen',
      invoiceId: 'INV-002',
      invoiceNumber: 'INV-2024-002',
      amount: 275,
      createdAt: '2024-10-28T14:15:00Z',
      readAt: '2024-10-28T16:45:00Z',
      deliveryStatus: { email: 'delivered', sms: 'delivered' }
    },
    {
      id: 'NOT-003',
      type: 'invoice-sent',
      title: 'Invoice Sent',
      message: 'Invoice #INV-2024-003 has been sent to Emily Rodriguez',
      priority: 'low',
      status: 'starred',
      channels: ['in-app'],
      patientId: 'PAT-003',
      patientName: 'Emily Rodriguez',
      invoiceId: 'INV-003',
      invoiceNumber: 'INV-2024-003',
      amount: 420,
      createdAt: '2024-10-29T09:22:00Z',
      starredAt: '2024-10-29T11:30:00Z'
    }
  ],
  templates = [
    {
      id: 'TPL-001',
      name: 'Payment Reminder',
      type: 'payment-overdue',
      subject: 'Payment Reminder - Invoice {{invoiceNumber}}',
      content: 'Dear {{patientName}}, this is a friendly reminder that Invoice {{invoiceNumber}} for ${{amount}} is now overdue.',
      channels: ['email', 'sms'],
      enabled: true,
      schedule: {
        enabled: true,
        delay: 7,
        unit: 'days',
        repeat: { enabled: true, interval: 7, maxRepeats: 3 }
      }
    },
    {
      id: 'TPL-002',
      name: 'Invoice Delivery',
      type: 'invoice-sent',
      subject: 'Your Invoice is Ready - {{invoiceNumber}}',
      content: 'Dear {{patientName}}, your invoice {{invoiceNumber}} for ${{amount}} is now available.',
      channels: ['email'],
      enabled: true
    }
  ],
  unreadCount = 0,
  loading = false,
  searchTerm = '',
  filters = {
    type: [],
    priority: [],
    status: [],
    channel: []
  },
  className = '',
  onNotificationClick,
  onMarkAsRead,
  onMarkAsUnread,
  onStarNotification,
  onArchiveNotification,
  onDeleteNotification,
  onSendNotification,
  onSearchChange,
  onFilterChange,
  onRefresh,
  onSettings
}: BillingNotificationsProps) => {
  // State
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');

  /**
   * Gets notification type configuration
   */
  const getTypeConfig = (type: NotificationType) => {
    const configs = {
      'payment-received': {
        icon: CheckCircle,
        color: 'text-green-600 bg-green-100',
        label: 'Payment Received'
      },
      'payment-overdue': {
        icon: AlertTriangle,
        color: 'text-red-600 bg-red-100',
        label: 'Payment Overdue'
      },
      'invoice-sent': {
        icon: Mail,
        color: 'text-blue-600 bg-blue-100',
        label: 'Invoice Sent'
      },
      'invoice-viewed': {
        icon: Eye,
        color: 'text-purple-600 bg-purple-100',
        label: 'Invoice Viewed'
      },
      'payment-failed': {
        icon: X,
        color: 'text-red-600 bg-red-100',
        label: 'Payment Failed'
      },
      'reminder-sent': {
        icon: Bell,
        color: 'text-orange-600 bg-orange-100',
        label: 'Reminder Sent'
      },
      'system-alert': {
        icon: Info,
        color: 'text-gray-600 bg-gray-100',
        label: 'System Alert'
      },
      'billing-update': {
        icon: FileText,
        color: 'text-indigo-600 bg-indigo-100',
        label: 'Billing Update'
      },
      'collection-notice': {
        icon: Building,
        color: 'text-red-600 bg-red-100',
        label: 'Collection Notice'
      }
    };
    return configs[type];
  };

  /**
   * Gets priority configuration
   */
  const getPriorityConfig = (priority: NotificationPriority) => {
    const configs = {
      low: { color: 'text-gray-600', dot: 'bg-gray-400' },
      medium: { color: 'text-blue-600', dot: 'bg-blue-400' },
      high: { color: 'text-orange-600', dot: 'bg-orange-400' },
      urgent: { color: 'text-red-600', dot: 'bg-red-400' }
    };
    return configs[priority];
  };

  /**
   * Gets channel icon
   */
  const getChannelIcon = (channel: NotificationChannel) => {
    const icons = {
      email: Mail,
      sms: MessageSquare,
      'in-app': Bell,
      push: BellRing,
      webhook: Zap
    };
    return icons[channel] || Bell;
  };

  /**
   * Formats currency amount
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  /**
   * Handles notification selection
   */
  const handleNotificationSelect = (notificationId: string, selected: boolean) => {
    const newSelection = selected
      ? [...selectedNotifications, notificationId]
      : selectedNotifications.filter(id => id !== notificationId);
    setSelectedNotifications(newSelection);
  };

  /**
   * Handles select all notifications
   */
  const handleSelectAll = (selected: boolean) => {
    const newSelection = selected ? notifications.map(n => n.id) : [];
    setSelectedNotifications(newSelection);
  };

  /**
   * Gets filtered notifications based on active tab and filters
   */
  const getFilteredNotifications = () => {
    let filtered = notifications;

    // Apply tab filter
    switch (activeTab) {
      case 'unread':
        filtered = filtered.filter(n => n.status === 'unread');
        break;
      case 'starred':
        filtered = filtered.filter(n => n.status === 'starred');
        break;
      case 'archived':
        filtered = filtered.filter(n => n.status === 'archived');
        break;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply additional filters
    if (filters.type.length > 0) {
      filtered = filtered.filter(n => filters.type.includes(n.type));
    }
    if (filters.priority.length > 0) {
      filtered = filtered.filter(n => filters.priority.includes(n.priority));
    }
    if (filters.status.length > 0) {
      filtered = filtered.filter(n => filters.status.includes(n.status));
    }

    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();

  if (loading) {
    return (
      <div className={`bg-white min-h-screen ${className}`}>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 min-h-screen ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Billing Notifications</h1>
                <p className="text-gray-600">
                  Manage billing communications and alerts
                  {unreadCount > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {unreadCount} unread
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onRefresh}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                aria-label="Refresh notifications"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button
                onClick={onSettings}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                aria-label="Notification settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'all', label: 'All Notifications', count: notifications.length },
                { id: 'unread', label: 'Unread', count: notifications.filter(n => n.status === 'unread').length },
                { id: 'starred', label: 'Starred', count: notifications.filter(n => n.status === 'starred').length },
                { id: 'archived', label: 'Archived', count: notifications.filter(n => n.status === 'archived').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange?.(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm 
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Filters */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
          
          {selectedNotifications.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedNotifications.length} selected
              </span>
              <button
                onClick={() => onMarkAsRead?.(selectedNotifications)}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 
                         bg-blue-50 border border-blue-200 rounded hover:bg-blue-100"
              >
                Mark Read
              </button>
              <button
                onClick={() => onArchiveNotification?.(selectedNotifications)}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 
                         bg-gray-50 border border-gray-200 rounded hover:bg-gray-100"
              >
                <Archive className="w-3 h-3 mr-1" />
                Archive
              </button>
              <button
                onClick={() => onDeleteNotification?.(selectedNotifications)}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 
                         bg-red-50 border border-red-200 rounded hover:bg-red-100"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600">
              {searchTerm || Object.values(filters).some(arr => arr.length > 0)
                ? 'No notifications match your current search or filters.'
                : 'No notifications to display.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const typeConfig = getTypeConfig(notification.type);
              const priorityConfig = getPriorityConfig(notification.priority);
              const TypeIcon = typeConfig.icon;
              const isSelected = selectedNotifications.includes(notification.id);

              return (
                <div
                  key={notification.id}
                  className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow ${
                    notification.status === 'unread' ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Selection checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleNotificationSelect(notification.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-2"
                    />
                    
                    {/* Notification icon */}
                    <div className={`p-2 rounded-lg ${typeConfig.color} mt-1`}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    
                    {/* Notification content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className={`text-lg font-semibold ${
                            notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}></div>
                            <span className={`text-xs font-medium capitalize ${priorityConfig.color}`}>
                              {notification.priority}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onStarNotification?.(notification.id)}
                            className="p-1 text-gray-400 hover:text-yellow-500 rounded"
                            aria-label={notification.status === 'starred' ? 'Unstar' : 'Star'}
                          >
                            {notification.status === 'starred' ? (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            ) : (
                              <StarOff className="w-4 h-4" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => onNotificationClick?.(notification)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            aria-label="View notification"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{notification.message}</p>
                      
                      {/* Notification metadata */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          {notification.patientName && (
                            <div className="flex items-center space-x-1 text-gray-500">
                              <User className="w-4 h-4" />
                              <span>{notification.patientName}</span>
                            </div>
                          )}
                          
                          {notification.amount && (
                            <div className="flex items-center space-x-1 text-gray-500">
                              <DollarSign className="w-4 h-4" />
                              <span>{formatCurrency(notification.amount)}</span>
                            </div>
                          )}
                          
                          {notification.invoiceNumber && (
                            <div className="flex items-center space-x-1 text-gray-500">
                              <FileText className="w-4 h-4" />
                              <span>{notification.invoiceNumber}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {/* Delivery channels */}
                          <div className="flex items-center space-x-1">
                            {notification.channels.map((channel) => {
                              const ChannelIcon = getChannelIcon(channel);
                              const status = notification.deliveryStatus?.[channel as keyof typeof notification.deliveryStatus];
                              return (
                                <div key={channel} className="relative">
                                  <ChannelIcon className={`w-4 h-4 ${
                                    status === 'delivered' ? 'text-green-500' :
                                    status === 'failed' ? 'text-red-500' :
                                    status === 'sent' ? 'text-blue-500' :
                                    'text-gray-400'
                                  }`} />
                                  {status === 'delivered' && (
                                    <CheckCircle className="w-2 h-2 text-green-500 absolute -top-1 -right-1" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          
                          <span className="text-gray-500">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingNotifications;
