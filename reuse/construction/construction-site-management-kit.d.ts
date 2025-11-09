/**
 * LOC: CNSM9876543
 * File: /reuse/construction/construction-site-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable construction utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend construction services
 *   - Site management modules
 *   - Safety tracking services
 *   - Daily reporting systems
 */
/**
 * File: /reuse/construction/construction-site-management-kit.ts
 * Locator: WC-CONST-SITE-001
 * Purpose: Enterprise-grade Construction Site Management - site logistics, access control, safety management, emergency response, daily logs, weather tracking, meetings, communication
 *
 * Upstream: Independent utility module for construction site operations
 * Downstream: ../backend/construction/*, site controllers, safety services, reporting modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ functions for site management competing with Procore and PlanGrid enterprise platforms
 *
 * LLM Context: Comprehensive construction site management utilities for production-ready applications.
 * Provides site logistics planning, personnel access control, equipment tracking, site safety management,
 * emergency response coordination, daily log/diary management, weather tracking, delay documentation,
 * site meetings management, communication logs, incident reporting, inspection tracking, and compliance monitoring.
 */
import { Transaction, WhereOptions } from 'sequelize';
/**
 * Creates a new construction site with full logistics setup.
 *
 * @param {SiteLogisticsData} siteData - Site logistics data
 * @param {Model} ConstructionSite - ConstructionSite model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created site
 *
 * @example
 * ```typescript
 * const site = await createConstructionSite(siteData, ConstructionSite);
 * ```
 */
