"use strict";
/**
 * LOC: BG-JOB-SCH-001
 * File: /reuse/background-jobs-scheduling-kit.ts
 *
 * UPSTREAM (imports from):
 *   - bull / bullmq
 *   - @nestjs/bull
 *   - node-cron
 *   - cron-parser
 *   - sequelize
 *   - ioredis
 *
 * DOWNSTREAM (imported by):
 *   - Job scheduling services
 *   - Background task processors
 *   - Cron job managers
 *   - Workflow orchestrators
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSelfOptimizingScheduler = exports.optimizeScheduleBasedOnHistory = exports.createAdaptiveJobScheduler = exports.scheduleBatchWithOptimization = exports.executeWithConcurrencyLimit = exports.createConcurrencyLimiter = exports.createScheduleFromPattern = exports.createCronFromPattern = exports.generateSchedulePerformanceReport = exports.getScheduleAnalytics = exports.findNextAvailableTime = exports.isDateInScheduleWindow = exports.createScheduleWindow = exports.scheduleJobDynamically = exports.createDynamicSchedule = exports.addJobWithDeduplication = exports.markJobAsProcessed = exports.isJobDuplicate = exports.executeWithLock = exports.extendJobLock = exports.releaseJobLock = exports.acquireJobLock = exports.recoverStalledJobs = exports.monitorAndRecoverJobs = exports.createJobRecoveryStrategy = exports.resumeJobChain = exports.pauseJobChain = exports.executeJobChain = exports.createJobChain = exports.createJobStateMonitor = exports.createJobStateMachine = exports.bulkCreateJobsFromTemplate = exports.validateJobData = exports.createJobFromTemplate = exports.createJobTemplate = exports.describeCronExpression = exports.createCronScheduler = exports.getDueSchedules = exports.updateCronSchedule = exports.calculateNextRun = exports.createCronSchedule = exports.createJobChainModel = exports.createJobStateModel = exports.createJobTemplateModel = exports.createCronScheduleModel = void 0;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * 1. Creates Sequelize model for persistent cron schedules.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} CronSchedule model
 *
 * @example
 * ```typescript
 * const CronScheduleModel = createCronScheduleModel(sequelize, DataTypes);
 * const schedule = await CronScheduleModel.create({
 *   name: 'daily-patient-report',
 *   cronExpression: '0 8 * * *',
 *   timezone: 'America/New_York',
 *   enabled: true,
 *   jobData: { reportType: 'summary' }
 * });
 * ```
 */
const createCronScheduleModel = (sequelize, DataTypes) => {
    return sequelize.define('CronSchedule', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        cronExpression: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'cron_expression',
        },
        timezone: {
            type: DataTypes.STRING,
            defaultValue: 'UTC',
        },
        queueName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'queue_name',
        },
        jobName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'job_name',
        },
        jobData: {
            type: DataTypes.JSONB,
            defaultValue: {},
            field: 'job_data',
        },
        jobOptions: {
            type: DataTypes.JSONB,
            allowNull: true,
            field: 'job_options',
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        lastRun: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'last_run',
        },
        nextRun: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'next_run',
        },
        runCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: 'run_count',
        },
        failureCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: 'failure_count',
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {},
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        tableName: 'cron_schedules',
        timestamps: true,
        indexes: [
            { fields: ['name'] },
            { fields: ['enabled'] },
            { fields: ['next_run'] },
            { fields: ['queue_name'] },
        ],
    });
};
exports.createCronScheduleModel = createCronScheduleModel;
/**
 * 2. Creates Sequelize model for job templates.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} JobTemplate model
 *
 * @example
 * ```typescript
 * const JobTemplateModel = createJobTemplateModel(sequelize, DataTypes);
 * const template = await JobTemplateModel.create({
 *   name: 'patient-notification',
 *   description: 'Template for patient notifications',
 *   defaultData: { notificationType: 'email', priority: 'normal' },
 *   defaultOptions: { attempts: 3, backoff: 2000 }
 * });
 * ```
 */
const createJobTemplateModel = (sequelize, DataTypes) => {
    return sequelize.define('JobTemplate', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        queueName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'queue_name',
        },
        jobName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'job_name',
        },
        defaultData: {
            type: DataTypes.JSONB,
            allowNull: false,
            field: 'default_data',
        },
        defaultOptions: {
            type: DataTypes.JSONB,
            allowNull: true,
            field: 'default_options',
        },
        validationSchema: {
            type: DataTypes.JSONB,
            allowNull: true,
            field: 'validation_schema',
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: 'is_active',
        },
        usageCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: 'usage_count',
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {},
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        tableName: 'job_templates',
        timestamps: true,
        indexes: [
            { fields: ['name'] },
            { fields: ['queue_name'] },
            { fields: ['category'] },
            { fields: ['is_active'] },
        ],
    });
};
exports.createJobTemplateModel = createJobTemplateModel;
/**
 * 3. Creates Sequelize model for job state machine tracking.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} JobState model
 *
 * @example
 * ```typescript
 * const JobStateModel = createJobStateModel(sequelize, DataTypes);
 * await JobStateModel.create({
 *   jobId: 'job-123',
 *   currentState: 'processing',
 *   previousState: 'pending',
 *   transitions: [{ from: 'pending', to: 'processing', timestamp: new Date() }]
 * });
 * ```
 */
const createJobStateModel = (sequelize, DataTypes) => {
    return sequelize.define('JobState', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        jobId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'job_id',
        },
        queueName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'queue_name',
        },
        currentState: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'current_state',
        },
        previousState: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'previous_state',
        },
        transitions: {
            type: DataTypes.JSONB,
            defaultValue: [],
        },
        stateData: {
            type: DataTypes.JSONB,
            defaultValue: {},
            field: 'state_data',
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {},
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        tableName: 'job_states',
        timestamps: true,
        indexes: [
            { fields: ['job_id'] },
            { fields: ['queue_name'] },
            { fields: ['current_state'] },
            { fields: ['created_at'] },
        ],
    });
};
exports.createJobStateModel = createJobStateModel;
/**
 * 4. Creates Sequelize model for job chains/workflows.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} JobChain model
 *
 * @example
 * ```typescript
 * const JobChainModel = createJobChainModel(sequelize, DataTypes);
 * const chain = await JobChainModel.create({
 *   name: 'patient-onboarding',
 *   steps: [
 *     { name: 'validate', queueName: 'validation', jobName: 'validate-patient' },
 *     { name: 'register', queueName: 'registration', jobName: 'register-patient' }
 *   ],
 *   status: 'pending'
 * });
 * ```
 */
const createJobChainModel = (sequelize, DataTypes) => {
    return sequelize.define('JobChain', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        steps: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        currentStep: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: 'current_step',
        },
        status: {
            type: DataTypes.ENUM('pending', 'running', 'completed', 'failed', 'paused', 'cancelled'),
            defaultValue: 'pending',
        },
        context: {
            type: DataTypes.JSONB,
            defaultValue: {},
        },
        results: {
            type: DataTypes.JSONB,
            defaultValue: [],
        },
        startedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'started_at',
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'completed_at',
        },
        error: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {},
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        tableName: 'job_chains',
        timestamps: true,
        indexes: [
            { fields: ['name'] },
            { fields: ['status'] },
            { fields: ['created_at'] },
        ],
    });
};
exports.createJobChainModel = createJobChainModel;
// ============================================================================
// ADVANCED CRON SCHEDULING
// ============================================================================
/**
 * 5. Creates a cron schedule with validation and persistence.
 *
 * @param {any} cronScheduleModel - CronSchedule model
 * @param {CronSchedule} scheduleData - Schedule configuration
 * @returns {Promise<any>} Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await createCronSchedule(CronScheduleModel, {
 *   name: 'daily-medication-reminder',
 *   cronExpression: '0 9 * * *',
 *   timezone: 'America/New_York',
 *   queueName: 'notifications',
 *   jobName: 'send-medication-reminder',
 *   jobData: { reminderType: 'medication' },
 *   enabled: true
 * });
 * ```
 */
