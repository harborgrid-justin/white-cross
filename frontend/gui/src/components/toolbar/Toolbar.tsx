/**
 * Toolbar Component
 *
 * Main toolbar for the page builder application. Includes logo, project name,
 * undo/redo controls, save functionality, device switcher, zoom controls,
 * preview mode, and export options.
 */

'use client';

import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  Save,
  Eye,
  Download,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useHistory, usePreview } from '../../hooks/usePageBuilder';
import { DeviceSwitcher } from './DeviceSwitcher';
import { ZoomControls } from './ZoomControls';

interface ToolbarProps {
  projectName?: string;
  onSave?: () => void;
  onExport?: (format: 'json' | 'code' | 'zip') => void;
}

/**
 * Main toolbar component for the page builder
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  projectName = 'Untitled Project',
  onSave,
  onExport,
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Store state and actions
  const { undo, redo, canUndo, canRedo } = useHistory();
  const { isPreviewMode, togglePreview } = usePreview();

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    // Could add auto-save notification here
  };

  const handleExport = (format: 'json' | 'code' | 'zip') => {
    if (onExport) {
      onExport(format);
    }
    setIsExportOpen(false);
  };

  return (
    <header
      className="flex items-center justify-between h-14 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm"
      role="banner"
    >
      {/* Left Section: Logo and Project Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {projectName}
          </h1>
        </div>
      </div>

      {/* Center Section: Main Controls */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 pr-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            aria-label="Undo"
            className={`
              flex items-center justify-center w-9 h-9 rounded transition-colors
              ${
                canUndo
                  ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  : 'text-gray-300 cursor-not-allowed dark:text-gray-600'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:focus:ring-0
            `}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={redo}
            disabled={!canRedo}
            aria-label="Redo"
            className={`
              flex items-center justify-center w-9 h-9 rounded transition-colors
              ${
                canRedo
                  ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  : 'text-gray-300 cursor-not-allowed dark:text-gray-600'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:focus:ring-0
            `}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          aria-label="Save project"
          className={`
            flex items-center gap-2 px-4 h-9 rounded-lg transition-colors
            bg-blue-600 text-white hover:bg-blue-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            text-sm font-medium
          `}
          title="Save (Ctrl+S)"
        >
          <Save className="w-4 h-4" />
          Save
        </button>

        {/* Device Switcher */}
        <DeviceSwitcher />

        {/* Zoom Controls */}
        <ZoomControls />
      </div>

      {/* Right Section: Preview and Export */}
      <div className="flex items-center gap-2">
        {/* Preview Button */}
        <button
          onClick={togglePreview}
          aria-label={isPreviewMode ? 'Exit preview mode' : 'Enter preview mode'}
          aria-pressed={isPreviewMode}
          className={`
            flex items-center gap-2 px-4 h-9 rounded-lg transition-colors text-sm font-medium
            ${
              isPreviewMode
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          `}
          title="Preview mode (Ctrl+P)"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsExportOpen(!isExportOpen)}
            aria-label="Export options"
            aria-expanded={isExportOpen}
            aria-haspopup="menu"
            className={`
              flex items-center gap-2 px-4 h-9 rounded-lg transition-colors text-sm font-medium
              text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
            title="Export project"
          >
            <Download className="w-4 h-4" />
            Export
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Export Dropdown Menu */}
          {isExportOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsExportOpen(false)}
                aria-hidden="true"
              />

              {/* Dropdown Menu */}
              <div
                role="menu"
                className="absolute top-full mt-2 right-0 w-48 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20"
              >
                <button
                  role="menuitem"
                  onClick={() => handleExport('json')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Export as JSON
                </button>
                <button
                  role="menuitem"
                  onClick={() => handleExport('code')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Export as Code
                </button>
                <button
                  role="menuitem"
                  onClick={() => handleExport('zip')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Download as ZIP
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
