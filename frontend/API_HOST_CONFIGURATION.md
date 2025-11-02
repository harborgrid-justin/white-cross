# API Host Configuration

## Overview

The frontend now uses a centralized API host configuration system to ensure consistency and easy environment management across all API calls.

## Configuration Structure

### Primary Configuration Location
The main API configuration is located in `src/constants/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  INTERNAL_API_URL: process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  // ... other config
}
```

### Environment Variables

#### Primary Variable (Required)
- **`NEXT_PUBLIC_API_URL`**: The main API host URL
  - Development: `http://localhost:3001`
  - Docker: `http://backend:3001`
  - Production: `https://api.your-domain.com`

#### Secondary Variable (Optional)
- **`INTERNAL_API_URL`**: Used for server-side requests in Docker environments
  - Falls back to `NEXT_PUBLIC_API_URL` if not set
  - Typically only needed in containerized deployments

## Environment Files

### Development (.env.local)
```env
# Primary API Host - Single source of truth
NEXT_PUBLIC_API_URL=http://localhost:3001
INTERNAL_API_URL=http://localhost:3001
```

### Docker Environment
```env
# Primary API Host - Uses Docker service name
NEXT_PUBLIC_API_URL=http://backend:3001
INTERNAL_API_URL=http://backend:3001
```

### Production Environment
```env
# Primary API Host - Production API endpoint
NEXT_PUBLIC_API_URL=https://api.your-domain.com
INTERNAL_API_URL=https://api.your-domain.com
```

## Usage in Code

### API Client
The `ApiClient` automatically uses the centralized configuration:

```typescript
import { apiClient } from '@/services/core/ApiClient';

// All requests automatically use the configured host
const response = await apiClient.get('/students');
```

### Direct Import
For other use cases, import the configuration directly:

```typescript
import { API_CONFIG } from '@/constants/config';

const apiUrl = API_CONFIG.BASE_URL;
```

## Benefits

1. **Single Source of Truth**: One place to configure the API host
2. **Environment Flexibility**: Easy to switch between environments
3. **Consistency**: All API calls use the same host configuration
4. **Docker Support**: Proper internal/external URL handling
5. **Type Safety**: TypeScript ensures proper configuration usage

## Migration Notes

- Removed duplicate `API_BASE_URL` constant from `constants/api.ts`
- Consolidated multiple environment variables into single primary variable
- Updated all environment files to use consistent naming
- Maintained backward compatibility with existing API client usage

## Configuration Changes

To change the API host for any environment:

1. Update the appropriate environment file (`.env.local`, `.env.production`, etc.)
2. Set `NEXT_PUBLIC_API_URL` to the desired host
3. Optionally set `INTERNAL_API_URL` for Docker environments
4. Restart the development server or redeploy

## Troubleshooting

### Common Issues

1. **API calls failing**: Check that `NEXT_PUBLIC_API_URL` is set correctly
2. **Docker connectivity issues**: Ensure `INTERNAL_API_URL` uses the correct service name
3. **Environment not loading**: Verify environment file is named correctly (`.env.local` for development)

### Debugging

Check the current configuration at runtime:
```typescript
console.log('API_CONFIG:', API_CONFIG);
```

## Related Files

- `src/constants/config.ts` - Main configuration
- `src/constants/api.ts` - API endpoints (paths only)
- `src/services/core/ApiClient.ts` - HTTP client implementation
- `.env.local` - Development environment
- `.env.example` - Environment template