const createCronSchedule = async (cronScheduleModel, scheduleData) => {
    // Validate cron expression
    if (!isValidCronExpression(scheduleData.cronExpression || '')) {
        throw new Error(`Invalid cron expression: ${scheduleData.cronExpression}`);
    }
    // Calculate next run time
    const nextRun = (0, exports.calculateNextRun)(scheduleData.cronExpression, scheduleData.timezone || 'UTC');
    return cronScheduleModel.create({
        ...scheduleData,
        nextRun,
        runCount: 0,
        failureCount: 0,
    });
};
exports.createCronSchedule = createCronSchedule;
/**
 * 6. Calculates next run time for a cron expression.
 *
 * @param {string} cronExpression - Cron expression
 * @param {string} [timezone='UTC'] - Timezone
 * @returns {Date} Next run time
 *
 * @example
 * ```typescript
 * const nextRun = calculateNextRun('0 9 * * *', 'America/New_York');
 * console.log('Next appointment reminder:', nextRun);
 * // Output: Next appointment reminder: 2024-01-15T14:00:00.000Z
 * ```
 */
const calculateNextRun = (cronExpression, timezone = 'UTC') => {
    try {
        const cronParser = require('cron-parser');
        const interval = cronParser.parseExpression(cronExpression, {
            currentDate: new Date(),
            tz: timezone,
        });
        return interval.next().toDate();
    }
    catch (error) {
        throw new Error(`Failed to parse cron expression: ${error.message}`);
    }
};
exports.calculateNextRun = calculateNextRun;
/**
 * 7. Updates cron schedule and recalculates next run.
 *
 * @param {any} cronScheduleModel - CronSchedule model
 * @param {string} scheduleId - Schedule ID
 * @param {Partial<CronSchedule>} updates - Schedule updates
 * @returns {Promise<any>} Updated schedule
 *
 * @example
 * ```typescript
 * await updateCronSchedule(CronScheduleModel, 'schedule-123', {
 *   cronExpression: '0 10 * * *', // Change from 9 AM to 10 AM
 *   enabled: true
 * });
 * ```
 */
const updateCronSchedule = async (cronScheduleModel, scheduleId, updates) => {
    const schedule = await cronScheduleModel.findByPk(scheduleId);
    if (!schedule) {
        throw new Error(`Schedule ${scheduleId} not found`);
    }
    // Recalculate next run if cron expression or timezone changed
    if (updates.cronExpression || updates.timezone) {
        const cronExpression = updates.cronExpression || schedule.cronExpression;
        const timezone = updates.timezone || schedule.timezone;
        updates.nextRun = (0, exports.calculateNextRun)(cronExpression, timezone);
    }
    await schedule.update(updates);
    return schedule;
};
exports.updateCronSchedule = updateCronSchedule;
/**
 * 8. Gets schedules due for execution.
 *
 * @param {any} cronScheduleModel - CronSchedule model
 * @param {Date} [currentTime=new Date()] - Current time
 * @returns {Promise<any[]>} Due schedules
 *
 * @example
 * ```typescript
 * const dueSchedules = await getDueSchedules(CronScheduleModel);
 * for (const schedule of dueSchedules) {
 *   await executeSchedule(schedule);
 * }
 * ```
 */
const getDueSchedules = async (cronScheduleModel, currentTime = new Date()) => {
    const { Op } = require('sequelize');
    return cronScheduleModel.findAll({
        where: {
            enabled: true,
            nextRun: {
                [Op.lte]: currentTime,
            },
        },
        order: [['nextRun', 'ASC']],
    });
};
exports.getDueSchedules = getDueSchedules;
/**
 * 9. Creates a cron scheduler that executes schedules automatically.
 *
 * @param {any} cronScheduleModel - CronSchedule model
 * @param {Map<string, any>} queues - Queue instances
 * @param {number} [checkInterval=60000] - Check interval in ms
 * @returns {Object} Cron scheduler
 *
 * @example
 * ```typescript
 * const scheduler = createCronScheduler(
 *   CronScheduleModel,
 *   queueManager.getAllQueues(),
 *   30000 // Check every 30 seconds
 * );
 * scheduler.start();
 * // Scheduler automatically executes due cron jobs
 * ```
 */
const createCronScheduler = (cronScheduleModel, queues, checkInterval = 60000) => {
    let intervalId = null;
    let isRunning = false;
    const executeSchedule = async (schedule) => {
        const queue = queues.get(schedule.queueName);
        if (!queue) {
            console.error(`Queue ${schedule.queueName} not found for schedule ${schedule.name}`);
            return;
        }
        try {
            // Add job to queue
            await queue.add(schedule.jobName, schedule.jobData, schedule.jobOptions);
            // Update schedule
            const nextRun = (0, exports.calculateNextRun)(schedule.cronExpression, schedule.timezone);
            await schedule.update({
                lastRun: new Date(),
                nextRun,
                runCount: schedule.runCount + 1,
            });
            console.log(`Executed schedule ${schedule.name}, next run: ${nextRun}`);
        }
        catch (error) {
            console.error(`Failed to execute schedule ${schedule.name}:`, error);
            await schedule.update({
                failureCount: schedule.failureCount + 1,
            });
        }
    };
    const tick = async () => {
        if (isRunning)
            return; // Prevent concurrent executions
        isRunning = true;
        try {
            const dueSchedules = await (0, exports.getDueSchedules)(cronScheduleModel);
            for (const schedule of dueSchedules) {
                await executeSchedule(schedule);
            }
        }
        catch (error) {
            console.error('Cron scheduler error:', error);
        }
        finally {
            isRunning = false;
        }
    };
    return {
        start() {
            if (intervalId)
                return;
            console.log('Starting cron scheduler...');
            intervalId = setInterval(tick, checkInterval);
            tick(); // Execute immediately
        },
        stop() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
                console.log('Stopped cron scheduler');
            }
        },
        async executeNow(scheduleId) {
            const schedule = await cronScheduleModel.findByPk(scheduleId);
            if (!schedule) {
                throw new Error(`Schedule ${scheduleId} not found`);
            }
            await executeSchedule(schedule);
        },
        isRunning() {
            return intervalId !== null;
        },
    };
};
exports.createCronScheduler = createCronScheduler;
/**
 * 10. Generates human-readable description from cron expression.
 *
 * @param {string} cronExpression - Cron expression
 * @returns {string} Human-readable description
 *
 * @example
 * ```typescript
 * const description = describeCronExpression('0 9 * * 1-5');
 * console.log(description);
 * // Output: "At 09:00 AM, Monday through Friday"
 * ```
 */
const describeCronExpression = (cronExpression) => {
    const parts = cronExpression.split(' ');
    if (parts.length < 5)
        return 'Invalid cron expression';
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    const descriptions = [];
    // Time
    if (hour !== '*' && minute !== '*') {
        descriptions.push(`At ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`);
    }
    else if (hour !== '*') {
        descriptions.push(`Every minute during hour ${hour}`);
    }
    else if (minute !== '*') {
        descriptions.push(`At minute ${minute} of every hour`);
    }
    else {
        descriptions.push('Every minute');
    }
    // Day of week
    if (dayOfWeek !== '*') {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayNames = dayOfWeek.split(',').map(d => days[parseInt(d)] || d);
        descriptions.push(`on ${dayNames.join(', ')}`);
    }
    // Day of month
    if (dayOfMonth !== '*') {
        descriptions.push(`on day ${dayOfMonth} of the month`);
    }
    // Month
    if (month !== '*') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthNames = month.split(',').map(m => months[parseInt(m) - 1] || m);
        descriptions.push(`in ${monthNames.join(', ')}`);
    }
    return descriptions.join(' ');
};
exports.describeCronExpression = describeCronExpression;
// ============================================================================
// JOB TEMPLATES
// ============================================================================
/**
 * 11. Creates a reusable job template.
 *
 * @param {any} jobTemplateModel - JobTemplate model
 * @param {JobTemplate} templateData - Template configuration
 * @returns {Promise<any>} Created template
 *
 * @example
 * ```typescript
 * const template = await createJobTemplate(JobTemplateModel, {
 *   name: 'send-patient-email',
 *   description: 'Template for sending patient emails',
 *   queueName: 'notifications',
 *   jobName: 'send-email',
 *   defaultData: {
 *     from: 'noreply@whitecross.health',
 *     priority: 'normal'
 *   },
 *   defaultOptions: { attempts: 3, backoff: 2000 }
 * });
 * ```
 */
