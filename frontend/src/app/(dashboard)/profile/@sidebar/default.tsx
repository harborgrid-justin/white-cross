/**
 * @fileoverview Profile Sidebar Default - Default state for profile sidebar slot
 * @module app/(dashboard)/profile/@sidebar/default
 * @category Profile - Parallel Routes
 */

/**
 * Default Sidebar Component
 * 
 * Provides the default (empty) state for the profile sidebar parallel route slot.
 * This component is rendered when no specific sidebar route is active.
 * The main ProfileSidebar is already integrated in the layout, so this slot
 * can be used for additional contextual sidebars when needed.
 * 
 * @returns Empty fragment (no additional sidebar displayed)
 */
export default function DefaultSidebar() {
  return null;
}