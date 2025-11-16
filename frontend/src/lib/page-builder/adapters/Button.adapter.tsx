/**
 * Button Component Adapter
 *
 * Adapts the UI Button component for use in the page builder
 */

'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { createAdapter } from '../utils/createAdapter';
import { ComponentDefinition } from '../types/component.types';
import { AdapterConfig } from '../types/adapter.types';

/**
 * Button component definition for page builder
 */
export const ButtonDefinition: ComponentDefinition = {
  id: 'ui-button',
  name: 'Button',
  displayName: 'Button',
  description: 'Interactive button component with multiple variants and sizes',
  category: 'form',
  icon: 'MousePointer',
  tags: ['button', 'interactive', 'action', 'form', 'cta'],

  renderMode: 'client',
  componentPath: '@/lib/page-builder/adapters/Button',

  acceptsChildren: true,
  minChildren: 0,
  maxChildren: 1,

  props: [
    {
      name: 'variant',
      label: 'Variant',
      description: 'Button visual style variant',
      type: 'string',
      controlType: 'select',
      defaultValue: 'default',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'destructive', label: 'Destructive' },
        { value: 'outline', label: 'Outline' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'ghost', label: 'Ghost' },
        { value: 'link', label: 'Link' },
      ],
      group: 'appearance',
    },
    {
      name: 'size',
      label: 'Size',
      description: 'Button size',
      type: 'string',
      controlType: 'select',
      defaultValue: 'default',
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'default', label: 'Default' },
        { value: 'lg', label: 'Large' },
        { value: 'icon', label: 'Icon' },
        { value: 'icon-sm', label: 'Icon Small' },
        { value: 'icon-lg', label: 'Icon Large' },
      ],
      group: 'appearance',
    },
    {
      name: 'disabled',
      label: 'Disabled',
      description: 'Disable the button',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
    {
      name: 'loading',
      label: 'Loading',
      description: 'Show loading state',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
    {
      name: 'asChild',
      label: 'As Child',
      description: 'Render as a child component (for composition)',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'advanced',
    },
    {
      name: 'type',
      label: 'Type',
      description: 'Button HTML type',
      type: 'string',
      controlType: 'select',
      defaultValue: 'button',
      options: [
        { value: 'button', label: 'Button' },
        { value: 'submit', label: 'Submit' },
        { value: 'reset', label: 'Reset' },
      ],
      group: 'advanced',
    },
  ],

  defaultProps: {
    variant: 'default',
    size: 'default',
    disabled: false,
    loading: false,
    type: 'button',
  },

  styleOptions: {
    variants: [
      {
        name: 'variant',
        label: 'Style Variant',
        values: [
          { value: 'default', label: 'Default' },
          { value: 'destructive', label: 'Destructive' },
          { value: 'outline', label: 'Outline' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'ghost', label: 'Ghost' },
          { value: 'link', label: 'Link' },
        ],
      },
      {
        name: 'size',
        label: 'Size',
        values: [
          { value: 'sm', label: 'Small' },
          { value: 'default', label: 'Default' },
          { value: 'lg', label: 'Large' },
          { value: 'icon', label: 'Icon' },
        ],
      },
    ],
    supportsResponsive: false,
    supportsCustomCSS: true,
  },

  events: [
    {
      name: 'onClick',
      label: 'On Click',
      description: 'Triggered when button is clicked',
    },
    {
      name: 'onDoubleClick',
      label: 'On Double Click',
      description: 'Triggered when button is double-clicked',
    },
    {
      name: 'onMouseEnter',
      label: 'On Mouse Enter',
      description: 'Triggered when mouse enters button',
    },
    {
      name: 'onMouseLeave',
      label: 'On Mouse Leave',
      description: 'Triggered when mouse leaves button',
    },
  ],

  accessibility: {
    defaultAriaLabel: 'Button',
    keyboardNavigable: true,
    requiredAriaAttributes: [],
  },

  previewProps: {
    variant: 'default',
    size: 'default',
    children: 'Click me',
  },
};

/**
 * Adapter configuration for Button
 */
const buttonAdapterConfig: Partial<AdapterConfig<ButtonProps, any>> = {
  transformProps: (props, context) => {
    return {
      variant: props.variant,
      size: props.size,
      disabled: props.disabled,
      loading: props.loading,
      asChild: props.asChild,
      type: props.type,
    } as ButtonProps;
  },

  defaults: {
    variant: 'default',
    size: 'default',
    disabled: false,
    loading: false,
    type: 'button',
  },
};

/**
 * Button adapter
 */
export const ButtonAdapter = createAdapter<ButtonProps, any>(
  Button,
  ButtonDefinition,
  buttonAdapterConfig
);
