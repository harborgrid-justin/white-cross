/**
 * @fileoverview Profile Sidebar Component - Profile navigation and quick actions
 * @module app/(dashboard)/profile/_components/ProfileSidebar
 * @category Profile - Components
 */

'use client';

import { useState } from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Activity, 
  Lock,
  Key,
  Eye,
  Camera,
  Download,
  Upload,
  Clock,
  Mail,
  Phone,
  Award,
  FileText,
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export function ProfileSidebar() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    profileSections: true,
    quickActions: true,
    preferences: false,
    security: false,
    activity: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Mock user data for sidebar display
  const currentUser = {
    name: 'Sarah Johnson',
    role: 'School Nurse',
    avatar: null,
    lastLogin: '2024-01-15T10:30:00Z',
    profileCompleteness: 85,
    security: {
      twoFactorEnabled: true,
      lastPasswordChange: '2023-11-15',
      loginSessions: 3
    },
    notifications: {
      unread: 5,
      settings: {
        email: true,
        desktop: true,
        sms: false
      }
    },
    recentActivity: [
      { action: 'Updated profile', time: '10 minutes ago' },
      { action: 'Changed password', time: '2 hours ago' },
      { action: 'Login', time: '3 hours ago' }
    ]
  };

  // Profile sections for navigation
  const profileSections = [
    {
      id: 'personal',
      label: 'Personal Information',
      icon: User,
      description: 'Name, contact details, job info',
      completed: true,
      href: '#personal'
    },
    {
      id: 'contact',
      label: 'Contact Details',
      icon: Mail,
      description: 'Email, phone, address',
      completed: true,
      href: '#contact'
    },
    {
      id: 'emergency',
      label: 'Emergency Contact',
      icon: AlertTriangle,
      description: 'Emergency contact information',
      completed: true,
      href: '#emergency'
    },
    {
      id: 'security',
      label: 'Security Settings',
      icon: Shield,
      description: '2FA, password, session timeout',
      completed: currentUser.security.twoFactorEnabled,
      href: '#security'
    },
    {
      id: 'certifications',
      label: 'Certifications',
      icon: Award,
      description: 'Professional licenses & certs',
      completed: false,
      href: '#certifications'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: Settings,
      description: 'Notifications, language, theme',
      completed: true,
      href: '#preferences'
    },
    {
      id: 'activity',
      label: 'Activity History',
      icon: Activity,
      description: 'Recent actions & audit log',
      completed: true,
      href: '#activity'
    }
  ];

  // Quick actions for profile management
  const quickActions = [
    {
      id: 'upload-photo',
      label: 'Upload Photo',
      icon: Camera,
      action: () => console.log('Upload photo'),
      color: 'blue'
    },
    {
      id: 'change-password',
      label: 'Change Password',
      icon: Key,
      action: () => console.log('Change password'),
      color: 'yellow'
    },
    {
      id: 'export-data',
      label: 'Export Data',
      icon: Download,
      action: () => console.log('Export data'),
      color: 'green'
    },
    {
      id: 'privacy-settings',
      label: 'Privacy Settings',
      icon: Eye,
      action: () => console.log('Privacy settings'),
      color: 'purple'
    },
    {
      id: 'backup-settings',
      label: 'Backup Settings',
      icon: Upload,
      action: () => console.log('Backup settings'),
      color: 'indigo'
    }
  ];

  // Security metrics for display
  const securityMetrics = [
    {
      label: '2FA Status',
      value: currentUser.security.twoFactorEnabled ? 'Enabled' : 'Disabled',
      icon: Shield,
      status: currentUser.security.twoFactorEnabled ? 'success' : 'warning'
    },
    {
      label: 'Password Age',
      value: '2 months',
      icon: Lock,
      status: 'info'
    },
    {
      label: 'Active Sessions',
      value: currentUser.security.loginSessions.toString(),
      icon: Activity,
      status: 'info'
    }
  ];

  const getActionColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
      yellow: 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100',
      green: 'text-green-600 bg-green-50 hover:bg-green-100',
      purple: 'text-purple-600 bg-purple-50 hover:bg-purple-100',
      indigo: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      success: 'text-green-600 bg-green-100',
      warning: 'text-yellow-600 bg-yellow-100',
      error: 'text-red-600 bg-red-100',
      info: 'text-blue-600 bg-blue-100'
    };
    return colors[status as keyof typeof colors] || colors.info;
  };

  return (
    <div className="w-80 flex-shrink-0 space-y-6">
      {/* Profile Overview */}
      <div className="p-4 border rounded-lg bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
            {currentUser.name.split(' ').map(n => n.charAt(0)).join('')}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{currentUser.name}</h3>
            <p className="text-sm text-gray-600">{currentUser.role}</p>
          </div>
        </div>

        {/* Profile Completeness */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
            <span className="text-sm text-gray-600">{currentUser.profileCompleteness}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300 w-4/5"></div>
          </div>
        </div>

        {/* Last Login */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Clock className="h-3 w-3" />
          <span>Last login: Today at 10:30 AM</span>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="p-4 border rounded-lg bg-white">
        <div 
          className="flex items-center justify-between mb-4 cursor-pointer"
          onClick={() => toggleSection('profileSections')}
        >
          <h3 className="font-medium text-gray-900">Profile Sections</h3>
          {expandedSections.profileSections ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </div>

        {expandedSections.profileSections && (
          <div className="space-y-2">
            {profileSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <a
                  key={section.id}
                  href={section.href}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <IconComponent className="h-4 w-4 text-gray-400 mt-0.5 group-hover:text-blue-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                        {section.label}
                      </span>
                      {section.completed && (
                        <Check className="h-3 w-3 text-green-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">{section.description}</p>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border rounded-lg bg-white">
        <div 
          className="flex items-center justify-between mb-4 cursor-pointer"
          onClick={() => toggleSection('quickActions')}
        >
          <h3 className="font-medium text-gray-900">Quick Actions</h3>
          {expandedSections.quickActions ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </div>

        {expandedSections.quickActions && (
          <div className="space-y-2">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${getActionColor(action.color)}`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Security Overview */}
      <div className="p-4 border rounded-lg bg-white">
        <div 
          className="flex items-center justify-between mb-4 cursor-pointer"
          onClick={() => toggleSection('security')}
        >
          <h3 className="font-medium text-gray-900">Security Overview</h3>
          {expandedSections.security ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </div>

        {expandedSections.security && (
          <div className="space-y-3">
            {securityMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{metric.label}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(metric.status)}`}>
                    {metric.value}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="p-4 border rounded-lg bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Notifications</h3>
          {currentUser.notifications.unread > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
              {currentUser.notifications.unread}
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-600">Email</span>
            </div>
            <div className={`w-4 h-2 rounded-full ${currentUser.notifications.settings.email ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-600">Desktop</span>
            </div>
            <div className={`w-4 h-2 rounded-full ${currentUser.notifications.settings.desktop ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-600">SMS</span>
            </div>
            <div className={`w-4 h-2 rounded-full ${currentUser.notifications.settings.sms ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
        </div>

        <button className="w-full mt-3 px-3 py-2 text-xs text-blue-600 hover:text-blue-700 font-medium">
          Manage Notification Settings
        </button>
      </div>

      {/* Recent Activity */}
      <div className="p-4 border rounded-lg bg-white">
        <div 
          className="flex items-center justify-between mb-4 cursor-pointer"
          onClick={() => toggleSection('activity')}
        >
          <h3 className="font-medium text-gray-900">Recent Activity</h3>
          {expandedSections.activity ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </div>

        {expandedSections.activity && (
          <div className="space-y-3">
            {currentUser.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}

            <button className="w-full mt-2 px-3 py-2 text-xs text-blue-600 hover:text-blue-700 font-medium">
              View Full Activity Log
            </button>
          </div>
        )}
      </div>

      {/* Profile Tools */}
      <div className="p-4 border rounded-lg bg-white">
        <h3 className="font-medium text-gray-900 mb-3">Profile Tools</h3>
        <div className="space-y-2">
          <button className="w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <FileText className="h-4 w-4 inline mr-2" />
            Export Profile Data
          </button>
          <button className="w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <Upload className="h-4 w-4 inline mr-2" />
            Import Settings
          </button>
          <button className="w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <Shield className="h-4 w-4 inline mr-2" />
            Privacy Checkup
          </button>
          <button className="w-full p-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <AlertTriangle className="h-4 w-4 inline mr-2" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}