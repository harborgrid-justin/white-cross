/**
 * Roles Decorator
 * Marks endpoints with required roles
 */

import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

export default Roles;
