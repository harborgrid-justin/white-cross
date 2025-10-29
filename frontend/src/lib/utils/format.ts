/**
 * Formatting Utility Functions
 *
 * Centralized formatting utilities for phone numbers, currency, names,
 * addresses, and other data presentation needs.
 *
 * @module lib/utils/format
 */

/**
 * Formats a phone number to (XXX) XXX-XXXX format.
 *
 * Handles various input formats and normalizes to standard US phone format.
 *
 * @param phoneNumber - Phone number string (digits only or with formatting)
 * @returns Formatted phone number or original input if invalid
 *
 * @example
 * ```typescript
 * formatPhoneNumber('1234567890') // '(123) 456-7890'
 * formatPhoneNumber('123-456-7890') // '(123) 456-7890'
 * formatPhoneNumber('+11234567890') // '(123) 456-7890'
 * ```
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Handle different lengths
  if (cleaned.length === 10) {
    // Standard US phone: (XXX) XXX-XXXX
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    // US phone with country code: (XXX) XXX-XXXX
    return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  // Return original if not standard format
  return phoneNumber;
}

/**
 * Formats a currency value with proper decimals and commas.
 *
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'USD')
 * @param showSymbol - Whether to show currency symbol (default: true)
 * @returns Formatted currency string
 *
 * @example
 * ```typescript
 * formatCurrency(1234.56) // '$1,234.56'
 * formatCurrency(1234.56, 'USD', false) // '1,234.56'
 * formatCurrency(1234.56, 'EUR') // '€1,234.56'
 * ```
 */
export function formatCurrency(amount: number, currency: string = 'USD', showSymbol: boolean = true): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return formatted;
}

/**
 * Formats a person's name in various formats.
 *
 * @param firstName - First name
 * @param lastName - Last name
 * @param middleName - Middle name (optional)
 * @param format - Format type
 * @returns Formatted name string
 *
 * @example
 * ```typescript
 * formatName('John', 'Doe') // 'John Doe'
 * formatName('John', 'Doe', null, 'lastFirst') // 'Doe, John'
 * formatName('John', 'Doe', null, 'initials') // 'JD'
 * formatName('John', 'Doe', 'Michael', 'full') // 'John Michael Doe'
 * ```
 */
export function formatName(
  firstName: string,
  lastName: string,
  middleName?: string | null,
  format: 'firstLast' | 'lastFirst' | 'initials' | 'full' | 'formal' = 'firstLast'
): string {
  const cleanFirst = firstName?.trim() || '';
  const cleanLast = lastName?.trim() || '';
  const cleanMiddle = middleName?.trim() || '';

  switch (format) {
    case 'firstLast':
      return `${cleanFirst} ${cleanLast}`.trim();

    case 'lastFirst':
      return `${cleanLast}, ${cleanFirst}`.trim();

    case 'initials':
      const firstInitial = cleanFirst[0] || '';
      const lastInitial = cleanLast[0] || '';
      return `${firstInitial}${lastInitial}`.toUpperCase();

    case 'full':
      if (cleanMiddle) {
        return `${cleanFirst} ${cleanMiddle} ${cleanLast}`.trim();
      }
      return `${cleanFirst} ${cleanLast}`.trim();

    case 'formal':
      if (cleanMiddle) {
        return `${cleanLast}, ${cleanFirst} ${cleanMiddle}`.trim();
      }
      return `${cleanLast}, ${cleanFirst}`.trim();

    default:
      return `${cleanFirst} ${cleanLast}`.trim();
  }
}

/**
 * Formats an address for display.
 *
 * @param address - Address object or components
 * @returns Formatted address string
 *
 * @example
 * ```typescript
 * formatAddress({
 *   street: '123 Main St',
 *   city: 'Springfield',
 *   state: 'IL',
 *   zipCode: '62701'
 * }) // '123 Main St, Springfield, IL 62701'
 * ```
 */
export function formatAddress(address: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}): string {
  const parts: string[] = [];

  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.zipCode) parts.push(address.zipCode);
  if (address.country && address.country !== 'USA' && address.country !== 'US') {
    parts.push(address.country);
  }

  return parts.join(', ');
}

/**
 * Capitalizes the first letter of each word.
 *
 * @param text - Text to capitalize
 * @returns Capitalized text
 *
 * @example
 * ```typescript
 * capitalize('john doe') // 'John Doe'
 * capitalize('JOHN DOE') // 'John Doe'
 * ```
 */