const createJobTemplate = async (jobTemplateModel, templateData) => {
    return jobTemplateModel.create(templateData);
};
exports.createJobTemplate = createJobTemplate;
/**
 * 12. Creates a job from a template with custom data.
 *
 * @param {any} jobTemplateModel - JobTemplate model
 * @param {any} queue - Bull queue instance
 * @param {string} templateName - Template name
 * @param {any} [customData={}] - Custom job data
 * @param {any} [customOptions={}] - Custom job options
 * @returns {Promise<any>} Created job
 *
 * @example
 * ```typescript
 * const job = await createJobFromTemplate(
 *   JobTemplateModel,
 *   emailQueue,
 *   'send-patient-email',
 *   {
 *     to: 'patient@example.com',
 *     subject: 'Appointment Reminder',
 *     body: 'Your appointment is tomorrow at 2 PM'
 *   }
 * );
 * ```
 */
const createJobFromTemplate = async (jobTemplateModel, queue, templateName, customData = {}, customOptions = {}) => {
    const template = await jobTemplateModel.findOne({ where: { name: templateName } });
    if (!template) {
        throw new Error(`Template ${templateName} not found`);
    }
    if (!template.isActive) {
        throw new Error(`Template ${templateName} is not active`);
    }
    // Merge default and custom data
    const jobData = { ...template.defaultData, ...customData };
    const jobOptions = { ...template.defaultOptions, ...customOptions };
    // Increment usage count
    await template.update({ usageCount: template.usageCount + 1 });
    return queue.add(template.jobName, jobData, jobOptions);
};
exports.createJobFromTemplate = createJobFromTemplate;
/**
 * 13. Validates job data against template schema.
 *
 * @param {any} jobTemplateModel - JobTemplate model
 * @param {string} templateName - Template name
 * @param {any} data - Data to validate
 * @returns {Promise<{valid: boolean, errors?: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateJobData(
 *   JobTemplateModel,
 *   'send-patient-email',
 *   { to: 'patient@example.com', subject: 'Test' }
 * );
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
const validateJobData = async (jobTemplateModel, templateName, data) => {
    const template = await jobTemplateModel.findOne({ where: { name: templateName } });
    if (!template) {
        return { valid: false, errors: [`Template ${templateName} not found`] };
    }
    if (!template.validationSchema) {
        return { valid: true };
    }
    const errors = [];
    const schema = template.validationSchema;
    // Simple validation based on schema
    for (const [key, rules] of Object.entries(schema)) {
        const value = data[key];
        const fieldRules = rules;
        if (fieldRules.required && (value === undefined || value === null)) {
            errors.push(`Field '${key}' is required`);
        }
        if (fieldRules.type && value !== undefined) {
            const actualType = Array.isArray(value) ? 'array' : typeof value;
            if (actualType !== fieldRules.type) {
                errors.push(`Field '${key}' must be of type ${fieldRules.type}`);
            }
        }
        if (fieldRules.pattern && typeof value === 'string') {
            const regex = new RegExp(fieldRules.pattern);
            if (!regex.test(value)) {
                errors.push(`Field '${key}' does not match required pattern`);
            }
        }
    }
    return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
};
exports.validateJobData = validateJobData;
/**
 * 14. Bulk creates jobs from a template.
 *
 * @param {any} jobTemplateModel - JobTemplate model
 * @param {any} queue - Bull queue instance
 * @param {string} templateName - Template name
 * @param {any[]} dataArray - Array of job data
 * @returns {Promise<any[]>} Created jobs
 *
 * @example
 * ```typescript
 * const jobs = await bulkCreateJobsFromTemplate(
 *   JobTemplateModel,
 *   emailQueue,
 *   'send-patient-email',
 *   patients.map(p => ({
 *     to: p.email,
 *     subject: 'Health Check Reminder',
 *     body: `Hi ${p.name}, time for your annual check-up!`
 *   }))
 * );
 * console.log(`Created ${jobs.length} notification jobs`);
 * ```
 */
const bulkCreateJobsFromTemplate = async (jobTemplateModel, queue, templateName, dataArray) => {
    const template = await jobTemplateModel.findOne({ where: { name: templateName } });
    if (!template) {
        throw new Error(`Template ${templateName} not found`);
    }
    const jobs = [];
    for (const customData of dataArray) {
        const jobData = { ...template.defaultData, ...customData };
        const job = await queue.add(template.jobName, jobData, template.defaultOptions);
        jobs.push(job);
    }
    // Update usage count
    await template.update({ usageCount: template.usageCount + dataArray.length });
    return jobs;
};
exports.bulkCreateJobsFromTemplate = bulkCreateJobsFromTemplate;
// ============================================================================
// JOB STATE MACHINE
// ============================================================================
/**
 * 15. Creates a state machine for job lifecycle management.
 *
 * @param {any} jobStateModel - JobState model
 * @param {Object} config - State machine configuration
 * @returns {Object} State machine
 *
 * @example
 * ```typescript
 * const stateMachine = createJobStateMachine(JobStateModel, {
 *   initialState: 'pending',
 *   states: ['pending', 'validating', 'processing', 'completed', 'failed'],
 *   transitions: {
 *     pending: ['validating'],
 *     validating: ['processing', 'failed'],
 *     processing: ['completed', 'failed']
 *   }
 * });
 * await stateMachine.transition('job-123', 'processing');
 * ```
 */
const createJobStateMachine = (jobStateModel, config) => {
    return {
        async initialize(jobId, queueName, initialData) {
            return jobStateModel.create({
                jobId,
                queueName,
                currentState: config.initialState,
                transitions: [],
                stateData: initialData || {},
            });
        },
        async transition(jobId, toState, data) {
            const state = await jobStateModel.findOne({ where: { jobId } });
            if (!state) {
                throw new Error(`State for job ${jobId} not found`);
            }
            const currentState = state.currentState;
            // Validate transition
            const allowedTransitions = config.transitions[currentState] || [];
            if (!allowedTransitions.includes(toState)) {
                throw new Error(`Invalid transition from ${currentState} to ${toState}. ` +
                    `Allowed: ${allowedTransitions.join(', ')}`);
            }
            // Record transition
            const transition = {
                from: currentState,
                to: toState,
                timestamp: new Date(),
                data,
            };
            const transitions = [...state.transitions, transition];
            await state.update({
                currentState: toState,
                previousState: currentState,
                transitions,
                stateData: { ...state.stateData, ...data },
            });
            // Call transition hook
            if (config.onTransition) {
                await config.onTransition(currentState, toState, jobId);
            }
            return state;
        },
        async getState(jobId) {
            return jobStateModel.findOne({ where: { jobId } });
        },
        async canTransitionTo(jobId, toState) {
            const state = await jobStateModel.findOne({ where: { jobId } });
            if (!state)
                return false;
            const allowedTransitions = config.transitions[state.currentState] || [];
            return allowedTransitions.includes(toState);
        },
        getTransitionHistory(state) {
            return state.transitions || [];
        },
    };
};
exports.createJobStateMachine = createJobStateMachine;
/**
 * 16. Monitors job state transitions and triggers actions.
 *
 * @param {any} jobStateModel - JobState model
 * @param {Record<string, Function>} stateHandlers - State-specific handlers
 * @param {number} [pollInterval=5000] - Polling interval in ms
 * @returns {Object} State monitor
 *
 * @example
 * ```typescript
 * const monitor = createJobStateMonitor(JobStateModel, {
 *   completed: async (jobId) => {
 *     console.log(`Job ${jobId} completed successfully`);
 *   },
 *   failed: async (jobId) => {
 *     await sendAlert(`Job ${jobId} failed`);
 *   }
 * }, 10000);
 * monitor.start();
 * ```
 */
