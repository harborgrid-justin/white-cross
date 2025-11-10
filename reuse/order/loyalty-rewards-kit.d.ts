/**
 * LOC: WC-ORD-LOYRWD-001
 * File: /reuse/order/loyalty-rewards-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *
 * DOWNSTREAM (imported by):
 *   - Order modules
 *   - Customer services
 *   - Marketing automation
 *   - CRM integrations
 *   - Point-of-sale systems
 */
/**
 * Loyalty program membership tiers
 */
export declare enum LoyaltyTier {
    BRONZE = "BRONZE",
    SILVER = "SILVER",
    GOLD = "GOLD",
    PLATINUM = "PLATINUM",
    DIAMOND = "DIAMOND"
}
/**
 * Loyalty member status
 */
export declare enum MemberStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    PENDING = "PENDING",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED"
}
/**
 * Points transaction types
 */
export declare enum PointsTransactionType {
    EARNED_PURCHASE = "EARNED_PURCHASE",
    EARNED_BONUS = "EARNED_BONUS",
    EARNED_REFERRAL = "EARNED_REFERRAL",
    EARNED_BIRTHDAY = "EARNED_BIRTHDAY",
    EARNED_ANNIVERSARY = "EARNED_ANNIVERSARY",
    EARNED_PROMOTION = "EARNED_PROMOTION",
    EARNED_SURVEY = "EARNED_SURVEY",
    EARNED_REVIEW = "EARNED_REVIEW",
    REDEEMED_PRODUCT = "REDEEMED_PRODUCT",
    REDEEMED_DISCOUNT = "REDEEMED_DISCOUNT",
    REDEEMED_GIFT_CARD = "REDEEMED_GIFT_CARD",
    TRANSFERRED_OUT = "TRANSFERRED_OUT",
    TRANSFERRED_IN = "TRANSFERRED_IN",
    EXPIRED = "EXPIRED",
    ADJUSTED = "ADJUSTED",
    REVERSED = "REVERSED"
}
/**
 * Redemption types
 */
export declare enum RedemptionType {
    PRODUCT = "PRODUCT",
    DISCOUNT = "DISCOUNT",
    GIFT_CARD = "GIFT_CARD",
    SHIPPING = "SHIPPING",
    DONATION = "DONATION",
    EXPERIENCE = "EXPERIENCE"
}
/**
 * Promotion types
 */
export declare enum PromotionType {
    DOUBLE_POINTS = "DOUBLE_POINTS",
    TRIPLE_POINTS = "TRIPLE_POINTS",
    BONUS_POINTS = "BONUS_POINTS",
    CATEGORY_MULTIPLIER = "CATEGORY_MULTIPLIER",
    THRESHOLD_BONUS = "THRESHOLD_BONUS",
    FIRST_PURCHASE = "FIRST_PURCHASE"
}
/**
 * Tier benefit types
 */
export declare enum BenefitType {
    POINTS_MULTIPLIER = "POINTS_MULTIPLIER",
    EXCLUSIVE_DISCOUNT = "EXCLUSIVE_DISCOUNT",
    FREE_SHIPPING = "FREE_SHIPPING",
    EARLY_ACCESS = "EARLY_ACCESS",
    DEDICATED_SUPPORT = "DEDICATED_SUPPORT",
    GIFT = "GIFT",
    EXTENDED_RETURNS = "EXTENDED_RETURNS",
    CONCIERGE_SERVICE = "CONCIERGE_SERVICE"
}
/**
 * Points expiration policy
 */
export declare enum ExpirationPolicy {
    FIXED_DURATION = "FIXED_DURATION",
    ROLLING_WINDOW = "ROLLING_WINDOW",
    END_OF_YEAR = "END_OF_YEAR",
    ACTIVITY_BASED = "ACTIVITY_BASED",
    NEVER_EXPIRE = "NEVER_EXPIRE"
}
/**
 * Loyalty member profile
 */
