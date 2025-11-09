/**
 * LOC: PROP_RISK_MGMT_001
 * File: /reuse/property/property-risk-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - uuid
 *   - node-cache
 *
 * DOWNSTREAM (imported by):
 *   - Property management services
 *   - Risk management controllers
 *   - Insurance management systems
 *   - Compliance reporting services
 *   - Emergency response systems
 *   - Business continuity services
 */
import { z } from 'zod';
/**
 * Risk category enumeration
 */
export declare enum RiskCategory {
    STRATEGIC = "strategic",
    OPERATIONAL = "operational",
    FINANCIAL = "financial",
    COMPLIANCE = "compliance",
    REPUTATIONAL = "reputational",
    SAFETY = "safety",
    SECURITY = "security",
    ENVIRONMENTAL = "environmental",
    TECHNOLOGY = "technology",
    HEALTH = "health",
    LEGAL = "legal",
    NATURAL_DISASTER = "natural_disaster"
}
/**
 * Risk status enumeration
 */
export declare enum RiskStatus {
    IDENTIFIED = "identified",
    ASSESSED = "assessed",
    ACTIVE = "active",
    MONITORING = "monitoring",
    MITIGATED = "mitigated",
    CLOSED = "closed",
    ARCHIVED = "archived",
    ESCALATED = "escalated"
}
/**
 * Risk likelihood enumeration
 */
export declare enum RiskLikelihood {
    RARE = "rare",// < 5%
    UNLIKELY = "unlikely",// 5-25%
    POSSIBLE = "possible",// 25-50%
    LIKELY = "likely",// 50-75%
    ALMOST_CERTAIN = "almost_certain"
}
/**
 * Risk impact enumeration
 */
export declare enum RiskImpact {
    NEGLIGIBLE = "negligible",
    MINOR = "minor",
    MODERATE = "moderate",
    MAJOR = "major",
    CATASTROPHIC = "catastrophic"
}
/**
 * Risk priority enumeration
 */
export declare enum RiskPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    NEGLIGIBLE = "negligible"
}
/**
 * Insurance policy type enumeration
 */
export declare enum InsurancePolicyType {
    PROPERTY = "property",
    LIABILITY = "liability",
    WORKERS_COMPENSATION = "workers_compensation",
    PROFESSIONAL_LIABILITY = "professional_liability",
    CYBER = "cyber",
    BUSINESS_INTERRUPTION = "business_interruption",
    DIRECTORS_AND_OFFICERS = "directors_and_officers",
    EQUIPMENT_BREAKDOWN = "equipment_breakdown",
    FLOOD = "flood",
    EARTHQUAKE = "earthquake",
    UMBRELLA = "umbrella",
    OTHER = "other"
}
/**
 * Insurance policy status enumeration
 */
export declare enum InsurancePolicyStatus {
    ACTIVE = "active",
    PENDING_RENEWAL = "pending_renewal",
    EXPIRED = "expired",
    CANCELLED = "cancelled",
    SUSPENDED = "suspended",
    UNDER_REVIEW = "under_review"
}
/**
 * Claims status enumeration
 */
export declare enum ClaimStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    INVESTIGATING = "investigating",
    APPROVED = "approved",
    DENIED = "denied",
    SETTLED = "settled",
    CLOSED = "closed",
    APPEALED = "appealed"
}
/**
 * Incident severity enumeration
 */
export declare enum IncidentSeverity {
    MINOR = "minor",
    MODERATE = "moderate",
    SERIOUS = "serious",
    CRITICAL = "critical",
    CATASTROPHIC = "catastrophic"
}
/**
 * Incident status enumeration
 */
export declare enum IncidentStatus {
    REPORTED = "reported",
    INVESTIGATING = "investigating",
    CONTAINED = "contained",
    RESOLVED = "resolved",
    CLOSED = "closed",
    ESCALATED = "escalated"
}
/**
 * Emergency plan type enumeration
 */
export declare enum EmergencyPlanType {
    FIRE = "fire",
    FLOOD = "flood",
    EARTHQUAKE = "earthquake",
    ACTIVE_SHOOTER = "active_shooter",
    BOMB_THREAT = "bomb_threat",
    HAZMAT = "hazmat",
    MEDICAL_EMERGENCY = "medical_emergency",
    POWER_OUTAGE = "power_outage",
    CYBER_ATTACK = "cyber_attack",
    PANDEMIC = "pandemic",
    SEVERE_WEATHER = "severe_weather",
    EVACUATION = "evacuation"
}
/**
 * Mitigation strategy type enumeration
 */
export declare enum MitigationStrategyType {
    AVOID = "avoid",
    REDUCE = "reduce",
    TRANSFER = "transfer",
    ACCEPT = "accept",
    EXPLOIT = "exploit",
    SHARE = "share"
}
/**
 * Control effectiveness enumeration
 */
export declare enum ControlEffectiveness {
    NOT_EFFECTIVE = "not_effective",
    PARTIALLY_EFFECTIVE = "partially_effective",
    LARGELY_EFFECTIVE = "largely_effective",
    FULLY_EFFECTIVE = "fully_effective",
    UNKNOWN = "unknown"
}
/**
 * Business continuity plan status enumeration
 */
export declare enum BCPStatus {
    DRAFT = "draft",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    ACTIVE = "active",
    TESTING = "testing",
    NEEDS_UPDATE = "needs_update",
    ARCHIVED = "archived"
}
/**
 * Risk interface
 */
