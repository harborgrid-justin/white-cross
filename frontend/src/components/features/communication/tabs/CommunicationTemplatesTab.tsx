'use client';

/**
 * WF-COMP-013 | CommunicationTemplatesTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'

/**
 * Template creation form data structure
 *
 * @interface TemplateFormData
 * @property {string} name - Template name for identification (e.g., "Appointment Reminder")
 * @property {string} subject - Email subject line template (can include variables)
 * @property {string} content - Message body template with variable placeholders (e.g., {studentName})
 * @property {string} type - Communication type: "EMAIL", "SMS", "PUSH_NOTIFICATION", or "VOICE"
 * @property {string} category - Message category for classification
 * @property {string} variables - Comma-separated list of template variable names
 */
interface TemplateFormData {
  name: string
  subject: string
  content: string
  type: string
  category: string
  variables: string
}

/**
 * Saved message template structure
 *
 * @interface Template
 * @property {string} id - Unique template identifier
 * @property {string} name - Template name
 * @property {string} subject - Email subject template
 * @property {string} content - Message body template
 * @property {string} type - Communication type
 * @property {string} category - Message category
 * @property {string[]} [variables] - Array of variable names used in template
 */
interface Template {
  id: string
  name: string
  subject: string
  content: string
  type: string
  category: string
  variables?: string[]
}

/**
 * Props for the CommunicationTemplatesTab component
 *
 * @interface CommunicationTemplatesTabProps
 * @property {Template[]} templates - Array of existing message templates
 * @property {TemplateFormData} formData - Current template creation form data
 * @property {function} onFormChange - Callback when form data changes
 * @property {function} onSubmit - Template creation submission handler
 * @property {function} onDeleteTemplate - Template deletion handler
 * @property {boolean} loading - Loading state during template operations
 */
interface CommunicationTemplatesTabProps {
  templates: Template[]
  formData: TemplateFormData
  onFormChange: (data: TemplateFormData) => void
  onSubmit: (e: React.FormEvent) => void
  onDeleteTemplate: (id: string) => void
  loading: boolean
}

/**
 * CommunicationTemplatesTab - Message template management interface
 *
 * Provides functionality to create, view, and manage reusable message templates.
 * Templates support variable substitution for personalized communications and can
 * be used across different communication channels and message categories.
 *
 * @param {CommunicationTemplatesTabProps} props - Component props
 * @returns {JSX.Element} Template management interface
 *
 * @example
 * ```tsx
 * <CommunicationTemplatesTab
 *   templates={existingTemplates}
 *   formData={templateFormData}
 *   onFormChange={handleFormChange}
 *   onSubmit={handleCreateTemplate}
 *   onDeleteTemplate={handleDeleteTemplate}
 *   loading={isProcessing}
 * />
 * ```
 *
 * @remarks
 * - Template variables use {variableName} syntax in content
 * - Subject field primarily used for email templates
 * - Variables field accepts comma-separated list (e.g., "studentName, date, time")
 * - Templates can be reused across multiple messages
 * - Communication types: EMAIL, SMS, PUSH_NOTIFICATION, VOICE
 * - Categories: GENERAL, EMERGENCY, HEALTH_UPDATE, APPOINTMENT_REMINDER,
 *   MEDICATION_REMINDER, INCIDENT_NOTIFICATION, COMPLIANCE
 *
 * @security
 * - Templates should not contain hardcoded PHI
 * - Variable substitution performed server-side with validation
 * - Template access controlled by user permissions
 * - Deleted templates cannot be recovered
 *
 * @compliance
 * - Template content must comply with HIPAA communication standards
 * - Audit logging for template creation and deletion
 * - Templates support compliant healthcare notification patterns
 *
 * @example Template with variables
 * ```
 * Name: "Appointment Reminder"
 * Subject: "Appointment Reminder for {studentName}"
 * Content: "Hello {guardianName}, this is a reminder that {studentName} has an appointment on {date} at {time}."
 * Variables: "studentName, guardianName, date, time"
 * ```
 */
export default function CommunicationTemplatesTab({
  templates,
  formData,
  onFormChange,
  onSubmit,
  onDeleteTemplate,
  loading
}: CommunicationTemplatesTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Message Templates</h2>

        <form onSubmit={onSubmit} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Create New Template</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Appointment Reminder"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => onFormChange({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="EMAIL">Email</option>
                <option value="SMS">SMS</option>
                <option value="PUSH_NOTIFICATION">Push Notification</option>
                <option value="VOICE">Voice</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => onFormChange({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="GENERAL">General</option>
                <option value="EMERGENCY">Emergency</option>
                <option value="HEALTH_UPDATE">Health Update</option>
                <option value="APPOINTMENT_REMINDER">Appointment Reminder</option>
                <option value="MEDICATION_REMINDER">Medication Reminder</option>
                <option value="INCIDENT_NOTIFICATION">Incident Notification</option>
                <option value="COMPLIANCE">Compliance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject (for emails)
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => onFormChange({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Template subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => onFormChange({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={4}
              placeholder="Template content. Use variables like {studentName}, {date}, etc."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Variables (comma-separated)
            </label>
            <input
              type="text"
              value={formData.variables}
              onChange={(e) => onFormChange({ ...formData, variables: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="studentName, date, time, ..."
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create Template'}
          </button>
        </form>

        <div className="space-y-3">
          {templates.map((template) => (
            <div key={template.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-500">
                      Type: {template.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      Category: {template.category}
                    </span>
                    {template.variables && template.variables.length > 0 && (
                      <span className="text-xs text-gray-500">
                        Variables: {template.variables.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDeleteTemplate(template.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
