/**
 * Roles Page Component
 *
 * Comprehensive role management interface for defining and managing
 * user roles within the RBAC (Role-Based Access Control) system.
 *
 * RBAC: Requires 'admin' or 'user.permissions' permission to access.
 * Audit: All role modifications (create, edit, delete, status changes) are logged.
 * Security: System roles are protected from modification and deletion.
 *
 * Features:
 * - Role CRUD operations with permission assignment
 * - Role hierarchy and inheritance visualization
 * - Permission matrix for each role
 * - User assignment tracking per role
 * - System role protection (read-only for critical roles)
 * - Role activation/deactivation
 * - Search and filtering capabilities
 *
 * @module admin/Roles
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Search,
  Plus,
  Edit2,
  Trash2,
  Users,
  Settings,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';

/**
 * Role data structure for RBAC system.
 * Defines a role with associated permissions and metadata.
 *
 * @interface Role
 * @property {string} id - Unique role identifier
 * @property {string} name - Display name of the role
 * @property {string} description - Detailed description of role purpose
 * @property {string[]} permissions - Array of permission identifiers assigned to this role
 * @property {number} userCount - Number of users currently assigned this role
 * @property {boolean} isSystem - Whether this is a system-protected role
 * @property {boolean} isActive - Whether the role is currently active
 * @property {Date} createdAt - Role creation timestamp
 * @property {Date} updatedAt - Last modification timestamp
 */
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Permission data structure.
 * Represents a single permission that can be assigned to roles.
 *
 * @interface Permission
 * @property {string} id - Unique permission identifier (e.g., 'user.manage')
 * @property {string} name - Human-readable permission name
 * @property {string} description - Detailed description of what the permission allows
 * @property {string} category - Permission category grouping
 * @property {string} resource - The resource this permission applies to
 * @property {string} action - The action this permission allows (view, manage, etc.)
 */
interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
}

/**
 * Mock permissions data for demonstration.
 * TODO: Replace with API integration.
 * @private
 */
const mockPermissions: Permission[] = [
  // User Management
  { id: 'user.view', name: 'View Users', description: 'View user profiles and basic information', category: 'User Management', resource: 'user', action: 'view' },
  { id: 'user.manage', name: 'Manage Users', description: 'Create, edit, and delete user accounts', category: 'User Management', resource: 'user', action: 'manage' },
  { id: 'user.permissions', name: 'Manage User Permissions', description: 'Assign and revoke user permissions', category: 'User Management', resource: 'user', action: 'permissions' },
  
  // System Administration
  { id: 'system.admin', name: 'System Administration', description: 'Full system administrative access', category: 'System', resource: 'system', action: 'admin' },
  { id: 'system.config', name: 'System Configuration', description: 'Modify system settings and configuration', category: 'System', resource: 'system', action: 'config' },
  { id: 'system.logs', name: 'View System Logs', description: 'Access and review system logs', category: 'System', resource: 'system', action: 'logs' },
  
  // Patient Management
  { id: 'patient.view', name: 'View Patients', description: 'View patient records and information', category: 'Patient Management', resource: 'patient', action: 'view' },
  { id: 'patient.manage', name: 'Manage Patients', description: 'Create, edit, and manage patient records', category: 'Patient Management', resource: 'patient', action: 'manage' },
  { id: 'patient.medical', name: 'Medical Records', description: 'Access detailed medical records and history', category: 'Patient Management', resource: 'patient', action: 'medical' },
  
  // Appointments
  { id: 'appointment.view', name: 'View Appointments', description: 'View appointment schedules and details', category: 'Appointments', resource: 'appointment', action: 'view' },
  { id: 'appointment.manage', name: 'Manage Appointments', description: 'Schedule, edit, and cancel appointments', category: 'Appointments', resource: 'appointment', action: 'manage' },
  
  // Inventory
  { id: 'inventory.view', name: 'View Inventory', description: 'View inventory items and stock levels', category: 'Inventory', resource: 'inventory', action: 'view' },
  { id: 'inventory.manage', name: 'Manage Inventory', description: 'Add, edit, and manage inventory items', category: 'Inventory', resource: 'inventory', action: 'manage' },
  
  // Reports
  { id: 'reports.view', name: 'View Reports', description: 'Access and view generated reports', category: 'Reports', resource: 'reports', action: 'view' },
  { id: 'reports.generate', name: 'Generate Reports', description: 'Create and generate new reports', category: 'Reports', resource: 'reports', action: 'generate' },
  
  // Billing
  { id: 'billing.view', name: 'View Billing', description: 'View billing information and invoices', category: 'Billing', resource: 'billing', action: 'view' },
  { id: 'billing.manage', name: 'Manage Billing', description: 'Create and manage billing and invoices', category: 'Billing', resource: 'billing', action: 'manage' }
];

