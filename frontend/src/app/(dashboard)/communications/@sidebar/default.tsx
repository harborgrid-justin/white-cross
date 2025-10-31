/**
 * @fileoverview Communications Sidebar Component - Healthcare messaging navigation
 * @module app/(dashboard)/communications/@sidebar/default
 * @category Communications - Sidebar
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Send,
  Inbox,
  Archive,
  Trash2,
  Star,
  Bell,
  AlertTriangle,
  Clock,
  Megaphone,
  Settings,
  Plus,
  Eye,
  EyeOff,
  Phone,
  Mail
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  isActive?: boolean;
  variant?: 'default' | 'emergency' | 'success' | 'warning';
}

interface FilterOption {
  id: string;
  label: string;
  value: string;
  count: number;
}

interface CommunicationsSidebarProps {
  className?: string;
}

const navigationItems: SidebarItem[] = [
  {
    id: 'inbox',
    label: 'Inbox',
    icon: Inbox,
    count: 23,
    isActive: true
  },
  {
    id: 'sent',
    label: 'Sent Messages',
    icon: Send,
    count: 156
  },
  {
    id: 'emergency',
    label: 'Emergency Alerts',
    icon: AlertTriangle,
    count: 3,
    variant: 'emergency'
  },
  {
    id: 'scheduled',
    label: 'Scheduled',
    icon: Clock,
    count: 8,
    variant: 'warning'
  },
  {
    id: 'broadcasts',
    label: 'Broadcasts',
    icon: Megaphone,
    count: 12
  },
  {
    id: 'starred',
    label: 'Starred',
    icon: Star,
    count: 5
  },
  {
    id: 'archived',
    label: 'Archived',
    icon: Archive,
    count: 234
  },
  {
    id: 'trash',
    label: 'Trash',
    icon: Trash2,
    count: 7
  }
];

const messageTypeFilters: FilterOption[] = [
  { id: 'email', label: 'Email', value: 'EMAIL', count: 156 },
  { id: 'sms', label: 'SMS', value: 'SMS', count: 89 },
  { id: 'push', label: 'Push Notifications', value: 'PUSH_NOTIFICATION', count: 234 },
  { id: 'emergency', label: 'Emergency', value: 'EMERGENCY', count: 12 },
  { id: 'reminder', label: 'Reminders', value: 'REMINDER', count: 67 }
];

const statusFilters: FilterOption[] = [
  { id: 'sent', label: 'Sent', value: 'SENT', count: 345 },
  { id: 'delivered', label: 'Delivered', value: 'DELIVERED', count: 289 },
  { id: 'read', label: 'Read', value: 'READ', count: 167 },
  { id: 'failed', label: 'Failed', value: 'FAILED', count: 8 },
  { id: 'draft', label: 'Draft', value: 'DRAFT', count: 5 }
];

const recipientFilters: FilterOption[] = [
  { id: 'parents', label: 'Parents', value: 'PARENT', count: 456 },
  { id: 'students', label: 'Students', value: 'STUDENT', count: 234 },
  { id: 'staff', label: 'Staff', value: 'STAFF', count: 123 },
  { id: 'emergency-contacts', label: 'Emergency Contacts', value: 'EMERGENCY_CONTACT', count: 67 }
];

function getItemVariantClass(variant: string = 'default') {
  switch (variant) {
    case 'emergency':
      return 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100';
    case 'success':
      return 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100';
    case 'warning':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
    default:
      return 'text-gray-600 hover:text-gray-900 hover:bg-gray-50';
  }
}

function getBadgeVariant(variant: string = 'default') {
  switch (variant) {
    case 'emergency': return 'danger';
    case 'success': return 'success';
    case 'warning': return 'warning';
    default: return 'secondary';
  }
}

export function CommunicationsSidebar({ className = '' }: CommunicationsSidebarProps) {
  const [activeFilter, setActiveFilter] = useState<string>('inbox');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['navigation', 'quick-stats']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className={`w-80 space-y-6 ${className}`}>
      {/* Quick Actions */}
      <Card>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Compose Message
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Alert
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Megaphone className="h-4 w-4 mr-2" />
              Broadcast Message
            </Button>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Messages</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('navigation')}
            >
              {expandedSections.has('navigation') ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {expandedSections.has('navigation') && (
          <div className="p-4">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeFilter === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveFilter(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg border transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : getItemVariantClass(item.variant)
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <Badge 
                        variant={isActive ? 'info' : getBadgeVariant(item.variant)} 
                        className="text-xs"
                      >
                        {item.count}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Quick Stats */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Today&apos;s Activity</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('quick-stats')}
            >
              {expandedSections.has('quick-stats') ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {expandedSections.has('quick-stats') && (
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Send className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">Messages Sent</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">23</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Messages Read</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">18</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm text-gray-600">Emergency Alerts</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">2</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                  <span className="text-sm text-gray-600">Response Time</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">12m</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Message Type Filters */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Message Types</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('types')}
            >
              {expandedSections.has('types') ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {expandedSections.has('types') && (
          <div className="p-4">
            <div className="space-y-2">
              {messageTypeFilters.map((filter) => (
                <div key={filter.id} className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{filter.label}</span>
                  </label>
                  <Badge variant="secondary" className="text-xs">
                    {filter.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Status Filters */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Message Status</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('status')}
            >
              {expandedSections.has('status') ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {expandedSections.has('status') && (
          <div className="p-4">
            <div className="space-y-2">
              {statusFilters.map((filter) => (
                <div key={filter.id} className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{filter.label}</span>
                  </label>
                  <Badge variant="secondary" className="text-xs">
                    {filter.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Recipients Filters */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Recipients</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('recipients')}
            >
              {expandedSections.has('recipients') ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {expandedSections.has('recipients') && (
          <div className="p-4">
            <div className="space-y-2">
              {recipientFilters.map((filter) => (
                <div key={filter.id} className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{filter.label}</span>
                  </label>
                  <Badge variant="secondary" className="text-xs">
                    {filter.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Channel Status */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Channel Status</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm text-gray-700">Email Service</span>
              </div>
              <Badge variant="success" className="text-xs">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-gray-700">SMS Service</span>
              </div>
              <Badge variant="success" className="text-xs">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-4 w-4 text-purple-600 mr-2" />
                <span className="text-sm text-gray-700">Push Notifications</span>
              </div>
              <Badge variant="success" className="text-xs">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                <span className="text-sm text-gray-700">Emergency System</span>
              </div>
              <Badge variant="success" className="text-xs">Online</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Settings */}
      <Card>
        <div className="p-4">
          <Button variant="outline" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Communication Settings
          </Button>
        </div>
      </Card>
    </div>
  );
}