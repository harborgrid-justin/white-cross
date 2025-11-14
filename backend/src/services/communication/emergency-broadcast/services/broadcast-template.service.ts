/**
 * @fileoverview Emergency Broadcast Template Service
 * @module emergency-broadcast/services
 * @description Handles emergency broadcast templates and message formatting
 */

import { Injectable, Logger } from '@nestjs/common';
import { EmergencyType } from '../emergency-broadcast.enums';
import { EmergencyTemplateDto } from '../dto';

import { BaseService } from '@/common/base';
@Injectable()
export class BroadcastTemplateService extends BaseService {
  constructor() {
    super('BroadcastTemplateService');
  }

  /**
   * Get emergency broadcast templates
   */
  getTemplates(): Record<EmergencyType, EmergencyTemplateDto> {
    return {
      [EmergencyType.ACTIVE_THREAT]: {
        title: '🚨 EMERGENCY: Secure All Areas',
        message:
          'LOCKDOWN IN EFFECT. Secure all doors and windows. Follow established lockdown procedures. Wait for all-clear from administration.',
      },
      [EmergencyType.FIRE]: {
        title: '🔥 FIRE ALARM: Evacuate Immediately',
        message:
          'Fire alarm activated. Evacuate building immediately using nearest safe exit. Proceed to designated assembly area. Take attendance.',
      },
      [EmergencyType.MEDICAL_EMERGENCY]: {
        title: '⚕️ MEDICAL EMERGENCY',
        message:
          'Medical emergency in progress. Emergency services have been contacted. Clear hallways and remain calm.',
      },
      [EmergencyType.WEATHER_ALERT]: {
        title: '⛈️ SEVERE WEATHER ALERT',
        message:
          'Severe weather warning in effect. Move to interior rooms away from windows. Shelter in place until all-clear.',
      },
      [EmergencyType.LOCKDOWN]: {
        title: '🔒 LOCKDOWN IN EFFECT',
        message:
          'Precautionary lockdown in effect. Secure all doors. Classes continue normally. No one enters or exits building.',
      },
      [EmergencyType.EVACUATION]: {
        title: '⚠️ BUILDING EVACUATION',
        message:
          'Evacuate building immediately. Proceed calmly to designated assembly area. Teachers take attendance.',
      },
      [EmergencyType.EARLY_DISMISSAL]: {
        title: 'Early Dismissal',
        message:
          'School will dismiss early today. Please arrange pickup or transportation accordingly.',
      },
      [EmergencyType.SCHOOL_CLOSURE]: {
        title: 'School Closure',
        message: 'School will be closed. All activities cancelled. Watch for updates.',
      },
      [EmergencyType.NATURAL_DISASTER]: {
        title: '🌪️ NATURAL DISASTER ALERT',
        message:
          'Natural disaster alert. Follow emergency procedures immediately. Seek shelter. Emergency services notified.',
      },
      [EmergencyType.SHELTER_IN_PLACE]: {
        title: '🏠 SHELTER IN PLACE',
        message:
          'Shelter in place order in effect. Stay indoors. Seal windows and doors. Turn off ventilation. Await further instructions.',
      },
      [EmergencyType.TRANSPORTATION]: {
        title: '🚌 Transportation Alert',
        message:
          'Transportation disruption. Delays expected. Alternative arrangements may be needed.',
      },
      [EmergencyType.FACILITY_ISSUE]: {
        title: '🔧 Facility Issue',
        message:
          'Facility issue affecting building operations. Updates will be provided as situation develops.',
      },
      [EmergencyType.GENERAL_ANNOUNCEMENT]: {
        title: 'Important Announcement',
        message: 'Important school announcement. Please read carefully.',
      },
    };
  }

  /**
   * Get template for specific emergency type
   */
  getTemplate(type: EmergencyType): EmergencyTemplateDto {
    const templates = this.getTemplates();
    return templates[type] || templates[EmergencyType.GENERAL_ANNOUNCEMENT];
  }

