/**
 * Code Generation Examples
 *
 * Demonstrates how to use the code generation engine.
 */

import type { ComponentInstance, NextJSPageConfig } from '@/types';
import { createCodeGenerator } from './CodeGenerator';

/**
 * Example 1: Generate a simple landing page
 */
export async function exampleSimplePage() {
  const components: ComponentInstance[] = [
    {
      id: 'root-1',
      type: 'Container',
      name: 'Root Container',
      parentId: null,
      childIds: ['hero-1', 'content-1'],
      position: { x: 0, y: 0 },
      size: { width: 1200, height: 800 },
      properties: {},
      styles: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0',
      },
      locked: false,
      hidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'hero-1',
      type: 'Section',
      name: 'Hero Section',
      parentId: 'root-1',
      childIds: ['title-1', 'subtitle-1'],
      position: { x: 0, y: 0 },
      size: { width: 1200, height: 400 },
      properties: {},
      styles: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '64px',
        backgroundColor: '#f7fafc',
      },
      locked: false,
      hidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'title-1',
      type: 'Heading',
      name: 'Main Title',
      parentId: 'hero-1',
      childIds: [],
      position: { x: 0, y: 0 },
      size: { width: 800, height: 60 },
      properties: {
        text: 'Welcome to Our Platform',
      },
      styles: {
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#1a202c',
        textAlign: 'center',
      },
      locked: false,
      hidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'subtitle-1',
      type: 'Paragraph',
      name: 'Subtitle',
      parentId: 'hero-1',
      childIds: [],
      position: { x: 0, y: 70 },
      size: { width: 600, height: 30 },
      properties: {
        text: 'Build amazing applications with our tools',
      },
      styles: {
        fontSize: '20px',
        color: '#718096',
        textAlign: 'center',
      },
      locked: false,
      hidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'content-1',
      type: 'Section',
      name: 'Content Section',
      parentId: 'root-1',
      childIds: ['card-1', 'card-2', 'card-3'],
      position: { x: 0, y: 400 },
      size: { width: 1200, height: 400 },
      properties: {},
      styles: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        padding: '64px',
      },
      locked: false,
      hidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'card-1',
      type: 'Card',
      name: 'Feature Card 1',
      parentId: 'content-1',
      childIds: [],
      position: { x: 0, y: 0 },
      size: { width: 350, height: 200 },
      properties: {
        text: 'Feature 1: Fast Performance',
      },
      styles: {
        padding: '24px',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      },
      locked: false,
      hidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'card-2',
      type: 'Card',
      name: 'Feature Card 2',
      parentId: 'content-1',
      childIds: [],
      position: { x: 374, y: 0 },
      size: { width: 350, height: 200 },
      properties: {
        text: 'Feature 2: Easy to Use',
      },
      styles: {
        padding: '24px',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      },
      locked: false,
      hidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'card-3',
      type: 'Card',
      name: 'Feature Card 3',
      parentId: 'content-1',
      childIds: [],
      position: { x: 748, y: 0 },
      size: { width: 350, height: 200 },
      properties: {
        text: 'Feature 3: Scalable',
      },
      styles: {
        padding: '24px',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      },
      locked: false,
      hidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const pageConfig: NextJSPageConfig = {
    title: 'Landing Page',
    description: 'A modern landing page',
    path: '/',
    metadata: {
      title: 'Welcome | My Platform',
      description: 'Build amazing applications with our tools',
    },
    components,
  };

  const generator = createCodeGenerator(components, {
    useTypeScript: true,
    useTailwind: true,
    prettier: true,
  });

  const result = await generator.generatePage(pageConfig);

  console.log('Generated Files:');
  result.files.forEach((file) => {
    console.log(`\n=== ${file.path} ===`);
    console.log(file.content);
  });

  console.log('\nStatistics:');
  console.log(`Total Components: ${result.stats.totalComponents}`);
  console.log(`Client Components: ${result.stats.clientComponents}`);
  console.log(`Server Components: ${result.stats.serverComponents}`);
  console.log(`Total Files: ${result.stats.totalFiles}`);

  return result;
}

/**
 * Example 2: Generate an interactive form page (client component)
 */
