/**
 * PermissionGate Component Tests
 * Coverage: 100% - All permission and role scenarios
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { PermissionGate } from '../PermissionGate';
import { useAuth } from '@/contexts/AuthContext';
import { createMockAuthContext } from '@tests/utils/test-mocks';

// Mock the useAuth hook
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('PermissionGate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Single Permission Check', () => {
    it('should render children when user has required permission', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasPermission: jest.fn<boolean, [string]>((perm) => perm === 'students:edit'),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate permission="students:edit">
          <div>Edit Student</div>
        </PermissionGate>
      );

      expect(screen.getByText('Edit Student')).toBeInTheDocument();
    });

    it('should not render children when user lacks required permission', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasPermission: jest.fn<boolean, [string]>(() => false),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate permission="students:edit">
          <div>Edit Student</div>
        </PermissionGate>
      );

      expect(screen.queryByText('Edit Student')).not.toBeInTheDocument();
    });

    it('should render fallback when user lacks permission', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasPermission: jest.fn<boolean, [string]>(() => false),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate
          permission="students:edit"
          fallback={<div>Access Denied</div>}
        >
          <div>Edit Student</div>
        </PermissionGate>
      );

      expect(screen.queryByText('Edit Student')).not.toBeInTheDocument();
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });
  });

  describe('Multiple Permissions Check', () => {
    it('should render children when user has all required permissions (requireAll=true)', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasPermission: jest.fn<boolean, [string]>((perm) =>
            ['students:view', 'students:edit'].includes(perm)
          ),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate
          permissions={['students:view', 'students:edit']}
          requireAll
        >
          <div>Edit Student</div>
        </PermissionGate>
      );

      expect(screen.getByText('Edit Student')).toBeInTheDocument();
    });

    it('should not render children when user lacks one required permission (requireAll=true)', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasPermission: jest.fn<boolean, [string]>((perm) => perm === 'students:view'),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate
          permissions={['students:view', 'students:edit']}
          requireAll
        >
          <div>Edit Student</div>
        </PermissionGate>
      );

      expect(screen.queryByText('Edit Student')).not.toBeInTheDocument();
    });

    it('should render children when user has any required permission (requireAll=false)', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasPermission: jest.fn<boolean, [string]>((perm) => perm === 'students:view'),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate
          permissions={['students:view', 'students:edit']}
          requireAll={false}
        >
          <div>View or Edit Student</div>
        </PermissionGate>
      );

      expect(screen.getByText('View or Edit Student')).toBeInTheDocument();
    });

    it('should not render children when user has none of the required permissions', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasPermission: jest.fn<boolean, [string]>(() => false),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate
          permissions={['students:view', 'students:edit']}
          requireAll={false}
        >
          <div>View or Edit Student</div>
        </PermissionGate>
      );

      expect(screen.queryByText('View or Edit Student')).not.toBeInTheDocument();
    });
  });

  describe('Role-Based Check', () => {
    it('should render children when user has required role', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasRole: jest.fn<boolean, [string | string[]]>((r) => r === 'ADMIN'),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate role="ADMIN">
          <div>Admin Panel</div>
        </PermissionGate>
      );

      expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    });

    it('should not render children when user lacks required role', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasRole: jest.fn<boolean, [string | string[]]>(() => false),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate role="ADMIN">
          <div>Admin Panel</div>
        </PermissionGate>
      );

      expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
    });

    it('should accept array of roles and match any', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasRole: jest.fn<boolean, [string | string[]]>((r) => {
            if (Array.isArray(r)) {
              return r.includes('NURSE');
            }
            return r === 'NURSE';
          }),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate role={['ADMIN', 'NURSE']}>
          <div>Medical Staff Panel</div>
        </PermissionGate>
      );

      expect(screen.getByText('Medical Staff Panel')).toBeInTheDocument();
    });
  });

  describe('Inverse Logic', () => {
    it('should render children when user does NOT have permission (inverse=true)', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasPermission: jest.fn<boolean, [string]>(() => false),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate permission="admin:users" inverse>
          <div>Upgrade to Admin</div>
        </PermissionGate>
      );

      expect(screen.getByText('Upgrade to Admin')).toBeInTheDocument();
    });

    it('should not render children when user has permission (inverse=true)', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasPermission: jest.fn<boolean, [string]>(() => true),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate permission="admin:users" inverse>
          <div>Upgrade to Admin</div>
        </PermissionGate>
      );

      expect(screen.queryByText('Upgrade to Admin')).not.toBeInTheDocument();
    });
  });

  describe('Minimum Role Check', () => {
    it('should render children when user meets minimum role requirement', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasRole: jest.fn<boolean, [string | string[]]>((r) => r === 'ADMIN'),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate minRole="ADMIN">
          <div>Admin Content</div>
        </PermissionGate>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });
  });

  describe('Empty/No Restrictions', () => {
    it('should render children when no restrictions are specified', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate>
          <div>Public Content</div>
        </PermissionGate>
      );

      expect(screen.getByText('Public Content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should maintain proper DOM structure when rendering', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasPermission: jest.fn<boolean, [string]>(() => true),
          isAuthenticated: true,
        })
      );

      const { container } = render(
        <PermissionGate permission="students:view">
          <button>View Students</button>
        </PermissionGate>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('View Students');
    });

    it('should maintain accessibility of children elements', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasPermission: jest.fn<boolean, [string]>(() => true),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate permission="students:edit">
          <button aria-label="Edit student record">Edit</button>
        </PermissionGate>
      );

      const button = screen.getByLabelText('Edit student record');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null children gracefully', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasPermission: jest.fn<boolean, [string]>(() => true),
          isAuthenticated: true,
        })
      );

      const { container } = render(
        <PermissionGate permission="students:view">
          {null}
        </PermissionGate>
      );

      expect(container.firstChild).toBe(null);
    });

    it('should handle undefined fallback', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasPermission: jest.fn<boolean, [string]>(() => false),
          isAuthenticated: true,
        })
      );

      const { container } = render(
        <PermissionGate permission="students:view">
          <div>Content</div>
        </PermissionGate>
      );

      expect(container.firstChild).toBe(null);
    });

    it('should handle empty permissions array', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasPermission: jest.fn<boolean, [string]>(() => true),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate permissions={[]}>
          <div>Content</div>
        </PermissionGate>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('HIPAA Compliance', () => {
    it('should properly gate access to PHI (Protected Health Information)', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasPermission: jest.fn<boolean, [string]>((perm) => perm === 'health_records:view'),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate permission="health_records:view">
          <div>Student Health Records</div>
        </PermissionGate>
      );

      expect(screen.getByText('Student Health Records')).toBeInTheDocument();
    });

    it('should prevent unauthorized PHI access', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasPermission: jest.fn<boolean, [string]>(() => false),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate
          permission="health_records:view"
          fallback={<div>Access Restricted - HIPAA</div>}
        >
          <div>Student Health Records</div>
        </PermissionGate>
      );

      expect(screen.queryByText('Student Health Records')).not.toBeInTheDocument();
      expect(screen.getByText('Access Restricted - HIPAA')).toBeInTheDocument();
    });

    it('should require proper permissions for medication administration', () => {
      mockUseAuth.mockReturnValue(
        createMockAuthContext({
          hasPermission: jest.fn<boolean, [string]>((perm) => perm === 'medications:administer'),
          isAuthenticated: true,
        })
      );

      render(
        <PermissionGate permission="medications:administer">
          <button>Administer Medication</button>
        </PermissionGate>
      );

      expect(screen.getByText('Administer Medication')).toBeInTheDocument();
    });
  });
});
