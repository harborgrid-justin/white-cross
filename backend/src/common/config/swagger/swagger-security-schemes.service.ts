/**
 * Swagger Security Schemes Service
 *
 * Refactored service for configuring OpenAPI/Swagger security schemes.
 * This service provides a centralized way to configure various authentication
 * and authorization schemes for API documentation and validation.
 *
 * @module swagger/swagger-security-schemes.service
 * @version 1.0.0
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BaseService } from '@/common/base';
// Local type definitions to avoid import issues
interface JwtSecurityOptions {
  secret?: string;
  issuer?: string;
  audience?: string | string[];
  algorithm?: 'HS256' | 'RS256' | 'ES256';
  expiresIn?: string;
  scopes?: string[];
  requiredClaims?: string[];
}

interface ApiKeyOptions {
  name?: string;
  in?: 'header' | 'query' | 'cookie';
  description?: string;
}

interface HmacOptions {
  algorithm?: string;
  signatureHeader?: string;
  timestampHeader?: string;
  clockSkewTolerance?: number;
}

interface MutualTlsOptions {
  validationLevel?: string;
  trustedCAs?: string[];
  clientCertRequired?: boolean;
}

interface SecuritySchemeConfig {
  jwt?: JwtSecurityOptions;
  apiKey?: ApiKeyOptions;
  hmac?: HmacOptions;
  mutualTls?: MutualTlsOptions;
}

@Injectable()
export class SwaggerSecuritySchemesService extends BaseService {
  constructor(private readonly configService: ConfigService) {
    super("SwaggerSecuritySchemesService");}

  /**
   * Creates JWT Bearer token authentication scheme configuration.
   *
   * @param options - JWT security configuration options
   * @returns JWT authentication configuration object
   */
  createJwtBearerScheme(options: JwtSecurityOptions = {}): JwtSecurityOptions {
    return {
      secret: options.secret || this.configService.get<string>('JWT_SECRET'),
      issuer: options.issuer || 'white-cross-healthcare',
      audience: options.audience || ['api'],
      algorithm: options.algorithm || 'RS256',
      expiresIn: options.expiresIn || '15m',
      ...options,
    };
  }

  /**
   * Creates API key authentication configuration.
   *
   * @param name - API key parameter name
   * @param location - Where to find the API key
   * @param options - API key options
   * @returns API key configuration object
   */
  createApiKeyScheme(
    name = 'X-API-Key',
    location: 'header' | 'query' | 'cookie' = 'header',
    options: ApiKeyOptions = {},
  ): ApiKeyOptions & { name: string; in: string } {
    return {
      name,
      in: location,
      description: options.description || `API key via ${location}`,
      ...options,
    };
  }

  /**
   * Creates HMAC authentication configuration.
   *
   * @param options - HMAC authentication options
   * @returns HMAC configuration object
   */
  createHmacScheme(options: HmacOptions = {}): HmacOptions {
    return {
      algorithm: options.algorithm || 'sha256',
      signatureHeader: options.signatureHeader || 'X-Signature',
      timestampHeader: options.timestampHeader || 'X-Timestamp',
      clockSkewTolerance: options.clockSkewTolerance || 300,
      ...options,
    };
  }

  /**
   * Creates mutual TLS configuration.
   *
   * @param options - Mutual TLS options
   * @returns mTLS configuration object
   */
  createMutualTlsScheme(options: MutualTlsOptions = {}): MutualTlsOptions {
    return {
      validationLevel: options.validationLevel || 'basic',
      trustedCAs: options.trustedCAs || [],
      clientCertRequired: options.clientCertRequired ?? true,
      ...options,
    };
  }

  /**
   * Gets the default security configuration for the application.
   *
   * @returns Default security scheme configuration
   */
  getDefaultSecurityConfig(): SecuritySchemeConfig {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const environment = this.configService.get<string>('NODE_ENV', 'development');

    const config: SecuritySchemeConfig = {
      jwt: {
        secret: jwtSecret,
        issuer: 'white-cross-healthcare',
        audience: environment === 'production' ? ['white-cross-prod'] : ['white-cross-dev'],
        algorithm: 'RS256',
        expiresIn: '15m',
      },
      apiKey: {
        name: 'X-API-Key',
        in: 'header',
        description: 'API key for external integrations',
      },
    };

    // Add additional security in production
    if (environment === 'production') {
      config.hmac = {
        algorithm: 'sha256',
        signatureHeader: 'X-Signature',
        timestampHeader: 'X-Timestamp',
        clockSkewTolerance: 300,
      };
    }

    return config;
  }
}
