import React from 'react';
import { Plus, Edit3, Trash2, Zap } from 'lucide-react';
import type { ExportConfig } from './types';
import { getFormatIcon } from './utils';

interface ExportConfigsProps {
  configs: ExportConfig[];
  onCreateNew: () => void;
  onStartJob: (configId: string) => void;
  onEditConfig: (config: ExportConfig) => void;
  onDeleteConfig: (configId: string) => void;
}

export const ExportConfigs: React.FC<ExportConfigsProps> = ({
  configs,
  onCreateNew,
  onStartJob,
  onEditConfig,
  onDeleteConfig
}) => {
  if (configs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Export Configurations</h3>
        <p className="text-gray-600 mb-4">
          Create your first export configuration to get started.
        </p>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                   bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Export Config
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {configs.map((config) => {
        const FormatIcon = getFormatIcon(config.format);
        
        return (
          <div 
            key={config.id} 
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <FormatIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{config.name}</h3>
                  <p className="text-sm text-gray-600">{config.reportName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onStartJob(config.id)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                  title="Start export"
                  aria-label="Start export"
                >
                  <Zap className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEditConfig(config)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md"
                  title="Edit config"
                  aria-label="Edit config"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteConfig(config.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                  title="Delete config"
                  aria-label="Delete config"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Format:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                               bg-blue-100 text-blue-800">
                  {config.format.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Destination:</span>
                <span className="text-gray-900 capitalize">{config.destination}</span>
              </div>
              
              {config.schedule?.enabled && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Schedule:</span>
                  <span className="text-gray-900 capitalize">{config.schedule.frequency}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Created:</span>
                <span className="text-gray-900">
                  {new Date(config.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
