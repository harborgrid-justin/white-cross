/**
 * Zod Type Extensions
 * Extends Zod types to add missing error configuration options
 */

import 'zod';

declare module 'zod' {
  // Extend ZodTypeAny to include error configuration options
  interface ZodTypeAny {
    required_error?: string;
    invalid_type_error?: string;
    errorMap?: any;
  }

  // Extend ZodStringDef for string-specific error options
  interface ZodStringDef {
    required_error?: string;
    invalid_type_error?: string;
  }

  // Extend ZodNumberDef for number-specific error options
  interface ZodNumberDef {
    required_error?: string;
    invalid_type_error?: string;
  }

  // Extend ZodDateDef for date-specific error options
  interface ZodDateDef {
    required_error?: string;
    invalid_type_error?: string;
  }
}
