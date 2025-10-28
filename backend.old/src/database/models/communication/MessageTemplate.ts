/**
 * LOC: B3D3A3F376
 * WC-GEN-045 | MessageTemplate.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 */

/**
 * WC-GEN-045 | MessageTemplate.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../config/sequelize, ../../types/enums | Dependencies: sequelize, ../../config/sequelize, ../../types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { MessageType, MessageCategory } from '../../types/enums';

/**
 * MessageTemplate Model
 * Stores reusable message templates for various communication scenarios
 * Used for standardizing communications with parents, guardians, and staff
 */

interface MessageTemplateAttributes {
  id: string;
  name: string;
  subject?: string;
  content: string;
  type: MessageType;
  category: MessageCategory;
  variables: string[];
  isActive: boolean;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MessageTemplateCreationAttributes
  extends Optional<MessageTemplateAttributes, 'id' | 'subject' | 'variables' | 'isActive' | 'createdAt' | 'updatedAt'> {}

export class MessageTemplate
  extends Model<MessageTemplateAttributes, MessageTemplateCreationAttributes>
  implements MessageTemplateAttributes
{
  public id!: string;
  public name!: string;
  public subject?: string;
  public content!: string;
  public type!: MessageType;
  public category!: MessageCategory;
  public variables!: string[];
  public isActive!: boolean;
  public createdById!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MessageTemplate.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Template name is required',
        },
        len: {
          args: [3, 100],
          msg: 'Template name must be between 3 and 100 characters',
        },
      },
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: 'Subject cannot exceed 255 characters',
        },
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Template content is required',
        },
        len: {
          args: [1, 50000],
          msg: 'Content must be between 1 and 50000 characters',
        },
        validTemplateVariables(value: string) {
          // Extract template variables using {{variableName}} pattern
          const variablePattern = /\{\{([a-zA-Z0-9_]+)\}\}/g;
          const matches = value.matchAll(variablePattern);
          const variables = Array.from(matches, m => m[1]);

          // Check for duplicate variables (performance warning)
          const uniqueVars = new Set(variables);
          if (variables.length !== uniqueVars.size) {
            console.warn('Template contains duplicate variable references');
          }

          // Validate variable naming convention
          for (const variable of uniqueVars) {
            if (variable.length > 50) {
              throw new Error(`Template variable name too long: ${variable.substring(0, 30)}... (max 50 characters)`);
            }
            if (!/^[a-zA-Z0-9_]+$/.test(variable)) {
              throw new Error(`Invalid template variable name: ${variable}. Use only letters, numbers, and underscores`);
            }
          }

          // Check for malformed variable syntax
          const malformedPattern = /\{[^{]|[^}]\}/g;
          if (malformedPattern.test(value)) {
            throw new Error('Template contains malformed variable syntax. Use {{variableName}} format');
          }
        },
        noSensitiveData(value: string) {
          // Check for hardcoded SSN patterns
          const ssnPattern = /\b\d{3}-?\d{2}-?\d{4}\b/g;
          if (ssnPattern.test(value)) {
            throw new Error('HIPAA Violation: Templates must not contain hardcoded Social Security Numbers. Use variables instead.');
          }

          // Check for credit card patterns
          const ccPattern = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
          if (ccPattern.test(value)) {
            throw new Error('PCI Violation: Templates must not contain hardcoded credit card numbers');
          }
        },
      },
    },
    type: {
      type: DataTypes.ENUM(...Object.values(MessageType)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(MessageType)],
          msg: 'Invalid message type',
        },
        smsLengthCheck(this: MessageTemplate, value: MessageType) {
          if (value === MessageType.SMS && this.content) {
            const contentLength = this.content.length;
            if (contentLength > 1600) {
              throw new Error(`SMS template content exceeds maximum length of 1600 characters (current: ${contentLength})`);
            }
            if (contentLength > 160) {
              console.warn(`SMS template will be sent as ${Math.ceil(contentLength / 160)} parts`);
            }
          }
        },
        emailSubjectCheck(this: MessageTemplate, value: MessageType) {
          if (value === MessageType.EMAIL && this.subject && this.subject.length > 78) {
            console.warn(`Email subject exceeds recommended 78 characters (current: ${this.subject.length}) and may be truncated`);
          }
        },
      },
    },
    category: {
      type: DataTypes.ENUM(...Object.values(MessageCategory)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(MessageCategory)],
          msg: 'Invalid message category',
        },
        emergencyTemplateWarning(value: MessageCategory) {
          if (value === MessageCategory.EMERGENCY) {
            console.warn('Emergency category templates should be used with URGENT priority when sending messages');
          }
        },
      },
    },
    variables: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      validate: {
        validateVariablesArray(value: string[]) {
          if (!Array.isArray(value)) {
            throw new Error('Variables must be an array');
          }
          if (value.length > 50) {
            throw new Error('Cannot exceed 50 template variables');
          }
          // Validate variable name format
          for (const variable of value) {
            if (!/^[a-zA-Z0-9_]+$/.test(variable)) {
              throw new Error(`Invalid variable name: ${variable}. Must contain only letters, numbers, and underscores`);
            }
            if (variable.length > 50) {
              throw new Error(`Variable name too long: ${variable}. Maximum 50 characters`);
            }
          }
        },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdById: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Creator ID is required',
        },
        isUUID: {
          args: 4,
          msg: 'Creator ID must be a valid UUID',
        },
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'message_templates',
    timestamps: true,
    indexes: [
      { fields: ['createdById'] },
      { fields: ['type'] },
      { fields: ['category'] },
      { fields: ['isActive'] },
    ],
  }
);