export interface LoyaltyMember {
    memberId: string;
    customerId: string;
    memberNumber: string;
    enrollmentDate: Date;
    tier: LoyaltyTier;
    status: MemberStatus;
    pointsBalance: number;
    lifetimePoints: number;
    tierQualifyingPoints: number;
    nextTierPoints?: number;
    tierStartDate: Date;
    tierExpiryDate?: Date;
    lastActivityDate?: Date;
    email: string;
    phone?: string;
    dateOfBirth?: Date;
    anniversaryDate?: Date;
    preferences?: Record<string, unknown>;
}
/**
 * Points transaction record
 */
export interface PointsTransaction {
    transactionId: string;
    memberId: string;
    transactionType: PointsTransactionType;
    points: number;
    balanceAfter: number;
    orderId?: string;
    promotionId?: string;
    referralId?: string;
    expirationDate?: Date;
    description: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}
/**
 * Redemption catalog item
 */
export interface RedemptionItem {
    itemId: string;
    itemCode: string;
    name: string;
    description: string;
    redemptionType: RedemptionType;
    pointsCost: number;
    cashValue?: number;
    stockQuantity?: number;
    imageUrl?: string;
    category: string;
    isActive: boolean;
    tierRestrictions?: LoyaltyTier[];
    expiryDate?: Date;
    termsAndConditions?: string;
}
/**
 * Tier configuration
 */
export interface TierConfiguration {
    tier: LoyaltyTier;
    minPoints: number;
    maxPoints?: number;
    pointsMultiplier: number;
    benefits: TierBenefit[];
    welcomeBonus?: number;
    monthlyBonus?: number;
    birthdayBonus?: number;
    anniversaryBonus?: number;
    expirationMonths?: number;
}
/**
 * Tier benefit definition
 */
export interface TierBenefit {
    benefitId: string;
    benefitType: BenefitType;
    name: string;
    description: string;
    value?: number;
    startDate?: Date;
    endDate?: Date;
    isActive: boolean;
}
/**
 * Promotion configuration
 */
export interface PromotionConfig {
    promotionId: string;
    name: string;
    promotionType: PromotionType;
    multiplier?: number;
    bonusPoints?: number;
    thresholdAmount?: number;
    categoryIds?: string[];
    productIds?: string[];
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    eligibleTiers?: LoyaltyTier[];
    maxUsesPerMember?: number;
}
/**
 * Referral program details
 */
export interface ReferralProgram {
    referralId: string;
    referrerId: string;
    refereeId?: string;
    referralCode: string;
    referrerPoints: number;
    refereePoints: number;
    status: 'PENDING' | 'COMPLETED' | 'EXPIRED';
    referralDate: Date;
    completionDate?: Date;
    expiryDate: Date;
}
/**
 * DTO for loyalty member enrollment
 */
export declare class EnrollMemberDto {
    customerId: string;
    email: string;
    phone?: string;
    dateOfBirth?: Date;
    enrollmentSource?: string;
    initialBonus?: number;
}
/**
 * DTO for earning points
 */
export declare class EarnPointsDto {
    memberId: string;
    transactionType: PointsTransactionType;
    points: number;
    orderId?: string;
    promotionId?: string;
    description?: string;
    expirationDate?: Date;
}
/**
 * DTO for redeeming points
 */
export declare class RedeemPointsDto {
    memberId: string;
    itemId: string;
    quantity: number;
    shippingAddress?: string;
}
/**
 * DTO for points transfer
 */
export declare class TransferPointsDto {
    fromMemberId: string;
    toMemberId: string;
    points: number;
    note?: string;
}
/**
 * DTO for tier upgrade
 */
export declare class TierUpgradeDto {
    memberId: string;
    newTier: LoyaltyTier;
    reason?: string;
    manualOverride?: boolean;
}
/**
 * 1. Service for enrolling new loyalty members
 */
export declare class LoyaltyEnrollmentService {
    private readonly logger;
    enrollMember(dto: EnrollMemberDto): Promise<LoyaltyMember>;
    private generateMemberId;
    private generateMemberNumber;
    private findMemberByCustomerId;
    private recordPointsTransaction;
}
/**
 * 2. Service for validating enrollment eligibility
 */
export declare class EnrollmentEligibilityService {
    private readonly logger;
    validateEnrollmentEligibility(customerId: string, email: string): Promise<{
        eligible: boolean;
        reasons: string[];
    }>;
    private checkExistingMembership;
    private isCustomerActive;
    private isBlacklisted;
    private checkMinimumPurchaseHistory;
}
/**
 * 3. Service for bulk member enrollment
 */
