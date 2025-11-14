/**
 * Sidebar Components - Re-export Module
 *
 * This file re-exports all sidebar components from the refactored modules.
 * The original 775-line sidebar.tsx has been split into maintainable modules:
 * - sidebar-context.tsx: State management, context, and provider
 * - sidebar-core.tsx: Main Sidebar, SidebarTrigger, and SidebarRail
 * - sidebar-layout.tsx: Layout components (Inset, Header, Footer, Content, etc.)
 * - sidebar-group.tsx: Grouping components
 * - sidebar-menu.tsx: Menu-related components
 *
 * This file maintains backward compatibility with existing imports.
 */

export {
  SidebarContext,
  SidebarProvider,
  useSidebar,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_MOBILE,
  SIDEBAR_WIDTH_ICON,
  SIDEBAR_KEYBOARD_SHORTCUT,
  type SidebarContextProps,
} from "./sidebar-context"

export {
  Sidebar,
  SidebarTrigger,
  SidebarRail,
} from "./sidebar-core"

export {
  SidebarInset,
  SidebarInput,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent,
} from "./sidebar-layout"

export {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
} from "./sidebar-group"

export {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  sidebarMenuButtonVariants,
} from "./sidebar-menu"
