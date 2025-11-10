"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistEvent = exports.WishlistNotificationSubscription = exports.WishlistItem = exports.Wishlist = exports.SavedCart = exports.WishlistNotificationDto = exports.MergeCartsDto = exports.AddToWishlistDto = exports.CreateWishlistDto = exports.SaveCartDto = exports.CartMergeStrategy = exports.WishlistItemPriority = exports.WishlistEventType = exports.CartExpirationAction = exports.WishlistNotificationType = exports.WishlistVisibility = exports.SavedCartType = void 0;
exports.saveCartForLater = saveCartForLater;
exports.restoreSavedCart = restoreSavedCart;
exports.listSavedCarts = listSavedCarts;
exports.deleteSavedCart = deleteSavedCart;
exports.updateSavedCartItems = updateSavedCartItems;
exports.mergeCartsOnLogin = mergeCartsOnLogin;
exports.convertGuestCartToUserCart = convertGuestCartToUserCart;
exports.processExpiredCarts = processExpiredCarts;
exports.sendCartExpirationWarnings = sendCartExpirationWarnings;
exports.extendCartExpiration = extendCartExpiration;
exports.createWishlist = createWishlist;
exports.addItemToWishlist = addItemToWishlist;
exports.removeItemFromWishlist = removeItemFromWishlist;
exports.updateWishlist = updateWishlist;
exports.deleteWishlist = deleteWishlist;
exports.shareWishlist = shareWishlist;
exports.getWishlistByShareToken = getWishlistByShareToken;
exports.revokeWishlistSharing = revokeWishlistSharing;
exports.moveCartItemToWishlist = moveCartItemToWishlist;
exports.moveWishlistItemToCart = moveWishlistItemToCart;
exports.moveAllWishlistItemsToCart = moveAllWishlistItemsToCart;
exports.subscribeToWishlistNotifications = subscribeToWishlistNotifications;
exports.checkPriceDropsAndNotify = checkPriceDropsAndNotify;
exports.checkBackInStockAndNotify = checkBackInStockAndNotify;
exports.getWishlistAnalytics = getWishlistAnalytics;
exports.getCartAnalytics = getCartAnalytics;
exports.trackWishlistEvent = trackWishlistEvent;
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
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================
/**
 * Saved cart types
 */
var SavedCartType;
(function (SavedCartType) {
    SavedCartType["ACTIVE"] = "ACTIVE";
    SavedCartType["SAVED_FOR_LATER"] = "SAVED_FOR_LATER";
    SavedCartType["ABANDONED"] = "ABANDONED";
    SavedCartType["GUEST"] = "GUEST";
    SavedCartType["MERGED"] = "MERGED";
    SavedCartType["EXPIRED"] = "EXPIRED";
    SavedCartType["TEMPLATE"] = "TEMPLATE";
})(SavedCartType || (exports.SavedCartType = SavedCartType = {}));
/**
 * Wishlist visibility levels
 */
var WishlistVisibility;
(function (WishlistVisibility) {
    WishlistVisibility["PRIVATE"] = "PRIVATE";
    WishlistVisibility["SHARED_LINK"] = "SHARED_LINK";
    WishlistVisibility["PUBLIC"] = "PUBLIC";
    WishlistVisibility["FRIENDS_ONLY"] = "FRIENDS_ONLY";
    WishlistVisibility["FAMILY_ONLY"] = "FAMILY_ONLY";
})(WishlistVisibility || (exports.WishlistVisibility = WishlistVisibility = {}));
/**
 * Wishlist notification types
 */
var WishlistNotificationType;
(function (WishlistNotificationType) {
    WishlistNotificationType["PRICE_DROP"] = "PRICE_DROP";
    WishlistNotificationType["BACK_IN_STOCK"] = "BACK_IN_STOCK";
    WishlistNotificationType["LOW_STOCK"] = "LOW_STOCK";
    WishlistNotificationType["SALE_ALERT"] = "SALE_ALERT";
    WishlistNotificationType["WISHLIST_SHARED"] = "WISHLIST_SHARED";
    WishlistNotificationType["ITEM_ADDED"] = "ITEM_ADDED";
    WishlistNotificationType["ITEM_PURCHASED"] = "ITEM_PURCHASED";
})(WishlistNotificationType || (exports.WishlistNotificationType = WishlistNotificationType = {}));
/**
 * Cart expiration actions
 */
var CartExpirationAction;
(function (CartExpirationAction) {
    CartExpirationAction["ARCHIVE"] = "ARCHIVE";
    CartExpirationAction["DELETE"] = "DELETE";
    CartExpirationAction["EXTEND"] = "EXTEND";
    CartExpirationAction["NOTIFY_BEFORE_EXPIRY"] = "NOTIFY_BEFORE_EXPIRY";
})(CartExpirationAction || (exports.CartExpirationAction = CartExpirationAction = {}));
/**
 * Wishlist event types for analytics
 */
var WishlistEventType;
(function (WishlistEventType) {
    WishlistEventType["CREATED"] = "CREATED";
    WishlistEventType["ITEM_ADDED"] = "ITEM_ADDED";
    WishlistEventType["ITEM_REMOVED"] = "ITEM_REMOVED";
    WishlistEventType["SHARED"] = "SHARED";
    WishlistEventType["VIEWED"] = "VIEWED";
    WishlistEventType["ITEM_PURCHASED"] = "ITEM_PURCHASED";
    WishlistEventType["CONVERTED_TO_CART"] = "CONVERTED_TO_CART";
})(WishlistEventType || (exports.WishlistEventType = WishlistEventType = {}));
/**
 * Item priority in wishlist
 */
var WishlistItemPriority;
(function (WishlistItemPriority) {
    WishlistItemPriority["LOW"] = "LOW";
    WishlistItemPriority["MEDIUM"] = "MEDIUM";
    WishlistItemPriority["HIGH"] = "HIGH";
    WishlistItemPriority["MUST_HAVE"] = "MUST_HAVE";
})(WishlistItemPriority || (exports.WishlistItemPriority = WishlistItemPriority = {}));
/**
 * Cart merge strategy for logged-in users
 */
var CartMergeStrategy;
(function (CartMergeStrategy) {
    CartMergeStrategy["COMBINE_ALL"] = "COMBINE_ALL";
    CartMergeStrategy["KEEP_LATEST"] = "KEEP_LATEST";
    CartMergeStrategy["KEEP_GUEST"] = "KEEP_GUEST";
    CartMergeStrategy["KEEP_USER"] = "KEEP_USER";
    CartMergeStrategy["PROMPT_USER"] = "PROMPT_USER";
})(CartMergeStrategy || (exports.CartMergeStrategy = CartMergeStrategy = {}));
// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================
/**
 * DTO for saving cart
 */
