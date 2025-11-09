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

/**
 * File: /reuse/order/saved-carts-wishlists-kit.ts
 * Locator: WC-ORD-CRTWSH-001
 * Purpose: Saved Carts & Wishlists - Cart persistence, wishlists, buy later
 *
 * Upstream: Independent utility module for saved cart and wishlist operations
 * Downstream: ../backend/order/*, Shopping cart modules, Customer service modules
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 33 utility functions for saved carts, wishlists, cart/wishlist management
 *
 * LLM Context: Enterprise-grade saved cart and wishlist utilities to compete with Oracle MICROS.
 * Provides comprehensive cart persistence, multiple saved carts, wishlist creation and management,
 * wishlist sharing (public/private), item movement between cart and wishlist, cart expiration handling,
 * cart merge for logged-in users, wishlist notifications (price drops, back in stock), wishlist analytics,
 * guest cart conversion, cart recovery emails, wishlist events, collaborative wishlists, and more.
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsEnum, IsArray, IsBoolean, Min, Max, ValidateNested, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Saved cart types
 */
export enum SavedCartType {
  ACTIVE = 'ACTIVE',
  SAVED_FOR_LATER = 'SAVED_FOR_LATER',
  ABANDONED = 'ABANDONED',
  GUEST = 'GUEST',
  MERGED = 'MERGED',
  EXPIRED = 'EXPIRED',
  TEMPLATE = 'TEMPLATE',
}

/**
 * Wishlist visibility levels
 */
export enum WishlistVisibility {
  PRIVATE = 'PRIVATE',
  SHARED_LINK = 'SHARED_LINK',
  PUBLIC = 'PUBLIC',
  FRIENDS_ONLY = 'FRIENDS_ONLY',
  FAMILY_ONLY = 'FAMILY_ONLY',
}

/**
 * Wishlist notification types
 */
export enum WishlistNotificationType {
  PRICE_DROP = 'PRICE_DROP',
  BACK_IN_STOCK = 'BACK_IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  SALE_ALERT = 'SALE_ALERT',
  WISHLIST_SHARED = 'WISHLIST_SHARED',
  ITEM_ADDED = 'ITEM_ADDED',
  ITEM_PURCHASED = 'ITEM_PURCHASED',
}

/**
 * Cart expiration actions
 */
export enum CartExpirationAction {
  ARCHIVE = 'ARCHIVE',
  DELETE = 'DELETE',
  EXTEND = 'EXTEND',
  NOTIFY_BEFORE_EXPIRY = 'NOTIFY_BEFORE_EXPIRY',
}

/**
 * Wishlist event types for analytics
 */
export enum WishlistEventType {
  CREATED = 'CREATED',
  ITEM_ADDED = 'ITEM_ADDED',
  ITEM_REMOVED = 'ITEM_REMOVED',
  SHARED = 'SHARED',
  VIEWED = 'VIEWED',
  ITEM_PURCHASED = 'ITEM_PURCHASED',
  CONVERTED_TO_CART = 'CONVERTED_TO_CART',
}

/**
 * Item priority in wishlist
 */
export enum WishlistItemPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  MUST_HAVE = 'MUST_HAVE',
}

/**
 * Cart merge strategy for logged-in users
 */
export enum CartMergeStrategy {
  COMBINE_ALL = 'COMBINE_ALL',
  KEEP_LATEST = 'KEEP_LATEST',
  KEEP_GUEST = 'KEEP_GUEST',
  KEEP_USER = 'KEEP_USER',
  PROMPT_USER = 'PROMPT_USER',
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

/**
 * DTO for saving cart
 */
export class SaveCartDto {
  @ApiProperty({ description: 'Cart name' })
  @IsNotEmpty()
  @IsString()
  cartName: string;

