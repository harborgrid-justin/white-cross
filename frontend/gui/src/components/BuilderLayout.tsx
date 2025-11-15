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

export const BuilderLayout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950">
      {/* Top Toolbar - Fixed Height */}
      <div className="flex-none">
        <Toolbar />
      </div>

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
            <ComponentPalette />
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 transition-colors" />

          {/* Center Panel - Canvas & Layers */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Canvas Area */}
              <Panel defaultSize={75} minSize={40}>
                <Canvas />
              </Panel>

              <PanelResizeHandle className="h-1 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 transition-colors" />

              {/* Layer Tree */}
              <Panel defaultSize={25} minSize={10} maxSize={40}>
                <LayerTree />
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 transition-colors" />

          {/* Right Panel - Property Editor */}
          <Panel
            defaultSize={20}
            minSize={15}
            maxSize={35}
            className="min-w-[280px]"
          >
            <PropertyEditor />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};
