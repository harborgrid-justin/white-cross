"use strict";
/**
 * LOC: FININT4567890
 * File: /reuse/financial/financial-integration-exchange-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../auditing-utils.ts
 *   - ../authentication-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial integration modules
 *   - Payment gateway services
 *   - Bank API connectors
 *   - ERP synchronization services
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialIntegrationController = exports.IntegrationLoggingInterceptor = exports.IntegrationAuthGuard = exports.createDataImportJobModel = exports.createERPIntegrationModel = exports.createPaymentTransactionModel = exports.createPaymentGatewayModel = exports.createBankTransactionModel = exports.createBankConnectionModel = exports.DataImportDto = exports.PaymentTransactionDto = exports.BankConnectionDto = void 0;
exports.createBankConnection = createBankConnection;
exports.encryptCredentials = encryptCredentials;
exports.decryptCredentials = decryptCredentials;
exports.getEncryptionKey = getEncryptionKey;
exports.testBankConnection = testBankConnection;
exports.createBankAPIClient = createBankAPIClient;
exports.getOAuth2Token = getOAuth2Token;
exports.syncBankTransactions = syncBankTransactions;
exports.parseBankTransactions = parseBankTransactions;
exports.getBankConnectionById = getBankConnectionById;
exports.createPaymentGateway = createPaymentGateway;
exports.testPaymentGateway = testPaymentGateway;
exports.createPaymentGatewayClient = createPaymentGatewayClient;
exports.processPaymentTransaction = processPaymentTransaction;
exports.getPaymentGatewayById = getPaymentGatewayById;
exports.getFeeStructure = getFeeStructure;
exports.calculateProcessingFee = calculateProcessingFee;
exports.refundPaymentTransaction = refundPaymentTransaction;
exports.getPaymentTransactionById = getPaymentTransactionById;
exports.createERPIntegration = createERPIntegration;
exports.testERPConnection = testERPConnection;
exports.createERPAPIClient = createERPAPIClient;
exports.syncERPData = syncERPData;
exports.syncERPModule = syncERPModule;
exports.fetchERPEntity = fetchERPEntity;
exports.transformERPData = transformERPData;
exports.applyTransformation = applyTransformation;
exports.getERPIntegrationById = getERPIntegrationById;
exports.createDataImportJob = createDataImportJob;
exports.queueImportJob = queueImportJob;
exports.processImportJob = processImportJob;
exports.readImportData = readImportData;
exports.readFileData = readFileData;
exports.parseCSV = parseCSV;
exports.parseXML = parseXML;
exports.readAPIData = readAPIData;
exports.readSFTPData = readSFTPData;
exports.importRecord = importRecord;
exports.getImportJobById = getImportJobById;
exports.createDataExportJob = createDataExportJob;
exports.queueExportJob = queueExportJob;
exports.processWebhookDelivery = processWebhookDelivery;
exports.generateWebhookSignature = generateWebhookSignature;
exports.retryWebhookDelivery = retryWebhookDelivery;
exports.getWebhookById = getWebhookById;
exports.generateUUID = generateUUID;
const sequelize_1 = require("sequelize");
const axios_1 = __importDefault(require("axios"));
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const operators_1 = require("rxjs/operators");
let BankConnectionDto = (() => {
    var _a;
    let _bankName_decorators;
    let _bankName_initializers = [];
    let _bankName_extraInitializers = [];
    let _bankCode_decorators;
    let _bankCode_initializers = [];
    let _bankCode_extraInitializers = [];
    let _connectionType_decorators;
    let _connectionType_initializers = [];
    let _connectionType_extraInitializers = [];
    let _apiEndpoint_decorators;
    let _apiEndpoint_initializers = [];
    let _apiEndpoint_extraInitializers = [];
    let _authType_decorators;
    let _authType_initializers = [];
    let _authType_extraInitializers = [];
    let _accountNumbers_decorators;
    let _accountNumbers_initializers = [];
    let _accountNumbers_extraInitializers = [];
    let _syncFrequency_decorators;
    let _syncFrequency_initializers = [];
    let _syncFrequency_extraInitializers = [];
    return _a = class BankConnectionDto {
            constructor() {
                this.bankName = __runInitializers(this, _bankName_initializers, void 0);
                this.bankCode = (__runInitializers(this, _bankName_extraInitializers), __runInitializers(this, _bankCode_initializers, void 0));
                this.connectionType = (__runInitializers(this, _bankCode_extraInitializers), __runInitializers(this, _connectionType_initializers, void 0));
                this.apiEndpoint = (__runInitializers(this, _connectionType_extraInitializers), __runInitializers(this, _apiEndpoint_initializers, void 0));
                this.authType = (__runInitializers(this, _apiEndpoint_extraInitializers), __runInitializers(this, _authType_initializers, void 0));
                this.accountNumbers = (__runInitializers(this, _authType_extraInitializers), __runInitializers(this, _accountNumbers_initializers, void 0));
                this.syncFrequency = (__runInitializers(this, _accountNumbers_extraInitializers), __runInitializers(this, _syncFrequency_initializers, void 0));
                __runInitializers(this, _syncFrequency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _bankName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank name' })];
            _bankCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank code (e.g., SWIFT/BIC)' })];
            _connectionType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Connection type', enum: ['api', 'sftp', 'file', 'manual'] })];
            _apiEndpoint_decorators = [(0, swagger_1.ApiProperty)({ description: 'API endpoint URL' })];
            _authType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Authentication type', enum: ['oauth2', 'api_key', 'certificate', 'basic'] })];
            _accountNumbers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account numbers' })];
            _syncFrequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sync frequency', enum: ['realtime', 'hourly', 'daily', 'weekly'] })];
            __esDecorate(null, null, _bankName_decorators, { kind: "field", name: "bankName", static: false, private: false, access: { has: obj => "bankName" in obj, get: obj => obj.bankName, set: (obj, value) => { obj.bankName = value; } }, metadata: _metadata }, _bankName_initializers, _bankName_extraInitializers);
            __esDecorate(null, null, _bankCode_decorators, { kind: "field", name: "bankCode", static: false, private: false, access: { has: obj => "bankCode" in obj, get: obj => obj.bankCode, set: (obj, value) => { obj.bankCode = value; } }, metadata: _metadata }, _bankCode_initializers, _bankCode_extraInitializers);
            __esDecorate(null, null, _connectionType_decorators, { kind: "field", name: "connectionType", static: false, private: false, access: { has: obj => "connectionType" in obj, get: obj => obj.connectionType, set: (obj, value) => { obj.connectionType = value; } }, metadata: _metadata }, _connectionType_initializers, _connectionType_extraInitializers);
            __esDecorate(null, null, _apiEndpoint_decorators, { kind: "field", name: "apiEndpoint", static: false, private: false, access: { has: obj => "apiEndpoint" in obj, get: obj => obj.apiEndpoint, set: (obj, value) => { obj.apiEndpoint = value; } }, metadata: _metadata }, _apiEndpoint_initializers, _apiEndpoint_extraInitializers);
            __esDecorate(null, null, _authType_decorators, { kind: "field", name: "authType", static: false, private: false, access: { has: obj => "authType" in obj, get: obj => obj.authType, set: (obj, value) => { obj.authType = value; } }, metadata: _metadata }, _authType_initializers, _authType_extraInitializers);
            __esDecorate(null, null, _accountNumbers_decorators, { kind: "field", name: "accountNumbers", static: false, private: false, access: { has: obj => "accountNumbers" in obj, get: obj => obj.accountNumbers, set: (obj, value) => { obj.accountNumbers = value; } }, metadata: _metadata }, _accountNumbers_initializers, _accountNumbers_extraInitializers);
            __esDecorate(null, null, _syncFrequency_decorators, { kind: "field", name: "syncFrequency", static: false, private: false, access: { has: obj => "syncFrequency" in obj, get: obj => obj.syncFrequency, set: (obj, value) => { obj.syncFrequency = value; } }, metadata: _metadata }, _syncFrequency_initializers, _syncFrequency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.BankConnectionDto = BankConnectionDto;
let PaymentTransactionDto = (() => {
    var _a;
    let _gatewayId_decorators;
    let _gatewayId_initializers = [];
    let _gatewayId_extraInitializers = [];
    let _paymentMethod_decorators;
    let _paymentMethod_initializers = [];
    let _paymentMethod_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _customerEmail_decorators;
    let _customerEmail_initializers = [];
    let _customerEmail_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class PaymentTransactionDto {
            constructor() {
                this.gatewayId = __runInitializers(this, _gatewayId_initializers, void 0);
                this.paymentMethod = (__runInitializers(this, _gatewayId_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
                this.amount = (__runInitializers(this, _paymentMethod_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.currency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.customerId = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                this.customerEmail = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _customerEmail_initializers, void 0));
                this.description = (__runInitializers(this, _customerEmail_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.metadata = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _gatewayId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Gateway ID' })];
            _paymentMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment method', enum: ['card', 'ach', 'wire', 'paypal', 'apple_pay', 'google_pay'] })];
            _amount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transaction amount' })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code' })];
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' })];
            _customerEmail_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer email' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transaction description' })];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata' })];
            __esDecorate(null, null, _gatewayId_decorators, { kind: "field", name: "gatewayId", static: false, private: false, access: { has: obj => "gatewayId" in obj, get: obj => obj.gatewayId, set: (obj, value) => { obj.gatewayId = value; } }, metadata: _metadata }, _gatewayId_initializers, _gatewayId_extraInitializers);
            __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: obj => "paymentMethod" in obj, get: obj => obj.paymentMethod, set: (obj, value) => { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _customerEmail_decorators, { kind: "field", name: "customerEmail", static: false, private: false, access: { has: obj => "customerEmail" in obj, get: obj => obj.customerEmail, set: (obj, value) => { obj.customerEmail = value; } }, metadata: _metadata }, _customerEmail_initializers, _customerEmail_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PaymentTransactionDto = PaymentTransactionDto;
let DataImportDto = (() => {
    var _a;
    let _jobType_decorators;
    let _jobType_initializers = [];
    let _jobType_extraInitializers = [];
    let _sourceType_decorators;
    let _sourceType_initializers = [];
    let _sourceType_extraInitializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _format_extraInitializers = [];
    let _sourceLocation_decorators;
    let _sourceLocation_initializers = [];
    let _sourceLocation_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class DataImportDto {
            constructor() {
                this.jobType = __runInitializers(this, _jobType_initializers, void 0);
                this.sourceType = (__runInitializers(this, _jobType_extraInitializers), __runInitializers(this, _sourceType_initializers, void 0));
                this.format = (__runInitializers(this, _sourceType_extraInitializers), __runInitializers(this, _format_initializers, void 0));
                this.sourceLocation = (__runInitializers(this, _format_extraInitializers), __runInitializers(this, _sourceLocation_initializers, void 0));
                this.metadata = (__runInitializers(this, _sourceLocation_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _jobType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Job type', enum: ['bank_statement', 'transactions', 'invoices', 'payments', 'general_ledger'] })];
            _sourceType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Source type', enum: ['file', 'api', 'database', 'sftp'] })];
            _format_decorators = [(0, swagger_1.ApiProperty)({ description: 'File format', enum: ['csv', 'excel', 'xml', 'json', 'edi', 'fixed_width'] })];
            _sourceLocation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Source location (file path, URL, etc.)' })];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata' })];
            __esDecorate(null, null, _jobType_decorators, { kind: "field", name: "jobType", static: false, private: false, access: { has: obj => "jobType" in obj, get: obj => obj.jobType, set: (obj, value) => { obj.jobType = value; } }, metadata: _metadata }, _jobType_initializers, _jobType_extraInitializers);
            __esDecorate(null, null, _sourceType_decorators, { kind: "field", name: "sourceType", static: false, private: false, access: { has: obj => "sourceType" in obj, get: obj => obj.sourceType, set: (obj, value) => { obj.sourceType = value; } }, metadata: _metadata }, _sourceType_initializers, _sourceType_extraInitializers);
            __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
            __esDecorate(null, null, _sourceLocation_decorators, { kind: "field", name: "sourceLocation", static: false, private: false, access: { has: obj => "sourceLocation" in obj, get: obj => obj.sourceLocation, set: (obj, value) => { obj.sourceLocation = value; } }, metadata: _metadata }, _sourceLocation_initializers, _sourceLocation_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DataImportDto = DataImportDto;
// ============================================================================
// SEQUELIZE MODELS (6 models)
// ============================================================================
/**
 * Sequelize model for Bank Connections - manages bank API integrations
 */
