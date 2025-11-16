/**
 * UI Components Definitions
 *
 * Component definitions for UI components adapted from the components/ui directory
 */

import { ComponentDefinition } from '../types/component.types';
import { ButtonDefinition } from '../adapters/Button.adapter';
import { BadgeDefinition } from '../adapters/Badge.adapter';
import { CardDefinitions } from '../adapters/Card.adapter';
import { AlertDefinitions } from '../adapters/Alert.adapter';
import { SeparatorDefinition } from '../adapters/Separator.adapter';

/**
 * All UI component definitions
 */
export const UIComponentDefinitions: ComponentDefinition[] = [
  // Interactive components
  ButtonDefinition,

  // Status indicators
  BadgeDefinition,

  // Compound components - Card
  ...CardDefinitions,

  // Compound components - Alert
  ...AlertDefinitions,

  // Layout components
  SeparatorDefinition,
];

/**
 * Export individual definitions for direct access
 */
export {
  ButtonDefinition,
  BadgeDefinition,
  SeparatorDefinition,
};

export {
  CardDefinition,
  CardHeaderDefinition,
  CardTitleDefinition,
  CardDescriptionDefinition,
  CardContentDefinition,
  CardFooterDefinition,
} from '../adapters/Card.adapter';

export {
  AlertDefinition,
  AlertTitleDefinition,
  AlertDescriptionDefinition,
} from '../adapters/Alert.adapter';
