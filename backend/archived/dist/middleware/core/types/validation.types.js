"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATION_CONFIGS = exports.HEALTHCARE_PATTERNS = void 0;
exports.HEALTHCARE_PATTERNS = {
    MRN: /^[A-Z0-9]{6,12}$/,
    NPI: /^\d{10}$/,
    ICD10: /^[A-Z]\d{2}(\.\d{1,4})?$/,
    PHONE: /^(\+1[-.\s]?)?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}(\s?(ext|x)\s?\d{1,5})?$/i,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    DATE: /^\d{4}-\d{2}-\d{2}$/,
    TIME: /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
    SSN: /^\d{3}-?\d{2}-?\d{4}$/,
    DOSAGE: /^\d+(\.\d+)?\s?(mg|mcg|g|ml|L|IU|units?)$/i,
    ALPHANUMERIC_EXTENDED: /^[a-zA-Z0-9\s\-.,()]+$/,
};
exports.VALIDATION_CONFIGS = {
    healthcare: {
        enableHipaaCompliance: true,
        enableSecurityValidation: true,
        logValidationErrors: true,
        maxFieldLength: 1000,
        allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    },
    admin: {
        enableHipaaCompliance: true,
        enableSecurityValidation: true,
        logValidationErrors: true,
        maxFieldLength: 500,
        allowedFileTypes: ['pdf', 'csv', 'xlsx'],
    },
    public: {
        enableHipaaCompliance: false,
        enableSecurityValidation: true,
        logValidationErrors: false,
        maxFieldLength: 200,
        allowedFileTypes: ['jpg', 'jpeg', 'png'],
    },
};
//# sourceMappingURL=validation.types.js.map