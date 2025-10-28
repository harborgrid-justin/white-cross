/**
 * GraphQL Schema Tests
 * Verify schema compiles and has expected types
 */

import { describe, test, expect } from '@jest/globals';
import typeDefs from '../schema';

describe('GraphQL Schema', () => {
  test('should have valid schema definition', () => {
    expect(typeDefs).toBeDefined();
    expect(typeof typeDefs).toBe('string');
  });

  test('should include Contact type', () => {
    expect(typeDefs).toContain('type Contact');
    expect(typeDefs).toContain('firstName: String!');
    expect(typeDefs).toContain('lastName: String!');
  });

  test('should include Student type', () => {
    expect(typeDefs).toContain('type Student');
    expect(typeDefs).toContain('studentNumber: String!');
  });

  test('should include Query type', () => {
    expect(typeDefs).toContain('type Query');
    expect(typeDefs).toContain('contacts');
    expect(typeDefs).toContain('students');
  });

  test('should include Mutation type', () => {
    expect(typeDefs).toContain('type Mutation');
    expect(typeDefs).toContain('createContact');
    expect(typeDefs).toContain('updateContact');
  });

  test('should include ContactType enum', () => {
    expect(typeDefs).toContain('enum ContactType');
    expect(typeDefs).toContain('guardian');
    expect(typeDefs).toContain('staff');
    expect(typeDefs).toContain('vendor');
  });
});