let SaveCartDto = (() => {
    var _a;
    let _cartName_decorators;
    let _cartName_initializers = [];
    let _cartName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _sessionId_decorators;
    let _sessionId_initializers = [];
    let _sessionId_extraInitializers = [];
    let _items_decorators;
    let _items_initializers = [];
    let _items_extraInitializers = [];
    let _isDefault_decorators;
    let _isDefault_initializers = [];
    let _isDefault_extraInitializers = [];
    return _a = class SaveCartDto {
            constructor() {
                this.cartName = __runInitializers(this, _cartName_initializers, void 0);
                this.description = (__runInitializers(this, _cartName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.customerId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                this.sessionId = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _sessionId_initializers, void 0));
                this.items = (__runInitializers(this, _sessionId_extraInitializers), __runInitializers(this, _items_initializers, void 0));
                this.isDefault = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _isDefault_initializers, void 0));
                __runInitializers(this, _isDefault_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _cartName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cart name' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Cart description' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID (if authenticated)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sessionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session ID (for guest carts)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _items_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cart items', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _isDefault_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Set as default cart' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _cartName_decorators, { kind: "field", name: "cartName", static: false, private: false, access: { has: obj => "cartName" in obj, get: obj => obj.cartName, set: (obj, value) => { obj.cartName = value; } }, metadata: _metadata }, _cartName_initializers, _cartName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _sessionId_decorators, { kind: "field", name: "sessionId", static: false, private: false, access: { has: obj => "sessionId" in obj, get: obj => obj.sessionId, set: (obj, value) => { obj.sessionId = value; } }, metadata: _metadata }, _sessionId_initializers, _sessionId_extraInitializers);
            __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: obj => "items" in obj, get: obj => obj.items, set: (obj, value) => { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
            __esDecorate(null, null, _isDefault_decorators, { kind: "field", name: "isDefault", static: false, private: false, access: { has: obj => "isDefault" in obj, get: obj => obj.isDefault, set: (obj, value) => { obj.isDefault = value; } }, metadata: _metadata }, _isDefault_initializers, _isDefault_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SaveCartDto = SaveCartDto;
/**
 * DTO for creating wishlist
 */
let CreateWishlistDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _visibility_decorators;
    let _visibility_initializers = [];
    let _visibility_extraInitializers = [];
    let _sharingSettings_decorators;
    let _sharingSettings_initializers = [];
    let _sharingSettings_extraInitializers = [];
    let _occasion_decorators;
    let _occasion_initializers = [];
    let _occasion_extraInitializers = [];
    let _eventDate_decorators;
    let _eventDate_initializers = [];
    let _eventDate_extraInitializers = [];
    return _a = class CreateWishlistDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.customerId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                this.visibility = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _visibility_initializers, void 0));
                this.sharingSettings = (__runInitializers(this, _visibility_extraInitializers), __runInitializers(this, _sharingSettings_initializers, void 0));
                this.occasion = (__runInitializers(this, _sharingSettings_extraInitializers), __runInitializers(this, _occasion_initializers, void 0));
                this.eventDate = (__runInitializers(this, _occasion_extraInitializers), __runInitializers(this, _eventDate_initializers, void 0));
                __runInitializers(this, _eventDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Wishlist name' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Wishlist description' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _visibility_decorators = [(0, swagger_1.ApiProperty)({ description: 'Visibility level', enum: WishlistVisibility }), (0, class_validator_1.IsEnum)(WishlistVisibility)];
            _sharingSettings_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Sharing settings' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => Object)];
            _occasion_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Event occasion (birthday, wedding, etc.)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _eventDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Event date' }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _visibility_decorators, { kind: "field", name: "visibility", static: false, private: false, access: { has: obj => "visibility" in obj, get: obj => obj.visibility, set: (obj, value) => { obj.visibility = value; } }, metadata: _metadata }, _visibility_initializers, _visibility_extraInitializers);
            __esDecorate(null, null, _sharingSettings_decorators, { kind: "field", name: "sharingSettings", static: false, private: false, access: { has: obj => "sharingSettings" in obj, get: obj => obj.sharingSettings, set: (obj, value) => { obj.sharingSettings = value; } }, metadata: _metadata }, _sharingSettings_initializers, _sharingSettings_extraInitializers);
            __esDecorate(null, null, _occasion_decorators, { kind: "field", name: "occasion", static: false, private: false, access: { has: obj => "occasion" in obj, get: obj => obj.occasion, set: (obj, value) => { obj.occasion = value; } }, metadata: _metadata }, _occasion_initializers, _occasion_extraInitializers);
            __esDecorate(null, null, _eventDate_decorators, { kind: "field", name: "eventDate", static: false, private: false, access: { has: obj => "eventDate" in obj, get: obj => obj.eventDate, set: (obj, value) => { obj.eventDate = value; } }, metadata: _metadata }, _eventDate_initializers, _eventDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateWishlistDto = CreateWishlistDto;
/**
 * DTO for adding item to wishlist
 */
let AddToWishlistDto = (() => {
    var _a;
    let _wishlistId_decorators;
    let _wishlistId_initializers = [];
    let _wishlistId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _attributes_decorators;
    let _attributes_initializers = [];
    let _attributes_extraInitializers = [];
    return _a = class AddToWishlistDto {
            constructor() {
                this.wishlistId = __runInitializers(this, _wishlistId_initializers, void 0);
                this.productId = (__runInitializers(this, _wishlistId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
                this.quantity = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
                this.priority = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.notes = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.attributes = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _attributes_initializers, void 0));
                __runInitializers(this, _attributes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _wishlistId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Wishlist ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _quantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Desired quantity' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority', enum: WishlistItemPriority }), (0, class_validator_1.IsEnum)(WishlistItemPriority)];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Personal notes' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _attributes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Product attributes/options' }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _wishlistId_decorators, { kind: "field", name: "wishlistId", static: false, private: false, access: { has: obj => "wishlistId" in obj, get: obj => obj.wishlistId, set: (obj, value) => { obj.wishlistId = value; } }, metadata: _metadata }, _wishlistId_initializers, _wishlistId_extraInitializers);
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _attributes_decorators, { kind: "field", name: "attributes", static: false, private: false, access: { has: obj => "attributes" in obj, get: obj => obj.attributes, set: (obj, value) => { obj.attributes = value; } }, metadata: _metadata }, _attributes_initializers, _attributes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AddToWishlistDto = AddToWishlistDto;
/**
 * DTO for cart merge operation
 */
let MergeCartsDto = (() => {
    var _a;
    let _guestCartId_decorators;
    let _guestCartId_initializers = [];
    let _guestCartId_extraInitializers = [];
    let _userCartId_decorators;
    let _userCartId_initializers = [];
    let _userCartId_extraInitializers = [];
    let _strategy_decorators;
    let _strategy_initializers = [];
    let _strategy_extraInitializers = [];
    let _autoResolveConflicts_decorators;
    let _autoResolveConflicts_initializers = [];
    let _autoResolveConflicts_extraInitializers = [];
    return _a = class MergeCartsDto {
            constructor() {
                this.guestCartId = __runInitializers(this, _guestCartId_initializers, void 0);
                this.userCartId = (__runInitializers(this, _guestCartId_extraInitializers), __runInitializers(this, _userCartId_initializers, void 0));
                this.strategy = (__runInitializers(this, _userCartId_extraInitializers), __runInitializers(this, _strategy_initializers, void 0));
                this.autoResolveConflicts = (__runInitializers(this, _strategy_extraInitializers), __runInitializers(this, _autoResolveConflicts_initializers, void 0));
                __runInitializers(this, _autoResolveConflicts_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _guestCartId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Guest cart ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _userCartId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User cart ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _strategy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Merge strategy', enum: CartMergeStrategy }), (0, class_validator_1.IsEnum)(CartMergeStrategy)];
            _autoResolveConflicts_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Resolve conflicts automatically' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _guestCartId_decorators, { kind: "field", name: "guestCartId", static: false, private: false, access: { has: obj => "guestCartId" in obj, get: obj => obj.guestCartId, set: (obj, value) => { obj.guestCartId = value; } }, metadata: _metadata }, _guestCartId_initializers, _guestCartId_extraInitializers);
            __esDecorate(null, null, _userCartId_decorators, { kind: "field", name: "userCartId", static: false, private: false, access: { has: obj => "userCartId" in obj, get: obj => obj.userCartId, set: (obj, value) => { obj.userCartId = value; } }, metadata: _metadata }, _userCartId_initializers, _userCartId_extraInitializers);
            __esDecorate(null, null, _strategy_decorators, { kind: "field", name: "strategy", static: false, private: false, access: { has: obj => "strategy" in obj, get: obj => obj.strategy, set: (obj, value) => { obj.strategy = value; } }, metadata: _metadata }, _strategy_initializers, _strategy_extraInitializers);
            __esDecorate(null, null, _autoResolveConflicts_decorators, { kind: "field", name: "autoResolveConflicts", static: false, private: false, access: { has: obj => "autoResolveConflicts" in obj, get: obj => obj.autoResolveConflicts, set: (obj, value) => { obj.autoResolveConflicts = value; } }, metadata: _metadata }, _autoResolveConflicts_initializers, _autoResolveConflicts_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.MergeCartsDto = MergeCartsDto;
/**
 * DTO for wishlist notification subscription
 */
let WishlistNotificationDto = (() => {
    var _a;
    let _wishlistId_decorators;
    let _wishlistId_initializers = [];
    let _wishlistId_extraInitializers = [];
    let _notificationTypes_decorators;
    let _notificationTypes_initializers = [];
    let _notificationTypes_extraInitializers = [];
    let _priceDropThreshold_decorators;
    let _priceDropThreshold_initializers = [];
    let _priceDropThreshold_extraInitializers = [];
    let _emailEnabled_decorators;
    let _emailEnabled_initializers = [];
    let _emailEnabled_extraInitializers = [];
    let _smsEnabled_decorators;
    let _smsEnabled_initializers = [];
    let _smsEnabled_extraInitializers = [];
    let _pushEnabled_decorators;
    let _pushEnabled_initializers = [];
    let _pushEnabled_extraInitializers = [];
    return _a = class WishlistNotificationDto {
            constructor() {
                this.wishlistId = __runInitializers(this, _wishlistId_initializers, void 0);
                this.notificationTypes = (__runInitializers(this, _wishlistId_extraInitializers), __runInitializers(this, _notificationTypes_initializers, void 0));
                this.priceDropThreshold = (__runInitializers(this, _notificationTypes_extraInitializers), __runInitializers(this, _priceDropThreshold_initializers, void 0));
                this.emailEnabled = (__runInitializers(this, _priceDropThreshold_extraInitializers), __runInitializers(this, _emailEnabled_initializers, void 0));
                this.smsEnabled = (__runInitializers(this, _emailEnabled_extraInitializers), __runInitializers(this, _smsEnabled_initializers, void 0));
                this.pushEnabled = (__runInitializers(this, _smsEnabled_extraInitializers), __runInitializers(this, _pushEnabled_initializers, void 0));
                __runInitializers(this, _pushEnabled_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _wishlistId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Wishlist ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _notificationTypes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notification types', enum: WishlistNotificationType, isArray: true }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsEnum)(WishlistNotificationType, { each: true })];
            _priceDropThreshold_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Price drop threshold percentage' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _emailEnabled_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Email notifications enabled' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _smsEnabled_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'SMS notifications enabled' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _pushEnabled_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Push notifications enabled' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _wishlistId_decorators, { kind: "field", name: "wishlistId", static: false, private: false, access: { has: obj => "wishlistId" in obj, get: obj => obj.wishlistId, set: (obj, value) => { obj.wishlistId = value; } }, metadata: _metadata }, _wishlistId_initializers, _wishlistId_extraInitializers);
            __esDecorate(null, null, _notificationTypes_decorators, { kind: "field", name: "notificationTypes", static: false, private: false, access: { has: obj => "notificationTypes" in obj, get: obj => obj.notificationTypes, set: (obj, value) => { obj.notificationTypes = value; } }, metadata: _metadata }, _notificationTypes_initializers, _notificationTypes_extraInitializers);
            __esDecorate(null, null, _priceDropThreshold_decorators, { kind: "field", name: "priceDropThreshold", static: false, private: false, access: { has: obj => "priceDropThreshold" in obj, get: obj => obj.priceDropThreshold, set: (obj, value) => { obj.priceDropThreshold = value; } }, metadata: _metadata }, _priceDropThreshold_initializers, _priceDropThreshold_extraInitializers);
            __esDecorate(null, null, _emailEnabled_decorators, { kind: "field", name: "emailEnabled", static: false, private: false, access: { has: obj => "emailEnabled" in obj, get: obj => obj.emailEnabled, set: (obj, value) => { obj.emailEnabled = value; } }, metadata: _metadata }, _emailEnabled_initializers, _emailEnabled_extraInitializers);
            __esDecorate(null, null, _smsEnabled_decorators, { kind: "field", name: "smsEnabled", static: false, private: false, access: { has: obj => "smsEnabled" in obj, get: obj => obj.smsEnabled, set: (obj, value) => { obj.smsEnabled = value; } }, metadata: _metadata }, _smsEnabled_initializers, _smsEnabled_extraInitializers);
            __esDecorate(null, null, _pushEnabled_decorators, { kind: "field", name: "pushEnabled", static: false, private: false, access: { has: obj => "pushEnabled" in obj, get: obj => obj.pushEnabled, set: (obj, value) => { obj.pushEnabled = value; } }, metadata: _metadata }, _pushEnabled_initializers, _pushEnabled_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.WishlistNotificationDto = WishlistNotificationDto;
// ============================================================================
// DATABASE MODELS
// ============================================================================
/**
 * SavedCart model for cart persistence
 */
let SavedCart = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _cartName_decorators;
    let _cartName_initializers = [];
    let _cartName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _sessionId_decorators;
    let _sessionId_initializers = [];
    let _sessionId_extraInitializers = [];
    let _cartType_decorators;
    let _cartType_initializers = [];
    let _cartType_extraInitializers = [];
    let _items_decorators;
    let _items_initializers = [];
    let _items_extraInitializers = [];
    let _totalValue_decorators;
    let _totalValue_initializers = [];
    let _totalValue_extraInitializers = [];
    let _itemCount_decorators;
    let _itemCount_initializers = [];
    let _itemCount_extraInitializers = [];
    let _isDefault_decorators;
    let _isDefault_initializers = [];
    let _isDefault_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    let _expirationSettings_decorators;
    let _expirationSettings_initializers = [];
    let _expirationSettings_extraInitializers = [];
    let _lastAccessedAt_decorators;
    let _lastAccessedAt_initializers = [];
    let _lastAccessedAt_extraInitializers = [];
    let _mergedFromCartIds_decorators;
    let _mergedFromCartIds_initializers = [];
    let _mergedFromCartIds_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var SavedCart = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.cartName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _cartName_initializers, void 0));
            this.description = (__runInitializers(this, _cartName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.customerId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.sessionId = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _sessionId_initializers, void 0));
            this.cartType = (__runInitializers(this, _sessionId_extraInitializers), __runInitializers(this, _cartType_initializers, void 0));
            this.items = (__runInitializers(this, _cartType_extraInitializers), __runInitializers(this, _items_initializers, void 0));
            this.totalValue = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _totalValue_initializers, void 0));
            this.itemCount = (__runInitializers(this, _totalValue_extraInitializers), __runInitializers(this, _itemCount_initializers, void 0));
            this.isDefault = (__runInitializers(this, _itemCount_extraInitializers), __runInitializers(this, _isDefault_initializers, void 0));
            this.expiresAt = (__runInitializers(this, _isDefault_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
            this.expirationSettings = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _expirationSettings_initializers, void 0));
            this.lastAccessedAt = (__runInitializers(this, _expirationSettings_extraInitializers), __runInitializers(this, _lastAccessedAt_initializers, void 0));
            this.mergedFromCartIds = (__runInitializers(this, _lastAccessedAt_extraInitializers), __runInitializers(this, _mergedFromCartIds_initializers, void 0));
            this.metadata = (__runInitializers(this, _mergedFromCartIds_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SavedCart");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique cart ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _cartName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cart name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Cart description' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _customerId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Customer ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            }), sequelize_typescript_1.Index];
        _sessionId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Session ID for guest carts' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            }), sequelize_typescript_1.Index];
        _cartType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cart type', enum: SavedCartType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(SavedCartType)),
                allowNull: false,
                defaultValue: SavedCartType.ACTIVE,
            }), sequelize_typescript_1.Index];
        _items_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cart items (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: [],
            })];
        _totalValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total cart value' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _itemCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total item count' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _isDefault_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is default cart for user' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            })];
        _expiresAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Cart expiration date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), sequelize_typescript_1.Index];
        _expirationSettings_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Expiration settings (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _lastAccessedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last accessed timestamp' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
            })];
        _mergedFromCartIds_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Merged from cart IDs' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
            })];
        _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Custom metadata (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _cartName_decorators, { kind: "field", name: "cartName", static: false, private: false, access: { has: obj => "cartName" in obj, get: obj => obj.cartName, set: (obj, value) => { obj.cartName = value; } }, metadata: _metadata }, _cartName_initializers, _cartName_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _sessionId_decorators, { kind: "field", name: "sessionId", static: false, private: false, access: { has: obj => "sessionId" in obj, get: obj => obj.sessionId, set: (obj, value) => { obj.sessionId = value; } }, metadata: _metadata }, _sessionId_initializers, _sessionId_extraInitializers);
        __esDecorate(null, null, _cartType_decorators, { kind: "field", name: "cartType", static: false, private: false, access: { has: obj => "cartType" in obj, get: obj => obj.cartType, set: (obj, value) => { obj.cartType = value; } }, metadata: _metadata }, _cartType_initializers, _cartType_extraInitializers);
        __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: obj => "items" in obj, get: obj => obj.items, set: (obj, value) => { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
        __esDecorate(null, null, _totalValue_decorators, { kind: "field", name: "totalValue", static: false, private: false, access: { has: obj => "totalValue" in obj, get: obj => obj.totalValue, set: (obj, value) => { obj.totalValue = value; } }, metadata: _metadata }, _totalValue_initializers, _totalValue_extraInitializers);
        __esDecorate(null, null, _itemCount_decorators, { kind: "field", name: "itemCount", static: false, private: false, access: { has: obj => "itemCount" in obj, get: obj => obj.itemCount, set: (obj, value) => { obj.itemCount = value; } }, metadata: _metadata }, _itemCount_initializers, _itemCount_extraInitializers);
        __esDecorate(null, null, _isDefault_decorators, { kind: "field", name: "isDefault", static: false, private: false, access: { has: obj => "isDefault" in obj, get: obj => obj.isDefault, set: (obj, value) => { obj.isDefault = value; } }, metadata: _metadata }, _isDefault_initializers, _isDefault_extraInitializers);
        __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
        __esDecorate(null, null, _expirationSettings_decorators, { kind: "field", name: "expirationSettings", static: false, private: false, access: { has: obj => "expirationSettings" in obj, get: obj => obj.expirationSettings, set: (obj, value) => { obj.expirationSettings = value; } }, metadata: _metadata }, _expirationSettings_initializers, _expirationSettings_extraInitializers);
        __esDecorate(null, null, _lastAccessedAt_decorators, { kind: "field", name: "lastAccessedAt", static: false, private: false, access: { has: obj => "lastAccessedAt" in obj, get: obj => obj.lastAccessedAt, set: (obj, value) => { obj.lastAccessedAt = value; } }, metadata: _metadata }, _lastAccessedAt_initializers, _lastAccessedAt_extraInitializers);
        __esDecorate(null, null, _mergedFromCartIds_decorators, { kind: "field", name: "mergedFromCartIds", static: false, private: false, access: { has: obj => "mergedFromCartIds" in obj, get: obj => obj.mergedFromCartIds, set: (obj, value) => { obj.mergedFromCartIds = value; } }, metadata: _metadata }, _mergedFromCartIds_initializers, _mergedFromCartIds_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SavedCart = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SavedCart = _classThis;
})();
exports.SavedCart = SavedCart;
/**
 * Wishlist model
 */
let Wishlist = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'wishlists',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['customer_id'] },
                { fields: ['visibility'] },
                { fields: ['share_token'] },
                { fields: ['created_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _visibility_decorators;
    let _visibility_initializers = [];
    let _visibility_extraInitializers = [];
    let _shareToken_decorators;
    let _shareToken_initializers = [];
    let _shareToken_extraInitializers = [];
    let _sharingSettings_decorators;
    let _sharingSettings_initializers = [];
    let _sharingSettings_extraInitializers = [];
    let _occasion_decorators;
    let _occasion_initializers = [];
    let _occasion_extraInitializers = [];
    let _eventDate_decorators;
    let _eventDate_initializers = [];
    let _eventDate_extraInitializers = [];
    let _totalValue_decorators;
    let _totalValue_initializers = [];
    let _totalValue_extraInitializers = [];
    let _itemCount_decorators;
    let _itemCount_initializers = [];
    let _itemCount_extraInitializers = [];
    let _viewCount_decorators;
    let _viewCount_initializers = [];
    let _viewCount_extraInitializers = [];
    let _shareCount_decorators;
    let _shareCount_initializers = [];
    let _shareCount_extraInitializers = [];
    let _lastViewedAt_decorators;
    let _lastViewedAt_initializers = [];
    let _lastViewedAt_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var Wishlist = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.customerId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.visibility = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _visibility_initializers, void 0));
            this.shareToken = (__runInitializers(this, _visibility_extraInitializers), __runInitializers(this, _shareToken_initializers, void 0));
            this.sharingSettings = (__runInitializers(this, _shareToken_extraInitializers), __runInitializers(this, _sharingSettings_initializers, void 0));
            this.occasion = (__runInitializers(this, _sharingSettings_extraInitializers), __runInitializers(this, _occasion_initializers, void 0));
            this.eventDate = (__runInitializers(this, _occasion_extraInitializers), __runInitializers(this, _eventDate_initializers, void 0));
            this.totalValue = (__runInitializers(this, _eventDate_extraInitializers), __runInitializers(this, _totalValue_initializers, void 0));
            this.itemCount = (__runInitializers(this, _totalValue_extraInitializers), __runInitializers(this, _itemCount_initializers, void 0));
            this.viewCount = (__runInitializers(this, _itemCount_extraInitializers), __runInitializers(this, _viewCount_initializers, void 0));
            this.shareCount = (__runInitializers(this, _viewCount_extraInitializers), __runInitializers(this, _shareCount_initializers, void 0));
            this.lastViewedAt = (__runInitializers(this, _shareCount_extraInitializers), __runInitializers(this, _lastViewedAt_initializers, void 0));
            this.metadata = (__runInitializers(this, _lastViewedAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Wishlist");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique wishlist ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Wishlist name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Wishlist description' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _visibility_decorators = [(0, swagger_1.ApiProperty)({ description: 'Visibility level', enum: WishlistVisibility }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(WishlistVisibility)),
                allowNull: false,
                defaultValue: WishlistVisibility.PRIVATE,
            }), sequelize_typescript_1.Index];
        _shareToken_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Share token for link sharing' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
                unique: true,
            }), sequelize_typescript_1.Index];
        _sharingSettings_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Sharing settings (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _occasion_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Event occasion' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _eventDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Event date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _totalValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total wishlist value' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _itemCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total item count' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _viewCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'View count' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _shareCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Share count' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _lastViewedAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Last viewed timestamp' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Custom metadata (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _visibility_decorators, { kind: "field", name: "visibility", static: false, private: false, access: { has: obj => "visibility" in obj, get: obj => obj.visibility, set: (obj, value) => { obj.visibility = value; } }, metadata: _metadata }, _visibility_initializers, _visibility_extraInitializers);
        __esDecorate(null, null, _shareToken_decorators, { kind: "field", name: "shareToken", static: false, private: false, access: { has: obj => "shareToken" in obj, get: obj => obj.shareToken, set: (obj, value) => { obj.shareToken = value; } }, metadata: _metadata }, _shareToken_initializers, _shareToken_extraInitializers);
        __esDecorate(null, null, _sharingSettings_decorators, { kind: "field", name: "sharingSettings", static: false, private: false, access: { has: obj => "sharingSettings" in obj, get: obj => obj.sharingSettings, set: (obj, value) => { obj.sharingSettings = value; } }, metadata: _metadata }, _sharingSettings_initializers, _sharingSettings_extraInitializers);
        __esDecorate(null, null, _occasion_decorators, { kind: "field", name: "occasion", static: false, private: false, access: { has: obj => "occasion" in obj, get: obj => obj.occasion, set: (obj, value) => { obj.occasion = value; } }, metadata: _metadata }, _occasion_initializers, _occasion_extraInitializers);
        __esDecorate(null, null, _eventDate_decorators, { kind: "field", name: "eventDate", static: false, private: false, access: { has: obj => "eventDate" in obj, get: obj => obj.eventDate, set: (obj, value) => { obj.eventDate = value; } }, metadata: _metadata }, _eventDate_initializers, _eventDate_extraInitializers);
        __esDecorate(null, null, _totalValue_decorators, { kind: "field", name: "totalValue", static: false, private: false, access: { has: obj => "totalValue" in obj, get: obj => obj.totalValue, set: (obj, value) => { obj.totalValue = value; } }, metadata: _metadata }, _totalValue_initializers, _totalValue_extraInitializers);
        __esDecorate(null, null, _itemCount_decorators, { kind: "field", name: "itemCount", static: false, private: false, access: { has: obj => "itemCount" in obj, get: obj => obj.itemCount, set: (obj, value) => { obj.itemCount = value; } }, metadata: _metadata }, _itemCount_initializers, _itemCount_extraInitializers);
        __esDecorate(null, null, _viewCount_decorators, { kind: "field", name: "viewCount", static: false, private: false, access: { has: obj => "viewCount" in obj, get: obj => obj.viewCount, set: (obj, value) => { obj.viewCount = value; } }, metadata: _metadata }, _viewCount_initializers, _viewCount_extraInitializers);
        __esDecorate(null, null, _shareCount_decorators, { kind: "field", name: "shareCount", static: false, private: false, access: { has: obj => "shareCount" in obj, get: obj => obj.shareCount, set: (obj, value) => { obj.shareCount = value; } }, metadata: _metadata }, _shareCount_initializers, _shareCount_extraInitializers);
        __esDecorate(null, null, _lastViewedAt_decorators, { kind: "field", name: "lastViewedAt", static: false, private: false, access: { has: obj => "lastViewedAt" in obj, get: obj => obj.lastViewedAt, set: (obj, value) => { obj.lastViewedAt = value; } }, metadata: _metadata }, _lastViewedAt_initializers, _lastViewedAt_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Wishlist = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Wishlist = _classThis;
})();
exports.Wishlist = Wishlist;
/**
 * WishlistItem model
 */