const createJobStateMonitor = (jobStateModel, stateHandlers, pollInterval = 5000) => {
    let intervalId = null;
    const processedStates = new Set();
    const poll = async () => {
        const { Op } = require('sequelize');
        for (const [stateName, handler] of Object.entries(stateHandlers)) {
            const states = await jobStateModel.findAll({
                where: {
                    currentState: stateName,
                    updatedAt: {
                        [Op.gt]: new Date(Date.now() - pollInterval * 2),
                    },
                },
            });
            for (const state of states) {
                const stateKey = `${state.jobId}-${stateName}-${state.updatedAt.getTime()}`;
                if (!processedStates.has(stateKey)) {
                    try {
                        await handler(state.jobId, state.stateData);
                        processedStates.add(stateKey);
                    }
                    catch (error) {
                        console.error(`State handler error for ${state.jobId}:`, error);
                    }
                }
            }
        }
        // Clean up old processed states
        if (processedStates.size > 10000) {
            processedStates.clear();
        }
    };
    return {
        start() {
            if (intervalId)
                return;
            intervalId = setInterval(poll, pollInterval);
            poll(); // Execute immediately
        },
        stop() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        },
        isRunning() {
            return intervalId !== null;
        },
    };
};
exports.createJobStateMonitor = createJobStateMonitor;
// ============================================================================
// JOB CHAINING AND WORKFLOWS
// ============================================================================
/**
 * 17. Creates a job chain/workflow with multiple steps.
 *
 * @param {any} jobChainModel - JobChain model
 * @param {string} name - Chain name
 * @param {ChainStep[]} steps - Chain steps
 * @param {any} [initialContext={}] - Initial context
 * @returns {Promise<any>} Created job chain
 *
 * @example
 * ```typescript
 * const chain = await createJobChain(JobChainModel, 'patient-admission', [
 *   {
 *     name: 'validate-patient',
 *     queueName: 'validation',
 *     jobName: 'validate',
 *     condition: (ctx) => ctx.patientId != null
 *   },
 *   {
 *     name: 'create-record',
 *     queueName: 'records',
 *     jobName: 'create',
 *     transform: (ctx) => ({ ...ctx, recordType: 'admission' })
 *   },
 *   {
 *     name: 'notify-staff',
 *     queueName: 'notifications',
 *     jobName: 'notify'
 *   }
 * ], { patientId: '123', departmentId: 'emergency' });
 * ```
 */
const createJobChain = async (jobChainModel, name, steps, initialContext = {}) => {
    return jobChainModel.create({
        name,
        steps,
        currentStep: 0,
        status: 'pending',
        context: initialContext,
        results: [],
    });
};
exports.createJobChain = createJobChain;
/**
 * 18. Executes a job chain step by step.
 *
 * @param {any} jobChainModel - JobChain model
 * @param {Map<string, any>} queues - Queue instances
 * @param {string} chainId - Chain ID
 * @returns {Promise<any>} Chain execution result
 *
 * @example
 * ```typescript
 * const result = await executeJobChain(
 *   JobChainModel,
 *   queueManager.getAllQueues(),
 *   'chain-123'
 * );
 * console.log('Chain status:', result.status);
 * console.log('Results:', result.results);
 * ```
 */
const executeJobChain = async (jobChainModel, queues, chainId) => {
    const chain = await jobChainModel.findByPk(chainId);
    if (!chain) {
        throw new Error(`Job chain ${chainId} not found`);
    }
    if (chain.status === 'running') {
        throw new Error(`Job chain ${chainId} is already running`);
    }
    await chain.update({ status: 'running', startedAt: new Date() });
    try {
        let currentContext = chain.context;
        const results = [];
        for (let i = chain.currentStep; i < chain.steps.length; i++) {
            const step = chain.steps[i];
            // Check condition
            if (step.condition && !step.condition(currentContext)) {
                console.log(`Skipping step ${step.name} - condition not met`);
                continue;
            }
            // Transform data
            const jobData = step.transform
                ? step.transform(currentContext)
                : currentContext;
            // Get queue
            const queue = queues.get(step.queueName);
            if (!queue) {
                throw new Error(`Queue ${step.queueName} not found for step ${step.name}`);
            }
            // Execute job
            const job = await queue.add(step.jobName, jobData);
            const result = await job.waitUntilFinished(queue.events);
            results.push({ step: step.name, result });
            currentContext = { ...currentContext, ...result };
            // Update chain progress
            await chain.update({
                currentStep: i + 1,
                context: currentContext,
                results,
            });
            // Call success handler
            if (step.onSuccess) {
                await step.onSuccess(result, currentContext);
            }
        }
        await chain.update({
            status: 'completed',
            completedAt: new Date(),
        });
        return chain;
    }
    catch (error) {
        const currentStep = chain.steps[chain.currentStep];
        if (currentStep?.onError) {
            await currentStep.onError(error, chain.context);
        }
        await chain.update({
            status: 'failed',
            error: error.message,
            completedAt: new Date(),
        });
        throw error;
    }
};
exports.executeJobChain = executeJobChain;
/**
 * 19. Pauses a running job chain.
 *
 * @param {any} jobChainModel - JobChain model
 * @param {string} chainId - Chain ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await pauseJobChain(JobChainModel, 'chain-123');
 * // Chain pauses after current step completes
 * ```
 */
const pauseJobChain = async (jobChainModel, chainId) => {
    const chain = await jobChainModel.findByPk(chainId);
    if (!chain) {
        throw new Error(`Job chain ${chainId} not found`);
    }
    if (chain.status !== 'running') {
        throw new Error(`Job chain ${chainId} is not running`);
    }
    await chain.update({ status: 'paused' });
};
exports.pauseJobChain = pauseJobChain;
/**
 * 20. Resumes a paused job chain.
 *
 * @param {any} jobChainModel - JobChain model
 * @param {Map<string, any>} queues - Queue instances
 * @param {string} chainId - Chain ID
 * @returns {Promise<any>} Resumed chain
 *
 * @example
 * ```typescript
 * const chain = await resumeJobChain(
 *   JobChainModel,
 *   queueManager.getAllQueues(),
 *   'chain-123'
 * );
 * ```
 */
const resumeJobChain = async (jobChainModel, queues, chainId) => {
    const chain = await jobChainModel.findByPk(chainId);
    if (!chain) {
        throw new Error(`Job chain ${chainId} not found`);
    }
    if (chain.status !== 'paused') {
        throw new Error(`Job chain ${chainId} is not paused`);
    }
    return (0, exports.executeJobChain)(jobChainModel, queues, chainId);
};
exports.resumeJobChain = resumeJobChain;
// ============================================================================
// JOB RECOVERY AND RESILIENCE
// ============================================================================
/**
 * 21. Creates a job recovery strategy with configurable retry logic.
 *
 * @param {JobRecoveryStrategy} strategy - Recovery configuration
 * @returns {Object} Recovery handler
 *
 * @example
 * ```typescript
 * const recovery = createJobRecoveryStrategy({
 *   maxAttempts: 5,
 *   backoffType: 'exponential',
 *   initialDelay: 1000,
 *   maxDelay: 60000,
 *   shouldRecover: (job, error) => error.name !== 'ValidationError'
 * });
 * const canRecover = recovery.canRecover(job, error, 2);
 * const delay = recovery.getDelay(3);
 * ```
 */
const createJobRecoveryStrategy = (strategy) => {
    return {
        canRecover(job, error, attemptNumber) {
            if (attemptNumber >= strategy.maxAttempts) {
                return false;
            }
            if (strategy.shouldRecover) {
                return strategy.shouldRecover(job, error);
            }
            return true;
        },
        getDelay(attemptNumber) {
            let delay;
            switch (strategy.backoffType) {
                case 'exponential':
                    delay = strategy.initialDelay * Math.pow(2, attemptNumber - 1);
                    break;
                case 'linear':
                    delay = strategy.initialDelay * attemptNumber;
                    break;
                case 'fixed':
                default:
                    delay = strategy.initialDelay;
                    break;
            }
            return Math.min(delay, strategy.maxDelay);
        },
        async recover(queue, job, error, attemptNumber) {
            if (!this.canRecover(job, error, attemptNumber)) {
                throw new Error(`Job ${job.id} cannot be recovered after ${attemptNumber} attempts`);
            }
            const delay = this.getDelay(attemptNumber);
            return queue.add(job.name, job.data, {
                ...job.opts,
                jobId: `${job.id}-recovery-${attemptNumber}`,
                delay,
                attempts: strategy.maxAttempts - attemptNumber,
            });
        },
    };
};
exports.createJobRecoveryStrategy = createJobRecoveryStrategy;
/**
 * 22. Monitors failed jobs and automatically recovers them.
 *
 * @param {any} queue - Bull queue instance
 * @param {JobRecoveryStrategy} strategy - Recovery strategy
 * @param {any} [jobModel] - Sequelize Job model for tracking
 * @returns {Function} Cleanup function
 *
 * @example
 * ```typescript
 * const stopRecovery = monitorAndRecoverJobs(
 *   processingQueue,
 *   {
 *     maxAttempts: 3,
 *     backoffType: 'exponential',
 *     initialDelay: 2000,
 *     maxDelay: 30000
 *   },
 *   JobModel
 * );
 * // Failed jobs automatically retried with backoff
 * ```
 */
