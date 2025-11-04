/**
 * GraphQL Fragments Index
 *
 * Central export for all GraphQL fragments
 * Item 192: GraphQL fragments for reusability
 */

// Student fragments
export {
  STUDENT_BASIC_FRAGMENT,
  STUDENT_WITH_CONTACTS_FRAGMENT,
  STUDENT_WITH_MEDICAL_FRAGMENT,
  STUDENT_FULL_FRAGMENT,
} from './student.fragments';

// Medication fragments
export {
  MEDICATION_BASIC_FRAGMENT,
  MEDICATION_WITH_PRESCRIBER_FRAGMENT,
  MEDICATION_WITH_ADMINISTRATIONS_FRAGMENT,
  MEDICATION_FULL_FRAGMENT,
} from './medication.fragments';

/**
 * Fragment Usage Guidelines:
 *
 * 1. Always use fragments to avoid field duplication
 * 2. Compose fragments for related data
 * 3. Keep fragments focused on single entities
 * 4. Use spread operator to include fragments in queries
 *
 * Example:
 * ```graphql
 * query GetStudent($id: ID!) {
 *   student(id: $id) {
 *     ...StudentWithContacts
 *     ...StudentWithMedical
 *   }
 * }
 * ```
 *
 * Benefits:
 * - Consistent field selection across queries
 * - Single source of truth for entity structure
 * - Easier to maintain and update
 * - Better code generation with GraphQL Codegen
 * - Improved query performance (no over-fetching)
 */
