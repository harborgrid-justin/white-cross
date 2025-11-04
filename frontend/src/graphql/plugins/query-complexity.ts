/**
 * GraphQL Query Complexity Management
 *
 * Item 193: Query complexity managed to prevent expensive queries
 *
 * This plugin analyzes query complexity and prevents overly expensive
 * queries that could impact server performance.
 */

import { ApolloLink } from '@apollo/client';
import { getOperationAST } from 'graphql';

// Configuration for query complexity limits
const COMPLEXITY_CONFIG = {
  // Maximum query complexity score
  maxComplexity: 1000,

  // Field complexity scores
  fieldComplexity: {
    // Simple scalar fields
    default: 1,

    // List fields (multiplier based on limit)
    list: (limit: number = 100) => limit * 2,

    // Connection fields with pagination
    connection: (first: number = 10) => first * 3,

    // Expensive computed fields
    computed: 10,

    // Relations
    relation: 5,
  },

  // Entity-specific complexity
  entityComplexity: {
    Student: 5,
    Medication: 3,
    Appointment: 3,
    Incident: 4,
    HealthRecord: 10, // PHI data - higher cost
    Immunization: 2,
  },
};

/**
 * Calculate query complexity score
 */
function calculateComplexity(operation: any): number {
  let complexity = 0;

  // Walk through the operation's selection set
  function visitSelectionSet(selections: any[], depth: number = 1): number {
    let score = 0;

    for (const selection of selections) {
      if (selection.kind === 'Field') {
        // Base field complexity
        score += COMPLEXITY_CONFIG.fieldComplexity.default;

        // Add depth multiplier (deeper queries are more expensive)
        score += depth * 2;

        // Check for list/connection fields
        if (selection.name.value.endsWith('s') || selection.name.value === 'nodes') {
          const args = selection.arguments || [];
          const limitArg = args.find((arg: any) =>
            arg.name.value === 'limit' || arg.name.value === 'first'
          );
          const limit = limitArg?.value?.value || 10;
          score += COMPLEXITY_CONFIG.fieldComplexity.list(limit);
        }

        // Recursively process nested selections
        if (selection.selectionSet) {
          score += visitSelectionSet(selection.selectionSet.selections, depth + 1);
        }
      } else if (selection.kind === 'FragmentSpread') {
        // Fragment spreads add complexity
        score += 5;
      }
    }

    return score;
  }

  if (operation.selectionSet) {
    complexity = visitSelectionSet(operation.selectionSet.selections);
  }

  return complexity;
}

/**
 * Apollo Link for query complexity analysis
 */
export const queryComplexityLink = new ApolloLink((operation, forward) => {
  // Only analyze queries (not mutations or subscriptions)
  const definition = getOperationAST(operation.query);

  if (definition && definition.operation === 'query') {
    const complexity = calculateComplexity(definition);

    // Add complexity score to context for monitoring
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        'x-query-complexity': complexity.toString(),
      },
    }));

    // Warn if complexity is high
    if (complexity > COMPLEXITY_CONFIG.maxComplexity * 0.8) {
      console.warn(
        `[GraphQL] High query complexity detected: ${complexity} ` +
        `(max: ${COMPLEXITY_CONFIG.maxComplexity})`,
        { operationName: operation.operationName }
      );
    }

    // Block if complexity exceeds limit
    if (complexity > COMPLEXITY_CONFIG.maxComplexity) {
      throw new Error(
        `Query complexity (${complexity}) exceeds maximum allowed ` +
        `(${COMPLEXITY_CONFIG.maxComplexity}). Please simplify your query or ` +
        `use pagination to limit the amount of data requested.`
      );
    }
  }

  return forward(operation);
});

/**
 * Utility to estimate query complexity before execution
 */
export function estimateQueryComplexity(query: string): number {
  // This would require parsing the query string
  // For now, return a simple estimation
  const fieldCount = (query.match(/\w+/g) || []).length;
  return fieldCount * COMPLEXITY_CONFIG.fieldComplexity.default;
}

/**
 * Recommendations for reducing query complexity:
 *
 * 1. Use pagination (limit/first arguments)
 * 2. Request only needed fields
 * 3. Avoid deep nesting (> 5 levels)
 * 4. Use fragments to share field selections
 * 5. Split large queries into smaller ones
 * 6. Use @defer and @stream directives for incremental delivery
 * 7. Cache frequently accessed data
 *
 * Example of optimized query:
 * ```graphql
 * query GetStudents($limit: Int = 10) {
 *   students(limit: $limit) {
 *     ...StudentBasic
 *   }
 * }
 * ```
 */
