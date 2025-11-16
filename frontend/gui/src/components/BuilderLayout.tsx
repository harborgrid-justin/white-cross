/**
 * Builder Layout Component
 * Main layout with resizable panels using react-resizable-panels
 */

'use client';

import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Toolbar } from './toolbar/Toolbar';
import { ComponentPalette } from './palette/ComponentPalette';
import { Canvas } from './canvas/Canvas';
import { PropertyEditor } from './properties/PropertyEditor';
import { LayerTree } from './layers/LayerTree';
import { LiveRegion } from './common/LiveRegion';

/**
 * BuilderLayout Component (Optimized)
 * Wrapped with React.memo for performance
 */
const BuilderLayoutComponent: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950">
      {/* Skip Links for Keyboard Navigation */}
      <div className="sr-only focus-within:not-sr-only">
        <a
          href="#main-canvas"
          className="absolute top-0 left-0 z-50 bg-blue-600 text-white px-4 py-2 m-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Skip to canvas
        </a>
        <a
          href="#component-palette"
          className="absolute top-0 left-20 z-50 bg-blue-600 text-white px-4 py-2 m-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Skip to components
        </a>
        <a
          href="#property-editor"
          className="absolute top-0 left-40 z-50 bg-blue-600 text-white px-4 py-2 m-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Skip to properties
        </a>
      </div>

      {/* Visually Hidden Main Heading for Screen Readers */}
      <h1 className="sr-only">Page Builder Application</h1>

      {/* Live Region for Screen Reader Announcements */}
      <LiveRegion />

      {/* Top Toolbar - Fixed Height */}
      <header className="flex-none" role="banner">
        <Toolbar />
      </header>

      {/* Main Content Area - Flexible */}
      <div className="flex-1 min-h-0">
        <PanelGroup direction="horizontal">
          {/* Left Panel - Component Palette */}
          <Panel
            defaultSize={20}
            minSize={15}
            maxSize={30}
            className="min-w-[200px]"
          >
            <aside id="component-palette" role="complementary" aria-label="Component palette">
              <h2 className="sr-only">Components</h2>
              <ComponentPalette />
            </aside>
          </Panel>

          <PanelResizeHandle
            className="w-1 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 transition-colors"
            role="separator"
            aria-label="Resize component palette"
            aria-orientation="vertical"
            tabIndex={0}
          />

          {/* Center Panel - Canvas & Layers */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Canvas Area */}
              <Panel defaultSize={75} minSize={40}>
                <main id="main-canvas" role="main" aria-label="Page builder canvas">
                  <h2 className="sr-only">Canvas</h2>
                  <Canvas />
                </main>
              </Panel>

              <PanelResizeHandle
                className="h-1 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 transition-colors"
                role="separator"
                aria-label="Resize canvas and layer tree"
                aria-orientation="horizontal"
                tabIndex={0}
              />

              {/* Layer Tree */}
              <Panel defaultSize={25} minSize={10} maxSize={40}>
                <aside role="complementary" aria-label="Layer tree">
                  <h2 className="sr-only">Layers</h2>
                  <LayerTree />
                </aside>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle
            className="w-1 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 transition-colors"
            role="separator"
            aria-label="Resize property editor"
            aria-orientation="vertical"
            tabIndex={0}
          />

          {/* Right Panel - Property Editor */}
          <Panel
            defaultSize={20}
            minSize={15}
            maxSize={35}
            className="min-w-[280px]"
          >
            <aside id="property-editor" role="complementary" aria-label="Property editor">
              <h2 className="sr-only">Properties</h2>
              <PropertyEditor />
            </aside>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

/**
 * Memoized BuilderLayout to prevent unnecessary re-renders
 * Since it has no props, it will only render once
 */
export const BuilderLayout = React.memo(BuilderLayoutComponent);
