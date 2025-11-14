"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailValidatorService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
const validator = __importStar(require("email-validator"));
let EmailValidatorService = class EmailValidatorService extends base_1.BaseService {
    constructor() {
        super("EmailValidatorService");
    }
    validateEmail(email) {
        if (!email) {
            return { valid: false, email, reason: 'Email is required' };
        }
        if (!validator.validate(email)) {
            return { valid: false, email, reason: 'Invalid email format' };
        }
        const parts = email.split('@');
        if (parts.length !== 2) {
            return { valid: false, email, reason: 'Invalid email format' };
        }
        const [localPart, domain] = parts;
        if (localPart.length === 0 || localPart.length > 64) {
            return { valid: false, email, reason: 'Invalid local part length' };
        }
        if (domain.length === 0 || domain.length > 255) {
            return { valid: false, email, reason: 'Invalid domain length' };
        }
        return { valid: true, email };
    }
    validateEmails(emails) {
        return emails.map((email) => this.validateEmail(email));
    }
    areAllValid(emails) {
        return emails.every(email => this.validateEmail(email).valid);
    }
    filterValidEmails(emails) {
        return emails.filter((email) => this.validateEmail(email).valid);
    }
    getValidationSummary(emails) {
        const results = this.validateEmails(emails);
        const valid = results.filter((r) => r.valid);
        const invalid = results.filter((r) => !r.valid);
        return {
            total: emails.length,
            valid: valid.length,
            invalid: invalid.length,
            validEmails: valid.map((r) => r.email),
            invalidEmails: invalid,
        };
    }
};
exports.EmailValidatorService = EmailValidatorService;
exports.EmailValidatorService = EmailValidatorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailValidatorService);
//# sourceMappingURL=email-validator.service.js.map