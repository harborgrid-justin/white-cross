"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyTemplatesResponseDto = exports.EmergencyTemplateDto = void 0;
const openapi = require("@nestjs/swagger");
class EmergencyTemplateDto {
    title;
    message;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, message: { required: true, type: () => String } };
    }
}
exports.EmergencyTemplateDto = EmergencyTemplateDto;
class EmergencyTemplatesResponseDto {
    templates;
    static _OPENAPI_METADATA_FACTORY() {
        return { templates: { required: true, type: () => Object } };
    }
}
exports.EmergencyTemplatesResponseDto = EmergencyTemplatesResponseDto;
//# sourceMappingURL=emergency-template-response.dto.js.map