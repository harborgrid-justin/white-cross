/**
 * @fileoverview Sanitize Pipe Unit Tests
 * @module common/pipes/__tests__/sanitize
 * @description Comprehensive tests for input sanitization pipe including:
 * - XSS attack prevention
 * - HTML injection prevention
 * - Script injection prevention
 * - Recursive object sanitization
 * - Array sanitization
 * - Healthcare data protection
 *
 * @security Critical tests for XSS prevention
 * @compliance OWASP A03:2021 - Injection
 */

import { SanitizePipe } from '../sanitize.pipe';

describe('SanitizePipe', () => {
  let pipe: SanitizePipe;

  beforeEach(() => {
    pipe = new SanitizePipe();
  });

  describe('Basic Sanitization', () => {
    it('should remove script tags', () => {
      // Arrange
      const maliciousInput = '<script>alert("XSS")</script>Hello';

      // Act
      const result = pipe.transform(maliciousInput);

      // Assert
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
      expect(result).toBe('Hello');
    });

    it('should remove inline JavaScript', () => {
      // Arrange
      const maliciousInput = '<img src="x" onerror="alert(\'XSS\')">';

      // Act
      const result = pipe.transform(maliciousInput);

      // Assert
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('alert');
    });

    it('should remove javascript: protocol', () => {
      // Arrange
      const maliciousInput = '<a href="javascript:alert(\'XSS\')">Click</a>';

      // Act
      const result = pipe.transform(maliciousInput);

      // Assert
      expect(result).not.toContain('javascript:');
    });

    it('should remove event handlers', () => {
      // Arrange
      const inputs = [
        '<div onclick="malicious()">Text</div>',
        '<div onload="malicious()">Text</div>',
        '<div onmouseover="malicious()">Text</div>',
      ];

      // Act & Assert
      inputs.forEach((input) => {
        const result = pipe.transform(input);
        expect(result).not.toContain('onclick');
        expect(result).not.toContain('onload');
        expect(result).not.toContain('onmouseover');
      });
    });

    it('should allow safe plain text', () => {
      // Arrange
      const safeInput = 'This is plain text with numbers 123 and symbols !@#';

      // Act
      const result = pipe.transform(safeInput);

      // Assert
      expect(result).toBe(safeInput);
    });

    it('should handle null and undefined', () => {
      // Act & Assert
      expect(pipe.transform(null)).toBeNull();
      expect(pipe.transform(undefined)).toBeUndefined();
    });

    it('should preserve numbers', () => {
      // Arrange
      const numberInput = 12345;

      // Act
      const result = pipe.transform(numberInput);

      // Assert
      expect(result).toBe(12345);
    });

    it('should preserve booleans', () => {
      // Act & Assert
      expect(pipe.transform(true)).toBe(true);
      expect(pipe.transform(false)).toBe(false);
    });
  });

  describe('XSS Attack Vectors', () => {
    it('should prevent stored XSS', () => {
      // Arrange - Common stored XSS payload
      const storedXSS = '<img src=x onerror=alert(document.cookie)>';

      // Act
      const result = pipe.transform(storedXSS);

      // Assert
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('alert');
      expect(result).not.toContain('document.cookie');
    });

    it('should prevent reflected XSS', () => {
      // Arrange - Reflected XSS in search query
      const reflectedXSS = '"><script>alert(String.fromCharCode(88,83,83))</script>';

      // Act
      const result = pipe.transform(reflectedXSS);

      // Assert
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('fromCharCode');
    });

    it('should prevent DOM-based XSS', () => {
      // Arrange
      const domXSS = 'javascript:void(document.cookie)';

      // Act
      const result = pipe.transform(domXSS);

      // Assert
      expect(result).not.toContain('javascript:');
    });

    it('should handle encoded XSS attempts', () => {
      // Arrange
      const encodedXSS = '%3Cscript%3Ealert%28%27XSS%27%29%3C%2Fscript%3E';

      // Act
      const result = pipe.transform(encodedXSS);

      // Assert
      expect(result).not.toContain('script');
      expect(result).not.toContain('alert');
    });

    it('should prevent SVG-based XSS', () => {
      // Arrange
      const svgXSS = '<svg onload=alert(1)>';

      // Act
      const result = pipe.transform(svgXSS);

      // Assert
      expect(result).not.toContain('onload');
      expect(result).not.toContain('alert');
    });

    it('should prevent iframe injection', () => {
      // Arrange
      const iframeXSS = '<iframe src="javascript:alert(1)"></iframe>';

      // Act
      const result = pipe.transform(iframeXSS);

      // Assert
      expect(result).not.toContain('iframe');
      expect(result).not.toContain('javascript:');
    });
  });

  describe('Array Sanitization', () => {
    it('should sanitize arrays of strings', () => {
      // Arrange
      const maliciousArray = [
        'Safe text',
        '<script>alert("XSS")</script>',
        'Another safe text',
        '<img src=x onerror=alert(1)>',
      ];

      // Act
      const result = pipe.transform(maliciousArray);

      // Assert
      expect(result).toHaveLength(4);
      expect(result[0]).toBe('Safe text');
      expect(result[1]).not.toContain('<script>');
      expect(result[2]).toBe('Another safe text');
      expect(result[3]).not.toContain('onerror');
    });

    it('should handle nested arrays', () => {
      // Arrange
      const nestedArray = [
        ['Safe', '<script>alert(1)</script>'],
        ['Text', '<img onerror=alert(1)>'],
      ];

      // Act
      const result = pipe.transform(nestedArray);

      // Assert
      expect(result[0][1]).not.toContain('<script>');
      expect(result[1][1]).not.toContain('onerror');
    });

    it('should handle mixed type arrays', () => {
      // Arrange
      const mixedArray = [
        'Text',
        123,
        true,
        '<script>alert(1)</script>',
        { key: '<img onerror=alert(1)>' },
      ];

      // Act
      const result = pipe.transform(mixedArray);

      // Assert
      expect(result[1]).toBe(123);
      expect(result[2]).toBe(true);
      expect(result[3]).not.toContain('<script>');
      expect(result[4].key).not.toContain('onerror');
    });
  });

  describe('Object Sanitization', () => {
    it('should sanitize object properties', () => {
      // Arrange
      const maliciousObject = {
        name: 'John Doe',
        comment: '<script>alert("XSS")</script>',
        description: '<img src=x onerror=alert(1)>',
      };

      // Act
      const result = pipe.transform(maliciousObject);

      // Assert
      expect(result.name).toBe('John Doe');
      expect(result.comment).not.toContain('<script>');
      expect(result.description).not.toContain('onerror');
    });

    it('should sanitize nested objects', () => {
      // Arrange
      const nestedObject = {
        user: {
          name: 'John',
          bio: '<script>alert(1)</script>',
        },
        post: {
          content: '<img onerror=alert(1)>',
        },
      };

      // Act
      const result = pipe.transform(nestedObject);

      // Assert
      expect(result.user.bio).not.toContain('<script>');
      expect(result.post.content).not.toContain('onerror');
    });

    it('should handle deeply nested structures', () => {
      // Arrange
      const deepObject = {
        level1: {
          level2: {
            level3: {
              malicious: '<script>alert(1)</script>',
            },
          },
        },
      };

      // Act
      const result = pipe.transform(deepObject);

      // Assert
      expect(result.level1.level2.level3.malicious).not.toContain('<script>');
    });

    it('should handle objects with array properties', () => {
      // Arrange
      const mixedObject = {
        tags: ['tag1', '<script>alert(1)</script>', 'tag3'],
        meta: {
          comments: ['Safe', '<img onerror=alert(1)>'],
        },
      };

      // Act
      const result = pipe.transform(mixedObject);

      // Assert
      expect(result.tags[1]).not.toContain('<script>');
      expect(result.meta.comments[1]).not.toContain('onerror');
    });
  });

  describe('HTML Allowance Mode', () => {
    it('should allow whitelisted HTML tags when configured', () => {
      // Arrange
      const pipeWithHtml = new SanitizePipe({ allowHtml: true });
      const htmlInput = '<p>Safe paragraph</p><strong>Bold text</strong>';

      // Act
      const result = pipeWithHtml.transform(htmlInput);

      // Assert
      expect(result).toContain('<p>');
      expect(result).toContain('</p>');
      expect(result).toContain('<strong>');
    });

    it('should still block dangerous tags in HTML mode', () => {
      // Arrange
      const pipeWithHtml = new SanitizePipe({ allowHtml: true });
      const htmlInput = '<p>Safe</p><script>alert(1)</script>';

      // Act
      const result = pipeWithHtml.transform(htmlInput);

      // Assert
      expect(result).toContain('<p>');
      expect(result).not.toContain('<script>');
    });

    it('should allow custom tag whitelist', () => {
      // Arrange
      const pipeWithCustomTags = new SanitizePipe({
        allowHtml: true,
        allowedTags: ['div', 'span'],
      });
      const htmlInput = '<div>Safe</div><p>Remove</p><span>Safe</span>';

      // Act
      const result = pipeWithCustomTags.transform(htmlInput);

      // Assert
      expect(result).toContain('<div>');
      expect(result).toContain('<span>');
      expect(result).not.toContain('<p>');
    });

    it('should sanitize href attributes', () => {
      // Arrange
      const pipeWithHtml = new SanitizePipe({ allowHtml: true });
      const htmlInput = '<a href="javascript:alert(1)">Link</a>';

      // Act
      const result = pipeWithHtml.transform(htmlInput);

      // Assert
      expect(result).not.toContain('javascript:');
    });

    it('should allow safe href protocols', () => {
      // Arrange
      const pipeWithHtml = new SanitizePipe({ allowHtml: true });
      const htmlInput = '<a href="https://example.com">Link</a>';

      // Act
      const result = pipeWithHtml.transform(htmlInput);

      // Assert
      expect(result).toContain('https://example.com');
    });
  });

  describe('Healthcare Data Sanitization', () => {
    it('should sanitize patient notes', () => {
      // Arrange
      const patientNote = {
        noteId: 'note-123',
        content: 'Patient complained of <script>alert(1)</script> headache',
        author: 'Dr. Smith',
      };

      // Act
      const result = pipe.transform(patientNote);

      // Assert
      expect(result.content).not.toContain('<script>');
      expect(result.content).toContain('headache');
    });

    it('should sanitize medication instructions', () => {
      // Arrange
      const medication = {
        name: 'Aspirin',
        instructions: 'Take with food <img src=x onerror=alert(1)>',
      };

      // Act
      const result = pipe.transform(medication);

      // Assert
      expect(result.instructions).not.toContain('onerror');
      expect(result.instructions).toContain('Take with food');
    });

    it('should sanitize student records', () => {
      // Arrange
      const studentRecord = {
        studentId: 'student-123',
        allergies: ['Peanuts', '<script>alert(1)</script>'],
        notes: {
          medical: 'Asthma <img onerror=alert(1)>',
          behavioral: 'Good student',
        },
      };

      // Act
      const result = pipe.transform(studentRecord);

      // Assert
      expect(result.allergies[1]).not.toContain('<script>');
      expect(result.notes.medical).not.toContain('onerror');
      expect(result.notes.medical).toContain('Asthma');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings', () => {
      // Arrange
      const emptyString = '';

      // Act
      const result = pipe.transform(emptyString);

      // Assert
      expect(result).toBe('');
    });

    it('should handle whitespace-only strings', () => {
      // Arrange
      const whitespace = '   \n\t  ';

      // Act
      const result = pipe.transform(whitespace);

      // Assert
      expect(result).toBe(whitespace);
    });

    it('should handle very long strings', () => {
      // Arrange
      const longString = 'a'.repeat(10000) + '<script>alert(1)</script>' + 'b'.repeat(10000);

      // Act
      const result = pipe.transform(longString);

      // Assert
      expect(result).not.toContain('<script>');
      expect(result.length).toBeGreaterThan(19000);
    });

    it('should handle circular references gracefully', () => {
      // Arrange
      const obj: any = { name: 'Test' };
      obj.self = obj; // Circular reference

      // Act & Assert
      // Should not throw error (sanitize-html handles this)
      expect(() => pipe.transform(obj)).not.toThrow();
    });

    it('should handle special characters', () => {
      // Arrange
      const specialChars = '!@#$%^&*()_+-={}[]|\\:";\'<>?,./';

      // Act
      const result = pipe.transform(specialChars);

      // Assert
      // Should preserve most special chars (except dangerous HTML)
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle unicode characters', () => {
      // Arrange
      const unicode = 'Hello 世界 🌍 Здравствуй';

      // Act
      const result = pipe.transform(unicode);

      // Assert
      expect(result).toBe(unicode);
    });
  });

  describe('Performance', () => {
    it('should sanitize within 5ms for small inputs', () => {
      // Arrange
      const input = '<script>alert("XSS")</script>Hello World';

      // Act
      const startTime = Date.now();
      pipe.transform(input);
      const duration = Date.now() - startTime;

      // Assert
      expect(duration).toBeLessThan(5);
    });

    it('should handle bulk sanitization efficiently', () => {
      // Arrange
      const bulkData = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        content: `<script>alert(${i})</script>Text ${i}`,
      }));

      // Act
      const startTime = Date.now();
      bulkData.forEach((item) => pipe.transform(item));
      const duration = Date.now() - startTime;

      // Assert
      expect(duration).toBeLessThan(100); // < 1ms per item
    });
  });

  describe('Real-World Attack Scenarios', () => {
    it('should prevent comment-based XSS', () => {
      // Arrange
      const comment = {
        author: 'User123',
        text: 'Great post! <!--<script>alert(1)</script>-->',
      };

      // Act
      const result = pipe.transform(comment);

      // Assert
      expect(result.text).not.toContain('<script>');
    });

    it('should prevent form submission hijacking', () => {
      // Arrange
      const formData = {
        feedback: '<form action="https://evil.com"><input type="submit"></form>',
      };

      // Act
      const result = pipe.transform(formData);

      // Assert
      expect(result.feedback).not.toContain('<form');
      expect(result.feedback).not.toContain('action=');
    });

    it('should prevent CSS-based attacks', () => {
      // Arrange
      const cssAttack = '<style>body{background:url(javascript:alert(1))}</style>';

      // Act
      const result = pipe.transform(cssAttack);

      // Assert
      expect(result).not.toContain('javascript:');
    });
  });
});
