/**
 * LOC: EDU-PORTAL-001
 * File: /reuse/education/student-portal-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable education utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend student services
 *   - Portal management modules
 *   - Dashboard rendering services
 *   - Student engagement systems
 */
/**
 * File: /reuse/education/student-portal-kit.ts
 * Locator: WC-EDU-PORTAL-001
 * Purpose: Enterprise-grade Student Portal Management - dashboards, widgets, announcements, customization, navigation, accessibility
 *
 * Upstream: Independent utility module for student portal operations
 * Downstream: ../backend/education/*, portal controllers, dashboard services, widget managers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 40+ functions for student portal operations for modern SIS platforms
 *
 * LLM Context: Comprehensive student portal utilities for production-ready education applications.
 * Provides portal user management, dashboard customization, widget configuration, quick links,
 * announcements, navigation personalization, accessibility features, theme management,
 * notification preferences, portal analytics, and student engagement tracking.
 */
import { Sequelize, Transaction } from 'sequelize';
interface PortalUserData {
    userId: string;
    studentId: string;
    userName: string;
    email: string;
    theme?: 'light' | 'dark' | 'auto';
    language?: string;
    timezone?: string;
    accessibilitySettings?: Record<string, any>;
    lastLoginAt?: Date;
    loginCount?: number;
    preferences?: Record<string, any>;
}
interface DashboardData {
    userId: string;
    dashboardName: string;
    layout: 'grid' | 'list' | 'custom';
    columns?: number;
    isDefault?: boolean;
    configuration?: Record<string, any>;
    widgetIds?: string[];
    isActive?: boolean;
}
interface WidgetData {
    widgetType: string;
    widgetName: string;
    description?: string;
    category: 'academic' | 'financial' | 'social' | 'utilities' | 'custom';
    configuration?: Record<string, any>;
    defaultSize?: {
        width: number;
        height: number;
    };
    position?: {
        x: number;
        y: number;
    };
    isEnabled?: boolean;
    requiresAuth?: boolean;
    permissions?: string[];
}
interface DashboardWidgetData {
    dashboardId: string;
    widgetId: string;
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
    configuration?: Record<string, any>;
    isVisible?: boolean;
    sortOrder?: number;
}
interface AnnouncementData {
    title: string;
    content: string;
    category: 'academic' | 'administrative' | 'event' | 'emergency' | 'general';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    publishedAt: Date;
    expiresAt?: Date;
    targetAudience?: string[];
    authorId: string;
    attachments?: string[];
    isPublished?: boolean;
}
interface QuickLinkData {
    userId: string;
    linkTitle: string;
    linkUrl: string;
    icon?: string;
    category?: string;
    sortOrder?: number;
    isActive?: boolean;
    openInNewTab?: boolean;
}
interface NavigationItemData {
    label: string;
    url: string;
    icon?: string;
    parentId?: string | null;
    sortOrder: number;
    requiredRole?: string;
    isActive?: boolean;
    isVisible?: boolean;
}
interface AccessibilitySettingsData {
    userId: string;
    highContrast?: boolean;
    fontSize?: 'small' | 'medium' | 'large' | 'xlarge';
    screenReader?: boolean;
    keyboardNavigation?: boolean;
    reducedMotion?: boolean;
    colorBlindMode?: string;
    textToSpeech?: boolean;
}
/**
 * Sequelize model for Portal Users with authentication and preferences.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     PortalUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         studentId:
 *           type: string
 *         theme:
 *           type: string
 *           enum: [light, dark, auto]
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PortalUser model
 *
 * @example
 * ```typescript
 * const PortalUser = createPortalUserModel(sequelize);
 * const user = await PortalUser.create({
 *   userId: 'USR001',
 *   studentId: 'STU12345',
 *   userName: 'jsmith',
 *   email: 'john.smith@university.edu',
 *   theme: 'light'
 * });
 * ```
 */