let WishlistItem = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'wishlist_items',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['wishlist_id'] },
                { fields: ['product_id'] },
                { fields: ['priority'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _wishlistId_decorators;
    let _wishlistId_initializers = [];
    let _wishlistId_extraInitializers = [];
    let _wishlist_decorators;
    let _wishlist_initializers = [];
    let _wishlist_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _productDetails_decorators;
    let _productDetails_initializers = [];
    let _productDetails_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _currentPrice_decorators;
    let _currentPrice_initializers = [];
    let _currentPrice_extraInitializers = [];
    let _priceAtAddition_decorators;
    let _priceAtAddition_initializers = [];
    let _priceAtAddition_extraInitializers = [];
    let _lowestPrice_decorators;
    let _lowestPrice_initializers = [];
    let _lowestPrice_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _isPurchased_decorators;
    let _isPurchased_initializers = [];
    let _isPurchased_extraInitializers = [];
    let _purchasedAt_decorators;
    let _purchasedAt_initializers = [];
    let _purchasedAt_extraInitializers = [];
    let _purchasedBy_decorators;
    let _purchasedBy_initializers = [];
    let _purchasedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var WishlistItem = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.wishlistId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _wishlistId_initializers, void 0));
            this.wishlist = (__runInitializers(this, _wishlistId_extraInitializers), __runInitializers(this, _wishlist_initializers, void 0));
            this.productId = (__runInitializers(this, _wishlist_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
            this.productDetails = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _productDetails_initializers, void 0));
            this.quantity = (__runInitializers(this, _productDetails_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
            this.priority = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.currentPrice = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _currentPrice_initializers, void 0));
            this.priceAtAddition = (__runInitializers(this, _currentPrice_extraInitializers), __runInitializers(this, _priceAtAddition_initializers, void 0));
            this.lowestPrice = (__runInitializers(this, _priceAtAddition_extraInitializers), __runInitializers(this, _lowestPrice_initializers, void 0));
            this.notes = (__runInitializers(this, _lowestPrice_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.isPurchased = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _isPurchased_initializers, void 0));
            this.purchasedAt = (__runInitializers(this, _isPurchased_extraInitializers), __runInitializers(this, _purchasedAt_initializers, void 0));
            this.purchasedBy = (__runInitializers(this, _purchasedAt_extraInitializers), __runInitializers(this, _purchasedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _purchasedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WishlistItem");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique item ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _wishlistId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Wishlist ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Wishlist), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _wishlist_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Wishlist)];
        _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _productDetails_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product details (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _quantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Desired quantity' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 1,
            })];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority', enum: WishlistItemPriority }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(WishlistItemPriority)),
                allowNull: false,
                defaultValue: WishlistItemPriority.MEDIUM,
            }), sequelize_typescript_1.Index];
        _currentPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current price' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _priceAtAddition_decorators = [(0, swagger_1.ApiProperty)({ description: 'Price at addition' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _lowestPrice_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Lowest recorded price' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
            })];
        _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Personal notes' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _isPurchased_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is purchased' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            })];
        _purchasedAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Purchased at timestamp' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _purchasedBy_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Purchased by (customer ID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _wishlistId_decorators, { kind: "field", name: "wishlistId", static: false, private: false, access: { has: obj => "wishlistId" in obj, get: obj => obj.wishlistId, set: (obj, value) => { obj.wishlistId = value; } }, metadata: _metadata }, _wishlistId_initializers, _wishlistId_extraInitializers);
        __esDecorate(null, null, _wishlist_decorators, { kind: "field", name: "wishlist", static: false, private: false, access: { has: obj => "wishlist" in obj, get: obj => obj.wishlist, set: (obj, value) => { obj.wishlist = value; } }, metadata: _metadata }, _wishlist_initializers, _wishlist_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _productDetails_decorators, { kind: "field", name: "productDetails", static: false, private: false, access: { has: obj => "productDetails" in obj, get: obj => obj.productDetails, set: (obj, value) => { obj.productDetails = value; } }, metadata: _metadata }, _productDetails_initializers, _productDetails_extraInitializers);
        __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _currentPrice_decorators, { kind: "field", name: "currentPrice", static: false, private: false, access: { has: obj => "currentPrice" in obj, get: obj => obj.currentPrice, set: (obj, value) => { obj.currentPrice = value; } }, metadata: _metadata }, _currentPrice_initializers, _currentPrice_extraInitializers);
        __esDecorate(null, null, _priceAtAddition_decorators, { kind: "field", name: "priceAtAddition", static: false, private: false, access: { has: obj => "priceAtAddition" in obj, get: obj => obj.priceAtAddition, set: (obj, value) => { obj.priceAtAddition = value; } }, metadata: _metadata }, _priceAtAddition_initializers, _priceAtAddition_extraInitializers);
        __esDecorate(null, null, _lowestPrice_decorators, { kind: "field", name: "lowestPrice", static: false, private: false, access: { has: obj => "lowestPrice" in obj, get: obj => obj.lowestPrice, set: (obj, value) => { obj.lowestPrice = value; } }, metadata: _metadata }, _lowestPrice_initializers, _lowestPrice_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _isPurchased_decorators, { kind: "field", name: "isPurchased", static: false, private: false, access: { has: obj => "isPurchased" in obj, get: obj => obj.isPurchased, set: (obj, value) => { obj.isPurchased = value; } }, metadata: _metadata }, _isPurchased_initializers, _isPurchased_extraInitializers);
        __esDecorate(null, null, _purchasedAt_decorators, { kind: "field", name: "purchasedAt", static: false, private: false, access: { has: obj => "purchasedAt" in obj, get: obj => obj.purchasedAt, set: (obj, value) => { obj.purchasedAt = value; } }, metadata: _metadata }, _purchasedAt_initializers, _purchasedAt_extraInitializers);
        __esDecorate(null, null, _purchasedBy_decorators, { kind: "field", name: "purchasedBy", static: false, private: false, access: { has: obj => "purchasedBy" in obj, get: obj => obj.purchasedBy, set: (obj, value) => { obj.purchasedBy = value; } }, metadata: _metadata }, _purchasedBy_initializers, _purchasedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WishlistItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WishlistItem = _classThis;
})();
exports.WishlistItem = WishlistItem;
/**
 * WishlistNotificationSubscription model
 */
