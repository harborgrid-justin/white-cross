/**
 * Test Setup Verification
 * Verifies that the Jest test infrastructure is working correctly
 */

describe('Test Infrastructure', () => {
  it('should run basic tests', () => {
    expect(true).toBe(true);
  });

  it('should have access to Jest matchers', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toContain('ell');
    expect([1, 2, 3]).toHaveLength(3);
  });

  it('should support async tests', async () => {
    const promise = Promise.resolve('success');
    await expect(promise).resolves.toBe('success');
  });

  it('should have environment variables set', () => {
    expect(process.env.NEXT_PUBLIC_API_URL).toBe('http://localhost:3001/api/v1');
    expect(process.env.NEXT_PUBLIC_GRAPHQL_URL).toBe('http://localhost:3001/graphql');
  });
});

describe('Custom Matchers', () => {
  it('should have custom email matcher', () => {
    expect('test@example.com').toBeValidEmail();
    expect('invalid-email').not.toBeValidEmail();
  });

  it('should have custom date matcher', () => {
    expect('2024-01-15').toBeValidDate();
    expect('invalid-date').not.toBeValidDate();
  });

  it('should have custom phone matcher', () => {
    expect('555-123-4567').toBeValidPhoneNumber();
    expect('(555) 123-4567').toBeValidPhoneNumber();
    expect('invalid').not.toBeValidPhoneNumber();
  });

  it('should have range matcher', () => {
    expect(5).toBeWithinRange(1, 10);
    expect(15).not.toBeWithinRange(1, 10);
  });
});