export declare const createPortalUserModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        userId: string;
        studentId: string;
        userName: string;
        email: string;
        theme: string;
        language: string;
        timezone: string;
        accessibilitySettings: Record<string, any>;
        lastLoginAt: Date | null;
        loginCount: number;
        preferences: Record<string, any>;
        isActive: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Dashboards with customizable layouts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Dashboard model
 */
export declare const createDashboardModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        userId: string;
        dashboardName: string;
        layout: string;
        columns: number;
        isDefault: boolean;
        configuration: Record<string, any>;
        isActive: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Widgets with configuration and permissions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Widget model
 */
export declare const createWidgetModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        widgetType: string;
        widgetName: string;
        description: string;
        category: string;
        configuration: Record<string, any>;
        defaultSize: Record<string, number>;
        isEnabled: boolean;
        requiresAuth: boolean;
        permissions: string[];
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Announcements with targeting and scheduling.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Announcement model
 */
export declare const createAnnouncementModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        title: string;
        content: string;
        category: string;
        priority: string;
        publishedAt: Date;
        expiresAt: Date | null;
        targetAudience: string[];
        authorId: string;
        attachments: string[];
        isPublished: boolean;
        viewCount: number;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new portal user account with default preferences.
 *
 * @param {PortalUserData} userData - User data
 * @param {Model} PortalUser - PortalUser model
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<any>} Created portal user
 *
 * @example
 * ```typescript
 * const user = await createPortalUser({
 *   userId: 'USR001',
 *   studentId: 'STU12345',
 *   userName: 'jsmith',
 *   email: 'john.smith@university.edu'
 * }, PortalUser);
 * ```
 */
export declare const createPortalUser: (userData: PortalUserData, PortalUser: any, transaction?: Transaction) => Promise<any>;
/**
 * Updates portal user preferences and settings.
 *
 * @param {string} userId - User identifier
 * @param {Partial<PortalUserData>} updates - Preference updates
 * @param {Model} PortalUser - PortalUser model
 * @returns {Promise<any>} Updated user
 *
 * @example
 * ```typescript
 * await updatePortalUserPreferences('USR001', { theme: 'dark', language: 'es' }, PortalUser);
 * ```
 */
export declare const updatePortalUserPreferences: (userId: string, updates: Partial<PortalUserData>, PortalUser: any) => Promise<any>;
/**
 * Records user login and updates session statistics.
 *
 * @param {string} userId - User identifier
 * @param {Model} PortalUser - PortalUser model
 * @returns {Promise<any>} Updated user
 *
 * @example
 * ```typescript
 * await recordUserLogin('USR001', PortalUser);
 * ```
 */
export declare const recordUserLogin: (userId: string, PortalUser: any) => Promise<any>;
/**
 * Retrieves user portal configuration and preferences.
 *
 * @param {string} userId - User identifier
 * @param {Model} PortalUser - PortalUser model
 * @returns {Promise<any>} User configuration
 *
 * @example
 * ```typescript
 * const config = await getUserPortalConfiguration('USR001', PortalUser);
 * ```
 */
export declare const getUserPortalConfiguration: (userId: string, PortalUser: any) => Promise<any>;
/**
 * Validates user portal access and permissions.
 *
 * @param {string} userId - User identifier
 * @param {string[]} requiredPermissions - Required permissions
 * @param {Model} PortalUser - PortalUser model
 * @returns {Promise<{ hasAccess: boolean; missingPermissions: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const access = await validatePortalAccess('USR001', ['view_grades', 'manage_profile'], PortalUser);
 * ```
 */
export declare const validatePortalAccess: (userId: string, requiredPermissions: string[], PortalUser: any) => Promise<{
    hasAccess: boolean;
    missingPermissions: string[];
}>;
/**
 * Creates a new dashboard for a user.
 *
 * @param {DashboardData} dashboardData - Dashboard configuration
 * @param {Model} Dashboard - Dashboard model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created dashboard
 *
 * @example
 * ```typescript
 * const dashboard = await createDashboard({
 *   userId: 'USR001',
 *   dashboardName: 'My Academic Dashboard',
 *   layout: 'grid',
 *   columns: 3
 * }, Dashboard);
 * ```
 */
