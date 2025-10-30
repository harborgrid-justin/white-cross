import { HttpException, HttpStatus } from '@nestjs/common';

export class ProviderNotFoundException extends HttpException {
  constructor(providerToken: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Provider Not Found',
        message: `Provider with token '${providerToken}' was not found`,
        module: 'discovery',
        errorCode: 'PROVIDER_NOT_FOUND',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class ControllerNotFoundException extends HttpException {
  constructor(controllerName: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Controller Not Found',
        message: `Controller '${controllerName}' was not found`,
        module: 'discovery',
        errorCode: 'CONTROLLER_NOT_FOUND',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class InvalidMetadataException extends HttpException {
  constructor(metadataKey: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Invalid Metadata',
        message: `Invalid metadata key '${metadataKey}' provided`,
        module: 'discovery',
        errorCode: 'INVALID_METADATA_KEY',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class DiscoveryOperationException extends HttpException {
  constructor(operation: string, reason: string) {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Discovery Operation Failed',
        message: `Failed to ${operation}: ${reason}`,
        module: 'discovery',
        errorCode: 'DISCOVERY_OPERATION_FAILED',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class InvalidProviderTypeException extends HttpException {
  constructor(invalidType: string, validTypes: string[]) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Invalid Provider Type',
        message: `Invalid provider type '${invalidType}'. Valid types are: ${validTypes.join(', ')}`,
        module: 'discovery',
        errorCode: 'INVALID_PROVIDER_TYPE',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class RateLimitExceededException extends HttpException {
  constructor(limit: number, windowMs: number, identifier: string) {
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        error: 'Rate Limit Exceeded',
        message: `Rate limit of ${limit} requests per ${windowMs}ms exceeded for identifier: ${identifier}`,
        module: 'discovery',
        errorCode: 'RATE_LIMIT_EXCEEDED',
        retryAfter: windowMs,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}

export class UnauthorizedDiscoveryAccessException extends HttpException {
  constructor(endpoint: string, requiredRole?: string) {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        error: 'Unauthorized Access',
        message: `Access denied to discovery endpoint '${endpoint}'${requiredRole ? `. Required role: ${requiredRole}` : ''}`,
        module: 'discovery',
        errorCode: 'UNAUTHORIZED_DISCOVERY_ACCESS',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
