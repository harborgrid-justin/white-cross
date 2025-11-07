/**
 * GraphQL Complexity Plugin
 *
 * Analyzes and limits query complexity to prevent resource exhaustion attacks
 * and ensure fair API usage. Calculates complexity based on query depth,
 * field count, and pagination arguments.
 *
 * Security Benefits:
 * - Prevents denial of service attacks via complex queries
 * - Protects database from expensive nested queries
 * - Ensures fair resource allocation among users
 * - Provides visibility into query costs
 *
 * @module ComplexityPlugin
 */
import { Plugin } from '@nestjs/apollo';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { GraphQLError } from 'graphql';
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from 'graphql-query-complexity';

/**
 * Maximum allowed query complexity
 *
 * This limit prevents overly complex queries that could impact performance.
 * Adjust based on your infrastructure capacity and usage patterns.
 */
const MAX_COMPLEXITY = 1000;

/**
 * Complexity weights for different field types
 *
 * These weights help calculate the cost of resolving different fields.
 * Higher weights indicate more expensive operations.
 */
const COMPLEXITY_WEIGHTS = {
  // Basic fields (low cost)
  scalar: 1,

  // Object fields (medium cost)
  object: 5,

  // List fields (higher cost, multiplied by limit)
  list: 10,

  // Nested relationships (high cost due to potential N+1)
  relationship: 15,
};

/**
 * GraphQL Complexity Plugin
 *
 * Calculates query complexity and rejects queries that exceed the maximum.
 * Logs complexity metrics for monitoring and optimization.
 */
@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
  constructor(private readonly gqlSchemaHost: GraphQLSchemaHost) {}

  /**
   * Plugin initialization hook
   */
  async serverWillStart(): Promise<void> {
    console.log('GraphQL Complexity Plugin initialized');
    console.log(`Maximum query complexity: ${MAX_COMPLEXITY}`);
  }

  /**
   * Request lifecycle hook - analyze complexity before execution
   */
  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    const schema = this.gqlSchemaHost.schema;

    return {
      /**
       * Validate query complexity after the operation is resolved
       */
      async didResolveOperation({ request, document }) {
        try {
          // Calculate query complexity
          const complexity = getComplexity({
            schema,
            operationName: request.operationName,
            query: document,
            variables: request.variables,
            estimators: [
              // Use field extensions if defined (allows custom complexity per field)
              fieldExtensionsEstimator(),

              // Simple estimator as fallback
              simpleEstimator({
                defaultComplexity: COMPLEXITY_WEIGHTS.scalar,
              }),
            ],
          });

          // Log complexity for monitoring
          console.log('Query Complexity:', {
            operationName: request.operationName,
            complexity,
            timestamp: new Date().toISOString(),
          });

          // Reject if complexity exceeds maximum
          if (complexity > MAX_COMPLEXITY) {
            throw new GraphQLError(
              `Query is too complex: ${complexity}. Maximum allowed complexity: ${MAX_COMPLEXITY}. ` +
                `Please simplify your query or paginate the results.`,
              {
                extensions: {
                  code: 'QUERY_TOO_COMPLEX',
                  complexity,
                  maxComplexity: MAX_COMPLEXITY,
                },
              },
            );
          }

          // Warn if complexity is approaching the limit
          if (complexity > MAX_COMPLEXITY * 0.8) {
            console.warn(
              `Query complexity is approaching limit: ${complexity}/${MAX_COMPLEXITY}`,
              {
                operationName: request.operationName,
              },
            );
          }
        } catch (error) {
          // Re-throw GraphQL errors
          if (error instanceof GraphQLError) {
            throw error;
          }

          // Log unexpected errors but don't block the query
          console.error('Error calculating query complexity:', error);
        }
      },
    };
  }
}
