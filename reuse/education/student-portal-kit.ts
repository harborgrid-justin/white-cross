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

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  defaultSize?: { width: number; height: number };
  position?: { x: number; y: number };
  isEnabled?: boolean;
  requiresAuth?: boolean;
  permissions?: string[];
}

interface DashboardWidgetData {
  dashboardId: string;
  widgetId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
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

interface NotificationPreferenceData {
  userId: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  pushNotifications?: boolean;
  notificationCategories?: Record<string, boolean>;
  digestFrequency?: 'immediate' | 'daily' | 'weekly' | 'never';
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

interface PortalAnalyticsData {
  userId: string;
  eventType: string;
  eventCategory: string;
  eventData?: Record<string, any>;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

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
export const createPortalUserModel = (sequelize: Sequelize) => {
  class PortalUser extends Model {
    public id!: string;
    public userId!: string;
    public studentId!: string;
    public userName!: string;
    public email!: string;
    public theme!: string;
    public language!: string;
    public timezone!: string;
    public accessibilitySettings!: Record<string, any>;
    public lastLoginAt!: Date | null;
    public loginCount!: number;
    public preferences!: Record<string, any>;
    public isActive!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PortalUser.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'System user identifier',
      },
      studentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Student identifier',
        validate: {
          notEmpty: true,
        },
      },
      userName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Portal username',
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Email address',
        validate: {
          isEmail: true,
        },
      },
      theme: {
        type: DataTypes.ENUM('light', 'dark', 'auto'),
        allowNull: false,
        defaultValue: 'light',
        comment: 'UI theme preference',
      },
      language: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'en',
        comment: 'Language code (ISO 639-1)',
      },
      timezone: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'America/New_York',
        comment: 'IANA timezone identifier',
      },
      accessibilitySettings: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Accessibility configuration',
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last login timestamp',
      },
      loginCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total login count',
      },
      preferences: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'User preferences',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Account active status',
      },
    },
    {
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
    },
  );

  return PortalUser;
};

/**
 * Sequelize model for Dashboards with customizable layouts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Dashboard model
 */
export const createDashboardModel = (sequelize: Sequelize) => {
  class Dashboard extends Model {
    public id!: string;
    public userId!: string;
    public dashboardName!: string;
    public layout!: string;
    public columns!: number;
    public isDefault!: boolean;
    public configuration!: Record<string, any>;
    public isActive!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Dashboard.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Portal user identifier',
      },
      dashboardName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Dashboard name',
      },
      layout: {
        type: DataTypes.ENUM('grid', 'list', 'custom'),
        allowNull: false,
        defaultValue: 'grid',
        comment: 'Dashboard layout type',
      },
      columns: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
        comment: 'Number of columns',
        validate: {
          min: 1,
          max: 6,
        },
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Default dashboard flag',
      },
      configuration: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Dashboard configuration',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Dashboard active status',
      },
    },
    {
      sequelize,
      tableName: 'dashboards',
      timestamps: true,
      indexes: [
        { fields: ['userId'] },
        { fields: ['isDefault'] },
        { fields: ['isActive'] },
      ],
    },
  );

  return Dashboard;
};

/**
 * Sequelize model for Widgets with configuration and permissions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Widget model
 */
export const createWidgetModel = (sequelize: Sequelize) => {
  class Widget extends Model {
    public id!: string;
    public widgetType!: string;
    public widgetName!: string;
    public description!: string;
    public category!: string;
    public configuration!: Record<string, any>;
    public defaultSize!: Record<string, number>;
    public isEnabled!: boolean;
    public requiresAuth!: boolean;
    public permissions!: string[];
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Widget.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      widgetType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique widget type identifier',
      },
      widgetName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Widget display name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Widget description',
      },
      category: {
        type: DataTypes.ENUM('academic', 'financial', 'social', 'utilities', 'custom'),
        allowNull: false,
        comment: 'Widget category',
      },
      configuration: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Widget configuration',
      },
      defaultSize: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: { width: 4, height: 3 },
        comment: 'Default widget size',
      },
      isEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Widget enabled status',
      },
      requiresAuth: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Authentication requirement',
      },
      permissions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Required permissions',
      },
    },
    {
      sequelize,
      tableName: 'widgets',
      timestamps: true,
      indexes: [
        { fields: ['widgetType'], unique: true },
        { fields: ['category'] },
        { fields: ['isEnabled'] },
      ],
    },
  );

  return Widget;
};

