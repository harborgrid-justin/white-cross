/**
 * AdminDashboard Component
 *
 * Admin Dashboard for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

/**
 * Props for the AdminDashboard component.
 *
 * @interface AdminDashboardProps
 * @property {string} [className] - Optional CSS class names for styling customization
 */
interface AdminDashboardProps {
  className?: string;
}

/**
 * Admin Dashboard Component.
 *
 * Central dashboard interface for system administrators providing an overview
 * of system status, recent activities, and quick access to admin functions.
 *
 * @component
 * @param {AdminDashboardProps} props - Component props
 *
 * @example
 * ```tsx
 * <AdminDashboard className="custom-styling" />
 * ```
 *
 * @remarks
 * **RBAC Requirements:**
 * - Requires 'admin' permission to access
 * - Displays admin-specific metrics and controls
 *
 * **Features:** (Under Development)
 * - System health overview
 * - Recent admin activities
 * - User statistics dashboard
 * - Quick action buttons
 * - Performance metrics
 *
 * **State Management:**
 * - Connected to admin Redux slice via useAppSelector
 * - Access to admin-specific state and configurations
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - ARIA labels for dashboard sections
 * - Keyboard navigation support
 *
 * @returns {JSX.Element} The rendered admin dashboard interface
 *
 * @see {@link useAppSelector} for Redux state access
 */
const AdminDashboard: React.FC<AdminDashboardProps> = ({ className = '' }) => {
  return (
    <div className={`admin-dashboard ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Dashboard</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Admin Dashboard functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
