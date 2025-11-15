/**
 * Basic usage example for the page builder store
 */

import React from 'react';
import {
  useAddComponent,
  useRemoveComponent,
  useRootComponents,
  useSelectedComponents,
  useSelect,
  useClearSelection,
} from '../hooks';

export function BasicCanvasExample() {
  const rootComponents = useRootComponents();
  const selectedComponents = useSelectedComponents();
  const addComponent = useAddComponent();
  const removeComponent = useRemoveComponent();
  const select = useSelect();
  const clearSelection = useClearSelection();

  const handleAddButton = () => {
    const id = addComponent({
      type: 'Button',
      name: 'New Button',
      parentId: null,
      childIds: [],
      position: { x: 100, y: 100 },
      size: { width: 120, height: 40 },
      properties: {
        text: 'Click me',
        style: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
        },
      },
      locked: false,
      hidden: false,
    });

    // Auto-select newly created component
    select(id);
  };

  const handleAddContainer = () => {
    const id = addComponent({
      type: 'Container',
      name: 'New Container',
      parentId: null,
      childIds: [],
      position: { x: 50, y: 50 },
      size: { width: 400, height: 300 },
      properties: {
        style: {
          backgroundColor: '#f3f4f6',
          padding: {
            top: 16,
            right: 16,
            bottom: 16,
            left: 16,
          },
        },
      },
      locked: false,
      hidden: false,
    });

    select(id);
  };

  const handleDelete = () => {
    selectedComponents.forEach((component) => {
      removeComponent(component.id);
    });
    clearSelection();
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <button
          onClick={handleAddButton}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Button
        </button>
        <button
          onClick={handleAddContainer}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Container
        </button>
        <button
          onClick={handleDelete}
          disabled={selectedComponents.length === 0}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          Delete Selected ({selectedComponents.length})
        </button>
      </div>

      <div className="border rounded p-4">
        <h3 className="font-bold mb-2">Components on Canvas</h3>
        {rootComponents.length === 0 ? (
          <p className="text-gray-500">No components yet. Add some!</p>
        ) : (
          <ul className="space-y-1">
            {rootComponents.map((component) => (
              <li
                key={component.id}
                onClick={() => select(component.id)}
                className={`cursor-pointer p-2 rounded ${
                  selectedComponents.some((c) => c.id === component.id)
                    ? 'bg-blue-100'
                    : 'hover:bg-gray-100'
                }`}
              >
                {component.name} ({component.type})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
