'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle, type ModalProps } from './Modal';
import { Button } from '../buttons/Button';
import { Input } from '../inputs/Input';

/**
 * Modal component provides accessible dialogs for confirmations, forms, and content overlays.
 *
 * ## Features
 * - 5 size options (sm, md, lg, xl, full)
 * - Focus trap with keyboard navigation
 * - Escape key to close
 * - Click backdrop to close (optional)
 * - Body scroll lock when open
 * - Focus restoration on close
 * - Close button (optional)
 * - Fully accessible with ARIA
 */
const meta = {
  title: 'UI/Overlays/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Accessible modal dialog with focus trap, keyboard navigation, and comprehensive accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether modal is currently open',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Modal width size',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    centered: {
      control: 'boolean',
      description: 'Center modal vertically',
      table: {
        defaultValue: { summary: true },
      },
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: 'Close when clicking backdrop',
      table: {
        defaultValue: { summary: true },
      },
    },
    closeOnEscapeKey: {
      control: 'boolean',
      description: 'Close when pressing Escape',
      table: {
        defaultValue: { summary: true },
      },
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Show X close button',
      table: {
        defaultValue: { summary: true },
      },
    },
    onClose: {
      action: 'closed',
      description: 'Close callback function',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic modal with title, body, and footer.
 */
export const Default: Story = {
  render: (args: ModalProps) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)}>


          <ModalHeader>
            <ModalTitle>Modal Title</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-700 dark:text-gray-300">
              This is the modal body content. You can add any content here.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

/**
 * Small modal size.
 */
export const SmallSize: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Small Modal</Button>
        <Modal open={open} onClose={() => setOpen(false)} size="sm">
          <ModalHeader>
            <ModalTitle>Small Modal</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-700 dark:text-gray-300">
              This is a small modal for compact dialogs.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

/**
 * Large modal size.
 */
export const LargeSize: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Large Modal</Button>
        <Modal open={open} onClose={() => setOpen(false)} size="lg">
          <ModalHeader>
            <ModalTitle>Large Modal</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              This is a large modal for forms and detailed content.
            </p>
            <div className="space-y-4">
              <Input label="Field 1" placeholder="Enter value" />
              <Input label="Field 2" placeholder="Enter value" />
              <Input label="Field 3" placeholder="Enter value" />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

/**
 * Extra large modal size.
 */
export const ExtraLargeSize: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Extra Large Modal</Button>
        <Modal open={open} onClose={() => setOpen(false)} size="xl">
          <ModalHeader>
            <ModalTitle>Extra Large Modal</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-700 dark:text-gray-300">
              This is an extra large modal for complex forms and detailed views.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="John" />
              <Input label="Last Name" placeholder="Doe" />
              <Input label="Email" type="email" placeholder="john@example.com" />
              <Input label="Phone" type="tel" placeholder="(555) 123-4567" />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

/**
 * Confirmation dialog modal.
 */
export const ConfirmationDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete Item
        </Button>
        <Modal open={open} onClose={() => setOpen(false)} size="sm">
          <ModalHeader>
            <ModalTitle>Confirm Deletion</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

/**
 * Form modal with inputs.
 */
export const FormModal: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Add New Patient</Button>
        <Modal open={open} onClose={() => setOpen(false)} size="lg">
          <ModalHeader>
            <ModalTitle>Add New Patient</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input label="Full Name" placeholder="Enter patient name" required />
              <Input label="Date of Birth" type="date" required />
              <Input label="Medical Record Number" placeholder="MRN-" required />
              <Input label="Email" type="email" placeholder="patient@example.com" />
              <Input label="Phone" type="tel" placeholder="(555) 123-4567" />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Add Patient</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

/**
 * Modal without close button.
 */
export const WithoutCloseButton: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal open={open} onClose={() => setOpen(false)} showCloseButton={false}>
          <ModalHeader>
            <ModalTitle>No Close Button</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-700 dark:text-gray-300">
              This modal has no close button. Use the Cancel button or press Escape.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

/**
 * Modal that cannot be closed by backdrop click or Escape key.
 */
export const ForceAction: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          closeOnBackdropClick={false}
          closeOnEscapeKey={false}
          showCloseButton={false}
        >
          <ModalHeader>
            <ModalTitle>Required Action</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-700 dark:text-gray-300">
              You must take an action. This modal cannot be closed by clicking the backdrop or pressing Escape.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

/**
 * Healthcare-specific: Medication administration confirmation.
 */
export const MedicationConfirmation: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Administer Medication</Button>
        <Modal open={open} onClose={() => setOpen(false)} size="md">
          <ModalHeader>
            <ModalTitle>Confirm Medication Administration</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Patient
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  John Doe (MRN: 12345)
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Medication
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Amoxicillin 500mg
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dosage
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  1 tablet, oral
                </p>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  Please verify all information before confirming.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={() => setOpen(false)}>
              Confirm Administration
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

/**
 * Modal with scrollable content.
 */
export const ScrollableContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal with Long Content</Button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalHeader>
            <ModalTitle>Privacy Policy</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Array.from({ length: 10 }).map((_, i) => (
                <p key={i} className="text-gray-700 dark:text-gray-300">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                  commodo consequat.
                </p>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setOpen(false)}>I Agree</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};
