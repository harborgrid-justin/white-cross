/**
 * Push Notification Manager Component
 *
 * Web Push API integration with service worker registration
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PushNotificationManagerProps {
  onPermissionChange?: (permission: NotificationPermission) => void;
  onSubscriptionChange?: (subscription: PushSubscription | null) => void;
  className?: string;
}

type PushState = 'unsupported' | 'default' | 'granted' | 'denied' | 'subscribed';

export function PushNotificationManager({
  onPermissionChange,
  onSubscriptionChange,
  className
}: PushNotificationManagerProps) {
  const [pushState, setPushState] = useState<PushState>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check push notification support and current state
  useEffect(() => {
    checkPushSupport();
  }, []);

  const checkPushSupport = async () => {
    // Check if Push API is supported
    if (!('Notification' in window)) {
      setPushState('unsupported');
      setError('Push notifications are not supported in your browser');
      return;
    }

    // Check if Service Worker is supported
    if (!('serviceWorker' in navigator)) {
      setPushState('unsupported');
      setError('Service Workers are not supported in your browser');
      return;
    }

    // Check current permission
    const permission = Notification.permission;
    onPermissionChange?.(permission);

    if (permission === 'denied') {
      setPushState('denied');
      return;
    }

    if (permission === 'granted') {
      // Check if already subscribed
      await checkSubscription();
    } else {
      setPushState('default');
    }
  };

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();

      if (existingSubscription) {
        setSubscription(existingSubscription);
        setPushState('subscribed');
        onSubscriptionChange?.(existingSubscription);
      } else {
        setPushState('granted');
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
      setError('Failed to check subscription status');
    }
  };

  const requestPermission = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const permission = await Notification.requestPermission();
      onPermissionChange?.(permission);

      if (permission === 'granted') {
        toast.success('Notification permission granted');
        await subscribeToPush();
      } else if (permission === 'denied') {
        setPushState('denied');
        setError('Notification permission denied. Please enable it in your browser settings.');
        toast.error('Notification permission denied');
      } else {
        setPushState('default');
      }
    } catch (err) {
      console.error('Error requesting permission:', err);
      setError('Failed to request notification permission');
      toast.error('Failed to request permission');
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToPush = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Register service worker if not already registered
      let registration = await navigator.serviceWorker.getRegistration();

      if (!registration) {
        registration = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;
      }

      // Get VAPID public key from environment or API
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!vapidPublicKey) {
        throw new Error('VAPID public key not configured');
      }

      // Subscribe to push notifications
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      setSubscription(newSubscription);
      setPushState('subscribed');
      onSubscriptionChange?.(newSubscription);

      // Send subscription to backend
      await sendSubscriptionToBackend(newSubscription);

      toast.success('Successfully subscribed to push notifications');
    } catch (err) {
      console.error('Error subscribing to push:', err);
      setError('Failed to subscribe to push notifications');
      toast.error('Failed to subscribe to notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    if (!subscription) return;

    setIsLoading(true);
    setError(null);

    try {
      // Unsubscribe from push manager
      await subscription.unsubscribe();

      // Remove subscription from backend
      await removeSubscriptionFromBackend(subscription);

      setSubscription(null);
      setPushState('granted');
      onSubscriptionChange?.(null);

      toast.success('Unsubscribed from push notifications');
    } catch (err) {
      console.error('Error unsubscribing:', err);
      setError('Failed to unsubscribe from push notifications');
      toast.error('Failed to unsubscribe');
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNotification = async () => {
    if (pushState !== 'subscribed') {
      toast.error('Not subscribed to push notifications');
      return;
    }

    try {
      // Send test notification request to backend
      const response = await fetch('/api/v1/notifications/test-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription: subscription?.toJSON()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send test notification');
      }

      toast.success('Test notification sent');
    } catch (err) {
      console.error('Error sending test notification:', err);
      toast.error('Failed to send test notification');
    }
  };

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  };

  // Send subscription to backend
  const sendSubscriptionToBackend = async (sub: PushSubscription) => {
    try {
      const response = await fetch('/api/v1/notifications/push-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription: sub.toJSON()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription to backend');
      }
    } catch (err) {
      console.error('Error saving subscription:', err);
      // Don't throw - subscription still works locally
    }
  };

  // Remove subscription from backend
  const removeSubscriptionFromBackend = async (sub: PushSubscription) => {
    try {
      const response = await fetch('/api/v1/notifications/push-unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription: sub.toJSON()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to remove subscription from backend');
      }
    } catch (err) {
      console.error('Error removing subscription:', err);
      // Don't throw - subscription is still removed locally
    }
  };

  const getStatusInfo = () => {
    switch (pushState) {
      case 'unsupported':
        return {
          title: 'Not Supported',
          description: 'Push notifications are not supported in your browser',
          icon: <AlertCircle className="h-5 w-5 text-destructive" />,
          variant: 'destructive' as const
        };
      case 'denied':
        return {
          title: 'Permission Denied',
          description: 'You have blocked notifications. Enable them in your browser settings.',
          icon: <BellOff className="h-5 w-5 text-destructive" />,
          variant: 'destructive' as const
        };
      case 'default':
        return {
          title: 'Enable Notifications',
          description: 'Allow push notifications to stay updated with important alerts',
          icon: <Bell className="h-5 w-5 text-muted-foreground" />,
          variant: 'default' as const
        };
      case 'granted':
        return {
          title: 'Permission Granted',
          description: 'Click subscribe to start receiving push notifications',
          icon: <CheckCircle className="h-5 w-5 text-success" />,
          variant: 'default' as const
        };
      case 'subscribed':
        return {
          title: 'Subscribed',
          description: 'You will receive push notifications for important updates',
          icon: <CheckCircle className="h-5 w-5 text-success" />,
          variant: 'default' as const
        };
    }
  };

  const status = getStatusInfo();

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status.icon}
          Push Notifications
        </CardTitle>
        <CardDescription>
          Get real-time alerts directly in your browser
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Alert */}
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <Alert variant={status.variant}>
            <AlertDescription>
              <div className="font-medium mb-1">{status.title}</div>
              <div className="text-sm">{status.description}</div>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {pushState === 'default' && (
            <Button
              onClick={requestPermission}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Requesting...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Enable Notifications
                </>
              )}
            </Button>
          )}

          {pushState === 'granted' && (
            <Button
              onClick={subscribeToPush}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Subscribe to Notifications
                </>
              )}
            </Button>
          )}

          {pushState === 'subscribed' && (
            <>
              <Button
                variant="outline"
                onClick={sendTestNotification}
                className="w-full"
              >
                <Bell className="h-4 w-4 mr-2" />
                Send Test Notification
              </Button>
              <Button
                variant="destructive"
                onClick={unsubscribeFromPush}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Unsubscribing...
                  </>
                ) : (
                  <>
                    <BellOff className="h-4 w-4 mr-2" />
                    Unsubscribe
                  </>
                )}
              </Button>
            </>
          )}

          {pushState === 'denied' && (
            <Alert variant="destructive">
              <AlertDescription className="text-sm">
                To enable notifications:
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Click the lock icon in your browser's address bar</li>
                  <li>Find the notifications setting</li>
                  <li>Change it to "Allow"</li>
                  <li>Refresh this page</li>
                </ol>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Subscription Details (for debugging) */}
        {pushState === 'subscribed' && subscription && process.env.NODE_ENV === 'development' && (
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer hover:underline">
              Subscription Details
            </summary>
            <pre className="mt-2 p-2 bg-muted rounded overflow-x-auto">
              {JSON.stringify(subscription.toJSON(), null, 2)}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  );
}