export declare const createDashboard: (dashboardData: DashboardData, Dashboard: any, transaction?: Transaction) => Promise<any>;
/**
 * Updates dashboard layout and configuration.
 *
 * @param {string} dashboardId - Dashboard ID
 * @param {Partial<DashboardData>} updates - Configuration updates
 * @param {Model} Dashboard - Dashboard model
 * @returns {Promise<any>} Updated dashboard
 *
 * @example
 * ```typescript
 * await updateDashboardLayout('dash123', { layout: 'list', columns: 2 }, Dashboard);
 * ```
 */
export declare const updateDashboardLayout: (dashboardId: string, updates: Partial<DashboardData>, Dashboard: any) => Promise<any>;
/**
 * Sets a dashboard as the user's default.
 *
 * @param {string} userId - User identifier
 * @param {string} dashboardId - Dashboard ID
 * @param {Model} Dashboard - Dashboard model
 * @returns {Promise<any>} Updated dashboard
 *
 * @example
 * ```typescript
 * await setDefaultDashboard('USR001', 'dash123', Dashboard);
 * ```
 */
export declare const setDefaultDashboard: (userId: string, dashboardId: string, Dashboard: any) => Promise<any>;
/**
 * Retrieves user's default dashboard.
 *
 * @param {string} userId - User identifier
 * @param {Model} Dashboard - Dashboard model
 * @returns {Promise<any>} Default dashboard
 *
 * @example
 * ```typescript
 * const dashboard = await getDefaultDashboard('USR001', Dashboard);
 * ```
 */
export declare const getDefaultDashboard: (userId: string, Dashboard: any) => Promise<any>;
/**
 * Retrieves all dashboards for a user.
 *
 * @param {string} userId - User identifier
 * @param {Model} Dashboard - Dashboard model
 * @returns {Promise<any[]>} User dashboards
 *
 * @example
 * ```typescript
 * const dashboards = await getUserDashboards('USR001', Dashboard);
 * ```
 */
export declare const getUserDashboards: (userId: string, Dashboard: any) => Promise<any[]>;
/**
 * Clones an existing dashboard.
 *
 * @param {string} dashboardId - Source dashboard ID
 * @param {string} newName - New dashboard name
 * @param {Model} Dashboard - Dashboard model
 * @returns {Promise<any>} Cloned dashboard
 *
 * @example
 * ```typescript
 * const cloned = await cloneDashboard('dash123', 'My Dashboard Copy', Dashboard);
 * ```
 */
export declare const cloneDashboard: (dashboardId: string, newName: string, Dashboard: any) => Promise<any>;
/**
 * Deletes a dashboard.
 *
 * @param {string} dashboardId - Dashboard ID
 * @param {Model} Dashboard - Dashboard model
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteDashboard('dash123', Dashboard);
 * ```
 */
export declare const deleteDashboard: (dashboardId: string, Dashboard: any) => Promise<void>;
/**
 * Exports dashboard configuration to JSON.
 *
 * @param {string} dashboardId - Dashboard ID
 * @param {Model} Dashboard - Dashboard model
 * @returns {Promise<string>} JSON configuration
 *
 * @example
 * ```typescript
 * const json = await exportDashboardConfiguration('dash123', Dashboard);
 * ```
 */
export declare const exportDashboardConfiguration: (dashboardId: string, Dashboard: any) => Promise<string>;
/**
 * Creates a new widget type.
 *
 * @param {WidgetData} widgetData - Widget configuration
 * @param {Model} Widget - Widget model
 * @returns {Promise<any>} Created widget
 *
 * @example
 * ```typescript
 * const widget = await createWidget({
 *   widgetType: 'grade_summary',
 *   widgetName: 'Grade Summary',
 *   category: 'academic'
 * }, Widget);
 * ```
 */
