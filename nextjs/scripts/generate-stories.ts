#!/usr/bin/env ts-node

/**
 * Script to generate Storybook story templates for components
 * Usage: ts-node scripts/generate-stories.ts
 */

import fs from 'fs';
import path from 'path';

interface ComponentInfo {
  name: string;
  path: string;
  category: string;
}

const componentsToGenerate: ComponentInfo[] = [
  // UI Inputs
  { name: 'Checkbox', path: 'src/components/ui/inputs/Checkbox.tsx', category: 'UI/Inputs' },
  { name: 'Radio', path: 'src/components/ui/inputs/Radio.tsx', category: 'UI/Inputs' },
  { name: 'Select', path: 'src/components/ui/inputs/Select.tsx', category: 'UI/Inputs' },
  { name: 'Switch', path: 'src/components/ui/inputs/Switch.tsx', category: 'UI/Inputs' },
  { name: 'Textarea', path: 'src/components/ui/inputs/Textarea.tsx', category: 'UI/Inputs' },
  { name: 'SearchInput', path: 'src/components/ui/inputs/SearchInput.tsx', category: 'UI/Inputs' },

  // UI Feedback
  { name: 'Alert', path: 'src/components/ui/feedback/Alert.tsx', category: 'UI/Feedback' },
  { name: 'Progress', path: 'src/components/ui/feedback/Progress.tsx', category: 'UI/Feedback' },
  { name: 'LoadingSpinner', path: 'src/components/ui/feedback/LoadingSpinner.tsx', category: 'UI/Feedback' },

  // UI Overlays
  { name: 'Modal', path: 'src/components/ui/overlays/Modal.tsx', category: 'UI/Overlays' },

  // UI Display
  { name: 'Badge', path: 'src/components/ui/display/Badge.tsx', category: 'UI/Display' },
  { name: 'Avatar', path: 'src/components/ui/display/Avatar.tsx', category: 'UI/Display' },

  // UI Layout
  { name: 'Card', path: 'src/components/ui/layout/Card.tsx', category: 'UI/Layout' },
];

function generateStoryTemplate(component: ComponentInfo): string {
  const componentName = component.name;
  const category = component.category;

  return `import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ${componentName} } from './${componentName}';

/**
 * ${componentName} component documentation.
 *
 * Add detailed description here.
 */
const meta = {
  title: '${category}/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '${componentName} component for White Cross healthcare platform.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Add argTypes here
  },
} satisfies Meta<typeof ${componentName}>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default ${componentName} story.
 */
export const Default: Story = {
  args: {
    // Add default args here
  },
};

/**
 * Add more stories here
 */
`;
}

console.log('Generating Storybook story templates...\n');

componentsToGenerate.forEach((component) => {
  const storyPath = component.path.replace('.tsx', '.stories.tsx');

  if (fs.existsSync(storyPath)) {
    console.log(`⏭️  Skipping ${component.name} (story already exists)`);
    return;
  }

  const storyContent = generateStoryTemplate(component);

  try {
    fs.writeFileSync(storyPath, storyContent);
    console.log(`✅ Generated story for ${component.name}`);
  } catch (error) {
    console.error(`❌ Failed to generate story for ${component.name}:`, error);
  }
});

console.log('\n✨ Story generation complete!');