let WishlistNotificationSubscription = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'wishlist_notification_subscriptions',
            timestamps: true,
            indexes: [
                { fields: ['wishlist_id'] },
                { fields: ['customer_id'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _wishlistId_decorators;
    let _wishlistId_initializers = [];
    let _wishlistId_extraInitializers = [];
    let _wishlist_decorators;
    let _wishlist_initializers = [];
    let _wishlist_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _notificationTypes_decorators;
    let _notificationTypes_initializers = [];
    let _notificationTypes_extraInitializers = [];
    let _priceDropThreshold_decorators;
    let _priceDropThreshold_initializers = [];
    let _priceDropThreshold_extraInitializers = [];
    let _emailEnabled_decorators;
    let _emailEnabled_initializers = [];
    let _emailEnabled_extraInitializers = [];
    let _smsEnabled_decorators;
    let _smsEnabled_initializers = [];
    let _smsEnabled_extraInitializers = [];
    let _pushEnabled_decorators;
    let _pushEnabled_initializers = [];
    let _pushEnabled_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var WishlistNotificationSubscription = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.wishlistId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _wishlistId_initializers, void 0));
            this.wishlist = (__runInitializers(this, _wishlistId_extraInitializers), __runInitializers(this, _wishlist_initializers, void 0));
            this.customerId = (__runInitializers(this, _wishlist_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.notificationTypes = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _notificationTypes_initializers, void 0));
            this.priceDropThreshold = (__runInitializers(this, _notificationTypes_extraInitializers), __runInitializers(this, _priceDropThreshold_initializers, void 0));
            this.emailEnabled = (__runInitializers(this, _priceDropThreshold_extraInitializers), __runInitializers(this, _emailEnabled_initializers, void 0));
            this.smsEnabled = (__runInitializers(this, _emailEnabled_extraInitializers), __runInitializers(this, _smsEnabled_initializers, void 0));
            this.pushEnabled = (__runInitializers(this, _smsEnabled_extraInitializers), __runInitializers(this, _pushEnabled_initializers, void 0));
            this.createdAt = (__runInitializers(this, _pushEnabled_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WishlistNotificationSubscription");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique subscription ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _wishlistId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Wishlist ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Wishlist), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _wishlist_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Wishlist)];
        _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _notificationTypes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notification types' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.ENUM(...Object.values(WishlistNotificationType))),
                allowNull: false,
            })];
        _priceDropThreshold_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Price drop threshold percentage' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: true,
            })];
        _emailEnabled_decorators = [(0, swagger_1.ApiProperty)({ description: 'Email notifications enabled' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            })];
        _smsEnabled_decorators = [(0, swagger_1.ApiProperty)({ description: 'SMS notifications enabled' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            })];
        _pushEnabled_decorators = [(0, swagger_1.ApiProperty)({ description: 'Push notifications enabled' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _wishlistId_decorators, { kind: "field", name: "wishlistId", static: false, private: false, access: { has: obj => "wishlistId" in obj, get: obj => obj.wishlistId, set: (obj, value) => { obj.wishlistId = value; } }, metadata: _metadata }, _wishlistId_initializers, _wishlistId_extraInitializers);
        __esDecorate(null, null, _wishlist_decorators, { kind: "field", name: "wishlist", static: false, private: false, access: { has: obj => "wishlist" in obj, get: obj => obj.wishlist, set: (obj, value) => { obj.wishlist = value; } }, metadata: _metadata }, _wishlist_initializers, _wishlist_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _notificationTypes_decorators, { kind: "field", name: "notificationTypes", static: false, private: false, access: { has: obj => "notificationTypes" in obj, get: obj => obj.notificationTypes, set: (obj, value) => { obj.notificationTypes = value; } }, metadata: _metadata }, _notificationTypes_initializers, _notificationTypes_extraInitializers);
        __esDecorate(null, null, _priceDropThreshold_decorators, { kind: "field", name: "priceDropThreshold", static: false, private: false, access: { has: obj => "priceDropThreshold" in obj, get: obj => obj.priceDropThreshold, set: (obj, value) => { obj.priceDropThreshold = value; } }, metadata: _metadata }, _priceDropThreshold_initializers, _priceDropThreshold_extraInitializers);
        __esDecorate(null, null, _emailEnabled_decorators, { kind: "field", name: "emailEnabled", static: false, private: false, access: { has: obj => "emailEnabled" in obj, get: obj => obj.emailEnabled, set: (obj, value) => { obj.emailEnabled = value; } }, metadata: _metadata }, _emailEnabled_initializers, _emailEnabled_extraInitializers);
        __esDecorate(null, null, _smsEnabled_decorators, { kind: "field", name: "smsEnabled", static: false, private: false, access: { has: obj => "smsEnabled" in obj, get: obj => obj.smsEnabled, set: (obj, value) => { obj.smsEnabled = value; } }, metadata: _metadata }, _smsEnabled_initializers, _smsEnabled_extraInitializers);
        __esDecorate(null, null, _pushEnabled_decorators, { kind: "field", name: "pushEnabled", static: false, private: false, access: { has: obj => "pushEnabled" in obj, get: obj => obj.pushEnabled, set: (obj, value) => { obj.pushEnabled = value; } }, metadata: _metadata }, _pushEnabled_initializers, _pushEnabled_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WishlistNotificationSubscription = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WishlistNotificationSubscription = _classThis;
})();
exports.WishlistNotificationSubscription = WishlistNotificationSubscription;
/**
 * WishlistEvent model for analytics
 */
let WishlistEvent = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'wishlist_events',
            timestamps: true,
            indexes: [
                { fields: ['wishlist_id'] },
                { fields: ['event_type'] },
                { fields: ['created_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _wishlistId_decorators;
    let _wishlistId_initializers = [];
    let _wishlistId_extraInitializers = [];
    let _wishlist_decorators;
    let _wishlist_initializers = [];
    let _wishlist_extraInitializers = [];
    let _eventType_decorators;
    let _eventType_initializers = [];
    let _eventType_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _eventData_decorators;
    let _eventData_initializers = [];
    let _eventData_extraInitializers = [];
    let _sessionId_decorators;
    let _sessionId_initializers = [];
    let _sessionId_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _userAgent_decorators;
    let _userAgent_initializers = [];
    let _userAgent_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    var WishlistEvent = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.wishlistId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _wishlistId_initializers, void 0));
            this.wishlist = (__runInitializers(this, _wishlistId_extraInitializers), __runInitializers(this, _wishlist_initializers, void 0));
            this.eventType = (__runInitializers(this, _wishlist_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
            this.customerId = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.productId = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
            this.eventData = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _eventData_initializers, void 0));
            this.sessionId = (__runInitializers(this, _eventData_extraInitializers), __runInitializers(this, _sessionId_initializers, void 0));
            this.ipAddress = (__runInitializers(this, _sessionId_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
            this.userAgent = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _userAgent_initializers, void 0));
            this.createdAt = (__runInitializers(this, _userAgent_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WishlistEvent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique event ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _wishlistId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Wishlist ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Wishlist), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _wishlist_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Wishlist)];
        _eventType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event type', enum: WishlistEventType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(WishlistEventType)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _customerId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Customer ID (if authenticated)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _productId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Product ID (for item-specific events)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _eventData_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Event data (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _sessionId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Session ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _ipAddress_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'IP address' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(45),
                allowNull: true,
            })];
        _userAgent_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'User agent' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Index];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _wishlistId_decorators, { kind: "field", name: "wishlistId", static: false, private: false, access: { has: obj => "wishlistId" in obj, get: obj => obj.wishlistId, set: (obj, value) => { obj.wishlistId = value; } }, metadata: _metadata }, _wishlistId_initializers, _wishlistId_extraInitializers);
        __esDecorate(null, null, _wishlist_decorators, { kind: "field", name: "wishlist", static: false, private: false, access: { has: obj => "wishlist" in obj, get: obj => obj.wishlist, set: (obj, value) => { obj.wishlist = value; } }, metadata: _metadata }, _wishlist_initializers, _wishlist_extraInitializers);
        __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: obj => "eventType" in obj, get: obj => obj.eventType, set: (obj, value) => { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _eventData_decorators, { kind: "field", name: "eventData", static: false, private: false, access: { has: obj => "eventData" in obj, get: obj => obj.eventData, set: (obj, value) => { obj.eventData = value; } }, metadata: _metadata }, _eventData_initializers, _eventData_extraInitializers);
        __esDecorate(null, null, _sessionId_decorators, { kind: "field", name: "sessionId", static: false, private: false, access: { has: obj => "sessionId" in obj, get: obj => obj.sessionId, set: (obj, value) => { obj.sessionId = value; } }, metadata: _metadata }, _sessionId_initializers, _sessionId_extraInitializers);
        __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
        __esDecorate(null, null, _userAgent_decorators, { kind: "field", name: "userAgent", static: false, private: false, access: { has: obj => "userAgent" in obj, get: obj => obj.userAgent, set: (obj, value) => { obj.userAgent = value; } }, metadata: _metadata }, _userAgent_initializers, _userAgent_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WishlistEvent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WishlistEvent = _classThis;
})();
exports.WishlistEvent = WishlistEvent;
// ============================================================================
// UTILITY FUNCTIONS - SAVE CART OPERATIONS
// ============================================================================
/**
 * Save current cart for later
 *
 * @param cartData - Cart data to save
 * @returns Saved cart record
 */