export declare const createWidget: (widgetData: WidgetData, Widget: any) => Promise<any>;
/**
 * Adds a widget to a dashboard.
 *
 * @param {DashboardWidgetData} widgetAssignment - Widget assignment data
 * @param {Model} Dashboard - Dashboard model
 * @returns {Promise<any>} Updated dashboard
 *
 * @example
 * ```typescript
 * await addWidgetToDashboard({
 *   dashboardId: 'dash123',
 *   widgetId: 'widget456',
 *   position: { x: 0, y: 0 },
 *   size: { width: 4, height: 3 }
 * }, Dashboard);
 * ```
 */
export declare const addWidgetToDashboard: (widgetAssignment: DashboardWidgetData, Dashboard: any) => Promise<any>;
/**
 * Removes a widget from a dashboard.
 *
 * @param {string} dashboardId - Dashboard ID
 * @param {string} widgetId - Widget ID
 * @param {Model} Dashboard - Dashboard model
 * @returns {Promise<any>} Updated dashboard
 *
 * @example
 * ```typescript
 * await removeWidgetFromDashboard('dash123', 'widget456', Dashboard);
 * ```
 */
export declare const removeWidgetFromDashboard: (dashboardId: string, widgetId: string, Dashboard: any) => Promise<any>;
/**
 * Updates widget position and size on dashboard.
 *
 * @param {string} dashboardId - Dashboard ID
 * @param {string} widgetId - Widget ID
 * @param {any} layout - New layout (position and size)
 * @param {Model} Dashboard - Dashboard model
 * @returns {Promise<any>} Updated dashboard
 *
 * @example
 * ```typescript
 * await updateWidgetLayout('dash123', 'widget456', {
 *   position: { x: 4, y: 0 },
 *   size: { width: 6, height: 4 }
 * }, Dashboard);
 * ```
 */
export declare const updateWidgetLayout: (dashboardId: string, widgetId: string, layout: {
    position?: any;
    size?: any;
}, Dashboard: any) => Promise<any>;
/**
 * Updates widget configuration settings.
 *
 * @param {string} dashboardId - Dashboard ID
 * @param {string} widgetId - Widget ID
 * @param {Record<string, any>} configuration - Widget configuration
 * @param {Model} Dashboard - Dashboard model
 * @returns {Promise<any>} Updated dashboard
 *
 * @example
 * ```typescript
 * await updateWidgetConfiguration('dash123', 'widget456', {
 *   showGPA: true,
 *   termFilter: 'current'
 * }, Dashboard);
 * ```
 */
export declare const updateWidgetConfiguration: (dashboardId: string, widgetId: string, configuration: Record<string, any>, Dashboard: any) => Promise<any>;
/**
 * Retrieves all available widgets for a category.
 *
 * @param {string} category - Widget category
 * @param {Model} Widget - Widget model
 * @returns {Promise<any[]>} Available widgets
 *
 * @example
 * ```typescript
 * const academicWidgets = await getAvailableWidgets('academic', Widget);
 * ```
 */
export declare const getAvailableWidgets: (category: string, Widget: any) => Promise<any[]>;
/**
 * Retrieves widget data for rendering.
 *
 * @param {string} widgetId - Widget ID
 * @param {string} userId - User identifier
 * @param {Model} Widget - Widget model
 * @returns {Promise<any>} Widget data
 *
 * @example
 * ```typescript
 * const data = await getWidgetData('widget456', 'USR001', Widget);
 * ```
 */
export declare const getWidgetData: (widgetId: string, userId: string, Widget: any) => Promise<any>;
/**
 * Validates widget permissions for user.
 *
 * @param {string} widgetId - Widget ID
 * @param {string} userId - User identifier
 * @param {Model} Widget - Widget model
 * @returns {Promise<boolean>} Access granted
 *
 * @example
 * ```typescript
 * const canAccess = await validateWidgetPermissions('widget456', 'USR001', Widget);
 * ```
 */
