/**
 * LOC: EDU-COMP-PORTAL-001
 * File: /reuse/education/composites/student-portal-services-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../student-portal-kit
 *   - ../student-records-kit
 *   - ../course-registration-kit
 *   - ../financial-aid-kit
 *   - ../student-billing-kit
 *   - ../grading-assessment-kit
 *   - ../student-communication-kit
 *
 * DOWNSTREAM (imported by):
 *   - Student portal controllers
 *   - Self-service modules
 *   - Dashboard rendering services
 *   - Widget management systems
 *   - Mobile app services
 */
import { Sequelize } from 'sequelize';
import { PortalUserData, DashboardData, WidgetData, DashboardWidgetData, AnnouncementData, QuickLinkData, AccessibilitySettingsData, NotificationPreferenceData, PortalAnalyticsData } from '../student-portal-kit';
/**
 * Widget category
 */
export type WidgetCategory = 'academic' | 'financial' | 'social' | 'administrative' | 'wellness';
/**
 * Notification channel
 */
export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';
/**
 * Action priority
 */
export type ActionPriority = 'low' | 'medium' | 'high' | 'urgent';
/**
 * Service category
 */
export type ServiceCategory = 'academic' | 'financial' | 'administrative' | 'student_life' | 'support';
/**
 * Student action item requiring attention
 */
export interface ActionItemData {
    studentId: string;
    actionType: 'registration' | 'payment' | 'document' | 'form' | 'meeting' | 'deadline';
    title: string;
    description: string;
    priority: ActionPriority;
    dueDate?: Date;
    actionUrl: string;
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    completedDate?: Date;
    category: ServiceCategory;
}
/**
 * Student document with access control
 */
export interface StudentDocumentData {
    studentId: string;
    documentType: 'transcript' | 'diploma' | 'tax_form' | 'financial_aid' | 'id_card' | 'other';
    documentName: string;
    documentUrl: string;
    uploadedDate: Date;
    expiryDate?: Date;
    isVerified: boolean;
    accessLevel: 'public' | 'restricted' | 'private';
    downloadCount: number;
}
/**
 * Portal notification with read tracking
 */
export interface PortalNotificationData {
    recipientId: string;
    notificationType: 'announcement' | 'reminder' | 'alert' | 'message' | 'system';
    title: string;
    content: string;
    priority: ActionPriority;
    category: ServiceCategory;
    actionUrl?: string;
    actionLabel?: string;
    sentDate: Date;
    isRead: boolean;
    readDate?: Date;
    expiresAt?: Date;
}
/**
 * Academic calendar event
 */
export interface CalendarEventData {
    eventType: 'class' | 'exam' | 'assignment' | 'deadline' | 'holiday' | 'event';
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    location?: string;
    isAllDay: boolean;
    isRecurring: boolean;
    recurrencePattern?: string;
    courseId?: string;
    color?: string;
    reminders?: Date[];
}
/**
 * Service request submission
 */
export interface ServiceRequestData {
    studentId: string;
    requestType: 'transcript' | 'enrollment_verification' | 'id_replacement' | 'schedule_change' | 'other';
    category: ServiceCategory;
    description: string;
    urgency: ActionPriority;
    submittedDate: Date;
    preferredContactMethod: NotificationChannel;
    status: 'submitted' | 'in_progress' | 'completed' | 'cancelled';
    assignedTo?: string;
    completionDate?: Date;
    notes?: string;
}
/**
 * Financial summary for student
 */
export interface FinancialSummaryData {
    studentId: string;
    currentBalance: number;
    upcomingPayments: Array<{
        description: string;
        amount: number;
        dueDate: Date;
        isPaid: boolean;
    }>;
    financialAidTotal: number;
    scholarshipTotal: number;
    loanTotal: number;
    workStudyTotal: number;
    paymentPlan?: {
        planType: string;
        installmentAmount: number;
        nextPaymentDate: Date;
    };
}
/**
 * Academic progress snapshot
 */
