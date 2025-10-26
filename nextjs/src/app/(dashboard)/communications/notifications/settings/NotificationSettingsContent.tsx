/**
 * Notification Settings Content Component
 *
 * Client component for notification preferences
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  getNotificationPreferences,
  updateNotificationPreferences
} from '@/lib/actions/communications.actions';
import type { NotificationPreferences } from '@/lib/validations/notification.schemas';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export function NotificationSettingsContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setIsLoading(true);

    const result = await getNotificationPreferences();

    if (result.success && result.data) {
      setPreferences(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to load preferences'
      });
    }

    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!preferences) return;

    setIsSaving(true);

    const result = await updateNotificationPreferences(preferences);

    if (result.success) {
      toast({
        title: 'Settings saved',
        description: 'Your notification preferences have been updated'
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to save preferences'
      });
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!preferences) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Notification Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure how you receive notifications
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>
            Control overall notification behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enable Notifications</Label>
            <Switch
              id="enabled"
              checked={preferences.enabled}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, enabled: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Channel Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Channels</CardTitle>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="in-app">In-App Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Show notifications in the application
              </p>
            </div>
            <Switch
              id="in-app"
              checked={preferences.channels.inApp}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  channels: { ...preferences.channels, inApp: checked }
                })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send notifications to your email
              </p>
            </div>
            <Switch
              id="email"
              checked={preferences.channels.email}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  channels: { ...preferences.channels, email: checked }
                })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send notifications via text message
              </p>
            </div>
            <Switch
              id="sms"
              checked={preferences.channels.sms}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  channels: { ...preferences.channels, sms: checked }
                })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send push notifications to your devices
              </p>
            </div>
            <Switch
              id="push"
              checked={preferences.channels.push}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  channels: { ...preferences.channels, push: checked }
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Type Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>
            Customize notifications for different events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Messages */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Messages</Label>
              <Switch
                checked={preferences.typePreferences.message.enabled}
                onCheckedChange={(checked) =>
                  setPreferences({
                    ...preferences,
                    typePreferences: {
                      ...preferences.typePreferences,
                      message: {
                        ...preferences.typePreferences.message,
                        enabled: checked
                      }
                    }
                  })
                }
              />
            </div>
            <div className="pl-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Switch
                  checked={preferences.typePreferences.message.channels.email}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      typePreferences: {
                        ...preferences.typePreferences,
                        message: {
                          ...preferences.typePreferences.message,
                          channels: {
                            ...preferences.typePreferences.message.channels,
                            email: checked
                          }
                        }
                      }
                    })
                  }
                  disabled={!preferences.typePreferences.message.enabled}
                />
                <span>Email</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Broadcasts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Broadcasts</Label>
              <Switch
                checked={preferences.typePreferences.broadcast.enabled}
                onCheckedChange={(checked) =>
                  setPreferences({
                    ...preferences,
                    typePreferences: {
                      ...preferences.typePreferences,
                      broadcast: {
                        ...preferences.typePreferences.broadcast,
                        enabled: checked
                      }
                    }
                  })
                }
              />
            </div>
          </div>

          <Separator />

          {/* Health Alerts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Health Alerts</Label>
              <Switch
                checked={preferences.typePreferences.health_alert.enabled}
                onCheckedChange={(checked) =>
                  setPreferences({
                    ...preferences,
                    typePreferences: {
                      ...preferences.typePreferences,
                      health_alert: {
                        ...preferences.typePreferences.health_alert,
                        enabled: checked
                      }
                    }
                  })
                }
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Critical health alerts are always delivered
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
