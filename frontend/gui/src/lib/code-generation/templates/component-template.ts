/**
 * React Component Template
 *
 * Provides templates for generating React components.
 * Supports both server and client components with TypeScript.
 */

/**
 * Props for component template generation
 */
export interface ComponentTemplateProps {
  name: string;
  props?: Record<string, string>;
  children?: boolean;
  imports?: string[];
  useClient?: boolean;
  description?: string;
}

/**
 * Generate a functional component template
 *
 * @param options - Component template options
 * @param jsxContent - JSX content for the component
 * @returns Component template string
 */
export function generateComponentTemplate(
  options: ComponentTemplateProps,
  jsxContent: string
): string {
  const {
    name,
    props = {},
    children = false,
    imports = [],
    useClient = false,
    description = '',
  } = options;

  const clientDirective = useClient ? "'use client';\n\n" : '';
  const importsSection = imports.length > 0 ? imports.join('\n') + '\n\n' : '';

  // Generate props interface
  const hasProps = Object.keys(props).length > 0 || children;
  const propsInterface = hasProps
    ? generatePropsInterface(name, props, children)
    : '';

  const propsParam = hasProps ? `props: ${name}Props` : '';

  const descriptionComment = description
    ? `/**
 * ${description}
 */
`
    : '';

  return `${clientDirective}${importsSection}${propsInterface}${descriptionComment}export default function ${name}(${propsParam}) {
  return (
    ${jsxContent}
  );
}`;
}

/**
 * Generate a component with destructured props
 *
 * @param options - Component template options
 * @param jsxContent - JSX content for the component
 * @returns Component template string
 */
export function generateComponentWithDestructuredProps(
  options: ComponentTemplateProps,
  jsxContent: string
): string {
  const {
    name,
    props = {},
    children = false,
    imports = [],
    useClient = false,
    description = '',
  } = options;

  const clientDirective = useClient ? "'use client';\n\n" : '';
  const importsSection = imports.length > 0 ? imports.join('\n') + '\n\n' : '';

  const hasProps = Object.keys(props).length > 0 || children;
  const propsInterface = hasProps
    ? generatePropsInterface(name, props, children)
    : '';

  // Destructured props
  const propNames = Object.keys(props);
  if (children) propNames.push('children');

  const destructuredProps =
    propNames.length > 0 ? `{ ${propNames.join(', ')} }` : '';
  const propsParam = hasProps
    ? `${destructuredProps}: ${name}Props`
    : '';

  const descriptionComment = description
    ? `/**
 * ${description}
 */
`
    : '';

  return `${clientDirective}${importsSection}${propsInterface}${descriptionComment}export default function ${name}(${propsParam}) {
  return (
    ${jsxContent}
  );
}`;
}

/**
 * Generate a component with forwardRef
 *
 * @param options - Component template options
 * @param jsxContent - JSX content for the component
 * @returns Component template with forwardRef
 */
export function generateForwardRefComponent(
  options: ComponentTemplateProps,
  jsxContent: string
): string {
  const {
    name,
    props = {},
    children = false,
    imports = [],
    useClient = false,
    description = '',
  } = options;

  const clientDirective = useClient ? "'use client';\n\n" : '';

  // Add React import if not present
  const allImports = imports.includes("import React from 'react';")
    ? imports
    : ["import React from 'react';", ...imports];

  const importsSection = allImports.join('\n') + '\n\n';

  const hasProps = Object.keys(props).length > 0 || children;
  const propsInterface = hasProps
    ? generatePropsInterface(name, props, children)
    : '';

  const propNames = Object.keys(props);
  if (children) propNames.push('children');

  const destructuredProps =
    propNames.length > 0 ? `{ ${propNames.join(', ')} }` : '';
  const propsParam = hasProps
    ? `${destructuredProps}: ${name}Props`
    : '';

  const descriptionComment = description
    ? `/**
 * ${description}
 */
`
    : '';

  return `${clientDirective}${importsSection}${propsInterface}${descriptionComment}const ${name} = React.forwardRef<HTMLDivElement, ${hasProps ? `${name}Props` : 'object'}>(
  (${propsParam}, ref) => {
    return (
      ${jsxContent.replace('<div', '<div ref={ref}')}
    );
  }
);

${name}.displayName = '${name}';

export default ${name};`;
}

