/**
 * API Key Decorator
 * Marks endpoints as requiring API key authentication
 */

import { SetMetadata } from '@nestjs/common';

export const RequireApiKey = () => SetMetadata('apiKey', true);

export default RequireApiKey;
