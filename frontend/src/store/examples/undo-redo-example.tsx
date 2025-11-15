/**
 * Undo/Redo example
 */

import React from 'react';
import {
  useHistoryState,
  useUndo,
  useRedo,
  useAddComponent,
  useRemoveComponent,
  useRootComponents,
} from '../hooks';

export function UndoRedoExample() {
  const { canUndo, canRedo, pastLength, futureLength } = useHistoryState();
  const undo = useUndo();
  const redo = useRedo();
  const addComponent = useAddComponent();
  const removeComponent = useRemoveComponent();
  const rootComponents = useRootComponents();

  const handleAddComponent = () => {
    addComponent({
      type: 'Text',
      name: 'Text Component',
      parentId: null,
      childIds: [],
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      size: { width: 200, height: 50 },
      properties: {
        text: 'Sample text',
      },
      locked: false,
      hidden: false,
    });
  };

  const handleRemoveLast = () => {
    const lastComponent = rootComponents[rootComponents.length - 1];
    if (lastComponent) {
      removeComponent(lastComponent.id);
    }
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey && canRedo) {
          redo();
        } else if (canUndo) {
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Undo/Redo Example</h2>
        <p className="text-gray-600 text-sm mb-4">
          Use Ctrl+Z to undo, Ctrl+Shift+Z to redo
        </p>

        <div className="flex gap-2 mb-4">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            ⟲ Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            ⟳ Redo
          </button>
          <div className="flex-1" />
          <button
            onClick={handleAddComponent}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Add Component
          </button>
          <button
            onClick={handleRemoveLast}
            disabled={rootComponents.length === 0}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
          >
            Remove Last
          </button>
        </div>

        <div className="flex gap-4 text-sm">
          <div>
            History: {pastLength} past, {futureLength} future
          </div>
          <div>Components: {rootComponents.length}</div>
        </div>
      </div>

      <div className="border rounded p-4">
        <h3 className="font-bold mb-2">Canvas</h3>
        {rootComponents.length === 0 ? (
          <p className="text-gray-500">No components</p>
        ) : (
          <div className="space-y-1">
            {rootComponents.map((component, index) => (
              <div key={component.id} className="p-2 bg-gray-100 rounded">
                {index + 1}. {component.name} ({component.type})
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