export declare const validateWidgetPermissions: (widgetId: string, userId: string, Widget: any) => Promise<boolean>;
/**
 * Creates a new announcement.
 *
 * @param {AnnouncementData} announcementData - Announcement data
 * @param {Model} Announcement - Announcement model
 * @returns {Promise<any>} Created announcement
 *
 * @example
 * ```typescript
 * const announcement = await createAnnouncement({
 *   title: 'Spring Registration Opens',
 *   content: 'Registration for Spring 2025 opens on November 15th.',
 *   category: 'academic',
 *   priority: 'high',
 *   publishedAt: new Date(),
 *   authorId: 'admin123'
 * }, Announcement);
 * ```
 */
export declare const createAnnouncement: (announcementData: AnnouncementData, Announcement: any) => Promise<any>;
/**
 * Retrieves active announcements for a user.
 *
 * @param {string} userId - User identifier
 * @param {string[]} userGroups - User's groups/roles
 * @param {Model} Announcement - Announcement model
 * @returns {Promise<any[]>} Active announcements
 *
 * @example
 * ```typescript
 * const announcements = await getActiveAnnouncements('USR001', ['student', 'undergraduate'], Announcement);
 * ```
 */
export declare const getActiveAnnouncements: (userId: string, userGroups: string[], Announcement: any) => Promise<any[]>;
/**
 * Marks announcement as viewed by user.
 *
 * @param {string} announcementId - Announcement ID
 * @param {string} userId - User identifier
 * @param {Model} Announcement - Announcement model
 * @returns {Promise<any>} Updated announcement
 *
 * @example
 * ```typescript
 * await markAnnouncementViewed('ann123', 'USR001', Announcement);
 * ```
 */
export declare const markAnnouncementViewed: (announcementId: string, userId: string, Announcement: any) => Promise<any>;
/**
 * Filters announcements by category and priority.
 *
 * @param {string} category - Category filter
 * @param {string} priority - Priority filter
 * @param {Model} Announcement - Announcement model
 * @returns {Promise<any[]>} Filtered announcements
 *
 * @example
 * ```typescript
 * const urgent = await filterAnnouncements('academic', 'urgent', Announcement);
 * ```
 */
export declare const filterAnnouncements: (category: string, priority: string, Announcement: any) => Promise<any[]>;
/**
 * Updates announcement content and metadata.
 *
 * @param {string} announcementId - Announcement ID
 * @param {Partial<AnnouncementData>} updates - Updates
 * @param {Model} Announcement - Announcement model
 * @returns {Promise<any>} Updated announcement
 *
 * @example
 * ```typescript
 * await updateAnnouncement('ann123', { title: 'Updated Title' }, Announcement);
 * ```
 */
export declare const updateAnnouncement: (announcementId: string, updates: Partial<AnnouncementData>, Announcement: any) => Promise<any>;
/**
 * Archives expired announcements.
 *
 * @param {Model} Announcement - Announcement model
 * @returns {Promise<number>} Number of archived announcements
 *
 * @example
 * ```typescript
 * const count = await archiveExpiredAnnouncements(Announcement);
 * console.log(`Archived ${count} announcements`);
 * ```
 */
export declare const archiveExpiredAnnouncements: (Announcement: any) => Promise<number>;
/**
 * Creates a quick link for user.
 *
 * @param {QuickLinkData} linkData - Quick link data
 * @returns {Promise<QuickLinkData>} Created link
 *
 * @example
 * ```typescript
 * const link = await createQuickLink({
 *   userId: 'USR001',
 *   linkTitle: 'Library Portal',
 *   linkUrl: 'https://library.university.edu',
 *   icon: 'book'
 * });
 * ```
 */
