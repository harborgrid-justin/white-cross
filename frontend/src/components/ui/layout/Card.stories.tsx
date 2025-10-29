import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../buttons/Button';

const meta = {
  title: 'UI/Layout/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Card component for grouping related content with consistent padding and styling.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-2">Card Title</h3>
        <p className="text-gray-600 dark:text-gray-400">
          This is a basic card with some content inside.
        </p>
      </div>
    ),
  },
};

export const WithHeader: Story = {
  args: {
    children: (
      <>
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <h3 className="text-lg font-semibold">Patient Information</h3>
        </div>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Name:</span> John Doe
          </p>
          <p className="text-sm">
            <span className="font-medium">MRN:</span> 12345
          </p>
          <p className="text-sm">
            <span className="font-medium">DOB:</span> 01/15/2010
          </p>
        </div>
      </>
    ),
  },
};

export const WithActions: Story = {
  args: {
    children: (
      <>
        <h3 className="text-lg font-semibold mb-2">Medication Alert</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This medication is due to be administered in 30 minutes.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Snooze
          </Button>
          <Button size="sm">View Details</Button>
        </div>
      </>
    ),
  },
};

export const Interactive: Story = {
  args: {
    className: 'cursor-pointer hover:shadow-lg transition-shadow',
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-2">Click Me</h3>
        <p className="text-gray-600 dark:text-gray-400">
          This card is interactive and shows hover effects.
        </p>
      </div>
    ),
  },
};
