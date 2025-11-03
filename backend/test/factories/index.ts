/**
 * Test Factories Index
 *
 * Central export point for all test factories.
 */

export { UserFactory } from './user.factory';
export { StudentFactory } from './student.factory';

/**
 * Reset all factory counters
 */
export function resetAllFactories(): void {
  UserFactory.reset();
  StudentFactory.reset();
}