export declare const createQuickLink: (linkData: QuickLinkData) => Promise<QuickLinkData>;
/**
 * Retrieves user's quick links.
 *
 * @param {string} userId - User identifier
 * @returns {Promise<QuickLinkData[]>} User quick links
 *
 * @example
 * ```typescript
 * const links = await getUserQuickLinks('USR001');
 * ```
 */
export declare const getUserQuickLinks: (userId: string) => Promise<QuickLinkData[]>;
/**
 * Updates quick link properties.
 *
 * @param {string} linkId - Link ID
 * @param {Partial<QuickLinkData>} updates - Updates
 * @returns {Promise<QuickLinkData>} Updated link
 *
 * @example
 * ```typescript
 * await updateQuickLink('link123', { linkTitle: 'New Title' });
 * ```
 */
export declare const updateQuickLink: (linkId: string, updates: Partial<QuickLinkData>) => Promise<QuickLinkData>;
/**
 * Reorders quick links for user.
 *
 * @param {string} userId - User identifier
 * @param {string[]} linkIds - Ordered link IDs
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reorderQuickLinks('USR001', ['link3', 'link1', 'link2']);
 * ```
 */
export declare const reorderQuickLinks: (userId: string, linkIds: string[]) => Promise<void>;
/**
 * Builds personalized navigation menu for user.
 *
 * @param {string} userId - User identifier
 * @param {string[]} userRoles - User roles
 * @returns {Promise<NavigationItemData[]>} Navigation items
 *
 * @example
 * ```typescript
 * const nav = await buildNavigationMenu('USR001', ['student']);
 * ```
 */
export declare const buildNavigationMenu: (userId: string, userRoles: string[]) => Promise<NavigationItemData[]>;
/**
 * Updates navigation preferences for user.
 *
 * @param {string} userId - User identifier
 * @param {any} navPreferences - Navigation preferences
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateNavigationPreferences('USR001', { collapsed: false });
 * ```
 */
export declare const updateNavigationPreferences: (userId: string, navPreferences: any) => Promise<void>;
/**
 * Retrieves recently accessed pages for user.
 *
 * @param {string} userId - User identifier
 * @param {number} limit - Max items
 * @returns {Promise<NavigationItemData[]>} Recent pages
 *
 * @example
 * ```typescript
 * const recent = await getRecentlyAccessedPages('USR001', 5);
 * ```
 */
export declare const getRecentlyAccessedPages: (userId: string, limit?: number) => Promise<NavigationItemData[]>;
/**
 * Adds breadcrumb navigation trail.
 *
 * @param {NavigationItemData[]} trail - Navigation trail
 * @returns {string} Breadcrumb HTML
 *
 * @example
 * ```typescript
 * const breadcrumbs = generateBreadcrumbTrail([
 *   { label: 'Home', url: '/' },
 *   { label: 'Courses', url: '/courses' }
 * ]);
 * ```
 */
export declare const generateBreadcrumbTrail: (trail: NavigationItemData[]) => string;
/**
 * Updates accessibility settings for user.
 *
 * @param {string} userId - User identifier
 * @param {AccessibilitySettingsData} settings - Accessibility settings
 * @param {Model} PortalUser - PortalUser model
 * @returns {Promise<any>} Updated user
 *
 * @example
 * ```typescript
 * await updateAccessibilitySettings('USR001', {
 *   highContrast: true,
 *   fontSize: 'large',
 *   screenReader: true
 * }, PortalUser);
 * ```
 */
export declare const updateAccessibilitySettings: (userId: string, settings: AccessibilitySettingsData, PortalUser: any) => Promise<any>;
/**
 * Retrieves accessibility settings for user.
 *
 * @param {string} userId - User identifier
 * @param {Model} PortalUser - PortalUser model
 * @returns {Promise<AccessibilitySettingsData>} Accessibility settings
 *
 * @example
 * ```typescript
 * const settings = await getAccessibilitySettings('USR001', PortalUser);
 * ```
 */
