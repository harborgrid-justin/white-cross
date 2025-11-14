import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { Decorator } from '@storybook/react';

// Mock Redux store for Storybook
const mockStore = configureStore({
  reducer: {
    auth: (state = { user: null, isAuthenticated: false }) => state,
    students: (state = { students: [], loading: false }) => state,
    medications: (state = { medications: [], loading: false }) => state,
    appointments: (state = { appointments: [], loading: false }) => state,
    healthRecords: (state = { records: [], loading: false }) => state,
    settings: (state = { theme: 'light' }) => state,
  },
});

export const ReduxDecorator: Decorator = (Story) => (
  <Provider store={mockStore}>
    <Story />
  </Provider>
);
