/**
 * DashboardSidebar Component - White Cross Healthcare Platform
 * 
 * Dashboard sidebar featuring:
 * - Quick navigation and shortcuts
 * - Real-time notifications
 * - Health status overview
 * - Recent alerts and activities
 * - System status indicators
 * 
 * @component DashboardSidebar
 */

'use client';

import React from 'react';
import { 
  Bell,
  Users,
  Calendar,
  AlertTriangle,
  Activity,
  Pill,
  FileText,
  MessageSquare,
  Shield,
  Heart,
  Clock,
  TrendingUp,
  CheckCircle,
  Settings,
  Plus,
  Eye,
  Filter,
  Zap,
  Database,
  Wifi,
  Server
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardSidebar() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-left">
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
            <Button variant="outline" className="w-full justify-start text-left">
              <Pill className="h-4 w-4 mr-2" />
              Log Medication
            </Button>
            <Button variant="outline" className="w-full justify-start text-left">
              <FileText className="h-4 w-4 mr-2" />
              Health Report
            </Button>
            <Button variant="outline" className="w-full justify-start text-left">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                type: 'critical',
                message: 'Emma J. - Missed insulin dose',
                time: '5 min ago',
                icon: AlertTriangle,
                color: 'text-red-600 bg-red-50'
              },
              { 
                type: 'high',
                message: 'Michael C. - Severe allergy alert',
                time: '12 min ago',
                icon: Shield,
                color: 'text-orange-600 bg-orange-50'
              },
              { 
                type: 'medium',
                message: 'Sarah M. - Inhaler needed for PE',
                time: '25 min ago',
                icon: Heart,
                color: 'text-yellow-600 bg-yellow-50'
              },
              { 
                type: 'low',
                message: 'James W. - Contact info missing',
                time: '1 hour ago',
                icon: Users,
                color: 'text-blue-600 bg-blue-50'
              }
            ].map((alert, index) => {
              const IconComponent = alert.icon;
              return (
                <div key={index} className={`p-3 rounded-lg border ${alert.color}`}>
                  <div className="flex items-start space-x-2">
                    <IconComponent className="h-4 w-4 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">{alert.message}</p>
                      <p className="text-xs opacity-75 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Button variant="outline" className="w-full mt-3" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View All Alerts
          </Button>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Today&apos;s Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                time: '9:00 AM',
                student: 'Lisa Thompson',
                type: 'Health Screening',
                status: 'completed',
                icon: CheckCircle
              },
              { 
                time: '10:30 AM',
                student: 'Ryan Davis',
                type: 'Medication Admin',
                status: 'completed',
                icon: Pill
              },
              { 
                time: '11:15 AM',
                student: 'Amy Rodriguez',
                type: 'Vision Screening',
                status: 'upcoming',
                icon: Eye
              },
              { 
                time: '2:00 PM',
                student: 'David Kim',
                type: 'Follow-up Visit',
                status: 'upcoming',
                icon: Calendar
              }
            ].map((appointment, index) => {
              const IconComponent = appointment.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-2 rounded bg-gray-50">
                  <div className={`p-1.5 rounded-full ${
                    appointment.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <IconComponent className={`h-3 w-3 ${
                      appointment.status === 'completed' ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-900">{appointment.time}</span>
                      <Badge variant={appointment.status === 'completed' ? 'success' : 'info'} size="sm">
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{appointment.student}</p>
                    <p className="text-xs text-gray-500">{appointment.type}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <Button variant="outline" className="w-full mt-3" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            View Full Schedule
          </Button>
        </CardContent>
      </Card>

      {/* Health Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Active Students</span>
              </div>
              <span className="text-sm font-medium">823</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-red-600" />
                <span className="text-sm text-gray-600">Health Alerts</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">12</span>
                <Badge variant="error" size="sm">4 Critical</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pill className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Medications Today</span>
              </div>
              <span className="text-sm font-medium">28</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-600">Immunization Rate</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">94.8%</span>
                <TrendingUp className="h-3 w-3 text-green-600" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span className="text-sm text-gray-600">Appointments</span>
              </div>
              <span className="text-sm font-medium">15 today</span>
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
                action: 'Screening completed',
                student: 'Lisa Thompson',
                time: '10 min ago',
                type: 'completed',
                icon: CheckCircle
              },
              { 
                action: 'Medication administered',
                student: 'Ryan Davis',
                time: '25 min ago',
                type: 'completed',
                icon: Pill
              },
              { 
                action: 'Alert acknowledged',
                student: 'Michael Chen',
                time: '45 min ago',
                type: 'acknowledged',
                icon: Bell
              },
              { 
                action: 'Document uploaded',
                student: 'Amy Rodriguez',
                time: '1 hour ago',
                type: 'uploaded',
                icon: FileText
              }
            ].map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-1.5 rounded-full ${
                    activity.type === 'completed' ? 'bg-green-100' :
                    activity.type === 'acknowledged' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    <IconComponent className={`h-3 w-3 ${
                      activity.type === 'completed' ? 'text-green-600' :
                      activity.type === 'acknowledged' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-900">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.student}</div>
                    <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <Button variant="outline" className="w-full mt-3" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            View All Activity
          </Button>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Server Status</span>
              </div>
              <Badge variant="success">Online</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Database</span>
              </div>
              <Badge variant="success">Connected</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Network</span>
              </div>
              <Badge variant="success">Stable</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-gray-600">Performance</span>
              </div>
              <Badge variant="warning">Good</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Last Backup</span>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full mt-3" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </CardContent>
      </Card>

      {/* Notifications Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-left" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Configure Alerts
            </Button>
            <Button variant="outline" className="w-full justify-start text-left" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter Settings
            </Button>
            <Button variant="outline" className="w-full justify-start text-left" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message Preferences
            </Button>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Unread notifications</span>
              <Badge variant="error">3</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


