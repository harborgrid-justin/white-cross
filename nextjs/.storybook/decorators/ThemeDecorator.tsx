import React, { useEffect } from 'react';
import type { Decorator } from '@storybook/react';

export const ThemeDecorator: Decorator = (Story, context) => {
  const theme = context.globals.theme || 'light';

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 p-4">
        <Story />
      </div>
    </div>
  );
};
