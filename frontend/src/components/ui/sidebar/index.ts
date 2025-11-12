// Re-export everything from the sidebar modules for backward compatibility
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
} from "../sidebar-context"

export {
  Sidebar,
  SidebarTrigger,
  SidebarRail,
} from "../sidebar-core"

export {
  SidebarInset,
  SidebarInput,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent,
} from "../sidebar-layout"

export {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
} from "../sidebar-group"

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
} from "../sidebar-menu"
