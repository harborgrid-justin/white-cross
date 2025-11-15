# Next.js Code Generation Engine

A comprehensive code generation system that converts visual page builder state into production-ready Next.js code.

## Features

- 🎨 **Visual to Code**: Convert component instances to clean JSX
- ⚛️ **Next.js 16**: Full support for App Router, Server Components, and Server Actions
- 🎯 **Smart Detection**: Auto-detect Server vs Client components
- 📦 **Import Management**: Smart import deduplication and organization
- 🎨 **Tailwind CSS**: Convert inline styles to Tailwind classes
- ✨ **Prettier**: Automatic code formatting
- 📘 **TypeScript**: Full type safety throughout

## Installation

The code generation engine is already integrated into the project. Simply import from `@/lib/code-generation`:

```typescript
import { CodeGenerator, createCodeGenerator } from '@/lib/code-generation';
```

## Quick Start

### Generate a Complete Page

```typescript
import { createCodeGenerator } from '@/lib/code-generation';
import type { NextJSPageConfig } from '@/types';

const pageConfig: NextJSPageConfig = {
  title: 'My Page',
  description: 'A generated page',
  path: '/my-page',
  metadata: {
    title: 'My Page',
    description: 'A generated page',
  },
  components: [/* your component instances */],
};

const generator = createCodeGenerator(pageConfig.components, {
  useTypeScript: true,
  useTailwind: true,
  prettier: true,
});

const result = await generator.generatePage(pageConfig);

// Access generated files
result.files.forEach(file => {
  console.log(`${file.path}:`);
  console.log(file.content);
});
```

### Generate JSX Only

```typescript
import { quickGenerateJSX } from '@/lib/code-generation';

const jsx = await quickGenerateJSX(components, rootComponentIds);
console.log(jsx);
```

### Generate a Standalone Component

```typescript
const componentCode = await generator.generateComponent(
  components,
  'MyComponent',
  rootComponentIds
);

console.log(componentCode.content);
```

## Architecture

### Core Components

```
code-generation/
├── CodeGenerator.ts          # Main orchestrator
├── generators/
│   ├── ComponentGenerator.ts # JSX generation
│   ├── PageGenerator.ts      # Page file generation
│   ├── ImportManager.ts      # Import management
│   └── StyleGenerator.ts     # Tailwind conversion
├── templates/
│   ├── page-template.ts      # Page templates
│   ├── component-template.ts # Component templates
│   ├── server-action-template.ts
│   └── metadata-template.ts
└── utils/
    ├── ast-helpers.ts        # AST manipulation
    ├── prettier-format.ts    # Code formatting
    └── component-detector.ts # Server/Client detection
```

## API Reference

### CodeGenerator

Main class for code generation operations.

```typescript
class CodeGenerator {
  constructor(context: CodeGenerationContext);

  // Generate a complete page
  async generatePage(config: NextJSPageConfig): Promise<CodeGenerationResult>;

  // Generate a standalone component
  async generateComponent(
    components: ComponentInstance[],
    componentName: string,
    rootIds: string[]
  ): Promise<GeneratedCode>;

  // Generate server action
  async generateServerAction(
    actionName: string,
    params: Record<string, string>,
    body: string
  ): Promise<GeneratedCode>;

  // Analyze components
  analyzeComponents(components: ComponentInstance[]): AnalysisResult;

  // Get statistics
  getStatistics(components: ComponentInstance[]): Statistics;
}
```

### ImportManager

Manages imports with smart deduplication.

```typescript
const importManager = new ImportManager();

// Add imports
importManager.addDefaultImport('React', 'react');
importManager.addNamedImports(['useState', 'useEffect'], 'react');
importManager.addNextImports({ Link: true, Image: true });

// Generate import statements
const imports = importManager.generateImportStatements();
// ['import React from 'react';', 'import { useState, useEffect } from 'react';', ...]
```

### StyleGenerator

Converts CSS properties to Tailwind classes.

```typescript
const styleGenerator = new StyleGenerator();

styleGenerator.addStyles({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '16px',
  backgroundColor: '#ffffff',
});

const className = styleGenerator.getClassName();
// 'flex justify-center items-center p-4 bg-white'
```

### ComponentGenerator

Generates JSX from component instances.

```typescript
const generator = new ComponentGenerator(components);

const jsx = generator.generateComponentTree(rootIds, {
  indentLevel: 0,
  useTailwind: true,
  includeComments: false,
});
```

### PageGenerator

Generates complete Next.js page files.

```typescript
const pageGenerator = new PageGenerator(pageConfig, options);

// Generate page
const result = await pageGenerator.generatePage();

// Generate with server actions
const resultWithActions = await pageGenerator.generatePageWithActions(actions);

// Split client/server components
const split = await pageGenerator.splitClientServerComponents();
```

## Templates

### Page Template

```typescript
import { generatePageTemplate } from '@/lib/code-generation';

const code = generatePageTemplate(
  pageConfig,
  jsxContent,
  imports,
  useClient
);
```

### Component Template

