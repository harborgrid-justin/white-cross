'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TagIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

/**
 * Communication template data structure
 */
interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'phone_script' | 'chat';
  category: 'emergency' | 'routine' | 'appointment' | 'medication' | 'general';
  subject?: string;
  content: string;
  variables: string[];
  tags: string[];
  isActive: boolean;
  usage_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_used?: string;
}

/**
 * Template filter options
 */
interface TemplateFilters {
  search: string;
  type: string;
  category: string;
  tags: string[];
  status: 'all' | 'active' | 'inactive';
  sortBy: 'name' | 'usage_count' | 'created_at' | 'updated_at';
  sortOrder: 'asc' | 'desc';
}

/**
 * Props for the CommunicationTemplates component
 */
interface CommunicationTemplatesProps {
  /** Additional CSS classes */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Callback when template is selected for use */
  onUseTemplate?: (template: CommunicationTemplate) => void;
  /** Callback when template is edited */
  onEditTemplate?: (template: CommunicationTemplate) => void;
  /** Callback when template is deleted */
  onDeleteTemplate?: (templateId: string) => void;
  /** Callback when new template is created */
  onCreateTemplate?: () => void;
}

/**
 * CommunicationTemplates component for managing communication templates
 * 
 * Features:
 * - Template library with search and filtering
 * - Template creation, editing, and deletion
 * - Template usage analytics
 * - Variable management for dynamic content
 * - Category and type organization
 * - Bulk operations support
 * - Template preview functionality
 * - Usage statistics and analytics
 * 
 * @component
 * @example
 * ```tsx
 * <CommunicationTemplates
 *   onUseTemplate={(template) => handleUseTemplate(template)}
 *   onEditTemplate={(template) => handleEditTemplate(template)}
 *   onDeleteTemplate={(id) => handleDeleteTemplate(id)}
 *   onCreateTemplate={() => handleCreateTemplate()}
 * />
 * ```
 */
