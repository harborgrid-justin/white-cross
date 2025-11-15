/**
 * Component Registry - Sample Component Definitions
 *
 * This file contains sample component definitions for the palette library.
 * Each component definition includes metadata, default properties, and schema
 * for the property editor.
 */

import {
  ComponentDefinition,
  ComponentCategory,
  RenderMode,
  PropertyType,
  PropertyControlType,
} from '../../types';

/**
 * Sample component registry for demo purposes
 * In production, this would be loaded from a database or configuration file
 */
export const componentRegistry: ComponentDefinition[] = [
  // ============================================================================
  // LAYOUT COMPONENTS
  // ============================================================================
  {
    id: 'container',
    name: 'Container',
    description: 'A flexible container component with customizable padding and max-width',
    category: ComponentCategory.Layout,
    icon: 'Box',
    renderMode: RenderMode.Server,
    defaultProps: {
      maxWidth: '1200px',
      padding: '1rem',
      centered: true,
    },
    propertySchema: [
      {
        id: 'maxWidth',
        label: 'Max Width',
        type: PropertyType.String,
        control: PropertyControlType.Select,
        defaultValue: '1200px',
        options: [
          { label: 'Small (640px)', value: '640px' },
          { label: 'Medium (768px)', value: '768px' },
          { label: 'Large (1024px)', value: '1024px' },
          { label: 'X-Large (1280px)', value: '1280px' },
          { label: 'Full', value: '100%' },
        ],
      },
      {
        id: 'padding',
        label: 'Padding',
        type: PropertyType.Spacing,
        control: PropertyControlType.SpacingEditor,
        defaultValue: '1rem',
      },
      {
        id: 'centered',
        label: 'Centered',
        type: PropertyType.Boolean,
        control: PropertyControlType.Toggle,
        defaultValue: true,
      },
    ],
    isContainer: true,
    isDraggable: true,
    isResizable: false,
    isLocked: false,
  },

  {
    id: 'section',
    name: 'Section',
    description: 'A semantic section component for organizing page content',
    category: ComponentCategory.Layout,
    icon: 'LayoutList',
    renderMode: RenderMode.Server,
    defaultProps: {
      backgroundColor: 'transparent',
      paddingY: '2rem',
    },
    propertySchema: [
      {
        id: 'backgroundColor',
        label: 'Background Color',
        type: PropertyType.Color,
        control: PropertyControlType.ColorPicker,
        defaultValue: 'transparent',
      },
      {
        id: 'paddingY',
        label: 'Vertical Padding',
        type: PropertyType.String,
        control: PropertyControlType.Select,
        defaultValue: '2rem',
        options: [
          { label: 'None', value: '0' },
          { label: 'Small', value: '1rem' },
          { label: 'Medium', value: '2rem' },
          { label: 'Large', value: '4rem' },
        ],
      },
    ],
    isContainer: true,
    isDraggable: true,
    isResizable: false,
    isLocked: false,
    allowedChildren: [ComponentCategory.Layout, ComponentCategory.DataDisplay],
  },

  {
    id: 'grid',
    name: 'Grid',
    description: 'A responsive grid layout component',
    category: ComponentCategory.Layout,
    icon: 'LayoutGrid',
    renderMode: RenderMode.Server,
    defaultProps: {
      columns: 3,
      gap: '1rem',
      responsive: true,
    },
    propertySchema: [
      {
        id: 'columns',
        label: 'Columns',
        type: PropertyType.Number,
        control: PropertyControlType.NumberInput,
        defaultValue: 3,
        validation: { min: 1, max: 12 },
      },
      {
        id: 'gap',
        label: 'Gap',
        type: PropertyType.String,
        control: PropertyControlType.Select,
        defaultValue: '1rem',
        options: [
          { label: 'None', value: '0' },
          { label: 'Small', value: '0.5rem' },
          { label: 'Medium', value: '1rem' },
          { label: 'Large', value: '2rem' },
        ],
      },
      {
        id: 'responsive',
        label: 'Responsive',
        type: PropertyType.Boolean,
        control: PropertyControlType.Toggle,
        defaultValue: true,
        helpText: 'Automatically adjust columns on mobile',
      },
    ],
    isContainer: true,
    isDraggable: true,
    isResizable: false,
    isLocked: false,
  },

  // ============================================================================
  // FORM COMPONENTS
  // ============================================================================
  {
    id: 'button',
    name: 'Button',
    description: 'A customizable button component with variants',
    category: ComponentCategory.Form,
    icon: 'RectangleHorizontal',
    renderMode: RenderMode.Client,
    defaultProps: {
      text: 'Click me',
      variant: 'primary',
      size: 'medium',
      disabled: false,
    },
    propertySchema: [
      {
        id: 'text',
        label: 'Button Text',
        type: PropertyType.String,
        control: PropertyControlType.TextInput,
        defaultValue: 'Click me',
        required: true,
      },
      {
        id: 'variant',
        label: 'Variant',
        type: PropertyType.Select,
        control: PropertyControlType.Select,
        defaultValue: 'primary',
        options: [
          { label: 'Primary', value: 'primary' },
          { label: 'Secondary', value: 'secondary' },
          { label: 'Outline', value: 'outline' },
          { label: 'Ghost', value: 'ghost' },
          { label: 'Destructive', value: 'destructive' },
        ],
      },
      {
        id: 'size',
        label: 'Size',
        type: PropertyType.Select,
        control: PropertyControlType.Select,
        defaultValue: 'medium',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      },
      {
        id: 'disabled',
        label: 'Disabled',
        type: PropertyType.Boolean,
        control: PropertyControlType.Toggle,
        defaultValue: false,
      },
    ],
    isContainer: false,
    isDraggable: true,
    isResizable: false,
    isLocked: false,
  },

  {
    id: 'input',
    name: 'Input',
    description: 'A text input field with label and validation',
    category: ComponentCategory.Form,
    icon: 'Type',
    renderMode: RenderMode.Client,
    defaultProps: {
      label: 'Input Label',
      placeholder: 'Enter text...',
      type: 'text',
      required: false,
    },
    propertySchema: [
      {
        id: 'label',
        label: 'Label',
        type: PropertyType.String,
        control: PropertyControlType.TextInput,
        defaultValue: 'Input Label',
      },
      {
        id: 'placeholder',
        label: 'Placeholder',
        type: PropertyType.String,
        control: PropertyControlType.TextInput,
        defaultValue: 'Enter text...',
      },
      {
        id: 'type',
        label: 'Input Type',
        type: PropertyType.Select,
        control: PropertyControlType.Select,
        defaultValue: 'text',
        options: [
          { label: 'Text', value: 'text' },
          { label: 'Email', value: 'email' },
          { label: 'Password', value: 'password' },
          { label: 'Number', value: 'number' },
          { label: 'Tel', value: 'tel' },
          { label: 'URL', value: 'url' },
        ],
      },
      {
        id: 'required',
        label: 'Required',
        type: PropertyType.Boolean,
        control: PropertyControlType.Toggle,
        defaultValue: false,
      },
    ],
    isContainer: false,
    isDraggable: true,
    isResizable: false,
    isLocked: false,
  },

  {
    id: 'textarea',
    name: 'Textarea',
    description: 'A multi-line text input area',
    category: ComponentCategory.Form,
    icon: 'AlignLeft',
    renderMode: RenderMode.Client,
    defaultProps: {
      label: 'Textarea Label',
      placeholder: 'Enter text...',
      rows: 4,
      maxLength: 500,
    },
    propertySchema: [
      {
        id: 'label',
        label: 'Label',
        type: PropertyType.String,
        control: PropertyControlType.TextInput,
        defaultValue: 'Textarea Label',
      },
      {
        id: 'placeholder',
        label: 'Placeholder',
        type: PropertyType.String,
        control: PropertyControlType.TextInput,
        defaultValue: 'Enter text...',
      },
      {
        id: 'rows',
        label: 'Rows',
        type: PropertyType.Number,
        control: PropertyControlType.NumberInput,
        defaultValue: 4,
        validation: { min: 2, max: 20 },
      },
      {
        id: 'maxLength',
        label: 'Max Length',
        type: PropertyType.Number,
        control: PropertyControlType.NumberInput,
        defaultValue: 500,
        validation: { min: 1 },
      },
    ],
    isContainer: false,
    isDraggable: true,
    isResizable: false,
    isLocked: false,
  },

  // ============================================================================
  // DATA DISPLAY COMPONENTS
  // ============================================================================
  {
    id: 'text',
    name: 'Text',
    description: 'A text component with typography controls',
    category: ComponentCategory.DataDisplay,
    icon: 'Text',
    renderMode: RenderMode.Server,
    defaultProps: {
      content: 'Your text here',
      variant: 'body',
      align: 'left',
      color: 'inherit',
    },
    propertySchema: [
      {
        id: 'content',
        label: 'Content',
        type: PropertyType.String,
        control: PropertyControlType.Textarea,
        defaultValue: 'Your text here',
        required: true,
      },
      {
        id: 'variant',
        label: 'Variant',
        type: PropertyType.Select,
        control: PropertyControlType.Select,
        defaultValue: 'body',
        options: [
          { label: 'Heading 1', value: 'h1' },
          { label: 'Heading 2', value: 'h2' },
          { label: 'Heading 3', value: 'h3' },
          { label: 'Heading 4', value: 'h4' },
          { label: 'Body', value: 'body' },
          { label: 'Small', value: 'small' },
        ],
      },
      {
        id: 'align',
        label: 'Alignment',
        type: PropertyType.Select,
        control: PropertyControlType.Select,
        defaultValue: 'left',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
          { label: 'Justify', value: 'justify' },
        ],
      },
      {
        id: 'color',
        label: 'Text Color',
        type: PropertyType.Color,
        control: PropertyControlType.ColorPicker,
        defaultValue: 'inherit',
      },
    ],
    isContainer: false,
    isDraggable: true,
    isResizable: false,
    isLocked: false,
  },

  // ============================================================================
  // MEDIA COMPONENTS
  // ============================================================================
  {
    id: 'image',
    name: 'Image',
    description: 'An optimized image component with Next.js Image',
    category: ComponentCategory.Media,
    icon: 'Image',
    renderMode: RenderMode.Server,
    defaultProps: {
      src: '/placeholder.jpg',
      alt: 'Image description',
      width: 600,
      height: 400,
      objectFit: 'cover',
    },
    propertySchema: [
      {
        id: 'src',
        label: 'Image Source',
        type: PropertyType.Image,
        control: PropertyControlType.ImageUpload,
        defaultValue: '/placeholder.jpg',
        required: true,
      },
      {
        id: 'alt',
        label: 'Alt Text',
        type: PropertyType.String,
        control: PropertyControlType.TextInput,
        defaultValue: 'Image description',
        required: true,
        helpText: 'Describe the image for accessibility',
      },
      {
        id: 'width',
        label: 'Width',
        type: PropertyType.Number,
        control: PropertyControlType.NumberInput,
        defaultValue: 600,
        validation: { min: 1 },
      },
      {
        id: 'height',
        label: 'Height',
        type: PropertyType.Number,
        control: PropertyControlType.NumberInput,
        defaultValue: 400,
        validation: { min: 1 },
      },
      {
        id: 'objectFit',
        label: 'Object Fit',
        type: PropertyType.Select,
        control: PropertyControlType.Select,
        defaultValue: 'cover',
        options: [
          { label: 'Cover', value: 'cover' },
          { label: 'Contain', value: 'contain' },
          { label: 'Fill', value: 'fill' },
          { label: 'None', value: 'none' },
        ],
      },
    ],
    isContainer: false,
    isDraggable: true,
    isResizable: true,
    isLocked: false,
  },

  // ============================================================================
  // NAVIGATION COMPONENTS
  // ============================================================================
  {
    id: 'link',
    name: 'Link',
    description: 'A Next.js optimized link component',
    category: ComponentCategory.Navigation,
    icon: 'Link',
    renderMode: RenderMode.Server,
    defaultProps: {
      text: 'Link text',
      href: '/',
      openInNewTab: false,
    },
    propertySchema: [
      {
        id: 'text',
        label: 'Link Text',
        type: PropertyType.String,
        control: PropertyControlType.TextInput,
        defaultValue: 'Link text',
        required: true,
      },
      {
        id: 'href',
        label: 'URL',
        type: PropertyType.String,
        control: PropertyControlType.TextInput,
        defaultValue: '/',
        required: true,
      },
      {
        id: 'openInNewTab',
        label: 'Open in New Tab',
        type: PropertyType.Boolean,
        control: PropertyControlType.Toggle,
        defaultValue: false,
      },
    ],
    isContainer: false,
    isDraggable: true,
    isResizable: false,
    isLocked: false,
  },
];