  /**
   * Get available emergency types
   */
  getEmergencyTypes(): EmergencyType[] {
    return Object.values(EmergencyType);
  }

  /**
   * Validate emergency type
   */
  isValidEmergencyType(type: string): type is EmergencyType {
    return Object.values(EmergencyType).includes(type as EmergencyType);
  }

  /**
   * Create custom message from template with variable substitution
   */
  customizeTemplate(
    type: EmergencyType,
    variables: Record<string, string> = {},
  ): EmergencyTemplateDto {
    const template = this.getTemplate(type);

    // Replace variables in title and message
    let customTitle = template.title;
    let customMessage = template.message;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      customTitle = customTitle.replace(new RegExp(placeholder, 'g'), value);
      customMessage = customMessage.replace(new RegExp(placeholder, 'g'), value);
    }

    return {
      title: customTitle,
      message: customMessage,
    };
  }

  /**
   * Get template variables for a specific emergency type
   */
  getTemplateVariables(type: EmergencyType): string[] {
    const template = this.getTemplate(type);
    const variables: string[] = [];

    // Extract variables from title and message
    const titleMatches = template.title.match(/\{\{(\w+)\}\}/g) || [];
    const messageMatches = template.message.match(/\{\{(\w+)\}\}/g) || [];

    const allMatches = [...titleMatches, ...messageMatches];
    for (const match of allMatches) {
      const variable = match.replace(/\{\{|\}\}/g, '');
      if (!variables.includes(variable)) {
        variables.push(variable);
      }
    }

    return variables;
  }

  /**
   * Validate template content
   */
  validateTemplate(template: EmergencyTemplateDto): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check title
    if (!template.title || template.title.trim().length === 0) {
      errors.push('Title is required');
    } else if (template.title.length > 100) {
      errors.push('Title must be 100 characters or less');
    }

    // Check message
    if (!template.message || template.message.trim().length === 0) {
      errors.push('Message is required');
    } else if (template.message.length > 1000) {
      errors.push('Message must be 1000 characters or less');
    }

    // Check for potentially dangerous content
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i, // Event handlers like onclick=
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ];

    const content = `${template.title} ${template.message}`;
    for (const pattern of dangerousPatterns) {
      if (pattern.test(content)) {
        errors.push('Template contains potentially unsafe content');
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get recommended templates based on time of day and other factors
   */
  getRecommendedTemplates(context: {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    dayOfWeek: 'weekday' | 'weekend';
    season: 'spring' | 'summer' | 'fall' | 'winter';
  }): EmergencyType[] {
    // During school hours, prioritize academic-related emergencies
    if (context.timeOfDay === 'morning' || context.timeOfDay === 'afternoon') {
      if (context.dayOfWeek === 'weekday') {
        return [
          EmergencyType.FIRE,
          EmergencyType.LOCKDOWN,
          EmergencyType.EVACUATION,
          EmergencyType.MEDICAL_EMERGENCY,
          EmergencyType.WEATHER_ALERT,
        ];
      }
    }

    // Evening/night - focus on security and weather
    if (context.timeOfDay === 'evening' || context.timeOfDay === 'night') {
      return [
        EmergencyType.WEATHER_ALERT,
        EmergencyType.SCHOOL_CLOSURE,
        EmergencyType.TRANSPORTATION,
        EmergencyType.FACILITY_ISSUE,
      ];
    }

    // Winter season - prioritize weather-related
    if (context.season === 'winter') {
      return [
        EmergencyType.WEATHER_ALERT,
        EmergencyType.SCHOOL_CLOSURE,
        EmergencyType.EARLY_DISMISSAL,
        EmergencyType.TRANSPORTATION,
      ];
    }

    // Default recommendations
    return [
      EmergencyType.GENERAL_ANNOUNCEMENT,
      EmergencyType.WEATHER_ALERT,
      EmergencyType.TRANSPORTATION,
      EmergencyType.SCHOOL_CLOSURE,
    ];
  }
}