export declare const getAccessibilitySettings: (userId: string, PortalUser: any) => Promise<AccessibilitySettingsData>;
/**
 * Generates accessible HTML with ARIA attributes.
 *
 * @param {string} content - HTML content
 * @param {any} ariaOptions - ARIA options
 * @returns {string} Accessible HTML
 *
 * @example
 * ```typescript
 * const html = generateAccessibleHTML('<button>Click</button>', {
 *   role: 'button',
 *   label: 'Submit form'
 * });
 * ```
 */
export declare const generateAccessibleHTML: (content: string, ariaOptions: any) => string;
/**
 * Validates WCAG compliance for portal page.
 *
 * @param {string} pageHtml - Page HTML
 * @returns {Promise<{ compliant: boolean; issues: string[] }>} Compliance result
 *
 * @example
 * ```typescript
 * const result = await validateWCAGCompliance(pageHtml);
 * if (!result.compliant) {
 *   console.log('Issues:', result.issues);
 * }
 * ```
 */
export declare const validateWCAGCompliance: (pageHtml: string) => Promise<{
    compliant: boolean;
    issues: string[];
}>;
/**
 * Generates keyboard navigation shortcuts reference.
 *
 * @param {string} context - Page context
 * @returns {Record<string, string>} Keyboard shortcuts
 *
 * @example
 * ```typescript
 * const shortcuts = generateKeyboardShortcuts('dashboard');
 * console.log(shortcuts['alt+h']); // "Go to Home"
 * ```
 */
export declare const generateKeyboardShortcuts: (context: string) => Record<string, string>;
/**
 * NestJS Injectable service for Student Portal management.
 *
 * @example
 * ```typescript
 * @Controller('portal')
 * export class PortalController {
 *   constructor(private readonly portalService: StudentPortalService) {}
 *
 *   @Get('dashboard')
 *   async getDashboard(@Req() req) {
 *     return this.portalService.getUserDashboard(req.user.id);
 *   }
 * }
 * ```
 */
export declare class StudentPortalService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    createUser(userData: PortalUserData): Promise<any>;
    getUserDashboard(userId: string): Promise<any>;
    getAnnouncements(userId: string, userGroups: string[]): Promise<any[]>;
    updateUserPreferences(userId: string, preferences: Partial<PortalUserData>): Promise<any>;
}
/**
 * Default export with all portal utilities.
 */
