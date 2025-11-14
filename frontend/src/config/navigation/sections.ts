/**
 * @fileoverview Navigation sections configuration
 * 
 * This module defines the main navigation sections organized by domain:
 * - Core: Essential platform functions
 * - Clinical: Patient care and health records
 * - Operations: Business and logistics
 * - Communication: Messaging and collaboration
 * - Incidents: Safety and incident management
 * - Analytics: Data analysis and reporting
 * - Compliance: Security and regulatory compliance
 * - System: Platform administration
 * 
 * @module config/navigation/sections
 */

import type { NavigationSection } from '../../types/core/navigation';

/**
 * Core navigation section - Essential platform functions
 */
export const CORE_SECTION: NavigationSection = {
  title: 'Core',
  collapsible: false,
  defaultCollapsed: false,
  items: [
    {
      id: 'dashboard',
      name: 'Dashboard',
      path: '/dashboard',
      icon: 'Home',
      dataTestId: 'nav-dashboard',
      ariaLabel: 'Navigate to dashboard',
      roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
    },
    {
      id: 'profile',
      name: 'My Profile',
      path: '/profile',
      icon: 'User',
      dataTestId: 'nav-profile',
      ariaLabel: 'Navigate to profile',
      roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
    },
  ],
};

/**
 * Clinical navigation section - Patient care and health records
 */
export const CLINICAL_SECTION: NavigationSection = {
  title: 'Clinical',
  collapsible: true,
  defaultCollapsed: false,
  roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
  items: [
    {
      id: 'students',
      name: 'Students',
      path: '/students',
      icon: 'Users',
      dataTestId: 'nav-students',
      ariaLabel: 'Manage student records',
      roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
      children: [
        {
          id: 'students-list',
          name: 'All Students',
          path: '/students',
          icon: 'List',
          roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        },
        {
          id: 'students-add',
          name: 'Add Student',
          path: '/students/new',
          icon: 'UserPlus',
          roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
        },
        {
          id: 'students-import',
          name: 'Import Students',
          path: '/students/import',
          icon: 'Upload',
          roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        },
      ],
    },
    {
      id: 'health-records',
      name: 'Health Records',
      path: '/health-records',
      icon: 'FileHeart',
      dataTestId: 'nav-health-records',
      ariaLabel: 'Access student health records',
      roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
      children: [
        {
          id: 'health-records-list',
          name: 'All Records',
          path: '/health-records',
          icon: 'List',
          roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
        },
        {
          id: 'health-records-pending',
          name: 'Pending Review',
          path: '/health-records/pending',
          icon: 'Clock',
          badge: '3',
          badgeVariant: 'warning',
          roles: ['ADMIN', 'NURSE'],
        },
      ],
    },
    {
      id: 'medications',
      name: 'Medications',
      path: '/medications',
      icon: 'Pill',
      dataTestId: 'nav-medications',
      ariaLabel: 'Manage student medications',
      roles: ['ADMIN', 'NURSE'],
      children: [
        {
          id: 'medications-list',
          name: 'All Medications',
          path: '/medications',
          icon: 'List',
          roles: ['ADMIN', 'NURSE'],
        },
        {
          id: 'medications-schedule',
          name: 'Today\'s Schedule',
          path: '/medications/schedule',
          icon: 'Calendar',
          roles: ['ADMIN', 'NURSE'],
        },
        {
          id: 'medications-log',
          name: 'Administration Log',
          path: '/medications/log',
          icon: 'FileText',
          roles: ['ADMIN', 'NURSE'],
        },
      ],
    },
    {
      id: 'appointments',
      name: 'Appointments',
      path: '/appointments',
      icon: 'Calendar',
      dataTestId: 'nav-appointments',
      ariaLabel: 'View and manage appointments',
      roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
      children: [
        {
          id: 'appointments-calendar',
          name: 'Calendar View',
          path: '/appointments',
          icon: 'Calendar',
          roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
        },
        {
          id: 'appointments-schedule',
          name: 'Schedule Appointment',
          path: '/appointments/new',
          icon: 'CalendarPlus',
          roles: ['ADMIN', 'NURSE'],
        },
        {
          id: 'appointments-today',
          name: 'Today\'s Appointments',
          path: '/appointments/today',
          icon: 'Clock',
          badge: '5',
          badgeVariant: 'info',
          roles: ['ADMIN', 'NURSE'],
        },
      ],
    },
    {
      id: 'immunizations',
      name: 'Immunizations',
      path: '/immunizations',
      icon: 'Shield',
      dataTestId: 'nav-immunizations',
      ariaLabel: 'Track student immunizations',
      roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
      children: [
        {
          id: 'immunizations-list',
          name: 'All Records',
          path: '/immunizations',
          icon: 'List',
          roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
        },
        {
          id: 'immunizations-due',
          name: 'Due Soon',
          path: '/immunizations/due',
          icon: 'AlertCircle',
          badge: '12',
          badgeVariant: 'warning',
          roles: ['ADMIN', 'NURSE'],
        },
        {
          id: 'immunizations-compliance',
          name: 'Compliance Report',
          path: '/immunizations/compliance',
          icon: 'CheckCircle',
          roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        },
      ],
    },
  ],
};

