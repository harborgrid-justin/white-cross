import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';
import { Plus, Save, Trash2, Download, ChevronRight } from 'lucide-react';

/**
 * The Button component is the primary interactive element for user actions.
 * It supports multiple variants, sizes, loading states, and icon configurations.
 *
 * ## Features
 * - 11 visual variants for different action contexts
 * - 5 size options from xs to xl
 * - Loading state with spinner animation
 * - Icon support (left or right positioned)
 * - Full-width layout option
 * - Dark mode support
 * - Fully accessible with ARIA attributes
 */
const meta = {
  title: 'UI/Buttons/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Primary button component with extensive variant and state support for all user interactions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'outline-primary', 'ghost', 'link', 'destructive', 'danger', 'success', 'warning', 'info'],
      description: 'Visual style variant of the button',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the button',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner when true',
      table: {
        defaultValue: { summary: false },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Makes button full width of container',
      table: {
        defaultValue: { summary: false },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Click event handler',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default primary button - the most common button variant used for main actions.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

/**
 * Secondary button variant - used for alternative actions.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

/**
 * Outline button variant - minimal style with border.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

/**
 * Primary outline button - combines outline style with primary color.
 */
export const OutlinePrimary: Story = {
  args: {
    variant: 'outline-primary',
    children: 'Outline Primary',
  },
};

/**
 * Ghost button variant - minimal style for subtle actions.
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

/**
 * Link button variant - appears as a text link.
 */
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

/**
 * Destructive/Danger button - used for delete or destructive actions.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Item',
  },
};

/**
 * Success button - used for positive confirmations.
 */
export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Save Changes',
  },
};

/**
 * Warning button - used for caution actions.
 */
export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Proceed with Caution',
  },
};

/**
 * Info button - used for informational actions.
 */
export const Info: Story = {
  args: {
    variant: 'info',
    children: 'More Information',
  },
};

/**
 * Extra small button size.
 */
export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    children: 'Extra Small',
  },
};

/**
 * Small button size.
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

/**
 * Medium button size (default).
 */
export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
};

/**
 * Large button size.
 */
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

/**
 * Extra large button size - used for prominent CTAs.
 */
export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: 'Extra Large Button',
  },
};

/**
 * Button with left-positioned icon.
 */
export const WithLeftIcon: Story = {
  args: {
    icon: <Plus className="h-4 w-4" />,
    iconPosition: 'left',
    children: 'Add New Item',
  },
};

/**
 * Button with right-positioned icon.
 */
export const WithRightIcon: Story = {
  args: {
    icon: <ChevronRight className="h-4 w-4" />,
    iconPosition: 'right',
    children: 'Continue',
  },
};

/**
 * Icon-only button without text.
 */
export const IconOnly: Story = {
  args: {
    icon: <Download className="h-5 w-5" />,
    'aria-label': 'Download',
  },
};

/**
 * Button in loading state with spinner.
 */
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Saving...',
  },
};

/**
 * Disabled button state.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

/**
 * Full-width button that spans container width.
 */
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Healthcare-specific: Save patient record button.
 */
export const SavePatientRecord: Story = {
  args: {
    variant: 'success',
    icon: <Save className="h-4 w-4" />,
    iconPosition: 'left',
    size: 'lg',
    children: 'Save Patient Record',
  },
};

/**
 * Healthcare-specific: Delete medication button.
 */
export const DeleteMedication: Story = {
  args: {
    variant: 'danger',
    icon: <Trash2 className="h-4 w-4" />,
    iconPosition: 'left',
    children: 'Delete Medication',
  },
};

/**
 * All button variants displayed together for comparison.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="outline-primary">Outline Primary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="success">Success</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="info">Info</Button>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * All button sizes displayed together for comparison.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Buttons with various icon configurations.
 */
export const IconVariations: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button icon={<Plus className="h-4 w-4" />} iconPosition="left">
          Add Item
        </Button>
        <Button icon={<ChevronRight className="h-4 w-4" />} iconPosition="right">
          Next
        </Button>
        <Button icon={<Download className="h-5 w-5" />} aria-label="Download" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
