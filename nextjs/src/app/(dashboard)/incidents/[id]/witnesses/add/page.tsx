/**
 * @fileoverview Add Witness to Incident Page
 * @module app/(dashboard)/incidents/[id]/witnesses/add
 */

import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Add Witness | White Cross',
  description: 'Add witness to incident',
};

export default function AddWitnessPage({ params }: { params: { id: string } }) {
  // Form component would go here
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add Witness</h1>
      <p className="text-gray-600">Add witness form for incident {params.id}</p>
    </div>
  );
}
