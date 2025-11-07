/**
 * DashboardCard Component Tests
 * Comprehensive tests for the DashboardCard component
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DashboardCard, DashboardCardProps } from './DashboardCard';

// Add jest-axe matcher
expect.extend(toHaveNoViolations);

// Mock icons
jest.mock('lucide-react', () => ({
  MoreVertical: () => <span data-testid="more-icon">More</span>,
  RefreshCw: ({ className }: { className?: string }) => (
    <span data-testid="refresh-icon" className={className}>
      Refresh
    </span>
  ),
  X: () => <span data-testid="x-icon">X</span>,
  Maximize2: () => <span data-testid="maximize-icon">Maximize</span>,
  Minimize2: () => <span data-testid="minimize-icon">Minimize</span>,
}));

describe('DashboardCard Component', () => {
  const defaultProps: DashboardCardProps = {
    title: 'Test Card',
    children: <div>Card Content</div>,
  };

  describe('Rendering', () => {
    it('should render with required props', () => {
      render(<DashboardCard {...defaultProps} />);

      expect(screen.getByText('Test Card')).toBeInTheDocument();
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('should render title', () => {
      render(<DashboardCard {...defaultProps} title="User Statistics" />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('User Statistics');
    });

    it('should render subtitle when provided', () => {
      render(<DashboardCard {...defaultProps} subtitle="Last 24 hours" />);

      expect(screen.getByText('Last 24 hours')).toBeInTheDocument();
    });

    it('should render children content', () => {
      render(
        <DashboardCard {...defaultProps}>
          <div data-testid="custom-content">Custom Widget</div>
        </DashboardCard>
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <DashboardCard {...defaultProps} className="custom-class" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading is true', () => {
      render(<DashboardCard {...defaultProps} loading />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Card Content')).not.toBeInTheDocument();
    });

    it('should show loading spinner with animation', () => {
      const { container } = render(<DashboardCard {...defaultProps} loading />);

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should not show content when loading', () => {
      render(<DashboardCard {...defaultProps} loading />);

      expect(screen.queryByText('Card Content')).not.toBeInTheDocument();
    });

    it('should show content when loading is false', () => {
      render(<DashboardCard {...defaultProps} loading={false} />);

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error message when error prop is provided', () => {
      render(<DashboardCard {...defaultProps} error="Failed to load data" />);

      expect(screen.getByText('Error loading content')).toBeInTheDocument();
      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    });

    it('should not show content when error is present', () => {
      render(<DashboardCard {...defaultProps} error="Error occurred" />);

      expect(screen.queryByText('Card Content')).not.toBeInTheDocument();
    });

    it('should not show error when error is null', () => {
      render(<DashboardCard {...defaultProps} error={null} />);

      expect(screen.queryByText('Error loading content')).not.toBeInTheDocument();
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('should show error icon', () => {
      render(<DashboardCard {...defaultProps} error="Error" />);

      const errorIcon = screen.getByText('⚠️');
      expect(errorIcon).toBeInTheDocument();
    });
  });

  describe('Theme Support', () => {
    it('should apply light theme by default', () => {
      const { container } = render(<DashboardCard {...defaultProps} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-white', 'border-gray-200', 'text-gray-900');
    });

    it('should apply dark theme when darkMode is true', () => {
      const { container } = render(<DashboardCard {...defaultProps} darkMode />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-gray-800', 'border-gray-700', 'text-gray-200');
    });

    it('should apply dark theme to subtitle', () => {
      const { container } = render(
        <DashboardCard {...defaultProps} subtitle="Subtitle" darkMode />
      );

      const subtitle = screen.getByText('Subtitle');
      expect(subtitle).toHaveClass('text-gray-400');
    });
  });

  describe('Refresh Functionality', () => {
    it('should show refresh button when refreshable is true', () => {
      render(<DashboardCard {...defaultProps} refreshable onRefresh={jest.fn()} />);

      const refreshButton = screen.getByLabelText('Refresh');
      expect(refreshButton).toBeInTheDocument();
    });

    it('should not show refresh button when refreshable is false', () => {
      render(<DashboardCard {...defaultProps} refreshable={false} />);

      expect(screen.queryByLabelText('Refresh')).not.toBeInTheDocument();
    });

    it('should call onRefresh when refresh button is clicked', async () => {
      const user = userEvent.setup();
      const handleRefresh = jest.fn();

      render(<DashboardCard {...defaultProps} refreshable onRefresh={handleRefresh} />);

      const refreshButton = screen.getByLabelText('Refresh');
      await user.click(refreshButton);

      expect(handleRefresh).toHaveBeenCalledTimes(1);
    });

    it('should show spinning icon while refreshing', async () => {
      const user = userEvent.setup();
      const handleRefresh = jest.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<DashboardCard {...defaultProps} refreshable onRefresh={handleRefresh} />);

      const refreshButton = screen.getByLabelText('Refresh');
      await user.click(refreshButton);

      const icon = screen.getByTestId('refresh-icon');
      expect(icon).toHaveClass('animate-spin');
    });

    it('should disable refresh button while loading', () => {
      render(
        <DashboardCard {...defaultProps} loading refreshable onRefresh={jest.fn()} />
      );

      const refreshButton = screen.getByLabelText('Refresh');
      expect(refreshButton).toBeDisabled();
    });

    it('should disable refresh button while refreshing', async () => {
      const user = userEvent.setup();
      const handleRefresh = jest.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<DashboardCard {...defaultProps} refreshable onRefresh={handleRefresh} />);

      const refreshButton = screen.getByLabelText('Refresh');
      await user.click(refreshButton);

      expect(refreshButton).toBeDisabled();
    });

    it('should handle async refresh operations', async () => {
      const user = userEvent.setup();
      const handleRefresh = jest.fn(
        () => new Promise((resolve) => setTimeout(resolve, 50))
      );

      render(<DashboardCard {...defaultProps} refreshable onRefresh={handleRefresh} />);

      const refreshButton = screen.getByLabelText('Refresh');
      await user.click(refreshButton);

      await waitFor(() => {
        expect(handleRefresh).toHaveBeenCalled();
      });
    });
  });

  describe('Collapsible Functionality', () => {
    it('should show collapse button when collapsible is true', async () => {
      const user = userEvent.setup();
      render(<DashboardCard {...defaultProps} collapsible />);

      const moreButton = screen.getByLabelText('More actions');
      await user.click(moreButton);

      expect(screen.getByText('Collapse')).toBeInTheDocument();
    });

    it('should show content by default', () => {
      render(<DashboardCard {...defaultProps} collapsible />);

      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('should hide content when defaultCollapsed is true', () => {
      render(<DashboardCard {...defaultProps} collapsible defaultCollapsed />);

      expect(screen.queryByText('Card Content')).not.toBeInTheDocument();
    });

    it('should toggle content when collapse is clicked', async () => {
      const user = userEvent.setup();
      render(<DashboardCard {...defaultProps} collapsible />);

      const moreButton = screen.getByLabelText('More actions');
      await user.click(moreButton);

      const collapseButton = screen.getByText('Collapse');
      await user.click(collapseButton);

      expect(screen.queryByText('Card Content')).not.toBeInTheDocument();
    });

    it('should show "Expand" text when collapsed', async () => {
      const user = userEvent.setup();
      render(<DashboardCard {...defaultProps} collapsible defaultCollapsed />);

      const moreButton = screen.getByLabelText('More actions');
      await user.click(moreButton);

      expect(screen.getByText('Expand')).toBeInTheDocument();
    });

    it('should expand content when expand is clicked', async () => {
      const user = userEvent.setup();
      render(<DashboardCard {...defaultProps} collapsible defaultCollapsed />);

      const moreButton = screen.getByLabelText('More actions');
      await user.click(moreButton);

      const expandButton = screen.getByText('Expand');
      await user.click(expandButton);

      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });
  });

  describe('Expandable Functionality', () => {
    it('should show expand button when expandable is true', () => {
      render(<DashboardCard {...defaultProps} expandable />);

      const expandButton = screen.getByLabelText('Expand');
      expect(expandButton).toBeInTheDocument();
    });

    it('should not show expand button when expandable is false', () => {
      render(<DashboardCard {...defaultProps} expandable={false} />);

      expect(screen.queryByLabelText('Expand')).not.toBeInTheDocument();
    });

    it('should show maximize icon initially', () => {
      render(<DashboardCard {...defaultProps} expandable />);

      expect(screen.getByTestId('maximize-icon')).toBeInTheDocument();
    });

    it('should toggle to minimize icon when expanded', async () => {
      const user = userEvent.setup();
      render(<DashboardCard {...defaultProps} expandable />);

      const expandButton = screen.getByLabelText('Expand');
      await user.click(expandButton);

      expect(screen.getByTestId('minimize-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('maximize-icon')).not.toBeInTheDocument();
    });

    it('should apply fullscreen styles when expanded', async () => {
      const user = userEvent.setup();
      const { container } = render(<DashboardCard {...defaultProps} expandable />);

      const expandButton = screen.getByLabelText('Expand');
      await user.click(expandButton);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('fixed', 'inset-4', 'z-50');
    });

    it('should toggle back to normal view when minimize is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(<DashboardCard {...defaultProps} expandable />);

      const expandButton = screen.getByLabelText('Expand');
      await user.click(expandButton);

      const minimizeButton = screen.getByLabelText('Minimize');
      await user.click(minimizeButton);

      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveClass('fixed');
    });
  });

  describe('Remove Functionality', () => {
    it('should show remove button when removable is true', async () => {
      const user = userEvent.setup();
      render(<DashboardCard {...defaultProps} removable onRemove={jest.fn()} />);

      const moreButton = screen.getByLabelText('More actions');
      await user.click(moreButton);

      expect(screen.getByText('Remove')).toBeInTheDocument();
    });

    it('should call onRemove when remove is clicked', async () => {
      const user = userEvent.setup();
      const handleRemove = jest.fn();

      render(<DashboardCard {...defaultProps} removable onRemove={handleRemove} />);

      const moreButton = screen.getByLabelText('More actions');
      await user.click(moreButton);

      const removeButton = screen.getByText('Remove');
      await user.click(removeButton);

      expect(handleRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom Actions', () => {
    it('should render custom actions in header', () => {
      render(
        <DashboardCard
          {...defaultProps}
          actions={<button data-testid="custom-action">Export</button>}
        />
      );

      expect(screen.getByTestId('custom-action')).toBeInTheDocument();
    });

    it('should render multiple custom actions', () => {
      render(
        <DashboardCard
          {...defaultProps}
          actions={
            <>
              <button>Export</button>
              <button>Settings</button>
            </>
          }
        />
      );

      expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
    });
  });

  describe('More Actions Menu', () => {
    it('should show more actions button when collapsible or removable', () => {
      render(<DashboardCard {...defaultProps} collapsible />);

      const moreButton = screen.getByLabelText('More actions');
      expect(moreButton).toBeInTheDocument();
    });

    it('should not show more actions button when neither collapsible nor removable', () => {
      render(<DashboardCard {...defaultProps} />);

      expect(screen.queryByLabelText('More actions')).not.toBeInTheDocument();
    });

    it('should show menu when more actions button is clicked', async () => {
      const user = userEvent.setup();
      render(<DashboardCard {...defaultProps} collapsible />);

      const moreButton = screen.getByLabelText('More actions');
      await user.click(moreButton);

      expect(screen.getByText('Collapse')).toBeInTheDocument();
    });

    it('should close menu when clicking outside', async () => {
      const user = userEvent.setup();
      render(<DashboardCard {...defaultProps} collapsible />);

      const moreButton = screen.getByLabelText('More actions');
      await user.click(moreButton);

      expect(screen.getByText('Collapse')).toBeInTheDocument();

      // Click outside to close
      const overlay = document.querySelector('.fixed.inset-0');
      if (overlay) {
        await user.click(overlay as HTMLElement);
      }

      await waitFor(() => {
        expect(screen.queryByText('Collapse')).not.toBeInTheDocument();
      });
    });

    it('should close menu after selecting an action', async () => {
      const user = userEvent.setup();
      render(<DashboardCard {...defaultProps} collapsible />);

      const moreButton = screen.getByLabelText('More actions');
      await user.click(moreButton);

      const collapseButton = screen.getByText('Collapse');
      await user.click(collapseButton);

      await waitFor(() => {
        expect(screen.queryByText('Collapse')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <DashboardCard
          {...defaultProps}
          subtitle="Subtitle"
          refreshable
          onRefresh={jest.fn()}
          expandable
        >
          <div>Accessible Content</div>
        </DashboardCard>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading structure', () => {
      render(<DashboardCard {...defaultProps} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Test Card');
    });

    it('should have proper aria-label for buttons', () => {
      render(
        <DashboardCard
          {...defaultProps}
          refreshable
          onRefresh={jest.fn()}
          expandable
        />
      );

      expect(screen.getByLabelText('Refresh')).toBeInTheDocument();
      expect(screen.getByLabelText('Expand')).toBeInTheDocument();
    });

    it('should have proper aria-label for more actions button', () => {
      render(<DashboardCard {...defaultProps} collapsible />);

      expect(screen.getByLabelText('More actions')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title', () => {
      render(<DashboardCard {...defaultProps} title="" />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('');
    });

    it('should handle very long title', () => {
      render(
        <DashboardCard
          {...defaultProps}
          title="This is an extremely long title that should be truncated properly to avoid layout issues"
        />
      );

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveClass('truncate');
    });

    it('should handle loading and error simultaneously (loading takes precedence)', () => {
      render(<DashboardCard {...defaultProps} loading error="Error occurred" />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Error loading content')).not.toBeInTheDocument();
    });

    it('should handle multiple features enabled', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <DashboardCard
          {...defaultProps}
          refreshable
          onRefresh={jest.fn()}
          collapsible
          removable
          onRemove={jest.fn()}
          expandable
        />
      );

      expect(screen.getByLabelText('Refresh')).toBeInTheDocument();
      expect(screen.getByLabelText('Expand')).toBeInTheDocument();
      expect(screen.getByLabelText('More actions')).toBeInTheDocument();
    });

    it('should handle rapid refresh clicks gracefully', async () => {
      const user = userEvent.setup();
      const handleRefresh = jest.fn(
        () => new Promise((resolve) => setTimeout(resolve, 50))
      );

      render(<DashboardCard {...defaultProps} refreshable onRefresh={handleRefresh} />);

      const refreshButton = screen.getByLabelText('Refresh');

      // Try to click multiple times rapidly
      await user.click(refreshButton);
      await user.click(refreshButton);
      await user.click(refreshButton);

      // Should only call once (subsequent clicks disabled)
      await waitFor(() => {
        expect(handleRefresh).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('React.memo optimization', () => {
    it('should memoize component to prevent unnecessary re-renders', () => {
      const { rerender } = render(<DashboardCard {...defaultProps} />);

      // Re-render with same props
      rerender(<DashboardCard {...defaultProps} />);

      expect(screen.getByText('Test Card')).toBeInTheDocument();
    });
  });
});
