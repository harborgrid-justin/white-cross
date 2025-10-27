'use client';

/**
 * WF-COMM-TEMPLATES-001 | CommunicationTemplatesTab.tsx - Message Templates Interface
 * Purpose: Create and manage reusable message templates
 * Upstream: Communications system | Dependencies: React, UI components
 * Downstream: Template management API | Called by: Communications page
 * Related: Message composition, broadcast messaging, HIPAA compliance
 * Exports: CommunicationTemplatesTab component | Key Features: Template CRUD, categories, variables
 * Last Updated: 2025-10-27 | File Type: .tsx
 * Critical Path: Create template → Save → Use in compose/broadcast
 * LLM Context: Template management system for White Cross healthcare platform
 */

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Select, SelectOption } from '@/components/ui/Select';
import { Card } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';
import { Modal } from '@/components/ui/overlays/Modal';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Message template definition
 */
interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  content: string;
  variables: string[];
  usage: number;
  lastUsed?: string;
  createdAt: string;
  createdBy: string;
  isPublic: boolean;
}

/**
 * Props for CommunicationTemplatesTab component
 */
interface CommunicationTemplatesTabProps {
  className?: string;
  onTemplateSelected?: (template: MessageTemplate) => void;
}

// Mock templates data
const mockTemplates: MessageTemplate[] = [
  {
    id: '1',
    name: 'Medication Administration Notification',
    category: 'medications',
    subject: 'Medication Administration Update',
    content: 'Your child, {{STUDENT_NAME}}, received their scheduled {{MEDICATION_NAME}} medication today at {{TIME}}. No adverse reactions observed. If you have any questions, please contact the school nurse at {{PHONE}}.',
    variables: ['STUDENT_NAME', 'MEDICATION_NAME', 'TIME', 'PHONE'],
    usage: 142,
    lastUsed: '2025-10-27T12:30:00',
    createdAt: '2025-09-01T08:00:00',
    createdBy: 'Nurse Sarah Johnson',
    isPublic: true,
  },
  {
    id: '2',
    name: 'Health Screening Reminder',
    category: 'health-screenings',
    subject: 'Upcoming Health Screening',
    content: 'Annual health screenings for {{GRADE}} will be conducted on {{DATE}}. Please ensure all required health forms are completed and submitted by {{DEADLINE}}. Contact the school nurse at {{PHONE}} with questions.',
    variables: ['GRADE', 'DATE', 'DEADLINE', 'PHONE'],
    usage: 28,
    lastUsed: '2025-10-26T09:00:00',
    createdAt: '2025-09-15T10:00:00',
    createdBy: 'Nurse Sarah Johnson',
    isPublic: true,
  },
  {
    id: '3',
    name: 'Permission Slip - Field Trip',
    category: 'permissions',
    subject: 'Field Trip Permission Slip Required',
    content: 'Your child\'s class will be taking a field trip to {{DESTINATION}} on {{DATE}}. Please complete and return the attached permission slip by {{DEADLINE}}. Contact {{TEACHER_NAME}} at {{EMAIL}} with questions.',
    variables: ['DESTINATION', 'DATE', 'DEADLINE', 'TEACHER_NAME', 'EMAIL'],
    usage: 15,
    lastUsed: '2025-10-20T14:00:00',
    createdAt: '2025-10-01T08:00:00',
    createdBy: 'Nurse Sarah Johnson',
    isPublic: true,
  },
  {
    id: '4',
    name: 'Immunization Record Request',
    category: 'immunizations',
    subject: 'Immunization Records Update Required',
    content: 'Our records show that {{STUDENT_NAME}}\'s immunization records need to be updated. Please provide updated immunization documentation by {{DEADLINE}}. Records can be submitted to the school nurse or emailed to {{EMAIL}}.',
    variables: ['STUDENT_NAME', 'DEADLINE', 'EMAIL'],
    usage: 34,
    lastUsed: '2025-10-25T11:00:00',
    createdAt: '2025-08-20T09:00:00',
    createdBy: 'Nurse Sarah Johnson',
    isPublic: true,
  },
  {
    id: '5',
    name: 'Allergy Alert Notification',
    category: 'allergies',
    subject: 'Important: Allergy Information Update',
    content: 'We have updated our records regarding {{STUDENT_NAME}}\'s allergies. Current allergies on file: {{ALLERGIES}}. Please review and confirm this information is accurate by contacting the school nurse at {{PHONE}}.',
    variables: ['STUDENT_NAME', 'ALLERGIES', 'PHONE'],
    usage: 56,
    lastUsed: '2025-10-24T15:00:00',
    createdAt: '2025-09-10T10:00:00',
    createdBy: 'Nurse Sarah Johnson',
    isPublic: true,
  },
  {
    id: '6',
    name: 'Health Alert - Contagious Illness',
    category: 'health-alerts',
    subject: 'Health Alert: {{ILLNESS_NAME}}',
    content: 'This is to inform you that cases of {{ILLNESS_NAME}} have been reported in {{LOCATION}}. Please monitor your child for symptoms including {{SYMPTOMS}}. If symptoms develop, keep your child home and contact your healthcare provider.',
    variables: ['ILLNESS_NAME', 'LOCATION', 'SYMPTOMS'],
    usage: 8,
    lastUsed: '2025-10-15T08:00:00',
    createdAt: '2025-09-05T09:00:00',
    createdBy: 'Nurse Sarah Johnson',
    isPublic: true,
  },
];