/**
 * Get components by category
 */
export function getComponentsByCategory(category: ComponentCategory): ComponentDefinition[] {
  return componentRegistry.filter((comp) => comp.category === category);
}

/**
 * Get component by ID
 */
export function getComponentById(id: string): ComponentDefinition | undefined {
  return componentRegistry.find((comp) => comp.id === id);
}

/**
 * Get all component categories with counts
 */
export function getCategoriesWithCounts(): Array<{
  category: ComponentCategory;
  count: number;
}> {
  const categoryCounts = new Map<ComponentCategory, number>();

  // Initialize all categories with 0
  Object.values(ComponentCategory).forEach((category) => {
    categoryCounts.set(category, 0);
  });

  // Count components per category
  componentRegistry.forEach((comp) => {
    const currentCount = categoryCounts.get(comp.category) || 0;
    categoryCounts.set(comp.category, currentCount + 1);
  });

  return Array.from(categoryCounts.entries()).map(([category, count]) => ({
    category,
    count,
  }));
}

/**
 * Search components by name or description
 */
export function searchComponents(query: string): ComponentDefinition[] {
  if (!query.trim()) {
    return componentRegistry;
  }

  const lowerQuery = query.toLowerCase();

  return componentRegistry.filter(
    (comp) =>
      comp.name.toLowerCase().includes(lowerQuery) ||
      comp.description.toLowerCase().includes(lowerQuery)
  );
}
