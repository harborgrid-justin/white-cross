/**
 * Communication Domain Selectors
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../reduxStore';

export const selectCommunicationStats = createSelector(
  [(state: RootState) => state.communication],
  (_communication) => ({
    totalMessages: 0,
    unreadCount: 0,
  })
);