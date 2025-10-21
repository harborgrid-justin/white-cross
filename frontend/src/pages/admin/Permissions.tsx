import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Lock
} from 'lucide-react';

// Types
interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
  assignedRoles: string[];
  assignedUsers: number;
}

interface PermissionCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

// Mock data
const mockCategories: PermissionCategory[] = [
  { id: 'user', name: 'User Management', description: 'User account and profile management', icon: 'users', color: 'blue' },
  { id: 'system', name: 'System Administration', description: 'System configuration and maintenance', icon: 'settings', color: 'purple' },
  { id: 'patient', name: 'Patient Management', description: 'Patient records and medical data', icon: 'heart', color: 'red' },
  { id: 'appointment', name: 'Appointments', description: 'Scheduling and appointment management', icon: 'calendar', color: 'green' },
  { id: 'inventory', name: 'Inventory', description: 'Medical supplies and equipment', icon: 'package', color: 'orange' },
  { id: 'reports', name: 'Reports & Analytics', description: 'Data reporting and analytics', icon: 'chart', color: 'indigo' },
  { id: 'billing', name: 'Billing & Finance', description: 'Financial operations and billing', icon: 'dollar', color: 'emerald' }
];

const mockPermissions: Permission[] = [
  // User Management
  {
    id: 'user.view',
    name: 'View Users',
    description: 'View user profiles and basic information',
    category: 'User Management',
    resource: 'user',
    action: 'view',
    isSystem: false,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00'),
    assignedRoles: ['Super Administrator', 'IT Administrator'],
    assignedUsers: 5
  },
  {
    id: 'user.manage',
    name: 'Manage Users',
    description: 'Create, edit, and delete user accounts',
    category: 'User Management',
    resource: 'user',
    action: 'manage',
    isSystem: false,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00'),
    assignedRoles: ['Super Administrator', 'IT Administrator'],
    assignedUsers: 5
  },
  {
    id: 'user.permissions',
    name: 'Manage User Permissions',
    description: 'Assign and revoke user permissions',
    category: 'User Management',
    resource: 'user',
    action: 'permissions',
    isSystem: true,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00'),
    assignedRoles: ['Super Administrator'],
    assignedUsers: 2
  },
  
  // System Administration
  {
    id: 'system.admin',
    name: 'System Administration',
    description: 'Full system administrative access',
    category: 'System Administration',
    resource: 'system',
    action: 'admin',
    isSystem: true,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00'),
    assignedRoles: ['Super Administrator'],
    assignedUsers: 2
  },
  {
    id: 'system.config',
    name: 'System Configuration',
    description: 'Modify system settings and configuration',
    category: 'System Administration',
    resource: 'system',
    action: 'config',
    isSystem: false,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00'),
    assignedRoles: ['Super Administrator', 'IT Administrator'],
    assignedUsers: 5
  },
  {
    id: 'system.logs',
    name: 'View System Logs',
    description: 'Access and review system logs',
    category: 'System Administration',
    resource: 'system',
    action: 'logs',
    isSystem: false,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00'),
    assignedRoles: ['Super Administrator', 'IT Administrator'],
    assignedUsers: 5
  },
  
  // Patient Management
  {
    id: 'patient.view',
    name: 'View Patients',
    description: 'View patient records and information',
    category: 'Patient Management',
    resource: 'patient',
    action: 'view',
    isSystem: false,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00'),
    assignedRoles: ['Doctor', 'Nurse', 'Receptionist'],
    assignedUsers: 48
  },
  {
    id: 'patient.manage',
    name: 'Manage Patients',
    description: 'Create, edit, and manage patient records',
    category: 'Patient Management',
    resource: 'patient',
    action: 'manage',
    isSystem: false,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00'),
    assignedRoles: ['Doctor'],
    assignedUsers: 15
  },
  {
    id: 'patient.medical',
    name: 'Medical Records',
    description: 'Access detailed medical records and history',
    category: 'Patient Management',
    resource: 'patient',
    action: 'medical',
    isSystem: false,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00'),
    assignedRoles: ['Doctor'],
    assignedUsers: 15
  },
  
  // Appointments
  {
    id: 'appointment.view',
    name: 'View Appointments',
    description: 'View appointment schedules and details',
    category: 'Appointments',
    resource: 'appointment',
    action: 'view',
    isSystem: false,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00'),
    assignedRoles: ['Doctor', 'Nurse', 'Receptionist'],
    assignedUsers: 48
  },
  {
    id: 'appointment.manage',
    name: 'Manage Appointments',
    description: 'Schedule, edit, and cancel appointments',
    category: 'Appointments',
    resource: 'appointment',
    action: 'manage',
    isSystem: false,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00'),
    assignedRoles: ['Doctor', 'Nurse', 'Receptionist'],
    assignedUsers: 48
  },
  
  // Inventory
  {
    id: 'inventory.view',
    name: 'View Inventory',
    description: 'View inventory items and stock levels',
    category: 'Inventory',
    resource: 'inventory',
    action: 'view',
    isSystem: false,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00'),
    assignedRoles: ['Doctor', 'Nurse'],
    assignedUsers: 40
  },
  {
    id: 'inventory.manage',
    name: 'Manage Inventory',
    description: 'Add, edit, and manage inventory items',
    category: 'Inventory',
    resource: 'inventory',
    action: 'manage',
    isSystem: false,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00'),
    assignedRoles: [],
    assignedUsers: 0
  },
  
  // Reports
  {
    id: 'reports.view',
    name: 'View Reports',
    description: 'Access and view generated reports',
    category: 'Reports & Analytics',
    resource: 'reports',
    action: 'view',
    isSystem: false,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00'),
    assignedRoles: ['Super Administrator', 'IT Administrator', 'Doctor', 'Nurse'],
    assignedUsers: 45
  },
  {
    id: 'reports.generate',
    name: 'Generate Reports',
    description: 'Create and generate new reports',
    category: 'Reports & Analytics',
    resource: 'reports',
    action: 'generate',
    isSystem: false,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00'),
    assignedRoles: ['Super Administrator', 'IT Administrator'],
    assignedUsers: 5
  },
  
  // Billing
  {
    id: 'billing.view',
    name: 'View Billing',
    description: 'View billing information and invoices',
    category: 'Billing & Finance',
    resource: 'billing',
    action: 'view',
    isSystem: false,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00'),
    assignedRoles: ['Billing Manager'],
    assignedUsers: 0
  },
  {
    id: 'billing.manage',
    name: 'Manage Billing',
    description: 'Create and manage billing and invoices',
    category: 'Billing & Finance',
    resource: 'billing',
    action: 'manage',
    isSystem: false,
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2023-01-01T00:00:00'),
    assignedRoles: ['Billing Manager'],
    assignedUsers: 0
  }
];

