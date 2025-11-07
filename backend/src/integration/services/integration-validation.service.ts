import { Injectable, BadRequestException } from '@nestjs/common';
import { IntegrationType } from '../entities/integration-config.entity';
import { CreateIntegrationDto } from '../dto';

@Injectable()
export class IntegrationValidationService {
  /**
   * Validate core integration data fields
   */
  validateIntegrationData(data: CreateIntegrationDto): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new BadRequestException('Integration name is required');
    }

    if (!data.type) {
      throw new BadRequestException('Integration type is required');
    }

    if (!/^[a-zA-Z0-9\s\-_()]+$/.test(data.name)) {
      throw new BadRequestException(
        'Integration name contains invalid characters',
      );
    }

    if (data.name.length < 2 || data.name.length > 100) {
      throw new BadRequestException(
        'Integration name must be between 2 and 100 characters',
      );
    }
  }

  /**
   * Validate endpoint URL format and security
   */
  validateEndpointUrl(endpoint: string): void {
    if (!endpoint || endpoint.trim().length === 0) {
      throw new BadRequestException('Endpoint URL cannot be empty');
    }

    try {
      const url = new URL(endpoint);

      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new BadRequestException(
          'Endpoint must use HTTP or HTTPS protocol',
        );
      }

      if (process.env.NODE_ENV === 'production') {
        if (
          url.hostname === 'localhost' ||
          url.hostname === '127.0.0.1' ||
          url.hostname === '0.0.0.0'
        ) {
          throw new BadRequestException(
            'Localhost endpoints are not allowed in production',
          );
        }
      }

      if (endpoint.length > 2048) {
        throw new BadRequestException(
          'Endpoint URL cannot exceed 2048 characters',
        );
      }
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid endpoint URL format');
    }
  }

  /**
   * Validate authentication credentials
   */
  validateAuthenticationCredentials(data: CreateIntegrationDto): void {
    const { type, apiKey, username, password } = data;

    if (type === IntegrationType.GOVERNMENT_REPORTING) {
      return;
    }

    if (!apiKey && !username && !password) {
      throw new BadRequestException(
        'At least one authentication method (API Key, username/password, or OAuth2) must be configured',
      );
    }

    if (apiKey) {
      if (apiKey.length < 8) {
        throw new BadRequestException(
          'API Key must be at least 8 characters long',
        );
      }
      if (apiKey.length > 512) {
        throw new BadRequestException('API Key cannot exceed 512 characters');
      }
      if (/^(password|12345|test|demo|api[-_]?key)/i.test(apiKey)) {
        throw new BadRequestException(
          'API Key appears to be insecure or a placeholder',
        );
      }
    }

    if (username) {
      if (username.length < 2 || username.length > 100) {
        throw new BadRequestException(
          'Username must be between 2 and 100 characters',
        );
      }
      if (!/^[a-zA-Z0-9@._\-+]+$/.test(username)) {
        throw new BadRequestException('Username contains invalid characters');
      }
    }

    if (password) {
      if (password.length < 8) {
        throw new BadRequestException(
          'Password must be at least 8 characters long',
        );
      }
      if (password.length > 256) {
        throw new BadRequestException('Password cannot exceed 256 characters');
      }
      if (/^(password|12345678|qwerty|admin|test)/i.test(password)) {
        throw new BadRequestException(
          'Password is too weak or appears to be a placeholder',
        );
      }
    }

    if (username && !password && !apiKey) {
      throw new BadRequestException(
        'Password is required when username is provided for basic authentication',
      );
    }
  }

  /**
   * Validate integration settings object
   */
  validateIntegrationSettings(
    settings: Record<string, unknown>,
  ): void {
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
      throw new BadRequestException('Settings must be a valid JSON object');
    }

    if ('timeout' in settings && settings.timeout !== undefined) {
      const timeout = Number(settings.timeout);
      if (isNaN(timeout) || timeout < 1000 || timeout > 300000) {
        throw new BadRequestException(
          'Timeout must be between 1000ms (1s) and 300000ms (5min)',
        );
      }
    }

    if ('retryAttempts' in settings && settings.retryAttempts !== undefined) {
      const retryAttempts = Number(settings.retryAttempts);
      if (isNaN(retryAttempts) || retryAttempts < 0 || retryAttempts > 10) {
        throw new BadRequestException(
          'Retry attempts must be between 0 and 10',
        );
      }
    }

    if ('retryDelay' in settings && settings.retryDelay !== undefined) {
      const retryDelay = Number(settings.retryDelay);
      if (isNaN(retryDelay) || retryDelay < 100 || retryDelay > 60000) {
        throw new BadRequestException(
          'Retry delay must be between 100ms and 60000ms (1min)',
        );
      }
    }

    if ('authMethod' in settings && settings.authMethod) {
      const validAuthMethods = [
        'api_key',
        'basic_auth',
        'oauth2',
        'jwt',
        'certificate',
        'custom',
      ];
      if (!validAuthMethods.includes(String(settings.authMethod))) {
        throw new BadRequestException(
          `Invalid authentication method. Must be one of: ${validAuthMethods.join(', ')}`,
        );
      }
    }

    if ('syncDirection' in settings && settings.syncDirection) {
      const validDirections = ['inbound', 'outbound', 'bidirectional'];
      if (!validDirections.includes(String(settings.syncDirection))) {
        throw new BadRequestException(
          `Invalid sync direction. Must be one of: ${validDirections.join(', ')}`,
        );
      }
    }

    if (
      'rateLimitPerSecond' in settings &&
      settings.rateLimitPerSecond !== undefined
    ) {
      const rateLimit = Number(settings.rateLimitPerSecond);
      if (isNaN(rateLimit) || rateLimit < 1 || rateLimit > 1000) {
        throw new BadRequestException(
          'Rate limit must be between 1 and 1000 requests per second',
        );
      }
    }
  }

  /**
   * Validate sync frequency value
   */
  validateSyncFrequency(syncFrequency: number): void {
    if (syncFrequency < 1 || syncFrequency > 43200) {
      throw new BadRequestException(
        'Sync frequency must be between 1 and 43200 minutes',
      );
    }
  }
}