/**
 * Generate props interface for a component
 *
 * @param componentName - Name of the component
 * @param props - Props object
 * @param includeChildren - Include children prop
 * @returns Props interface string
 */
function generatePropsInterface(
  componentName: string,
  props: Record<string, string>,
  includeChildren: boolean
): string {
  const propEntries = Object.entries(props)
    .map(([key, type]) => `  ${key}: ${type};`)
    .join('\n');

  const childrenProp = includeChildren
    ? '  children?: React.ReactNode;'
    : '';

  return `interface ${componentName}Props {
${propEntries}${propEntries && childrenProp ? '\n' : ''}${childrenProp}
}

`;
}

/**
 * Generate a client component with state
 *
 * @param options - Component template options
 * @param jsxContent - JSX content for the component
 * @param stateVars - State variables (name -> type)
 * @returns Component template with state
 */
export function generateComponentWithState(
  options: ComponentTemplateProps,
  jsxContent: string,
  stateVars: Record<string, { type: string; initialValue: string }>
): string {
  const {
    name,
    props = {},
    children = false,
    imports = [],
    description = '',
  } = options;

  // Add React import if not present
  const allImports = imports.includes("import { useState } from 'react';")
    ? imports
    : ["import { useState } from 'react';", ...imports];

  const importsSection = allImports.join('\n') + '\n\n';

  const hasProps = Object.keys(props).length > 0 || children;
  const propsInterface = hasProps
    ? generatePropsInterface(name, props, children)
    : '';

  const propNames = Object.keys(props);
  if (children) propNames.push('children');

  const destructuredProps =
    propNames.length > 0 ? `{ ${propNames.join(', ')} }` : '';
  const propsParam = hasProps
    ? `${destructuredProps}: ${name}Props`
    : '';

  const stateDeclarations = Object.entries(stateVars)
    .map(
      ([varName, { type, initialValue }]) =>
        `  const [${varName}, set${capitalize(varName)}] = useState<${type}>(${initialValue});`
    )
    .join('\n');

  const descriptionComment = description
    ? `/**
 * ${description}
 */
`
    : '';

  return `'use client';

${importsSection}${propsInterface}${descriptionComment}export default function ${name}(${propsParam}) {
${stateDeclarations}

  return (
    ${jsxContent}
  );
}`;
}

/**
 * Generate a memoized component
 *
 * @param options - Component template options
 * @param jsxContent - JSX content for the component
 * @returns Memoized component template
 */
export function generateMemoizedComponent(
  options: ComponentTemplateProps,
  jsxContent: string
): string {
  const {
    name,
    props = {},
    children = false,
    imports = [],
    useClient = false,
    description = '',
  } = options;

  const clientDirective = useClient ? "'use client';\n\n" : '';

  // Add React import if not present
  const allImports = imports.includes("import React from 'react';")
    ? imports
    : ["import React from 'react';", ...imports];

  const importsSection = allImports.join('\n') + '\n\n';

  const hasProps = Object.keys(props).length > 0 || children;
  const propsInterface = hasProps
    ? generatePropsInterface(name, props, children)
    : '';

  const propNames = Object.keys(props);
  if (children) propNames.push('children');

  const destructuredProps =
    propNames.length > 0 ? `{ ${propNames.join(', ')} }` : '';
  const propsParam = hasProps
    ? `${destructuredProps}: ${name}Props`
    : '';

  const descriptionComment = description
    ? `/**
 * ${description}
 */
`
    : '';

  return `${clientDirective}${importsSection}${propsInterface}${descriptionComment}const ${name}Component = (${propsParam}) => {
  return (
    ${jsxContent}
  );
};

const ${name} = React.memo(${name}Component);

export default ${name};`;
}

/**
 * Capitalize the first letter of a string
 *
 * @param str - String to capitalize
 * @returns Capitalized string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate a barrel export file for components
 *
 * @param componentNames - List of component names
 * @returns Barrel export string
 */
export function generateBarrelExport(componentNames: string[]): string {
  return componentNames
    .map(
      (name) =>
        `export { default as ${name} } from './${name}';`
    )
    .join('\n');
}