const createBankConnectionModel = (sequelize) => {
    class BankConnectionModel extends sequelize_1.Model {
    }
    BankConnectionModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        connectionId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
            comment: 'Unique connection identifier',
        },
        bankName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Bank name',
        },
        bankCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Bank code (SWIFT/BIC)',
        },
        connectionType: {
            type: sequelize_1.DataTypes.ENUM('api', 'sftp', 'file', 'manual'),
            allowNull: false,
            comment: 'Connection type',
        },
        apiEndpoint: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'API endpoint URL',
        },
        apiVersion: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'API version',
        },
        authType: {
            type: sequelize_1.DataTypes.ENUM('oauth2', 'api_key', 'certificate', 'basic'),
            allowNull: false,
            comment: 'Authentication type',
        },
        encryptedCredentials: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Encrypted credentials JSON',
        },
        accountNumbers: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of account numbers',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether connection is active',
        },
        lastSyncAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last sync timestamp',
        },
        syncFrequency: {
            type: sequelize_1.DataTypes.ENUM('realtime', 'hourly', 'daily', 'weekly'),
            allowNull: false,
            defaultValue: 'daily',
            comment: 'Sync frequency',
        },
        features: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Bank features configuration',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'bank_connections',
        timestamps: true,
        indexes: [
            { fields: ['connectionId'], unique: true },
            { fields: ['bankCode'] },
            { fields: ['isActive'] },
            { fields: ['syncFrequency'] },
        ],
    });
    return BankConnectionModel;
};
exports.createBankConnectionModel = createBankConnectionModel;
/**
 * Sequelize model for Bank Transactions - stores imported bank transactions
 */
