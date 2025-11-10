/**
 * LOC: ORD-CRTWSH-001
 * File: /reuse/order/saved-carts-wishlists-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Order controllers
 *   - Shopping cart services
 *   - Customer portal services
 */
import { Model } from 'sequelize-typescript';
/**
 * Saved cart types
 */
export declare enum SavedCartType {
    ACTIVE = "ACTIVE",
    SAVED_FOR_LATER = "SAVED_FOR_LATER",
    ABANDONED = "ABANDONED",
    GUEST = "GUEST",
    MERGED = "MERGED",
    EXPIRED = "EXPIRED",
    TEMPLATE = "TEMPLATE"
}
/**
 * Wishlist visibility levels
 */
export declare enum WishlistVisibility {
    PRIVATE = "PRIVATE",
    SHARED_LINK = "SHARED_LINK",
    PUBLIC = "PUBLIC",
    FRIENDS_ONLY = "FRIENDS_ONLY",
    FAMILY_ONLY = "FAMILY_ONLY"
}
/**
 * Wishlist notification types
 */
export declare enum WishlistNotificationType {
    PRICE_DROP = "PRICE_DROP",
    BACK_IN_STOCK = "BACK_IN_STOCK",
    LOW_STOCK = "LOW_STOCK",
    SALE_ALERT = "SALE_ALERT",
    WISHLIST_SHARED = "WISHLIST_SHARED",
    ITEM_ADDED = "ITEM_ADDED",
    ITEM_PURCHASED = "ITEM_PURCHASED"
}
/**
 * Cart expiration actions
 */
export declare enum CartExpirationAction {
    ARCHIVE = "ARCHIVE",
    DELETE = "DELETE",
    EXTEND = "EXTEND",
    NOTIFY_BEFORE_EXPIRY = "NOTIFY_BEFORE_EXPIRY"
}
/**
 * Wishlist event types for analytics
 */
export declare enum WishlistEventType {
    CREATED = "CREATED",
    ITEM_ADDED = "ITEM_ADDED",
    ITEM_REMOVED = "ITEM_REMOVED",
    SHARED = "SHARED",
    VIEWED = "VIEWED",
    ITEM_PURCHASED = "ITEM_PURCHASED",
    CONVERTED_TO_CART = "CONVERTED_TO_CART"
}
/**
 * Item priority in wishlist
 */
export declare enum WishlistItemPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    MUST_HAVE = "MUST_HAVE"
}
/**
 * Cart merge strategy for logged-in users
 */
export declare enum CartMergeStrategy {
    COMBINE_ALL = "COMBINE_ALL",
    KEEP_LATEST = "KEEP_LATEST",
    KEEP_GUEST = "KEEP_GUEST",
    KEEP_USER = "KEEP_USER",
    PROMPT_USER = "PROMPT_USER"
}
/**
 * Saved cart item details
 */
export interface SavedCartItemDetails {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    imageUrl?: string;
    attributes?: Record<string, any>;
    availabilityStatus?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK' | 'DISCONTINUED';
    savedAt: Date;
}
/**
 * Wishlist item details
 */
export interface WishlistItemDetails {
    productId: string;
    productName: string;
    sku: string;
    desiredQuantity: number;
    currentPrice: number;
    priceAtAddition: number;
    imageUrl?: string;
    attributes?: Record<string, any>;
    priority: WishlistItemPriority;
    notes?: string;
    addedAt: Date;
}
/**
 * Cart expiration settings
 */
export interface CartExpirationSettings {
    expirationDays: number;
    warningDays: number;
    action: CartExpirationAction;
    sendNotification: boolean;
    autoExtendOnActivity: boolean;
}
/**
 * Wishlist sharing settings
 */
export interface WishlistSharingSettings {
    allowPurchaseTracking: boolean;
    showPrices: boolean;
    allowComments: boolean;
    requirePassword?: boolean;
    passwordHash?: string;
    expiresAt?: Date;
}
/**
 * Cart analytics data
 */
export interface CartAnalytics {
    totalValue: number;
    itemCount: number;
    averageItemPrice: number;
    lastModified: Date;
    daysSinceCreation: number;
    daysSinceLastModified: number;
    estimatedConversionProbability?: number;
}
/**
 * Wishlist analytics data
 */
export interface WishlistAnalytics {
    totalValue: number;
    itemCount: number;
    averageItemPrice: number;
    priceDropCount: number;
    totalSavings: number;
    conversionRate: number;
    sharingMetrics: {
        shareCount: number;
        viewCount: number;
        uniqueViewers: number;
    };
}
/**
 * DTO for saving cart
 */
export declare class SaveCartDto {
    cartName: string;
    description?: string;
    customerId?: string;
    sessionId?: string;
    items: SavedCartItemDetails[];
    isDefault?: boolean;
}
/**
 * DTO for creating wishlist
 */
