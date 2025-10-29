'use client';

import React, { useState } from 'react';
import { useNotificationPreferences } from '../hooks';
import { NotificationType, DeliveryChannel } from '../types/notification';

export interface NotificationSettingsProps {
  userId: string;
}

/**
 * NotificationSettings Component
 *
 * Comprehensive notification preference management UI
 */
export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ userId }) => {
  const { preferences, update, isUpdating, sendTest } = useNotificationPreferences(userId);
  const [activeSection, setActiveSection] = useState<'general' | 'channels' | 'quiet'>('general');

  if (!preferences) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Section tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveSection('general')}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            activeSection === 'general'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveSection('channels')}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            activeSection === 'channels'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Channels
        </button>
        <button
          onClick={() => setActiveSection('quiet')}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            activeSection === 'quiet'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Quiet Hours
        </button>
      </div>

      {/* General settings */}
      {activeSection === 'general' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">General Settings</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">Enable notifications</label>
                  <p className="text-sm text-gray-500">Receive all notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.enabled}
                  onChange={(e) => update({ enabled: e.target.checked })}
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">Group similar notifications</label>
                  <p className="text-sm text-gray-500">Combine related notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.groupingEnabled}
                  onChange={(e) => update({ groupingEnabled: e.target.checked })}
                  className="w-5 h-5"
                />
              </div>

              <div>
                <label className="font-medium text-gray-900">Grouping delay (minutes)</label>
                <input
                  type="number"
                  value={preferences.groupingDelayMinutes}
                  onChange={(e) => update({ groupingDelayMinutes: parseInt(e.target.value) })}
                  min="1"
                  max="60"
                  className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">Sound enabled</label>
                  <p className="text-sm text-gray-500">Play sound for notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.soundEnabled}
                  onChange={(e) => update({ soundEnabled: e.target.checked })}
                  className="w-5 h-5"
                />
              </div>

              {preferences.soundEnabled && (
                <div>
                  <label className="font-medium text-gray-900">Sound volume</label>
                  <input
                    type="range"
                    value={preferences.soundVolume}
                    onChange={(e) => update({ soundVolume: parseInt(e.target.value) })}
                    min="0"
                    max="100"
                    className="mt-1 block w-full"
                  />
                  <div className="text-sm text-gray-500 mt-1">{preferences.soundVolume}%</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Channel settings */}
      {activeSection === 'channels' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Delivery Channels</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">Email notifications</label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <button
                  onClick={() => sendTest('email')}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  Test
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">SMS notifications</label>
                  <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                </div>
                <button
                  onClick={() => sendTest('sms')}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  Test
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">Push notifications</label>
                  <p className="text-sm text-gray-500">Receive browser push notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.pushNotifications.enabled}
                  onChange={(e) =>
                    update({
                      pushNotifications: {
                        ...preferences.pushNotifications,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="w-5 h-5"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiet hours */}
      {activeSection === 'quiet' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Quiet Hours</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">Enable quiet hours</label>
                  <p className="text-sm text-gray-500">Silence notifications during specific times</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.quietHours.enabled}
                  onChange={(e) =>
                    update({
                      quietHours: { ...preferences.quietHours, enabled: e.target.checked },
                    })
                  }
                  className="w-5 h-5"
                />
              </div>

              {preferences.quietHours.enabled && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-medium text-gray-900">Start time</label>
                      <input
                        type="time"
                        value={preferences.quietHours.startTime}
                        onChange={(e) =>
                          update({
                            quietHours: { ...preferences.quietHours, startTime: e.target.value },
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-gray-900">End time</label>
                      <input
                        type="time"
                        value={preferences.quietHours.endTime}
                        onChange={(e) =>
                          update({
                            quietHours: { ...preferences.quietHours, endTime: e.target.value },
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-900">Allow emergency alerts</label>
                      <p className="text-sm text-gray-500">Receive emergency alerts even during quiet hours</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.quietHours.allowEmergency}
                      onChange={(e) =>
                        update({
                          quietHours: { ...preferences.quietHours, allowEmergency: e.target.checked },
                        })
                      }
                      className="w-5 h-5"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Save indicator */}
      {isUpdating && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Saving...
        </div>
      )}
    </div>
  );
};