const createBankTransactionModel = (sequelize) => {
    class BankTransactionModel extends sequelize_1.Model {
    }
    BankTransactionModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        transactionId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
            comment: 'Unique transaction identifier',
        },
        connectionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to bank connection',
        },
        accountNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Account number',
        },
        transactionType: {
            type: sequelize_1.DataTypes.ENUM('debit', 'credit', 'transfer', 'fee', 'interest'),
            allowNull: false,
            comment: 'Transaction type',
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Transaction amount',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Currency code',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Transaction description',
        },
        referenceNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Bank reference number',
        },
        valueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Value date',
        },
        postingDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Posting date',
        },
        balance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Account balance after transaction',
        },
        counterpartyName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            comment: 'Counterparty name',
        },
        counterpartyAccount: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Counterparty account number',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'posted', 'reversed', 'cancelled'),
            allowNull: false,
            defaultValue: 'posted',
            comment: 'Transaction status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
        rawData: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Raw transaction data from bank',
        },
        reconciledAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Reconciliation timestamp',
        },
        reconciledBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who reconciled transaction',
        },
    }, {
        sequelize,
        tableName: 'bank_transactions',
        timestamps: true,
        indexes: [
            { fields: ['transactionId'], unique: true },
            { fields: ['connectionId'] },
            { fields: ['accountNumber'] },
            { fields: ['referenceNumber'] },
            { fields: ['valueDate'] },
            { fields: ['postingDate'] },
            { fields: ['status'] },
            { fields: ['reconciledAt'] },
        ],
    });
    return BankTransactionModel;
};
exports.createBankTransactionModel = createBankTransactionModel;
/**
 * Sequelize model for Payment Gateways - manages payment provider integrations
 */
const createPaymentGatewayModel = (sequelize) => {
    class PaymentGatewayModel extends sequelize_1.Model {
    }
    PaymentGatewayModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        gatewayId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
            comment: 'Unique gateway identifier',
        },
        providerName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Payment provider name',
        },
        providerType: {
            type: sequelize_1.DataTypes.ENUM('stripe', 'paypal', 'square', 'authorize_net', 'braintree', 'custom'),
            allowNull: false,
            comment: 'Payment provider type',
        },
        apiEndpoint: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'API endpoint URL',
        },
        apiVersion: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'API version',
        },
        encryptedCredentials: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Encrypted credentials JSON',
        },
        supportedMethods: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Supported payment methods',
        },
        supportedCurrencies: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: ['USD'],
            comment: 'Supported currencies',
        },
        webhookUrl: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'Webhook URL for receiving events',
        },
        webhookSecret: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'Webhook secret for signature verification',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether gateway is active',
        },
        isSandbox: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether gateway is in sandbox mode',
        },
        features: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Gateway features configuration',
        },
        rateLimit: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Rate limit configuration',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'payment_gateways',
        timestamps: true,
        indexes: [
            { fields: ['gatewayId'], unique: true },
            { fields: ['providerType'] },
            { fields: ['isActive'] },
        ],
    });
    return PaymentGatewayModel;
};
exports.createPaymentGatewayModel = createPaymentGatewayModel;
/**
 * Sequelize model for Payment Transactions - stores payment transaction records
 */
const createPaymentTransactionModel = (sequelize) => {
    class PaymentTransactionModel extends sequelize_1.Model {
    }
    PaymentTransactionModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        transactionId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
            comment: 'Unique transaction identifier',
        },
        gatewayId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to payment gateway',
        },
        externalTransactionId: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            comment: 'External transaction ID from gateway',
        },
        paymentMethod: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Payment method used',
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Transaction amount',
            validate: {
                min: 0,
            },
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Currency code',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Transaction status',
        },
        customerId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Customer ID',
        },
        customerEmail: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            comment: 'Customer email',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Transaction description',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
        processingFee: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: true,
            comment: 'Processing fee charged',
        },
        netAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: true,
            comment: 'Net amount after fees',
        },
        processedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Processing timestamp',
        },
        settledAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Settlement timestamp',
        },
        errorMessage: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Error message if failed',
        },
        errorCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Error code if failed',
        },
        rawResponse: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Raw response from gateway',
        },
    }, {
        sequelize,
        tableName: 'payment_transactions',
        timestamps: true,
        indexes: [
            { fields: ['transactionId'], unique: true },
            { fields: ['gatewayId'] },
            { fields: ['externalTransactionId'] },
            { fields: ['status'] },
            { fields: ['customerId'] },
            { fields: ['createdAt'] },
        ],
    });
    return PaymentTransactionModel;
};
exports.createPaymentTransactionModel = createPaymentTransactionModel;
/**
 * Sequelize model for ERP Integrations - manages ERP system connections
 */
const createERPIntegrationModel = (sequelize) => {
    class ERPIntegrationModel extends sequelize_1.Model {
    }
    ERPIntegrationModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        integrationId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
            comment: 'Unique integration identifier',
        },
        erpSystem: {
            type: sequelize_1.DataTypes.ENUM('sap', 'oracle', 'workday', 'netsuite', 'dynamics', 'custom'),
            allowNull: false,
            comment: 'ERP system type',
        },
        erpVersion: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'ERP version',
        },
        connectionType: {
            type: sequelize_1.DataTypes.ENUM('api', 'odbc', 'file', 'middleware'),
            allowNull: false,
            comment: 'Connection type',
        },
        apiEndpoint: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'API endpoint URL',
        },
        encryptedCredentials: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Encrypted credentials JSON',
        },
        modules: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'ERP modules configuration',
        },
        syncSchedule: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Sync schedule configuration',
        },
        mappings: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Field mappings',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether integration is active',
        },
        lastSyncAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last sync timestamp',
        },
        syncStatus: {
            type: sequelize_1.DataTypes.ENUM('idle', 'running', 'error', 'completed'),
            allowNull: false,
            defaultValue: 'idle',
            comment: 'Current sync status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'erp_integrations',
        timestamps: true,
        indexes: [
            { fields: ['integrationId'], unique: true },
            { fields: ['erpSystem'] },
            { fields: ['isActive'] },
            { fields: ['syncStatus'] },
        ],
    });
    return ERPIntegrationModel;
};
exports.createERPIntegrationModel = createERPIntegrationModel;
/**
 * Sequelize model for Data Import Jobs - tracks import operations
 */
