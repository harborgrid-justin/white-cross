/**
 * MSW Server Setup
 * Configures Mock Service Worker for tests
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
