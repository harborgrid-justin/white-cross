"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PIIDetectionService = void 0;
const common_1 = require("@nestjs/common");
const security_interfaces_1 = require("../interfaces/security.interfaces");
const base_1 = require("../../../common/base");
let PIIDetectionService = class PIIDetectionService extends base_1.BaseService {
    constructor() {
        super("PIIDetectionService");
    }
    patterns = {
        [security_interfaces_1.PIIType.SSN]: /\b\d{3}-?\d{2}-?\d{4}\b/g,
        [security_interfaces_1.PIIType.EMAIL]: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        [security_interfaces_1.PIIType.PHONE]: /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
        [security_interfaces_1.PIIType.CREDIT_CARD]: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
        [security_interfaces_1.PIIType.ADDRESS]: /\b\d+\s+[A-Za-z0-9\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gi,
        [security_interfaces_1.PIIType.NAME]: /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g,
        [security_interfaces_1.PIIType.DATE_OF_BIRTH]: /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-](19|20)\d{2}\b/g,
        [security_interfaces_1.PIIType.MEDICAL_ID]: /\b[A-Z]{2}\d{8,12}\b/g,
    };
    detectPII(data) {
        const detected = [];
        if (typeof data === 'string') {
            this.detectPIIInText(data, 'text', detected);
        }
        else {
            for (const [field, value] of Object.entries(data)) {
                if (typeof value === 'string') {
                    this.detectPIIInText(value, field, detected);
                }
            }
        }
        return {
            detected: detected.length > 0,
            fields: detected,
        };
    }
    maskPII(data, maskingChar = '*') {
        if (typeof data === 'string') {
            return this.maskPIIInText(data, maskingChar);
        }
        const maskedData = { ...data };
        for (const [field, value] of Object.entries(maskedData)) {
            if (typeof value === 'string') {
                maskedData[field] = this.maskPIIInText(value, maskingChar);
            }
        }
        return maskedData;
    }
    detectPIIInText(text, fieldName, detected) {
        for (const [type, pattern] of Object.entries(this.patterns)) {
            const matches = text.match(pattern);
            if (matches) {
                for (const match of matches) {
                    detected.push({
                        field: fieldName,
                        type: type,
                        confidence: this.calculateConfidence(type, match),
                        value: match,
                        maskedValue: this.maskValue(match, '*'),
                    });
                }
            }
        }
    }
    maskPIIInText(text, maskingChar) {
        let maskedText = text;
        for (const pattern of Object.values(this.patterns)) {
            maskedText = maskedText.replace(pattern, (match) => this.maskValue(match, maskingChar));
        }
        return maskedText;
    }
    maskValue(value, maskingChar) {
        if (value.length <= 2) {
            return maskingChar.repeat(value.length);
        }
        const start = value.charAt(0);
        const end = value.charAt(value.length - 1);
        const middle = maskingChar.repeat(value.length - 2);
        return `${start}${middle}${end}`;
    }
    calculateConfidence(type, value) {
        switch (type) {
            case security_interfaces_1.PIIType.SSN:
                return /^\d{3}-\d{2}-\d{4}$/.test(value) ? 0.9 : 0.7;
            case security_interfaces_1.PIIType.EMAIL:
                return 0.95;
            case security_interfaces_1.PIIType.CREDIT_CARD:
                return this.luhnCheck(value.replace(/\D/g, '')) ? 0.95 : 0.6;
            default:
                return 0.8;
        }
    }
    luhnCheck(cardNumber) {
        let sum = 0;
        let shouldDouble = false;
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i), 10);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return sum % 10 === 0;
    }
};
exports.PIIDetectionService = PIIDetectionService;
exports.PIIDetectionService = PIIDetectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PIIDetectionService);
//# sourceMappingURL=pii-detection.service.js.map