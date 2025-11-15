/**
 * Prettier Code Formatting Utilities
 *
 * Provides code formatting functionality using Prettier.
 * Handles TypeScript, JSX, and configuration management.
 */

import type { Options as PrettierOptions } from 'prettier';

/**
 * Default Prettier configuration for Next.js TypeScript projects
 */
const DEFAULT_PRETTIER_CONFIG: PrettierOptions = {
  parser: 'typescript',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'es5',
  printWidth: 80,
  arrowParens: 'always',
  endOfLine: 'lf',
  bracketSpacing: true,
  jsxSingleQuote: false,
  jsxBracketSameLine: false,
};

/**
 * Format TypeScript/TSX code with Prettier
 *
 * @param code - Code to format
 * @param options - Optional Prettier configuration overrides
 * @returns Formatted code string
 * @throws Error if formatting fails
 */
export async function formatCode(
  code: string,
  options?: Partial<PrettierOptions>
): Promise<string> {
  try {
    // Dynamically import prettier to avoid bundling issues
    const prettier = await import('prettier');

    const config: PrettierOptions = {
      ...DEFAULT_PRETTIER_CONFIG,
      ...options,
    };

    return await prettier.format(code, config);
  } catch (error) {
    console.error('Prettier formatting error:', error);
    // Return original code if formatting fails
    return code;
  }
}

/**
 * Format TypeScript code specifically
 *
 * @param code - TypeScript code to format
 * @param options - Optional Prettier configuration overrides
 * @returns Formatted TypeScript code
 */
export async function formatTypeScript(
  code: string,
  options?: Partial<PrettierOptions>
): Promise<string> {
  return formatCode(code, {
    parser: 'typescript',
    ...options,
  });
}

/**
 * Format TSX code specifically
 *
 * @param code - TSX code to format
 * @param options - Optional Prettier configuration overrides
 * @returns Formatted TSX code
 */
export async function formatTSX(
  code: string,
  options?: Partial<PrettierOptions>
): Promise<string> {
  return formatCode(code, {
    parser: 'typescript',
    ...options,
  });
}

/**
 * Format JSON code
 *
 * @param data - Data to format as JSON
 * @param options - Optional Prettier configuration overrides
 * @returns Formatted JSON string
 */
export async function formatJSON(
  data: any,
  options?: Partial<PrettierOptions>
): Promise<string> {
  const jsonString = JSON.stringify(data, null, 2);
  return formatCode(jsonString, {
    parser: 'json',
    ...options,
  });
}

/**
 * Format CSS code
 *
 * @param code - CSS code to format
 * @param options - Optional Prettier configuration overrides
 * @returns Formatted CSS code
 */
export async function formatCSS(
  code: string,
  options?: Partial<PrettierOptions>
): Promise<string> {
  return formatCode(code, {
    parser: 'css',
    ...options,
  });
}

/**
 * Batch format multiple code files
 *
 * @param files - Array of files with code and parser type
 * @returns Array of formatted files
 */
export async function formatMultiple(
  files: Array<{ code: string; parser: string; options?: Partial<PrettierOptions> }>
): Promise<Array<{ code: string; formatted: string }>> {
  const results = await Promise.all(
    files.map(async (file) => ({
      code: file.code,
      formatted: await formatCode(file.code, {
        parser: file.parser as any,
        ...file.options,
      }),
    }))
  );

  return results;
}

/**
 * Validate if code is properly formatted
 *
 * @param code - Code to validate
 * @param options - Optional Prettier configuration overrides
 * @returns True if code is properly formatted
 */
export async function isFormatted(
  code: string,
  options?: Partial<PrettierOptions>
): Promise<boolean> {
  try {
    const formatted = await formatCode(code, options);
    return code === formatted;
  } catch {
    return false;
  }
}
