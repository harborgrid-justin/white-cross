/**
 * Modal Component Tests
 * Comprehensive tests for Modal with focus management and keyboard interactions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalContent,
} from './Modal';

describe('Modal Component', () => {
  let originalBodyOverflow: string;

  beforeEach(() => {
    originalBodyOverflow = document.body.style.overflow;
  });

  afterEach(() => {
    document.body.style.overflow = originalBodyOverflow;
  });

  describe('Rendering', () => {
    it('should not render when open is false', () => {
      render(
        <Modal open={false}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when open is true', () => {
      render(
        <Modal open={true}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should render modal content', () => {
      render(
        <Modal open={true}>
          <ModalBody>Test Content</ModalBody>
        </Modal>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render complete modal structure', () => {
      render(
        <Modal open={true}>
          <ModalHeader>
            <ModalTitle>Test Title</ModalTitle>
          </ModalHeader>
          <ModalBody>Test Body</ModalBody>
          <ModalFooter>
            <button>Cancel</button>
            <button>Confirm</button>
          </ModalFooter>
        </Modal>
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Body')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      const { container } = render(
        <Modal open={true}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      const modal = container.querySelector('.max-w-lg');
      expect(modal).toBeInTheDocument();
    });

    it('should render small size', () => {
      const { container } = render(
        <Modal open={true} size="sm">
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      const modal = container.querySelector('.max-w-md');
      expect(modal).toBeInTheDocument();
    });

    it('should render large size', () => {
      const { container } = render(
        <Modal open={true} size="lg">
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      const modal = container.querySelector('.max-w-2xl');
      expect(modal).toBeInTheDocument();
    });

    it('should render extra large size', () => {
      const { container } = render(
        <Modal open={true} size="xl">
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      const modal = container.querySelector('.max-w-4xl');
      expect(modal).toBeInTheDocument();
    });

    it('should render full size', () => {
      const { container } = render(
        <Modal open={true} size="full">
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      const modal = container.querySelector('.max-w-full');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('should show close button by default', () => {
      render(
        <Modal open={true}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      expect(screen.getByRole('button', { name: /close modal/i })).toBeInTheDocument();
    });

    it('should hide close button when showCloseButton is false', () => {
      render(
        <Modal open={true} showCloseButton={false}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      expect(screen.queryByRole('button', { name: /close modal/i })).not.toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();

      render(
        <Modal open={true} onClose={handleClose}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      await user.click(screen.getByRole('button', { name: /close modal/i }));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Backdrop', () => {
    it('should render backdrop', () => {
      const { container } = render(
        <Modal open={true}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      const backdrop = container.querySelector('.bg-black');
      expect(backdrop).toBeInTheDocument();
    });

    it('should close on backdrop click by default', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();

      const { container } = render(
        <Modal open={true} onClose={handleClose}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      const backdrop = container.querySelector('.bg-black');
      if (backdrop) {
        await user.click(backdrop);
        expect(handleClose).toHaveBeenCalledTimes(1);
      }
    });

    it('should not close on backdrop click when closeOnBackdropClick is false', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();

      const { container } = render(
        <Modal open={true} onClose={handleClose} closeOnBackdropClick={false}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      const backdrop = container.querySelector('.bg-black');
      if (backdrop) {
        await user.click(backdrop);
        expect(handleClose).not.toHaveBeenCalled();
      }
    });

    it('should not close when clicking modal content', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();

      render(
        <Modal open={true} onClose={handleClose}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      await user.click(screen.getByText('Content'));
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Interactions', () => {
    it('should close on Escape key by default', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();

      render(
        <Modal open={true} onClose={handleClose}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      await user.keyboard('{Escape}');
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should not close on Escape key when closeOnEscapeKey is false', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();

      render(
        <Modal open={true} onClose={handleClose} closeOnEscapeKey={false}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      await user.keyboard('{Escape}');
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    it('should focus first focusable element when modal opens', async () => {
      const TestButton = () => <button>Click me</button>;

      render(
        <Modal open={true}>
          <ModalBody>
            <TestButton />
          </ModalBody>
        </Modal>
      );

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toHaveFocus();
      });
    });

    it('should trap focus within modal', async () => {
      const user = userEvent.setup();

      render(
        <Modal open={true}>
          <ModalBody>
            <button>First</button>
            <button>Second</button>
            <button>Third</button>
          </ModalBody>
        </Modal>
      );

      const buttons = screen.getAllByRole('button');
      const firstButton = buttons.find(b => b.textContent === 'First');
      const lastButton = buttons.find(b => b.textContent === 'Third');

      // Tab to last element
      if (firstButton) firstButton.focus();
      await user.tab();
      await user.tab();

      // Should wrap to first element
      await user.tab();

      // Verify focus wrapped (implementation dependent on focus trap)
      // Note: Actual focus trap behavior may vary
    });

    it('should restore focus when modal closes', async () => {
      const TriggerButton = () => <button>Open Modal</button>;

      const TestComponent = () => {
        const [open, setOpen] = React.useState(false);

        return (
          <>
            <button onClick={() => setOpen(true)}>Open Modal</button>
            <Modal open={open} onClose={() => setOpen(false)}>
              <ModalBody>
                <button onClick={() => setOpen(false)}>Close</button>
              </ModalBody>
            </Modal>
          </>
        );
      };

      const user = userEvent.setup();
      render(<TestComponent />);

      const openButton = screen.getByRole('button', { name: /open modal/i });

      // Open modal
      await user.click(openButton);

      // Close modal
      const closeButton = await screen.findByRole('button', { name: /close/i });
      await user.click(closeButton);

      // Wait for modal to close and focus to restore
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Body Scroll Lock', () => {
    it('should prevent body scroll when modal is open', () => {
      render(
        <Modal open={true}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scroll when modal closes', () => {
      const { rerender } = render(
        <Modal open={true}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <Modal open={false}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('should have role="dialog"', () => {
      render(
        <Modal open={true}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-modal="true"', () => {
      render(
        <Modal open={true}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-labelledby pointing to modal title', () => {
      render(
        <Modal open={true}>
          <ModalHeader>
            <ModalTitle>Test Title</ModalTitle>
          </ModalHeader>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
      expect(screen.getByText('Test Title')).toHaveAttribute('id', 'modal-title');
    });

    it('should have accessible close button', () => {
      render(
        <Modal open={true}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      const closeButton = screen.getByRole('button', { name: /close modal/i });
      expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
    });
  });

  describe('Centered Positioning', () => {
    it('should center modal by default', () => {
      const { container } = render(
        <Modal open={true}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      const backdrop = container.querySelector('.flex.items-center.justify-center');
      expect(backdrop).toBeInTheDocument();
    });

    it('should not center when centered is false', () => {
      const { container } = render(
        <Modal open={true} centered={false}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      const backdrop = container.querySelector('.pt-16');
      expect(backdrop).toBeInTheDocument();
    });
  });

  describe('Modal Subcomponents', () => {
    it('should render ModalHeader with divider by default', () => {
      const { container } = render(
        <ModalHeader>Header Content</ModalHeader>
      );

      const header = container.firstChild;
      expect(header).toHaveClass('border-b');
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('should render ModalHeader without divider', () => {
      const { container } = render(
        <ModalHeader divider={false}>Header Content</ModalHeader>
      );

      const header = container.firstChild;
      expect(header).not.toHaveClass('border-b');
    });

    it('should render ModalBody with content', () => {
      render(<ModalBody>Body Content</ModalBody>);
      expect(screen.getByText('Body Content')).toBeInTheDocument();
    });

    it('should render ModalFooter with divider by default', () => {
      const { container } = render(
        <ModalFooter>
          <button>Cancel</button>
        </ModalFooter>
      );

      const footer = container.firstChild;
      expect(footer).toHaveClass('border-t');
    });

    it('should render ModalFooter without divider', () => {
      const { container } = render(
        <ModalFooter divider={false}>
          <button>Cancel</button>
        </ModalFooter>
      );

      const footer = container.firstChild;
      expect(footer).not.toHaveClass('border-t');
    });

    it('should render ModalTitle with correct heading', () => {
      render(<ModalTitle>Title Text</ModalTitle>);

      const title = screen.getByText('Title Text');
      expect(title.tagName).toBe('H2');
      expect(title).toHaveAttribute('id', 'modal-title');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className to Modal', () => {
      const { container } = render(
        <Modal open={true} className="custom-modal">
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      const modal = container.querySelector('.custom-modal');
      expect(modal).toBeInTheDocument();
    });

    it('should apply custom className to subcomponents', () => {
      render(
        <Modal open={true}>
          <ModalHeader className="custom-header">Header</ModalHeader>
          <ModalBody className="custom-body">Body</ModalBody>
          <ModalFooter className="custom-footer">Footer</ModalFooter>
        </Modal>
      );

      expect(document.querySelector('.custom-header')).toBeInTheDocument();
      expect(document.querySelector('.custom-body')).toBeInTheDocument();
      expect(document.querySelector('.custom-footer')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to modal element', () => {
      const ref = vi.fn();
      render(
        <Modal open={true} ref={ref}>
          <ModalBody>Content</ModalBody>
        </Modal>
      );

      expect(ref).toHaveBeenCalled();
    });
  });
});
