"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyBroadcastResponseDto = void 0;
const openapi = require("@nestjs/swagger");
class EmergencyBroadcastResponseDto {
    id;
    type;
    priority;
    title;
    message;
    audience;
    schoolId;
    gradeLevel;
    classId;
    groupIds;
    channels;
    requiresAcknowledgment;
    expiresAt;
    sentBy;
    sentAt;
    status;
    totalRecipients;
    deliveredCount;
    failedCount;
    acknowledgedCount;
    followUpRequired;
    followUpInstructions;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, type: { required: true, enum: require("../emergency-broadcast.enums").EmergencyType }, priority: { required: true, enum: require("../emergency-broadcast.enums").EmergencyPriority }, title: { required: true, type: () => String }, message: { required: true, type: () => String }, audience: { required: true, enum: require("../emergency-broadcast.enums").BroadcastAudience, isArray: true }, schoolId: { required: false, type: () => String }, gradeLevel: { required: false, type: () => String }, classId: { required: false, type: () => String }, groupIds: { required: false, type: () => [String] }, channels: { required: true, enum: require("../emergency-broadcast.enums").CommunicationChannel, isArray: true }, requiresAcknowledgment: { required: false, type: () => Boolean }, expiresAt: { required: false, type: () => Date }, sentBy: { required: true, type: () => String }, sentAt: { required: true, type: () => Date }, status: { required: true, enum: require("../emergency-broadcast.enums").BroadcastStatus }, totalRecipients: { required: false, type: () => Number }, deliveredCount: { required: false, type: () => Number }, failedCount: { required: false, type: () => Number }, acknowledgedCount: { required: false, type: () => Number }, followUpRequired: { required: false, type: () => Boolean }, followUpInstructions: { required: false, type: () => String } };
    }
}
exports.EmergencyBroadcastResponseDto = EmergencyBroadcastResponseDto;
//# sourceMappingURL=emergency-broadcast-response.dto.js.map