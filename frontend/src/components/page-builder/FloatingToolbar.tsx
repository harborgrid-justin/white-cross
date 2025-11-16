'use client';

/**
 * FloatingToolbar Component
 *
 * Top toolbar with common actions and controls.
 * Inspired by Figma's top toolbar and Webflow's navbar.
 *
 * Features:
 * - Save and publish buttons
 * - Undo/redo controls
 * - Preview mode toggle
 * - Component tree view toggle
 * - Zoom controls
 * - Keyboard shortcut hints
 */

import React, { useState } from 'react';
import {
  Save,
  Upload,
  Undo,
  Redo,
  Eye,
  Code,
  Layers,
  Settings,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

interface FloatingToolbarProps {
  onSave?: (pageData: any) => void;
  onPublish?: (pageData: any) => void;
}

export function FloatingToolbar({ onSave, onPublish }: FloatingToolbarProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTreeView, setShowTreeView] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement save logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave?.({});
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // TODO: Implement publish logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      onPublish?.({});
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Page Name */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Untitled Page"
            className="text-sm font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 w-40"
            defaultValue="Untitled Page"
          />
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
            disabled
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
            disabled
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* View Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowTreeView(!showTreeView)}
            className={`p-2 rounded transition-colors ${
              showTreeView
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Toggle component tree (Ctrl+T)"
            aria-label="Toggle component tree"
            aria-pressed={showTreeView}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded transition-colors ${
              showPreview
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Toggle preview mode (Ctrl+P)"
            aria-label="Toggle preview mode"
            aria-pressed={showPreview}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="View code"
            aria-label="View code"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Section - Page Status */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-600 font-medium">
            All changes saved
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Help */}
        <button
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          title="Help and keyboard shortcuts"
          aria-label="Help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          title="Page settings"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-gray-300" />

        {/* Save & Publish */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Save draft (Ctrl+S)"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>

        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Publish page"
        >
          <Upload className="w-4 h-4" />
          {isPublishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