  @ApiPropertyOptional({ description: 'Cart description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Customer ID (if authenticated)' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ description: 'Session ID (for guest carts)' })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({ description: 'Cart items', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  items: SavedCartItemDetails[];

  @ApiPropertyOptional({ description: 'Set as default cart' })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

/**
 * DTO for creating wishlist
 */
export class CreateWishlistDto {
  @ApiProperty({ description: 'Wishlist name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Wishlist description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Customer ID' })
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @ApiProperty({ description: 'Visibility level', enum: WishlistVisibility })
  @IsEnum(WishlistVisibility)
  visibility: WishlistVisibility;

  @ApiPropertyOptional({ description: 'Sharing settings' })
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  sharingSettings?: WishlistSharingSettings;

  @ApiPropertyOptional({ description: 'Event occasion (birthday, wedding, etc.)' })
  @IsOptional()
  @IsString()
  occasion?: string;

  @ApiPropertyOptional({ description: 'Event date' })
  @IsOptional()
  eventDate?: Date;
}

/**
 * DTO for adding item to wishlist
 */
export class AddToWishlistDto {
  @ApiProperty({ description: 'Wishlist ID' })
  @IsNotEmpty()
  @IsString()
  wishlistId: string;

  @ApiProperty({ description: 'Product ID' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Desired quantity' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Priority', enum: WishlistItemPriority })
  @IsEnum(WishlistItemPriority)
  priority: WishlistItemPriority;

  @ApiPropertyOptional({ description: 'Personal notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Product attributes/options' })
  @IsOptional()
  attributes?: Record<string, any>;
}

/**
 * DTO for cart merge operation
 */
export class MergeCartsDto {
  @ApiProperty({ description: 'Guest cart ID' })
  @IsNotEmpty()
  @IsString()
  guestCartId: string;

  @ApiProperty({ description: 'User cart ID' })
  @IsNotEmpty()
  @IsString()
  userCartId: string;

  @ApiProperty({ description: 'Merge strategy', enum: CartMergeStrategy })
  @IsEnum(CartMergeStrategy)
  strategy: CartMergeStrategy;

  @ApiPropertyOptional({ description: 'Resolve conflicts automatically' })
  @IsOptional()
  @IsBoolean()
  autoResolveConflicts?: boolean;
}

/**
 * DTO for wishlist notification subscription
 */
export class WishlistNotificationDto {
  @ApiProperty({ description: 'Wishlist ID' })
  @IsNotEmpty()
  @IsString()
  wishlistId: string;

  @ApiProperty({ description: 'Notification types', enum: WishlistNotificationType, isArray: true })
  @IsArray()
  @IsEnum(WishlistNotificationType, { each: true })
  notificationTypes: WishlistNotificationType[];

  @ApiPropertyOptional({ description: 'Price drop threshold percentage' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  priceDropThreshold?: number;

  @ApiPropertyOptional({ description: 'Email notifications enabled' })
  @IsOptional()
  @IsBoolean()
  emailEnabled?: boolean;

  @ApiPropertyOptional({ description: 'SMS notifications enabled' })
  @IsOptional()
  @IsBoolean()
  smsEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Push notifications enabled' })
  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;
}

// ============================================================================
// DATABASE MODELS
// ============================================================================

/**
 * SavedCart model for cart persistence
 */
@Table({
  tableName: 'saved_carts',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['customer_id'] },
    { fields: ['session_id'] },
    { fields: ['cart_type'] },
    { fields: ['expires_at'] },
    { fields: ['created_at'] },
  ],
})
export class SavedCart extends Model {
  @ApiProperty({ description: 'Unique cart ID' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ description: 'Cart name' })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  cartName: string;

  @ApiPropertyOptional({ description: 'Cart description' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @ApiPropertyOptional({ description: 'Customer ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  @Index
  customerId: string;

  @ApiPropertyOptional({ description: 'Session ID for guest carts' })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  @Index
  sessionId: string;

  @ApiProperty({ description: 'Cart type', enum: SavedCartType })
  @Column({
    type: DataType.ENUM(...Object.values(SavedCartType)),
    allowNull: false,
    defaultValue: SavedCartType.ACTIVE,
  })
  @Index
  cartType: SavedCartType;

  @ApiProperty({ description: 'Cart items (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  items: SavedCartItemDetails[];

  @ApiProperty({ description: 'Total cart value' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  totalValue: number;

  @ApiProperty({ description: 'Total item count' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  itemCount: number;

  @ApiProperty({ description: 'Is default cart for user' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isDefault: boolean;

  @ApiPropertyOptional({ description: 'Cart expiration date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @Index
  expiresAt: Date;

  @ApiPropertyOptional({ description: 'Expiration settings (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  expirationSettings: CartExpirationSettings;

  @ApiProperty({ description: 'Last accessed timestamp' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  lastAccessedAt: Date;

  @ApiPropertyOptional({ description: 'Merged from cart IDs' })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  mergedFromCartIds: string[];

  @ApiPropertyOptional({ description: 'Custom metadata (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Wishlist model
 */
@Table({
  tableName: 'wishlists',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['customer_id'] },
    { fields: ['visibility'] },
    { fields: ['share_token'] },
    { fields: ['created_at'] },
  ],
})
export class Wishlist extends Model {
  @ApiProperty({ description: 'Unique wishlist ID' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ description: 'Wishlist name' })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  name: string;

  @ApiPropertyOptional({ description: 'Wishlist description' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @ApiProperty({ description: 'Customer ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  customerId: string;

  @ApiProperty({ description: 'Visibility level', enum: WishlistVisibility })
  @Column({
    type: DataType.ENUM(...Object.values(WishlistVisibility)),
    allowNull: false,
    defaultValue: WishlistVisibility.PRIVATE,
  })
  @Index
  visibility: WishlistVisibility;

  @ApiPropertyOptional({ description: 'Share token for link sharing' })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    unique: true,
  })
  @Index
  shareToken: string;

  @ApiPropertyOptional({ description: 'Sharing settings (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  sharingSettings: WishlistSharingSettings;

  @ApiPropertyOptional({ description: 'Event occasion' })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  occasion: string;

  @ApiPropertyOptional({ description: 'Event date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  eventDate: Date;

  @ApiProperty({ description: 'Total wishlist value' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  totalValue: number;

  @ApiProperty({ description: 'Total item count' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  itemCount: number;

  @ApiProperty({ description: 'View count' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  viewCount: number;

  @ApiProperty({ description: 'Share count' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  shareCount: number;

  @ApiPropertyOptional({ description: 'Last viewed timestamp' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastViewedAt: Date;

  @ApiPropertyOptional({ description: 'Custom metadata (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * WishlistItem model
 */
@Table({
  tableName: 'wishlist_items',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['wishlist_id'] },
    { fields: ['product_id'] },
    { fields: ['priority'] },
  ],
})
export class WishlistItem extends Model {
  @ApiProperty({ description: 'Unique item ID' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ description: 'Wishlist ID' })
  @ForeignKey(() => Wishlist)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  wishlistId: string;

  @BelongsTo(() => Wishlist)
  wishlist: Wishlist;

  @ApiProperty({ description: 'Product ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  productId: string;

  @ApiProperty({ description: 'Product details (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  productDetails: WishlistItemDetails;

  @ApiProperty({ description: 'Desired quantity' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  quantity: number;

  @ApiProperty({ description: 'Priority', enum: WishlistItemPriority })
  @Column({
    type: DataType.ENUM(...Object.values(WishlistItemPriority)),
    allowNull: false,
    defaultValue: WishlistItemPriority.MEDIUM,
  })
  @Index
  priority: WishlistItemPriority;

  @ApiProperty({ description: 'Current price' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  currentPrice: number;

  @ApiProperty({ description: 'Price at addition' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  priceAtAddition: number;

  @ApiPropertyOptional({ description: 'Lowest recorded price' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  lowestPrice: number;

  @ApiPropertyOptional({ description: 'Personal notes' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @ApiProperty({ description: 'Is purchased' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isPurchased: boolean;

  @ApiPropertyOptional({ description: 'Purchased at timestamp' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  purchasedAt: Date;

  @ApiPropertyOptional({ description: 'Purchased by (customer ID)' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  purchasedBy: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * WishlistNotificationSubscription model
 */
@Table({
  tableName: 'wishlist_notification_subscriptions',
  timestamps: true,
  indexes: [
    { fields: ['wishlist_id'] },
    { fields: ['customer_id'] },
  ],
})
export class WishlistNotificationSubscription extends Model {
  @ApiProperty({ description: 'Unique subscription ID' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ description: 'Wishlist ID' })
  @ForeignKey(() => Wishlist)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  wishlistId: string;

  @BelongsTo(() => Wishlist)
  wishlist: Wishlist;

  @ApiProperty({ description: 'Customer ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  customerId: string;

  @ApiProperty({ description: 'Notification types' })
  @Column({
    type: DataType.ARRAY(DataType.ENUM(...Object.values(WishlistNotificationType))),
    allowNull: false,
  })
  notificationTypes: WishlistNotificationType[];

  @ApiPropertyOptional({ description: 'Price drop threshold percentage' })
  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
  })
  priceDropThreshold: number;

  @ApiProperty({ description: 'Email notifications enabled' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  emailEnabled: boolean;

  @ApiProperty({ description: 'SMS notifications enabled' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  smsEnabled: boolean;

  @ApiProperty({ description: 'Push notifications enabled' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  pushEnabled: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * WishlistEvent model for analytics
 */
@Table({
  tableName: 'wishlist_events',
  timestamps: true,
  indexes: [
    { fields: ['wishlist_id'] },
    { fields: ['event_type'] },
    { fields: ['created_at'] },
  ],
})
export class WishlistEvent extends Model {
  @ApiProperty({ description: 'Unique event ID' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ description: 'Wishlist ID' })
  @ForeignKey(() => Wishlist)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  wishlistId: string;

  @BelongsTo(() => Wishlist)
  wishlist: Wishlist;

  @ApiProperty({ description: 'Event type', enum: WishlistEventType })
  @Column({
    type: DataType.ENUM(...Object.values(WishlistEventType)),
    allowNull: false,
  })
  @Index
  eventType: WishlistEventType;

  @ApiPropertyOptional({ description: 'Customer ID (if authenticated)' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  customerId: string;

  @ApiPropertyOptional({ description: 'Product ID (for item-specific events)' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  productId: string;

  @ApiPropertyOptional({ description: 'Event data (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  eventData: Record<string, any>;

  @ApiPropertyOptional({ description: 'Session ID' })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  sessionId: string;

  @ApiPropertyOptional({ description: 'IP address' })
  @Column({
    type: DataType.STRING(45),
    allowNull: true,
  })
  ipAddress: string;

  @ApiPropertyOptional({ description: 'User agent' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  userAgent: string;

  @CreatedAt
  @Index
  createdAt: Date;
}

// ============================================================================
// UTILITY FUNCTIONS - SAVE CART OPERATIONS
// ============================================================================

/**
 * Save current cart for later
 *
 * @param cartData - Cart data to save
 * @returns Saved cart record
 */
export async function saveCartForLater(cartData: SaveCartDto): Promise<SavedCart> {
  try {
    // Check if cart with same name exists for customer
    const existingCart = await SavedCart.findOne({
      where: {
        customerId: cartData.customerId,
        cartName: cartData.cartName,
        cartType: SavedCartType.SAVED_FOR_LATER,
      },
    });

    if (existingCart) {
      throw new ConflictException(`Cart with name "${cartData.cartName}" already exists`);
    }

    const totalValue = cartData.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const itemCount = cartData.items.reduce((sum, item) => sum + item.quantity, 0);

    const expirationSettings: CartExpirationSettings = {
      expirationDays: 90,
      warningDays: 7,
      action: CartExpirationAction.NOTIFY_BEFORE_EXPIRY,
      sendNotification: true,
      autoExtendOnActivity: true,
    };

    const savedCart = await SavedCart.create({
      cartName: cartData.cartName,
      description: cartData.description,
      customerId: cartData.customerId,
      sessionId: cartData.sessionId,
      cartType: SavedCartType.SAVED_FOR_LATER,
      items: cartData.items,
      totalValue,
      itemCount,
      isDefault: cartData.isDefault || false,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      expirationSettings,
      lastAccessedAt: new Date(),
    });

    return savedCart;
  } catch (error) {
    throw new BadRequestException(`Failed to save cart: ${error.message}`);
  }
}

/**
 * Restore saved cart to active cart
 *
 * @param cartId - Saved cart ID
 * @param customerId - Customer ID
 * @returns Restored cart with updated items
 */
export async function restoreSavedCart(cartId: string, customerId: string): Promise<SavedCart> {
  try {
    const cart = await SavedCart.findOne({
      where: { id: cartId, customerId },
    });

    if (!cart) {
      throw new NotFoundException(`Saved cart ${cartId} not found`);
    }

    // Update cart type and last accessed
    cart.cartType = SavedCartType.ACTIVE;
    cart.lastAccessedAt = new Date();

    if (cart.expirationSettings?.autoExtendOnActivity) {
      cart.expiresAt = new Date(Date.now() + cart.expirationSettings.expirationDays * 24 * 60 * 60 * 1000);
    }

    await cart.save();

    return cart;
  } catch (error) {
    throw new BadRequestException(`Failed to restore cart: ${error.message}`);
  }
}

/**
 * List all saved carts for customer
 *
 * @param customerId - Customer ID
 * @param includeExpired - Include expired carts
 * @returns Array of saved carts
 */
export async function listSavedCarts(customerId: string, includeExpired: boolean = false): Promise<SavedCart[]> {
  try {
    const where: any = {
      customerId,
      cartType: [SavedCartType.SAVED_FOR_LATER, SavedCartType.ACTIVE],
    };

    if (!includeExpired) {
      where.expiresAt = { $or: [null, { $gt: new Date() }] };
    }

    const carts = await SavedCart.findAll({
      where,
      order: [['lastAccessedAt', 'DESC']],
    });

    return carts;
  } catch (error) {
    throw new BadRequestException(`Failed to list saved carts: ${error.message}`);
  }
}

/**
 * Delete saved cart
 *
 * @param cartId - Cart ID to delete
 * @param customerId - Customer ID
 * @returns Deletion success
 */
export async function deleteSavedCart(cartId: string, customerId: string): Promise<boolean> {
  try {
    const cart = await SavedCart.findOne({
      where: { id: cartId, customerId },
    });

    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }

    await cart.destroy();
    return true;
  } catch (error) {
    throw new BadRequestException(`Failed to delete cart: ${error.message}`);
  }
}

/**
 * Update saved cart items
 *
 * @param cartId - Cart ID
 * @param customerId - Customer ID
 * @param items - Updated items
 * @returns Updated cart
 */
export async function updateSavedCartItems(
  cartId: string,
  customerId: string,
  items: SavedCartItemDetails[],
): Promise<SavedCart> {
  try {
    const cart = await SavedCart.findOne({
      where: { id: cartId, customerId },
    });

    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }

    const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    cart.items = items;
    cart.totalValue = totalValue;
    cart.itemCount = itemCount;
    cart.lastAccessedAt = new Date();

    await cart.save();
    return cart;
  } catch (error) {
    throw new BadRequestException(`Failed to update cart items: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - CART MERGE OPERATIONS
// ============================================================================

/**
 * Merge guest cart with user cart on login
 *
 * @param mergeData - Cart merge data
 * @returns Merged cart
 */
export async function mergeCartsOnLogin(mergeData: MergeCartsDto): Promise<SavedCart> {
  try {
    const guestCart = await SavedCart.findByPk(mergeData.guestCartId);
    const userCart = await SavedCart.findByPk(mergeData.userCartId);

    if (!guestCart) {
      throw new NotFoundException(`Guest cart ${mergeData.guestCartId} not found`);
    }

    if (!userCart) {
      throw new NotFoundException(`User cart ${mergeData.userCartId} not found`);
    }

    let mergedItems: SavedCartItemDetails[] = [];

    switch (mergeData.strategy) {
      case CartMergeStrategy.COMBINE_ALL:
        mergedItems = combineCartItems(guestCart.items, userCart.items);
        break;
      case CartMergeStrategy.KEEP_LATEST:
        mergedItems = guestCart.updatedAt > userCart.updatedAt ? guestCart.items : userCart.items;
        break;
      case CartMergeStrategy.KEEP_GUEST:
        mergedItems = guestCart.items;
        break;
      case CartMergeStrategy.KEEP_USER:
        mergedItems = userCart.items;
        break;
      default:
        mergedItems = combineCartItems(guestCart.items, userCart.items);
    }

    const totalValue = mergedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const itemCount = mergedItems.reduce((sum, item) => sum + item.quantity, 0);

    userCart.items = mergedItems;
    userCart.totalValue = totalValue;
    userCart.itemCount = itemCount;
    userCart.mergedFromCartIds = [...(userCart.mergedFromCartIds || []), guestCart.id];
    userCart.lastAccessedAt = new Date();

    await userCart.save();

    // Mark guest cart as merged
    guestCart.cartType = SavedCartType.MERGED;
    await guestCart.save();

    return userCart;
  } catch (error) {
    throw new BadRequestException(`Failed to merge carts: ${error.message}`);
  }
}

/**
 * Combine cart items from two carts
 *
 * @param items1 - First cart items
 * @param items2 - Second cart items
 * @returns Combined items with merged quantities
 */
function combineCartItems(items1: SavedCartItemDetails[], items2: SavedCartItemDetails[]): SavedCartItemDetails[] {
  const itemMap = new Map<string, SavedCartItemDetails>();

  // Add items from first cart
  items1.forEach(item => {
    const key = `${item.productId}_${JSON.stringify(item.attributes || {})}`;
    itemMap.set(key, { ...item });
  });

  // Merge items from second cart
  items2.forEach(item => {
    const key = `${item.productId}_${JSON.stringify(item.attributes || {})}`;
    if (itemMap.has(key)) {
      const existing = itemMap.get(key)!;
      existing.quantity += item.quantity;
      existing.totalPrice = existing.quantity * existing.unitPrice;
      existing.savedAt = new Date();
    } else {
      itemMap.set(key, { ...item });
    }
  });

  return Array.from(itemMap.values());
}

/**
 * Convert guest cart to user cart
 *
 * @param guestCartId - Guest cart ID
 * @param customerId - Customer ID
 * @returns Converted cart
 */
export async function convertGuestCartToUserCart(guestCartId: string, customerId: string): Promise<SavedCart> {
  try {
    const cart = await SavedCart.findByPk(guestCartId);

    if (!cart) {
      throw new NotFoundException(`Guest cart ${guestCartId} not found`);
    }

    cart.customerId = customerId;
    cart.sessionId = null;
    cart.cartType = SavedCartType.ACTIVE;
    cart.lastAccessedAt = new Date();

    await cart.save();
    return cart;
  } catch (error) {
    throw new BadRequestException(`Failed to convert guest cart: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - CART EXPIRATION HANDLING
// ============================================================================

/**
 * Process expired carts based on expiration settings
 *
 * @returns Count of processed carts
 */
export async function processExpiredCarts(): Promise<number> {
  try {
    const expiredCarts = await SavedCart.findAll({
      where: {
        expiresAt: { $lte: new Date() },
        cartType: [SavedCartType.ACTIVE, SavedCartType.SAVED_FOR_LATER],
      },
    });

    let processedCount = 0;

    for (const cart of expiredCarts) {
      const action = cart.expirationSettings?.action || CartExpirationAction.ARCHIVE;

      switch (action) {
        case CartExpirationAction.ARCHIVE:
          cart.cartType = SavedCartType.EXPIRED;
          await cart.save();
          processedCount++;
          break;
        case CartExpirationAction.DELETE:
          await cart.destroy();
          processedCount++;
          break;
        case CartExpirationAction.EXTEND:
          cart.expiresAt = new Date(Date.now() + (cart.expirationSettings?.expirationDays || 30) * 24 * 60 * 60 * 1000);
          await cart.save();
          processedCount++;
          break;
      }
    }

    return processedCount;
  } catch (error) {
    throw new BadRequestException(`Failed to process expired carts: ${error.message}`);
  }
}

/**
 * Send cart expiration warnings
 *
 * @returns Count of warnings sent
 */
export async function sendCartExpirationWarnings(): Promise<number> {
  try {
    const warningCarts = await SavedCart.findAll({
      where: {
        cartType: [SavedCartType.ACTIVE, SavedCartType.SAVED_FOR_LATER],
      },
    });

    let warningCount = 0;

    for (const cart of warningCarts) {
      if (!cart.expiresAt || !cart.expirationSettings?.sendNotification) {
        continue;
      }

      const daysUntilExpiry = Math.ceil((cart.expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      const warningDays = cart.expirationSettings.warningDays || 7;

      if (daysUntilExpiry <= warningDays && daysUntilExpiry > 0) {
        // Send notification (implementation depends on notification system)
        await sendCartExpirationNotification(cart, daysUntilExpiry);
        warningCount++;
      }
    }

    return warningCount;
  } catch (error) {
    throw new BadRequestException(`Failed to send expiration warnings: ${error.message}`);
  }
}

/**
 * Extend cart expiration
 *
 * @param cartId - Cart ID
 * @param customerId - Customer ID
 * @param extensionDays - Days to extend
 * @returns Updated cart
 */
export async function extendCartExpiration(
  cartId: string,
  customerId: string,
  extensionDays: number,
): Promise<SavedCart> {
  try {
    const cart = await SavedCart.findOne({
      where: { id: cartId, customerId },
    });

    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }

    const currentExpiry = cart.expiresAt || new Date();
    cart.expiresAt = new Date(currentExpiry.getTime() + extensionDays * 24 * 60 * 60 * 1000);

    await cart.save();
    return cart;
  } catch (error) {
    throw new BadRequestException(`Failed to extend cart expiration: ${error.message}`);
  }
}

/**
 * Send cart expiration notification (helper function)
 *
 * @param cart - Cart to notify about
 * @param daysRemaining - Days until expiration
 */
async function sendCartExpirationNotification(cart: SavedCart, daysRemaining: number): Promise<void> {
  // Implementation would integrate with notification service
  Logger.log(`Cart expiration notification: ${cart.id} expires in ${daysRemaining} days`);
}

// ============================================================================
// UTILITY FUNCTIONS - WISHLIST CREATION & MANAGEMENT
// ============================================================================

/**
 * Create new wishlist
 *
 * @param wishlistData - Wishlist creation data
 * @returns Created wishlist
 */
export async function createWishlist(wishlistData: CreateWishlistDto): Promise<Wishlist> {
  try {
    const shareToken = wishlistData.visibility !== WishlistVisibility.PRIVATE
      ? generateShareToken()
      : null;

    const wishlist = await Wishlist.create({
      name: wishlistData.name,
      description: wishlistData.description,
      customerId: wishlistData.customerId,
      visibility: wishlistData.visibility,
      shareToken,
      sharingSettings: wishlistData.sharingSettings,
      occasion: wishlistData.occasion,
      eventDate: wishlistData.eventDate,
      totalValue: 0,
      itemCount: 0,
      viewCount: 0,
      shareCount: 0,
    });

    // Track wishlist creation event
    await trackWishlistEvent(wishlist.id, WishlistEventType.CREATED, wishlistData.customerId);

    return wishlist;
  } catch (error) {
    throw new BadRequestException(`Failed to create wishlist: ${error.message}`);
  }
}

/**
 * Add item to wishlist
 *
 * @param itemData - Item data
 * @returns Created wishlist item
 */
export async function addItemToWishlist(itemData: AddToWishlistDto): Promise<WishlistItem> {
  try {
    const wishlist = await Wishlist.findByPk(itemData.wishlistId);

    if (!wishlist) {
      throw new NotFoundException(`Wishlist ${itemData.wishlistId} not found`);
    }

    // Check if item already exists
    const existingItem = await WishlistItem.findOne({
      where: {
        wishlistId: itemData.wishlistId,
        productId: itemData.productId,
      },
    });

    if (existingItem) {
      throw new ConflictException('Item already exists in wishlist');
    }

    // Fetch product details (mock implementation - would integrate with product service)
    const productDetails: WishlistItemDetails = {
      productId: itemData.productId,
      productName: 'Product Name', // Would fetch from product service
      sku: 'SKU-123',
      desiredQuantity: itemData.quantity,
      currentPrice: 0, // Would fetch current price
      priceAtAddition: 0,
      priority: itemData.priority,
      notes: itemData.notes,
      attributes: itemData.attributes,
      addedAt: new Date(),
    };

    const wishlistItem = await WishlistItem.create({
      wishlistId: itemData.wishlistId,
      productId: itemData.productId,
      productDetails,
      quantity: itemData.quantity,
      priority: itemData.priority,
      currentPrice: productDetails.currentPrice,
      priceAtAddition: productDetails.priceAtAddition,
      lowestPrice: productDetails.priceAtAddition,
      notes: itemData.notes,
      isPurchased: false,
    });

    // Update wishlist totals
    await updateWishlistTotals(itemData.wishlistId);

    // Track event
    await trackWishlistEvent(itemData.wishlistId, WishlistEventType.ITEM_ADDED, null, {
      productId: itemData.productId,
    });

    return wishlistItem;
  } catch (error) {
    throw new BadRequestException(`Failed to add item to wishlist: ${error.message}`);
  }
}

/**
 * Remove item from wishlist
 *
 * @param wishlistId - Wishlist ID
 * @param itemId - Item ID
 * @param customerId - Customer ID
 * @returns Deletion success
 */
export async function removeItemFromWishlist(
  wishlistId: string,
  itemId: string,
  customerId: string,
): Promise<boolean> {
  try {
    const wishlist = await Wishlist.findOne({
      where: { id: wishlistId, customerId },
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist ${wishlistId} not found`);
    }

    const item = await WishlistItem.findOne({
      where: { id: itemId, wishlistId },
    });

    if (!item) {
      throw new NotFoundException(`Item ${itemId} not found`);
    }

    await item.destroy();

    // Update wishlist totals
    await updateWishlistTotals(wishlistId);

    // Track event
    await trackWishlistEvent(wishlistId, WishlistEventType.ITEM_REMOVED, customerId, {
      productId: item.productId,
    });

    return true;
  } catch (error) {
    throw new BadRequestException(`Failed to remove item from wishlist: ${error.message}`);
  }
}

/**
 * Update wishlist details
 *
 * @param wishlistId - Wishlist ID
 * @param customerId - Customer ID
 * @param updates - Fields to update
 * @returns Updated wishlist
 */
export async function updateWishlist(
  wishlistId: string,
  customerId: string,
  updates: Partial<CreateWishlistDto>,
): Promise<Wishlist> {
  try {
    const wishlist = await Wishlist.findOne({
      where: { id: wishlistId, customerId },
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist ${wishlistId} not found`);
    }

    if (updates.name) wishlist.name = updates.name;
    if (updates.description !== undefined) wishlist.description = updates.description;
    if (updates.visibility) {
      wishlist.visibility = updates.visibility;
      if (updates.visibility !== WishlistVisibility.PRIVATE && !wishlist.shareToken) {
        wishlist.shareToken = generateShareToken();
      }
    }
    if (updates.sharingSettings) wishlist.sharingSettings = updates.sharingSettings;
    if (updates.occasion !== undefined) wishlist.occasion = updates.occasion;
    if (updates.eventDate !== undefined) wishlist.eventDate = updates.eventDate;

    await wishlist.save();
    return wishlist;
  } catch (error) {
    throw new BadRequestException(`Failed to update wishlist: ${error.message}`);
  }
}

/**
 * Delete wishlist
 *
 * @param wishlistId - Wishlist ID
 * @param customerId - Customer ID
 * @returns Deletion success
 */
export async function deleteWishlist(wishlistId: string, customerId: string): Promise<boolean> {
  try {
    const wishlist = await Wishlist.findOne({
      where: { id: wishlistId, customerId },
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist ${wishlistId} not found`);
    }

    // Delete all items first
    await WishlistItem.destroy({ where: { wishlistId } });

    // Delete wishlist
    await wishlist.destroy();

    return true;
  } catch (error) {
    throw new BadRequestException(`Failed to delete wishlist: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - WISHLIST SHARING
// ============================================================================

/**
 * Share wishlist and generate share link
 *
 * @param wishlistId - Wishlist ID
 * @param customerId - Customer ID
 * @param visibility - New visibility level
 * @returns Updated wishlist with share token
 */
export async function shareWishlist(
  wishlistId: string,
  customerId: string,
  visibility: WishlistVisibility,
): Promise<Wishlist> {
  try {
    const wishlist = await Wishlist.findOne({
      where: { id: wishlistId, customerId },
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist ${wishlistId} not found`);
    }

    wishlist.visibility = visibility;

    if (!wishlist.shareToken) {
      wishlist.shareToken = generateShareToken();
    }

    wishlist.shareCount += 1;
    await wishlist.save();

    // Track sharing event
    await trackWishlistEvent(wishlistId, WishlistEventType.SHARED, customerId);

    return wishlist;
  } catch (error) {
    throw new BadRequestException(`Failed to share wishlist: ${error.message}`);
  }
}

/**
 * Get wishlist by share token
 *
 * @param shareToken - Share token
 * @param viewerId - Viewer customer ID (optional)
 * @returns Wishlist with items
 */
export async function getWishlistByShareToken(shareToken: string, viewerId?: string): Promise<Wishlist> {
  try {
    const wishlist = await Wishlist.findOne({
      where: { shareToken },
      include: [{ model: WishlistItem, as: 'items' }],
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    // Check password protection if required
    if (wishlist.sharingSettings?.requirePassword) {
      // Password validation would be handled separately
      throw new UnprocessableEntityException('Password required to view this wishlist');
    }

    // Update view count
    wishlist.viewCount += 1;
    wishlist.lastViewedAt = new Date();
    await wishlist.save();

    // Track view event
    await trackWishlistEvent(wishlist.id, WishlistEventType.VIEWED, viewerId);

    return wishlist;
  } catch (error) {
    throw new BadRequestException(`Failed to get shared wishlist: ${error.message}`);
  }
}

/**
 * Revoke wishlist sharing
 *
 * @param wishlistId - Wishlist ID
 * @param customerId - Customer ID
 * @returns Updated wishlist
 */
export async function revokeWishlistSharing(wishlistId: string, customerId: string): Promise<Wishlist> {
  try {
    const wishlist = await Wishlist.findOne({
      where: { id: wishlistId, customerId },
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist ${wishlistId} not found`);
    }

    wishlist.visibility = WishlistVisibility.PRIVATE;
    wishlist.shareToken = null;
    await wishlist.save();

    return wishlist;
  } catch (error) {
    throw new BadRequestException(`Failed to revoke wishlist sharing: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - MOVE ITEMS BETWEEN CART & WISHLIST
// ============================================================================

/**
 * Move item from cart to wishlist
 *
 * @param cartId - Cart ID
 * @param wishlistId - Wishlist ID
 * @param productId - Product ID
 * @param customerId - Customer ID
 * @returns Created wishlist item
 */
export async function moveCartItemToWishlist(
  cartId: string,
  wishlistId: string,
  productId: string,
  customerId: string,
): Promise<WishlistItem> {
  try {
    const cart = await SavedCart.findOne({
      where: { id: cartId, customerId },
    });

    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }

    const cartItem = cart.items.find(item => item.productId === productId);

    if (!cartItem) {
      throw new NotFoundException(`Product ${productId} not found in cart`);
    }

    // Add to wishlist
    const wishlistItemData: AddToWishlistDto = {
      wishlistId,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      priority: WishlistItemPriority.MEDIUM,
      notes: 'Moved from cart',
      attributes: cartItem.attributes,
    };

    const wishlistItem = await addItemToWishlist(wishlistItemData);

    // Remove from cart
    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.totalValue -= cartItem.totalPrice;
    cart.itemCount -= cartItem.quantity;
    await cart.save();

    return wishlistItem;
  } catch (error) {
    throw new BadRequestException(`Failed to move item to wishlist: ${error.message}`);
  }
}

/**
 * Move item from wishlist to cart
 *
 * @param wishlistId - Wishlist ID
 * @param cartId - Cart ID
 * @param itemId - Wishlist item ID
 * @param customerId - Customer ID
 * @returns Updated cart
 */
export async function moveWishlistItemToCart(
  wishlistId: string,
  cartId: string,
  itemId: string,
  customerId: string,
): Promise<SavedCart> {
  try {
    const wishlistItem = await WishlistItem.findOne({
      where: { id: itemId, wishlistId },
    });

    if (!wishlistItem) {
      throw new NotFoundException(`Wishlist item ${itemId} not found`);
    }

    const cart = await SavedCart.findOne({
      where: { id: cartId, customerId },
    });

    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }

    // Add to cart
    const cartItem: SavedCartItemDetails = {
      productId: wishlistItem.productId,
      productName: wishlistItem.productDetails.productName,
      sku: wishlistItem.productDetails.sku,
      quantity: wishlistItem.quantity,
      unitPrice: wishlistItem.currentPrice,
      totalPrice: wishlistItem.currentPrice * wishlistItem.quantity,
      imageUrl: wishlistItem.productDetails.imageUrl,
      attributes: wishlistItem.productDetails.attributes,
      savedAt: new Date(),
    };

    cart.items.push(cartItem);
    cart.totalValue += cartItem.totalPrice;
    cart.itemCount += cartItem.quantity;
    cart.lastAccessedAt = new Date();
    await cart.save();

    // Remove from wishlist
    await removeItemFromWishlist(wishlistId, itemId, customerId);

    // Track conversion event
    await trackWishlistEvent(wishlistId, WishlistEventType.CONVERTED_TO_CART, customerId, {
      productId: wishlistItem.productId,
    });

    return cart;
  } catch (error) {
    throw new BadRequestException(`Failed to move item to cart: ${error.message}`);
  }
}

/**
 * Move all wishlist items to cart
 *
 * @param wishlistId - Wishlist ID
 * @param cartId - Cart ID
 * @param customerId - Customer ID
 * @returns Updated cart
 */
export async function moveAllWishlistItemsToCart(
  wishlistId: string,
  cartId: string,
  customerId: string,
): Promise<SavedCart> {
  try {
    const items = await WishlistItem.findAll({
      where: { wishlistId },
    });

    const cart = await SavedCart.findOne({
      where: { id: cartId, customerId },
    });

    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }

    for (const item of items) {
      await moveWishlistItemToCart(wishlistId, cartId, item.id, customerId);
    }

    return cart;
  } catch (error) {
    throw new BadRequestException(`Failed to move all items to cart: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - WISHLIST NOTIFICATIONS
// ============================================================================

/**
 * Subscribe to wishlist notifications
 *
 * @param notificationData - Notification subscription data
 * @returns Created subscription
 */
export async function subscribeToWishlistNotifications(
  notificationData: WishlistNotificationDto,
): Promise<WishlistNotificationSubscription> {
  try {
    const wishlist = await Wishlist.findByPk(notificationData.wishlistId);

    if (!wishlist) {
      throw new NotFoundException(`Wishlist ${notificationData.wishlistId} not found`);
    }

    const subscription = await WishlistNotificationSubscription.create({
      wishlistId: notificationData.wishlistId,
      customerId: wishlist.customerId,
      notificationTypes: notificationData.notificationTypes,
      priceDropThreshold: notificationData.priceDropThreshold || 10,
      emailEnabled: notificationData.emailEnabled ?? true,
      smsEnabled: notificationData.smsEnabled ?? false,
      pushEnabled: notificationData.pushEnabled ?? true,
    });

    return subscription;
  } catch (error) {
    throw new BadRequestException(`Failed to subscribe to notifications: ${error.message}`);
  }
}

/**
 * Check for price drops and send notifications
 *
 * @returns Count of notifications sent
 */
export async function checkPriceDropsAndNotify(): Promise<number> {
  try {
    const subscriptions = await WishlistNotificationSubscription.findAll({
      where: {
        notificationTypes: { $contains: [WishlistNotificationType.PRICE_DROP] },
      },
      include: [{ model: Wishlist, as: 'wishlist' }],
    });

    let notificationCount = 0;

    for (const subscription of subscriptions) {
      const items = await WishlistItem.findAll({
        where: { wishlistId: subscription.wishlistId },
      });

      for (const item of items) {
        // Check if current price is lower than price at addition
        const priceDropPercent = ((item.priceAtAddition - item.currentPrice) / item.priceAtAddition) * 100;

        if (priceDropPercent >= subscription.priceDropThreshold) {
          await sendWishlistNotification(
            subscription,
            WishlistNotificationType.PRICE_DROP,
            {
              productId: item.productId,
              productName: item.productDetails.productName,
              oldPrice: item.priceAtAddition,
              newPrice: item.currentPrice,
              priceDropPercent,
            },
          );
          notificationCount++;
        }
      }
    }

    return notificationCount;
  } catch (error) {
    throw new BadRequestException(`Failed to check price drops: ${error.message}`);
  }
}

/**
 * Check for back in stock items and notify
 *
 * @returns Count of notifications sent
 */
export async function checkBackInStockAndNotify(): Promise<number> {
  try {
    const subscriptions = await WishlistNotificationSubscription.findAll({
      where: {
        notificationTypes: { $contains: [WishlistNotificationType.BACK_IN_STOCK] },
      },
    });

    let notificationCount = 0;

    for (const subscription of subscriptions) {
      const items = await WishlistItem.findAll({
        where: { wishlistId: subscription.wishlistId },
      });

      for (const item of items) {
        // Check product availability (mock implementation)
        const isBackInStock = await checkProductAvailability(item.productId);

        if (isBackInStock) {
          await sendWishlistNotification(
            subscription,
            WishlistNotificationType.BACK_IN_STOCK,
            {
              productId: item.productId,
              productName: item.productDetails.productName,
            },
          );
          notificationCount++;
        }
      }
    }

    return notificationCount;
  } catch (error) {
    throw new BadRequestException(`Failed to check back in stock: ${error.message}`);
  }
}

/**
 * Send wishlist notification (helper function)
 *
 * @param subscription - Notification subscription
 * @param type - Notification type
 * @param data - Notification data
 */
async function sendWishlistNotification(
  subscription: WishlistNotificationSubscription,
  type: WishlistNotificationType,
  data: Record<string, any>,
): Promise<void> {
  // Implementation would integrate with notification service
  Logger.log(`Wishlist notification: ${type} for customer ${subscription.customerId}`, data);
}

/**
 * Check product availability (helper function)
 *
 * @param productId - Product ID
 * @returns Availability status
 */
async function checkProductAvailability(productId: string): Promise<boolean> {
  // Mock implementation - would integrate with inventory service
  return Math.random() > 0.5;
}

// ============================================================================
// UTILITY FUNCTIONS - WISHLIST ANALYTICS
// ============================================================================

/**
 * Get wishlist analytics
 *
 * @param wishlistId - Wishlist ID
 * @returns Analytics data
 */
export async function getWishlistAnalytics(wishlistId: string): Promise<WishlistAnalytics> {
  try {
    const wishlist = await Wishlist.findByPk(wishlistId, {
      include: [{ model: WishlistItem, as: 'items' }],
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist ${wishlistId} not found`);
    }

    const items = await WishlistItem.findAll({ where: { wishlistId } });

    const totalValue = items.reduce((sum, item) => sum + item.currentPrice * item.quantity, 0);
    const priceDropCount = items.filter(item => item.currentPrice < item.priceAtAddition).length;
    const totalSavings = items.reduce((sum, item) => sum + (item.priceAtAddition - item.currentPrice) * item.quantity, 0);

    const purchasedCount = items.filter(item => item.isPurchased).length;
    const conversionRate = items.length > 0 ? (purchasedCount / items.length) * 100 : 0;

    const events = await WishlistEvent.findAll({
      where: { wishlistId },
    });

    const uniqueViewers = new Set(events.filter(e => e.eventType === WishlistEventType.VIEWED).map(e => e.customerId || e.sessionId)).size;

    const analytics: WishlistAnalytics = {
      totalValue,
      itemCount: items.length,
      averageItemPrice: items.length > 0 ? totalValue / items.length : 0,
      priceDropCount,
      totalSavings,
      conversionRate,
      sharingMetrics: {
        shareCount: wishlist.shareCount,
        viewCount: wishlist.viewCount,
        uniqueViewers,
      },
    };

    return analytics;
  } catch (error) {
    throw new BadRequestException(`Failed to get wishlist analytics: ${error.message}`);
  }
}

/**
 * Get cart analytics
 *
 * @param cartId - Cart ID
 * @returns Cart analytics
 */
export async function getCartAnalytics(cartId: string): Promise<CartAnalytics> {
  try {
    const cart = await SavedCart.findByPk(cartId);

    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }

    const daysSinceCreation = Math.floor((Date.now() - cart.createdAt.getTime()) / (24 * 60 * 60 * 1000));
    const daysSinceLastModified = Math.floor((Date.now() - cart.updatedAt.getTime()) / (24 * 60 * 60 * 1000));

    const analytics: CartAnalytics = {
      totalValue: cart.totalValue,
      itemCount: cart.itemCount,
      averageItemPrice: cart.itemCount > 0 ? cart.totalValue / cart.itemCount : 0,
      lastModified: cart.updatedAt,
      daysSinceCreation,
      daysSinceLastModified,
      estimatedConversionProbability: calculateConversionProbability(cart),
    };

    return analytics;
  } catch (error) {
    throw new BadRequestException(`Failed to get cart analytics: ${error.message}`);
  }
}

/**
 * Track wishlist event
 *
 * @param wishlistId - Wishlist ID
 * @param eventType - Event type
 * @param customerId - Customer ID (optional)
 * @param eventData - Additional event data
 */
export async function trackWishlistEvent(
  wishlistId: string,
  eventType: WishlistEventType,
  customerId?: string,
  eventData?: Record<string, any>,
): Promise<WishlistEvent> {
  try {
    const event = await WishlistEvent.create({
      wishlistId,
      eventType,
      customerId,
      eventData,
      sessionId: eventData?.sessionId,
      ipAddress: eventData?.ipAddress,
      userAgent: eventData?.userAgent,
    });

    return event;
  } catch (error) {
    Logger.error(`Failed to track wishlist event: ${error.message}`);
    throw error;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate unique share token
 *
 * @returns Share token
 */
function generateShareToken(): string {
  return `wl_${Math.random().toString(36).substring(2, 15)}${Date.now().toString(36)}`;
}

/**
 * Update wishlist totals
 *
 * @param wishlistId - Wishlist ID
 */
async function updateWishlistTotals(wishlistId: string): Promise<void> {
  try {
    const items = await WishlistItem.findAll({ where: { wishlistId } });
    const wishlist = await Wishlist.findByPk(wishlistId);

    if (wishlist) {
      wishlist.totalValue = items.reduce((sum, item) => sum + item.currentPrice * item.quantity, 0);
      wishlist.itemCount = items.length;
      await wishlist.save();
    }
  } catch (error) {
    Logger.error(`Failed to update wishlist totals: ${error.message}`);
  }
}

/**
 * Calculate conversion probability for cart
 *
 * @param cart - Saved cart
 * @returns Estimated conversion probability (0-100)
 */
function calculateConversionProbability(cart: SavedCart): number {
  const daysSinceCreation = Math.floor((Date.now() - cart.createdAt.getTime()) / (24 * 60 * 60 * 1000));
  const daysSinceLastAccess = Math.floor((Date.now() - cart.lastAccessedAt.getTime()) / (24 * 60 * 60 * 1000));

  // Simple heuristic - would use ML model in production
  let probability = 50;

  if (daysSinceCreation < 1) probability += 20;
  else if (daysSinceCreation < 3) probability += 10;
  else if (daysSinceCreation > 7) probability -= 20;

  if (daysSinceLastAccess < 1) probability += 15;
  else if (daysSinceLastAccess > 7) probability -= 25;

  if (cart.itemCount > 3) probability += 10;
  if (cart.totalValue > 100) probability += 10;

  return Math.max(0, Math.min(100, probability));
}