const createDataImportJobModel = (sequelize) => {
    class DataImportJobModel extends sequelize_1.Model {
    }
    DataImportJobModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        jobId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
            comment: 'Unique job identifier',
        },
        jobType: {
            type: sequelize_1.DataTypes.ENUM('bank_statement', 'transactions', 'invoices', 'payments', 'general_ledger', 'custom'),
            allowNull: false,
            comment: 'Job type',
        },
        sourceType: {
            type: sequelize_1.DataTypes.ENUM('file', 'api', 'database', 'sftp'),
            allowNull: false,
            comment: 'Source type',
        },
        sourceLocation: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'Source location',
        },
        format: {
            type: sequelize_1.DataTypes.ENUM('csv', 'excel', 'xml', 'json', 'edi', 'fixed_width', 'custom'),
            allowNull: false,
            comment: 'File format',
        },
        totalRecords: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total records to import',
        },
        processedRecords: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Records processed',
        },
        successfulRecords: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Successful records',
        },
        failedRecords: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Failed records',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('queued', 'processing', 'completed', 'failed', 'partial'),
            allowNull: false,
            defaultValue: 'queued',
            comment: 'Job status',
        },
        errors: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Import errors',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created job',
        },
        startedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Job start timestamp',
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Job completion timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'data_import_jobs',
        timestamps: true,
        indexes: [
            { fields: ['jobId'], unique: true },
            { fields: ['jobType'] },
            { fields: ['status'] },
            { fields: ['createdBy'] },
            { fields: ['createdAt'] },
        ],
    });
    return DataImportJobModel;
};
exports.createDataImportJobModel = createDataImportJobModel;
// ============================================================================
// NESTJS GUARDS & INTERCEPTORS
// ============================================================================
/**
 * Guard to verify API integration credentials
 */
let IntegrationAuthGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var IntegrationAuthGuard = _classThis = class {
        async canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const integrationId = request.headers['x-integration-id'];
            const apiKey = request.headers['x-api-key'];
            if (!integrationId || !apiKey) {
                throw new common_1.UnauthorizedException('Missing integration credentials');
            }
            const isValid = await this.validateIntegrationCredentials(integrationId, apiKey);
            if (!isValid) {
                throw new common_1.UnauthorizedException('Invalid integration credentials');
            }
            return true;
        }
        async validateIntegrationCredentials(integrationId, apiKey) {
            // Implementation would validate credentials against database
            return true;
        }
    };
    __setFunctionName(_classThis, "IntegrationAuthGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IntegrationAuthGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IntegrationAuthGuard = _classThis;
})();
exports.IntegrationAuthGuard = IntegrationAuthGuard;
/**
 * Interceptor for logging integration API calls
 */
let IntegrationLoggingInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var IntegrationLoggingInterceptor = _classThis = class {
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const integrationId = request.headers['x-integration-id'];
            const startTime = Date.now();
            return next.handle().pipe((0, operators_1.tap)({
                next: (data) => {
                    const duration = Date.now() - startTime;
                    this.logIntegrationCall(request, integrationId, data, 'success', duration);
                },
                error: (error) => {
                    const duration = Date.now() - startTime;
                    this.logIntegrationCall(request, integrationId, null, 'error', duration, error);
                },
            }));
        }
        logIntegrationCall(request, integrationId, data, status, duration, error) {
            const logEntry = {
                integrationId,
                method: request.method,
                path: request.url,
                status,
                duration,
                timestamp: new Date(),
                error: error?.message,
            };
            console.log('Integration API Call:', logEntry);
        }
    };
    __setFunctionName(_classThis, "IntegrationLoggingInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IntegrationLoggingInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IntegrationLoggingInterceptor = _classThis;
})();
exports.IntegrationLoggingInterceptor = IntegrationLoggingInterceptor;
// ============================================================================
// UTILITY FUNCTIONS (45 functions)
// ============================================================================
/**
 * 1. Create bank connection
 *
 * @param {BankConnection} connection - Bank connection data
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<BankConnection>} Created connection
 *
 * @example
 * ```typescript
 * const connection = await createBankConnection({
 *   bankName: 'Bank of America',
 *   bankCode: 'BOFAUS3N',
 *   connectionType: 'api',
 *   apiEndpoint: 'https://api.bankofamerica.com',
 *   authType: 'oauth2',
 *   credentials: encryptedCreds,
 *   accountNumbers: ['1234567890'],
 *   syncFrequency: 'daily'
 * });
 * ```
 */
async function createBankConnection(connection, transaction) {
    try {
        // Encrypt credentials before storage
        const encryptedCreds = await encryptCredentials(connection.credentials);
        const bankConnection = {
            connectionId: generateUUID(),
            bankName: connection.bankName,
            bankCode: connection.bankCode,
            connectionType: connection.connectionType,
            apiEndpoint: connection.apiEndpoint,
            apiVersion: connection.apiVersion,
            authType: connection.authType,
            credentials: encryptedCreds,
            accountNumbers: connection.accountNumbers,
            isActive: true,
            syncFrequency: connection.syncFrequency || 'daily',
            features: connection.features || [],
            metadata: connection.metadata || {},
        };
        // Test connection
        await testBankConnection(bankConnection);
        return bankConnection;
    }
    catch (error) {
        throw new Error(`Failed to create bank connection: ${error.message}`);
    }
}
/**
 * 2. Encrypt credentials for secure storage
 *
 * @param {Record<string, any>} credentials - Credentials to encrypt
 * @returns {Promise<EncryptedCredentials>} Encrypted credentials
 */
async function encryptCredentials(credentials) {
    const algorithm = 'aes-256-gcm';
    const key = await getEncryptionKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(credentials), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return {
        encryptedData: encrypted,
        algorithm,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        keyVersion: 1,
    };
}
/**
 * 3. Decrypt credentials
 *
 * @param {EncryptedCredentials} encrypted - Encrypted credentials
 * @returns {Promise<Record<string, any>>} Decrypted credentials
 */
async function decryptCredentials(encrypted) {
    const key = await getEncryptionKey();
    const iv = Buffer.from(encrypted.iv, 'hex');
    const decipher = crypto.createDecipheriv(encrypted.algorithm, key, iv);
    if (encrypted.authTag) {
        decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));
    }
    let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}
/**
 * 4. Get encryption key from environment or secrets manager
 *
 * @returns {Promise<Buffer>} Encryption key
 */
async function getEncryptionKey() {
    const key = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production';
    return crypto.scryptSync(key, 'salt', 32);
}
/**
 * 5. Test bank connection
 *
 * @param {BankConnection} connection - Bank connection to test
 * @returns {Promise<boolean>} Whether connection is successful
 */
async function testBankConnection(connection) {
    try {
        const client = await createBankAPIClient(connection);
        const response = await client.get('/health');
        return response.status === 200;
    }
    catch (error) {
        throw new Error(`Bank connection test failed: ${error.message}`);
    }
}
/**
 * 6. Create bank API client
 *
 * @param {BankConnection} connection - Bank connection
 * @returns {Promise<AxiosInstance>} Configured Axios client
 */