export declare class BulkEnrollmentService {
    private readonly logger;
    bulkEnrollMembers(enrollments: EnrollMemberDto[]): Promise<{
        successful: number;
        failed: number;
        errors: any[];
    }>;
    private enrollSingleMember;
}
/**
 * 4. Service for enrollment channel tracking
 */
export declare class EnrollmentChannelService {
    private readonly logger;
    trackEnrollmentSource(memberId: string, source: string, metadata?: Record<string, unknown>): Promise<void>;
    getEnrollmentSourceAnalytics(startDate: Date, endDate: Date): Promise<Record<string, number>>;
    private saveChannelData;
}
/**
 * 5. Service for calculating points earned from purchases
 */
export declare class PointsEarningCalculator {
    private readonly logger;
    calculatePurchasePoints(memberId: string, purchaseAmount: number, categoryId?: string, productIds?: string[]): Promise<{
        basePoints: number;
        bonusPoints: number;
        totalPoints: number;
        appliedPromotions: string[];
    }>;
    private calculatePromotionBonus;
    private getMember;
    private getTierConfiguration;
    private getActivePromotions;
}
/**
 * 6. Service for recording points transactions
 */
export declare class PointsTransactionService {
    private readonly logger;
    recordEarnTransaction(dto: EarnPointsDto): Promise<PointsTransaction>;
    private generateTransactionId;
    private calculateExpirationDate;
    private getDefaultDescription;
    private getMember;
    private updateMemberBalance;
}
/**
 * 7. Service for points adjustment and corrections
 */
export declare class PointsAdjustmentService {
    private readonly logger;
    adjustPoints(memberId: string, points: number, reason: string, authorizedBy: string): Promise<PointsTransaction>;
    reverseTransaction(transactionId: string, reason: string): Promise<PointsTransaction>;
    private getMember;
    private getTransaction;
    private saveTransaction;
}
/**
 * 8. Service for points earning rate management
 */
export declare class EarningRateService {
    private readonly logger;
    getEarningRate(tier: LoyaltyTier, categoryId?: string): Promise<number>;
    updateEarningRate(tier: LoyaltyTier, newRate: number): Promise<void>;
    private getCategoryBonus;
    private saveEarningRate;
}
/**
 * 9. Service for points forecasting
 */
export declare class PointsForecastService {
    private readonly logger;
    forecastPointsEarning(memberId: string, projectedSpend: number, months: number): Promise<{
        monthlyPoints: number[];
        totalPoints: number;
        projectedTier: LoyaltyTier;
    }>;
    private getMember;
    private getEarningRate;
    private determineTier;
}
/**
 * 10. Service for points redemption processing
 */
export declare class PointsRedemptionService {
    private readonly logger;
    redeemPoints(dto: RedeemPointsDto): Promise<{
        success: boolean;
        redemptionId: string;
        pointsDeducted: number;
    }>;
    private generateRedemptionId;
    private getMember;
    private getRedemptionItem;
    private deductPoints;
    private createRedemptionOrder;
}
/**
 * 11. Service for redemption validation
 */
export declare class RedemptionValidationService {
    private readonly logger;
    validateRedemption(memberId: string, itemId: string, quantity: number): Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    private getMember;
    private getRedemptionItem;
    private getExpiringPoints;
}
/**
 * 12. Service for redemption history tracking
 */
export declare class RedemptionHistoryService {
    private readonly logger;
    getRedemptionHistory(memberId: string, limit?: number, offset?: number): Promise<{
        redemptions: any[];
        total: number;
    }>;
    getRedemptionDetails(redemptionId: string): Promise<any>;
    cancelRedemption(redemptionId: string, reason: string): Promise<void>;
    private fetchRedemptions;
    private countRedemptions;
    private findRedemption;
    private refundPoints;
    private updateRedemptionStatus;
}
/**
 * 13. Service for redemption recommendation engine
 */
export declare class RedemptionRecommendationService {
    private readonly logger;
    getPersonalizedRecommendations(memberId: string, limit?: number): Promise<RedemptionItem[]>;
    getBestValueRedemptions(memberId: string, maxPoints?: number): Promise<RedemptionItem[]>;
    private getMember;
    private getPurchaseHistory;
    private getRedemptionHistory;
    private calculateRecommendations;
    private getAllRedemptionItems;
}
/**
 * 14. Service for partial redemption support
 */
