module.exports = [
"[project]/src/config/navigationConfig.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * WF-CONFIG-001 | navigationConfig.ts - Navigation Configuration
 * Purpose: Centralized navigation structure for all 21 healthcare platform domains
 * Dependencies: ../types/navigation, ../constants/routes
 * Exports: NAVIGATION_SECTIONS, QUICK_ACCESS_ITEMS
 * Features: Role-based access, hierarchical structure, icon integration
 * Last Updated: 2025-10-27
 * Agent: Core Config/Constants Architect
 *
 * Navigation Structure:
 * - Core: Dashboard, User Management
 * - Clinical: Students, Health Records, Medications, Appointments, Immunizations
 * - Operations: Billing, Inventory, Purchasing, Vendors
 * - Communication: Messages, Documents, Notifications
 * - Incidents: Incident Reports, Witnesses, Follow-ups
 * - Analytics: Health Metrics, Reports, Dashboards
 * - Compliance: Audit Logs, Policies, Security
 * - System: Settings, Integrations, Configuration
 *
 * HIPAA Compliance:
 * - Role-based access control
 * - Audit trail integration
 * - PHI access restrictions
 * - Permission-based visibility
 */ __turbopack_context__.s([
    "NAVIGATION_SECTIONS",
    ()=>NAVIGATION_SECTIONS,
    "QUICK_ACCESS_ITEMS",
    ()=>QUICK_ACCESS_ITEMS,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getAllNavigationPaths",
    ()=>getAllNavigationPaths,
    "getBreadcrumbs",
    ()=>getBreadcrumbs,
    "getNavigationItemById",
    ()=>getNavigationItemById
]);
const NAVIGATION_SECTIONS = [
    // ============================================================================
    // CORE SECTION
    // ============================================================================
    {
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
                roles: [
                    'ADMIN',
                    'NURSE',
                    'SCHOOL_ADMIN',
                    'DISTRICT_ADMIN',
                    'TEACHER',
                    'PARENT'
                ]
            },
            {
                id: 'profile',
                name: 'My Profile',
                path: '/profile',
                icon: 'User',
                dataTestId: 'nav-profile',
                ariaLabel: 'Navigate to profile',
                roles: [
                    'ADMIN',
                    'NURSE',
                    'SCHOOL_ADMIN',
                    'DISTRICT_ADMIN',
                    'TEACHER',
                    'PARENT'
                ]
            }
        ]
    },
    // ============================================================================
    // CLINICAL SECTION
    // ============================================================================
    {
        title: 'Clinical',
        collapsible: true,
        defaultCollapsed: false,
        roles: [
            'ADMIN',
            'NURSE',
            'SCHOOL_ADMIN',
            'DISTRICT_ADMIN'
        ],
        items: [
            {
                id: 'students',
                name: 'Students',
                path: '/students',
                icon: 'Users',
                dataTestId: 'nav-students',
                ariaLabel: 'Manage student records',
                roles: [
                    'ADMIN',
                    'NURSE',
                    'SCHOOL_ADMIN',
                    'DISTRICT_ADMIN'
                ],
                children: [
                    {
                        id: 'students-list',
                        name: 'All Students',
                        path: '/students',
                        icon: 'List',
                        roles: [
                            'ADMIN',
                            'NURSE',
                            'SCHOOL_ADMIN',
                            'DISTRICT_ADMIN'
                        ]
                    },
                    {
                        id: 'students-add',
                        name: 'Add Student',
                        path: '/students/new',
                        icon: 'UserPlus',
                        roles: [
                            'ADMIN',
                            'NURSE',
                            'SCHOOL_ADMIN'
                        ]
                    },
                    {
                        id: 'students-import',
                        name: 'Import Students',
                        path: '/students/import',
                        icon: 'Upload',
                        roles: [
                            'ADMIN',
                            'SCHOOL_ADMIN',
                            'DISTRICT_ADMIN'
                        ]
                    }
                ]
            },
            {
                id: 'health-records',
                name: 'Health Records',
                path: '/health-records',
                icon: 'FileHeart',
                dataTestId: 'nav-health-records',
                ariaLabel: 'Access student health records',
                roles: [
                    'ADMIN',
                    'NURSE',
                    'SCHOOL_ADMIN'
                ],
                children: [
                    {
                        id: 'health-records-list',
                        name: 'All Records',
                        path: '/health-records',
                        icon: 'List',
                        roles: [
                            'ADMIN',
                            'NURSE',
                            'SCHOOL_ADMIN'
                        ]
                    },
                    {
                        id: 'health-records-pending',
                        name: 'Pending Review',
                        path: '/health-records/pending',
                        icon: 'Clock',
                        badge: '3',
                        badgeVariant: 'warning',
                        roles: [
                            'ADMIN',
                            'NURSE'
                        ]
                    }
                ]
            },
            {
                id: 'medications',
                name: 'Medications',
                path: '/medications',
                icon: 'Pill',
                dataTestId: 'nav-medications',
                ariaLabel: 'Manage student medications',
                roles: [
                    'ADMIN',
                    'NURSE'
                ],
                children: [
                    {
                        id: 'medications-list',
                        name: 'All Medications',
                        path: '/medications',
                        icon: 'List',
                        roles: [
                            'ADMIN',
                            'NURSE'
                        ]
                    },
                    {
                        id: 'medications-schedule',
                        name: 'Today\'s Schedule',
                        path: '/medications/schedule',
                        icon: 'Calendar',
                        roles: [
                            'ADMIN',
                            'NURSE'
                        ]
                    },
                    {
                        id: 'medications-log',
                        name: 'Administration Log',
                        path: '/medications/log',
                        icon: 'FileText',
                        roles: [
                            'ADMIN',
                            'NURSE'
                        ]
                    }
                ]
            },
            {
                id: 'appointments',
                name: 'Appointments',
                path: '/appointments',
                icon: 'Calendar',
                dataTestId: 'nav-appointments',
                ariaLabel: 'View and manage appointments',
                roles: [
                    'ADMIN',
                    'NURSE',
                    'SCHOOL_ADMIN'
                ],
                children: [
                    {
                        id: 'appointments-calendar',
                        name: 'Calendar View',
                        path: '/appointments',
                        icon: 'Calendar',
                        roles: [
                            'ADMIN',
                            'NURSE',
                            'SCHOOL_ADMIN'
                        ]
                    },
                    {
                        id: 'appointments-schedule',
                        name: 'Schedule Appointment',
                        path: '/appointments/new',
                        icon: 'CalendarPlus',
                        roles: [
                            'ADMIN',
                            'NURSE'
                        ]
                    },
                    {
                        id: 'appointments-today',
                        name: 'Today\'s Appointments',
                        path: '/appointments/today',
                        icon: 'Clock',
                        badge: '5',
                        badgeVariant: 'info',
                        roles: [
                            'ADMIN',
                            'NURSE'
                        ]
                    }
                ]
            },
            {
                id: 'immunizations',
                name: 'Immunizations',
                path: '/immunizations',
                icon: 'Shield',
                dataTestId: 'nav-immunizations',
                ariaLabel: 'Track student immunizations',
                roles: [
                    'ADMIN',
                    'NURSE',
                    'SCHOOL_ADMIN'
                ],
                children: [
                    {
                        id: 'immunizations-list',
                        name: 'All Records',
                        path: '/immunizations',
                        icon: 'List',
                        roles: [
                            'ADMIN',
                            'NURSE',
                            'SCHOOL_ADMIN'
                        ]
                    },
                    {
                        id: 'immunizations-due',
                        name: 'Due Soon',
                        path: '/immunizations/due',
                        icon: 'AlertCircle',
                        badge: '12',
                        badgeVariant: 'warning',
                        roles: [
                            'ADMIN',
                            'NURSE'
                        ]
                    },
                    {
                        id: 'immunizations-compliance',
                        name: 'Compliance Report',
                        path: '/immunizations/compliance',
                        icon: 'CheckCircle',
                        roles: [
                            'ADMIN',
                            'NURSE',
                            'SCHOOL_ADMIN',
                            'DISTRICT_ADMIN'
                        ]
                    }
                ]
            }
        ]
    },
    // ============================================================================
    // OPERATIONS SECTION
    // ============================================================================
    {
        title: 'Operations',
        collapsible: true,
        defaultCollapsed: false,
        roles: [
            'ADMIN',
            'SCHOOL_ADMIN',
            'DISTRICT_ADMIN'
        ],
        items: [
            {
                id: 'billing',
                name: 'Billing',
                path: '/billing',
                icon: 'DollarSign',
                dataTestId: 'nav-billing',
                ariaLabel: 'Manage billing and invoices',
                roles: [
                    'ADMIN',
                    'SCHOOL_ADMIN',
                    'DISTRICT_ADMIN'
                ],
                children: [
                    {
                        id: 'billing-invoices',
                        name: 'Invoices',
                        path: '/billing/invoices',
                        icon: 'FileText',
                        roles: [
                            'ADMIN',
                            'SCHOOL_ADMIN',
                            'DISTRICT_ADMIN'
                        ]
                    },
                    {
                        id: 'billing-payments',
                        name: 'Payments',
                        path: '/billing/payments',
                        icon: 'DollarSign',
                        roles: [
                            'ADMIN',
                            'SCHOOL_ADMIN',
                            'DISTRICT_ADMIN'
                        ]
                    },
                    {
                        id: 'billing-outstanding',
                        name: 'Outstanding',
                        path: '/billing/outstanding',
                        icon: 'AlertTriangle',
                        badge: '8',
                        badgeVariant: 'error',
                        roles: [
                            'ADMIN',
                            'SCHOOL_ADMIN',
                            'DISTRICT_ADMIN'
                        ]
                    }
                ]
            },
            {
                id: 'inventory',
                name: 'Inventory',
                path: '/inventory',
                icon: 'Package',
                dataTestId: 'nav-inventory',
                ariaLabel: 'Manage medical supplies inventory',
                roles: [
                    'ADMIN',
                    'NURSE',
                    'SCHOOL_ADMIN'
                ],
                children: [
                    {
                        id: 'inventory-items',
                        name: 'All Items',
                        path: '/inventory',
                        icon: 'List',
                        roles: [
                            'ADMIN',
                            'NURSE',
                            'SCHOOL_ADMIN'
                        ]
                    },
                    {
                        id: 'inventory-low-stock',
                        name: 'Low Stock',
                        path: '/inventory/low-stock',
                        icon: 'AlertTriangle',
                        badge: '4',
                        badgeVariant: 'warning',
                        roles: [
                            'ADMIN',
                            'NURSE',
                            'SCHOOL_ADMIN'
                        ]
                    },
                    {
                        id: 'inventory-expired',
                        name: 'Expiring Soon',
                        path: '/inventory/expiring',
                        icon: 'Clock',
                        roles: [
                            'ADMIN',
                            'NURSE'
                        ]
                    }
                ]
            },
            {
                id: 'purchasing',
                name: 'Purchasing',
                path: '/purchasing',
                icon: 'ShoppingCart',
                dataTestId: 'nav-purchasing',
                ariaLabel: 'Manage purchase orders',
                roles: [
                    'ADMIN',
                    'SCHOOL_ADMIN',
                    'DISTRICT_ADMIN'
                ],
                children: [
                    {
                        id: 'purchasing-orders',
                        name: 'Purchase Orders',
                        path: '/purchasing/orders',
                        icon: 'FileText',
                        roles: [
                            'ADMIN',
                            'SCHOOL_ADMIN',
                            'DISTRICT_ADMIN'
                        ]
                    },
                    {
                        id: 'purchasing-pending',
                        name: 'Pending Approval',
                        path: '/purchasing/pending',
                        icon: 'Clock',
                        badge: '2',
                        badgeVariant: 'warning',
                        roles: [
                            'ADMIN',
                            'SCHOOL_ADMIN',
                            'DISTRICT_ADMIN'
                        ]
                    }
                ]
            },
            {
                id: 'vendors',
                name: 'Vendors',
                path: '/vendors',
                icon: 'Store',
                dataTestId: 'nav-vendors',
                ariaLabel: 'Manage vendor relationships',
                roles: [
                    'ADMIN',
                    'SCHOOL_ADMIN',
                    'DISTRICT_ADMIN'
                ]
            }
        ]
    },
    // ============================================================================
    // COMMUNICATION SECTION
    // ============================================================================
    {
        title: 'Communication',
        collapsible: true,
        defaultCollapsed: false,
        roles: [
            'ADMIN',
            'NURSE',
            'SCHOOL_ADMIN',
            'DISTRICT_ADMIN',
            'TEACHER'
        ],
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
                roles: [
                    'ADMIN',
                    'NURSE',
                    'SCHOOL_ADMIN',
                    'DISTRICT_ADMIN',
                    'TEACHER'
                ]
            },
            {
                id: 'documents',
                name: 'Documents',
                path: '/documents',
                icon: 'FileText',
                dataTestId: 'nav-documents',
                ariaLabel: 'Manage documents and files',
                roles: [
                    'ADMIN',
                    'NURSE',
                    'SCHOOL_ADMIN',
                    'DISTRICT_ADMIN'
                ],
                children: [
                    {
                        id: 'documents-all',
                        name: 'All Documents',
                        path: '/documents',
                        icon: 'List',
                        roles: [
                            'ADMIN',
                            'NURSE',
                            'SCHOOL_ADMIN',
                            'DISTRICT_ADMIN'
                        ]
                    },
                    {
                        id: 'documents-templates',
                        name: 'Templates',
                        path: '/documents/templates',
                        icon: 'FileText',
                        roles: [
                            'ADMIN',
                            'NURSE',
                            'SCHOOL_ADMIN'
                        ]
                    },
                    {
                        id: 'documents-pending',
                        name: 'Pending Signature',
                        path: '/documents/pending',
                        icon: 'Edit',
                        badge: '3',
                        badgeVariant: 'warning',
                        roles: [
                            'ADMIN',
                            'NURSE',
                            'SCHOOL_ADMIN'
                        ]
                    }
                ]
            },
            {
                id: 'broadcasts',
                name: 'Broadcasts',
                path: '/broadcasts',
                icon: 'Send',
                dataTestId: 'nav-broadcasts',
                ariaLabel: 'Send bulk notifications',
                roles: [
                    'ADMIN',
                    'SCHOOL_ADMIN',
                    'DISTRICT_ADMIN'
                ]
            }
        ]
    },
    // ============================================================================
    // INCIDENTS SECTION
    // ============================================================================
    {
        title: 'Safety & Incidents',
        collapsible: true,
        defaultCollapsed: false,
        roles: [
            'ADMIN',
            'NURSE',
            'SCHOOL_ADMIN',
            'DISTRICT_ADMIN'
        ],
        items: [
            {
                id: 'incidents',
                name: 'Incident Reports',
                path: '/incidents',
                icon: 'AlertTriangle',
                dataTestId: 'nav-incidents',
                ariaLabel: 'View and manage incident reports',
                roles: [
                    'ADMIN',
                    'NURSE',
                    'SCHOOL_ADMIN',
                    'DISTRICT_ADMIN'
                ],
                children: [
                    {
                        id: 'incidents-all',
                        name: 'All Incidents',
                        path: '/incidents',
                        icon: 'List',
                        roles: [
                            'ADMIN',
                            'NURSE',
                            'SCHOOL_ADMIN',
                            'DISTRICT_ADMIN'
                        ]
                    },
                    {
                        id: 'incidents-new',
                        name: 'Report Incident',
                        path: '/incidents/new',
                        icon: 'AlertCircle',
                        roles: [
                            'ADMIN',
                            'NURSE',
                            'SCHOOL_ADMIN'
                        ]
                    },
                    {
                        id: 'incidents-pending',
                        name: 'Pending Review',
                        path: '/incidents/pending',
                        icon: 'Clock',
                        badge: '2',
                        badgeVariant: 'error',
                        roles: [
                            'ADMIN',
                            'NURSE',
                            'SCHOOL_ADMIN'
                        ]
                    }
                ]
            },
            {
                id: 'emergency-contacts',
                name: 'Emergency Contacts',
                path: '/emergency-contacts',
                icon: 'Phone',
                dataTestId: 'nav-emergency-contacts',
                ariaLabel: 'Manage emergency contact information',
                roles: [
                    'ADMIN',
                    'NURSE',
                    'SCHOOL_ADMIN'
                ]
            }
        ]
    },
    // ============================================================================
    // ANALYTICS SECTION
    // ============================================================================
    {
        title: 'Analytics & Reports',
        collapsible: true,
        defaultCollapsed: true,
        roles: [
            'ADMIN',
            'NURSE',
            'SCHOOL_ADMIN',
            'DISTRICT_ADMIN'
        ],
        items: [
            {
                id: 'analytics',
                name: 'Health Metrics',
                path: '/analytics',
                icon: 'BarChart3',
                dataTestId: 'nav-analytics',
                ariaLabel: 'View health analytics and metrics',
                roles: [
                    'ADMIN',
                    'NURSE',
                    'SCHOOL_ADMIN',
                    'DISTRICT_ADMIN'
                ]
            },
            {
                id: 'reports',
                name: 'Reports',
                path: '/reports',
                icon: 'FileText',
                dataTestId: 'nav-reports',
                ariaLabel: 'Generate and view reports',
                roles: [
                    'ADMIN',
                    'NURSE',
                    'SCHOOL_ADMIN',
                    'DISTRICT_ADMIN'
                ],
                children: [
                    {
                        id: 'reports-health',
                        name: 'Health Reports',
                        path: '/reports/health',
                        icon: 'FileHeart',
                        roles: [
                            'ADMIN',
                            'NURSE',
                            'SCHOOL_ADMIN',
                            'DISTRICT_ADMIN'
                        ]
                    },
                    {
                        id: 'reports-compliance',
                        name: 'Compliance Reports',
                        path: '/reports/compliance',
                        icon: 'CheckCircle',
                        roles: [
                            'ADMIN',
                            'SCHOOL_ADMIN',
                            'DISTRICT_ADMIN'
                        ]
                    },
                    {
                        id: 'reports-financial',
                        name: 'Financial Reports',
                        path: '/reports/financial',
                        icon: 'DollarSign',
                        roles: [
                            'ADMIN',
                            'SCHOOL_ADMIN',
                            'DISTRICT_ADMIN'
                        ]
                    }
                ]
            },
            {
                id: 'trends',
                name: 'Health Trends',
                path: '/trends',
                icon: 'TrendingUp',
                dataTestId: 'nav-trends',
                ariaLabel: 'View health trend analysis',
                roles: [
                    'ADMIN',
                    'NURSE',
                    'SCHOOL_ADMIN',
                    'DISTRICT_ADMIN'
                ]
            }
        ]
    },
    // ============================================================================
    // COMPLIANCE SECTION
    // ============================================================================
    {
        title: 'Compliance & Security',
        collapsible: true,
        defaultCollapsed: true,
        roles: [
            'ADMIN',
            'DISTRICT_ADMIN'
        ],
        items: [
            {
                id: 'audit-logs',
                name: 'Audit Logs',
                path: '/audit-logs',
                icon: 'Activity',
                dataTestId: 'nav-audit-logs',
                ariaLabel: 'View system audit logs',
                roles: [
                    'ADMIN',
                    'DISTRICT_ADMIN'
                ]
            },
            {
                id: 'permissions',
                name: 'Permissions',
                path: '/permissions',
                icon: 'Lock',
                dataTestId: 'nav-permissions',
                ariaLabel: 'Manage user permissions',
                roles: [
                    'ADMIN',
                    'DISTRICT_ADMIN'
                ]
            },
            {
                id: 'roles',
                name: 'Role Management',
                path: '/roles',
                icon: 'UserCog',
                dataTestId: 'nav-roles',
                ariaLabel: 'Manage user roles',
                roles: [
                    'ADMIN',
                    'DISTRICT_ADMIN'
                ]
            },
            {
                id: 'policies',
                name: 'Policies',
                path: '/policies',
                icon: 'Shield',
                dataTestId: 'nav-policies',
                ariaLabel: 'View compliance policies',
                roles: [
                    'ADMIN',
                    'DISTRICT_ADMIN'
                ]
            }
        ]
    },
    // ============================================================================
    // SYSTEM SECTION
    // ============================================================================
    {
        title: 'System',
        collapsible: true,
        defaultCollapsed: true,
        roles: [
            'ADMIN',
            'DISTRICT_ADMIN'
        ],
        items: [
            {
                id: 'settings',
                name: 'Settings',
                path: '/settings',
                icon: 'Settings',
                dataTestId: 'nav-settings',
                ariaLabel: 'Manage system settings',
                roles: [
                    'ADMIN',
                    'DISTRICT_ADMIN'
                ],
                children: [
                    {
                        id: 'settings-general',
                        name: 'General',
                        path: '/settings/general',
                        icon: 'Settings',
                        roles: [
                            'ADMIN',
                            'DISTRICT_ADMIN'
                        ]
                    },
                    {
                        id: 'settings-notifications',
                        name: 'Notifications',
                        path: '/settings/notifications',
                        icon: 'Bell',
                        roles: [
                            'ADMIN',
                            'DISTRICT_ADMIN'
                        ]
                    },
                    {
                        id: 'settings-integration',
                        name: 'Integrations',
                        path: '/settings/integrations',
                        icon: 'Plug',
                        roles: [
                            'ADMIN',
                            'DISTRICT_ADMIN'
                        ]
                    }
                ]
            },
            {
                id: 'users',
                name: 'User Management',
                path: '/users',
                icon: 'Users',
                dataTestId: 'nav-users',
                ariaLabel: 'Manage system users',
                roles: [
                    'ADMIN',
                    'DISTRICT_ADMIN'
                ]
            },
            {
                id: 'integrations',
                name: 'Integrations',
                path: '/integrations',
                icon: 'Plug',
                dataTestId: 'nav-integrations',
                ariaLabel: 'Manage third-party integrations',
                roles: [
                    'ADMIN',
                    'DISTRICT_ADMIN'
                ]
            }
        ]
    }
];
const QUICK_ACCESS_ITEMS = [
    {
        id: 'quick-add-student',
        name: 'Add Student',
        path: '/students/new',
        icon: 'UserPlus',
        description: 'Quickly add a new student to the system',
        roles: [
            'ADMIN',
            'NURSE',
            'SCHOOL_ADMIN'
        ]
    },
    {
        id: 'quick-schedule-appointment',
        name: 'Schedule',
        path: '/appointments/new',
        icon: 'CalendarPlus',
        description: 'Schedule a new appointment',
        roles: [
            'ADMIN',
            'NURSE',
            'SCHOOL_ADMIN'
        ]
    },
    {
        id: 'quick-log-medication',
        name: 'Log Med',
        path: '/medications/log',
        icon: 'Pill',
        description: 'Log medication administration',
        roles: [
            'ADMIN',
            'NURSE'
        ]
    },
    {
        id: 'quick-report-incident',
        name: 'Incident',
        path: '/incidents/new',
        icon: 'AlertCircle',
        description: 'Report a new incident',
        roles: [
            'ADMIN',
            'NURSE',
            'SCHOOL_ADMIN'
        ]
    },
    {
        id: 'quick-send-message',
        name: 'Message',
        path: '/messages/new',
        icon: 'Send',
        description: 'Send a new message',
        roles: [
            'ADMIN',
            'NURSE',
            'SCHOOL_ADMIN',
            'DISTRICT_ADMIN',
            'TEACHER'
        ]
    },
    {
        id: 'quick-view-today',
        name: 'Today',
        path: '/appointments/today',
        icon: 'Clock',
        description: 'View today\'s appointments',
        roles: [
            'ADMIN',
            'NURSE'
        ]
    }
];
function getNavigationItemById(id) {
    for (const section of NAVIGATION_SECTIONS){
        for (const item of section.items){
            if (item.id === id) return item;
            if (item.children) {
                const child = item.children.find((c)=>c.id === id);
                if (child) return child;
            }
        }
    }
    return undefined;
}
function getAllNavigationPaths() {
    const paths = [];
    for (const section of NAVIGATION_SECTIONS){
        for (const item of section.items){
            paths.push(item.path);
            if (item.children) {
                paths.push(...item.children.map((c)=>c.path));
            }
        }
    }
    return paths;
}
function getBreadcrumbs(path) {
    const breadcrumbs = [
        {
            name: 'Home',
            path: '/dashboard'
        }
    ];
    for (const section of NAVIGATION_SECTIONS){
        for (const item of section.items){
            if (item.path === path) {
                breadcrumbs.push({
                    name: item.name,
                    path: item.path
                });
                return breadcrumbs;
            }
            if (item.children) {
                const child = item.children.find((c)=>c.path === path);
                if (child) {
                    breadcrumbs.push({
                        name: item.name,
                        path: item.path
                    });
                    breadcrumbs.push({
                        name: child.name,
                        path: child.path
                    });
                    return breadcrumbs;
                }
            }
        }
    }
    return breadcrumbs;
}
const __TURBOPACK__default__export__ = {
    NAVIGATION_SECTIONS,
    QUICK_ACCESS_ITEMS,
    getNavigationItemById,
    getAllNavigationPaths,
    getBreadcrumbs
};
}),
"[project]/src/components/layouts/Breadcrumbs.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Breadcrumbs",
    ()=>Breadcrumbs,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * WF-COMP-LAY-001 | Breadcrumbs.tsx - Navigation Breadcrumb Trail Component
 * Purpose: Display hierarchical navigation path for current page
 * Dependencies: react, react-router-dom, lucide-react, NavigationContext
 * Features: Auto-generated from route, manual override, responsive, accessible
 * Last Updated: 2025-10-27
 * Agent: Layout Components Architect
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$NavigationContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/NavigationContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$navigationConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/navigationConfig.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const Breadcrumbs = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(({ items: customItems, showHomeIcon = true, maxItems = 5, separator, className = '', useContext = true })=>{
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const navigation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$NavigationContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useNavigation"])();
    // Determine breadcrumb items
    const breadcrumbItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        // 1. Use custom items if provided
        if (customItems && customItems.length > 0) {
            return customItems;
        }
        // 2. Use NavigationContext breadcrumbs if enabled
        if (useContext && navigation.breadcrumbs && navigation.breadcrumbs.length > 0) {
            return navigation.breadcrumbs.map((bc)=>({
                    label: bc.label,
                    path: bc.href
                }));
        }
        // 3. Auto-generate from current route
        const generated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$navigationConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBreadcrumbs"])(pathname);
        return generated.map((bc)=>({
                label: bc.name,
                path: bc.path
            }));
    }, [
        customItems,
        useContext,
        navigation.breadcrumbs,
        pathname
    ]);
    // Apply max items truncation
    const displayItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (breadcrumbItems.length <= maxItems) {
            return breadcrumbItems;
        }
        // Keep first item (home), last item (current), and truncate middle
        const firstItem = breadcrumbItems[0];
        const lastItems = breadcrumbItems.slice(-(maxItems - 2));
        return [
            firstItem,
            {
                label: '...',
                path: undefined
            },
            ...lastItems
        ];
    }, [
        breadcrumbItems,
        maxItems
    ]);
    // Don't render if no breadcrumbs
    if (displayItems.length === 0) {
        return null;
    }
    // Default separator
    const defaultSeparator = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
        className: "h-4 w-4 text-gray-400 dark:text-gray-600",
        "aria-hidden": "true"
    }, void 0, false, {
        fileName: "[project]/src/components/layouts/Breadcrumbs.tsx",
        lineNumber: 158,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Breadcrumb",
        className: `flex items-center text-sm ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
            className: "flex items-center space-x-2",
            children: displayItems.map((item, index)=>{
                const isLast = index === displayItems.length - 1;
                const isHome = index === 0 && item.path === '/dashboard';
                const isTruncated = item.label === '...';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    className: "flex items-center",
                    children: [
                        index > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "mr-2",
                            children: separator || defaultSeparator
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/Breadcrumbs.tsx",
                            lineNumber: 178,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        isTruncated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-500 dark:text-gray-400",
                            "aria-hidden": "true",
                            children: item.label
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/Breadcrumbs.tsx",
                            lineNumber: 184,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)) : isLast || !item.path ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-medium text-gray-900 dark:text-gray-100",
                            "aria-current": "page",
                            children: isHome && showHomeIcon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                className: "h-4 w-4",
                                "aria-label": "Home"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layouts/Breadcrumbs.tsx",
                                lineNumber: 196,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)) : item.label
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/Breadcrumbs.tsx",
                            lineNumber: 191,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: item.path || '#',
                            className: "   text-gray-600 hover:text-gray-900   dark:text-gray-400 dark:hover:text-gray-100   transition-colors duration-200   hover:underline focus:underline focus:outline-none   focus:ring-2 focus:ring-primary-500 focus:ring-offset-2   rounded-sm px-1 -mx-1   ",
                            "aria-label": `Navigate to ${item.label}`,
                            children: isHome && showHomeIcon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                className: "h-4 w-4",
                                "aria-label": "Home"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layouts/Breadcrumbs.tsx",
                                lineNumber: 215,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)) : item.label
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/Breadcrumbs.tsx",
                            lineNumber: 202,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, index, true, {
                    fileName: "[project]/src/components/layouts/Breadcrumbs.tsx",
                    lineNumber: 176,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0));
            })
        }, void 0, false, {
            fileName: "[project]/src/components/layouts/Breadcrumbs.tsx",
            lineNumber: 169,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/layouts/Breadcrumbs.tsx",
        lineNumber: 165,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
Breadcrumbs.displayName = 'Breadcrumbs';
const __TURBOPACK__default__export__ = Breadcrumbs;
}),
"[project]/src/components/ui/breadcrumb.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Breadcrumb",
    ()=>Breadcrumb,
    "BreadcrumbEllipsis",
    ()=>BreadcrumbEllipsis,
    "BreadcrumbItem",
    ()=>BreadcrumbItem,
    "BreadcrumbLink",
    ()=>BreadcrumbLink,
    "BreadcrumbList",
    ()=>BreadcrumbList,
    "BreadcrumbPage",
    ()=>BreadcrumbPage,
    "BreadcrumbSeparator",
    ()=>BreadcrumbSeparator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const Breadcrumb = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        ref: ref,
        "aria-label": "breadcrumb",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/breadcrumb.tsx",
        lineNumber: 14,
        columnNumber: 26
    }, ("TURBOPACK compile-time value", void 0)));
Breadcrumb.displayName = "Breadcrumb";
const BreadcrumbList = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/breadcrumb.tsx",
        lineNumber: 21,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
BreadcrumbList.displayName = "BreadcrumbList";
const BreadcrumbItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center gap-1.5", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/breadcrumb.tsx",
        lineNumber: 36,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
BreadcrumbItem.displayName = "BreadcrumbItem";
const BreadcrumbLink = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ asChild, className, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : "a";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("transition-colors hover:text-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/breadcrumb.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
BreadcrumbLink.displayName = "BreadcrumbLink";
const BreadcrumbPage = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        ref: ref,
        role: "link",
        "aria-disabled": "true",
        "aria-current": "page",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("font-normal text-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/breadcrumb.tsx",
        lineNumber: 66,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
BreadcrumbPage.displayName = "BreadcrumbPage";
const BreadcrumbSeparator = ({ children, className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        role: "presentation",
        "aria-hidden": "true",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("[&>svg]:w-3.5 [&>svg]:h-3.5", className),
        ...props,
        children: children ?? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {}, void 0, false, {
            fileName: "[project]/src/components/ui/breadcrumb.tsx",
            lineNumber: 88,
            columnNumber: 18
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/breadcrumb.tsx",
        lineNumber: 82,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
const BreadcrumbEllipsis = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        role: "presentation",
        "aria-hidden": "true",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-9 w-9 items-center justify-center", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/breadcrumb.tsx",
                lineNumber: 103,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "sr-only",
                children: "More"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/breadcrumb.tsx",
                lineNumber: 104,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/breadcrumb.tsx",
        lineNumber: 97,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";
;
}),
"[project]/src/components/common/PageBreadcrumbs.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Page Breadcrumbs Component
 * Provides consistent breadcrumb navigation across pages
 */ __turbopack_context__.s([
    "PageBreadcrumbs",
    ()=>PageBreadcrumbs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$breadcrumb$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/breadcrumb.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
function PageBreadcrumbs({ items, className = '' }) {
    if (items.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$breadcrumb$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Breadcrumb"], {
        className: className,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$breadcrumb$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BreadcrumbList"], {
            children: items.map((item, index)=>{
                const isLast = index === items.length - 1;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$breadcrumb$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BreadcrumbItem"], {
                            children: isLast ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$breadcrumb$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BreadcrumbPage"], {
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/src/components/common/PageBreadcrumbs.tsx",
                                lineNumber: 41,
                                columnNumber: 19
                            }, this) : item.href ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$breadcrumb$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BreadcrumbLink"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: item.href,
                                    children: item.label
                                }, void 0, false, {
                                    fileName: "[project]/src/components/common/PageBreadcrumbs.tsx",
                                    lineNumber: 44,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/common/PageBreadcrumbs.tsx",
                                lineNumber: 43,
                                columnNumber: 19
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/src/components/common/PageBreadcrumbs.tsx",
                                lineNumber: 47,
                                columnNumber: 19
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/common/PageBreadcrumbs.tsx",
                            lineNumber: 39,
                            columnNumber: 15
                        }, this),
                        !isLast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$breadcrumb$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BreadcrumbSeparator"], {}, void 0, false, {
                            fileName: "[project]/src/components/common/PageBreadcrumbs.tsx",
                            lineNumber: 50,
                            columnNumber: 27
                        }, this)
                    ]
                }, index, true, {
                    fileName: "[project]/src/components/common/PageBreadcrumbs.tsx",
                    lineNumber: 38,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/src/components/common/PageBreadcrumbs.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/common/PageBreadcrumbs.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
            outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-10 rounded-md px-8",
            icon: "h-9 w-9",
            "icon-sm": "size-8",
            "icon-lg": "size-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 51,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Button.displayName = "Button";
;
}),
"[project]/src/components/ui/skeleton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
function Skeleton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("animate-pulse rounded-md bg-primary/10", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/skeleton.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/src/components/ui/alert-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertDialog",
    ()=>AlertDialog,
    "AlertDialogAction",
    ()=>AlertDialogAction,
    "AlertDialogCancel",
    ()=>AlertDialogCancel,
    "AlertDialogContent",
    ()=>AlertDialogContent,
    "AlertDialogDescription",
    ()=>AlertDialogDescription,
    "AlertDialogFooter",
    ()=>AlertDialogFooter,
    "AlertDialogHeader",
    ()=>AlertDialogHeader,
    "AlertDialogOverlay",
    ()=>AlertDialogOverlay,
    "AlertDialogPortal",
    ()=>AlertDialogPortal,
    "AlertDialogTitle",
    ()=>AlertDialogTitle,
    "AlertDialogTrigger",
    ()=>AlertDialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-alert-dialog/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const AlertDialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"];
const AlertDialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"];
const AlertDialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"];
const AlertDialogOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Overlay"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
        ...props,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 19,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
AlertDialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const AlertDialogContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogOverlay, {}, void 0, false, {
                fileName: "[project]/src/components/ui/alert-dialog.tsx",
                lineNumber: 35,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className),
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ui/alert-dialog.tsx",
                lineNumber: 36,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 34,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
AlertDialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"].displayName;
const AlertDialogHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-2 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 52,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 66,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 80,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
AlertDialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"].displayName;
const AlertDialogDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 92,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
AlertDialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"].displayName;
const AlertDialogAction = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buttonVariants"])(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 105,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
AlertDialogAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Action"].displayName;
const AlertDialogCancel = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Cancel"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buttonVariants"])({
            variant: "outline"
        }), "mt-2 sm:mt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 117,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
AlertDialogCancel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Cancel"].displayName;
;
}),
"[project]/src/hooks/useConfirmDialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Confirmation Dialog Hook
 * Provides a reusable confirmation dialog for destructive actions
 */ __turbopack_context__.s([
    "useConfirmDialog",
    ()=>useConfirmDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/alert-dialog.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
function useConfirmDialog() {
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [options, setOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        title: '',
        description: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        variant: 'default'
    });
    const [resolveCallback, setResolveCallback] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const confirm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((confirmOptions)=>{
        setOptions({
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            variant: 'default',
            ...confirmOptions
        });
        setIsOpen(true);
        return new Promise((resolve)=>{
            setResolveCallback(()=>resolve);
        });
    }, []);
    const handleConfirm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (resolveCallback) {
            resolveCallback(true);
        }
        setIsOpen(false);
        setResolveCallback(null);
    }, [
        resolveCallback
    ]);
    const handleCancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (resolveCallback) {
            resolveCallback(false);
        }
        setIsOpen(false);
        setResolveCallback(null);
    }, [
        resolveCallback
    ]);
    const ConfirmDialog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialog"], {
            open: isOpen,
            onOpenChange: setIsOpen,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                children: options.title
                            }, void 0, false, {
                                fileName: "[project]/src/hooks/useConfirmDialog.tsx",
                                lineNumber: 73,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                children: options.description
                            }, void 0, false, {
                                fileName: "[project]/src/hooks/useConfirmDialog.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/hooks/useConfirmDialog.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                onClick: handleCancel,
                                children: options.cancelText
                            }, void 0, false, {
                                fileName: "[project]/src/hooks/useConfirmDialog.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                onClick: handleConfirm,
                                className: options.variant === 'destructive' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-600' : '',
                                children: options.confirmText
                            }, void 0, false, {
                                fileName: "[project]/src/hooks/useConfirmDialog.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/hooks/useConfirmDialog.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/hooks/useConfirmDialog.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/hooks/useConfirmDialog.tsx",
            lineNumber: 70,
            columnNumber: 5
        }, this), [
        isOpen,
        options,
        handleConfirm,
        handleCancel
    ]);
    return {
        confirm,
        ConfirmDialog
    };
}
}),
"[project]/src/hooks/use-toast.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Toast Notification Hook
 * Provides toast notification functionality for user feedback
 */ __turbopack_context__.s([
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
let toastCount = 0;
function useToast() {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        toasts: []
    });
    const toast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(({ title, description, variant = 'default', duration = 5000 })=>{
        const id = `toast-${++toastCount}`;
        const newToast = {
            id,
            title,
            description,
            variant,
            duration
        };
        setState((prev)=>({
                toasts: [
                    ...prev.toasts,
                    newToast
                ]
            }));
        // Auto dismiss
        if (duration > 0) {
            setTimeout(()=>{
                setState((prev)=>({
                        toasts: prev.toasts.filter((t)=>t.id !== id)
                    }));
            }, duration);
        }
        return id;
    }, []);
    const dismiss = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        setState((prev)=>({
                toasts: prev.toasts.filter((t)=>t.id !== id)
            }));
    }, []);
    return {
        toast,
        dismiss,
        toasts: state.toasts
    };
}
}),
"[project]/src/lib/actions/appointments.actions.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Appointments Actions
 * Barrel export for appointment management actions
 *
 * This file maintains backward compatibility by re-exporting all
 * appointment-related functions and types from their respective modules.
 *
 * Architecture:
 * - appointments.types.ts - Type definitions
 * - appointments.cache.ts - Cached GET operations with React cache()
 * - appointments.crud.ts - Create, update, delete operations
 * - appointments.utils.ts - Convenience functions and aliases
 */ // Type exports
__turbopack_context__.s([]);
;
;
;
}),
"[project]/src/lib/actions/data:d6dcb1 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"7fa116af0736d6034e1d56926441256eda17534051":"getAppointments"},"src/lib/actions/appointments.cache.ts",""] */ __turbopack_context__.s([
    "getAppointments",
    ()=>getAppointments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var getAppointments = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("7fa116af0736d6034e1d56926441256eda17534051", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getAppointments"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYXBwb2ludG1lbnRzLmNhY2hlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBBcHBvaW50bWVudHMgQ2FjaGUgT3BlcmF0aW9uc1xyXG4gKiBDYWNoZWQgR0VUIG9wZXJhdGlvbnMgd2l0aCBSZWFjdCBjYWNoZSgpIGZvciBhcHBvaW50bWVudCBkYXRhIGZldGNoaW5nXHJcbiAqXHJcbiAqIEZlYXR1cmVzOlxyXG4gKiAtIFJlYWN0IGNhY2hlKCkgZm9yIHJlcXVlc3QgbWVtb2l6YXRpb25cclxuICogLSBOZXh0LmpzIGNhY2hlIGludGVncmF0aW9uIHdpdGggcHJvcGVyIFRUTFxyXG4gKiAtIFBISS1jb21wbGlhbnQgY2FjaGUgdGFnc1xyXG4gKiAtIEhJUEFBIGF1ZGl0IGxvZ2dpbmcgZm9yIGFsbCBQSEkgYWNjZXNzXHJcbiAqIC0gQ29tcHJlaGVuc2l2ZSBlcnJvciBoYW5kbGluZ1xyXG4gKi9cclxuXHJcbid1c2Ugc2VydmVyJztcclxuXHJcbmltcG9ydCB7IGNhY2hlIH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBzZXJ2ZXJHZXQgfSBmcm9tICdAL2xpYi9zZXJ2ZXIvYXBpLWNsaWVudCc7XHJcbmltcG9ydCB7IEFQSV9FTkRQT0lOVFMgfSBmcm9tICdAL2NvbnN0YW50cy9hcGknO1xyXG5pbXBvcnQgeyBDQUNIRV9UQUdTLCBDQUNIRV9UVEwgfSBmcm9tICdAL2xpYi9jYWNoZS9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBhdWRpdExvZywgQVVESVRfQUNUSU9OUyB9IGZyb20gJ0AvbGliL2F1ZGl0JztcclxuaW1wb3J0IHsgYXV0aCB9IGZyb20gJ0AvbGliL2F1dGgnO1xyXG5pbXBvcnQgeyBoZWFkZXJzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJztcclxuaW1wb3J0IHR5cGUgeyBBcHBvaW50bWVudCwgQXBwb2ludG1lbnRGaWx0ZXJzIH0gZnJvbSAnLi9hcHBvaW50bWVudHMudHlwZXMnO1xyXG5cclxuLyoqXHJcbiAqIEdldCBhcHBvaW50bWVudHMgd2l0aCBvcHRpb25hbCBmaWx0ZXJzXHJcbiAqIFVzZXMgUmVhY3QgY2FjaGUoKSBmb3IgYXV0b21hdGljIHJlcXVlc3QgbWVtb2l6YXRpb25cclxuICogSElQQUE6IExvZ3MgYWxsIGFwcG9pbnRtZW50IGxpc3QgYWNjZXNzXHJcbiAqXHJcbiAqIEBwYXJhbSBmaWx0ZXJzIC0gT3B0aW9uYWwgZmlsdGVycyBmb3IgYXBwb2ludG1lbnQgbGlzdFxyXG4gKiBAcmV0dXJucyBQcm9taXNlIHdpdGggYXBwb2ludG1lbnRzIGFycmF5IGFuZCB0b3RhbCBjb3VudFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGdldEFwcG9pbnRtZW50cyA9IGNhY2hlKGFzeW5jIChmaWx0ZXJzPzogQXBwb2ludG1lbnRGaWx0ZXJzKTogUHJvbWlzZTx7XHJcbiAgYXBwb2ludG1lbnRzOiBBcHBvaW50bWVudFtdO1xyXG4gIHRvdGFsOiBudW1iZXI7XHJcbn0+ID0+IHtcclxuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgYXV0aCgpO1xyXG4gIGNvbnN0IGhlYWRlcnNMaXN0ID0gYXdhaXQgaGVhZGVycygpO1xyXG5cclxuICB0cnkge1xyXG4gICAgLy8gQnVpbGQgcXVlcnkgc3RyaW5nIGZyb20gZmlsdGVyc1xyXG4gICAgY29uc3QgcXVlcnlTdHJpbmcgPSBmaWx0ZXJzXHJcbiAgICAgID8gJz8nICsgbmV3IFVSTFNlYXJjaFBhcmFtcyhcclxuICAgICAgICAgIE9iamVjdC5lbnRyaWVzKGZpbHRlcnMpLm1hcCgoW2ssIHZdKSA9PiBbaywgU3RyaW5nKHYpXSlcclxuICAgICAgICApLnRvU3RyaW5nKClcclxuICAgICAgOiAnJztcclxuXHJcbiAgICAvLyBzZXJ2ZXJHZXQgcmV0dXJucyBBcGlSZXNwb25zZTxUPiwgc28gcmVzcG9uc2UgaXRzZWxmIGlzIEFwaVJlc3BvbnNlXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZlckdldDx7IGFwcG9pbnRtZW50czogQXBwb2ludG1lbnRbXTsgdG90YWw6IG51bWJlciB9PihcclxuICAgICAgYCR7QVBJX0VORFBPSU5UUy5BUFBPSU5UTUVOVFM/LkJBU0UgfHwgJy9hcHBvaW50bWVudHMnfSR7cXVlcnlTdHJpbmd9YCxcclxuICAgICAge1xyXG4gICAgICAgIGNhY2hlOiAnZm9yY2UtY2FjaGUnLFxyXG4gICAgICAgIG5leHQ6IHtcclxuICAgICAgICAgIHJldmFsaWRhdGU6IENBQ0hFX1RUTD8uUEhJX1NUQU5EQVJEIHx8IDMwMCxcclxuICAgICAgICAgIHRhZ3M6IFtDQUNIRV9UQUdTPy5BUFBPSU5UTUVOVFMgfHwgJ2FwcG9pbnRtZW50cycsIENBQ0hFX1RBR1M/LlBISSB8fCAncGhpJ10sXHJcbiAgICAgICAgfSxcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBISVBBQSBBdWRpdCBMb2c6IFRyYWNrIGFwcG9pbnRtZW50IGxpc3QgYWNjZXNzXHJcbiAgICBhd2FpdCBhdWRpdExvZyh7XHJcbiAgICAgIHVzZXJJZDogc2Vzc2lvbj8udXNlcj8uaWQsXHJcbiAgICAgIGFjdGlvbjogQVVESVRfQUNUSU9OUy5MSVNUX0FQUE9JTlRNRU5UUyxcclxuICAgICAgcmVzb3VyY2U6ICdhcHBvaW50bWVudHMnLFxyXG4gICAgICBkZXRhaWxzOiBmaWx0ZXJzID8gYEZpbHRlcnM6ICR7SlNPTi5zdHJpbmdpZnkoZmlsdGVycyl9YCA6ICdObyBmaWx0ZXJzJyxcclxuICAgICAgaXBBZGRyZXNzOiBoZWFkZXJzTGlzdC5nZXQoJ3gtZm9yd2FyZGVkLWZvcicpIHx8IGhlYWRlcnNMaXN0LmdldCgneC1yZWFsLWlwJykgfHwgdW5kZWZpbmVkLFxyXG4gICAgICB1c2VyQWdlbnQ6IGhlYWRlcnNMaXN0LmdldCgndXNlci1hZ2VudCcpIHx8IHVuZGVmaW5lZCxcclxuICAgICAgc3VjY2VzczogcmVzcG9uc2U/LnN1Y2Nlc3MgfHwgZmFsc2UsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyByZXNwb25zZS5kYXRhIGhhcyB0eXBlIHsgYXBwb2ludG1lbnRzOiBBcHBvaW50bWVudFtdOyB0b3RhbDogbnVtYmVyIH1cclxuICAgIGNvbnN0IHJlc3VsdCA9IHJlc3BvbnNlPy5kYXRhO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYXBwb2ludG1lbnRzOiByZXN1bHQ/LmFwcG9pbnRtZW50cyB8fCBbXSxcclxuICAgICAgdG90YWw6IHJlc3VsdD8udG90YWwgfHwgMCxcclxuICAgIH07XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIC8vIEhJUEFBIEF1ZGl0IExvZzogVHJhY2sgZmFpbGVkIGFjY2Vzc1xyXG4gICAgYXdhaXQgYXVkaXRMb2coe1xyXG4gICAgICB1c2VySWQ6IHNlc3Npb24/LnVzZXI/LmlkLFxyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuTElTVF9BUFBPSU5UTUVOVFMsXHJcbiAgICAgIHJlc291cmNlOiAnYXBwb2ludG1lbnRzJyxcclxuICAgICAgZGV0YWlsczogZmlsdGVycyA/IGBGaWx0ZXJzOiAke0pTT04uc3RyaW5naWZ5KGZpbHRlcnMpfWAgOiAnTm8gZmlsdGVycycsXHJcbiAgICAgIGlwQWRkcmVzczogaGVhZGVyc0xpc3QuZ2V0KCd4LWZvcndhcmRlZC1mb3InKSB8fCBoZWFkZXJzTGlzdC5nZXQoJ3gtcmVhbC1pcCcpIHx8IHVuZGVmaW5lZCxcclxuICAgICAgdXNlckFnZW50OiBoZWFkZXJzTGlzdC5nZXQoJ3VzZXItYWdlbnQnKSB8fCB1bmRlZmluZWQsXHJcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICBlcnJvck1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGZldGNoIGFwcG9pbnRtZW50czonLCBlcnJvcik7XHJcbiAgICByZXR1cm4geyBhcHBvaW50bWVudHM6IFtdLCB0b3RhbDogMCB9O1xyXG4gIH1cclxufSk7XHJcblxyXG4vKipcclxuICogR2V0IGEgc2luZ2xlIGFwcG9pbnRtZW50IGJ5IElEXHJcbiAqIFVzZXMgUmVhY3QgY2FjaGUoKSBmb3IgYXV0b21hdGljIHJlcXVlc3QgbWVtb2l6YXRpb25cclxuICogSElQQUE6IExvZ3MgYWxsIGluZGl2aWR1YWwgYXBwb2ludG1lbnQgYWNjZXNzXHJcbiAqXHJcbiAqIEBwYXJhbSBpZCAtIEFwcG9pbnRtZW50IElEXHJcbiAqIEByZXR1cm5zIFByb21pc2Ugd2l0aCBhcHBvaW50bWVudCBkYXRhIG9yIG51bGwgaWYgbm90IGZvdW5kXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZ2V0QXBwb2ludG1lbnQgPSBjYWNoZShhc3luYyAoaWQ6IHN0cmluZyk6IFByb21pc2U8QXBwb2ludG1lbnQgfCBudWxsPiA9PiB7XHJcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGF1dGgoKTtcclxuICBjb25zdCBoZWFkZXJzTGlzdCA9IGF3YWl0IGhlYWRlcnMoKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIC8vIHNlcnZlckdldCByZXR1cm5zIEFwaVJlc3BvbnNlPFQ+LCBzbyByZXNwb25zZSBpdHNlbGYgaXMgQXBpUmVzcG9uc2VcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmVyR2V0PEFwcG9pbnRtZW50PihcclxuICAgICAgQVBJX0VORFBPSU5UUy5BUFBPSU5UTUVOVFM/LkJZX0lEPy4oaWQpIHx8IGAvYXBwb2ludG1lbnRzLyR7aWR9YCxcclxuICAgICAge1xyXG4gICAgICAgIGNhY2hlOiAnZm9yY2UtY2FjaGUnLFxyXG4gICAgICAgIG5leHQ6IHtcclxuICAgICAgICAgIHJldmFsaWRhdGU6IENBQ0hFX1RUTD8uUEhJX1NUQU5EQVJEIHx8IDMwMCxcclxuICAgICAgICAgIHRhZ3M6IFtgYXBwb2ludG1lbnQtJHtpZH1gLCBDQUNIRV9UQUdTPy5BUFBPSU5UTUVOVFMgfHwgJ2FwcG9pbnRtZW50cycsIENBQ0hFX1RBR1M/LlBISSB8fCAncGhpJ10sXHJcbiAgICAgICAgfSxcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBISVBBQSBBdWRpdCBMb2c6IFRyYWNrIGFwcG9pbnRtZW50IGFjY2Vzc1xyXG4gICAgYXdhaXQgYXVkaXRMb2coe1xyXG4gICAgICB1c2VySWQ6IHNlc3Npb24/LnVzZXI/LmlkLFxyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuVklFV19BUFBPSU5UTUVOVCxcclxuICAgICAgcmVzb3VyY2U6ICdhcHBvaW50bWVudCcsXHJcbiAgICAgIHJlc291cmNlSWQ6IGlkLFxyXG4gICAgICBpcEFkZHJlc3M6IGhlYWRlcnNMaXN0LmdldCgneC1mb3J3YXJkZWQtZm9yJykgfHwgaGVhZGVyc0xpc3QuZ2V0KCd4LXJlYWwtaXAnKSB8fCB1bmRlZmluZWQsXHJcbiAgICAgIHVzZXJBZ2VudDogaGVhZGVyc0xpc3QuZ2V0KCd1c2VyLWFnZW50JykgfHwgdW5kZWZpbmVkLFxyXG4gICAgICBzdWNjZXNzOiByZXNwb25zZT8uc3VjY2VzcyB8fCBmYWxzZSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHJlc3BvbnNlLmRhdGEgaGFzIHR5cGUgQXBwb2ludG1lbnRcclxuICAgIGlmICghcmVzcG9uc2U/LnN1Y2Nlc3MgfHwgIXJlc3BvbnNlPy5kYXRhKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIC8vIEhJUEFBIEF1ZGl0IExvZzogVHJhY2sgZmFpbGVkIGFjY2Vzc1xyXG4gICAgYXdhaXQgYXVkaXRMb2coe1xyXG4gICAgICB1c2VySWQ6IHNlc3Npb24/LnVzZXI/LmlkLFxyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuVklFV19BUFBPSU5UTUVOVCxcclxuICAgICAgcmVzb3VyY2U6ICdhcHBvaW50bWVudCcsXHJcbiAgICAgIHJlc291cmNlSWQ6IGlkLFxyXG4gICAgICBpcEFkZHJlc3M6IGhlYWRlcnNMaXN0LmdldCgneC1mb3J3YXJkZWQtZm9yJykgfHwgaGVhZGVyc0xpc3QuZ2V0KCd4LXJlYWwtaXAnKSB8fCB1bmRlZmluZWQsXHJcbiAgICAgIHVzZXJBZ2VudDogaGVhZGVyc0xpc3QuZ2V0KCd1c2VyLWFnZW50JykgfHwgdW5kZWZpbmVkLFxyXG4gICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgZXJyb3JNZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdVbmtub3duIGVycm9yJyxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBmZXRjaCBhcHBvaW50bWVudCAke2lkfTpgLCBlcnJvcik7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn0pO1xyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjhTQStCYSJ9
}),
"[project]/src/lib/actions/data:6feac3 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4054d0ed2fc0691098fcc94d488e5746cb87a2b5ec":"deleteAppointment"},"src/lib/actions/appointments.crud.ts",""] */ __turbopack_context__.s([
    "deleteAppointment",
    ()=>deleteAppointment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var deleteAppointment = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("4054d0ed2fc0691098fcc94d488e5746cb87a2b5ec", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "deleteAppointment"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYXBwb2ludG1lbnRzLmNydWQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEFwcG9pbnRtZW50cyBDUlVEIE9wZXJhdGlvbnNcclxuICogQ3JlYXRlLCB1cGRhdGUsIGFuZCBkZWxldGUgb3BlcmF0aW9ucyB3aXRoIGNhY2hlIGludmFsaWRhdGlvblxyXG4gKlxyXG4gKiBGZWF0dXJlczpcclxuICogLSBGdWxsIENSVUQgb3BlcmF0aW9ucyBmb3IgYXBwb2ludG1lbnRzXHJcbiAqIC0gSElQQUEgYXVkaXQgbG9nZ2luZyBmb3IgYWxsIFBISSBtb2RpZmljYXRpb25zXHJcbiAqIC0gQXV0b21hdGljIGNhY2hlIGludmFsaWRhdGlvbiB3aXRoIHJldmFsaWRhdGVUYWcvcmV2YWxpZGF0ZVBhdGhcclxuICogLSBDb21wcmVoZW5zaXZlIGVycm9yIGhhbmRsaW5nXHJcbiAqIC0gVHlwZS1zYWZlIHJldHVybiB2YWx1ZXNcclxuICovXHJcblxyXG4ndXNlIHNlcnZlcic7XHJcblxyXG5pbXBvcnQgeyByZXZhbGlkYXRlUGF0aCwgcmV2YWxpZGF0ZVRhZyB9IGZyb20gJ25leHQvY2FjaGUnO1xyXG5pbXBvcnQgeyBzZXJ2ZXJQb3N0LCBzZXJ2ZXJQdXQsIHNlcnZlckRlbGV0ZSB9IGZyb20gJ0AvbGliL3NlcnZlci9hcGktY2xpZW50JztcclxuaW1wb3J0IHsgQVBJX0VORFBPSU5UUyB9IGZyb20gJ0AvY29uc3RhbnRzL2FwaSc7XHJcbmltcG9ydCB7IENBQ0hFX1RBR1MgfSBmcm9tICdAL2xpYi9jYWNoZS9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBhdWRpdExvZywgQVVESVRfQUNUSU9OUyB9IGZyb20gJ0AvbGliL2F1ZGl0JztcclxuaW1wb3J0IHsgYXV0aCB9IGZyb20gJ0AvbGliL2F1dGgnO1xyXG5pbXBvcnQgeyBoZWFkZXJzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJztcclxuaW1wb3J0IHR5cGUgeyBBcHBvaW50bWVudCwgQ3JlYXRlQXBwb2ludG1lbnREYXRhLCBVcGRhdGVBcHBvaW50bWVudERhdGEgfSBmcm9tICcuL2FwcG9pbnRtZW50cy50eXBlcyc7XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgbmV3IGFwcG9pbnRtZW50XHJcbiAqIEhJUEFBOiBMb2dzIGFsbCBhcHBvaW50bWVudCBjcmVhdGlvbiB3aXRoIGF1ZGl0IHRyYWlsXHJcbiAqXHJcbiAqIEBwYXJhbSBkYXRhIC0gQXBwb2ludG1lbnQgY3JlYXRpb24gZGF0YVxyXG4gKiBAcmV0dXJucyBQcm9taXNlIHdpdGggc3VjY2VzcyBzdGF0dXMsIGFwcG9pbnRtZW50IElELCBhbmQgb3B0aW9uYWwgZXJyb3JcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVBcHBvaW50bWVudChkYXRhOiBDcmVhdGVBcHBvaW50bWVudERhdGEpOiBQcm9taXNlPHtcclxuICBzdWNjZXNzOiBib29sZWFuO1xyXG4gIGlkPzogc3RyaW5nO1xyXG4gIGVycm9yPzogc3RyaW5nO1xyXG59PiB7XHJcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGF1dGgoKTtcclxuICBjb25zdCBoZWFkZXJzTGlzdCA9IGF3YWl0IGhlYWRlcnMoKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIC8vIHNlcnZlclBvc3QgcmV0dXJucyBBcGlSZXNwb25zZTxUPiwgc28gcmVzcG9uc2UgaXRzZWxmIGlzIEFwaVJlc3BvbnNlXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlcnZlclBvc3Q8QXBwb2ludG1lbnQ+KFxyXG4gICAgICBBUElfRU5EUE9JTlRTLkFQUE9JTlRNRU5UUz8uQkFTRSB8fCAnL2FwcG9pbnRtZW50cycsXHJcbiAgICAgIGRhdGEsXHJcbiAgICAgIHtcclxuICAgICAgICBjYWNoZTogJ25vLXN0b3JlJyxcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAoIXJlc3BvbnNlLnN1Y2Nlc3MgfHwgIXJlc3BvbnNlLmRhdGEpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3BvbnNlLm1lc3NhZ2UgfHwgJ0ZhaWxlZCB0byBjcmVhdGUgYXBwb2ludG1lbnQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBISVBBQSBBdWRpdCBMb2c6IFRyYWNrIGFwcG9pbnRtZW50IGNyZWF0aW9uXHJcbiAgICBhd2FpdCBhdWRpdExvZyh7XHJcbiAgICAgIHVzZXJJZDogc2Vzc2lvbj8udXNlcj8uaWQsXHJcbiAgICAgIGFjdGlvbjogQVVESVRfQUNUSU9OUy5DUkVBVEVfQVBQT0lOVE1FTlQsXHJcbiAgICAgIHJlc291cmNlOiAnYXBwb2ludG1lbnQnLFxyXG4gICAgICByZXNvdXJjZUlkOiByZXNwb25zZS5kYXRhLmlkLFxyXG4gICAgICBkZXRhaWxzOiBgQ3JlYXRlZCBhcHBvaW50bWVudCBmb3Igc3R1ZGVudCAke2RhdGEuc3R1ZGVudElkfWAsXHJcbiAgICAgIGlwQWRkcmVzczogaGVhZGVyc0xpc3QuZ2V0KCd4LWZvcndhcmRlZC1mb3InKSB8fCBoZWFkZXJzTGlzdC5nZXQoJ3gtcmVhbC1pcCcpIHx8IHVuZGVmaW5lZCxcclxuICAgICAgdXNlckFnZW50OiBoZWFkZXJzTGlzdC5nZXQoJ3VzZXItYWdlbnQnKSB8fCB1bmRlZmluZWQsXHJcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgIGNoYW5nZXM6IHsgY3JlYXRlZDogZGF0YSB9LFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQ2FjaGUgaW52YWxpZGF0aW9uXHJcbiAgICByZXZhbGlkYXRlVGFnKENBQ0hFX1RBR1M/LkFQUE9JTlRNRU5UUyB8fCAnYXBwb2ludG1lbnRzJywgJ2RlZmF1bHQnKTtcclxuICAgIHJldmFsaWRhdGVQYXRoKCcvYXBwb2ludG1lbnRzJyk7XHJcbiAgICByZXZhbGlkYXRlUGF0aCgnL2Rhc2hib2FyZCcpO1xyXG5cclxuICAgIC8vIHJlc3BvbnNlLmRhdGEgaGFzIHR5cGUgQXBwb2ludG1lbnRcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgIGlkOiByZXNwb25zZS5kYXRhLmlkLFxyXG4gICAgfTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgLy8gSElQQUEgQXVkaXQgTG9nOiBUcmFjayBmYWlsZWQgY3JlYXRpb25cclxuICAgIGF3YWl0IGF1ZGl0TG9nKHtcclxuICAgICAgdXNlcklkOiBzZXNzaW9uPy51c2VyPy5pZCxcclxuICAgICAgYWN0aW9uOiBBVURJVF9BQ1RJT05TLkNSRUFURV9BUFBPSU5UTUVOVCxcclxuICAgICAgcmVzb3VyY2U6ICdhcHBvaW50bWVudCcsXHJcbiAgICAgIGRldGFpbHM6IGBGYWlsZWQgdG8gY3JlYXRlIGFwcG9pbnRtZW50IGZvciBzdHVkZW50ICR7ZGF0YS5zdHVkZW50SWR9YCxcclxuICAgICAgaXBBZGRyZXNzOiBoZWFkZXJzTGlzdC5nZXQoJ3gtZm9yd2FyZGVkLWZvcicpIHx8IGhlYWRlcnNMaXN0LmdldCgneC1yZWFsLWlwJykgfHwgdW5kZWZpbmVkLFxyXG4gICAgICB1c2VyQWdlbnQ6IGhlYWRlcnNMaXN0LmdldCgndXNlci1hZ2VudCcpIHx8IHVuZGVmaW5lZCxcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIGVycm9yTWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiAnVW5rbm93biBlcnJvcicsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIGFwcG9pbnRtZW50OicsIGVycm9yKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICBlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiAnRmFpbGVkIHRvIGNyZWF0ZSBhcHBvaW50bWVudCcsXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBhbiBleGlzdGluZyBhcHBvaW50bWVudFxyXG4gKiBISVBBQTogTG9ncyBhbGwgYXBwb2ludG1lbnQgbW9kaWZpY2F0aW9ucyB3aXRoIGNoYW5nZSB0cmFja2luZ1xyXG4gKlxyXG4gKiBAcGFyYW0gaWQgLSBBcHBvaW50bWVudCBJRCB0byB1cGRhdGVcclxuICogQHBhcmFtIGRhdGEgLSBVcGRhdGVkIGFwcG9pbnRtZW50IGRhdGFcclxuICogQHJldHVybnMgUHJvbWlzZSB3aXRoIHN1Y2Nlc3Mgc3RhdHVzIGFuZCBvcHRpb25hbCBlcnJvclxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUFwcG9pbnRtZW50KFxyXG4gIGlkOiBzdHJpbmcsXHJcbiAgZGF0YTogVXBkYXRlQXBwb2ludG1lbnREYXRhXHJcbik6IFByb21pc2U8e1xyXG4gIHN1Y2Nlc3M6IGJvb2xlYW47XHJcbiAgZXJyb3I/OiBzdHJpbmc7XHJcbn0+IHtcclxuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgYXV0aCgpO1xyXG4gIGNvbnN0IGhlYWRlcnNMaXN0ID0gYXdhaXQgaGVhZGVycygpO1xyXG5cclxuICB0cnkge1xyXG4gICAgLy8gc2VydmVyUHV0IHJldHVybnMgQXBpUmVzcG9uc2U8VD4sIHNvIHJlc3BvbnNlIGl0c2VsZiBpcyBBcGlSZXNwb25zZVxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2ZXJQdXQ8QXBwb2ludG1lbnQ+KFxyXG4gICAgICBBUElfRU5EUE9JTlRTLkFQUE9JTlRNRU5UUz8uQllfSUQ/LihpZCkgfHwgYC9hcHBvaW50bWVudHMvJHtpZH1gLFxyXG4gICAgICBkYXRhLFxyXG4gICAgICB7XHJcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgaWYgKCFyZXNwb25zZS5zdWNjZXNzKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihyZXNwb25zZS5tZXNzYWdlIHx8ICdGYWlsZWQgdG8gdXBkYXRlIGFwcG9pbnRtZW50Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSElQQUEgQXVkaXQgTG9nOiBUcmFjayBhcHBvaW50bWVudCB1cGRhdGVcclxuICAgIGF3YWl0IGF1ZGl0TG9nKHtcclxuICAgICAgdXNlcklkOiBzZXNzaW9uPy51c2VyPy5pZCxcclxuICAgICAgYWN0aW9uOiBBVURJVF9BQ1RJT05TLlVQREFURV9BUFBPSU5UTUVOVCxcclxuICAgICAgcmVzb3VyY2U6ICdhcHBvaW50bWVudCcsXHJcbiAgICAgIHJlc291cmNlSWQ6IGlkLFxyXG4gICAgICBkZXRhaWxzOiAnVXBkYXRlZCBhcHBvaW50bWVudCBkZXRhaWxzJyxcclxuICAgICAgaXBBZGRyZXNzOiBoZWFkZXJzTGlzdC5nZXQoJ3gtZm9yd2FyZGVkLWZvcicpIHx8IGhlYWRlcnNMaXN0LmdldCgneC1yZWFsLWlwJykgfHwgdW5kZWZpbmVkLFxyXG4gICAgICB1c2VyQWdlbnQ6IGhlYWRlcnNMaXN0LmdldCgndXNlci1hZ2VudCcpIHx8IHVuZGVmaW5lZCxcclxuICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgY2hhbmdlczogeyB1cGRhdGVkOiBkYXRhIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBDYWNoZSBpbnZhbGlkYXRpb25cclxuICAgIHJldmFsaWRhdGVUYWcoQ0FDSEVfVEFHUz8uQVBQT0lOVE1FTlRTIHx8ICdhcHBvaW50bWVudHMnLCAnZGVmYXVsdCcpO1xyXG4gICAgcmV2YWxpZGF0ZVRhZyhgYXBwb2ludG1lbnQtJHtpZH1gLCAnZGVmYXVsdCcpO1xyXG4gICAgcmV2YWxpZGF0ZVBhdGgoJy9hcHBvaW50bWVudHMnKTtcclxuICAgIHJldmFsaWRhdGVQYXRoKGAvYXBwb2ludG1lbnRzLyR7aWR9YCk7XHJcblxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAvLyBISVBBQSBBdWRpdCBMb2c6IFRyYWNrIGZhaWxlZCB1cGRhdGVcclxuICAgIGF3YWl0IGF1ZGl0TG9nKHtcclxuICAgICAgdXNlcklkOiBzZXNzaW9uPy51c2VyPy5pZCxcclxuICAgICAgYWN0aW9uOiBBVURJVF9BQ1RJT05TLlVQREFURV9BUFBPSU5UTUVOVCxcclxuICAgICAgcmVzb3VyY2U6ICdhcHBvaW50bWVudCcsXHJcbiAgICAgIHJlc291cmNlSWQ6IGlkLFxyXG4gICAgICBkZXRhaWxzOiAnRmFpbGVkIHRvIHVwZGF0ZSBhcHBvaW50bWVudCcsXHJcbiAgICAgIGlwQWRkcmVzczogaGVhZGVyc0xpc3QuZ2V0KCd4LWZvcndhcmRlZC1mb3InKSB8fCBoZWFkZXJzTGlzdC5nZXQoJ3gtcmVhbC1pcCcpIHx8IHVuZGVmaW5lZCxcclxuICAgICAgdXNlckFnZW50OiBoZWFkZXJzTGlzdC5nZXQoJ3VzZXItYWdlbnQnKSB8fCB1bmRlZmluZWQsXHJcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICBlcnJvck1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIHVwZGF0ZSBhcHBvaW50bWVudCAke2lkfTpgLCBlcnJvcik7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ0ZhaWxlZCB0byB1cGRhdGUgYXBwb2ludG1lbnQnLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZWxldGUgYW4gYXBwb2ludG1lbnRcclxuICogSElQQUE6IExvZ3MgYWxsIGFwcG9pbnRtZW50IGRlbGV0aW9ucyBmb3IgY29tcGxpYW5jZVxyXG4gKlxyXG4gKiBAcGFyYW0gaWQgLSBBcHBvaW50bWVudCBJRCB0byBkZWxldGVcclxuICogQHJldHVybnMgUHJvbWlzZSB3aXRoIHN1Y2Nlc3Mgc3RhdHVzIGFuZCBvcHRpb25hbCBlcnJvclxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUFwcG9pbnRtZW50KGlkOiBzdHJpbmcpOiBQcm9taXNlPHtcclxuICBzdWNjZXNzOiBib29sZWFuO1xyXG4gIGVycm9yPzogc3RyaW5nO1xyXG59PiB7XHJcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGF1dGgoKTtcclxuICBjb25zdCBoZWFkZXJzTGlzdCA9IGF3YWl0IGhlYWRlcnMoKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIC8vIHNlcnZlckRlbGV0ZSByZXR1cm5zIEFwaVJlc3BvbnNlPFQ+LCBzbyByZXNwb25zZSBpdHNlbGYgaXMgQXBpUmVzcG9uc2VcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VydmVyRGVsZXRlPHZvaWQ+KFxyXG4gICAgICBBUElfRU5EUE9JTlRTLkFQUE9JTlRNRU5UUz8uQllfSUQ/LihpZCkgfHwgYC9hcHBvaW50bWVudHMvJHtpZH1gLFxyXG4gICAgICB7XHJcbiAgICAgICAgY2FjaGU6ICduby1zdG9yZScsXHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgaWYgKCFyZXNwb25zZS5zdWNjZXNzKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihyZXNwb25zZS5tZXNzYWdlIHx8ICdGYWlsZWQgdG8gZGVsZXRlIGFwcG9pbnRtZW50Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSElQQUEgQXVkaXQgTG9nOiBUcmFjayBhcHBvaW50bWVudCBkZWxldGlvblxyXG4gICAgYXdhaXQgYXVkaXRMb2coe1xyXG4gICAgICB1c2VySWQ6IHNlc3Npb24/LnVzZXI/LmlkLFxyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuREVMRVRFX0FQUE9JTlRNRU5ULFxyXG4gICAgICByZXNvdXJjZTogJ2FwcG9pbnRtZW50JyxcclxuICAgICAgcmVzb3VyY2VJZDogaWQsXHJcbiAgICAgIGRldGFpbHM6ICdEZWxldGVkIGFwcG9pbnRtZW50JyxcclxuICAgICAgaXBBZGRyZXNzOiBoZWFkZXJzTGlzdC5nZXQoJ3gtZm9yd2FyZGVkLWZvcicpIHx8IGhlYWRlcnNMaXN0LmdldCgneC1yZWFsLWlwJykgfHwgdW5kZWZpbmVkLFxyXG4gICAgICB1c2VyQWdlbnQ6IGhlYWRlcnNMaXN0LmdldCgndXNlci1hZ2VudCcpIHx8IHVuZGVmaW5lZCxcclxuICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIENhY2hlIGludmFsaWRhdGlvblxyXG4gICAgcmV2YWxpZGF0ZVRhZyhDQUNIRV9UQUdTPy5BUFBPSU5UTUVOVFMgfHwgJ2FwcG9pbnRtZW50cycsICdkZWZhdWx0Jyk7XHJcbiAgICByZXZhbGlkYXRlVGFnKGBhcHBvaW50bWVudC0ke2lkfWAsICdkZWZhdWx0Jyk7XHJcbiAgICByZXZhbGlkYXRlUGF0aCgnL2FwcG9pbnRtZW50cycpO1xyXG5cclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgLy8gSElQQUEgQXVkaXQgTG9nOiBUcmFjayBmYWlsZWQgZGVsZXRpb25cclxuICAgIGF3YWl0IGF1ZGl0TG9nKHtcclxuICAgICAgdXNlcklkOiBzZXNzaW9uPy51c2VyPy5pZCxcclxuICAgICAgYWN0aW9uOiBBVURJVF9BQ1RJT05TLkRFTEVURV9BUFBPSU5UTUVOVCxcclxuICAgICAgcmVzb3VyY2U6ICdhcHBvaW50bWVudCcsXHJcbiAgICAgIHJlc291cmNlSWQ6IGlkLFxyXG4gICAgICBkZXRhaWxzOiAnRmFpbGVkIHRvIGRlbGV0ZSBhcHBvaW50bWVudCcsXHJcbiAgICAgIGlwQWRkcmVzczogaGVhZGVyc0xpc3QuZ2V0KCd4LWZvcndhcmRlZC1mb3InKSB8fCBoZWFkZXJzTGlzdC5nZXQoJ3gtcmVhbC1pcCcpIHx8IHVuZGVmaW5lZCxcclxuICAgICAgdXNlckFnZW50OiBoZWFkZXJzTGlzdC5nZXQoJ3VzZXItYWdlbnQnKSB8fCB1bmRlZmluZWQsXHJcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICBlcnJvck1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGRlbGV0ZSBhcHBvaW50bWVudCAke2lkfTpgLCBlcnJvcik7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ0ZhaWxlZCB0byBkZWxldGUgYXBwb2ludG1lbnQnLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIrU0FpTHNCIn0=
}),
"[project]/src/components/ui/card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-xl border bg-card text-card-foreground shadow", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 11,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 26,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 38,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 50,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 70,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
CardFooter.displayName = "CardFooter";
;
}),
"[project]/src/app/(dashboard)/appointments/_components/AppointmentStats.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Appointment Statistics Component
 * Displays statistics cards for appointments overview
 */ __turbopack_context__.s([
    "AppointmentStats",
    ()=>AppointmentStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-ssr] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$timer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Timer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/timer.js [app-ssr] (ecmascript) <export default as Timer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-ssr] (ecmascript) <export default as TrendingUp>");
'use client';
;
;
;
const AppointmentStats = ({ stats })=>{
    const statCards = [
        {
            title: 'Today\'s Appointments',
            value: stats.todayAppointments,
            subtitle: `${stats.completedToday} completed`,
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"],
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Upcoming',
            value: stats.upcomingAppointments,
            subtitle: 'Next 7 days',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$timer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Timer$3e$__["Timer"],
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            title: 'Total Scheduled',
            value: stats.totalAppointments,
            subtitle: 'This month',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            title: 'Avg Duration',
            value: `${stats.averageDuration}m`,
            subtitle: 'Per appointment',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
        {
            title: 'No-Show Rate',
            value: `${stats.noShowRate}%`,
            subtitle: `${stats.cancelledToday} cancelled today`,
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
            color: stats.noShowRate > 10 ? 'text-red-600' : 'text-gray-600',
            bgColor: stats.noShowRate > 10 ? 'bg-red-50' : 'bg-gray-50'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6",
        children: statCards.map((stat)=>{
            const Icon = stat.icon;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                className: "p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-medium text-gray-600",
                                    children: stat.title
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentStats.tsx",
                                    lineNumber: 82,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-2xl font-bold text-gray-900 mt-1",
                                    children: stat.value
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentStats.tsx",
                                    lineNumber: 83,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500 mt-1",
                                    children: stat.subtitle
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentStats.tsx",
                                    lineNumber: 86,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentStats.tsx",
                            lineNumber: 81,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `${stat.bgColor} ${stat.color} p-3 rounded-lg`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: "h-6 w-6",
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentStats.tsx",
                                lineNumber: 89,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentStats.tsx",
                            lineNumber: 88,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentStats.tsx",
                    lineNumber: 80,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            }, stat.title, false, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentStats.tsx",
                lineNumber: 79,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0));
        })
    }, void 0, false, {
        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentStats.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/ui/input.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input,
    "SearchInput",
    ()=>SearchInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, type, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/input.tsx",
        lineNumber: 10,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Input.displayName = "Input";
// SearchInput component - a specialized Input with search functionality
const SearchInput = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
        type: "search",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("pl-8", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/input.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
SearchInput.displayName = "SearchInput";
;
}),
"[project]/src/components/ui/badge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
            secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
            destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
            outline: "text-foreground",
            success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100",
            warning: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
            error: "border-transparent bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100",
            info: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/badge.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/src/types/domain/appointments.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * WF-COMP-317 | appointments.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */ /**
 * Appointment Module Types
 * Comprehensive type definitions for the White Cross appointment scheduling system
 * Aligned with backend services and database schema
 */ __turbopack_context__.s([
    "APPOINTMENT_STATUS_TRANSITIONS",
    ()=>APPOINTMENT_STATUS_TRANSITIONS,
    "APPOINTMENT_VALIDATION",
    ()=>APPOINTMENT_VALIDATION,
    "AppointmentStatus",
    ()=>AppointmentStatus,
    "AppointmentType",
    ()=>AppointmentType,
    "MessageType",
    ()=>MessageType,
    "RecurrenceFrequency",
    ()=>RecurrenceFrequency,
    "ReminderStatus",
    ()=>ReminderStatus,
    "WaitlistPriority",
    ()=>WaitlistPriority,
    "WaitlistStatus",
    ()=>WaitlistStatus,
    "canCancelAppointment",
    ()=>canCancelAppointment,
    "canCompleteAppointment",
    ()=>canCompleteAppointment,
    "canStartAppointment",
    ()=>canStartAppointment,
    "formatAppointmentType",
    ()=>formatAppointmentType,
    "getAppointmentEndTime",
    ()=>getAppointmentEndTime,
    "getAppointmentStatusColor",
    ()=>getAppointmentStatusColor,
    "getAvailableDurations",
    ()=>getAvailableDurations,
    "getWaitlistPriorityColor",
    ()=>getWaitlistPriorityColor,
    "isActiveWaitlistEntry",
    ()=>isActiveWaitlistEntry,
    "isCancellable",
    ()=>isCancellable,
    "isUpcomingAppointment",
    ()=>isUpcomingAppointment,
    "validateAppointmentData",
    ()=>validateAppointmentData,
    "validateBusinessHours",
    ()=>validateBusinessHours,
    "validateCancellationNotice",
    ()=>validateCancellationNotice,
    "validateDuration",
    ()=>validateDuration,
    "validateFutureDateTime",
    ()=>validateFutureDateTime,
    "validateNotWeekend",
    ()=>validateNotWeekend,
    "validateStatusTransition",
    ()=>validateStatusTransition
]);
var AppointmentType = /*#__PURE__*/ function(AppointmentType) {
    AppointmentType["ROUTINE_CHECKUP"] = "ROUTINE_CHECKUP";
    AppointmentType["MEDICATION_ADMINISTRATION"] = "MEDICATION_ADMINISTRATION";
    AppointmentType["INJURY_ASSESSMENT"] = "INJURY_ASSESSMENT";
    AppointmentType["ILLNESS_EVALUATION"] = "ILLNESS_EVALUATION";
    AppointmentType["FOLLOW_UP"] = "FOLLOW_UP";
    AppointmentType["SCREENING"] = "SCREENING";
    AppointmentType["EMERGENCY"] = "EMERGENCY";
    return AppointmentType;
}({});
var AppointmentStatus = /*#__PURE__*/ function(AppointmentStatus) {
    AppointmentStatus["SCHEDULED"] = "SCHEDULED";
    AppointmentStatus["IN_PROGRESS"] = "IN_PROGRESS";
    AppointmentStatus["COMPLETED"] = "COMPLETED";
    AppointmentStatus["CANCELLED"] = "CANCELLED";
    AppointmentStatus["NO_SHOW"] = "NO_SHOW";
    return AppointmentStatus;
}({});
const APPOINTMENT_VALIDATION = {
    DURATION: {
        MIN: 15,
        MAX: 120,
        DEFAULT: 30,
        INCREMENT: 15
    },
    BUSINESS_HOURS: {
        START: 8,
        END: 17
    },
    CANCELLATION: {
        MIN_HOURS_NOTICE: 2
    },
    APPOINTMENTS: {
        MAX_PER_DAY: 16,
        BUFFER_TIME_MINUTES: 15
    },
    REMINDERS: {
        MIN_HOURS_BEFORE: 0.5,
        MAX_HOURS_BEFORE: 168
    },
    WEEKEND_DAYS: [
        0,
        6
    ]
};
const APPOINTMENT_STATUS_TRANSITIONS = {
    ["SCHEDULED"]: [
        "IN_PROGRESS",
        "CANCELLED",
        "NO_SHOW"
    ],
    ["IN_PROGRESS"]: [
        "COMPLETED",
        "CANCELLED"
    ],
    ["COMPLETED"]: [],
    ["CANCELLED"]: [],
    ["NO_SHOW"]: []
};
var WaitlistPriority = /*#__PURE__*/ function(WaitlistPriority) {
    WaitlistPriority["LOW"] = "LOW";
    WaitlistPriority["NORMAL"] = "NORMAL";
    WaitlistPriority["HIGH"] = "HIGH";
    WaitlistPriority["URGENT"] = "URGENT";
    return WaitlistPriority;
}({});
var WaitlistStatus = /*#__PURE__*/ function(WaitlistStatus) {
    WaitlistStatus["WAITING"] = "WAITING";
    WaitlistStatus["NOTIFIED"] = "NOTIFIED";
    WaitlistStatus["SCHEDULED"] = "SCHEDULED";
    WaitlistStatus["EXPIRED"] = "EXPIRED";
    WaitlistStatus["CANCELLED"] = "CANCELLED";
    return WaitlistStatus;
}({});
var ReminderStatus = /*#__PURE__*/ function(ReminderStatus) {
    ReminderStatus["SCHEDULED"] = "SCHEDULED";
    ReminderStatus["SENT"] = "SENT";
    ReminderStatus["FAILED"] = "FAILED";
    ReminderStatus["CANCELLED"] = "CANCELLED";
    return ReminderStatus;
}({});
var MessageType = /*#__PURE__*/ function(MessageType) {
    MessageType["EMAIL"] = "EMAIL";
    MessageType["SMS"] = "SMS";
    MessageType["PUSH_NOTIFICATION"] = "PUSH_NOTIFICATION";
    MessageType["VOICE"] = "VOICE";
    return MessageType;
}({});
var RecurrenceFrequency = /*#__PURE__*/ function(RecurrenceFrequency) {
    RecurrenceFrequency["DAILY"] = "daily";
    RecurrenceFrequency["WEEKLY"] = "weekly";
    RecurrenceFrequency["MONTHLY"] = "monthly";
    return RecurrenceFrequency;
}({});
const isUpcomingAppointment = (appointment)=>{
    return appointment.status === "SCHEDULED" && new Date(appointment.scheduledAt) > new Date();
};
const isCancellable = (appointment)=>{
    return appointment.status === "SCHEDULED" || appointment.status === "IN_PROGRESS";
};
const isActiveWaitlistEntry = (entry)=>{
    return entry.status === "WAITING" && new Date(entry.expiresAt) > new Date();
};
const getAppointmentEndTime = (appointment)=>{
    const startTime = new Date(appointment.scheduledAt);
    return new Date(startTime.getTime() + appointment.duration * 60000);
};
const formatAppointmentType = (type)=>{
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l)=>l.toUpperCase());
};
const getAppointmentStatusColor = (status)=>{
    const colorMap = {
        ["SCHEDULED"]: '#3b82f6',
        ["IN_PROGRESS"]: '#f59e0b',
        ["COMPLETED"]: '#10b981',
        ["CANCELLED"]: '#6b7280',
        ["NO_SHOW"]: '#ef4444'
    };
    return colorMap[status] || '#6b7280';
};
const getWaitlistPriorityColor = (priority)=>{
    const colorMap = {
        ["LOW"]: '#10b981',
        ["NORMAL"]: '#3b82f6',
        ["HIGH"]: '#f59e0b',
        ["URGENT"]: '#ef4444'
    };
    return colorMap[priority] || '#6b7280';
};
const validateDuration = (duration)=>{
    if (duration < APPOINTMENT_VALIDATION.DURATION.MIN) {
        return {
            valid: false,
            error: `Duration must be at least ${APPOINTMENT_VALIDATION.DURATION.MIN} minutes`
        };
    }
    if (duration > APPOINTMENT_VALIDATION.DURATION.MAX) {
        return {
            valid: false,
            error: `Duration cannot exceed ${APPOINTMENT_VALIDATION.DURATION.MAX} minutes`
        };
    }
    if (duration % APPOINTMENT_VALIDATION.DURATION.INCREMENT !== 0) {
        return {
            valid: false,
            error: `Duration must be in ${APPOINTMENT_VALIDATION.DURATION.INCREMENT}-minute increments`
        };
    }
    return {
        valid: true
    };
};
const validateFutureDateTime = (scheduledAt)=>{
    const now = new Date();
    if (scheduledAt <= now) {
        return {
            valid: false,
            error: 'Appointment must be scheduled for a future date and time'
        };
    }
    return {
        valid: true
    };
};
const validateBusinessHours = (scheduledAt, duration)=>{
    const hour = scheduledAt.getHours();
    const minutes = scheduledAt.getMinutes();
    const totalMinutes = hour * 60 + minutes;
    const startMinutes = APPOINTMENT_VALIDATION.BUSINESS_HOURS.START * 60;
    const endMinutes = APPOINTMENT_VALIDATION.BUSINESS_HOURS.END * 60;
    if (totalMinutes < startMinutes) {
        return {
            valid: false,
            error: `Appointments must be scheduled after ${APPOINTMENT_VALIDATION.BUSINESS_HOURS.START}:00 AM`
        };
    }
    const appointmentEndMinutes = totalMinutes + duration;
    if (appointmentEndMinutes > endMinutes) {
        return {
            valid: false,
            error: `Appointments must end by ${APPOINTMENT_VALIDATION.BUSINESS_HOURS.END}:00 PM`
        };
    }
    return {
        valid: true
    };
};
const validateNotWeekend = (scheduledAt)=>{
    const dayOfWeek = scheduledAt.getDay();
    if (APPOINTMENT_VALIDATION.WEEKEND_DAYS.includes(dayOfWeek)) {
        return {
            valid: false,
            error: 'Appointments cannot be scheduled on weekends'
        };
    }
    return {
        valid: true
    };
};
const validateStatusTransition = (currentStatus, newStatus)=>{
    const allowedTransitions = APPOINTMENT_STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
        return {
            valid: false,
            error: `Cannot transition from ${currentStatus} to ${newStatus}. Allowed: ${allowedTransitions.join(', ') || 'none'}`
        };
    }
    return {
        valid: true
    };
};
const validateCancellationNotice = (scheduledAt)=>{
    const now = new Date();
    const hoursUntilAppointment = (scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilAppointment < APPOINTMENT_VALIDATION.CANCELLATION.MIN_HOURS_NOTICE) {
        return {
            valid: false,
            error: `Appointments must be cancelled at least ${APPOINTMENT_VALIDATION.CANCELLATION.MIN_HOURS_NOTICE} hours in advance`
        };
    }
    return {
        valid: true
    };
};
const validateAppointmentData = (data)=>{
    const errors = [];
    // Validate duration
    const durationResult = validateDuration(data.duration);
    if (!durationResult.valid && durationResult.error) {
        errors.push(durationResult.error);
    }
    // Validate future date
    const futureResult = validateFutureDateTime(data.scheduledAt);
    if (!futureResult.valid && futureResult.error) {
        errors.push(futureResult.error);
    }
    // Validate not weekend
    const weekendResult = validateNotWeekend(data.scheduledAt);
    if (!weekendResult.valid && weekendResult.error) {
        errors.push(weekendResult.error);
    }
    // Validate business hours
    const businessHoursResult = validateBusinessHours(data.scheduledAt, data.duration);
    if (!businessHoursResult.valid && businessHoursResult.error) {
        errors.push(businessHoursResult.error);
    }
    // Validate reason
    if (!data.reason || data.reason.trim().length < 3) {
        errors.push('Appointment reason must be at least 3 characters');
    }
    if (data.reason && data.reason.length > 500) {
        errors.push('Appointment reason cannot exceed 500 characters');
    }
    return {
        valid: errors.length === 0,
        errors
    };
};
const getAvailableDurations = ()=>{
    const durations = [];
    for(let duration = APPOINTMENT_VALIDATION.DURATION.MIN; duration <= APPOINTMENT_VALIDATION.DURATION.MAX; duration += APPOINTMENT_VALIDATION.DURATION.INCREMENT){
        durations.push(duration);
    }
    return durations;
};
const canCancelAppointment = (appointment)=>{
    // Check status
    if (appointment.status !== "SCHEDULED" && appointment.status !== "IN_PROGRESS") {
        return {
            canCancel: false,
            reason: `Cannot cancel appointment with status ${appointment.status}`
        };
    }
    // Check cancellation notice
    const noticeResult = validateCancellationNotice(new Date(appointment.scheduledAt));
    if (!noticeResult.valid) {
        return {
            canCancel: false,
            reason: noticeResult.error
        };
    }
    return {
        canCancel: true
    };
};
const canStartAppointment = (appointment)=>{
    if (appointment.status !== "SCHEDULED") {
        return {
            canStart: false,
            reason: `Cannot start appointment with status ${appointment.status}`
        };
    }
    // Check if not more than 1 hour early
    const now = new Date();
    const scheduledTime = new Date(appointment.scheduledAt);
    const oneHourEarly = new Date(scheduledTime.getTime() - 60 * 60 * 1000);
    if (now < oneHourEarly) {
        return {
            canStart: false,
            reason: 'Cannot start appointment more than 1 hour before scheduled time'
        };
    }
    return {
        canStart: true
    };
};
const canCompleteAppointment = (appointment)=>{
    if (appointment.status !== "IN_PROGRESS") {
        return {
            canComplete: false,
            reason: `Cannot complete appointment with status ${appointment.status}. Must be IN_PROGRESS`
        };
    }
    return {
        canComplete: true
    };
};
}),
"[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Appointment Filters Component
 * Provides filtering and search functionality for appointments
 */ __turbopack_context__.s([
    "AppointmentFilters",
    ()=>AppointmentFilters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/funnel.js [app-ssr] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/domain/appointments.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const AppointmentFilters = ({ searchQuery, onSearchChange, statusFilter, onStatusChange, typeFilter, onTypeChange, showFilters, onToggleFilters, activeFilterCount, onClearFilters })=>{
    const statusOptions = [
        {
            value: 'all',
            label: 'All Statuses'
        },
        {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].SCHEDULED,
            label: 'Scheduled'
        },
        {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].IN_PROGRESS,
            label: 'In Progress'
        },
        {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].COMPLETED,
            label: 'Completed'
        },
        {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].CANCELLED,
            label: 'Cancelled'
        },
        {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].NO_SHOW,
            label: 'No Show'
        }
    ];
    const typeOptions = [
        {
            value: 'all',
            label: 'All Types'
        },
        {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].ROUTINE_CHECKUP,
            label: 'Routine Checkup'
        },
        {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].MEDICATION_ADMINISTRATION,
            label: 'Medication'
        },
        {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].INJURY_ASSESSMENT,
            label: 'Injury Assessment'
        },
        {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].ILLNESS_EVALUATION,
            label: 'Illness Evaluation'
        },
        {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].SCREENING,
            label: 'Screening'
        },
        {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].FOLLOW_UP,
            label: 'Follow-up'
        },
        {
            value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].EMERGENCY,
            label: 'Emergency'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                            type: "text",
                            placeholder: "Search appointments...",
                            value: searchQuery,
                            onChange: (e)=>onSearchChange(e.target.value),
                            className: "w-full"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        size: "sm",
                        onClick: onToggleFilters,
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                className: "h-4 w-4 mr-2",
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            "Filters",
                            activeFilterCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "default",
                                className: "ml-2 rounded-full h-5 w-5 p-0 flex items-center justify-center",
                                children: activeFilterCount
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    activeFilterCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "sm",
                        onClick: onClearFilters,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4 mr-2",
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                                lineNumber: 98,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            "Clear"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border border-gray-200 rounded-lg p-4 space-y-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-700 mb-2",
                                    children: "Status"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                                    lineNumber: 110,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: statusFilter,
                                    onChange: (e)=>onStatusChange(e.target.value),
                                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                                    children: statusOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: option.value,
                                            children: option.label
                                        }, option.value, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                                            lineNumber: 119,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                                    lineNumber: 113,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                            lineNumber: 109,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-700 mb-2",
                                    children: "Appointment Type"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                                    lineNumber: 128,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: typeFilter,
                                    onChange: (e)=>onTypeChange(e.target.value),
                                    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                                    children: typeOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: option.value,
                                            children: option.label
                                        }, option.value, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                                            lineNumber: 137,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                                    lineNumber: 131,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                            lineNumber: 127,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                    lineNumber: 107,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
                lineNumber: 106,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/app/(dashboard)/appointments/_components/utils/appointmentUtils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utility functions for appointment management
 */ __turbopack_context__.s([
    "calculateDuration",
    ()=>calculateDuration,
    "calculateStats",
    ()=>calculateStats,
    "filterAppointments",
    ()=>filterAppointments,
    "filterByDateRange",
    ()=>filterByDateRange,
    "filterByStatus",
    ()=>filterByStatus,
    "filterByType",
    ()=>filterByType,
    "formatAppointmentDate",
    ()=>formatAppointmentDate,
    "formatAppointmentTime",
    ()=>formatAppointmentTime,
    "formatDuration",
    ()=>formatDuration,
    "getAppointmentDuration",
    ()=>getAppointmentDuration,
    "getStatusColor",
    ()=>getStatusColor,
    "getTypeColor",
    ()=>getTypeColor,
    "groupByDate",
    ()=>groupByDate,
    "isToday",
    ()=>isToday,
    "isUpcoming",
    ()=>isUpcoming,
    "searchAppointments",
    ()=>searchAppointments,
    "sortByDate",
    ()=>sortByDate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/domain/appointments.ts [app-ssr] (ecmascript)");
;
const formatAppointmentTime = (date)=>{
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(d);
};
const formatAppointmentDate = (date)=>{
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(d);
};
const getStatusColor = (status)=>{
    switch(status){
        case 'scheduled':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'confirmed':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'in_progress':
            return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'completed':
            return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'cancelled':
            return 'bg-red-100 text-red-800 border-red-200';
        case 'no_show':
            return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'rescheduled':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};
const getTypeColor = (type)=>{
    switch(type){
        case 'health_screening':
            return 'bg-blue-100 text-blue-800';
        case 'vaccination':
            return 'bg-green-100 text-green-800';
        case 'medication_review':
            return 'bg-purple-100 text-purple-800';
        case 'follow_up':
            return 'bg-yellow-100 text-yellow-800';
        case 'emergency':
            return 'bg-red-100 text-red-800';
        case 'consultation':
            return 'bg-indigo-100 text-indigo-800';
        case 'physical_exam':
            return 'bg-teal-100 text-teal-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
const isToday = (date)=>{
    const d = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
};
const isUpcoming = (date)=>{
    const d = typeof date === 'string' ? new Date(date) : date;
    return d > new Date();
};
const calculateDuration = (startTime, endTime)=>{
    const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
    const end = typeof endTime === 'string' ? new Date(endTime) : endTime;
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
};
const formatDuration = (minutes)=>{
    if (minutes < 60) {
        return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};
const filterByStatus = (appointments, status)=>{
    if (status === 'all') return appointments;
    return appointments.filter((apt)=>apt.status === status);
};
const filterByType = (appointments, type)=>{
    if (type === 'all') return appointments;
    return appointments.filter((apt)=>apt.type === type);
};
const filterByDateRange = (appointments, range)=>{
    if (range === 'all') return appointments;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return appointments.filter((apt)=>{
        const aptDate = new Date(apt.scheduledAt);
        switch(range){
            case 'today':
                return isToday(aptDate);
            case 'week':
                {
                    const weekEnd = new Date(today);
                    weekEnd.setDate(today.getDate() + 7);
                    return aptDate >= today && aptDate < weekEnd;
                }
            case 'month':
                {
                    const monthEnd = new Date(today);
                    monthEnd.setMonth(today.getMonth() + 1);
                    return aptDate >= today && aptDate < monthEnd;
                }
            default:
                return true;
        }
    });
};
const searchAppointments = (appointments, query)=>{
    if (!query.trim()) return appointments;
    const lowerQuery = query.toLowerCase();
    return appointments.filter((apt)=>apt.type.toLowerCase().includes(lowerQuery) || apt.notes?.toLowerCase().includes(lowerQuery) || apt.reason?.toLowerCase().includes(lowerQuery));
};
const sortByDate = (appointments, order = 'asc')=>{
    return [
        ...appointments
    ].sort((a, b)=>{
        const dateA = new Date(a.scheduledAt).getTime();
        const dateB = new Date(b.scheduledAt).getTime();
        return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
};
const groupByDate = (appointments)=>{
    const grouped = new Map();
    appointments.forEach((apt)=>{
        const dateKey = formatAppointmentDate(apt.scheduledAt);
        const existing = grouped.get(dateKey) || [];
        grouped.set(dateKey, [
            ...existing,
            apt
        ]);
    });
    return grouped;
};
const getAppointmentDuration = (appointment)=>{
    // If appointment has explicit duration
    if (appointment.duration) {
        return formatDuration(appointment.duration);
    }
    // Default duration
    return '30m';
};
const filterAppointments = (appointments, filters)=>{
    let filtered = [
        ...appointments
    ];
    // Apply search
    if (filters.searchQuery) {
        filtered = searchAppointments(filtered, filters.searchQuery);
    }
    // Apply status filter
    if (filters.statusFilter && filters.statusFilter !== 'all') {
        filtered = filterByStatus(filtered, filters.statusFilter);
    }
    // Apply type filter
    if (filters.typeFilter && filters.typeFilter !== 'all') {
        filtered = filterByType(filtered, filters.typeFilter);
    }
    // Apply date range filter
    if (filters.dateRange) {
        filtered = filterByDateRange(filtered, filters.dateRange);
    }
    return filtered;
};
const calculateStats = (appointments)=>{
    const todayAppointments = appointments.filter((apt)=>isToday(apt.scheduledAt));
    const upcomingAppointments = appointments.filter((apt)=>isUpcoming(apt.scheduledAt));
    const completedToday = todayAppointments.filter((apt)=>apt.status === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].COMPLETED).length;
    const cancelledToday = todayAppointments.filter((apt)=>apt.status === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].CANCELLED).length;
    // Calculate no-show rate
    const totalCompleted = appointments.filter((apt)=>apt.status === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].COMPLETED || apt.status === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].NO_SHOW).length;
    const noShows = appointments.filter((apt)=>apt.status === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].NO_SHOW).length;
    const noShowRate = totalCompleted > 0 ? noShows / totalCompleted * 100 : 0;
    // Calculate average duration
    const durations = appointments.filter((apt)=>apt.duration).map((apt)=>apt.duration || 30);
    const averageDuration = durations.length > 0 ? Math.round(durations.reduce((a, b)=>a + b, 0) / durations.length) : 30;
    return {
        totalAppointments: appointments.length,
        todayAppointments: todayAppointments.length,
        upcomingAppointments: upcomingAppointments.length,
        completedToday,
        cancelledToday,
        noShowRate: Math.round(noShowRate * 10) / 10,
        averageDuration
    };
};
}),
"[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Appointment Card Component
 * Displays individual appointment information in a card format
 */ __turbopack_context__.s([
    "AppointmentCard",
    ()=>AppointmentCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-ssr] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/domain/appointments.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$appointments$2f$_components$2f$utils$2f$appointmentUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/appointments/_components/utils/appointmentUtils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const AppointmentCard = ({ appointment, onView, onEdit, onCancel, isSelected = false, onSelect })=>{
    const getStatusColor = (status)=>{
        const colors = {
            scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
            confirmed: 'bg-green-100 text-green-800 border-green-200',
            completed: 'bg-gray-100 text-gray-800 border-gray-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
            'no-show': 'bg-orange-100 text-orange-800 border-orange-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };
    const getTypeColor = (type)=>{
        const colors = {
            'check-up': 'bg-purple-50 text-purple-700',
            vaccination: 'bg-blue-50 text-blue-700',
            medication: 'bg-green-50 text-green-700',
            screening: 'bg-yellow-50 text-yellow-700',
            consultation: 'bg-indigo-50 text-indigo-700',
            'follow-up': 'bg-pink-50 text-pink-700',
            other: 'bg-gray-50 text-gray-700'
        };
        return colors[type] || 'bg-gray-50 text-gray-700';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        className: `p-4 hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-blue-500' : ''}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                onSelect && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "checkbox",
                                    checked: isSelected,
                                    onChange: ()=>onSelect(appointment.id),
                                    className: "rounded border-gray-300 text-blue-600",
                                    "aria-label": `Select appointment ${appointment.id}`
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                                    lineNumber: 72,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                    className: "h-4 w-4 text-gray-500",
                                                    "aria-hidden": "true"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                                                    lineNumber: 82,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium text-gray-900",
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$appointments$2f$_components$2f$utils$2f$appointmentUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatAppointmentTime"])(appointment.scheduledAt)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                                                    lineNumber: 83,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                                            lineNumber: 81,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-gray-600",
                                            children: [
                                                "Duration: ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$appointments$2f$_components$2f$utils$2f$appointmentUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAppointmentDuration"])(appointment)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                                            lineNumber: 87,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                                    lineNumber: 80,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                            className: getStatusColor(appointment.status),
                            children: appointment.status
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                            className: "h-4 w-4 text-gray-500",
                            "aria-hidden": "true"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                            lineNumber: 99,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-medium text-gray-900",
                            children: [
                                appointment.student?.firstName,
                                " ",
                                appointment.student?.lastName
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                        className: getTypeColor(appointment.type),
                        children: appointment.type.replace(/_/g, ' ')
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                    lineNumber: 106,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                appointment.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start gap-2 text-sm text-gray-600",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                            className: "h-4 w-4 mt-0.5 flex-shrink-0",
                            "aria-hidden": "true"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                            lineNumber: 115,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "line-clamp-2",
                            children: appointment.notes
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                            lineNumber: 116,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                    lineNumber: 114,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 pt-2 border-t border-gray-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            onClick: ()=>onView(appointment.id),
                            className: "flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                    className: "h-4 w-4 mr-2",
                                    "aria-hidden": "true"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                                    lineNumber: 128,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                "View"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                            lineNumber: 122,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        appointment.status !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].COMPLETED && appointment.status !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].CANCELLED && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "sm",
                                    onClick: ()=>onEdit(appointment.id),
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                            className: "h-4 w-4 mr-2",
                                            "aria-hidden": "true"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                                            lineNumber: 139,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        "Edit"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                                    lineNumber: 133,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "sm",
                                    onClick: ()=>onCancel(appointment.id),
                                    className: "text-red-600 hover:text-red-700 hover:bg-red-50",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                        className: "h-4 w-4",
                                        "aria-hidden": "true"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                                        lineNumber: 148,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                                    lineNumber: 142,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/components/ui/empty-state.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * EmptyState Component
 *
 * Reusable component for displaying empty states with icons, messages,
 * and optional call-to-action buttons.
 *
 * @module components/ui/EmptyState
 * @category UI Components
 */ __turbopack_context__.s([
    "EmptyState",
    ()=>EmptyState,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
const EmptyState = ({ icon: Icon, iconElement, title, description, actionLabel, actionHref, onAction, secondaryActionLabel, secondaryActionHref, onSecondaryAction, className = '' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center justify-center min-h-[400px] py-12 px-4 ${className}`,
        role: "region",
        "aria-label": "Empty state",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center max-w-md",
            children: [
                Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    className: "h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4",
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/empty-state.tsx",
                    lineNumber: 81,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                iconElement && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center mb-4",
                    "aria-hidden": "true",
                    children: iconElement
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/empty-state.tsx",
                    lineNumber: 87,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold text-gray-900 dark:text-white mb-2",
                    children: title
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/empty-state.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-600 dark:text-gray-400 mb-6",
                    children: description
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/empty-state.tsx",
                    lineNumber: 99,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                (actionLabel || secondaryActionLabel) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row gap-3 justify-center",
                    children: [
                        actionLabel && (actionHref ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: actionHref,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "default",
                                onClick: onAction,
                                className: "w-full sm:w-auto",
                                children: actionLabel
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/empty-state.tsx",
                                lineNumber: 110,
                                columnNumber: 19
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/empty-state.tsx",
                            lineNumber: 109,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "default",
                            onClick: onAction,
                            className: "w-full sm:w-auto",
                            children: actionLabel
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/empty-state.tsx",
                            lineNumber: 119,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))),
                        secondaryActionLabel && (secondaryActionHref ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: secondaryActionHref,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                onClick: onSecondaryAction,
                                className: "w-full sm:w-auto",
                                children: secondaryActionLabel
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/empty-state.tsx",
                                lineNumber: 132,
                                columnNumber: 19
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/empty-state.tsx",
                            lineNumber: 131,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: onSecondaryAction,
                            className: "w-full sm:w-auto",
                            children: secondaryActionLabel
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/empty-state.tsx",
                            lineNumber: 141,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/empty-state.tsx",
                    lineNumber: 106,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/empty-state.tsx",
            lineNumber: 78,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/empty-state.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
EmptyState.displayName = 'EmptyState';
const __TURBOPACK__default__export__ = EmptyState;
}),
"[project]/src/app/(dashboard)/appointments/_components/AppointmentList.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Appointment List Component
 * Displays a list or grid of appointments
 */ __turbopack_context__.s([
    "AppointmentList",
    ()=>AppointmentList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$appointments$2f$_components$2f$AppointmentCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/appointments/_components/AppointmentCard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$empty$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/empty-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-ssr] (ecmascript) <export default as CalendarDays>");
'use client';
;
;
;
;
const AppointmentList = ({ appointments, onViewAppointment, onEditAppointment, onCancelAppointment, selectedAppointments, onSelectAppointment, loading = false })=>{
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
            children: [
                ...Array(6)
            ].map((_, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-pulse bg-gray-200 rounded-lg h-48"
                }, idx, false, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentList.tsx",
                    lineNumber: 37,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)))
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentList.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (appointments.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$empty$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EmptyState"], {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"],
            title: "No Appointments Found",
            description: "There are no appointments matching your current filters."
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentList.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        children: appointments.map((appointment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$appointments$2f$_components$2f$AppointmentCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentCard"], {
                appointment: appointment,
                onView: onViewAppointment,
                onEdit: onEditAppointment,
                onCancel: onCancelAppointment,
                isSelected: selectedAppointments?.has(appointment.id),
                onSelect: onSelectAppointment
            }, appointment.id, false, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentList.tsx",
                lineNumber: 59,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentList.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/app/(dashboard)/appointments/_components/ViewModeToggle.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * View Mode Toggle Component
 * Toggle between calendar, list, and agenda views
 */ __turbopack_context__.s([
    "ViewModeToggle",
    ()=>ViewModeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.js [app-ssr] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$3x3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid3x3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grid-3x3.js [app-ssr] (ecmascript) <export default as Grid3x3>");
'use client';
;
;
;
const ViewModeToggle = ({ viewMode, onViewModeChange })=>{
    const modes = [
        {
            value: 'calendar',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"],
            label: 'Calendar'
        },
        {
            value: 'list',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"],
            label: 'List'
        },
        {
            value: 'agenda',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$3x3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid3x3$3e$__["Grid3x3"],
            label: 'Agenda'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "inline-flex rounded-lg border border-gray-300 bg-white p-1",
        children: modes.map((mode)=>{
            const Icon = mode.icon;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                variant: viewMode === mode.value ? 'default' : 'ghost',
                size: "sm",
                onClick: ()=>onViewModeChange(mode.value),
                className: "gap-2",
                "aria-label": `${mode.label} view`,
                "aria-pressed": viewMode === mode.value,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                        className: "h-4 w-4",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/appointments/_components/ViewModeToggle.tsx",
                        lineNumber: 43,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "hidden sm:inline",
                        children: mode.label
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/appointments/_components/ViewModeToggle.tsx",
                        lineNumber: 44,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, mode.value, true, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/ViewModeToggle.tsx",
                lineNumber: 34,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0));
        })
    }, void 0, false, {
        fileName: "[project]/src/app/(dashboard)/appointments/_components/ViewModeToggle.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Appointments Content Component - REFACTORED
 * Main orchestrator for appointments management
 * 
 * This file has been refactored from 763 lines into smaller, focused components:
 * - AppointmentStats: Statistics and metrics
 * - AppointmentFilters: Search and filtering
 * - AppointmentCard: Individual appointment display
 * - AppointmentList: Grid/list view of appointments
 * - ViewModeToggle: Calendar/list/agenda view toggle
 * - appointmentUtils.ts: Utility functions
 * - appointment.types.ts: Type definitions
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-ssr] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useConfirmDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useConfirmDialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$appointments$2e$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/appointments.actions.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$d6dcb1__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/data:d6dcb1 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$6feac3__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/data:6feac3 [app-ssr] (ecmascript) <text/javascript>");
// Import sub-components
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$appointments$2f$_components$2f$AppointmentStats$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/appointments/_components/AppointmentStats.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$appointments$2f$_components$2f$AppointmentFilters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/appointments/_components/AppointmentFilters.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$appointments$2f$_components$2f$AppointmentList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/appointments/_components/AppointmentList.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$appointments$2f$_components$2f$ViewModeToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/appointments/_components/ViewModeToggle.tsx [app-ssr] (ecmascript)");
// Import utilities
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$appointments$2f$_components$2f$utils$2f$appointmentUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(dashboard)/appointments/_components/utils/appointmentUtils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
const AppointmentsContent = ({ initialAppointments = [] })=>{
    // State management
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialAppointments);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [selectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('list');
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const [typeFilter, setTypeFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [showFilters, setShowFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedAppointments, setSelectedAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransition"])();
    const { confirm, ConfirmDialog } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useConfirmDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useConfirmDialog"])();
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    // Load appointments on mount and when filters change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        const loadAppointments = async ()=>{
            setLoading(true);
            try {
                const filters = {};
                const dateFrom = selectedDate.toISOString().split('T')[0];
                const dateTo = new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                if (dateFrom) filters.dateFrom = dateFrom;
                if (dateTo) filters.dateTo = dateTo;
                if (statusFilter !== 'all') filters.status = statusFilter;
                if (typeFilter !== 'all') filters.type = typeFilter;
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$d6dcb1__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getAppointments"])(filters);
                if (!cancelled) {
                    setAppointments(result.appointments);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error('Failed to load appointments:', error);
                    setAppointments([]);
                    toast({
                        title: 'Error',
                        description: 'Failed to load appointments. Please try again.',
                        variant: 'destructive'
                    });
                }
            } finally{
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };
        loadAppointments();
        return ()=>{
            cancelled = true;
        };
    }, [
        selectedDate,
        statusFilter,
        typeFilter,
        toast
    ]);
    // Filter and search appointments
    const filteredAppointments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$appointments$2f$_components$2f$utils$2f$appointmentUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filterAppointments"])(appointments, {
            searchQuery,
            statusFilter,
            typeFilter
        });
    }, [
        appointments,
        searchQuery,
        statusFilter,
        typeFilter
    ]);
    // Calculate statistics
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$appointments$2f$_components$2f$utils$2f$appointmentUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateStats"])(appointments);
    }, [
        appointments
    ]);
    // Event handlers
    const handleViewAppointment = (id)=>{
        console.log('View appointment:', id);
    // TODO: Implement appointment detail view
    };
    const handleEditAppointment = (id)=>{
        console.log('Edit appointment:', id);
    // TODO: Implement appointment edit modal
    };
    const handleCancelAppointment = async (id)=>{
        const confirmed = await confirm({
            title: 'Cancel Appointment',
            description: 'Are you sure you want to cancel this appointment?',
            confirmText: 'Yes, Cancel',
            cancelText: 'No, Keep'
        });
        if (confirmed) {
            startTransition(async ()=>{
                try {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$6feac3__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["deleteAppointment"])(id);
                    setAppointments((prev)=>prev.filter((apt)=>apt.id !== id));
                    toast({
                        title: 'Success',
                        description: 'Appointment cancelled successfully'
                    });
                } catch (error) {
                    console.error('Failed to cancel appointment:', error);
                    toast({
                        title: 'Error',
                        description: 'Failed to cancel appointment. Please try again.',
                        variant: 'destructive'
                    });
                }
            });
        }
    };
    const handleSelectAppointment = (id)=>{
        setSelectedAppointments((prev)=>{
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    const handleClearFilters = ()=>{
        setStatusFilter('all');
        setTypeFilter('all');
        setSearchQuery('');
        setShowFilters(false);
    };
    const activeFilterCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        let count = 0;
        if (statusFilter !== 'all') count++;
        if (typeFilter !== 'all') count++;
        return count;
    }, [
        statusFilter,
        typeFilter
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6 p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-semibold text-gray-900",
                                children: "Appointments"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                                lineNumber: 198,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 mt-1",
                                children: "Manage student health appointments and schedules"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                                lineNumber: 199,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                        className: "h-4 w-4 mr-2",
                                        "aria-hidden": "true"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                                        lineNumber: 205,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Export"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                                lineNumber: 204,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                        className: "h-4 w-4 mr-2",
                                        "aria-hidden": "true"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                                        lineNumber: 209,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Import"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                                lineNumber: 208,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "h-4 w-4 mr-2",
                                        "aria-hidden": "true"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                                        lineNumber: 213,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "New Appointment"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                                lineNumber: 212,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                        lineNumber: 203,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$appointments$2f$_components$2f$AppointmentStats$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStats"], {
                stats: stats
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                lineNumber: 220,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$appointments$2f$_components$2f$AppointmentFilters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentFilters"], {
                            searchQuery: searchQuery,
                            onSearchChange: setSearchQuery,
                            statusFilter: statusFilter,
                            onStatusChange: setStatusFilter,
                            typeFilter: typeFilter,
                            onTypeChange: setTypeFilter,
                            showFilters: showFilters,
                            onToggleFilters: ()=>setShowFilters(!showFilters),
                            activeFilterCount: activeFilterCount,
                            onClearFilters: handleClearFilters
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                            lineNumber: 225,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$appointments$2f$_components$2f$ViewModeToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ViewModeToggle"], {
                        viewMode: viewMode,
                        onViewModeChange: setViewMode
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                        lineNumber: 238,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$dashboard$292f$appointments$2f$_components$2f$AppointmentList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentList"], {
                appointments: filteredAppointments,
                onViewAppointment: handleViewAppointment,
                onEditAppointment: handleEditAppointment,
                onCancelAppointment: handleCancelAppointment,
                selectedAppointments: selectedAppointments,
                onSelectAppointment: handleSelectAppointment,
                loading: loading
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                lineNumber: 242,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ConfirmDialog, {}, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
                lineNumber: 253,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsContent.tsx",
        lineNumber: 194,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = AppointmentsContent;
}),
"[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/stethoscope.js [app-ssr] (ecmascript) <export default as Stethoscope>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-ssr] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thermometer.js [app-ssr] (ecmascript) <export default as Thermometer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$appointments$2e$actions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/appointments.actions.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$d6dcb1__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/data:d6dcb1 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/domain/appointments.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
const AppointmentsSidebar = ({ selectedDate = new Date(), onFilterChange, className = '' })=>{
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [quickStats, setQuickStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        todayTotal: 0,
        todayCompleted: 0,
        todayPending: 0,
        todayUrgent: 0,
        upcomingWeek: 0,
        overdueAppointments: 0
    });
    const [upcomingAppointments, setUpcomingAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [recentActivity, setRecentActivity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [activeFilters, setActiveFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        status: 'all',
        type: 'all'
    });
    const calculateQuickStats = (aptList)=>{
        const appts = Array.isArray(aptList) ? aptList : [];
        const today = new Date().toISOString().split('T')[0];
        // Filter today's appointments by parsing scheduledAt ISO datetime
        const todayAppointments = appts.filter((apt)=>{
            if (!apt?.scheduledAt) return false;
            const aptDate = apt.scheduledAt.split('T')[0];
            return aptDate === today;
        });
        const stats = {
            todayTotal: todayAppointments.length,
            todayCompleted: todayAppointments.filter((apt)=>apt?.status === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].COMPLETED).length,
            todayPending: todayAppointments.filter((apt)=>apt?.status === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].SCHEDULED).length,
            todayUrgent: todayAppointments.filter((apt)=>apt?.type === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].EMERGENCY).length,
            upcomingWeek: appts.filter((apt)=>apt?.scheduledAt && new Date(apt.scheduledAt) > new Date() && apt?.status !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].CANCELLED).length,
            overdueAppointments: appts.filter((apt)=>apt?.scheduledAt && new Date(apt.scheduledAt) < new Date() && apt?.status === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].SCHEDULED).length
        };
        setQuickStats(stats);
    };
    const calculateTimeUntil = (scheduledAt)=>{
        const aptDateTime = new Date(scheduledAt);
        const now = new Date();
        const diffMs = aptDateTime.getTime() - now.getTime();
        if (diffMs < 0) return 'Overdue';
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor(diffMs % (1000 * 60 * 60) / (1000 * 60));
        if (diffHours < 1) {
            return `${diffMins}m`;
        } else if (diffHours < 24) {
            return `${diffHours}h ${diffMins}m`;
        } else {
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays}d`;
        }
    };
    const generateUpcomingAppointments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((aptList)=>{
        const appts = Array.isArray(aptList) ? aptList : [];
        const upcoming = appts.filter((apt)=>apt?.scheduledAt && new Date(apt.scheduledAt) >= new Date() && apt?.status === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].SCHEDULED).sort((a, b)=>{
            return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
        }).slice(0, 5).map((apt)=>({
                id: apt.id,
                studentId: apt.studentId,
                studentName: `Student ${apt.studentId.slice(-3)}`,
                type: apt.type,
                scheduledAt: apt.scheduledAt,
                status: apt.status,
                timeUntil: calculateTimeUntil(apt.scheduledAt),
                reason: apt.reason || 'No reason provided'
            }));
        setUpcomingAppointments(upcoming);
    }, []);
    const generateRecentActivity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((aptList)=>{
        const appts = Array.isArray(aptList) ? aptList : [];
        const activities = appts.filter((apt)=>{
            if (!apt?.updatedAt) return false;
            const aptDate = new Date(apt.updatedAt);
            const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            return aptDate > dayAgo;
        }).map((apt)=>({
                id: `activity-${apt.id}`,
                type: apt.status === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].COMPLETED ? 'appointment_completed' : 'appointment_created',
                appointmentId: apt.id,
                studentName: `Student ${apt.studentId.slice(-3)}`,
                timestamp: apt.updatedAt,
                description: `${apt.status === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].COMPLETED ? 'Completed' : 'Scheduled'} ${formatAppointmentType(apt.type)} appointment`
            })).sort((a, b)=>new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);
        setRecentActivity(activities);
    }, []);
    // Load appointments and calculate stats
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadAppointmentData = async ()=>{
            setLoading(true);
            try {
                const today = new Date().toISOString().split('T')[0];
                const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$d6dcb1__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getAppointments"])({
                    dateFrom: today,
                    dateTo: nextWeek
                });
                setAppointments(result.appointments);
                calculateQuickStats(result.appointments);
                generateUpcomingAppointments(result.appointments);
                generateRecentActivity(result.appointments);
            } catch (error) {
                console.error('Failed to load appointment data:', error);
            } finally{
                setLoading(false);
            }
        };
        loadAppointmentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleFilterChange = (key, value)=>{
        const newFilters = {
            ...activeFilters,
            [key]: value
        };
        setActiveFilters(newFilters);
        onFilterChange?.(newFilters);
    };
    const getStatusIcon = (status)=>{
        const icons = {
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].SCHEDULED]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].IN_PROGRESS]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].COMPLETED]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"],
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].CANCELLED]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"],
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].NO_SHOW]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"]
        };
        return icons[status] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"];
    };
    const getTypeIcon = (type)=>{
        const icons = {
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].ROUTINE_CHECKUP]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__["Stethoscope"],
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].MEDICATION_ADMINISTRATION]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].INJURY_ASSESSMENT]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"],
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].ILLNESS_EVALUATION]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].SCREENING]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"],
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].FOLLOW_UP]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"],
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].EMERGENCY]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"]
        };
        return icons[type] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"];
    };
    const formatAppointmentType = (type)=>{
        return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l)=>l.toUpperCase());
    };
    const formatTime = (scheduledAt)=>{
        const date = new Date(scheduledAt);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `${displayHour}:${displayMinutes} ${ampm}`;
    };
    const formatRelativeTime = (timestamp)=>{
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now.getTime() - time.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMins / 60);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return time.toLocaleDateString();
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `space-y-4 ${className}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 animate-pulse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-5 bg-gray-200 rounded mb-3"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                lineNumber: 296,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    ...Array(4)
                                ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-12 bg-gray-200 rounded"
                                    }, i, false, {
                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                        lineNumber: 299,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                lineNumber: 297,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                        lineNumber: 295,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                    lineNumber: 294,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 animate-pulse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-5 bg-gray-200 rounded mb-3"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                lineNumber: 306,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    ...Array(3)
                                ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-16 bg-gray-200 rounded"
                                    }, i, false, {
                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                        lineNumber: 309,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                lineNumber: 307,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                        lineNumber: 305,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                    lineNumber: 304,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
            lineNumber: 293,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `space-y-4 ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-3 sm:p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3",
                            children: "Quick Actions"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                            lineNumber: 323,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "default",
                                    className: "w-full text-xs sm:text-sm",
                                    size: "sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 326,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "hidden xs:inline",
                                            children: "Schedule Appointment"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 327,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "xs:hidden",
                                            children: "Schedule"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 328,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 325,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    className: "w-full text-xs sm:text-sm",
                                    size: "sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                            className: "h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 332,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "hidden xs:inline",
                                            children: "View Calendar"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 333,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "xs:hidden",
                                            children: "Calendar"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 334,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 331,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    className: "w-full text-xs sm:text-sm",
                                    size: "sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                            className: "h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 338,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "hidden xs:inline",
                                            children: "Export Schedule"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 339,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "xs:hidden",
                                            children: "Export"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 340,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 337,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                            lineNumber: 324,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                    lineNumber: 322,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                lineNumber: 321,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-3 sm:p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3",
                            children: "Today's Overview"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                            lineNumber: 349,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-2 sm:gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center p-2 sm:p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400",
                                            children: quickStats.todayTotal
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 352,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[10px] sm:text-xs text-blue-800 dark:text-blue-300",
                                            children: "Total"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 353,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 351,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center p-2 sm:p-3 bg-green-50 dark:bg-green-950/20 rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-base sm:text-lg font-bold text-green-600 dark:text-green-400",
                                            children: quickStats.todayCompleted
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 357,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[10px] sm:text-xs text-green-800 dark:text-green-300",
                                            children: "Completed"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 358,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 356,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-base sm:text-lg font-bold text-yellow-600 dark:text-yellow-400",
                                            children: quickStats.todayPending
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 362,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[10px] sm:text-xs text-yellow-800 dark:text-yellow-300",
                                            children: "Pending"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 363,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 361,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center p-2 sm:p-3 bg-red-50 dark:bg-red-950/20 rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-base sm:text-lg font-bold text-red-600 dark:text-red-400",
                                            children: quickStats.todayUrgent
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 367,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[10px] sm:text-xs text-red-800 dark:text-red-300",
                                            children: "Urgent"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 368,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 366,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                            lineNumber: 350,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        quickStats.overdueAppointments > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 sm:mt-3 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center text-red-800 dark:text-red-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                        className: "h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                        lineNumber: 375,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs sm:text-sm font-medium",
                                        children: [
                                            quickStats.overdueAppointments,
                                            " overdue appointment",
                                            quickStats.overdueAppointments !== 1 ? 's' : ''
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                        lineNumber: 376,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                lineNumber: 374,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                            lineNumber: 373,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                    lineNumber: 348,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                lineNumber: 347,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-3 sm:p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3",
                            children: "Quick Search"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                            lineNumber: 388,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                            type: "search",
                            value: searchQuery,
                            onChange: (e)=>setSearchQuery(e.target.value),
                            placeholder: "Search...",
                            className: "h-8 sm:h-9 text-xs sm:text-sm"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                            lineNumber: 389,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                    lineNumber: 387,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                lineNumber: 386,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-3 sm:p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3",
                            children: "Filters"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                            lineNumber: 402,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2 sm:space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-[10px] sm:text-xs font-medium text-muted-foreground mb-1",
                                            children: "Status"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 405,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: activeFilters.status,
                                            onChange: (e)=>handleFilterChange('status', e.target.value),
                                            className: "w-full h-8 sm:h-9 px-2 py-1 text-xs sm:text-sm border border-input rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring",
                                            "aria-label": "Filter by appointment status",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "all",
                                                    children: "All Statuses"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 414,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].SCHEDULED,
                                                    children: "Scheduled"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 415,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].IN_PROGRESS,
                                                    children: "In Progress"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 416,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].COMPLETED,
                                                    children: "Completed"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 417,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].CANCELLED,
                                                    children: "Cancelled"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 418,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentStatus"].NO_SHOW,
                                                    children: "No Show"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 419,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 408,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 404,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-[10px] sm:text-xs font-medium text-muted-foreground mb-1",
                                            children: "Type"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 424,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: activeFilters.type,
                                            onChange: (e)=>handleFilterChange('type', e.target.value),
                                            className: "w-full h-8 sm:h-9 px-2 py-1 text-xs sm:text-sm border border-input rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring",
                                            "aria-label": "Filter by appointment type",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "all",
                                                    children: "All Types"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].ROUTINE_CHECKUP,
                                                    children: "Routine Checkup"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 434,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].MEDICATION_ADMINISTRATION,
                                                    children: "Medication"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 435,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].INJURY_ASSESSMENT,
                                                    children: "Injury Assessment"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 436,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].ILLNESS_EVALUATION,
                                                    children: "Illness Evaluation"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 437,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].SCREENING,
                                                    children: "Screening"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 438,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].FOLLOW_UP,
                                                    children: "Follow Up"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 439,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].EMERGENCY,
                                                    children: "Emergency"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 440,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 427,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 423,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                            lineNumber: 403,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                    lineNumber: 401,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                lineNumber: 400,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-3 sm:p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3 flex items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Upcoming Appointments"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 451,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                    variant: "secondary",
                                    className: "ml-2 text-[10px] sm:text-xs",
                                    children: upcomingAppointments.length
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 452,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                            lineNumber: 450,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        upcomingAppointments.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center py-3 sm:py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                    className: "h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 459,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] sm:text-xs text-muted-foreground",
                                    children: "No upcoming appointments"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 460,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                            lineNumber: 458,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2 sm:space-y-3",
                            children: [
                                upcomingAppointments.map((appointment)=>{
                                    const StatusIcon = getStatusIcon(appointment.status);
                                    const TypeIcon = getTypeIcon(appointment.type);
                                    const isEmergency = appointment.type === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$domain$2f$appointments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppointmentType"].EMERGENCY;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-2 sm:p-3 border border-border rounded-lg hover:shadow-sm transition-shadow cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between mb-1.5 sm:mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TypeIcon, {
                                                                className: `h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 ${isEmergency ? 'text-red-500' : 'text-muted-foreground'}`
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                                lineNumber: 476,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "min-w-0 flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-xs sm:text-sm font-medium text-foreground truncate",
                                                                        children: appointment.studentName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                                        lineNumber: 478,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-[10px] sm:text-xs text-muted-foreground",
                                                                        children: formatTime(appointment.scheduledAt)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                                        lineNumber: 481,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                                lineNumber: 477,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                        lineNumber: 475,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-right flex-shrink-0 ml-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `text-[10px] sm:text-xs font-medium ${isEmergency ? 'text-red-500' : 'text-blue-500'}`,
                                                                children: appointment.timeUntil
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                                lineNumber: 488,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusIcon, {
                                                                className: "h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground ml-auto"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                                lineNumber: 491,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                        lineNumber: 487,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                lineNumber: 474,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[10px] sm:text-xs text-muted-foreground truncate",
                                                children: appointment.reason
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                lineNumber: 495,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mt-1.5 sm:mt-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                        variant: isEmergency ? 'error' : 'secondary',
                                                        className: "text-[10px] sm:text-xs",
                                                        children: formatAppointmentType(appointment.type)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                        lineNumber: 500,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                        className: "h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                        lineNumber: 503,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                lineNumber: 499,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, appointment.id, true, {
                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                        lineNumber: 470,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0));
                                }),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    className: "w-full text-[10px] sm:text-xs",
                                    size: "sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "View All Appointments"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 510,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                            className: "h-2.5 w-2.5 sm:h-3 sm:w-3 ml-1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 511,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 509,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                            lineNumber: 463,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                    lineNumber: 449,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                lineNumber: 448,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-3 sm:p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3",
                            children: "Recent Activity"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                            lineNumber: 521,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        recentActivity.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center py-3 sm:py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                    className: "h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 525,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] sm:text-xs text-muted-foreground",
                                    children: "No recent activity"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 526,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                            lineNumber: 524,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2 sm:space-y-3",
                            children: [
                                recentActivity.slice(0, 5).map((activity)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-2 sm:gap-3 text-[10px] sm:text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `mt-0.5 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full flex-shrink-0 ${activity.type === 'appointment_completed' ? 'bg-green-500' : activity.type === 'appointment_cancelled' ? 'bg-red-500' : activity.type === 'appointment_rescheduled' ? 'bg-yellow-500' : 'bg-blue-500'}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                lineNumber: 535,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-foreground font-medium truncate",
                                                        children: activity.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                        lineNumber: 543,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-muted-foreground truncate",
                                                        children: activity.studentName
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                        lineNumber: 546,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-muted-foreground/70 mt-0.5 sm:mt-1",
                                                        children: formatRelativeTime(activity.timestamp)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                        lineNumber: 549,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                lineNumber: 542,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, activity.id, true, {
                                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                        lineNumber: 531,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))),
                                recentActivity.length > 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    className: "w-full text-[10px] sm:text-xs",
                                    size: "sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "View All Activity"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 558,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                            className: "h-2.5 w-2.5 sm:h-3 sm:w-3 ml-1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 559,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 557,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                            lineNumber: 529,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                    lineNumber: 520,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                lineNumber: 519,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                className: "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-3 sm:p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                    className: "h-3 w-3 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400 flex-shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 571,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xs sm:text-sm font-semibold text-orange-900 dark:text-orange-200",
                                    children: "Healthcare Alerts"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 572,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                            lineNumber: 570,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white dark:bg-background rounded border border-orange-200 dark:border-orange-800",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                            className: "h-2.5 w-2.5 sm:h-3 sm:w-3 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 577,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "min-w-0 flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "font-medium text-orange-900 dark:text-orange-200",
                                                    children: "3 students require immunization follow-up"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 579,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-orange-700 dark:text-orange-300 mt-0.5 sm:mt-1",
                                                    children: "Due within next 7 days"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 582,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 578,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 576,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white dark:bg-background rounded border border-orange-200 dark:border-orange-800",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"], {
                                            className: "h-2.5 w-2.5 sm:h-3 sm:w-3 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 589,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "min-w-0 flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "font-medium text-orange-900 dark:text-orange-200",
                                                    children: "Seasonal health screening reminder"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 591,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-orange-700 dark:text-orange-300 mt-0.5 sm:mt-1",
                                                    children: "Monthly screening due for Grade 3-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                                    lineNumber: 594,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                            lineNumber: 590,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                    lineNumber: 588,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                            lineNumber: 575,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                    lineNumber: 569,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                lineNumber: 568,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-3 sm:p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        className: "w-full text-xs sm:text-sm justify-start",
                        size: "sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                className: "h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                lineNumber: 607,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Appointment Settings"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                                lineNumber: 608,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                        lineNumber: 606,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                    lineNumber: 605,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
                lineNumber: 604,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(dashboard)/appointments/_components/AppointmentsSidebar.tsx",
        lineNumber: 319,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = AppointmentsSidebar;
}),
];

//# sourceMappingURL=src_c13ff2a2._.js.map