export declare class CreateWishlistDto {
    name: string;
    description?: string;
    customerId: string;
    visibility: WishlistVisibility;
    sharingSettings?: WishlistSharingSettings;
    occasion?: string;
    eventDate?: Date;
}
/**
 * DTO for adding item to wishlist
 */
export declare class AddToWishlistDto {
    wishlistId: string;
    productId: string;
    quantity: number;
    priority: WishlistItemPriority;
    notes?: string;
    attributes?: Record<string, any>;
}
/**
 * DTO for cart merge operation
 */
export declare class MergeCartsDto {
    guestCartId: string;
    userCartId: string;
    strategy: CartMergeStrategy;
    autoResolveConflicts?: boolean;
}
/**
 * DTO for wishlist notification subscription
 */
export declare class WishlistNotificationDto {
    wishlistId: string;
    notificationTypes: WishlistNotificationType[];
    priceDropThreshold?: number;
    emailEnabled?: boolean;
    smsEnabled?: boolean;
    pushEnabled?: boolean;
}
/**
 * SavedCart model for cart persistence
 */
export declare class SavedCart extends Model {
    id: string;
    cartName: string;
    description: string;
    customerId: string;
    sessionId: string;
    cartType: SavedCartType;
    items: SavedCartItemDetails[];
    totalValue: number;
    itemCount: number;
    isDefault: boolean;
    expiresAt: Date;
    expirationSettings: CartExpirationSettings;
    lastAccessedAt: Date;
    mergedFromCartIds: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Wishlist model
 */
export declare class Wishlist extends Model {
    id: string;
    name: string;
    description: string;
    customerId: string;
    visibility: WishlistVisibility;
    shareToken: string;
    sharingSettings: WishlistSharingSettings;
    occasion: string;
    eventDate: Date;
    totalValue: number;
    itemCount: number;
    viewCount: number;
    shareCount: number;
    lastViewedAt: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * WishlistItem model
 */
export declare class WishlistItem extends Model {
    id: string;
    wishlistId: string;
    wishlist: Wishlist;
    productId: string;
    productDetails: WishlistItemDetails;
    quantity: number;
    priority: WishlistItemPriority;
    currentPrice: number;
    priceAtAddition: number;
    lowestPrice: number;
    notes: string;
    isPurchased: boolean;
    purchasedAt: Date;
    purchasedBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * WishlistNotificationSubscription model
 */
export declare class WishlistNotificationSubscription extends Model {
    id: string;
    wishlistId: string;
    wishlist: Wishlist;
    customerId: string;
    notificationTypes: WishlistNotificationType[];
    priceDropThreshold: number;
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * WishlistEvent model for analytics
 */
export declare class WishlistEvent extends Model {
    id: string;
    wishlistId: string;
    wishlist: Wishlist;
    eventType: WishlistEventType;
    customerId: string;
    productId: string;
    eventData: Record<string, any>;
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
}
/**
 * Save current cart for later
 *
 * @param cartData - Cart data to save
 * @returns Saved cart record
 */
export declare function saveCartForLater(cartData: SaveCartDto): Promise<SavedCart>;
/**
 * Restore saved cart to active cart
 *
 * @param cartId - Saved cart ID
 * @param customerId - Customer ID
 * @returns Restored cart with updated items
 */
export declare function restoreSavedCart(cartId: string, customerId: string): Promise<SavedCart>;
/**
 * List all saved carts for customer
 *
 * @param customerId - Customer ID
 * @param includeExpired - Include expired carts
 * @returns Array of saved carts
 */
export declare function listSavedCarts(customerId: string, includeExpired?: boolean): Promise<SavedCart[]>;
/**
 * Delete saved cart
 *
 * @param cartId - Cart ID to delete
 * @param customerId - Customer ID
 * @returns Deletion success
 */
export declare function deleteSavedCart(cartId: string, customerId: string): Promise<boolean>;
/**
 * Update saved cart items
 *
 * @param cartId - Cart ID
 * @param customerId - Customer ID
 * @param items - Updated items
 * @returns Updated cart
 */
export declare function updateSavedCartItems(cartId: string, customerId: string, items: SavedCartItemDetails[]): Promise<SavedCart>;
/**
 * Merge guest cart with user cart on login
 *
 * @param mergeData - Cart merge data
 * @returns Merged cart
 */
export declare function mergeCartsOnLogin(mergeData: MergeCartsDto): Promise<SavedCart>;
/**
 * Convert guest cart to user cart
 *
 * @param guestCartId - Guest cart ID
 * @param customerId - Customer ID
 * @returns Converted cart
 */
export declare function convertGuestCartToUserCart(guestCartId: string, customerId: string): Promise<SavedCart>;
/**
 * Process expired carts based on expiration settings
 *
 * @returns Count of processed carts
 */
export declare function processExpiredCarts(): Promise<number>;
/**
 * Send cart expiration warnings
 *
 * @returns Count of warnings sent
 */
export declare function sendCartExpirationWarnings(): Promise<number>;
/**
 * Extend cart expiration
 *
 * @param cartId - Cart ID
 * @param customerId - Customer ID
 * @param extensionDays - Days to extend
 * @returns Updated cart
 */
export declare function extendCartExpiration(cartId: string, customerId: string, extensionDays: number): Promise<SavedCart>;
/**
 * Create new wishlist
 *
 * @param wishlistData - Wishlist creation data
 * @returns Created wishlist
 */
export declare function createWishlist(wishlistData: CreateWishlistDto): Promise<Wishlist>;
/**
 * Add item to wishlist
 *
 * @param itemData - Item data
 * @returns Created wishlist item
 */
export declare function addItemToWishlist(itemData: AddToWishlistDto): Promise<WishlistItem>;
/**
 * Remove item from wishlist
 *
 * @param wishlistId - Wishlist ID
 * @param itemId - Item ID
 * @param customerId - Customer ID
 * @returns Deletion success
 */
export declare function removeItemFromWishlist(wishlistId: string, itemId: string, customerId: string): Promise<boolean>;
/**
 * Update wishlist details
 *
 * @param wishlistId - Wishlist ID
 * @param customerId - Customer ID
 * @param updates - Fields to update
 * @returns Updated wishlist
 */
export declare function updateWishlist(wishlistId: string, customerId: string, updates: Partial<CreateWishlistDto>): Promise<Wishlist>;
/**
 * Delete wishlist
 *
 * @param wishlistId - Wishlist ID
 * @param customerId - Customer ID
 * @returns Deletion success
 */
export declare function deleteWishlist(wishlistId: string, customerId: string): Promise<boolean>;
/**
 * Share wishlist and generate share link
 *
 * @param wishlistId - Wishlist ID
 * @param customerId - Customer ID
 * @param visibility - New visibility level
 * @returns Updated wishlist with share token
 */
export declare function shareWishlist(wishlistId: string, customerId: string, visibility: WishlistVisibility): Promise<Wishlist>;
/**
 * Get wishlist by share token
 *
 * @param shareToken - Share token
 * @param viewerId - Viewer customer ID (optional)
 * @returns Wishlist with items
 */
export declare function getWishlistByShareToken(shareToken: string, viewerId?: string): Promise<Wishlist>;
/**
 * Revoke wishlist sharing
 *
 * @param wishlistId - Wishlist ID
 * @param customerId - Customer ID
 * @returns Updated wishlist
 */
export declare function revokeWishlistSharing(wishlistId: string, customerId: string): Promise<Wishlist>;
/**
 * Move item from cart to wishlist
 *
 * @param cartId - Cart ID
 * @param wishlistId - Wishlist ID
 * @param productId - Product ID
 * @param customerId - Customer ID
 * @returns Created wishlist item
 */
export declare function moveCartItemToWishlist(cartId: string, wishlistId: string, productId: string, customerId: string): Promise<WishlistItem>;
/**
 * Move item from wishlist to cart
 *
 * @param wishlistId - Wishlist ID
 * @param cartId - Cart ID
 * @param itemId - Wishlist item ID
 * @param customerId - Customer ID
 * @returns Updated cart
 */
export declare function moveWishlistItemToCart(wishlistId: string, cartId: string, itemId: string, customerId: string): Promise<SavedCart>;
/**
 * Move all wishlist items to cart
 *
 * @param wishlistId - Wishlist ID
 * @param cartId - Cart ID
 * @param customerId - Customer ID
 * @returns Updated cart
 */
export declare function moveAllWishlistItemsToCart(wishlistId: string, cartId: string, customerId: string): Promise<SavedCart>;
/**
 * Subscribe to wishlist notifications
 *
 * @param notificationData - Notification subscription data
 * @returns Created subscription
 */
export declare function subscribeToWishlistNotifications(notificationData: WishlistNotificationDto): Promise<WishlistNotificationSubscription>;
/**
 * Check for price drops and send notifications
 *
 * @returns Count of notifications sent
 */
export declare function checkPriceDropsAndNotify(): Promise<number>;
/**
 * Check for back in stock items and notify
 *
 * @returns Count of notifications sent
 */
export declare function checkBackInStockAndNotify(): Promise<number>;
/**
 * Get wishlist analytics
 *
 * @param wishlistId - Wishlist ID
 * @returns Analytics data
 */
export declare function getWishlistAnalytics(wishlistId: string): Promise<WishlistAnalytics>;
/**
 * Get cart analytics
 *
 * @param cartId - Cart ID
 * @returns Cart analytics
 */
export declare function getCartAnalytics(cartId: string): Promise<CartAnalytics>;
/**
 * Track wishlist event
 *
 * @param wishlistId - Wishlist ID
 * @param eventType - Event type
 * @param customerId - Customer ID (optional)
 * @param eventData - Additional event data
 */
export declare function trackWishlistEvent(wishlistId: string, eventType: WishlistEventType, customerId?: string, eventData?: Record<string, any>): Promise<WishlistEvent>;
//# sourceMappingURL=saved-carts-wishlists-kit.d.ts.map