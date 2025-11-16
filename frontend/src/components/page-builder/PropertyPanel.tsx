'use client';

/**
 * PropertyPanel Component
 *
 * Right sidebar for editing selected component properties.
 * Inspired by Webflow's style panel and Figma's design panel.
 *
 * Features:
 * - Grouped property controls (Basic, Layout, Styling, Behavior)
 * - Dynamic property rendering based on component type
 * - Various control types (text, number, select, color, spacing, etc.)
 * - Real-time preview updates
 * - Property search and filtering
 * - Collapsible property groups
 * - Responsive value configuration
 */

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Settings,
  Layout,
  Palette,
  Zap,
  Search,
  Info
} from 'lucide-react';

interface PropertyGroup {
  id: string;
  name: string;
  icon: React.ReactNode;
  properties: Property[];
}

interface Property {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'color' | 'toggle' | 'spacing';
  value: any;
  options?: Array<{ value: string; label: string }>;
  helpText?: string;
}

export function PropertyPanel() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['basic', 'layout'])
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Mock property groups - will be dynamically generated based on selected component
  const propertyGroups: PropertyGroup[] = [
    {
      id: 'basic',
      name: 'Basic',
      icon: <Settings className="w-4 h-4" />,
      properties: [
        {
          name: 'name',
          label: 'Component Name',
          type: 'text',
          value: '',
          helpText: 'Unique identifier for this component'
        },
        {
          name: 'visible',
          label: 'Visible',
          type: 'toggle',
          value: true,
          helpText: 'Show or hide this component'
        }
      ]
    },
    {
      id: 'layout',
      name: 'Layout',
      icon: <Layout className="w-4 h-4" />,
      properties: [
        {
          name: 'width',
          label: 'Width',
          type: 'text',
          value: 'auto',
          helpText: 'Component width (px, %, auto)'
        },
        {
          name: 'height',
          label: 'Height',
          type: 'text',
          value: 'auto',
          helpText: 'Component height (px, %, auto)'
        },
        {
          name: 'display',
          label: 'Display',
          type: 'select',
          value: 'block',
          options: [
            { value: 'block', label: 'Block' },
            { value: 'flex', label: 'Flex' },
            { value: 'grid', label: 'Grid' },
            { value: 'inline', label: 'Inline' },
            { value: 'inline-block', label: 'Inline Block' },
            { value: 'none', label: 'None' }
          ]
        }
      ]
    },
    {
      id: 'styling',
      name: 'Styling',
      icon: <Palette className="w-4 h-4" />,
      properties: [
        {
          name: 'backgroundColor',
          label: 'Background',
          type: 'color',
          value: '#ffffff'
        },
        {
          name: 'textColor',
          label: 'Text Color',
          type: 'color',
          value: '#000000'
        },
        {
          name: 'padding',
          label: 'Padding',
          type: 'spacing',
          value: { top: 0, right: 0, bottom: 0, left: 0 }
        },
        {
          name: 'margin',
          label: 'Margin',
          type: 'spacing',
          value: { top: 0, right: 0, bottom: 0, left: 0 }
        }
      ]
    },
    {
      id: 'behavior',
      name: 'Behavior',
      icon: <Zap className="w-4 h-4" />,
      properties: [
        {
          name: 'clickAction',
          label: 'Click Action',
          type: 'select',
          value: 'none',
          options: [
            { value: 'none', label: 'None' },
            { value: 'navigate', label: 'Navigate' },
            { value: 'openModal', label: 'Open Modal' },
            { value: 'custom', label: 'Custom Script' }
          ]
        }
      ]
    }
  ];

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Properties</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search properties"
          />
        </div>
      </div>

      {/* Property Groups */}
      <div className="flex-1 overflow-y-auto">
        {!selectedComponent ? (
          /* No Selection State */
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              No component selected
            </h3>
            <p className="text-xs text-gray-500">
              Select a component on the canvas to view and edit its properties
            </p>
          </div>
        ) : (
          /* Property Groups */
          <div>
            {propertyGroups.map(group => {
              const isExpanded = expandedGroups.has(group.id);

              return (
                <div key={group.id} className="border-b border-gray-200">
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{group.icon}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {group.name}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {/* Group Properties */}
                  {isExpanded && (
                    <div className="px-4 py-3 space-y-4 bg-gray-50">
                      {group.properties.map(property => (
                        <PropertyControl
                          key={property.name}
                          property={property}
                          onChange={(value) => {
                            console.log(`Property ${property.name} changed to:`, value);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Individual property control renderer
 */
interface PropertyControlProps {
  property: Property;
  onChange: (value: any) => void;
}

function PropertyControl({ property, onChange }: PropertyControlProps) {
  const renderControl = () => {
    switch (property.type) {
      case 'text':
        return (
          <input
            type="text"
            value={property.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'number':
        return (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={property.value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex flex-col">
              <button
                onClick={() => onChange(property.value + 1)}
                className="px-2 py-0.5 border border-gray-300 rounded-t hover:bg-gray-50 text-xs"
              >
                ▲
              </button>
              <button
                onClick={() => onChange(property.value - 1)}
                className="px-2 py-0.5 border border-gray-300 border-t-0 rounded-b hover:bg-gray-50 text-xs"
              >
                ▼
              </button>
            </div>
          </div>
        );

      case 'select':
        return (
          <select
            value={property.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {property.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={property.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={property.value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            />
          </div>
        );

      case 'toggle':
        return (
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={property.value}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
            <span className="ml-3 text-sm text-gray-700">
              {property.value ? 'On' : 'Off'}
            </span>
          </label>
        );

      case 'spacing':
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Top</label>
                <input
                  type="number"
                  value={property.value.top}
                  onChange={(e) => onChange({ ...property.value, top: Number(e.target.value) })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Right</label>
                <input
                  type="number"
                  value={property.value.right}
                  onChange={(e) => onChange({ ...property.value, right: Number(e.target.value) })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bottom</label>
                <input
                  type="number"
                  value={property.value.bottom}
                  onChange={(e) => onChange({ ...property.value, bottom: Number(e.target.value) })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Left</label>
                <input
                  type="number"
                  value={property.value.left}
                  onChange={(e) => onChange({ ...property.value, left: Number(e.target.value) })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-xs text-gray-500">Unknown control type</div>;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-gray-700">
          {property.label}
        </label>
        {property.helpText && (
          <button
            className="text-gray-400 hover:text-gray-600"
            title={property.helpText}
          >
            <Info className="w-3 h-3" />
          </button>
        )}
      </div>
      {renderControl()}
    </div>
  );
}
