/**
 * Component Palette - Barrel Export
 *
 * Exports all palette-related components and utilities.
 */

export { ComponentPalette, MemoizedComponentPalette } from './ComponentPalette';
export type { ComponentPaletteProps } from './ComponentPalette';

export { PaletteItem, MemoizedPaletteItem } from './PaletteItem';
export type { PaletteItemProps } from './PaletteItem';

export { SearchBar, MemoizedSearchBar } from './SearchBar';
export type { SearchBarProps } from './SearchBar';

export { CategoryTabs, MemoizedCategoryTabs } from './CategoryTabs';
export type { CategoryTabsProps } from './CategoryTabs';

export {
  componentRegistry,
  getComponentsByCategory,
  getComponentById,
  getCategoriesWithCounts,
  searchComponents,
} from './componentRegistry';
