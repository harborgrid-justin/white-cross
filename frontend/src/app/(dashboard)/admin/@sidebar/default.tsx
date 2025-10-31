/**
 * @fileoverview Admin Sidebar Default - Default state for admin sidebar slot
 * @module app/(dashboard)/admin/@sidebar/default
 * @category Admin - Parallel Routes
 */

/**
 * Default Sidebar Component
 * 
 * Provides the default (empty) state for the admin sidebar parallel route slot.
 * This component is rendered when no specific sidebar route is active.
 * The main AdminSidebar is already integrated in the layout, so this slot
 * can be used for additional contextual sidebars when needed.
 * 
 * @returns Empty fragment (no additional sidebar displayed)
 */
export default function DefaultSidebar() {
  return null;
}