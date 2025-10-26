/**
 * Navigation Components
 * 
 * Components for navigation and routing.
 */

export { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
  type TabsProps,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentProps
} from './Tabs';

// Additional navigation components
export { Pagination, type PaginationProps } from './Pagination';
export {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuDivider,
  type DropdownMenuProps,
  type DropdownMenuItemProps,
  type DropdownMenuDividerProps,
  type MenuItemVariant
} from './DropdownMenu';
export {
  CommandPalette,
  type CommandPaletteProps,
  type Command,
  type CommandGroup
} from './CommandPalette';
