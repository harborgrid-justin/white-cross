/**
 * LOC: APPAREL-LC-001
 * File: /reuse/logistics/apparel-lifecycle-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Product management services
 *   - Merchandising systems
 *   - Planning modules
 *   - Distribution services
 */
/**
 * Lifecycle stage enumeration
 */
export declare enum LifecycleStage {
    CONCEPT = "CONCEPT",
    DESIGN = "DESIGN",
    DEVELOPMENT = "DEVELOPMENT",
    SAMPLING = "SAMPLING",
    PRODUCTION = "PRODUCTION",
    DISTRIBUTION = "DISTRIBUTION",
    RETAIL = "RETAIL",
    MARKDOWN = "MARKDOWN",
    CLEARANCE = "CLEARANCE",
    END_OF_LIFE = "END_OF_LIFE"
}
/**
 * Stage status enumeration
 */
export declare enum StageStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    ON_HOLD = "ON_HOLD"
}
/**
 * Season type enumeration
 */
export declare enum SeasonType {
    SPRING = "SPRING",
    SUMMER = "SUMMER",
    FALL = "FALL",
    WINTER = "WINTER",
    HOLIDAY = "HOLIDAY",
    RESORT = "RESORT",
    PRE_FALL = "PRE_FALL",
    PRE_SPRING = "PRE_SPRING"
}
/**
 * Approval gate type enumeration
 */
export declare enum ApprovalGateType {
    DESIGN_REVIEW = "DESIGN_REVIEW",
    TECH_PACK_REVIEW = "TECH_PACK_REVIEW",
    SAMPLE_APPROVAL = "SAMPLE_APPROVAL",
    COSTING_APPROVAL = "COSTING_APPROVAL",
    PRODUCTION_APPROVAL = "PRODUCTION_APPROVAL",
    QUALITY_ASSURANCE = "QUALITY_ASSURANCE",
    MERCHANDISING_APPROVAL = "MERCHANDISING_APPROVAL",
    FINAL_APPROVAL = "FINAL_APPROVAL"
}
/**
 * Development status enumeration
 */
export declare enum DevelopmentStatus {
    SKETCH = "SKETCH",
    CAD_DESIGN = "CAD_DESIGN",
    TECH_PACK = "TECH_PACK",
    PROTO_SAMPLE = "PROTO_SAMPLE",
    FIT_SAMPLE = "FIT_SAMPLE",
    SALES_SAMPLE = "SALES_SAMPLE",
    PRODUCTION_SAMPLE = "PRODUCTION_SAMPLE",
    APPROVED = "APPROVED"
}
/**
 * Markdown strategy enumeration
 */
export declare enum MarkdownStrategy {
    AGGRESSIVE = "AGGRESSIVE",
    MODERATE = "MODERATE",
    CONSERVATIVE = "CONSERVATIVE",
    SEASONAL = "SEASONAL",
    CLEARANCE = "CLEARANCE",
    PROMOTIONAL = "PROMOTIONAL"
}
/**
 * Distribution channel enumeration
 */
export declare enum DistributionChannel {
    WHOLESALE = "WHOLESALE",
    RETAIL = "RETAIL",
    ONLINE = "ONLINE",
    OUTLET = "OUTLET",
    DIRECT_TO_CONSUMER = "DIRECT_TO_CONSUMER",
    MARKETPLACE = "MARKETPLACE"
}
/**
 * Product lifecycle record
 */
