"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactUpdateEmergencyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_emergency_contact_dto_1 = require("./create-emergency-contact.dto");
class ContactUpdateEmergencyDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_emergency_contact_dto_1.ContactCreateEmergencyDto, ['studentId'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.ContactUpdateEmergencyDto = ContactUpdateEmergencyDto;
//# sourceMappingURL=update-emergency-contact.dto.js.map