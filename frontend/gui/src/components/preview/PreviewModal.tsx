/**
 * PreviewModal Component
 *
 * Full-screen preview modal using Radix Dialog. Provides an isolated preview
 * environment with device frames, responsive viewport, and device switching.
 */

'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Monitor, Tablet, Smartphone, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePreview } from '../../hooks/usePageBuilder';
import { PreviewFrame } from './PreviewFrame';
import type { PreviewState } from '../../types';

type Device = PreviewState['device'];

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

interface PreviewModalProps {
  children?: React.ReactNode;
  showBezel?: boolean;
}

/**
 * Full-screen preview modal component
 */
export const PreviewModal: React.FC<PreviewModalProps> = ({
  children,
  showBezel = true,
}) => {
  const {
    isPreviewMode,
    device,
    orientation,
    togglePreview,
    setDevice,
    setOrientation,
  } = usePreview();

  const handleClose = () => {
    togglePreview();
  };

  const handleOrientationToggle = () => {
    setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait');
  };

  return (
    <Dialog.Root open={isPreviewMode} onOpenChange={handleClose}>
      <AnimatePresence>
        {isPreviewMode && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>

            {/* Content */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 flex flex-col"
              >
                {/* Header Bar */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
                  {/* Title */}
                  <Dialog.Title className="text-lg font-semibold text-white">
                    Preview Mode
                  </Dialog.Title>

                  {/* Device Controls */}
                  <div className="flex items-center gap-4">
                    {/* Device Selector */}
                    <div className="flex items-center gap-1">
                      {DEVICE_OPTIONS.map(({ value, label, icon: Icon }) => {
                        const isSelected = device === value;

                        return (
                          <button
                            key={value}
                            onClick={() => setDevice(value)}
                            aria-label={`${label} preview`}
                            className={`
                              flex items-center justify-center w-10 h-10 rounded transition-colors
                              ${
                                isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                              }
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
                            `}
                            title={label}
                          >
                            <Icon className="w-5 h-5" />
                          </button>
                        );
                      })}
                    </div>

                    {/* Orientation Toggle (for tablet and mobile) */}
                    {device !== 'desktop' && (
                      <>
                        <div className="w-px h-6 bg-gray-700" />
                        <button
                          onClick={handleOrientationToggle}
                          aria-label={`Switch to ${orientation === 'portrait' ? 'landscape' : 'portrait'} orientation`}
                          className="flex items-center justify-center w-10 h-10 rounded text-gray-400 hover:bg-gray-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                          title={`${orientation === 'portrait' ? 'Landscape' : 'Portrait'} mode`}
                        >
                          <RotateCw className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Close Button */}
                    <div className="w-px h-6 bg-gray-700" />
                    <Dialog.Close asChild>
                      <button
                        aria-label="Close preview"
                        className="flex items-center justify-center w-10 h-10 rounded text-gray-400 hover:bg-gray-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        title="Close preview (ESC)"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </Dialog.Close>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-auto p-8">
                  <PreviewFrame showBezel={showBezel}>
                    {children}
                  </PreviewFrame>
                </div>

                {/* Footer (optional - could add zoom controls here) */}
                <div className="px-6 py-3 bg-gray-900 border-t border-gray-800 text-center text-sm text-gray-400">
                  Press <kbd className="px-2 py-1 bg-gray-800 rounded text-xs font-mono">ESC</kbd> to exit preview mode
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default PreviewModal;
