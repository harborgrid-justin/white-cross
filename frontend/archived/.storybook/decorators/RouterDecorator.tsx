import React from 'react';
import type { Decorator } from '@storybook/react';

// Mock Next.js router for Storybook
const mockRouter = {
  push: async () => {},
  replace: async () => {},
  refresh: () => {},
  back: () => {},
  forward: () => {},
  prefetch: async () => {},
  pathname: '/',
  query: {},
  asPath: '/',
  route: '/',
};

export const RouterDecorator: Decorator = (Story, context) => {
  // Set up router mock
  if (typeof window !== 'undefined') {
    (window as any).__NEXT_DATA__ = {
      props: {},
      page: '/',
      query: {},
      buildId: 'storybook',
    };
  }

  return <Story />;
};