async function saveCartForLater(cartData) {
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
            throw new common_1.ConflictException(`Cart with name "${cartData.cartName}" already exists`);
        }
        const totalValue = cartData.items.reduce((sum, item) => sum + item.totalPrice, 0);
        const itemCount = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
        const expirationSettings = {
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to save cart: ${error.message}`);
    }
}
/**
 * Restore saved cart to active cart
 *
 * @param cartId - Saved cart ID
 * @param customerId - Customer ID
 * @returns Restored cart with updated items
 */
async function restoreSavedCart(cartId, customerId) {
    try {
        const cart = await SavedCart.findOne({
            where: { id: cartId, customerId },
        });
        if (!cart) {
            throw new common_1.NotFoundException(`Saved cart ${cartId} not found`);
        }
        // Update cart type and last accessed
        cart.cartType = SavedCartType.ACTIVE;
        cart.lastAccessedAt = new Date();
        if (cart.expirationSettings?.autoExtendOnActivity) {
            cart.expiresAt = new Date(Date.now() + cart.expirationSettings.expirationDays * 24 * 60 * 60 * 1000);
        }
        await cart.save();
        return cart;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to restore cart: ${error.message}`);
    }
}
/**
 * List all saved carts for customer
 *
 * @param customerId - Customer ID
 * @param includeExpired - Include expired carts
 * @returns Array of saved carts
 */
