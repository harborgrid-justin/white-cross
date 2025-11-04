/**
 * Unit Tests for Formatting Utility Functions
 *
 * Tests all formatting utilities including:
 * - Phone numbers
 * - Currency
 * - Names
 * - Addresses
 * - File sizes
 * - Student numbers
 * - Grades
 *
 * @module lib/utils/format.test
 */

import {
  formatPhoneNumber,
  formatCurrency,
  formatName,
  formatAddress,
  capitalize,
  truncate,
  formatFileSize,
  formatNumber,
  formatPercentage,
  formatSSN,
  formatMRN,
  formatStudentNumber,
  formatGrade,
  formatList,
  pluralize,
} from './format';

describe('formatPhoneNumber', () => {
  it('should format 10-digit phone number', () => {
    expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
  });

  it('should format phone number with dashes', () => {
    expect(formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890');
  });

  it('should format 11-digit phone number with country code', () => {
    expect(formatPhoneNumber('+11234567890')).toBe('(123) 456-7890');
    expect(formatPhoneNumber('11234567890')).toBe('(123) 456-7890');
  });

  it('should return original string if invalid format', () => {
    expect(formatPhoneNumber('123')).toBe('123');
    expect(formatPhoneNumber('abc')).toBe('abc');
  });

  it('should handle already formatted numbers', () => {
    expect(formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890');
  });
});

describe('formatCurrency', () => {
  it('should format currency with default USD symbol', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should format currency without symbol', () => {
    expect(formatCurrency(1234.56, 'USD', false)).toBe('1,234.56');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-500.25)).toBe('-$500.25');
  });

  it('should format large numbers with commas', () => {
    expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
  });

  it('should always show 2 decimal places', () => {
    expect(formatCurrency(100)).toBe('$100.00');
  });
});

describe('formatName', () => {
  it('should format name as firstLast by default', () => {
    expect(formatName('John', 'Doe')).toBe('John Doe');
  });

  it('should format name as lastFirst', () => {
    expect(formatName('John', 'Doe', null, 'lastFirst')).toBe('Doe, John');
  });

  it('should format name as initials', () => {
    expect(formatName('John', 'Doe', null, 'initials')).toBe('JD');
  });

  it('should format full name with middle name', () => {
    expect(formatName('John', 'Doe', 'Michael', 'full')).toBe('John Michael Doe');
  });

  it('should format formal name with middle name', () => {
    expect(formatName('John', 'Doe', 'Michael', 'formal')).toBe('Doe, John Michael');
  });

  it('should handle missing middle name in full format', () => {
    expect(formatName('John', 'Doe', null, 'full')).toBe('John Doe');
  });

  it('should trim whitespace', () => {
    expect(formatName(' John ', ' Doe ')).toBe('John Doe');
  });

  it('should handle empty names', () => {
    expect(formatName('', '')).toBe('');
  });
});

describe('formatAddress', () => {
  it('should format complete address', () => {
    const address = {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
    };
    expect(formatAddress(address)).toBe('123 Main St, Springfield, IL, 62701');
  });

  it('should handle partial address', () => {
    const address = {
      city: 'Springfield',
      state: 'IL',
    };
    expect(formatAddress(address)).toBe('Springfield, IL');
  });

  it('should exclude USA/US country', () => {
    const address = {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      country: 'USA',
    };
    expect(formatAddress(address)).toBe('123 Main St, Springfield, IL, 62701');
  });

  it('should include non-US country', () => {
    const address = {
      city: 'Toronto',
      country: 'Canada',
    };
    expect(formatAddress(address)).toBe('Toronto, Canada');
  });

  it('should handle empty address', () => {
    expect(formatAddress({})).toBe('');
  });
});

describe('capitalize', () => {
  it('should capitalize first letter of each word', () => {
    expect(capitalize('john doe')).toBe('John Doe');
  });

  it('should handle already capitalized text', () => {
    expect(capitalize('John Doe')).toBe('John Doe');
  });

  it('should handle all caps', () => {
    expect(capitalize('JOHN DOE')).toBe('John Doe');
  });

  it('should handle single word', () => {
    expect(capitalize('john')).toBe('John');
  });

  it('should handle empty string', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('truncate', () => {
  it('should truncate long text', () => {
    expect(truncate('This is a long text', 10)).toBe('This is...');
  });

  it('should not truncate short text', () => {
    expect(truncate('Short', 10)).toBe('Short');
  });

  it('should use custom ellipsis', () => {
    expect(truncate('This is a long text', 10, '…')).toBe('This is …');
  });

  it('should handle exact length', () => {
    expect(truncate('Exactly10!', 10)).toBe('Exactly10!');
  });
});

describe('formatFileSize', () => {
  it('should format bytes', () => {
    expect(formatFileSize(500)).toBe('500.00 Bytes');
  });

  it('should format kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.00 KB');
    expect(formatFileSize(1536)).toBe('1.50 KB');
  });

  it('should format megabytes', () => {
    expect(formatFileSize(1048576)).toBe('1.00 MB');
  });

  it('should format gigabytes', () => {
    expect(formatFileSize(1073741824)).toBe('1.00 GB');
  });

  it('should handle zero', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
  });

  it('should handle custom decimal places', () => {
    expect(formatFileSize(1536, 1)).toBe('1.5 KB');
  });
});

