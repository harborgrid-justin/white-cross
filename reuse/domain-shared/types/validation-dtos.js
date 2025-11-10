"use strict";
/**
 * File: /reuse/domain-shared/types/validation-dtos.ts
 * Purpose: Common validation DTO base classes and decorators for domain kits
 *
 * Provides reusable DTO base classes and validation patterns used across
 * construction, consulting, and engineer domains.
 *
 * @module DomainShared/ValidationDTOs
 * @version 1.0.0
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkDeleteDTO = exports.BulkOperationDTO = exports.AttachmentDTO = exports.ListQueryDTO = exports.SearchQueryDTO = exports.SortQueryDTO = exports.PaginationQueryDTO = exports.DateRangeDTO = exports.MoneyAmountDTO = exports.ContactInfoDTO = exports.AddressDTO = exports.UpdateDTO = exports.CreateDTO = exports.BaseDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
/**
 * Base DTO with common audit fields
 */
let BaseDTO = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    return _a = class BaseDTO {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.createdAt = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                this.createdBy = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
                this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
                __runInitializers(this, _updatedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Entity UUID' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _createdAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Creation timestamp' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _updatedAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Last update timestamp' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _createdBy_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'UUID of user who created the entity' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _updatedBy_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'UUID of user who last updated the entity' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
            __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.BaseDTO = BaseDTO;
/**
 * Base create DTO - excludes id and audit timestamps
 */
let CreateDTO = (() => {
    var _a;
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class CreateDTO {
            constructor() {
                this.metadata = __runInitializers(this, _metadata_initializers, void 0);
                this.notes = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Optional metadata as JSON object' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Optional notes or comments' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(5000)];
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateDTO = CreateDTO;
/**
 * Base update DTO - all fields optional except id
 */
let UpdateDTO = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class UpdateDTO {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.metadata = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.notes = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entity UUID to update' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Optional metadata as JSON object' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Optional notes or comments' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(5000)];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateDTO = UpdateDTO;
/**
 * Address validation DTO
 */
let AddressDTO = (() => {
    var _a;
    let _street1_decorators;
    let _street1_initializers = [];
    let _street1_extraInitializers = [];
    let _street2_decorators;
    let _street2_initializers = [];
    let _street2_extraInitializers = [];
    let _city_decorators;
    let _city_initializers = [];
    let _city_extraInitializers = [];
    let _state_decorators;
    let _state_initializers = [];
    let _state_extraInitializers = [];
    let _postalCode_decorators;
    let _postalCode_initializers = [];
    let _postalCode_extraInitializers = [];
    let _country_decorators;
    let _country_initializers = [];
    let _country_extraInitializers = [];
    let _latitude_decorators;
    let _latitude_initializers = [];
    let _latitude_extraInitializers = [];
    let _longitude_decorators;
    let _longitude_initializers = [];
    let _longitude_extraInitializers = [];
    return _a = class AddressDTO {
            constructor() {
                this.street1 = __runInitializers(this, _street1_initializers, void 0);
                this.street2 = (__runInitializers(this, _street1_extraInitializers), __runInitializers(this, _street2_initializers, void 0));
                this.city = (__runInitializers(this, _street2_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.state = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.postalCode = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _postalCode_initializers, void 0));
                this.country = (__runInitializers(this, _postalCode_extraInitializers), __runInitializers(this, _country_initializers, void 0));
                this.latitude = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                __runInitializers(this, _longitude_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _street1_decorators = [(0, swagger_1.ApiProperty)({ description: 'Street address line 1' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _street2_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Street address line 2' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(255)];
            _city_decorators = [(0, swagger_1.ApiProperty)({ description: 'City' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(100)];
            _state_decorators = [(0, swagger_1.ApiProperty)({ description: 'State or province' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(100)];
            _postalCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Postal or ZIP code' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(20)];
            _country_decorators = [(0, swagger_1.ApiProperty)({ description: 'Country' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(100)];
            _latitude_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Latitude coordinate' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-90), (0, class_validator_1.Max)(90)];
            _longitude_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Longitude coordinate' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-180), (0, class_validator_1.Max)(180)];
            __esDecorate(null, null, _street1_decorators, { kind: "field", name: "street1", static: false, private: false, access: { has: obj => "street1" in obj, get: obj => obj.street1, set: (obj, value) => { obj.street1 = value; } }, metadata: _metadata }, _street1_initializers, _street1_extraInitializers);
            __esDecorate(null, null, _street2_decorators, { kind: "field", name: "street2", static: false, private: false, access: { has: obj => "street2" in obj, get: obj => obj.street2, set: (obj, value) => { obj.street2 = value; } }, metadata: _metadata }, _street2_initializers, _street2_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: obj => "city" in obj, get: obj => obj.city, set: (obj, value) => { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: obj => "state" in obj, get: obj => obj.state, set: (obj, value) => { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _postalCode_decorators, { kind: "field", name: "postalCode", static: false, private: false, access: { has: obj => "postalCode" in obj, get: obj => obj.postalCode, set: (obj, value) => { obj.postalCode = value; } }, metadata: _metadata }, _postalCode_initializers, _postalCode_extraInitializers);
            __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: obj => "country" in obj, get: obj => obj.country, set: (obj, value) => { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: obj => "latitude" in obj, get: obj => obj.latitude, set: (obj, value) => { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: obj => "longitude" in obj, get: obj => obj.longitude, set: (obj, value) => { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AddressDTO = AddressDTO;
/**
 * Contact information validation DTO
 */
let ContactInfoDTO = (() => {
    var _a;
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _mobile_decorators;
    let _mobile_initializers = [];
    let _mobile_extraInitializers = [];
    let _fax_decorators;
    let _fax_initializers = [];
    let _fax_extraInitializers = [];
    let _website_decorators;
    let _website_initializers = [];
    let _website_extraInitializers = [];
    return _a = class ContactInfoDTO {
            constructor() {
                this.email = __runInitializers(this, _email_initializers, void 0);
                this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.mobile = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _mobile_initializers, void 0));
                this.fax = (__runInitializers(this, _mobile_extraInitializers), __runInitializers(this, _fax_initializers, void 0));
                this.website = (__runInitializers(this, _fax_extraInitializers), __runInitializers(this, _website_initializers, void 0));
                __runInitializers(this, _website_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _email_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Email address' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)()];
            _phone_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Phone number' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Matches)(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })];
            _mobile_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Mobile number' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Matches)(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid mobile number format' })];
            _fax_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Fax number' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _website_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Website URL' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUrl)()];
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _mobile_decorators, { kind: "field", name: "mobile", static: false, private: false, access: { has: obj => "mobile" in obj, get: obj => obj.mobile, set: (obj, value) => { obj.mobile = value; } }, metadata: _metadata }, _mobile_initializers, _mobile_extraInitializers);
            __esDecorate(null, null, _fax_decorators, { kind: "field", name: "fax", static: false, private: false, access: { has: obj => "fax" in obj, get: obj => obj.fax, set: (obj, value) => { obj.fax = value; } }, metadata: _metadata }, _fax_initializers, _fax_extraInitializers);
            __esDecorate(null, null, _website_decorators, { kind: "field", name: "website", static: false, private: false, access: { has: obj => "website" in obj, get: obj => obj.website, set: (obj, value) => { obj.website = value; } }, metadata: _metadata }, _website_initializers, _website_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ContactInfoDTO = ContactInfoDTO;
/**
 * Money amount validation DTO
 */
let MoneyAmountDTO = (() => {
    var _a;
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    return _a = class MoneyAmountDTO {
            constructor() {
                this.amount = __runInitializers(this, _amount_initializers, void 0);
                this.currency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                __runInitializers(this, _currency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _amount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Monetary amount' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsPositive)()];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'ISO 4217 currency code', example: 'USD' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(3), (0, class_validator_1.Matches)(/^[A-Z]{3}$/, { message: 'Invalid currency code' })];
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.MoneyAmountDTO = MoneyAmountDTO;
/**
 * Date range validation DTO
 */
let DateRangeDTO = (() => {
    var _a;
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    return _a = class DateRangeDTO {
            constructor() {
                this.startDate = __runInitializers(this, _startDate_initializers, void 0);
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                __runInitializers(this, _endDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DateRangeDTO = DateRangeDTO;
/**
 * Pagination query DTO
 */
let PaginationQueryDTO = (() => {
    var _a;
    let _page_decorators;
    let _page_initializers = [];
    let _page_extraInitializers = [];
    let _limit_decorators;
    let _limit_initializers = [];
    let _limit_extraInitializers = [];
    return _a = class PaginationQueryDTO {
            constructor() {
                this.page = __runInitializers(this, _page_initializers, 1);
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 20));
                __runInitializers(this, _limit_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Page number (1-indexed)', default: 1, minimum: 1 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(() => Number), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', default: 20, minimum: 1, maximum: 100 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(() => Number), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100)];
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: obj => "page" in obj, get: obj => obj.page, set: (obj, value) => { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: obj => "limit" in obj, get: obj => obj.limit, set: (obj, value) => { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PaginationQueryDTO = PaginationQueryDTO;
/**
 * Sort query DTO
 */
let SortQueryDTO = (() => {
    var _a;
    let _sortBy_decorators;
    let _sortBy_initializers = [];
    let _sortBy_extraInitializers = [];
    let _sortOrder_decorators;
    let _sortOrder_initializers = [];
    let _sortOrder_extraInitializers = [];
    return _a = class SortQueryDTO {
            constructor() {
                this.sortBy = __runInitializers(this, _sortBy_initializers, void 0);
                this.sortOrder = (__runInitializers(this, _sortBy_extraInitializers), __runInitializers(this, _sortOrder_initializers, 'ASC'));
                __runInitializers(this, _sortOrder_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _sortBy_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Field to sort by' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sortOrder_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Sort order', enum: ['ASC', 'DESC'], default: 'ASC' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['ASC', 'DESC'])];
            __esDecorate(null, null, _sortBy_decorators, { kind: "field", name: "sortBy", static: false, private: false, access: { has: obj => "sortBy" in obj, get: obj => obj.sortBy, set: (obj, value) => { obj.sortBy = value; } }, metadata: _metadata }, _sortBy_initializers, _sortBy_extraInitializers);
            __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: obj => "sortOrder" in obj, get: obj => obj.sortOrder, set: (obj, value) => { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SortQueryDTO = SortQueryDTO;
/**
 * Search query DTO
 */
let SearchQueryDTO = (() => {
    var _a;
    let _search_decorators;
    let _search_initializers = [];
    let _search_extraInitializers = [];
    return _a = class SearchQueryDTO {
            constructor() {
                this.search = __runInitializers(this, _search_initializers, void 0);
                __runInitializers(this, _search_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _search_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Search query string' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(255)];
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: obj => "search" in obj, get: obj => obj.search, set: (obj, value) => { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SearchQueryDTO = SearchQueryDTO;
/**
 * Combined list query DTO with pagination, sorting, and search
 */
let ListQueryDTO = (() => {
    var _a;
    let _classSuper = PaginationQueryDTO;
    let _sortBy_decorators;
    let _sortBy_initializers = [];
    let _sortBy_extraInitializers = [];
    let _sortOrder_decorators;
    let _sortOrder_initializers = [];
    let _sortOrder_extraInitializers = [];
    let _search_decorators;
    let _search_initializers = [];
    let _search_extraInitializers = [];
    return _a = class ListQueryDTO extends _classSuper {
            constructor() {
                super(...arguments);
                this.sortBy = __runInitializers(this, _sortBy_initializers, void 0);
                this.sortOrder = (__runInitializers(this, _sortBy_extraInitializers), __runInitializers(this, _sortOrder_initializers, 'ASC'));
                this.search = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _search_initializers, void 0));
                __runInitializers(this, _search_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _sortBy_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Field to sort by' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sortOrder_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Sort order', enum: ['ASC', 'DESC'], default: 'ASC' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['ASC', 'DESC'])];
            _search_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Search query string' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(255)];
            __esDecorate(null, null, _sortBy_decorators, { kind: "field", name: "sortBy", static: false, private: false, access: { has: obj => "sortBy" in obj, get: obj => obj.sortBy, set: (obj, value) => { obj.sortBy = value; } }, metadata: _metadata }, _sortBy_initializers, _sortBy_extraInitializers);
            __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: obj => "sortOrder" in obj, get: obj => obj.sortOrder, set: (obj, value) => { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: obj => "search" in obj, get: obj => obj.search, set: (obj, value) => { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ListQueryDTO = ListQueryDTO;
/**
 * File attachment DTO
 */
let AttachmentDTO = (() => {
    var _a;
    let _fileName_decorators;
    let _fileName_initializers = [];
    let _fileName_extraInitializers = [];
    let _fileSize_decorators;
    let _fileSize_initializers = [];
    let _fileSize_extraInitializers = [];
    let _mimeType_decorators;
    let _mimeType_initializers = [];
    let _mimeType_extraInitializers = [];
    let _storageKey_decorators;
    let _storageKey_initializers = [];
    let _storageKey_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    return _a = class AttachmentDTO {
            constructor() {
                this.fileName = __runInitializers(this, _fileName_initializers, void 0);
                this.fileSize = (__runInitializers(this, _fileName_extraInitializers), __runInitializers(this, _fileSize_initializers, void 0));
                this.mimeType = (__runInitializers(this, _fileSize_extraInitializers), __runInitializers(this, _mimeType_initializers, void 0));
                this.storageKey = (__runInitializers(this, _mimeType_extraInitializers), __runInitializers(this, _storageKey_initializers, void 0));
                this.description = (__runInitializers(this, _storageKey_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fileName_decorators = [(0, swagger_1.ApiProperty)({ description: 'File name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _fileSize_decorators = [(0, swagger_1.ApiProperty)({ description: 'File size in bytes' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsPositive)()];
            _mimeType_decorators = [(0, swagger_1.ApiProperty)({ description: 'MIME type' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _storageKey_decorators = [(0, swagger_1.ApiProperty)({ description: 'Storage key or path' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'File description' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            __esDecorate(null, null, _fileName_decorators, { kind: "field", name: "fileName", static: false, private: false, access: { has: obj => "fileName" in obj, get: obj => obj.fileName, set: (obj, value) => { obj.fileName = value; } }, metadata: _metadata }, _fileName_initializers, _fileName_extraInitializers);
            __esDecorate(null, null, _fileSize_decorators, { kind: "field", name: "fileSize", static: false, private: false, access: { has: obj => "fileSize" in obj, get: obj => obj.fileSize, set: (obj, value) => { obj.fileSize = value; } }, metadata: _metadata }, _fileSize_initializers, _fileSize_extraInitializers);
            __esDecorate(null, null, _mimeType_decorators, { kind: "field", name: "mimeType", static: false, private: false, access: { has: obj => "mimeType" in obj, get: obj => obj.mimeType, set: (obj, value) => { obj.mimeType = value; } }, metadata: _metadata }, _mimeType_initializers, _mimeType_extraInitializers);
            __esDecorate(null, null, _storageKey_decorators, { kind: "field", name: "storageKey", static: false, private: false, access: { has: obj => "storageKey" in obj, get: obj => obj.storageKey, set: (obj, value) => { obj.storageKey = value; } }, metadata: _metadata }, _storageKey_initializers, _storageKey_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AttachmentDTO = AttachmentDTO;
/**
 * Bulk operation DTO
 */
let BulkOperationDTO = (() => {
    var _a;
    let _ids_decorators;
    let _ids_initializers = [];
    let _ids_extraInitializers = [];
    return _a = class BulkOperationDTO {
            constructor() {
                this.ids = __runInitializers(this, _ids_initializers, void 0);
                __runInitializers(this, _ids_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _ids_decorators = [(0, swagger_1.ApiProperty)({ description: 'Array of entity UUIDs to operate on', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)(undefined, { each: true }), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _ids_decorators, { kind: "field", name: "ids", static: false, private: false, access: { has: obj => "ids" in obj, get: obj => obj.ids, set: (obj, value) => { obj.ids = value; } }, metadata: _metadata }, _ids_initializers, _ids_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.BulkOperationDTO = BulkOperationDTO;
/**
 * Bulk delete DTO
 */
let BulkDeleteDTO = (() => {
    var _a;
    let _classSuper = BulkOperationDTO;
    let _hardDelete_decorators;
    let _hardDelete_initializers = [];
    let _hardDelete_extraInitializers = [];
    return _a = class BulkDeleteDTO extends _classSuper {
            constructor() {
                super(...arguments);
                this.hardDelete = __runInitializers(this, _hardDelete_initializers, false);
                __runInitializers(this, _hardDelete_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _hardDelete_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Perform hard delete instead of soft delete', default: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _hardDelete_decorators, { kind: "field", name: "hardDelete", static: false, private: false, access: { has: obj => "hardDelete" in obj, get: obj => obj.hardDelete, set: (obj, value) => { obj.hardDelete = value; } }, metadata: _metadata }, _hardDelete_initializers, _hardDelete_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.BulkDeleteDTO = BulkDeleteDTO;
//# sourceMappingURL=validation-dtos.js.map