/**
 * BroadcastsSidebar Component - White Cross Healthcare Platform
 * 
 * Mass communication sidebar featuring:
 * - Broadcast templates and quick actions
 * - Recipient group management
 * - Communication statistics
 * - Emergency broadcast controls
 * - Recent activity tracking
 * 
 * @component BroadcastsSidebar
 */

'use client';

import React from 'react';
import { 
  Megaphone, 
  AlertTriangle, 
  Clock, 
  Send,
  Users,
  MessageSquare,
  Radio,
  TrendingUp,
  Plus,
  Settings,
  Shield,
  Bell,
  Mail,
  Phone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function BroadcastsSidebar() {
  return (
    <div className="space-y-6">
      {/* Quick Broadcast Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="destructive" className="w-full justify-start text-left">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Alert
            </Button>
            <Button variant="outline" className="w-full justify-start text-left">
              <Plus className="h-4 w-4 mr-2" />
              Health Announcement
            </Button>
            <Button variant="outline" className="w-full justify-start text-left">
              <MessageSquare className="h-4 w-4 mr-2" />
              General Notice
            </Button>
            <Button variant="outline" className="w-full justify-start text-left">
              <Clock className="h-4 w-4 mr-2" />
              Schedule Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recipient Groups */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recipient Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'All Staff', count: 45, status: 'active', type: 'staff' },
              { name: 'School Nurses', count: 3, status: 'active', type: 'healthcare' },
              { name: 'All Parents', count: 280, status: 'active', type: 'parent' },
              { name: 'Emergency Contacts', count: 315, status: 'active', type: 'emergency' },
              { name: 'K-3 Parents', count: 120, status: 'active', type: 'parent' },
              { name: 'Teachers', count: 28, status: 'active', type: 'staff' },
              { name: 'Administration', count: 8, status: 'active', type: 'admin' }
            ].map((group, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                <div className="flex items-center space-x-2">
                  <Users className={`h-4 w-4 ${
                    group.type === 'emergency' ? 'text-red-500' :
                    group.type === 'healthcare' ? 'text-blue-500' :
                    group.type === 'admin' ? 'text-purple-500' :
                    'text-gray-500'
                  }`} />
                  <div>
                    <div className="text-xs font-medium text-gray-900">{group.name}</div>
                    <div className="text-xs text-gray-500">{group.count} members</div>
                  </div>
                </div>
                <Badge className={
                  group.type === 'emergency' ? 'bg-red-100 text-red-800' :
                  group.type === 'healthcare' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }>
                  {group.status}
                </Badge>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-3" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage Groups
          </Button>
        </CardContent>
      </Card>

      {/* Broadcast Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Message Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                name: 'Weather Emergency', 
                type: 'emergency',
                usage: 8,
                icon: AlertTriangle 
              },
              { 
                name: 'Health Screening Notice', 
                type: 'health',
                usage: 15,
                icon: Shield 
              },
              { 
                name: 'Medication Reminder', 
                type: 'reminder',
                usage: 22,
                icon: Bell 
              },
              { 
                name: 'Policy Update', 
                type: 'policy',
                usage: 6,
                icon: MessageSquare 
              },
              { 
                name: 'Event Announcement', 
                type: 'announcement',
                usage: 12,
                icon: Megaphone 
              }
            ].map((template, index) => {
              const IconComponent = template.icon;
              return (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50 hover:bg-gray-100 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`h-4 w-4 ${
                      template.type === 'emergency' ? 'text-red-500' :
                      template.type === 'health' ? 'text-blue-500' :
                      template.type === 'reminder' ? 'text-yellow-500' :
                      'text-gray-500'
                    }`} />
                    <div>
                      <div className="text-xs font-medium text-gray-900">{template.name}</div>
                      <div className="text-xs text-gray-500">Used {template.usage} times</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Button variant="outline" className="w-full mt-3" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </CardContent>
      </Card>

      {/* Communication Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">This Week&apos;s Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Send className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Messages Sent</span>
              </div>
              <span className="text-sm font-medium">24</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Delivery Rate</span>
              </div>
              <span className="text-sm font-medium">97.8%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-600">Open Rate</span>
              </div>
              <span className="text-sm font-medium">82.4%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-gray-600">Emergency Alerts</span>
              </div>
              <span className="text-sm font-medium">3</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-indigo-600" />
                <span className="text-sm text-gray-600">Total Reached</span>
              </div>
              <span className="text-sm font-medium">1,247</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                action: 'Emergency alert sent',
                target: 'All Staff & Parents',
                time: '2 min ago',
                type: 'emergency',
                icon: AlertTriangle
              },
              { 
                action: 'Health reminder scheduled',
                target: 'K-3 Parents',
                time: '15 min ago',
                type: 'scheduled',
                icon: Clock
              },
              { 
                action: 'Policy update delivered',
                target: 'All Staff',
                time: '1 hour ago',
                type: 'delivered',
                icon: MessageSquare
              },
              { 
                action: 'Template created',
                target: 'Medication Notice',
                time: '3 hours ago',
                type: 'created',
                icon: Plus
              }
            ].map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-1.5 rounded-full ${
                    activity.type === 'emergency' ? 'bg-red-100' :
                    activity.type === 'scheduled' ? 'bg-yellow-100' :
                    activity.type === 'delivered' ? 'bg-green-100' :
                    'bg-blue-100'
                  }`}>
                    <IconComponent className={`h-3 w-3 ${
                      activity.type === 'emergency' ? 'text-red-600' :
                      activity.type === 'scheduled' ? 'text-yellow-600' :
                      activity.type === 'delivered' ? 'text-green-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-900">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.target}</div>
                    <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Communication Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Communication Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Email</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">SMS</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-600">Push Notifications</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-gray-600">PA System</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Standby</Badge>
            </div>
          </div>
          
          <Button variant="outline" className="w-full mt-3" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Channel Settings
          </Button>
        </CardContent>
      </Card>

      {/* Emergency Protocols */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Emergency Protocols</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="destructive" className="w-full justify-start text-left" size="sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Medical Emergency
            </Button>
            <Button variant="destructive" className="w-full justify-start text-left" size="sm">
              <Shield className="h-4 w-4 mr-2" />
              Weather Alert
            </Button>
            <Button variant="destructive" className="w-full justify-start text-left" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              School Closure
            </Button>
            <Button variant="outline" className="w-full justify-start text-left" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Manage Protocols
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}