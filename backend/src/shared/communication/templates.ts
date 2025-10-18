/**
 * LOC: 1FB575E487
 * WC-GEN-303 | templates.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-303 | templates.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: None
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces, functions | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Message template and communication utilities
 * 
 * Provides utilities for message template processing, variable substitution,
 * and communication cost calculation.
 */

export interface MessageVariable {
  key: string;
  value: string;
  required?: boolean;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  channel: 'SMS' | 'EMAIL' | 'PUSH';
}

export interface MessageCostCalculation {
  estimatedCost: number;
  currency: string;
  breakdown: {
    baseCost: number;
    lengthMultiplier: number;
    channelMultiplier: number;
  };
}

/**
 * Build message content from template with variable substitution
 * 
 * @param template - Message template string with {{variable}} placeholders
 * @param variables - Record of variable names to values
 * @returns Processed message string with variables substituted
 */
export function buildMessageTemplate(template: string, variables: Record<string, any>): string {
  if (!template || typeof template !== 'string') {
    return '';
  }

  let processedMessage = template;

  // Replace all {{variable}} placeholders
  const variableRegex = /\{\{([^}]+)\}\}/g;
  
  processedMessage = processedMessage.replace(variableRegex, (match, variableName) => {
    const trimmedName = variableName.trim();
    
    // Check if variable exists
    if (variables.hasOwnProperty(trimmedName)) {
      const value = variables[trimmedName];
      
      // Handle different value types
      if (value === null || value === undefined) {
        return '';
      } else if (typeof value === 'object') {
        return JSON.stringify(value);
      } else {
        return String(value);
      }
    }
    
    // Return placeholder if variable not found (for debugging)
    return `{{${trimmedName}}}`;
  });

  // Handle conditional sections [if:variable]content[/if]
  const conditionalRegex = /\[if:([^\]]+)\](.*?)\[\/if\]/g;
  
  processedMessage = processedMessage.replace(conditionalRegex, (match, condition, content) => {
    const trimmedCondition = condition.trim();
    
    // Check if condition variable exists and is truthy
    if (variables.hasOwnProperty(trimmedCondition) && variables[trimmedCondition]) {
      return content;
    }
    
    return '';
  });

  // Handle date formatting [date:variable:format]
  const dateRegex = /\[date:([^:]+):([^\]]+)\]/g;
  
  processedMessage = processedMessage.replace(dateRegex, (match, variableName, format) => {
    const trimmedName = variableName.trim();
    
    if (variables.hasOwnProperty(trimmedName)) {
      const dateValue = variables[trimmedName];
      const date = new Date(dateValue);
      
      if (!isNaN(date.getTime())) {
        return formatDate(date, format);
      }
    }
    
    return match; // Return original if can't format
  });

  return processedMessage.trim();
}

/**
 * Extract variables from a template string
 * 
 * @param template - Template string to analyze
 * @returns Array of variable names found in the template
 */
export function extractTemplateVariables(template: string): string[] {
  if (!template || typeof template !== 'string') {
    return [];
  }

  const variables: string[] = [];
  const variableRegex = /\{\{([^}]+)\}\}/g;
  
  let match;
  while ((match = variableRegex.exec(template)) !== null) {
    const variableName = match[1].trim();
    if (!variables.includes(variableName)) {
      variables.push(variableName);
    }
  }

  // Also extract conditional variables
  const conditionalRegex = /\[if:([^\]]+)\]/g;
  while ((match = conditionalRegex.exec(template)) !== null) {
    const variableName = match[1].trim();
    if (!variables.includes(variableName)) {
      variables.push(variableName);
    }
  }

  // Extract date variables
  const dateRegex = /\[date:([^:]+):/g;
  while ((match = dateRegex.exec(template)) !== null) {
    const variableName = match[1].trim();
    if (!variables.includes(variableName)) {
      variables.push(variableName);
    }
  }

  return variables;
}

/**
 * Calculate estimated cost for sending message
 * 
 * @param message - Message content
 * @param channel - Communication channel (SMS, EMAIL, PUSH)
 * @returns Cost calculation object
 */
export function calculateMessageCost(message: string, channel: 'SMS' | 'EMAIL' | 'PUSH'): MessageCostCalculation {
  const baseCosts = {
    SMS: 0.0075, // $0.0075 per SMS
    EMAIL: 0.0001, // $0.0001 per email
    PUSH: 0.0001  // $0.0001 per push notification
  };

  const lengthMultipliers = {
    SMS: (length: number) => Math.ceil(length / 160), // SMS segments
    EMAIL: () => 1, // Fixed cost per email
    PUSH: () => 1   // Fixed cost per push
  };

  const baseCost = baseCosts[channel] || 0;
  const messageLength = message ? message.length : 0;
  const lengthMultiplier = lengthMultipliers[channel](messageLength);
  const channelMultiplier = 1; // Could be used for premium channels

  const estimatedCost = baseCost * lengthMultiplier * channelMultiplier;

  return {
    estimatedCost: Math.round(estimatedCost * 10000) / 10000, // Round to 4 decimal places
    currency: 'USD',
    breakdown: {
      baseCost,
      lengthMultiplier,
      channelMultiplier
    }
  };
}

/**
 * Validate template variables are provided
 * 
 * @param template - Message template
 * @param variables - Provided variables
 * @returns Validation result with missing variables
 */
export function validateTemplateVariables(
  template: string, 
  variables: Record<string, any>
): { isValid: boolean; missingVariables: string[] } {
  const requiredVariables = extractTemplateVariables(template);
  const missingVariables = requiredVariables.filter(
    variable => !variables.hasOwnProperty(variable) || 
                variables[variable] === null || 
                variables[variable] === undefined
  );

  return {
    isValid: missingVariables.length === 0,
    missingVariables
  };
}

/**
 * Sanitize message content for safe transmission
 * 
 * @param message - Message content to sanitize
 * @param channel - Communication channel
 * @returns Sanitized message content
 */
export function sanitizeMessageContent(message: string, channel: 'SMS' | 'EMAIL' | 'PUSH'): string {
  if (!message || typeof message !== 'string') {
    return '';
  }

  let sanitized = message;

  // Remove potentially harmful content
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers

  // Channel-specific sanitization
  switch (channel) {
    case 'SMS':
      // Remove HTML tags for SMS
      sanitized = sanitized.replace(/<[^>]*>/g, '');
      // Limit length
      if (sanitized.length > 1600) {
        sanitized = sanitized.substring(0, 1597) + '...';
      }
      break;
    
    case 'EMAIL':
      // Allow basic HTML tags for email
      const allowedTags = /<\/?(?:b|i|u|strong|em|br|p|a|h[1-6]|ul|ol|li|blockquote)\b[^>]*>/gi;
      sanitized = sanitized.replace(/<(?!\/?(?:b|i|u|strong|em|br|p|a|h[1-6]|ul|ol|li|blockquote)\b)[^>]*>/gi, '');
      break;
    
    case 'PUSH':
      // Remove HTML tags for push notifications
      sanitized = sanitized.replace(/<[^>]*>/g, '');
      // Limit length for push notifications
      if (sanitized.length > 200) {
        sanitized = sanitized.substring(0, 197) + '...';
      }
      break;
  }

  return sanitized.trim();
}

/**
 * Helper function to format dates in templates
 * 
 * @param date - Date to format
 * @param format - Format string (YYYY-MM-DD, MM/DD/YYYY, etc.)
 * @returns Formatted date string
 */
function formatDate(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes);
}