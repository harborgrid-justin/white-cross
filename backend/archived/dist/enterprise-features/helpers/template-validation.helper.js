"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateValidationHelper = void 0;
class TemplateValidationHelper {
    static validateTemplateParameters(name, category, subject, body, variables, language) {
        if (!name || name.trim().length === 0) {
            throw new Error('Template name is required');
        }
        if (!category || category.trim().length === 0) {
            throw new Error('Template category is required');
        }
        if (!subject || subject.trim().length === 0) {
            throw new Error('Template subject is required');
        }
        if (!body || body.trim().length === 0) {
            throw new Error('Template body is required');
        }
        if (!variables || variables.length === 0) {
            throw new Error('Template variables are required');
        }
        if (!language || language.trim().length === 0) {
            throw new Error('Template language is required');
        }
    }
    static validateUpdateParameters(templateId, updates, updatedBy) {
        if (!templateId || templateId.trim().length === 0) {
            throw new Error('Template ID is required');
        }
        if (!updates || Object.keys(updates).length === 0) {
            throw new Error('Updates are required');
        }
        if (!updatedBy || updatedBy.trim().length === 0) {
            throw new Error('Updated by is required');
        }
    }
    static validateTemplateId(templateId) {
        if (!templateId || templateId.trim().length === 0) {
            throw new Error('Template ID is required');
        }
    }
    static validateCategory(category) {
        if (!category || category.trim().length === 0) {
            throw new Error('Category is required');
        }
    }
    static validateRenderParameters(templateId, variables) {
        if (!templateId || templateId.trim().length === 0) {
            throw new Error('Template ID is required');
        }
        if (!variables) {
            throw new Error('Variables are required');
        }
    }
    static validateDeleteParameters(templateId, deletedBy) {
        if (!templateId || templateId.trim().length === 0) {
            throw new Error('Template ID is required');
        }
        if (!deletedBy || deletedBy.trim().length === 0) {
            throw new Error('Deleted by is required');
        }
    }
    static validateCloneParameters(templateId, newName, clonedBy) {
        if (!templateId || templateId.trim().length === 0) {
            throw new Error('Template ID is required');
        }
        if (!newName || newName.trim().length === 0) {
            throw new Error('New name is required');
        }
        if (!clonedBy || clonedBy.trim().length === 0) {
            throw new Error('Cloned by is required');
        }
    }
    static findMissingVariables(content) {
        const variableRegex = /\{\{(\w+)\}\}/g;
        const matches = content.match(variableRegex);
        if (!matches)
            return [];
        const foundVars = new Set(matches.map((match) => match.replace(/\{\{|\}\}/g, '')));
        return Array.from(foundVars);
    }
}
exports.TemplateValidationHelper = TemplateValidationHelper;
//# sourceMappingURL=template-validation.helper.js.map