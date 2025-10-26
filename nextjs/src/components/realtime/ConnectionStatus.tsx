/**
 * @fileoverview Connection Status Indicator Component
 * @module components/realtime/ConnectionStatus
 *
 * Displays current network connection status and quality.
 * Shows offline banner when disconnected.
 */

'use client';

import React from 'react';
import { useConnectionMonitor } from '@/hooks/useConnectionMonitor';
import { ConnectionState, ConnectionQuality } from '@/services/offline/ConnectionMonitor';
import { Wifi, WifiOff, AlertCircle, Signal } from 'lucide-react';

export interface ConnectionStatusProps {
  showDetails?: boolean;
  className?: string;
}

export function ConnectionStatus({ showDetails = false, className = '' }: ConnectionStatusProps) {
  const { isOnline, isOffline, isSlow, state, quality, info } = useConnectionMonitor();

  // Don't show anything if online and not slow
  if (isOnline && !isSlow && !showDetails) {
    return null;
  }

  const getStatusColor = () => {
    if (isOffline) return 'bg-red-500';
    if (isSlow) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusIcon = () => {
    if (isOffline) return <WifiOff className="w-5 h-5" />;
    if (isSlow) return <AlertCircle className="w-5 h-5" />;
    return <Wifi className="w-5 h-5" />;
  };

  const getStatusText = () => {
    if (isOffline) return 'Offline';
    if (isSlow) return 'Slow Connection';
    return 'Online';
  };

  const getQualityBars = () => {
    switch (quality) {
      case ConnectionQuality.EXCELLENT:
        return 4;
      case ConnectionQuality.GOOD:
        return 3;
      case ConnectionQuality.FAIR:
        return 2;
      case ConnectionQuality.POOR:
        return 1;
      default:
        return 0;
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Status Indicator Dot */}
      <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`} />

      {/* Icon */}
      <div className="text-gray-600">
        {getStatusIcon()}
      </div>

      {/* Status Text */}
      <span className="text-sm font-medium text-gray-700">
        {getStatusText()}
      </span>

      {/* Quality Indicator */}
      {showDetails && isOnline && (
        <div className="flex items-center gap-1 ml-2">
          {[1, 2, 3, 4].map(bar => (
            <div
              key={bar}
              className={`w-1 ${bar <= getQualityBars() ? 'bg-green-500' : 'bg-gray-300'}`}
              style={{ height: `${bar * 3}px` }}
            />
          ))}
        </div>
      )}

      {/* Details */}
      {showDetails && info.rtt && (
        <span className="text-xs text-gray-500 ml-2">
          {info.rtt}ms
        </span>
      )}
    </div>
  );
}

export function OfflineBanner() {
  const { isOffline } = useConnectionMonitor();

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-2">
      <WifiOff className="w-5 h-5" />
      <span className="font-medium">
        You are currently offline. Changes will be saved and synced when connection is restored.
      </span>
    </div>
  );
}

export function SlowConnectionWarning() {
  const { isSlow, isOffline } = useConnectionMonitor();

  if (isOffline || !isSlow) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-2 flex items-center justify-center gap-2">
      <AlertCircle className="w-5 h-5" />
      <span className="font-medium">
        Slow connection detected. Some features may be slower than usual.
      </span>
    </div>
  );
}

export default ConnectionStatus;