const monitorAndRecoverJobs = (queue, strategy, jobModel) => {
    const recovery = (0, exports.createJobRecoveryStrategy)(strategy);
    const failedListener = async (job, error) => {
        const attemptNumber = job.attemptsMade || 0;
        try {
            if (recovery.canRecover(job, error, attemptNumber)) {
                console.log(`Attempting to recover job ${job.id}, attempt ${attemptNumber + 1}`);
                await recovery.recover(queue, job, error, attemptNumber + 1);
                if (jobModel) {
                    await jobModel.update({ status: 'recovering', attempts: attemptNumber + 1 }, { where: { jobId: job.id } });
                }
            }
            else {
                console.error(`Job ${job.id} cannot be recovered`);
                if (jobModel) {
                    await jobModel.update({ status: 'failed_permanent' }, { where: { jobId: job.id } });
                }
            }
        }
        catch (recoveryError) {
            console.error(`Failed to recover job ${job.id}:`, recoveryError);
        }
    };
    queue.on('failed', failedListener);
    return () => {
        queue.off('failed', failedListener);
    };
};
exports.monitorAndRecoverJobs = monitorAndRecoverJobs;
/**
 * 23. Recovers stalled jobs that stopped processing.
 *
 * @param {any} queue - Bull queue instance
 * @param {number} [stalledInterval=30000] - Check interval in ms
 * @returns {Object} Stalled job recovery
 *
 * @example
 * ```typescript
 * const stalledRecovery = recoverStalledJobs(processingQueue, 60000);
 * stalledRecovery.start();
 * // Checks for stalled jobs every minute and recovers them
 * ```
 */
const recoverStalledJobs = (queue, stalledInterval = 30000) => {
    let intervalId = null;
    const checkStalled = async () => {
        try {
            const jobs = await queue.getJobs(['active']);
            const now = Date.now();
            for (const job of jobs) {
                const processingTime = now - job.processedOn;
                const timeout = job.opts?.timeout || 300000; // Default 5 minutes
                if (processingTime > timeout) {
                    console.warn(`Job ${job.id} is stalled (${processingTime}ms)`);
                    // Move back to waiting
                    await job.moveToFailed({
                        message: 'Job stalled - exceeded timeout',
                    }, true);
                    // Retry
                    await queue.add(job.name, job.data, {
                        ...job.opts,
                        jobId: `${job.id}-stalled-recovery`,
                    });
                }
            }
        }
        catch (error) {
            console.error('Error checking stalled jobs:', error);
        }
    };
    return {
        start() {
            if (intervalId)
                return;
            intervalId = setInterval(checkStalled, stalledInterval);
            checkStalled(); // Execute immediately
        },
        stop() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        },
        async recoverNow() {
            return checkStalled();
        },
        isRunning() {
            return intervalId !== null;
        },
    };
};
exports.recoverStalledJobs = recoverStalledJobs;
// ============================================================================
// DISTRIBUTED LOCKING
// ============================================================================
/**
 * 24. Acquires a distributed lock for job execution.
 *
 * @param {any} redis - Redis client
 * @param {string} lockKey - Lock key
 * @param {number} [ttl=30000] - Lock TTL in ms
 * @param {string} [ownerId] - Lock owner ID
 * @returns {Promise<JobLock | null>} Lock if acquired, null otherwise
 *
 * @example
 * ```typescript
 * const lock = await acquireJobLock(
 *   redisClient,
 *   'job:patient-export:daily',
 *   60000,
 *   'worker-1'
 * );
 * if (lock) {
 *   try {
 *     await executeJob();
 *   } finally {
 *     await releaseJobLock(redisClient, lock);
 *   }
 * }
 * ```
 */
const acquireJobLock = async (redis, lockKey, ttl = 30000, ownerId) => {
    const owner = ownerId || `${process.pid}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + ttl);
    const acquired = await redis.set(`lock:${lockKey}`, owner, 'PX', ttl, 'NX');
    if (acquired === 'OK') {
        return {
            key: lockKey,
            ownerId: owner,
            expiresAt,
        };
    }
    return null;
};
exports.acquireJobLock = acquireJobLock;
/**
 * 25. Releases a distributed lock.
 *
 * @param {any} redis - Redis client
 * @param {JobLock} lock - Lock to release
 * @returns {Promise<boolean>} True if released
 *
 * @example
 * ```typescript
 * const released = await releaseJobLock(redisClient, lock);
 * if (!released) {
 *   console.warn('Lock already expired or owned by another process');
 * }
 * ```
 */
const releaseJobLock = async (redis, lock) => {
    const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
    const result = await redis.eval(script, 1, `lock:${lock.key}`, lock.ownerId);
    return result === 1;
};
exports.releaseJobLock = releaseJobLock;
/**
 * 26. Extends a distributed lock TTL.
 *
 * @param {any} redis - Redis client
 * @param {JobLock} lock - Lock to extend
 * @param {number} additionalTtl - Additional TTL in ms
 * @returns {Promise<boolean>} True if extended
 *
 * @example
 * ```typescript
 * // Extend lock for another 30 seconds
 * const extended = await extendJobLock(redisClient, lock, 30000);
 * if (extended) {
 *   console.log('Lock extended, continuing job processing');
 * }
 * ```
 */
const extendJobLock = async (redis, lock, additionalTtl) => {
    const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("pexpire", KEYS[1], ARGV[2])
    else
      return 0
    end
  `;
    const result = await redis.eval(script, 1, `lock:${lock.key}`, lock.ownerId, additionalTtl);
    if (result === 1) {
        lock.expiresAt = new Date(Date.now() + additionalTtl);
        return true;
    }
    return false;
};
exports.extendJobLock = extendJobLock;
/**
 * 27. Executes a job with automatic distributed locking.
 *
 * @param {any} redis - Redis client
 * @param {string} lockKey - Lock key
 * @param {Function} jobFunction - Job function to execute
 * @param {Object} [options] - Lock options
 * @returns {Promise<any>} Job result
 *
 * @example
 * ```typescript
 * const result = await executeWithLock(
 *   redisClient,
 *   'daily-report-generation',
 *   async () => {
 *     return await generateDailyReport();
 *   },
 *   { ttl: 300000, retryDelay: 5000, maxRetries: 3 }
 * );
 * ```
 */
const executeWithLock = async (redis, lockKey, jobFunction, options = {}) => {
    const ttl = options.ttl || 30000;
    const retryDelay = options.retryDelay || 1000;
    const maxRetries = options.maxRetries || 0;
    let retries = 0;
    let lock = null;
    while (retries <= maxRetries) {
        lock = await (0, exports.acquireJobLock)(redis, lockKey, ttl);
        if (lock) {
            break;
        }
        if (retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            retries++;
        }
        else {
            throw new Error(`Failed to acquire lock for ${lockKey} after ${maxRetries} retries`);
        }
    }
    try {
        return await jobFunction();
    }
    finally {
        if (lock) {
            await (0, exports.releaseJobLock)(redis, lock);
        }
    }
};
exports.executeWithLock = executeWithLock;
// ============================================================================
// JOB DEDUPLICATION
// ============================================================================
/**
 * 28. Checks if a job with the same data already exists.
 *
 * @param {any} redis - Redis client
 * @param {string} queueName - Queue name
 * @param {any} jobData - Job data
 * @param {number} [window=3600000] - Deduplication window in ms
 * @returns {Promise<boolean>} True if duplicate exists
 *
 * @example
 * ```typescript
 * const isDuplicate = await isJobDuplicate(
 *   redisClient,
 *   'email-queue',
 *   { to: 'patient@example.com', subject: 'Reminder' },
 *   60000 // 1 minute window
 * );
 * if (!isDuplicate) {
 *   await queue.add('send-email', jobData);
 * }
 * ```
 */
const isJobDuplicate = async (redis, queueName, jobData, window = 3600000) => {
    const hash = hashJobData(jobData);
    const key = `dedup:${queueName}:${hash}`;
    const exists = await redis.get(key);
    return exists !== null;
};
exports.isJobDuplicate = isJobDuplicate;
/**
 * 29. Marks a job as processed for deduplication.
 *
 * @param {any} redis - Redis client
 * @param {string} queueName - Queue name
 * @param {any} jobData - Job data
 * @param {number} [window=3600000] - Deduplication window in ms
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await markJobAsProcessed(
 *   redisClient,
 *   'email-queue',
 *   { to: 'patient@example.com', subject: 'Reminder' },
 *   60000
 * );
 * ```
 */
