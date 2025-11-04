/**
 * ExportTemplateGrid Component
 *
 * Displays and manages export templates with:
 * - Template cards with usage statistics
 * - Template preview and use actions
 * - Create new template option
 * - Template type icons and metadata
 *
 * @component ExportTemplateGrid
 */

'use client';

import React from 'react';
import {
  Download,
  Eye,
  MoreVertical,
  FileText,
  Calendar,
  Pill,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'health-records' | 'medications' | 'appointments' | 'incidents' | 'compliance';
  fields: string[];
  lastUsed: string;
  usage: number;
}

interface ExportTemplateGridProps {
  templates: ExportTemplate[];
  onPreview?: (templateId: string) => void;
  onUse?: (templateId: string) => void;
  onCreateNew?: () => void;
}

const getTypeIcon = (type: ExportTemplate['type']) => {
  switch (type) {
    case 'health-records': return FileText;
    case 'medications': return Pill;
    case 'appointments': return Calendar;
    case 'incidents': return AlertTriangle;
    case 'compliance': return Shield;
    default: return FileText;
  }
};

const getTypeLabel = (type: ExportTemplate['type']) => {
  switch (type) {
    case 'health-records': return 'Health Records';
    case 'medications': return 'Medications';
    case 'appointments': return 'Appointments';
    case 'incidents': return 'Incidents';
    case 'compliance': return 'Compliance';
    default: return type;
  }
};

export default function ExportTemplateGrid({
  templates,
  onPreview,
  onUse,
  onCreateNew
}: ExportTemplateGridProps) {
  const handlePreview = (templateId: string) => {
    onPreview?.(templateId);
  };

  const handleUse = (templateId: string) => {
    onUse?.(templateId);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Export Templates</CardTitle>
          <Button size="sm" onClick={onCreateNew}>
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            Create Template
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {templates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No export templates available</p>
            <p className="text-sm mt-1">Create your first template to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => {
              const TypeIcon = getTypeIcon(template.type);

              return (
                <Card
                  key={template.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="p-4">
                    {/* Header with Icon and Menu */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <TypeIcon
                          className="h-6 w-6 text-blue-600"
                          aria-hidden="true"
                        />
                        <span className="text-xs text-gray-500">
                          {getTypeLabel(template.type)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`More options for ${template.name}`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Template Name and Description */}
                    <h4 className="font-medium text-gray-900 mb-2">
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                      {template.description}
                    </p>

                    {/* Template Metadata */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{template.fields.length} fields</span>
                        <span>Used {template.usage} times</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Last used: {new Date(template.lastUsed).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handlePreview(template.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" aria-hidden="true" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleUse(template.id)}
                      >
                        <Download className="h-4 w-4 mr-1" aria-hidden="true" />
                        Use
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