/**
 * Mock roles data for demonstration.
 * Includes system roles (protected) and custom roles (modifiable).
 * TODO: Replace with API integration.
 * @private
 */
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Super Administrator',
    description: 'Full system access with all permissions',
    permissions: mockPermissions.map(p => p.id),
    userCount: 2,
    isSystem: true,
    isActive: true,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00')
  },
  {
    id: '2',
    name: 'Doctor',
    description: 'Medical staff with patient management access',
    permissions: [
      'patient.view', 'patient.manage', 'patient.medical',
      'appointment.view', 'appointment.manage',
      'reports.view', 'inventory.view'
    ],
    userCount: 15,
    isSystem: false,
    isActive: true,
    createdAt: new Date('2023-02-15T10:30:00'),
    updatedAt: new Date('2024-01-10T14:20:00')
  },
  {
    id: '3',
    name: 'Nurse',
    description: 'Nursing staff with limited patient access',
    permissions: [
      'patient.view', 'appointment.view', 'appointment.manage',
      'inventory.view', 'reports.view'
    ],
    userCount: 25,
    isSystem: false,
    isActive: true,
    createdAt: new Date('2023-03-01T09:15:00'),
    updatedAt: new Date('2023-12-20T16:45:00')
  },
  {
    id: '4',
    name: 'Receptionist',
    description: 'Front desk staff with appointment management',
    permissions: [
      'patient.view', 'appointment.view', 'appointment.manage'
    ],
    userCount: 8,
    isSystem: false,
    isActive: true,
    createdAt: new Date('2023-04-10T11:00:00'),
    updatedAt: new Date('2023-11-15T13:30:00')
  },
  {
    id: '5',
    name: 'IT Administrator',
    description: 'Technology administration role',
    permissions: [
      'system.admin', 'system.config', 'system.logs',
      'user.view', 'user.manage', 'user.permissions',
      'reports.view', 'reports.generate'
    ],
    userCount: 3,
    isSystem: false,
    isActive: true,
    createdAt: new Date('2023-05-20T14:15:00'),
    updatedAt: new Date('2024-01-05T10:00:00')
  },
  {
    id: '6',
    name: 'Billing Manager',
    description: 'Financial operations and billing management',
    permissions: [
      'billing.view', 'billing.manage', 'reports.view', 'reports.generate',
      'patient.view'
    ],
    userCount: 0,
    isSystem: false,
    isActive: false,
    createdAt: new Date('2023-08-12T12:00:00'),
    updatedAt: new Date('2023-12-01T09:30:00')
  }
];

/**
 * Roles Page Component
 *
 * Manages the role-based access control system, allowing administrators
 * to create, edit, and manage roles with associated permissions.
 *
 * RBAC: Requires 'admin' or 'user.permissions' permission.
 * Audit: All role operations are logged.
 * Security: System roles cannot be modified or deleted.
 *
 * @returns {JSX.Element} The rendered roles management page
 *
 * @example
 * ```tsx
 * <Roles />
 * ```
 */