export interface ProductLifecycle {
    lifecycleId: string;
    productId: string;
    sku: string;
    styleName: string;
    seasonId: string;
    currentStage: LifecycleStage;
    stageStatus: StageStatus;
    stageHistory: StageTransition[];
    approvalGates: ApprovalGate[];
    developmentMilestones: DevelopmentMilestone[];
    distributionPlan?: DistributionPlan;
    markdownSchedule?: MarkdownSchedule;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Stage transition record
 */
export interface StageTransition {
    transitionId: string;
    fromStage: LifecycleStage | null;
    toStage: LifecycleStage;
    status: StageStatus;
    transitionedAt: Date;
    transitionedBy: string;
    notes?: string;
    approvalRequired: boolean;
    approvedBy?: string;
    approvedAt?: Date;
}
/**
 * Approval gate definition
 */
export interface ApprovalGate {
    gateId: string;
    gateType: ApprovalGateType;
    stage: LifecycleStage;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    requiredApprovers: string[];
    approvals: GateApproval[];
    dueDate?: Date;
    completedAt?: Date;
    notes?: string;
}
/**
 * Individual gate approval
 */
export interface GateApproval {
    approvalId: string;
    approverId: string;
    approverName: string;
    decision: 'APPROVED' | 'REJECTED' | 'PENDING';
    approvedAt?: Date;
    comments?: string;
    attachments?: string[];
}
/**
 * Season planning record
 */
export interface SeasonPlan {
    seasonId: string;
    seasonName: string;
    seasonType: SeasonType;
    year: number;
    startDate: Date;
    endDate: Date;
    launchDate: Date;
    markdownStartDate: Date;
    clearanceDate: Date;
    collections: SeasonCollection[];
    targetRevenue: number;
    targetMargin: number;
    budgetAllocated: number;
    status: 'PLANNING' | 'IN_DEVELOPMENT' | 'LAUNCHED' | 'ACTIVE' | 'MARKDOWN' | 'CLOSED';
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Season collection within a season
 */
export interface SeasonCollection {
    collectionId: string;
    collectionName: string;
    description: string;
    targetDemographic: string;
    pricePoints: PricePoint[];
    productCount: number;
    developmentStatus: DevelopmentStatus;
    launchDate: Date;
}
/**
 * Price point definition
 */
export interface PricePoint {
    category: string;
    minPrice: number;
    maxPrice: number;
    targetMargin: number;
}
/**
 * Development milestone
 */
export interface DevelopmentMilestone {
    milestoneId: string;
    name: string;
    description: string;
    stage: LifecycleStage;
    status: DevelopmentStatus;
    dueDate: Date;
    completedAt?: Date;
    assignedTo: string[];
    deliverables: string[];
    dependencies: string[];
}
/**
 * Distribution plan
 */
export interface DistributionPlan {
    planId: string;
    productId: string;
    channels: ChannelAllocation[];
    totalQuantity: number;
    allocatedQuantity: number;
    remainingQuantity: number;
    distributionStartDate: Date;
    distributionEndDate: Date;
    status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
}
/**
 * Channel allocation within distribution
 */
export interface ChannelAllocation {
    allocationId: string;
    channel: DistributionChannel;
    quantity: number;
    allocatedQuantity: number;
    locations: LocationAllocation[];
    priority: number;
    status: 'PENDING' | 'ALLOCATED' | 'SHIPPED' | 'RECEIVED';
}
/**
 * Location allocation
 */
export interface LocationAllocation {
    locationId: string;
    locationName: string;
    quantity: number;
    shipDate?: Date;
    receivedDate?: Date;
    status: 'PENDING' | 'SHIPPED' | 'RECEIVED';
}
/**
 * Markdown schedule
 */
export interface MarkdownSchedule {
    scheduleId: string;
    productId: string;
    strategy: MarkdownStrategy;
    originalPrice: number;
    currentPrice: number;
    markdownEvents: MarkdownEvent[];
    minimumPrice: number;
    clearancePrice: number;
    inventoryThreshold: number;
    status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED';
}
/**
 * Individual markdown event
 */
export interface MarkdownEvent {
    eventId: string;
    markdownDate: Date;
    previousPrice: number;
    newPrice: number;
    discountPercentage: number;
    reason: string;
    triggeredBy: 'SCHEDULE' | 'INVENTORY' | 'SEASONAL' | 'MANUAL';
    expectedSellThrough: number;
    actualSellThrough?: number;
    executedAt?: Date;
}
/**
 * SKU lifecycle metrics
 */
export interface SKULifecycleMetrics {
    sku: string;
    productId: string;
    lifecycleId: string;
    daysInDevelopment: number;
    daysInProduction: number;
    daysInRetail: number;
    daysOnMarkdown: number;
    totalLifecycleDays: number;
    developmentCost: number;
    productionCost: number;
    distributionCost: number;
    totalRevenue: number;
    totalMargin: number;
    marginPercentage: number;
    sellThroughRate: number;
    returnRate: number;
    inventoryTurnover: number;
}
/**
 * Lifecycle workflow configuration
 */
export interface LifecycleWorkflowConfig {
    workflowId: string;
    name: string;
    productCategory: string;
    stages: WorkflowStage[];
    autoApprovals: ApprovalGateType[];
    notificationRules: NotificationRule[];
}
/**
 * Workflow stage configuration
 */
export interface WorkflowStage {
    stage: LifecycleStage;
    requiredDuration?: number;
    approvalGates: ApprovalGateType[];
    requiredMilestones: string[];
    allowedTransitions: LifecycleStage[];
}
/**
 * Notification rule
 */
export interface NotificationRule {
    ruleId: string;
    trigger: 'STAGE_CHANGE' | 'APPROVAL_PENDING' | 'MILESTONE_DUE' | 'MARKDOWN_TRIGGER';
    recipients: string[];
    template: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
}
/**
 * Sequelize Model: ProductLifecycle
 *
 * @Table({
 *   tableName: 'product_lifecycles',
 *   timestamps: true,
 *   paranoid: true,
 *   indexes: [
 *     { fields: ['productId'] },
 *     { fields: ['sku'], unique: true },
 *     { fields: ['seasonId'] },
 *     { fields: ['currentStage'] },
 *     { fields: ['stageStatus'] },
 *     { fields: ['createdAt'] }
 *   ]
 * })
 * export class ProductLifecycleModel extends Model {
 *   @Column({ type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 })
 *   lifecycleId: string;
 *
 *   @Column({ type: DataTypes.UUID, allowNull: false })
 *   productId: string;
 *
 *   @Column({ type: DataTypes.STRING(100), allowNull: false, unique: true })
 *   sku: string;
 *
 *   @Column({ type: DataTypes.STRING(255), allowNull: false })
 *   styleName: string;
 *
 *   @Column({ type: DataTypes.UUID, allowNull: false })
 *   seasonId: string;
 *
 *   @Column({ type: DataTypes.ENUM(...Object.values(LifecycleStage)), allowNull: false })
 *   currentStage: LifecycleStage;
 *
 *   @Column({ type: DataTypes.ENUM(...Object.values(StageStatus)), allowNull: false })
 *   stageStatus: StageStatus;
 *
 *   @Column({ type: DataTypes.JSON, allowNull: false, defaultValue: [] })
 *   stageHistory: StageTransition[];
 *
 *   @Column({ type: DataTypes.JSON, allowNull: false, defaultValue: [] })
 *   approvalGates: ApprovalGate[];
 *
 *   @Column({ type: DataTypes.JSON, allowNull: false, defaultValue: [] })
 *   developmentMilestones: DevelopmentMilestone[];
 *
 *   @Column({ type: DataTypes.JSON })
 *   distributionPlan: DistributionPlan;
 *
 *   @Column({ type: DataTypes.JSON })
 *   markdownSchedule: MarkdownSchedule;
 *
 *   @Column({ type: DataTypes.JSON, defaultValue: {} })
 *   metadata: Record<string, any>;
 *
 *   @BelongsTo(() => SeasonPlanModel, { foreignKey: 'seasonId' })
 *   season: SeasonPlanModel;
 *
 *   @HasMany(() => SKULifecycleMetricsModel, { foreignKey: 'lifecycleId' })
 *   metrics: SKULifecycleMetricsModel[];
 * }
 */
/**
 * Sequelize Model: SeasonPlan
 *
 * @Table({
 *   tableName: 'season_plans',
 *   timestamps: true,
 *   paranoid: true,
 *   indexes: [
 *     { fields: ['seasonType', 'year'] },
 *     { fields: ['startDate', 'endDate'] },
 *     { fields: ['status'] },
 *     { fields: ['launchDate'] }
 *   ]
 * })
 * export class SeasonPlanModel extends Model {
 *   @Column({ type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 })
 *   seasonId: string;
 *
 *   @Column({ type: DataTypes.STRING(100), allowNull: false })
 *   seasonName: string;
 *
 *   @Column({ type: DataTypes.ENUM(...Object.values(SeasonType)), allowNull: false })
 *   seasonType: SeasonType;
 *
 *   @Column({ type: DataTypes.INTEGER, allowNull: false })
 *   year: number;
 *
 *   @Column({ type: DataTypes.DATE, allowNull: false })
 *   startDate: Date;
 *
 *   @Column({ type: DataTypes.DATE, allowNull: false })
 *   endDate: Date;
 *
 *   @Column({ type: DataTypes.DATE, allowNull: false })
 *   launchDate: Date;
 *
 *   @Column({ type: DataTypes.DATE, allowNull: false })
 *   markdownStartDate: Date;
 *
 *   @Column({ type: DataTypes.DATE, allowNull: false })
 *   clearanceDate: Date;
 *
 *   @Column({ type: DataTypes.JSON, defaultValue: [] })
 *   collections: SeasonCollection[];
 *
 *   @Column({ type: DataTypes.DECIMAL(15, 2), defaultValue: 0 })
 *   targetRevenue: number;
 *
 *   @Column({ type: DataTypes.DECIMAL(5, 2), defaultValue: 0 })
 *   targetMargin: number;
 *
 *   @Column({ type: DataTypes.DECIMAL(15, 2), defaultValue: 0 })
 *   budgetAllocated: number;
 *
 *   @Column({ type: DataTypes.ENUM('PLANNING', 'IN_DEVELOPMENT', 'LAUNCHED', 'ACTIVE', 'MARKDOWN', 'CLOSED') })
 *   status: string;
 *
 *   @HasMany(() => ProductLifecycleModel, { foreignKey: 'seasonId' })
 *   products: ProductLifecycleModel[];
 * }
 */
/**
 * Sequelize Model: SKULifecycleMetrics
 *
 * @Table({
 *   tableName: 'sku_lifecycle_metrics',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['sku'], unique: true },
 *     { fields: ['productId'] },
 *     { fields: ['lifecycleId'] },
 *     { fields: ['sellThroughRate'] },
 *     { fields: ['marginPercentage'] }
 *   ]
 * })
 * export class SKULifecycleMetricsModel extends Model {
 *   @Column({ type: DataTypes.STRING(100), primaryKey: true })
 *   sku: string;
 *
 *   @Column({ type: DataTypes.UUID, allowNull: false })
 *   productId: string;
 *
 *   @Column({ type: DataTypes.UUID, allowNull: false })
 *   lifecycleId: string;
 *
 *   @Column({ type: DataTypes.INTEGER, defaultValue: 0 })
 *   daysInDevelopment: number;
 *
 *   @Column({ type: DataTypes.INTEGER, defaultValue: 0 })
 *   daysInProduction: number;
 *
 *   @Column({ type: DataTypes.INTEGER, defaultValue: 0 })
 *   daysInRetail: number;
 *
 *   @Column({ type: DataTypes.INTEGER, defaultValue: 0 })
 *   daysOnMarkdown: number;
 *
 *   @Column({ type: DataTypes.INTEGER, defaultValue: 0 })
 *   totalLifecycleDays: number;
 *
 *   @Column({ type: DataTypes.DECIMAL(15, 2), defaultValue: 0 })
 *   developmentCost: number;
 *
 *   @Column({ type: DataTypes.DECIMAL(15, 2), defaultValue: 0 })
 *   productionCost: number;
 *
 *   @Column({ type: DataTypes.DECIMAL(15, 2), defaultValue: 0 })
 *   distributionCost: number;
 *
 *   @Column({ type: DataTypes.DECIMAL(15, 2), defaultValue: 0 })
 *   totalRevenue: number;
 *
 *   @Column({ type: DataTypes.DECIMAL(15, 2), defaultValue: 0 })
 *   totalMargin: number;
 *
 *   @Column({ type: DataTypes.DECIMAL(5, 2), defaultValue: 0 })
 *   marginPercentage: number;
 *
 *   @Column({ type: DataTypes.DECIMAL(5, 2), defaultValue: 0 })
 *   sellThroughRate: number;
 *
 *   @Column({ type: DataTypes.DECIMAL(5, 2), defaultValue: 0 })
 *   returnRate: number;
 *
 *   @Column({ type: DataTypes.DECIMAL(5, 2), defaultValue: 0 })
 *   inventoryTurnover: number;
 *
 *   @BelongsTo(() => ProductLifecycleModel, { foreignKey: 'lifecycleId' })
 *   lifecycle: ProductLifecycleModel;
 * }
 */
/**
 * 1. Creates a new product lifecycle record.
 *
 * @param {object} config - Lifecycle configuration
 * @returns {ProductLifecycle} New lifecycle record
 *
 * @example
 * ```typescript
 * const lifecycle = createProductLifecycle({
 *   productId: 'PROD-001',
 *   sku: 'SKU-SS24-001',
 *   styleName: 'Summer Floral Dress',
 *   seasonId: 'SEASON-SS24'
 * });
 * ```
 */
export declare function createProductLifecycle(config: {
    productId: string;
    sku: string;
    styleName: string;
    seasonId: string;
    metadata?: Record<string, any>;
}): ProductLifecycle;
/**
 * 2. Transitions product to next lifecycle stage.
 *
 * @param {ProductLifecycle} lifecycle - Current lifecycle
 * @param {LifecycleStage} toStage - Target stage
 * @param {string} userId - User performing transition
 * @param {string} notes - Transition notes
 * @returns {ProductLifecycle} Updated lifecycle
 *
 * @example
 * ```typescript
 * const updated = transitionLifecycleStage(
 *   lifecycle,
 *   LifecycleStage.DESIGN,
 *   'USER-123',
 *   'Design approved, moving to development'
 * );
 * ```
 */
export declare function transitionLifecycleStage(lifecycle: ProductLifecycle, toStage: LifecycleStage, userId: string, notes?: string): ProductLifecycle;
/**
 * 3. Adds approval gate to lifecycle stage.
 *
 * @param {ProductLifecycle} lifecycle - Current lifecycle
 * @param {ApprovalGateType} gateType - Type of approval gate
 * @param {string[]} requiredApprovers - List of approver IDs
 * @param {Date} dueDate - Approval due date
 * @returns {ProductLifecycle} Updated lifecycle
 *
 * @example
 * ```typescript
 * const updated = addApprovalGate(
 *   lifecycle,
 *   ApprovalGateType.DESIGN_REVIEW,
 *   ['DESIGNER-001', 'MANAGER-002'],
 *   new Date('2024-03-15')
 * );
 * ```
 */
export declare function addApprovalGate(lifecycle: ProductLifecycle, gateType: ApprovalGateType, requiredApprovers: string[], dueDate?: Date): ProductLifecycle;
/**
 * 4. Processes approval gate decision.
 *
 * @param {ProductLifecycle} lifecycle - Current lifecycle
 * @param {string} gateId - Approval gate ID
 * @param {string} approverId - Approver user ID
 * @param {string} decision - Approval decision
 * @param {string} comments - Approval comments
 * @returns {ProductLifecycle} Updated lifecycle
 *
 * @example
 * ```typescript
 * const updated = processApprovalDecision(
 *   lifecycle,
 *   'GATE-123',
 *   'DESIGNER-001',
 *   'APPROVED',
 *   'Design looks great, approved for production'
 * );
 * ```
 */
export declare function processApprovalDecision(lifecycle: ProductLifecycle, gateId: string, approverId: string, decision: 'APPROVED' | 'REJECTED', comments?: string): ProductLifecycle;
/**
 * 5. Gets current stage status and progress.
 *
 * @param {ProductLifecycle} lifecycle - Lifecycle record
 * @returns {object} Stage status information
 *
 * @example
 * ```typescript
 * const status = getStageStatus(lifecycle);
 * console.log(`Current: ${status.currentStage}, Progress: ${status.progressPercentage}%`);
 * ```
 */
export declare function getStageStatus(lifecycle: ProductLifecycle): {
    currentStage: LifecycleStage;
    stageStatus: StageStatus;
    daysInStage: number;
    progressPercentage: number;
    pendingApprovals: ApprovalGate[];
    completedMilestones: number;
    totalMilestones: number;
};
/**
 * 6. Validates lifecycle stage transition.
 *
 * @param {ProductLifecycle} lifecycle - Current lifecycle
 * @param {LifecycleStage} targetStage - Target stage
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateStageTransition(lifecycle, LifecycleStage.PRODUCTION);
 * if (!validation.valid) {
 *   console.error('Cannot transition:', validation.errors);
 * }
 * ```
 */
export declare function validateStageTransition(lifecycle: ProductLifecycle, targetStage: LifecycleStage): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 7. Gets lifecycle stage history and timeline.
 *
 * @param {ProductLifecycle} lifecycle - Lifecycle record
 * @returns {object} Stage history timeline
 *
 * @example
 * ```typescript
 * const history = getStageHistory(lifecycle);
 * history.transitions.forEach(t => {
 *   console.log(`${t.fromStage} -> ${t.toStage} on ${t.transitionedAt}`);
 * });
 * ```
 */
export declare function getStageHistory(lifecycle: ProductLifecycle): {
    transitions: StageTransition[];
    totalDays: number;
    stageBreakdown: Record<LifecycleStage, number>;
    currentStageStartDate: Date;
};
/**
 * 8. Updates lifecycle stage status.
 *
 * @param {ProductLifecycle} lifecycle - Current lifecycle
 * @param {StageStatus} status - New status
 * @param {string} reason - Reason for status change
 * @returns {ProductLifecycle} Updated lifecycle
 *
 * @example
 * ```typescript
 * const updated = updateStageStatus(
 *   lifecycle,
 *   StageStatus.ON_HOLD,
 *   'Waiting for fabric samples from supplier'
 * );
 * ```
 */
export declare function updateStageStatus(lifecycle: ProductLifecycle, status: StageStatus, reason?: string): ProductLifecycle;
/**
 * 9. Creates a new season plan.
 *
 * @param {object} config - Season configuration
 * @returns {SeasonPlan} New season plan
 *
 * @example
 * ```typescript
 * const season = createSeasonPlan({
 *   seasonName: 'Spring/Summer 2024',
 *   seasonType: SeasonType.SPRING,
 *   year: 2024,
 *   startDate: new Date('2024-02-01'),
 *   endDate: new Date('2024-07-31'),
 *   launchDate: new Date('2024-03-01'),
 *   targetRevenue: 5000000
 * });
 * ```
 */
export declare function createSeasonPlan(config: {
    seasonName: string;
    seasonType: SeasonType;
    year: number;
    startDate: Date;
    endDate: Date;
    launchDate: Date;
    targetRevenue?: number;
    targetMargin?: number;
}): SeasonPlan;
/**
 * 10. Adds collection to season plan.
 *
 * @param {SeasonPlan} season - Season plan
 * @param {object} collection - Collection details
 * @returns {SeasonPlan} Updated season plan
 *
 * @example
 * ```typescript
 * const updated = addSeasonCollection(season, {
 *   collectionName: 'Floral Romance',
 *   description: 'Romantic florals for spring',
 *   targetDemographic: 'Women 25-45',
 *   pricePoints: [
 *     { category: 'Dresses', minPrice: 89, maxPrice: 199, targetMargin: 0.55 }
 *   ],
 *   productCount: 24,
 *   launchDate: new Date('2024-03-15')
 * });
 * ```
 */
export declare function addSeasonCollection(season: SeasonPlan, collection: Omit<SeasonCollection, 'collectionId' | 'developmentStatus'>): SeasonPlan;
/**
 * 11. Generates season calendar with key dates.
 *
 * @param {SeasonPlan} season - Season plan
 * @returns {object} Season calendar with milestones
 *
 * @example
 * ```typescript
 * const calendar = generateSeasonCalendar(season);
 * calendar.milestones.forEach(m => {
 *   console.log(`${m.name}: ${m.date.toDateString()}`);
 * });
 * ```
 */
export declare function generateSeasonCalendar(season: SeasonPlan): {
    seasonId: string;
    seasonName: string;
    milestones: Array<{
        name: string;
        date: Date;
        type: string;
        description: string;
    }>;
    weekByWeek: Array<{
        weekNumber: number;
        startDate: Date;
        endDate: Date;
        phase: string;
    }>;
};
/**
 * 12. Calculates season timeline and duration.
 *
 * @param {SeasonPlan} season - Season plan
 * @returns {object} Timeline calculations
 *
 * @example
 * ```typescript
 * const timeline = calculateSeasonTimeline(season);
 * console.log(`Total duration: ${timeline.totalWeeks} weeks`);
 * ```
 */
export declare function calculateSeasonTimeline(season: SeasonPlan): {
    totalDays: number;
    totalWeeks: number;
    developmentWeeks: number;
    retailWeeks: number;
    markdownWeeks: number;
    daysUntilLaunch: number;
    daysUntilMarkdown: number;
};
/**
 * 13. Updates season status based on dates.
 *
 * @param {SeasonPlan} season - Season plan
 * @returns {SeasonPlan} Updated season plan
 *
 * @example
 * ```typescript
 * const updated = updateSeasonStatus(season);
 * console.log(`Season status: ${updated.status}`);
 * ```
 */
export declare function updateSeasonStatus(season: SeasonPlan): SeasonPlan;
/**
 * 14. Validates season plan completeness.
 *
 * @param {SeasonPlan} season - Season plan to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateSeasonPlan(season);
 * if (!validation.ready) {
 *   console.log('Issues:', validation.issues);
 * }
 * ```
 */
export declare function validateSeasonPlan(season: SeasonPlan): {
    ready: boolean;
    issues: string[];
    warnings: string[];
    completeness: number;
};
/**
 * 15. Generates season comparison report.
 *
 * @param {SeasonPlan[]} seasons - Seasons to compare
 * @returns {object} Comparison analysis
 *
 * @example
 * ```typescript
 * const comparison = compareSeasons([season2023, season2024]);
 * console.log(`Revenue growth: ${comparison.revenueGrowth}%`);
 * ```
 */
export declare function compareSeasons(seasons: SeasonPlan[]): {
    seasons: Array<{
        seasonId: string;
        seasonName: string;
        targetRevenue: number;
        collectionCount: number;
        durationDays: number;
    }>;
    averageRevenue: number;
    averageCollections: number;
    revenueGrowth: number;
};
/**
 * 16. Clones season plan for next year.
 *
 * @param {SeasonPlan} season - Season to clone
 * @param {number} year - Target year
 * @returns {SeasonPlan} Cloned season plan
 *
 * @example
 * ```typescript
 * const nextYear = cloneSeasonPlan(season2024, 2025);
 * ```
 */
export declare function cloneSeasonPlan(season: SeasonPlan, year: number): SeasonPlan;
/**
 * 17. Adds development milestone to product.
 *
 * @param {ProductLifecycle} lifecycle - Product lifecycle
 * @param {object} milestone - Milestone details
 * @returns {ProductLifecycle} Updated lifecycle
 *
 * @example
 * ```typescript
 * const updated = addDevelopmentMilestone(lifecycle, {
 *   name: 'Tech Pack Complete',
 *   description: 'Finalize technical specifications',
 *   stage: LifecycleStage.DESIGN,
 *   status: DevelopmentStatus.TECH_PACK,
 *   dueDate: new Date('2024-02-15'),
 *   assignedTo: ['DESIGNER-001']
 * });
 * ```
 */
export declare function addDevelopmentMilestone(lifecycle: ProductLifecycle, milestone: Omit<DevelopmentMilestone, 'milestoneId'>): ProductLifecycle;
/**
 * 18. Completes development milestone.
 *
 * @param {ProductLifecycle} lifecycle - Product lifecycle
 * @param {string} milestoneId - Milestone ID
 * @returns {ProductLifecycle} Updated lifecycle
 *
 * @example
 * ```typescript
 * const updated = completeDevelopmentMilestone(lifecycle, 'MILE-123');
 * ```
 */
export declare function completeDevelopmentMilestone(lifecycle: ProductLifecycle, milestoneId: string): ProductLifecycle;
/**
 * 19. Tracks development progress across milestones.
 *
 * @param {ProductLifecycle} lifecycle - Product lifecycle
 * @returns {object} Development progress metrics
 *
 * @example
 * ```typescript
 * const progress = trackDevelopmentProgress(lifecycle);
 * console.log(`Progress: ${progress.percentComplete}%`);
 * ```
 */
export declare function trackDevelopmentProgress(lifecycle: ProductLifecycle): {
    totalMilestones: number;
    completedMilestones: number;
    percentComplete: number;
    overdueMilestones: number;
    upcomingMilestones: Array<{
        milestoneId: string;
        name: string;
        dueDate: Date;
        daysUntilDue: number;
    }>;
    currentStageProgress: number;
};
/**
 * 20. Updates development status for product.
 *
 * @param {ProductLifecycle} lifecycle - Product lifecycle
 * @param {DevelopmentStatus} status - New development status
 * @returns {ProductLifecycle} Updated lifecycle
 *
 * @example
 * ```typescript
 * const updated = updateDevelopmentStatus(lifecycle, DevelopmentStatus.PROTO_SAMPLE);
 * ```
 */
export declare function updateDevelopmentStatus(lifecycle: ProductLifecycle, status: DevelopmentStatus): ProductLifecycle;
/**
 * 21. Validates milestone dependencies.
 *
 * @param {ProductLifecycle} lifecycle - Product lifecycle
 * @param {string} milestoneId - Milestone to validate
 * @returns {object} Dependency validation result
 *
 * @example
 * ```typescript
 * const validation = validateMilestoneDependencies(lifecycle, 'MILE-123');
 * if (!validation.canComplete) {
 *   console.log('Blocked by:', validation.blockingDependencies);
 * }
 * ```
 */
export declare function validateMilestoneDependencies(lifecycle: ProductLifecycle, milestoneId: string): {
    canComplete: boolean;
    blockingDependencies: string[];
    completedDependencies: string[];
};
/**
 * 22. Generates development timeline visualization.
 *
 * @param {ProductLifecycle} lifecycle - Product lifecycle
 * @returns {object} Timeline data
 *
 * @example
 * ```typescript
 * const timeline = generateDevelopmentTimeline(lifecycle);
 * ```
 */
export declare function generateDevelopmentTimeline(lifecycle: ProductLifecycle): {
    startDate: Date;
    endDate: Date;
    phases: Array<{
        phase: string;
        startDate: Date;
        endDate: Date;
        milestones: Array<{
            name: string;
            date: Date;
            completed: boolean;
        }>;
    }>;
};
/**
 * 23. Calculates development velocity and estimates.
 *
 * @param {ProductLifecycle} lifecycle - Product lifecycle
 * @returns {object} Velocity metrics
 *
 * @example
 * ```typescript
 * const velocity = calculateDevelopmentVelocity(lifecycle);
 * console.log(`Estimated completion: ${velocity.estimatedCompletionDate}`);
 * ```
 */
export declare function calculateDevelopmentVelocity(lifecycle: ProductLifecycle): {
    averageDaysPerMilestone: number;
    completionRate: number;
    estimatedCompletionDate: Date;
    onSchedule: boolean;
    daysAheadBehind: number;
};
/**
 * 24. Generates development status report.
 *
 * @param {ProductLifecycle} lifecycle - Product lifecycle
 * @returns {object} Comprehensive status report
 *
 * @example
 * ```typescript
 * const report = generateDevelopmentReport(lifecycle);
 * console.log(`Status: ${report.overallStatus}`);
 * ```
 */
export declare function generateDevelopmentReport(lifecycle: ProductLifecycle): {
    productId: string;
    sku: string;
    styleName: string;
    currentStage: LifecycleStage;
    overallStatus: 'ON_TRACK' | 'AT_RISK' | 'DELAYED';
    progressPercentage: number;
    milestonesComplete: number;
    milestonesTotal: number;
    overdueMilestones: number;
    pendingApprovals: number;
    estimatedCompletion: Date;
    risks: string[];
};
/**
 * 25. Creates distribution plan for product.
 *
 * @param {string} productId - Product ID
 * @param {number} totalQuantity - Total quantity to distribute
 * @param {Date} startDate - Distribution start date
 * @param {Date} endDate - Distribution end date
 * @returns {DistributionPlan} New distribution plan
 *
 * @example
 * ```typescript
 * const plan = createDistributionPlan(
 *   'PROD-001',
 *   5000,
 *   new Date('2024-03-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
export declare function createDistributionPlan(productId: string, totalQuantity: number, startDate: Date, endDate: Date): DistributionPlan;
/**
 * 26. Allocates inventory to distribution channel.
 *
 * @param {DistributionPlan} plan - Distribution plan
 * @param {DistributionChannel} channel - Distribution channel
 * @param {number} quantity - Quantity to allocate
 * @param {number} priority - Channel priority (1-10)
 * @returns {DistributionPlan} Updated distribution plan
 *
 * @example
 * ```typescript
 * const updated = allocateToChannel(
 *   plan,
 *   DistributionChannel.RETAIL,
 *   2000,
 *   1
 * );
 * ```
 */
export declare function allocateToChannel(plan: DistributionPlan, channel: DistributionChannel, quantity: number, priority?: number): DistributionPlan;
/**
 * 27. Allocates inventory to specific location.
 *
 * @param {DistributionPlan} plan - Distribution plan
 * @param {string} allocationId - Channel allocation ID
 * @param {string} locationId - Location ID
 * @param {string} locationName - Location name
 * @param {number} quantity - Quantity to allocate
 * @returns {DistributionPlan} Updated distribution plan
 *
 * @example
 * ```typescript
 * const updated = allocateToLocation(
 *   plan,
 *   'ALLOC-123',
 *   'STORE-001',
 *   'Fifth Avenue Flagship',
 *   150
 * );
 * ```
 */
export declare function allocateToLocation(plan: DistributionPlan, allocationId: string, locationId: string, locationName: string, quantity: number): DistributionPlan;
/**
 * 28. Marks distribution shipment as sent.
 *
 * @param {DistributionPlan} plan - Distribution plan
 * @param {string} allocationId - Channel allocation ID
 * @param {string} locationId - Location ID
 * @param {Date} shipDate - Ship date
 * @returns {DistributionPlan} Updated distribution plan
 *
 * @example
 * ```typescript
 * const updated = markShipmentSent(
 *   plan,
 *   'ALLOC-123',
 *   'STORE-001',
 *   new Date()
 * );
 * ```
 */
export declare function markShipmentSent(plan: DistributionPlan, allocationId: string, locationId: string, shipDate: Date): DistributionPlan;
/**
 * 29. Marks distribution shipment as received.
 *
 * @param {DistributionPlan} plan - Distribution plan
 * @param {string} allocationId - Channel allocation ID
 * @param {string} locationId - Location ID
 * @param {Date} receivedDate - Received date
 * @returns {DistributionPlan} Updated distribution plan
 *
 * @example
 * ```typescript
 * const updated = markShipmentReceived(
 *   plan,
 *   'ALLOC-123',
 *   'STORE-001',
 *   new Date()
 * );
 * ```
 */
export declare function markShipmentReceived(plan: DistributionPlan, allocationId: string, locationId: string, receivedDate: Date): DistributionPlan;
/**
 * 30. Generates distribution allocation report.
 *
 * @param {DistributionPlan} plan - Distribution plan
 * @returns {object} Allocation analysis
 *
 * @example
 * ```typescript
 * const report = generateDistributionReport(plan);
 * console.log(`Allocation: ${report.allocationPercentage}%`);
 * ```
 */
export declare function generateDistributionReport(plan: DistributionPlan): {
    planId: string;
    totalQuantity: number;
    allocatedQuantity: number;
    remainingQuantity: number;
    allocationPercentage: number;
    channelBreakdown: Array<{
        channel: DistributionChannel;
        quantity: number;
        percentage: number;
        locationCount: number;
        status: string;
    }>;
    status: string;
};
/**
 * 31. Optimizes distribution allocation by priority.
 *
 * @param {DistributionPlan} plan - Distribution plan
 * @returns {DistributionPlan} Optimized plan
 *
 * @example
 * ```typescript
 * const optimized = optimizeDistributionAllocation(plan);
 * ```
 */
export declare function optimizeDistributionAllocation(plan: DistributionPlan): DistributionPlan;
/**
 * 32. Validates distribution plan completeness.
 *
 * @param {DistributionPlan} plan - Distribution plan
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateDistributionPlan(plan);
 * if (!validation.valid) {
 *   console.log('Issues:', validation.issues);
 * }
 * ```
 */
export declare function validateDistributionPlan(plan: DistributionPlan): {
    valid: boolean;
    issues: string[];
    warnings: string[];
    readyToExecute: boolean;
};
/**
 * 33. Creates markdown schedule for product.
 *
 * @param {string} productId - Product ID
 * @param {number} originalPrice - Original retail price
 * @param {MarkdownStrategy} strategy - Markdown strategy
 * @param {number} minimumPrice - Minimum allowed price
 * @returns {MarkdownSchedule} New markdown schedule
 *
 * @example
 * ```typescript
 * const schedule = createMarkdownSchedule(
 *   'PROD-001',
 *   199.99,
 *   MarkdownStrategy.MODERATE,
 *   79.99
 * );
 * ```
 */
export declare function createMarkdownSchedule(productId: string, originalPrice: number, strategy: MarkdownStrategy, minimumPrice: number): MarkdownSchedule;
/**
 * 34. Adds markdown event to schedule.
 *
 * @param {MarkdownSchedule} schedule - Markdown schedule
 * @param {Date} markdownDate - Date of markdown
 * @param {number} newPrice - New price after markdown
 * @param {string} reason - Reason for markdown
 * @returns {MarkdownSchedule} Updated schedule
 *
 * @example
 * ```typescript
 * const updated = addMarkdownEvent(
 *   schedule,
 *   new Date('2024-06-01'),
 *   149.99,
 *   'Mid-season markdown'
 * );
 * ```
 */
export declare function addMarkdownEvent(schedule: MarkdownSchedule, markdownDate: Date, newPrice: number, reason: string): MarkdownSchedule;
/**
 * 35. Executes markdown event.
 *
 * @param {MarkdownSchedule} schedule - Markdown schedule
 * @param {string} eventId - Event ID to execute
 * @param {number} actualSellThrough - Actual sell-through achieved
 * @returns {MarkdownSchedule} Updated schedule
 *
 * @example
 * ```typescript
 * const updated = executeMarkdownEvent(schedule, 'EVENT-123', 0.45);
 * ```
 */
export declare function executeMarkdownEvent(schedule: MarkdownSchedule, eventId: string, actualSellThrough?: number): MarkdownSchedule;
/**
 * 36. Generates automatic markdown recommendations.
 *
 * @param {MarkdownSchedule} schedule - Current schedule
 * @param {number} currentInventory - Current inventory level
 * @param {number} targetInventory - Target inventory level
 * @param {number} daysRemaining - Days remaining in season
 * @returns {object} Markdown recommendations
 *
 * @example
 * ```typescript
 * const recommendations = generateMarkdownRecommendations(
 *   schedule,
 *   450,
 *   100,
 *   45
 * );
 * ```
 */
export declare function generateMarkdownRecommendations(schedule: MarkdownSchedule, currentInventory: number, targetInventory: number, daysRemaining: number): {
    recommended: boolean;
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    recommendedPrice: number;
    recommendedDiscount: number;
    reasoning: string[];
    projectedSellThrough: number;
};
/**
 * 37. Calculates markdown performance metrics.
 *
 * @param {MarkdownSchedule} schedule - Markdown schedule
 * @returns {object} Performance analysis
 *
 * @example
 * ```typescript
 * const performance = calculateMarkdownPerformance(schedule);
 * console.log(`Effectiveness: ${performance.effectiveness}%`);
 * ```
 */
export declare function calculateMarkdownPerformance(schedule: MarkdownSchedule): {
    totalMarkdowns: number;
    totalDiscountPercentage: number;
    averageDiscountPercentage: number;
    effectiveMarkdowns: number;
    effectiveness: number;
    projectedVsActual: Array<{
        eventId: string;
        projected: number;
        actual: number;
        variance: number;
    }>;
};
/**
 * 38. Optimizes clearance pricing strategy.
 *
 * @param {MarkdownSchedule} schedule - Current schedule
 * @param {number} remainingInventory - Units remaining
 * @param {number} daysUntilEndOfLife - Days until EOL
 * @returns {object} Clearance optimization
 *
 * @example
 * ```typescript
 * const clearance = optimizeClearancePricing(schedule, 200, 14);
 * console.log(`Optimal price: $${clearance.optimalPrice}`);
 * ```
 */
export declare function optimizeClearancePricing(schedule: MarkdownSchedule, remainingInventory: number, daysUntilEndOfLife: number): {
    optimalPrice: number;
    discountFromCurrent: number;
    discountFromOriginal: number;
    projectedRevenue: number;
    projectedSellThrough: number;
    recommendation: string;
};
/**
 * 39. Generates markdown schedule based on strategy.
 *
 * @param {MarkdownStrategy} strategy - Markdown strategy
 * @param {number} originalPrice - Original price
 * @param {Date} startDate - Markdown start date
 * @param {Date} endDate - Season end date
 * @returns {MarkdownEvent[]} Scheduled markdown events
 *
 * @example
 * ```typescript
 * const events = generateMarkdownScheduleEvents(
 *   MarkdownStrategy.MODERATE,
 *   199.99,
 *   new Date('2024-06-01'),
 *   new Date('2024-07-31')
 * );
 * ```
 */
export declare function generateMarkdownScheduleEvents(strategy: MarkdownStrategy, originalPrice: number, startDate: Date, endDate: Date): MarkdownEvent[];
/**
 * 40. Generates comprehensive markdown analysis report.
 *
 * @param {MarkdownSchedule} schedule - Markdown schedule
 * @param {number} initialInventory - Starting inventory
 * @param {number} currentInventory - Current inventory
 * @returns {object} Comprehensive analysis
 *
 * @example
 * ```typescript
 * const analysis = generateMarkdownAnalysis(schedule, 1000, 350);
 * console.log(`Sell-through: ${analysis.sellThroughRate}%`);
 * ```
 */
export declare function generateMarkdownAnalysis(schedule: MarkdownSchedule, initialInventory: number, currentInventory: number): {
    scheduleId: string;
    strategy: MarkdownStrategy;
    priceReduction: number;
    priceReductionPercentage: number;
    totalMarkdownEvents: number;
    executedMarkdowns: number;
    sellThroughRate: number;
    remainingInventoryPercentage: number;
    averageDiscountPercentage: number;
    projectedFinalPrice: number;
    revenueImpact: number;
    recommendations: string[];
};
declare const _default: {
    createProductLifecycle: typeof createProductLifecycle;
    transitionLifecycleStage: typeof transitionLifecycleStage;
    addApprovalGate: typeof addApprovalGate;
    processApprovalDecision: typeof processApprovalDecision;
    getStageStatus: typeof getStageStatus;
    validateStageTransition: typeof validateStageTransition;
    getStageHistory: typeof getStageHistory;
    updateStageStatus: typeof updateStageStatus;
    createSeasonPlan: typeof createSeasonPlan;
    addSeasonCollection: typeof addSeasonCollection;
    generateSeasonCalendar: typeof generateSeasonCalendar;
    calculateSeasonTimeline: typeof calculateSeasonTimeline;
    updateSeasonStatus: typeof updateSeasonStatus;
    validateSeasonPlan: typeof validateSeasonPlan;
    compareSeasons: typeof compareSeasons;
    cloneSeasonPlan: typeof cloneSeasonPlan;
    addDevelopmentMilestone: typeof addDevelopmentMilestone;
    completeDevelopmentMilestone: typeof completeDevelopmentMilestone;
    trackDevelopmentProgress: typeof trackDevelopmentProgress;
    updateDevelopmentStatus: typeof updateDevelopmentStatus;
    validateMilestoneDependencies: typeof validateMilestoneDependencies;
    generateDevelopmentTimeline: typeof generateDevelopmentTimeline;
    calculateDevelopmentVelocity: typeof calculateDevelopmentVelocity;
    generateDevelopmentReport: typeof generateDevelopmentReport;
    createDistributionPlan: typeof createDistributionPlan;
    allocateToChannel: typeof allocateToChannel;
    allocateToLocation: typeof allocateToLocation;
    markShipmentSent: typeof markShipmentSent;
    markShipmentReceived: typeof markShipmentReceived;
    generateDistributionReport: typeof generateDistributionReport;
    optimizeDistributionAllocation: typeof optimizeDistributionAllocation;
    validateDistributionPlan: typeof validateDistributionPlan;
    createMarkdownSchedule: typeof createMarkdownSchedule;
    addMarkdownEvent: typeof addMarkdownEvent;
    executeMarkdownEvent: typeof executeMarkdownEvent;
    generateMarkdownRecommendations: typeof generateMarkdownRecommendations;
    calculateMarkdownPerformance: typeof calculateMarkdownPerformance;
    optimizeClearancePricing: typeof optimizeClearancePricing;
    generateMarkdownScheduleEvents: typeof generateMarkdownScheduleEvents;
    generateMarkdownAnalysis: typeof generateMarkdownAnalysis;
};
export default _default;
//# sourceMappingURL=apparel-lifecycle-kit.d.ts.map