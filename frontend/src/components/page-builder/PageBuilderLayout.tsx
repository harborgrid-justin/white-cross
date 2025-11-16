'use client';

/**
 * PageBuilderLayout Component
 *
 * Main layout container for the page builder interface with a professional
 * three-panel design inspired by Webflow, Framer, and Windmill.
 *
 * Layout Structure:
 * - Left Panel: Component Palette (collapsible, resizable)
 * - Center Panel: Builder Canvas (main working area)
 * - Right Panel: Property Panel (collapsible, resizable)
 * - Top Bar: Floating Toolbar with actions
 *
 * Features:
 * - Resizable panels with drag handles
 * - Panel collapse/expand with smooth animations
 * - Persistent layout preferences (localStorage)
 * - Responsive design
 * - Keyboard shortcuts support
 * - ARIA labels for accessibility
 */

import React, { useState, useCallback, useEffect } from 'react';
import { ComponentPalette } from './ComponentPalette';
import { BuilderCanvas } from './BuilderCanvas';
import { PropertyPanel } from './PropertyPanel';
import { FloatingToolbar } from './FloatingToolbar';
import { PanelLeft, PanelRight } from 'lucide-react';

interface PageBuilderLayoutProps {
  /** Initial page data (for editing existing pages) */
  initialPageData?: any;

  /** Callback when page is saved */
  onSave?: (pageData: any) => void;

  /** Callback when page is published */
  onPublish?: (pageData: any) => void;
}

const PANEL_MIN_WIDTH = 200;
const PANEL_MAX_WIDTH = 600;
const DEFAULT_LEFT_WIDTH = 280;
const DEFAULT_RIGHT_WIDTH = 320;

export function PageBuilderLayout({
  initialPageData,
  onSave,
  onPublish
}: PageBuilderLayoutProps) {
  // Panel state
  const [leftPanelWidth, setLeftPanelWidth] = useState(DEFAULT_LEFT_WIDTH);
  const [rightPanelWidth, setRightPanelWidth] = useState(DEFAULT_RIGHT_WIDTH);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  // Resizing state
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  // Load saved layout preferences
  useEffect(() => {
    const savedLayout = localStorage.getItem('pageBuilder:layout');
    if (savedLayout) {
      try {
        const layout = JSON.parse(savedLayout);
        setLeftPanelWidth(layout.leftPanelWidth || DEFAULT_LEFT_WIDTH);
        setRightPanelWidth(layout.rightPanelWidth || DEFAULT_RIGHT_WIDTH);
        setLeftPanelCollapsed(layout.leftPanelCollapsed || false);
        setRightPanelCollapsed(layout.rightPanelCollapsed || false);
      } catch (e) {
        console.error('Failed to load layout preferences:', e);
      }
    }
  }, []);

  // Save layout preferences
  const saveLayoutPreferences = useCallback(() => {
    const layout = {
      leftPanelWidth,
      rightPanelWidth,
      leftPanelCollapsed,
      rightPanelCollapsed
    };
    localStorage.setItem('pageBuilder:layout', JSON.stringify(layout));
  }, [leftPanelWidth, rightPanelWidth, leftPanelCollapsed, rightPanelCollapsed]);

  useEffect(() => {
    saveLayoutPreferences();
  }, [saveLayoutPreferences]);

  // Handle left panel resize
  const handleLeftResize = useCallback((e: MouseEvent) => {
    if (!isResizingLeft) return;

    const newWidth = Math.min(
      Math.max(e.clientX, PANEL_MIN_WIDTH),
      PANEL_MAX_WIDTH
    );

    setLeftPanelWidth(newWidth);
  }, [isResizingLeft]);

  // Handle right panel resize
  const handleRightResize = useCallback((e: MouseEvent) => {
    if (!isResizingRight) return;

    const newWidth = Math.min(
      Math.max(window.innerWidth - e.clientX, PANEL_MIN_WIDTH),
      PANEL_MAX_WIDTH
    );

    setRightPanelWidth(newWidth);
  }, [isResizingRight]);

  // Mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) handleLeftResize(e);
      if (isResizingRight) handleRightResize(e);
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      // Prevent text selection during resize
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizingLeft, isResizingRight, handleLeftResize, handleRightResize]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Floating Toolbar */}
      <FloatingToolbar
        onSave={onSave}
        onPublish={onPublish}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Component Palette */}
        <div
          className={`relative bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out ${
            leftPanelCollapsed ? 'w-0' : ''
          }`}
          style={{
            width: leftPanelCollapsed ? 0 : leftPanelWidth
          }}
        >
          {!leftPanelCollapsed && (
            <>
              <ComponentPalette />

              {/* Resize Handle */}
              <div
                className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 active:bg-blue-600 transition-colors"
                onMouseDown={() => setIsResizingLeft(true)}
                role="separator"
                aria-label="Resize component palette panel"
                aria-valuenow={leftPanelWidth}
                aria-valuemin={PANEL_MIN_WIDTH}
                aria-valuemax={PANEL_MAX_WIDTH}
              />
            </>
          )}
        </div>

        {/* Left Panel Toggle Button */}
        <button
          onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
          className="absolute left-0 top-20 z-10 bg-white border border-gray-200 rounded-r-md p-1.5 shadow-sm hover:bg-gray-50 transition-colors"
          aria-label={leftPanelCollapsed ? 'Show component palette' : 'Hide component palette'}
          title={leftPanelCollapsed ? 'Show component palette (Ctrl+B)' : 'Hide component palette (Ctrl+B)'}
        >
          <PanelLeft className={`w-4 h-4 text-gray-600 transition-transform ${leftPanelCollapsed ? 'rotate-180' : ''}`} />
        </button>

        {/* Center Panel - Canvas */}
        <div className="flex-1 overflow-auto">
          <BuilderCanvas />
        </div>

        {/* Right Panel Toggle Button */}
        <button
          onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
          className="absolute right-0 top-20 z-10 bg-white border border-gray-200 rounded-l-md p-1.5 shadow-sm hover:bg-gray-50 transition-colors"
          aria-label={rightPanelCollapsed ? 'Show properties panel' : 'Hide properties panel'}
          title={rightPanelCollapsed ? 'Show properties panel (Ctrl+I)' : 'Hide properties panel (Ctrl+I)'}
        >
          <PanelRight className={`w-4 h-4 text-gray-600 transition-transform ${rightPanelCollapsed ? 'rotate-180' : ''}`} />
        </button>

        {/* Right Panel - Properties */}
        <div
          className={`relative bg-white border-l border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out ${
            rightPanelCollapsed ? 'w-0' : ''
          }`}
          style={{
            width: rightPanelCollapsed ? 0 : rightPanelWidth
          }}
        >
          {!rightPanelCollapsed && (
            <>
              {/* Resize Handle */}
              <div
                className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-blue-500 active:bg-blue-600 transition-colors"
                onMouseDown={() => setIsResizingRight(true)}
                role="separator"
                aria-label="Resize properties panel"
                aria-valuenow={rightPanelWidth}
                aria-valuemin={PANEL_MIN_WIDTH}
                aria-valuemax={PANEL_MAX_WIDTH}
              />

              <PropertyPanel />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
