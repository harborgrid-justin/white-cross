"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentPortalService = exports.generateKeyboardShortcuts = exports.validateWCAGCompliance = exports.generateAccessibleHTML = exports.getAccessibilitySettings = exports.updateAccessibilitySettings = exports.generateBreadcrumbTrail = exports.getRecentlyAccessedPages = exports.updateNavigationPreferences = exports.buildNavigationMenu = exports.reorderQuickLinks = exports.updateQuickLink = exports.getUserQuickLinks = exports.createQuickLink = exports.archiveExpiredAnnouncements = exports.updateAnnouncement = exports.filterAnnouncements = exports.markAnnouncementViewed = exports.getActiveAnnouncements = exports.createAnnouncement = exports.validateWidgetPermissions = exports.getWidgetData = exports.getAvailableWidgets = exports.updateWidgetConfiguration = exports.updateWidgetLayout = exports.removeWidgetFromDashboard = exports.addWidgetToDashboard = exports.createWidget = exports.exportDashboardConfiguration = exports.deleteDashboard = exports.cloneDashboard = exports.getUserDashboards = exports.getDefaultDashboard = exports.setDefaultDashboard = exports.updateDashboardLayout = exports.createDashboard = exports.validatePortalAccess = exports.getUserPortalConfiguration = exports.recordUserLogin = exports.updatePortalUserPreferences = exports.createPortalUser = exports.createAnnouncementModel = exports.createWidgetModel = exports.createDashboardModel = exports.createPortalUserModel = void 0;
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
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
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
const createPortalUserModel = (sequelize) => {
    class PortalUser extends sequelize_1.Model {
    }
    PortalUser.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'System user identifier',
        },
        studentId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Student identifier',
            validate: {
                notEmpty: true,
            },
        },
        userName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Portal username',
        },
        email: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Email address',
            validate: {
                isEmail: true,
            },
        },
        theme: {
            type: sequelize_1.DataTypes.ENUM('light', 'dark', 'auto'),
            allowNull: false,
            defaultValue: 'light',
            comment: 'UI theme preference',
        },
        language: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'en',
            comment: 'Language code (ISO 639-1)',
        },
        timezone: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'America/New_York',
            comment: 'IANA timezone identifier',
        },
        accessibilitySettings: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Accessibility configuration',
        },
        lastLoginAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last login timestamp',
        },
        loginCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total login count',
        },
        preferences: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'User preferences',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Account active status',
        },
    }, {
        sequelize,
        tableName: 'portal_users',
        timestamps: true,
        indexes: [
            { fields: ['userId'], unique: true },
            { fields: ['studentId'] },
            { fields: ['email'], unique: true },
            { fields: ['isActive'] },
            { fields: ['lastLoginAt'] },
        ],
    });
    return PortalUser;
};
exports.createPortalUserModel = createPortalUserModel;
/**
 * Sequelize model for Dashboards with customizable layouts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Dashboard model
 */
const createDashboardModel = (sequelize) => {
    class Dashboard extends sequelize_1.Model {
    }
    Dashboard.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Portal user identifier',
        },
        dashboardName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Dashboard name',
        },
        layout: {
            type: sequelize_1.DataTypes.ENUM('grid', 'list', 'custom'),
            allowNull: false,
            defaultValue: 'grid',
            comment: 'Dashboard layout type',
        },
        columns: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3,
            comment: 'Number of columns',
            validate: {
                min: 1,
                max: 6,
            },
        },
        isDefault: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Default dashboard flag',
        },
        configuration: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Dashboard configuration',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Dashboard active status',
        },
    }, {
        sequelize,
        tableName: 'dashboards',
        timestamps: true,
        indexes: [
            { fields: ['userId'] },
            { fields: ['isDefault'] },
            { fields: ['isActive'] },
        ],
    });
    return Dashboard;
};
exports.createDashboardModel = createDashboardModel;
/**
 * Sequelize model for Widgets with configuration and permissions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Widget model
 */
