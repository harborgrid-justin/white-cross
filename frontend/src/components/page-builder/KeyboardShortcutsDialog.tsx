'use client';

/**
 * KeyboardShortcutsDialog Component
 *
 * Modal dialog displaying all available keyboard shortcuts.
 * Helps users learn and remember keyboard shortcuts for faster workflow.
 *
 * Features:
 * - Categorized shortcuts
 * - Visual keyboard hints
 * - Search/filter shortcuts
 * - Printable reference
 */

import React from 'react';
import { X, Command, Search } from 'lucide-react';

interface KeyboardShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  // General
  { keys: ['Ctrl', 'S'], description: 'Save page', category: 'General' },
  { keys: ['Ctrl', 'Z'], description: 'Undo', category: 'General' },
  { keys: ['Ctrl', 'Y'], description: 'Redo', category: 'General' },
  { keys: ['Ctrl', 'P'], description: 'Toggle preview', category: 'General' },
  { keys: ['Ctrl', 'T'], description: 'Toggle tree view', category: 'General' },
  { keys: ['Ctrl', 'B'], description: 'Toggle component palette', category: 'General' },
  { keys: ['Ctrl', 'I'], description: 'Toggle properties panel', category: 'General' },
  { keys: ['?'], description: 'Show keyboard shortcuts', category: 'General' },

  // Selection & Navigation
  { keys: ['V'], description: 'Select tool', category: 'Selection' },
  { keys: ['H'], description: 'Pan tool', category: 'Selection' },
  { keys: ['Escape'], description: 'Clear selection', category: 'Selection' },
  { keys: ['Tab'], description: 'Select next component', category: 'Selection' },
  { keys: ['Shift', 'Tab'], description: 'Select previous component', category: 'Selection' },

  // Editing
  { keys: ['Delete'], description: 'Delete selected component', category: 'Editing' },
  { keys: ['Ctrl', 'D'], description: 'Duplicate selected component', category: 'Editing' },
  { keys: ['Ctrl', 'C'], description: 'Copy selected component', category: 'Editing' },
  { keys: ['Ctrl', 'V'], description: 'Paste component', category: 'Editing' },
  { keys: ['Ctrl', 'X'], description: 'Cut selected component', category: 'Editing' },

  // Movement
  { keys: ['↑'], description: 'Move component up', category: 'Movement' },
  { keys: ['↓'], description: 'Move component down', category: 'Movement' },
  { keys: ['←'], description: 'Move component left', category: 'Movement' },
  { keys: ['→'], description: 'Move component right', category: 'Movement' },
  { keys: ['Shift', '↑'], description: 'Move component up (10px)', category: 'Movement' },
  { keys: ['Shift', '↓'], description: 'Move component down (10px)', category: 'Movement' },
  { keys: ['Shift', '←'], description: 'Move component left (10px)', category: 'Movement' },
  { keys: ['Shift', '→'], description: 'Move component right (10px)', category: 'Movement' },

  // View
  { keys: ['Ctrl', '+'], description: 'Zoom in', category: 'View' },
  { keys: ['Ctrl', '-'], description: 'Zoom out', category: 'View' },
  { keys: ['Ctrl', '0'], description: 'Reset zoom', category: 'View' },
  { keys: ['Ctrl', '1'], description: 'Fit to screen', category: 'View' },
];

export function KeyboardShortcutsDialog({ isOpen, onClose }: KeyboardShortcutsDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  if (!isOpen) return null;

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  const filteredShortcuts = searchQuery
    ? shortcuts.filter(s =>
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.keys.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : shortcuts;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search shortcuts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="overflow-y-auto max-h-[calc(80vh-180px)] px-6 py-4">
          {categories.map(category => {
            const categoryShortcuts = filteredShortcuts.filter(
              s => s.category === category
            );

            if (categoryShortcuts.length === 0) return null;

            return (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-sm text-gray-700">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            {keyIndex > 0 && (
                              <span className="text-gray-400 text-xs">+</span>
                            )}
                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded shadow-sm">
                              {key === 'Ctrl' && (
                                <span className="inline-flex items-center">
                                  <Command className="w-3 h-3 mr-1" />
                                  Ctrl
                                </span>
                              )}
                              {key !== 'Ctrl' && key}
                            </kbd>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredShortcuts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">
                No shortcuts found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