export declare class PartialRedemptionService {
    private readonly logger;
    redeemPartialPoints(memberId: string, orderId: string, pointsToRedeem: number): Promise<{
        discountAmount: number;
        pointsUsed: number;
        remainingBalance: number;
    }>;
    private getMember;
    private deductPoints;
}
/**
 * 15. Service for tier qualification and upgrade
 */
export declare class TierManagementService {
    private readonly logger;
    evaluateTierQualification(memberId: string): Promise<{
        currentTier: LoyaltyTier;
        qualifiedTier: LoyaltyTier;
        upgradeAvailable: boolean;
        pointsToNextTier?: number;
    }>;
    upgradeMemberTier(dto: TierUpgradeDto): Promise<{
        success: boolean;
        newTier: LoyaltyTier;
        benefits: TierBenefit[];
    }>;
    private determineQualifiedTier;
    private compareTiers;
    private calculatePointsToNextTier;
    private getNextTier;
    private getMember;
    private getAllTierConfigurations;
    private getTierConfiguration;
    private updateMemberTier;
    private awardWelcomeBonus;
}
/**
 * 16. Service for tier downgrade handling
 */
export declare class TierDowngradeService {
    private readonly logger;
    evaluateTierDowngrade(memberId: string): Promise<{
        downgradePending: boolean;
        effectiveDate?: Date;
        reason?: string;
    }>;
    processTierDowngrade(memberId: string, newTier: LoyaltyTier, reason: string): Promise<void>;
    private getMember;
    private getTierConfiguration;
    private updateMemberTier;
    private notifyMemberOfDowngrade;
}
/**
 * 17. Service for tier status tracking
 */
export declare class TierStatusService {
    private readonly logger;
    getTierProgress(memberId: string): Promise<{
        currentTier: LoyaltyTier;
        currentPoints: number;
        nextTier?: LoyaltyTier;
        nextTierMinPoints?: number;
        progressPercentage: number;
        pointsNeeded?: number;
    }>;
    private getMember;
    private getAllTierConfigurations;
    private getNextTier;
}
/**
 * 18. Service for tier anniversary date tracking
 */
export declare class TierAnniversaryService {
    private readonly logger;
    calculateTierAnniversary(memberId: string): Promise<{
        anniversaryDate: Date;
        yearsInTier: number;
        nextAnniversary: Date;
    }>;
    processTierAnniversaryRewards(memberId: string): Promise<{
        bonusAwarded: number;
        description: string;
    }>;
    private getMember;
    private getTierConfiguration;
    private awardAnniversaryBonus;
}
/**
 * 19. Service for tier recertification
 */
export declare class TierRecertificationService {
    private readonly logger;
    recertifyTier(memberId: string): Promise<{
        certified: boolean;
        maintainedTier: LoyaltyTier;
        action: string;
    }>;
    private getMember;
    private getTierConfiguration;
    private getQualifyingPointsLastYear;
    private resetQualifyingPoints;
    private initiateTierDowngrade;
}
/**
 * 20. Service for tier benefit management
 */
export declare class TierBenefitService {
    private readonly logger;
    getTierBenefits(tier: LoyaltyTier): Promise<TierBenefit[]>;
    getMemberBenefits(memberId: string): Promise<{
        tier: LoyaltyTier;
        benefits: TierBenefit[];
        activeBenefits: TierBenefit[];
    }>;
    applyBenefit(memberId: string, benefitId: string, orderId?: string): Promise<{
        applied: boolean;
        value: number;
        description: string;
    }>;
    private getTierConfiguration;
    private getMember;
    private calculateBenefitValue;
    private recordBenefitUsage;
}
/**
 * 21. Service for exclusive access management
 */
export declare class ExclusiveAccessService {
    private readonly logger;
    checkExclusiveAccess(memberId: string, resourceId: string): Promise<{
        hasAccess: boolean;
        tier: LoyaltyTier;
        reason?: string;
    }>;
    grantEarlyAccess(memberId: string, productId: string): Promise<{
        accessGranted: boolean;
        accessStartDate: Date;
        accessEndDate: Date;
    }>;
    private getMember;
    private getExclusiveResource;
    private getTierLevel;
    private recordEarlyAccess;
}
/**
 * 22. Service for personalized offers
 */
