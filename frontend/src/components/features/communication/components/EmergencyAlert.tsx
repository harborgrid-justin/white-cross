'use client';

/**
 * Emergency Alert Component
 *
 * Critical alert display with audio/visual notifications
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X, Bell, Volume2, VolumeX, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { acknowledgeBroadcastAction } from '@/lib/actions/communications.actions';
import { toast } from 'sonner';
import type { Broadcast } from '@/lib/validations/broadcast.schemas';

interface EmergencyAlertProps {
  alert: Broadcast;
  onDismiss?: () => void;
  onAcknowledge?: () => void;
  autoPlay?: boolean;
  className?: string;
}

export function EmergencyAlert({
  alert,
  onDismiss,
  onAcknowledge,
  autoPlay = true,
  className
}: EmergencyAlertProps) {
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Initialize audio on mount
  useEffect(() => {
    if (autoPlay && !isMuted) {
      // Create audio element for alert sound
      const audio = new Audio('/sounds/emergency-alert.mp3');
      audio.loop = true;
      audio.volume = 0.7;
      audioRef.current = audio;

      // Play alert sound
      audio.play().catch(() => {
        // Autoplay might be blocked by browser
        console.warn('Audio autoplay blocked');
      });
      setAudioPlaying(true);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [autoPlay, isMuted]);

  // Request browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(alert.title, {
        body: alert.message,
        icon: '/icons/emergency.png',
        tag: `emergency-${alert.id}`,
        requireInteraction: true,
        vibrate: [200, 100, 200]
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }, [alert]);

  const handleAcknowledge = async () => {
    try {
      await acknowledgeBroadcastAction({ broadcastId: alert.id });
      setIsAcknowledged(true);

      // Stop audio
      if (audioRef.current) {
        audioRef.current.pause();
        setAudioPlaying(false);
      }

      toast.success('Emergency alert acknowledged');
      onAcknowledge?.();
    } catch (error) {
      toast.error('Failed to acknowledge alert');
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play();
        setAudioPlaying(true);
      } else {
        audioRef.current.pause();
        setAudioPlaying(false);
      }
    }
    setIsMuted(!isMuted);
  };

  const handleDismiss = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioPlaying(false);
    }
    onDismiss?.();
  };

  if (!isExpanded) {
    return (
      <div className={cn('fixed bottom-4 right-4 z-50', className)}>
        <Button
          onClick={() => setIsExpanded(true)}
          className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg animate-pulse"
        >
          <AlertTriangle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm', className)}>
      <Card className="max-w-2xl w-full mx-4 border-4 border-red-600 shadow-2xl animate-in fade-in slide-in-from-top-4">
        {/* Header */}
        <div className="bg-red-600 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="bg-white text-red-600">
                    EMERGENCY ALERT
                  </Badge>
                  {alert.requireAcknowledgment && !isAcknowledged && (
                    <Badge variant="secondary" className="bg-yellow-500 text-white">
                      ACTION REQUIRED
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl font-bold">{alert.title}</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Mute Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted || !audioPlaying ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5 animate-pulse" />
                )}
              </Button>

              {/* Minimize Button */}
              {!alert.requireAcknowledgment && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Message */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: alert.message }}
          />

          {/* Additional Info */}
          <div className="grid gap-3 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Issued by:</span>
              <span className="font-medium">{alert.createdByName || 'System Administrator'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">
                {new Date(alert.createdAt).toLocaleString()}
              </span>
            </div>
            {alert.targetAudience && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Audience:</span>
                <span className="font-medium capitalize">{alert.targetAudience.type}</span>
              </div>
            )}
          </div>

          {/* Action Link */}
          {alert.actionUrl && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(alert.actionUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {alert.actionText || 'More Information'}
            </Button>
          )}

          {/* Acknowledgment Required */}
          {alert.requireAcknowledgment && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-400 rounded-lg">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                    Acknowledgment Required
                  </p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    You must acknowledge this alert to confirm you have read and understood the message.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-muted/50 flex items-center justify-between gap-3">
          {isAcknowledged ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Acknowledged</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                {alert.requireAcknowledgment
                  ? 'Please acknowledge this alert'
                  : 'Emergency notification'}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {!isAcknowledged && alert.requireAcknowledgment && (
              <Button onClick={handleAcknowledge} className="bg-red-600 hover:bg-red-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Acknowledge
              </Button>
            )}
            {(!alert.requireAcknowledgment || isAcknowledged) && (
              <Button variant="outline" onClick={handleDismiss}>
                Close
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Pulsing overlay effect */}
      <div className="absolute inset-0 -z-10 animate-pulse bg-red-600/10" />
    </div>
  );
}



