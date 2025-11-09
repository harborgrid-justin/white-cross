/**
 * LOC: ORD-DSC-001
 * File: /reuse/order/discount-promotion-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize-typescript
 *   - class-validator
 *   - class-transformer
 *
 * DOWNSTREAM (imported by):
 *   - Order controllers
 *   - Promotion services
 *   - Discount processors
 *   - Marketing campaign modules
 */
import { Model } from 'sequelize-typescript';
/**
 * Discount types
 */
export declare enum DiscountType {
    PERCENTAGE = "PERCENTAGE",
    FIXED_AMOUNT = "FIXED_AMOUNT",
    BUY_X_GET_Y = "BUY_X_GET_Y",
    VOLUME_DISCOUNT = "VOLUME_DISCOUNT",
    TIERED = "TIERED",
    FREE_SHIPPING = "FREE_SHIPPING",
    BUNDLE = "BUNDLE",
    LOYALTY_POINTS = "LOYALTY_POINTS"
}
/**
 * Promotion types
 */
export declare enum PromotionType {
    COUPON_CODE = "COUPON_CODE",
    AUTOMATIC = "AUTOMATIC",
    CART_RULE = "CART_RULE",
    CATALOG_RULE = "CATALOG_RULE",
    FLASH_SALE = "FLASH_SALE",
    SEASONAL = "SEASONAL",
    CLEARANCE = "CLEARANCE",
    REFERRAL = "REFERRAL"
}
/**
 * Promotion status
 */
export declare enum PromotionStatus {
    DRAFT = "DRAFT",
    SCHEDULED = "SCHEDULED",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED"
}
/**
 * Coupon code patterns
 */
export declare enum CouponCodePattern {
    ALPHANUMERIC = "ALPHANUMERIC",
    NUMERIC = "NUMERIC",
    ALPHABETIC = "ALPHABETIC",
    CUSTOM = "CUSTOM"
}
/**
 * Customer eligibility criteria
 */
export declare enum CustomerEligibility {
    ALL_CUSTOMERS = "ALL_CUSTOMERS",
    NEW_CUSTOMERS = "NEW_CUSTOMERS",
    EXISTING_CUSTOMERS = "EXISTING_CUSTOMERS",
    VIP_TIER = "VIP_TIER",
    LOYALTY_MEMBERS = "LOYALTY_MEMBERS",
    EMAIL_SUBSCRIBERS = "EMAIL_SUBSCRIBERS",
    SPECIFIC_SEGMENTS = "SPECIFIC_SEGMENTS"
}
/**
 * Stacking rule types
 */
export declare enum StackingRuleType {
    NO_STACKING = "NO_STACKING",
    BEST_DISCOUNT = "BEST_DISCOUNT",
    ADDITIVE = "ADDITIVE",
    SEQUENTIAL = "SEQUENTIAL",
    EXCLUSIVE_GROUPS = "EXCLUSIVE_GROUPS"
}
/**
 * Application scope
 */
export declare enum ApplicationScope {
    ORDER_LEVEL = "ORDER_LEVEL",
    LINE_ITEM = "LINE_ITEM",
    SHIPPING = "SHIPPING",
    CATEGORY = "CATEGORY",
    PRODUCT = "PRODUCT"
}
/**
 * Create discount DTO
 */
export declare class CreateDiscountDto {
    name: string;
    description?: string;
    discountType: DiscountType;
    value: number;
    maxDiscountAmount?: number;
    scope: ApplicationScope;
    startDate: string;
    endDate: string;
    minPurchaseAmount?: number;
    minQuantity?: number;
    applicableProductIds?: string[];
    applicableCategoryIds?: string[];
    excludedProductIds?: string[];
    priority: number;
}
/**
 * Create promotion DTO
 */
export declare class CreatePromotionDto {
    name: string;
    internalCode: string;
    promotionType: PromotionType;
    description?: string;
    startDate: string;
    endDate: string;
    customerEligibility: CustomerEligibility;
    customerSegmentIds?: string[];
    usageLimitPerCustomer?: number;
    totalUsageLimit?: number;
    discountIds: string[];
    stackingRule: StackingRuleType;
    requiresCouponCode: boolean;
}
/**
 * Generate coupon codes DTO
 */