```typescript
import { generateComponentTemplate } from '@/lib/code-generation';

const code = generateComponentTemplate(
  {
    name: 'MyComponent',
    props: { title: 'string', count: 'number' },
    children: true,
    useClient: true,
  },
  jsxContent
);
```

### Server Action Template

```typescript
import { generateServerAction } from '@/lib/code-generation';

const code = generateServerAction(
  {
    name: 'createPost',
    params: { title: 'string', content: 'string' },
    returnType: 'Promise<{ success: boolean }>',
  },
  'await db.post.create({ data: { title, content } });'
);
```

### Metadata Template

```typescript
import { generateStaticMetadata } from '@/lib/code-generation';

const code = generateStaticMetadata({
  title: 'My Page',
  description: 'Page description',
  keywords: ['next.js', 'react'],
  openGraph: {
    title: 'My Page',
    description: 'Page description',
    images: ['/og-image.jpg'],
  },
});
```

## Utilities

### Component Detector

Automatically detects if components need client-side rendering:

```typescript
import {
  detectRenderMode,
  analyzeComponentTree,
  suggestOptimizations
} from '@/lib/code-generation';

// Detect render mode for a single component
const mode = detectRenderMode(component, componentMap);
// 'server' | 'client'

// Analyze entire tree
const renderModes = analyzeComponentTree(components);

// Get optimization suggestions
const suggestions = suggestOptimizations(components);
```

### Prettier Formatting

```typescript
import { formatTSX, formatTypeScript } from '@/lib/code-generation';

const formattedCode = await formatTSX(tsxCode);
const formattedTS = await formatTypeScript(tsCode);
```

### AST Helpers

```typescript
import {
  createProject,
  createSourceFile,
  addFunctionalComponent,
  addInterface,
} from '@/lib/code-generation';

const project = createProject();
const sourceFile = createSourceFile(project, 'MyComponent.tsx');

addInterface(sourceFile, 'MyProps', {
  title: 'string',
  count: 'number',
});

addFunctionalComponent(
  sourceFile,
  'MyComponent',
  'MyProps',
  '<div>Component content</div>',
  true
);
```

## Examples

### Example 1: Generate a Simple Page

```typescript
const components: ComponentInstance[] = [
  {
    id: '1',
    type: 'Container',
    name: 'Root Container',
    parentId: null,
    childIds: ['2'],
    position: { x: 0, y: 0 },
    size: { width: 1200, height: 800 },
    properties: {},
    styles: {
      display: 'flex',
      flexDirection: 'column',
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
    size: { width: 400, height: 40 },
    properties: {
      text: 'Welcome to My Page',
    },
    styles: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1a202c',
    },
    locked: false,
    hidden: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const pageConfig: NextJSPageConfig = {
  title: 'Welcome Page',
  description: 'A simple welcome page',
  path: '/welcome',
  metadata: {
    title: 'Welcome',
    description: 'Welcome to our site',
  },
  components,
};

const generator = createCodeGenerator(components);
const result = await generator.generatePage(pageConfig);

// Output:
// app/welcome/page.tsx
// app/welcome/loading.tsx
// app/welcome/error.tsx
```

### Example 2: Generate Multiple Pages

```typescript
const pages = [
  homePageConfig,
  aboutPageConfig,
  contactPageConfig,
];

const generator = createCodeGenerator([], {
  useTypeScript: true,
  useTailwind: true,
  prettier: true,
});

const result = await generator.generatePages(pages);

console.log(`Generated ${result.stats.totalFiles} files`);
console.log(`Total components: ${result.stats.totalComponents}`);
console.log(`Client components: ${result.stats.clientComponents}`);
console.log(`Server components: ${result.stats.serverComponents}`);
```

### Example 3: Analyze Components

```typescript
const analysis = generator.analyzeComponents(components);

console.log('Render modes:', analysis.renderModes);
console.log('Has client components:', analysis.hasClientComponents);
console.log('Suggestions:', analysis.suggestions);
```

## Best Practices

1. **Use Server Components by Default**: Only use client components when necessary
2. **Leverage Tailwind**: Use Tailwind classes instead of inline styles when possible
3. **Enable Prettier**: Always format generated code for consistency
4. **Type Safety**: Use TypeScript for better development experience
5. **Validate Configuration**: Always validate page config before generation
6. **Optimize Component Tree**: Follow suggestions from `suggestOptimizations()`

## Troubleshooting

### Components Not Generating

Check that:
- Component IDs are unique
- Parent-child relationships are valid
- Root components have `parentId: null`

### Client Directive Not Added

Ensure components that need client-side features (events, hooks) are properly detected:

```typescript
const analysis = generator.analyzeComponents(components);
if (!analysis.hasClientComponents) {
  // No client components detected
}
```

### Imports Missing

Use `ImportManager` to explicitly add imports:

```typescript
const importManager = new ImportManager();
importManager.addReactHooks(['useState', 'useEffect']);
importManager.addNextImports({ Link: true });
```

## Contributing

When adding new features:

1. Add types to `@/types/index.ts`
2. Create templates in `templates/`
3. Implement generators in `generators/`
4. Add utilities to `utils/`
5. Export from `index.ts`
6. Update this README

## License

MIT