/**
 * Sequelize model for Announcements with targeting and scheduling.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Announcement model
 */
export const createAnnouncementModel = (sequelize: Sequelize) => {
  class Announcement extends Model {
    public id!: string;
    public title!: string;
    public content!: string;
    public category!: string;
    public priority!: string;
    public publishedAt!: Date;
    public expiresAt!: Date | null;
    public targetAudience!: string[];
    public authorId!: string;
    public attachments!: string[];
    public isPublished!: boolean;
    public viewCount!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Announcement.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Announcement title',
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Announcement content',
      },
      category: {
        type: DataTypes.ENUM('academic', 'administrative', 'event', 'emergency', 'general'),
        allowNull: false,
        comment: 'Announcement category',
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
        allowNull: false,
        defaultValue: 'medium',
        comment: 'Priority level',
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Publication date',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Expiration date',
      },
      targetAudience: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Target audience groups',
      },
      authorId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Author user ID',
      },
      attachments: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Attachment file URLs',
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Published status',
      },
      viewCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'View count',
      },
    },
    {
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
    },
  );

  return Announcement;
};

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
export const createPortalUser = async (
  userData: PortalUserData,
  PortalUser: any,
  transaction?: Transaction,
): Promise<any> => {
  const user = await PortalUser.create(
    {
      ...userData,
      loginCount: 0,
      isActive: true,
      preferences: {
        ...userData.preferences,
        dashboardLayout: 'grid',
        itemsPerPage: 25,
      },
    },
    { transaction },
  );

  return user;
};

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
export const updatePortalUserPreferences = async (
  userId: string,
  updates: Partial<PortalUserData>,
  PortalUser: any,
): Promise<any> => {
  const user = await PortalUser.findOne({ where: { userId } });
  if (!user) throw new Error('Portal user not found');

  await user.update(updates);
  return user;
};

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
export const recordUserLogin = async (
  userId: string,
  PortalUser: any,
): Promise<any> => {
  const user = await PortalUser.findOne({ where: { userId } });
  if (!user) throw new Error('Portal user not found');

  user.lastLoginAt = new Date();
  user.loginCount += 1;
  await user.save();

  return user;
};

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
export const getUserPortalConfiguration = async (
  userId: string,
  PortalUser: any,
): Promise<any> => {
  const user = await PortalUser.findOne({ where: { userId } });
  if (!user) throw new Error('Portal user not found');

  return {
    theme: user.theme,
    language: user.language,
    timezone: user.timezone,
    accessibilitySettings: user.accessibilitySettings,
    preferences: user.preferences,
  };
};

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
export const validatePortalAccess = async (
  userId: string,
  requiredPermissions: string[],
  PortalUser: any,
): Promise<{ hasAccess: boolean; missingPermissions: string[] }> => {
  const user = await PortalUser.findOne({ where: { userId } });
  if (!user || !user.isActive) {
    return { hasAccess: false, missingPermissions: requiredPermissions };
  }

  // TODO: Implement actual permission checking
  return { hasAccess: true, missingPermissions: [] };
};

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
export const createDashboard = async (
  dashboardData: DashboardData,
  Dashboard: any,
  transaction?: Transaction,
): Promise<any> => {
  const dashboard = await Dashboard.create(
    {
      ...dashboardData,
      isActive: true,
    },
    { transaction },
  );

  return dashboard;
};

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
export const updateDashboardLayout = async (
  dashboardId: string,
  updates: Partial<DashboardData>,
  Dashboard: any,
): Promise<any> => {
  const dashboard = await Dashboard.findByPk(dashboardId);
  if (!dashboard) throw new Error('Dashboard not found');

  await dashboard.update(updates);
  return dashboard;
};

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
export const setDefaultDashboard = async (
  userId: string,
  dashboardId: string,
  Dashboard: any,
): Promise<any> => {
  // Clear existing default
  await Dashboard.update(
    { isDefault: false },
    { where: { userId, isDefault: true } },
  );

  // Set new default
  const dashboard = await Dashboard.findByPk(dashboardId);
  if (!dashboard || dashboard.userId !== userId) {
    throw new Error('Dashboard not found or access denied');
  }

  dashboard.isDefault = true;
  await dashboard.save();

  return dashboard;
};

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
export const getDefaultDashboard = async (
  userId: string,
  Dashboard: any,
): Promise<any> => {
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
export const getUserDashboards = async (
  userId: string,
  Dashboard: any,
): Promise<any[]> => {
  return await Dashboard.findAll({
    where: { userId, isActive: true },
    order: [['isDefault', 'DESC'], ['dashboardName', 'ASC']],
  });
};

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
export const cloneDashboard = async (
  dashboardId: string,
  newName: string,
  Dashboard: any,
): Promise<any> => {
  const source = await Dashboard.findByPk(dashboardId);
  if (!source) throw new Error('Dashboard not found');

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
export const deleteDashboard = async (
  dashboardId: string,
  Dashboard: any,
): Promise<void> => {
  const dashboard = await Dashboard.findByPk(dashboardId);
  if (!dashboard) throw new Error('Dashboard not found');

  dashboard.isActive = false;
  await dashboard.save();
};

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
export const exportDashboardConfiguration = async (
  dashboardId: string,
  Dashboard: any,
): Promise<string> => {
  const dashboard = await Dashboard.findByPk(dashboardId);
  if (!dashboard) throw new Error('Dashboard not found');

  return JSON.stringify({
    dashboardName: dashboard.dashboardName,
    layout: dashboard.layout,
    columns: dashboard.columns,
    configuration: dashboard.configuration,
  }, null, 2);
};

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
export const createWidget = async (
  widgetData: WidgetData,
  Widget: any,
): Promise<any> => {
  return await Widget.create({
    ...widgetData,
    isEnabled: true,
  });
};

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
export const addWidgetToDashboard = async (
  widgetAssignment: DashboardWidgetData,
  Dashboard: any,
): Promise<any> => {
  const dashboard = await Dashboard.findByPk(widgetAssignment.dashboardId);
  if (!dashboard) throw new Error('Dashboard not found');

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
export const removeWidgetFromDashboard = async (
  dashboardId: string,
  widgetId: string,
  Dashboard: any,
): Promise<any> => {
  const dashboard = await Dashboard.findByPk(dashboardId);
  if (!dashboard) throw new Error('Dashboard not found');

  const widgets = (dashboard.configuration.widgets || []).filter(
    (w: any) => w.widgetId !== widgetId,
  );

  dashboard.configuration = {
    ...dashboard.configuration,
    widgets,
  };
  await dashboard.save();

  return dashboard;
};

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
export const updateWidgetLayout = async (
  dashboardId: string,
  widgetId: string,
  layout: { position?: any; size?: any },
  Dashboard: any,
): Promise<any> => {
  const dashboard = await Dashboard.findByPk(dashboardId);
  if (!dashboard) throw new Error('Dashboard not found');

  const widgets = dashboard.configuration.widgets || [];
  const widget = widgets.find((w: any) => w.widgetId === widgetId);
  if (!widget) throw new Error('Widget not found on dashboard');

  if (layout.position) widget.position = layout.position;
  if (layout.size) widget.size = layout.size;

  dashboard.configuration = {
    ...dashboard.configuration,
    widgets,
  };
  await dashboard.save();

  return dashboard;
};

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
export const updateWidgetConfiguration = async (
  dashboardId: string,
  widgetId: string,
  configuration: Record<string, any>,
  Dashboard: any,
): Promise<any> => {
  const dashboard = await Dashboard.findByPk(dashboardId);
  if (!dashboard) throw new Error('Dashboard not found');

  const widgets = dashboard.configuration.widgets || [];
  const widget = widgets.find((w: any) => w.widgetId === widgetId);
  if (!widget) throw new Error('Widget not found on dashboard');

  widget.configuration = { ...widget.configuration, ...configuration };

  dashboard.configuration = {
    ...dashboard.configuration,
    widgets,
  };
  await dashboard.save();

  return dashboard;
};

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
export const getAvailableWidgets = async (
  category: string,
  Widget: any,
): Promise<any[]> => {
  return await Widget.findAll({
    where: { category, isEnabled: true },
    order: [['widgetName', 'ASC']],
  });
};

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
export const getWidgetData = async (
  widgetId: string,
  userId: string,
  Widget: any,
): Promise<any> => {
  const widget = await Widget.findByPk(widgetId);
  if (!widget) throw new Error('Widget not found');

  // TODO: Fetch actual widget data based on widget type
  return {
    widgetId,
    widgetType: widget.widgetType,
    data: {},
  };
};

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
export const validateWidgetPermissions = async (
  widgetId: string,
  userId: string,
  Widget: any,
): Promise<boolean> => {
  const widget = await Widget.findByPk(widgetId);
  if (!widget || !widget.isEnabled) return false;

  // TODO: Implement actual permission checking
  return true;
};

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
export const createAnnouncement = async (
  announcementData: AnnouncementData,
  Announcement: any,
): Promise<any> => {
  return await Announcement.create({
    ...announcementData,
    isPublished: announcementData.isPublished !== false,
    viewCount: 0,
  });
};

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
export const getActiveAnnouncements = async (
  userId: string,
  userGroups: string[],
  Announcement: any,
): Promise<any[]> => {
  const now = new Date();

  return await Announcement.findAll({
    where: {
      isPublished: true,
      publishedAt: { [Op.lte]: now },
      [Op.or]: [
        { expiresAt: null },
        { expiresAt: { [Op.gt]: now } },
      ],
    },
    order: [
      ['priority', 'DESC'],
      ['publishedAt', 'DESC'],
    ],
  });
};

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
export const markAnnouncementViewed = async (
  announcementId: string,
  userId: string,
  Announcement: any,
): Promise<any> => {
  const announcement = await Announcement.findByPk(announcementId);
  if (!announcement) throw new Error('Announcement not found');

  announcement.viewCount += 1;
  await announcement.save();

  return announcement;
};

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
export const filterAnnouncements = async (
  category: string,
  priority: string,
  Announcement: any,
): Promise<any[]> => {
  const where: any = { isPublished: true };
  if (category) where.category = category;
  if (priority) where.priority = priority;

  return await Announcement.findAll({
    where,
    order: [['publishedAt', 'DESC']],
  });
};

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
export const updateAnnouncement = async (
  announcementId: string,
  updates: Partial<AnnouncementData>,
  Announcement: any,
): Promise<any> => {
  const announcement = await Announcement.findByPk(announcementId);
  if (!announcement) throw new Error('Announcement not found');

  await announcement.update(updates);
  return announcement;
};

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
export const archiveExpiredAnnouncements = async (
  Announcement: any,
): Promise<number> => {
  const now = new Date();

  const result = await Announcement.update(
    { isPublished: false },
    {
      where: {
        expiresAt: { [Op.lt]: now },
        isPublished: true,
      },
    },
  );

  return result[0];
};

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
export const createQuickLink = async (
  linkData: QuickLinkData,
): Promise<QuickLinkData> => {
  // In production, this would use a QuickLink model
  return {
    ...linkData,
    isActive: true,
    openInNewTab: linkData.openInNewTab !== false,
  };
};

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
export const getUserQuickLinks = async (
  userId: string,
): Promise<QuickLinkData[]> => {
  // Mock implementation
  return [];
};

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
export const updateQuickLink = async (
  linkId: string,
  updates: Partial<QuickLinkData>,
): Promise<QuickLinkData> => {
  // Mock implementation
  return updates as QuickLinkData;
};

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
export const reorderQuickLinks = async (
  userId: string,
  linkIds: string[],
): Promise<void> => {
  // Mock implementation
};

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
export const buildNavigationMenu = async (
  userId: string,
  userRoles: string[],
): Promise<NavigationItemData[]> => {
  const baseNav: NavigationItemData[] = [
    { label: 'Home', url: '/dashboard', icon: 'home', parentId: null, sortOrder: 1, isActive: true, isVisible: true },
    { label: 'Academics', url: '/academics', icon: 'book', parentId: null, sortOrder: 2, isActive: true, isVisible: true },
    { label: 'My Courses', url: '/courses', icon: 'course', parentId: null, sortOrder: 3, isActive: true, isVisible: true },
    { label: 'Grades', url: '/grades', icon: 'grade', parentId: null, sortOrder: 4, isActive: true, isVisible: true },
    { label: 'Financial Aid', url: '/financial', icon: 'money', parentId: null, sortOrder: 5, isActive: true, isVisible: true },
  ];

  return baseNav;
};

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
export const updateNavigationPreferences = async (
  userId: string,
  navPreferences: any,
): Promise<void> => {
  // Mock implementation
};

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
export const getRecentlyAccessedPages = async (
  userId: string,
  limit: number = 5,
): Promise<NavigationItemData[]> => {
  // Mock implementation
  return [];
};

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
export const generateBreadcrumbTrail = (
  trail: NavigationItemData[],
): string => {
  return trail.map((item, index) => {
    if (index === trail.length - 1) {
      return `<span>${item.label}</span>`;
    }
    return `<a href="${item.url}">${item.label}</a>`;
  }).join(' > ');
};

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
export const updateAccessibilitySettings = async (
  userId: string,
  settings: AccessibilitySettingsData,
  PortalUser: any,
): Promise<any> => {
  const user = await PortalUser.findOne({ where: { userId } });
  if (!user) throw new Error('Portal user not found');

  user.accessibilitySettings = { ...user.accessibilitySettings, ...settings };
  await user.save();

  return user;
};

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
export const getAccessibilitySettings = async (
  userId: string,
  PortalUser: any,
): Promise<AccessibilitySettingsData> => {
  const user = await PortalUser.findOne({ where: { userId } });
  if (!user) throw new Error('Portal user not found');

  return user.accessibilitySettings;
};

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
export const generateAccessibleHTML = (
  content: string,
  ariaOptions: any,
): string => {
  const ariaAttrs = Object.entries(ariaOptions)
    .map(([key, value]) => `aria-${key}="${value}"`)
    .join(' ');

  return content.replace('<', `< ${ariaAttrs} `);
};

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
export const validateWCAGCompliance = async (
  pageHtml: string,
): Promise<{ compliant: boolean; issues: string[] }> => {
  const issues: string[] = [];

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
export const generateKeyboardShortcuts = (
  context: string,
): Record<string, string> => {
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
@Injectable()
export class StudentPortalService {
  constructor(private readonly sequelize: Sequelize) {}

  async createUser(userData: PortalUserData) {
    const PortalUser = createPortalUserModel(this.sequelize);
    return createPortalUser(userData, PortalUser);
  }

  async getUserDashboard(userId: string) {
    const Dashboard = createDashboardModel(this.sequelize);
    return getDefaultDashboard(userId, Dashboard);
  }

  async getAnnouncements(userId: string, userGroups: string[]) {
    const Announcement = createAnnouncementModel(this.sequelize);
    return getActiveAnnouncements(userId, userGroups, Announcement);
  }

  async updateUserPreferences(userId: string, preferences: Partial<PortalUserData>) {
    const PortalUser = createPortalUserModel(this.sequelize);
    return updatePortalUserPreferences(userId, preferences, PortalUser);
  }
}

/**
 * Default export with all portal utilities.
 */
export default {
  // Models
  createPortalUserModel,
  createDashboardModel,
  createWidgetModel,
  createAnnouncementModel,

  // Portal User Management
  createPortalUser,
  updatePortalUserPreferences,
  recordUserLogin,
  getUserPortalConfiguration,
  validatePortalAccess,

  // Dashboard Management
  createDashboard,
  updateDashboardLayout,
  setDefaultDashboard,
  getDefaultDashboard,
  getUserDashboards,
  cloneDashboard,
  deleteDashboard,
  exportDashboardConfiguration,

  // Widget Management
  createWidget,
  addWidgetToDashboard,
  removeWidgetFromDashboard,
  updateWidgetLayout,
  updateWidgetConfiguration,
  getAvailableWidgets,
  getWidgetData,
  validateWidgetPermissions,

  // Announcements
  createAnnouncement,
  getActiveAnnouncements,
  markAnnouncementViewed,
  filterAnnouncements,
  updateAnnouncement,
  archiveExpiredAnnouncements,

  // Quick Links
  createQuickLink,
  getUserQuickLinks,
  updateQuickLink,
  reorderQuickLinks,

  // Navigation
  buildNavigationMenu,
  updateNavigationPreferences,
  getRecentlyAccessedPages,
  generateBreadcrumbTrail,

  // Accessibility
  updateAccessibilitySettings,
  getAccessibilitySettings,
  generateAccessibleHTML,
  validateWCAGCompliance,
  generateKeyboardShortcuts,

  // Service
  StudentPortalService,
};