export interface Risk {
    id: string;
    riskCode: string;
    title: string;
    description: string;
    category: RiskCategory;
    status: RiskStatus;
    likelihood: RiskLikelihood;
    impact: RiskImpact;
    priority: RiskPriority;
    riskScore: number;
    residualRiskScore?: number;
    ownerId: string;
    departmentId?: string;
    propertyId?: string;
    identifiedDate: Date;
    assessmentDate?: Date;
    lastReviewDate?: Date;
    nextReviewDate?: Date;
    closedDate?: Date;
    rootCause?: string;
    potentialConsequences?: string[];
    existingControls?: string[];
    estimatedFinancialImpact?: number;
    potentialLoss?: {
        min: number;
        max: number;
        mostLikely: number;
    };
    attachments?: string[];
    relatedIncidentIds?: string[];
    relatedPolicyIds?: string[];
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Risk register interface
 */
export interface RiskRegister {
    id: string;
    name: string;
    description?: string;
    scope: string;
    departmentId?: string;
    propertyId?: string;
    projectId?: string;
    ownerId: string;
    status: 'active' | 'archived';
    risks: string[];
    reviewFrequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
    lastReviewDate?: Date;
    nextReviewDate?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Insurance policy interface
 */
export interface InsurancePolicy {
    id: string;
    policyNumber: string;
    policyType: InsurancePolicyType;
    status: InsurancePolicyStatus;
    provider: string;
    broker?: string;
    policyHolderName: string;
    insuredProperties?: string[];
    coverageAmount: number;
    deductible: number;
    premium: number;
    premiumFrequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
    effectiveDate: Date;
    expiryDate: Date;
    renewalDate?: Date;
    coverageDetails?: {
        description: string;
        limits: Record<string, number>;
        exclusions?: string[];
        endorsements?: string[];
    };
    agentName?: string;
    agentPhone?: string;
    agentEmail?: string;
    claimsPhone?: string;
    documentUrl?: string;
    relatedRiskIds?: string[];
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Insurance claim interface
 */
export interface InsuranceClaim {
    id: string;
    claimNumber: string;
    policyId: string;
    incidentId?: string;
    status: ClaimStatus;
    claimType: string;
    incidentDate: Date;
    reportedDate: Date;
    location?: string;
    propertyId?: string;
    description: string;
    causeOfLoss: string;
    claimantName: string;
    claimantContact?: {
        phone?: string;
        email?: string;
        address?: string;
    };
    estimatedLoss?: number;
    claimedAmount?: number;
    approvedAmount?: number;
    paidAmount?: number;
    deductible?: number;
    adjusterName?: string;
    adjusterContact?: string;
    investigationNotes?: string;
    denialReason?: string;
    settlementDate?: Date;
    paymentDate?: Date;
    documents?: string[];
    photos?: string[];
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Emergency plan interface
 */
export interface EmergencyPlan {
    id: string;
    name: string;
    planType: EmergencyPlanType;
    propertyId?: string;
    departmentId?: string;
    version: string;
    status: 'draft' | 'active' | 'under_review' | 'archived';
    objectives: string[];
    scope: string;
    responseTeam?: Array<{
        role: string;
        userId?: string;
        name: string;
        contact: string;
        alternateUserId?: string;
        alternateName?: string;
        alternateContact?: string;
    }>;
    procedures?: Array<{
        step: number;
        action: string;
        responsible: string;
        timeframe?: string;
    }>;
    evacuationRoutes?: Array<{
        name: string;
        from: string;
        to: string;
        assemblyPoint: string;
    }>;
    communicationProtocol?: {
        internalContacts: Array<{
            role: string;
            contact: string;
        }>;
        externalContacts: Array<{
            organization: string;
            contact: string;
        }>;
        notificationSequence: string[];
    };
    resources?: Array<{
        type: string;
        description: string;
        location: string;
        quantity?: number;
    }>;
    lastTestedDate?: Date;
    nextTestDate?: Date;
    testResults?: string;
    lastReviewDate?: Date;
    nextReviewDate?: Date;
    reviewedByUserId?: string;
    approvedByUserId?: string;
    approvalDate?: Date;
    documentUrl?: string;
    attachments?: string[];
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Business continuity plan interface
 */
export interface BusinessContinuityPlan {
    id: string;
    name: string;
    version: string;
    status: BCPStatus;
    propertyId?: string;
    departmentId?: string;
    objectives: string[];
    scope: string;
    criticalFunctions?: Array<{
        function: string;
        departmentId?: string;
        rto: number;
        rpo: number;
        mto: number;
        dependencies: string[];
        resources: string[];
    }>;
    recoveryStrategies?: Array<{
        function: string;
        strategy: string;
        alternateLocation?: string;
        requiredResources: string[];
        estimatedCost?: number;
        implementationTime: number;
    }>;
    responseTeam?: Array<{
        role: string;
        userId?: string;
        name: string;
        contact: string;
        responsibilities: string[];
    }>;
    communicationPlan?: {
        stakeholders: Array<{
            group: string;
            contactMethod: string;
            frequency: string;
        }>;
        templates: Array<{
            name: string;
            purpose: string;
            content: string;
        }>;
    };
    criticalVendors?: Array<{
        name: string;
        service: string;
        contact: string;
        alternateContact?: string;
        contractNumber?: string;
        sla?: string;
    }>;
    lastTestedDate?: Date;
    nextTestDate?: Date;
    testResults?: string;
    lastReviewDate?: Date;
    nextReviewDate?: Date;
    reviewedByUserId?: string;
    approvedByUserId?: string;
    approvalDate?: Date;
    documentUrl?: string;
    attachments?: string[];
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Incident report interface
 */
export interface IncidentReport {
    id: string;
    incidentNumber: string;
    title: string;
    description: string;
    incidentType: string;
    category: RiskCategory;
    severity: IncidentSeverity;
    status: IncidentStatus;
    incidentDate: Date;
    reportedDate: Date;
    reportedByUserId: string;
    location?: string;
    propertyId?: string;
    departmentId?: string;
    personsInvolved?: Array<{
        name: string;
        userId?: string;
        role: string;
        injuryType?: string;
        medicalTreatment?: boolean;
    }>;
    injuries?: number;
    fatalities?: number;
    propertyDamage?: boolean;
    estimatedDamage?: number;
    businessInterruption?: boolean;
    interruptionDuration?: number;
    rootCause?: string;
    contributingFactors?: string[];
    investigatedByUserId?: string;
    investigationDate?: Date;
    investigationNotes?: string;
    immediateActions?: string;
    correctiveActions?: Array<{
        action: string;
        assignedToUserId?: string;
        dueDate?: Date;
        status: 'pending' | 'in_progress' | 'completed';
        completedDate?: Date;
    }>;
    resolutionDate?: Date;
    closedDate?: Date;
    closedByUserId?: string;
    relatedRiskIds?: string[];
    relatedClaimIds?: string[];
    photos?: string[];
    documents?: string[];
    witnessStatements?: string[];
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Risk mitigation strategy interface
 */
export interface RiskMitigationStrategy {
    id: string;
    riskId: string;
    strategyType: MitigationStrategyType;
    name: string;
    description: string;
    actions?: Array<{
        id: string;
        action: string;
        assignedToUserId?: string;
        dueDate?: Date;
        priority: 'critical' | 'high' | 'medium' | 'low';
        status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
        completedDate?: Date;
        notes?: string;
    }>;
    controls?: Array<{
        id: string;
        type: 'preventive' | 'detective' | 'corrective';
        description: string;
        effectiveness: ControlEffectiveness;
        implementationDate?: Date;
        owner?: string;
    }>;
    estimatedCost?: number;
    expectedBenefit?: number;
    costBenefitRatio?: number;
    targetRiskReduction?: number;
    actualRiskReduction?: number;
    implementationDate?: Date;
    reviewDate?: Date;
    status: 'planned' | 'in_progress' | 'implemented' | 'monitoring' | 'completed';
    approvedByUserId?: string;
    approvalDate?: Date;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Risk assessment interface
 */
export interface RiskAssessment {
    id: string;
    riskId: string;
    assessmentDate: Date;
    assessorUserId: string;
    likelihood: RiskLikelihood;
    likelihoodJustification?: string;
    likelihoodFactors?: string[];
    impact: RiskImpact;
    impactJustification?: string;
    impactCategories?: {
        financial?: {
            rating: RiskImpact;
            amount?: number;
        };
        operational?: {
            rating: RiskImpact;
            description?: string;
        };
        reputational?: {
            rating: RiskImpact;
            description?: string;
        };
        compliance?: {
            rating: RiskImpact;
            description?: string;
        };
        safety?: {
            rating: RiskImpact;
            description?: string;
        };
    };
    inherentRiskScore: number;
    residualRiskScore?: number;
    existingControls?: Array<{
        description: string;
        effectiveness: ControlEffectiveness;
    }>;
    recommendations?: string[];
    requiredActions?: string[];
    methodology?: string;
    assumptions?: string[];
    reviewedByUserId?: string;
    reviewDate?: Date;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Risk heat map data interface
 */
export interface RiskHeatMap {
    id: string;
    name: string;
    description?: string;
    registerId?: string;
    departmentId?: string;
    propertyId?: string;
    generatedDate: Date;
    generatedByUserId: string;
    matrix: {
        likelihood: RiskLikelihood;
        impact: RiskImpact;
        risks: Array<{
            id: string;
            code: string;
            title: string;
            score: number;
            priority: RiskPriority;
        }>;
        count: number;
    }[];
    statistics: {
        totalRisks: number;
        criticalRisks: number;
        highRisks: number;
        mediumRisks: number;
        lowRisks: number;
        averageRiskScore: number;
        categoryBreakdown: Record<RiskCategory, number>;
    };
    filters?: {
        categories?: RiskCategory[];
        dateRange?: {
            from: Date;
            to: Date;
        };
        status?: RiskStatus[];
    };
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Safety protocol interface
 */
export interface SafetyProtocol {
    id: string;
    name: string;
    protocolNumber: string;
    category: 'general_safety' | 'fire_safety' | 'chemical_safety' | 'electrical_safety' | 'personal_protective_equipment' | 'lockout_tagout' | 'confined_space' | 'other';
    propertyId?: string;
    departmentId?: string;
    description: string;
    purpose: string;
    scope: string;
    procedures?: Array<{
        step: number;
        description: string;
        warnings?: string[];
        requiredEquipment?: string[];
    }>;
    hazards?: Array<{
        hazard: string;
        severity: IncidentSeverity;
        controls: string[];
    }>;
    requiredPPE?: string[];
    trainingRequired?: boolean;
    trainingFrequency?: 'annual' | 'semi-annual' | 'quarterly' | 'as_needed';
    certificationRequired?: boolean;
    regulatoryReferences?: string[];
    complianceStatus?: 'compliant' | 'non_compliant' | 'under_review';
    status: 'draft' | 'active' | 'under_review' | 'archived';
    version: string;
    effectiveDate?: Date;
    lastReviewDate?: Date;
    nextReviewDate?: Date;
    reviewedByUserId?: string;
    approvedByUserId?: string;
    approvalDate?: Date;
    documentUrl?: string;
    attachments?: string[];
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Audit log interface
 */
export interface RiskAuditLog {
    id: string;
    entityType: 'risk' | 'policy' | 'claim' | 'incident' | 'emergency_plan' | 'bcp' | 'mitigation' | 'assessment' | 'safety_protocol';
    entityId: string;
    action: string;
    performedByUserId: string;
    previousState?: any;
    newState?: any;
    changes?: Record<string, {
        old: any;
        new: any;
    }>;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}
/**
 * Risk creation schema
 */
export declare const RiskCreateSchema: any;
/**
 * Risk update schema
 */
export declare const RiskUpdateSchema: any;
/**
 * Insurance policy creation schema
 */
export declare const InsurancePolicyCreateSchema: any;
/**
 * Insurance claim creation schema
 */
export declare const InsuranceClaimCreateSchema: any;
/**
 * Emergency plan creation schema
 */
export declare const EmergencyPlanCreateSchema: any;
/**
 * Business continuity plan creation schema
 */
export declare const BCPlanCreateSchema: any;
/**
 * Incident report creation schema
 */
export declare const IncidentReportCreateSchema: any;
/**
 * Risk mitigation strategy creation schema
 */
export declare const MitigationStrategyCreateSchema: any;
/**
 * Risk assessment creation schema
 */
export declare const RiskAssessmentCreateSchema: any;
/**
 * Safety protocol creation schema
 */
export declare const SafetyProtocolCreateSchema: any;
/**
 * Identify and register a new risk
 *
 * @param data - Risk creation data
 * @returns Created risk
 *
 * @example
 * ```typescript
 * const risk = await identifyRisk({
 *   riskCode: 'RISK-2024-001',
 *   title: 'Fire Safety System Failure',
 *   description: 'Potential failure of fire suppression system',
 *   category: RiskCategory.SAFETY,
 *   likelihood: RiskLikelihood.POSSIBLE,
 *   impact: RiskImpact.MAJOR,
 *   ownerId: 'user-123',
 * });
 * ```
 */
export declare function identifyRisk(data: z.infer<typeof RiskCreateSchema>): Promise<Risk>;
/**
 * Perform comprehensive risk assessment
 *
 * @param data - Risk assessment data
 * @returns Risk assessment result
 *
 * @example
 * ```typescript
 * const assessment = await assessRisk({
 *   riskId: 'risk-123',
 *   assessorUserId: 'user-456',
 *   likelihood: RiskLikelihood.LIKELY,
 *   impact: RiskImpact.MAJOR,
 *   likelihoodJustification: 'Historical data shows similar incidents occur frequently',
 *   impactJustification: 'Could result in significant property damage and business interruption',
 * });
 * ```
 */
export declare function assessRisk(data: z.infer<typeof RiskAssessmentCreateSchema>): Promise<RiskAssessment>;
/**
 * Update an existing risk
 *
 * @param riskId - Risk ID
 * @param data - Risk update data
 * @param updatedByUserId - User performing the update
 * @returns Updated risk
 *
 * @example
 * ```typescript
 * const updated = await updateRisk('risk-123', {
 *   status: RiskStatus.ACTIVE,
 *   likelihood: RiskLikelihood.UNLIKELY,
 * }, 'user-789');
 * ```
 */
export declare function updateRisk(riskId: string, data: z.infer<typeof RiskUpdateSchema>, updatedByUserId: string): Promise<Risk>;
/**
 * Calculate risk score based on likelihood and impact
 *
 * @param likelihood - Risk likelihood
 * @param impact - Risk impact
 * @returns Calculated risk score
 *
 * @example
 * ```typescript
 * const score = calculateRiskScore(RiskLikelihood.LIKELY, RiskImpact.MAJOR);
 * console.log(score); // 12
 * ```
 */
export declare function calculateRiskScore(likelihood: RiskLikelihood, impact: RiskImpact): number;
/**
 * Get risk by ID
 *
 * @param riskId - Risk ID
 * @returns Risk
 * @throws NotFoundException if risk not found
 */
export declare function getRiskById(riskId: string): Promise<Risk>;
/**
 * Create a new risk register
 *
 * @param name - Register name
 * @param scope - Register scope
 * @param ownerId - Register owner ID
 * @param options - Additional register options
 * @returns Created risk register
 *
 * @example
 * ```typescript
 * const register = await createRiskRegister(
 *   'Department Risk Register',
 *   'Department-wide risks for Emergency Department',
 *   'user-123',
 *   { departmentId: 'dept-456', reviewFrequency: 'monthly' }
 * );
 * ```
 */
export declare function createRiskRegister(name: string, scope: string, ownerId: string, options?: {
    description?: string;
    departmentId?: string;
    propertyId?: string;
    projectId?: string;
    reviewFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'annually';
}): Promise<RiskRegister>;
/**
 * Add risk to register
 *
 * @param registerId - Risk register ID
 * @param riskId - Risk ID to add
 * @param addedByUserId - User adding the risk
 * @returns Updated risk register
 *
 * @example
 * ```typescript
 * const updated = await addRiskToRegister('register-123', 'risk-456', 'user-789');
 * ```
 */
export declare function addRiskToRegister(registerId: string, riskId: string, addedByUserId: string): Promise<RiskRegister>;
/**
 * Remove risk from register
 *
 * @param registerId - Risk register ID
 * @param riskId - Risk ID to remove
 * @param removedByUserId - User removing the risk
 * @returns Updated risk register
 */
export declare function removeRiskFromRegister(registerId: string, riskId: string, removedByUserId: string): Promise<RiskRegister>;
/**
 * Get risks from register with filtering
 *
 * @param registerId - Risk register ID
 * @param filters - Optional filters
 * @returns List of risks in the register
 *
 * @example
 * ```typescript
 * const risks = await getRisksFromRegister('register-123', {
 *   category: RiskCategory.SAFETY,
 *   priority: RiskPriority.HIGH,
 * });
 * ```
 */
export declare function getRisksFromRegister(registerId: string, filters?: {
    category?: RiskCategory;
    status?: RiskStatus;
    priority?: RiskPriority;
    minRiskScore?: number;
}): Promise<Risk[]>;
/**
 * Register a new insurance policy
 *
 * @param data - Insurance policy data
 * @returns Created insurance policy
 *
 * @example
 * ```typescript
 * const policy = await registerInsurancePolicy({
 *   policyNumber: 'POL-2024-001',
 *   policyType: InsurancePolicyType.PROPERTY,
 *   provider: 'ABC Insurance Co.',
 *   policyHolderName: 'White Cross Hospital',
 *   coverageAmount: 5000000,
 *   deductible: 10000,
 *   premium: 50000,
 *   premiumFrequency: 'annual',
 *   effectiveDate: new Date('2024-01-01'),
 *   expiryDate: new Date('2024-12-31'),
 * });
 * ```
 */
export declare function registerInsurancePolicy(data: z.infer<typeof InsurancePolicyCreateSchema>): Promise<InsurancePolicy>;
/**
 * Check for policies nearing expiry
 *
 * @param daysBeforeExpiry - Number of days before expiry to check (default: 30)
 * @returns List of policies expiring soon
 *
 * @example
 * ```typescript
 * const expiringPolicies = await checkPolicyExpiry(60);
 * ```
 */
export declare function checkPolicyExpiry(daysBeforeExpiry?: number): Promise<InsurancePolicy[]>;
/**
 * Renew insurance policy
 *
 * @param policyId - Policy ID to renew
 * @param newExpiryDate - New expiry date
 * @param renewedByUserId - User performing renewal
 * @param updates - Optional policy updates
 * @returns Renewed insurance policy
 *
 * @example
 * ```typescript
 * const renewed = await renewInsurancePolicy(
 *   'policy-123',
 *   new Date('2025-12-31'),
 *   'user-456',
 *   { premium: 52000 }
 * );
 * ```
 */
export declare function renewInsurancePolicy(policyId: string, newExpiryDate: Date, renewedByUserId: string, updates?: Partial<InsurancePolicy>): Promise<InsurancePolicy>;
/**
 * Verify insurance coverage for a property
 *
 * @param propertyId - Property ID
 * @param coverageType - Type of coverage to verify
 * @returns Coverage verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyInsuranceCoverage('property-123', InsurancePolicyType.PROPERTY);
 * ```
 */
export declare function verifyInsuranceCoverage(propertyId: string, coverageType: InsurancePolicyType): Promise<{
    isCovered: boolean;
    policies: InsurancePolicy[];
    totalCoverage: number;
    gaps?: string[];
}>;
/**
 * File an insurance claim
 *
 * @param data - Claim creation data
 * @returns Created insurance claim
 *
 * @example
 * ```typescript
 * const claim = await fileInsuranceClaim({
 *   claimNumber: 'CLM-2024-001',
 *   policyId: 'policy-123',
 *   claimType: 'Property Damage',
 *   incidentDate: new Date('2024-01-15'),
 *   description: 'Water damage from burst pipe',
 *   causeOfLoss: 'Plumbing failure',
 *   claimantName: 'White Cross Hospital',
 *   claimedAmount: 25000,
 * });
 * ```
 */
export declare function fileInsuranceClaim(data: z.infer<typeof InsuranceClaimCreateSchema>): Promise<InsuranceClaim>;
/**
 * Update claim status
 *
 * @param claimId - Claim ID
 * @param status - New claim status
 * @param updatedByUserId - User updating the claim
 * @param notes - Optional notes about the update
 * @returns Updated claim
 *
 * @example
 * ```typescript
 * const updated = await updateClaimStatus(
 *   'claim-123',
 *   ClaimStatus.APPROVED,
 *   'user-456',
 *   'Approved after investigation'
 * );
 * ```
 */
export declare function updateClaimStatus(claimId: string, status: ClaimStatus, updatedByUserId: string, notes?: string): Promise<InsuranceClaim>;
/**
 * Process claim settlement
 *
 * @param claimId - Claim ID
 * @param approvedAmount - Approved settlement amount
 * @param settledByUserId - User processing the settlement
 * @returns Settled claim
 *
 * @example
 * ```typescript
 * const settled = await processClaimSettlement('claim-123', 20000, 'user-456');
 * ```
 */
export declare function processClaimSettlement(claimId: string, approvedAmount: number, settledByUserId: string): Promise<InsuranceClaim>;
/**
 * Get claims by policy
 *
 * @param policyId - Policy ID
 * @param filters - Optional filters
 * @returns List of claims for the policy
 */
export declare function getClaimsByPolicy(policyId: string, filters?: {
    status?: ClaimStatus;
    dateRange?: {
        from: Date;
        to: Date;
    };
}): Promise<InsuranceClaim[]>;
/**
 * Create an emergency preparedness plan
 *
 * @param data - Emergency plan data
 * @returns Created emergency plan
 *
 * @example
 * ```typescript
 * const plan = await createEmergencyPlan({
 *   name: 'Fire Emergency Response Plan',
 *   planType: EmergencyPlanType.FIRE,
 *   version: '1.0',
 *   objectives: ['Ensure safe evacuation', 'Protect critical assets'],
 *   scope: 'Applies to all staff and patients in main building',
 *   propertyId: 'property-123',
 * });
 * ```
 */
export declare function createEmergencyPlan(data: z.infer<typeof EmergencyPlanCreateSchema>): Promise<EmergencyPlan>;
/**
 * Test emergency plan
 *
 * @param planId - Emergency plan ID
 * @param testedByUserId - User conducting the test
 * @param testResults - Test results and observations
 * @returns Updated emergency plan
 *
 * @example
 * ```typescript
 * const tested = await testEmergencyPlan(
 *   'plan-123',
 *   'user-456',
 *   'Evacuation drill completed in 8 minutes. All staff accounted for.'
 * );
 * ```
 */
export declare function testEmergencyPlan(planId: string, testedByUserId: string, testResults: string): Promise<EmergencyPlan>;
/**
 * Activate emergency plan
 *
 * @param planId - Emergency plan ID
 * @param activatedByUserId - User activating the plan
 * @param reason - Reason for activation
 * @returns Activated plan details
 *
 * @example
 * ```typescript
 * const activated = await activateEmergencyPlan(
 *   'plan-123',
 *   'user-456',
 *   'Fire detected in building B'
 * );
 * ```
 */
export declare function activateEmergencyPlan(planId: string, activatedByUserId: string, reason: string): Promise<{
    plan: EmergencyPlan;
    activationId: string;
    activatedAt: Date;
}>;
/**
 * Get emergency contact list for a plan
 *
 * @param planId - Emergency plan ID
 * @returns Contact list with roles and contact information
 */
export declare function getEmergencyContactList(planId: string): Promise<Array<{
    role: string;
    name: string;
    contact: string;
    alternate?: {
        name: string;
        contact: string;
    };
}>>;
/**
 * Create a business continuity plan
 *
 * @param data - BCP creation data
 * @returns Created business continuity plan
 *
 * @example
 * ```typescript
 * const bcp = await createBusinessContinuityPlan({
 *   name: 'IT Systems Recovery Plan',
 *   version: '1.0',
 *   objectives: ['Restore critical IT systems within 24 hours'],
 *   scope: 'All IT infrastructure and applications',
 *   departmentId: 'dept-123',
 * });
 * ```
 */
export declare function createBusinessContinuityPlan(data: z.infer<typeof BCPlanCreateSchema>): Promise<BusinessContinuityPlan>;
/**
 * Conduct business impact analysis
 *
 * @param bcpId - BCP ID
 * @param criticalFunctions - Critical business functions with RTOs and RPOs
 * @param analyzedByUserId - User conducting the analysis
 * @returns Updated BCP with impact analysis
 *
 * @example
 * ```typescript
 * const bcp = await conductBusinessImpactAnalysis('bcp-123', [
 *   {
 *     function: 'Patient Registration',
 *     departmentId: 'dept-456',
 *     rto: 2, // 2 hours
 *     rpo: 1, // 1 hour
 *     mto: 4, // 4 hours
 *     dependencies: ['Network', 'EMR System'],
 *     resources: ['Computers', 'Trained Staff'],
 *   },
 * ], 'user-789');
 * ```
 */
export declare function conductBusinessImpactAnalysis(bcpId: string, criticalFunctions: Array<{
    function: string;
    departmentId?: string;
    rto: number;
    rpo: number;
    mto: number;
    dependencies: string[];
    resources: string[];
}>, analyzedByUserId: string): Promise<BusinessContinuityPlan>;
/**
 * Define recovery strategies for critical functions
 *
 * @param bcpId - BCP ID
 * @param strategies - Recovery strategies
 * @param definedByUserId - User defining the strategies
 * @returns Updated BCP with recovery strategies
 */
export declare function defineRecoveryStrategies(bcpId: string, strategies: Array<{
    function: string;
    strategy: string;
    alternateLocation?: string;
    requiredResources: string[];
    estimatedCost?: number;
    implementationTime: number;
}>, definedByUserId: string): Promise<BusinessContinuityPlan>;
/**
 * Test business continuity plan
 *
 * @param bcpId - BCP ID
 * @param testedByUserId - User conducting the test
 * @param testType - Type of test (tabletop, walkthrough, simulation, full-scale)
 * @param testResults - Test results
 * @returns Updated BCP
 */
export declare function testBusinessContinuityPlan(bcpId: string, testedByUserId: string, testType: 'tabletop' | 'walkthrough' | 'simulation' | 'full-scale', testResults: string): Promise<BusinessContinuityPlan>;
/**
 * Create a risk mitigation strategy
 *
 * @param data - Mitigation strategy data
 * @returns Created mitigation strategy
 *
 * @example
 * ```typescript
 * const strategy = await createMitigationStrategy({
 *   riskId: 'risk-123',
 *   strategyType: MitigationStrategyType.REDUCE,
 *   name: 'Install Sprinkler System',
 *   description: 'Install automated sprinkler system to reduce fire risk',
 *   estimatedCost: 50000,
 *   targetRiskReduction: 60,
 * });
 * ```
 */
export declare function createMitigationStrategy(data: z.infer<typeof MitigationStrategyCreateSchema>): Promise<RiskMitigationStrategy>;
/**
 * Add control measure to mitigation strategy
 *
 * @param strategyId - Mitigation strategy ID
 * @param control - Control measure details
 * @param addedByUserId - User adding the control
 * @returns Updated mitigation strategy
 *
 * @example
 * ```typescript
 * const updated = await addControlMeasure('strategy-123', {
 *   type: 'preventive',
 *   description: 'Monthly fire alarm testing',
 *   effectiveness: ControlEffectiveness.FULLY_EFFECTIVE,
 *   owner: 'Facilities Manager',
 * }, 'user-456');
 * ```
 */
export declare function addControlMeasure(strategyId: string, control: {
    type: 'preventive' | 'detective' | 'corrective';
    description: string;
    effectiveness: ControlEffectiveness;
    implementationDate?: Date;
    owner?: string;
}, addedByUserId: string): Promise<RiskMitigationStrategy>;
/**
 * Track mitigation strategy progress
 *
 * @param strategyId - Mitigation strategy ID
 * @param actualRiskReduction - Actual risk reduction achieved (percentage)
 * @param updatedByUserId - User updating progress
 * @returns Updated strategy
 */
export declare function trackMitigationProgress(strategyId: string, actualRiskReduction: number, updatedByUserId: string): Promise<RiskMitigationStrategy>;
/**
 * Get mitigation strategies for a risk
 *
 * @param riskId - Risk ID
 * @returns List of mitigation strategies
 */
export declare function getMitigationStrategiesByRisk(riskId: string): Promise<RiskMitigationStrategy[]>;
/**
 * Report a new incident
 *
 * @param data - Incident report data
 * @returns Created incident report
 *
 * @example
 * ```typescript
 * const incident = await reportIncident({
 *   incidentNumber: 'INC-2024-001',
 *   title: 'Slip and Fall in Cafeteria',
 *   description: 'Patient slipped on wet floor',
 *   incidentType: 'Safety',
 *   category: RiskCategory.SAFETY,
 *   severity: IncidentSeverity.MODERATE,
 *   incidentDate: new Date(),
 *   reportedByUserId: 'user-123',
 *   propertyId: 'property-456',
 *   injuries: 1,
 * });
 * ```
 */
export declare function reportIncident(data: z.infer<typeof IncidentReportCreateSchema>): Promise<IncidentReport>;
/**
 * Investigate incident
 *
 * @param incidentId - Incident ID
 * @param investigatedByUserId - User conducting investigation
 * @param investigation - Investigation details
 * @returns Updated incident report
 *
 * @example
 * ```typescript
 * const investigated = await investigateIncident('incident-123', 'user-456', {
 *   rootCause: 'Floor cleaning without warning signs',
 *   contributingFactors: ['No wet floor signs', 'Inadequate lighting'],
 *   investigationNotes: 'Reviewed security footage and interviewed witnesses',
 * });
 * ```
 */
export declare function investigateIncident(incidentId: string, investigatedByUserId: string, investigation: {
    rootCause: string;
    contributingFactors?: string[];
    investigationNotes?: string;
}): Promise<IncidentReport>;
/**
 * Add corrective actions to incident
 *
 * @param incidentId - Incident ID
 * @param actions - Corrective actions
 * @param addedByUserId - User adding the actions
 * @returns Updated incident report
 *
 * @example
 * ```typescript
 * const updated = await addCorrectiveActions('incident-123', [
 *   {
 *     action: 'Install additional warning signs',
 *     assignedToUserId: 'user-789',
 *     dueDate: new Date('2024-02-01'),
 *     status: 'pending',
 *   },
 * ], 'user-456');
 * ```
 */
export declare function addCorrectiveActions(incidentId: string, actions: Array<{
    action: string;
    assignedToUserId?: string;
    dueDate?: Date;
    status: 'pending' | 'in_progress' | 'completed';
}>, addedByUserId: string): Promise<IncidentReport>;
/**
 * Close incident report
 *
 * @param incidentId - Incident ID
 * @param closedByUserId - User closing the incident
 * @param closureNotes - Closure notes
 * @returns Closed incident report
 */
export declare function closeIncident(incidentId: string, closedByUserId: string, closureNotes?: string): Promise<IncidentReport>;
/**
 * Generate risk heat map
 *
 * @param options - Heat map generation options
 * @returns Risk heat map data
 *
 * @example
 * ```typescript
 * const heatMap = await generateRiskHeatMap({
 *   name: 'Q1 2024 Risk Heat Map',
 *   generatedByUserId: 'user-123',
 *   filters: {
 *     categories: [RiskCategory.SAFETY, RiskCategory.OPERATIONAL],
 *     status: [RiskStatus.ACTIVE],
 *   },
 * });
 * ```
 */
export declare function generateRiskHeatMap(options: {
    name: string;
    generatedByUserId: string;
    registerId?: string;
    departmentId?: string;
    propertyId?: string;
    filters?: {
        categories?: RiskCategory[];
        dateRange?: {
            from: Date;
            to: Date;
        };
        status?: RiskStatus[];
    };
}): Promise<RiskHeatMap>;
/**
 * Get risks by priority level
 *
 * @param priority - Risk priority
 * @param filters - Optional filters
 * @returns List of risks matching the priority
 */
export declare function getRisksByPriority(priority: RiskPriority, filters?: {
    departmentId?: string;
    propertyId?: string;
    category?: RiskCategory;
}): Promise<Risk[]>;
/**
 * Calculate aggregate risk score for a department or property
 *
 * @param options - Calculation options
 * @returns Aggregate risk metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateAggregateRiskScore({
 *   departmentId: 'dept-123',
 * });
 * ```
 */
export declare function calculateAggregateRiskScore(options: {
    departmentId?: string;
    propertyId?: string;
    registerId?: string;
}): Promise<{
    totalRisks: number;
    averageRiskScore: number;
    highestRiskScore: number;
    priorityDistribution: Record<RiskPriority, number>;
    categoryDistribution: Record<RiskCategory, number>;
    trendAnalysis?: {
        previousPeriod: number;
        currentPeriod: number;
        percentageChange: number;
    };
}>;
/**
 * Monitor risk score trends over time
 *
 * @param riskId - Risk ID
 * @param periodMonths - Number of months to analyze
 * @returns Risk trend data
 */
export declare function monitorRiskTrends(riskId: string, periodMonths?: number): Promise<{
    riskId: string;
    dataPoints: Array<{
        date: Date;
        riskScore: number;
        likelihood: RiskLikelihood;
        impact: RiskImpact;
        priority: RiskPriority;
    }>;
    trend: 'increasing' | 'decreasing' | 'stable';
    changePercentage: number;
}>;
/**
 * Create a safety protocol
 *
 * @param data - Safety protocol data
 * @returns Created safety protocol
 *
 * @example
 * ```typescript
 * const protocol = await createSafetyProtocol({
 *   name: 'Electrical Safety Protocol',
 *   protocolNumber: 'SAFE-ELEC-001',
 *   category: 'electrical_safety',
 *   description: 'Procedures for working with electrical systems',
 *   purpose: 'Prevent electrical injuries and equipment damage',
 *   scope: 'All maintenance staff working with electrical systems',
 *   version: '1.0',
 *   trainingRequired: true,
 * });
 * ```
 */
export declare function createSafetyProtocol(data: z.infer<typeof SafetyProtocolCreateSchema>): Promise<SafetyProtocol>;
/**
 * Identify hazards in a safety protocol
 *
 * @param protocolId - Safety protocol ID
 * @param hazards - Identified hazards with controls
 * @param identifiedByUserId - User identifying hazards
 * @returns Updated safety protocol
 */
export declare function identifyHazards(protocolId: string, hazards: Array<{
    hazard: string;
    severity: IncidentSeverity;
    controls: string[];
}>, identifiedByUserId: string): Promise<SafetyProtocol>;
/**
 * Conduct safety inspection
 *
 * @param options - Inspection options
 * @returns Safety inspection results
 *
 * @example
 * ```typescript
 * const inspection = await conductSafetyInspection({
 *   propertyId: 'property-123',
 *   inspectedByUserId: 'user-456',
 *   inspectionType: 'routine',
 *   areasInspected: ['Emergency Exits', 'Fire Extinguishers', 'First Aid Stations'],
 * });
 * ```
 */
export declare function conductSafetyInspection(options: {
    propertyId: string;
    inspectedByUserId: string;
    inspectionType: 'routine' | 'compliance' | 'incident-followup' | 'special';
    areasInspected: string[];
    findings?: Array<{
        area: string;
        finding: string;
        severity: IncidentSeverity;
        requiresAction: boolean;
    }>;
}): Promise<{
    id: string;
    inspectionDate: Date;
    propertyId: string;
    inspectedByUserId: string;
    inspectionType: string;
    areasInspected: string[];
    findings: Array<{
        area: string;
        finding: string;
        severity: IncidentSeverity;
        requiresAction: boolean;
    }>;
    overallStatus: 'compliant' | 'minor_issues' | 'major_issues' | 'critical_issues';
    recommendations: string[];
}>;
/**
 * Get safety compliance status
 *
 * @param propertyId - Property ID
 * @returns Safety compliance metrics
 */
export declare function getSafetyComplianceStatus(propertyId: string): Promise<{
    propertyId: string;
    overallCompliance: number;
    activeProtocols: number;
    overdueInspections: number;
    openFindings: number;
    criticalIssues: number;
    lastInspectionDate?: Date;
    nextInspectionDate?: Date;
    complianceByCategory: Record<string, number>;
}>;
/**
 * Get audit trail for an entity
 *
 * @param entityType - Type of entity
 * @param entityId - Entity ID
 * @param options - Query options
 * @returns List of audit logs
 */
export declare function getAuditTrail(entityType: RiskAuditLog['entityType'], entityId: string, options?: {
    startDate?: Date;
    endDate?: Date;
    actions?: string[];
    limit?: number;
}): Promise<RiskAuditLog[]>;
//# sourceMappingURL=property-risk-management-kit.d.ts.map