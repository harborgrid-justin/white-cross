# Quick Start Guide

Get started with the Next.js Code Generation Engine in 5 minutes.

## Basic Setup

```typescript
import { createCodeGenerator } from '@/lib/code-generation';
import type { ComponentInstance, NextJSPageConfig } from '@/types';
```

## 1. Generate a Simple Page

```typescript
// Define your components
const components: ComponentInstance[] = [
  {
    id: '1',
    type: 'Container',
    name: 'Main Container',
    parentId: null,
    childIds: ['2'],
    position: { x: 0, y: 0 },
    size: { width: 1200, height: 600 },
    properties: {},
    styles: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '32px',
    },
    locked: false,
    hidden: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'Heading',
    name: 'Title',
    parentId: '1',
    childIds: [],
    position: { x: 0, y: 0 },
    size: { width: 400, height: 60 },
    properties: {
      text: 'Hello, World!',
    },
    styles: {
      fontSize: '48px',
      fontWeight: 'bold',
    },
    locked: false,
    hidden: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Create page config
const pageConfig: NextJSPageConfig = {
  title: 'Home Page',
  description: 'Welcome to my site',
  path: '/',
  metadata: {
    title: 'Home',
    description: 'Welcome to my site',
  },
  components,
};

// Generate the page
const generator = createCodeGenerator(components, {
  useTypeScript: true,
  useTailwind: true,
  prettier: true,
});

const result = await generator.generatePage(pageConfig);

// Access generated files
console.log(result.files[0].content);
```

## 2. Generate Just JSX

```typescript
import { quickGenerateJSX } from '@/lib/code-generation';

const jsx = await quickGenerateJSX(
  components,
  ['1'] // root component IDs
);

console.log(jsx);
// Output:
// <div className="flex justify-center items-center p-8">
//   <h1 className="text-5xl font-bold">Hello, World!</h1>
// </div>
```

## 3. Convert Styles to Tailwind

```typescript
const generator = createCodeGenerator([]);

const tailwind = generator.convertStylesToTailwind({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '24px',
  backgroundColor: '#ffffff',
});

console.log(tailwind);
// Output: "flex flex-col gap-4 p-6 bg-white"
```

## 4. Analyze Components

```typescript
const generator = createCodeGenerator(components);
const analysis = generator.analyzeComponents(components);

console.log('Client components:', analysis.hasClientComponents);
console.log('Render modes:', analysis.renderModes);
console.log('Suggestions:', analysis.suggestions);
```

## 5. Generate Server Action

```typescript
const action = await generator.generateServerAction(
  'submitForm',
  { name: 'string', email: 'string' },
  `
  await db.contact.create({
    data: { name, email }
  });

  return { success: true };
  `,
  {
    returnType: 'Promise<{ success: boolean }>',
    description: 'Submit contact form',
  }
);

console.log(action.content);
```

## 6. Generate Multiple Pages

```typescript
const pages = [homeConfig, aboutConfig, contactConfig];

const result = await generator.generatePages(pages);

console.log(`Generated ${result.stats.totalFiles} files`);
console.log(`Total components: ${result.stats.totalComponents}`);
```

## Common Patterns

### Pattern 1: Client Component with State

```typescript
const buttonComponent: ComponentInstance = {
  id: 'button-1',
  type: 'Button',
  name: 'Counter Button',
  parentId: null,
  childIds: [],
  position: { x: 0, y: 0 },
  size: { width: 120, height: 40 },
  properties: {
    onClick: 'handleClick',
    text: 'Click me',
  },
  styles: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderRadius: '4px',
  },
  locked: false,
  hidden: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// This will automatically be detected as a client component
```

### Pattern 2: Nested Components

```typescript
const components: ComponentInstance[] = [
  {
    id: 'container',
    type: 'Container',
    parentId: null,
    childIds: ['header', 'content', 'footer'],
    // ... other properties
  },
  {
    id: 'header',
    type: 'Section',
    parentId: 'container',
    childIds: ['nav'],
    // ... other properties
  },
  // ... more components
];

const jsx = await quickGenerateJSX(components, ['container']);
// Generates properly nested JSX
```

### Pattern 3: Custom Styles

```typescript
const component: ComponentInstance = {
  // ... basic properties
  styles: {
    // Tailwind will be used where possible
    display: 'flex',
    gap: '16px',

    // Custom styles for unsupported properties
    background: 'linear-gradient(to right, #667eea, #764ba2)',
  },
};

// Generates: className="flex gap-4" style={{ background: 'linear-gradient(...)' }}
```

## Tips & Best Practices

1. **Use Server Components by Default**: Only use client components when needed (events, hooks)
2. **Leverage Tailwind**: The generator automatically converts common CSS to Tailwind
3. **Enable Prettier**: Always format generated code for consistency
4. **Validate Before Generating**: Use `generator.validate()` to check configurations
5. **Check Statistics**: Review `result.stats` to optimize component usage

## Troubleshooting

### Issue: No output generated

**Solution**: Check that components have valid parent-child relationships

```typescript
// Ensure root components have parentId: null
const root = components.find(c => c.parentId === null);
```

### Issue: Client directive not added

**Solution**: Verify component needs client-side features

```typescript
const analysis = generator.analyzeComponents(components);
console.log(analysis.renderModes.get('component-id'));
```

### Issue: Imports missing

**Solution**: Use ImportManager directly

```typescript
import { ImportManager } from '@/lib/code-generation';

const importManager = new ImportManager();
importManager.addReactHooks(['useState']);
importManager.addNextImports({ Link: true });
```

## Next Steps

- Read the full [README.md](./README.md)
- Check [examples.ts](./examples.ts) for more examples
- Explore the [API documentation](./README.md#api-reference)

## Need Help?

- Check the examples in `examples.ts`
- Review component types in `@/types/index.ts`
- Read the comprehensive `README.md`