async function createBankAPIClient(connection) {
    const credentials = await decryptCredentials(connection.credentials);
    const config = {
        baseURL: connection.apiEndpoint,
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    // Configure auth based on type
    switch (connection.authType) {
        case 'oauth2':
            const token = await getOAuth2Token(credentials);
            config.headers['Authorization'] = `Bearer ${token}`;
            break;
        case 'api_key':
            config.headers['X-API-Key'] = credentials.apiKey;
            break;
        case 'basic':
            config.auth = {
                username: credentials.username,
                password: credentials.password,
            };
            break;
    }
    return axios_1.default.create(config);
}
/**
 * 7. Get OAuth2 token
 *
 * @param {Record<string, any>} credentials - OAuth2 credentials
 * @returns {Promise<string>} Access token
 */
async function getOAuth2Token(credentials) {
    const response = await axios_1.default.post(credentials.tokenUrl, {
        grant_type: 'client_credentials',
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
    });
    return response.data.access_token;
}
/**
 * 8. Sync bank transactions
 *
 * @param {string} connectionId - Bank connection ID
 * @param {Date} fromDate - Start date
 * @param {Date} toDate - End date
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<BankTransaction[]>} Imported transactions
 */
async function syncBankTransactions(connectionId, fromDate, toDate, transaction) {
    const connection = await getBankConnectionById(connectionId);
    if (!connection) {
        throw new common_1.NotFoundException('Bank connection not found');
    }
    const client = await createBankAPIClient(connection);
    const transactions = [];
    for (const accountNumber of connection.accountNumbers) {
        const response = await client.get('/transactions', {
            params: {
                accountNumber,
                fromDate: fromDate.toISOString(),
                toDate: toDate.toISOString(),
            },
        });
        const accountTransactions = await parseBankTransactions(response.data, connectionId, accountNumber);
        transactions.push(...accountTransactions);
    }
    // Update last sync time
    connection.lastSyncAt = new Date();
    return transactions;
}
/**
 * 9. Parse bank transactions from API response
 *
 * @param {any} data - API response data
 * @param {string} connectionId - Connection ID
 * @param {string} accountNumber - Account number
 * @returns {Promise<BankTransaction[]>} Parsed transactions
 */
async function parseBankTransactions(data, connectionId, accountNumber) {
    const transactions = [];
    for (const item of data.transactions || []) {
        const transaction = {
            transactionId: generateUUID(),
            connectionId,
            accountNumber,
            transactionType: item.type === 'DEBIT' ? 'debit' : 'credit',
            amount: Math.abs(parseFloat(item.amount)),
            currency: item.currency || 'USD',
            description: item.description || '',
            referenceNumber: item.referenceNumber,
            valueDate: new Date(item.valueDate),
            postingDate: new Date(item.postingDate),
            balance: parseFloat(item.balance),
            counterpartyName: item.counterparty?.name,
            counterpartyAccount: item.counterparty?.account,
            status: 'posted',
            metadata: {},
            rawData: item,
        };
        transactions.push(transaction);
    }
    return transactions;
}
/**
 * 10. Get bank connection by ID
 *
 * @param {string} connectionId - Connection ID
 * @returns {Promise<BankConnection | null>} Bank connection or null
 */
async function getBankConnectionById(connectionId) {
    // Implementation would query database
    return null;
}
/**
 * 11. Create payment gateway
 *
 * @param {PaymentGateway} gateway - Gateway configuration
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<PaymentGateway>} Created gateway
 */
async function createPaymentGateway(gateway, transaction) {
    const encryptedCreds = await encryptCredentials(gateway.credentials);
    const paymentGateway = {
        gatewayId: generateUUID(),
        providerName: gateway.providerName,
        providerType: gateway.providerType,
        apiEndpoint: gateway.apiEndpoint,
        apiVersion: gateway.apiVersion,
        credentials: encryptedCreds,
        supportedMethods: gateway.supportedMethods || [],
        supportedCurrencies: gateway.supportedCurrencies || ['USD'],
        webhookUrl: gateway.webhookUrl,
        webhookSecret: gateway.webhookSecret,
        isActive: true,
        isSandbox: gateway.isSandbox || false,
        features: gateway.features || [],
        rateLimit: gateway.rateLimit || { requestsPerSecond: 10, requestsPerMinute: 100, requestsPerHour: 1000, burstLimit: 20 },
        metadata: gateway.metadata || {},
    };
    // Test gateway connection
    await testPaymentGateway(paymentGateway);
    return paymentGateway;
}
/**
 * 12. Test payment gateway connection
 *
 * @param {PaymentGateway} gateway - Payment gateway
 * @returns {Promise<boolean>} Whether test is successful
 */
async function testPaymentGateway(gateway) {
    try {
        const client = await createPaymentGatewayClient(gateway);
        // Test with a zero-amount authorization
        const response = await client.post('/test', { amount: 0 });
        return response.status === 200;
    }
    catch (error) {
        throw new Error(`Payment gateway test failed: ${error.message}`);
    }
}
/**
 * 13. Create payment gateway API client
 *
 * @param {PaymentGateway} gateway - Payment gateway
 * @returns {Promise<AxiosInstance>} Configured client
 */
async function createPaymentGatewayClient(gateway) {
    const credentials = await decryptCredentials(gateway.credentials);
    const config = {
        baseURL: gateway.apiEndpoint,
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    // Provider-specific configuration
    switch (gateway.providerType) {
        case 'stripe':
            config.headers['Authorization'] = `Bearer ${credentials.secretKey}`;
            break;
        case 'paypal':
            config.headers['Authorization'] = `Basic ${Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString('base64')}`;
            break;
        default:
            config.headers['X-API-Key'] = credentials.apiKey;
    }
    return axios_1.default.create(config);
}
/**
 * 14. Process payment transaction
 *
 * @param {PaymentTransaction} payment - Payment transaction
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<PaymentTransaction>} Processed payment
 */
async function processPaymentTransaction(payment, transaction) {
    const gateway = await getPaymentGatewayById(payment.gatewayId);
    if (!gateway) {
        throw new common_1.NotFoundException('Payment gateway not found');
    }
    const client = await createPaymentGatewayClient(gateway);
    const paymentTransaction = {
        transactionId: generateUUID(),
        gatewayId: payment.gatewayId,
        paymentMethod: payment.paymentMethod,
        amount: payment.amount,
        currency: payment.currency || 'USD',
        status: 'processing',
        customerId: payment.customerId,
        customerEmail: payment.customerEmail,
        description: payment.description,
        metadata: payment.metadata || {},
        createdAt: new Date(),
        rawResponse: {},
    };
    try {
        const response = await client.post('/charges', {
            amount: Math.round(payment.amount * 100), // Convert to cents
            currency: payment.currency,
            description: payment.description,
            metadata: payment.metadata,
        });
        paymentTransaction.externalTransactionId = response.data.id;
        paymentTransaction.status = 'completed';
        paymentTransaction.processedAt = new Date();
        paymentTransaction.rawResponse = response.data;
        // Calculate fees
        const feeStructure = getFeeStructure(gateway, payment.paymentMethod);
        paymentTransaction.processingFee = calculateProcessingFee(payment.amount, feeStructure);
        paymentTransaction.netAmount = payment.amount - paymentTransaction.processingFee;
    }
    catch (error) {
        paymentTransaction.status = 'failed';
        paymentTransaction.errorMessage = error.message;
        paymentTransaction.errorCode = error.response?.data?.code;
        paymentTransaction.rawResponse = error.response?.data || {};
    }
    return paymentTransaction;
}
/**
 * 15. Get payment gateway by ID
 *
 * @param {string} gatewayId - Gateway ID
 * @returns {Promise<PaymentGateway | null>} Payment gateway or null
 */
async function getPaymentGatewayById(gatewayId) {
    // Implementation would query database
    return null;
}
/**
 * 16. Get fee structure for payment method
 *
 * @param {PaymentGateway} gateway - Payment gateway
 * @param {string} method - Payment method
 * @returns {FeeStructure[]} Fee structures
 */
function getFeeStructure(gateway, method) {
    const paymentMethod = gateway.supportedMethods.find((m) => m.method === method);
    return paymentMethod?.fees || [];
}
/**
 * 17. Calculate processing fee
 *
 * @param {number} amount - Transaction amount
 * @param {FeeStructure[]} fees - Fee structures
 * @returns {number} Processing fee
 */
function calculateProcessingFee(amount, fees) {
    let totalFee = 0;
    for (const fee of fees) {
        if (fee.feeType === 'percentage') {
            totalFee += amount * (fee.feeAmount / 100);
        }
        else if (fee.feeType === 'fixed') {
            totalFee += fee.feeAmount;
        }
    }
    return totalFee;
}
/**
 * 18. Refund payment transaction
 *
 * @param {string} transactionId - Transaction ID
 * @param {number} amount - Refund amount
 * @param {string} reason - Refund reason
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<PaymentTransaction>} Refunded transaction
 */
async function refundPaymentTransaction(transactionId, amount, reason, transaction) {
    const payment = await getPaymentTransactionById(transactionId);
    if (!payment) {
        throw new common_1.NotFoundException('Payment transaction not found');
    }
    const gateway = await getPaymentGatewayById(payment.gatewayId);
    if (!gateway) {
        throw new common_1.NotFoundException('Payment gateway not found');
    }
    const client = await createPaymentGatewayClient(gateway);
    const refundAmount = amount || payment.amount;
    const response = await client.post('/refunds', {
        charge: payment.externalTransactionId,
        amount: Math.round(refundAmount * 100),
        reason,
    });
    payment.status = 'refunded';
    payment.metadata = { ...payment.metadata, refund: response.data, refundReason: reason };
    return payment;
}
/**
 * 19. Get payment transaction by ID
 *
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<PaymentTransaction | null>} Payment transaction or null
 */
async function getPaymentTransactionById(transactionId) {
    // Implementation would query database
    return null;
}
/**
 * 20. Create ERP integration
 *
 * @param {ERPIntegration} integration - ERP integration configuration
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ERPIntegration>} Created integration
 */
async function createERPIntegration(integration, transaction) {
    const encryptedCreds = await encryptCredentials(integration.credentials);
    const erpIntegration = {
        integrationId: generateUUID(),
        erpSystem: integration.erpSystem,
        erpVersion: integration.erpVersion,
        connectionType: integration.connectionType,
        apiEndpoint: integration.apiEndpoint,
        credentials: encryptedCreds,
        modules: integration.modules || [],
        syncSchedule: integration.syncSchedule,
        mappings: integration.mappings || [],
        isActive: true,
        syncStatus: 'idle',
        metadata: integration.metadata || {},
    };
    // Test connection
    await testERPConnection(erpIntegration);
    return erpIntegration;
}
/**
 * 21. Test ERP connection
 *
 * @param {ERPIntegration} integration - ERP integration
 * @returns {Promise<boolean>} Whether test is successful
 */
async function testERPConnection(integration) {
    try {
        const client = await createERPAPIClient(integration);
        const response = await client.get('/status');
        return response.status === 200;
    }
    catch (error) {
        throw new Error(`ERP connection test failed: ${error.message}`);
    }
}
/**
 * 22. Create ERP API client
 *
 * @param {ERPIntegration} integration - ERP integration
 * @returns {Promise<AxiosInstance>} Configured client
 */
async function createERPAPIClient(integration) {
    const credentials = await decryptCredentials(integration.credentials);
    const config = {
        baseURL: integration.apiEndpoint,
        timeout: 60000, // ERP systems may be slower
        headers: {
            'Content-Type': 'application/json',
        },
    };
    // ERP-specific configuration
    switch (integration.erpSystem) {
        case 'sap':
            config.headers['X-CSRF-Token'] = 'Fetch';
            config.auth = {
                username: credentials.username,
                password: credentials.password,
            };
            break;
        case 'oracle':
            config.headers['Authorization'] = `Bearer ${await getOAuth2Token(credentials)}`;
            break;
        case 'workday':
            config.auth = {
                username: credentials.username,
                password: credentials.password,
            };
            break;
        default:
            config.headers['X-API-Key'] = credentials.apiKey;
    }
    return axios_1.default.create(config);
}
/**
 * 23. Sync ERP data
 *
 * @param {string} integrationId - Integration ID
 * @param {string[]} modules - Modules to sync
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<Record<string, any>>} Sync results
 */
async function syncERPData(integrationId, modules, transaction) {
    const integration = await getERPIntegrationById(integrationId);
    if (!integration) {
        throw new common_1.NotFoundException('ERP integration not found');
    }
    integration.syncStatus = 'running';
    const results = {
        integrationId,
        startedAt: new Date(),
        modules: {},
    };
    const modulesToSync = modules || integration.modules.filter((m) => m.enabled).map((m) => m.moduleName);
    for (const moduleName of modulesToSync) {
        try {
            const moduleResult = await syncERPModule(integration, moduleName);
            results.modules[moduleName] = moduleResult;
        }
        catch (error) {
            results.modules[moduleName] = {
                status: 'error',
                error: error.message,
            };
        }
    }
    integration.syncStatus = 'completed';
    integration.lastSyncAt = new Date();
    results.completedAt = new Date();
    return results;
}
/**
 * 24. Sync ERP module
 *
 * @param {ERPIntegration} integration - ERP integration
 * @param {string} moduleName - Module name
 * @returns {Promise<Record<string, any>>} Sync result
 */
async function syncERPModule(integration, moduleName) {
    const module = integration.modules.find((m) => m.moduleName === moduleName);
    if (!module) {
        throw new common_1.NotFoundException(`Module ${moduleName} not found in integration`);
    }
    const client = await createERPAPIClient(integration);
    const result = {
        module: moduleName,
        status: 'success',
        recordsProcessed: 0,
        errors: [],
    };
    for (const entity of module.entities) {
        const data = await fetchERPEntity(client, entity, module.filters);
        const transformedData = await transformERPData(data, integration.mappings);
        // Import data into local system
        result.recordsProcessed += transformedData.length;
    }
    return result;
}
/**
 * 25. Fetch ERP entity data
 *
 * @param {AxiosInstance} client - API client
 * @param {string} entity - Entity name
 * @param {Record<string, any>} filters - Filters
 * @returns {Promise<any[]>} Entity data
 */
async function fetchERPEntity(client, entity, filters) {
    const response = await client.get(`/${entity}`, { params: filters });
    return response.data.items || response.data;
}
/**
 * 26. Transform ERP data using field mappings
 *
 * @param {any[]} data - Source data
 * @param {FieldMapping[]} mappings - Field mappings
 * @returns {Promise<any[]>} Transformed data
 */
async function transformERPData(data, mappings) {
    return data.map((item) => {
        const transformed = {};
        for (const mapping of mappings) {
            let value = item[mapping.sourceField];
            // Apply transformation if specified
            if (mapping.transformation && value !== undefined) {
                value = applyTransformation(value, mapping.transformation);
            }
            // Use default value if not present
            if (value === undefined && mapping.defaultValue !== undefined) {
                value = mapping.defaultValue;
            }
            // Validate required fields
            if (mapping.required && value === undefined) {
                throw new Error(`Required field ${mapping.targetField} is missing`);
            }
            transformed[mapping.targetField] = value;
        }
        return transformed;
    });
}
/**
 * 27. Apply transformation to field value
 *
 * @param {any} value - Original value
 * @param {string} transformation - Transformation expression
 * @returns {any} Transformed value
 */
function applyTransformation(value, transformation) {
    // Simple transformation expressions
    switch (transformation) {
        case 'uppercase':
            return String(value).toUpperCase();
        case 'lowercase':
            return String(value).toLowerCase();
        case 'trim':
            return String(value).trim();
        case 'tonumber':
            return Number(value);
        case 'tostring':
            return String(value);
        case 'todate':
            return new Date(value);
        default:
            return value;
    }
}
/**
 * 28. Get ERP integration by ID
 *
 * @param {string} integrationId - Integration ID
 * @returns {Promise<ERPIntegration | null>} ERP integration or null
 */
async function getERPIntegrationById(integrationId) {
    // Implementation would query database
    return null;
}
/**
 * 29. Create data import job
 *
 * @param {DataImportJob} job - Import job
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<DataImportJob>} Created job
 */
async function createDataImportJob(job, transaction) {
    const importJob = {
        jobId: generateUUID(),
        jobType: job.jobType,
        sourceType: job.sourceType,
        sourceLocation: job.sourceLocation,
        format: job.format,
        totalRecords: 0,
        processedRecords: 0,
        successfulRecords: 0,
        failedRecords: 0,
        status: 'queued',
        errors: [],
        createdBy: job.createdBy,
        createdAt: new Date(),
        metadata: job.metadata || {},
    };
    // Queue job for processing
    await queueImportJob(importJob);
    return importJob;
}
/**
 * 30. Queue import job for background processing
 *
 * @param {DataImportJob} job - Import job
 * @returns {Promise<void>}
 */
async function queueImportJob(job) {
    // Implementation would add to Bull queue or similar
    console.log(`Queued import job ${job.jobId}`);
}
/**
 * 31. Process import job
 *
 * @param {string} jobId - Job ID
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<DataImportJob>} Processed job
 */
async function processImportJob(jobId, transaction) {
    const job = await getImportJobById(jobId);
    if (!job) {
        throw new common_1.NotFoundException('Import job not found');
    }
    job.status = 'processing';
    job.startedAt = new Date();
    try {
        // Read data based on source type
        const data = await readImportData(job);
        job.totalRecords = data.length;
        // Process each record
        for (let i = 0; i < data.length; i++) {
            try {
                await importRecord(data[i], job.jobType);
                job.successfulRecords++;
            }
            catch (error) {
                job.failedRecords++;
                job.errors.push({
                    recordNumber: i + 1,
                    errorType: 'import_error',
                    errorMessage: error.message,
                    rawData: data[i],
                });
            }
            job.processedRecords++;
        }
        job.status = job.failedRecords > 0 ? 'partial' : 'completed';
    }
    catch (error) {
        job.status = 'failed';
        job.errors.push({
            recordNumber: 0,
            errorType: 'job_error',
            errorMessage: error.message,
        });
    }
    job.completedAt = new Date();
    return job;
}
/**
 * 32. Read import data from source
 *
 * @param {DataImportJob} job - Import job
 * @returns {Promise<any[]>} Import data
 */
async function readImportData(job) {
    switch (job.sourceType) {
        case 'file':
            return await readFileData(job.sourceLocation, job.format);
        case 'api':
            return await readAPIData(job.sourceLocation);
        case 'sftp':
            return await readSFTPData(job.sourceLocation, job.format);
        default:
            throw new Error(`Unsupported source type: ${job.sourceType}`);
    }
}
/**
 * 33. Read data from file
 *
 * @param {string} filePath - File path
 * @param {string} format - File format
 * @returns {Promise<any[]>} File data
 */
async function readFileData(filePath, format) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    switch (format) {
        case 'json':
            return JSON.parse(fileContent);
        case 'csv':
            return parseCSV(fileContent);
        case 'xml':
            return parseXML(fileContent);
        default:
            throw new Error(`Unsupported file format: ${format}`);
    }
}
/**
 * 34. Parse CSV data
 *
 * @param {string} content - CSV content
 * @returns {any[]} Parsed data
 */
function parseCSV(content) {
    const lines = content.split('\n');
    const headers = lines[0].split(',').map((h) => h.trim());
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim())
            continue;
        const values = lines[i].split(',').map((v) => v.trim());
        const record = {};
        headers.forEach((header, index) => {
            record[header] = values[index];
        });
        data.push(record);
    }
    return data;
}
/**
 * 35. Parse XML data
 *
 * @param {string} content - XML content
 * @returns {any[]} Parsed data
 */