export declare class GenerateCouponCodesDto {
    promotionId: string;
    quantity: number;
    pattern: CouponCodePattern;
    prefix?: string;
    codeLength: number;
    usageLimitPerCode?: number;
    expirationDate?: string;
}
/**
 * Validate coupon DTO
 */
export declare class ValidateCouponDto {
    code: string;
    customerId: string;
    cartTotal: number;
    cartItems: CartItemDto[];
}
/**
 * Cart item DTO
 */
export declare class CartItemDto {
    productId: string;
    categoryId?: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
}
/**
 * BOGO configuration DTO
 */
export declare class BogoConfigDto {
    buyQuantity: number;
    getQuantity: number;
    getItemsDiscountPercentage: number;
    sameProductRequired: boolean;
    getProductIds?: string[];
    maxApplications?: number;
}
/**
 * Volume discount tier DTO
 */
export declare class VolumeDiscountTierDto {
    minQuantity: number;
    maxQuantity?: number;
    discountPercentage: number;
    fixedDiscountAmount?: number;
}
/**
 * Tiered promotion DTO
 */
export declare class TieredPromotionDto {
    name: string;
    tiers: VolumeDiscountTierDto[];
    basedOn: 'QUANTITY' | 'AMOUNT';
    applicableProductIds?: string[];
}
/**
 * Apply discount DTO
 */
export declare class ApplyDiscountDto {
    orderId: string;
    discountIds: string[];
    couponCodes?: string[];
    customerId: string;
}
/**
 * Customer segment promotion DTO
 */
export declare class CustomerSegmentPromotionDto {
    segmentName: string;
    criteria: string;
    discountPercentage: number;
    minPurchaseAmount?: number;
    validFrom: string;
    validTo: string;
}
/**
 * Flash sale DTO
 */
export declare class FlashSaleDto {
    name: string;
    productIds: string[];
    discountPercentage: number;
    startTime: string;
    endTime: string;
    stockLimit?: number;
    perCustomerLimit?: number;
}
/**
 * Exclusion rule DTO
 */
export declare class ExclusionRuleDto {
    promotionId: string;
    excludedProductIds?: string[];
    excludedCategoryIds?: string[];
    excludedCustomerIds?: string[];
    excludeSaleItems: boolean;
    excludeClearanceItems: boolean;
}
/**
 * Discount calculation result
 */
export declare class DiscountCalculationResult {
    originalTotal: number;
    discountAmount: number;
    finalTotal: number;
    appliedDiscounts: AppliedDiscountDetail[];
    totalSavings: number;
}
/**
 * Applied discount detail
 */
