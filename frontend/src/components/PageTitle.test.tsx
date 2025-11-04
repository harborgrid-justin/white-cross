/**
 * Unit Tests for PageTitle Component
 *
 * Tests page title management component including:
 * - Document title updates
 * - Route-based title generation
 * - Dynamic title fallback
 * - Title format
 *
 * @module components/PageTitle.test
 */

import { render } from '@testing-library/react';
import { PageTitle } from './PageTitle';

// Mock next/navigation
const mockUsePathname = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

describe('PageTitle Component', () => {
  beforeEach(() => {
    // Reset document title before each test
    document.title = '';
    mockUsePathname.mockReturnValue('/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should not render any visible content', () => {
      const { container } = render(<PageTitle />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Title Updates', () => {
    it('should set title for home route', () => {
      mockUsePathname.mockReturnValue('/');
      render(<PageTitle />);

      expect(document.title).toBe('Home - White Cross Healthcare Platform');
    });

    it('should set title for dashboard route', () => {
      mockUsePathname.mockReturnValue('/dashboard');
      render(<PageTitle />);

      expect(document.title).toBe('Dashboard - White Cross Healthcare Platform');
    });

    it('should set title for students route', () => {
      mockUsePathname.mockReturnValue('/students');
      render(<PageTitle />);

      expect(document.title).toBe('Students - White Cross Healthcare Platform');
    });

    it('should set title for medications route', () => {
      mockUsePathname.mockReturnValue('/medications');
      render(<PageTitle />);

      expect(document.title).toBe('Medication Management - White Cross Healthcare Platform');
    });

    it('should set title for appointments route', () => {
      mockUsePathname.mockReturnValue('/appointments');
      render(<PageTitle />);

      expect(document.title).toBe('Appointments - White Cross Healthcare Platform');
    });

    it('should set title for incidents route', () => {
      mockUsePathname.mockReturnValue('/incidents');
      render(<PageTitle />);

      expect(document.title).toBe('Incident Reports - White Cross Healthcare Platform');
    });

    it('should set title for settings route', () => {
      mockUsePathname.mockReturnValue('/settings');
      render(<PageTitle />);

      expect(document.title).toBe('Settings - White Cross Healthcare Platform');
    });

    it('should set title for login route', () => {
      mockUsePathname.mockReturnValue('/login');
      render(<PageTitle />);

      expect(document.title).toBe('Login - White Cross Healthcare Platform');
    });
  });

  describe('Dynamic Title Generation', () => {
    it('should generate title for unmapped routes', () => {
      mockUsePathname.mockReturnValue('/custom-page');
      render(<PageTitle />);

      expect(document.title).toBe('Custom Page - White Cross Healthcare Platform');
    });

    it('should capitalize words in dynamic titles', () => {
      mockUsePathname.mockReturnValue('/health-records-overview');
      render(<PageTitle />);

      expect(document.title).toBe('Overview - White Cross Healthcare Platform');
    });

    it('should handle nested routes', () => {
      mockUsePathname.mockReturnValue('/students/123/edit');
      render(<PageTitle />);

      expect(document.title).toBe('Edit - White Cross Healthcare Platform');
    });

    it('should use last segment for nested routes', () => {
      mockUsePathname.mockReturnValue('/medications/prescriptions/new');
      render(<PageTitle />);

      expect(document.title).toBe('New - White Cross Healthcare Platform');
    });

    it('should handle routes with hyphens', () => {
      mockUsePathname.mockReturnValue('/emergency-contacts');
      render(<PageTitle />);

      expect(document.title).toBe('Contacts - White Cross Healthcare Platform');
    });
  });

  describe('Title Format', () => {
    it('should include platform suffix', () => {
      mockUsePathname.mockReturnValue('/dashboard');
      render(<PageTitle />);

      expect(document.title).toContain('White Cross Healthcare Platform');
    });

    it('should separate title and suffix with dash', () => {
      mockUsePathname.mockReturnValue('/dashboard');
      render(<PageTitle />);

      expect(document.title).toMatch(/^.+ - White Cross Healthcare Platform$/);
    });

    it('should not have double spaces in title', () => {
      mockUsePathname.mockReturnValue('/students');
      render(<PageTitle />);

      expect(document.title).not.toContain('  ');
    });
  });

  describe('Title Updates on Route Change', () => {
    it('should update title when route changes', () => {
      mockUsePathname.mockReturnValue('/dashboard');
      const { rerender } = render(<PageTitle />);

      expect(document.title).toBe('Dashboard - White Cross Healthcare Platform');

      mockUsePathname.mockReturnValue('/students');
      rerender(<PageTitle />);

      expect(document.title).toBe('Students - White Cross Healthcare Platform');
    });

    it('should update title multiple times', () => {
      mockUsePathname.mockReturnValue('/dashboard');
      const { rerender } = render(<PageTitle />);

      expect(document.title).toBe('Dashboard - White Cross Healthcare Platform');

      mockUsePathname.mockReturnValue('/medications');
      rerender(<PageTitle />);

      expect(document.title).toBe('Medication Management - White Cross Healthcare Platform');

      mockUsePathname.mockReturnValue('/appointments');
      rerender(<PageTitle />);

      expect(document.title).toBe('Appointments - White Cross Healthcare Platform');
    });
  });

  describe('Special Routes', () => {
    it('should handle new resource routes', () => {
      mockUsePathname.mockReturnValue('/students/new');
      render(<PageTitle />);

      expect(document.title).toBe('Add New Student - White Cross Healthcare Platform');
    });

    it('should handle create routes', () => {
      mockUsePathname.mockReturnValue('/incidents/new');
      render(<PageTitle />);

      expect(document.title).toBe('Create Incident Report - White Cross Healthcare Platform');
    });

    it('should handle forgot-password route', () => {
      mockUsePathname.mockReturnValue('/forgot-password');
      render(<PageTitle />);

      expect(document.title).toBe('Password Recovery - White Cross Healthcare Platform');
    });
  });

  describe('Edge Cases', () => {
    it('should handle root path', () => {
      mockUsePathname.mockReturnValue('/');
      render(<PageTitle />);

      expect(document.title).toBe('Home - White Cross Healthcare Platform');
    });

    it('should handle trailing slash', () => {
      mockUsePathname.mockReturnValue('/dashboard/');
      render(<PageTitle />);

      expect(document.title).toContain('White Cross Healthcare Platform');
    });

    it('should handle empty segments', () => {
      mockUsePathname.mockReturnValue('//dashboard//');
      render(<PageTitle />);

      expect(document.title).toContain('White Cross Healthcare Platform');
    });

    it('should handle very long route paths', () => {
      mockUsePathname.mockReturnValue('/very/long/nested/route/path/to/somewhere');
      render(<PageTitle />);

      expect(document.title).toBe('Somewhere - White Cross Healthcare Platform');
    });
  });

  describe('WCAG Compliance', () => {
    it('should provide page title for screen readers (WCAG 2.4.2)', () => {
      mockUsePathname.mockReturnValue('/dashboard');
      render(<PageTitle />);

      expect(document.title).toBeTruthy();
      expect(document.title.length).toBeGreaterThan(0);
    });

    it('should update title immediately on route change', () => {
      mockUsePathname.mockReturnValue('/dashboard');
      const { rerender } = render(<PageTitle />);

      const initialTitle = document.title;

      mockUsePathname.mockReturnValue('/students');
      rerender(<PageTitle />);

      expect(document.title).not.toBe(initialTitle);
    });
  });
});