async function listSavedCarts(customerId, includeExpired = false) {
    try {
        const where = {
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to list saved carts: ${error.message}`);
    }
}
/**
 * Delete saved cart
 *
 * @param cartId - Cart ID to delete
 * @param customerId - Customer ID
 * @returns Deletion success
 */
async function deleteSavedCart(cartId, customerId) {
    try {
        const cart = await SavedCart.findOne({
            where: { id: cartId, customerId },
        });
        if (!cart) {
            throw new common_1.NotFoundException(`Cart ${cartId} not found`);
        }
        await cart.destroy();
        return true;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to delete cart: ${error.message}`);
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
async function updateSavedCartItems(cartId, customerId, items) {
    try {
        const cart = await SavedCart.findOne({
            where: { id: cartId, customerId },
        });
        if (!cart) {
            throw new common_1.NotFoundException(`Cart ${cartId} not found`);
        }
        const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        cart.items = items;
        cart.totalValue = totalValue;
        cart.itemCount = itemCount;
        cart.lastAccessedAt = new Date();
        await cart.save();
        return cart;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to update cart items: ${error.message}`);
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
async function mergeCartsOnLogin(mergeData) {
    try {
        const guestCart = await SavedCart.findByPk(mergeData.guestCartId);
        const userCart = await SavedCart.findByPk(mergeData.userCartId);
        if (!guestCart) {
            throw new common_1.NotFoundException(`Guest cart ${mergeData.guestCartId} not found`);
        }
        if (!userCart) {
            throw new common_1.NotFoundException(`User cart ${mergeData.userCartId} not found`);
        }
        let mergedItems = [];
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to merge carts: ${error.message}`);
    }
}
/**
 * Combine cart items from two carts
 *
 * @param items1 - First cart items
 * @param items2 - Second cart items
 * @returns Combined items with merged quantities
 */
function combineCartItems(items1, items2) {
    const itemMap = new Map();
    // Add items from first cart
    items1.forEach(item => {
        const key = `${item.productId}_${JSON.stringify(item.attributes || {})}`;
        itemMap.set(key, { ...item });
    });
    // Merge items from second cart
    items2.forEach(item => {
        const key = `${item.productId}_${JSON.stringify(item.attributes || {})}`;
        if (itemMap.has(key)) {
            const existing = itemMap.get(key);
            existing.quantity += item.quantity;
            existing.totalPrice = existing.quantity * existing.unitPrice;
            existing.savedAt = new Date();
        }
        else {
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
async function convertGuestCartToUserCart(guestCartId, customerId) {
    try {
        const cart = await SavedCart.findByPk(guestCartId);
        if (!cart) {
            throw new common_1.NotFoundException(`Guest cart ${guestCartId} not found`);
        }
        cart.customerId = customerId;
        cart.sessionId = null;
        cart.cartType = SavedCartType.ACTIVE;
        cart.lastAccessedAt = new Date();
        await cart.save();
        return cart;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to convert guest cart: ${error.message}`);
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
async function processExpiredCarts() {
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to process expired carts: ${error.message}`);
    }
}
/**
 * Send cart expiration warnings
 *
 * @returns Count of warnings sent
 */
async function sendCartExpirationWarnings() {
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to send expiration warnings: ${error.message}`);
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
async function extendCartExpiration(cartId, customerId, extensionDays) {
    try {
        const cart = await SavedCart.findOne({
            where: { id: cartId, customerId },
        });
        if (!cart) {
            throw new common_1.NotFoundException(`Cart ${cartId} not found`);
        }
        const currentExpiry = cart.expiresAt || new Date();
        cart.expiresAt = new Date(currentExpiry.getTime() + extensionDays * 24 * 60 * 60 * 1000);
        await cart.save();
        return cart;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to extend cart expiration: ${error.message}`);
    }
}
/**
 * Send cart expiration notification (helper function)
 *
 * @param cart - Cart to notify about
 * @param daysRemaining - Days until expiration
 */
async function sendCartExpirationNotification(cart, daysRemaining) {
    // Implementation would integrate with notification service
    common_1.Logger.log(`Cart expiration notification: ${cart.id} expires in ${daysRemaining} days`);
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
async function createWishlist(wishlistData) {
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create wishlist: ${error.message}`);
    }
}
/**
 * Add item to wishlist
 *
 * @param itemData - Item data
 * @returns Created wishlist item
 */
async function addItemToWishlist(itemData) {
    try {
        const wishlist = await Wishlist.findByPk(itemData.wishlistId);
        if (!wishlist) {
            throw new common_1.NotFoundException(`Wishlist ${itemData.wishlistId} not found`);
        }
        // Check if item already exists
        const existingItem = await WishlistItem.findOne({
            where: {
                wishlistId: itemData.wishlistId,
                productId: itemData.productId,
            },
        });
        if (existingItem) {
            throw new common_1.ConflictException('Item already exists in wishlist');
        }
        // Fetch product details (mock implementation - would integrate with product service)
        const productDetails = {
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to add item to wishlist: ${error.message}`);
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
async function removeItemFromWishlist(wishlistId, itemId, customerId) {
    try {
        const wishlist = await Wishlist.findOne({
            where: { id: wishlistId, customerId },
        });
        if (!wishlist) {
            throw new common_1.NotFoundException(`Wishlist ${wishlistId} not found`);
        }
        const item = await WishlistItem.findOne({
            where: { id: itemId, wishlistId },
        });
        if (!item) {
            throw new common_1.NotFoundException(`Item ${itemId} not found`);
        }
        await item.destroy();
        // Update wishlist totals
        await updateWishlistTotals(wishlistId);
        // Track event
        await trackWishlistEvent(wishlistId, WishlistEventType.ITEM_REMOVED, customerId, {
            productId: item.productId,
        });
        return true;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to remove item from wishlist: ${error.message}`);
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
async function updateWishlist(wishlistId, customerId, updates) {
    try {
        const wishlist = await Wishlist.findOne({
            where: { id: wishlistId, customerId },
        });
        if (!wishlist) {
            throw new common_1.NotFoundException(`Wishlist ${wishlistId} not found`);
        }
        if (updates.name)
            wishlist.name = updates.name;
        if (updates.description !== undefined)
            wishlist.description = updates.description;
        if (updates.visibility) {
            wishlist.visibility = updates.visibility;
            if (updates.visibility !== WishlistVisibility.PRIVATE && !wishlist.shareToken) {
                wishlist.shareToken = generateShareToken();
            }
        }
        if (updates.sharingSettings)
            wishlist.sharingSettings = updates.sharingSettings;
        if (updates.occasion !== undefined)
            wishlist.occasion = updates.occasion;
        if (updates.eventDate !== undefined)
            wishlist.eventDate = updates.eventDate;
        await wishlist.save();
        return wishlist;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to update wishlist: ${error.message}`);
    }
}
/**
 * Delete wishlist
 *
 * @param wishlistId - Wishlist ID
 * @param customerId - Customer ID
 * @returns Deletion success
 */
async function deleteWishlist(wishlistId, customerId) {
    try {
        const wishlist = await Wishlist.findOne({
            where: { id: wishlistId, customerId },
        });
        if (!wishlist) {
            throw new common_1.NotFoundException(`Wishlist ${wishlistId} not found`);
        }
        // Delete all items first
        await WishlistItem.destroy({ where: { wishlistId } });
        // Delete wishlist
        await wishlist.destroy();
        return true;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to delete wishlist: ${error.message}`);
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
async function shareWishlist(wishlistId, customerId, visibility) {
    try {
        const wishlist = await Wishlist.findOne({
            where: { id: wishlistId, customerId },
        });
        if (!wishlist) {
            throw new common_1.NotFoundException(`Wishlist ${wishlistId} not found`);
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to share wishlist: ${error.message}`);
    }
}
/**
 * Get wishlist by share token
 *
 * @param shareToken - Share token
 * @param viewerId - Viewer customer ID (optional)
 * @returns Wishlist with items
 */
async function getWishlistByShareToken(shareToken, viewerId) {
    try {
        const wishlist = await Wishlist.findOne({
            where: { shareToken },
            include: [{ model: WishlistItem, as: 'items' }],
        });
        if (!wishlist) {
            throw new common_1.NotFoundException('Wishlist not found');
        }
        // Check password protection if required
        if (wishlist.sharingSettings?.requirePassword) {
            // Password validation would be handled separately
            throw new common_1.UnprocessableEntityException('Password required to view this wishlist');
        }
        // Update view count
        wishlist.viewCount += 1;
        wishlist.lastViewedAt = new Date();
        await wishlist.save();
        // Track view event
        await trackWishlistEvent(wishlist.id, WishlistEventType.VIEWED, viewerId);
        return wishlist;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to get shared wishlist: ${error.message}`);
    }
}
/**
 * Revoke wishlist sharing
 *
 * @param wishlistId - Wishlist ID
 * @param customerId - Customer ID
 * @returns Updated wishlist
 */
async function revokeWishlistSharing(wishlistId, customerId) {
    try {
        const wishlist = await Wishlist.findOne({
            where: { id: wishlistId, customerId },
        });
        if (!wishlist) {
            throw new common_1.NotFoundException(`Wishlist ${wishlistId} not found`);
        }
        wishlist.visibility = WishlistVisibility.PRIVATE;
        wishlist.shareToken = null;
        await wishlist.save();
        return wishlist;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to revoke wishlist sharing: ${error.message}`);
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
async function moveCartItemToWishlist(cartId, wishlistId, productId, customerId) {
    try {
        const cart = await SavedCart.findOne({
            where: { id: cartId, customerId },
        });
        if (!cart) {
            throw new common_1.NotFoundException(`Cart ${cartId} not found`);
        }
        const cartItem = cart.items.find(item => item.productId === productId);
        if (!cartItem) {
            throw new common_1.NotFoundException(`Product ${productId} not found in cart`);
        }
        // Add to wishlist
        const wishlistItemData = {
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to move item to wishlist: ${error.message}`);
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
async function moveWishlistItemToCart(wishlistId, cartId, itemId, customerId) {
    try {
        const wishlistItem = await WishlistItem.findOne({
            where: { id: itemId, wishlistId },
        });
        if (!wishlistItem) {
            throw new common_1.NotFoundException(`Wishlist item ${itemId} not found`);
        }
        const cart = await SavedCart.findOne({
            where: { id: cartId, customerId },
        });
        if (!cart) {
            throw new common_1.NotFoundException(`Cart ${cartId} not found`);
        }
        // Add to cart
        const cartItem = {
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to move item to cart: ${error.message}`);
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
async function moveAllWishlistItemsToCart(wishlistId, cartId, customerId) {
    try {
        const items = await WishlistItem.findAll({
            where: { wishlistId },
        });
        const cart = await SavedCart.findOne({
            where: { id: cartId, customerId },
        });
        if (!cart) {
            throw new common_1.NotFoundException(`Cart ${cartId} not found`);
        }
        for (const item of items) {
            await moveWishlistItemToCart(wishlistId, cartId, item.id, customerId);
        }
        return cart;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to move all items to cart: ${error.message}`);
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
async function subscribeToWishlistNotifications(notificationData) {
    try {
        const wishlist = await Wishlist.findByPk(notificationData.wishlistId);
        if (!wishlist) {
            throw new common_1.NotFoundException(`Wishlist ${notificationData.wishlistId} not found`);
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to subscribe to notifications: ${error.message}`);
    }
}
/**
 * Check for price drops and send notifications
 *
 * @returns Count of notifications sent
 */
async function checkPriceDropsAndNotify() {
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
                    await sendWishlistNotification(subscription, WishlistNotificationType.PRICE_DROP, {
                        productId: item.productId,
                        productName: item.productDetails.productName,
                        oldPrice: item.priceAtAddition,
                        newPrice: item.currentPrice,
                        priceDropPercent,
                    });
                    notificationCount++;
                }
            }
        }
        return notificationCount;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to check price drops: ${error.message}`);
    }
}
/**
 * Check for back in stock items and notify
 *
 * @returns Count of notifications sent
 */
async function checkBackInStockAndNotify() {
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
                    await sendWishlistNotification(subscription, WishlistNotificationType.BACK_IN_STOCK, {
                        productId: item.productId,
                        productName: item.productDetails.productName,
                    });
                    notificationCount++;
                }
            }
        }
        return notificationCount;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to check back in stock: ${error.message}`);
    }
}
/**
 * Send wishlist notification (helper function)
 *
 * @param subscription - Notification subscription
 * @param type - Notification type
 * @param data - Notification data
 */