export function capitalize(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Truncates text to a maximum length with ellipsis.
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length (including ellipsis)
 * @param ellipsis - Ellipsis character(s) (default: '...')
 * @returns Truncated text
 *
 * @example
 * ```typescript
 * truncate('This is a long text', 10) // 'This is...'
 * truncate('Short', 10) // 'Short'
 * ```
 */
export function truncate(text: string, maxLength: number, ellipsis: string = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Formats a file size in human-readable format.
 *
 * @param bytes - Size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted size string
 *
 * @example
 * ```typescript
 * formatFileSize(1024) // '1.00 KB'
 * formatFileSize(1536) // '1.50 KB'
 * formatFileSize(1048576) // '1.00 MB'
 * ```
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Formats a number with thousand separators.
 *
 * @param num - Number to format
 * @returns Formatted number string
 *
 * @example
 * ```typescript
 * formatNumber(1234567) // '1,234,567'
 * formatNumber(1234.56) // '1,234.56'
 * ```
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Formats a percentage value.
 *
 * @param value - Decimal value (0.5 = 50%)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 *
 * @example
 * ```typescript
 * formatPercentage(0.5) // '50%'
 * formatPercentage(0.755, 2) // '75.50%'
 * ```
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formats a social security number with masking.
 *
 * @param ssn - SSN string (digits only or formatted)
 * @param mask - Whether to mask all but last 4 digits (default: true)
 * @returns Formatted SSN
 *
 * @example
 * ```typescript
 * formatSSN('123456789') // 'XXX-XX-6789'
 * formatSSN('123456789', false) // '123-45-6789'
 * ```
 */
export function formatSSN(ssn: string, mask: boolean = true): string {
  const cleaned = ssn.replace(/\D/g, '');

  if (cleaned.length !== 9) {
    return ssn; // Return original if invalid
  }

  if (mask) {
    return `XXX-XX-${cleaned.slice(5)}`;
  }

  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
}

/**
 * Formats a medical record number with proper spacing.
 *
 * @param mrn - Medical record number
 * @returns Formatted MRN
 *
 * @example
 * ```typescript
 * formatMRN('MRN123456') // 'MRN-123456'
 * ```
 */
export function formatMRN(mrn: string): string {
  // Remove existing separators
  const cleaned = mrn.replace(/[-\s]/g, '');

  // Add separator after prefix if present
  if (cleaned.length > 3 && /^[A-Z]{3}/.test(cleaned)) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }

  return cleaned;
}

/**
 * Formats student ID/number for display.
 *
 * @param studentNumber - Student number
 * @returns Formatted student number
 *
 * @example
 * ```typescript
 * formatStudentNumber('2025001234') // '2025-001234'
 * ```
 */
export function formatStudentNumber(studentNumber: string): string {
  // Remove existing separators
  const cleaned = studentNumber.replace(/[-\s]/g, '');

  // Format as YYYY-NNNNNN if 10 digits
  if (cleaned.length === 10 && /^\d{10}$/.test(cleaned)) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }

  return studentNumber;
}

/**
 * Formats a grade level for display.
 *
 * @param grade - Grade value (string or number)
 * @returns Formatted grade string
 *
 * @example
 * ```typescript
 * formatGrade('K') // 'Kindergarten'
 * formatGrade('1') // '1st Grade'
 * formatGrade('12') // '12th Grade'
 * ```
 */
export function formatGrade(grade: string | number): string {
  const gradeStr = String(grade).trim().toUpperCase();

  // Special cases
  if (gradeStr === 'K' || gradeStr === 'KG') return 'Kindergarten';
  if (gradeStr === 'PK' || gradeStr === 'PRE-K') return 'Pre-K';

  // Numeric grades
  const gradeNum = parseInt(gradeStr);
  if (!isNaN(gradeNum) && gradeNum >= 1 && gradeNum <= 12) {
    const suffix = ['th', 'st', 'nd', 'rd'][
      gradeNum % 10 > 3 || [11, 12, 13].includes(gradeNum % 100) ? 0 : gradeNum % 10
    ];
    return `${gradeNum}${suffix} Grade`;
  }

  return gradeStr;
}

/**
 * Formats a list of items with proper grammar.
 *
 * @param items - Array of items
 * @param conjunction - Conjunction word (default: 'and')
 * @returns Formatted list string
 *
 * @example
 * ```typescript
 * formatList(['apples']) // 'apples'
 * formatList(['apples', 'oranges']) // 'apples and oranges'
 * formatList(['apples', 'oranges', 'bananas']) // 'apples, oranges, and bananas'
 * ```
 */
export function formatList(items: string[], conjunction: string = 'and'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);

  return `${otherItems.join(', ')}, ${conjunction} ${lastItem}`;
}

/**
 * Pluralizes a word based on count.
 *
 * @param count - Count to base pluralization on
 * @param singular - Singular form of word
 * @param plural - Plural form of word (optional, defaults to singular + 's')
 * @returns Pluralized word with count
 *
 * @example
 * ```typescript
 * pluralize(1, 'item') // '1 item'
 * pluralize(5, 'item') // '5 items'
 * pluralize(1, 'child', 'children') // '1 child'
 * pluralize(3, 'child', 'children') // '3 children'
 * ```
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : plural || `${singular}s`;
  return `${count} ${word}`;
}
