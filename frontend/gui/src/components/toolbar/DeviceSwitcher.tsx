/**
 * DeviceSwitcher Component
 *
 * Device preview selector with radio group for device selection and orientation toggle.
 * Allows users to switch between Desktop, Tablet, and Mobile preview modes.
 */

'use client';

import React from 'react';
import { Monitor, Tablet, Smartphone, RotateCw } from 'lucide-react';
import { usePreview } from '../../hooks/usePageBuilder';
import type { PreviewState } from '../../types';

type Device = PreviewState['device'];
type Orientation = PreviewState['orientation'];

interface DeviceOption {
  value: Device;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DEVICE_OPTIONS: DeviceOption[] = [
  { value: 'desktop', label: 'Desktop', icon: Monitor },
  { value: 'tablet', label: 'Tablet', icon: Tablet },
  { value: 'mobile', label: 'Mobile', icon: Smartphone },
];

/**
 * DeviceSwitcher component for selecting preview device and orientation
 */
export const DeviceSwitcher: React.FC = () => {
  const { device, orientation, setDevice, setOrientation } = usePreview();

  const handleDeviceChange = (newDevice: Device) => {
    setDevice(newDevice);
  };

  const handleOrientationToggle = () => {
    setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait');
  };

  return (
    <div className="flex items-center gap-1 border-l border-r border-gray-200 dark:border-gray-700 px-2">
      {/* Device Selection Radio Group */}
      <div
        role="radiogroup"
        aria-label="Select preview device"
        className="flex items-center gap-1"
      >
        {DEVICE_OPTIONS.map(({ value, label, icon: Icon }) => {
          const isSelected = device === value;

          return (
            <button
              key={value}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${label} preview`}
              onClick={() => handleDeviceChange(value)}
              className={`
                flex items-center justify-center w-9 h-9 rounded transition-colors
                ${
                  isSelected
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              `}
              title={label}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>

      {/* Orientation Toggle (only visible for tablet and mobile) */}
      {device !== 'desktop' && (
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
      )}

      {device !== 'desktop' && (
        <button
          onClick={handleOrientationToggle}
          aria-label={`Switch to ${orientation === 'portrait' ? 'landscape' : 'portrait'} orientation`}
          className={`
            flex items-center justify-center w-9 h-9 rounded transition-colors
            text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          `}
          title={`${orientation === 'portrait' ? 'Landscape' : 'Portrait'} mode`}
        >
          <RotateCw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default DeviceSwitcher;
