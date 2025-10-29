/**
 * FormFieldLibrary component
 *
 * @module components/forms/FormFieldLibrary
 * @description Library of available field types for form builder
 */

'use client';

import React from 'react';
import {
  Type,
  AlignLeft,
  Hash,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckSquare,
  Circle,
  List,
  FileText,
  PenTool
} from 'lucide-react';

const fieldTypes = [
  { id: 'text', name: 'Text Input', icon: Type },
  { id: 'textarea', name: 'Text Area', icon: AlignLeft },
  { id: 'number', name: 'Number', icon: Hash },
  { id: 'email', name: 'Email', icon: Mail },
  { id: 'phone', name: 'Phone', icon: Phone },
  { id: 'date', name: 'Date', icon: Calendar },
  { id: 'time', name: 'Time', icon: Clock },
  { id: 'checkbox', name: 'Checkbox', icon: CheckSquare },
  { id: 'radio', name: 'Radio', icon: Circle },
  { id: 'select', name: 'Dropdown', icon: List },
  { id: 'file', name: 'File Upload', icon: FileText },
  { id: 'signature', name: 'Signature', icon: PenTool }
];

export function FormFieldLibrary() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Field Types</h4>
      <div className="grid grid-cols-2 gap-2">
        {fieldTypes.map((field) => {
          const Icon = field.icon;
          return (
            <button
              key={field.id}
              className="flex items-center gap-2 p-3 border border-gray-200 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('fieldType', field.id);
              }}
            >
              <Icon className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">{field.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