// Template categories
const templateCategories = [
  { value: 'all', label: 'All Categories' },
  { value: 'medications', label: 'Medications' },
  { value: 'health-screenings', label: 'Health Screenings' },
  { value: 'immunizations', label: 'Immunizations' },
  { value: 'allergies', label: 'Allergies' },
  { value: 'health-alerts', label: 'Health Alerts' },
  { value: 'permissions', label: 'Permission Slips' },
  { value: 'injuries', label: 'Injuries/Incidents' },
  { value: 'general', label: 'General Communication' },
];

/**
 * Communication Templates Tab Component
 *
 * Manages reusable message templates for common communication scenarios in the
 * school nursing environment. Provides template creation, editing, categorization,
 * and variable substitution.
 *
 * **Features:**
 * - Pre-defined healthcare templates
 * - Custom template creation
 * - Template categories
 * - Variable substitution ({{VARIABLE_NAME}})
 * - Template usage tracking
 * - Public/private templates
 * - Template search and filtering
 * - Template preview
 * - Quick template application
 *
 * **Template Categories:**
 * - Medications
 * - Health Screenings
 * - Immunizations
 * - Allergies
 * - Health Alerts
 * - Permission Slips
 * - Injuries/Incidents
 * - General Communication
 *
 * **Variables:**
 * Templates support dynamic variables that are replaced with actual values:
 * - {{STUDENT_NAME}} - Student's full name
 * - {{MEDICATION_NAME}} - Medication name
 * - {{TIME}} - Time value
 * - {{DATE}} - Date value
 * - {{PHONE}} - Phone number
 * - {{EMAIL}} - Email address
 * - Custom variables as needed
 *
 * @component
 * @param {CommunicationTemplatesTabProps} props - Component props
 * @returns {JSX.Element} Rendered templates management interface
 *
 * @example
 * ```tsx
 * <CommunicationTemplatesTab onTemplateSelected={handleTemplateSelect} />
 * ```
 */
