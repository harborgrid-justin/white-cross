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
exports.ValidateDEANumberPipe = exports.ValidateCPTCodePipe = exports.ValidateICD10Pipe = exports.ValidateNPIPipe = exports.ValidateMRNPipe = exports.SlugifyPipe = exports.NormalizeEmailPipe = exports.UppercasePipe = exports.LowercasePipe = exports.TrimPipe = exports.ParseJSONPipe = exports.FlexibleParseBoolPipe = exports.PartialValidationPipe = exports.LenientValidationPipe = exports.StrictValidationPipe = exports.EnhancedValidationPipe = void 0;
exports.ParseIntegerPipe = ParseIntegerPipe;
exports.ParseDecimalPipe = ParseDecimalPipe;
exports.ParseDatePipe = ParseDatePipe;
exports.ParseArrayPipe = ParseArrayPipe;
exports.SanitizeHtmlPipe = SanitizeHtmlPipe;
exports.SanitizeCharsPipe = SanitizeCharsPipe;
exports.NormalizePhonePipe = NormalizePhonePipe;
exports.TruncatePipe = TruncatePipe;
exports.ValidateSSNPipe = ValidateSSNPipe;
exports.ValidateFilePipe = ValidateFilePipe;
exports.ValidateImagePipe = ValidateImagePipe;
exports.ValidateUniquePipe = ValidateUniquePipe;
exports.ValidateExistsPipe = ValidateExistsPipe;
exports.ValidateConditionalPipe = ValidateConditionalPipe;
exports.ValidateAsyncPipe = ValidateAsyncPipe;
exports.ValidateDateRangePipe = ValidateDateRangePipe;
exports.ValidateNumericRangePipe = ValidateNumericRangePipe;
exports.DefaultValuePipe = DefaultValuePipe;
exports.TransformObjectPipe = TransformObjectPipe;
exports.CompositePipe = CompositePipe;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const sanitizeHtml = __importStar(require("sanitize-html"));
const date_fns_1 = require("date-fns");
let EnhancedValidationPipe = class EnhancedValidationPipe {
    options;
    constructor(options) {
        this.options = {
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            skipMissingProperties: false,
            ...options,
        };
    }
    async transform(value, metadata) {
        if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
            return value;
        }
        const object = (0, class_transformer_1.plainToClass)(metadata.metatype, value, this.options.transformOptions);
        const errors = await (0, class_validator_1.validate)(object, this.options);
        if (errors.length > 0) {
            throw new common_1.BadRequestException({
                message: 'Validation failed',
                errors: this.formatErrors(errors),
                statusCode: this.options.errorHttpStatusCode || 400,
            });
        }
        return this.options.transform ? object : value;
    }
    toValidate(metatype) {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
    formatErrors(errors) {
        return errors.map((error) => ({
            field: error.property,
            value: error.value,
            constraints: error.constraints,
            children: error.children?.length > 0 ? this.formatErrors(error.children) : undefined,
        }));
    }
};
exports.EnhancedValidationPipe = EnhancedValidationPipe;
exports.EnhancedValidationPipe = EnhancedValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], EnhancedValidationPipe);
let StrictValidationPipe = class StrictValidationPipe extends EnhancedValidationPipe {
    constructor() {
        super({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
        });
    }
};
exports.StrictValidationPipe = StrictValidationPipe;
exports.StrictValidationPipe = StrictValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StrictValidationPipe);
let LenientValidationPipe = class LenientValidationPipe extends EnhancedValidationPipe {
    constructor() {
        super({
            transform: true,
            whitelist: false,
            forbidNonWhitelisted: false,
        });
    }
};
exports.LenientValidationPipe = LenientValidationPipe;
exports.LenientValidationPipe = LenientValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LenientValidationPipe);
let PartialValidationPipe = class PartialValidationPipe extends EnhancedValidationPipe {
    constructor() {
        super({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            skipMissingProperties: true,
        });
    }
};
exports.PartialValidationPipe = PartialValidationPipe;
exports.PartialValidationPipe = PartialValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PartialValidationPipe);
function ParseIntegerPipe(min, max) {
    let ParseIntegerPipeImpl = class ParseIntegerPipeImpl {
        transform(value, metadata) {
            const val = parseInt(value, 10);
            if (isNaN(val)) {
                throw new common_1.BadRequestException(`${metadata.data} must be a valid integer`);
            }
            if (min !== undefined && val < min) {
                throw new common_1.BadRequestException(`${metadata.data} must be at least ${min}`);
            }
            if (max !== undefined && val > max) {
                throw new common_1.BadRequestException(`${metadata.data} must be at most ${max}`);
            }
            return val;
        }
    };
    ParseIntegerPipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], ParseIntegerPipeImpl);
    return ParseIntegerPipeImpl;
}
function ParseDecimalPipe(options) {
    let ParseDecimalPipeImpl = class ParseDecimalPipeImpl {
        transform(value, metadata) {
            const val = parseFloat(value);
            if (isNaN(val)) {
                throw new common_1.BadRequestException(`${metadata.data} must be a valid number`);
            }
            if (options?.min !== undefined && val < options.min) {
                throw new common_1.BadRequestException(`${metadata.data} must be at least ${options.min}`);
            }
            if (options?.max !== undefined && val > options.max) {
                throw new common_1.BadRequestException(`${metadata.data} must be at most ${options.max}`);
            }
            if (options?.positive && val <= 0) {
                throw new common_1.BadRequestException(`${metadata.data} must be positive`);
            }
            if (options?.precision !== undefined) {
                return parseFloat(val.toFixed(options.precision));
            }
            return val;
        }
    };
    ParseDecimalPipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], ParseDecimalPipeImpl);
    return ParseDecimalPipeImpl;
}
let FlexibleParseBoolPipe = class FlexibleParseBoolPipe {
    transform(value, metadata) {
        if (typeof value === 'boolean') {
            return value;
        }
        const trueValues = ['true', '1', 'yes', 'on', 'enabled'];
        const falseValues = ['false', '0', 'no', 'off', 'disabled'];
        const normalized = String(value).toLowerCase().trim();
        if (trueValues.includes(normalized)) {
            return true;
        }
        if (falseValues.includes(normalized)) {
            return false;
        }
        throw new common_1.BadRequestException(`${metadata.data} must be a boolean value (true/false, 1/0, yes/no, on/off)`);
    }
};
exports.FlexibleParseBoolPipe = FlexibleParseBoolPipe;
exports.FlexibleParseBoolPipe = FlexibleParseBoolPipe = __decorate([
    (0, common_1.Injectable)()
], FlexibleParseBoolPipe);
function ParseDatePipe(options) {
    let ParseDatePipeImpl = class ParseDatePipeImpl {
        transform(value, metadata) {
            let date;
            if (options?.format) {
                date = (0, date_fns_1.parse)(value, options.format, new Date());
            }
            else {
                date = (0, date_fns_1.parseISO)(value);
            }
            if (!(0, date_fns_1.isValid)(date)) {
                throw new common_1.BadRequestException(`${metadata.data} must be a valid date${options?.format ? ` in format ${options.format}` : ''}`);
            }
            if (options?.minDate && date < options.minDate) {
                throw new common_1.BadRequestException(`${metadata.data} must be after ${options.minDate.toISOString()}`);
            }
            if (options?.maxDate && date > options.maxDate) {
                throw new common_1.BadRequestException(`${metadata.data} must be before ${options.maxDate.toISOString()}`);
            }
            return date;
        }
    };
    ParseDatePipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], ParseDatePipeImpl);
    return ParseDatePipeImpl;
}
function ParseArrayPipe(options) {
    let ParseArrayPipeImpl = class ParseArrayPipeImpl {
        transform(value, metadata) {
            let arr;
            if (Array.isArray(value)) {
                arr = value;
            }
            else if (typeof value === 'string') {
                arr = value.split(',').map((item) => item.trim());
            }
            else {
                throw new common_1.BadRequestException(`${metadata.data} must be an array or comma-separated string`);
            }
            if (options?.minLength !== undefined && arr.length < options.minLength) {
                throw new common_1.BadRequestException(`${metadata.data} must contain at least ${options.minLength} items`);
            }
            if (options?.maxLength !== undefined && arr.length > options.maxLength) {
                throw new common_1.BadRequestException(`${metadata.data} must contain at most ${options.maxLength} items`);
            }
            if (options?.unique) {
                const uniqueArr = Array.from(new Set(arr));
                if (uniqueArr.length !== arr.length) {
                    throw new common_1.BadRequestException(`${metadata.data} must contain unique items`);
                }
                arr = uniqueArr;
            }
            return arr;
        }
    };
    ParseArrayPipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], ParseArrayPipeImpl);
    return ParseArrayPipeImpl;
}
let ParseJSONPipe = class ParseJSONPipe {
    transform(value, metadata) {
        if (typeof value === 'object') {
            return value;
        }
        try {
            return JSON.parse(value);
        }
        catch (error) {
            throw new common_1.BadRequestException(`${metadata.data} must be valid JSON`);
        }
    }
};
exports.ParseJSONPipe = ParseJSONPipe;
exports.ParseJSONPipe = ParseJSONPipe = __decorate([
    (0, common_1.Injectable)()
], ParseJSONPipe);
let TrimPipe = class TrimPipe {
    transform(value) {
        return typeof value === 'string' ? value.trim() : value;
    }
};
exports.TrimPipe = TrimPipe;
exports.TrimPipe = TrimPipe = __decorate([
    (0, common_1.Injectable)()
], TrimPipe);
let LowercasePipe = class LowercasePipe {
    transform(value) {
        return typeof value === 'string' ? value.toLowerCase() : value;
    }
};
exports.LowercasePipe = LowercasePipe;
exports.LowercasePipe = LowercasePipe = __decorate([
    (0, common_1.Injectable)()
], LowercasePipe);
let UppercasePipe = class UppercasePipe {
    transform(value) {
        return typeof value === 'string' ? value.toUpperCase() : value;
    }
};
exports.UppercasePipe = UppercasePipe;
exports.UppercasePipe = UppercasePipe = __decorate([
    (0, common_1.Injectable)()
], UppercasePipe);
function SanitizeHtmlPipe(allowedTags, allowedAttributes) {
    let SanitizeHtmlPipeImpl = class SanitizeHtmlPipeImpl {
        transform(value) {
            if (typeof value !== 'string') {
                return value;
            }
            return sanitizeHtml(value, {
                allowedTags: allowedTags || ['p', 'br', 'strong', 'em', 'u'],
                allowedAttributes: allowedAttributes || { a: ['href'] },
            });
        }
    };
    SanitizeHtmlPipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], SanitizeHtmlPipeImpl);
    return SanitizeHtmlPipeImpl;
}
function SanitizeCharsPipe(allowedChars = /[a-zA-Z0-9]/) {
    let SanitizeCharsPipeImpl = class SanitizeCharsPipeImpl {
        transform(value) {
            if (typeof value !== 'string') {
                return value;
            }
            return value
                .split('')
                .filter((char) => allowedChars.test(char))
                .join('');
        }
    };
    SanitizeCharsPipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], SanitizeCharsPipeImpl);
    return SanitizeCharsPipeImpl;
}
function NormalizePhonePipe(format = 'E164') {
    let NormalizePhonePipeImpl = class NormalizePhonePipeImpl {
        transform(value) {
            if (typeof value !== 'string') {
                return value;
            }
            const digits = value.replace(/\D/g, '');
            if (format === 'E164') {
                return digits.startsWith('+') ? digits : `+${digits}`;
            }
            return digits;
        }
    };
    NormalizePhonePipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], NormalizePhonePipeImpl);
    return NormalizePhonePipeImpl;
}
let NormalizeEmailPipe = class NormalizeEmailPipe {
    transform(value) {
        if (typeof value !== 'string') {
            return value;
        }
        return value.trim().toLowerCase();
    }
};
exports.NormalizeEmailPipe = NormalizeEmailPipe;
exports.NormalizeEmailPipe = NormalizeEmailPipe = __decorate([
    (0, common_1.Injectable)()
], NormalizeEmailPipe);
let SlugifyPipe = class SlugifyPipe {
    transform(value) {
        if (typeof value !== 'string') {
            return value;
        }
        return value
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
};
exports.SlugifyPipe = SlugifyPipe;
exports.SlugifyPipe = SlugifyPipe = __decorate([
    (0, common_1.Injectable)()
], SlugifyPipe);
function TruncatePipe(maxLength, suffix = '...') {
    let TruncatePipeImpl = class TruncatePipeImpl {
        transform(value) {
            if (typeof value !== 'string' || value.length <= maxLength) {
                return value;
            }
            return value.substring(0, maxLength - suffix.length) + suffix;
        }
    };
    TruncatePipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], TruncatePipeImpl);
    return TruncatePipeImpl;
}
let ValidateMRNPipe = class ValidateMRNPipe {
    transform(value, metadata) {
        if (typeof value !== 'string') {
            throw new common_1.BadRequestException('MRN must be a string');
        }
        const normalized = value.replace(/[\s-]/g, '');
        const mrnRegex = /^[A-Z0-9]{8,12}$/i;
        if (!mrnRegex.test(normalized)) {
            throw new common_1.BadRequestException('Invalid MRN format. Must be 8-12 alphanumeric characters');
        }
        return normalized.toUpperCase();
    }
};
exports.ValidateMRNPipe = ValidateMRNPipe;
exports.ValidateMRNPipe = ValidateMRNPipe = __decorate([
    (0, common_1.Injectable)()
], ValidateMRNPipe);
let ValidateNPIPipe = class ValidateNPIPipe {
    transform(value, metadata) {
        if (typeof value !== 'string') {
            throw new common_1.BadRequestException('NPI must be a string');
        }
        const digits = value.replace(/\D/g, '');
        if (digits.length !== 10) {
            throw new common_1.BadRequestException('NPI must be exactly 10 digits');
        }
        if (!this.validateLuhn(digits)) {
            throw new common_1.BadRequestException('Invalid NPI checksum');
        }
        return digits;
    }
    validateLuhn(value) {
        let sum = 0;
        let isEven = false;
        for (let i = value.length - 1; i >= 0; i--) {
            let digit = parseInt(value[i], 10);
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
            isEven = !isEven;
        }
        return sum % 10 === 0;
    }
};
exports.ValidateNPIPipe = ValidateNPIPipe;
exports.ValidateNPIPipe = ValidateNPIPipe = __decorate([
    (0, common_1.Injectable)()
], ValidateNPIPipe);
let ValidateICD10Pipe = class ValidateICD10Pipe {
    transform(value, metadata) {
        if (typeof value !== 'string') {
            throw new common_1.BadRequestException('ICD-10 code must be a string');
        }
        const normalized = value.replace(/\s/g, '').toUpperCase();
        const icd10Regex = /^[A-Z][0-9]{2}\.?[A-Z0-9]{0,4}$/;
        if (!icd10Regex.test(normalized)) {
            throw new common_1.BadRequestException('Invalid ICD-10 code format. Expected format: A00.000');
        }
        if (normalized.length > 3 && !normalized.includes('.')) {
            return `${normalized.slice(0, 3)}.${normalized.slice(3)}`;
        }
        return normalized;
    }
};
exports.ValidateICD10Pipe = ValidateICD10Pipe;
exports.ValidateICD10Pipe = ValidateICD10Pipe = __decorate([
    (0, common_1.Injectable)()
], ValidateICD10Pipe);
let ValidateCPTCodePipe = class ValidateCPTCodePipe {
    transform(value, metadata) {
        if (typeof value !== 'string') {
            throw new common_1.BadRequestException('CPT code must be a string');
        }
        const digits = value.replace(/\D/g, '');
        if (digits.length !== 5) {
            throw new common_1.BadRequestException('CPT code must be exactly 5 digits');
        }
        return digits;
    }
};
exports.ValidateCPTCodePipe = ValidateCPTCodePipe;
exports.ValidateCPTCodePipe = ValidateCPTCodePipe = __decorate([
    (0, common_1.Injectable)()
], ValidateCPTCodePipe);
let ValidateDEANumberPipe = class ValidateDEANumberPipe {
    transform(value, metadata) {
        if (typeof value !== 'string') {
            throw new common_1.BadRequestException('DEA number must be a string');
        }
        const normalized = value.toUpperCase().replace(/\s/g, '');
        const deaRegex = /^[A-Z]{2}[0-9]{7}$/;
        if (!deaRegex.test(normalized)) {
            throw new common_1.BadRequestException('Invalid DEA number format. Expected format: AB1234563');
        }
        const digits = normalized.slice(2);
        const sum1 = parseInt(digits[0]) + parseInt(digits[2]) + parseInt(digits[4]);
        const sum2 = parseInt(digits[1]) + parseInt(digits[3]) + parseInt(digits[5]);
        const checksum = (sum1 + 2 * sum2) % 10;
        if (checksum !== parseInt(digits[6])) {
            throw new common_1.BadRequestException('Invalid DEA number checksum');
        }
        return normalized;
    }
};
exports.ValidateDEANumberPipe = ValidateDEANumberPipe;
exports.ValidateDEANumberPipe = ValidateDEANumberPipe = __decorate([
    (0, common_1.Injectable)()
], ValidateDEANumberPipe);
function ValidateSSNPipe(mask = false) {
    let ValidateSSNPipeImpl = class ValidateSSNPipeImpl {
        transform(value, metadata) {
            if (typeof value !== 'string') {
                throw new common_1.BadRequestException('SSN must be a string');
            }
            const digits = value.replace(/\D/g, '');
            if (digits.length !== 9) {
                throw new common_1.BadRequestException('SSN must be exactly 9 digits');
            }
            if (digits === '000000000' || digits === '123456789') {
                throw new common_1.BadRequestException('Invalid SSN');
            }
            if (mask) {
                return `XXX-XX-${digits.slice(5)}`;
            }
            return digits;
        }
    };
    ValidateSSNPipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], ValidateSSNPipeImpl);
    return ValidateSSNPipeImpl;
}
function ValidateFilePipe(options) {
    let ValidateFilePipeImpl = class ValidateFilePipeImpl {
        transform(value, metadata) {
            if (options.required && !value) {
                throw new common_1.BadRequestException('File is required');
            }
            if (!value) {
                return value;
            }
            if (options.maxSize && value.size > options.maxSize) {
                throw new common_1.BadRequestException(`File size ${value.size} exceeds maximum allowed size ${options.maxSize}`);
            }
            if (options.minSize && value.size < options.minSize) {
                throw new common_1.BadRequestException(`File size ${value.size} is below minimum required size ${options.minSize}`);
            }
            if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(value.mimetype)) {
                throw new common_1.BadRequestException(`File type ${value.mimetype} not allowed. Allowed types: ${options.allowedMimeTypes.join(', ')}`);
            }
            if (options.allowedExtensions) {
                const ext = value.originalname.split('.').pop()?.toLowerCase();
                if (!ext || !options.allowedExtensions.includes(`.${ext}`)) {
                    throw new common_1.BadRequestException(`File extension .${ext} not allowed. Allowed extensions: ${options.allowedExtensions.join(', ')}`);
                }
            }
            return value;
        }
    };
    ValidateFilePipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], ValidateFilePipeImpl);
    return ValidateFilePipeImpl;
}
function ValidateImagePipe(maxWidth, maxHeight, allowedFormats) {
    let ValidateImagePipeImpl = class ValidateImagePipeImpl {
        transform(value, metadata) {
            if (!value) {
                throw new common_1.BadRequestException('Image file is required');
            }
            if (!value.mimetype.startsWith('image/')) {
                throw new common_1.BadRequestException('File must be an image');
            }
            if (allowedFormats) {
                const format = value.mimetype.split('/')[1];
                if (!allowedFormats.includes(format)) {
                    throw new common_1.BadRequestException(`Image format ${format} not allowed. Allowed formats: ${allowedFormats.join(', ')}`);
                }
            }
            return value;
        }
    };
    ValidateImagePipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], ValidateImagePipeImpl);
    return ValidateImagePipeImpl;
}
function ValidateUniquePipe(repository, field) {
    let ValidateUniquePipeImpl = class ValidateUniquePipeImpl {
        async transform(value, metadata) {
            const existing = await repository.findOne({ where: { [field]: value } });
            if (existing) {
                throw new common_1.BadRequestException(`${field} '${value}' is already in use`);
            }
            return value;
        }
    };
    ValidateUniquePipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], ValidateUniquePipeImpl);
    return ValidateUniquePipeImpl;
}
function ValidateExistsPipe(repository, idField = 'id') {
    let ValidateExistsPipeImpl = class ValidateExistsPipeImpl {
        async transform(value, metadata) {
            const exists = await repository.findOne({ where: { [idField]: value } });
            if (!exists) {
                throw new common_1.BadRequestException(`${metadata.data} '${value}' does not exist`);
            }
            return value;
        }
    };
    ValidateExistsPipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], ValidateExistsPipeImpl);
    return ValidateExistsPipeImpl;
}
function ValidateConditionalPipe(condition, errorMessage) {
    let ValidateConditionalPipeImpl = class ValidateConditionalPipeImpl {
        transform(value, metadata) {
            if (!condition(value)) {
                throw new common_1.BadRequestException(errorMessage);
            }
            return value;
        }
    };
    ValidateConditionalPipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], ValidateConditionalPipeImpl);
    return ValidateConditionalPipeImpl;
}
function ValidateAsyncPipe(validator, errorMessage) {
    let ValidateAsyncPipeImpl = class ValidateAsyncPipeImpl {
        async transform(value, metadata) {
            const isValid = await validator(value);
            if (!isValid) {
                throw new common_1.BadRequestException(errorMessage);
            }
            return value;
        }
    };
    ValidateAsyncPipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], ValidateAsyncPipeImpl);
    return ValidateAsyncPipeImpl;
}
function ValidateDateRangePipe(startField, endField) {
    let ValidateDateRangePipeImpl = class ValidateDateRangePipeImpl {
        transform(value, metadata) {
            const startDate = new Date(value[startField]);
            const endDate = new Date(value[endField]);
            if (!(0, date_fns_1.isValid)(startDate) || !(0, date_fns_1.isValid)(endDate)) {
                throw new common_1.BadRequestException('Invalid date format');
            }
            if (startDate >= endDate) {
                throw new common_1.BadRequestException(`${startField} must be before ${endField}`);
            }
            return value;
        }
    };
    ValidateDateRangePipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], ValidateDateRangePipeImpl);
    return ValidateDateRangePipeImpl;
}
function ValidateNumericRangePipe(minField, maxField) {
    let ValidateNumericRangePipeImpl = class ValidateNumericRangePipeImpl {
        transform(value, metadata) {
            const min = parseFloat(value[minField]);
            const max = parseFloat(value[maxField]);
            if (isNaN(min) || isNaN(max)) {
                throw new common_1.BadRequestException('Invalid numeric values');
            }
            if (min > max) {
                throw new common_1.BadRequestException(`${minField} must be less than or equal to ${maxField}`);
            }
            return value;
        }
    };
    ValidateNumericRangePipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], ValidateNumericRangePipeImpl);
    return ValidateNumericRangePipeImpl;
}
function DefaultValuePipe(defaultValue) {
    let DefaultValuePipeImpl = class DefaultValuePipeImpl {
        transform(value) {
            return value !== undefined && value !== null ? value : defaultValue;
        }
    };
    DefaultValuePipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], DefaultValuePipeImpl);
    return DefaultValuePipeImpl;
}
function TransformObjectPipe(transformer) {
    let TransformObjectPipeImpl = class TransformObjectPipeImpl {
        transform(value) {
            return transformer(value);
        }
    };
    TransformObjectPipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], TransformObjectPipeImpl);
    return TransformObjectPipeImpl;
}
function CompositePipe(pipes) {
    let CompositePipeImpl = class CompositePipeImpl {
        async transform(value, metadata) {
            let result = value;
            for (const PipeClass of pipes) {
                const pipe = new PipeClass();
                result = await pipe.transform(result, metadata);
            }
            return result;
        }
    };
    CompositePipeImpl = __decorate([
        (0, common_1.Injectable)()
    ], CompositePipeImpl);
    return CompositePipeImpl;
}
//# sourceMappingURL=request-validation-pipes.service.js.map