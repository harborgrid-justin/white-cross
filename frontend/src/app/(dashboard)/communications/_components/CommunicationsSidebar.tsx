/**
 * @fileoverview Communications Sidebar Component
 * @module app/(dashboard)/communications/_components/CommunicationsSidebar
 * @category Communications - Components
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle,
  Plus,
  Inbox,
  Send,
  Calendar,
  Archive,
  Trash2,
  Star,
  AlertTriangle,
  Users,
  Settings,
  Filter,
  Mail,
  Phone,
  Bell,
  Megaphone,
  Clock
} from 'lucide-react';

interface CommunicationsSidebarProps {
  className?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: typeof MessageCircle;
  count?: number;
  href?: string;
  isActive?: boolean;
}

interface QuickAction {
  id: string;
  label: string;
  icon: typeof Plus;
  onClick: () => void;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'inbox',
    label: 'Inbox',
    icon: Inbox,
    count: 12,
    href: '/dashboard/communications',
    isActive: true
  },
  {
    id: 'sent',
    label: 'Sent',
    icon: Send,
    count: 45,
    href: '/dashboard/communications/sent'
  },
  {
    id: 'scheduled',
    label: 'Scheduled',
    icon: Calendar,
    count: 3,
    href: '/dashboard/communications/scheduled'
  },
  {
    id: 'drafts',
    label: 'Drafts',
    icon: MessageCircle,
    count: 2,
    href: '/dashboard/communications/drafts'
  },
  {
    id: 'starred',
    label: 'Starred',
    icon: Star,
    count: 8,
    href: '/dashboard/communications/starred'
  },
  {
    id: 'emergency',
    label: 'Emergency',
    icon: AlertTriangle,
    count: 1,
    href: '/dashboard/communications/emergency'
  },
  {
    id: 'archived',
    label: 'Archived',
    icon: Archive,
    href: '/dashboard/communications/archived'
  },
  {
    id: 'trash',
    label: 'Trash',
    icon: Trash2,
    href: '/dashboard/communications/trash'
  }
];

const quickActions: QuickAction[] = [
  {
    id: 'compose',
    label: 'Compose Message',
    icon: Plus,
    onClick: () => console.log('Compose message')
  },
  {
    id: 'broadcast',
    label: 'Send Broadcast',
    icon: Megaphone,
    onClick: () => console.log('Send broadcast')
  },
  {
    id: 'emergency',
    label: 'Emergency Alert',
    icon: AlertTriangle,
    onClick: () => console.log('Emergency alert')
  }
];

const messageTypeStats = [
  { type: 'Email', icon: Mail, count: 156, color: 'text-blue-600' },
  { type: 'SMS', icon: Phone, count: 89, color: 'text-green-600' },
  { type: 'Push', icon: Bell, count: 234, color: 'text-purple-600' },
  { type: 'Broadcast', icon: Megaphone, count: 45, color: 'text-orange-600' }
];

export function CommunicationsSidebar({ className }: CommunicationsSidebarProps) {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>('inbox');

  const handleNavigationClick = (item: NavigationItem) => {
    setSelectedFilter(item.id);
    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <div className={`w-80 p-6 space-y-6 ${className}`}>
      {/* Quick Actions */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-4 space-y-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={action.onClick}
                className="w-full justify-start text-left"
              >
                <Icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Navigation */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Messages</h3>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedFilter === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigationClick(item)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className={`h-4 w-4 mr-3 ${
                      isActive ? 'text-blue-700' : 'text-gray-400'
                    }`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <Badge 
                      variant={isActive ? "default" : "secondary"} 
                      className="text-xs"
                    >
                      {item.count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </Card>

      {/* Message Type Statistics */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Message Types</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {messageTypeStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon className={`h-4 w-4 mr-2 ${stat.color}`} />
                    <span className="text-sm text-gray-700">{stat.type}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {stat.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-900 font-medium">
                  Medication reminder sent
                </p>
                <p className="text-xs text-gray-500">
                  To Emma Wilson • 2 min ago
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-900 font-medium">
                  Emergency alert sent
                </p>
                <p className="text-xs text-gray-500">
                  To all parents • 15 min ago
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-900 font-medium">
                  Health screening results
                </p>
                <p className="text-xs text-gray-500">
                  To parent group • 1 hr ago
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-900 font-medium">
                  Flu prevention tips
                </p>
                <p className="text-xs text-gray-500">
                  Scheduled for tomorrow
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Settings */}
      <Card>
        <div className="p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => router.push('/dashboard/communications/settings')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Communication Settings
          </Button>
        </div>
      </Card>
    </div>
  );
}