export const CommunicationTemplatesTab: React.FC<CommunicationTemplatesTabProps> = ({
  className,
  onTemplateSelected,
}) => {
  const [templates, setTemplates] = useState<MessageTemplate[]>(mockTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // New template form state
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState('general');
  const [newTemplateSubject, setNewTemplateSubject] = useState('');
  const [newTemplateContent, setNewTemplateContent] = useState('');
  const [newTemplateIsPublic, setNewTemplateIsPublic] = useState(true);

  /**
   * Filters templates based on search and category
   */
  const filteredTemplates = templates.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  /**
   * Extracts variables from template content
   */
  const extractVariables = (content: string): string[] => {
    const regex = /\{\{([A-Z_]+)\}\}/g;
    const matches = content.matchAll(regex);
    const variables = new Set<string>();
    for (const match of matches) {
      variables.add(match[1]);
    }
    return Array.from(variables);
  };

  /**
   * Handles creating a new template
   */
  const handleCreateTemplate = () => {
    const variables = extractVariables(newTemplateContent);

    const newTemplate: MessageTemplate = {
      id: `${Date.now()}`,
      name: newTemplateName,
      category: newTemplateCategory,
      subject: newTemplateSubject,
      content: newTemplateContent,
      variables,
      usage: 0,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
      isPublic: newTemplateIsPublic,
    };

    setTemplates([...templates, newTemplate]);

    // Reset form
    setNewTemplateName('');
    setNewTemplateCategory('general');
    setNewTemplateSubject('');
    setNewTemplateContent('');
    setNewTemplateIsPublic(true);
    setIsCreateModalOpen(false);

    alert('Template created successfully!');
  };

  /**
   * Handles deleting a template
   */
  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== templateId));
      alert('Template deleted successfully!');
    }
  };

  /**
   * Handles using a template
   */
  const handleUseTemplate = (template: MessageTemplate) => {
    onTemplateSelected?.(template);
    alert(`Template "${template.name}" selected! You can now fill in the variables and send.`);
  };

  /**
   * Gets category label
   */
  const getCategoryLabel = (categoryValue: string): string => {
    return templateCategories.find(c => c.value === categoryValue)?.label || categoryValue;
  };

  /**
   * Formats date for display
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Message Templates</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create and manage reusable message templates
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Search Templates"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, subject, or content..."
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            iconPosition="left"
          />

          <Select
            label="Category"
            options={templateCategories}
            value={filterCategory}
            onChange={(value) => setFilterCategory(value as string)}
          />
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredTemplates.length} of {templates.length} templates
        </div>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4 text-gray-600 dark:text-gray-400">No templates found</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                {searchTerm || filterCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first template to get started'}
              </p>
            </Card>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <Card key={template.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {template.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {getCategoryLabel(template.category)}
                  </Badge>
                </div>
                {template.isPublic && (
                  <Badge variant="info" className="text-xs ml-2">
                    Public
                  </Badge>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Subject:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{template.subject}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Content Preview:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{template.content}</p>
                </div>

                {template.variables.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Variables:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((variable, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                        >
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-4">
                <span>Used {template.usage} times</span>
                {template.lastUsed && (
                  <span>Last: {formatDate(template.lastUsed)}</span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => handleUseTemplate(template)}
                >
                  Use Template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setIsPreviewModalOpen(true);
                  }}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setIsEditModalOpen(true);
                  }}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTemplate(template.id)}
                >
                  <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Template Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Template"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Template Name"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            placeholder="Enter template name..."
            required
          />

          <Select
            label="Category"
            options={templateCategories.filter(c => c.value !== 'all')}
            value={newTemplateCategory}
            onChange={(value) => setNewTemplateCategory(value as string)}
            required
          />

          <Input
            label="Subject"
            value={newTemplateSubject}
            onChange={(e) => setNewTemplateSubject(e.target.value)}
            placeholder="Enter message subject..."
            required
          />

          <Textarea
            label="Template Content"
            value={newTemplateContent}
            onChange={(e) => setNewTemplateContent(e.target.value)}
            placeholder="Enter template content. Use {{VARIABLE_NAME}} for dynamic values..."
            required
            autoResize
            minRows={8}
            maxRows={15}
            helperText="Use {{VARIABLE_NAME}} syntax for dynamic values (e.g., {{STUDENT_NAME}}, {{DATE}})"
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="template-public"
              checked={newTemplateIsPublic}
              onChange={(e) => setNewTemplateIsPublic(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="template-public" className="text-sm text-gray-700 dark:text-gray-300">
              Make this template available to all staff
            </label>
          </div>

          {newTemplateContent && extractVariables(newTemplateContent).length > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Detected Variables:
              </p>
              <div className="flex flex-wrap gap-2">
                {extractVariables(newTemplateContent).map((variable, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                  >
                    {variable}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateTemplate}
              disabled={!newTemplateName || !newTemplateSubject || !newTemplateContent}
            >
              Create Template
            </Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      {selectedTemplate && (
        <Modal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          title={selectedTemplate.name}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <Badge variant="secondary">{getCategoryLabel(selectedTemplate.category)}</Badge>
              {selectedTemplate.isPublic && (
                <Badge variant="info" className="ml-2">Public</Badge>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject:</p>
              <p className="text-base text-gray-900 dark:text-white">{selectedTemplate.subject}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Content:</p>
              <p className="text-base text-gray-900 dark:text-white whitespace-pre-wrap">
                {selectedTemplate.content}
              </p>
            </div>

            {selectedTemplate.variables.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Variables:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((variable, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                    >
                      {variable}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-medium">Created by:</span> {selectedTemplate.createdBy}
                </div>
                <div>
                  <span className="font-medium">Created:</span> {formatDate(selectedTemplate.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Usage count:</span> {selectedTemplate.usage}
                </div>
                {selectedTemplate.lastUsed && (
                  <div>
                    <span className="font-medium">Last used:</span> {formatDate(selectedTemplate.lastUsed)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleUseTemplate(selectedTemplate);
                  setIsPreviewModalOpen(false);
                }}
              >
                Use This Template
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CommunicationTemplatesTab;
