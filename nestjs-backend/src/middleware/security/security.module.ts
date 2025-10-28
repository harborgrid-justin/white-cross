import { Module } from '@nestjs/common';
import { CspMiddleware } from './csp.middleware';
import { CorsMiddleware } from './cors.middleware';
import { SecurityHeadersMiddleware } from './security-headers.middleware';
import { RateLimitGuard } from './rate-limit.guard';
import { CsrfGuard } from './csrf.guard';

@Module({
  providers: [
    CspMiddleware,
    CorsMiddleware,
    SecurityHeadersMiddleware,
    RateLimitGuard,
    CsrfGuard,
  ],
  exports: [
    CspMiddleware,
    CorsMiddleware,
    SecurityHeadersMiddleware,
    RateLimitGuard,
    CsrfGuard,
  ],
})
export class SecurityModule {}
