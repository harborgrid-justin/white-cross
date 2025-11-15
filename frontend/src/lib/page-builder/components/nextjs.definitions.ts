/**
 * Next.js-Specific Component Definitions
 *
 * Metadata definitions for Next.js-specific components including
 * Image, Link, Loading states, Error boundaries, and component wrappers.
 */

import { ComponentDefinition } from '../types';

/**
 * Next.js Image Component
 *
 * Optimized image component using next/image
 */
export const NextImageDefinition: ComponentDefinition = {
  id: 'nextjs-image',
  name: 'NextImage',
  displayName: 'Next.js Image',
  description: 'Optimized image component with automatic optimization',
  category: 'nextjs',
  icon: 'Image',
  tags: ['nextjs', 'image', 'media', 'optimization'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/ui/NextImage',

  acceptsChildren: false,

  props: [
    {
      name: 'src',
      label: 'Source',
      description: 'Image source URL or path',
      type: 'string',
      controlType: 'image',
      defaultValue: '/placeholder.jpg',
      required: true,
      group: 'basic',
      supportsDataBinding: true,
    },
    {
      name: 'alt',
      label: 'Alt Text',
      description: 'Alternative text for accessibility',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Image',
      required: true,
      group: 'basic',
    },
    {
      name: 'width',
      label: 'Width',
      description: 'Image width in pixels',
      type: 'number',
      controlType: 'number',
      defaultValue: 800,
      min: 1,
      group: 'dimensions',
    },
    {
      name: 'height',
      label: 'Height',
      description: 'Image height in pixels',
      type: 'number',
      controlType: 'number',
      defaultValue: 600,
      min: 1,
      group: 'dimensions',
    },
    {
      name: 'fill',
      label: 'Fill Container',
      description: 'Fill parent container (responsive)',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'dimensions',
    },
    {
      name: 'objectFit',
      label: 'Object Fit',
      description: 'How image fits container',
      type: 'string',
      controlType: 'select',
      defaultValue: 'cover',
      options: [
        { value: 'contain', label: 'Contain' },
        { value: 'cover', label: 'Cover' },
        { value: 'fill', label: 'Fill' },
        { value: 'none', label: 'None' },
        { value: 'scale-down', label: 'Scale Down' },
      ],
      group: 'dimensions',
      condition: 'fill === true',
    },
    {
      name: 'priority',
      label: 'Priority',
      description: 'Preload image (above fold)',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'optimization',
    },
    {
      name: 'quality',
      label: 'Quality',
      description: 'Image quality (1-100)',
      type: 'number',
      controlType: 'slider',
      defaultValue: 75,
      min: 1,
      max: 100,
      step: 5,
      group: 'optimization',
    },
    {
      name: 'loading',
      label: 'Loading',
      description: 'Loading behavior',
      type: 'string',
      controlType: 'select',
      defaultValue: 'lazy',
      options: [
        { value: 'lazy', label: 'Lazy (Default)' },
        { value: 'eager', label: 'Eager' },
      ],
      group: 'optimization',
    },
    {
      name: 'placeholder',
      label: 'Placeholder',
      description: 'Placeholder type',
      type: 'string',
      controlType: 'select',
      defaultValue: 'blur',
      options: [
        { value: 'blur', label: 'Blur' },
        { value: 'empty', label: 'Empty' },
      ],
      group: 'optimization',
    },
    {
      name: 'rounded',
      label: 'Rounded Corners',
      description: 'Border radius',
      type: 'string',
      controlType: 'select',
      defaultValue: 'none',
      options: [
        { value: 'none', label: 'None' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'full', label: 'Full (Circle)' },
      ],
      group: 'appearance',
    },
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    requiredAriaAttributes: ['alt'],
  },

  previewProps: {
    src: '/placeholder.jpg',
    alt: 'Placeholder image',
    width: 800,
    height: 600,
  },
};

/**
 * Next.js Link Component
 *
 * Client-side navigation link using next/link
 */
export const NextLinkDefinition: ComponentDefinition = {
  id: 'nextjs-link',
  name: 'NextLink',
  displayName: 'Next.js Link',
  description: 'Client-side navigation link with prefetching',
  category: 'nextjs',
  icon: 'Link',
  tags: ['nextjs', 'link', 'navigation', 'routing'],

  renderMode: 'client',
  componentPath: '@/lib/page-builder/ui/NextLink',

  acceptsChildren: true,

  props: [
    {
      name: 'href',
      label: 'URL',
      description: 'Destination URL or path',
      type: 'string',
      controlType: 'url',
      defaultValue: '/',
      required: true,
      group: 'basic',
      supportsDataBinding: true,
    },
    {
      name: 'children',
      label: 'Link Text',
      description: 'Link text content',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Link',
      group: 'basic',
    },
    {
      name: 'prefetch',
      label: 'Prefetch',
      description: 'Prefetch page in background',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'optimization',
    },
    {
      name: 'replace',
      label: 'Replace History',
      description: 'Replace current history entry',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
    {
      name: 'scroll',
      label: 'Scroll to Top',
      description: 'Scroll to top on navigation',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'behavior',
    },
    {
      name: 'target',
      label: 'Target',
      description: 'Link target',
      type: 'string',
      controlType: 'select',
      defaultValue: '_self',
      options: [
        { value: '_self', label: 'Same Window' },
        { value: '_blank', label: 'New Window' },
        { value: '_parent', label: 'Parent Frame' },
        { value: '_top', label: 'Top Frame' },
      ],
      group: 'behavior',
    },
    {
      name: 'underline',
      label: 'Underline',
      description: 'Text underline style',
      type: 'string',
      controlType: 'select',
      defaultValue: 'hover',
      options: [
        { value: 'none', label: 'None' },
        { value: 'hover', label: 'On Hover' },
        { value: 'always', label: 'Always' },
      ],
      group: 'appearance',
    },
  ],

  events: [
    { name: 'onClick', label: 'Click', description: 'Triggered when link is clicked' },
  ],

  styleOptions: {
    variants: [
      {
        name: 'variant',
        label: 'Variant',
        values: [
          { value: 'default', label: 'Default' },
          { value: 'primary', label: 'Primary' },
          { value: 'secondary', label: 'Secondary' },
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
    href: '/',
    children: 'Home',
  },
};

/**
 * Loading Component
 *
 * Loading state component with Suspense support
 */
export const LoadingDefinition: ComponentDefinition = {
  id: 'nextjs-loading',
  name: 'Loading',
  displayName: 'Loading',
  description: 'Loading state component with various spinner styles',
  category: 'nextjs',
  icon: 'Loader',
  tags: ['nextjs', 'loading', 'spinner', 'suspense'],

  renderMode: 'client',
  componentPath: '@/lib/page-builder/ui/Loading',

  acceptsChildren: false,

  props: [
    {
      name: 'variant',
      label: 'Variant',
      description: 'Loading indicator style',
      type: 'string',
      controlType: 'select',
      defaultValue: 'spinner',
      options: [
        { value: 'spinner', label: 'Spinner' },
        { value: 'dots', label: 'Dots' },
        { value: 'bars', label: 'Bars' },
        { value: 'pulse', label: 'Pulse' },
        { value: 'skeleton', label: 'Skeleton' },
      ],
      group: 'appearance',
    },
    {
      name: 'size',
      label: 'Size',
      description: 'Loading indicator size',
      type: 'string',
      controlType: 'select',
      defaultValue: 'md',
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
      ],
      group: 'appearance',
    },
    {
      name: 'message',
      label: 'Loading Message',
      description: 'Optional loading message',
      type: 'string',
      controlType: 'text',
      defaultValue: '',
      placeholder: 'Loading...',
      group: 'content',
    },
    {
      name: 'fullscreen',
      label: 'Fullscreen',
      description: 'Cover entire screen',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'layout',
    },
    {
      name: 'overlay',
      label: 'Overlay',
      description: 'Show overlay background',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'appearance',
    },
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    role: 'status',
    defaultAriaLabel: 'Loading',
  },

  previewProps: {
    variant: 'spinner',
    size: 'md',
  },
};

/**
 * Error Boundary Component
 *
 * Error boundary wrapper with fallback UI
 */
export const ErrorBoundaryDefinition: ComponentDefinition = {
  id: 'nextjs-error-boundary',
  name: 'ErrorBoundary',
  displayName: 'Error Boundary',
  description: 'Error boundary wrapper with custom fallback UI',
  category: 'nextjs',
  icon: 'AlertTriangle',
  tags: ['nextjs', 'error', 'boundary', 'fallback'],

  renderMode: 'client',
  componentPath: '@/lib/page-builder/ui/ErrorBoundary',

  acceptsChildren: true,

  props: [
    {
      name: 'fallbackTitle',
      label: 'Fallback Title',
      description: 'Error message title',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Something went wrong',
      group: 'content',
    },
    {
      name: 'fallbackMessage',
      label: 'Fallback Message',
      description: 'Error message description',
      type: 'string',
      controlType: 'text',
      defaultValue: 'An error occurred while rendering this component.',
      group: 'content',
    },
    {
      name: 'showResetButton',
      label: 'Show Reset Button',
      description: 'Show button to reset error',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'behavior',
    },
    {
      name: 'resetButtonText',
      label: 'Reset Button Text',
      description: 'Reset button label',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Try again',
      group: 'content',
      condition: 'showResetButton === true',
    },
    {
      name: 'logErrors',
      label: 'Log Errors',
      description: 'Log errors to console',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'behavior',
    },
  ],

  events: [
    { name: 'onError', label: 'Error', description: 'Triggered when error is caught' },
    { name: 'onReset', label: 'Reset', description: 'Triggered when error is reset' },
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    role: 'alert',
    defaultAriaLabel: 'Error message',
  },

  previewProps: {
    fallbackTitle: 'Something went wrong',
    fallbackMessage: 'An error occurred.',
  },
};

/**
 * Suspense Boundary Component
 *
 * Suspense boundary with fallback UI
 */
export const SuspenseBoundaryDefinition: ComponentDefinition = {
  id: 'nextjs-suspense',
  name: 'SuspenseBoundary',
  displayName: 'Suspense Boundary',
  description: 'Suspense boundary for streaming and lazy loading',
  category: 'nextjs',
  icon: 'Download',
  tags: ['nextjs', 'suspense', 'streaming', 'lazy'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/ui/SuspenseBoundary',

  acceptsChildren: true,

  props: [
    {
      name: 'fallbackType',
      label: 'Fallback Type',
      description: 'Type of loading fallback',
      type: 'string',
      controlType: 'select',
      defaultValue: 'spinner',
      options: [
        { value: 'spinner', label: 'Spinner' },
        { value: 'skeleton', label: 'Skeleton' },
        { value: 'custom', label: 'Custom Component' },
      ],
      group: 'appearance',
    },
    {
      name: 'fallbackMessage',
      label: 'Fallback Message',
      description: 'Loading message',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Loading...',
      group: 'content',
    },
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    role: 'status',
    defaultAriaLabel: 'Loading content',
  },

  previewProps: {
    fallbackType: 'spinner',
    fallbackMessage: 'Loading...',
  },
};

/**
 * Server Component Wrapper
 *
 * Wrapper to explicitly mark content as Server Component
 */
export const ServerComponentDefinition: ComponentDefinition = {
  id: 'nextjs-server-component',
  name: 'ServerComponent',
  displayName: 'Server Component',
  description: 'Wrapper for Server Component content (async, data fetching)',
  category: 'nextjs',
  icon: 'Server',
  tags: ['nextjs', 'server', 'rsc', 'async'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/ui/ServerComponent',

  acceptsChildren: true,

  props: [
    {
      name: 'fetchData',
      label: 'Fetch Data',
      description: 'Enable server-side data fetching',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
    {
      name: 'dataSource',
      label: 'Data Source',
      description: 'API endpoint or data source',
      type: 'string',
      controlType: 'url',
      defaultValue: '',
      group: 'data',
      condition: 'fetchData === true',
      supportsDataBinding: true,
    },
    {
      name: 'cache',
      label: 'Cache Strategy',
      description: 'Data caching strategy',
      type: 'string',
      controlType: 'select',
      defaultValue: 'default',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'force-cache', label: 'Force Cache' },
        { value: 'no-store', label: 'No Store' },
        { value: 'no-cache', label: 'No Cache' },
      ],
      group: 'optimization',
      condition: 'fetchData === true',
    },
    {
      name: 'revalidate',
      label: 'Revalidate (seconds)',
      description: 'ISR revalidation interval',
      type: 'number',
      controlType: 'number',
      defaultValue: 0,
      min: 0,
      group: 'optimization',
      condition: 'fetchData === true',
    },
  ],

  dataBindings: [
    {
      prop: 'data',
      label: 'Fetched Data',
      supportedSources: ['api'],
    },
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    keyboardNavigable: false,
  },

  previewProps: {},
};

/**
 * Client Component Wrapper
 *
 * Wrapper to explicitly mark content as Client Component
 */
export const ClientComponentDefinition: ComponentDefinition = {
  id: 'nextjs-client-component',
  name: 'ClientComponent',
  displayName: 'Client Component',
  description: 'Wrapper for Client Component content (interactivity, hooks)',
  category: 'nextjs',
  icon: 'Monitor',
  tags: ['nextjs', 'client', 'interactive', 'hooks'],

  renderMode: 'client',
  componentPath: '@/lib/page-builder/ui/ClientComponent',

  acceptsChildren: true,

  props: [
    {
      name: 'interactive',
      label: 'Interactive',
      description: 'Contains interactive elements',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'behavior',
    },
    {
      name: 'useHooks',
      label: 'Use React Hooks',
      description: 'Uses React hooks (state, effects)',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    keyboardNavigable: false,
  },

  previewProps: {},
};

// Export all Next.js component definitions
export const NextJsComponents: ComponentDefinition[] = [
  NextImageDefinition,
  NextLinkDefinition,
  LoadingDefinition,
  ErrorBoundaryDefinition,
  SuspenseBoundaryDefinition,
  ServerComponentDefinition,
  ClientComponentDefinition,
];
