/**
 * Issue Stock Page
 *
 * Issue stock from inventory
 */

import React from 'react';
import { Metadata } from 'next';
import { IssueStockContent } from './IssueStockContent';

export const metadata: Metadata = {
  title: 'Issue Stock | Inventory',
  description: 'Issue stock from inventory',
};

export default function IssueStockPage() {
  return <IssueStockContent />;
}