const markJobAsProcessed = async (redis, queueName, jobData, window = 3600000) => {
    const hash = hashJobData(jobData);
    const key = `dedup:${queueName}:${hash}`;
    await redis.set(key, Date.now(), 'PX', window);
};
exports.markJobAsProcessed = markJobAsProcessed;
/**
 * 30. Adds a job with automatic deduplication.
 *
 * @param {any} queue - Bull queue instance
 * @param {any} redis - Redis client
 * @param {string} jobName - Job name
 * @param {any} jobData - Job data
 * @param {any} [options] - Job options
 * @param {number} [dedupWindow=3600000] - Deduplication window
 * @returns {Promise<any | null>} Job if added, null if duplicate
 *
 * @example
 * ```typescript
 * const job = await addJobWithDeduplication(
 *   emailQueue,
 *   redisClient,
 *   'send-reminder',
 *   { patientId: '123', type: 'appointment' },
 *   { priority: 5 },
 *   300000 // 5 minute dedup window
 * );
 * if (job) {
 *   console.log('Job added');
 * } else {
 *   console.log('Duplicate job skipped');
 * }
 * ```
 */
const addJobWithDeduplication = async (queue, redis, jobName, jobData, options, dedupWindow = 3600000) => {
    const isDuplicate = await (0, exports.isJobDuplicate)(redis, queue.name, jobData, dedupWindow);
    if (isDuplicate) {
        return null;
    }
    const job = await queue.add(jobName, jobData, options);
    await (0, exports.markJobAsProcessed)(redis, queue.name, jobData, dedupWindow);
    return job;
};
exports.addJobWithDeduplication = addJobWithDeduplication;
// ============================================================================
// DYNAMIC SCHEDULING
// ============================================================================
/**
 * 31. Creates a dynamic schedule that calculates next run time programmatically.
 *
 * @param {string} name - Schedule name
 * @param {Function} scheduleFunction - Function that returns next run time
 * @param {any} [context] - Schedule context
 * @returns {DynamicSchedule} Dynamic schedule
 *
 * @example
 * ```typescript
 * const dynamicSchedule = createDynamicSchedule(
 *   'business-hours-only',
 *   (ctx) => {
 *     const now = new Date();
 *     const nextRun = new Date(now);
 *     nextRun.setHours(9, 0, 0, 0);
 *     if (now.getHours() >= 9) {
 *       nextRun.setDate(nextRun.getDate() + 1);
 *     }
 *     // Skip weekends
 *     while (nextRun.getDay() === 0 || nextRun.getDay() === 6) {
 *       nextRun.setDate(nextRun.getDate() + 1);
 *     }
 *     return nextRun;
 *   }
 * );
 * ```
 */
