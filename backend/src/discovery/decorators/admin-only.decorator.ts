import { SetMetadata } from '@nestjs/common';

export const ADMIN_ONLY_KEY = 'admin-only';
export const AdminOnly = (requiredRole: string = 'admin') =>
  SetMetadata(ADMIN_ONLY_KEY, requiredRole);
