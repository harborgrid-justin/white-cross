"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertNotFoundException = exports.AlertDeliveryException = exports.AlertException = void 0;
const common_1 = require("@nestjs/common");
class AlertException extends common_1.HttpException {
    constructor(message, status = common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
        super(message, status);
    }
}
exports.AlertException = AlertException;
class AlertDeliveryException extends AlertException {
    constructor(channel, message) {
        super(`${channel} delivery failed: ${message}`, common_1.HttpStatus.SERVICE_UNAVAILABLE);
    }
}
exports.AlertDeliveryException = AlertDeliveryException;
class AlertNotFoundException extends AlertException {
    constructor(alertId) {
        super(`Alert not found: ${alertId}`, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.AlertNotFoundException = AlertNotFoundException;
//# sourceMappingURL=alert.exceptions.js.map