const createDynamicSchedule = (name, scheduleFunction, context) => {
    return {
        id: `dynamic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        scheduleFunction,
        enabled: true,
        context: context || {},
    };
};
exports.createDynamicSchedule = createDynamicSchedule;
/**
 * 32. Schedules a job using a dynamic schedule.
 *
 * @param {any} queue - Bull queue instance
 * @param {DynamicSchedule} schedule - Dynamic schedule
 * @param {string} jobName - Job name
 * @param {any} jobData - Job data
 * @returns {Promise<any>} Scheduled job
 *
 * @example
 * ```typescript
 * const job = await scheduleJobDynamically(
 *   reportQueue,
 *   businessHoursSchedule,
 *   'generate-report',
 *   { reportType: 'daily' }
 * );
 * console.log('Next run:', job.opts.delay);
 * ```
 */
const scheduleJobDynamically = async (queue, schedule, jobName, jobData) => {
    if (!schedule.enabled) {
        throw new Error(`Schedule ${schedule.name} is not enabled`);
    }
    const nextRun = schedule.scheduleFunction(schedule.context);
    const delay = nextRun.getTime() - Date.now();
    if (delay < 0) {
        throw new Error('Next run time cannot be in the past');
    }
    return queue.add(jobName, jobData, { delay });
};
exports.scheduleJobDynamically = scheduleJobDynamically;
// ============================================================================
// CALENDAR-AWARE SCHEDULING
// ============================================================================
/**
 * 33. Creates a schedule window with allowed hours and excluded dates.
 *
 * @param {Date} start - Window start date
 * @param {Date} end - Window end date
 * @param {Object} [options] - Window options
 * @returns {ScheduleWindow} Schedule window
 *
 * @example
 * ```typescript
 * const window = createScheduleWindow(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   {
 *     allowedHours: [9, 10, 11, 14, 15, 16], // 9 AM - noon, 2 PM - 5 PM
 *     excludedDates: [
 *       new Date('2024-07-04'), // July 4th
 *       new Date('2024-12-25')  // Christmas
 *     ],
 *     maxConcurrent: 10
 *   }
 * );
 * ```
 */
const createScheduleWindow = (start, end, options) => {
    return {
        start,
        end,
        allowedHours: options?.allowedHours,
        excludedDates: options?.excludedDates,
        maxConcurrent: options?.maxConcurrent,
    };
};
exports.createScheduleWindow = createScheduleWindow;
/**
 * 34. Checks if a date/time is within a schedule window.
 *
 * @param {ScheduleWindow} window - Schedule window
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is allowed
 *
 * @example
 * ```typescript
 * const isAllowed = isDateInScheduleWindow(businessHoursWindow, new Date());
 * if (isAllowed) {
 *   await scheduleJob();
 * } else {
 *   console.log('Outside business hours');
 * }
 * ```
 */
const isDateInScheduleWindow = (window, date) => {
    // Check if within date range
    if (date < window.start || date > window.end) {
        return false;
    }
    // Check if hour is allowed
    if (window.allowedHours && !window.allowedHours.includes(date.getHours())) {
        return false;
    }
    // Check if date is excluded
    if (window.excludedDates) {
        const dateStr = date.toDateString();
        const isExcluded = window.excludedDates.some(excluded => excluded.toDateString() === dateStr);
        if (isExcluded) {
            return false;
        }
    }
    return true;
};
exports.isDateInScheduleWindow = isDateInScheduleWindow;
/**
 * 35. Finds next available time within a schedule window.
 *
 * @param {ScheduleWindow} window - Schedule window
 * @param {Date} [fromDate=new Date()] - Starting date
 * @returns {Date | null} Next available time, or null if none found
 *
 * @example
 * ```typescript
 * const nextAvailable = findNextAvailableTime(businessHoursWindow);
 * if (nextAvailable) {
 *   await scheduleJob(queue, 'process', data, nextAvailable);
 * }
 * ```
 */
const findNextAvailableTime = (window, fromDate = new Date()) => {
    let current = new Date(fromDate);
    const maxIterations = 365 * 24; // One year worth of hours
    let iterations = 0;
    while (iterations < maxIterations) {
        if ((0, exports.isDateInScheduleWindow)(window, current)) {
            return current;
        }
        // Move to next hour
        current = new Date(current.getTime() + 60 * 60 * 1000);
        // If we've passed the window end, return null
        if (current > window.end) {
            return null;
        }
        iterations++;
    }
    return null;
};
exports.findNextAvailableTime = findNextAvailableTime;
// ============================================================================
// SCHEDULE ANALYTICS
// ============================================================================
/**
 * 36. Collects analytics for a cron schedule.
 *
 * @param {any} cronScheduleModel - CronSchedule model
 * @param {any} jobResultModel - JobResult model
 * @param {string} scheduleName - Schedule name
 * @returns {Promise<ScheduleAnalytics>} Schedule analytics
 *
 * @example
 * ```typescript
 * const analytics = await getScheduleAnalytics(
 *   CronScheduleModel,
 *   JobResultModel,
 *   'daily-patient-report'
 * );
 * console.log(`Reliability: ${(analytics.reliability * 100).toFixed(1)}%`);
 * console.log(`Average duration: ${analytics.averageDuration}ms`);
 * ```
 */
const getScheduleAnalytics = async (cronScheduleModel, jobResultModel, scheduleName) => {
    const schedule = await cronScheduleModel.findOne({ where: { name: scheduleName } });
    if (!schedule) {
        throw new Error(`Schedule ${scheduleName} not found`);
    }
    const { Op } = require('sequelize');
    // Get job results for this schedule
    const results = await jobResultModel.findAll({
        where: {
            queueName: schedule.queueName,
            // Filter by jobs from this schedule (requires metadata tracking)
        },
    });
    const totalRuns = schedule.runCount || 0;
    const failedRuns = schedule.failureCount || 0;
    const successfulRuns = totalRuns - failedRuns;
    const durations = results.map((r) => r.duration).filter((d) => d > 0);
    const averageDuration = durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : 0;
    const reliability = totalRuns > 0 ? successfulRuns / totalRuns : 0;
    return {
        scheduleName: schedule.name,
        totalRuns,
        successfulRuns,
        failedRuns,
        averageDuration,
        lastRunAt: schedule.lastRun,
        nextRunAt: schedule.nextRun,
        reliability,
    };
};
exports.getScheduleAnalytics = getScheduleAnalytics;
/**
 * 37. Generates a schedule performance report.
 *
 * @param {any} cronScheduleModel - CronSchedule model
 * @param {any} jobResultModel - JobResult model
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Object>} Performance report
 *
 * @example
 * ```typescript
 * const report = await generateSchedulePerformanceReport(
 *   CronScheduleModel,
 *   JobResultModel,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * console.log('Total schedules:', report.totalSchedules);
 * console.log('Most reliable:', report.mostReliable);
 * console.log('Needs attention:', report.needsAttention);
 * ```
 */
const generateSchedulePerformanceReport = async (cronScheduleModel, jobResultModel, startDate, endDate) => {
    const { Op } = require('sequelize');
    const schedules = await cronScheduleModel.findAll({
        where: {
            lastRun: {
                [Op.between]: [startDate, endDate],
            },
        },
    });
    const analytics = [];
    for (const schedule of schedules) {
        try {
            const scheduleAnalytics = await (0, exports.getScheduleAnalytics)(cronScheduleModel, jobResultModel, schedule.name);
            analytics.push(scheduleAnalytics);
        }
        catch (error) {
            console.error(`Failed to get analytics for ${schedule.name}:`, error);
        }
    }
    const totalRuns = analytics.reduce((sum, a) => sum + a.totalRuns, 0);
    const totalSuccess = analytics.reduce((sum, a) => sum + a.successfulRuns, 0);
    const successRate = totalRuns > 0 ? totalSuccess / totalRuns : 0;
    // Sort by reliability
    const sortedByReliability = [...analytics].sort((a, b) => b.reliability - a.reliability);
    return {
        totalSchedules: schedules.length,
        activeSchedules: schedules.filter((s) => s.enabled).length,
        totalRuns,
        successRate,
        mostReliable: sortedByReliability.slice(0, 10),
        needsAttention: sortedByReliability.filter(a => a.reliability < 0.95).slice(0, 10),
    };
};
exports.generateSchedulePerformanceReport = generateSchedulePerformanceReport;
// ============================================================================
// RECURRING PATTERNS
// ============================================================================
/**
 * 38. Creates a cron expression from a recurring pattern.
 *
 * @param {RecurringPattern} pattern - Recurring pattern
 * @returns {string} Cron expression
 *
 * @example
 * ```typescript
 * const cronExpr = createCronFromPattern({
 *   type: 'weekly',
 *   daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
 *   timeOfDay: { hour: 9, minute: 0 }
 * });
 * console.log(cronExpr); // "0 9 * * 1,3,5"
 * ```
 */
const createCronFromPattern = (pattern) => {
    if (pattern.cronExpression) {
        return pattern.cronExpression;
    }
    const minute = pattern.timeOfDay?.minute ?? 0;
    const hour = pattern.timeOfDay?.hour ?? 0;
    switch (pattern.type) {
        case 'daily':
            return `${minute} ${hour} * * *`;
        case 'weekly':
            const daysOfWeek = pattern.daysOfWeek?.join(',') || '*';
            return `${minute} ${hour} * * ${daysOfWeek}`;
        case 'monthly':
            const daysOfMonth = pattern.daysOfMonth?.join(',') || '1';
            return `${minute} ${hour} ${daysOfMonth} * *`;
        case 'yearly':
            const months = pattern.monthsOfYear?.join(',') || '1';
            const dayOfMonth = pattern.daysOfMonth?.[0] || '1';
            return `${minute} ${hour} ${dayOfMonth} ${months} *`;
        default:
            throw new Error(`Unsupported pattern type: ${pattern.type}`);
    }
};
exports.createCronFromPattern = createCronFromPattern;
/**
 * 39. Creates a schedule from a recurring pattern.
 *
 * @param {any} cronScheduleModel - CronSchedule model
 * @param {string} name - Schedule name
 * @param {RecurringPattern} pattern - Recurring pattern
 * @param {Object} jobConfig - Job configuration
 * @returns {Promise<any>} Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await createScheduleFromPattern(
 *   CronScheduleModel,
 *   'weekly-medication-check',
 *   {
 *     type: 'weekly',
 *     daysOfWeek: [1, 3, 5],
 *     timeOfDay: { hour: 14, minute: 30 }
 *   },
 *   {
 *     queueName: 'health-checks',
 *     jobName: 'medication-check',
 *     jobData: { checkType: 'medication' }
 *   }
 * );
 * ```
 */
const createScheduleFromPattern = async (cronScheduleModel, name, pattern, jobConfig) => {
    const cronExpression = (0, exports.createCronFromPattern)(pattern);
    return (0, exports.createCronSchedule)(cronScheduleModel, {
        name,
        cronExpression,
        timezone: 'UTC',
        queueName: jobConfig.queueName,
        jobName: jobConfig.jobName,
        jobData: jobConfig.jobData,
        jobOptions: jobConfig.jobOptions,
        enabled: true,
    });
};
exports.createScheduleFromPattern = createScheduleFromPattern;
// ============================================================================
// CONCURRENCY MANAGEMENT
// ============================================================================
/**
 * 40. Creates a concurrency limiter for job execution.
 *
 * @param {any} redis - Redis client
 * @param {string} resourceId - Resource identifier
 * @param {number} maxConcurrent - Maximum concurrent jobs
 * @returns {Object} Concurrency limiter
 *
 * @example
 * ```typescript
 * const limiter = createConcurrencyLimiter(
 *   redisClient,
 *   'heavy-processing',
 *   5
 * );
 * const slot = await limiter.acquire();
 * if (slot) {
 *   try {
 *     await processJob();
 *   } finally {
 *     await limiter.release(slot);
 *   }
 * }
 * ```
 */
const createConcurrencyLimiter = (redis, resourceId, maxConcurrent) => {
    const key = `concurrency:${resourceId}`;
    return {
        async acquire(timeout) {
            const slotId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const startTime = Date.now();
            while (true) {
                const current = await redis.zcard(key);
                if (current < maxConcurrent) {
                    const added = await redis.zadd(key, Date.now(), slotId);
                    if (added) {
                        await redis.pexpire(key, 300000); // 5 minute TTL
                        return slotId;
                    }
                }
                if (timeout && Date.now() - startTime > timeout) {
                    return null;
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        },
        async release(slotId) {
            await redis.zrem(key, slotId);
        },
        async getCurrentCount() {
            return redis.zcard(key);
        },
        async getRemainingSlots() {
            const current = await redis.zcard(key);
            return Math.max(0, maxConcurrent - current);
        },
        async waitForSlot(timeout) {
            const slot = await this.acquire(timeout);
            if (!slot) {
                throw new Error('Failed to acquire concurrency slot');
            }
            return slot;
        },
    };
};
exports.createConcurrencyLimiter = createConcurrencyLimiter;
/**
 * 41. Executes a job with concurrency limiting.
 *
 * @param {any} redis - Redis client
 * @param {string} resourceId - Resource identifier
 * @param {number} maxConcurrent - Maximum concurrent executions
 * @param {Function} jobFunction - Job function
 * @param {number} [timeout] - Acquisition timeout
 * @returns {Promise<any>} Job result
 *
 * @example
 * ```typescript
 * const result = await executeWithConcurrencyLimit(
 *   redisClient,
 *   'api-calls',
 *   10,
 *   async () => {
 *     return await callExternalAPI();
 *   },
 *   30000
 * );
 * ```
 */
const executeWithConcurrencyLimit = async (redis, resourceId, maxConcurrent, jobFunction, timeout) => {
    const limiter = (0, exports.createConcurrencyLimiter)(redis, resourceId, maxConcurrent);
    const slot = await limiter.acquire(timeout);
    if (!slot) {
        throw new Error(`Failed to acquire concurrency slot for ${resourceId}`);
    }
    try {
        return await jobFunction();
    }
    finally {
        await limiter.release(slot);
    }
};
exports.executeWithConcurrencyLimit = executeWithConcurrencyLimit;
// ============================================================================
// BATCH SCHEDULING
// ============================================================================
/**
 * 42. Schedules multiple jobs at optimized intervals.
 *
 * @param {any} queue - Bull queue instance
 * @param {Array} jobs - Jobs to schedule
 * @param {Object} options - Scheduling options
 * @returns {Promise<any[]>} Scheduled jobs
 *
 * @example
 * ```typescript
 * const jobs = await scheduleBatchWithOptimization(
 *   processingQueue,
 *   patientRecords.map(record => ({
 *     name: 'process-record',
 *     data: record
 *   })),
 *   {
 *     spreadInterval: 60000, // Spread over 1 minute
 *     maxConcurrent: 10,
 *     priorityFunction: (job) => job.data.urgent ? 100 : 50
 *   }
 * );
 * ```
 */
const scheduleBatchWithOptimization = async (queue, jobs, options = {}) => {
    const spreadInterval = options.spreadInterval || 0;
    const delayIncrement = jobs.length > 1 && spreadInterval > 0
        ? spreadInterval / jobs.length
        : 0;
    const scheduledJobs = [];
    for (let i = 0; i < jobs.length; i++) {
        const jobSpec = jobs[i];
        const delay = Math.floor(delayIncrement * i);
        const priority = options.priorityFunction
            ? options.priorityFunction(jobSpec)
            : undefined;
        const job = await queue.add(jobSpec.name, jobSpec.data, {
            ...jobSpec.options,
            delay,
            priority,
        });
        scheduledJobs.push(job);
    }
    return scheduledJobs;
};
exports.scheduleBatchWithOptimization = scheduleBatchWithOptimization;
/**
 * 43. Creates a job scheduler with adaptive timing.
 *
 * @param {any} queue - Bull queue instance
 * @param {Object} options - Scheduler options
 * @returns {Object} Adaptive scheduler
 *
 * @example
 * ```typescript
 * const scheduler = createAdaptiveJobScheduler(processingQueue, {
 *   minDelay: 1000,
 *   maxDelay: 60000,
 *   loadThreshold: 0.8
 * });
 *
 * scheduler.onLoad(async () => {
 *   const metrics = await queue.getMetrics();
 *   return metrics.active / metrics.concurrency;
 * });
 *
 * await scheduler.schedule('process', data);
 * ```
 */
const createAdaptiveJobScheduler = (queue, options = {}) => {
    const minDelay = options.minDelay || 1000;
    const maxDelay = options.maxDelay || 60000;
    const loadThreshold = options.loadThreshold || 0.8;
    let loadFunction = null;
    const calculateDelay = async () => {
        if (!loadFunction) {
            return minDelay;
        }
        const load = await loadFunction();
        if (load < loadThreshold) {
            return minDelay;
        }
        // Increase delay proportionally to load
        const excess = load - loadThreshold;
        const delayIncrease = (maxDelay - minDelay) * (excess / (1 - loadThreshold));
        return Math.min(maxDelay, minDelay + delayIncrease);
    };
    return {
        onLoad(fn) {
            loadFunction = fn;
        },
        async schedule(jobName, data, options) {
            const delay = await calculateDelay();
            return queue.add(jobName, data, {
                ...options,
                delay,
            });
        },
        async getCurrentDelay() {
            return calculateDelay();
        },
    };
};
exports.createAdaptiveJobScheduler = createAdaptiveJobScheduler;
/**
 * 44. Optimizes job scheduling based on historical performance.
 *
 * @param {any} jobResultModel - JobResult model
 * @param {string} queueName - Queue name
 * @param {number} [lookbackDays=7] - Days to analyze
 * @returns {Promise<Object>} Optimization recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await optimizeScheduleBasedOnHistory(
 *   JobResultModel,
 *   'processing-queue',
 *   14
 * );
 * console.log('Recommended concurrency:', recommendations.optimalConcurrency);
 * console.log('Best time windows:', recommendations.bestTimeWindows);
 * ```
 */
const optimizeScheduleBasedOnHistory = async (jobResultModel, queueName, lookbackDays = 7) => {
    const { Op } = require('sequelize');
    const cutoffDate = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000);
    const results = await jobResultModel.findAll({
        where: {
            queueName,
            completedAt: {
                [Op.gt]: cutoffDate,
            },
        },
    });
    if (results.length === 0) {
        return {
            optimalConcurrency: 5,
            averageDuration: 0,
            peakHours: [],
            bestTimeWindows: [],
            successRate: 0,
        };
    }
    // Calculate average duration
    const durations = results.map((r) => r.duration).filter((d) => d > 0);
    const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    // Calculate success rate
    const successful = results.filter((r) => r.status === 'completed').length;
    const successRate = successful / results.length;
    // Find peak hours
    const hourCounts = {};
    results.forEach((r) => {
        const hour = new Date(r.completedAt).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const peakHours = Object.entries(hourCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([hour]) => parseInt(hour));
    // Recommend optimal concurrency based on average duration
    const optimalConcurrency = Math.max(1, Math.ceil(60000 / averageDuration) // Jobs per minute
    );
    // Find best time windows (low failure rate)
    const bestTimeWindows = peakHours
        .map(hour => ({ start: hour, end: (hour + 1) % 24 }));
    return {
        optimalConcurrency,
        averageDuration,
        peakHours,
        bestTimeWindows,
        successRate,
    };
};
exports.optimizeScheduleBasedOnHistory = optimizeScheduleBasedOnHistory;
/**
 * 45. Creates a self-optimizing job scheduler.
 *
 * @param {any} queue - Bull queue instance
 * @param {any} jobResultModel - JobResult model
 * @param {Object} options - Optimization options
 * @returns {Object} Self-optimizing scheduler
 *
 * @example
 * ```typescript
 * const scheduler = createSelfOptimizingScheduler(
 *   processingQueue,
 *   JobResultModel,
 *   {
 *     optimizationInterval: 3600000, // Optimize every hour
 *     lookbackDays: 7,
 *     autoAdjustConcurrency: true
 *   }
 * );
 * scheduler.start();
 * // Scheduler automatically adjusts based on performance
 * ```
 */
const createSelfOptimizingScheduler = (queue, jobResultModel, options = {}) => {
    let intervalId = null;
    let currentRecommendations = null;
    const optimize = async () => {
        try {
            const recommendations = await (0, exports.optimizeScheduleBasedOnHistory)(jobResultModel, queue.name, options.lookbackDays || 7);
            currentRecommendations = recommendations;
            console.log(`[${queue.name}] Optimization complete: ` +
                `Optimal concurrency: ${recommendations.optimalConcurrency}, ` +
                `Success rate: ${(recommendations.successRate * 100).toFixed(1)}%`);
            // Auto-adjust concurrency if enabled
            if (options.autoAdjustConcurrency) {
                // Note: Actual concurrency adjustment depends on queue implementation
                console.log(`[${queue.name}] Recommended concurrency: ${recommendations.optimalConcurrency}`);
            }
        }
        catch (error) {
            console.error(`[${queue.name}] Optimization error:`, error);
        }
    };
    return {
        start() {
            if (intervalId)
                return;
            const interval = options.optimizationInterval || 3600000; // 1 hour default
            intervalId = setInterval(optimize, interval);
            optimize(); // Run immediately
        },
        stop() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        },
        async optimizeNow() {
            return optimize();
        },
        getRecommendations() {
            return currentRecommendations;
        },
        isRunning() {
            return intervalId !== null;
        },
    };
};
exports.createSelfOptimizingScheduler = createSelfOptimizingScheduler;
// ============================================================================
// HELPER UTILITIES
// ============================================================================
/**
 * Validates cron expression format.
 */
function isValidCronExpression(expr) {
    try {
        const cronParser = require('cron-parser');
        cronParser.parseExpression(expr);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Creates a hash of job data for deduplication.
 */
function hashJobData(data) {
    const crypto = require('crypto');
    const json = JSON.stringify(data, Object.keys(data).sort());
    return crypto.createHash('sha256').update(json).digest('hex');
}
/**
 * Formats a date to ISO string in specific timezone.
 */
function formatDateInTimezone(date, timezone) {
    return date.toLocaleString('en-US', { timeZone: timezone });
}
//# sourceMappingURL=background-jobs-scheduling-kit.js.map