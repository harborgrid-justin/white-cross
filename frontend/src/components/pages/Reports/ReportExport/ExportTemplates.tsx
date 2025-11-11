import React from 'react';
import { Archive, Copy } from 'lucide-react';
import type { ExportTemplate, ExportConfig } from './types';
import { getFormatIcon } from './utils';

interface ExportTemplatesProps {
  templates: ExportTemplate[];
  onUseTemplate: (template: ExportTemplate) => void;
  onSaveTemplate?: (template: Partial<ExportTemplate>) => void;
}

export const ExportTemplates: React.FC<ExportTemplatesProps> = ({
  templates,
  onUseTemplate,
  onSaveTemplate
}) => {
  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Export Templates</h3>
        <p className="text-gray-600">
          Save frequently used export configurations as templates.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {templates.map((template) => {
        const FormatIcon = getFormatIcon(template.format);
        
        return (
          <div 
            key={template.id} 
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 rounded-lg p-2">
                  <FormatIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              </div>
              
              {template.isDefault && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Default
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Format:</span>
                <span className="text-gray-900 uppercase">{template.format}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Usage:</span>
                <span className="text-gray-900">{template.usageCount} times</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Created:</span>
                <span className="text-gray-900">
                  {new Date(template.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-2">
              <button
                onClick={() => onUseTemplate(template)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 
                         bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
              >
                <Copy className="w-4 h-4 mr-2" />
                Use Template
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