export declare class PersonalizedOfferService {
    private readonly logger;
    generatePersonalizedOffers(memberId: string): Promise<any[]>;
    private getMember;
    private getPurchaseHistory;
    private getFutureDate;
}
/**
 * 23. Service for concierge services
 */
export declare class ConciergeService {
    private readonly logger;
    requestConciergeService(memberId: string, serviceType: string, details: string): Promise<{
        requestId: string;
        status: string;
        estimatedResponse: Date;
    }>;
    private getMember;
    private createConciergeRequest;
}
/**
 * 24. Service for points expiration management
 */
export declare class PointsExpirationService {
    private readonly logger;
    getExpiringPoints(memberId: string, daysThreshold?: number): Promise<{
        expiringPoints: number;
        expirationDate: Date;
        transactions: any[];
    }>;
    processPointsExpiration(): Promise<{
        membersProcessed: number;
        pointsExpired: number;
    }>;
    extendPointsExpiration(memberId: string, transactionId: string, extensionDays: number): Promise<{
        success: boolean;
        newExpirationDate: Date;
    }>;
    private findExpiringTransactions;
    private findExpiredTransactions;
    private expireTransaction;
    private getTransaction;
    private updateTransactionExpiration;
}
/**
 * 25. Service for expiration notifications
 */
export declare class ExpirationNotificationService {
    private readonly logger;
    sendExpirationReminders(): Promise<{
        notificationsSent: number;
    }>;
    notifyMemberOfExpiration(memberId: string, pointsExpired: number): Promise<void>;
    private findMembersWithExpiringPoints;
    private sendExpirationNotification;
    private sendNotification;
}
/**
 * 26. Service for expiration policy configuration
 */
export declare class ExpirationPolicyService {
    private readonly logger;
    getExpirationPolicy(tier: LoyaltyTier): Promise<{
        policy: ExpirationPolicy;
        expirationMonths: number;
        details: string;
    }>;
    updateExpirationPolicy(tier: LoyaltyTier, policy: ExpirationPolicy, months: number): Promise<void>;
    private saveExpirationPolicy;
}
/**
 * 27. Service for expiration prevention
 */
export declare class ExpirationPreventionService {
    private readonly logger;
    preventExpirationWithActivity(memberId: string): Promise<{
        pointsPreserved: number;
        newExpirationDate: Date;
    }>;
    private getExpiringPoints;
    private extendAllExpiringPoints;
}
/**
 * 28. Service for promotion management
 */
export declare class PromotionManagementService {
    private readonly logger;
    createPromotion(config: PromotionConfig): Promise<PromotionConfig>;
    getActivePromotions(tier?: LoyaltyTier): Promise<PromotionConfig[]>;
    deactivatePromotion(promotionId: string): Promise<void>;
    private savePromotion;
    private getAllPromotions;
    private updatePromotionStatus;
}
/**
 * 29. Service for promotion application
 */
export declare class PromotionApplicationService {
    private readonly logger;
    applyPromotionToTransaction(memberId: string, orderId: string, basePoints: number, categoryId?: string): Promise<{
        bonusPoints: number;
        appliedPromotions: string[];
    }>;
    private getMember;
    private getEligiblePromotions;
    private checkPromotionEligibility;
    private calculatePromotionBonus;
    private getPromotionUsageCount;
    private recordPromotionUsage;
}
/**
 * 30. Service for seasonal promotions
 */
export declare class SeasonalPromotionService {
    private readonly logger;
    createSeasonalPromotion(season: string, multiplier: number, durationDays: number): Promise<PromotionConfig>;
    private savePromotion;
}
/**
 * 31. Service for first purchase bonus
 */
export declare class FirstPurchaseBonusService {
    private readonly logger;
    awardFirstPurchaseBonus(memberId: string, orderId: string): Promise<{
        bonusAwarded: number;
        description: string;
    }>;
    private checkIfFirstPurchase;
    private awardBonus;
}
/**
 * 32. Service for referral program management
 */