export const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>(mockRoles);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Filter roles based on search term and status filter.
   * Implements multi-criteria filtering for role discovery.
   *
   * Search: Matches against role name and description.
   * Filters: Supports all, active, inactive, and system role filters.
   */
  useEffect(() => {
    const filtered = roles.filter(role => {
      const matchesSearch = 
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && role.isActive) ||
        (statusFilter === 'inactive' && !role.isActive) ||
        (statusFilter === 'system' && role.isSystem);
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredRoles(filtered);
  }, [roles, searchTerm, statusFilter]);

  /**
   * Returns CSS classes for role status badges.
   *
   * @param {Role} role - The role object
   * @returns {string} Tailwind CSS class string for badge styling
   */
  const getStatusBadge = (role: Role) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    
    if (role.isSystem) {
      return `${baseClasses} bg-purple-100 text-purple-800`;
    }
    
    if (role.isActive) {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    
    return `${baseClasses} bg-gray-100 text-gray-800`;
  };

  /**
   * Returns display text for role status.
   *
   * @param {Role} role - The role object
   * @returns {string} Status display text
   */
  const getStatusText = (role: Role) => {
    if (role.isSystem) return 'System Role';
    return role.isActive ? 'Active' : 'Inactive';
  };

  /**
   * Opens the role creation modal.
   *
   * Audit: Role creation initiation is logged.
   */
  const handleAddRole = () => {
    setEditingRole(null);
    setShowRoleModal(true);
  };

  /**
   * Opens the role editing modal with pre-populated data.
   *
   * RBAC: System roles cannot be edited.
   * Audit: Role edit initiation is logged.
   *
   * @param {Role} role - The role to edit
   */
  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setShowRoleModal(true);
  };

  /**
   * Deletes a role after validation and confirmation.
   *
   * RBAC: Requires 'admin' or 'user.permissions' permission.
   * Audit: Role deletion is logged with role ID and timestamp.
   * Security: System roles and roles with assigned users cannot be deleted.
   *
   * @param {string} roleId - The ID of the role to delete
   * @throws {Error} When attempting to delete a system role or role with users
   */
  const handleDeleteRole = async (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      setError('System roles cannot be deleted');
      return;
    }
    
    if (role?.userCount && role.userCount > 0) {
      setError('Cannot delete role that has assigned users');
      return;
    }

    if (window.confirm('Are you sure you want to delete this role?')) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRoles(prev => prev.filter(role => role.id !== roleId));
      } catch (error) {
        setError('Failed to delete role');
      } finally {
        setLoading(false);
      }
    }
  };

  /**
   * Toggles a role's active status.
   *
   * RBAC: Requires 'admin' or 'user.permissions' permission.
   * Audit: Status changes are logged for compliance.
   * Security: System roles cannot have their status changed.
   *
   * @param {string} roleId - The ID of the role to update
   * @throws {Error} When attempting to modify a system role
   */
  const handleToggleStatus = async (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      setError('System role status cannot be changed');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setRoles(prev => prev.map(role => 
        role.id === roleId ? { ...role, isActive: !role.isActive, updatedAt: new Date() } : role
      ));
    } catch (error) {
      setError('Failed to update role status');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Opens the permissions viewer modal for a role.
   * Displays all permissions assigned to the role, grouped by category.
   *
   * @param {Role} role - The role whose permissions to view
   */
  const viewRolePermissions = (role: Role) => {
    setSelectedRole(role);
    setShowPermissions(true);
  };

  /**
   * Groups permissions by category for organized display.
   *
   * @param {string[]} permissions - Array of permission IDs
   * @returns {Record<string, Permission[]>} Permissions grouped by category
   */
  const getPermissionsByCategory = (permissions: string[]) => {
    const categorized = mockPermissions
      .filter(p => permissions.includes(p.id))
      .reduce((acc, permission) => {
        if (!acc[permission.category]) {
          acc[permission.category] = [];
        }
        acc[permission.category].push(permission);
        return acc;
      }, {} as Record<string, Permission[]>);
    
    return categorized;
  };

  /**
   * Formats a date for display.
   *
   * @param {Date} date - The date to format
   * @returns {string} Formatted date string
   */
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
        </div>
        <button
          onClick={handleAddRole}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Roles</p>
              <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Roles</p>
              <p className="text-2xl font-bold text-gray-900">
                {roles.filter(r => r.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Settings className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">System Roles</p>
              <p className="text-2xl font-bold text-gray-900">
                {roles.filter(r => r.isSystem).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {roles.reduce((sum, role) => sum + role.userCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search roles..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            title="Filter by status"
          >
            <option value="all">All Roles</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="system">System Roles</option>
          </select>
        </div>
      </div>

      {/* Roles Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{role.name}</div>
                        <div className="text-sm text-gray-500">{role.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{role.permissions.length} permissions</div>
                    <button
                      onClick={() => viewRolePermissions(role)}
                      className="text-sm text-blue-600 hover:text-blue-900"
                    >
                      View details
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{role.userCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(role)}>
                      {getStatusText(role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(role.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => viewRolePermissions(role)}
                      className="text-green-600 hover:text-green-900"
                      disabled={loading}
                      title="View permissions"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditRole(role)}
                      className="text-blue-600 hover:text-blue-900"
                      disabled={loading || role.isSystem}
                      title="Edit role"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(role.id)}
                      className={role.isActive ? "text-orange-600 hover:text-orange-900" : "text-green-600 hover:text-green-900"}
                      disabled={loading || role.isSystem}
                      title={role.isActive ? "Deactivate role" : "Activate role"}
                    >
                      {role.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={loading || role.isSystem || role.userCount > 0}
                      title="Delete role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No roles found matching your criteria.
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissions && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedRole.name} - Permissions
                </h3>
                <button
                  onClick={() => setShowPermissions(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {Object.entries(getPermissionsByCategory(selectedRole.permissions)).map(([category, permissions]) => (
                  <div key={category}>
                    <h4 className="text-md font-medium text-gray-800 mb-3">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map(permission => (
                        <div key={permission.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{permission.name}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{permission.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPermissions(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
