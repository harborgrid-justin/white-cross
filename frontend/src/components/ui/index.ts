/**
 * UI Components - shadcn/ui Exports
 *
 * This file follows shadcn/ui best practices by exporting from flat component files.
 * All shadcn/ui components are in this directory as individual .tsx files.
 *
 * RECOMMENDED: Import directly from specific component files
 * - import { Button } from '@/components/ui/button'
 * - import { Input } from '@/components/ui/input'
 * - import { Card } from '@/components/ui/card'
 *
 * This barrel export file is provided for convenience but direct imports are preferred.
 */

// ============================================================================
// SHADCN/UI COMPONENTS (Flat Structure - Following Best Practices)
// ============================================================================

// Accordion
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion'

// Alert & Alert Dialog
export { Alert, AlertTitle, AlertDescription } from './alert'
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from './alert-dialog'

// Aspect Ratio
export { AspectRatio } from './aspect-ratio'

// Avatar
export { Avatar, AvatarImage, AvatarFallback } from './avatar'

// Badge
export { Badge, badgeVariants } from './badge'

// Breadcrumb
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from './breadcrumb'

// Button
export { Button, buttonVariants } from './button'

// Calendar
export { Calendar } from './calendar'

// Card
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card'

// Carousel
export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from './carousel'

// Chart
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle
} from './chart'

// Checkbox
export { Checkbox } from './checkbox'

// Collapsible
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible'

// Command
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator
} from './command'

// Context Menu
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup
} from './context-menu'

// Dialog
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from './dialog'

// Drawer
export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription
} from './drawer'

// Dropdown Menu
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup
} from './dropdown-menu'

// Form
export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField
} from './form'

// Hover Card
export { HoverCard, HoverCardTrigger, HoverCardContent } from './hover-card'

// Input
export { Input } from './input'

// Input OTP
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from './input-otp'

// Label
export { Label } from './label'

// Menubar
export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut
} from './menubar'

// Navigation Menu
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
} from './navigation-menu'

// Pagination
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from './pagination'

// Popover
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from './popover'

// Progress
export { Progress } from './progress'

// Radio Group
export { RadioGroup, RadioGroupItem } from './radio-group'

// Resizable
export { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './resizable'

// Scroll Area
export { ScrollArea, ScrollBar } from './scroll-area'

// Select
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton
} from './select'

// Separator
export { Separator } from './separator'

// Sheet
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription
} from './sheet'

// Sidebar
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
} from './sidebar'

// Skeleton
export { Skeleton } from './skeleton'

// Slider
export { Slider } from './slider'

// Sonner (Toast)
export { Toaster } from './sonner'

// Switch
export { Switch } from './switch'

// Table
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
} from './table'

// Tabs
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

// Textarea
export { Textarea } from './textarea'

// Toggle
export { Toggle, toggleVariants } from './toggle'

// Toggle Group
export { ToggleGroup, ToggleGroupItem } from './toggle-group'

// Tooltip
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip'

// ============================================================================
// CUSTOM COMPONENTS (Non-shadcn/ui components in this directory)
// ============================================================================

// Button Group (Custom)
export { ButtonGroup } from './button-group'

// Empty State (Custom)
export { EmptyState } from './empty-state'

// Field (Custom)
export { Field } from './field'

// Input Group (Custom)
export { InputGroup } from './input-group'

// Item (Custom)
export { Item } from './item'

// Kbd (Custom)
export { Kbd } from './kbd'

// Modal (Custom - legacy, prefer Dialog)
export { Modal } from './modal'

// Search Input (Custom)
export { SearchInput } from './search-input'

// Spinner (Custom)
export { Spinner } from './spinner'

// ============================================================================
// USAGE NOTES:
// ============================================================================
// For optimal tree-shaking and smaller bundles, import directly from files:
//
// BEST:    import { Button } from '@/components/ui/button'
// OK:      import { Button } from '@/components/ui'
// AVOID:   import * as UI from '@/components/ui'
//
// Subdirectories (buttons/, inputs/, feedback/, etc.) contain legacy custom
// implementations and should be gradually migrated to use shadcn/ui components.