function parseXML(content) {
    // Simplified XML parsing - in production, use a proper XML parser like xml2js
    return [];
}
/**
 * 36. Read data from API
 *
 * @param {string} url - API URL
 * @returns {Promise<any[]>} API data
 */
async function readAPIData(url) {
    const response = await axios_1.default.get(url);
    return Array.isArray(response.data) ? response.data : [response.data];
}
/**
 * 37. Read data from SFTP
 *
 * @param {string} path - SFTP path
 * @param {string} format - File format
 * @returns {Promise<any[]>} SFTP data
 */
async function readSFTPData(path, format) {
    // Implementation would use ssh2-sftp-client or similar
    return [];
}
/**
 * 38. Import individual record
 *
 * @param {any} record - Record to import
 * @param {string} jobType - Job type
 * @returns {Promise<void>}
 */
async function importRecord(record, jobType) {
    // Implementation would save record to appropriate table based on jobType
    console.log(`Importing ${jobType} record:`, record);
}
/**
 * 39. Get import job by ID
 *
 * @param {string} jobId - Job ID
 * @returns {Promise<DataImportJob | null>} Import job or null
 */
async function getImportJobById(jobId) {
    // Implementation would query database
    return null;
}
/**
 * 40. Create data export job
 *
 * @param {DataExportJob} job - Export job
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<DataExportJob>} Created job
 */
