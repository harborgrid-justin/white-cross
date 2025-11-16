/**
 * Card Component Adapter
 *
 * Adapts the UI Card compound component for use in the page builder
 */

'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { createAdapter } from '../utils/createAdapter';
import { ComponentDefinition } from '../types/component.types';
import { AdapterConfig } from '../types/adapter.types';

/**
 * Card root component definition
 */
export const CardDefinition: ComponentDefinition = {
  id: 'ui-card',
  name: 'Card',
  displayName: 'Card',
  description: 'Container component with header, content, and footer sections',
  category: 'data-display',
  icon: 'Square',
  tags: ['card', 'container', 'panel', 'box'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/adapters/Card',

  acceptsChildren: true,
  minChildren: 0,
  childrenTypes: ['ui-card-header', 'ui-card-content', 'ui-card-footer'],

  props: [],

  defaultProps: {},

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    defaultAriaLabel: 'Card',
    keyboardNavigable: false,
  },

  previewProps: {},
};

/**
 * Card Header component definition
 */
export const CardHeaderDefinition: ComponentDefinition = {
  id: 'ui-card-header',
  name: 'CardHeader',
  displayName: 'Card Header',
  description: 'Header section of a card',
  category: 'data-display',
  icon: 'Layout',
  tags: ['card', 'header'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/adapters/Card/Header',

  acceptsChildren: true,
  minChildren: 0,
  childrenTypes: ['ui-card-title', 'ui-card-description'],

  props: [],

  accessibility: {
    keyboardNavigable: false,
  },

  previewProps: {},
};

/**
 * Card Title component definition
 */
export const CardTitleDefinition: ComponentDefinition = {
  id: 'ui-card-title',
  name: 'CardTitle',
  displayName: 'Card Title',
  description: 'Title text for a card',
  category: 'data-display',
  icon: 'Type',
  tags: ['card', 'title', 'heading'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/adapters/Card/Title',

  acceptsChildren: true,
  minChildren: 0,
  maxChildren: 1,

  props: [],

  accessibility: {
    keyboardNavigable: false,
  },

  previewProps: {
    children: 'Card Title',
  },
};

/**
 * Card Description component definition
 */
export const CardDescriptionDefinition: ComponentDefinition = {
  id: 'ui-card-description',
  name: 'CardDescription',
  displayName: 'Card Description',
  description: 'Description text for a card',
  category: 'data-display',
  icon: 'AlignLeft',
  tags: ['card', 'description', 'text'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/adapters/Card/Description',

  acceptsChildren: true,
  minChildren: 0,
  maxChildren: 1,

  props: [],

  accessibility: {
    keyboardNavigable: false,
  },

  previewProps: {
    children: 'Card description text',
  },
};

/**
 * Card Content component definition
 */
export const CardContentDefinition: ComponentDefinition = {
  id: 'ui-card-content',
  name: 'CardContent',
  displayName: 'Card Content',
  description: 'Main content section of a card',
  category: 'data-display',
  icon: 'FileText',
  tags: ['card', 'content', 'body'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/adapters/Card/Content',

  acceptsChildren: true,
  minChildren: 0,

  props: [],

  accessibility: {
    keyboardNavigable: false,
  },

  previewProps: {},
};

/**
 * Card Footer component definition
 */
export const CardFooterDefinition: ComponentDefinition = {
  id: 'ui-card-footer',
  name: 'CardFooter',
  displayName: 'Card Footer',
  description: 'Footer section of a card',
  category: 'data-display',
  icon: 'LayoutGrid',
  tags: ['card', 'footer', 'actions'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/adapters/Card/Footer',

  acceptsChildren: true,
  minChildren: 0,

  props: [],

  accessibility: {
    keyboardNavigable: false,
  },

  previewProps: {},
};

/**
 * Adapter configuration (simple passthrough for Card components)
 */
const cardAdapterConfig: Partial<AdapterConfig<any, any>> = {
  transformProps: (props) => props,
  defaults: {},
};

/**
 * Card adapters
 */
export const CardAdapter = createAdapter(Card, CardDefinition, cardAdapterConfig);
export const CardHeaderAdapter = createAdapter(CardHeader, CardHeaderDefinition, cardAdapterConfig);
export const CardTitleAdapter = createAdapter(CardTitle, CardTitleDefinition, cardAdapterConfig);
export const CardDescriptionAdapter = createAdapter(
  CardDescription,
  CardDescriptionDefinition,
  cardAdapterConfig
);
export const CardContentAdapter = createAdapter(CardContent, CardContentDefinition, cardAdapterConfig);
export const CardFooterAdapter = createAdapter(CardFooter, CardFooterDefinition, cardAdapterConfig);

/**
 * All Card component definitions
 */
export const CardDefinitions = [
  CardDefinition,
  CardHeaderDefinition,
  CardTitleDefinition,
  CardDescriptionDefinition,
  CardContentDefinition,
  CardFooterDefinition,
];