declare const _default: {
    createPortalUserModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            userId: string;
            studentId: string;
            userName: string;
            email: string;
            theme: string;
            language: string;
            timezone: string;
            accessibilitySettings: Record<string, any>;
            lastLoginAt: Date | null;
            loginCount: number;
            preferences: Record<string, any>;
            isActive: boolean;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createDashboardModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            userId: string;
            dashboardName: string;
            layout: string;
            columns: number;
            isDefault: boolean;
            configuration: Record<string, any>;
            isActive: boolean;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createWidgetModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            widgetType: string;
            widgetName: string;
            description: string;
            category: string;
            configuration: Record<string, any>;
            defaultSize: Record<string, number>;
            isEnabled: boolean;
            requiresAuth: boolean;
            permissions: string[];
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createAnnouncementModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            title: string;
            content: string;
            category: string;
            priority: string;
            publishedAt: Date;
            expiresAt: Date | null;
            targetAudience: string[];
            authorId: string;
            attachments: string[];
            isPublished: boolean;
            viewCount: number;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createPortalUser: (userData: PortalUserData, PortalUser: any, transaction?: Transaction) => Promise<any>;
    updatePortalUserPreferences: (userId: string, updates: Partial<PortalUserData>, PortalUser: any) => Promise<any>;
    recordUserLogin: (userId: string, PortalUser: any) => Promise<any>;
    getUserPortalConfiguration: (userId: string, PortalUser: any) => Promise<any>;
    validatePortalAccess: (userId: string, requiredPermissions: string[], PortalUser: any) => Promise<{
        hasAccess: boolean;
        missingPermissions: string[];
    }>;
    createDashboard: (dashboardData: DashboardData, Dashboard: any, transaction?: Transaction) => Promise<any>;
    updateDashboardLayout: (dashboardId: string, updates: Partial<DashboardData>, Dashboard: any) => Promise<any>;
    setDefaultDashboard: (userId: string, dashboardId: string, Dashboard: any) => Promise<any>;
    getDefaultDashboard: (userId: string, Dashboard: any) => Promise<any>;
    getUserDashboards: (userId: string, Dashboard: any) => Promise<any[]>;
    cloneDashboard: (dashboardId: string, newName: string, Dashboard: any) => Promise<any>;
    deleteDashboard: (dashboardId: string, Dashboard: any) => Promise<void>;
    exportDashboardConfiguration: (dashboardId: string, Dashboard: any) => Promise<string>;
    createWidget: (widgetData: WidgetData, Widget: any) => Promise<any>;
    addWidgetToDashboard: (widgetAssignment: DashboardWidgetData, Dashboard: any) => Promise<any>;
    removeWidgetFromDashboard: (dashboardId: string, widgetId: string, Dashboard: any) => Promise<any>;
    updateWidgetLayout: (dashboardId: string, widgetId: string, layout: {
        position?: any;
        size?: any;
    }, Dashboard: any) => Promise<any>;
    updateWidgetConfiguration: (dashboardId: string, widgetId: string, configuration: Record<string, any>, Dashboard: any) => Promise<any>;
    getAvailableWidgets: (category: string, Widget: any) => Promise<any[]>;
    getWidgetData: (widgetId: string, userId: string, Widget: any) => Promise<any>;
    validateWidgetPermissions: (widgetId: string, userId: string, Widget: any) => Promise<boolean>;
    createAnnouncement: (announcementData: AnnouncementData, Announcement: any) => Promise<any>;
    getActiveAnnouncements: (userId: string, userGroups: string[], Announcement: any) => Promise<any[]>;
    markAnnouncementViewed: (announcementId: string, userId: string, Announcement: any) => Promise<any>;
    filterAnnouncements: (category: string, priority: string, Announcement: any) => Promise<any[]>;
    updateAnnouncement: (announcementId: string, updates: Partial<AnnouncementData>, Announcement: any) => Promise<any>;
    archiveExpiredAnnouncements: (Announcement: any) => Promise<number>;
    createQuickLink: (linkData: QuickLinkData) => Promise<QuickLinkData>;
    getUserQuickLinks: (userId: string) => Promise<QuickLinkData[]>;
    updateQuickLink: (linkId: string, updates: Partial<QuickLinkData>) => Promise<QuickLinkData>;
    reorderQuickLinks: (userId: string, linkIds: string[]) => Promise<void>;
    buildNavigationMenu: (userId: string, userRoles: string[]) => Promise<NavigationItemData[]>;
    updateNavigationPreferences: (userId: string, navPreferences: any) => Promise<void>;
    getRecentlyAccessedPages: (userId: string, limit?: number) => Promise<NavigationItemData[]>;
    generateBreadcrumbTrail: (trail: NavigationItemData[]) => string;
    updateAccessibilitySettings: (userId: string, settings: AccessibilitySettingsData, PortalUser: any) => Promise<any>;
    getAccessibilitySettings: (userId: string, PortalUser: any) => Promise<AccessibilitySettingsData>;
    generateAccessibleHTML: (content: string, ariaOptions: any) => string;
    validateWCAGCompliance: (pageHtml: string) => Promise<{
        compliant: boolean;
        issues: string[];
    }>;
    generateKeyboardShortcuts: (context: string) => Record<string, string>;
    StudentPortalService: typeof StudentPortalService;
};
export default _default;
//# sourceMappingURL=student-portal-kit.d.ts.map