/**
 * Property Editor Component (Optimized)
 * Right sidebar for editing selected component properties
 */

'use client';

import React, { useCallback, useMemo } from 'react';
import { useSelectedComponents, useUpdateComponent } from '../../hooks/usePageBuilder';

/**
 * Internal PropertyEditor component
 */
const PropertyEditorInternal: React.FC = () => {
  const selectedComponents = useSelectedComponents();
  const updateComponent = useUpdateComponent();

  // Memoize the first selected component to prevent recalculation
  const component = useMemo(() => selectedComponents[0], [selectedComponents]);

  // Memoize update handlers to prevent recreation on every render
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (component) {
        updateComponent(component.id, { name: e.target.value }, true);
      }
    },
    [component, updateComponent]
  );

  const handlePositionXChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (component) {
        updateComponent(component.id, {
          position: { ...component.position, x: Number(e.target.value) },
        });
      }
    },
    [component, updateComponent]
  );

  const handlePositionYChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (component) {
        updateComponent(component.id, {
          position: { ...component.position, y: Number(e.target.value) },
        });
      }
    },
    [component, updateComponent]
  );

  const handleWidthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (component) {
        updateComponent(component.id, {
          size: { ...component.size, width: Number(e.target.value) },
        });
      }
    },
    [component, updateComponent]
  );

  const handleHeightChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (component) {
        updateComponent(component.id, {
          size: { ...component.size, height: Number(e.target.value) },
        });
      }
    },
    [component, updateComponent]
  );

  if (selectedComponents.length === 0) {
    return (
      <div className="h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Properties
          </h2>
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Select a component to edit its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  const component = selectedComponents[0];

  return (
    <div className="h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Properties
        </h2>

        {selectedComponents.length > 1 ? (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {selectedComponents.length} components selected
            </p>
          </div>
        ) : null}

        {/* Component Info */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </label>
            <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">
              {component.type}
            </span>
          </div>
          <div className="mb-4">
            <label
              htmlFor="component-name"
              className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block"
            >
              Name
            </label>
            <input
              id="component-name"
              type="text"
              value={component.name}
              onChange={handleNameChange}
              aria-describedby="component-name-description"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span id="component-name-description" className="sr-only">
              Enter a name for the component
            </span>
          </div>
        </div>

        {/* Position & Size */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Layout
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="component-x" className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                  X Position
                </label>
                <input
                  id="component-x"
                  type="number"
                  value={Math.round(component.position.x)}
                  onChange={handlePositionXChange}
                  aria-label="Component X position in pixels"
                  className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label htmlFor="component-y" className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                  Y Position
                </label>
                <input
                  id="component-y"
                  type="number"
                  value={Math.round(component.position.y)}
                  onChange={handlePositionYChange}
                  aria-label="Component Y position in pixels"
                  className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="component-width" className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                  Width
                </label>
                <input
                  id="component-width"
                  type="number"
                  value={Math.round(component.size.width)}
                  onChange={handleWidthChange}
                  aria-label="Component width in pixels"
                  min="1"
                  className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label htmlFor="component-height" className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                  Height
                </label>
                <input
                  id="component-height"
                  type="number"
                  value={Math.round(component.size.height)}
                  onChange={handleHeightChange}
                  aria-label="Component height in pixels"
                  min="1"
                  className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Component-specific Properties */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Properties
          </h3>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Component-specific properties will appear here
            </p>
          </div>
        </div>

        {/* Styles */}
        <div>
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Styles
          </h3>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Style editor coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Memoized PropertyEditor to prevent unnecessary re-renders
 * Only re-renders when selected components change
 */
export const PropertyEditor = React.memo(PropertyEditorInternal);