async function sendWishlistNotification(subscription, type, data) {
    // Implementation would integrate with notification service
    common_1.Logger.log(`Wishlist notification: ${type} for customer ${subscription.customerId}`, data);
}
/**
 * Check product availability (helper function)
 *
 * @param productId - Product ID
 * @returns Availability status
 */
async function checkProductAvailability(productId) {
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
async function getWishlistAnalytics(wishlistId) {
    try {
        const wishlist = await Wishlist.findByPk(wishlistId, {
            include: [{ model: WishlistItem, as: 'items' }],
        });
        if (!wishlist) {
            throw new common_1.NotFoundException(`Wishlist ${wishlistId} not found`);
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
        const analytics = {
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to get wishlist analytics: ${error.message}`);
    }
}
/**
 * Get cart analytics
 *
 * @param cartId - Cart ID
 * @returns Cart analytics
 */
async function getCartAnalytics(cartId) {
    try {
        const cart = await SavedCart.findByPk(cartId);
        if (!cart) {
            throw new common_1.NotFoundException(`Cart ${cartId} not found`);
        }
        const daysSinceCreation = Math.floor((Date.now() - cart.createdAt.getTime()) / (24 * 60 * 60 * 1000));
        const daysSinceLastModified = Math.floor((Date.now() - cart.updatedAt.getTime()) / (24 * 60 * 60 * 1000));
        const analytics = {
            totalValue: cart.totalValue,
            itemCount: cart.itemCount,
            averageItemPrice: cart.itemCount > 0 ? cart.totalValue / cart.itemCount : 0,
            lastModified: cart.updatedAt,
            daysSinceCreation,
            daysSinceLastModified,
            estimatedConversionProbability: calculateConversionProbability(cart),
        };
        return analytics;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to get cart analytics: ${error.message}`);
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
async function trackWishlistEvent(wishlistId, eventType, customerId, eventData) {
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
    }
    catch (error) {
        common_1.Logger.error(`Failed to track wishlist event: ${error.message}`);
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
function generateShareToken() {
    return `wl_${Math.random().toString(36).substring(2, 15)}${Date.now().toString(36)}`;
}
/**
 * Update wishlist totals
 *
 * @param wishlistId - Wishlist ID
 */
async function updateWishlistTotals(wishlistId) {
    try {
        const items = await WishlistItem.findAll({ where: { wishlistId } });
        const wishlist = await Wishlist.findByPk(wishlistId);
        if (wishlist) {
            wishlist.totalValue = items.reduce((sum, item) => sum + item.currentPrice * item.quantity, 0);
            wishlist.itemCount = items.length;
            await wishlist.save();
        }
    }
    catch (error) {
        common_1.Logger.error(`Failed to update wishlist totals: ${error.message}`);
    }
}
/**
 * Calculate conversion probability for cart
 *
 * @param cart - Saved cart
 * @returns Estimated conversion probability (0-100)
 */
function calculateConversionProbability(cart) {
    const daysSinceCreation = Math.floor((Date.now() - cart.createdAt.getTime()) / (24 * 60 * 60 * 1000));
    const daysSinceLastAccess = Math.floor((Date.now() - cart.lastAccessedAt.getTime()) / (24 * 60 * 60 * 1000));
    // Simple heuristic - would use ML model in production
    let probability = 50;
    if (daysSinceCreation < 1)
        probability += 20;
    else if (daysSinceCreation < 3)
        probability += 10;
    else if (daysSinceCreation > 7)
        probability -= 20;
    if (daysSinceLastAccess < 1)
        probability += 15;
    else if (daysSinceLastAccess > 7)
        probability -= 25;
    if (cart.itemCount > 3)
        probability += 10;
    if (cart.totalValue > 100)
        probability += 10;
    return Math.max(0, Math.min(100, probability));
}
//# sourceMappingURL=saved-carts-wishlists-kit.js.map