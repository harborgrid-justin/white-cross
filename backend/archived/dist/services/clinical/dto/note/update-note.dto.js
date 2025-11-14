"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNoteDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_note_dto_1 = require("./create-note.dto");
class UpdateNoteDto extends (0, swagger_1.PartialType)(create_note_dto_1.CreateNoteDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateNoteDto = UpdateNoteDto;
//# sourceMappingURL=update-note.dto.js.map