export async function exampleFormPage() {
  const components: ComponentInstance[] = [
    {
      id: 'form-1',
      type: 'Form',
      name: 'Contact Form',
      parentId: null,
      childIds: ['input-1', 'input-2', 'textarea-1', 'button-1'],
      position: { x: 0, y: 0 },
      size: { width: 500, height: 400 },
      properties: {
        onSubmit: 'handleSubmit',
      },
      styles: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '24px',
      },
      locked: false,
      hidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'input-1',
      type: 'Input',
      name: 'Name Input',
      parentId: 'form-1',
      childIds: [],
      position: { x: 0, y: 0 },
      size: { width: 450, height: 40 },
      properties: {
        type: 'text',
        placeholder: 'Your name',
        required: true,
      },
      styles: {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #e2e8f0',
      },
      locked: false,
      hidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'input-2',
      type: 'Input',
      name: 'Email Input',
      parentId: 'form-1',
      childIds: [],
      position: { x: 0, y: 60 },
      size: { width: 450, height: 40 },
      properties: {
        type: 'email',
        placeholder: 'your@email.com',
        required: true,
      },
      styles: {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #e2e8f0',
      },
      locked: false,
      hidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'textarea-1',
      type: 'Textarea',
      name: 'Message Textarea',
      parentId: 'form-1',
      childIds: [],
      position: { x: 0, y: 120 },
      size: { width: 450, height: 120 },
      properties: {
        placeholder: 'Your message',
        required: true,
      },
      styles: {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #e2e8f0',
      },
      locked: false,
      hidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'button-1',
      type: 'Button',
      name: 'Submit Button',
      parentId: 'form-1',
      childIds: [],
      position: { x: 0, y: 260 },
      size: { width: 120, height: 40 },
      properties: {
        type: 'submit',
        text: 'Send Message',
      },
      styles: {
        padding: '8px 24px',
        borderRadius: '4px',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
      },
      locked: false,
      hidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const pageConfig: NextJSPageConfig = {
    title: 'Contact Us',
    description: 'Get in touch with us',
    path: '/contact',
    metadata: {
      title: 'Contact Us',
      description: 'Get in touch with our team',
    },
    components,
  };

  const generator = createCodeGenerator(components);
  const result = await generator.generatePage(pageConfig);

  return result;
}

/**
 * Example 3: Analyze component tree
 */
export async function exampleAnalysis() {
  const components: ComponentInstance[] = [
    // Mix of client and server components
    {
      id: 'server-1',
      type: 'Container',
      name: 'Server Container',
      parentId: null,
      childIds: ['client-1'],
      position: { x: 0, y: 0 },
      size: { width: 1200, height: 800 },
      properties: {},
      styles: {},
      locked: false,
      hidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'client-1',
      type: 'Button',
      name: 'Interactive Button',
      parentId: 'server-1',
      childIds: [],
      position: { x: 0, y: 0 },
      size: { width: 120, height: 40 },
      properties: {
        onClick: 'handleClick',
        text: 'Click me',
      },
      styles: {},
      locked: false,
      hidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const generator = createCodeGenerator(components);
  const analysis = generator.analyzeComponents(components);

  console.log('Component Analysis:');
  console.log('Render Modes:', analysis.renderModes);
  console.log('Has Client Components:', analysis.hasClientComponents);
  console.log('Suggestions:', analysis.suggestions);

  return analysis;
}

/**
 * Example 4: Generate server action
 */
export async function exampleServerAction() {
  const generator = createCodeGenerator([]);

  const action = await generator.generateServerAction(
    'createPost',
    {
      title: 'string',
      content: 'string',
      authorId: 'string',
    },
    `const post = await db.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    revalidatePath('/posts');

    return { success: true, data: post };`,
    {
      returnType: 'Promise<{ success: boolean; data?: any }>',
      description: 'Create a new blog post',
    }
  );

  console.log('Generated Server Action:');
  console.log(action.content);

  return action;
}

/**
 * Example 5: Convert styles to Tailwind
 */
export function exampleStyleConversion() {
  const generator = createCodeGenerator([]);

  const styles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '32px',
    gap: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  };

  const tailwindClasses = generator.convertStylesToTailwind(styles);

  console.log('CSS Styles:', styles);
  console.log('Tailwind Classes:', tailwindClasses);

  return tailwindClasses;
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('\n=== Example 1: Simple Page ===');
  await exampleSimplePage();

  console.log('\n=== Example 2: Form Page ===');
  await exampleFormPage();

  console.log('\n=== Example 3: Component Analysis ===');
  await exampleAnalysis();

  console.log('\n=== Example 4: Server Action ===');
  await exampleServerAction();

  console.log('\n=== Example 5: Style Conversion ===');
  exampleStyleConversion();
}
