import React, { useState } from 'react';
import { X, Save, ChevronDown, ChevronRight } from 'lucide-react';
import type { ExportConfig, ReportReference, ExportFormat, ExportDestination } from './types';

interface CreateExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: Partial<ExportConfig>) => void;
  reports: ReportReference[];
  initialData?: Partial<ExportConfig>;
}

export const CreateExportModal: React.FC<CreateExportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  reports,
  initialData
}) => {
  const [formData, setFormData] = useState<Partial<ExportConfig>>(initialData || {
    name: '',
    reportId: '',
    format: 'pdf',
    destination: 'download',
    settings: {
      includeCharts: true,
      includeData: true,
      includeHeaders: true,
      includeFooters: true,
      pageOrientation: 'portrait',
      pageSize: 'A4',
      quality: 'high',
      compression: false
    },
    filters: {},
    recipients: []
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    settings: true,
    schedule: false,
    advanced: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.reportId) {
      onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        name: '',
        reportId: '',
        format: 'pdf',
        destination: 'download',
        settings: {
          includeCharts: true,
          includeData: true,
          includeHeaders: true,
          includeFooters: true,
          pageOrientation: 'portrait',
          pageSize: 'A4',
          quality: 'high',
          compression: false
        },
        filters: {},
        recipients: []
      });
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateSettings = (key: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        includeCharts: true,
        includeData: true,
        includeHeaders: true,
        includeFooters: true,
        pageOrientation: 'portrait' as const,
        pageSize: 'A4' as const,
        quality: 'high' as const,
        compression: false,
        ...prev.settings,
        [key]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {initialData?.id ? 'Edit Export Configuration' : 'Create Export Configuration'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Basic Information</h4>
              
              <div>
                <label htmlFor="exportName" className="block text-sm font-medium text-gray-700 mb-1">
                  Export Name
                </label>
                <input
                  type="text"
                  id="exportName"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter export configuration name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="reportSelect" className="block text-sm font-medium text-gray-700 mb-1">
                  Report
                </label>
                <select
                  id="reportSelect"
                  value={formData.reportId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, reportId: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a report</option>
                  {reports.map((report) => (
                    <option key={report.id} value={report.id}>
                      {report.name} ({report.category})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="formatSelect" className="block text-sm font-medium text-gray-700 mb-1">
                    Format
                  </label>
                  <select
                    id="formatSelect"
                    value={formData.format || 'pdf'}
                    onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value as ExportFormat }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pdf">PDF</option>
                    <option value="csv">CSV</option>
                    <option value="xlsx">Excel</option>
                    <option value="json">JSON</option>
                    <option value="xml">XML</option>
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="destinationSelect" className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <select
                    id="destinationSelect"
                    value={formData.destination || 'download'}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value as ExportDestination }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="download">Download</option>
                    <option value="email">Email</option>
                    <option value="cloud">Cloud Storage</option>
                    <option value="ftp">FTP</option>
                    <option value="api">API Endpoint</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Export Settings */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => toggleSection('settings')}
                className="flex items-center w-full text-left"
                aria-label="Toggle export settings"
              >
                {expandedSections.settings ? (
                  <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />
                )}
                <h4 className="text-md font-medium text-gray-900">Export Settings</h4>
              </button>
              
              {expandedSections.settings && (
                <div className="pl-7 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.settings?.includeCharts || false}
                        onChange={(e) => updateSettings('includeCharts', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Include Charts</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.settings?.includeData || false}
                        onChange={(e) => updateSettings('includeData', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Include Data</span>
                    </label>
                  </div>
                  
                  {formData.format === 'pdf' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="pageOrientation" className="block text-sm font-medium text-gray-700 mb-1">
                          Page Orientation
                        </label>
                        <select
                          id="pageOrientation"
                          value={formData.settings?.pageOrientation || 'portrait'}
                          onChange={(e) => updateSettings('pageOrientation', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                                   focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="portrait">Portrait</option>
                          <option value="landscape">Landscape</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="pageSize" className="block text-sm font-medium text-gray-700 mb-1">
                          Page Size
                        </label>
                        <select
                          id="pageSize"
                          value={formData.settings?.pageSize || 'A4'}
                          onChange={(e) => updateSettings('pageSize', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                                   focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="A4">A4</option>
                          <option value="A3">A3</option>
                          <option value="Letter">Letter</option>
                          <option value="Legal">Legal</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                       rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent 
                       rounded-md hover:bg-blue-700 inline-flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {initialData?.id ? 'Update Export' : 'Create Export'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
