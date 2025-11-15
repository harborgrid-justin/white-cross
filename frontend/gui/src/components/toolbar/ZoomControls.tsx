/**
 * ZoomControls Component
 *
 * Zoom controls for the canvas viewport including zoom in/out, percentage display,
 * reset zoom, and fit to screen functionality.
 */

'use client';

import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import { useViewport } from '../../hooks/usePageBuilder';

const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.5;
const ZOOM_PRESETS = [0.5, 1, 1.5];

/**
 * ZoomControls component for controlling canvas zoom level
 */
export const ZoomControls: React.FC = () => {
  const { zoom, setZoom, resetViewport } = useViewport();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + ZOOM_STEP, MAX_ZOOM);
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - ZOOM_STEP, MIN_ZOOM);
    setZoom(newZoom);
  };

  const handleZoomPreset = (preset: number) => {
    setZoom(preset);
    setIsDropdownOpen(false);
  };

  const handleFitToScreen = () => {
    // Fit to screen logic - reset to 100% zoom and center
    resetViewport();
    setIsDropdownOpen(false);
  };

  const zoomPercentage = Math.round(zoom * 100);
  const canZoomIn = zoom < MAX_ZOOM;
  const canZoomOut = zoom > MIN_ZOOM;

  return (
    <div className="flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-2">
      {/* Zoom Out Button */}
      <button
        onClick={handleZoomOut}
        disabled={!canZoomOut}
        aria-label="Zoom out"
        className={`
          flex items-center justify-center w-9 h-9 rounded transition-colors
          ${
            canZoomOut
              ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              : 'text-gray-300 cursor-not-allowed dark:text-gray-600'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:focus:ring-0
        `}
        title="Zoom out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      {/* Zoom Percentage Display with Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-label="Zoom level"
          aria-expanded={isDropdownOpen}
          aria-haspopup="menu"
          className={`
            flex items-center justify-center min-w-[60px] h-9 px-2 rounded
            text-sm font-medium text-gray-700 dark:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-800
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transition-colors
          `}
          title="Change zoom level"
        >
          {zoomPercentage}%
        </button>

        {/* Zoom Presets Dropdown */}
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
              aria-hidden="true"
            />

            {/* Dropdown Menu */}
            <div
              role="menu"
              className="absolute top-full mt-1 right-0 w-32 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20"
            >
              {ZOOM_PRESETS.map((preset) => (
                <button
                  key={preset}
                  role="menuitem"
                  onClick={() => handleZoomPreset(preset)}
                  className={`
                    w-full px-3 py-2 text-left text-sm transition-colors
                    ${
                      Math.abs(zoom - preset) < 0.01
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {Math.round(preset * 100)}%
                </button>
              ))}

              <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

              <button
                role="menuitem"
                onClick={handleFitToScreen}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Maximize2 className="w-3 h-3" />
                Fit to screen
              </button>
            </div>
          </>
        )}
      </div>

      {/* Zoom In Button */}
      <button
        onClick={handleZoomIn}
        disabled={!canZoomIn}
        aria-label="Zoom in"
        className={`
          flex items-center justify-center w-9 h-9 rounded transition-colors
          ${
            canZoomIn
              ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              : 'text-gray-300 cursor-not-allowed dark:text-gray-600'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:focus:ring-0
        `}
        title="Zoom in"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      {/* Reset Zoom Button */}
      <button
        onClick={resetViewport}
        aria-label="Reset zoom"
        className={`
          flex items-center justify-center w-9 h-9 rounded transition-colors
          text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        title="Reset zoom and pan"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ZoomControls;