export declare class AppliedDiscountDetail {
    discountId: string;
    discountName: string;
    amount: number;
    scope: ApplicationScope;
    couponCode?: string;
}
export declare class Discount extends Model {
    id: string;
    name: string;
    description: string;
    discountType: DiscountType;
    value: number;
    maxDiscountAmount: number;
    scope: ApplicationScope;
    startDate: Date;
    endDate: Date;
    minPurchaseAmount: number;
    minQuantity: number;
    applicableProductIds: string[];
    applicableCategoryIds: string[];
    excludedProductIds: string[];
    priority: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
export declare class Promotion extends Model {
    id: string;
    name: string;
    internalCode: string;
    promotionType: PromotionType;
    description: string;
    startDate: Date;
    endDate: Date;
    status: PromotionStatus;
    customerEligibility: CustomerEligibility;
    customerSegmentIds: string[];
    usageLimitPerCustomer: number;
    totalUsageLimit: number;
    totalUsageCount: number;
    discountIds: string[];
    stackingRule: StackingRuleType;
    requiresCouponCode: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
export declare class CouponCode extends Model {
    id: string;
    code: string;
    promotionId: string;
    promotion: Promotion;
    usageLimitPerCode: number;
    usageCount: number;
    expirationDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
export declare class CouponUsage extends Model {
    id: string;
    couponCodeId: string;
    couponCode: CouponCode;
    customerId: string;
    orderId: string;
    discountAmount: number;
    usedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * 1. Generate unique discount code
 */
export declare function generateDiscountCode(pattern: CouponCodePattern, length: number, prefix?: string): string;
/**
 * 2. Validate coupon code format
 */
export declare function validateCouponCodeFormat(code: string): boolean;
/**
 * 3. Check if coupon is valid and active
 */
export declare function isCouponValid(couponCode: CouponCode, customerId: string): Promise<{
    valid: boolean;
    reason?: string;
}>;
/**
 * 4. Calculate percentage discount
 */
export declare function calculatePercentageDiscount(amount: number, percentage: number, maxDiscount?: number): number;
/**
 * 5. Calculate fixed amount discount
 */
export declare function calculateFixedDiscount(amount: number, discountAmount: number): number;
/**
 * 6. Apply BOGO discount
 */
export declare function applyBogoDiscount(items: CartItemDto[], config: BogoConfigDto): {
    discountAmount: number;
    affectedItems: string[];
};
/**
 * 7. Calculate volume discount based on quantity
 */
export declare function calculateVolumeDiscount(quantity: number, unitPrice: number, tiers: VolumeDiscountTierDto[]): {
    discountAmount: number;
    tier: VolumeDiscountTierDto | null;
};
/**
 * 8. Calculate tiered promotion discount
 */
export declare function calculateTieredDiscount(cartTotal: number, totalQuantity: number, promotion: TieredPromotionDto): number;
/**
 * 9. Check minimum purchase requirement
 */
export declare function meetsMinimumPurchase(cartTotal: number, minPurchase?: number): boolean;
/**
 * 10. Check minimum quantity requirement
 */
export declare function meetsMinimumQuantity(totalQuantity: number, minQuantity?: number): boolean;
/**
 * 11. Filter eligible products
 */
export declare function filterEligibleProducts(items: CartItemDto[], applicableProductIds?: string[], excludedProductIds?: string[]): CartItemDto[];
/**
 * 12. Filter eligible categories
 */
export declare function filterEligibleCategories(items: CartItemDto[], applicableCategoryIds?: string[], excludedCategoryIds?: string[]): CartItemDto[];
/**
 * 13. Apply stacking rules - best discount
 */
export declare function applyBestDiscount(discounts: AppliedDiscountDetail[]): AppliedDiscountDetail[];
/**
 * 14. Apply stacking rules - additive
 */
export declare function applyAdditiveDiscounts(discounts: AppliedDiscountDetail[]): AppliedDiscountDetail[];
/**
 * 15. Apply stacking rules - sequential
 */
export declare function applySequentialDiscounts(originalTotal: number, discounts: AppliedDiscountDetail[]): {
    discounts: AppliedDiscountDetail[];
    finalTotal: number;
};
/**
 * 16. Check if promotion is currently active
 */
export declare function isPromotionActive(promotion: Promotion): boolean;
/**
 * 17. Check customer eligibility
 */
export declare function isCustomerEligible(customerId: string, promotion: Promotion, customerSegmentIds?: string[]): Promise<boolean>;
/**
 * 18. Calculate total discount for cart
 */
export declare function calculateCartDiscount(cartItems: CartItemDto[], discounts: Discount[], stackingRule: StackingRuleType): DiscountCalculationResult;
/**
 * 19. Validate exclusion rules
 */
export declare function validateExclusionRules(items: CartItemDto[], exclusionRule: ExclusionRuleDto): {
    valid: boolean;
    excludedItems: string[];
};
/**
 * 20. Generate bulk coupon codes
 */
export declare function generateBulkCoupons(dto: GenerateCouponCodesDto): Promise<CouponCode[]>;
/**
 * 21. Validate and apply coupon code
 */
export declare function validateAndApplyCoupon(dto: ValidateCouponDto): Promise<{
    valid: boolean;
    discount?: AppliedDiscountDetail;
    reason?: string;
}>;
/**
 * 22. Record coupon usage
 */
export declare function recordCouponUsage(couponCodeId: string, customerId: string, orderId: string, discountAmount: number): Promise<CouponUsage>;
/**
 * 23. Create flash sale promotion
 */
export declare function createFlashSale(dto: FlashSaleDto): Promise<Promotion>;
/**
 * 24. Get active promotions for customer
 */
export declare function getActivePromotionsForCustomer(customerId: string, customerSegmentIds?: string[]): Promise<Promotion[]>;
/**
 * 25. Calculate loyalty points discount
 */
export declare function calculateLoyaltyPointsDiscount(points: number, pointValue: number, maxRedemption?: number): number;
/**
 * 26. Apply referral bonus
 */
export declare function applyReferralBonus(referrerId: string, refereeId: string, bonusAmount: number): Promise<{
    referrerDiscount: number;
    refereeDiscount: number;
}>;
/**
 * 27. Calculate bundle discount
 */
export declare function calculateBundleDiscount(bundleItems: CartItemDto[], requiredProductIds: string[], bundleDiscount: number): {
    applicable: boolean;
    discountAmount: number;
};
/**
 * 28. Check promotion usage limits
 */
export declare function checkPromotionUsageLimits(promotionId: string, customerId: string): Promise<{
    canUse: boolean;
    reason?: string;
}>;
/**
 * 29. Calculate seasonal promotion discount
 */
export declare function calculateSeasonalDiscount(cartTotal: number, seasonalRate: number, seasonStart: Date, seasonEnd: Date): {
    applicable: boolean;
    discountAmount: number;
};
/**
 * 30. Apply first-time customer discount
 */
export declare function applyFirstTimeCustomerDiscount(customerId: string, discountPercentage: number, cartTotal: number): Promise<{
    applicable: boolean;
    discountAmount: number;
}>;
/**
 * 31. Calculate category-specific promotion
 */
export declare function calculateCategoryPromotion(items: CartItemDto[], categoryId: string, discountPercentage: number): number;
/**
 * 32. Apply early bird discount
 */
export declare function applyEarlyBirdDiscount(orderTime: Date, cutoffTime: Date, discountPercentage: number, cartTotal: number): {
    applicable: boolean;
    discountAmount: number;
};
/**
 * 33. Calculate cart abandonment recovery discount
 */
export declare function calculateAbandonmentDiscount(abandonedCartAge: number, baseDiscount: number, maxDiscount: number, cartTotal: number): number;
/**
 * 34. Validate time-limited promotion
 */
export declare function validateTimeLimitedPromotion(promotion: Promotion, currentTime?: Date): {
    valid: boolean;
    reason?: string;
};
/**
 * 35. Calculate multi-buy discount (e.g., 3 for $10)
 */
export declare function calculateMultiBuyDiscount(quantity: number, unitPrice: number, buyQuantity: number, bundlePrice: number): number;
/**
 * 36. Apply spend threshold bonus
 */
export declare function applySpendThresholdBonus(cartTotal: number, thresholds: {
    amount: number;
    bonus: number;
}[]): {
    applicable: boolean;
    bonusAmount: number;
};
/**
 * 37. Calculate cross-sell promotion discount
 */
export declare function calculateCrossSellDiscount(items: CartItemDto[], primaryProductId: string, crossSellProductIds: string[], discountPercentage: number): {
    applicable: boolean;
    discountAmount: number;
};
/**
 * 38. Deactivate expired promotions
 */
export declare function deactivateExpiredPromotions(): Promise<number>;
/**
 * 39. Activate scheduled promotions
 */
export declare function activateScheduledPromotions(): Promise<number>;
/**
 * 40. Generate promotion performance report
 */
export declare function generatePromotionPerformanceReport(promotionId: string, startDate?: Date, endDate?: Date): Promise<{
    totalUsage: number;
    totalRevenue: number;
    totalDiscount: number;
    uniqueCustomers: number;
    averageOrderValue: number;
    conversionRate: number;
}>;
declare const _default: {
    Discount: typeof Discount;
    Promotion: typeof Promotion;
    CouponCode: typeof CouponCode;
    CouponUsage: typeof CouponUsage;
    CreateDiscountDto: typeof CreateDiscountDto;
    CreatePromotionDto: typeof CreatePromotionDto;
    GenerateCouponCodesDto: typeof GenerateCouponCodesDto;
    ValidateCouponDto: typeof ValidateCouponDto;
    CartItemDto: typeof CartItemDto;
    BogoConfigDto: typeof BogoConfigDto;
    VolumeDiscountTierDto: typeof VolumeDiscountTierDto;
    TieredPromotionDto: typeof TieredPromotionDto;
    ApplyDiscountDto: typeof ApplyDiscountDto;
    CustomerSegmentPromotionDto: typeof CustomerSegmentPromotionDto;
    FlashSaleDto: typeof FlashSaleDto;
    ExclusionRuleDto: typeof ExclusionRuleDto;
    DiscountCalculationResult: typeof DiscountCalculationResult;
    AppliedDiscountDetail: typeof AppliedDiscountDetail;
    DiscountType: typeof DiscountType;
    PromotionType: typeof PromotionType;
    PromotionStatus: typeof PromotionStatus;
    CouponCodePattern: typeof CouponCodePattern;
    CustomerEligibility: typeof CustomerEligibility;
    StackingRuleType: typeof StackingRuleType;
    ApplicationScope: typeof ApplicationScope;
    generateDiscountCode: typeof generateDiscountCode;
    validateCouponCodeFormat: typeof validateCouponCodeFormat;
    isCouponValid: typeof isCouponValid;
    calculatePercentageDiscount: typeof calculatePercentageDiscount;
    calculateFixedDiscount: typeof calculateFixedDiscount;
    applyBogoDiscount: typeof applyBogoDiscount;
    calculateVolumeDiscount: typeof calculateVolumeDiscount;
    calculateTieredDiscount: typeof calculateTieredDiscount;
    meetsMinimumPurchase: typeof meetsMinimumPurchase;
    meetsMinimumQuantity: typeof meetsMinimumQuantity;
    filterEligibleProducts: typeof filterEligibleProducts;
    filterEligibleCategories: typeof filterEligibleCategories;
    applyBestDiscount: typeof applyBestDiscount;
    applyAdditiveDiscounts: typeof applyAdditiveDiscounts;
    applySequentialDiscounts: typeof applySequentialDiscounts;
    isPromotionActive: typeof isPromotionActive;
    isCustomerEligible: typeof isCustomerEligible;
    calculateCartDiscount: typeof calculateCartDiscount;
    validateExclusionRules: typeof validateExclusionRules;
    generateBulkCoupons: typeof generateBulkCoupons;
    validateAndApplyCoupon: typeof validateAndApplyCoupon;
    recordCouponUsage: typeof recordCouponUsage;
    createFlashSale: typeof createFlashSale;
    getActivePromotionsForCustomer: typeof getActivePromotionsForCustomer;
    calculateLoyaltyPointsDiscount: typeof calculateLoyaltyPointsDiscount;
    applyReferralBonus: typeof applyReferralBonus;
    calculateBundleDiscount: typeof calculateBundleDiscount;
    checkPromotionUsageLimits: typeof checkPromotionUsageLimits;
    calculateSeasonalDiscount: typeof calculateSeasonalDiscount;
    applyFirstTimeCustomerDiscount: typeof applyFirstTimeCustomerDiscount;
    calculateCategoryPromotion: typeof calculateCategoryPromotion;
    applyEarlyBirdDiscount: typeof applyEarlyBirdDiscount;
    calculateAbandonmentDiscount: typeof calculateAbandonmentDiscount;
    validateTimeLimitedPromotion: typeof validateTimeLimitedPromotion;
    calculateMultiBuyDiscount: typeof calculateMultiBuyDiscount;
    applySpendThresholdBonus: typeof applySpendThresholdBonus;
    calculateCrossSellDiscount: typeof calculateCrossSellDiscount;
    deactivateExpiredPromotions: typeof deactivateExpiredPromotions;
    activateScheduledPromotions: typeof activateScheduledPromotions;
    generatePromotionPerformanceReport: typeof generatePromotionPerformanceReport;
};
export default _default;
//# sourceMappingURL=discount-promotion-kit.d.ts.map