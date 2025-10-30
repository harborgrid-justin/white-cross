'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { 
  Bell,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  User,
  Settings,
  Plus,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  AlertTriangle,
  X,
  Filter,
  Search,
  Download,
  Upload,
  Eye,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  FileText
} from 'lucide-react';
import type { Appointment } from './AppointmentCard';

/**
 * Reminder types
 */
type ReminderType = 'email' | 'sms' | 'phone' | 'push';

/**
 * Reminder timing
 */
type ReminderTiming = '15min' | '30min' | '1hour' | '2hours' | '4hours' | '1day' | '2days' | '1week';

/**
 * Reminder status
 */
type ReminderStatus = 'scheduled' | 'sent' | 'delivered' | 'failed' | 'cancelled';

/**
 * Reminder template data
 */
interface ReminderTemplate {
  id: string;
  name: string;
  type: ReminderType;
  subject?: string;
  message: string;
  timing: ReminderTiming;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Reminder instance data
 */
interface AppointmentReminder {
  id: string;
  appointmentId: string;
  templateId: string;
  type: ReminderType;
  recipient: string;
  subject?: string;
  message: string;
  scheduledTime: Date;
  sentTime?: Date;
  status: ReminderStatus;
  attempts: number;
  errorMessage?: string;
  createdAt: Date;
}

/**
 * Reminder statistics
 */
interface ReminderStats {
  total: number;
  scheduled: number;
  sent: number;
  delivered: number;
  failed: number;
  deliveryRate: number;
  openRate?: number;
  clickRate?: number;
}

/**
 * Props for the AppointmentReminders component
 */
interface AppointmentRemindersProps {
  /** Appointments to manage reminders for */
  appointments?: Appointment[];
  /** Existing reminder templates */
  templates?: ReminderTemplate[];
  /** Active reminders */
  reminders?: AppointmentReminder[];
  /** Reminder statistics */
  stats?: ReminderStats;
  /** Default reminder settings */
  defaultSettings?: {
    enableAutoReminders: boolean;
    defaultTiming: ReminderTiming[];
    defaultTypes: ReminderType[];
  };
  /** Whether user can manage templates */
  canManageTemplates?: boolean;
  /** Whether user can send manual reminders */
  canSendManual?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Template create/update handler */
  onTemplateChange?: (template: Partial<ReminderTemplate>) => void;
  /** Template delete handler */
  onTemplateDelete?: (templateId: string) => void;
  /** Manual reminder send handler */
  onSendReminder?: (appointmentId: string, templateId: string, timing?: ReminderTiming) => void;
  /** Reminder cancel handler */
  onCancelReminder?: (reminderId: string) => void;
  /** Reminder retry handler */
  onRetryReminder?: (reminderId: string) => void;
  /** Settings update handler */
  onSettingsUpdate?: (settings: { enableAutoReminders: boolean; defaultTiming: ReminderTiming[]; defaultTypes: ReminderType[] }) => void;
}

/**
 * AppointmentReminders Component
 * 
 * A comprehensive reminder management system for appointments with support for
 * email, SMS, phone, and push notifications. Includes template management,
 * automated scheduling, manual sending, and delivery tracking.
 * 
 * @param props - AppointmentReminders component props
 * @returns JSX element representing the appointment reminders interface
 */
const AppointmentReminders = ({
  appointments = [],
  templates = [],
  reminders = [],
  stats,
  defaultSettings = {
    enableAutoReminders: true,
    defaultTiming: ['1day', '1hour'],
    defaultTypes: ['email', 'sms']
  },
  canManageTemplates = true,
  canSendManual = true,
  className = '',
  onTemplateChange,
  onTemplateDelete,
  onSendReminder,
  onCancelReminder,
  onRetryReminder,
  onSettingsUpdate
}: AppointmentRemindersProps) => {
  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'reminders' | 'settings'>('overview');
  const [selectedTemplate, setSelectedTemplate] = useState<ReminderTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<ReminderType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ReminderStatus | 'all'>('all');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [previewMessage, setPreviewMessage] = useState<string>('');

  /**
   * Gets reminder type icon and color
   */
  const getReminderTypeInfo = (type: ReminderType) => {
    const typeInfo = {
      email: { icon: Mail, color: 'text-blue-600', bg: 'bg-blue-100' },
      sms: { icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-100' },
      phone: { icon: Phone, color: 'text-purple-600', bg: 'bg-purple-100' },
      push: { icon: Bell, color: 'text-orange-600', bg: 'bg-orange-100' }
    };
    return typeInfo[type];
  };

  /**
   * Gets reminder status color
   */
  const getStatusColor = (status: ReminderStatus): string => {
    const colors = {
      scheduled: 'text-blue-600 bg-blue-100',
      sent: 'text-yellow-600 bg-yellow-100',
      delivered: 'text-green-600 bg-green-100',
      failed: 'text-red-600 bg-red-100',
      cancelled: 'text-gray-600 bg-gray-100'
    };
    return colors[status];
  };

  /**
   * Gets timing display text
   */
  const getTimingText = (timing: ReminderTiming): string => {
    const timingMap = {
      '15min': '15 minutes before',
      '30min': '30 minutes before',
      '1hour': '1 hour before',
      '2hours': '2 hours before',
      '4hours': '4 hours before',
      '1day': '1 day before',
      '2days': '2 days before',
      '1week': '1 week before'
    };
    return timingMap[timing];
  };

  /**
   * Filters reminders based on search and filters
   */
  const filteredReminders = useMemo(() => {
    return reminders.filter(reminder => {
      const matchesSearch = searchQuery === '' || 
        reminder.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reminder.recipient.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === 'all' || reminder.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || reminder.status === selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [reminders, searchQuery, selectedType, selectedStatus]);

  /**
   * Handles template creation/update
   */
  const handleTemplateSubmit = useCallback((templateData: Partial<ReminderTemplate>) => {
    onTemplateChange?.(templateData);
    setSelectedTemplate(null);
    setIsCreatingTemplate(false);
  }, [onTemplateChange]);

  /**
   * Handles message preview
   */
  const handlePreviewMessage = useCallback((template: ReminderTemplate, appointment?: Appointment) => {
    // Simple template variable replacement
    let message = template.message;
    if (appointment) {
      message = message
        .replace(/\{patientName\}/g, appointment.patient?.name ?? 'Patient')
        .replace(/\{appointmentDate\}/g, new Date(appointment.dateTime).toLocaleDateString())
        .replace(/\{appointmentTime\}/g, new Date(appointment.dateTime).toLocaleTimeString())
        .replace(/\{providerName\}/g, appointment.provider?.name ?? 'Provider')
        .replace(/\{location\}/g, appointment.location?.isVirtual ? 'Virtual' : (appointment.location?.room ?? 'TBD'));
    }
    
    setPreviewMessage(message);
    setShowPreview(true);
  }, []);

  /**
   * Renders overview tab
   */
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reminders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                <p className="text-3xl font-bold text-green-600">{stats.deliveryRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-3xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reminder Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredReminders.slice(0, 5).map((reminder) => {
              const typeInfo = getReminderTypeInfo(reminder.type);
              const IconComponent = typeInfo.icon;
              
              return (
                <div key={reminder.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${typeInfo.bg}`}>
                      <IconComponent className={`w-4 h-4 ${typeInfo.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{reminder.recipient}</p>
                      <p className="text-sm text-gray-600">{reminder.message.substring(0, 60)}...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reminder.status)}`}>
                      {reminder.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {reminder.sentTime?.toLocaleString() || reminder.scheduledTime.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {canSendManual && (
              <button
                onClick={() => setActiveTab('reminders')}
                className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 
                         rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="text-center">
                  <Send className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Send Manual Reminder</p>
                  <p className="text-sm text-gray-600">Send immediate reminders</p>
                </div>
              </button>
            )}
            
            {canManageTemplates && (
              <button
                onClick={() => setActiveTab('templates')}
                className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 
                         rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div className="text-center">
                  <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Create Template</p>
                  <p className="text-sm text-gray-600">Add new reminder template</p>
                </div>
              </button>
            )}
            
            <button
              onClick={() => setActiveTab('settings')}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 
                       rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <div className="text-center">
                <Settings className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Configure Settings</p>
                <p className="text-sm text-gray-600">Manage reminder preferences</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Renders templates tab
   */
  const renderTemplatesTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Reminder Templates</h3>
        {canManageTemplates && (
          <button
            onClick={() => setIsCreatingTemplate(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 
                     border border-transparent rounded-md hover:bg-blue-700 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </button>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => {
          const typeInfo = getReminderTypeInfo(template.type);
          const IconComponent = typeInfo.icon;
          
          return (
            <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${typeInfo.bg}`}>
                    <IconComponent className={`w-5 h-5 ${typeInfo.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      {template.isDefault && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                          Default
                        </span>
                      )}
                      {!template.isActive && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {getTimingText(template.timing)} • {template.type.toUpperCase()}
                    </p>
                    {template.subject && (
                      <p className="text-sm font-medium text-gray-800 mt-2">{template.subject}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {template.message}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePreviewMessage(template)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Preview"
                  >
                    <Eye size={16} />
                  </button>
                  {canManageTemplates && (
                    <>
                      <button
                        onClick={() => setSelectedTemplate(template)}
                        className="p-1 text-gray-400 hover:text-green-600"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onTemplateDelete?.(template.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  /**
   * Renders reminders tab
   */
  const renderRemindersTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reminders..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select
            value={selectedType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value as ReminderType | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="phone">Phone</option>
            <option value="push">Push</option>
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value as ReminderStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="sent">Sent</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Reminders List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          <div className="space-y-4">
            {filteredReminders.map((reminder) => {
              const typeInfo = getReminderTypeInfo(reminder.type);
              const IconComponent = typeInfo.icon;
              
              return (
                <div key={reminder.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${typeInfo.bg}`}>
                      <IconComponent className={`w-4 h-4 ${typeInfo.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{reminder.recipient}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reminder.status)}`}>
                          {reminder.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{reminder.message.substring(0, 100)}...</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Scheduled: {reminder.scheduledTime.toLocaleString()}
                        {reminder.sentTime && ` • Sent: ${reminder.sentTime.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {reminder.status === 'failed' && canSendManual && (
                      <button
                        onClick={() => onRetryReminder?.(reminder.id)}
                        className="p-2 text-gray-400 hover:text-blue-600"
                        title="Retry"
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}
                    {reminder.status === 'scheduled' && (
                      <button
                        onClick={() => onCancelReminder?.(reminder.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handlePreviewMessage({ message: reminder.message } as ReminderTemplate)}
                      className="p-2 text-gray-400 hover:text-green-600"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Renders the active tab content
   */
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'templates':
        return renderTemplatesTab();
      case 'reminders':
        return renderRemindersTab();
      case 'settings':
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Panel</h3>
            <p className="text-gray-600">Settings configuration interface would be implemented here.</p>
          </div>
        );
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointment Reminders</h1>
          <p className="text-gray-600 mt-1">Manage automated and manual appointment reminders</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Overview', icon: Bell },
            { key: 'templates', label: 'Templates', icon: FileText },
            { key: 'reminders', label: 'Reminders', icon: Mail },
            { key: 'settings', label: 'Settings', icon: Settings }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`
                inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {renderActiveTab()}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Message Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 whitespace-pre-wrap">{previewMessage}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentReminders;