export declare class ReferralProgramService {
    private readonly logger;
    generateReferralCode(memberId: string): Promise<{
        referralCode: string;
        referralUrl: string;
    }>;
    processReferral(referralCode: string, newMemberId: string): Promise<ReferralProgram>;
    completeReferral(referralId: string): Promise<{
        referrerPoints: number;
        refereePoints: number;
    }>;
    private createReferralCode;
    private getMember;
    private saveReferralCode;
    private getReferrerByCode;
    private saveReferral;
    private getReferral;
    private awardPoints;
    private updateReferralStatus;
    private getFutureDate;
}
/**
 * 33. Service for referral tracking
 */
export declare class ReferralTrackingService {
    private readonly logger;
    getReferralStats(memberId: string): Promise<{
        totalReferrals: number;
        completedReferrals: number;
        pendingReferrals: number;
        totalPointsEarned: number;
    }>;
    private getMemberReferrals;
}
/**
 * 34. Service for referral leaderboard
 */
export declare class ReferralLeaderboardService {
    private readonly logger;
    getTopReferrers(limit?: number, period?: 'month' | 'year' | 'all'): Promise<any[]>;
    private calculateLeaderboard;
}
/**
 * 35. Service for birthday rewards
 */
export declare class BirthdayRewardService {
    private readonly logger;
    processBirthdayRewards(): Promise<{
        membersRewarded: number;
        totalPointsAwarded: number;
    }>;
    awardBirthdayBonus(member: LoyaltyMember): Promise<number>;
    private findBirthdayMembers;
    private getTierConfiguration;
    private recordBirthdayReward;
}
/**
 * 36. Service for anniversary rewards
 */
export declare class AnniversaryRewardService {
    private readonly logger;
    processAnniversaryRewards(): Promise<{
        membersRewarded: number;
        totalPointsAwarded: number;
    }>;
    awardAnniversaryBonus(member: LoyaltyMember): Promise<number>;
    private calculateYearsAsMember;
    private findAnniversaryMembers;
    private recordAnniversaryReward;
}
/**
 * 37. Service for points transfer between members
 */
export declare class PointsTransferService {
    private readonly logger;
    transferPoints(dto: TransferPointsDto): Promise<{
        success: boolean;
        transferId: string;
        pointsTransferred: number;
        fromBalance: number;
        toBalance: number;
    }>;
    private getMember;
    private getTransferLimit;
    private deductPoints;
    private addPoints;
    private recordTransfer;
}
/**
 * All loyalty and rewards service providers for easy module import
 */
export declare const LOYALTY_REWARDS_PROVIDERS: (typeof LoyaltyEnrollmentService | typeof EnrollmentEligibilityService | typeof BulkEnrollmentService | typeof EnrollmentChannelService | typeof PointsEarningCalculator | typeof PointsTransactionService | typeof PointsAdjustmentService | typeof EarningRateService | typeof PointsForecastService | typeof PointsRedemptionService | typeof RedemptionValidationService | typeof RedemptionHistoryService | typeof RedemptionRecommendationService | typeof PartialRedemptionService | typeof TierManagementService | typeof TierDowngradeService | typeof TierStatusService | typeof TierAnniversaryService | typeof TierRecertificationService | typeof TierBenefitService | typeof ExclusiveAccessService | typeof PersonalizedOfferService | typeof ConciergeService | typeof PointsExpirationService | typeof ExpirationNotificationService | typeof ExpirationPolicyService | typeof ExpirationPreventionService | typeof PromotionManagementService | typeof PromotionApplicationService | typeof SeasonalPromotionService | typeof FirstPurchaseBonusService | typeof ReferralProgramService | typeof ReferralTrackingService | typeof ReferralLeaderboardService | typeof BirthdayRewardService | typeof AnniversaryRewardService | typeof PointsTransferService)[];
/**
 * Configuration tokens for dependency injection
 */
export declare const LOYALTY_CONFIG = "LOYALTY_CONFIG";
export declare const TIER_CONFIGS = "TIER_CONFIGS";
export declare const CARRIER_CONFIGS = "CARRIER_CONFIGS";
//# sourceMappingURL=loyalty-rewards-kit.d.ts.map