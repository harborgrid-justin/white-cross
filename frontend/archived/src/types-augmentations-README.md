# Module Augmentations

This directory contains TypeScript module augmentation files (`.d.ts`) that extend or declare types for third-party libraries.

## Files

- `apollo-client.d.ts` - Type declarations for Apollo GraphQL client
- `notification-api.d.ts` - Type declarations for Notification API
- `react-dom.d.ts` - Type declarations for React DOM
- `react-router-dom.d.ts` - Type declarations for React Router DOM
- `sentry.d.ts` - Type declarations for Sentry error tracking
- `tanstack-react-query.d.ts` - Type declarations for TanStack Query (React Query)
- `zod.d.ts` - Type declarations for Zod validation library

## Usage

These files are automatically included in TypeScript compilation via the `tsconfig.json` configuration. No explicit imports are needed for module augmentations.

## Adding New Augmentations

1. Create a new `.d.ts` file in this directory
2. Use `declare module 'package-name'` syntax
3. The file will be automatically picked up by TypeScript
