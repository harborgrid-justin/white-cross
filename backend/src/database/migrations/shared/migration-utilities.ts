/**
 * Shared Migration Utilities
 *
 * Common utilities to eliminate duplication between migration services
 */
import { DataTypes, Sequelize } from 'sequelize';

/**
 * Build complete table attributes with standard fields
 * @param attributes Custom table attributes
 * @param options Table options
 * @returns Complete attributes with ID, timestamps, and soft delete fields
 */
export function buildCompleteTableAttributes(
  attributes: Record<string, any>,
  options: { timestamps?: boolean; paranoid?: boolean } = {},
): Record<string, any> {
  const { timestamps = true, paranoid = false } = options;

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