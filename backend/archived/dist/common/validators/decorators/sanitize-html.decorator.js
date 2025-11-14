"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizeHtml = SanitizeHtml;
exports.SanitizeText = SanitizeText;
const class_transformer_1 = require("class-transformer");
function sanitizeHtml(value, options = {}) {
    if (typeof value !== 'string')
        return value;
    let sanitized = value;
    const basicTags = ['b', 'i', 'u', 'em', 'strong', 'p', 'br'];
    const linkTags = ['a'];
    let allowedTags = [];
    if (options.allowedTags) {
        allowedTags = options.allowedTags;
    }
    else {
        if (options.allowBasicFormatting) {
            allowedTags = [...allowedTags, ...basicTags];
        }
        if (options.allowLinks) {
            allowedTags = [...allowedTags, ...linkTags];
        }
    }
    if (allowedTags.length === 0) {
        sanitized = value.replace(/<[^>]*>/g, '');
    }
    else {
        const allowedPattern = allowedTags.join('|');
        const regex = new RegExp(`<(?!\\/?(${allowedPattern})\\b)[^>]*>`, 'gi');
        sanitized = value.replace(regex, '');
    }
    sanitized = sanitized.replace(/\s*(on\w+|javascript:|data:|style)\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&amp;/g, '&');
    sanitized = sanitized
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    return sanitized.trim();
}
function SanitizeHtml(options) {
    return (0, class_transformer_1.Transform)((params) => {
        const { value } = params;
        if (typeof value !== 'string')
            return value;
        return sanitizeHtml(value, options);
    });
}
function SanitizeText() {
    return (0, class_transformer_1.Transform)((params) => {
        const { value } = params;
        if (typeof value !== 'string')
            return value;
        return sanitizeHtml(value, {});
    });
}
//# sourceMappingURL=sanitize-html.decorator.js.map