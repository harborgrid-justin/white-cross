/**
 * Server Action Template
 *
 * Provides templates for generating Next.js Server Actions.
 * Server Actions enable server-side mutations and data processing.
 */

/**
 * Props for server action template generation
 */
export interface ServerActionTemplateProps {
  name: string;
  params: Record<string, string>;
  returnType?: string;
  description?: string;
  validation?: boolean;
}

/**
 * Generate a basic server action template
 *
 * @param options - Server action options
 * @param body - Action body code
 * @returns Server action template string
 */
export function generateServerAction(
  options: ServerActionTemplateProps,
  body: string
): string {
  const { name, params, returnType = 'Promise<void>', description = '' } =
    options;

  const paramsString = Object.entries(params)
    .map(([key, type]) => `${key}: ${type}`)
    .join(', ');

  const descriptionComment = description
    ? `/**
 * ${description}
 */
`
    : '';

  return `${descriptionComment}export async function ${name}(${paramsString}): ${returnType} {
  'use server';

  ${body}
}`;
}

/**
 * Generate a server action with form data handling
 *
 * @param options - Server action options
 * @param body - Action body code
 * @returns Server action with FormData template
 */
export function generateFormDataServerAction(
  options: ServerActionTemplateProps,
  body: string
): string {
  const { name, returnType = 'Promise<{ success: boolean; message?: string }>', description = '' } =
    options;

  const descriptionComment = description
    ? `/**
 * ${description}
 */
`
    : '';

  return `${descriptionComment}export async function ${name}(formData: FormData): ${returnType} {
  'use server';

  // Extract form data
  const data = {
    // Add your form fields here
  };

  ${body}
}`;
}

/**
 * Generate a server action with Zod validation
 *
 * @param options - Server action options
 * @param schemaName - Name of the Zod schema
 * @param body - Action body code
 * @returns Server action with validation template
 */
export function generateValidatedServerAction(
  options: ServerActionTemplateProps,
  schemaName: string,
  body: string
): string {
  const { name, returnType = 'Promise<{ success: boolean; data?: any; error?: string }>', description = '' } =
    options;

  const descriptionComment = description
    ? `/**
 * ${description}
 */
`
    : '';

  return `import { z } from 'zod';

const ${schemaName} = z.object({
  // Define your schema here
});

${descriptionComment}export async function ${name}(input: z.infer<typeof ${schemaName}>): ${returnType} {
  'use server';

  // Validate input
  const result = ${schemaName}.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: 'Validation failed',
    };
  }

  const validatedData = result.data;

  try {
    ${body}

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}`;
}

/**
 * Generate a server action with database mutation
 *
 * @param options - Server action options
 * @param modelName - Database model name
 * @param operation - Database operation (create, update, delete)
 * @returns Server action with database mutation template
 */
export function generateDatabaseServerAction(
  options: ServerActionTemplateProps,
  modelName: string,
  operation: 'create' | 'update' | 'delete'
): string {
  const { name, params, returnType = 'Promise<{ success: boolean; data?: any; error?: string }>', description = '' } =
    options;

  const paramsString = Object.entries(params)
    .map(([key, type]) => `${key}: ${type}`)
    .join(', ');

  const operationCode = generateDatabaseOperation(modelName, operation);

  const descriptionComment = description
    ? `/**
 * ${description}
 */
`
    : '';

  return `import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

${descriptionComment}export async function ${name}(${paramsString}): ${returnType} {
  'use server';

  try {
    ${operationCode}

    // Revalidate relevant paths
    revalidatePath('/');

    return { success: true, data: result };
  } catch (error) {
    console.error('Database error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Database operation failed',
    };
  }
}`;
}

/**
 * Generate database operation code
 *
 * @param modelName - Database model name
 * @param operation - Database operation
 * @returns Database operation code
 */
function generateDatabaseOperation(
  modelName: string,
  operation: 'create' | 'update' | 'delete'
): string {
  const modelLower = modelName.toLowerCase();

  switch (operation) {
    case 'create':
      return `const result = await db.${modelLower}.create({
      data: {
        // Add your fields here
      },
    });`;

    case 'update':
      return `const result = await db.${modelLower}.update({
      where: { id },
      data: {
        // Add your fields here
      },
    });`;

    case 'delete':
      return `const result = await db.${modelLower}.delete({
      where: { id },
    });`;
  }
}

/**
 * Generate a server action with file upload handling
 *
 * @param options - Server action options
 * @returns Server action with file upload template
 */
export function generateFileUploadServerAction(
  options: ServerActionTemplateProps
): string {
  const { name, returnType = 'Promise<{ success: boolean; url?: string; error?: string }>', description = '' } =
    options;

  const descriptionComment = description
    ? `/**
 * ${description}
 */
`
    : '';

  return `import { writeFile } from 'fs/promises';
import { join } from 'path';

${descriptionComment}export async function ${name}(formData: FormData): ${returnType} {
  'use server';

  try {
    const file = formData.get('file') as File;

    if (!file) {
      return {
        success: false,
        error: 'No file provided',
      };
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file
    const path = join(process.cwd(), 'public', 'uploads', file.name);
    await writeFile(path, buffer);

    return {
      success: true,
      url: \`/uploads/\${file.name}\`,
    };
  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'File upload failed',
    };
  }
}`;
}

/**
 * Generate a server action file with multiple actions
 *
 * @param actions - Array of server actions
 * @returns Complete server action file template
 */
export function generateServerActionsFile(
  actions: Array<{
    name: string;
    code: string;
  }>
): string {
  return `'use server';

/**
 * Server Actions
 *
 * This file contains server-side actions for data mutations.
 */

${actions.map((action) => action.code).join('\n\n')}`;
}

/**
 * Generate a revalidation helper
 *
 * @param paths - Paths to revalidate
 * @returns Revalidation code
 */
export function generateRevalidationCode(paths: string[]): string {
  return paths
    .map((path) => `revalidatePath('${path}');`)
    .join('\n');
}

/**
 * Generate error handling wrapper for server actions
 *
 * @param actionCode - Action code to wrap
 * @returns Wrapped action with error handling
 */
export function wrapWithErrorHandling(actionCode: string): string {
  return `try {
  ${actionCode}
} catch (error) {
  console.error('Server action error:', error);
  return {
    success: false,
    error: error instanceof Error ? error.message : 'An unexpected error occurred',
  };
}`;
}