export interface AcademicProgressData {
    studentId: string;
    currentGPA: number;
    cumulativeGPA: number;
    creditsCompleted: number;
    creditsInProgress: number;
    creditsRequired: number;
    progressPercentage: number;
    anticipatedGraduation: string;
    degreeProgram: string;
    major?: string;
    minor?: string;
    academicStanding: 'good' | 'probation' | 'warning' | 'suspension';
}
/**
 * Course schedule view
 */
export interface CourseScheduleData {
    studentId: string;
    term: string;
    courses: Array<{
        courseId: string;
        courseCode: string;
        courseName: string;
        credits: number;
        instructor: string;
        schedule: Array<{
            dayOfWeek: string;
            startTime: string;
            endTime: string;
            location: string;
        }>;
        grade?: string;
        status: 'enrolled' | 'waitlisted' | 'dropped';
    }>;
}
/**
 * Degree audit status
 */
export interface DegreeAuditData {
    studentId: string;
    degreeProgram: string;
    major: string;
    auditDate: Date;
    overallProgress: number;
    requirementGroups: Array<{
        groupName: string;
        required: number;
        completed: number;
        inProgress: number;
        status: 'complete' | 'in_progress' | 'not_started';
    }>;
    missingRequirements: string[];
    anticipatedCompletion: Date;
}
/**
 * Portal theme customization
 */
export interface ThemeCustomizationData {
    userId: string;
    primaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
    fontSize?: 'small' | 'medium' | 'large' | 'xlarge';
    compactMode: boolean;
    darkMode: boolean;
    highContrast: boolean;
    customCSS?: string;
}
/**
 * Support ticket
 */
export interface SupportTicketData {
    studentId: string;
    category: 'technical' | 'academic' | 'financial' | 'general';
    subject: string;
    description: string;
    priority: ActionPriority;
    submittedDate: Date;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    assignedTo?: string;
    responses?: Array<{
        responderId: string;
        response: string;
        timestamp: Date;
    }>;
    resolvedDate?: Date;
}
/**
 * Sequelize model for Action Items with tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     ActionItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         studentId:
 *           type: string
 *         title:
 *           type: string
 *         priority:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed, overdue]
 */
export declare const createActionItemModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        actionType: string;
        title: string;
        description: string;
        priority: ActionPriority;
        dueDate: Date | null;
        actionUrl: string;
        status: string;
        completedDate: Date | null;
        category: ServiceCategory;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Portal Notifications.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     PortalNotification:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         recipientId:
 *           type: string
 *         title:
 *           type: string
 *         isRead:
 *           type: boolean
 */
export declare const createPortalNotificationModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        recipientId: string;
        notificationType: string;
        title: string;
        content: string;
        priority: ActionPriority;
        category: ServiceCategory;
        actionUrl: string | null;
        actionLabel: string | null;
        sentDate: Date;
        isRead: boolean;
        readDate: Date | null;
        expiresAt: Date | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Student Portal & Services Composite Service
 *
 * Provides comprehensive student portal, self-service capabilities, and student-facing services
 * for modern higher education institutions.
 */
