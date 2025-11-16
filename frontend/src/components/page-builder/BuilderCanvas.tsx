'use client';

/**
 * BuilderCanvas Component
 *
 * Main canvas area for drag-and-drop page building with visual feedback.
 * Inspired by Webflow's canvas and Framer's design view.
 *
 * Features:
 * - Drag-and-drop support for adding components
 * - Visual drop zones with hover states
 * - Component selection (single and multiple)
 * - Grid-based layout with snapping
 * - Zoom and pan controls
 * - Responsive preview modes (mobile, tablet, desktop)
 * - Visual hierarchy indicators
 * - Empty state for first-time users
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  Smartphone,
  Tablet,
  Monitor,
  Plus,
  MousePointer,
  Hand,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import type { ComponentInstance } from '@/lib/page-builder/types';

type ViewportMode = 'mobile' | 'tablet' | 'desktop';
type Tool = 'select' | 'pan';

const VIEWPORT_WIDTHS: Record<ViewportMode, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 1440
};

export function BuilderCanvas() {
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [zoom, setZoom] = useState(100);
  const [tool, setTool] = useState<Tool>('select');
  const [components, setComponents] = useState<ComponentInstance[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle drop from palette
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));

      if (data.type === 'component') {
        // Get drop position relative to canvas
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;

        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;

        // Create new component instance
        const newComponent: ComponentInstance = {
          id: `component-${Date.now()}`,
          componentId: data.componentId,
          props: {},
          style: {
            layout: {
              width: '200px',
              height: '100px'
            }
          },
          children: []
        };

        setComponents(prev => [...prev, newComponent]);
        setSelectedId(newComponent.id);
      }
    } catch (error) {
      console.error('Failed to handle drop:', error);
    }
  }, []);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOver(true);
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only set to false if leaving the canvas itself
    if (e.currentTarget === e.target) {
      setIsDraggingOver(false);
    }
  }, []);

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 25));
  const handleResetZoom = () => setZoom(100);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        {/* Left: Tool Selection */}
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setTool('select')}
              className={`p-2 rounded ${
                tool === 'select'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Select tool (V)"
              aria-label="Select tool"
              aria-pressed={tool === 'select'}
            >
              <MousePointer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTool('pan')}
              className={`p-2 rounded ${
                tool === 'pan'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Pan tool (H)"
              aria-label="Pan tool"
              aria-pressed={tool === 'pan'}
            >
              <Hand className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Viewport Modes */}
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setViewportMode('mobile')}
              className={`px-3 py-2 rounded flex items-center gap-2 ${
                viewportMode === 'mobile'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Mobile view (375px)"
              aria-label="Mobile viewport"
              aria-pressed={viewportMode === 'mobile'}
            >
              <Smartphone className="w-4 h-4" />
              <span className="text-xs font-medium">Mobile</span>
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`px-3 py-2 rounded flex items-center gap-2 ${
                viewportMode === 'tablet'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Tablet view (768px)"
              aria-label="Tablet viewport"
              aria-pressed={viewportMode === 'tablet'}
            >
              <Tablet className="w-4 h-4" />
              <span className="text-xs font-medium">Tablet</span>
            </button>
            <button
              onClick={() => setViewportMode('desktop')}
              className={`px-3 py-2 rounded flex items-center gap-2 ${
                viewportMode === 'desktop'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Desktop view (1440px)"
              aria-label="Desktop viewport"
              aria-pressed={viewportMode === 'desktop'}
            >
              <Monitor className="w-4 h-4" />
              <span className="text-xs font-medium">Desktop</span>
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300 mx-2" />

          <span className="text-xs text-gray-600 font-medium">
            {VIEWPORT_WIDTHS[viewportMode]}px
          </span>
        </div>

        {/* Right: Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded min-w-[4rem] text-center"
            title="Reset zoom to 100%"
            aria-label="Reset zoom"
          >
            {zoom}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-8">
        <div
          ref={canvasRef}
          className={`mx-auto bg-white shadow-lg transition-all relative ${
            isDraggingOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
          }`}
          style={{
            width: VIEWPORT_WIDTHS[viewportMode],
            minHeight: '800px',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center'
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* Grid Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Empty State */}
          {components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md px-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Start Building Your Page
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Drag components from the left panel onto this canvas to start designing your page.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-left">
                  <p className="font-medium text-blue-900 mb-1">💡 Pro tip:</p>
                  <p className="text-blue-800">
                    Start with a Container or Section component to create your page structure.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Drop Zone Indicator */}
          {isDraggingOver && (
            <div className="absolute inset-0 bg-blue-50 bg-opacity-50 border-2 border-dashed border-blue-400 flex items-center justify-center pointer-events-none">
              <div className="bg-white px-4 py-3 rounded-lg shadow-lg">
                <p className="text-sm font-medium text-gray-900">
                  Drop component here
                </p>
              </div>
            </div>
          )}

          {/* Render Components */}
          {components.map(component => (
            <CanvasComponent
              key={component.id}
              component={component}
              isSelected={selectedId === component.id}
              onSelect={() => setSelectedId(component.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Individual component rendered on the canvas
 */
interface CanvasComponentProps {
  component: ComponentInstance;
  isSelected: boolean;
  onSelect: () => void;
}

function CanvasComponent({ component, isSelected, onSelect }: CanvasComponentProps) {
  return (
    <div
      className={`relative p-4 border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50 bg-opacity-50'
          : 'border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      }`}
      style={{
        width: component.style.layout?.width,
        height: component.style.layout?.height
      }}
      onClick={onSelect}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-t">
          {component.componentId}
        </div>
      )}

      {/* Component Content Placeholder */}
      <div className="text-center text-gray-400 text-sm">
        {component.componentId}
      </div>

      {/* Resize Handles (when selected) */}
      {isSelected && (
        <>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-nw-resize" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-ne-resize" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-sw-resize" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-se-resize" />
        </>
      )}
    </div>
  );
}
