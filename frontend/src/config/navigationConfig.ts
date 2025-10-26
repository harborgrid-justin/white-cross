/**
 * WF-COMP-NAV-002 | navigationConfig.ts - Complete Navigation Configuration
 * Purpose: Centralized navigation configuration for all 21 domains
 * Dependencies: ../constants/routes, ../types/navigation
 * Features: Categorized navigation, role-based access, icons, sub-menus
 * Last Updated: 2025-10-24
 * Agent: NAV7L5 - React Component Architect
 */

import { PROTECTED_ROUTES } from '../constants/routes'
import type { NavigationItem, NavigationSection } from '../types/navigation'

// ============================================================================
// NAVIGATION SECTIONS (All 21 Domains Organized by Category)
// ============================================================================

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  // ===== CORE SECTION =====
  {
    title: 'Core',
    collapsible: false,
    items: [
      {
        id: 'dashboard',
        name: 'Dashboard',
        path: PROTECTED_ROUTES.DASHBOARD,
        icon: 'Home',
        roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'VIEWER', 'COUNSELOR'],
        order: 1,
        dataTestId: 'dashboard-nav',
      },
      {
        id: 'students',
        name: 'Students',
        path: PROTECTED_ROUTES.STUDENTS,
        icon: 'Users',
        roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'VIEWER', 'COUNSELOR'],
        permissions: [{ resource: 'students', action: 'read' }],
        order: 2,
        dataTestId: 'students-nav',
      },
    ],
  },

  // ===== HEALTHCARE SECTION =====
  {
    title: 'Healthcare',
    collapsible: true,
    defaultCollapsed: false,
    items: [
      {
        id: 'health-records',
        name: 'Health Records',
        path: PROTECTED_ROUTES.HEALTH_RECORDS,
        icon: 'FileHeart',
        roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'VIEWER', 'COUNSELOR'],
        permissions: [{ resource: 'health_records', action: 'read' }],
        order: 3,
      },
      {
        id: 'medications',
        name: 'Medications',
        path: PROTECTED_ROUTES.MEDICATIONS,
        icon: 'Pill',
        roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'VIEWER'],
        permissions: [{ resource: 'medications', action: 'read' }],
        order: 4,
        children: [
          {
            id: 'medications-list',
            name: 'All Medications',
            path: PROTECTED_ROUTES.MEDICATIONS_LIST,
            icon: 'List',
            roles: ['ADMIN', 'NURSE'],
          },
          {
            id: 'medications-inventory',
            name: 'Inventory',
            path: PROTECTED_ROUTES.MEDICATIONS_INVENTORY,
            icon: 'Package',
            roles: ['ADMIN', 'NURSE'],
          },
        ],
      },
      {
        id: 'appointments',
        name: 'Appointments',
        path: PROTECTED_ROUTES.APPOINTMENTS,
        icon: 'Calendar',
        roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'VIEWER'],
        permissions: [{ resource: 'appointments', action: 'read' }],
        order: 5,
      },
    ],
  },

  // ===== ADMINISTRATIVE SECTION =====
  {
    title: 'Administrative',
    collapsible: true,
    defaultCollapsed: false,
    roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
    items: [
      {
        id: 'budget',
        name: 'Budget',
        path: PROTECTED_ROUTES.BUDGET,
        icon: 'DollarSign',
        roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        permissions: [{ resource: 'budget', action: 'read' }],
        order: 6,
        children: [
          {
            id: 'budget-overview',
            name: 'Overview',
            path: PROTECTED_ROUTES.BUDGET_OVERVIEW,
            icon: 'BarChart3',
            roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
          },
          {
            id: 'budget-planning',
            name: 'Planning',
            path: PROTECTED_ROUTES.BUDGET_PLANNING,
            icon: 'TrendingUp',
            roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
          },
          {
            id: 'budget-tracking',
            name: 'Tracking',
            path: PROTECTED_ROUTES.BUDGET_TRACKING,
            icon: 'Activity',
            roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
          },
        ],
      },
      {
        id: 'inventory',
        name: 'Inventory',
        path: PROTECTED_ROUTES.INVENTORY,
        icon: 'Package',
        roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        permissions: [{ resource: 'inventory', action: 'read' }],
        order: 7,
      },
      {
        id: 'purchase-orders',
        name: 'Purchase Orders',
        path: '/purchase-orders',
        icon: 'ShoppingCart',
        roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        permissions: [{ resource: 'purchase_orders', action: 'read' }],
        order: 8,
      },
      {
        id: 'vendors',
        name: 'Vendors',
        path: '/vendors',
        icon: 'Store',
        roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        permissions: [{ resource: 'vendors', action: 'read' }],
        order: 9,
      },
    ],
  },

  // ===== COMMUNICATION & REPORTING SECTION =====
  {
    title: 'Communication & Reports',
    collapsible: true,
    defaultCollapsed: false,
    items: [
      {
        id: 'communication',
        name: 'Communication',
        path: PROTECTED_ROUTES.COMMUNICATION,
        icon: 'MessageSquare',
        roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        permissions: [{ resource: 'communication', action: 'read' }],
        order: 10,
      },
      {
        id: 'documents',
        name: 'Documents',
        path: PROTECTED_ROUTES.DOCUMENTS,
        icon: 'FileText',
        roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'VIEWER'],
        permissions: [{ resource: 'documents', action: 'read' }],
        order: 11,
      },
      {
        id: 'reports',
        name: 'Reports',
        path: PROTECTED_ROUTES.REPORTS,
        icon: 'BarChart3',
        roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'VIEWER'],
        permissions: [{ resource: 'reports', action: 'read' }],
        order: 12,
      },
      {
        id: 'incident-reports',
        name: 'Incidents',
        path: PROTECTED_ROUTES.INCIDENT_REPORTS,
        icon: 'AlertTriangle',
        roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'VIEWER', 'COUNSELOR'],
        permissions: [{ resource: 'incident_reports', action: 'read' }],
        order: 13,
      },
    ],
  },

  // ===== EMERGENCY & SAFETY SECTION =====
  {
    title: 'Emergency & Safety',
    collapsible: true,
    defaultCollapsed: false,
    items: [
      {
        id: 'emergency-contacts',
        name: 'Emergency Contacts',
        path: PROTECTED_ROUTES.EMERGENCY_CONTACTS,
        icon: 'Phone',
        roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        permissions: [{ resource: 'emergency_contacts', action: 'read' }],
        order: 14,
      },
    ],
  },

  // ===== SYSTEM MANAGEMENT SECTION =====
  {
    title: 'System Management',
    collapsible: true,
    defaultCollapsed: true,
    roles: ['ADMIN'],
    items: [
      {
        id: 'administration',
        name: 'Administration',
        path: PROTECTED_ROUTES.ADMIN,
        icon: 'Shield',
        roles: ['ADMIN'],
        permissions: [{ resource: 'system', action: 'manage' }],
        order: 15,
        dataTestId: 'admin-panel-link',
        children: [
          {
            id: 'admin-users',
            name: 'Users',
            path: PROTECTED_ROUTES.ADMIN_USERS,
            icon: 'Users',
            roles: ['ADMIN'],
          },
          {
            id: 'admin-roles',
            name: 'Roles',
            path: PROTECTED_ROUTES.ADMIN_ROLES,
            icon: 'UserCog',
            roles: ['ADMIN'],
          },
          {
            id: 'admin-permissions',
            name: 'Permissions',
            path: PROTECTED_ROUTES.ADMIN_PERMISSIONS,
            icon: 'Lock',
            roles: ['ADMIN'],
          },
        ],
      },
      {
        id: 'access-control',
        name: 'Access Control',
        path: '/access-control',
        icon: 'Lock',
        roles: ['ADMIN'],
        permissions: [{ resource: 'access_control', action: 'manage' }],
        order: 16,
      },
      {
        id: 'compliance',
        name: 'Compliance',
        path: PROTECTED_ROUTES.COMPLIANCE,
        icon: 'CheckCircle',
        roles: ['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
        permissions: [{ resource: 'compliance', action: 'read' }],
        order: 17,
      },
      {
        id: 'configuration',
        name: 'Configuration',
        path: '/configuration',
        icon: 'Settings',
        roles: ['ADMIN'],
        permissions: [{ resource: 'system', action: 'configure' }],
        order: 18,
      },
      {
        id: 'integration',
        name: 'Integrations',
        path: '/integrations',
        icon: 'Plug',
        roles: ['ADMIN'],
        permissions: [{ resource: 'system', action: 'manage' }],
        order: 19,
      },
    ],
  },
]

