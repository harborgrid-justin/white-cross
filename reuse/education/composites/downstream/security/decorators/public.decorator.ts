/**
 * Public Decorator
 * Marks endpoints as public (no authentication required)
 */

import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('isPublic', true);

export default Public;
