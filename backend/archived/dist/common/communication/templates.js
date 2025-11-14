"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMessageTemplate = buildMessageTemplate;
exports.extractTemplateVariables = extractTemplateVariables;
exports.calculateMessageCost = calculateMessageCost;
exports.validateTemplateVariables = validateTemplateVariables;
exports.sanitizeMessageContent = sanitizeMessageContent;
function buildMessageTemplate(template, variables) {
    if (!template || typeof template !== 'string') {
        return '';
    }
    let processedMessage = template;
    const variableRegex = /\{\{([^}]+)\}\}/g;
    processedMessage = processedMessage.replace(variableRegex, (_match, variableName) => {
        if (typeof variableName !== 'string')
            return '';
        const trimmedName = variableName.trim();
        if (Object.prototype.hasOwnProperty.call(variables, trimmedName)) {
            const value = variables[trimmedName];
            if (value === null || value === undefined) {
                return '';
            }
            else if (typeof value === 'object') {
                return JSON.stringify(value);
            }
            else {
                return String(value);
            }
        }
        return `{{${trimmedName}}}`;
    });
    const conditionalRegex = /\[if:([^\]]+)\](.*?)\[\/if\]/g;
    processedMessage = processedMessage.replace(conditionalRegex, (_match, condition, content) => {
        const trimmedCondition = condition.trim();
        if (variables.hasOwnProperty(trimmedCondition) &&
            variables[trimmedCondition]) {
            return content;
        }
        return '';
    });
    const dateRegex = /\[date:([^:]+):([^\]]+)\]/g;
    processedMessage = processedMessage.replace(dateRegex, (match, variableName, format) => {
        const trimmedName = variableName.trim();
        if (variables.hasOwnProperty(trimmedName)) {
            const dateValue = variables[trimmedName];
            const date = new Date(dateValue);
            if (!isNaN(date.getTime())) {
                return formatDate(date, format);
            }
        }
        return match;
    });
    return processedMessage.trim();
}
function extractTemplateVariables(template) {
    if (!template || typeof template !== 'string') {
        return [];
    }
    const variables = [];
    const variableRegex = /\{\{([^}]+)\}\}/g;
    let match;
    while ((match = variableRegex.exec(template)) !== null) {
        if (match[1]) {
            const variableName = match[1].trim();
            if (!variables.includes(variableName)) {
                variables.push(variableName);
            }
        }
    }
    const conditionalRegex = /\[if:([^\]]+)\]/g;
    while ((match = conditionalRegex.exec(template)) !== null) {
        if (match[1]) {
            const variableName = match[1].trim();
            if (!variables.includes(variableName)) {
                variables.push(variableName);
            }
        }
    }
    const dateRegex = /\[date:([^:]+):/g;
    while ((match = dateRegex.exec(template)) !== null) {
        if (match[1]) {
            const variableName = match[1].trim();
            if (!variables.includes(variableName)) {
                variables.push(variableName);
            }
        }
    }
    return variables;
}
function calculateMessageCost(message, channel) {
    const baseCosts = {
        SMS: 0.0075,
        EMAIL: 0.0001,
        PUSH: 0.0001,
    };
    const lengthMultipliers = {
        SMS: (length) => Math.ceil(length / 160),
        EMAIL: () => 1,
        PUSH: () => 1,
    };
    const baseCost = baseCosts[channel] || 0;
    const messageLength = message ? message.length : 0;
    const lengthMultiplier = lengthMultipliers[channel](messageLength);
    const channelMultiplier = 1;
    const estimatedCost = baseCost * lengthMultiplier * channelMultiplier;
    return {
        estimatedCost: Math.round(estimatedCost * 10000) / 10000,
        currency: 'USD',
        breakdown: {
            baseCost,
            lengthMultiplier,
            channelMultiplier,
        },
    };
}
function validateTemplateVariables(template, variables) {
    const requiredVariables = extractTemplateVariables(template);
    const missingVariables = requiredVariables.filter((variable) => !variables.hasOwnProperty(variable) ||
        variables[variable] === null ||
        variables[variable] === undefined);
    return {
        isValid: missingVariables.length === 0,
        missingVariables,
    };
}
function sanitizeMessageContent(message, channel) {
    if (!message || typeof message !== 'string') {
        return '';
    }
    let sanitized = message;
    sanitized = sanitized
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    switch (channel) {
        case 'SMS':
            sanitized = sanitized.replace(/<[^>]*>/g, '');
            if (sanitized.length > 1600) {
                sanitized = sanitized.substring(0, 1597) + '...';
            }
            break;
        case 'EMAIL':
            sanitized = sanitized.replace(/<(?!\/?(?:b|i|u|strong|em|br|p|a|h[1-6]|ul|ol|li|blockquote)\b)[^>]*>/gi, '');
            break;
        case 'PUSH':
            sanitized = sanitized.replace(/<[^>]*>/g, '');
            if (sanitized.length > 200) {
                sanitized = sanitized.substring(0, 197) + '...';
            }
            break;
    }
    return sanitized.trim();
}
function formatDate(date, format) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes);
}
//# sourceMappingURL=templates.js.map