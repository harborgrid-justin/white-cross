"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipientDeliveryStatusDto = void 0;
const openapi = require("@nestjs/swagger");
class RecipientDeliveryStatusDto {
    recipientId;
    recipientType;
    name;
    contactMethod;
    phoneNumber;
    email;
    status;
    deliveredAt;
    acknowledgedAt;
    error;
    static _OPENAPI_METADATA_FACTORY() {
        return { recipientId: { required: true, type: () => String }, recipientType: { required: true, enum: require("../emergency-broadcast.enums").RecipientType }, name: { required: true, type: () => String }, contactMethod: { required: true, enum: require("../emergency-broadcast.enums").CommunicationChannel }, phoneNumber: { required: false, type: () => String }, email: { required: false, type: () => String }, status: { required: true, enum: require("../emergency-broadcast.enums").DeliveryStatus }, deliveredAt: { required: false, type: () => Date }, acknowledgedAt: { required: false, type: () => Date }, error: { required: false, type: () => String } };
    }
}
exports.RecipientDeliveryStatusDto = RecipientDeliveryStatusDto;
//# sourceMappingURL=recipient-delivery-status.dto.js.map