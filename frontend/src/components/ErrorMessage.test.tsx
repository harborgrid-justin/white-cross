/**
 * Unit Tests for ErrorMessage Component
 *
 * Tests error message display component including:
 * - Error message rendering
 * - Retry functionality
 * - Accessibility
 * - Visual presentation
 *
 * @module components/ErrorMessage.test
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ErrorMessage } from './ErrorMessage';

expect.extend(toHaveNoViolations);

describe('ErrorMessage Component', () => {
  describe('Rendering', () => {
    it('should render error message', () => {
      render(<ErrorMessage message="An error occurred" />);
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <ErrorMessage message="Error" className="custom-class" />
      );
      const errorDiv = container.firstChild;
      expect(errorDiv).toHaveClass('custom-class');
    });

    it('should display error icon', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      // Check for AlertCircle icon (lucide-react)
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Retry Functionality', () => {
    it('should render retry button when onRetry is provided', () => {
      const handleRetry = jest.fn();
      render(<ErrorMessage message="Error" onRetry={handleRetry} />);

      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('should not render retry button when onRetry is not provided', () => {
      render(<ErrorMessage message="Error" />);

      expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', async () => {
      const user = userEvent.setup();
      const handleRetry = jest.fn();

      render(<ErrorMessage message="Error" onRetry={handleRetry} />);

      const retryButton = screen.getByRole('button', { name: /try again/i });
      await user.click(retryButton);

      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it('should allow multiple retry attempts', async () => {
      const user = userEvent.setup();
      const handleRetry = jest.fn();

      render(<ErrorMessage message="Error" onRetry={handleRetry} />);

      const retryButton = screen.getByRole('button', { name: /try again/i });

      await user.click(retryButton);
      await user.click(retryButton);
      await user.click(retryButton);

      expect(handleRetry).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('should have alert role', () => {
      render(<ErrorMessage message="Error" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should announce error to screen readers', () => {
      const { container } = render(<ErrorMessage message="Critical error" />);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Critical error');
    });

    it('should have no accessibility violations', async () => {
      const { container } = render(
        <ErrorMessage message="Accessibility test error" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with retry button', async () => {
      const { container } = render(
        <ErrorMessage message="Error with retry" onRetry={() => {}} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should be keyboard accessible for retry button', async () => {
      const user = userEvent.setup();
      const handleRetry = jest.fn();

      render(<ErrorMessage message="Error" onRetry={handleRetry} />);

      const retryButton = screen.getByRole('button', { name: /try again/i });
      retryButton.focus();

      expect(retryButton).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(handleRetry).toHaveBeenCalled();
    });
  });

  describe('Visual Presentation', () => {
    it('should have error styling', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      const errorDiv = container.firstChild;

      expect(errorDiv).toHaveClass('bg-red-50');
      expect(errorDiv).toHaveClass('border-red-200');
    });

    it('should display error message in red text', () => {
      const { container } = render(<ErrorMessage message="Error text" />);
      const messageElement = screen.getByText('Error text');

      expect(messageElement).toHaveClass('text-red-800');
    });

    it('should display icon in red color', () => {
      const { container } = render(<ErrorMessage message="Error" />);
      const icon = container.querySelector('svg');

      expect(icon).toHaveClass('text-red-600');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty message', () => {
      render(<ErrorMessage message="" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should handle long error messages', () => {
      const longMessage = 'This is a very long error message that should still be displayed properly without breaking the layout or causing issues with the component rendering. '.repeat(3);

      render(<ErrorMessage message={longMessage} />);
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should handle special characters in message', () => {
      const message = 'Error: <script>alert("xss")</script>';
      render(<ErrorMessage message={message} />);
      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('should handle undefined onRetry gracefully', () => {
      expect(() => {
        render(<ErrorMessage message="Error" onRetry={undefined} />);
      }).not.toThrow();
    });
  });
});