describe('formatNumber', () => {
  it('should format number with commas', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('should handle decimals', () => {
    expect(formatNumber(1234.56)).toBe('1,234.56');
  });

  it('should handle small numbers', () => {
    expect(formatNumber(123)).toBe('123');
  });
});

describe('formatPercentage', () => {
  it('should format percentage without decimals', () => {
    expect(formatPercentage(0.5)).toBe('50%');
  });

  it('should format percentage with decimals', () => {
    expect(formatPercentage(0.755, 2)).toBe('75.50%');
  });

  it('should handle 100%', () => {
    expect(formatPercentage(1)).toBe('100%');
  });

  it('should handle 0%', () => {
    expect(formatPercentage(0)).toBe('0%');
  });
});

describe('formatSSN', () => {
  it('should format SSN with masking by default', () => {
    expect(formatSSN('123456789')).toBe('XXX-XX-6789');
  });

  it('should format SSN without masking', () => {
    expect(formatSSN('123456789', false)).toBe('123-45-6789');
  });

  it('should return original if invalid length', () => {
    expect(formatSSN('12345')).toBe('12345');
  });

  it('should handle already formatted SSN', () => {
    expect(formatSSN('123-45-6789')).toBe('XXX-XX-6789');
  });
});

describe('formatMRN', () => {
  it('should format MRN with prefix', () => {
    expect(formatMRN('MRN123456')).toBe('MRN-123456');
  });

  it('should handle already formatted MRN', () => {
    expect(formatMRN('MRN-123456')).toBe('MRN-123456');
  });

  it('should handle MRN without prefix', () => {
    expect(formatMRN('123456')).toBe('123456');
  });
});

describe('formatStudentNumber', () => {
  it('should format 10-digit student number', () => {
    expect(formatStudentNumber('2025001234')).toBe('2025-001234');
  });

  it('should handle already formatted number', () => {
    expect(formatStudentNumber('2025-001234')).toBe('2025-001234');
  });

  it('should return original if not 10 digits', () => {
    expect(formatStudentNumber('12345')).toBe('12345');
  });
});

describe('formatGrade', () => {
  it('should format kindergarten', () => {
    expect(formatGrade('K')).toBe('Kindergarten');
    expect(formatGrade('KG')).toBe('Kindergarten');
  });

  it('should format pre-k', () => {
    expect(formatGrade('PK')).toBe('Pre-K');
  });

  it('should format 1st grade', () => {
    expect(formatGrade('1')).toBe('1st Grade');
  });

  it('should format 2nd grade', () => {
    expect(formatGrade('2')).toBe('2nd Grade');
  });

  it('should format 3rd grade', () => {
    expect(formatGrade('3')).toBe('3rd Grade');
  });

  it('should format 4th-10th grade', () => {
    expect(formatGrade('4')).toBe('4th Grade');
    expect(formatGrade('5')).toBe('5th Grade');
    expect(formatGrade('10')).toBe('10th Grade');
  });

  it('should format 11th grade', () => {
    expect(formatGrade('11')).toBe('11th Grade');
  });

  it('should format 12th grade', () => {
    expect(formatGrade('12')).toBe('12th Grade');
  });

  it('should handle numeric input', () => {
    expect(formatGrade(5)).toBe('5th Grade');
  });
});

describe('formatList', () => {
  it('should format single item', () => {
    expect(formatList(['apples'])).toBe('apples');
  });

  it('should format two items', () => {
    expect(formatList(['apples', 'oranges'])).toBe('apples and oranges');
  });

  it('should format three or more items', () => {
    expect(formatList(['apples', 'oranges', 'bananas'])).toBe('apples, oranges, and bananas');
  });

  it('should use custom conjunction', () => {
    expect(formatList(['apples', 'oranges'], 'or')).toBe('apples or oranges');
  });

  it('should handle empty array', () => {
    expect(formatList([])).toBe('');
  });
});

describe('pluralize', () => {
  it('should use singular for count of 1', () => {
    expect(pluralize(1, 'item')).toBe('1 item');
  });

  it('should use plural for count > 1', () => {
    expect(pluralize(5, 'item')).toBe('5 items');
  });

  it('should use custom plural form', () => {
    expect(pluralize(1, 'child', 'children')).toBe('1 child');
    expect(pluralize(3, 'child', 'children')).toBe('3 children');
  });

  it('should use plural for count of 0', () => {
    expect(pluralize(0, 'item')).toBe('0 items');
  });
});
