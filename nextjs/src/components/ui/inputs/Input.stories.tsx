'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input } from './Input';
import { Search, Mail, Lock, User } from 'lucide-react';

/**
 * The Input component is used for text input with label, validation, and icon support.
 *
 * ## Features
 * - 3 visual variants (default, filled, outlined)
 * - 3 size options
 * - Label with required indicator
 * - Error state with validation message
 * - Helper text for guidance
 * - Icon support (left or right)
 * - Loading state
 * - Dark mode support
 * - Full accessibility
 */
const meta = {
  title: 'UI/Inputs/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Core input component with label, error states, and icon support for form data entry.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined'],
      description: 'Visual style variant',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text displayed above input',
    },
    error: {
      control: 'text',
      description: 'Error message displayed below input',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below input',
    },
    required: {
      control: 'boolean',
      description: 'Shows required indicator',
      table: {
        defaultValue: { summary: false },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner',
      table: {
        defaultValue: { summary: false },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    onChange: {
      action: 'changed',
      description: 'Change event handler',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default input with label.
 */
export const Default: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
  },
};

/**
 * Input with helper text providing guidance.
 */
export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    helperText: 'Must be at least 8 characters with one number',
  },
};

/**
 * Input with error state and message.
 */
export const WithError: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    value: 'john',
    error: 'Username is already taken',
  },
};

/**
 * Required input with asterisk indicator.
 */
export const Required: Story = {
  args: {
    label: 'Medical Record Number',
    placeholder: 'MRN-',
    required: true,
  },
};

/**
 * Input with left-positioned icon.
 */
export const WithLeftIcon: Story = {
  args: {
    label: 'Search Patients',
    icon: <Search className="h-4 w-4" />,
    iconPosition: 'left',
    placeholder: 'Search by name or MRN...',
  },
};

/**
 * Input with right-positioned icon.
 */
export const WithRightIcon: Story = {
  args: {
    label: 'Email',
    icon: <Mail className="h-4 w-4" />,
    iconPosition: 'right',
    placeholder: 'user@example.com',
  },
};

/**
 * Input in loading state.
 */
export const Loading: Story = {
  args: {
    label: 'Verify Code',
    placeholder: 'Enter verification code',
    loading: true,
  },
};

/**
 * Disabled input.
 */
export const Disabled: Story = {
  args: {
    label: 'Patient ID',
    value: 'P-12345',
    disabled: true,
  },
};

/**
 * Small size input.
 */
export const Small: Story = {
  args: {
    label: 'Search',
    size: 'sm',
    placeholder: 'Search...',
  },
};

/**
 * Medium size input (default).
 */
export const Medium: Story = {
  args: {
    label: 'Name',
    size: 'md',
    placeholder: 'Enter your name',
  },
};

/**
 * Large size input.
 */
export const Large: Story = {
  args: {
    label: 'Hospital Name',
    size: 'lg',
    placeholder: 'Enter hospital name',
  },
};

/**
 * Filled variant input.
 */
export const FilledVariant: Story = {
  args: {
    label: 'Address',
    variant: 'filled',
    placeholder: 'Enter address',
  },
};

/**
 * Outlined variant input.
 */
export const OutlinedVariant: Story = {
  args: {
    label: 'Phone Number',
    variant: 'outlined',
    placeholder: '(555) 123-4567',
    type: 'tel',
  },
};

/**
 * Healthcare-specific: Patient name input.
 */
export const PatientName: Story = {
  args: {
    label: 'Patient Full Name',
    icon: <User className="h-4 w-4" />,
    iconPosition: 'left',
    placeholder: 'First Middle Last',
    required: true,
    helperText: 'Enter patient\'s legal name as it appears on ID',
  },
};

/**
 * Healthcare-specific: Secure PIN input.
 */
export const SecurePIN: Story = {
  args: {
    label: 'Security PIN',
    type: 'password',
    icon: <Lock className="h-4 w-4" />,
    iconPosition: 'left',
    placeholder: '••••',
    maxLength: 4,
    required: true,
    helperText: '4-digit PIN for accessing medical records',
  },
};

/**
 * All input variants displayed together.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[400px]">
      <Input label="Default Variant" variant="default" placeholder="Default input" />
      <Input label="Filled Variant" variant="filled" placeholder="Filled input" />
      <Input label="Outlined Variant" variant="outlined" placeholder="Outlined input" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * All input sizes displayed together.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[400px]">
      <Input label="Small Size" size="sm" placeholder="Small input" />
      <Input label="Medium Size" size="md" placeholder="Medium input" />
      <Input label="Large Size" size="lg" placeholder="Large input" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Various input states displayed together.
 */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[400px]">
      <Input label="Normal State" placeholder="Type here..." />
      <Input label="With Value" value="Entered text" />
      <Input label="Required Field" placeholder="Type here..." required />
      <Input label="With Helper Text" placeholder="Type here..." helperText="This is helpful information" />
      <Input label="With Error" value="invalid" error="This field contains an error" />
      <Input label="Loading State" placeholder="Type here..." loading />
      <Input label="Disabled State" value="Cannot edit" disabled />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
