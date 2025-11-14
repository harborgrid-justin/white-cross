"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMessageTemplateDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_message_template_dto_1 = require("./create-message-template.dto");
class UpdateMessageTemplateDto extends (0, mapped_types_1.PartialType)(create_message_template_dto_1.CreateMessageTemplateDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateMessageTemplateDto = UpdateMessageTemplateDto;
//# sourceMappingURL=update-message-template.dto.js.map