/**
 * LoadingSpinner Component Tests
 * Comprehensive tests for the LoadingSpinner component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  describe('Rendering', () => {
    it('should render spinner', () => {
      const { container } = render(<LoadingSpinner />);
      const spinner = container.querySelector('[role="status"]');
      expect(spinner).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<LoadingSpinner className="custom-class" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });

    it('should have spinning animation', () => {
      const { container } = render(<LoadingSpinner />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      const { container } = render(<LoadingSpinner />);
      const spinner = container.querySelector('.h-8');
      expect(spinner).toBeInTheDocument();
    });

    it('should render small size', () => {
      const { container } = render(<LoadingSpinner size="sm" />);
      const spinner = container.querySelector('.h-4');
      expect(spinner).toBeInTheDocument();
    });

    it('should render large size', () => {
      const { container } = render(<LoadingSpinner size="lg" />);
      const spinner = container.querySelector('.h-12');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Text', () => {
    it('should not render text by default', () => {
      render(<LoadingSpinner />);
      const text = document.querySelector('p');
      expect(text).not.toBeInTheDocument();
    });

    it('should render text when provided', () => {
      render(<LoadingSpinner text="Loading data..." />);
      expect(screen.getByText(/loading data/i)).toBeInTheDocument();
    });

    it('should render custom loading message', () => {
      render(<LoadingSpinner text="Please wait while we fetch your data" />);
      expect(screen.getByText(/please wait while we fetch your data/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      const { container } = render(<LoadingSpinner />);
      const spinner = container.querySelector('[role="status"]');
      expect(spinner).toBeInTheDocument();
    });

    it('should have aria-label', () => {
      const { container } = render(<LoadingSpinner />);
      const spinner = container.querySelector('[aria-label="Loading"]');
      expect(spinner).toBeInTheDocument();
    });

    it('should be perceivable by screen readers', () => {
      const { container } = render(<LoadingSpinner />);
      const spinner = container.querySelector('[role="status"]');
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });
  });

  describe('Layout', () => {
    it('should center content', () => {
      const { container } = render(<LoadingSpinner />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('should use flex column layout', () => {
      const { container } = render(<LoadingSpinner />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('flex-col');
    });
  });

  describe('Styling', () => {
    it('should have blue color', () => {
      const { container } = render(<LoadingSpinner />);
      const spinner = container.querySelector('.border-blue-600');
      expect(spinner).toBeInTheDocument();
    });

    it('should have rounded shape', () => {
      const { container } = render(<LoadingSpinner />);
      const spinner = container.querySelector('.rounded-full');
      expect(spinner).toBeInTheDocument();
    });

    it('should have transparent top border for spin effect', () => {
      const { container } = render(<LoadingSpinner />);
      const spinner = container.querySelector('.border-t-transparent');
      expect(spinner).toBeInTheDocument();
    });
  });
});
