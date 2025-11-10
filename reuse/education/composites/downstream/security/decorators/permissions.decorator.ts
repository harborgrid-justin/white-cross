/**
 * Permissions Decorator
 * Marks endpoints with required permissions
 */

import { SetMetadata } from '@nestjs/common';

export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);

export default RequirePermissions;
