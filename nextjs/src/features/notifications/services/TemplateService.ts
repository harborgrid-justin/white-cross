import { NotificationType, NotificationPriority } from '../types/notification';

/**
 * Notification Template
 */
export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  priority: NotificationPriority;
  titleTemplate: string;
  messageTemplate: string;
  variables: string[];
  metadata?: Record<string, any>;
}

/**
 * Template Variables
 */
export type TemplateVariables = Record<string, any>;

/**
 * TemplateService
 *
 * Manages notification templates and renders them with variables
 */
export class TemplateService {
  private baseUrl: string;
  private templates: Map<string, NotificationTemplate> = new Map();

  constructor(baseUrl: string = '/api/v1/notifications/templates') {
    this.baseUrl = baseUrl;
    this.initializeDefaultTemplates();
  }

  /**
   * Initialize default templates for common notifications
   */
  private initializeDefaultTemplates(): void {
    const defaults: NotificationTemplate[] = [
      {
        id: 'medication-reminder',
        name: 'Medication Reminder',
        type: NotificationType.MEDICATION_REMINDER,
        priority: NotificationPriority.HIGH,
        titleTemplate: 'Medication Due: {{medicationName}}',
        messageTemplate:
          'It\'s time to administer {{medicationName}} ({{dosage}}) to {{studentName}}.',
        variables: ['medicationName', 'dosage', 'studentName'],
      },
      {
        id: 'appointment-reminder',
        name: 'Appointment Reminder',
        type: NotificationType.APPOINTMENT_REMINDER,
        priority: NotificationPriority.MEDIUM,
        titleTemplate: 'Upcoming Appointment',
        messageTemplate:
          'Reminder: {{studentName}} has an appointment on {{appointmentDate}} at {{appointmentTime}}.',
        variables: ['studentName', 'appointmentDate', 'appointmentTime'],
      },
      {
        id: 'immunization-due',
        name: 'Immunization Due',
        type: NotificationType.IMMUNIZATION_DUE,
        priority: NotificationPriority.MEDIUM,
        titleTemplate: 'Immunization Due',
        messageTemplate:
          '{{studentName}} is due for {{immunizationType}} immunization by {{dueDate}}.',
        variables: ['studentName', 'immunizationType', 'dueDate'],
      },
      {
        id: 'incident-follow-up',
        name: 'Incident Follow-up',
        type: NotificationType.INCIDENT_FOLLOW_UP,
        priority: NotificationPriority.HIGH,
        titleTemplate: 'Incident Follow-up Required',
        messageTemplate:
          'Follow-up required for incident #{{incidentNumber}} involving {{studentName}}.',
        variables: ['incidentNumber', 'studentName'],
      },
      {
        id: 'document-expiring',
        name: 'Document Expiring',
        type: NotificationType.DOCUMENT_EXPIRING,
        priority: NotificationPriority.MEDIUM,
        titleTemplate: 'Document Expiring Soon',
        messageTemplate:
          '{{documentType}} for {{studentName}} expires on {{expirationDate}}.',
        variables: ['documentType', 'studentName', 'expirationDate'],
      },
      {
        id: 'emergency-alert',
        name: 'Emergency Alert',
        type: NotificationType.EMERGENCY_ALERT,
        priority: NotificationPriority.EMERGENCY,
        titleTemplate: 'EMERGENCY: {{title}}',
        messageTemplate: '{{message}}',
        variables: ['title', 'message'],
      },
    ];

    defaults.forEach((template) => {
      this.templates.set(template.id, template);
    });
  }

  /**
   * Get all templates
   */
  async getAllTemplates(): Promise<NotificationTemplate[]> {
    try {
      const response = await fetch(this.baseUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.statusText}`);
      }

      const serverTemplates = await response.json();

      // Merge with default templates
      serverTemplates.forEach((template: NotificationTemplate) => {
        this.templates.set(template.id, template);
      });
    } catch (error) {
      console.error('Failed to fetch templates from server:', error);
    }

    return Array.from(this.templates.values());
  }

  /**
   * Get template by ID
   */
  async getTemplate(id: string): Promise<NotificationTemplate | null> {
    // Check local cache first
    if (this.templates.has(id)) {
      return this.templates.get(id)!;
    }

    try {
      const response = await fetch(`${this.baseUrl}/${id}`);

      if (!response.ok) {
        return null;
      }

      const template = await response.json();
      this.templates.set(id, template);
      return template;
    } catch (error) {
      console.error(`Failed to fetch template ${id}:`, error);
      return null;
    }
  }

  /**
   * Create a new template
   */
  async createTemplate(
    template: Omit<NotificationTemplate, 'id'>
  ): Promise<NotificationTemplate> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      throw new Error(`Failed to create template: ${response.statusText}`);
    }

    const created = await response.json();
    this.templates.set(created.id, created);
    return created;
  }

  /**
   * Update a template
   */
  async updateTemplate(
    id: string,
    updates: Partial<NotificationTemplate>
  ): Promise<NotificationTemplate> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update template: ${response.statusText}`);
    }

    const updated = await response.json();
    this.templates.set(id, updated);
    return updated;
  }

  /**
   * Delete a template
   */
  async deleteTemplate(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete template: ${response.statusText}`);
    }

    this.templates.delete(id);
  }

  /**
   * Render template with variables
   */
  render(template: NotificationTemplate, variables: TemplateVariables): {
    title: string;
    message: string;
  } {
    const title = this.renderString(template.titleTemplate, variables);
    const message = this.renderString(template.messageTemplate, variables);

    return { title, message };
  }

  /**
   * Render a template string with variables
   */
  private renderString(template: string, variables: TemplateVariables): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key]?.toString() || match;
    });
  }

  /**
   * Validate template variables
   */
  validateVariables(
    template: NotificationTemplate,
    variables: TemplateVariables
  ): { valid: boolean; missing: string[] } {
    const missing = template.variables.filter((v) => !(v in variables));

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  /**
   * Get templates by type
   */
  getTemplatesByType(type: NotificationType): NotificationTemplate[] {
    return Array.from(this.templates.values()).filter((t) => t.type === type);
  }
}

// Singleton instance
export const templateService = new TemplateService();
