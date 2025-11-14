"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInteractionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const add_interaction_dto_1 = require("./add-interaction.dto");
class UpdateInteractionDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(add_interaction_dto_1.AddInteractionDto, ['drug1Id', 'drug2Id'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateInteractionDto = UpdateInteractionDto;
//# sourceMappingURL=update-interaction.dto.js.map