export declare class StudentPortalServicesCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Creates student portal user account.
     *
     * @param {PortalUserData} userData - User data
     * @returns {Promise<any>} Created portal user
     *
     * @example
     * ```typescript
     * const user = await service.createPortalUser({
     *   userId: 'USR001',
     *   studentId: 'STU12345',
     *   userName: 'jsmith',
     *   email: 'john.smith@university.edu',
     *   theme: 'light',
     *   language: 'en',
     *   timezone: 'America/New_York'
     * });
     * ```
     */
    createPortalUser(userData: PortalUserData): Promise<any>;
    /**
     * 2. Authenticates student portal login.
     *
     * @param {string} userName - Username
     * @param {string} password - Password
     * @returns {Promise<any>} Authentication result
     *
     * @example
     * ```typescript
     * const auth = await service.authenticatePortalLogin('jsmith', 'password123');
     * if (auth.success) {
     *   console.log('Token:', auth.token);
     * }
     * ```
     */
    authenticatePortalLogin(userName: string, password: string): Promise<any>;
    /**
     * 3. Updates student portal preferences.
     *
     * @param {string} userId - User ID
     * @param {Partial<PortalUserData>} preferences - Preferences to update
     * @returns {Promise<any>} Updated user preferences
     *
     * @example
     * ```typescript
     * await service.updatePortalPreferences('USR001', {
     *   theme: 'dark',
     *   language: 'es',
     *   timezone: 'America/Los_Angeles'
     * });
     * ```
     */
    updatePortalPreferences(userId: string, preferences: Partial<PortalUserData>): Promise<any>;
    /**
     * 4. Configures accessibility settings.
     *
     * @param {AccessibilitySettingsData} settings - Accessibility settings
     * @returns {Promise<any>} Configured settings
     *
     * @example
     * ```typescript
     * await service.configureAccessibilitySettings({
     *   userId: 'USR001',
     *   highContrast: true,
     *   fontSize: 'large',
     *   screenReader: true,
     *   reducedMotion: true
     * });
     * ```
     */
    configureAccessibilitySettings(settings: AccessibilitySettingsData): Promise<any>;
    /**
     * 5. Tracks portal login activity.
     *
     * @param {string} userId - User ID
     * @returns {Promise<any>} Login activity
     *
     * @example
     * ```typescript
     * const activity = await service.trackLoginActivity('USR001');
     * console.log(`Last login: ${activity.lastLogin}`);
     * ```
     */
    trackLoginActivity(userId: string): Promise<any>;
    /**
     * 6. Resets portal password.
     *
     * @param {string} email - User email
     * @returns {Promise<any>} Password reset result
     *
     * @example
     * ```typescript
     * await service.resetPortalPassword('john.smith@university.edu');
     * ```
     */
    resetPortalPassword(email: string): Promise<any>;
    /**
     * 7. Creates personalized student dashboard.
     *
     * @param {DashboardData} dashboardData - Dashboard configuration
     * @returns {Promise<any>} Created dashboard
     *
     * @example
     * ```typescript
     * const dashboard = await service.createStudentDashboard({
     *   userId: 'USR001',
     *   dashboardName: 'My Academic Dashboard',
     *   layout: 'grid',
     *   columns: 3,
     *   isDefault: true
     * });
     * ```
     */
    createStudentDashboard(dashboardData: DashboardData): Promise<any>;
    /**
     * 8. Adds widget to student dashboard.
     *
     * @param {DashboardWidgetData} widgetData - Widget placement data
     * @returns {Promise<any>} Added widget
     *
     * @example
     * ```typescript
     * await service.addWidgetToDashboard({
     *   dashboardId: 'dashboard-123',
     *   widgetId: 'widget-grades',
     *   position: { x: 0, y: 0 },
     *   size: { width: 1, height: 1 },
     *   isVisible: true
     * });
     * ```
     */
    addWidgetToDashboard(widgetData: DashboardWidgetData): Promise<any>;
    /**
     * 9. Customizes dashboard widget layout.
     *
     * @param {string} dashboardId - Dashboard ID
     * @param {DashboardWidgetData[]} widgets - Widget configurations
     * @returns {Promise<any>} Updated dashboard
     *
     * @example
     * ```typescript
     * await service.customizeDashboardLayout('dashboard-123', [
     *   { widgetId: 'grades', position: { x: 0, y: 0 }, size: { width: 2, height: 1 } },
     *   { widgetId: 'schedule', position: { x: 2, y: 0 }, size: { width: 1, height: 2 } }
     * ]);
     * ```
     */
    customizeDashboardLayout(dashboardId: string, widgets: DashboardWidgetData[]): Promise<any>;
    /**
     * 10. Retrieves available dashboard widgets.
     *
     * @param {WidgetCategory} category - Widget category filter
     * @returns {Promise<WidgetData[]>} Available widgets
     *
     * @example
     * ```typescript
     * const academicWidgets = await service.getAvailableWidgets('academic');
     * ```
     */
    getAvailableWidgets(category?: WidgetCategory): Promise<WidgetData[]>;
    /**
     * 11. Configures widget-specific settings.
     *
     * @param {string} widgetId - Widget ID
     * @param {any} configuration - Widget configuration
     * @returns {Promise<any>} Updated widget
     *
     * @example
     * ```typescript
     * await service.configureWidgetSettings('widget-grades', {
     *   showGPA: true,
     *   termFilter: 'current',
     *   displayMode: 'detailed'
     * });
     * ```
     */
    configureWidgetSettings(widgetId: string, configuration: any): Promise<any>;
    /**
     * 12. Renders widget data for display.
     *
     * @param {string} widgetId - Widget ID
     * @param {string} userId - User ID
     * @returns {Promise<any>} Rendered widget data
     *
     * @example
     * ```typescript
     * const widgetData = await service.renderWidgetData('widget-grades', 'USR001');
     * ```
     */
    renderWidgetData(widgetId: string, userId: string): Promise<any>;
    /**
     * 13. Manages dashboard quick links.
     *
     * @param {QuickLinkData} linkData - Quick link data
     * @returns {Promise<any>} Created quick link
     *
     * @example
     * ```typescript
     * await service.addQuickLink({
     *   userId: 'USR001',
     *   linkTitle: 'Course Registration',
     *   linkUrl: '/registration',
     *   icon: 'calendar',
     *   category: 'Academic',
     *   sortOrder: 1
     * });
     * ```
     */
    addQuickLink(linkData: QuickLinkData): Promise<any>;
    /**
     * 14. Exports dashboard configuration.
     *
     * @param {string} dashboardId - Dashboard ID
     * @returns {Promise<any>} Dashboard export
     *
     * @example
     * ```typescript
     * const config = await service.exportDashboardConfig('dashboard-123');
     * // Can be imported to restore configuration
     * ```
     */
    exportDashboardConfig(dashboardId: string): Promise<any>;
    /**
     * 15. Creates campus-wide announcement.
     *
     * @param {AnnouncementData} announcementData - Announcement data
     * @returns {Promise<any>} Created announcement
     *
     * @example
     * ```typescript
     * const announcement = await service.createAnnouncement({
     *   title: 'Spring Registration Opens Monday',
     *   content: 'Registration for Spring 2025 begins on November 1...',
     *   category: 'academic',
     *   priority: 'high',
     *   publishedAt: new Date(),
     *   expiresAt: new Date('2024-11-01'),
     *   targetAudience: ['undergraduate', 'graduate'],
     *   authorId: 'admin-123'
     * });
     * ```
     */
    createAnnouncement(announcementData: AnnouncementData): Promise<any>;
    /**
     * 16. Sends portal notification to student.
     *
     * @param {PortalNotificationData} notificationData - Notification data
     * @returns {Promise<any>} Sent notification
     *
     * @example
     * ```typescript
     * await service.sendPortalNotification({
     *   recipientId: 'STU12345',
     *   notificationType: 'reminder',
     *   title: 'Payment Due Soon',
     *   content: 'Your tuition payment is due in 5 days',
     *   priority: 'high',
     *   category: 'financial',
     *   actionUrl: '/billing',
     *   actionLabel: 'View Balance',
     *   sentDate: new Date(),
     *   isRead: false
     * });
     * ```
     */
    sendPortalNotification(notificationData: PortalNotificationData): Promise<any>;
    /**
     * 17. Retrieves student notifications.
     *
     * @param {string} studentId - Student ID
     * @param {boolean} unreadOnly - Filter for unread only
     * @returns {Promise<any[]>} Notifications
     *
     * @example
     * ```typescript
     * const unread = await service.getStudentNotifications('STU12345', true);
     * console.log(`${unread.length} unread notifications`);
     * ```
     */
    getStudentNotifications(studentId: string, unreadOnly?: boolean): Promise<any[]>;
    /**
     * 18. Marks notification as read.
     *
     * @param {string} notificationId - Notification ID
     * @returns {Promise<any>} Updated notification
     *
     * @example
     * ```typescript
     * await service.markNotificationAsRead('notif-123');
     * ```
     */
    markNotificationAsRead(notificationId: string): Promise<any>;
    /**
     * 19. Configures notification preferences.
     *
     * @param {NotificationPreferenceData} preferences - Notification preferences
     * @returns {Promise<any>} Saved preferences
     *
     * @example
     * ```typescript
     * await service.configureNotificationPreferences({
     *   userId: 'USR001',
     *   emailNotifications: true,
     *   smsNotifications: false,
     *   pushNotifications: true,
     *   notificationCategories: {
     *     academic: true,
     *     financial: true,
     *     social: false
     *   },
     *   digestFrequency: 'daily'
     * });
     * ```
     */
    configureNotificationPreferences(preferences: NotificationPreferenceData): Promise<any>;
    /**
     * 20. Deletes expired notifications.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<number>} Number of deleted notifications
     *
     * @example
     * ```typescript
     * const deleted = await service.deleteExpiredNotifications('STU12345');
     * console.log(`Deleted ${deleted} expired notifications`);
     * ```
     */
    deleteExpiredNotifications(studentId: string): Promise<number>;
    /**
     * 21. Generates notification delivery report.
     *
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<any>} Delivery report
     *
     * @example
     * ```typescript
     * const report = await service.generateNotificationReport(
     *   new Date('2024-10-01'),
     *   new Date('2024-10-31')
     * );
     * ```
     */
    generateNotificationReport(startDate: Date, endDate: Date): Promise<any>;
    /**
     * 22. Retrieves student course schedule.
     *
     * @param {string} studentId - Student ID
     * @param {string} term - Term
     * @returns {Promise<CourseScheduleData>} Course schedule
     *
     * @example
     * ```typescript
     * const schedule = await service.getStudentSchedule('STU12345', 'Fall 2024');
     * console.log(`Enrolled in ${schedule.courses.length} courses`);
     * ```
     */
    getStudentSchedule(studentId: string, term: string): Promise<CourseScheduleData>;
    /**
     * 23. Retrieves current grades and GPA.
     *
     * @param {string} studentId - Student ID
     * @param {string} term - Term
     * @returns {Promise<any>} Grades and GPA
     *
     * @example
     * ```typescript
     * const grades = await service.getCurrentGrades('STU12345', 'Fall 2024');
     * console.log(`Current GPA: ${grades.termGPA}`);
     * ```
     */
    getCurrentGrades(studentId: string, term: string): Promise<any>;
    /**
     * 24. Generates academic progress report.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<AcademicProgressData>} Progress report
     *
     * @example
     * ```typescript
     * const progress = await service.getAcademicProgress('STU12345');
     * console.log(`Progress: ${progress.progressPercentage}%`);
     * ```
     */
    getAcademicProgress(studentId: string): Promise<AcademicProgressData>;
    /**
     * 25. Retrieves degree audit information.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<DegreeAuditData>} Degree audit
     *
     * @example
     * ```typescript
     * const audit = await service.getDegreeAudit('STU12345');
     * console.log(`Missing requirements: ${audit.missingRequirements.length}`);
     * ```
     */
    getDegreeAudit(studentId: string): Promise<DegreeAuditData>;
    /**
     * 26. Requests official transcript.
     *
     * @param {string} studentId - Student ID
     * @param {any} requestDetails - Request details
     * @returns {Promise<any>} Transcript request
     *
     * @example
     * ```typescript
     * await service.requestOfficialTranscript('STU12345', {
     *   recipientName: 'Graduate School',
     *   recipientAddress: '123 University Ave',
     *   deliveryMethod: 'electronic',
     *   urgency: 'standard'
     * });
     * ```
     */
    requestOfficialTranscript(studentId: string, requestDetails: any): Promise<any>;
    /**
     * 27. Retrieves academic calendar events.
     *
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<CalendarEventData[]>} Calendar events
     *
     * @example
     * ```typescript
     * const events = await service.getAcademicCalendar(
     *   new Date('2024-10-01'),
     *   new Date('2024-10-31')
     * );
     * ```
     */
    getAcademicCalendar(startDate: Date, endDate: Date): Promise<CalendarEventData[]>;
    /**
     * 28. Enrolls student in course section.
     *
     * @param {string} studentId - Student ID
     * @param {string} sectionId - Course section ID
     * @returns {Promise<any>} Enrollment result
     *
     * @example
     * ```typescript
     * const enrollment = await service.enrollInCourse('STU12345', 'SEC-CS101-01');
     * if (enrollment.success) {
     *   console.log('Successfully enrolled!');
     * }
     * ```
     */
    enrollInCourse(studentId: string, sectionId: string): Promise<any>;
    /**
     * 29. Drops student from course section.
     *
     * @param {string} studentId - Student ID
     * @param {string} sectionId - Course section ID
     * @returns {Promise<any>} Drop result
     *
     * @example
     * ```typescript
     * await service.dropCourse('STU12345', 'SEC-CS101-01');
     * ```
     */
    dropCourse(studentId: string, sectionId: string): Promise<any>;
    /**
     * 30. Retrieves student financial summary.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<FinancialSummaryData>} Financial summary
     *
     * @example
     * ```typescript
     * const financial = await service.getFinancialSummary('STU12345');
     * console.log(`Current balance: $${financial.currentBalance}`);
     * ```
     */
    getFinancialSummary(studentId: string): Promise<FinancialSummaryData>;
    /**
     * 31. Processes online payment.
     *
     * @param {string} studentId - Student ID
     * @param {number} amount - Payment amount
     * @param {any} paymentMethod - Payment method
     * @returns {Promise<any>} Payment confirmation
     *
     * @example
     * ```typescript
     * const payment = await service.processOnlinePayment('STU12345', 1500, {
     *   type: 'credit_card',
     *   cardNumber: '****1234'
     * });
     * console.log(`Transaction ID: ${payment.transactionId}`);
     * ```
     */
    processOnlinePayment(studentId: string, amount: number, paymentMethod: any): Promise<any>;
    /**
     * 32. Views financial aid package details.
     *
     * @param {string} studentId - Student ID
     * @param {string} awardYear - Award year
     * @returns {Promise<any>} Financial aid package
     *
     * @example
     * ```typescript
     * const aid = await service.viewFinancialAidPackage('STU12345', '2024-2025');
     * ```
     */
    viewFinancialAidPackage(studentId: string, awardYear: string): Promise<any>;
    /**
     * 33. Generates billing statement.
     *
     * @param {string} studentId - Student ID
     * @param {string} term - Term
     * @returns {Promise<any>} Billing statement
     *
     * @example
     * ```typescript
     * const statement = await service.generateBillingStatement('STU12345', 'Fall 2024');
     * ```
     */
    generateBillingStatement(studentId: string, term: string): Promise<any>;
    /**
     * 34. Sets up payment plan.
     *
     * @param {string} studentId - Student ID
     * @param {any} planDetails - Plan details
     * @returns {Promise<any>} Payment plan
     *
     * @example
     * ```typescript
     * const plan = await service.setupPaymentPlan('STU12345', {
     *   totalAmount: 5000,
     *   installments: 5,
     *   startDate: new Date('2024-09-01')
     * });
     * ```
     */
    setupPaymentPlan(studentId: string, planDetails: any): Promise<any>;
    /**
     * 35. Downloads tax documents (1098-T).
     *
     * @param {string} studentId - Student ID
     * @param {number} taxYear - Tax year
     * @returns {Promise<any>} Tax document
     *
     * @example
     * ```typescript
     * const doc = await service.downloadTaxDocument('STU12345', 2024);
     * console.log(`Download URL: ${doc.downloadUrl}`);
     * ```
     */
    downloadTaxDocument(studentId: string, taxYear: number): Promise<any>;
    /**
     * 36. Submits general service request.
     *
     * @param {ServiceRequestData} requestData - Service request data
     * @returns {Promise<any>} Service request
     *
     * @example
     * ```typescript
     * const request = await service.submitServiceRequest({
     *   studentId: 'STU12345',
     *   requestType: 'id_replacement',
     *   category: 'administrative',
     *   description: 'Lost student ID card',
     *   urgency: 'medium',
     *   submittedDate: new Date(),
     *   preferredContactMethod: 'email',
     *   status: 'submitted'
     * });
     * ```
     */
    submitServiceRequest(requestData: ServiceRequestData): Promise<any>;
    /**
     * 37. Tracks service request status.
     *
     * @param {string} requestId - Request ID
     * @returns {Promise<any>} Request status
     *
     * @example
     * ```typescript
     * const status = await service.trackServiceRequest('request-123');
     * console.log(`Status: ${status.currentStatus}`);
     * ```
     */
    trackServiceRequest(requestId: string): Promise<any>;
    /**
     * 38. Creates support ticket.
     *
     * @param {SupportTicketData} ticketData - Ticket data
     * @returns {Promise<any>} Created ticket
     *
     * @example
     * ```typescript
     * const ticket = await service.createSupportTicket({
     *   studentId: 'STU12345',
     *   category: 'technical',
     *   subject: 'Cannot access course materials',
     *   description: 'Getting error 404 when clicking on assignments',
     *   priority: 'high',
     *   submittedDate: new Date(),
     *   status: 'open'
     * });
     * ```
     */
    createSupportTicket(ticketData: SupportTicketData): Promise<any>;
    /**
     * 39. Retrieves student action items.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<ActionItemData[]>} Action items
     *
     * @example
     * ```typescript
     * const actions = await service.getStudentActionItems('STU12345');
     * console.log(`${actions.length} action items pending`);
     * ```
     */
    getStudentActionItems(studentId: string): Promise<ActionItemData[]>;
    /**
     * 40. Completes action item.
     *
     * @param {string} actionItemId - Action item ID
     * @returns {Promise<any>} Updated action item
     *
     * @example
     * ```typescript
     * await service.completeActionItem('action-123');
     * ```
     */
    completeActionItem(actionItemId: string): Promise<any>;
    /**
     * 41. Accesses student documents.
     *
     * @param {string} studentId - Student ID
     * @param {string} documentType - Document type filter
     * @returns {Promise<StudentDocumentData[]>} Documents
     *
     * @example
     * ```typescript
     * const transcripts = await service.getStudentDocuments('STU12345', 'transcript');
     * ```
     */
    getStudentDocuments(studentId: string, documentType?: string): Promise<StudentDocumentData[]>;
    /**
     * 42. Tracks portal analytics and usage.
     *
     * @param {PortalAnalyticsData} analyticsData - Analytics data
     * @returns {Promise<any>} Recorded analytics
     *
     * @example
     * ```typescript
     * await service.trackPortalAnalytics({
     *   userId: 'USR001',
     *   eventType: 'page_view',
     *   eventCategory: 'grades',
     *   timestamp: new Date(),
     *   sessionId: 'session-abc123'
     * });
     * ```
     */
    trackPortalAnalytics(analyticsData: PortalAnalyticsData): Promise<any>;
    /**
     * 43. Generates portal usage report.
     *
     * @param {string} userId - User ID
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<any>} Usage report
     *
     * @example
     * ```typescript
     * const report = await service.generatePortalUsageReport(
     *   'USR001',
     *   new Date('2024-10-01'),
     *   new Date('2024-10-31')
     * );
     * ```
     */
    generatePortalUsageReport(userId: string, startDate: Date, endDate: Date): Promise<any>;
    /**
     * 44. Generates comprehensive student portal dashboard.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<any>} Complete dashboard data
     *
     * @example
     * ```typescript
     * const dashboard = await service.generateCompleteDashboard('STU12345');
     * // Returns all data needed for student portal homepage
     * ```
     */
    generateCompleteDashboard(studentId: string): Promise<any>;
}
export default StudentPortalServicesCompositeService;
//# sourceMappingURL=student-portal-services-composite.d.ts.map