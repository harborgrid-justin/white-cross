import { useState, useEffect, useCallback, useRef } from 'react';
import { NotificationType, NotificationPriority } from '../types/notification';
import { useNotificationPreferences } from './useNotificationPreferences';

/**
 * Sound configuration for different notification types and priorities
 */
const SOUND_FILES: Record<string, string> = {
  default: '/sounds/notification-default.mp3',
  emergency: '/sounds/notification-emergency.mp3',
  high: '/sounds/notification-high.mp3',
  medium: '/sounds/notification-medium.mp3',
  low: '/sounds/notification-low.mp3',
};

/**
 * useNotificationSound Hook
 *
 * Manages notification sound playback based on preferences
 */
export function useNotificationSound(userId: string) {
  const { preferences } = useNotificationPreferences(userId);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  /**
   * Play sound for a notification
   */
  const playSound = useCallback(
    (type: NotificationType, priority: NotificationPriority) => {
      if (!preferences || !preferences.soundEnabled) {
        return;
      }

      // Check type-specific sound preferences
      const typePrefs = preferences.typePreferences[type];
      if (!typePrefs || !typePrefs.soundEnabled) {
        return;
      }

      // Determine which sound to play
      let soundFile = preferences.defaultSound;

      // Use custom sound if specified
      if (typePrefs.customSound) {
        soundFile = typePrefs.customSound;
      } else {
        // Use priority-based sound
        if (priority === NotificationPriority.EMERGENCY) {
          soundFile = SOUND_FILES.emergency;
        } else if (priority === NotificationPriority.HIGH || priority === NotificationPriority.URGENT) {
          soundFile = SOUND_FILES.high;
        } else if (priority === NotificationPriority.MEDIUM) {
          soundFile = SOUND_FILES.medium;
        } else {
          soundFile = SOUND_FILES.low;
        }
      }

      // Play sound
      if (audioRef.current) {
        audioRef.current.src = soundFile;
        audioRef.current.volume = preferences.soundVolume / 100;

        setIsPlaying(true);

        audioRef.current
          .play()
          .then(() => {
            // Sound played successfully
          })
          .catch((error) => {
            console.error('Failed to play notification sound:', error);
          })
          .finally(() => {
            setIsPlaying(false);
          });
      }
    },
    [preferences]
  );

  /**
   * Stop current sound
   */
  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  /**
   * Test sound playback
   */
  const testSound = useCallback(
    (soundFile?: string) => {
      if (!audioRef.current || !preferences) {
        return;
      }

      const file = soundFile || preferences.defaultSound;
      audioRef.current.src = file;
      audioRef.current.volume = preferences.soundVolume / 100;

      setIsPlaying(true);

      audioRef.current
        .play()
        .then(() => {
          // Sound played successfully
        })
        .catch((error) => {
          console.error('Failed to test notification sound:', error);
        })
        .finally(() => {
          setIsPlaying(false);
        });
    },
    [preferences]
  );

  return {
    playSound,
    stopSound,
    testSound,
    isPlaying,
    soundEnabled: preferences?.soundEnabled ?? false,
    volume: preferences?.soundVolume ?? 70,
  };
}
