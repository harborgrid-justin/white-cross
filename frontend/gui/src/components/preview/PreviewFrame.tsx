/**
 * PreviewFrame Component
 *
 * Preview iframe for isolated component rendering with responsive dimensions
 * based on device selection. Provides an isolated rendering context for
 * previewing components without interference from the builder UI.
 */

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { usePreview } from '../../hooks/usePageBuilder';
import type { PreviewState } from '../../types';

type Device = PreviewState['device'];
type Orientation = PreviewState['orientation'];

interface DeviceDimensions {
  width: number;
  height: number;
}

/**
 * Device dimensions for different screen sizes
 */
const DEVICE_DIMENSIONS: Record<Device, DeviceDimensions> = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
};

interface PreviewFrameProps {
  children?: React.ReactNode;
  className?: string;
  showBezel?: boolean;
}

/**
 * PreviewFrame component for rendering content in an isolated iframe
 */
export const PreviewFrame: React.FC<PreviewFrameProps> = ({
  children,
  className = '',
  showBezel = false,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { device, orientation } = usePreview();

  // Calculate dimensions based on device and orientation
  const getDimensions = (): DeviceDimensions => {
    const baseDimensions = DEVICE_DIMENSIONS[device];

    if (device === 'desktop') {
      return baseDimensions; // Desktop doesn't rotate
    }

    if (orientation === 'landscape') {
      return {
        width: baseDimensions.height,
        height: baseDimensions.width,
      };
    }

    return baseDimensions;
  };

  const dimensions = getDimensions();
  const aspectRatio = dimensions.width / dimensions.height;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIsLoading(false);
    };

    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <div
      className={`flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-900 ${className}`}
    >
      {/* Device Bezel (optional) */}
      {showBezel && (
        <div
          className={`
            relative bg-gray-800 rounded-lg shadow-2xl
            ${device === 'mobile' ? 'p-3' : device === 'tablet' ? 'p-4' : 'p-2'}
          `}
          style={{
            width: `${dimensions.width + (device === 'mobile' ? 24 : device === 'tablet' ? 32 : 16)}px`,
            maxWidth: '100%',
          }}
        >
          {/* Device Camera/Notch (for mobile/tablet) */}
          {device !== 'desktop' && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full z-10" />
          )}

          {/* Iframe Container */}
          <div
            className="relative bg-white dark:bg-gray-950 overflow-hidden"
            style={{
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              maxWidth: '100%',
              aspectRatio: `${aspectRatio}`,
            }}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-950">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Loading preview...</p>
                </div>
              </div>
            )}

            <iframe
              ref={iframeRef}
              title="Preview Frame"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              aria-label="Component preview"
            >
              {children}
            </iframe>
          </div>

          {/* Device Home Button (for mobile) */}
          {device === 'mobile' && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full" />
          )}
        </div>
      )}

      {/* Without Bezel - Simple Responsive Frame */}
      {!showBezel && (
        <div
          className="relative bg-white dark:bg-gray-950 shadow-xl overflow-hidden"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            maxWidth: '100%',
            aspectRatio: `${aspectRatio}`,
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-950">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading preview...</p>
              </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            title="Preview Frame"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            aria-label="Component preview"
          >
            {children}
          </iframe>
        </div>
      )}

      {/* Device Info Label */}
      <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/75 text-white text-xs font-medium rounded-lg backdrop-blur-sm">
        {device.charAt(0).toUpperCase() + device.slice(1)} - {dimensions.width} × {dimensions.height}
      </div>
    </div>
  );
};

export default PreviewFrame;
