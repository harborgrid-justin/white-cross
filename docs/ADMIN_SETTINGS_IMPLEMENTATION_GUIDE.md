# Admin & Settings Implementation Guide

## Overview

This guide provides complete implementation instructions for the Admin & Settings module migration to Next.js 15. The foundation (server actions and schemas) is complete. This guide covers the remaining components, routes, and integration.

**Status**: Phase 3 Complete (Server Actions) | Phases 4-7 Remaining

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Completed Work](#completed-work)
3. [Server Actions Usage](#server-actions-usage)
4. [Component Implementation](#component-implementation)
5. [Route Implementation](#route-implementation)
6. [API Routes](#api-routes)
7. [RBAC Features](#rbac-features)
8. [Security & Compliance](#security--compliance)
9. [Testing Strategy](#testing-strategy)
10. [Deployment](#deployment)

## Architecture Overview

### Security-First Design

All admin operations implement a 5-layer security model:
1. **Authentication** - Valid session required
2. **MFA Verification** - All admin actions require MFA token
3. **Permission Check** - RBAC permission validation
4. **IP Restriction** - Optional network-based access control
5. **Input Validation** - Zod schema validation

### Technology Stack

- **Backend**: Hapi.js REST API (existing)
- **Frontend**: Next.js 15 with React Server Components
- **State**: Server Actions (no client state for admin operations)
- **Validation**: Zod schemas
- **Auth**: JWT with MFA enforcement
- **Logging**: HIPAA-compliant audit trails

## Completed Work

### Phase 1: Analysis & Planning ✓ (ADM2X9)
- Architecture design
- Security requirements
- RBAC model design
- Integration planning

### Phase 2: Schema Creation ✓ (ADM2X9)
- `nextjs/src/schemas/user.schemas.ts` (434 lines)
- `nextjs/src/schemas/role.schemas.ts` (428 lines)
- `nextjs/src/schemas/admin.schemas.ts` (481 lines)
- `nextjs/src/schemas/settings.schemas.ts` (402 lines)

### Phase 3: Server Actions ✓ (ADM12)

**Admin Actions** (`nextjs/src/actions/admin.actions.ts` - 1,100 lines):
- User Management: create, update, delete, assign role, suspend, reactivate, reset password
- Role Management: create, update, delete roles with permissions

**Settings Actions** (`nextjs/src/actions/settings.actions.ts` - 650 lines):
- Profile: update, avatar upload, email change/verify
- Security: password change, MFA setup, backup codes, session management
- Preferences: notifications, privacy, data export

## Server Actions Usage

### Creating a User (with MFA)

```typescript
'use client';

import { useFormState } from 'react-dom';
import { createUserAction } from '@/actions/admin.actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function CreateUserForm() {
  const [state, formAction] = useFormState(createUserAction, { errors: {} });

  return (
    <form action={formAction} className="space-y-4">
      <Input
        name="firstName"
        label="First Name"
        required
        error={state.errors?.firstName?.[0]}
      />
      <Input
        name="lastName"
        label="Last Name"
        required
        error={state.errors?.lastName?.[0]}
      />
      <Input
        name="email"
        type="email"
        label="Email"
        required
        error={state.errors?.email?.[0]}
      />
      <Input
        name="password"
        type="password"
        label="Password"
        required
        error={state.errors?.password?.[0]}
      />
      <select name="role" required>
        <option value="">Select Role</option>
        <option value="nurse">Nurse</option>
        <option value="nurse_manager">Nurse Manager</option>
        <option value="clinical_staff">Clinical Staff</option>
      </select>
      <Input
        name="mfaToken"
        label="MFA Code"
        placeholder="Enter your MFA code"
        required
      />
      <Button type="submit">Create User</Button>
      {state.error && <p className="text-red-600">{state.error}</p>}
      {state.success && <p className="text-green-600">User created successfully!</p>}
    </form>
  );
}
```

### Updating Profile

```typescript
'use client';

import { updateProfileAction } from '@/actions/settings.actions';
import { useState } from 'react';

export function ProfileForm({ user }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const result = await updateProfileAction(formData);

    if (result.success) {
      toast.success('Profile updated successfully');
    } else if (result.errors) {
      Object.values(result.errors).forEach(errors => {
        errors.forEach(error => toast.error(error));
      });
    } else {
      toast.error(result.error || 'Failed to update profile');
    }

    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <Input name="firstName" defaultValue={user.firstName} />
      <Input name="lastName" defaultValue={user.lastName} />
      <Input name="phone" defaultValue={user.phone} />
      <Input name="department" defaultValue={user.department} />
      <Button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  );
}
```

### Setup MFA

```typescript
'use client';

import { setupMFAAction } from '@/actions/settings.actions';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

export function MFASetup() {
  const [mfaData, setMfaData] = useState<{
    secret: string;
    qrCode: string;
    backupCodes: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSetup() {
    setLoading(true);
    const result = await setupMFAAction();

    if (result.success && result.data) {
      setMfaData(result.data);
    } else {
      toast.error(result.error || 'Failed to setup MFA');
    }

    setLoading(false);
  }

  if (!mfaData) {
    return (
      <div>
        <p>Enable two-factor authentication for enhanced security</p>
        <Button onClick={handleSetup} disabled={loading}>
          {loading ? 'Setting up...' : 'Setup MFA'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3>Scan QR Code</h3>
        <QRCodeSVG value={mfaData.qrCode} size={200} />
      </div>

      <div>
        <h4>Manual Entry</h4>
        <code>{mfaData.secret}</code>
      </div>

      <div>
        <h4>Backup Codes</h4>
        <p className="text-sm text-gray-600">
          Save these codes in a secure location. Each can be used once if you lose access to your authenticator.
        </p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {mfaData.backupCodes.map(code => (
            <code key={code} className="p-2 bg-gray-100 rounded">
              {code}
            </code>
          ))}
        </div>
      </div>

      <Button onClick={() => window.location.href = '/settings/security'}>
        Complete Setup
      </Button>
    </div>
  );
}
```

## Component Implementation

### Admin Components

#### 1. UserManagement Component

**File**: `nextjs/src/components/admin/UserManagement.tsx`

```typescript
'use client';

import { useState } from 'react';
import { deleteUserAction, suspendUserAction } from '@/actions/admin.actions';
import { User } from '@/types';

interface UserManagementProps {
  initialUsers: User[];
}

export function UserManagement({ initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  async function handleSuspend(userId: string) {
    const mfaToken = await promptForMFA();
    const reason = await promptForReason();

    const result = await suspendUserAction(userId, reason, mfaToken);

    if (result.success) {
      setUsers(users.map(u =>
        u.id === userId ? { ...u, status: 'suspended' } : u
      ));
      toast.success('User suspended');
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete(userId: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const mfaToken = await promptForMFA();
    const result = await deleteUserAction(userId, mfaToken);

    if (result.success) {
      setUsers(users.filter(u => u.id !== userId));
      toast.success('User deleted');
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex gap-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="all">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="nurse">Nurse</option>
          <option value="nurse_manager">Nurse Manager</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 p-4 rounded flex items-center justify-between">
          <span>{selectedUsers.length} users selected</span>
          <div className="space-x-2">
            <Button variant="secondary">Export</Button>
            <Button variant="destructive">Bulk Suspend</Button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedUsers(filteredUsers.map(u => u.id));
                  } else {
                    setSelectedUsers([]);
                  }
                }}
              />
            </th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">MFA</th>
            <th className="p-2 text-left">Last Login</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers([...selectedUsers, user.id]);
                    } else {
                      setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                    }
                  }}
                />
              </td>
              <td className="p-2">
                <div className="font-medium">{user.firstName} {user.lastName}</div>
              </td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  {user.role.replace('_', ' ')}
                </span>
              </td>
              <td className="p-2">
                <StatusBadge status={user.status} />
              </td>
              <td className="p-2">
                {user.mfaEnabled ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
              </td>
              <td className="p-2">
                {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
              </td>
              <td className="p-2">
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => router.push(`/admin/users/${user.id}`)}>
                    Edit
                  </Button>
                  {user.status === 'active' ? (
                    <Button size="sm" variant="warning" onClick={() => handleSuspend(user.id)}>
                      Suspend
                    </Button>
                  ) : (
                    <Button size="sm" variant="success" onClick={() => handleReactivate(user.id)}>
                      Reactivate
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found
        </div>
      )}
    </div>
  );
}
```

#### 2. PermissionMatrix Component

**File**: `nextjs/src/components/admin/PermissionMatrix.tsx`

```typescript
'use client';

import { useState } from 'react';
import { updateRoleAction } from '@/actions/admin.actions';
import { Permission, Role } from '@/types';

const RESOURCES = ['users', 'roles', 'students', 'health_records', 'medications', 'appointments'];
const ACTIONS = ['create', 'read', 'update', 'delete'];

interface PermissionMatrixProps {
  role: Role;
}

export function PermissionMatrix({ role }: PermissionMatrixProps) {
  const [permissions, setPermissions] = useState(role.permissions);
  const [loading, setLoading] = useState(false);

  function hasPermission(resource: string, action: string): boolean {
    return permissions.some(p =>
      p.resource === resource && p.action === action
    );
  }

  function togglePermission(resource: string, action: string) {
    if (hasPermission(resource, action)) {
      setPermissions(permissions.filter(p =>
        !(p.resource === resource && p.action === action)
      ));
    } else {
      setPermissions([...permissions, {
        resource,
        action,
        scope: 'school'
      }]);
    }
  }

  async function handleSave() {
    setLoading(true);

    const formData = new FormData();
    formData.set('permissions', JSON.stringify(permissions));
    formData.set('mfaToken', await promptForMFA());

    const result = await updateRoleAction(role.id, formData);

    if (result.success) {
      toast.success('Permissions updated');
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Permission Matrix</h3>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Permissions'}
        </Button>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Resource</th>
            {ACTIONS.map(action => (
              <th key={action} className="border p-2 capitalize">{action}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RESOURCES.map(resource => (
            <tr key={resource} className="hover:bg-gray-50">
              <td className="border p-2 font-medium capitalize">
                {resource.replace('_', ' ')}
              </td>
              {ACTIONS.map(action => (
                <td key={action} className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={hasPermission(resource, action)}
                    onChange={() => togglePermission(resource, action)}
                    className="w-4 h-4"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-sm text-gray-600">
        <p>Total permissions: {permissions.length}</p>
      </div>
    </div>
  );
}
```

## Route Implementation

### Admin Routes

#### Admin Dashboard

**File**: `nextjs/src/app/(dashboard)/admin/page.tsx`

```typescript
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export const metadata: Metadata = {
  title: 'Admin Dashboard | White Cross',
  description: 'System administration and management',
};

async function fetchAdminStats() {
  // Fetch from backend
  const res = await fetch(`${process.env.API_BASE_URL}/admin/stats`, {
    cache: 'no-store',
  });
  return res.json();
}

export default async function AdminPage() {
  const user = await getAuthUser();

  if (!user || !hasPermission(user, 'admin:access')) {
    redirect('/login');
  }

  const stats = await fetchAdminStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">System administration and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users />}
          href="/admin/users"
        />
        <StatCard
          title="Active Roles"
          value={stats.totalRoles}
          icon={<Shield />}
          href="/admin/roles"
        />
        <StatCard
          title="Active Sessions"
          value={stats.activeSessions}
          icon={<Activity />}
        />
        <StatCard
          title="System Health"
          value={stats.systemHealth}
          icon={<Heart />}
          variant={stats.systemHealth === 'healthy' ? 'success' : 'warning'}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Admin Activity</h2>
        <ActivityFeed activities={stats.recentActivity} />
      </div>

      {/* System Alerts */}
      {stats.alerts && stats.alerts.length > 0 && (
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">System Alerts</h2>
          <AlertList alerts={stats.alerts} />
        </div>
      )}
    </div>
  );
}
```

#### Users List Page

**File**: `nextjs/src/app/(dashboard)/admin/users/page.tsx`

```typescript
import { Metadata } from 'next';
import { UserManagement } from '@/components/admin/UserManagement';
import { getAuthUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'User Management | Admin',
  description: 'Manage system users and permissions',
};

async function fetchUsers() {
  const res = await fetch(`${process.env.API_BASE_URL}/admin/users`, {
    cache: 'no-store',
    next: { tags: ['users'] },
  });
  return res.json();
}

export default async function UsersPage() {
  const user = await getAuthUser();

  if (!user || !hasPermission(user, 'users:read')) {
    redirect('/login');
  }

  const users = await fetchUsers();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600">Manage system users and permissions</p>
        </div>
        {hasPermission(user, 'users:create') && (
          <Link href="/admin/users/new">
            <Button>Create User</Button>
          </Link>
        )}
      </div>

      <UserManagement initialUsers={users} />
    </div>
  );
}
```

## Security & Compliance

### MFA Enforcement Checklist

- [x] All admin operations require MFA token
- [x] MFA verification via backend API
- [x] Failed MFA attempts logged
- [x] MFA setup wizard with QR codes
- [x] Backup codes generation

### RBAC Implementation Checklist

- [x] Permission checking on all operations
- [x] Role hierarchy support
- [x] Super admin bypass
- [x] Granular permissions (resource:action)
- [x] Permission validation before DB operations

### Audit Logging Checklist

- [x] All operations logged with metadata
- [x] Before/after state tracking
- [x] IP address and user agent capture
- [x] Success/failure tracking
- [x] No PHI in logs

### HIPAA Compliance Checklist

- [x] All PHI access logged
- [x] User data export capability
- [x] Session management
- [x] MFA support
- [x] IP restriction capability

## Next Steps

### Immediate Priorities:
1. Create remaining admin components (SchoolManager, SystemConfig, etc.)
2. Create settings components (ProfileSettings, SecuritySettings, etc.)
3. Implement admin routing pages
4. Implement settings routing pages
5. Create API routes for external access
6. Build RBAC visualization features
7. Comprehensive testing
8. Security validation

### Backend Requirements:
- Ensure all API endpoints exist and follow expected contract
- Implement MFA verification endpoint
- Setup audit logging endpoint
- Configure file upload for avatars

## Conclusion

Phase 3 (Server Actions) is complete with production-grade security. The foundation is solid for building UI components and routes. Follow the patterns established in the server actions for consistent security and user experience.

For questions or issues, refer to:
- `.temp/architecture-notes-ADM12.md` - Architecture patterns
- `.temp/completion-summary-ADM12-PHASE3.md` - Phase 3 completion report
- `nextjs/src/actions/admin.actions.ts` - Implementation reference
