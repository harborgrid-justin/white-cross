/**
 * PageHeader Component Tests
 * Comprehensive tests for the PageHeader and SectionHeader components
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { PageHeader, SectionHeader } from './PageHeader';

// Add jest-axe matcher
expect.extend(toHaveNoViolations);

describe('PageHeader Component', () => {
  describe('Rendering', () => {
    it('should render with title only', () => {
      render(<PageHeader title="Students" />);

      const heading = screen.getByRole('heading', { level: 1, name: /students/i });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass('text-3xl', 'font-bold');
    });

    it('should render with title and description', () => {
      render(
        <PageHeader
          title="Student Health Records"
          description="Manage and view student health information"
        />
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Student Health Records'
      );
      expect(screen.getByText('Manage and view student health information')).toBeInTheDocument();
    });

    it('should render with actions', () => {
      render(
        <PageHeader
          title="Medications"
          actions={<button data-testid="add-button">Add Medication</button>}
        />
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Medications');
      expect(screen.getByTestId('add-button')).toBeInTheDocument();
    });

    it('should render with all props', () => {
      render(
        <PageHeader
          title="Dashboard"
          description="View key metrics and recent activity"
          actions={
            <>
              <button>Export</button>
              <button>Settings</button>
            </>
          }
        />
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard');
      expect(screen.getByText('View key metrics and recent activity')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<PageHeader title="Test" className="custom-class" />);

      const headerContainer = container.querySelector('.custom-class');
      expect(headerContainer).toBeInTheDocument();
    });
  });

  describe('Heading Hierarchy', () => {
    it('should render h1 element', () => {
      render(<PageHeader title="Main Page Title" />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
    });

    it('should have only one h1 per page', () => {
      render(<PageHeader title="Unique H1" />);

      const headings = screen.getAllByRole('heading', { level: 1 });
      expect(headings).toHaveLength(1);
    });

    it('should have proper text hierarchy', () => {
      render(
        <PageHeader
          title="Main Title"
          description="Supporting description text"
        />
      );

      const heading = screen.getByRole('heading', { level: 1 });
      const description = screen.getByText('Supporting description text');

      expect(heading).toHaveClass('text-3xl');
      expect(description).toHaveClass('text-base');
    });
  });

  describe('Divider', () => {
    it('should show divider by default', () => {
      const { container } = render(<PageHeader title="Test" />);

      const divider = container.querySelector('.border-b');
      expect(divider).toBeInTheDocument();
    });

    it('should show divider when showDivider is true', () => {
      const { container } = render(<PageHeader title="Test" showDivider={true} />);

      const divider = container.querySelector('.border-b');
      expect(divider).toBeInTheDocument();
    });

    it('should hide divider when showDivider is false', () => {
      const { container } = render(<PageHeader title="Test" showDivider={false} />);

      const divider = container.querySelector('.border-b');
      expect(divider).not.toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should have flex layout for title and actions', () => {
      const { container } = render(
        <PageHeader title="Test" actions={<button>Action</button>} />
      );

      const flexContainer = container.querySelector('.flex.items-center.justify-between');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should have proper spacing', () => {
      const { container } = render(
        <PageHeader
          title="Test"
          description="Description"
          actions={<button>Action</button>}
        />
      );

      const mainContainer = container.querySelector('.mb-6');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should handle long titles without breaking layout', () => {
      render(
        <PageHeader
          title="This is a very long title that should wrap properly and not break the layout or overflow"
          actions={<button>Action</button>}
        />
      );

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <PageHeader
          title="Accessible Page"
          description="This page meets WCAG standards"
          actions={<button>Add Item</button>}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should provide proper document structure', () => {
      render(<PageHeader title="Document Structure" />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should associate description with title', () => {
      const { container } = render(
        <PageHeader title="Title" description="Description" />
      );

      const heading = screen.getByRole('heading', { level: 1 });
      const description = screen.getByText('Description');

      // Description should be near title in DOM
      const parent = description.closest('div');
      expect(parent).toContainElement(heading);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string title', () => {
      render(<PageHeader title="" />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('');
    });

    it('should handle special characters in title', () => {
      render(<PageHeader title="Special & Characters: <Test>" />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Special & Characters: <Test>'
      );
    });

    it('should handle unicode in title', () => {
      render(<PageHeader title="Unicode: 你好 мир 🎉" />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Unicode: 你好 мир 🎉'
      );
    });

    it('should handle multiple action buttons', () => {
      render(
        <PageHeader
          title="Test"
          actions={
            <>
              <button>Action 1</button>
              <button>Action 2</button>
              <button>Action 3</button>
            </>
          }
        />
      );

      expect(screen.getByRole('button', { name: /action 1/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /action 2/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /action 3/i })).toBeInTheDocument();
    });

    it('should handle complex action elements', () => {
      render(
        <PageHeader
          title="Test"
          actions={
            <div>
              <select>
                <option>Option 1</option>
              </select>
              <button>Submit</button>
            </div>
          }
        />
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });
  });
});

describe('SectionHeader Component', () => {
  describe('Rendering', () => {
    it('should render with title only', () => {
      render(<SectionHeader title="Section Title" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Section Title');
    });

    it('should render with description', () => {
      render(
        <SectionHeader title="Overview" description="Summary of key information" />
      );

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Overview');
      expect(screen.getByText('Summary of key information')).toBeInTheDocument();
    });

    it('should render with actions', () => {
      render(
        <SectionHeader title="Users" actions={<button>Add User</button>} />
      );

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Users');
      expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <SectionHeader title="Test" className="section-custom" />
      );

      expect(container.querySelector('.section-custom')).toBeInTheDocument();
    });
  });

  describe('Heading Levels', () => {
    it('should render h2 by default', () => {
      render(<SectionHeader title="Default H2" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading.tagName).toBe('H2');
    });

    it('should render h3 when level is 3', () => {
      render(<SectionHeader title="H3 Heading" level={3} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading.tagName).toBe('H3');
    });

    it('should render h4 when level is 4', () => {
      render(<SectionHeader title="H4 Heading" level={4} />);

      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading.tagName).toBe('H4');
    });

    it('should render h5 when level is 5', () => {
      render(<SectionHeader title="H5 Heading" level={5} />);

      const heading = screen.getByRole('heading', { level: 5 });
      expect(heading.tagName).toBe('H5');
    });

    it('should render h6 when level is 6', () => {
      render(<SectionHeader title="H6 Heading" level={6} />);

      const heading = screen.getByRole('heading', { level: 6 });
      expect(heading.tagName).toBe('H6');
    });

    it('should apply correct text size for h2', () => {
      render(<SectionHeader title="H2" level={2} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-2xl', 'font-semibold');
    });

    it('should apply correct text size for h3', () => {
      render(<SectionHeader title="H3" level={3} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveClass('text-xl', 'font-semibold');
    });

    it('should apply correct text size for h4', () => {
      render(<SectionHeader title="H4" level={4} />);

      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toHaveClass('text-lg', 'font-semibold');
    });

    it('should apply correct text size for h5', () => {
      render(<SectionHeader title="H5" level={5} />);

      const heading = screen.getByRole('heading', { level: 5 });
      expect(heading).toHaveClass('text-base', 'font-semibold');
    });

    it('should apply correct text size for h6', () => {
      render(<SectionHeader title="H6" level={6} />);

      const heading = screen.getByRole('heading', { level: 6 });
      expect(heading).toHaveClass('text-sm', 'font-semibold');
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <SectionHeader
          title="Accessible Section"
          description="Section description"
          actions={<button>Action</button>}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should maintain proper heading hierarchy', () => {
      const { container } = render(
        <>
          <PageHeader title="Main Page" />
          <SectionHeader title="Section 1" level={2} />
          <SectionHeader title="Subsection 1.1" level={3} />
          <SectionHeader title="Subsection 1.2" level={3} />
          <SectionHeader title="Section 2" level={2} />
        </>
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Main Page');
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
    });
  });

  describe('Layout', () => {
    it('should have proper spacing', () => {
      const { container } = render(<SectionHeader title="Test" />);

      const mainContainer = container.querySelector('.mb-4');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should align actions properly', () => {
      const { container } = render(
        <SectionHeader title="Test" actions={<button>Action</button>} />
      );

      const actionsContainer = container.querySelector('.flex.items-center.space-x-2');
      expect(actionsContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title', () => {
      render(<SectionHeader title="" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('');
    });

    it('should handle very long titles', () => {
      render(
        <SectionHeader
          title="This is an extremely long section title that might wrap to multiple lines"
          actions={<button>Action</button>}
        />
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});

describe('PageHeader and SectionHeader Integration', () => {
  it('should work together with proper hierarchy', () => {
    const { container } = render(
      <>
        <PageHeader title="Main Page Title" description="Page description" />
        <SectionHeader title="Section 1" level={2} />
        <SectionHeader title="Subsection 1.1" level={3} />
      </>
    );

    const h1 = screen.getByRole('heading', { level: 1 });
    const h2 = screen.getByRole('heading', { level: 2 });
    const h3 = screen.getByRole('heading', { level: 3 });

    expect(h1).toHaveTextContent('Main Page Title');
    expect(h2).toHaveTextContent('Section 1');
    expect(h3).toHaveTextContent('Subsection 1.1');
  });

  it('should maintain accessibility with multiple headers', async () => {
    const { container } = render(
      <>
        <PageHeader title="Dashboard" />
        <SectionHeader title="Statistics" level={2} />
        <SectionHeader title="Recent Activity" level={2} />
      </>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