export const Permissions: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>(mockPermissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [systemFilter, setSystemFilter] = useState<string>('all');
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter permissions based on search and filters
  useEffect(() => {
    const filtered = permissions.filter(permission => {
      const matchesSearch = 
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.resource.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || permission.category === categoryFilter;
      
      const matchesSystem = systemFilter === 'all' || 
        (systemFilter === 'system' && permission.isSystem) ||
        (systemFilter === 'custom' && !permission.isSystem);
      
      return matchesSearch && matchesCategory && matchesSystem;
    });
    
    setFilteredPermissions(filtered);
  }, [permissions, searchTerm, categoryFilter, systemFilter]);

  const getPermissionBadge = (permission: Permission) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    
    if (permission.isSystem) {
      return `${baseClasses} bg-red-100 text-red-800`;
    }
    
    return `${baseClasses} bg-blue-100 text-blue-800`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'User Management': return <Users className="w-4 h-4" />;
      case 'System Administration': return <Settings className="w-4 h-4" />;
      case 'Patient Management': return <Shield className="w-4 h-4" />;
      case 'Appointments': return <CheckCircle className="w-4 h-4" />;
      case 'Inventory': return <Key className="w-4 h-4" />;
      case 'Reports & Analytics': return <Eye className="w-4 h-4" />;
      case 'Billing & Finance': return <Lock className="w-4 h-4" />;
      default: return <Key className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'User Management': return 'text-blue-600';
      case 'System Administration': return 'text-purple-600';
      case 'Patient Management': return 'text-red-600';
      case 'Appointments': return 'text-green-600';
      case 'Inventory': return 'text-orange-600';
      case 'Reports & Analytics': return 'text-indigo-600';
      case 'Billing & Finance': return 'text-emerald-600';
      default: return 'text-gray-600';
    }
  };

  const handleAddPermission = () => {
    setSelectedPermission(null);
    setShowPermissionModal(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission);
    setShowPermissionModal(true);
  };

  const handleViewDetails = (permission: Permission) => {
    setSelectedPermission(permission);
    setShowDetailsModal(true);
  };

  const handleDeletePermission = async (permissionId: string) => {
    const permission = permissions.find(p => p.id === permissionId);
    if (permission?.isSystem) {
      setError('System permissions cannot be deleted');
      return;
    }
    
    if (permission?.assignedUsers && permission.assignedUsers > 0) {
      setError('Cannot delete permission that is assigned to users');
      return;
    }

    if (window.confirm('Are you sure you want to delete this permission?')) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPermissions(prev => prev.filter(p => p.id !== permissionId));
      } catch (error) {
        setError('Failed to delete permission');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getPermissionsByCategory = () => {
    const categorized = filteredPermissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
    
    return categorized;
  };

  const uniqueCategories = Array.from(new Set(permissions.map(p => p.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Permission Management</h1>
          <p className="text-gray-600 mt-1">Manage system permissions and access controls</p>
        </div>
        <button
          onClick={handleAddPermission}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          Add Permission
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
            <Key className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Permissions</p>
              <p className="text-2xl font-bold text-gray-900">{permissions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">System Permissions</p>
              <p className="text-2xl font-bold text-gray-900">
                {permissions.filter(p => p.isSystem).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Settings className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Custom Permissions</p>
              <p className="text-2xl font-bold text-gray-900">
                {permissions.filter(p => !p.isSystem).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueCategories.length}</p>
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
                placeholder="Search permissions..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            title="Filter by category"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={systemFilter}
            onChange={(e) => setSystemFilter(e.target.value)}
            title="Filter by type"
          >
            <option value="all">All Types</option>
            <option value="system">System Permissions</option>
            <option value="custom">Custom Permissions</option>
          </select>
        </div>
      </div>

      {/* Permissions by Category */}
      <div className="space-y-6">
        {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => (
          <div key={category} className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex items-center">
                <div className={`${getCategoryColor(category)} mr-3`}>
                  {getCategoryIcon(category)}
                </div>
                <h3 className="text-lg font-medium text-gray-900">{category}</h3>
                <span className="ml-2 bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full">
                  {categoryPermissions.length}
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resource/Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Users
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categoryPermissions.map((permission) => (
                    <tr key={permission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <Key className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                            <div className="text-sm text-gray-500">{permission.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{permission.resource}</div>
                        <div className="text-sm text-gray-500">{permission.action}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getPermissionBadge(permission)}>
                          {permission.isSystem ? 'System' : 'Custom'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">{permission.assignedUsers}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          via {permission.assignedRoles.length} roles
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewDetails(permission)}
                          className="text-green-600 hover:text-green-900"
                          disabled={loading}
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditPermission(permission)}
                          className="text-blue-600 hover:text-blue-900"
                          disabled={loading || permission.isSystem}
                          title="Edit permission"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePermission(permission.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={loading || permission.isSystem || permission.assignedUsers > 0}
                          title="Delete permission"
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
        ))}
      </div>

      {filteredPermissions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No permissions found matching your criteria.
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedPermission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Permission Details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Close"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{selectedPermission.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">{selectedPermission.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Resource</label>
                    <p className="text-sm text-gray-900">{selectedPermission.resource}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Action</label>
                    <p className="text-sm text-gray-900">{selectedPermission.action}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <p className="text-sm text-gray-900">{selectedPermission.category}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <span className={getPermissionBadge(selectedPermission)}>
                    {selectedPermission.isSystem ? 'System Permission' : 'Custom Permission'}
                  </span>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Assigned Roles</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedPermission.assignedRoles.map(role => (
                      <span key={role} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {role}
                      </span>
                    ))}
                    {selectedPermission.assignedRoles.length === 0 && (
                      <span className="text-sm text-gray-500">No roles assigned</span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Created</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedPermission.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedPermission.updatedAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
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

export default Permissions;
