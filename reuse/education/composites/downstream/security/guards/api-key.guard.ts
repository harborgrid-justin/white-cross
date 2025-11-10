/**
 * API Key Guard
 * Validates API key authentication for external integrations
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if API key auth is required
    const requireApiKey = this.reflector.getAllAndOverride<boolean>('apiKey', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireApiKey) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    // In production, validate against database of valid API keys
    const validApiKey = this.configService.get<string>('API_KEY') || 'development-api-key';

    if (apiKey !== validApiKey) {
      console.warn('Invalid API key attempt:', {
        ip: request.ip,
        path: request.url,
        method: request.method,
      });

      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}

export default ApiKeyGuard;
