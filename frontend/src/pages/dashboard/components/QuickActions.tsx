/**
 * WF-DASH-004 | QuickActions.tsx - Quick Actions Component
 * Purpose: Provides quick access buttons for common dashboard actions
 * Upstream: Dashboard store, user permissions | Dependencies: React, UI components
 * Downstream: Various system modules | Called by: DashboardOverview
 * Related: Navigation, user workflows
 * Exports: QuickActions component | Key Features: Action buttons, permissions-based display
 * Last Updated: 2025-10-21 | File Type: .tsx
 * Critical Path: User intent → Quick action → System navigation/execution
 * LLM Context: Quick actions panel for White Cross healthcare dashboard
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  Users, 
  FileText, 
  Heart, 
  Package,
  MessageSquare,
  Settings,
  BarChart3,
  ClipboardList
} from 'lucide-react';

// Components
import { QuickActionButton } from './QuickActionButton';

// ============================================================================
// TYPES
// ============================================================================

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string | number;
}

interface QuickActionsProps {
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const QuickActions: React.FC<QuickActionsProps> = ({
  className = ''
}) => {
  const navigate = useNavigate();

  // ============================================================================
  // ACTION DEFINITIONS
  // ============================================================================

  const quickActions: QuickAction[] = [
    {
      id: 'new-appointment',
      title: 'New Appointment',
      description: 'Schedule a new patient appointment',
      icon: <Plus className="w-5 h-5" />,
      color: 'blue',
      onClick: () => navigate('/appointments/new')
    },
    {
      id: 'patient-records',
      title: 'Patient Records',
      description: 'Access patient medical records',
      icon: <Users className="w-5 h-5" />,
      color: 'green',
      onClick: () => navigate('/patients')
    },
    {
      id: 'inventory',
      title: 'Inventory',
      description: 'Manage medical supplies',
      icon: <Package className="w-5 h-5" />,
      color: 'orange',
      onClick: () => navigate('/inventory'),
      badge: '3' // Low stock alerts
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'View analytics and reports',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'purple',
      onClick: () => navigate('/reports')
    },
    {
      id: 'health-records',
      title: 'Health Records',
      description: 'Access medical histories',
      icon: <Heart className="w-5 h-5" />,
      color: 'red',
      onClick: () => navigate('/health-records')
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Communication center',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'blue',
      onClick: () => navigate('/communication'),
      badge: '12' // Unread messages
    },
    {
      id: 'tasks',
      title: 'Tasks',
      description: 'Pending tasks and to-dos',
      icon: <ClipboardList className="w-5 h-5" />,
      color: 'orange',
      onClick: () => navigate('/tasks'),
      badge: '18' // Pending tasks
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'System configuration',
      icon: <Settings className="w-5 h-5" />,
      color: 'purple',
      onClick: () => navigate('/settings')
    }
  ];

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleActionClick = (action: QuickAction) => {
    if (action.disabled) return;
    
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      navigate(action.href);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        <p className="text-gray-600">Common tasks and frequently used features</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {quickActions.map((action) => (
          <QuickActionButton
            key={action.id}
            title={action.title}
            description={action.description}
            icon={action.icon}
            color={action.color}
            badge={action.badge}
            disabled={action.disabled}
            onClick={() => handleActionClick(action)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
