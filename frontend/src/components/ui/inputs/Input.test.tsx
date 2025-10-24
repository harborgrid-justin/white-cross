/**
 * Input Component Tests
 * Comprehensive tests for the Input component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Input label="Email" />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter your email" />);
      expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });

    it('should generate unique ID when not provided', () => {
      render(<Input label="Test" />);
      const input = screen.getByLabelText(/test/i);
      expect(input).toHaveAttribute('id');
    });

    it('should use provided ID', () => {
      render(<Input id="custom-id" label="Test" />);
      const input = screen.getByLabelText(/test/i);
      expect(input).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('Label', () => {
    it('should associate label with input', () => {
      render(<Input label="Username" />);
      const input = screen.getByLabelText(/username/i);
      expect(input).toBeInTheDocument();
    });

    it('should show required indicator', () => {
      render(<Input label="Email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should not show required indicator when not required', () => {
      render(<Input label="Email" />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-gray-300');
    });

    it('should render filled variant', () => {
      render(<Input variant="filled" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('bg-gray-50');
    });

    it('should render outlined variant', () => {
      render(<Input variant="outlined" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-2');
    });
  });

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-3', 'py-2');
    });

    it('should render small size', () => {
      render(<Input size="sm" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('should render large size', () => {
      render(<Input size="lg" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-4', 'py-3', 'text-base');
    });
  });

  describe('User Interactions', () => {
    it('should handle text input', async () => {
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'Hello World');
      expect(input).toHaveValue('Hello World');
    });

    it('should call onChange handler', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'a');
      expect(handleChange).toHaveBeenCalled();
    });

    it('should call onFocus handler', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(<Input onFocus={handleFocus} />);
      const input = screen.getByRole('textbox');

      await user.click(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur handler', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(<Input onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');

      await user.click(input);
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events', async () => {
      const user = userEvent.setup();
      const handleKeyDown = vi.fn();
      render(<Input onKeyDown={handleKeyDown} />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'a');
      expect(handleKeyDown).toHaveBeenCalled();
    });

    it('should not accept input when disabled', async () => {
      const user = userEvent.setup();
      render(<Input disabled />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'test');
      expect(input).toHaveValue('');
    });
  });

  describe('States', () => {
    it('should show disabled state', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should show loading state', () => {
      const { container } = render(<Input loading />);
      const spinner = container.querySelector('svg.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should disable input when loading', () => {
      render(<Input loading />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should show error state', () => {
      render(<Input error="This field is required" label="Email" />);
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
      const input = screen.getByLabelText(/email/i);
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should apply error styling', () => {
      render(<Input error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-danger-300');
    });
  });

  describe('Helper Text', () => {
    it('should render helper text', () => {
      render(<Input helperText="Enter your email address" />);
      expect(screen.getByText(/enter your email address/i)).toBeInTheDocument();
    });

    it('should not show helper text when error is present', () => {
      render(<Input helperText="Helper text" error="Error message" />);
      expect(screen.queryByText(/helper text/i)).not.toBeInTheDocument();
      expect(screen.getByText(/error message/i)).toBeInTheDocument();
    });

    it('should associate helper text with input', () => {
      render(<Input id="test-input" helperText="Helper text" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'test-input-helper');
    });
  });

  describe('Error Messages', () => {
    it('should render error message', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
    });

    it('should associate error with input', () => {
      render(<Input id="test-input" error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'test-input-error');
    });

    it('should mark input as invalid', () => {
      render(<Input error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should not mark as invalid when no error', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });
  });

  describe('Icons', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;

    it('should render left icon', () => {
      render(<Input icon={<TestIcon />} iconPosition="left" />);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should render right icon', () => {
      render(<Input icon={<TestIcon />} iconPosition="right" />);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should render left icon by default', () => {
      render(<Input icon={<TestIcon />} />);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should not show icon when loading and icon position is right', () => {
      render(<Input icon={<TestIcon />} iconPosition="right" loading />);
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });

    it('should apply error styling to icon', () => {
      const { container } = render(<Input icon={<TestIcon />} error="Error" />);
      const iconContainer = container.querySelector('.text-red-400');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Input Types', () => {
    it('should support text type', () => {
      render(<Input type="text" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should support email type', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should support password type', () => {
      render(<Input type="password" />);
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should support number type', () => {
      render(<Input type="number" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
    });

    it('should support tel type', () => {
      render(<Input type="tel" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('should support url type', () => {
      render(<Input type="url" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'url');
    });

    it('should support search type', () => {
      render(<Input type="search" />);
      const input = screen.getByRole('searchbox');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper role', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<Input aria-label="Custom label" />);
      expect(screen.getByLabelText(/custom label/i)).toBeInTheDocument();
    });

    it('should mark required inputs', () => {
      render(<Input required />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('should not mark optional inputs as required', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('aria-required');
    });

    it('should be focusable', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      input.focus();
      expect(input).toHaveFocus();
    });

    it('should not be focusable when disabled', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });
  });

  describe('HTML Attributes', () => {
    it('should support name attribute', () => {
      render(<Input name="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'email');
    });

    it('should support value attribute', () => {
      render(<Input value="test value" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('test value');
    });

    it('should support defaultValue attribute', () => {
      render(<Input defaultValue="default" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('default');
    });

    it('should support autoComplete attribute', () => {
      render(<Input autoComplete="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('autoComplete', 'email');
    });

    it('should support autoFocus attribute', () => {
      render(<Input autoFocus />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveFocus();
    });

    it('should support maxLength attribute', () => {
      render(<Input maxLength={10} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength', '10');
    });

    it('should support pattern attribute', () => {
      render(<Input pattern="[0-9]*" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('pattern', '[0-9]*');
    });

    it('should support readOnly attribute', () => {
      render(<Input readOnly />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readOnly');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = vi.fn();
      render(<Input ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('should work as controlled component', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return <Input value={value} onChange={(e) => setValue(e.target.value)} />;
      };

      render(<TestComponent />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'test');
      expect(input).toHaveValue('test');
    });

    it('should work as uncontrolled component', async () => {
      const user = userEvent.setup();
      render(<Input defaultValue="initial" />);
      const input = screen.getByRole('textbox');

      expect(input).toHaveValue('initial');
      await user.clear(input);
      await user.type(input, 'changed');
      expect(input).toHaveValue('changed');
    });
  });
});