/**
 * Operations navigation section - Business and logistics
 */
export const OPERATIONS_SECTION: NavigationSection = {
  title: 'Operations',
  collapsible: true,
  defaultCollapsed: false,
  roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
  items: [
    {
      id: 'billing',
      name: 'Billing',
      path: '/billing',
      icon: 'DollarSign',
      dataTestId: 'nav-billing',
      ariaLabel: 'Manage billing and invoices',
      roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
      children: [
        {
          id: 'billing-invoices',
          name: 'Invoices',
          path: '/billing/invoices',
          icon: 'FileText',
          roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        },
        {
          id: 'billing-payments',
          name: 'Payments',
          path: '/billing/payments',
          icon: 'DollarSign',
          roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        },
        {
          id: 'billing-outstanding',
          name: 'Outstanding',
          path: '/billing/outstanding',
          icon: 'AlertTriangle',
          badge: '8',
          badgeVariant: 'error',
          roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        },
      ],
    },
    {
      id: 'inventory',
      name: 'Inventory',
      path: '/inventory',
      icon: 'Package',
      dataTestId: 'nav-inventory',
      ariaLabel: 'Manage medical supplies inventory',
      roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
      children: [
        {
          id: 'inventory-items',
          name: 'All Items',
          path: '/inventory',
          icon: 'List',
          roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
        },
        {
          id: 'inventory-low-stock',
          name: 'Low Stock',
          path: '/inventory/low-stock',
          icon: 'AlertTriangle',
          badge: '4',
          badgeVariant: 'warning',
          roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
        },
        {
          id: 'inventory-expired',
          name: 'Expiring Soon',
          path: '/inventory/expiring',
          icon: 'Clock',
          roles: ['ADMIN', 'NURSE'],
        },
      ],
    },
    {
      id: 'purchasing',
      name: 'Purchasing',
      path: '/purchasing',
      icon: 'ShoppingCart',
      dataTestId: 'nav-purchasing',
      ariaLabel: 'Manage purchase orders',
      roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
      children: [
        {
          id: 'purchasing-orders',
          name: 'Purchase Orders',
          path: '/purchasing/orders',
          icon: 'FileText',
          roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        },
        {
          id: 'purchasing-pending',
          name: 'Pending Approval',
          path: '/purchasing/pending',
          icon: 'Clock',
          badge: '2',
          badgeVariant: 'warning',
          roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        },
      ],
    },
    {
      id: 'vendors',
      name: 'Vendors',
      path: '/vendors',
      icon: 'Store',
      dataTestId: 'nav-vendors',
      ariaLabel: 'Manage vendor relationships',
      roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
    },
  ],
};

/**
 * Communication navigation section - Messaging and collaboration
 */
export const COMMUNICATION_SECTION: NavigationSection = {
  title: 'Communication',
  collapsible: true,
  defaultCollapsed: false,
  roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
  items: [
    {
      id: 'messages',
      name: 'Messages',
      path: '/messages',
      icon: 'MessageSquare',
      dataTestId: 'nav-messages',
      ariaLabel: 'View and send messages',
      badge: '7',
      badgeVariant: 'info',
      roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
    },
    {
      id: 'documents',
      name: 'Documents',
      path: '/documents',
      icon: 'FileText',
      dataTestId: 'nav-documents',
      ariaLabel: 'Manage documents and files',
      roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
      children: [
        {
          id: 'documents-all',
          name: 'All Documents',
          path: '/documents',
          icon: 'List',
          roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        },
        {
          id: 'documents-templates',
          name: 'Templates',
          path: '/documents/templates',
          icon: 'FileText',
          roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
        },
        {
          id: 'documents-pending',
          name: 'Pending Signature',
          path: '/documents/pending',
          icon: 'Edit',
          badge: '3',
          badgeVariant: 'warning',
          roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
        },
      ],
    },
    {
      id: 'broadcasts',
      name: 'Broadcasts',
      path: '/broadcasts',
      icon: 'Send',
      dataTestId: 'nav-broadcasts',
      ariaLabel: 'Send bulk notifications',
      roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
    },
  ],
};

/**
 * Incidents navigation section - Safety and incident management
 */
export const INCIDENTS_SECTION: NavigationSection = {
  title: 'Safety & Incidents',
  collapsible: true,
  defaultCollapsed: false,
  roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
  items: [
    {
      id: 'incidents',
      name: 'Incident Reports',
      path: '/incidents',
      icon: 'AlertTriangle',
      dataTestId: 'nav-incidents',
      ariaLabel: 'View and manage incident reports',
      roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
      children: [
        {
          id: 'incidents-all',
          name: 'All Incidents',
          path: '/incidents',
          icon: 'List',
          roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        },
        {
          id: 'incidents-new',
          name: 'Report Incident',
          path: '/incidents/new',
          icon: 'AlertCircle',
          roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
        },
        {
          id: 'incidents-pending',
          name: 'Pending Review',
          path: '/incidents/pending',
          icon: 'Clock',
          badge: '2',
          badgeVariant: 'error',
          roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
        },
      ],
    },
    {
      id: 'emergency-contacts',
      name: 'Emergency Contacts',
      path: '/emergency-contacts',
      icon: 'Phone',
      dataTestId: 'nav-emergency-contacts',
      ariaLabel: 'Manage emergency contact information',
      roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
    },
  ],
};

