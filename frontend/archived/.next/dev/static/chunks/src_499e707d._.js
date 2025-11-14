(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/config/navigationConfig.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layouts/Breadcrumbs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Breadcrumbs",
    ()=>Breadcrumbs,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * WF-COMP-LAY-001 | Breadcrumbs.tsx - Navigation Breadcrumb Trail Component
 * Purpose: Display hierarchical navigation path for current page
 * Dependencies: react, react-router-dom, lucide-react, NavigationContext
 * Features: Auto-generated from route, manual override, responsive, accessible
 * Last Updated: 2025-10-27
 * Agent: Layout Components Architect
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$NavigationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/NavigationContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$navigationConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/navigationConfig.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const Breadcrumbs = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(({ items: customItems, showHomeIcon = true, maxItems = 5, separator, className = '', useContext = true })=>{
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const navigation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$NavigationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigation"])();
    // Determine breadcrumb items
    const breadcrumbItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Breadcrumbs.useMemo[breadcrumbItems]": ()=>{
            // 1. Use custom items if provided
            if (customItems && customItems.length > 0) {
                return customItems;
            }
            // 2. Use NavigationContext breadcrumbs if enabled
            if (useContext && navigation.breadcrumbs && navigation.breadcrumbs.length > 0) {
                return navigation.breadcrumbs.map({
                    "Breadcrumbs.useMemo[breadcrumbItems]": (bc)=>({
                            label: bc.label,
                            path: bc.href
                        })
                }["Breadcrumbs.useMemo[breadcrumbItems]"]);
            }
            // 3. Auto-generate from current route
            const generated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$navigationConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBreadcrumbs"])(pathname);
            return generated.map({
                "Breadcrumbs.useMemo[breadcrumbItems]": (bc)=>({
                        label: bc.name,
                        path: bc.path
                    })
            }["Breadcrumbs.useMemo[breadcrumbItems]"]);
        }
    }["Breadcrumbs.useMemo[breadcrumbItems]"], [
        customItems,
        useContext,
        navigation.breadcrumbs,
        pathname
    ]);
    // Apply max items truncation
    const displayItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Breadcrumbs.useMemo[displayItems]": ()=>{
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
        }
    }["Breadcrumbs.useMemo[displayItems]"], [
        breadcrumbItems,
        maxItems
    ]);
    // Don't render if no breadcrumbs
    if (displayItems.length === 0) {
        return null;
    }
    // Default separator
    const defaultSeparator = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
        className: "h-4 w-4 text-gray-400 dark:text-gray-600",
        "aria-hidden": "true"
    }, void 0, false, {
        fileName: "[project]/src/components/layouts/Breadcrumbs.tsx",
        lineNumber: 158,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Breadcrumb",
        className: `flex items-center text-sm ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
            className: "flex items-center space-x-2",
            children: displayItems.map((item, index)=>{
                const isLast = index === displayItems.length - 1;
                const isHome = index === 0 && item.path === '/dashboard';
                const isTruncated = item.label === '...';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    className: "flex items-center",
                    children: [
                        index > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "mr-2",
                            children: separator || defaultSeparator
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/Breadcrumbs.tsx",
                            lineNumber: 178,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        isTruncated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-500 dark:text-gray-400",
                            "aria-hidden": "true",
                            children: item.label
                        }, void 0, false, {
                            fileName: "[project]/src/components/layouts/Breadcrumbs.tsx",
                            lineNumber: 184,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)) : isLast || !item.path ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-medium text-gray-900 dark:text-gray-100",
                            "aria-current": "page",
                            children: isHome && showHomeIcon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
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
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: item.path || '#',
                            className: "   text-gray-600 hover:text-gray-900   dark:text-gray-400 dark:hover:text-gray-100   transition-colors duration-200   hover:underline focus:underline focus:outline-none   focus:ring-2 focus:ring-primary-500 focus:ring-offset-2   rounded-sm px-1 -mx-1   ",
                            "aria-label": `Navigate to ${item.label}`,
                            children: isHome && showHomeIcon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
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
}, "5OLupswlfvcqZClbcx4ipv2Qpqg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$NavigationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigation"]
    ];
})), "5OLupswlfvcqZClbcx4ipv2Qpqg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$NavigationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigation"]
    ];
});
_c1 = Breadcrumbs;
Breadcrumbs.displayName = 'Breadcrumbs';
const __TURBOPACK__default__export__ = Breadcrumbs;
var _c, _c1;
__turbopack_context__.k.register(_c, "Breadcrumbs$memo");
__turbopack_context__.k.register(_c1, "Breadcrumbs");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
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
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, loading = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        disabled: loading || props.disabled,
        ...props,
        children: loading ? "Loading..." : props.children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/skeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function Skeleton(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "adfe62a1ba9c0395d8b5ce17cf46dd47738a58b6de7428082271c28ec6c6be3a") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "adfe62a1ba9c0395d8b5ce17cf46dd47738a58b6de7428082271c28ec6c6be3a";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("animate-pulse rounded-md bg-primary/10", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/skeleton.tsx",
            lineNumber: 37,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c = Skeleton;
;
var _c;
__turbopack_context__.k.register(_c, "Skeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-xl border bg-card text-card-foreground shadow", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 11,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Card;
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 26,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CardHeader;
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 38,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CardTitle;
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 50,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CardDescription;
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CardContent;
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 70,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = CardFooter;
CardFooter.displayName = "CardFooter";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardDescription");
__turbopack_context__.k.register(_c8, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardContent");
__turbopack_context__.k.register(_c10, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c11, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
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
function Badge(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "6fd653eada5b85614b2f6b6a54ddf01b59d3ef48adc110d8d1e00d36693c37c2") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "6fd653eada5b85614b2f6b6a54ddf01b59d3ef48adc110d8d1e00d36693c37c2";
    }
    let className;
    let props;
    let variant;
    if ($[1] !== t0) {
        ({ className, variant, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = variant;
    } else {
        className = $[2];
        props = $[3];
        variant = $[4];
    }
    let t1;
    if ($[5] !== className || $[6] !== variant) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className);
        $[5] = className;
        $[6] = variant;
        $[7] = t1;
    } else {
        t1 = $[7];
    }
    let t2;
    if ($[8] !== props || $[9] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/badge.tsx",
            lineNumber: 64,
            columnNumber: 10
        }, this);
        $[8] = props;
        $[9] = t1;
        $[10] = t2;
    } else {
        t2 = $[10];
    }
    return t2;
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/actions/health-records.actions.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Server Actions for Health Records Module
 * @module app/health-records/actions
 *
 * Next.js v16 App Router Server Actions for health records, immunizations, allergies, vital signs, and conditions.
 * HIPAA CRITICAL: ALL operations include mandatory audit logging for PHI access.
 * Enhanced with Next.js v16 caching capabilities and revalidation patterns.
 *
 * This module serves as the main entry point and re-exports specialized modules:
 * - health-records.types.ts - Type definitions and interfaces
 * - health-records.utils.ts - Shared utilities and authentication helpers
 * - health-records.crud.ts - Core CRUD operations for health records
 * - health-records.immunizations.ts - Immunization/vaccination record operations
 * - health-records.allergies.ts - Allergy record operations (emergency-critical PHI)
 * - health-records.stats.ts - Statistics and dashboard data operations
 *
 * NOTE: This file does NOT have 'use server' directive because it only re-exports
 * server actions from other files. The 'use server' directive is in the individual
 * implementation files (crud, immunizations, allergies, stats).
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { useActionState } from 'react';
 * import { createHealthRecordAction } from '@/lib/actions/health-records.actions';
 *
 * function HealthRecordForm() {
 *   const [state, formAction, isPending] = useActionState(createHealthRecordAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */ // ==========================================
// TYPE DEFINITIONS
// ==========================================
__turbopack_context__.s([]);
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/actions/data:b480f4 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"602c56788cb4489bd68f5c78fbc0e1b8ea9933b502":"getHealthRecordsAction"},"src/lib/actions/health-records.crud.ts",""] */ __turbopack_context__.s([
    "getHealthRecordsAction",
    ()=>getHealthRecordsAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var getHealthRecordsAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("602c56788cb4489bd68f5c78fbc0e1b8ea9933b502", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getHealthRecordsAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vaGVhbHRoLXJlY29yZHMuY3J1ZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGZpbGVvdmVydmlldyBDUlVEIE9wZXJhdGlvbnMgZm9yIEhlYWx0aCBSZWNvcmRzXHJcbiAqIEBtb2R1bGUgbGliL2FjdGlvbnMvaGVhbHRoLXJlY29yZHMuY3J1ZFxyXG4gKlxyXG4gKiBDb3JlIGNyZWF0ZSwgcmVhZCwgdXBkYXRlLCBhbmQgZGVsZXRlIG9wZXJhdGlvbnMgZm9yIGhlYWx0aCByZWNvcmRzLlxyXG4gKiBISVBBQSBDUklUSUNBTDogQUxMIG9wZXJhdGlvbnMgaW5jbHVkZSBtYW5kYXRvcnkgYXVkaXQgbG9nZ2luZyBmb3IgUEhJIGFjY2Vzcy5cclxuICogRW5oYW5jZWQgd2l0aCBOZXh0LmpzIHYxNiBjYWNoaW5nIGNhcGFiaWxpdGllcyBhbmQgcmV2YWxpZGF0aW9uIHBhdHRlcm5zLlxyXG4gKi9cclxuXHJcbid1c2Ugc2VydmVyJztcclxuXHJcbmltcG9ydCB7IHJldmFsaWRhdGVQYXRoLCByZXZhbGlkYXRlVGFnIH0gZnJvbSAnbmV4dC9jYWNoZSc7XHJcbmltcG9ydCB7IHosIHR5cGUgWm9kSXNzdWUgfSBmcm9tICd6b2QnO1xyXG5pbXBvcnQgeyBzZXJ2ZXJHZXQgfSBmcm9tICdAL2xpYi9hcGkvbmV4dGpzLWNsaWVudCc7XHJcbmltcG9ydCB0eXBlIHsgQXBpUmVzcG9uc2UgfSBmcm9tICdAL3R5cGVzJztcclxuXHJcbi8vIEltcG9ydCBzY2hlbWFzXHJcbmltcG9ydCB7XHJcbiAgaGVhbHRoUmVjb3JkQ3JlYXRlU2NoZW1hLFxyXG4gIGhlYWx0aFJlY29yZFVwZGF0ZVNjaGVtYVxyXG59IGZyb20gJ0Avc2NoZW1hcy9oZWFsdGgtcmVjb3JkLnNjaGVtYXMnO1xyXG5cclxuLy8gSW1wb3J0IGF1ZGl0IGxvZ2dpbmcgdXRpbGl0aWVzXHJcbmltcG9ydCB7XHJcbiAgYXVkaXRMb2csXHJcbiAgQVVESVRfQUNUSU9OU1xyXG59IGZyb20gJ0AvbGliL2F1ZGl0JztcclxuXHJcbi8vIEltcG9ydCBzaGFyZWQgdXRpbGl0aWVzIGFuZCB0eXBlc1xyXG5pbXBvcnQge1xyXG4gIGdldEF1dGhUb2tlbixcclxuICBjcmVhdGVBdWRpdENvbnRleHQsXHJcbiAgZW5oYW5jZWRGZXRjaCxcclxuICBCQUNLRU5EX1VSTFxyXG59IGZyb20gJy4vaGVhbHRoLXJlY29yZHMudXRpbHMnO1xyXG5pbXBvcnQgdHlwZSB7IEFjdGlvblJlc3VsdCB9IGZyb20gJy4vaGVhbHRoLXJlY29yZHMudHlwZXMnO1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhIG5ldyBoZWFsdGggcmVjb3JkIHdpdGggSElQQUEgYXVkaXQgbG9nZ2luZ1xyXG4gKiBFbmhhbmNlZCB3aXRoIE5leHQuanMgdjE2IGNhY2hpbmcgYW5kIHZhbGlkYXRpb25cclxuICpcclxuICogQHBhcmFtIHByZXZTdGF0ZSAtIFByZXZpb3VzIGFjdGlvbiBzdGF0ZSAoZm9yIHVzZUFjdGlvblN0YXRlIGhvb2spXHJcbiAqIEBwYXJhbSBmb3JtRGF0YSAtIEZvcm0gZGF0YSBjb250YWluaW5nIGhlYWx0aCByZWNvcmQgZmllbGRzXHJcbiAqIEByZXR1cm5zIEFjdGlvblJlc3VsdCB3aXRoIGNyZWF0ZWQgcmVjb3JkIGRhdGEgb3IgdmFsaWRhdGlvbiBlcnJvcnNcclxuICpcclxuICogQGV4YW1wbGVcclxuICogYGBgdHlwZXNjcmlwdFxyXG4gKiAndXNlIGNsaWVudCc7XHJcbiAqIGltcG9ydCB7IHVzZUFjdGlvblN0YXRlIH0gZnJvbSAncmVhY3QnO1xyXG4gKiBpbXBvcnQgeyBjcmVhdGVIZWFsdGhSZWNvcmRBY3Rpb24gfSBmcm9tICdAL2xpYi9hY3Rpb25zL2hlYWx0aC1yZWNvcmRzLmFjdGlvbnMnO1xyXG4gKlxyXG4gKiBmdW5jdGlvbiBIZWFsdGhSZWNvcmRGb3JtKCkge1xyXG4gKiAgIGNvbnN0IFtzdGF0ZSwgZm9ybUFjdGlvbiwgaXNQZW5kaW5nXSA9IHVzZUFjdGlvblN0YXRlKGNyZWF0ZUhlYWx0aFJlY29yZEFjdGlvbiwgeyBlcnJvcnM6IHt9IH0pO1xyXG4gKiAgIHJldHVybiA8Zm9ybSBhY3Rpb249e2Zvcm1BY3Rpb259Pi4uLjwvZm9ybT47XHJcbiAqIH1cclxuICogYGBgXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlSGVhbHRoUmVjb3JkQWN0aW9uKFxyXG4gIF9wcmV2U3RhdGU6IEFjdGlvblJlc3VsdCxcclxuICBmb3JtRGF0YTogRm9ybURhdGFcclxuKTogUHJvbWlzZTxBY3Rpb25SZXN1bHQ+IHtcclxuICBjb25zdCB0b2tlbiA9IGF3YWl0IGdldEF1dGhUb2tlbigpO1xyXG4gIGNvbnN0IGF1ZGl0Q29udGV4dCA9IGF3YWl0IGNyZWF0ZUF1ZGl0Q29udGV4dCgpO1xyXG5cclxuICBpZiAoIXRva2VuKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBlcnJvcnM6IHtcclxuICAgICAgICBfZm9ybTogWydBdXRoZW50aWNhdGlvbiByZXF1aXJlZCddXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICB0cnkge1xyXG4gICAgLy8gUGFyc2UgYW5kIHZhbGlkYXRlIGZvcm0gZGF0YVxyXG4gICAgY29uc3QgcmF3RGF0YSA9IHtcclxuICAgICAgc3R1ZGVudElkOiBmb3JtRGF0YS5nZXQoJ3N0dWRlbnRJZCcpLFxyXG4gICAgICByZWNvcmRUeXBlOiBmb3JtRGF0YS5nZXQoJ3JlY29yZFR5cGUnKSxcclxuICAgICAgdGl0bGU6IGZvcm1EYXRhLmdldCgndGl0bGUnKSxcclxuICAgICAgZGVzY3JpcHRpb246IGZvcm1EYXRhLmdldCgnZGVzY3JpcHRpb24nKSxcclxuICAgICAgcmVjb3JkRGF0ZTogZm9ybURhdGEuZ2V0KCdyZWNvcmREYXRlJyksXHJcbiAgICAgIHByb3ZpZGVyOiBmb3JtRGF0YS5nZXQoJ3Byb3ZpZGVyJykgfHwgdW5kZWZpbmVkLFxyXG4gICAgICBwcm92aWRlck5waTogZm9ybURhdGEuZ2V0KCdwcm92aWRlck5waScpIHx8ICcnLFxyXG4gICAgICBmYWNpbGl0eTogZm9ybURhdGEuZ2V0KCdmYWNpbGl0eScpIHx8IHVuZGVmaW5lZCxcclxuICAgICAgZmFjaWxpdHlOcGk6IGZvcm1EYXRhLmdldCgnZmFjaWxpdHlOcGknKSB8fCAnJyxcclxuICAgICAgZGlhZ25vc2lzOiBmb3JtRGF0YS5nZXQoJ2RpYWdub3NpcycpIHx8IHVuZGVmaW5lZCxcclxuICAgICAgZGlhZ25vc2lzQ29kZTogZm9ybURhdGEuZ2V0KCdkaWFnbm9zaXNDb2RlJykgfHwgJycsXHJcbiAgICAgIHRyZWF0bWVudDogZm9ybURhdGEuZ2V0KCd0cmVhdG1lbnQnKSB8fCB1bmRlZmluZWQsXHJcbiAgICAgIGZvbGxvd1VwUmVxdWlyZWQ6IGZvcm1EYXRhLmdldCgnZm9sbG93VXBSZXF1aXJlZCcpID09PSAndHJ1ZScsXHJcbiAgICAgIGZvbGxvd1VwRGF0ZTogZm9ybURhdGEuZ2V0KCdmb2xsb3dVcERhdGUnKSB8fCB1bmRlZmluZWQsXHJcbiAgICAgIGZvbGxvd1VwQ29tcGxldGVkOiBmb3JtRGF0YS5nZXQoJ2ZvbGxvd1VwQ29tcGxldGVkJykgPT09ICd0cnVlJyxcclxuICAgICAgaXNDb25maWRlbnRpYWw6IGZvcm1EYXRhLmdldCgnaXNDb25maWRlbnRpYWwnKSA9PT0gJ3RydWUnLFxyXG4gICAgICBub3RlczogZm9ybURhdGEuZ2V0KCdub3RlcycpIHx8IHVuZGVmaW5lZCxcclxuICAgICAgYXR0YWNobWVudHM6IFtdXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHZhbGlkYXRlZERhdGEgPSBoZWFsdGhSZWNvcmRDcmVhdGVTY2hlbWEucGFyc2UocmF3RGF0YSk7XHJcblxyXG4gICAgLy8gQ3JlYXRlIGhlYWx0aCByZWNvcmQgdmlhIGJhY2tlbmQgQVBJIHdpdGggZW5oYW5jZWQgZmV0Y2ggKGJhY2tlbmQgdXNlcyAvaGVhbHRoLXJlY29yZCBzaW5ndWxhcilcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZW5oYW5jZWRGZXRjaChgJHtCQUNLRU5EX1VSTH0vaGVhbHRoLXJlY29yZGAsIHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHZhbGlkYXRlZERhdGEpXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgIGNvbnN0IGVycm9yID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSB8fCAnRmFpbGVkIHRvIGNyZWF0ZSBoZWFsdGggcmVjb3JkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgIC8vIEhJUEFBIEFVRElUIExPRyAtIE1hbmRhdG9yeSBmb3IgUEhJIGNyZWF0aW9uXHJcbiAgICBhd2FpdCBhdWRpdExvZyh7XHJcbiAgICAgIC4uLmF1ZGl0Q29udGV4dCxcclxuICAgICAgYWN0aW9uOiBBVURJVF9BQ1RJT05TLkNSRUFURV9IRUFMVEhfUkVDT1JELFxyXG4gICAgICByZXNvdXJjZTogJ0hlYWx0aFJlY29yZCcsXHJcbiAgICAgIHJlc291cmNlSWQ6IHJlc3VsdC5kYXRhLmlkLFxyXG4gICAgICBkZXRhaWxzOiBgQ3JlYXRlZCAke3ZhbGlkYXRlZERhdGEucmVjb3JkVHlwZX0gaGVhbHRoIHJlY29yZCBmb3Igc3R1ZGVudCAke3ZhbGlkYXRlZERhdGEuc3R1ZGVudElkfWAsXHJcbiAgICAgIHN1Y2Nlc3M6IHRydWVcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEVuaGFuY2VkIGNhY2hlIGludmFsaWRhdGlvbiB3aXRoIE5leHQuanMgdjE2XHJcbiAgICByZXZhbGlkYXRlVGFnKCdoZWFsdGgtcmVjb3JkcycsICdkZWZhdWx0Jyk7XHJcbiAgICByZXZhbGlkYXRlVGFnKGBzdHVkZW50LSR7dmFsaWRhdGVkRGF0YS5zdHVkZW50SWR9LWhlYWx0aC1yZWNvcmRzYCwgJ2RlZmF1bHQnKTtcclxuICAgIHJldmFsaWRhdGVUYWcoJ3BoaS1kYXRhJywgJ2RlZmF1bHQnKTtcclxuICAgIHJldmFsaWRhdGVQYXRoKGAvc3R1ZGVudHMvJHt2YWxpZGF0ZWREYXRhLnN0dWRlbnRJZH0vaGVhbHRoLXJlY29yZHNgKTtcclxuICAgIHJldmFsaWRhdGVQYXRoKCcvaGVhbHRoLXJlY29yZHMnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICBkYXRhOiByZXN1bHQuZGF0YSxcclxuICAgICAgbWVzc2FnZTogJ0hlYWx0aCByZWNvcmQgY3JlYXRlZCBzdWNjZXNzZnVsbHknXHJcbiAgICB9O1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiB6LlpvZEVycm9yKSB7XHJcbiAgICAgIGNvbnN0IGZpZWxkRXJyb3JzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSB7fTtcclxuICAgICAgZXJyb3IuaXNzdWVzLmZvckVhY2goKGVycjogWm9kSXNzdWUpID0+IHtcclxuICAgICAgICBjb25zdCBwYXRoID0gZXJyLnBhdGguam9pbignLicpO1xyXG4gICAgICAgIGlmICghZmllbGRFcnJvcnNbcGF0aF0pIHtcclxuICAgICAgICAgIGZpZWxkRXJyb3JzW3BhdGhdID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpZWxkRXJyb3JzW3BhdGhdLnB1c2goZXJyLm1lc3NhZ2UpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZXJyb3JzOiBmaWVsZEVycm9yc1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEhJUEFBIEFVRElUIExPRyAtIExvZyBmYWlsZWQgYXR0ZW1wdFxyXG4gICAgYXdhaXQgYXVkaXRMb2coe1xyXG4gICAgICAuLi5hdWRpdENvbnRleHQsXHJcbiAgICAgIGFjdGlvbjogQVVESVRfQUNUSU9OUy5DUkVBVEVfSEVBTFRIX1JFQ09SRCxcclxuICAgICAgcmVzb3VyY2U6ICdIZWFsdGhSZWNvcmQnLFxyXG4gICAgICBkZXRhaWxzOiAnRmFpbGVkIHRvIGNyZWF0ZSBoZWFsdGggcmVjb3JkJyxcclxuICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgIGVycm9yTWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiAnVW5rbm93biBlcnJvcidcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGVycm9yczoge1xyXG4gICAgICAgIF9mb3JtOiBbZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiAnRmFpbGVkIHRvIGNyZWF0ZSBoZWFsdGggcmVjb3JkJ11cclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgaGVhbHRoIHJlY29yZHMgd2l0aCBlbmhhbmNlZCBjYWNoaW5nXHJcbiAqXHJcbiAqIEBwYXJhbSBzdHVkZW50SWQgLSBPcHRpb25hbCBzdHVkZW50IElEIHRvIGZpbHRlciByZWNvcmRzXHJcbiAqIEBwYXJhbSByZWNvcmRUeXBlIC0gT3B0aW9uYWwgcmVjb3JkIHR5cGUgdG8gZmlsdGVyXHJcbiAqIEByZXR1cm5zIEFjdGlvblJlc3VsdCB3aXRoIGFycmF5IG9mIGhlYWx0aCByZWNvcmRzIG9yIGVycm9yXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYHR5cGVzY3JpcHRcclxuICogLy8gR2V0IGFsbCByZWNvcmRzIGZvciBhIHN0dWRlbnRcclxuICogY29uc3QgcmVzdWx0ID0gYXdhaXQgZ2V0SGVhbHRoUmVjb3Jkc0FjdGlvbignc3R1ZGVudC0xMjMnKTtcclxuICpcclxuICogLy8gR2V0IHNwZWNpZmljIHJlY29yZCB0eXBlIGZvciBhIHN0dWRlbnRcclxuICogY29uc3QgaW1tdW5pemF0aW9ucyA9IGF3YWl0IGdldEhlYWx0aFJlY29yZHNBY3Rpb24oJ3N0dWRlbnQtMTIzJywgJ0lNTVVOSVpBVElPTicpO1xyXG4gKlxyXG4gKiAvLyBHZXQgYWxsIHJlY29yZHMgYWNyb3NzIGFsbCBzdHVkZW50c1xyXG4gKiBjb25zdCBhbGxSZWNvcmRzID0gYXdhaXQgZ2V0SGVhbHRoUmVjb3Jkc0FjdGlvbigpO1xyXG4gKiBgYGBcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRIZWFsdGhSZWNvcmRzQWN0aW9uKHN0dWRlbnRJZD86IHN0cmluZywgcmVjb3JkVHlwZT86IHN0cmluZykge1xyXG4gIHRyeSB7XHJcbiAgICAvLyBCdWlsZCBlbmRwb2ludCBhbmQgcGFyYW1zIGJhc2VkIG9uIHdoZXRoZXIgc3R1ZGVudElkIGlzIHByb3ZpZGVkXHJcbiAgICBsZXQgZW5kcG9pbnQ6IHN0cmluZztcclxuICAgIGNvbnN0IHBhcmFtczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xyXG5cclxuICAgIGlmIChzdHVkZW50SWQpIHtcclxuICAgICAgLy8gR2V0IHJlY29yZHMgZm9yIGEgc3BlY2lmaWMgc3R1ZGVudFxyXG4gICAgICBlbmRwb2ludCA9IGAvaGVhbHRoLXJlY29yZC9zdHVkZW50LyR7c3R1ZGVudElkfWA7XHJcbiAgICAgIGlmIChyZWNvcmRUeXBlKSB7XHJcbiAgICAgICAgcGFyYW1zLnJlY29yZFR5cGUgPSByZWNvcmRUeXBlO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBHZXQgYWxsIGhlYWx0aCByZWNvcmRzIGFjcm9zcyBhbGwgc3R1ZGVudHNcclxuICAgICAgZW5kcG9pbnQgPSAnL2hlYWx0aC1yZWNvcmQnO1xyXG4gICAgICBpZiAocmVjb3JkVHlwZSkge1xyXG4gICAgICAgIHBhcmFtcy50eXBlID0gcmVjb3JkVHlwZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCdbSGVhbHRoIFJlY29yZHNdIEZldGNoaW5nIGZyb206JywgZW5kcG9pbnQsIHBhcmFtcyk7XHJcblxyXG4gICAgY29uc3Qgd3JhcHBlZFJlc3BvbnNlID0gYXdhaXQgc2VydmVyR2V0PEFwaVJlc3BvbnNlPHsgZGF0YTogdW5rbm93bltdIH0+PihcclxuICAgICAgZW5kcG9pbnQsXHJcbiAgICAgIHBhcmFtcyxcclxuICAgICAge1xyXG4gICAgICAgIGNhY2hlOiAnbm8tc3RvcmUnLCAvLyBGcmVzaCBkYXRhIGZvciBoZWFsdGggcmVjb3Jkc1xyXG4gICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCdbSGVhbHRoIFJlY29yZHNdIFJlc3BvbnNlIHN0cnVjdHVyZTonLCB7XHJcbiAgICAgIGhhc0RhdGE6ICEhd3JhcHBlZFJlc3BvbnNlLmRhdGEsXHJcbiAgICAgIGRhdGFUeXBlOiB0eXBlb2Ygd3JhcHBlZFJlc3BvbnNlLmRhdGEsXHJcbiAgICAgIGlzQXJyYXk6IEFycmF5LmlzQXJyYXkod3JhcHBlZFJlc3BvbnNlLmRhdGEpXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBISVBBQSBBVURJVCBMT0cgLSBQSEkgYWNjZXNzXHJcbiAgICBjb25zdCBhdWRpdENvbnRleHQgPSBhd2FpdCBjcmVhdGVBdWRpdENvbnRleHQoKTtcclxuICAgIGF3YWl0IGF1ZGl0TG9nKHtcclxuICAgICAgLi4uYXVkaXRDb250ZXh0LFxyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuVklFV19IRUFMVEhfUkVDT1JELFxyXG4gICAgICByZXNvdXJjZTogJ0hlYWx0aFJlY29yZCcsXHJcbiAgICAgIGRldGFpbHM6IGBBY2Nlc3NlZCBoZWFsdGggcmVjb3JkcyBmb3Igc3R1ZGVudCAke3N0dWRlbnRJZH1gLFxyXG4gICAgICBzdWNjZXNzOiB0cnVlXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBCYWNrZW5kIHdyYXBzIHJlc3BvbnNlIGluIEFwaVJlc3BvbnNlIGZvcm1hdDogeyBzdWNjZXNzLCBzdGF0dXNDb2RlLCBkYXRhOiB7Li4ufSB9XHJcbiAgICAvLyBUaGUgYWN0dWFsIGhlYWx0aCByZWNvcmRzIG1pZ2h0IGJlIGluIHdyYXBwZWRSZXNwb25zZS5kYXRhLmRhdGEgb3Igd3JhcHBlZFJlc3BvbnNlLmRhdGFcclxuICAgIGxldCBoZWFsdGhSZWNvcmRzOiB1bmtub3duW10gPSBbXTtcclxuXHJcbiAgICBpZiAod3JhcHBlZFJlc3BvbnNlLmRhdGEpIHtcclxuICAgICAgLy8gSWYgd3JhcHBlZFJlc3BvbnNlLmRhdGEgaXMgYW4gYXJyYXksIHVzZSBpdCBkaXJlY3RseVxyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh3cmFwcGVkUmVzcG9uc2UuZGF0YSkpIHtcclxuICAgICAgICBoZWFsdGhSZWNvcmRzID0gd3JhcHBlZFJlc3BvbnNlLmRhdGE7XHJcbiAgICAgIH1cclxuICAgICAgLy8gSWYgd3JhcHBlZFJlc3BvbnNlLmRhdGEgaGFzIGEgZGF0YSBwcm9wZXJ0eSAoZG91YmxlLXdyYXBwZWQpLCBleHRyYWN0IGl0XHJcbiAgICAgIGVsc2UgaWYgKHR5cGVvZiB3cmFwcGVkUmVzcG9uc2UuZGF0YSA9PT0gJ29iamVjdCcgJiYgJ2RhdGEnIGluIHdyYXBwZWRSZXNwb25zZS5kYXRhKSB7XHJcbiAgICAgICAgY29uc3QgbmVzdGVkID0gd3JhcHBlZFJlc3BvbnNlLmRhdGEgYXMgeyBkYXRhPzogdW5rbm93bltdIH07XHJcbiAgICAgICAgaWYgKG5lc3RlZC5kYXRhICYmIEFycmF5LmlzQXJyYXkobmVzdGVkLmRhdGEpKSB7XHJcbiAgICAgICAgICBoZWFsdGhSZWNvcmRzID0gbmVzdGVkLmRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vIElmIHdyYXBwZWRSZXNwb25zZS5kYXRhIGlzIGFuIG9iamVjdCB3aXRoIHJlY29yZHMgcHJvcGVydHlcclxuICAgICAgZWxzZSBpZiAodHlwZW9mIHdyYXBwZWRSZXNwb25zZS5kYXRhID09PSAnb2JqZWN0JyAmJiAncmVjb3JkcycgaW4gd3JhcHBlZFJlc3BvbnNlLmRhdGEpIHtcclxuICAgICAgICBjb25zdCBuZXN0ZWQgPSB3cmFwcGVkUmVzcG9uc2UuZGF0YSBhcyB7IHJlY29yZHM/OiB1bmtub3duW10gfTtcclxuICAgICAgICBpZiAobmVzdGVkLnJlY29yZHMgJiYgQXJyYXkuaXNBcnJheShuZXN0ZWQucmVjb3JkcykpIHtcclxuICAgICAgICAgIGhlYWx0aFJlY29yZHMgPSBuZXN0ZWQucmVjb3JkcztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZygnW0hlYWx0aCBSZWNvcmRzXSBTdWNjZXNzZnVsbHkgZmV0Y2hlZCByZWNvcmRzOicsIGhlYWx0aFJlY29yZHMubGVuZ3RoKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICBkYXRhOiBoZWFsdGhSZWNvcmRzXHJcbiAgICB9O1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdGYWlsZWQgdG8gZmV0Y2ggaGVhbHRoIHJlY29yZHMnO1xyXG4gICAgY29uc29sZS5lcnJvcignW0hlYWx0aCBSZWNvcmRzXSBFcnJvciBpbiBnZXRIZWFsdGhSZWNvcmRzQWN0aW9uOicsIGVycm9yTWVzc2FnZSk7XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgaXQncyBhIG5ldHdvcmsvY29ubmVjdGlvbiBlcnJvclxyXG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgVHlwZUVycm9yICYmIGVycm9yLm1lc3NhZ2UuaW5jbHVkZXMoJ2ZldGNoJykpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICBlcnJvcjogYENhbm5vdCBjb25uZWN0IHRvIGJhY2tlbmQgc2VydmVyIGF0ICR7QkFDS0VORF9VUkx9LiBQbGVhc2UgZW5zdXJlIHRoZSBiYWNrZW5kIGlzIHJ1bm5pbmcuYFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICBlcnJvcjogZXJyb3JNZXNzYWdlXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBoZWFsdGggcmVjb3JkIHdpdGggSElQQUEgYXVkaXQgbG9nZ2luZ1xyXG4gKlxyXG4gKiBAcGFyYW0gaWQgLSBIZWFsdGggcmVjb3JkIElEIHRvIHVwZGF0ZVxyXG4gKiBAcGFyYW0gcHJldlN0YXRlIC0gUHJldmlvdXMgYWN0aW9uIHN0YXRlIChmb3IgdXNlQWN0aW9uU3RhdGUgaG9vaylcclxuICogQHBhcmFtIGZvcm1EYXRhIC0gRm9ybSBkYXRhIGNvbnRhaW5pbmcgdXBkYXRlZCBmaWVsZHNcclxuICogQHJldHVybnMgQWN0aW9uUmVzdWx0IHdpdGggdXBkYXRlZCByZWNvcmQgZGF0YSBvciB2YWxpZGF0aW9uIGVycm9yc1xyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBgYGB0eXBlc2NyaXB0XHJcbiAqIGNvbnN0IFtzdGF0ZSwgZm9ybUFjdGlvbl0gPSB1c2VBY3Rpb25TdGF0ZShcclxuICogICAocHJldiwgZGF0YSkgPT4gdXBkYXRlSGVhbHRoUmVjb3JkQWN0aW9uKCdyZWNvcmQtMTIzJywgcHJldiwgZGF0YSksXHJcbiAqICAgeyBlcnJvcnM6IHt9IH1cclxuICogKTtcclxuICogYGBgXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlSGVhbHRoUmVjb3JkQWN0aW9uKFxyXG4gIGlkOiBzdHJpbmcsXHJcbiAgX3ByZXZTdGF0ZTogQWN0aW9uUmVzdWx0LFxyXG4gIGZvcm1EYXRhOiBGb3JtRGF0YVxyXG4pOiBQcm9taXNlPEFjdGlvblJlc3VsdD4ge1xyXG4gIGNvbnN0IHRva2VuID0gYXdhaXQgZ2V0QXV0aFRva2VuKCk7XHJcbiAgY29uc3QgYXVkaXRDb250ZXh0ID0gYXdhaXQgY3JlYXRlQXVkaXRDb250ZXh0KCk7XHJcblxyXG4gIGlmICghdG9rZW4pIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGVycm9yczoge1xyXG4gICAgICAgIF9mb3JtOiBbJ0F1dGhlbnRpY2F0aW9uIHJlcXVpcmVkJ11cclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByYXdEYXRhID0ge1xyXG4gICAgICByZWNvcmRUeXBlOiBmb3JtRGF0YS5nZXQoJ3JlY29yZFR5cGUnKSB8fCB1bmRlZmluZWQsXHJcbiAgICAgIHRpdGxlOiBmb3JtRGF0YS5nZXQoJ3RpdGxlJykgfHwgdW5kZWZpbmVkLFxyXG4gICAgICBkZXNjcmlwdGlvbjogZm9ybURhdGEuZ2V0KCdkZXNjcmlwdGlvbicpIHx8IHVuZGVmaW5lZCxcclxuICAgICAgcmVjb3JkRGF0ZTogZm9ybURhdGEuZ2V0KCdyZWNvcmREYXRlJykgfHwgdW5kZWZpbmVkLFxyXG4gICAgICBwcm92aWRlcjogZm9ybURhdGEuZ2V0KCdwcm92aWRlcicpIHx8IHVuZGVmaW5lZCxcclxuICAgICAgcHJvdmlkZXJOcGk6IGZvcm1EYXRhLmdldCgncHJvdmlkZXJOcGknKSB8fCAnJyxcclxuICAgICAgZmFjaWxpdHk6IGZvcm1EYXRhLmdldCgnZmFjaWxpdHknKSB8fCB1bmRlZmluZWQsXHJcbiAgICAgIGZhY2lsaXR5TnBpOiBmb3JtRGF0YS5nZXQoJ2ZhY2lsaXR5TnBpJykgfHwgJycsXHJcbiAgICAgIGRpYWdub3NpczogZm9ybURhdGEuZ2V0KCdkaWFnbm9zaXMnKSB8fCB1bmRlZmluZWQsXHJcbiAgICAgIGRpYWdub3Npc0NvZGU6IGZvcm1EYXRhLmdldCgnZGlhZ25vc2lzQ29kZScpIHx8ICcnLFxyXG4gICAgICB0cmVhdG1lbnQ6IGZvcm1EYXRhLmdldCgndHJlYXRtZW50JykgfHwgdW5kZWZpbmVkLFxyXG4gICAgICBmb2xsb3dVcFJlcXVpcmVkOiBmb3JtRGF0YS5nZXQoJ2ZvbGxvd1VwUmVxdWlyZWQnKSA/IGZvcm1EYXRhLmdldCgnZm9sbG93VXBSZXF1aXJlZCcpID09PSAndHJ1ZScgOiB1bmRlZmluZWQsXHJcbiAgICAgIGZvbGxvd1VwRGF0ZTogZm9ybURhdGEuZ2V0KCdmb2xsb3dVcERhdGUnKSB8fCB1bmRlZmluZWQsXHJcbiAgICAgIGZvbGxvd1VwQ29tcGxldGVkOiBmb3JtRGF0YS5nZXQoJ2ZvbGxvd1VwQ29tcGxldGVkJykgPyBmb3JtRGF0YS5nZXQoJ2ZvbGxvd1VwQ29tcGxldGVkJykgPT09ICd0cnVlJyA6IHVuZGVmaW5lZCxcclxuICAgICAgaXNDb25maWRlbnRpYWw6IGZvcm1EYXRhLmdldCgnaXNDb25maWRlbnRpYWwnKSA/IGZvcm1EYXRhLmdldCgnaXNDb25maWRlbnRpYWwnKSA9PT0gJ3RydWUnIDogdW5kZWZpbmVkLFxyXG4gICAgICBub3RlczogZm9ybURhdGEuZ2V0KCdub3RlcycpIHx8IHVuZGVmaW5lZFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCB2YWxpZGF0ZWREYXRhID0gaGVhbHRoUmVjb3JkVXBkYXRlU2NoZW1hLnBhcnNlKHJhd0RhdGEpO1xyXG5cclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZW5oYW5jZWRGZXRjaChgJHtCQUNLRU5EX1VSTH0vaGVhbHRoLXJlY29yZC8ke2lkfWAsIHtcclxuICAgICAgbWV0aG9kOiAnUEFUQ0gnLFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh2YWxpZGF0ZWREYXRhKVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ZhaWxlZCB0byB1cGRhdGUgaGVhbHRoIHJlY29yZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAvLyBISVBBQSBBVURJVCBMT0cgLSBNYW5kYXRvcnkgZm9yIFBISSBtb2RpZmljYXRpb25cclxuICAgIGF3YWl0IGF1ZGl0TG9nKHtcclxuICAgICAgLi4uYXVkaXRDb250ZXh0LFxyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuVVBEQVRFX0hFQUxUSF9SRUNPUkQsXHJcbiAgICAgIHJlc291cmNlOiAnSGVhbHRoUmVjb3JkJyxcclxuICAgICAgcmVzb3VyY2VJZDogaWQsXHJcbiAgICAgIGRldGFpbHM6IGBVcGRhdGVkIGhlYWx0aCByZWNvcmQgJHtpZH1gLFxyXG4gICAgICBjaGFuZ2VzOiB2YWxpZGF0ZWREYXRhLFxyXG4gICAgICBzdWNjZXNzOiB0cnVlXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBFbmhhbmNlZCBjYWNoZSBpbnZhbGlkYXRpb25cclxuICAgIHJldmFsaWRhdGVUYWcoJ2hlYWx0aC1yZWNvcmRzJywgJ2RlZmF1bHQnKTtcclxuICAgIHJldmFsaWRhdGVUYWcoYGhlYWx0aC1yZWNvcmQtJHtpZH1gLCAnZGVmYXVsdCcpO1xyXG4gICAgcmV2YWxpZGF0ZVRhZygncGhpLWRhdGEnLCAnZGVmYXVsdCcpO1xyXG4gICAgcmV2YWxpZGF0ZVBhdGgoYC9oZWFsdGgtcmVjb3Jkcy8ke2lkfWApO1xyXG4gICAgcmV2YWxpZGF0ZVBhdGgoJy9oZWFsdGgtcmVjb3JkcycpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgIGRhdGE6IHJlc3VsdC5kYXRhLFxyXG4gICAgICBtZXNzYWdlOiAnSGVhbHRoIHJlY29yZCB1cGRhdGVkIHN1Y2Nlc3NmdWxseSdcclxuICAgIH07XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIHouWm9kRXJyb3IpIHtcclxuICAgICAgY29uc3QgZmllbGRFcnJvcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZ1tdPiA9IHt9O1xyXG4gICAgICBlcnJvci5pc3N1ZXMuZm9yRWFjaCgoZXJyOiBab2RJc3N1ZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSBlcnIucGF0aC5qb2luKCcuJyk7XHJcbiAgICAgICAgaWYgKCFmaWVsZEVycm9yc1twYXRoXSkge1xyXG4gICAgICAgICAgZmllbGRFcnJvcnNbcGF0aF0gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmllbGRFcnJvcnNbcGF0aF0ucHVzaChlcnIubWVzc2FnZSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBlcnJvcnM6IGZpZWxkRXJyb3JzXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSElQQUEgQVVESVQgTE9HIC0gTG9nIGZhaWxlZCB1cGRhdGUgYXR0ZW1wdFxyXG4gICAgYXdhaXQgYXVkaXRMb2coe1xyXG4gICAgICAuLi5hdWRpdENvbnRleHQsXHJcbiAgICAgIGFjdGlvbjogQVVESVRfQUNUSU9OUy5VUERBVEVfSEVBTFRIX1JFQ09SRCxcclxuICAgICAgcmVzb3VyY2U6ICdIZWFsdGhSZWNvcmQnLFxyXG4gICAgICByZXNvdXJjZUlkOiBpZCxcclxuICAgICAgZGV0YWlsczogYEZhaWxlZCB0byB1cGRhdGUgaGVhbHRoIHJlY29yZCAke2lkfWAsXHJcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICBlcnJvck1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBlcnJvcnM6IHtcclxuICAgICAgICBfZm9ybTogW2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ0ZhaWxlZCB0byB1cGRhdGUgaGVhbHRoIHJlY29yZCddXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogRGVsZXRlIGhlYWx0aCByZWNvcmQgd2l0aCBISVBBQSBhdWRpdCBsb2dnaW5nXHJcbiAqXHJcbiAqIEBwYXJhbSBpZCAtIEhlYWx0aCByZWNvcmQgSUQgdG8gZGVsZXRlXHJcbiAqIEByZXR1cm5zIEFjdGlvblJlc3VsdCB3aXRoIHN1Y2Nlc3Mgc3RhdHVzIG9yIGVycm9yXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYHR5cGVzY3JpcHRcclxuICogY29uc3QgcmVzdWx0ID0gYXdhaXQgZGVsZXRlSGVhbHRoUmVjb3JkQWN0aW9uKCdyZWNvcmQtMTIzJyk7XHJcbiAqIGlmIChyZXN1bHQuc3VjY2Vzcykge1xyXG4gKiAgIGNvbnNvbGUubG9nKCdSZWNvcmQgZGVsZXRlZCBzdWNjZXNzZnVsbHknKTtcclxuICogfVxyXG4gKiBgYGBcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVIZWFsdGhSZWNvcmRBY3Rpb24oaWQ6IHN0cmluZyk6IFByb21pc2U8QWN0aW9uUmVzdWx0PiB7XHJcbiAgY29uc3QgdG9rZW4gPSBhd2FpdCBnZXRBdXRoVG9rZW4oKTtcclxuICBjb25zdCBhdWRpdENvbnRleHQgPSBhd2FpdCBjcmVhdGVBdWRpdENvbnRleHQoKTtcclxuXHJcbiAgaWYgKCF0b2tlbikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZXJyb3JzOiB7XHJcbiAgICAgICAgX2Zvcm06IFsnQXV0aGVudGljYXRpb24gcmVxdWlyZWQnXVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZW5oYW5jZWRGZXRjaChgJHtCQUNLRU5EX1VSTH0vaGVhbHRoLXJlY29yZC8ke2lkfWAsIHtcclxuICAgICAgbWV0aG9kOiAnREVMRVRFJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICBjb25zdCBlcnJvciA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UgfHwgJ0ZhaWxlZCB0byBkZWxldGUgaGVhbHRoIHJlY29yZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEhJUEFBIEFVRElUIExPRyAtIE1hbmRhdG9yeSBmb3IgUEhJIGRlbGV0aW9uXHJcbiAgICBhd2FpdCBhdWRpdExvZyh7XHJcbiAgICAgIC4uLmF1ZGl0Q29udGV4dCxcclxuICAgICAgYWN0aW9uOiBBVURJVF9BQ1RJT05TLkRFTEVURV9IRUFMVEhfUkVDT1JELFxyXG4gICAgICByZXNvdXJjZTogJ0hlYWx0aFJlY29yZCcsXHJcbiAgICAgIHJlc291cmNlSWQ6IGlkLFxyXG4gICAgICBkZXRhaWxzOiBgRGVsZXRlZCBoZWFsdGggcmVjb3JkICR7aWR9YCxcclxuICAgICAgc3VjY2VzczogdHJ1ZVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gRW5oYW5jZWQgY2FjaGUgaW52YWxpZGF0aW9uXHJcbiAgICByZXZhbGlkYXRlVGFnKCdoZWFsdGgtcmVjb3JkcycsICdkZWZhdWx0Jyk7XHJcbiAgICByZXZhbGlkYXRlVGFnKGBoZWFsdGgtcmVjb3JkLSR7aWR9YCwgJ2RlZmF1bHQnKTtcclxuICAgIHJldmFsaWRhdGVUYWcoJ3BoaS1kYXRhJywgJ2RlZmF1bHQnKTtcclxuICAgIHJldmFsaWRhdGVQYXRoKCcvaGVhbHRoLXJlY29yZHMnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICBtZXNzYWdlOiAnSGVhbHRoIHJlY29yZCBkZWxldGVkIHN1Y2Nlc3NmdWxseSdcclxuICAgIH07XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIC8vIEhJUEFBIEFVRElUIExPRyAtIExvZyBmYWlsZWQgZGVsZXRlIGF0dGVtcHRcclxuICAgIGF3YWl0IGF1ZGl0TG9nKHtcclxuICAgICAgLi4uYXVkaXRDb250ZXh0LFxyXG4gICAgICBhY3Rpb246IEFVRElUX0FDVElPTlMuREVMRVRFX0hFQUxUSF9SRUNPUkQsXHJcbiAgICAgIHJlc291cmNlOiAnSGVhbHRoUmVjb3JkJyxcclxuICAgICAgcmVzb3VyY2VJZDogaWQsXHJcbiAgICAgIGRldGFpbHM6IGBGYWlsZWQgdG8gZGVsZXRlIGhlYWx0aCByZWNvcmQgJHtpZH1gLFxyXG4gICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgZXJyb3JNZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdVbmtub3duIGVycm9yJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZXJyb3JzOiB7XHJcbiAgICAgICAgX2Zvcm06IFtlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdGYWlsZWQgdG8gZGVsZXRlIGhlYWx0aCByZWNvcmQnXVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6InNUQXlMc0IifQ==
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HealthRecordsContent",
    ()=>HealthRecordsContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pill$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pill$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pill.js [app-client] (ecmascript) <export default as Pill>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/stethoscope.js [app-client] (ecmascript) <export default as Stethoscope>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ruler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ruler$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ruler.js [app-client] (ecmascript) <export default as Ruler>");
// Import server actions
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$health$2d$records$2e$actions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/health-records.actions.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$b480f4__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/data:b480f4 [app-client] (ecmascript) <text/javascript>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function HealthRecordsContent({ searchParams }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [records, setRecords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [totalCount, setTotalCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '20');
    // Handler functions
    const handleExport = ()=>{
        // TODO: Implement export functionality
        console.log('Export health records');
        alert('Export functionality coming soon');
    };
    const handleNewRecord = ()=>{
        // Navigate to new record creation page
        router.push('/health-records/new');
    };
    const handleView = (recordId)=>{
        // Navigate to view record page
        router.push(`/health-records/${recordId}`);
    };
    const handleEdit = (recordId_0)=>{
        // Navigate to edit record page
        router.push(`/health-records/${recordId_0}/edit`);
    };
    const handlePageChange = (newPage)=>{
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`/health-records?${params.toString()}`);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HealthRecordsContent.useEffect": ()=>{
            const fetchHealthRecords = {
                "HealthRecordsContent.useEffect.fetchHealthRecords": async ()=>{
                    try {
                        setIsLoading(true);
                        // Use server action to fetch health records
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$data$3a$b480f4__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getHealthRecordsAction"])(searchParams.studentId, searchParams.type);
                        if (result.success && result.data) {
                            // Transform server data to match our interface
                            const transformedRecords = result.data.map({
                                "HealthRecordsContent.useEffect.fetchHealthRecords.transformedRecords": (record)=>({
                                        ...record,
                                        // Set default values for optional fields
                                        status: 'ACTIVE',
                                        priority: record.isConfidential ? 'HIGH' : 'MEDIUM',
                                        studentName: record.student?.firstName && record.student?.lastName ? `${record.student.firstName} ${record.student.lastName}` : 'Unknown Student',
                                        recordedBy: record.provider || 'System',
                                        requiresFollowUp: record.followUpRequired
                                    })
                            }["HealthRecordsContent.useEffect.fetchHealthRecords.transformedRecords"]);
                            // Apply client-side filters for search params not handled by server
                            let filteredRecords = transformedRecords;
                            if (searchParams.search) {
                                const searchTerm = searchParams.search.toLowerCase();
                                filteredRecords = filteredRecords.filter({
                                    "HealthRecordsContent.useEffect.fetchHealthRecords": (record_0)=>record_0.title.toLowerCase().includes(searchTerm) || record_0.description.toLowerCase().includes(searchTerm) || (record_0.studentName || '').toLowerCase().includes(searchTerm) || (record_0.recordedBy || '').toLowerCase().includes(searchTerm)
                                }["HealthRecordsContent.useEffect.fetchHealthRecords"]);
                            }
                            setRecords(filteredRecords);
                            setTotalCount(filteredRecords.length);
                        } else {
                            console.error('Failed to fetch health records:', result.error);
                            setRecords([]);
                            setTotalCount(0);
                        }
                    } catch (error) {
                        console.error('Error fetching health records:', error);
                        setRecords([]);
                        setTotalCount(0);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["HealthRecordsContent.useEffect.fetchHealthRecords"];
            fetchHealthRecords();
        }
    }["HealthRecordsContent.useEffect"], [
        searchParams
    ]);
    const getStatusColor = (status)=>{
        switch(status){
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'INACTIVE':
                return 'bg-gray-100 text-gray-800';
            case 'PENDING_REVIEW':
                return 'bg-yellow-100 text-yellow-800';
            case 'ARCHIVED':
                return 'bg-gray-100 text-gray-600';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getPriorityColor = (priority)=>{
        switch(priority){
            case 'LOW':
                return 'bg-green-100 text-green-800';
            case 'MEDIUM':
                return 'bg-yellow-100 text-yellow-800';
            case 'HIGH':
                return 'bg-orange-100 text-orange-800';
            case 'CRITICAL':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getTypeIcon = (type)=>{
        switch(type){
            case 'MEDICAL_HISTORY':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                    lineNumber: 175,
                    columnNumber: 16
                }, this);
            case 'PHYSICAL_EXAM':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__["Stethoscope"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                    lineNumber: 177,
                    columnNumber: 16
                }, this);
            case 'IMMUNIZATION':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                    lineNumber: 179,
                    columnNumber: 16
                }, this);
            case 'ALLERGY':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                    lineNumber: 181,
                    columnNumber: 16
                }, this);
            case 'MEDICATION':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pill$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pill$3e$__["Pill"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                    lineNumber: 183,
                    columnNumber: 16
                }, this);
            case 'VITAL_SIGNS':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                    lineNumber: 185,
                    columnNumber: 16
                }, this);
            case 'GROWTH_CHART':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ruler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ruler$3e$__["Ruler"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                    lineNumber: 187,
                    columnNumber: 16
                }, this);
            case 'SCREENING':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                    lineNumber: 189,
                    columnNumber: 16
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                    lineNumber: 191,
                    columnNumber: 16
                }, this);
        }
    };
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-8 w-48 mb-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 199,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-4 w-32"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 200,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                            lineNumber: 198,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-10 w-32"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 203,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-10 w-28"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 204,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                            lineNumber: 202,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                    lineNumber: 197,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                    children: Array.from({
                        length: 4
                    }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            className: "p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-6 w-3/4 mb-3"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 213,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-8 w-16 mb-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 214,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-4 w-20"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 215,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, i, true, {
                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                            lineNumber: 212,
                            columnNumber: 22
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                    lineNumber: 209,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: Array.from({
                        length: 5
                    }, (__0, i_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            className: "p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-6 w-3/4 mb-3"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 224,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-4 w-full mb-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 225,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-4 w-2/3 mb-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 226,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2 mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                            className: "h-6 w-20"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                            lineNumber: 228,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                            className: "h-6 w-24"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                            lineNumber: 229,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                            className: "h-6 w-16"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                            lineNumber: 230,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 227,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                            className: "h-4 w-32"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                            lineNumber: 233,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                    className: "h-8 w-20"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                    lineNumber: 235,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                    className: "h-8 w-20"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                            lineNumber: 234,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 232,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, i_0, true, {
                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                            lineNumber: 223,
                            columnNumber: 26
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                    lineNumber: 220,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
            lineNumber: 195,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-gray-900",
                                children: "Health Records"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                lineNumber: 247,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600",
                                children: [
                                    "Showing ",
                                    records.length,
                                    " of ",
                                    totalCount,
                                    " health records"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                lineNumber: 248,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                        lineNumber: 246,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                onClick: handleExport,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                        className: "h-4 w-4 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                        lineNumber: 254,
                                        columnNumber: 13
                                    }, this),
                                    "Export"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                lineNumber: 253,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleNewRecord,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "h-4 w-4 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                        lineNumber: 258,
                                        columnNumber: 13
                                    }, this),
                                    "New Record"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                lineNumber: 257,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                        lineNumber: 252,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                lineNumber: 245,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        className: "p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-medium text-gray-600",
                                            children: "Active Records"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                            lineNumber: 269,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-2xl font-bold text-green-600",
                                            children: records.filter((r)=>r.status === 'ACTIVE').length
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                            lineNumber: 270,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 268,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                    className: "h-8 w-8 text-green-600"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 274,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                            lineNumber: 267,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        className: "p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-medium text-gray-600",
                                            children: "Pending Review"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                            lineNumber: 281,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-2xl font-bold text-yellow-600",
                                            children: records.filter((r_0)=>r_0.status === 'PENDING_REVIEW').length
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                            lineNumber: 282,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 280,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                    className: "h-8 w-8 text-yellow-600"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 286,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                            lineNumber: 279,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        className: "p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-medium text-gray-600",
                                            children: "Critical Priority"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                            lineNumber: 293,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-2xl font-bold text-red-600",
                                            children: records.filter((r_1)=>r_1.priority === 'CRITICAL').length
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                            lineNumber: 294,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 292,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                    className: "h-8 w-8 text-red-600"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 298,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                            lineNumber: 291,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                        lineNumber: 290,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        className: "p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-medium text-gray-600",
                                            children: "Follow-ups Due"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                            lineNumber: 305,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-2xl font-bold text-orange-600",
                                            children: records.filter((r_2)=>r_2.requiresFollowUp).length
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                            lineNumber: 306,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 304,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                    className: "h-8 w-8 text-orange-600"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 310,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                            lineNumber: 303,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                        lineNumber: 302,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                lineNumber: 265,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: records.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: "p-12 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                            className: "h-12 w-12 text-gray-400 mx-auto mb-4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                            lineNumber: 318,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-medium text-gray-900 mb-2",
                            children: "No health records found"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                            lineNumber: 319,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 mb-4",
                            children: "No health records match your current filters."
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                            lineNumber: 322,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: handleNewRecord,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "h-4 w-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                    lineNumber: 326,
                                    columnNumber: 15
                                }, this),
                                "Create First Record"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                            lineNumber: 325,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                    lineNumber: 317,
                    columnNumber: 33
                }, this) : records.map((record_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        className: "p-6 hover:shadow-md transition-shadow",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-2 bg-gray-100 rounded-lg",
                                                children: getTypeIcon(record_1.recordType)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                lineNumber: 332,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 mb-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-lg font-semibold text-gray-900",
                                                                children: record_1.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                                lineNumber: 337,
                                                                columnNumber: 23
                                                            }, this),
                                                            record_1.isConfidential && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                variant: "danger",
                                                                children: "Confidential"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                                lineNumber: 340,
                                                                columnNumber: 51
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                        lineNumber: 336,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-600 mb-2",
                                                        children: record_1.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                        lineNumber: 344,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-4 text-sm text-gray-500",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                                        className: "h-3 w-3"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                                        lineNumber: 349,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    record_1.studentName
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                                lineNumber: 348,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__["Stethoscope"], {
                                                                        className: "h-3 w-3"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                                        lineNumber: 353,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    record_1.recordedBy
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                                lineNumber: 352,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                        className: "h-3 w-3"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                                        lineNumber: 357,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    new Date(record_1.recordDate).toLocaleDateString()
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                                lineNumber: 356,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                        lineNumber: 347,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                lineNumber: 335,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                        lineNumber: 331,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                className: getPriorityColor(record_1.priority),
                                                children: record_1.priority || 'MEDIUM'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                lineNumber: 364,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                className: getStatusColor(record_1.status),
                                                children: record_1.status?.replace('_', ' ') || 'ACTIVE'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                lineNumber: 367,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                        lineNumber: 363,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                lineNumber: 330,
                                columnNumber: 15
                            }, this),
                            record_1.vitalSigns && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-50 rounded-lg p-4 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-medium text-gray-900 mb-2 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                lineNumber: 376,
                                                columnNumber: 21
                                            }, this),
                                            "Vital Signs"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                        lineNumber: 375,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm",
                                        children: [
                                            record_1.vitalSigns.temperature && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-600",
                                                        children: "Temperature:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                        lineNumber: 381,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium ml-1",
                                                        children: [
                                                            record_1.vitalSigns.temperature,
                                                            "°F"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                        lineNumber: 382,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                lineNumber: 380,
                                                columnNumber: 57
                                            }, this),
                                            record_1.vitalSigns.bloodPressure && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-600",
                                                        children: "BP:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                        lineNumber: 385,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium ml-1",
                                                        children: record_1.vitalSigns.bloodPressure
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                        lineNumber: 386,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                lineNumber: 384,
                                                columnNumber: 59
                                            }, this),
                                            record_1.vitalSigns.heartRate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-600",
                                                        children: "Heart Rate:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                        lineNumber: 389,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium ml-1",
                                                        children: [
                                                            record_1.vitalSigns.heartRate,
                                                            " bpm"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                        lineNumber: 390,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                lineNumber: 388,
                                                columnNumber: 55
                                            }, this),
                                            record_1.vitalSigns.weight && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-600",
                                                        children: "Weight:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                        lineNumber: 393,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium ml-1",
                                                        children: [
                                                            record_1.vitalSigns.weight,
                                                            " lbs"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                        lineNumber: 394,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                lineNumber: 392,
                                                columnNumber: 52
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                        lineNumber: 379,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                lineNumber: 374,
                                columnNumber: 39
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            record_1.requiresFollowUp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "warning",
                                                children: "Follow-up Required"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                lineNumber: 401,
                                                columnNumber: 49
                                            }, this),
                                            record_1.expirationDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "info",
                                                children: [
                                                    "Expires: ",
                                                    new Date(record_1.expirationDate).toLocaleDateString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                lineNumber: 404,
                                                columnNumber: 47
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                        lineNumber: 400,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "sm",
                                                onClick: ()=>handleView(record_1.id),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                        className: "h-4 w-4 mr-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                        lineNumber: 410,
                                                        columnNumber: 21
                                                    }, this),
                                                    "View"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                lineNumber: 409,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "sm",
                                                onClick: ()=>handleEdit(record_1.id),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                        className: "h-4 w-4 mr-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                        lineNumber: 414,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Edit"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                                lineNumber: 413,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                        lineNumber: 408,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                lineNumber: 399,
                                columnNumber: 15
                            }, this)
                        ]
                    }, record_1.id, true, {
                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                        lineNumber: 329,
                        columnNumber: 45
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                lineNumber: 316,
                columnNumber: 7
            }, this),
            totalCount > limit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600",
                        children: [
                            "Showing ",
                            (page - 1) * limit + 1,
                            " to ",
                            Math.min(page * limit, totalCount),
                            " of ",
                            totalCount,
                            " records"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                        lineNumber: 424,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                disabled: page === 1,
                                onClick: ()=>handlePageChange(page - 1),
                                children: "Previous"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                lineNumber: 428,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                disabled: page * limit >= totalCount,
                                onClick: ()=>handlePageChange(page + 1),
                                children: "Next"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                                lineNumber: 431,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                        lineNumber: 427,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
                lineNumber: 423,
                columnNumber: 30
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsContent.tsx",
        lineNumber: 243,
        columnNumber: 10
    }, this);
}
_s(HealthRecordsContent, "FgN8LdKeugMJae2cqKcnoOfRgVs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = HealthRecordsContent;
var _c;
__turbopack_context__.k.register(_c, "HealthRecordsContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input,
    "SearchInput",
    ()=>SearchInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, type, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/input.tsx",
        lineNumber: 10,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c = Input;
Input.displayName = "Input";
// SearchInput component - a specialized Input with search functionality
const SearchInput = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c1 = ({ className, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
        type: "search",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pl-8", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/input.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
_c2 = SearchInput;
SearchInput.displayName = "SearchInput";
;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Input");
__turbopack_context__.k.register(_c1, "SearchInput$React.forwardRef");
__turbopack_context__.k.register(_c2, "SearchInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectContent",
    ()=>SelectContent,
    "SelectGroup",
    ()=>SelectGroup,
    "SelectItem",
    ()=>SelectItem,
    "SelectLabel",
    ()=>SelectLabel,
    "SelectScrollDownButton",
    ()=>SelectScrollDownButton,
    "SelectScrollUpButton",
    ()=>SelectScrollUpButton,
    "SelectSeparator",
    ()=>SelectSeparator,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-select/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const Select = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const SelectGroup = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"];
const SelectValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Value"];
const SelectTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                    className: "h-4 w-4 opacity-50"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 29,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 28,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 19,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = SelectTrigger;
SelectTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const SelectScrollUpButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/select.tsx",
            lineNumber: 47,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 39,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c2 = SelectScrollUpButton;
SelectScrollUpButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"].displayName;
const SelectScrollDownButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/select.tsx",
            lineNumber: 64,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 56,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = SelectScrollDownButton;
SelectScrollDownButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"].displayName;
const SelectContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, children, position = "popper", ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
            position: position,
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollUpButton, {}, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 86,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 87,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollDownButton, {}, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 96,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/select.tsx",
            lineNumber: 75,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 74,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = SelectContent;
SelectContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const SelectLabel = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2 py-1.5 text-sm font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 106,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = SelectLabel;
SelectLabel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"].displayName;
const SelectItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/select.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/select.tsx",
                    lineNumber: 127,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 126,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemText"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 131,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 118,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = SelectItem;
SelectItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"].displayName;
const SelectSeparator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-mx-1 my-1 h-px bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 140,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = SelectSeparator;
SelectSeparator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "SelectTrigger$React.forwardRef");
__turbopack_context__.k.register(_c1, "SelectTrigger");
__turbopack_context__.k.register(_c2, "SelectScrollUpButton");
__turbopack_context__.k.register(_c3, "SelectScrollDownButton");
__turbopack_context__.k.register(_c4, "SelectContent$React.forwardRef");
__turbopack_context__.k.register(_c5, "SelectContent");
__turbopack_context__.k.register(_c6, "SelectLabel$React.forwardRef");
__turbopack_context__.k.register(_c7, "SelectLabel");
__turbopack_context__.k.register(_c8, "SelectItem$React.forwardRef");
__turbopack_context__.k.register(_c9, "SelectItem");
__turbopack_context__.k.register(_c10, "SelectSeparator$React.forwardRef");
__turbopack_context__.k.register(_c11, "SelectSeparator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HealthRecordsFilters",
    ()=>HealthRecordsFilters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/funnel.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/stethoscope.js [app-client] (ecmascript) <export default as Stethoscope>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pill$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pill$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pill.js [app-client] (ecmascript) <export default as Pill>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ruler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ruler$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ruler.js [app-client] (ecmascript) <export default as Ruler>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
;
var _s = __turbopack_context__.k.signature();
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
function HealthRecordsFilters(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(146);
    if ($[0] !== "c743bbbd173b85e23b0de8400c7ab1f44c360bc6566a3b1212b2087607200253") {
        for(let $i = 0; $i < 146; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c743bbbd173b85e23b0de8400c7ab1f44c360bc6566a3b1212b2087607200253";
    }
    const { totalCount } = t0;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    let t1;
    if ($[1] !== searchParams) {
        t1 = searchParams.get("search") || "";
        $[1] = searchParams;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    let t2;
    if ($[3] !== searchParams) {
        t2 = searchParams.get("type") || "";
        $[3] = searchParams;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    const [typeFilter, setTypeFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t2);
    let t3;
    if ($[5] !== searchParams) {
        t3 = searchParams.get("status") || "";
        $[5] = searchParams;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t3);
    let t4;
    if ($[7] !== searchParams) {
        t4 = searchParams.get("priority") || "";
        $[7] = searchParams;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    const [priorityFilter, setPriorityFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t4);
    let t5;
    if ($[9] !== searchParams) {
        t5 = searchParams.get("dateFrom") || "";
        $[9] = searchParams;
        $[10] = t5;
    } else {
        t5 = $[10];
    }
    const [dateFromFilter, setDateFromFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t5);
    let t6;
    if ($[11] !== searchParams) {
        t6 = searchParams.get("dateTo") || "";
        $[11] = searchParams;
        $[12] = t6;
    } else {
        t6 = $[12];
    }
    const [dateToFilter, setDateToFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t6);
    let t7;
    if ($[13] !== searchParams) {
        t7 = searchParams.get("recordedBy") || "";
        $[13] = searchParams;
        $[14] = t7;
    } else {
        t7 = $[14];
    }
    const [recordedByFilter, setRecordedByFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t7);
    let t8;
    if ($[15] !== searchParams) {
        t8 = searchParams.get("studentId") || "";
        $[15] = searchParams;
        $[16] = t8;
    } else {
        t8 = $[16];
    }
    const [studentFilter, setStudentFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t8);
    let t9;
    if ($[17] !== dateFromFilter || $[18] !== dateToFilter || $[19] !== priorityFilter || $[20] !== recordedByFilter || $[21] !== router || $[22] !== searchTerm || $[23] !== statusFilter || $[24] !== studentFilter || $[25] !== typeFilter) {
        t9 = ({
            "HealthRecordsFilters[updateFilters]": ()=>{
                const params = new URLSearchParams();
                if (searchTerm) {
                    params.set("search", searchTerm);
                }
                if (typeFilter && typeFilter !== "all-types") {
                    params.set("type", typeFilter);
                }
                if (statusFilter && statusFilter !== "all-statuses") {
                    params.set("status", statusFilter);
                }
                if (priorityFilter && priorityFilter !== "all-priorities") {
                    params.set("priority", priorityFilter);
                }
                if (dateFromFilter) {
                    params.set("dateFrom", dateFromFilter);
                }
                if (dateToFilter) {
                    params.set("dateTo", dateToFilter);
                }
                if (recordedByFilter) {
                    params.set("recordedBy", recordedByFilter);
                }
                if (studentFilter) {
                    params.set("studentId", studentFilter);
                }
                router.push(`/health-records?${params.toString()}`);
            }
        })["HealthRecordsFilters[updateFilters]"];
        $[17] = dateFromFilter;
        $[18] = dateToFilter;
        $[19] = priorityFilter;
        $[20] = recordedByFilter;
        $[21] = router;
        $[22] = searchTerm;
        $[23] = statusFilter;
        $[24] = studentFilter;
        $[25] = typeFilter;
        $[26] = t9;
    } else {
        t9 = $[26];
    }
    const updateFilters = t9;
    let t10;
    if ($[27] !== router) {
        t10 = ({
            "HealthRecordsFilters[clearAllFilters]": ()=>{
                setSearchTerm("");
                setTypeFilter("all-types");
                setStatusFilter("all-statuses");
                setPriorityFilter("all-priorities");
                setDateFromFilter("");
                setDateToFilter("");
                setRecordedByFilter("");
                setStudentFilter("");
                router.push("/health-records");
            }
        })["HealthRecordsFilters[clearAllFilters]"];
        $[27] = router;
        $[28] = t10;
    } else {
        t10 = $[28];
    }
    const clearAllFilters = t10;
    const hasActiveFilters = searchTerm || typeFilter && typeFilter !== "all-types" || statusFilter && statusFilter !== "all-statuses" || priorityFilter && priorityFilter !== "all-priorities" || dateFromFilter || dateToFilter || recordedByFilter || studentFilter;
    const t11 = typeFilter && typeFilter !== "all-types" ? typeFilter : null;
    const t12 = statusFilter && statusFilter !== "all-statuses" ? statusFilter : null;
    const t13 = priorityFilter && priorityFilter !== "all-priorities" ? priorityFilter : null;
    let t14;
    if ($[29] !== dateFromFilter || $[30] !== dateToFilter || $[31] !== recordedByFilter || $[32] !== searchTerm || $[33] !== studentFilter || $[34] !== t11 || $[35] !== t12 || $[36] !== t13) {
        t14 = [
            searchTerm,
            t11,
            t12,
            t13,
            dateFromFilter,
            dateToFilter,
            recordedByFilter,
            studentFilter
        ].filter(Boolean);
        $[29] = dateFromFilter;
        $[30] = dateToFilter;
        $[31] = recordedByFilter;
        $[32] = searchTerm;
        $[33] = studentFilter;
        $[34] = t11;
        $[35] = t12;
        $[36] = t13;
        $[37] = t14;
    } else {
        t14 = $[37];
    }
    const activeFilterCount = t14.length;
    let t15;
    if ($[38] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = [
            {
                value: "MEDICAL_HISTORY",
                label: "Medical History",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
                color: "text-blue-600"
            },
            {
                value: "PHYSICAL_EXAM",
                label: "Physical Exam",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__["Stethoscope"],
                color: "text-green-600"
            },
            {
                value: "IMMUNIZATION",
                label: "Immunization",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
                color: "text-purple-600"
            },
            {
                value: "ALLERGY",
                label: "Allergy",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
                color: "text-red-600"
            },
            {
                value: "MEDICATION",
                label: "Medication",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pill$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pill$3e$__["Pill"],
                color: "text-orange-600"
            },
            {
                value: "VITAL_SIGNS",
                label: "Vital Signs",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
                color: "text-cyan-600"
            },
            {
                value: "GROWTH_CHART",
                label: "Growth Chart",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ruler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ruler$3e$__["Ruler"],
                color: "text-indigo-600"
            },
            {
                value: "SCREENING",
                label: "Screening",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"],
                color: "text-teal-600"
            }
        ];
        $[38] = t15;
    } else {
        t15 = $[38];
    }
    const recordTypes = t15;
    let t16;
    if ($[39] === Symbol.for("react.memo_cache_sentinel")) {
        t16 = [
            {
                value: "ACTIVE",
                label: "Active",
                color: "bg-green-100 text-green-800"
            },
            {
                value: "INACTIVE",
                label: "Inactive",
                color: "bg-gray-100 text-gray-800"
            },
            {
                value: "PENDING_REVIEW",
                label: "Pending Review",
                color: "bg-yellow-100 text-yellow-800"
            },
            {
                value: "ARCHIVED",
                label: "Archived",
                color: "bg-gray-100 text-gray-600"
            }
        ];
        $[39] = t16;
    } else {
        t16 = $[39];
    }
    const recordStatuses = t16;
    let t17;
    if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
        t17 = [
            {
                value: "LOW",
                label: "Low",
                color: "bg-green-100 text-green-800"
            },
            {
                value: "MEDIUM",
                label: "Medium",
                color: "bg-yellow-100 text-yellow-800"
            },
            {
                value: "HIGH",
                label: "High",
                color: "bg-orange-100 text-orange-800"
            },
            {
                value: "CRITICAL",
                label: "Critical",
                color: "bg-red-100 text-red-800"
            }
        ];
        $[40] = t17;
    } else {
        t17 = $[40];
    }
    const priorityLevels = t17;
    let t18;
    let t19;
    if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
            className: "h-5 w-5 text-gray-600"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 286,
            columnNumber: 11
        }, this);
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-lg font-semibold text-gray-900",
            children: "Filter Health Records"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 287,
            columnNumber: 11
        }, this);
        $[41] = t18;
        $[42] = t19;
    } else {
        t18 = $[41];
        t19 = $[42];
    }
    let t20;
    if ($[43] !== activeFilterCount) {
        t20 = activeFilterCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
            variant: "info",
            children: [
                activeFilterCount,
                " filter",
                activeFilterCount !== 1 ? "s" : "",
                " active"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 296,
            columnNumber: 36
        }, this);
        $[43] = activeFilterCount;
        $[44] = t20;
    } else {
        t20 = $[44];
    }
    let t21;
    if ($[45] !== t20) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-3",
            children: [
                t18,
                t19,
                t20
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 304,
            columnNumber: 11
        }, this);
        $[45] = t20;
        $[46] = t21;
    } else {
        t21 = $[46];
    }
    let t22;
    if ($[47] !== clearAllFilters || $[48] !== hasActiveFilters) {
        t22 = hasActiveFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "ghost",
            size: "sm",
            onClick: clearAllFilters,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                    className: "h-4 w-4 mr-1"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                    lineNumber: 312,
                    columnNumber: 91
                }, this),
                "Clear All"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 312,
            columnNumber: 31
        }, this);
        $[47] = clearAllFilters;
        $[48] = hasActiveFilters;
        $[49] = t22;
    } else {
        t22 = $[49];
    }
    let t23;
    if ($[50] === Symbol.for("react.memo_cache_sentinel")) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
            className: "h-4 w-4 mr-1"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 321,
            columnNumber: 11
        }, this);
        $[50] = t23;
    } else {
        t23 = $[50];
    }
    let t24;
    if ($[51] !== updateFilters) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "ghost",
            size: "sm",
            onClick: updateFilters,
            children: [
                t23,
                "Refresh"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 328,
            columnNumber: 11
        }, this);
        $[51] = updateFilters;
        $[52] = t24;
    } else {
        t24 = $[52];
    }
    let t25;
    if ($[53] !== t22 || $[54] !== t24) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-2",
            children: [
                t22,
                t24
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 336,
            columnNumber: 11
        }, this);
        $[53] = t22;
        $[54] = t24;
        $[55] = t25;
    } else {
        t25 = $[55];
    }
    let t26;
    if ($[56] !== t21 || $[57] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between",
            children: [
                t21,
                t25
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 345,
            columnNumber: 11
        }, this);
        $[56] = t21;
        $[57] = t25;
        $[58] = t26;
    } else {
        t26 = $[58];
    }
    let t27;
    if ($[59] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium",
            children: "Search Health Records"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 354,
            columnNumber: 11
        }, this);
        $[59] = t27;
    } else {
        t27 = $[59];
    }
    let t28;
    if ($[60] === Symbol.for("react.memo_cache_sentinel")) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
            className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 361,
            columnNumber: 11
        }, this);
        $[60] = t28;
    } else {
        t28 = $[60];
    }
    let t29;
    if ($[61] === Symbol.for("react.memo_cache_sentinel")) {
        t29 = ({
            "HealthRecordsFilters[<Input>.onChange]": (e)=>setSearchTerm(e.target.value)
        })["HealthRecordsFilters[<Input>.onChange]"];
        $[61] = t29;
    } else {
        t29 = $[61];
    }
    let t30;
    if ($[62] !== updateFilters) {
        t30 = ({
            "HealthRecordsFilters[<Input>.onKeyDown]": (e_0)=>e_0.key === "Enter" && updateFilters()
        })["HealthRecordsFilters[<Input>.onKeyDown]"];
        $[62] = updateFilters;
        $[63] = t30;
    } else {
        t30 = $[63];
    }
    let t31;
    if ($[64] !== searchTerm || $[65] !== t30) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                t27,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        t28,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            type: "text",
                            placeholder: "Search by title, description, student name, or recorded by...",
                            value: searchTerm,
                            onChange: t29,
                            onKeyDown: t30,
                            className: "pl-10"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                            lineNumber: 387,
                            columnNumber: 74
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                    lineNumber: 387,
                    columnNumber: 43
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 387,
            columnNumber: 11
        }, this);
        $[64] = searchTerm;
        $[65] = t30;
        $[66] = t31;
    } else {
        t31 = $[66];
    }
    let t32;
    if ($[67] === Symbol.for("react.memo_cache_sentinel")) {
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium",
            children: "Record Type"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 396,
            columnNumber: 11
        }, this);
        $[67] = t32;
    } else {
        t32 = $[67];
    }
    const t33 = typeFilter || "all-types";
    let t34;
    if ($[68] === Symbol.for("react.memo_cache_sentinel")) {
        t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
            "aria-label": "Filter by record type",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                placeholder: "All Types"
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                lineNumber: 404,
                columnNumber: 61
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 404,
            columnNumber: 11
        }, this);
        $[68] = t34;
    } else {
        t34 = $[68];
    }
    let t35;
    if ($[69] === Symbol.for("react.memo_cache_sentinel")) {
        t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                    value: "all-types",
                    children: "All Types"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                    lineNumber: 411,
                    columnNumber: 26
                }, this),
                recordTypes.map(_HealthRecordsFiltersRecordTypesMap)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 411,
            columnNumber: 11
        }, this);
        $[69] = t35;
    } else {
        t35 = $[69];
    }
    let t36;
    if ($[70] !== t33) {
        t36 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                t32,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                    value: t33,
                    onValueChange: setTypeFilter,
                    children: [
                        t34,
                        t35
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                    lineNumber: 418,
                    columnNumber: 43
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 418,
            columnNumber: 11
        }, this);
        $[70] = t33;
        $[71] = t36;
    } else {
        t36 = $[71];
    }
    let t37;
    if ($[72] === Symbol.for("react.memo_cache_sentinel")) {
        t37 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium",
            children: "Status"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 426,
            columnNumber: 11
        }, this);
        $[72] = t37;
    } else {
        t37 = $[72];
    }
    const t38 = statusFilter || "all-statuses";
    let t39;
    if ($[73] === Symbol.for("react.memo_cache_sentinel")) {
        t39 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
            "aria-label": "Filter by record status",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                placeholder: "All Statuses"
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                lineNumber: 434,
                columnNumber: 63
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 434,
            columnNumber: 11
        }, this);
        $[73] = t39;
    } else {
        t39 = $[73];
    }
    let t40;
    if ($[74] === Symbol.for("react.memo_cache_sentinel")) {
        t40 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                    value: "all-statuses",
                    children: "All Statuses"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                    lineNumber: 441,
                    columnNumber: 26
                }, this),
                recordStatuses.map(_HealthRecordsFiltersRecordStatusesMap)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 441,
            columnNumber: 11
        }, this);
        $[74] = t40;
    } else {
        t40 = $[74];
    }
    let t41;
    if ($[75] !== t38) {
        t41 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                t37,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                    value: t38,
                    onValueChange: setStatusFilter,
                    children: [
                        t39,
                        t40
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                    lineNumber: 448,
                    columnNumber: 43
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 448,
            columnNumber: 11
        }, this);
        $[75] = t38;
        $[76] = t41;
    } else {
        t41 = $[76];
    }
    let t42;
    if ($[77] === Symbol.for("react.memo_cache_sentinel")) {
        t42 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium",
            children: "Priority"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 456,
            columnNumber: 11
        }, this);
        $[77] = t42;
    } else {
        t42 = $[77];
    }
    const t43 = priorityFilter || "all-priorities";
    let t44;
    if ($[78] === Symbol.for("react.memo_cache_sentinel")) {
        t44 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
            "aria-label": "Filter by record priority",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                placeholder: "All Priorities"
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                lineNumber: 464,
                columnNumber: 65
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 464,
            columnNumber: 11
        }, this);
        $[78] = t44;
    } else {
        t44 = $[78];
    }
    let t45;
    if ($[79] === Symbol.for("react.memo_cache_sentinel")) {
        t45 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                    value: "all-priorities",
                    children: "All Priorities"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                    lineNumber: 471,
                    columnNumber: 26
                }, this),
                priorityLevels.map(_HealthRecordsFiltersPriorityLevelsMap)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 471,
            columnNumber: 11
        }, this);
        $[79] = t45;
    } else {
        t45 = $[79];
    }
    let t46;
    if ($[80] !== t43) {
        t46 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                t42,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                    value: t43,
                    onValueChange: setPriorityFilter,
                    children: [
                        t44,
                        t45
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                    lineNumber: 478,
                    columnNumber: 43
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 478,
            columnNumber: 11
        }, this);
        $[80] = t43;
        $[81] = t46;
    } else {
        t46 = $[81];
    }
    let t47;
    if ($[82] === Symbol.for("react.memo_cache_sentinel")) {
        t47 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium",
            children: "Recorded By"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 486,
            columnNumber: 11
        }, this);
        $[82] = t47;
    } else {
        t47 = $[82];
    }
    let t48;
    if ($[83] === Symbol.for("react.memo_cache_sentinel")) {
        t48 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
            className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 493,
            columnNumber: 11
        }, this);
        $[83] = t48;
    } else {
        t48 = $[83];
    }
    let t49;
    if ($[84] === Symbol.for("react.memo_cache_sentinel")) {
        t49 = ({
            "HealthRecordsFilters[<Input>.onChange]": (e_1)=>setRecordedByFilter(e_1.target.value)
        })["HealthRecordsFilters[<Input>.onChange]"];
        $[84] = t49;
    } else {
        t49 = $[84];
    }
    let t50;
    if ($[85] !== recordedByFilter) {
        t50 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                t47,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        t48,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            type: "text",
                            placeholder: "Healthcare provider...",
                            value: recordedByFilter,
                            onChange: t49,
                            className: "pl-10"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                            lineNumber: 509,
                            columnNumber: 74
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                    lineNumber: 509,
                    columnNumber: 43
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 509,
            columnNumber: 11
        }, this);
        $[85] = recordedByFilter;
        $[86] = t50;
    } else {
        t50 = $[86];
    }
    let t51;
    if ($[87] !== t36 || $[88] !== t41 || $[89] !== t46 || $[90] !== t50) {
        t51 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
            children: [
                t36,
                t41,
                t46,
                t50
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 517,
            columnNumber: 11
        }, this);
        $[87] = t36;
        $[88] = t41;
        $[89] = t46;
        $[90] = t50;
        $[91] = t51;
    } else {
        t51 = $[91];
    }
    let t52;
    if ($[92] === Symbol.for("react.memo_cache_sentinel")) {
        t52 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium",
            children: "Date From"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 528,
            columnNumber: 11
        }, this);
        $[92] = t52;
    } else {
        t52 = $[92];
    }
    let t53;
    if ($[93] === Symbol.for("react.memo_cache_sentinel")) {
        t53 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
            className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 535,
            columnNumber: 11
        }, this);
        $[93] = t53;
    } else {
        t53 = $[93];
    }
    let t54;
    if ($[94] === Symbol.for("react.memo_cache_sentinel")) {
        t54 = ({
            "HealthRecordsFilters[<Input>.onChange]": (e_2)=>setDateFromFilter(e_2.target.value)
        })["HealthRecordsFilters[<Input>.onChange]"];
        $[94] = t54;
    } else {
        t54 = $[94];
    }
    let t55;
    if ($[95] !== dateFromFilter) {
        t55 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                t52,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        t53,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            type: "date",
                            value: dateFromFilter,
                            onChange: t54,
                            className: "pl-10",
                            "aria-label": "Filter from date"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                            lineNumber: 551,
                            columnNumber: 74
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                    lineNumber: 551,
                    columnNumber: 43
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 551,
            columnNumber: 11
        }, this);
        $[95] = dateFromFilter;
        $[96] = t55;
    } else {
        t55 = $[96];
    }
    let t56;
    if ($[97] === Symbol.for("react.memo_cache_sentinel")) {
        t56 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium",
            children: "Date To"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 559,
            columnNumber: 11
        }, this);
        $[97] = t56;
    } else {
        t56 = $[97];
    }
    let t57;
    if ($[98] === Symbol.for("react.memo_cache_sentinel")) {
        t57 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
            className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 566,
            columnNumber: 11
        }, this);
        $[98] = t57;
    } else {
        t57 = $[98];
    }
    let t58;
    if ($[99] === Symbol.for("react.memo_cache_sentinel")) {
        t58 = ({
            "HealthRecordsFilters[<Input>.onChange]": (e_3)=>setDateToFilter(e_3.target.value)
        })["HealthRecordsFilters[<Input>.onChange]"];
        $[99] = t58;
    } else {
        t58 = $[99];
    }
    let t59;
    if ($[100] !== dateToFilter) {
        t59 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                t56,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        t57,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            type: "date",
                            value: dateToFilter,
                            onChange: t58,
                            className: "pl-10",
                            "aria-label": "Filter to date"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                            lineNumber: 582,
                            columnNumber: 74
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                    lineNumber: 582,
                    columnNumber: 43
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 582,
            columnNumber: 11
        }, this);
        $[100] = dateToFilter;
        $[101] = t59;
    } else {
        t59 = $[101];
    }
    let t60;
    if ($[102] !== t55 || $[103] !== t59) {
        t60 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
            children: [
                t55,
                t59
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 590,
            columnNumber: 11
        }, this);
        $[102] = t55;
        $[103] = t59;
        $[104] = t60;
    } else {
        t60 = $[104];
    }
    let t61;
    if ($[105] === Symbol.for("react.memo_cache_sentinel")) {
        t61 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium",
            children: "Student"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 599,
            columnNumber: 11
        }, this);
        $[105] = t61;
    } else {
        t61 = $[105];
    }
    let t62;
    if ($[106] === Symbol.for("react.memo_cache_sentinel")) {
        t62 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
            className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 606,
            columnNumber: 11
        }, this);
        $[106] = t62;
    } else {
        t62 = $[106];
    }
    let t63;
    if ($[107] === Symbol.for("react.memo_cache_sentinel")) {
        t63 = ({
            "HealthRecordsFilters[<Input>.onChange]": (e_4)=>setStudentFilter(e_4.target.value)
        })["HealthRecordsFilters[<Input>.onChange]"];
        $[107] = t63;
    } else {
        t63 = $[107];
    }
    let t64;
    if ($[108] !== studentFilter) {
        t64 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                t61,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        t62,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            type: "text",
                            placeholder: "Search by student name or ID...",
                            value: studentFilter,
                            onChange: t63,
                            className: "pl-10"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                            lineNumber: 622,
                            columnNumber: 74
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                    lineNumber: 622,
                    columnNumber: 43
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 622,
            columnNumber: 11
        }, this);
        $[108] = studentFilter;
        $[109] = t64;
    } else {
        t64 = $[109];
    }
    let t65;
    if ($[110] === Symbol.for("react.memo_cache_sentinel")) {
        t65 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
            className: "text-sm font-medium text-gray-700",
            children: "Quick Filters"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 630,
            columnNumber: 11
        }, this);
        $[110] = t65;
    } else {
        t65 = $[110];
    }
    let t66;
    if ($[111] === Symbol.for("react.memo_cache_sentinel")) {
        t66 = recordTypes.slice(0, 5);
        $[111] = t66;
    } else {
        t66 = $[111];
    }
    let t67;
    if ($[112] !== typeFilter || $[113] !== updateFilters) {
        t67 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap gap-2",
            children: t66.map({
                "HealthRecordsFilters[(anonymous)()]": (type_0)=>{
                    const Icon = type_0.icon;
                    const isActive = typeFilter === type_0.value;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "HealthRecordsFilters[(anonymous)() > <button>.onClick]": ()=>{
                                setTypeFilter(isActive ? "" : type_0.value);
                                if (!isActive) {
                                    updateFilters();
                                }
                            }
                        }["HealthRecordsFilters[(anonymous)() > <button>.onClick]"],
                        className: `inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${isActive ? "bg-blue-100 text-blue-800 border border-blue-300" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: `h-3 w-3 ${type_0.color}`
                            }, void 0, false, {
                                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                                lineNumber: 655,
                                columnNumber: 291
                            }, this),
                            type_0.label
                        ]
                    }, type_0.value, true, {
                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                        lineNumber: 648,
                        columnNumber: 18
                    }, this);
                }
            }["HealthRecordsFilters[(anonymous)()]"])
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 644,
            columnNumber: 11
        }, this);
        $[112] = typeFilter;
        $[113] = updateFilters;
        $[114] = t67;
    } else {
        t67 = $[114];
    }
    let t68;
    if ($[115] !== statusFilter || $[116] !== updateFilters) {
        t68 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap gap-2",
            children: recordStatuses.map({
                "HealthRecordsFilters[recordStatuses.map()]": (status_0)=>{
                    const isActive_0 = statusFilter === status_0.value;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "HealthRecordsFilters[recordStatuses.map() > <button>.onClick]": ()=>{
                                setStatusFilter(isActive_0 ? "" : status_0.value);
                                if (!isActive_0) {
                                    updateFilters();
                                }
                            }
                        }["HealthRecordsFilters[recordStatuses.map() > <button>.onClick]"],
                        className: `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${isActive_0 ? "bg-blue-100 text-blue-800 border border-blue-300" : status_0.color}`,
                        children: status_0.label
                    }, status_0.value, false, {
                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                        lineNumber: 669,
                        columnNumber: 18
                    }, this);
                }
            }["HealthRecordsFilters[recordStatuses.map()]"])
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 666,
            columnNumber: 11
        }, this);
        $[115] = statusFilter;
        $[116] = updateFilters;
        $[117] = t68;
    } else {
        t68 = $[117];
    }
    let t69;
    if ($[118] !== priorityFilter || $[119] !== updateFilters) {
        t69 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap gap-2",
            children: priorityLevels.map({
                "HealthRecordsFilters[priorityLevels.map()]": (priority_0)=>{
                    const isActive_1 = priorityFilter === priority_0.value;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "HealthRecordsFilters[priorityLevels.map() > <button>.onClick]": ()=>{
                                setPriorityFilter(isActive_1 ? "" : priority_0.value);
                                if (!isActive_1) {
                                    updateFilters();
                                }
                            }
                        }["HealthRecordsFilters[priorityLevels.map() > <button>.onClick]"],
                        className: `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${isActive_1 ? "bg-blue-100 text-blue-800 border border-blue-300" : priority_0.color}`,
                        children: priority_0.label
                    }, priority_0.value, false, {
                        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                        lineNumber: 690,
                        columnNumber: 18
                    }, this);
                }
            }["HealthRecordsFilters[priorityLevels.map()]"])
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 687,
            columnNumber: 11
        }, this);
        $[118] = priorityFilter;
        $[119] = updateFilters;
        $[120] = t69;
    } else {
        t69 = $[120];
    }
    let t70;
    if ($[121] !== t67 || $[122] !== t68 || $[123] !== t69) {
        t70 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-3",
            children: [
                t65,
                t67,
                t68,
                t69
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 708,
            columnNumber: 11
        }, this);
        $[121] = t67;
        $[122] = t68;
        $[123] = t69;
        $[124] = t70;
    } else {
        t70 = $[124];
    }
    const t71 = totalCount !== 1 ? "s" : "";
    let t72;
    if ($[125] !== t71 || $[126] !== totalCount) {
        t72 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-sm text-gray-600",
            children: [
                totalCount,
                " health record",
                t71,
                " found"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 719,
            columnNumber: 11
        }, this);
        $[125] = t71;
        $[126] = totalCount;
        $[127] = t72;
    } else {
        t72 = $[127];
    }
    let t73;
    if ($[128] !== clearAllFilters) {
        t73 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "outline",
            size: "sm",
            onClick: clearAllFilters,
            children: "Clear Filters"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 728,
            columnNumber: 11
        }, this);
        $[128] = clearAllFilters;
        $[129] = t73;
    } else {
        t73 = $[129];
    }
    let t74;
    if ($[130] !== updateFilters) {
        t74 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            size: "sm",
            onClick: updateFilters,
            children: "Apply Filters"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 736,
            columnNumber: 11
        }, this);
        $[130] = updateFilters;
        $[131] = t74;
    } else {
        t74 = $[131];
    }
    let t75;
    if ($[132] !== t73 || $[133] !== t74) {
        t75 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-2",
            children: [
                t73,
                t74
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 744,
            columnNumber: 11
        }, this);
        $[132] = t73;
        $[133] = t74;
        $[134] = t75;
    } else {
        t75 = $[134];
    }
    let t76;
    if ($[135] !== t72 || $[136] !== t75) {
        t76 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between pt-4 border-t border-gray-200",
            children: [
                t72,
                t75
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 753,
            columnNumber: 11
        }, this);
        $[135] = t72;
        $[136] = t75;
        $[137] = t76;
    } else {
        t76 = $[137];
    }
    let t77;
    if ($[138] !== t26 || $[139] !== t31 || $[140] !== t51 || $[141] !== t60 || $[142] !== t64 || $[143] !== t70 || $[144] !== t76) {
        t77 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: "p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    t26,
                    t31,
                    t51,
                    t60,
                    t64,
                    t70,
                    t76
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
                lineNumber: 762,
                columnNumber: 33
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
            lineNumber: 762,
            columnNumber: 11
        }, this);
        $[138] = t26;
        $[139] = t31;
        $[140] = t51;
        $[141] = t60;
        $[142] = t64;
        $[143] = t70;
        $[144] = t76;
        $[145] = t77;
    } else {
        t77 = $[145];
    }
    return t77;
}
_s(HealthRecordsFilters, "DQG8WJn79nmK3bf9x4MquEPf05Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = HealthRecordsFilters;
function _HealthRecordsFiltersPriorityLevelsMap(priority) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
        value: priority.value,
        children: priority.label
    }, priority.value, false, {
        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
        lineNumber: 777,
        columnNumber: 10
    }, this);
}
function _HealthRecordsFiltersRecordStatusesMap(status) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
        value: status.value,
        children: status.label
    }, status.value, false, {
        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
        lineNumber: 780,
        columnNumber: 10
    }, this);
}
function _HealthRecordsFiltersRecordTypesMap(type) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
        value: type.value,
        children: type.label
    }, type.value, false, {
        fileName: "[project]/src/app/(dashboard)/health-records/_components/HealthRecordsFilters.tsx",
        lineNumber: 783,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "HealthRecordsFilters");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_499e707d._.js.map