/**
 * Form Component Definitions
 *
 * Metadata definitions for form input components with validation,
 * data binding, and accessibility support.
 */

import { ComponentDefinition } from '../types';

/**
 * Input Component
 *
 * Text input with various types and validation
 */
export const InputDefinition: ComponentDefinition = {
  id: 'form-input',
  name: 'Input',
  displayName: 'Input',
  description: 'Text input field with validation and various input types',
  category: 'form',
  icon: 'Type',
  tags: ['form', 'input', 'text', 'field'],

  renderMode: 'client',
  componentPath: '@/lib/page-builder/ui/Input',

  acceptsChildren: false,

  props: [
    {
      name: 'name',
      label: 'Name',
      description: 'Input name attribute',
      type: 'string',
      controlType: 'text',
      defaultValue: 'input',
      required: true,
      group: 'basic',
    },
    {
      name: 'type',
      label: 'Type',
      description: 'Input type',
      type: 'string',
      controlType: 'select',
      defaultValue: 'text',
      options: [
        { value: 'text', label: 'Text' },
        { value: 'email', label: 'Email' },
        { value: 'password', label: 'Password' },
        { value: 'number', label: 'Number' },
        { value: 'tel', label: 'Telephone' },
        { value: 'url', label: 'URL' },
        { value: 'search', label: 'Search' },
      ],
      group: 'basic',
    },
    {
      name: 'label',
      label: 'Label',
      description: 'Input label',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Label',
      group: 'basic',
    },
    {
      name: 'placeholder',
      label: 'Placeholder',
      description: 'Placeholder text',
      type: 'string',
      controlType: 'text',
      defaultValue: '',
      group: 'basic',
    },
    {
      name: 'defaultValue',
      label: 'Default Value',
      description: 'Default input value',
      type: 'string',
      controlType: 'text',
      defaultValue: '',
      group: 'basic',
      supportsDataBinding: true,
    },
    {
      name: 'required',
      label: 'Required',
      description: 'Mark as required field',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'validation',
    },
    {
      name: 'disabled',
      label: 'Disabled',
      description: 'Disable input',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
    {
      name: 'readonly',
      label: 'Read Only',
      description: 'Make input read-only',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
    {
      name: 'minLength',
      label: 'Min Length',
      description: 'Minimum input length',
      type: 'number',
      controlType: 'number',
      defaultValue: undefined,
      min: 0,
      group: 'validation',
    },
    {
      name: 'maxLength',
      label: 'Max Length',
      description: 'Maximum input length',
      type: 'number',
      controlType: 'number',
      defaultValue: undefined,
      min: 0,
      group: 'validation',
    },
    {
      name: 'pattern',
      label: 'Pattern',
      description: 'Validation pattern (regex)',
      type: 'string',
      controlType: 'text',
      defaultValue: '',
      group: 'validation',
    },
    {
      name: 'helperText',
      label: 'Helper Text',
      description: 'Help text below input',
      type: 'string',
      controlType: 'text',
      defaultValue: '',
      group: 'basic',
    },
    {
      name: 'errorMessage',
      label: 'Error Message',
      description: 'Error message',
      type: 'string',
      controlType: 'text',
      defaultValue: '',
      group: 'validation',
      supportsDataBinding: true,
    },
  ],

  events: [
    { name: 'onChange', label: 'Change', description: 'Triggered when value changes' },
    { name: 'onBlur', label: 'Blur', description: 'Triggered when input loses focus' },
    { name: 'onFocus', label: 'Focus', description: 'Triggered when input gains focus' },
  ],

  dataBindings: [
    {
      prop: 'value',
      label: 'Value',
      supportedSources: ['state', 'props', 'context'],
    },
  ],

  styleOptions: {
    variants: [
      {
        name: 'variant',
        label: 'Variant',
        values: [
          { value: 'default', label: 'Default' },
          { value: 'filled', label: 'Filled' },
          { value: 'outlined', label: 'Outlined' },
        ],
      },
      {
        name: 'size',
        label: 'Size',
        values: [
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ],
      },
    ],
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    requiredAriaAttributes: ['aria-label'],
    keyboardNavigable: true,
  },

  previewProps: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
  },
};

/**
 * Select Component
 *
 * Dropdown select with single and multi-select support
 */
export const SelectDefinition: ComponentDefinition = {
  id: 'form-select',
  name: 'Select',
  displayName: 'Select',
  description: 'Dropdown select with single and multi-select support',
  category: 'form',
  icon: 'ChevronDown',
  tags: ['form', 'select', 'dropdown', 'picker'],

  renderMode: 'client',
  componentPath: '@/lib/page-builder/ui/Select',

  acceptsChildren: false,

  props: [
    {
      name: 'name',
      label: 'Name',
      description: 'Select name attribute',
      type: 'string',
      controlType: 'text',
      defaultValue: 'select',
      required: true,
      group: 'basic',
    },
    {
      name: 'label',
      label: 'Label',
      description: 'Select label',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Select',
      group: 'basic',
    },
    {
      name: 'placeholder',
      label: 'Placeholder',
      description: 'Placeholder text',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Select an option...',
      group: 'basic',
    },
    {
      name: 'options',
      label: 'Options',
      description: 'Select options',
      type: 'array',
      controlType: 'json',
      defaultValue: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ],
      group: 'content',
      supportsDataBinding: true,
    },
    {
      name: 'multiple',
      label: 'Multiple',
      description: 'Allow multiple selections',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
    {
      name: 'searchable',
      label: 'Searchable',
      description: 'Enable search/filter',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
    {
      name: 'clearable',
      label: 'Clearable',
      description: 'Show clear button',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
    {
      name: 'required',
      label: 'Required',
      description: 'Mark as required',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'validation',
    },
    {
      name: 'disabled',
      label: 'Disabled',
      description: 'Disable select',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
  ],

  events: [
    { name: 'onChange', label: 'Change', description: 'Triggered when selection changes' },
  ],

  dataBindings: [
    {
      prop: 'value',
      label: 'Value',
      supportedSources: ['state', 'props', 'context'],
    },
    {
      prop: 'options',
      label: 'Options',
      supportedSources: ['state', 'props', 'api', 'computed'],
    },
  ],

  styleOptions: {
    variants: [
      {
        name: 'variant',
        label: 'Variant',
        values: [
          { value: 'default', label: 'Default' },
          { value: 'filled', label: 'Filled' },
          { value: 'outlined', label: 'Outlined' },
        ],
      },
    ],
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    role: 'combobox',
    keyboardNavigable: true,
  },

  previewProps: {
    label: 'Country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
    ],
  },
};

/**
 * Checkbox Component
 *
 * Checkbox input with label
 */
export const CheckboxDefinition: ComponentDefinition = {
  id: 'form-checkbox',
  name: 'Checkbox',
  displayName: 'Checkbox',
  description: 'Checkbox input for boolean selections',
  category: 'form',
  icon: 'CheckSquare',
  tags: ['form', 'checkbox', 'toggle', 'boolean'],

  renderMode: 'client',
  componentPath: '@/lib/page-builder/ui/Checkbox',

  acceptsChildren: false,

  props: [
    {
      name: 'name',
      label: 'Name',
      description: 'Checkbox name attribute',
      type: 'string',
      controlType: 'text',
      defaultValue: 'checkbox',
      required: true,
      group: 'basic',
    },
    {
      name: 'label',
      label: 'Label',
      description: 'Checkbox label',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Label',
      group: 'basic',
    },
    {
      name: 'defaultChecked',
      label: 'Default Checked',
      description: 'Initially checked',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'basic',
    },
    {
      name: 'required',
      label: 'Required',
      description: 'Mark as required',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'validation',
    },
    {
      name: 'disabled',
      label: 'Disabled',
      description: 'Disable checkbox',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
    {
      name: 'indeterminate',
      label: 'Indeterminate',
      description: 'Show indeterminate state',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
  ],

  events: [
    { name: 'onChange', label: 'Change', description: 'Triggered when checkbox state changes' },
  ],

  dataBindings: [
    {
      prop: 'checked',
      label: 'Checked',
      supportedSources: ['state', 'props', 'context'],
    },
  ],

  styleOptions: {
    variants: [
      {
        name: 'size',
        label: 'Size',
        values: [
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ],
      },
    ],
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    keyboardNavigable: true,
  },

  previewProps: {
    label: 'Accept terms and conditions',
  },
};

/**
 * Radio Group Component
 *
 * Radio button group for single selection
 */
export const RadioGroupDefinition: ComponentDefinition = {
  id: 'form-radio-group',
  name: 'RadioGroup',
  displayName: 'Radio Group',
  description: 'Radio button group for single selection from multiple options',
  category: 'form',
  icon: 'Circle',
  tags: ['form', 'radio', 'group', 'selection'],

  renderMode: 'client',
  componentPath: '@/lib/page-builder/ui/RadioGroup',

  acceptsChildren: false,

  props: [
    {
      name: 'name',
      label: 'Name',
      description: 'Radio group name',
      type: 'string',
      controlType: 'text',
      defaultValue: 'radio',
      required: true,
      group: 'basic',
    },
    {
      name: 'label',
      label: 'Label',
      description: 'Group label',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Select an option',
      group: 'basic',
    },
    {
      name: 'options',
      label: 'Options',
      description: 'Radio options',
      type: 'array',
      controlType: 'json',
      defaultValue: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ],
      group: 'content',
      supportsDataBinding: true,
    },
    {
      name: 'orientation',
      label: 'Orientation',
      description: 'Layout direction',
      type: 'string',
      controlType: 'select',
      defaultValue: 'vertical',
      options: [
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'vertical', label: 'Vertical' },
      ],
      group: 'layout',
    },
    {
      name: 'required',
      label: 'Required',
      description: 'Mark as required',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'validation',
    },
    {
      name: 'disabled',
      label: 'Disabled',
      description: 'Disable radio group',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
  ],

  events: [
    { name: 'onChange', label: 'Change', description: 'Triggered when selection changes' },
  ],

  dataBindings: [
    {
      prop: 'value',
      label: 'Value',
      supportedSources: ['state', 'props', 'context'],
    },
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    role: 'radiogroup',
    keyboardNavigable: true,
  },

  previewProps: {
    label: 'Choose a plan',
    options: [
      { value: 'basic', label: 'Basic' },
      { value: 'pro', label: 'Pro' },
    ],
  },
};

/**
 * DatePicker Component
 *
 * Date and time picker with calendar
 */
export const DatePickerDefinition: ComponentDefinition = {
  id: 'form-datepicker',
  name: 'DatePicker',
  displayName: 'Date Picker',
  description: 'Date and time picker with calendar interface',
  category: 'form',
  icon: 'Calendar',
  tags: ['form', 'date', 'time', 'calendar', 'picker'],

  renderMode: 'client',
  componentPath: '@/lib/page-builder/ui/DatePicker',

  acceptsChildren: false,

  props: [
    {
      name: 'name',
      label: 'Name',
      description: 'DatePicker name attribute',
      type: 'string',
      controlType: 'text',
      defaultValue: 'date',
      required: true,
      group: 'basic',
    },
    {
      name: 'label',
      label: 'Label',
      description: 'DatePicker label',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Date',
      group: 'basic',
    },
    {
      name: 'placeholder',
      label: 'Placeholder',
      description: 'Placeholder text',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Select date...',
      group: 'basic',
    },
    {
      name: 'mode',
      label: 'Mode',
      description: 'Picker mode',
      type: 'string',
      controlType: 'select',
      defaultValue: 'single',
      options: [
        { value: 'single', label: 'Single Date' },
        { value: 'range', label: 'Date Range' },
        { value: 'multiple', label: 'Multiple Dates' },
      ],
      group: 'behavior',
    },
    {
      name: 'includeTime',
      label: 'Include Time',
      description: 'Include time picker',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
    {
      name: 'format',
      label: 'Format',
      description: 'Date format',
      type: 'string',
      controlType: 'text',
      defaultValue: 'MM/dd/yyyy',
      placeholder: 'MM/dd/yyyy',
      group: 'behavior',
    },
    {
      name: 'minDate',
      label: 'Min Date',
      description: 'Minimum selectable date',
      type: 'date',
      controlType: 'date',
      defaultValue: undefined,
      group: 'validation',
    },
    {
      name: 'maxDate',
      label: 'Max Date',
      description: 'Maximum selectable date',
      type: 'date',
      controlType: 'date',
      defaultValue: undefined,
      group: 'validation',
    },
    {
      name: 'required',
      label: 'Required',
      description: 'Mark as required',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'validation',
    },
    {
      name: 'disabled',
      label: 'Disabled',
      description: 'Disable date picker',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
  ],

  events: [
    { name: 'onChange', label: 'Change', description: 'Triggered when date changes' },
  ],

  dataBindings: [
    {
      prop: 'value',
      label: 'Value',
      supportedSources: ['state', 'props', 'context'],
    },
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    keyboardNavigable: true,
  },

  previewProps: {
    label: 'Event Date',
    placeholder: 'Select date...',
  },
};

/**
 * FileUpload Component
 *
 * File upload with drag and drop support
 */
export const FileUploadDefinition: ComponentDefinition = {
  id: 'form-fileupload',
  name: 'FileUpload',
  displayName: 'File Upload',
  description: 'File upload with drag and drop support',
  category: 'form',
  icon: 'Upload',
  tags: ['form', 'file', 'upload', 'drag-drop'],

  renderMode: 'client',
  componentPath: '@/lib/page-builder/ui/FileUpload',

  acceptsChildren: false,

  props: [
    {
      name: 'name',
      label: 'Name',
      description: 'File input name',
      type: 'string',
      controlType: 'text',
      defaultValue: 'file',
      required: true,
      group: 'basic',
    },
    {
      name: 'label',
      label: 'Label',
      description: 'Upload label',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Upload File',
      group: 'basic',
    },
    {
      name: 'accept',
      label: 'Accepted Types',
      description: 'Accepted file types',
      type: 'string',
      controlType: 'text',
      defaultValue: '',
      placeholder: '.jpg,.png,.pdf',
      group: 'validation',
    },
    {
      name: 'multiple',
      label: 'Multiple',
      description: 'Allow multiple files',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
    {
      name: 'maxSize',
      label: 'Max Size (MB)',
      description: 'Maximum file size in MB',
      type: 'number',
      controlType: 'number',
      defaultValue: 10,
      min: 0.1,
      max: 100,
      step: 0.1,
      group: 'validation',
    },
    {
      name: 'maxFiles',
      label: 'Max Files',
      description: 'Maximum number of files',
      type: 'number',
      controlType: 'number',
      defaultValue: 1,
      min: 1,
      max: 20,
      group: 'validation',
      condition: 'multiple === true',
    },
    {
      name: 'showPreview',
      label: 'Show Preview',
      description: 'Show file preview',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'appearance',
    },
    {
      name: 'uploadUrl',
      label: 'Upload URL',
      description: 'Server upload endpoint',
      type: 'string',
      controlType: 'url',
      defaultValue: '',
      group: 'behavior',
    },
    {
      name: 'required',
      label: 'Required',
      description: 'Mark as required',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'validation',
    },
    {
      name: 'disabled',
      label: 'Disabled',
      description: 'Disable upload',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
  ],

  events: [
    { name: 'onFileSelect', label: 'File Select', description: 'Triggered when files are selected' },
    { name: 'onUploadComplete', label: 'Upload Complete', description: 'Triggered when upload completes' },
    { name: 'onUploadError', label: 'Upload Error', description: 'Triggered on upload error' },
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    keyboardNavigable: true,
  },

  previewProps: {
    label: 'Upload Documents',
    accept: '.pdf,.doc,.docx',
  },
};

/**
 * Textarea Component
 *
 * Multi-line text input
 */
export const TextareaDefinition: ComponentDefinition = {
  id: 'form-textarea',
  name: 'Textarea',
  displayName: 'Textarea',
  description: 'Multi-line text input field',
  category: 'form',
  icon: 'TextQuote',
  tags: ['form', 'textarea', 'text', 'multiline'],

  renderMode: 'client',
  componentPath: '@/lib/page-builder/ui/Textarea',

  acceptsChildren: false,

  props: [
    {
      name: 'name',
      label: 'Name',
      description: 'Textarea name',
      type: 'string',
      controlType: 'text',
      defaultValue: 'textarea',
      required: true,
      group: 'basic',
    },
    {
      name: 'label',
      label: 'Label',
      description: 'Textarea label',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Message',
      group: 'basic',
    },
    {
      name: 'placeholder',
      label: 'Placeholder',
      description: 'Placeholder text',
      type: 'string',
      controlType: 'text',
      defaultValue: '',
      group: 'basic',
    },
    {
      name: 'rows',
      label: 'Rows',
      description: 'Number of visible rows',
      type: 'number',
      controlType: 'number',
      defaultValue: 4,
      min: 2,
      max: 20,
      group: 'layout',
    },
    {
      name: 'autoResize',
      label: 'Auto Resize',
      description: 'Auto-resize to content',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
    {
      name: 'maxLength',
      label: 'Max Length',
      description: 'Maximum character count',
      type: 'number',
      controlType: 'number',
      defaultValue: undefined,
      min: 0,
      group: 'validation',
    },
    {
      name: 'showCount',
      label: 'Show Character Count',
      description: 'Display character count',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'appearance',
    },
    {
      name: 'required',
      label: 'Required',
      description: 'Mark as required',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'validation',
    },
    {
      name: 'disabled',
      label: 'Disabled',
      description: 'Disable textarea',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
  ],

  events: [
    { name: 'onChange', label: 'Change', description: 'Triggered when value changes' },
  ],

  dataBindings: [
    {
      prop: 'value',
      label: 'Value',
      supportedSources: ['state', 'props', 'context'],
    },
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    keyboardNavigable: true,
  },

  previewProps: {
    label: 'Comments',
    placeholder: 'Enter your comments...',
    rows: 4,
  },
};

// Export all form component definitions
export const FormComponents: ComponentDefinition[] = [
  InputDefinition,
  SelectDefinition,
  CheckboxDefinition,
  RadioGroupDefinition,
  DatePickerDefinition,
  FileUploadDefinition,
  TextareaDefinition,
];
