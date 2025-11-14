"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmailAddress = validateEmailAddress;
exports.validatePhoneNumber = validatePhoneNumber;
exports.formatPhoneNumber = formatPhoneNumber;
exports.validateSMSLength = validateSMSLength;
function validateEmailAddress(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    const parts = email.split('@');
    if (parts.length !== 2) {
        return false;
    }
    const [localPart, domain] = parts;
    if (localPart.length > 64 || localPart.length === 0) {
        return false;
    }
    if (domain.length > 253 || domain.length === 0) {
        return false;
    }
    if (email.includes('..')) {
        return false;
    }
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
        return false;
    }
    return true;
}
function validatePhoneNumber(phone, country = 'US') {
    if (!phone || typeof phone !== 'string') {
        return false;
    }
    const digitsOnly = phone.replace(/\D/g, '');
    switch (country.toUpperCase()) {
        case 'US':
        case 'CA':
            return (digitsOnly.length === 10 ||
                (digitsOnly.length === 11 && digitsOnly.startsWith('1')));
        case 'UK':
            return digitsOnly.length >= 10 && digitsOnly.length <= 11;
        case 'AU':
            return digitsOnly.length >= 9 && digitsOnly.length <= 10;
        case 'DE':
            return digitsOnly.length >= 11 && digitsOnly.length <= 12;
        case 'FR':
            return digitsOnly.length === 10;
        default:
            return digitsOnly.length >= 7 && digitsOnly.length <= 15;
    }
}
function formatPhoneNumber(phone, country = 'US') {
    if (!phone || typeof phone !== 'string') {
        return '';
    }
    const digitsOnly = phone.replace(/\D/g, '');
    switch (country.toUpperCase()) {
        case 'US':
        case 'CA':
            if (digitsOnly.length === 10) {
                return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
            }
            else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
                return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
            }
            break;
        case 'UK':
            if (digitsOnly.length === 10) {
                return `${digitsOnly.slice(0, 4)} ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7)}`;
            }
            break;
        default:
            if (digitsOnly.length >= 7) {
                return `+${digitsOnly.slice(0, -7)} ${digitsOnly.slice(-7, -4)} ${digitsOnly.slice(-4)}`;
            }
    }
    return phone;
}
function validateSMSLength(message) {
    if (!message || typeof message !== 'string') {
        return { isValid: false, length: 0, segments: 0, maxLength: 160 };
    }
    const length = message.length;
    const hasSpecialChars = /[^\x00-\x7F]/.test(message);
    const maxSingleSegment = hasSpecialChars ? 70 : 160;
    const maxMultiSegment = hasSpecialChars ? 67 : 153;
    let segments = 1;
    let maxLength = maxSingleSegment;
    if (length > maxSingleSegment) {
        segments = Math.ceil(length / maxMultiSegment);
        maxLength = segments * maxMultiSegment;
    }
    return {
        isValid: length <= 1600,
        length,
        segments,
        maxLength,
    };
}
//# sourceMappingURL=validators.js.map