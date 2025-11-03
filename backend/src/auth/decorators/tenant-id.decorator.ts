import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extract tenant ID from authenticated request
 *
 * @example
 * async createResource(@TenantId() tenantId: string) {
 *   return this.service.create({ tenantId, ... });
 * }
 */
export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.tenantId || null;
  },
);
