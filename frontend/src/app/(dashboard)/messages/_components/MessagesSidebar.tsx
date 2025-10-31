'use client';

import React from 'react';
import { 
  MessageSquare, 
  Send, 
  Inbox, 
  Archive, 
  Star, 
  AlertTriangle,
  Stethoscope,
  Calendar,
  Users,
  Bell,
  Shield,
  Plus,
  Activity,
  CheckCircle,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  active: boolean;
  urgent?: boolean;
  action?: boolean;
}

interface MessageMetrics {
  unread: number;
  emergency: number;
  medical: number;
  appointments: number;
  parentCommunications: number;
  requiresAcknowledgment: number;
  totalToday: number;
  responseTime: string;
}

interface RecentActivity {
  id: string;
  type: 'message_received' | 'message_sent' | 'emergency_alert' | 'acknowledgment' | 'appointment_reminder';
  description: string;
  timestamp: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent' | 'emergency';
}

interface MessagesSidebarProps {
  metrics?: MessageMetrics;
  recentActivity?: RecentActivity[];
}

const MessagesSidebar: React.FC<MessagesSidebarProps> = ({ 
  metrics = {
    unread: 7,
    emergency: 1,
    medical: 3,
    appointments: 5,
    parentCommunications: 2,
    requiresAcknowledgment: 4,
    totalToday: 23,
    responseTime: '12 min'
  },
  recentActivity = []
}) => {
  const pathname = usePathname();

  // Mock recent activity data with static timestamps
  const baseTime = new Date('2024-10-31T10:30:00').getTime();
  const mockRecentActivity: RecentActivity[] = [
    {
      id: 'activity-001',
      type: 'emergency_alert',
      description: 'Emergency alert sent for student allergic reaction',
      timestamp: new Date(baseTime - 15 * 60 * 1000),
      priority: 'emergency'
    },
    {
      id: 'activity-002',
      type: 'message_received',
      description: 'Received parent conference request from Maria Martinez',
      timestamp: new Date(baseTime - 2 * 60 * 60 * 1000),
      priority: 'normal'
    },
    {
      id: 'activity-003',
      type: 'acknowledgment',
      description: 'Acknowledged medication administration report',
      timestamp: new Date(baseTime - 4 * 60 * 60 * 1000),
      priority: 'normal'
    },
    {
      id: 'activity-004',
      type: 'appointment_reminder',
      description: 'Health screening reminders sent to 3 families',
      timestamp: new Date(baseTime - 6 * 60 * 60 * 1000),
      priority: 'normal'
    },
    {
      id: 'activity-005',
      type: 'message_sent',
      description: 'Sent medication refill notification to supervisor',
      timestamp: new Date(baseTime - 8 * 60 * 60 * 1000),
      priority: 'high'
    }
  ];

  const activities = recentActivity.length > 0 ? recentActivity : mockRecentActivity;

  const navigationSections: Array<{
    title: string;
    items: NavigationItem[];
  }> = [
    {
      title: 'Messages',
      items: [
        {
          href: '/messages',
          label: 'All Messages',
          icon: MessageSquare,
          count: metrics.unread > 0 ? metrics.unread : undefined,
          active: pathname === '/messages'
        },
        {
          href: '/messages?filter=unread',
          label: 'Unread',
          icon: Inbox,
          count: metrics.unread,
          active: pathname.includes('filter=unread')
        },
        {
          href: '/messages?filter=starred',
          label: 'Starred',
          icon: Star,
          active: pathname.includes('filter=starred')
        },
        {
          href: '/messages?filter=archived',
          label: 'Archived',
          icon: Archive,
          active: pathname.includes('filter=archived')
        }
      ]
    },
    {
      title: 'Healthcare Communications',
      items: [
        {
          href: '/messages?type=emergency',
          label: 'Emergency Alerts',
          icon: AlertTriangle,
          count: metrics.emergency,
          active: pathname.includes('type=emergency'),
          urgent: metrics.emergency > 0
        },
        {
          href: '/messages?type=medical',
          label: 'Medical Messages',
          icon: Stethoscope,
          count: metrics.medical,
          active: pathname.includes('type=medical')
        },
        {
          href: '/messages?type=appointment',
          label: 'Appointments',
          icon: Calendar,
          count: metrics.appointments,
          active: pathname.includes('type=appointment')
        },
        {
          href: '/messages?type=parent_communication',
          label: 'Parent Communications',
          icon: Users,
          count: metrics.parentCommunications,
          active: pathname.includes('type=parent_communication')
        },
        {
          href: '/messages?type=medication',
          label: 'Medication Alerts',
          icon: Shield,
          active: pathname.includes('type=medication')
        }
      ]
    },
    {
      title: 'Quick Actions',
      items: [
        {
          href: '/messages/new',
          label: 'New Message',
          icon: Send,
          action: true,
          active: pathname === '/messages/new'
        },
        {
          href: '/messages/emergency',
          label: 'Emergency Alert',
          icon: AlertTriangle,
          action: true,
          urgent: true,
          active: pathname === '/messages/emergency'
        },
        {
          href: '/messages/broadcast',
          label: 'Broadcast Message',
          icon: Bell,
          action: true,
          active: pathname === '/messages/broadcast'
        }
      ]
    }
  ];

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'emergency_alert':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'message_received':
        return <Inbox className="h-4 w-4 text-blue-500" />;
      case 'message_sent':
        return <Send className="h-4 w-4 text-green-500" />;
      case 'acknowledgment':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'appointment_reminder':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: RecentActivity['priority']) => {
    switch (priority) {
      case 'emergency':
        return 'border-l-red-500 bg-red-50';
      case 'urgent':
        return 'border-l-orange-500 bg-orange-50';
      case 'high':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Messages</h2>
          <button 
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            title="Message Settings"
            aria-label="Message Settings"
          >
            <Settings className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        
        {/* Key Metrics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Today&apos;s Messages</span>
            <span className="font-medium text-gray-900">{metrics.totalToday}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Avg Response Time</span>
            <span className="font-medium text-gray-900">{metrics.responseTime}</span>
          </div>
          {metrics.requiresAcknowledgment > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-600">Need Acknowledgment</span>
              <span className="font-medium text-red-600">{metrics.requiresAcknowledgment}</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2">
          {navigationSections.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="mt-2 space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href as '/messages'}
                      className={`group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        item.active
                          ? 'bg-blue-100 text-blue-700'
                          : item.urgent
                          ? 'text-red-600 hover:bg-red-50'
                          : item.action
                          ? 'text-blue-600 hover:bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className={`h-4 w-4 mr-3 ${
                          item.active
                            ? 'text-blue-500'
                            : item.urgent
                            ? 'text-red-500'
                            : item.action
                            ? 'text-blue-500'
                            : 'text-gray-400'
                        }`} />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.urgent
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Recent Activity */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Recent Activity
          </h3>
          <Activity className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {activities.slice(0, 5).map((activity) => (
            <div
              key={activity.id}
              className={`p-2 rounded-md border-l-2 ${getPriorityColor(activity.priority)} transition-colors hover:bg-gray-50`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900 line-clamp-2 mb-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {activities.length > 5 && (
          <button 
            className="block mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
            onClick={() => {/* Navigate to activity page */}}
          >
            View all activity →
          </button>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="border-t border-gray-200 p-3 bg-gray-50">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2">
            <div className="text-lg font-bold text-green-600">{metrics.unread}</div>
            <div className="text-xs text-gray-600">Unread</div>
          </div>
          <div className="p-2">
            <div className="text-lg font-bold text-red-600">{metrics.emergency}</div>
            <div className="text-xs text-gray-600">Emergency</div>
          </div>
        </div>
        
        <Link href="/messages/new">
          <button className="w-full mt-3 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            New Message
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MessagesSidebar;