export const CommunicationTemplates: React.FC<CommunicationTemplatesProps> = ({
  className = '',
  isLoading = false,
  error,
  onUseTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onCreateTemplate
}): React.ReactElement => {
  // State management
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());
  const [previewTemplate, setPreviewTemplate] = useState<CommunicationTemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState<TemplateFilters>({
    search: '',
    type: '',
    category: '',
    tags: [],
    status: 'all',
    sortBy: 'updated_at',
    sortOrder: 'desc'
  });

  // Mock data - replace with actual API calls
  const mockTemplates: CommunicationTemplate[] = [
    {
      id: '1',
      name: 'Appointment Reminder - Email',
      type: 'email',
      category: 'appointment',
      subject: 'Upcoming Appointment Reminder - {{student_name}}',
      content: 'Dear {{parent_name}},\n\nThis is a reminder that {{student_name}} has an appointment scheduled for {{appointment_date}} at {{appointment_time}}.\n\nPlease ensure they arrive 15 minutes early.\n\nBest regards,\n{{school_name}}',
      variables: ['student_name', 'parent_name', 'appointment_date', 'appointment_time', 'school_name'],
      tags: ['appointment', 'reminder', 'parent'],
      isActive: true,
      usage_count: 45,
      created_by: 'Sarah Johnson',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-03-20T14:30:00Z',
      last_used: '2024-03-25T09:15:00Z'
    },
    {
      id: '2',
      name: 'Medication Administration - SMS',
      type: 'sms',
      category: 'medication',
      content: '{{student_name}} received {{medication_name}} ({{dosage}}) at {{time}}. Administered by {{nurse_name}}. Any concerns? Reply STOP to opt out.',
      variables: ['student_name', 'medication_name', 'dosage', 'time', 'nurse_name'],
      tags: ['medication', 'notification', 'parent'],
      isActive: true,
      usage_count: 128,
      created_by: 'Mike Chen',
      created_at: '2024-02-01T08:00:00Z',
      updated_at: '2024-03-18T11:45:00Z',
      last_used: '2024-03-25T13:22:00Z'
    },
    {
      id: '3',
      name: 'Emergency Contact Script',
      type: 'phone_script',
      category: 'emergency',
      content: 'Hello, this is {{nurse_name}} from {{school_name}}. I\'m calling regarding {{student_name}}. We have a {{emergency_type}} situation. {{student_name}} is currently {{current_status}}. Please {{required_action}}. Do you have any questions?',
      variables: ['nurse_name', 'school_name', 'student_name', 'emergency_type', 'current_status', 'required_action'],
      tags: ['emergency', 'script', 'parent', 'urgent'],
      isActive: true,
      usage_count: 12,
      created_by: 'Lisa Wang',
      created_at: '2024-01-20T12:00:00Z',
      updated_at: '2024-02-15T16:20:00Z',
      last_used: '2024-03-10T10:30:00Z'
    }
  ];

  // Load templates
  useEffect(() => {
    const loadTemplates = () => {
      setTemplates(mockTemplates);
    };
    loadTemplates();
  }, []);

  // Filter and sort templates
  const filteredTemplates = useCallback(() => {
    let result = [...templates];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(template =>
        template.name.toLowerCase().includes(searchLower) ||
        template.content.toLowerCase().includes(searchLower) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply type filter
    if (filters.type) {
      result = result.filter(template => template.type === filters.type);
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter(template => template.category === filters.category);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(template => 
        filters.status === 'active' ? template.isActive : !template.isActive
      );
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      result = result.filter(template =>
        filters.tags.every(tag => template.tags.includes(tag))
      );
    }

    // Sort results
    result.sort((a, b) => {
      let aValue, bValue;
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'usage_count':
          aValue = a.usage_count;
          bValue = b.usage_count;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'updated_at':
          aValue = new Date(a.updated_at).getTime();
          bValue = new Date(b.updated_at).getTime();
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filters.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return filters.sortOrder === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    return result;
  }, [templates, filters]);

  // Handle template selection
  const handleTemplateSelect = (templateId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedTemplates);
    if (isSelected) {
      newSelected.add(templateId);
    } else {
      newSelected.delete(templateId);
    }
    setSelectedTemplates(newSelected);
  };

  // Handle select all
  const handleSelectAll = () => {
    const filtered = filteredTemplates();
    if (selectedTemplates.size === filtered.length) {
      setSelectedTemplates(new Set());
    } else {
      setSelectedTemplates(new Set(filtered.map(t => t.id)));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedTemplates.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedTemplates.size} template(s)?`)) {
      selectedTemplates.forEach(templateId => {
        onDeleteTemplate?.(templateId);
      });
      setSelectedTemplates(new Set());
    }
  };

  // Handle template duplicate
  const handleDuplicateTemplate = (template: CommunicationTemplate) => {
    const duplicatedTemplate = {
      ...template,
      id: `${template.id}_copy_${Date.now()}`,
      name: `${template.name} (Copy)`,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setTemplates(prev => [...prev, duplicatedTemplate]);
  };

  // Get type icon
  const getTypeIcon = (type: CommunicationTemplate['type']) => {
    switch (type) {
      case 'email':
        return <EnvelopeIcon className="h-4 w-4" />;
      case 'sms':
        return <DevicePhoneMobileIcon className="h-4 w-4" />;
      case 'phone_script':
        return <PhoneIcon className="h-4 w-4" />;
      case 'chat':
        return <ChatBubbleLeftRightIcon className="h-4 w-4" />;
      default:
        return <EnvelopeIcon className="h-4 w-4" />;
    }
  };

  // Get category color
  const getCategoryColor = (category: CommunicationTemplate['category']) => {
    switch (category) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'routine':
        return 'bg-blue-100 text-blue-800';
      case 'appointment':
        return 'bg-green-100 text-green-800';
      case 'medication':
        return 'bg-purple-100 text-purple-800';
      case 'general':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    ) as React.ReactElement;
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading templates</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    ) as React.ReactElement;
  }

  const filtered = filteredTemplates();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Communication Templates</h2>
          <p className="text-gray-600 mt-1">Manage and organize communication templates</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Create new template"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Template
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={filters.search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search templates"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by type"
          >
            <option value="">All Types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="phone_script">Phone Script</option>
            <option value="chat">Chat</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            <option value="emergency">Emergency</option>
            <option value="routine">Routine</option>
            <option value="appointment">Appointment</option>
            <option value="medication">Medication</option>
            <option value="general">General</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({ ...prev, status: e.target.value as 'all' | 'active' | 'inactive' }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by status"
          >
            <option value="all">All Templates</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Sort and Bulk Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setFilters(prev => ({ 
                  ...prev, 
                  sortBy: sortBy as typeof prev.sortBy,
                  sortOrder: sortOrder as 'asc' | 'desc'
                }));
              }}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Sort templates"
            >
              <option value="updated_at-desc">Recently Updated</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="usage_count-desc">Most Used</option>
              <option value="usage_count-asc">Least Used</option>
              <option value="created_at-desc">Recently Created</option>
            </select>

            <div className="text-sm text-gray-500">
              {filtered.length} of {templates.length} templates
            </div>
          </div>

          {selectedTemplates.size > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedTemplates.size} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label="Delete selected templates"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Templates List */}
      <div className="bg-white rounded-lg shadow">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <DocumentDuplicateIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-4">
              {filters.search || filters.type || filters.category || filters.status !== 'all'
                ? 'Try adjusting your filters to see more templates.'
                : 'Get started by creating your first communication template.'
              }
            </p>
            {(!filters.search && !filters.type && !filters.category && filters.status === 'all') && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Template
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {/* Select All Header */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedTemplates.size === filtered.length && filtered.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  aria-label="Select all templates"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Select All
                </span>
              </label>
            </div>

            {/* Template Items */}
            {filtered.map((template) => (
              <div key={template.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedTemplates.has(template.id)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTemplateSelect(template.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    aria-label={`Select ${template.name}`}
                  />

                  {/* Template Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(template.type)}
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {template.name}
                          </h3>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                          {template.category}
                        </span>
                        {!template.isActive && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onUseTemplate?.(template)}
                          className="inline-flex items-center px-3 py-1 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          aria-label={`Use template ${template.name}`}
                        >
                          Use Template
                        </button>
                        <button
                          onClick={() => setPreviewTemplate(template)}
                          className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                          aria-label={`Preview template ${template.name}`}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDuplicateTemplate(template)}
                          className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                          aria-label={`Duplicate template ${template.name}`}
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEditTemplate?.(template)}
                          className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                          aria-label={`Edit template ${template.name}`}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTemplate?.(template.id)}
                          className="p-2 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md"
                          aria-label={`Delete template ${template.name}`}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Template Preview */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.subject && `Subject: ${template.subject} | `}
                      {template.content}
                    </p>

                    {/* Tags */}
                    {template.tags.length > 0 && (
                      <div className="flex items-center space-x-2 mb-3">
                        <TagIcon className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {template.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Variables */}
                    {template.variables.length > 0 && (
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-xs font-medium text-gray-500">Variables:</span>
                        <div className="flex flex-wrap gap-1">
                          {template.variables.map((variable) => (
                            <code
                              key={variable}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200"
                            >
                              {`{{${variable}}}`}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <UserIcon className="h-3 w-3" />
                          <span>{template.created_by}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-3 w-3" />
                          <span>Updated {new Date(template.updated_at).toLocaleDateString()}</span>
                        </div>
                        <div>
                          Used {template.usage_count} times
                          {template.last_used && (
                            <span className="ml-1">
                              (last: {new Date(template.last_used).toLocaleDateString()})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setPreviewTemplate(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                  Template Preview: {previewTemplate.name}
                </h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                  aria-label="Close preview"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {previewTemplate.subject && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <div className="p-3 bg-gray-50 rounded-md text-sm">{previewTemplate.subject}</div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <div className="p-3 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">{previewTemplate.content}</div>
                </div>
                
                {previewTemplate.variables.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Variables</label>
                    <div className="flex flex-wrap gap-2">
                      {previewTemplate.variables.map((variable) => (
                        <code
                          key={variable}
                          className="inline-flex items-center px-2 py-1 rounded text-sm font-mono bg-blue-50 text-blue-700 border border-blue-200"
                        >
                          {`{{${variable}}}`}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onUseTemplate?.(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationTemplates;
