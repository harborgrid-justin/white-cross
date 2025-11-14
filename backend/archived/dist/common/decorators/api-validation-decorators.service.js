"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsEmailField = IsEmailField;
exports.IsUrlField = IsUrlField;
exports.IsUuidField = IsUuidField;
exports.IsStringWithLength = IsStringWithLength;
exports.IsPhoneNumber = IsPhoneNumber;
exports.IsAlphanumeric = IsAlphanumeric;
exports.IsIntegerInRange = IsIntegerInRange;
exports.IsPositiveNumber = IsPositiveNumber;
exports.IsPercentage = IsPercentage;
exports.IsPriceField = IsPriceField;
exports.IsQuantity = IsQuantity;
exports.IsRating = IsRating;
exports.IsDateField = IsDateField;
exports.IsDateTimeField = IsDateTimeField;
exports.IsFutureDate = IsFutureDate;
exports.IsPastDate = IsPastDate;
exports.IsDateRange = IsDateRange;
exports.IsEnumField = IsEnumField;
exports.IsBooleanField = IsBooleanField;
exports.IsArrayField = IsArrayField;
exports.IsNestedObject = IsNestedObject;
exports.IsOptionalField = IsOptionalField;
exports.IsRequiredField = IsRequiredField;
exports.TrimString = TrimString;
exports.ToLowerCase = ToLowerCase;
exports.ToUpperCase = ToUpperCase;
exports.SanitizeHtml = SanitizeHtml;
exports.NormalizeWhitespace = NormalizeWhitespace;
exports.ToInt = ToInt;
exports.ToFloat = ToFloat;
exports.ToBoolean = ToBoolean;
exports.ToDate = ToDate;
exports.ToArray = ToArray;
exports.ToJson = ToJson;
exports.ValidateIf = ValidateIf;
exports.ValidateWhen = ValidateWhen;
exports.ValidateWhenNotEmpty = ValidateWhenNotEmpty;
exports.RequiredWhen = RequiredWhen;
exports.AtLeastOneOf = AtLeastOneOf;
exports.IsUsername = IsUsername;
exports.IsPassword = IsPassword;
exports.IsSlug = IsSlug;
exports.IsIPv4 = IsIPv4;
exports.IsCreditCard = IsCreditCard;
exports.IsPostalCode = IsPostalCode;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
function IsEmailField(options = {}) {
    const { maxLength = 255, description = 'Email address', example = 'user@example.com', } = options;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }), (0, class_validator_1.MaxLength)(maxLength, { message: `Email must not exceed ${maxLength} characters` }), (0, swagger_1.ApiProperty)({
        type: String,
        format: 'email',
        description,
        example,
        maxLength,
    }));
}
function IsUrlField(options = {}) {
    const { protocols = ['http', 'https'], requireProtocol = true, description = 'URL', example = 'https://example.com', } = options;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsUrl)({ protocols, require_protocol: requireProtocol }, { message: 'Invalid URL format' }), (0, swagger_1.ApiProperty)({
        type: String,
        format: 'uri',
        description,
        example,
    }));
}
function IsUuidField(options = {}) {
    const { version = '4', description = 'UUID', example = '123e4567-e89b-12d3-a456-426614174000', } = options;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsUUID)(version, { message: `Invalid UUID v${version} format` }), (0, swagger_1.ApiProperty)({
        type: String,
        format: 'uuid',
        description,
        example,
        pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    }));
}
function IsStringWithLength(minLength, maxLength, options = {}) {
    const decorators = [
        (0, class_validator_1.IsString)({ message: 'Must be a string' }),
        (0, class_validator_1.Length)(minLength, maxLength, {
            message: `Length must be between ${minLength} and ${maxLength} characters`,
        }),
    ];
    if (options.pattern) {
        const pattern = options.pattern instanceof RegExp ? options.pattern : new RegExp(options.pattern);
        decorators.push((0, class_validator_1.Matches)(pattern, {
            message: 'String does not match required pattern',
        }));
    }
    const apiPropertyOptions = {
        type: String,
        description: options.description || 'String value',
        minLength,
        maxLength,
    };
    if (options.example) {
        apiPropertyOptions.example = options.example;
    }
    if (options.format) {
        apiPropertyOptions.format = options.format;
    }
    if (options.pattern) {
        apiPropertyOptions.pattern = options.pattern.toString();
    }
    decorators.push((0, swagger_1.ApiProperty)(apiPropertyOptions));
    return (0, common_1.applyDecorators)(...decorators);
}
function IsPhoneNumber(options = {}) {
    const { region, description = 'Phone number', example = '+1234567890', } = options;
    const pattern = /^\+?[1-9]\d{1,14}$/;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsString)({ message: 'Phone number must be a string' }), (0, class_validator_1.Matches)(pattern, { message: 'Invalid phone number format' }), (0, swagger_1.ApiProperty)({
        type: String,
        description: region ? `${description} (${region})` : description,
        example,
        pattern: pattern.toString(),
    }));
}
function IsAlphanumeric(options = {}) {
    const { minLength = 1, maxLength = 255, allowSpaces = false, allowUnderscore = false, allowHyphen = false, description = 'Alphanumeric string', example, } = options;
    let patternStr = '^[a-zA-Z0-9';
    if (allowSpaces)
        patternStr += ' ';
    if (allowUnderscore)
        patternStr += '_';
    if (allowHyphen)
        patternStr += '-';
    patternStr += `]{${minLength},${maxLength}}$`;
    const pattern = new RegExp(patternStr);
    return (0, common_1.applyDecorators)((0, class_validator_1.IsString)({ message: 'Must be a string' }), (0, class_validator_1.Matches)(pattern, { message: 'Must contain only alphanumeric characters' }), (0, class_validator_1.Length)(minLength, maxLength), (0, swagger_1.ApiProperty)({
        type: String,
        description,
        minLength,
        maxLength,
        pattern: pattern.toString(),
        ...(example && { example }),
    }));
}
function IsIntegerInRange(min, max, options = {}) {
    const { description = 'Integer value', example, format = 'int32', } = options;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsInt)({ message: 'Must be an integer' }), (0, class_validator_1.Min)(min, { message: `Value must be at least ${min}` }), (0, class_validator_1.Max)(max, { message: `Value must be at most ${max}` }), (0, swagger_1.ApiProperty)({
        type: Number,
        format,
        description,
        minimum: min,
        maximum: max,
        ...(example !== undefined && { example }),
    }));
}
function IsPositiveNumber(options = {}) {
    const { allowZero = false, max, description = 'Positive number', example, format = 'double', } = options;
    const decorators = [
        (0, class_validator_1.IsNumber)({}, { message: 'Must be a number' }),
    ];
    if (!allowZero) {
        decorators.push((0, class_validator_1.IsPositive)({ message: 'Must be a positive number' }));
    }
    else {
        decorators.push((0, class_validator_1.Min)(0, { message: 'Must be zero or positive' }));
    }
    if (max !== undefined) {
        decorators.push((0, class_validator_1.Max)(max, { message: `Value must be at most ${max}` }));
    }
    const apiPropertyOptions = {
        type: Number,
        format,
        description,
        minimum: allowZero ? 0 : 0.01,
    };
    if (max !== undefined) {
        apiPropertyOptions.maximum = max;
    }
    if (example !== undefined) {
        apiPropertyOptions.example = example;
    }
    decorators.push((0, swagger_1.ApiProperty)(apiPropertyOptions));
    return (0, common_1.applyDecorators)(...decorators);
}
function IsPercentage(options = {}) {
    const { allowDecimal = false, description = 'Percentage value (0-100)', example, } = options;
    const decorators = [
        (0, class_validator_1.IsNumber)({}, { message: 'Must be a number' }),
        (0, class_validator_1.Min)(0, { message: 'Percentage must be at least 0' }),
        (0, class_validator_1.Max)(100, { message: 'Percentage must be at most 100' }),
    ];
    if (!allowDecimal) {
        decorators.push((0, class_validator_1.IsInt)({ message: 'Percentage must be an integer' }));
    }
    decorators.push((0, swagger_1.ApiProperty)({
        type: Number,
        format: allowDecimal ? 'double' : 'int32',
        description,
        minimum: 0,
        maximum: 100,
        ...(example !== undefined && { example }),
    }));
    return (0, common_1.applyDecorators)(...decorators);
}
function IsPriceField(options = {}) {
    const { min = 0, max = 999999.99, description = 'Price', example, currency, } = options;
    const fullDescription = currency ? `${description} (${currency})` : description;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'Price must have at most 2 decimal places' }), (0, class_validator_1.Min)(min, { message: `Price must be at least ${min}` }), (0, class_validator_1.Max)(max, { message: `Price must be at most ${max}` }), (0, swagger_1.ApiProperty)({
        type: Number,
        format: 'double',
        description: fullDescription,
        minimum: min,
        maximum: max,
        multipleOf: 0.01,
        ...(example !== undefined && { example }),
    }));
}
function IsQuantity(options = {}) {
    const { min = 0, max = 999999, description = 'Quantity', example, } = options;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsInt)({ message: 'Quantity must be an integer' }), (0, class_validator_1.Min)(min, { message: `Quantity must be at least ${min}` }), (0, class_validator_1.Max)(max, { message: `Quantity must be at most ${max}` }), (0, swagger_1.ApiProperty)({
        type: Number,
        format: 'int32',
        description,
        minimum: min,
        maximum: max,
        ...(example !== undefined && { example }),
    }));
}
function IsRating(options = {}) {
    const { min = 1, max = 5, allowHalf = false, description = 'Rating (1-5)', example, } = options;
    const decorators = [
        (0, class_validator_1.IsNumber)({}, { message: 'Rating must be a number' }),
        (0, class_validator_1.Min)(min, { message: `Rating must be at least ${min}` }),
        (0, class_validator_1.Max)(max, { message: `Rating must be at most ${max}` }),
    ];
    if (!allowHalf) {
        decorators.push((0, class_validator_1.IsInt)({ message: 'Rating must be a whole number' }));
    }
    else {
        decorators.push((0, class_validator_1.IsNumber)({ maxDecimalPlaces: 1 }, { message: 'Rating can have at most 1 decimal place' }));
    }
    decorators.push((0, swagger_1.ApiProperty)({
        type: Number,
        format: allowHalf ? 'double' : 'int32',
        description,
        minimum: min,
        maximum: max,
        ...(allowHalf && { multipleOf: 0.5 }),
        ...(example !== undefined && { example }),
    }));
    return (0, common_1.applyDecorators)(...decorators);
}
function IsDateField(options = {}) {
    const { description = 'Date', example = '2024-01-01', } = options;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsDate)({ message: 'Must be a valid date' }), (0, class_transformer_1.Type)(() => Date), (0, swagger_1.ApiProperty)({
        type: String,
        format: 'date',
        description,
        example,
    }));
}
function IsDateTimeField(options = {}) {
    const { description = 'Date and time', example = '2024-01-01T12:00:00Z', } = options;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsDate)({ message: 'Must be a valid date-time' }), (0, class_transformer_1.Type)(() => Date), (0, swagger_1.ApiProperty)({
        type: String,
        format: 'date-time',
        description,
        example,
    }));
}
function IsFutureDate(options = {}) {
    const { minDaysFromNow = 0, description = 'Future date', example, } = options;
    const decorators = [
        (0, class_validator_1.IsDate)({ message: 'Must be a valid date' }),
        (0, class_transformer_1.Type)(() => Date),
    ];
    decorators.push((0, swagger_1.ApiProperty)({
        type: String,
        format: 'date-time',
        description: `${description} (must be in the future${minDaysFromNow > 0 ? `, at least ${minDaysFromNow} days from now` : ''})`,
        ...(example && { example }),
    }));
    return (0, common_1.applyDecorators)(...decorators);
}
function IsPastDate(options = {}) {
    const { maxYearsAgo, description = 'Past date', example, } = options;
    const decorators = [
        (0, class_validator_1.IsDate)({ message: 'Must be a valid date' }),
        (0, class_transformer_1.Type)(() => Date),
    ];
    let fullDescription = `${description} (must be in the past)`;
    if (maxYearsAgo) {
        fullDescription += ` within ${maxYearsAgo} years`;
    }
    decorators.push((0, swagger_1.ApiProperty)({
        type: String,
        format: 'date-time',
        description: fullDescription,
        ...(example && { example }),
    }));
    return (0, common_1.applyDecorators)(...decorators);
}
function IsDateRange(fieldName, options = {}) {
    const { description = `${fieldName === 'start' ? 'Start' : 'End'} date`, example, } = options;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsDate)({ message: 'Must be a valid date' }), (0, class_transformer_1.Type)(() => Date), (0, swagger_1.ApiProperty)({
        type: String,
        format: 'date-time',
        description,
        ...(example && { example }),
    }));
}
function IsEnumField(enumType, options = {}) {
    const { description = 'Enum value', example, } = options;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsEnum)(enumType, { message: `Must be one of: ${Object.values(enumType).join(', ')}` }), (0, swagger_1.ApiProperty)({
        enum: Object.values(enumType),
        description,
        ...(example !== undefined && { example }),
    }));
}
function IsBooleanField(options = {}) {
    const { description = 'Boolean value', default: defaultValue, example, } = options;
    const apiOptions = {
        type: Boolean,
        description,
    };
    if (defaultValue !== undefined) {
        apiOptions.default = defaultValue;
    }
    if (example !== undefined) {
        apiOptions.example = example;
    }
    return (0, common_1.applyDecorators)((0, class_validator_1.IsBoolean)({ message: 'Must be a boolean value' }), (0, swagger_1.ApiProperty)(apiOptions));
}
function IsArrayField(itemType, options = {}) {
    const { minItems, maxItems, uniqueItems, description = 'Array of items', } = options;
    const decorators = [
        (0, class_validator_1.IsArray)({ message: 'Must be an array' }),
    ];
    if (minItems !== undefined) {
        decorators.push((0, class_validator_1.ArrayMinSize)(minItems, { message: `Array must contain at least ${minItems} items` }));
    }
    if (maxItems !== undefined) {
        decorators.push((0, class_validator_1.ArrayMaxSize)(maxItems, { message: `Array must contain at most ${maxItems} items` }));
    }
    const apiOptions = {
        type: [itemType],
        description,
        isArray: true,
    };
    if (minItems !== undefined) {
        apiOptions.minItems = minItems;
    }
    if (maxItems !== undefined) {
        apiOptions.maxItems = maxItems;
    }
    if (uniqueItems) {
        apiOptions.uniqueItems = true;
    }
    decorators.push((0, swagger_1.ApiProperty)(apiOptions));
    return (0, common_1.applyDecorators)(...decorators);
}
function IsNestedObject(type, options = {}) {
    const { description = 'Nested object', } = options;
    return (0, common_1.applyDecorators)((0, class_validator_1.ValidateNested)({ message: 'Invalid nested object' }), (0, class_transformer_1.Type)(() => type), (0, swagger_1.ApiProperty)({
        type,
        description,
    }));
}
function IsOptionalField(type, options = {}) {
    const { description = 'Optional field', example, default: defaultValue, } = options;
    const apiOptions = {
        type,
        description,
        required: false,
    };
    if (example !== undefined) {
        apiOptions.example = example;
    }
    if (defaultValue !== undefined) {
        apiOptions.default = defaultValue;
    }
    return (0, common_1.applyDecorators)((0, class_validator_1.IsOptional)(), (0, swagger_1.ApiPropertyOptional)(apiOptions));
}
function IsRequiredField(type, options = {}) {
    const { description = 'Required field', example, } = options;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsNotEmpty)({ message: 'Field is required and cannot be empty' }), (0, swagger_1.ApiProperty)({
        type,
        description,
        required: true,
        ...(example !== undefined && { example }),
    }));
}
function TrimString(options = {}) {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.trim();
        }
        return value;
    });
}
function ToLowerCase(options = {}) {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.toLowerCase();
        }
        return value;
    });
}
function ToUpperCase(options = {}) {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.toUpperCase();
        }
        return value;
    });
}
function SanitizeHtml(options = {}) {
    const { allowedTags = [] } = options;
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            let sanitized = value;
            sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
            if (allowedTags.length > 0) {
                const tagRegex = new RegExp(`<(?!\/?(${allowedTags.join('|')})\b)[^>]+>`, 'gi');
                sanitized = sanitized.replace(tagRegex, '');
            }
            return sanitized;
        }
        return value;
    });
}
function NormalizeWhitespace(options = {}) {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.replace(/\s+/g, ' ').trim();
        }
        return value;
    });
}
function ToInt(options = {}) {
    const { radix = 10 } = options;
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            const parsed = parseInt(value, radix);
            return isNaN(parsed) ? value : parsed;
        }
        return value;
    });
}
function ToFloat(options = {}) {
    const { precision } = options;
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            const parsed = parseFloat(value);
            if (isNaN(parsed)) {
                return value;
            }
            return precision !== undefined ? parseFloat(parsed.toFixed(precision)) : parsed;
        }
        return value;
    });
}
function ToBoolean(options = {}) {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            const lowerValue = value.toLowerCase();
            if (lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes') {
                return true;
            }
            if (lowerValue === 'false' || lowerValue === '0' || lowerValue === 'no') {
                return false;
            }
        }
        if (typeof value === 'number') {
            return value !== 0;
        }
        return value;
    });
}
function ToDate(options = {}) {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string' || typeof value === 'number') {
            const date = new Date(value);
            return isNaN(date.getTime()) ? value : date;
        }
        return value;
    });
}
function ToArray(options = {}) {
    const { separator = ',', trim = true } = options;
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            const items = value.split(separator);
            return trim ? items.map(item => item.trim()) : items;
        }
        if (Array.isArray(value)) {
            return value;
        }
        return [value];
    });
}
function ToJson(options = {}) {
    const { reviver } = options;
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value, reviver);
            }
            catch (error) {
                return value;
            }
        }
        return value;
    });
}
function ValidateIf(condition, ...validators) {
    return (target, propertyKey) => {
        validators.forEach(validator => {
            if (typeof validator === 'function') {
                validator(target, propertyKey);
            }
        });
    };
}
function ValidateWhen(dependentField, expectedValue, ...validators) {
    return (target, propertyKey) => {
        validators.forEach(validator => {
            if (typeof validator === 'function') {
                validator(target, propertyKey);
            }
        });
    };
}
function ValidateWhenNotEmpty(dependentField, ...validators) {
    return (target, propertyKey) => {
        validators.forEach(validator => {
            if (typeof validator === 'function') {
                validator(target, propertyKey);
            }
        });
    };
}
function RequiredWhen(dependentField, expectedValue, options = {}) {
    const { description = 'Conditionally required field' } = options;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiPropertyOptional)({
        description: `${description} (required when ${dependentField} is ${expectedValue})`,
    }));
}
function AtLeastOneOf(fields, options = {}) {
    const { message = `At least one of ${fields.join(', ')} must be provided` } = options;
    return (target, propertyKey) => {
    };
}
function IsUsername(options = {}) {
    const { minLength = 3, maxLength = 20, description = 'Username', example = 'john_doe', } = options;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsString)({ message: 'Username must be a string' }), (0, class_validator_1.Length)(minLength, maxLength), (0, class_validator_1.Matches)(/^[a-zA-Z0-9_-]+$/, { message: 'Username can only contain letters, numbers, underscores, and hyphens' }), (0, swagger_1.ApiProperty)({
        type: String,
        description,
        minLength,
        maxLength,
        pattern: '^[a-zA-Z0-9_-]+$',
        example,
    }));
}
function IsPassword(options = {}) {
    const { minLength = 8, requireUppercase = true, requireLowercase = true, requireNumber = true, requireSpecial = true, description = 'Password', } = options;
    const requirements = [];
    if (requireUppercase)
        requirements.push('uppercase letter');
    if (requireLowercase)
        requirements.push('lowercase letter');
    if (requireNumber)
        requirements.push('number');
    if (requireSpecial)
        requirements.push('special character');
    let pattern = '^';
    if (requireUppercase)
        pattern += '(?=.*[A-Z])';
    if (requireLowercase)
        pattern += '(?=.*[a-z])';
    if (requireNumber)
        pattern += '(?=.*\\d)';
    if (requireSpecial)
        pattern += '(?=.*[@$!%*?&])';
    pattern += `.{${minLength},}$`;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsString)({ message: 'Password must be a string' }), (0, class_validator_1.MinLength)(minLength, { message: `Password must be at least ${minLength} characters` }), (0, class_validator_1.Matches)(new RegExp(pattern), {
        message: `Password must contain at least ${requirements.join(', ')}`,
    }), (0, swagger_1.ApiProperty)({
        type: String,
        format: 'password',
        description: `${description} (min ${minLength} chars, requires: ${requirements.join(', ')})`,
        minLength,
    }));
}
function IsSlug(options = {}) {
    const { minLength = 3, maxLength = 100, description = 'URL slug', example = 'my-slug', } = options;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsString)({ message: 'Slug must be a string' }), (0, class_validator_1.Length)(minLength, maxLength), (0, class_validator_1.Matches)(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Slug must be lowercase alphanumeric with hyphens',
    }), (0, swagger_1.ApiProperty)({
        type: String,
        description,
        minLength,
        maxLength,
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        example,
    }));
}
function IsIPv4(options = {}) {
    const { description = 'IPv4 address', example = '192.168.1.1', } = options;
    const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsString)({ message: 'IP address must be a string' }), (0, class_validator_1.Matches)(ipv4Pattern, { message: 'Invalid IPv4 address format' }), (0, swagger_1.ApiProperty)({
        type: String,
        format: 'ipv4',
        description,
        example,
        pattern: ipv4Pattern.toString(),
    }));
}
function IsCreditCard(options = {}) {
    const { description = 'Credit card number', example = '4111111111111111', } = options;
    const ccPattern = /^[0-9]{13,19}$/;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsString)({ message: 'Card number must be a string' }), (0, class_validator_1.Matches)(ccPattern, { message: 'Invalid credit card format' }), (0, swagger_1.ApiProperty)({
        type: String,
        description,
        example,
        pattern: ccPattern.toString(),
        minLength: 13,
        maxLength: 19,
    }));
}
function IsPostalCode(country = 'US', options = {}) {
    const patterns = {
        US: { pattern: /^\d{5}(-\d{4})?$/, example: '12345' },
        CA: { pattern: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/, example: 'K1A 0B1' },
        UK: { pattern: /^[A-Z]{1,2}\d{1,2} ?\d[A-Z]{2}$/, example: 'SW1A 1AA' },
        DE: { pattern: /^\d{5}$/, example: '10115' },
        FR: { pattern: /^\d{5}$/, example: '75001' },
    };
    const { pattern, example: defaultExample } = patterns[country] || patterns['US'];
    const { description = `${country} postal code`, example = options.example || defaultExample, } = options;
    return (0, common_1.applyDecorators)((0, class_validator_1.IsString)({ message: 'Postal code must be a string' }), (0, class_validator_1.Matches)(pattern, { message: `Invalid ${country} postal code format` }), (0, swagger_1.ApiProperty)({
        type: String,
        description,
        example,
        pattern: pattern.toString(),
    }));
}
//# sourceMappingURL=api-validation-decorators.service.js.map