// ============================================================================
// FLAT NAVIGATION ITEMS (For compatibility with existing code)
// ============================================================================

export const NAVIGATION_ITEMS: NavigationItem[] = NAVIGATION_SECTIONS.flatMap(
  (section) => section.items
).sort((a, b) => (a.order || 0) - (b.order || 0))

// ============================================================================
// QUICK ACCESS ITEMS (Shortcuts for common tasks)
// ============================================================================

export const QUICK_ACCESS_ITEMS = [
  {
    id: 'new-student',
    name: 'New Student',
    path: PROTECTED_ROUTES.STUDENTS_CREATE,
    icon: 'UserPlus',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
    description: 'Add a new student to the system',
  },
  {
    id: 'new-appointment',
    name: 'New Appointment',
    path: PROTECTED_ROUTES.APPOINTMENTS_CREATE,
    icon: 'CalendarPlus',
    roles: ['ADMIN', 'NURSE'],
    description: 'Schedule a new appointment',
  },
  {
    id: 'new-incident',
    name: 'New Incident',
    path: PROTECTED_ROUTES.INCIDENT_REPORTS_CREATE,
    icon: 'AlertCircle',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'COUNSELOR'],
    description: 'Report a new incident',
  },
  {
    id: 'send-communication',
    name: 'Send Message',
    path: PROTECTED_ROUTES.COMMUNICATION_SEND,
    icon: 'Send',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
    description: 'Send a communication',
  },
]

// Export individual sections for targeted use
export const CORE_SECTION = NAVIGATION_SECTIONS[0]
export const HEALTHCARE_SECTION = NAVIGATION_SECTIONS[1]
export const ADMINISTRATIVE_SECTION = NAVIGATION_SECTIONS[2]
export const COMMUNICATION_SECTION = NAVIGATION_SECTIONS[3]
export const EMERGENCY_SECTION = NAVIGATION_SECTIONS[4]
export const SYSTEM_SECTION = NAVIGATION_SECTIONS[5]
