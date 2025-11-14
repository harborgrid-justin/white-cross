'use client';

import React, { useState, useCallback } from 'react';
import { Bell, FileText, Mail, Settings } from 'lucide-react';
import type {
  AppointmentRemindersProps,
  ReminderTabType,
  ReminderTemplate,
  AppointmentReminder
} from './types';
import { useReminderFiltering, useMessagePreview } from './hooks';
import ReminderOverviewTab from './ReminderOverviewTab';
import ReminderTemplatesTab from './ReminderTemplatesTab';
import ReminderListTab from './ReminderListTab';
import MessagePreviewModal from './MessagePreviewModal';

/**
 * AppointmentReminders Component
 *
 * A comprehensive reminder management system for appointments with support for
 * email, SMS, phone, and push notifications. Includes template management,
 * automated scheduling, manual sending, and delivery tracking.
 *
 * @param {AppointmentRemindersProps} props - AppointmentReminders component props
 * @returns {JSX.Element} The appointment reminders interface
 *
 * @example
 * <AppointmentReminders
 *   appointments={appointments}
 *   templates={templates}
 *   reminders={reminders}
 *   stats={stats}
 *   canManageTemplates={true}
 *   canSendManual={true}
 *   onTemplateChange={handleTemplateChange}
 *   onSendReminder={handleSendReminder}
 * />
 */
const AppointmentReminders: React.FC<AppointmentRemindersProps> = ({
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
}) => {
  // Tab navigation state
  const [activeTab, setActiveTab] = useState<ReminderTabType>('overview');

  // Template management state
  const [selectedTemplate, setSelectedTemplate] = useState<ReminderTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);

  // Reminder filtering
  const {
    filteredReminders,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus
  } = useReminderFiltering(reminders);

  // Message preview
  const {
    showPreview,
    previewMessage,
    handlePreviewMessage,
    closePreview
  } = useMessagePreview();

  /**
   * Handles template creation/update submission
   */
  const handleTemplateSubmit = useCallback((templateData: Partial<ReminderTemplate>) => {
    onTemplateChange?.(templateData);
    setSelectedTemplate(null);
    setIsCreatingTemplate(false);
  }, [onTemplateChange]);

  /**
   * Handles template preview action
   */
  const handleTemplatePreview = useCallback((template: ReminderTemplate) => {
    // Use first appointment for preview if available, otherwise show template as-is
    handlePreviewMessage(template, appointments[0]);
  }, [handlePreviewMessage, appointments]);

  /**
   * Handles reminder message view action
   */
  const handleReminderView = useCallback((reminder: AppointmentReminder) => {
    handlePreviewMessage({ message: reminder.message });
  }, [handlePreviewMessage]);

  /**
   * Renders the active tab content
   */
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'templates':
        return (
          <ReminderTemplatesTab
            templates={templates}
            canManageTemplates={canManageTemplates}
            onPreview={handleTemplatePreview}
            onCreate={() => setIsCreatingTemplate(true)}
            onEdit={setSelectedTemplate}
            onDelete={(templateId: string) => onTemplateDelete?.(templateId)}
          />
        );

      case 'reminders':
        return (
          <ReminderListTab
            reminders={filteredReminders}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            canSendManual={canSendManual}
            onView={handleReminderView}
            onRetry={onRetryReminder}
            onCancel={onCancelReminder}
          />
        );

      case 'settings':
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Panel</h3>
            <p className="text-gray-600">Settings configuration interface would be implemented here.</p>
          </div>
        );

      default:
        return (
          <ReminderOverviewTab
            stats={stats}
            recentReminders={filteredReminders.slice(0, 5)}
            canSendManual={canSendManual}
            canManageTemplates={canManageTemplates}
            onTabChange={setActiveTab}
          />
        );
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
            { key: 'overview' as const, label: 'Overview', icon: Bell },
            { key: 'templates' as const, label: 'Templates', icon: FileText },
            { key: 'reminders' as const, label: 'Reminders', icon: Mail },
            { key: 'settings' as const, label: 'Settings', icon: Settings }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`
                inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={activeTab === key ? 'page' : undefined}
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
      <MessagePreviewModal
        isOpen={showPreview}
        message={previewMessage}
        onClose={closePreview}
      />
    </div>
  );
};

export default AppointmentReminders;