/**
 * Analytics navigation section - Data analysis and reporting
 */
export const ANALYTICS_SECTION: NavigationSection = {
  title: 'Analytics & Reports',
  collapsible: true,
  defaultCollapsed: true,
  roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
  items: [
    {
      id: 'analytics',
      name: 'Health Metrics',
      path: '/analytics',
      icon: 'BarChart3',
      dataTestId: 'nav-analytics',
      ariaLabel: 'View health analytics and metrics',
      roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
    },
    {
      id: 'reports',
      name: 'Reports',
      path: '/reports',
      icon: 'FileText',
      dataTestId: 'nav-reports',
      ariaLabel: 'Generate and view reports',
      roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
      children: [
        {
          id: 'reports-health',
          name: 'Health Reports',
          path: '/reports/health',
          icon: 'FileHeart',
          roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        },
        {
          id: 'reports-compliance',
          name: 'Compliance Reports',
          path: '/reports/compliance',
          icon: 'CheckCircle',
          roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        },
        {
          id: 'reports-financial',
          name: 'Financial Reports',
          path: '/reports/financial',
          icon: 'DollarSign',
          roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        },
      ],
    },
    {
      id: 'trends',
      name: 'Health Trends',
      path: '/trends',
      icon: 'TrendingUp',
      dataTestId: 'nav-trends',
      ariaLabel: 'View health trend analysis',
      roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
    },
  ],
};

/**
 * Compliance navigation section - Security and regulatory compliance
 */
export const COMPLIANCE_SECTION: NavigationSection = {
  title: 'Compliance & Security',
  collapsible: true,
  defaultCollapsed: true,
  roles: ['ADMIN', 'DISTRICT_ADMIN'],
  items: [
    {
      id: 'audit-logs',
      name: 'Audit Logs',
      path: '/audit-logs',
      icon: 'Activity',
      dataTestId: 'nav-audit-logs',
      ariaLabel: 'View system audit logs',
      roles: ['ADMIN', 'DISTRICT_ADMIN'],
    },
    {
      id: 'permissions',
      name: 'Permissions',
      path: '/permissions',
      icon: 'Lock',
      dataTestId: 'nav-permissions',
      ariaLabel: 'Manage user permissions',
      roles: ['ADMIN', 'DISTRICT_ADMIN'],
    },
    {
      id: 'roles',
      name: 'Role Management',
      path: '/roles',
      icon: 'UserCog',
      dataTestId: 'nav-roles',
      ariaLabel: 'Manage user roles',
      roles: ['ADMIN', 'DISTRICT_ADMIN'],
    },
    {
      id: 'policies',
      name: 'Policies',
      path: '/policies',
      icon: 'Shield',
      dataTestId: 'nav-policies',
      ariaLabel: 'View compliance policies',
      roles: ['ADMIN', 'DISTRICT_ADMIN'],
    },
  ],
};

/**
 * System navigation section - Platform administration
 */
export const SYSTEM_SECTION: NavigationSection = {
  title: 'System',
  collapsible: true,
  defaultCollapsed: true,
  roles: ['ADMIN', 'DISTRICT_ADMIN'],
  items: [
    {
      id: 'settings',
      name: 'Settings',
      path: '/settings',
      icon: 'Settings',
      dataTestId: 'nav-settings',
      ariaLabel: 'Manage system settings',
      roles: ['ADMIN', 'DISTRICT_ADMIN'],
      children: [
        {
          id: 'settings-general',
          name: 'General',
          path: '/settings/general',
          icon: 'Settings',
          roles: ['ADMIN', 'DISTRICT_ADMIN'],
        },
        {
          id: 'settings-notifications',
          name: 'Notifications',
          path: '/settings/notifications',
          icon: 'Bell',
          roles: ['ADMIN', 'DISTRICT_ADMIN'],
        },
        {
          id: 'settings-integration',
          name: 'Integrations',
          path: '/settings/integrations',
          icon: 'Plug',
          roles: ['ADMIN', 'DISTRICT_ADMIN'],
        },
      ],
    },
    {
      id: 'users',
      name: 'User Management',
      path: '/users',
      icon: 'Users',
      dataTestId: 'nav-users',
      ariaLabel: 'Manage system users',
      roles: ['ADMIN', 'DISTRICT_ADMIN'],
    },
    {
      id: 'integrations',
      name: 'Integrations',
      path: '/integrations',
      icon: 'Plug',
      dataTestId: 'nav-integrations',
      ariaLabel: 'Manage third-party integrations',
      roles: ['ADMIN', 'DISTRICT_ADMIN'],
    },
  ],
};
