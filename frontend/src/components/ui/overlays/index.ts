/**
 * Overlay Components
 * 
 * Modal dialogs, tooltips, and other overlay components.
 */

// Base Modal Components
export { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  ModalTitle,
  type ModalProps,
  type ModalContentProps,
  type ModalHeaderProps,
  type ModalBodyProps,
  type ModalFooterProps,
  type ModalTitleProps
} from './Modal';

// Additional overlay components
export { Tooltip, type TooltipProps, type TooltipPosition } from './Tooltip';
export { Popover, type PopoverProps, type PopoverPosition } from './Popover';
export {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  type DrawerProps,
  type DrawerHeaderProps,
  type DrawerBodyProps,
  type DrawerFooterProps,
  type DrawerTitleProps,
  type DrawerPosition,
  type DrawerSize
} from './Drawer';
export {
  Sheet,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  type SheetProps,
  type SheetHeaderProps,
  type SheetBodyProps,
  type SheetFooterProps,
  type SheetTitleProps,
  type SheetDescriptionProps,
  type SheetPosition,
  type SheetSize
} from './Sheet';