async function createDataExportJob(job, transaction) {
    const exportJob = {
        jobId: generateUUID(),
        jobType: job.jobType,
        format: job.format,
        filters: job.filters || {},
        columns: job.columns || [],
        totalRecords: 0,
        status: 'queued',
        createdBy: job.createdBy,
        createdAt: new Date(),
        metadata: job.metadata || {},
    };
    // Queue job for processing
    await queueExportJob(exportJob);
    return exportJob;
}
/**
 * 41. Queue export job
 *
 * @param {DataExportJob} job - Export job
 * @returns {Promise<void>}
 */
async function queueExportJob(job) {
    console.log(`Queued export job ${job.jobId}`);
}
/**
 * 42. Process webhook delivery
 *
 * @param {string} webhookId - Webhook ID
 * @param {Record<string, any>} payload - Webhook payload
 * @returns {Promise<boolean>} Whether delivery was successful
 */
async function processWebhookDelivery(webhookId, payload) {
    const webhook = await getWebhookById(webhookId);
    if (!webhook || !webhook.isActive) {
        return false;
    }
    const signature = generateWebhookSignature(payload, webhook.secret, webhook.signatureMethod);
    try {
        const response = await axios_1.default.post(webhook.url, payload, {
            headers: {
                ...webhook.headers,
                'X-Webhook-Signature': signature,
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        });
        webhook.lastDeliveredAt = new Date();
        webhook.deliveryAttempts++;
        return response.status >= 200 && response.status < 300;
    }
    catch (error) {
        webhook.deliveryAttempts++;
        // Retry based on retry policy
        if (webhook.deliveryAttempts < webhook.retryPolicy.maxRetries) {
            await retryWebhookDelivery(webhookId, payload, webhook.retryPolicy);
        }
        return false;
    }
}
/**
 * 43. Generate webhook signature
 *
 * @param {Record<string, any>} payload - Payload
 * @param {string} secret - Secret key
 * @param {string} method - Signature method
 * @returns {string} Signature
 */
function generateWebhookSignature(payload, secret, method) {
    const data = JSON.stringify(payload);
    switch (method) {
        case 'hmac_sha256':
            return crypto.createHmac('sha256', secret).update(data).digest('hex');
        case 'hmac_sha512':
            return crypto.createHmac('sha512', secret).update(data).digest('hex');
        default:
            return '';
    }
}
/**
 * 44. Retry webhook delivery
 *
 * @param {string} webhookId - Webhook ID
 * @param {Record<string, any>} payload - Payload
 * @param {RetryPolicy} retryPolicy - Retry policy
 * @returns {Promise<void>}
 */
async function retryWebhookDelivery(webhookId, payload, retryPolicy) {
    const delay = retryPolicy.exponentialBackoff
        ? Math.min(retryPolicy.retryDelay * Math.pow(2, retryPolicy.maxRetries), retryPolicy.maxDelay)
        : retryPolicy.retryDelay;
    setTimeout(() => {
        processWebhookDelivery(webhookId, payload);
    }, delay);
}
/**
 * 45. Get webhook by ID
 *
 * @param {string} webhookId - Webhook ID
 * @returns {Promise<WebhookConfig | null>} Webhook config or null
 */
async function getWebhookById(webhookId) {
    // Implementation would query database
    return null;
}
/**
 * Helper: Generate UUID
 *
 * @returns {string} UUID v4
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
let FinancialIntegrationController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('financial-integration'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Controller)('api/v1/financial/integration'), (0, common_1.UseInterceptors)(IntegrationLoggingInterceptor)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createBank_decorators;
    let _syncBank_decorators;
    let _processPayment_decorators;
    let _refundPayment_decorators;
    let _syncERP_decorators;
    let _createImport_decorators;
    let _getImportStatus_decorators;
    let _createExport_decorators;
    var FinancialIntegrationController = _classThis = class {
        /**
         * Create bank connection
         */
        async createBank(connectionDto) {
            return await createBankConnection(connectionDto);
        }
        /**
         * Sync bank transactions
         */
        async syncBank(connectionId, fromDate, toDate) {
            return await syncBankTransactions(connectionId, new Date(fromDate), new Date(toDate));
        }
        /**
         * Process payment transaction
         */
        async processPayment(paymentDto) {
            return await processPaymentTransaction(paymentDto);
        }
        /**
         * Refund payment
         */
        async refundPayment(transactionId, amount, reason) {
            return await refundPaymentTransaction(transactionId, amount, reason);
        }
        /**
         * Sync ERP data
         */
        async syncERP(integrationId, modules) {
            return await syncERPData(integrationId, modules);
        }
        /**
         * Create import job
         */
        async createImport(importDto) {
            const job = {
                jobType: importDto.jobType,
                sourceType: importDto.sourceType,
                format: importDto.format,
                sourceLocation: importDto.sourceLocation,
                createdBy: 'current-user-id', // Would come from auth context
                metadata: importDto.metadata,
            };
            return await createDataImportJob(job);
        }
        /**
         * Get import job status
         */
        async getImportStatus(jobId) {
            const job = await getImportJobById(jobId);
            if (!job) {
                throw new common_1.NotFoundException('Import job not found');
            }
            return job;
        }
        /**
         * Create export job
         */
        async createExport(jobType, format, filters, columns) {
            const job = {
                jobType: jobType,
                format: format,
                filters: filters || {},
                columns: columns || [],
                createdBy: 'current-user-id', // Would come from auth context
            };
            return await createDataExportJob(job);
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "FinancialIntegrationController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createBank_decorators = [(0, common_1.Post)('banks'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create new bank connection' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Bank connection created successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid connection data' })];
        _syncBank_decorators = [(0, common_1.Post)('banks/:connectionId/sync'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Sync bank transactions' }), (0, swagger_1.ApiQuery)({ name: 'fromDate', required: true }), (0, swagger_1.ApiQuery)({ name: 'toDate', required: true }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Transactions synced successfully' })];
        _processPayment_decorators = [(0, common_1.Post)('payments'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Process payment transaction' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Payment processed successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid payment data' })];
        _refundPayment_decorators = [(0, common_1.Post)('payments/:transactionId/refund'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Refund payment transaction' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment refunded successfully' })];
        _syncERP_decorators = [(0, common_1.Post)('erp/:integrationId/sync'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Sync ERP data' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP data synced successfully' })];
        _createImport_decorators = [(0, common_1.Post)('import'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create data import job' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Import job created successfully' })];
        _getImportStatus_decorators = [(0, common_1.Get)('import/:jobId'), (0, swagger_1.ApiOperation)({ summary: 'Get import job status' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Import job status retrieved successfully' })];
        _createExport_decorators = [(0, common_1.Post)('export'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create data export job' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Export job created successfully' })];
        __esDecorate(_classThis, null, _createBank_decorators, { kind: "method", name: "createBank", static: false, private: false, access: { has: obj => "createBank" in obj, get: obj => obj.createBank }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _syncBank_decorators, { kind: "method", name: "syncBank", static: false, private: false, access: { has: obj => "syncBank" in obj, get: obj => obj.syncBank }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _processPayment_decorators, { kind: "method", name: "processPayment", static: false, private: false, access: { has: obj => "processPayment" in obj, get: obj => obj.processPayment }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _refundPayment_decorators, { kind: "method", name: "refundPayment", static: false, private: false, access: { has: obj => "refundPayment" in obj, get: obj => obj.refundPayment }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _syncERP_decorators, { kind: "method", name: "syncERP", static: false, private: false, access: { has: obj => "syncERP" in obj, get: obj => obj.syncERP }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createImport_decorators, { kind: "method", name: "createImport", static: false, private: false, access: { has: obj => "createImport" in obj, get: obj => obj.createImport }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getImportStatus_decorators, { kind: "method", name: "getImportStatus", static: false, private: false, access: { has: obj => "getImportStatus" in obj, get: obj => obj.getImportStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createExport_decorators, { kind: "method", name: "createExport", static: false, private: false, access: { has: obj => "createExport" in obj, get: obj => obj.createExport }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FinancialIntegrationController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FinancialIntegrationController = _classThis;
})();
exports.FinancialIntegrationController = FinancialIntegrationController;
//# sourceMappingURL=financial-integration-exchange-kit.js.map