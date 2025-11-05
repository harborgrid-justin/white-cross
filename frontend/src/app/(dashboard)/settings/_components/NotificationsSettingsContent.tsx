/**
 * @fileoverview Notifications Settings Content Component
 * @module app/(dashboard)/settings/_components/NotificationsSettingsContent
 * @category Settings - Components
 *
 * Comprehensive notification preferences management for email, push, in-app,
 * and SMS notifications with granular control.
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  CheckCircle,
  Save,
  Volume2,
  VolumeX
} from 'lucide-react';

interface NotificationPreferences {
  email: {
    emergencyAlerts: boolean;
    healthUpdates: boolean;
    appointmentReminders: boolean;
    medicationAlerts: boolean;
    complianceReports: boolean;
    systemUpdates: boolean;
    weeklyDigest: boolean;
  };
  push: {
    emergencyAlerts: boolean;
    healthUpdates: boolean;
    appointmentReminders: boolean;
    medicationAlerts: boolean;
    messages: boolean;
  };
  inApp: {
    emergencyAlerts: boolean;
    healthUpdates: boolean;
    appointmentReminders: boolean;
    medicationAlerts: boolean;
    messages: boolean;
    mentions: boolean;
  };
  sms: {
    emergencyAlerts: boolean;
    criticalUpdates: boolean;
  };
}

export function NotificationsSettingsContent() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      emergencyAlerts: true,
      healthUpdates: true,
      appointmentReminders: true,
      medicationAlerts: true,
      complianceReports: true,
      systemUpdates: false,
      weeklyDigest: true
    },
    push: {
      emergencyAlerts: true,
      healthUpdates: true,
      appointmentReminders: true,
      medicationAlerts: true,
      messages: true
    },
    inApp: {
      emergencyAlerts: true,
      healthUpdates: true,
      appointmentReminders: true,
      medicationAlerts: true,
      messages: true,
      mentions: true
    },
    sms: {
      emergencyAlerts: true,
      criticalUpdates: true
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const updatePreference = (
    channel: keyof NotificationPreferences,
    key: string,
    value: boolean
  ) => {
    setPreferences(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Choose how you want to receive notifications and alerts
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Preferences saved</span>
            </div>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>

      {/* Sound Settings */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {soundEnabled ? (
              <Volume2 className="h-5 w-5 text-gray-600" />
            ) : (
              <VolumeX className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notification Sounds</h3>
              <p className="text-sm text-gray-600">
                Play a sound when receiving notifications
              </p>
            </div>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              soundEnabled ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={soundEnabled}
            aria-label="Toggle notification sounds"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Email Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
          <Badge variant="secondary" className="text-xs ml-2">
            {Object.values(preferences.email).filter(Boolean).length} enabled
          </Badge>
        </div>
        <div className="space-y-4">
          <NotificationToggle
            label="Emergency Alerts"
            description="Critical health emergencies requiring immediate attention"
            enabled={preferences.email.emergencyAlerts}
            onChange={(value) => updatePreference('email', 'emergencyAlerts', value)}
            required
          />
          <NotificationToggle
            label="Health Updates"
            description="Updates on student health records and medical changes"
            enabled={preferences.email.healthUpdates}
            onChange={(value) => updatePreference('email', 'healthUpdates', value)}
          />
          <NotificationToggle
            label="Appointment Reminders"
            description="Upcoming health appointments and check-ups"
            enabled={preferences.email.appointmentReminders}
            onChange={(value) => updatePreference('email', 'appointmentReminders', value)}
          />
          <NotificationToggle
            label="Medication Alerts"
            description="Medication administration reminders and alerts"
            enabled={preferences.email.medicationAlerts}
            onChange={(value) => updatePreference('email', 'medicationAlerts', value)}
          />
          <NotificationToggle
            label="Compliance Reports"
            description="Weekly and monthly compliance summary reports"
            enabled={preferences.email.complianceReports}
            onChange={(value) => updatePreference('email', 'complianceReports', value)}
          />
          <NotificationToggle
            label="System Updates"
            description="Platform updates, new features, and maintenance notices"
            enabled={preferences.email.systemUpdates}
            onChange={(value) => updatePreference('email', 'systemUpdates', value)}
          />
          <NotificationToggle
            label="Weekly Digest"
            description="Summary of your weekly activity and insights"
            enabled={preferences.email.weeklyDigest}
            onChange={(value) => updatePreference('email', 'weeklyDigest', value)}
          />
        </div>
      </Card>

      {/* Push Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Push Notifications</h3>
          <Badge variant="secondary" className="text-xs ml-2">
            {Object.values(preferences.push).filter(Boolean).length} enabled
          </Badge>
        </div>
        <div className="space-y-4">
          <NotificationToggle
            label="Emergency Alerts"
            description="Instant notifications for critical health emergencies"
            enabled={preferences.push.emergencyAlerts}
            onChange={(value) => updatePreference('push', 'emergencyAlerts', value)}
            required
          />
          <NotificationToggle
            label="Health Updates"
            description="Real-time updates on student health changes"
            enabled={preferences.push.healthUpdates}
            onChange={(value) => updatePreference('push', 'healthUpdates', value)}
          />
          <NotificationToggle
            label="Appointment Reminders"
            description="Push reminders 1 hour before appointments"
            enabled={preferences.push.appointmentReminders}
            onChange={(value) => updatePreference('push', 'appointmentReminders', value)}
          />
          <NotificationToggle
            label="Medication Alerts"
            description="Reminders when medications are due"
            enabled={preferences.push.medicationAlerts}
            onChange={(value) => updatePreference('push', 'medicationAlerts', value)}
          />
          <NotificationToggle
            label="Messages"
            description="New messages from staff and parents"
            enabled={preferences.push.messages}
            onChange={(value) => updatePreference('push', 'messages', value)}
          />
        </div>
      </Card>

      {/* In-App Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Smartphone className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">In-App Notifications</h3>
          <Badge variant="secondary" className="text-xs ml-2">
            {Object.values(preferences.inApp).filter(Boolean).length} enabled
          </Badge>
        </div>
        <div className="space-y-4">
          <NotificationToggle
            label="Emergency Alerts"
            description="Display urgent alerts within the application"
            enabled={preferences.inApp.emergencyAlerts}
            onChange={(value) => updatePreference('inApp', 'emergencyAlerts', value)}
            required
          />
          <NotificationToggle
            label="Health Updates"
            description="Show notifications for health record updates"
            enabled={preferences.inApp.healthUpdates}
            onChange={(value) => updatePreference('inApp', 'healthUpdates', value)}
          />
          <NotificationToggle
            label="Appointment Reminders"
            description="In-app reminders for upcoming appointments"
            enabled={preferences.inApp.appointmentReminders}
            onChange={(value) => updatePreference('inApp', 'appointmentReminders', value)}
          />
          <NotificationToggle
            label="Medication Alerts"
            description="Show alerts for medication administration"
            enabled={preferences.inApp.medicationAlerts}
            onChange={(value) => updatePreference('inApp', 'medicationAlerts', value)}
          />
          <NotificationToggle
            label="Messages"
            description="Display new message notifications"
            enabled={preferences.inApp.messages}
            onChange={(value) => updatePreference('inApp', 'messages', value)}
          />
          <NotificationToggle
            label="Mentions"
            description="Notifications when someone mentions you"
            enabled={preferences.inApp.mentions}
            onChange={(value) => updatePreference('inApp', 'mentions', value)}
          />
        </div>
      </Card>

      {/* SMS Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">SMS Notifications</h3>
          <Badge variant="warning" className="text-xs ml-2">
            Limited availability
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          SMS notifications are reserved for critical alerts only. Standard messaging rates apply.
        </p>
        <div className="space-y-4">
          <NotificationToggle
            label="Emergency Alerts"
            description="Critical health emergencies via text message"
            enabled={preferences.sms.emergencyAlerts}
            onChange={(value) => updatePreference('sms', 'emergencyAlerts', value)}
            required
          />
          <NotificationToggle
            label="Critical Updates"
            description="Important system alerts and security notifications"
            enabled={preferences.sms.criticalUpdates}
            onChange={(value) => updatePreference('sms', 'criticalUpdates', value)}
          />
        </div>
      </Card>

      {/* Quiet Hours */}
      <Card className="p-6 bg-gray-50 border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quiet Hours</h3>
        <p className="text-sm text-gray-600 mb-4">
          Configure quiet hours to pause non-critical notifications during specific times.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quietStart" className="text-xs">Start Time</Label>
            <select
              id="quietStart"
              aria-label="Quiet hours start time"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="22:00">10:00 PM</option>
              <option value="23:00">11:00 PM</option>
              <option value="00:00">12:00 AM</option>
            </select>
          </div>
          <div>
            <Label htmlFor="quietEnd" className="text-xs">End Time</Label>
            <select
              id="quietEnd"
              aria-label="Quiet hours end time"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="06:00">6:00 AM</option>
              <option value="07:00">7:00 AM</option>
              <option value="08:00">8:00 AM</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Note: Emergency alerts will always be delivered regardless of quiet hours settings.
        </p>
      </Card>
    </div>
  );
}

interface NotificationToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
  required?: boolean;
}

function NotificationToggle({ label, description, enabled, onChange, required }: NotificationToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-gray-900">{label}</h4>
          {required && (
            <Badge variant="error" className="text-xs">
              Required
            </Badge>
          )}
        </div>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      </div>
      <button
        onClick={() => !required && onChange(!enabled)}
        disabled={required}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        } ${required ? 'opacity-50 cursor-not-allowed' : ''}`}
        role="switch"
        aria-checked={enabled}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
