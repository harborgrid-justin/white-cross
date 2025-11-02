'use client';

/**
 * Notification Settings Component
 *
 * Comprehensive preference management for notifications
 */

'use client';

import React, { useState } from 'react';
import {
  Bell,
  BellOff,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  Volume2,
  VolumeX,
  Save,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { NotificationPreferences, NotificationType } from '@/lib/validations/notification.schemas';
import { updateNotificationPreferences } from '@/lib/actions/communications.actions';
import { toast } from 'sonner';

interface NotificationSettingsProps {
  initialPreferences: NotificationPreferences;
  onSave?: (preferences: NotificationPreferences) => void;
  className?: string;
}

export function NotificationSettings({
  initialPreferences,
  onSave,
  className
}: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(initialPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updatePreference = <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateTypePreference = (type: NotificationType, field: 'enabled' | 'channels', value: any) => {
    setPreferences(prev => ({
      ...prev,
      typePreferences: {
        ...prev.typePreferences,
        [type]: {
          ...prev.typePreferences[type],
          [field]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateNotificationPreferences(preferences);
      if (result.success) {
        setHasChanges(false);
        toast.success('Notification preferences saved');
        onSave?.(preferences);
      } else {
        toast.error(result.error || 'Failed to save preferences');
      }
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPreferences(initialPreferences);
    setHasChanges(false);
    toast.info('Changes reset');
  };

  const notificationTypes: Array<{
    type: NotificationType;
    label: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      type: 'message',
      label: 'Messages',
      description: 'Direct messages from staff and administrators',
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />
    },
    {
      type: 'broadcast',
      label: 'Broadcasts',
      description: 'School-wide announcements and alerts',
      icon: <Bell className="h-5 w-5 text-purple-500" />
    },
    {
      type: 'appointment',
      label: 'Appointments',
      description: 'Health office appointments and reminders',
      icon: <Clock className="h-5 w-5 text-green-500" />
    },
    {
      type: 'medication',
      label: 'Medications',
      description: 'Medication schedules and administration',
      icon: <Bell className="h-5 w-5 text-orange-500" />
    },
    {
      type: 'incident',
      label: 'Incidents',
      description: 'Incident reports and updates',
      icon: <Bell className="h-5 w-5 text-red-500" />
    },
    {
      type: 'health_alert',
      label: 'Health Alerts',
      description: 'Critical health-related notifications',
      icon: <Bell className="h-5 w-5 text-red-600" />
    },
    {
      type: 'system',
      label: 'System',
      description: 'System updates and maintenance notices',
      icon: <Bell className="h-5 w-5 text-gray-500" />
    },
    {
      type: 'reminder',
      label: 'Reminders',
      description: 'General reminders and follow-ups',
      icon: <Bell className="h-5 w-5 text-yellow-500" />
    }
  ];

  const channels = [
    { id: 'in-app', label: 'In-App', icon: <Bell className="h-4 w-4" /> },
    { id: 'email', label: 'Email', icon: <Mail className="h-4 w-4" /> },
    { id: 'sms', label: 'SMS', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'push', label: 'Push', icon: <Smartphone className="h-4 w-4" /> }
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Notification Settings</h2>
        <p className="text-muted-foreground mt-1">
          Manage how and when you receive notifications
        </p>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Global Settings</CardTitle>
          <CardDescription>Apply to all notification types</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="master-toggle" className="text-base">Enable All Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Turn all notifications on or off
              </p>
            </div>
            <Switch
              id="master-toggle"
              checked={preferences.enabled}
              onCheckedChange={(checked: boolean) => updatePreference('enabled', checked)}
            />
          </div>

          <Separator />

          {/* Digest Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="digest-toggle" className="text-base">
                Digest Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Group notifications into periodic summaries
              </p>
            </div>
            <Switch
              id="digest-toggle"
              checked={preferences.digest?.enabled || false}
              onCheckedChange={(checked: boolean) =>
                updatePreference('digest', {
                  enabled: checked,
                  frequency: preferences.digest?.frequency || 'daily',
                  time: preferences.digest?.time || '09:00'
                })
              }
              disabled={!preferences.enabled}
            />
          </div>

          {/* Digest Frequency */}
          {preferences.digest?.enabled && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="digest-frequency">Digest Frequency</Label>
              <Select
                value={preferences.digest.frequency}
                onValueChange={(value: 'daily' | 'weekly') =>
                  updatePreference('digest', {
                    ...preferences.digest!,
                    frequency: value
                  })
                }
              >
                <SelectTrigger id="digest-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          {/* Quiet Hours */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="quiet-hours-toggle" className="text-base">
                  Quiet Hours
                </Label>
                <p className="text-sm text-muted-foreground">
                  Pause non-urgent notifications during specific hours
                </p>
              </div>
              <Switch
                id="quiet-hours-toggle"
                checked={preferences.quietHours?.enabled || false}
                onCheckedChange={(checked: boolean) =>
                  updatePreference('quietHours', {
                    enabled: checked,
                    startTime: preferences.quietHours?.startTime || '22:00',
                    endTime: preferences.quietHours?.endTime || '07:00',
                    timezone: preferences.quietHours?.timezone
                  })
                }
                disabled={!preferences.enabled}
              />
            </div>

            {preferences.quietHours?.enabled && (
              <div className="ml-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Start Time</Label>
                  <Select
                    value={preferences.quietHours.startTime}
                    onValueChange={(value: string) =>
                      updatePreference('quietHours', {
                        ...preferences.quietHours!,
                        startTime: value
                      })
                    }
                  >
                    <SelectTrigger id="quiet-start">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">End Time</Label>
                  <Select
                    value={preferences.quietHours.endTime}
                    onValueChange={(value: string) =>
                      updatePreference('quietHours', {
                        ...preferences.quietHours!,
                        endTime: value
                      })
                    }
                  >
                    <SelectTrigger id="quiet-end">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Per-Type Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>
            Configure preferences for each notification type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationTypes.map((notifType, index) => (
            <div key={notifType.type}>
              {index > 0 && <Separator className="my-6" />}
              <div className="space-y-4">
                {/* Type Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {notifType.icon}
                    <div>
                      <Label className="text-base">{notifType.label}</Label>
                      <p className="text-sm text-muted-foreground">
                        {notifType.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.typePreferences[notifType.type]?.enabled ?? true}
                    onCheckedChange={(checked: boolean) =>
                      updateTypePreference(notifType.type, 'enabled', checked)
                    }
                    disabled={!preferences.enabled}
                  />
                </div>

                {/* Channels */}
                {(preferences.typePreferences[notifType.type]?.enabled ?? true) && (
                  <div className="ml-8 space-y-2">
                    <Label className="text-sm text-muted-foreground">Delivery Channels</Label>
                    <div className="flex flex-wrap gap-2">
                      {channels.map((channel) => {
                        const channelKey = channel.id === 'in-app' ? 'inApp' : channel.id as 'email' | 'sms' | 'push';
                        const typePrefs = preferences.typePreferences[notifType.type];
                        const isEnabled = typePrefs?.channels?.[channelKey as keyof typeof typePrefs.channels] ?? true;
                        return (
                          <Button
                            key={channel.id}
                            variant={isEnabled ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => {
                              const currentChannels = typePrefs?.channels || { inApp: true, email: true, sms: false, push: false };
                              updateTypePreference(notifType.type, 'channels', {
                                ...currentChannels,
                                [channelKey]: !isEnabled
                              });
                            }}
                            disabled={!preferences.enabled}
                          >
                            {channel.icon}
                            <span className="ml-2">{channel.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 sticky bottom-4 bg-card p-4 border rounded-lg shadow-lg">
        <div className="text-sm text-muted-foreground">
          {hasChanges ? 'You have unsaved changes' : 'All changes saved'}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}