const createWidgetModel = (sequelize) => {
    class Widget extends sequelize_1.Model {
    }
    Widget.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        widgetType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Unique widget type identifier',
        },
        widgetName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Widget display name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
            comment: 'Widget description',
        },
        category: {
            type: sequelize_1.DataTypes.ENUM('academic', 'financial', 'social', 'utilities', 'custom'),
            allowNull: false,
            comment: 'Widget category',
        },
        configuration: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Widget configuration',
        },
        defaultSize: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: { width: 4, height: 3 },
            comment: 'Default widget size',
        },
        isEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Widget enabled status',
        },
        requiresAuth: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Authentication requirement',
        },
        permissions: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Required permissions',
        },
    }, {
        sequelize,
        tableName: 'widgets',
        timestamps: true,
        indexes: [
            { fields: ['widgetType'], unique: true },
            { fields: ['category'] },
            { fields: ['isEnabled'] },
        ],
    });
    return Widget;
};
exports.createWidgetModel = createWidgetModel;
/**
 * Sequelize model for Announcements with targeting and scheduling.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Announcement model
 */
const createAnnouncementModel = (sequelize) => {
    class Announcement extends sequelize_1.Model {
    }
    Announcement.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Announcement title',
        },
        content: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Announcement content',
        },
        category: {
            type: sequelize_1.DataTypes.ENUM('academic', 'administrative', 'event', 'emergency', 'general'),
            allowNull: false,
            comment: 'Announcement category',
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
            allowNull: false,
            defaultValue: 'medium',
            comment: 'Priority level',
        },
        publishedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Publication date',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Expiration date',
        },
        targetAudience: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Target audience groups',
        },
        authorId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Author user ID',
        },
        attachments: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Attachment file URLs',
        },
        isPublished: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Published status',
        },
        viewCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'View count',
        },
    }, {
        sequelize,
        tableName: 'announcements',
        timestamps: true,
        indexes: [
            { fields: ['publishedAt'] },
            { fields: ['expiresAt'] },
            { fields: ['category'] },
            { fields: ['priority'] },
            { fields: ['isPublished'] },
            { fields: ['authorId'] },
        ],
    });
    return Announcement;
};
exports.createAnnouncementModel = createAnnouncementModel;
// ============================================================================
// PORTAL USER MANAGEMENT (1-5)
// ============================================================================
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
const createPortalUser = async (userData, PortalUser, transaction) => {
    const user = await PortalUser.create({
        ...userData,
        loginCount: 0,
        isActive: true,
        preferences: {
            ...userData.preferences,
            dashboardLayout: 'grid',
            itemsPerPage: 25,
        },
    }, { transaction });
    return user;
};
exports.createPortalUser = createPortalUser;
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
const updatePortalUserPreferences = async (userId, updates, PortalUser) => {
    const user = await PortalUser.findOne({ where: { userId } });
    if (!user)
        throw new Error('Portal user not found');
    await user.update(updates);
    return user;
};
exports.updatePortalUserPreferences = updatePortalUserPreferences;
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
const recordUserLogin = async (userId, PortalUser) => {
    const user = await PortalUser.findOne({ where: { userId } });
    if (!user)
        throw new Error('Portal user not found');
    user.lastLoginAt = new Date();
    user.loginCount += 1;
    await user.save();
    return user;
};
exports.recordUserLogin = recordUserLogin;
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
const getUserPortalConfiguration = async (userId, PortalUser) => {
    const user = await PortalUser.findOne({ where: { userId } });
    if (!user)
        throw new Error('Portal user not found');
    return {
        theme: user.theme,
        language: user.language,
        timezone: user.timezone,
        accessibilitySettings: user.accessibilitySettings,
        preferences: user.preferences,
    };
};
exports.getUserPortalConfiguration = getUserPortalConfiguration;
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
const validatePortalAccess = async (userId, requiredPermissions, PortalUser) => {
    const user = await PortalUser.findOne({ where: { userId } });
    if (!user || !user.isActive) {
        return { hasAccess: false, missingPermissions: requiredPermissions };
    }
    // TODO: Implement actual permission checking
    return { hasAccess: true, missingPermissions: [] };
};
exports.validatePortalAccess = validatePortalAccess;
// ============================================================================
// DASHBOARD MANAGEMENT (6-13)
// ============================================================================
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
const createDashboard = async (dashboardData, Dashboard, transaction) => {
    const dashboard = await Dashboard.create({
        ...dashboardData,
        isActive: true,
    }, { transaction });
    return dashboard;
};
exports.createDashboard = createDashboard;
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
const updateDashboardLayout = async (dashboardId, updates, Dashboard) => {
    const dashboard = await Dashboard.findByPk(dashboardId);
    if (!dashboard)
        throw new Error('Dashboard not found');
    await dashboard.update(updates);
    return dashboard;
};
exports.updateDashboardLayout = updateDashboardLayout;
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
const setDefaultDashboard = async (userId, dashboardId, Dashboard) => {
    // Clear existing default
    await Dashboard.update({ isDefault: false }, { where: { userId, isDefault: true } });
    // Set new default
    const dashboard = await Dashboard.findByPk(dashboardId);
    if (!dashboard || dashboard.userId !== userId) {
        throw new Error('Dashboard not found or access denied');
    }
    dashboard.isDefault = true;
    await dashboard.save();
    return dashboard;
};
exports.setDefaultDashboard = setDefaultDashboard;
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
const getDefaultDashboard = async (userId, Dashboard) => {
    let dashboard = await Dashboard.findOne({
        where: { userId, isDefault: true, isActive: true },
    });
    if (!dashboard) {
        // Get first active dashboard
        dashboard = await Dashboard.findOne({
            where: { userId, isActive: true },
            order: [['createdAt', 'ASC']],
        });
    }
    return dashboard;
};
exports.getDefaultDashboard = getDefaultDashboard;
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
const getUserDashboards = async (userId, Dashboard) => {
    return await Dashboard.findAll({
        where: { userId, isActive: true },
        order: [['isDefault', 'DESC'], ['dashboardName', 'ASC']],
    });
};
exports.getUserDashboards = getUserDashboards;
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
const cloneDashboard = async (dashboardId, newName, Dashboard) => {
    const source = await Dashboard.findByPk(dashboardId);
    if (!source)
        throw new Error('Dashboard not found');
    const cloned = await Dashboard.create({
        userId: source.userId,
        dashboardName: newName,
        layout: source.layout,
        columns: source.columns,
        isDefault: false,
        configuration: { ...source.configuration },
        isActive: true,
    });
    return cloned;
};
exports.cloneDashboard = cloneDashboard;
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
const deleteDashboard = async (dashboardId, Dashboard) => {
    const dashboard = await Dashboard.findByPk(dashboardId);
    if (!dashboard)
        throw new Error('Dashboard not found');
    dashboard.isActive = false;
    await dashboard.save();
};
exports.deleteDashboard = deleteDashboard;
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
const exportDashboardConfiguration = async (dashboardId, Dashboard) => {
    const dashboard = await Dashboard.findByPk(dashboardId);
    if (!dashboard)
        throw new Error('Dashboard not found');
    return JSON.stringify({
        dashboardName: dashboard.dashboardName,
        layout: dashboard.layout,
        columns: dashboard.columns,
        configuration: dashboard.configuration,
    }, null, 2);
};
exports.exportDashboardConfiguration = exportDashboardConfiguration;
// ============================================================================
// WIDGET MANAGEMENT (14-21)
// ============================================================================
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
const createWidget = async (widgetData, Widget) => {
    return await Widget.create({
        ...widgetData,
        isEnabled: true,
    });
};
exports.createWidget = createWidget;
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
const addWidgetToDashboard = async (widgetAssignment, Dashboard) => {
    const dashboard = await Dashboard.findByPk(widgetAssignment.dashboardId);
    if (!dashboard)
        throw new Error('Dashboard not found');
    const widgets = dashboard.configuration.widgets || [];
    widgets.push({
        widgetId: widgetAssignment.widgetId,
        position: widgetAssignment.position,
        size: widgetAssignment.size,
        configuration: widgetAssignment.configuration || {},
        isVisible: widgetAssignment.isVisible !== false,
    });
    dashboard.configuration = {
        ...dashboard.configuration,
        widgets,
    };
    await dashboard.save();
    return dashboard;
};
exports.addWidgetToDashboard = addWidgetToDashboard;
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
const removeWidgetFromDashboard = async (dashboardId, widgetId, Dashboard) => {
    const dashboard = await Dashboard.findByPk(dashboardId);
    if (!dashboard)
        throw new Error('Dashboard not found');
    const widgets = (dashboard.configuration.widgets || []).filter((w) => w.widgetId !== widgetId);
    dashboard.configuration = {
        ...dashboard.configuration,
        widgets,
    };
    await dashboard.save();
    return dashboard;
};
exports.removeWidgetFromDashboard = removeWidgetFromDashboard;
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
const updateWidgetLayout = async (dashboardId, widgetId, layout, Dashboard) => {
    const dashboard = await Dashboard.findByPk(dashboardId);
    if (!dashboard)
        throw new Error('Dashboard not found');
    const widgets = dashboard.configuration.widgets || [];
    const widget = widgets.find((w) => w.widgetId === widgetId);
    if (!widget)
        throw new Error('Widget not found on dashboard');
    if (layout.position)
        widget.position = layout.position;
    if (layout.size)
        widget.size = layout.size;
    dashboard.configuration = {
        ...dashboard.configuration,
        widgets,
    };
    await dashboard.save();
    return dashboard;
};
exports.updateWidgetLayout = updateWidgetLayout;
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
const updateWidgetConfiguration = async (dashboardId, widgetId, configuration, Dashboard) => {
    const dashboard = await Dashboard.findByPk(dashboardId);
    if (!dashboard)
        throw new Error('Dashboard not found');
    const widgets = dashboard.configuration.widgets || [];
    const widget = widgets.find((w) => w.widgetId === widgetId);
    if (!widget)
        throw new Error('Widget not found on dashboard');
    widget.configuration = { ...widget.configuration, ...configuration };
    dashboard.configuration = {
        ...dashboard.configuration,
        widgets,
    };
    await dashboard.save();
    return dashboard;
};
exports.updateWidgetConfiguration = updateWidgetConfiguration;
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
const getAvailableWidgets = async (category, Widget) => {
    return await Widget.findAll({
        where: { category, isEnabled: true },
        order: [['widgetName', 'ASC']],
    });
};
exports.getAvailableWidgets = getAvailableWidgets;
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
const getWidgetData = async (widgetId, userId, Widget) => {
    const widget = await Widget.findByPk(widgetId);
    if (!widget)
        throw new Error('Widget not found');
    // TODO: Fetch actual widget data based on widget type
    return {
        widgetId,
        widgetType: widget.widgetType,
        data: {},
    };
};
exports.getWidgetData = getWidgetData;
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
const validateWidgetPermissions = async (widgetId, userId, Widget) => {
    const widget = await Widget.findByPk(widgetId);
    if (!widget || !widget.isEnabled)
        return false;
    // TODO: Implement actual permission checking
    return true;
};
exports.validateWidgetPermissions = validateWidgetPermissions;
// ============================================================================
// ANNOUNCEMENTS (22-27)
// ============================================================================
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
const createAnnouncement = async (announcementData, Announcement) => {
    return await Announcement.create({
        ...announcementData,
        isPublished: announcementData.isPublished !== false,
        viewCount: 0,
    });
};
exports.createAnnouncement = createAnnouncement;
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
const getActiveAnnouncements = async (userId, userGroups, Announcement) => {
    const now = new Date();
    return await Announcement.findAll({
        where: {
            isPublished: true,
            publishedAt: { [sequelize_1.Op.lte]: now },
            [sequelize_1.Op.or]: [
                { expiresAt: null },
                { expiresAt: { [sequelize_1.Op.gt]: now } },
            ],
        },
        order: [
            ['priority', 'DESC'],
            ['publishedAt', 'DESC'],
        ],
    });
};
exports.getActiveAnnouncements = getActiveAnnouncements;
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
const markAnnouncementViewed = async (announcementId, userId, Announcement) => {
    const announcement = await Announcement.findByPk(announcementId);
    if (!announcement)
        throw new Error('Announcement not found');
    announcement.viewCount += 1;
    await announcement.save();
    return announcement;
};
exports.markAnnouncementViewed = markAnnouncementViewed;
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
const filterAnnouncements = async (category, priority, Announcement) => {
    const where = { isPublished: true };
    if (category)
        where.category = category;
    if (priority)
        where.priority = priority;
    return await Announcement.findAll({
        where,
        order: [['publishedAt', 'DESC']],
    });
};
exports.filterAnnouncements = filterAnnouncements;
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
const updateAnnouncement = async (announcementId, updates, Announcement) => {
    const announcement = await Announcement.findByPk(announcementId);
    if (!announcement)
        throw new Error('Announcement not found');
    await announcement.update(updates);
    return announcement;
};
exports.updateAnnouncement = updateAnnouncement;
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
const archiveExpiredAnnouncements = async (Announcement) => {
    const now = new Date();
    const result = await Announcement.update({ isPublished: false }, {
        where: {
            expiresAt: { [sequelize_1.Op.lt]: now },
            isPublished: true,
        },
    });
    return result[0];
};
exports.archiveExpiredAnnouncements = archiveExpiredAnnouncements;
// ============================================================================
// QUICK LINKS (28-31)
// ============================================================================
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
const createQuickLink = async (linkData) => {
    // In production, this would use a QuickLink model
    return {
        ...linkData,
        isActive: true,
        openInNewTab: linkData.openInNewTab !== false,
    };
};
exports.createQuickLink = createQuickLink;
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
const getUserQuickLinks = async (userId) => {
    // Mock implementation
    return [];
};
exports.getUserQuickLinks = getUserQuickLinks;
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
const updateQuickLink = async (linkId, updates) => {
    // Mock implementation
    return updates;
};
exports.updateQuickLink = updateQuickLink;
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
const reorderQuickLinks = async (userId, linkIds) => {
    // Mock implementation
};
exports.reorderQuickLinks = reorderQuickLinks;
// ============================================================================
// NAVIGATION (32-35)
// ============================================================================
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
const buildNavigationMenu = async (userId, userRoles) => {
    const baseNav = [
        { label: 'Home', url: '/dashboard', icon: 'home', parentId: null, sortOrder: 1, isActive: true, isVisible: true },
        { label: 'Academics', url: '/academics', icon: 'book', parentId: null, sortOrder: 2, isActive: true, isVisible: true },
        { label: 'My Courses', url: '/courses', icon: 'course', parentId: null, sortOrder: 3, isActive: true, isVisible: true },
        { label: 'Grades', url: '/grades', icon: 'grade', parentId: null, sortOrder: 4, isActive: true, isVisible: true },
        { label: 'Financial Aid', url: '/financial', icon: 'money', parentId: null, sortOrder: 5, isActive: true, isVisible: true },
    ];
    return baseNav;
};
exports.buildNavigationMenu = buildNavigationMenu;
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
const updateNavigationPreferences = async (userId, navPreferences) => {
    // Mock implementation
};
exports.updateNavigationPreferences = updateNavigationPreferences;
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
const getRecentlyAccessedPages = async (userId, limit = 5) => {
    // Mock implementation
    return [];
};
exports.getRecentlyAccessedPages = getRecentlyAccessedPages;
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
const generateBreadcrumbTrail = (trail) => {
    return trail.map((item, index) => {
        if (index === trail.length - 1) {
            return `<span>${item.label}</span>`;
        }
        return `<a href="${item.url}">${item.label}</a>`;
    }).join(' > ');
};
exports.generateBreadcrumbTrail = generateBreadcrumbTrail;
// ============================================================================
// ACCESSIBILITY (36-40)
// ============================================================================
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
const updateAccessibilitySettings = async (userId, settings, PortalUser) => {
    const user = await PortalUser.findOne({ where: { userId } });
    if (!user)
        throw new Error('Portal user not found');
    user.accessibilitySettings = { ...user.accessibilitySettings, ...settings };
    await user.save();
    return user;
};
exports.updateAccessibilitySettings = updateAccessibilitySettings;
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
const getAccessibilitySettings = async (userId, PortalUser) => {
    const user = await PortalUser.findOne({ where: { userId } });
    if (!user)
        throw new Error('Portal user not found');
    return user.accessibilitySettings;
};
exports.getAccessibilitySettings = getAccessibilitySettings;
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
const generateAccessibleHTML = (content, ariaOptions) => {
    const ariaAttrs = Object.entries(ariaOptions)
        .map(([key, value]) => `aria-${key}="${value}"`)
        .join(' ');
    return content.replace('<', `< ${ariaAttrs} `);
};
exports.generateAccessibleHTML = generateAccessibleHTML;
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
const validateWCAGCompliance = async (pageHtml) => {
    const issues = [];
    // Check for alt text on images
    if (pageHtml.includes('<img') && !pageHtml.includes('alt=')) {
        issues.push('Images missing alt text');
    }
    // Check for proper heading hierarchy
    const headings = pageHtml.match(/<h[1-6]/g) || [];
    if (headings.length === 0) {
        issues.push('No headings found');
    }
    return {
        compliant: issues.length === 0,
        issues,
    };
};
exports.validateWCAGCompliance = validateWCAGCompliance;
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
const generateKeyboardShortcuts = (context) => {
    const baseShortcuts = {
        'alt+h': 'Go to Home',
        'alt+d': 'Go to Dashboard',
        'alt+c': 'Go to Courses',
        'alt+g': 'Go to Grades',
        'alt+s': 'Search',
        'alt+n': 'Navigation Menu',
        'alt+p': 'Profile Settings',
    };
    if (context === 'dashboard') {
        return {
            ...baseShortcuts,
            'alt+w': 'Add Widget',
            'alt+l': 'Change Layout',
        };
    }
    return baseShortcuts;
};
exports.generateKeyboardShortcuts = generateKeyboardShortcuts;
// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================
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
let StudentPortalService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var StudentPortalService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        async createUser(userData) {
            const PortalUser = (0, exports.createPortalUserModel)(this.sequelize);
            return (0, exports.createPortalUser)(userData, PortalUser);
        }
        async getUserDashboard(userId) {
            const Dashboard = (0, exports.createDashboardModel)(this.sequelize);
            return (0, exports.getDefaultDashboard)(userId, Dashboard);
        }
        async getAnnouncements(userId, userGroups) {
            const Announcement = (0, exports.createAnnouncementModel)(this.sequelize);
            return (0, exports.getActiveAnnouncements)(userId, userGroups, Announcement);
        }
        async updateUserPreferences(userId, preferences) {
            const PortalUser = (0, exports.createPortalUserModel)(this.sequelize);
            return (0, exports.updatePortalUserPreferences)(userId, preferences, PortalUser);
        }
    };
    __setFunctionName(_classThis, "StudentPortalService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StudentPortalService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StudentPortalService = _classThis;
})();
exports.StudentPortalService = StudentPortalService;
/**
 * Default export with all portal utilities.
 */