export declare const createConstructionSite: (siteData: SiteLogisticsData, ConstructionSite: any, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves active construction sites with comprehensive details.
 *
 * @param {Model} ConstructionSite - ConstructionSite model
 * @param {WhereOptions} [filters] - Optional filters
 * @returns {Promise<any[]>} Active sites
 *
 * @example
 * ```typescript
 * const sites = await getActiveConstructionSites(ConstructionSite, { projectId: 'PRJ-001' });
 * ```
 */
export declare const getActiveConstructionSites: (ConstructionSite: any, filters?: WhereOptions) => Promise<any[]>;
/**
 * Retrieves site by project ID with all related data.
 *
 * @param {string} projectId - Project identifier
 * @param {Model} ConstructionSite - ConstructionSite model
 * @returns {Promise<any>} Site data
 *
 * @example
 * ```typescript
 * const site = await getSiteByProjectId('PRJ-001', ConstructionSite);
 * ```
 */
export declare const getSiteByProjectId: (projectId: string, ConstructionSite: any) => Promise<any>;
/**
 * Updates site status with validation and audit trail.
 *
 * @param {string} siteId - Site identifier
 * @param {string} newStatus - New status
 * @param {string} userId - User making change
 * @param {Model} ConstructionSite - ConstructionSite model
 * @returns {Promise<any>} Updated site
 *
 * @example
 * ```typescript
 * await updateSiteStatus('site-123', 'active', 'user456', ConstructionSite);
 * ```
 */
export declare const updateSiteStatus: (siteId: string, newStatus: "planning" | "active" | "suspended" | "completed" | "closed", userId: string, ConstructionSite: any) => Promise<any>;
/**
 * Adds personnel access control entry for site.
 *
 * @param {string} siteId - Site identifier
 * @param {AccessControlEntry} accessData - Access control data
 * @param {Model} ConstructionSite - ConstructionSite model
 * @returns {Promise<any>} Access control record
 *
 * @example
 * ```typescript
 * await addPersonnelAccessControl('site-123', accessData, ConstructionSite);
 * ```
 */
export declare const addPersonnelAccessControl: (siteId: string, accessData: AccessControlEntry, ConstructionSite: any) => Promise<any>;
/**
 * Retrieves personnel access log with entry/exit tracking.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<AccessControlEntry[]>} Access log
 *
 * @example
 * ```typescript
 * const log = await getPersonnelAccessLog('site-123', startDate, endDate);
 * ```
 */
export declare const getPersonnelAccessLog: (siteId: string, startDate: Date, endDate: Date) => Promise<AccessControlEntry[]>;
/**
 * Validates site access for personnel with security checks.
 *
 * @param {string} siteId - Site identifier
 * @param {string} personnelId - Personnel identifier
 * @returns {Promise<{ authorized: boolean; accessLevel: string; restrictions?: string }>} Access validation
 *
 * @example
 * ```typescript
 * const result = await validateSiteAccess('site-123', 'PER-456');
 * ```
 */
export declare const validateSiteAccess: (siteId: string, personnelId: string) => Promise<{
    authorized: boolean;
    accessLevel: string;
    restrictions?: string;
}>;
/**
 * Records site entry/exit for personnel tracking.
 *
 * @param {string} siteId - Site identifier
 * @param {string} personnelId - Personnel identifier
 * @param {string} entryType - Entry or exit
 * @returns {Promise<any>} Entry record
 *
 * @example
 * ```typescript
 * await recordSiteEntry('site-123', 'PER-456', 'entry');
 * ```
 */
export declare const recordSiteEntry: (siteId: string, personnelId: string, entryType: "entry" | "exit") => Promise<any>;
/**
 * Retrieves current personnel count on site.
 *
 * @param {string} siteId - Site identifier
 * @returns {Promise<{ total: number; byType: Record<string, number> }>} Personnel count
 *
 * @example
 * ```typescript
 * const count = await getCurrentSitePersonnelCount('site-123');
 * ```
 */
export declare const getCurrentSitePersonnelCount: (siteId: string) => Promise<{
    total: number;
    byType: Record<string, number>;
}>;
/**
 * Generates site access badge with QR code and permissions.
 *
 * @param {string} siteId - Site identifier
 * @param {string} personnelId - Personnel identifier
 * @param {AccessControlEntry} accessData - Access data
 * @returns {Promise<{ badgeNumber: string; qrCode: string; validUntil: Date }>} Badge data
 *
 * @example
 * ```typescript
 * const badge = await generateSiteAccessBadge('site-123', 'PER-456', accessData);
 * ```
 */
export declare const generateSiteAccessBadge: (siteId: string, personnelId: string, accessData: AccessControlEntry) => Promise<{
    badgeNumber: string;
    qrCode: string;
    validUntil: Date;
}>;
/**
 * Creates safety incident report with immediate notification.
 *
 * @param {SafetyIncidentData} incidentData - Incident data
 * @param {Model} SafetyIncident - SafetyIncident model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created incident
 *
 * @example
 * ```typescript
 * const incident = await createSafetyIncident(incidentData, SafetyIncident);
 * ```
 */
export declare const createSafetyIncident: (incidentData: SafetyIncidentData, SafetyIncident: any, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves all safety incidents for site with filtering.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} SafetyIncident - SafetyIncident model
 * @param {string[]} [incidentTypes] - Filter by incident types
 * @returns {Promise<any[]>} Safety incidents
 *
 * @example
 * ```typescript
 * const incidents = await getSafetyIncidentsBySite('site-123', startDate, endDate, SafetyIncident);
 * ```
 */
export declare const getSafetyIncidentsBySite: (siteId: string, startDate: Date, endDate: Date, SafetyIncident: any, incidentTypes?: string[]) => Promise<any[]>;
/**
 * Updates incident investigation status with detailed tracking.
 *
 * @param {string} incidentId - Incident identifier
 * @param {string} status - Investigation status
 * @param {string} investigator - Investigator name
 * @param {Model} SafetyIncident - SafetyIncident model
 * @param {string} [findings] - Investigation findings
 * @returns {Promise<any>} Updated incident
 *
 * @example
 * ```typescript
 * await updateIncidentInvestigation('inc-123', 'completed', 'John Smith', SafetyIncident);
 * ```
 */
export declare const updateIncidentInvestigation: (incidentId: string, status: "pending" | "in_progress" | "completed", investigator: string, SafetyIncident: any, findings?: string) => Promise<any>;
/**
 * Calculates safety statistics for site with KPIs.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} SafetyIncident - SafetyIncident model
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<SafetyStatistics>} Safety statistics
 *
 * @example
 * ```typescript
 * const stats = await calculateSafetyStatistics('site-123', startDate, endDate, SafetyIncident, DailySiteLog);
 * ```
 */
export declare const calculateSafetyStatistics: (siteId: string, startDate: Date, endDate: Date, SafetyIncident: any, DailySiteLog: any) => Promise<SafetyStatistics>;
/**
 * Retrieves OSHA recordable incidents for reporting.
 *
 * @param {string} siteId - Site identifier
 * @param {number} year - Reporting year
 * @param {Model} SafetyIncident - SafetyIncident model
 * @returns {Promise<any[]>} OSHA recordable incidents
 *
 * @example
 * ```typescript
 * const incidents = await getOSHARecordableIncidents('site-123', 2024, SafetyIncident);
 * ```
 */
export declare const getOSHARecordableIncidents: (siteId: string, year: number, SafetyIncident: any) => Promise<any[]>;
/**
 * Creates emergency response plan for site.
 *
 * @param {EmergencyResponsePlan} planData - Emergency plan data
 * @param {string} siteId - Site identifier
 * @returns {Promise<any>} Created plan
 *
 * @example
 * ```typescript
 * const plan = await createEmergencyResponsePlan(planData, 'site-123');
 * ```
 */
export declare const createEmergencyResponsePlan: (planData: EmergencyResponsePlan, siteId: string) => Promise<any>;
/**
 * Retrieves emergency contacts for site by type.
 *
 * @param {string} siteId - Site identifier
 * @param {string} [emergencyType] - Emergency type filter
 * @returns {Promise<EmergencyContact[]>} Emergency contacts
 *
 * @example
 * ```typescript
 * const contacts = await getEmergencyContacts('site-123', 'fire');
 * ```
 */
export declare const getEmergencyContacts: (siteId: string, emergencyType?: string) => Promise<EmergencyContact[]>;
/**
 * Logs emergency drill execution and results.
 *
 * @param {string} siteId - Site identifier
 * @param {string} drillType - Type of drill
 * @param {Date} drillDate - Drill date
 * @param {string} results - Drill results
 * @returns {Promise<any>} Drill log
 *
 * @example
 * ```typescript
 * await logEmergencyDrill('site-123', 'fire', new Date(), 'All personnel evacuated in 5 minutes');
 * ```
 */
export declare const logEmergencyDrill: (siteId: string, drillType: string, drillDate: Date, results: string) => Promise<any>;
/**
 * Retrieves near miss incidents for trending analysis.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} SafetyIncident - SafetyIncident model
 * @returns {Promise<any[]>} Near miss incidents
 *
 * @example
 * ```typescript
 * const nearMisses = await getNearMissIncidents('site-123', startDate, endDate, SafetyIncident);
 * ```
 */
export declare const getNearMissIncidents: (siteId: string, startDate: Date, endDate: Date, SafetyIncident: any) => Promise<any[]>;
/**
 * Identifies safety trends and patterns for proactive management.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} SafetyIncident - SafetyIncident model
 * @returns {Promise<{ trends: any[]; recommendations: string[] }>} Safety trends
 *
 * @example
 * ```typescript
 * const analysis = await identifySafetyTrends('site-123', startDate, endDate, SafetyIncident);
 * ```
 */
export declare const identifySafetyTrends: (siteId: string, startDate: Date, endDate: Date, SafetyIncident: any) => Promise<{
    trends: any[];
    recommendations: string[];
}>;
/**
 * Creates daily site log with comprehensive details.
 *
 * @param {DailyLogEntry} logData - Daily log data
 * @param {Model} DailySiteLog - DailySiteLog model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created log
 *
 * @example
 * ```typescript
 * const log = await createDailySiteLog(logData, DailySiteLog);
 * ```
 */
export declare const createDailySiteLog: (logData: DailyLogEntry, DailySiteLog: any, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves daily logs for site with date range filtering.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any[]>} Daily logs
 *
 * @example
 * ```typescript
 * const logs = await getDailyLogsBySite('site-123', startDate, endDate, DailySiteLog);
 * ```
 */
export declare const getDailyLogsBySite: (siteId: string, startDate: Date, endDate: Date, DailySiteLog: any) => Promise<any[]>;
/**
 * Updates daily log with additional information.
 *
 * @param {string} logId - Log identifier
 * @param {Partial<DailyLogEntry>} updates - Log updates
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any>} Updated log
 *
 * @example
 * ```typescript
 * await updateDailySiteLog('log-123', { notes: 'Additional notes' }, DailySiteLog);
 * ```
 */
export declare const updateDailySiteLog: (logId: string, updates: Partial<DailyLogEntry>, DailySiteLog: any) => Promise<any>;
/**
 * Approves daily log with supervisor sign-off.
 *
 * @param {string} logId - Log identifier
 * @param {string} approverName - Approver name
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any>} Approved log
 *
 * @example
 * ```typescript
 * await approveDailySiteLog('log-123', 'John Smith', DailySiteLog);
 * ```
 */
export declare const approveDailySiteLog: (logId: string, approverName: string, DailySiteLog: any) => Promise<any>;
/**
 * Retrieves unapproved daily logs requiring attention.
 *
 * @param {string} siteId - Site identifier
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any[]>} Unapproved logs
 *
 * @example
 * ```typescript
 * const logs = await getUnapprovedDailyLogs('site-123', DailySiteLog);
 * ```
 */
export declare const getUnapprovedDailyLogs: (siteId: string, DailySiteLog: any) => Promise<any[]>;
/**
 * Adds material delivery to daily log.
 *
 * @param {string} logId - Log identifier
 * @param {MaterialDelivery} delivery - Material delivery data
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any>} Updated log
 *
 * @example
 * ```typescript
 * await addMaterialDeliveryToLog('log-123', delivery, DailySiteLog);
 * ```
 */
export declare const addMaterialDeliveryToLog: (logId: string, delivery: MaterialDelivery, DailySiteLog: any) => Promise<any>;
/**
 * Adds visitor entry to daily log.
 *
 * @param {string} logId - Log identifier
 * @param {VisitorEntry} visitor - Visitor entry data
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any>} Updated log
 *
 * @example
 * ```typescript
 * await addVisitorToLog('log-123', visitor, DailySiteLog);
 * ```
 */
export declare const addVisitorToLog: (logId: string, visitor: VisitorEntry, DailySiteLog: any) => Promise<any>;
/**
 * Adds delay entry to daily log with impact tracking.
 *
 * @param {string} logId - Log identifier
 * @param {DelayEntry} delay - Delay entry data
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any>} Updated log
 *
 * @example
 * ```typescript
 * await addDelayToLog('log-123', delay, DailySiteLog);
 * ```
 */
export declare const addDelayToLog: (logId: string, delay: DelayEntry, DailySiteLog: any) => Promise<any>;
/**
 * Retrieves logs with weather impact for delay claims.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any[]>} Weather-impacted logs
 *
 * @example
 * ```typescript
 * const logs = await getLogsWithWeatherImpact('site-123', startDate, endDate, DailySiteLog);
 * ```
 */
export declare const getLogsWithWeatherImpact: (siteId: string, startDate: Date, endDate: Date, DailySiteLog: any) => Promise<any[]>;
/**
 * Generates comprehensive daily log report for period.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any>} Log report
 *
 * @example
 * ```typescript
 * const report = await generateDailyLogReport('site-123', startDate, endDate, DailySiteLog);
 * ```
 */
export declare const generateDailyLogReport: (siteId: string, startDate: Date, endDate: Date, DailySiteLog: any) => Promise<any>;
/**
 * Records weather delay with documentation for EOT claims.
 *
 * @param {WeatherDelayData} delayData - Weather delay data
 * @returns {Promise<any>} Weather delay record
 *
 * @example
 * ```typescript
 * const delay = await recordWeatherDelay(delayData);
 * ```
 */
export declare const recordWeatherDelay: (delayData: WeatherDelayData) => Promise<any>;
/**
 * Retrieves weather delays for EOT submission.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<WeatherDelayData[]>} Weather delays
 *
 * @example
 * ```typescript
 * const delays = await getWeatherDelaysForEOT('site-123', startDate, endDate);
 * ```
 */
export declare const getWeatherDelaysForEOT: (siteId: string, startDate: Date, endDate: Date) => Promise<WeatherDelayData[]>;
/**
 * Calculates total weather delay hours for period.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<{ totalHours: number; byType: Record<string, number> }>} Delay summary
 *
 * @example
 * ```typescript
 * const summary = await calculateWeatherDelayHours('site-123', startDate, endDate);
 * ```
 */
export declare const calculateWeatherDelayHours: (siteId: string, startDate: Date, endDate: Date) => Promise<{
    totalHours: number;
    byType: Record<string, number>;
}>;
/**
 * Validates weather data against historical averages.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} date - Date to validate
 * @param {WeatherCondition} reportedWeather - Reported weather
 * @returns {Promise<{ valid: boolean; historicalAverage?: any; variance?: number }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateWeatherData('site-123', new Date(), weatherData);
 * ```
 */
export declare const validateWeatherData: (siteId: string, date: Date, reportedWeather: WeatherCondition) => Promise<{
    valid: boolean;
    historicalAverage?: any;
    variance?: number;
}>;
/**
 * Generates weather impact report for claims.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any>} Weather impact report
 *
 * @example
 * ```typescript
 * const report = await generateWeatherImpactReport('site-123', startDate, endDate, DailySiteLog);
 * ```
 */
export declare const generateWeatherImpactReport: (siteId: string, startDate: Date, endDate: Date, DailySiteLog: any) => Promise<any>;
/**
 * Creates site meeting record with attendees and agenda.
 *
 * @param {SiteMeetingData} meetingData - Meeting data
 * @returns {Promise<any>} Created meeting
 *
 * @example
 * ```typescript
 * const meeting = await createSiteMeeting(meetingData);
 * ```
 */
export declare const createSiteMeeting: (meetingData: SiteMeetingData) => Promise<any>;
/**
 * Retrieves site meetings with filtering by type.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string[]} [meetingTypes] - Filter by meeting types
 * @returns {Promise<SiteMeetingData[]>} Site meetings
 *
 * @example
 * ```typescript
 * const meetings = await getSiteMeetings('site-123', startDate, endDate, ['safety']);
 * ```
 */
export declare const getSiteMeetings: (siteId: string, startDate: Date, endDate: Date, meetingTypes?: string[]) => Promise<SiteMeetingData[]>;
/**
 * Adds action item to meeting with assignment.
 *
 * @param {string} meetingId - Meeting identifier
 * @param {ActionItem} actionItem - Action item data
 * @returns {Promise<any>} Updated meeting
 *
 * @example
 * ```typescript
 * await addMeetingActionItem('mtg-123', actionItem);
 * ```
 */
export declare const addMeetingActionItem: (meetingId: string, actionItem: ActionItem) => Promise<any>;
/**
 * Retrieves open action items across all meetings.
 *
 * @param {string} siteId - Site identifier
 * @param {string} [assignedTo] - Filter by assignee
 * @returns {Promise<any[]>} Open action items
 *
 * @example
 * ```typescript
 * const items = await getOpenActionItems('site-123', 'John Smith');
 * ```
 */
export declare const getOpenActionItems: (siteId: string, assignedTo?: string) => Promise<any[]>;
/**
 * Updates action item status with completion tracking.
 *
 * @param {string} meetingId - Meeting identifier
 * @param {string} actionItemId - Action item identifier
 * @param {string} newStatus - New status
 * @returns {Promise<any>} Updated action item
 *
 * @example
 * ```typescript
 * await updateActionItemStatus('mtg-123', 'ai-456', 'completed');
 * ```
 */
export declare const updateActionItemStatus: (meetingId: string, actionItemId: string, newStatus: "open" | "in_progress" | "completed" | "cancelled") => Promise<any>;
/**
 * Creates communication log entry with tracking.
 *
 * @param {CommunicationLogEntry} commData - Communication data
 * @returns {Promise<any>} Created communication log
 *
 * @example
 * ```typescript
 * const log = await createCommunicationLog(commData);
 * ```
 */
export declare const createCommunicationLog: (commData: CommunicationLogEntry) => Promise<any>;
/**
 * Retrieves communication logs with search and filtering.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string[]} [commTypes] - Filter by communication types
 * @returns {Promise<CommunicationLogEntry[]>} Communication logs
 *
 * @example
 * ```typescript
 * const logs = await getCommunicationLogs('site-123', startDate, endDate, ['rfi']);
 * ```
 */
export declare const getCommunicationLogs: (siteId: string, startDate: Date, endDate: Date, commTypes?: string[]) => Promise<CommunicationLogEntry[]>;
/**
 * Searches communication logs by content and parties.
 *
 * @param {string} siteId - Site identifier
 * @param {string} searchTerm - Search term
 * @returns {Promise<CommunicationLogEntry[]>} Matching logs
 *
 * @example
 * ```typescript
 * const results = await searchCommunicationLogs('site-123', 'foundation');
 * ```
 */
export declare const searchCommunicationLogs: (siteId: string, searchTerm: string) => Promise<CommunicationLogEntry[]>;
/**
 * Retrieves communications requiring follow-up.
 *
 * @param {string} siteId - Site identifier
 * @returns {Promise<CommunicationLogEntry[]>} Pending follow-ups
 *
 * @example
 * ```typescript
 * const pending = await getPendingFollowUps('site-123');
 * ```
 */
export declare const getPendingFollowUps: (siteId: string) => Promise<CommunicationLogEntry[]>;
/**
 * Generates site communication summary report.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any>} Communication summary
 *
 * @example
 * ```typescript
 * const summary = await generateCommunicationSummary('site-123', startDate, endDate);
 * ```
 */
export declare const generateCommunicationSummary: (siteId: string, startDate: Date, endDate: Date) => Promise<any>;
//# sourceMappingURL=construction-site-management-kit.d.ts.map