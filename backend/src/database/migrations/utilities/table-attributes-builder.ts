/**
 * Shared Table Attributes Builder Utility
 * 
 * Consolidated logic for building Sequelize table attributes with
 * standardized ID, timestamps, and soft delete configurations.
 */
import { DataTypes, Sequelize } from 'sequelize';

export interface TableAttributesOptions {
  timestamps?: boolean;
  paranoid?: boolean;
}

/**
 * Build complete table attributes with standard defaults
 */
export function buildTableAttributes(
  attributes: Record<string, any>, 
  options: TableAttributesOptions = {}
): Record<string, any> {
  const { timestamps = true, paranoid = false } = options;
  
  // Build complete attribute definition with defaults
  const completeAttributes: Record<string, any> = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    ...attributes,
  };

  // Add timestamp fields if enabled
  if (timestamps) {
    completeAttributes.createdAt = {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    };
    completeAttributes.updatedAt = {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    };
  }

  // Add soft delete field if paranoid
  if (paranoid) {
    completeAttributes.deletedAt = {
      type: DataTypes.DATE,
      allowNull: true,
    };
  }

  return completeAttributes;
}