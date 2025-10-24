/**
 * Button Component Tests
 * Comprehensive tests for the Button component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('should render button without children', () => {
      render(<Button aria-label="Icon button" />);
      expect(screen.getByRole('button', { name: /icon button/i })).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Button className="custom-class">Button</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Variants', () => {
    it('should render primary variant by default', () => {
      const { container } = render(<Button>Primary</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-primary-600');
    });

    it('should render secondary variant', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-secondary-600');
    });

    it('should render outline variant', () => {
      const { container } = render(<Button variant="outline">Outline</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('border-2');
    });

    it('should render destructive variant', () => {
      const { container } = render(<Button variant="destructive">Delete</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-danger-600');
    });

    it('should render ghost variant', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-transparent');
    });

    it('should render link variant', () => {
      const { container } = render(<Button variant="link">Link</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('text-primary-600');
    });
  });

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      const { container } = render(<Button>Medium</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('px-4', 'py-2');
    });

    it('should render extra small size', () => {
      const { container } = render(<Button size="xs">Extra Small</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('px-2', 'py-1', 'text-xs');
    });

    it('should render small size', () => {
      const { container } = render(<Button size="sm">Small</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('should render large size', () => {
      const { container } = render(<Button size="lg">Large</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-base');
    });

    it('should render extra large size', () => {
      const { container } = render(<Button size="xl">Extra Large</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('px-8', 'py-4', 'text-lg');
    });
  });

  describe('User Interactions', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick} disabled>Disabled</Button>);
      const button = screen.getByRole('button', { name: /disabled/i });

      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick} loading>Loading</Button>);
      const button = screen.getByRole('button', { name: /loading/i });

      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should handle keyboard navigation (Enter)', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Press Enter</Button>);
      const button = screen.getByRole('button', { name: /press enter/i });

      button.focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard navigation (Space)', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Press Space</Button>);
      const button = screen.getByRole('button', { name: /press space/i });

      button.focus();
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('States', () => {
    it('should show disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button', { name: /disabled/i });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should show loading state', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button', { name: /loading/i });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('should render loading spinner when loading', () => {
      const { container } = render(<Button loading>Loading</Button>);
      const spinner = container.querySelector('svg.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should disable button when loading', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Icons', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;

    it('should render left icon', () => {
      render(<Button icon={<TestIcon />} iconPosition="left">With Icon</Button>);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should render right icon', () => {
      render(<Button icon={<TestIcon />} iconPosition="right">With Icon</Button>);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should render leftIcon (backward compatibility)', () => {
      render(<Button leftIcon={<TestIcon />}>With Left Icon</Button>);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should render rightIcon (backward compatibility)', () => {
      render(<Button rightIcon={<TestIcon />}>With Right Icon</Button>);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should not render icon when loading', () => {
      render(<Button icon={<TestIcon />} loading>Loading</Button>);
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });

    it('should render icon only without children', () => {
      render(<Button icon={<TestIcon />} aria-label="Icon only" />);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });

  describe('Full Width', () => {
    it('should render full width button', () => {
      const { container } = render(<Button fullWidth>Full Width</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('w-full');
    });

    it('should not render full width by default', () => {
      const { container } = render(<Button>Normal Width</Button>);
      const button = container.querySelector('button');
      expect(button).not.toHaveClass('w-full');
    });
  });

  describe('Accessibility', () => {
    it('should have proper role', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<Button aria-label="Custom label">Button</Button>);
      expect(screen.getByRole('button', { name: /custom label/i })).toBeInTheDocument();
    });

    it('should support aria-describedby', () => {
      render(
        <div>
          <Button aria-describedby="description">Button</Button>
          <span id="description">Description text</span>
        </div>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });

    it('should have aria-disabled when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have aria-busy when loading', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('should be focusable', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should not be focusable when disabled', () => {
      render(<Button disabled>Not focusable</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('HTML Attributes', () => {
    it('should support type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should support name attribute', () => {
      render(<Button name="action">Action</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('name', 'action');
    });

    it('should support value attribute', () => {
      render(<Button value="buttonValue">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('value', 'buttonValue');
    });

    it('should support data attributes', () => {
      render(<Button data-testid="custom-button">Button</Button>);
      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to button element', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Button</Button>);
      expect(ref).toHaveBeenCalled();
    });
  });
});
