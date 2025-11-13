/**
 * @fileoverview Alert Exception Classes
 * @module alerts/exceptions
 * @description Custom exceptions for alert operations
 */

import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base Alert Exception
 */
export class AlertException extends HttpException {
  constructor(
    message: string,
    status: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message, status);
  }
}

/**
 * Alert Delivery Exception
 */
export class AlertDeliveryException extends AlertException {
  constructor(channel: string, message: string) {
    super(
      `${channel} delivery failed: ${message}`,
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}

/**
 * Alert Not Found Exception
 */
export class AlertNotFoundException extends AlertException {
  constructor(alertId: string) {
    super(`Alert not found: ${alertId}`, HttpStatus.NOT_FOUND);
  }
}