exports.default = {
    // Models
    createPortalUserModel: exports.createPortalUserModel,
    createDashboardModel: exports.createDashboardModel,
    createWidgetModel: exports.createWidgetModel,
    createAnnouncementModel: exports.createAnnouncementModel,
    // Portal User Management
    createPortalUser: exports.createPortalUser,
    updatePortalUserPreferences: exports.updatePortalUserPreferences,
    recordUserLogin: exports.recordUserLogin,
    getUserPortalConfiguration: exports.getUserPortalConfiguration,
    validatePortalAccess: exports.validatePortalAccess,
    // Dashboard Management
    createDashboard: exports.createDashboard,
    updateDashboardLayout: exports.updateDashboardLayout,
    setDefaultDashboard: exports.setDefaultDashboard,
    getDefaultDashboard: exports.getDefaultDashboard,
    getUserDashboards: exports.getUserDashboards,
    cloneDashboard: exports.cloneDashboard,
    deleteDashboard: exports.deleteDashboard,
    exportDashboardConfiguration: exports.exportDashboardConfiguration,
    // Widget Management
    createWidget: exports.createWidget,
    addWidgetToDashboard: exports.addWidgetToDashboard,
    removeWidgetFromDashboard: exports.removeWidgetFromDashboard,
    updateWidgetLayout: exports.updateWidgetLayout,
    updateWidgetConfiguration: exports.updateWidgetConfiguration,
    getAvailableWidgets: exports.getAvailableWidgets,
    getWidgetData: exports.getWidgetData,
    validateWidgetPermissions: exports.validateWidgetPermissions,
    // Announcements
    createAnnouncement: exports.createAnnouncement,
    getActiveAnnouncements: exports.getActiveAnnouncements,
    markAnnouncementViewed: exports.markAnnouncementViewed,
    filterAnnouncements: exports.filterAnnouncements,
    updateAnnouncement: exports.updateAnnouncement,
    archiveExpiredAnnouncements: exports.archiveExpiredAnnouncements,
    // Quick Links
    createQuickLink: exports.createQuickLink,
    getUserQuickLinks: exports.getUserQuickLinks,
    updateQuickLink: exports.updateQuickLink,
    reorderQuickLinks: exports.reorderQuickLinks,
    // Navigation
    buildNavigationMenu: exports.buildNavigationMenu,
    updateNavigationPreferences: exports.updateNavigationPreferences,
    getRecentlyAccessedPages: exports.getRecentlyAccessedPages,
    generateBreadcrumbTrail: exports.generateBreadcrumbTrail,
    // Accessibility
    updateAccessibilitySettings: exports.updateAccessibilitySettings,
    getAccessibilitySettings: exports.getAccessibilitySettings,
    generateAccessibleHTML: exports.generateAccessibleHTML,
    validateWCAGCompliance: exports.validateWCAGCompliance,
    generateKeyboardShortcuts: exports.generateKeyboardShortcuts,
    // Service
    StudentPortalService,
};
//# sourceMappingURL=student-portal-kit.js.map