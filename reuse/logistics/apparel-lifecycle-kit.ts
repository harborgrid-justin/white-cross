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
 * File: /reuse/logistics/apparel-lifecycle-kit.ts
 * Locator: WC-LOGISTICS-APPAREL-LC-001
 * Purpose: Comprehensive Apparel Product Lifecycle Management - Complete lifecycle tracking for fashion/apparel products
 *
 * Upstream: Independent utility module for apparel lifecycle operations
 * Downstream: ../backend/logistics/*, Product management, Merchandising, Planning, Distribution
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 40 utility functions for lifecycle stages, season planning, development, launch, markdown
 *
 * LLM Context: Enterprise-grade apparel lifecycle utilities to compete with Oracle JDE's apparel management.
 * Provides comprehensive lifecycle stage management, season planning and calendars, product development tracking,
 * launch and distribution workflows, markdown and clearance optimization, approval gates, SKU lifecycle tracking,
 * stage transitions, and merchandising analytics.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Lifecycle stage enumeration
 */
export enum LifecycleStage {
  CONCEPT = 'CONCEPT',
  DESIGN = 'DESIGN',
  DEVELOPMENT = 'DEVELOPMENT',
  SAMPLING = 'SAMPLING',
  PRODUCTION = 'PRODUCTION',
  DISTRIBUTION = 'DISTRIBUTION',
  RETAIL = 'RETAIL',
  MARKDOWN = 'MARKDOWN',
  CLEARANCE = 'CLEARANCE',
  END_OF_LIFE = 'END_OF_LIFE',
}

/**
 * Stage status enumeration
 */
export enum StageStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD',
}

/**
 * Season type enumeration
 */
export enum SeasonType {
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL',
  WINTER = 'WINTER',
  HOLIDAY = 'HOLIDAY',
  RESORT = 'RESORT',
  PRE_FALL = 'PRE_FALL',
  PRE_SPRING = 'PRE_SPRING',
}

/**
 * Approval gate type enumeration
 */
export enum ApprovalGateType {
  DESIGN_REVIEW = 'DESIGN_REVIEW',
  TECH_PACK_REVIEW = 'TECH_PACK_REVIEW',
  SAMPLE_APPROVAL = 'SAMPLE_APPROVAL',
  COSTING_APPROVAL = 'COSTING_APPROVAL',
  PRODUCTION_APPROVAL = 'PRODUCTION_APPROVAL',
  QUALITY_ASSURANCE = 'QUALITY_ASSURANCE',
  MERCHANDISING_APPROVAL = 'MERCHANDISING_APPROVAL',
  FINAL_APPROVAL = 'FINAL_APPROVAL',
}

/**
 * Development status enumeration
 */
export enum DevelopmentStatus {
  SKETCH = 'SKETCH',
  CAD_DESIGN = 'CAD_DESIGN',
  TECH_PACK = 'TECH_PACK',
  PROTO_SAMPLE = 'PROTO_SAMPLE',
  FIT_SAMPLE = 'FIT_SAMPLE',
  SALES_SAMPLE = 'SALES_SAMPLE',
  PRODUCTION_SAMPLE = 'PRODUCTION_SAMPLE',
  APPROVED = 'APPROVED',
}

/**
 * Markdown strategy enumeration
 */
export enum MarkdownStrategy {
  AGGRESSIVE = 'AGGRESSIVE',
  MODERATE = 'MODERATE',
  CONSERVATIVE = 'CONSERVATIVE',
  SEASONAL = 'SEASONAL',
  CLEARANCE = 'CLEARANCE',
  PROMOTIONAL = 'PROMOTIONAL',
}

/**
 * Distribution channel enumeration
 */
