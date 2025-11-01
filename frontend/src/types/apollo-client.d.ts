/**
 * Apollo Client Type Extensions
 * Extends Apollo Client types to add missing properties used in the codebase
 */

import '@apollo/client';

declare module '@apollo/client' {
  // Extend ApolloClientOptions to include devtools connection option
  export interface ApolloClientOptions<TCacheShape> {
    connectToDevTools?: boolean; // Enable/disable React DevTools integration
  }
}
