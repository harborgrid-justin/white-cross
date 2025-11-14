"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentStatusTransitions = void 0;
const common_1 = require("@nestjs/common");
const update_appointment_dto_1 = require("../dto/update-appointment.dto");
class AppointmentStatusTransitions {
    static ALLOWED_TRANSITIONS = {
        [update_appointment_dto_1.AppointmentStatus.SCHEDULED]: [
            update_appointment_dto_1.AppointmentStatus.IN_PROGRESS,
            update_appointment_dto_1.AppointmentStatus.CANCELLED,
            update_appointment_dto_1.AppointmentStatus.NO_SHOW,
            update_appointment_dto_1.AppointmentStatus.COMPLETED,
        ],
        [update_appointment_dto_1.AppointmentStatus.IN_PROGRESS]: [
            update_appointment_dto_1.AppointmentStatus.COMPLETED,
            update_appointment_dto_1.AppointmentStatus.CANCELLED,
        ],
        [update_appointment_dto_1.AppointmentStatus.COMPLETED]: [],
        [update_appointment_dto_1.AppointmentStatus.CANCELLED]: [],
        [update_appointment_dto_1.AppointmentStatus.NO_SHOW]: [],
    };
    static validateStatusTransition(currentStatus, newStatus) {
        if (!this.canTransitionTo(currentStatus, newStatus)) {
            throw new common_1.BadRequestException(`Cannot transition from ${currentStatus} to ${newStatus}. ` +
                `Allowed transitions: ${this.ALLOWED_TRANSITIONS[currentStatus].join(', ') || 'none'}`);
        }
    }
    static canTransitionTo(currentStatus, newStatus) {
        if (currentStatus === newStatus) {
            return true;
        }
        const allowedTransitions = this.ALLOWED_TRANSITIONS[currentStatus] || [];
        return allowedTransitions.includes(newStatus);
    }
    static getAllowedTransitions(currentStatus) {
        return this.ALLOWED_TRANSITIONS[currentStatus] || [];
    }
    static isFinalState(status) {
        return (this.ALLOWED_TRANSITIONS[status] &&
            this.ALLOWED_TRANSITIONS[status].length === 0);
    }
}
exports.AppointmentStatusTransitions = AppointmentStatusTransitions;
//# sourceMappingURL=status-transitions.js.map