export enum DistributionChannel {
  WHOLESALE = 'WHOLESALE',
  RETAIL = 'RETAIL',
  ONLINE = 'ONLINE',
  OUTLET = 'OUTLET',
  DIRECT_TO_CONSUMER = 'DIRECT_TO_CONSUMER',
  MARKETPLACE = 'MARKETPLACE',
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

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

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

// ============================================================================
// SECTION 1: LIFECYCLE STAGE MANAGEMENT (Functions 1-8)
// ============================================================================

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
export function createProductLifecycle(config: {
  productId: string;
  sku: string;
  styleName: string;
  seasonId: string;
  metadata?: Record<string, any>;
}): ProductLifecycle {
  const lifecycleId = `LC-${crypto.randomUUID()}`;

  return {
    lifecycleId,
    productId: config.productId,
    sku: config.sku,
    styleName: config.styleName,
    seasonId: config.seasonId,
    currentStage: LifecycleStage.CONCEPT,
    stageStatus: StageStatus.IN_PROGRESS,
    stageHistory: [
      {
        transitionId: `TR-${crypto.randomUUID()}`,
        fromStage: null,
        toStage: LifecycleStage.CONCEPT,
        status: StageStatus.IN_PROGRESS,
        transitionedAt: new Date(),
        transitionedBy: 'SYSTEM',
        approvalRequired: false,
      },
    ],
    approvalGates: [],
    developmentMilestones: [],
    metadata: config.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

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
export function transitionLifecycleStage(
  lifecycle: ProductLifecycle,
  toStage: LifecycleStage,
  userId: string,
  notes?: string
): ProductLifecycle {
  // Validate transition is allowed
  const validTransitions = getAllowedTransitions(lifecycle.currentStage);
  if (!validTransitions.includes(toStage)) {
    throw new Error(
      `Invalid transition from ${lifecycle.currentStage} to ${toStage}`
    );
  }

  const transition: StageTransition = {
    transitionId: `TR-${crypto.randomUUID()}`,
    fromStage: lifecycle.currentStage,
    toStage,
    status: StageStatus.IN_PROGRESS,
    transitionedAt: new Date(),
    transitionedBy: userId,
    notes,
    approvalRequired: requiresApproval(toStage),
  };

  return {
    ...lifecycle,
    currentStage: toStage,
    stageStatus: transition.approvalRequired
      ? StageStatus.PENDING_APPROVAL
      : StageStatus.IN_PROGRESS,
    stageHistory: [...lifecycle.stageHistory, transition],
    updatedAt: new Date(),
  };
}

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
export function addApprovalGate(
  lifecycle: ProductLifecycle,
  gateType: ApprovalGateType,
  requiredApprovers: string[],
  dueDate?: Date
): ProductLifecycle {
  const gate: ApprovalGate = {
    gateId: `GATE-${crypto.randomUUID()}`,
    gateType,
    stage: lifecycle.currentStage,
    status: 'PENDING',
    requiredApprovers,
    approvals: requiredApprovers.map(approverId => ({
      approvalId: `APR-${crypto.randomUUID()}`,
      approverId,
      approverName: '', // Would be populated from user service
      decision: 'PENDING',
    })),
    dueDate,
  };

  return {
    ...lifecycle,
    approvalGates: [...lifecycle.approvalGates, gate],
    stageStatus: StageStatus.PENDING_APPROVAL,
    updatedAt: new Date(),
  };
}

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
export function processApprovalDecision(
  lifecycle: ProductLifecycle,
  gateId: string,
  approverId: string,
  decision: 'APPROVED' | 'REJECTED',
  comments?: string
): ProductLifecycle {
  const updatedGates = lifecycle.approvalGates.map(gate => {
    if (gate.gateId !== gateId) return gate;

    const updatedApprovals = gate.approvals.map(approval => {
      if (approval.approverId !== approverId) return approval;

      return {
        ...approval,
        decision,
        approvedAt: new Date(),
        comments,
      };
    });

    // Check if all approvals are completed
    const allApproved = updatedApprovals.every(a => a.decision === 'APPROVED');
    const anyRejected = updatedApprovals.some(a => a.decision === 'REJECTED');

    const gateStatus = anyRejected
      ? 'REJECTED'
      : allApproved
      ? 'APPROVED'
      : 'PENDING';

    return {
      ...gate,
      approvals: updatedApprovals,
      status: gateStatus as any,
      completedAt: gateStatus !== 'PENDING' ? new Date() : undefined,
    };
  });

  // Update overall stage status based on gate decisions
  const allGatesApproved = updatedGates
    .filter(g => g.stage === lifecycle.currentStage)
    .every(g => g.status === 'APPROVED');

  const anyGateRejected = updatedGates
    .filter(g => g.stage === lifecycle.currentStage)
    .some(g => g.status === 'REJECTED');

  const newStatus = anyGateRejected
    ? StageStatus.REJECTED
    : allGatesApproved
    ? StageStatus.APPROVED
    : StageStatus.PENDING_APPROVAL;

  return {
    ...lifecycle,
    approvalGates: updatedGates,
    stageStatus: newStatus,
    updatedAt: new Date(),
  };
}

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
export function getStageStatus(lifecycle: ProductLifecycle): {
  currentStage: LifecycleStage;
  stageStatus: StageStatus;
  daysInStage: number;
  progressPercentage: number;
  pendingApprovals: ApprovalGate[];
  completedMilestones: number;
  totalMilestones: number;
} {
  const currentTransition = lifecycle.stageHistory.find(
    t => t.toStage === lifecycle.currentStage
  );
  const daysInStage = currentTransition
    ? Math.floor(
        (Date.now() - currentTransition.transitionedAt.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const pendingApprovals = lifecycle.approvalGates.filter(
    g => g.stage === lifecycle.currentStage && g.status === 'PENDING'
  );

  const stageMilestones = lifecycle.developmentMilestones.filter(
    m => m.stage === lifecycle.currentStage
  );
  const completedMilestones = stageMilestones.filter(
    m => m.completedAt !== undefined
  ).length;

  // Calculate progress based on milestones and approvals
  const milestoneProgress =
    stageMilestones.length > 0
      ? (completedMilestones / stageMilestones.length) * 70
      : 0;
  const approvalProgress =
    pendingApprovals.length === 0 && lifecycle.approvalGates.length > 0 ? 30 : 0;
  const progressPercentage = Math.min(100, milestoneProgress + approvalProgress);

  return {
    currentStage: lifecycle.currentStage,
    stageStatus: lifecycle.stageStatus,
    daysInStage,
    progressPercentage,
    pendingApprovals,
    completedMilestones,
    totalMilestones: stageMilestones.length,
  };
}

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
export function validateStageTransition(
  lifecycle: ProductLifecycle,
  targetStage: LifecycleStage
): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if transition is allowed
  const allowedTransitions = getAllowedTransitions(lifecycle.currentStage);
  if (!allowedTransitions.includes(targetStage)) {
    errors.push(
      `Transition from ${lifecycle.currentStage} to ${targetStage} is not allowed`
    );
  }

  // Check if all approvals are complete
  const currentStageGates = lifecycle.approvalGates.filter(
    g => g.stage === lifecycle.currentStage && g.status === 'PENDING'
  );
  if (currentStageGates.length > 0) {
    errors.push(
      `${currentStageGates.length} approval gate(s) still pending for current stage`
    );
  }

  // Check if milestones are complete
  const incompleteMilestones = lifecycle.developmentMilestones.filter(
    m => m.stage === lifecycle.currentStage && !m.completedAt
  );
  if (incompleteMilestones.length > 0) {
    warnings.push(
      `${incompleteMilestones.length} milestone(s) not yet completed in current stage`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

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
export function getStageHistory(lifecycle: ProductLifecycle): {
  transitions: StageTransition[];
  totalDays: number;
  stageBreakdown: Record<LifecycleStage, number>;
  currentStageStartDate: Date;
} {
  const stageBreakdown: Record<string, number> = {};

  // Calculate days spent in each stage
  for (let i = 0; i < lifecycle.stageHistory.length; i++) {
    const current = lifecycle.stageHistory[i];
    const next = lifecycle.stageHistory[i + 1];

    const endDate = next ? next.transitionedAt : new Date();
    const days = Math.floor(
      (endDate.getTime() - current.transitionedAt.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    stageBreakdown[current.toStage] =
      (stageBreakdown[current.toStage] || 0) + days;
  }

  const totalDays = Math.floor(
    (Date.now() - lifecycle.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  const currentTransition =
    lifecycle.stageHistory[lifecycle.stageHistory.length - 1];

  return {
    transitions: lifecycle.stageHistory,
    totalDays,
    stageBreakdown: stageBreakdown as any,
    currentStageStartDate: currentTransition.transitionedAt,
  };
}

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
export function updateStageStatus(
  lifecycle: ProductLifecycle,
  status: StageStatus,
  reason?: string
): ProductLifecycle {
  return {
    ...lifecycle,
    stageStatus: status,
    metadata: {
      ...lifecycle.metadata,
      statusHistory: [
        ...(lifecycle.metadata.statusHistory || []),
        {
          status,
          reason,
          timestamp: new Date(),
        },
      ],
    },
    updatedAt: new Date(),
  };
}

// ============================================================================
// SECTION 2: SEASON PLANNING & CALENDAR (Functions 9-16)
// ============================================================================

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
export function createSeasonPlan(config: {
  seasonName: string;
  seasonType: SeasonType;
  year: number;
  startDate: Date;
  endDate: Date;
  launchDate: Date;
  targetRevenue?: number;
  targetMargin?: number;
}): SeasonPlan {
  const seasonId = `SEASON-${config.seasonType}-${config.year}`;

  // Calculate markdown and clearance dates based on season end
  const markdownStartDate = new Date(config.endDate);
  markdownStartDate.setDate(markdownStartDate.getDate() - 60); // 60 days before end

  const clearanceDate = new Date(config.endDate);
  clearanceDate.setDate(clearanceDate.getDate() - 30); // 30 days before end

  return {
    seasonId,
    seasonName: config.seasonName,
    seasonType: config.seasonType,
    year: config.year,
    startDate: config.startDate,
    endDate: config.endDate,
    launchDate: config.launchDate,
    markdownStartDate,
    clearanceDate,
    collections: [],
    targetRevenue: config.targetRevenue || 0,
    targetMargin: config.targetMargin || 0,
    budgetAllocated: 0,
    status: 'PLANNING',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

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
export function addSeasonCollection(
  season: SeasonPlan,
  collection: Omit<SeasonCollection, 'collectionId' | 'developmentStatus'>
): SeasonPlan {
  const newCollection: SeasonCollection = {
    collectionId: `COL-${crypto.randomUUID()}`,
    developmentStatus: DevelopmentStatus.SKETCH,
    ...collection,
  };

  return {
    ...season,
    collections: [...season.collections, newCollection],
    updatedAt: new Date(),
  };
}

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
export function generateSeasonCalendar(season: SeasonPlan): {
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
} {
  const milestones: Array<{
    name: string;
    date: Date;
    type: string;
    description: string;
  }> = [
    {
      name: 'Season Planning Start',
      date: season.startDate,
      type: 'PLANNING',
      description: 'Begin season planning and design concepts',
    },
    {
      name: 'Design Lock',
      date: new Date(
        season.launchDate.getTime() - 120 * 24 * 60 * 60 * 1000
      ),
      type: 'DESIGN',
      description: 'Final designs must be approved',
    },
    {
      name: 'Production Start',
      date: new Date(
        season.launchDate.getTime() - 90 * 24 * 60 * 60 * 1000
      ),
      type: 'PRODUCTION',
      description: 'Begin production of approved samples',
    },
    {
      name: 'Season Launch',
      date: season.launchDate,
      type: 'LAUNCH',
      description: 'Products available in stores and online',
    },
    {
      name: 'Markdown Start',
      date: season.markdownStartDate,
      type: 'MARKDOWN',
      description: 'Begin markdown pricing strategy',
    },
    {
      name: 'Clearance Start',
      date: season.clearanceDate,
      type: 'CLEARANCE',
      description: 'Final clearance pricing',
    },
    {
      name: 'Season End',
      date: season.endDate,
      type: 'END',
      description: 'Season officially ends',
    },
  ];

  // Generate week-by-week breakdown
  const weekByWeek: Array<{
    weekNumber: number;
    startDate: Date;
    endDate: Date;
    phase: string;
  }> = [];

  let currentDate = new Date(season.startDate);
  let weekNumber = 1;

  while (currentDate < season.endDate) {
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 6);

    let phase = 'PLANNING';
    if (currentDate >= season.clearanceDate) phase = 'CLEARANCE';
    else if (currentDate >= season.markdownStartDate) phase = 'MARKDOWN';
    else if (currentDate >= season.launchDate) phase = 'RETAIL';

    weekByWeek.push({
      weekNumber,
      startDate: new Date(currentDate),
      endDate: weekEnd > season.endDate ? season.endDate : weekEnd,
      phase,
    });

    currentDate.setDate(currentDate.getDate() + 7);
    weekNumber++;
  }

  return {
    seasonId: season.seasonId,
    seasonName: season.seasonName,
    milestones,
    weekByWeek,
  };
}

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
export function calculateSeasonTimeline(season: SeasonPlan): {
  totalDays: number;
  totalWeeks: number;
  developmentWeeks: number;
  retailWeeks: number;
  markdownWeeks: number;
  daysUntilLaunch: number;
  daysUntilMarkdown: number;
} {
  const totalDays = Math.floor(
    (season.endDate.getTime() - season.startDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const developmentDays = Math.floor(
    (season.launchDate.getTime() - season.startDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const retailDays = Math.floor(
    (season.markdownStartDate.getTime() - season.launchDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const markdownDays = Math.floor(
    (season.endDate.getTime() - season.markdownStartDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const now = Date.now();
  const daysUntilLaunch = Math.max(
    0,
    Math.floor(
      (season.launchDate.getTime() - now) / (1000 * 60 * 60 * 24)
    )
  );

  const daysUntilMarkdown = Math.max(
    0,
    Math.floor(
      (season.markdownStartDate.getTime() - now) / (1000 * 60 * 60 * 24)
    )
  );

  return {
    totalDays,
    totalWeeks: Math.ceil(totalDays / 7),
    developmentWeeks: Math.ceil(developmentDays / 7),
    retailWeeks: Math.ceil(retailDays / 7),
    markdownWeeks: Math.ceil(markdownDays / 7),
    daysUntilLaunch,
    daysUntilMarkdown,
  };
}

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
export function updateSeasonStatus(season: SeasonPlan): SeasonPlan {
  const now = new Date();
  let newStatus: SeasonPlan['status'] = season.status;

  if (now < season.startDate) {
    newStatus = 'PLANNING';
  } else if (now < season.launchDate) {
    newStatus = 'IN_DEVELOPMENT';
  } else if (now < season.markdownStartDate) {
    newStatus = 'ACTIVE';
  } else if (now < season.clearanceDate) {
    newStatus = 'MARKDOWN';
  } else if (now >= season.endDate) {
    newStatus = 'CLOSED';
  }

  if (newStatus !== season.status) {
    return {
      ...season,
      status: newStatus,
      updatedAt: new Date(),
    };
  }

  return season;
}

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
export function validateSeasonPlan(season: SeasonPlan): {
  ready: boolean;
  issues: string[];
  warnings: string[];
  completeness: number;
} {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check date consistency
  if (season.startDate >= season.launchDate) {
    issues.push('Launch date must be after start date');
  }

  if (season.launchDate >= season.endDate) {
    issues.push('End date must be after launch date');
  }

  // Check collections
  if (season.collections.length === 0) {
    issues.push('Season must have at least one collection');
  }

  // Check financial targets
  if (season.targetRevenue === 0) {
    warnings.push('No revenue target set for season');
  }

  if (season.budgetAllocated === 0) {
    warnings.push('No budget allocated for season');
  }

  // Calculate completeness
  let completeness = 0;
  if (season.collections.length > 0) completeness += 30;
  if (season.targetRevenue > 0) completeness += 20;
  if (season.budgetAllocated > 0) completeness += 20;
  if (season.targetMargin > 0) completeness += 15;
  if (season.collections.some(c => c.pricePoints.length > 0))
    completeness += 15;

  return {
    ready: issues.length === 0 && completeness >= 70,
    issues,
    warnings,
    completeness,
  };
}

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
export function compareSeasons(seasons: SeasonPlan[]): {
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
} {
  const seasonData = seasons.map(s => ({
    seasonId: s.seasonId,
    seasonName: s.seasonName,
    targetRevenue: s.targetRevenue,
    collectionCount: s.collections.length,
    durationDays: Math.floor(
      (s.endDate.getTime() - s.startDate.getTime()) / (1000 * 60 * 60 * 24)
    ),
  }));

  const averageRevenue =
    seasonData.reduce((sum, s) => sum + s.targetRevenue, 0) /
      seasonData.length || 0;

  const averageCollections =
    seasonData.reduce((sum, s) => sum + s.collectionCount, 0) /
      seasonData.length || 0;

  // Calculate revenue growth between first and last season
  const revenueGrowth =
    seasonData.length >= 2 && seasonData[0].targetRevenue > 0
      ? ((seasonData[seasonData.length - 1].targetRevenue -
          seasonData[0].targetRevenue) /
          seasonData[0].targetRevenue) *
        100
      : 0;

  return {
    seasons: seasonData,
    averageRevenue,
    averageCollections,
    revenueGrowth,
  };
}

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
export function cloneSeasonPlan(season: SeasonPlan, year: number): SeasonPlan {
  const yearDiff = year - season.year;

  const adjustDate = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + yearDiff);
    return newDate;
  };

  return {
    ...season,
    seasonId: `SEASON-${season.seasonType}-${year}`,
    seasonName: season.seasonName.replace(
      String(season.year),
      String(year)
    ),
    year,
    startDate: adjustDate(season.startDate),
    endDate: adjustDate(season.endDate),
    launchDate: adjustDate(season.launchDate),
    markdownStartDate: adjustDate(season.markdownStartDate),
    clearanceDate: adjustDate(season.clearanceDate),
    collections: season.collections.map(c => ({
      ...c,
      collectionId: `COL-${crypto.randomUUID()}`,
      launchDate: adjustDate(c.launchDate),
      developmentStatus: DevelopmentStatus.SKETCH,
    })),
    status: 'PLANNING',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// ============================================================================
// SECTION 3: PRODUCT DEVELOPMENT TRACKING (Functions 17-24)
// ============================================================================

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
export function addDevelopmentMilestone(
  lifecycle: ProductLifecycle,
  milestone: Omit<DevelopmentMilestone, 'milestoneId'>
): ProductLifecycle {
  const newMilestone: DevelopmentMilestone = {
    milestoneId: `MILE-${crypto.randomUUID()}`,
    ...milestone,
    deliverables: milestone.deliverables || [],
    dependencies: milestone.dependencies || [],
  };

  return {
    ...lifecycle,
    developmentMilestones: [...lifecycle.developmentMilestones, newMilestone],
    updatedAt: new Date(),
  };
}

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
export function completeDevelopmentMilestone(
  lifecycle: ProductLifecycle,
  milestoneId: string
): ProductLifecycle {
  const updatedMilestones = lifecycle.developmentMilestones.map(m => {
    if (m.milestoneId === milestoneId) {
      return {
        ...m,
        completedAt: new Date(),
      };
    }
    return m;
  });

  return {
    ...lifecycle,
    developmentMilestones: updatedMilestones,
    updatedAt: new Date(),
  };
}

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
export function trackDevelopmentProgress(lifecycle: ProductLifecycle): {
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
} {
  const totalMilestones = lifecycle.developmentMilestones.length;
  const completedMilestones = lifecycle.developmentMilestones.filter(
    m => m.completedAt
  ).length;

  const percentComplete =
    totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const now = new Date();
  const overdueMilestones = lifecycle.developmentMilestones.filter(
    m => !m.completedAt && m.dueDate < now
  ).length;

  const upcomingMilestones = lifecycle.developmentMilestones
    .filter(m => !m.completedAt && m.dueDate >= now)
    .map(m => ({
      milestoneId: m.milestoneId,
      name: m.name,
      dueDate: m.dueDate,
      daysUntilDue: Math.floor(
        (m.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      ),
    }))
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
    .slice(0, 5);

  const currentStageMilestones = lifecycle.developmentMilestones.filter(
    m => m.stage === lifecycle.currentStage
  );
  const currentStageCompleted = currentStageMilestones.filter(
    m => m.completedAt
  ).length;
  const currentStageProgress =
    currentStageMilestones.length > 0
      ? (currentStageCompleted / currentStageMilestones.length) * 100
      : 0;

  return {
    totalMilestones,
    completedMilestones,
    percentComplete,
    overdueMilestones,
    upcomingMilestones,
    currentStageProgress,
  };
}

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
export function updateDevelopmentStatus(
  lifecycle: ProductLifecycle,
  status: DevelopmentStatus
): ProductLifecycle {
  return {
    ...lifecycle,
    metadata: {
      ...lifecycle.metadata,
      developmentStatus: status,
      developmentStatusHistory: [
        ...(lifecycle.metadata.developmentStatusHistory || []),
        {
          status,
          timestamp: new Date(),
        },
      ],
    },
    updatedAt: new Date(),
  };
}

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
export function validateMilestoneDependencies(
  lifecycle: ProductLifecycle,
  milestoneId: string
): {
  canComplete: boolean;
  blockingDependencies: string[];
  completedDependencies: string[];
} {
  const milestone = lifecycle.developmentMilestones.find(
    m => m.milestoneId === milestoneId
  );

  if (!milestone) {
    throw new Error(`Milestone ${milestoneId} not found`);
  }

  const blockingDependencies: string[] = [];
  const completedDependencies: string[] = [];

  for (const depId of milestone.dependencies) {
    const dependency = lifecycle.developmentMilestones.find(
      m => m.milestoneId === depId
    );

    if (dependency) {
      if (dependency.completedAt) {
        completedDependencies.push(depId);
      } else {
        blockingDependencies.push(depId);
      }
    }
  }

  return {
    canComplete: blockingDependencies.length === 0,
    blockingDependencies,
    completedDependencies,
  };
}

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
export function generateDevelopmentTimeline(lifecycle: ProductLifecycle): {
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
} {
  const sortedMilestones = [...lifecycle.developmentMilestones].sort(
    (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
  );

  const startDate =
    sortedMilestones.length > 0
      ? sortedMilestones[0].dueDate
      : lifecycle.createdAt;

  const endDate =
    sortedMilestones.length > 0
      ? sortedMilestones[sortedMilestones.length - 1].dueDate
      : new Date();

  // Group milestones by stage
  const phaseMap = new Map<LifecycleStage, DevelopmentMilestone[]>();

  for (const milestone of sortedMilestones) {
    const existing = phaseMap.get(milestone.stage) || [];
    phaseMap.set(milestone.stage, [...existing, milestone]);
  }

  const phases = Array.from(phaseMap.entries()).map(([stage, milestones]) => {
    const stageMilestones = milestones.sort(
      (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
    );

    return {
      phase: stage,
      startDate: stageMilestones[0].dueDate,
      endDate: stageMilestones[stageMilestones.length - 1].dueDate,
      milestones: stageMilestones.map(m => ({
        name: m.name,
        date: m.dueDate,
        completed: !!m.completedAt,
      })),
    };
  });

  return {
    startDate,
    endDate,
    phases,
  };
}

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
export function calculateDevelopmentVelocity(lifecycle: ProductLifecycle): {
  averageDaysPerMilestone: number;
  completionRate: number;
  estimatedCompletionDate: Date;
  onSchedule: boolean;
  daysAheadBehind: number;
} {
  const completedMilestones = lifecycle.developmentMilestones.filter(
    m => m.completedAt
  );

  if (completedMilestones.length === 0) {
    return {
      averageDaysPerMilestone: 0,
      completionRate: 0,
      estimatedCompletionDate: new Date(),
      onSchedule: true,
      daysAheadBehind: 0,
    };
  }

  // Calculate average time to complete milestones
  const totalDays = completedMilestones.reduce((sum, m) => {
    const daysToComplete = Math.floor(
      (m.completedAt!.getTime() - lifecycle.createdAt.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return sum + daysToComplete;
  }, 0);

  const averageDaysPerMilestone = totalDays / completedMilestones.length;

  const totalMilestones = lifecycle.developmentMilestones.length;
  const completionRate = completedMilestones.length / totalMilestones;

  const remainingMilestones = totalMilestones - completedMilestones.length;
  const estimatedDaysRemaining = remainingMilestones * averageDaysPerMilestone;

  const estimatedCompletionDate = new Date();
  estimatedCompletionDate.setDate(
    estimatedCompletionDate.getDate() + estimatedDaysRemaining
  );

  // Check if on schedule
  const plannedEndDate =
    lifecycle.developmentMilestones.length > 0
      ? lifecycle.developmentMilestones.reduce((latest, m) =>
          m.dueDate > latest ? m.dueDate : latest
        , lifecycle.developmentMilestones[0].dueDate)
      : new Date();

  const daysAheadBehind = Math.floor(
    (plannedEndDate.getTime() - estimatedCompletionDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return {
    averageDaysPerMilestone,
    completionRate,
    estimatedCompletionDate,
    onSchedule: daysAheadBehind >= 0,
    daysAheadBehind,
  };
}

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
export function generateDevelopmentReport(lifecycle: ProductLifecycle): {
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
} {
  const progress = trackDevelopmentProgress(lifecycle);
  const velocity = calculateDevelopmentVelocity(lifecycle);

  const pendingApprovals = lifecycle.approvalGates.filter(
    g => g.status === 'PENDING'
  ).length;

  const risks: string[] = [];
  if (progress.overdueMilestones > 0) {
    risks.push(`${progress.overdueMilestones} milestone(s) overdue`);
  }
  if (!velocity.onSchedule) {
    risks.push(
      `Development behind schedule by ${Math.abs(velocity.daysAheadBehind)} days`
    );
  }
  if (pendingApprovals > 2) {
    risks.push(`${pendingApprovals} pending approvals may cause delays`);
  }

  const overallStatus =
    risks.length === 0
      ? 'ON_TRACK'
      : risks.length <= 2
      ? 'AT_RISK'
      : 'DELAYED';

  return {
    productId: lifecycle.productId,
    sku: lifecycle.sku,
    styleName: lifecycle.styleName,
    currentStage: lifecycle.currentStage,
    overallStatus,
    progressPercentage: progress.percentComplete,
    milestonesComplete: progress.completedMilestones,
    milestonesTotal: progress.totalMilestones,
    overdueMilestones: progress.overdueMilestones,
    pendingApprovals,
    estimatedCompletion: velocity.estimatedCompletionDate,
    risks,
  };
}

// ============================================================================
// SECTION 4: LAUNCH & DISTRIBUTION (Functions 25-32)
// ============================================================================

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
export function createDistributionPlan(
  productId: string,
  totalQuantity: number,
  startDate: Date,
  endDate: Date
): DistributionPlan {
  return {
    planId: `DIST-${crypto.randomUUID()}`,
    productId,
    channels: [],
    totalQuantity,
    allocatedQuantity: 0,
    remainingQuantity: totalQuantity,
    distributionStartDate: startDate,
    distributionEndDate: endDate,
    status: 'PLANNED',
  };
}

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
export function allocateToChannel(
  plan: DistributionPlan,
  channel: DistributionChannel,
  quantity: number,
  priority: number = 5
): DistributionPlan {
  if (quantity > plan.remainingQuantity) {
    throw new Error(
      `Insufficient quantity. Available: ${plan.remainingQuantity}, Requested: ${quantity}`
    );
  }

  const allocation: ChannelAllocation = {
    allocationId: `ALLOC-${crypto.randomUUID()}`,
    channel,
    quantity,
    allocatedQuantity: 0,
    locations: [],
    priority,
    status: 'PENDING',
  };

  return {
    ...plan,
    channels: [...plan.channels, allocation],
    allocatedQuantity: plan.allocatedQuantity + quantity,
    remainingQuantity: plan.remainingQuantity - quantity,
  };
}

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
export function allocateToLocation(
  plan: DistributionPlan,
  allocationId: string,
  locationId: string,
  locationName: string,
  quantity: number
): DistributionPlan {
  const updatedChannels = plan.channels.map(channel => {
    if (channel.allocationId !== allocationId) return channel;

    const currentAllocated =
      channel.allocatedQuantity +
      channel.locations.reduce((sum, loc) => sum + loc.quantity, 0);

    if (currentAllocated + quantity > channel.quantity) {
      throw new Error(
        `Exceeds channel allocation. Available: ${channel.quantity - currentAllocated}, Requested: ${quantity}`
      );
    }

    const location: LocationAllocation = {
      locationId,
      locationName,
      quantity,
      status: 'PENDING',
    };

    return {
      ...channel,
      locations: [...channel.locations, location],
      allocatedQuantity: currentAllocated + quantity,
    };
  });

  return {
    ...plan,
    channels: updatedChannels,
  };
}

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
export function markShipmentSent(
  plan: DistributionPlan,
  allocationId: string,
  locationId: string,
  shipDate: Date
): DistributionPlan {
  const updatedChannels = plan.channels.map(channel => {
    if (channel.allocationId !== allocationId) return channel;

    const updatedLocations = channel.locations.map(loc => {
      if (loc.locationId !== locationId) return loc;

      return {
        ...loc,
        shipDate,
        status: 'SHIPPED' as const,
      };
    });

    const allShipped = updatedLocations.every(loc => loc.status === 'SHIPPED');

    return {
      ...channel,
      locations: updatedLocations,
      status: allShipped ? 'SHIPPED' : channel.status,
    };
  });

  return {
    ...plan,
    channels: updatedChannels,
    status: updatedChannels.every(c => c.status === 'SHIPPED')
      ? 'COMPLETED'
      : 'IN_PROGRESS',
  };
}

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
export function markShipmentReceived(
  plan: DistributionPlan,
  allocationId: string,
  locationId: string,
  receivedDate: Date
): DistributionPlan {
  const updatedChannels = plan.channels.map(channel => {
    if (channel.allocationId !== allocationId) return channel;

    const updatedLocations = channel.locations.map(loc => {
      if (loc.locationId !== locationId) return loc;

      return {
        ...loc,
        receivedDate,
        status: 'RECEIVED' as const,
      };
    });

    const allReceived = updatedLocations.every(
      loc => loc.status === 'RECEIVED'
    );

    return {
      ...channel,
      locations: updatedLocations,
      status: allReceived ? 'RECEIVED' : channel.status,
    };
  });

  return {
    ...plan,
    channels: updatedChannels,
  };
}

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
export function generateDistributionReport(plan: DistributionPlan): {
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
} {
  const allocationPercentage =
    plan.totalQuantity > 0
      ? (plan.allocatedQuantity / plan.totalQuantity) * 100
      : 0;

  const channelBreakdown = plan.channels.map(channel => ({
    channel: channel.channel,
    quantity: channel.quantity,
    percentage: (channel.quantity / plan.totalQuantity) * 100,
    locationCount: channel.locations.length,
    status: channel.status,
  }));

  return {
    planId: plan.planId,
    totalQuantity: plan.totalQuantity,
    allocatedQuantity: plan.allocatedQuantity,
    remainingQuantity: plan.remainingQuantity,
    allocationPercentage,
    channelBreakdown,
    status: plan.status,
  };
}

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
export function optimizeDistributionAllocation(
  plan: DistributionPlan
): DistributionPlan {
  // Sort channels by priority (lower number = higher priority)
  const sortedChannels = [...plan.channels].sort(
    (a, b) => a.priority - b.priority
  );

  return {
    ...plan,
    channels: sortedChannels,
  };
}

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
export function validateDistributionPlan(plan: DistributionPlan): {
  valid: boolean;
  issues: string[];
  warnings: string[];
  readyToExecute: boolean;
} {
  const issues: string[] = [];
  const warnings: string[] = [];

  if (plan.totalQuantity <= 0) {
    issues.push('Total quantity must be greater than 0');
  }

  if (plan.channels.length === 0) {
    issues.push('At least one distribution channel must be defined');
  }

  if (plan.remainingQuantity < 0) {
    issues.push('Over-allocated: remaining quantity is negative');
  }

  if (plan.remainingQuantity > 0) {
    warnings.push(
      `${plan.remainingQuantity} units not yet allocated to channels`
    );
  }

  // Check if all channels have location allocations
  const channelsWithoutLocations = plan.channels.filter(
    c => c.locations.length === 0
  );
  if (channelsWithoutLocations.length > 0) {
    warnings.push(
      `${channelsWithoutLocations.length} channel(s) have no location allocations`
    );
  }

  const readyToExecute =
    issues.length === 0 &&
    plan.remainingQuantity === 0 &&
    plan.channels.every(c => c.locations.length > 0);

  return {
    valid: issues.length === 0,
    issues,
    warnings,
    readyToExecute,
  };
}

// ============================================================================
// SECTION 5: MARKDOWN & CLEARANCE (Functions 33-40)
// ============================================================================

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
export function createMarkdownSchedule(
  productId: string,
  originalPrice: number,
  strategy: MarkdownStrategy,
  minimumPrice: number
): MarkdownSchedule {
  return {
    scheduleId: `MARK-${crypto.randomUUID()}`,
    productId,
    strategy,
    originalPrice,
    currentPrice: originalPrice,
    markdownEvents: [],
    minimumPrice,
    clearancePrice: minimumPrice,
    inventoryThreshold: 30, // Default: trigger markdown at 30% inventory
    status: 'SCHEDULED',
  };
}

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
export function addMarkdownEvent(
  schedule: MarkdownSchedule,
  markdownDate: Date,
  newPrice: number,
  reason: string
): MarkdownSchedule {
  if (newPrice < schedule.minimumPrice) {
    throw new Error(
      `New price ${newPrice} is below minimum price ${schedule.minimumPrice}`
    );
  }

  const discountPercentage =
    ((schedule.currentPrice - newPrice) / schedule.currentPrice) * 100;

  const event: MarkdownEvent = {
    eventId: `EVENT-${crypto.randomUUID()}`,
    markdownDate,
    previousPrice: schedule.currentPrice,
    newPrice,
    discountPercentage,
    reason,
    triggeredBy: 'SCHEDULE',
    expectedSellThrough: calculateExpectedSellThrough(
      schedule.strategy,
      discountPercentage
    ),
  };

  return {
    ...schedule,
    markdownEvents: [...schedule.markdownEvents, event],
    currentPrice: newPrice,
    status: 'ACTIVE',
  };
}

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
export function executeMarkdownEvent(
  schedule: MarkdownSchedule,
  eventId: string,
  actualSellThrough?: number
): MarkdownSchedule {
  const updatedEvents = schedule.markdownEvents.map(event => {
    if (event.eventId !== eventId) return event;

    return {
      ...event,
      executedAt: new Date(),
      actualSellThrough,
    };
  });

  return {
    ...schedule,
    markdownEvents: updatedEvents,
  };
}

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
export function generateMarkdownRecommendations(
  schedule: MarkdownSchedule,
  currentInventory: number,
  targetInventory: number,
  daysRemaining: number
): {
  recommended: boolean;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedPrice: number;
  recommendedDiscount: number;
  reasoning: string[];
  projectedSellThrough: number;
} {
  const inventoryExcess = currentInventory - targetInventory;
  const inventoryPercentage = (currentInventory / targetInventory) * 100;

  const reasoning: string[] = [];
  let urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  let recommendedDiscount = 0;

  // Determine urgency based on inventory and time
  if (inventoryPercentage > 200 || daysRemaining < 7) {
    urgency = 'CRITICAL';
    recommendedDiscount = 50;
    reasoning.push('Excess inventory and limited time require aggressive markdown');
  } else if (inventoryPercentage > 150 || daysRemaining < 14) {
    urgency = 'HIGH';
    recommendedDiscount = 40;
    reasoning.push('High inventory levels require significant markdown');
  } else if (inventoryPercentage > 120 || daysRemaining < 30) {
    urgency = 'MEDIUM';
    recommendedDiscount = 25;
    reasoning.push('Moderate markdown recommended to improve sell-through');
  } else if (inventoryPercentage > 100) {
    urgency = 'LOW';
    recommendedDiscount = 15;
    reasoning.push('Minor markdown may help clear excess inventory');
  }

  const recommendedPrice = Math.max(
    schedule.minimumPrice,
    schedule.currentPrice * (1 - recommendedDiscount / 100)
  );

  const projectedSellThrough = calculateExpectedSellThrough(
    schedule.strategy,
    recommendedDiscount
  );

  return {
    recommended: inventoryPercentage > 100,
    urgency,
    recommendedPrice: Number(recommendedPrice.toFixed(2)),
    recommendedDiscount,
    reasoning,
    projectedSellThrough,
  };
}

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
export function calculateMarkdownPerformance(schedule: MarkdownSchedule): {
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
} {
  const executedEvents = schedule.markdownEvents.filter(e => e.executedAt);

  const totalDiscountPercentage =
    ((schedule.originalPrice - schedule.currentPrice) /
      schedule.originalPrice) *
    100;

  const averageDiscountPercentage =
    executedEvents.length > 0
      ? executedEvents.reduce((sum, e) => sum + e.discountPercentage, 0) /
        executedEvents.length
      : 0;

  const effectiveMarkdowns = executedEvents.filter(
    e =>
      e.actualSellThrough !== undefined &&
      e.actualSellThrough >= e.expectedSellThrough
  ).length;

  const effectiveness =
    executedEvents.length > 0
      ? (effectiveMarkdowns / executedEvents.length) * 100
      : 0;

  const projectedVsActual = executedEvents
    .filter(e => e.actualSellThrough !== undefined)
    .map(e => ({
      eventId: e.eventId,
      projected: e.expectedSellThrough,
      actual: e.actualSellThrough!,
      variance: e.actualSellThrough! - e.expectedSellThrough,
    }));

  return {
    totalMarkdowns: schedule.markdownEvents.length,
    totalDiscountPercentage,
    averageDiscountPercentage,
    effectiveMarkdowns,
    effectiveness,
    projectedVsActual,
  };
}

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
export function optimizeClearancePricing(
  schedule: MarkdownSchedule,
  remainingInventory: number,
  daysUntilEndOfLife: number
): {
  optimalPrice: number;
  discountFromCurrent: number;
  discountFromOriginal: number;
  projectedRevenue: number;
  projectedSellThrough: number;
  recommendation: string;
} {
  // Calculate optimal price based on time pressure and inventory
  const timePressureFactor = Math.max(0, 1 - daysUntilEndOfLife / 30);
  const inventoryPressureFactor = Math.min(
    1,
    remainingInventory / 100
  );

  const pressureFactor = (timePressureFactor + inventoryPressureFactor) / 2;

  const optimalPrice = Math.max(
    schedule.minimumPrice,
    schedule.currentPrice * (1 - pressureFactor * 0.6)
  );

  const discountFromCurrent =
    ((schedule.currentPrice - optimalPrice) / schedule.currentPrice) * 100;

  const discountFromOriginal =
    ((schedule.originalPrice - optimalPrice) / schedule.originalPrice) * 100;

  const projectedSellThrough = Math.min(
    0.95,
    0.3 + pressureFactor * 0.5 + (discountFromCurrent / 100) * 0.3
  );

  const projectedRevenue = optimalPrice * remainingInventory * projectedSellThrough;

  const recommendation =
    daysUntilEndOfLife < 7
      ? 'AGGRESSIVE: Maximize clearance immediately'
      : daysUntilEndOfLife < 14
      ? 'MODERATE: Accelerate clearance'
      : 'CONSERVATIVE: Gradual clearance acceptable';

  return {
    optimalPrice: Number(optimalPrice.toFixed(2)),
    discountFromCurrent: Number(discountFromCurrent.toFixed(2)),
    discountFromOriginal: Number(discountFromOriginal.toFixed(2)),
    projectedRevenue: Number(projectedRevenue.toFixed(2)),
    projectedSellThrough: Number(projectedSellThrough.toFixed(2)),
    recommendation,
  };
}

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
export function generateMarkdownScheduleEvents(
  strategy: MarkdownStrategy,
  originalPrice: number,
  startDate: Date,
  endDate: Date
): MarkdownEvent[] {
  const events: MarkdownEvent[] = [];
  const totalDays = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  let currentPrice = originalPrice;

  // Define markdown schedules by strategy
  const schedules: Record<
    MarkdownStrategy,
    Array<{ daysOffset: number; discount: number; reason: string }>
  > = {
    [MarkdownStrategy.AGGRESSIVE]: [
      { daysOffset: 0, discount: 0.3, reason: 'Initial aggressive markdown' },
      { daysOffset: 14, discount: 0.5, reason: 'Mid-clearance markdown' },
      { daysOffset: 28, discount: 0.7, reason: 'Final clearance' },
    ],
    [MarkdownStrategy.MODERATE]: [
      { daysOffset: 0, discount: 0.2, reason: 'First markdown' },
      { daysOffset: 21, discount: 0.4, reason: 'Second markdown' },
      { daysOffset: 42, discount: 0.6, reason: 'Final markdown' },
    ],
    [MarkdownStrategy.CONSERVATIVE]: [
      { daysOffset: 0, discount: 0.15, reason: 'Gentle markdown' },
      { daysOffset: 30, discount: 0.3, reason: 'Mid-season adjustment' },
      { daysOffset: 60, discount: 0.5, reason: 'End of season' },
    ],
    [MarkdownStrategy.SEASONAL]: [
      { daysOffset: 0, discount: 0.25, reason: 'Seasonal transition' },
      { daysOffset: 14, discount: 0.4, reason: 'Seasonal clearance' },
    ],
    [MarkdownStrategy.CLEARANCE]: [
      { daysOffset: 0, discount: 0.5, reason: 'Immediate clearance' },
      { daysOffset: 7, discount: 0.7, reason: 'Deep clearance' },
    ],
    [MarkdownStrategy.PROMOTIONAL]: [
      { daysOffset: 0, discount: 0.2, reason: 'Promotional event' },
    ],
  };

  const schedule = schedules[strategy];

  for (const item of schedule) {
    if (item.daysOffset > totalDays) continue;

    const eventDate = new Date(startDate);
    eventDate.setDate(eventDate.getDate() + item.daysOffset);

    const newPrice = originalPrice * (1 - item.discount);
    const discountPercentage =
      ((currentPrice - newPrice) / currentPrice) * 100;

    events.push({
      eventId: `EVENT-${crypto.randomUUID()}`,
      markdownDate: eventDate,
      previousPrice: currentPrice,
      newPrice: Number(newPrice.toFixed(2)),
      discountPercentage: Number(discountPercentage.toFixed(2)),
      reason: item.reason,
      triggeredBy: 'SCHEDULE',
      expectedSellThrough: calculateExpectedSellThrough(
        strategy,
        discountPercentage
      ),
    });

    currentPrice = newPrice;
  }

  return events;
}

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
export function generateMarkdownAnalysis(
  schedule: MarkdownSchedule,
  initialInventory: number,
  currentInventory: number
): {
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
} {
  const performance = calculateMarkdownPerformance(schedule);
  const soldUnits = initialInventory - currentInventory;
  const sellThroughRate = (soldUnits / initialInventory) * 100;
  const remainingInventoryPercentage =
    (currentInventory / initialInventory) * 100;

  const priceReduction = schedule.originalPrice - schedule.currentPrice;
  const priceReductionPercentage =
    (priceReduction / schedule.originalPrice) * 100;

  // Calculate revenue impact
  const originalRevenue = initialInventory * schedule.originalPrice;
  const actualRevenue =
    soldUnits * schedule.currentPrice +
    currentInventory * schedule.clearancePrice;
  const revenueImpact =
    ((actualRevenue - originalRevenue) / originalRevenue) * 100;

  const recommendations: string[] = [];

  if (sellThroughRate < 50) {
    recommendations.push('Consider more aggressive markdown strategy');
  }

  if (remainingInventoryPercentage > 30 && schedule.markdownEvents.length < 2) {
    recommendations.push('Add additional markdown events to clear inventory');
  }

  if (performance.effectiveness < 70) {
    recommendations.push(
      'Review markdown effectiveness and adjust future strategies'
    );
  }

  return {
    scheduleId: schedule.scheduleId,
    strategy: schedule.strategy,
    priceReduction: Number(priceReduction.toFixed(2)),
    priceReductionPercentage: Number(priceReductionPercentage.toFixed(2)),
    totalMarkdownEvents: schedule.markdownEvents.length,
    executedMarkdowns: performance.effectiveMarkdowns,
    sellThroughRate: Number(sellThroughRate.toFixed(2)),
    remainingInventoryPercentage: Number(
      remainingInventoryPercentage.toFixed(2)
    ),
    averageDiscountPercentage: Number(
      performance.averageDiscountPercentage.toFixed(2)
    ),
    projectedFinalPrice: schedule.clearancePrice,
    revenueImpact: Number(revenueImpact.toFixed(2)),
    recommendations,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper: Gets allowed transitions for current stage.
 */
function getAllowedTransitions(
  currentStage: LifecycleStage
): LifecycleStage[] {
  const transitions: Record<LifecycleStage, LifecycleStage[]> = {
    [LifecycleStage.CONCEPT]: [
      LifecycleStage.DESIGN,
      LifecycleStage.END_OF_LIFE,
    ],
    [LifecycleStage.DESIGN]: [
      LifecycleStage.DEVELOPMENT,
      LifecycleStage.CONCEPT,
      LifecycleStage.END_OF_LIFE,
    ],
    [LifecycleStage.DEVELOPMENT]: [
      LifecycleStage.SAMPLING,
      LifecycleStage.DESIGN,
      LifecycleStage.END_OF_LIFE,
    ],
    [LifecycleStage.SAMPLING]: [
      LifecycleStage.PRODUCTION,
      LifecycleStage.DEVELOPMENT,
      LifecycleStage.END_OF_LIFE,
    ],
    [LifecycleStage.PRODUCTION]: [
      LifecycleStage.DISTRIBUTION,
      LifecycleStage.END_OF_LIFE,
    ],
    [LifecycleStage.DISTRIBUTION]: [
      LifecycleStage.RETAIL,
      LifecycleStage.END_OF_LIFE,
    ],
    [LifecycleStage.RETAIL]: [
      LifecycleStage.MARKDOWN,
      LifecycleStage.END_OF_LIFE,
    ],
    [LifecycleStage.MARKDOWN]: [
      LifecycleStage.CLEARANCE,
      LifecycleStage.END_OF_LIFE,
    ],
    [LifecycleStage.CLEARANCE]: [LifecycleStage.END_OF_LIFE],
    [LifecycleStage.END_OF_LIFE]: [],
  };

  return transitions[currentStage] || [];
}

/**
 * Helper: Checks if stage requires approval.
 */
function requiresApproval(stage: LifecycleStage): boolean {
  const approvalStages = [
    LifecycleStage.DESIGN,
    LifecycleStage.SAMPLING,
    LifecycleStage.PRODUCTION,
  ];
  return approvalStages.includes(stage);
}

/**
 * Helper: Calculates expected sell-through based on discount.
 */
function calculateExpectedSellThrough(
  strategy: MarkdownStrategy,
  discountPercentage: number
): number {
  const strategyMultipliers: Record<MarkdownStrategy, number> = {
    [MarkdownStrategy.AGGRESSIVE]: 1.2,
    [MarkdownStrategy.MODERATE]: 1.0,
    [MarkdownStrategy.CONSERVATIVE]: 0.8,
    [MarkdownStrategy.SEASONAL]: 1.0,
    [MarkdownStrategy.CLEARANCE]: 1.3,
    [MarkdownStrategy.PROMOTIONAL]: 1.1,
  };

  const baseRate = 0.2 + (discountPercentage / 100) * 0.6;
  const multiplier = strategyMultipliers[strategy] || 1.0;

  return Math.min(0.95, baseRate * multiplier);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Lifecycle Stage Management
  createProductLifecycle,
  transitionLifecycleStage,
  addApprovalGate,
  processApprovalDecision,
  getStageStatus,
  validateStageTransition,
  getStageHistory,
  updateStageStatus,

  // Season Planning & Calendar
  createSeasonPlan,
  addSeasonCollection,
  generateSeasonCalendar,
  calculateSeasonTimeline,
  updateSeasonStatus,
  validateSeasonPlan,
  compareSeasons,
  cloneSeasonPlan,

  // Product Development Tracking
  addDevelopmentMilestone,
  completeDevelopmentMilestone,
  trackDevelopmentProgress,
  updateDevelopmentStatus,
  validateMilestoneDependencies,
  generateDevelopmentTimeline,
  calculateDevelopmentVelocity,
  generateDevelopmentReport,

  // Launch & Distribution
  createDistributionPlan,
  allocateToChannel,
  allocateToLocation,
  markShipmentSent,
  markShipmentReceived,
  generateDistributionReport,
  optimizeDistributionAllocation,
  validateDistributionPlan,

  // Markdown & Clearance
  createMarkdownSchedule,
  addMarkdownEvent,
  executeMarkdownEvent,
  generateMarkdownRecommendations,
  calculateMarkdownPerformance,
  optimizeClearancePricing,
  generateMarkdownScheduleEvents,
  generateMarkdownAnalysis,
};
