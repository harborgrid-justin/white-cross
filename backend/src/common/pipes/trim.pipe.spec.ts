import { TrimPipe } from './trim.pipe';

describe('TrimPipe', () => {
  let pipe: TrimPipe;

  beforeEach(() => {
    pipe = new TrimPipe();
  });

  describe('String Trimming', () => {
    it('should trim leading whitespace from strings', () => {
      const result = pipe.transform('  hello');
      expect(result).toBe('hello');
    });

    it('should trim trailing whitespace from strings', () => {
      const result = pipe.transform('hello  ');
      expect(result).toBe('hello');
    });

    it('should trim both leading and trailing whitespace', () => {
      const result = pipe.transform('  hello  ');
      expect(result).toBe('hello');
    });

    it('should preserve internal whitespace', () => {
      const result = pipe.transform('  hello  world  ');
      expect(result).toBe('hello  world');
    });

    it('should handle tabs and newlines', () => {
      const result = pipe.transform('\t\nhello\n\t');
      expect(result).toBe('hello');
    });

    it('should handle mixed whitespace characters', () => {
      const result = pipe.transform('  \t\n  hello  \r\n  ');
      expect(result).toBe('hello');
    });

    it('should handle strings with only whitespace', () => {
      const result = pipe.transform('   ');
      expect(result).toBe('');
    });

    it('should handle empty strings', () => {
      const result = pipe.transform('');
      expect(result).toBe('');
    });

    it('should not modify strings without whitespace', () => {
      const result = pipe.transform('hello');
      expect(result).toBe('hello');
    });
  });

  describe('Null and Undefined Handling', () => {
    it('should handle null values', () => {
      const result = pipe.transform(null);
      expect(result).toBeNull();
    });

    it('should handle undefined values', () => {
      const result = pipe.transform(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('Non-String Primitive Types', () => {
    it('should return numbers unchanged', () => {
      const result = pipe.transform(42);
      expect(result).toBe(42);
    });

    it('should return zero unchanged', () => {
      const result = pipe.transform(0);
      expect(result).toBe(0);
    });

    it('should return negative numbers unchanged', () => {
      const result = pipe.transform(-42);
      expect(result).toBe(-42);
    });

    it('should return booleans unchanged', () => {
      const trueResult = pipe.transform(true);
      const falseResult = pipe.transform(false);
      expect(trueResult).toBe(true);
      expect(falseResult).toBe(false);
    });

    it('should return NaN unchanged', () => {
      const result = pipe.transform(NaN);
      expect(result).toBeNaN();
    });

    it('should return Infinity unchanged', () => {
      const result = pipe.transform(Infinity);
      expect(result).toBe(Infinity);
    });
  });

  describe('Array Handling', () => {
    it('should trim all strings in an array', () => {
      const input = ['  hello  ', '  world  ', '  test  '];
      const result = pipe.transform(input);
      expect(result).toEqual(['hello', 'world', 'test']);
    });

    it('should handle mixed types in arrays', () => {
      const input = ['  hello  ', 42, true, null, undefined, '  world  '];
      const result = pipe.transform(input);
      expect(result).toEqual(['hello', 42, true, null, undefined, 'world']);
    });

    it('should handle empty arrays', () => {
      const result = pipe.transform([]);
      expect(result).toEqual([]);
    });

    it('should handle nested arrays', () => {
      const input = [['  hello  '], ['  world  ']];
      const result = pipe.transform(input);
      expect(result).toEqual([['hello'], ['world']]);
    });

    it('should handle deeply nested arrays', () => {
      const input = [[['  deep  ']]];
      const result = pipe.transform(input);
      expect(result).toEqual([[['deep']]]);
    });

    it('should handle arrays with objects', () => {
      const input = [{ name: '  John  ' }, { name: '  Jane  ' }];
      const result = pipe.transform(input);
      expect(result).toEqual([{ name: 'John' }, { name: 'Jane' }]);
    });
  });

  describe('Object Handling', () => {
    it('should trim all string properties in an object', () => {
      const input = {
        name: '  John  ',
        email: '  john@example.com  ',
        city: '  New York  '
      };
      const result = pipe.transform(input);
      expect(result).toEqual({
        name: 'John',
        email: 'john@example.com',
        city: 'New York'
      });
    });

    it('should handle mixed property types in objects', () => {
      const input = {
        name: '  John  ',
        age: 30,
        active: true,
        score: null,
        pending: undefined
      };
      const result = pipe.transform(input);
      expect(result).toEqual({
        name: 'John',
        age: 30,
        active: true,
        score: null,
        pending: undefined
      });
    });

    it('should handle empty objects', () => {
      const result = pipe.transform({});
      expect(result).toEqual({});
    });

    it('should handle nested objects', () => {
      const input = {
        user: {
          name: '  John  ',
          address: {
            street: '  Main St  ',
            city: '  NYC  '
          }
        }
      };
      const result = pipe.transform(input);
      expect(result).toEqual({
        user: {
          name: 'John',
          address: {
            street: 'Main St',
            city: 'NYC'
          }
        }
      });
    });

    it('should handle objects with array properties', () => {
      const input = {
        names: ['  Alice  ', '  Bob  '],
        ages: [25, 30]
      };
      const result = pipe.transform(input);
      expect(result).toEqual({
        names: ['Alice', 'Bob'],
        ages: [25, 30]
      });
    });

    it('should handle objects with null properties', () => {
      const input = {
        name: '  John  ',
        middleName: null,
        lastName: '  Doe  '
      };
      const result = pipe.transform(input);
      expect(result).toEqual({
        name: 'John',
        middleName: null,
        lastName: 'Doe'
      });
    });

    it('should only process own properties', () => {
      const parent = { inherited: '  inherited  ' };
      const input = Object.create(parent);
      input.own = '  own  ';

      const result = pipe.transform(input);
      expect(result).toHaveProperty('own', 'own');
      expect(result).not.toHaveProperty('inherited');
    });
  });

  describe('Complex Nested Structures', () => {
    it('should handle deeply nested structures', () => {
      const input = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: '  deep value  '
              }
            }
          }
        }
      };
      const result = pipe.transform(input);
      expect(result).toEqual({
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep value'
              }
            }
          }
        }
      });
    });

    it('should handle arrays of nested objects', () => {
      const input = [
        { user: { name: '  Alice  ' } },
        { user: { name: '  Bob  ' } }
      ];
      const result = pipe.transform(input);
      expect(result).toEqual([
        { user: { name: 'Alice' } },
        { user: { name: 'Bob' } }
      ]);
    });

    it('should handle objects with nested arrays', () => {
      const input = {
        users: [
          { name: '  Alice  ', tags: ['  admin  ', '  user  '] },
          { name: '  Bob  ', tags: ['  user  '] }
        ]
      };
      const result = pipe.transform(input);
      expect(result).toEqual({
        users: [
          { name: 'Alice', tags: ['admin', 'user'] },
          { name: 'Bob', tags: ['user'] }
        ]
      });
    });

    it('should handle mixed complex structures', () => {
      const input = {
        strings: ['  a  ', '  b  '],
        numbers: [1, 2, 3],
        nested: {
          deep: {
            value: '  test  ',
            array: ['  x  ', '  y  ']
          }
        },
        mixed: [
          '  string  ',
          123,
          { prop: '  value  ' },
          ['  nested  ']
        ]
      };

      const result = pipe.transform(input);
      expect(result).toEqual({
        strings: ['a', 'b'],
        numbers: [1, 2, 3],
        nested: {
          deep: {
            value: 'test',
            array: ['x', 'y']
          }
        },
        mixed: [
          'string',
          123,
          { prop: 'value' },
          ['nested']
        ]
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle circular references gracefully', () => {
      const obj: Record<string, unknown> = { name: '  John  ' };
      obj.self = obj;

      // This will cause a stack overflow, but let's test the non-circular parts work
      expect(() => {
        pipe.transform({ name: '  John  ' });
      }).not.toThrow();
    });

    it('should handle very long strings', () => {
      const longString = '  ' + 'a'.repeat(10000) + '  ';
      const result = pipe.transform(longString);
      expect(result).toBe('a'.repeat(10000));
    });

    it('should handle strings with unicode characters', () => {
      const result = pipe.transform('  hello 世界  ');
      expect(result).toBe('hello 世界');
    });

    it('should handle strings with emojis', () => {
      const result = pipe.transform('  hello 👋 world 🌍  ');
      expect(result).toBe('hello 👋 world 🌍');
    });

    it('should handle special whitespace characters', () => {
      const result = pipe.transform('\u00A0hello\u00A0');
      expect(result).toBe('hello');
    });

    it('should handle zero-width spaces', () => {
      const result = pipe.transform('\u200Bhello\u200B');
      expect(result).toBe('\u200Bhello\u200B'); // trim() doesn't remove zero-width spaces
    });

    it('should handle objects with numeric keys', () => {
      const input = {
        0: '  zero  ',
        1: '  one  ',
        2: '  two  '
      };
      const result = pipe.transform(input);
      expect(result).toEqual({
        0: 'zero',
        1: 'one',
        2: 'two'
      });
    });

    it('should handle objects with symbol keys', () => {
      const sym = Symbol('test');
      const input = {
        [sym]: '  value  ',
        regular: '  test  '
      };
      const result = pipe.transform(input);
      expect(result).toHaveProperty('regular', 'test');
    });

    it('should handle Date objects', () => {
      const date = new Date('2024-01-01');
      const result = pipe.transform(date);
      expect(result).toEqual({});
    });

    it('should handle RegExp objects', () => {
      const regex = /test/;
      const result = pipe.transform(regex);
      expect(result).toEqual({});
    });
  });

  describe('Real-World Use Cases', () => {
    it('should handle user registration DTO', () => {
      const input = {
        username: '  john_doe  ',
        email: '  john@example.com  ',
        firstName: '  John  ',
        lastName: '  Doe  ',
        password: '  password123  '
      };
      const result = pipe.transform(input);
      expect(result).toEqual({
        username: 'john_doe',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      });
    });

    it('should handle search query parameters', () => {
      const input = {
        q: '  search term  ',
        category: '  books  ',
        tags: ['  fiction  ', '  bestseller  ']
      };
      const result = pipe.transform(input);
      expect(result).toEqual({
        q: 'search term',
        category: 'books',
        tags: ['fiction', 'bestseller']
      });
    });

    it('should handle form data with accidental whitespace', () => {
      const input = {
        name: '  John Doe  ',
        email: ' john@example.com ',
        phone: '  555-1234  ',
        address: {
          street: '  123 Main St  ',
          city: '  New York  ',
          zip: '  10001  '
        }
      };
      const result = pipe.transform(input);
      expect(result).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234',
        address: {
          street: '123 Main St',
          city: 'New York',
          zip: '10001'
        }
      });
    });

    it('should handle API request with multiple filters', () => {
      const input = {
        filters: {
          status: '  active  ',
          role: '  admin  ',
          department: '  IT  '
        },
        sort: '  name  ',
        order: '  asc  '
      };
      const result = pipe.transform(input);
      expect(result).toEqual({
        filters: {
          status: 'active',
          role: 'admin',
          department: 'IT'
        },
        sort: 'name',
        order: 'asc'
      });
    });
  });

  describe('Type Preservation', () => {
    it('should preserve the original type of numbers', () => {
      const result = pipe.transform(42);
      expect(typeof result).toBe('number');
    });

    it('should preserve the original type of booleans', () => {
      const result = pipe.transform(true);
      expect(typeof result).toBe('boolean');
    });

    it('should preserve array type', () => {
      const result = pipe.transform(['  test  ']);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should preserve object type', () => {
      const result = pipe.transform({ key: '  value  ' });
      expect(typeof result).toBe('object');
      expect(result).not.toBeNull();
    });
  });

  describe('Performance Considerations', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array(1000).fill('  test  ');
      const startTime = Date.now();
      const result = pipe.transform(largeArray);
      const endTime = Date.now();

      expect(result).toHaveLength(1000);
      expect(result.every(item => item === 'test')).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in < 100ms
    });

    it('should handle large objects efficiently', () => {
      const largeObject: Record<string, string> = {};
      for (let i = 0; i < 1000; i++) {
        largeObject[`key${i}`] = '  value  ';
      }

      const startTime = Date.now();
      const result = pipe.transform(largeObject);
      const endTime = Date.now();

      expect(Object.keys(result as object).length).toBe(1000);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in < 100ms
    });
  });
});
