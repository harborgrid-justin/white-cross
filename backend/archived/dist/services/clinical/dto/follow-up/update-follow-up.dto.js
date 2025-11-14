"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFollowUpDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const schedule_follow_up_dto_1 = require("./schedule-follow-up.dto");
class UpdateFollowUpDto extends (0, swagger_1.PartialType)(schedule_follow_up_dto_1.ScheduleFollowUpDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateFollowUpDto = UpdateFollowUpDto;
//# sourceMappingURL=update-follow-up.dto.js.map