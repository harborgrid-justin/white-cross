# Component Catalog - Detailed Reference

Complete reference for all 40+ components in the Next.js Page Builder component library.

---

## Layout Components (5)

### Container

**ID**: `layout-container`
**Render Mode**: Server
**Description**: Responsive container with max-width constraints and padding

**Properties**:
- `maxWidth`: sm | md | lg | xl | 2xl | full (default: lg) - Responsive
- `padding`: Spacing object (default: 1rem) - Responsive
- `centered`: Boolean (default: true) - Center horizontally
- `fluid`: Boolean (default: false) - Full width without max-width

**Variants**: default, bordered, elevated

**Use Cases**: Page sections, content wrappers, layout containers

---

### Grid

**ID**: `layout-grid`
**Render Mode**: Server
**Description**: CSS Grid layout with flexible column and row configuration

**Properties**:
- `columns`: Number (1-12, default: 3) - Responsive
- `rows`: Number (optional) - Responsive
- `gap`: String (default: 1rem) - Responsive
- `columnGap`: String (optional) - Responsive
- `rowGap`: String (optional) - Responsive
- `autoFlow`: row | column | dense | row-dense | column-dense
- `autoFit`: Boolean - Auto-fit columns
- `autoFill`: Boolean - Auto-fill columns
- `minColumnWidth`: String (default: 200px) - For auto-fit/fill

**Use Cases**: Card grids, image galleries, dashboard layouts, product grids

---

### Flex

**ID**: `layout-flex`
**Render Mode**: Server
**Description**: Flexbox layout with full control over flex properties

**Properties**:
- `direction`: row | column | row-reverse | column-reverse (default: row) - Responsive
- `wrap`: nowrap | wrap | wrap-reverse (default: nowrap) - Responsive
- `alignItems`: start | center | end | stretch | baseline (default: start) - Responsive
- `justifyContent`: start | center | end | between | around | evenly (default: start) - Responsive
- `gap`: String (default: 0.5rem) - Responsive

**Use Cases**: Navigation bars, toolbars, button groups, vertical/horizontal layouts

---

### Stack

**ID**: `layout-stack`
**Render Mode**: Server
**Description**: Simple stacking with consistent spacing

**Properties**:
- `orientation`: vertical | horizontal (default: vertical) - Responsive
- `spacing`: String (default: 1rem) - Responsive
- `align`: start | center | end | stretch (default: start) - Responsive
- `divider`: Boolean (default: false) - Show dividers

**Use Cases**: Form fields, list items, content sections, vertical menus

---

### Section

**ID**: `layout-section`
**Render Mode**: Server
**Description**: Semantic section element with padding and background

**Properties**:
- `padding`: Spacing object (default: {top: 2rem, bottom: 2rem}) - Responsive
- `background`: Color string (default: transparent)
- `fullWidth`: Boolean (default: true)

**Use Cases**: Page sections, hero areas, feature blocks

---

## Navigation Components (5)

### Navbar

**ID**: `nav-navbar`
**Render Mode**: Client
**Description**: Top navigation bar with logo, links, and mobile menu

**Properties**:
- `logo`: Object {type, content} - Logo configuration
- `logoUrl`: String (default: /) - Logo link
- `links`: Array - Navigation links
- `actions`: Array - Action buttons
- `sticky`: Boolean (default: true) - Stick to top
- `transparent`: Boolean (default: false) - Transparent background
- `blur`: Boolean (default: true) - Blur when sticky
- `mobileBreakpoint`: sm | md | lg (default: md)

**Events**: onLinkClick, onLogoClick

**Variants**: default, bordered, floating

**Use Cases**: Site header, main navigation, app navigation

---

### Sidebar

**ID**: `nav-sidebar`
**Render Mode**: Client
**Description**: Side navigation with collapsible sections

**Properties**:
- `items`: Array - Navigation items with icons
- `position`: left | right (default: left)
- `collapsible`: Boolean (default: true)
- `defaultCollapsed`: Boolean (default: false)
- `width`: String (default: 16rem)
- `collapsedWidth`: String (default: 4rem)
- `showHeader`: Boolean (default: true)
- `headerContent`: String (default: Menu)

**Events**: onItemClick, onToggle

**Variants**: default, bordered, floating

**Use Cases**: Dashboard navigation, admin panels, app navigation

---

### Breadcrumbs

**ID**: `nav-breadcrumbs`
**Render Mode**: Server
**Description**: Navigation breadcrumb trail

**Properties**:
- `items`: Array - Breadcrumb items {label, href}
- `separator`: chevron | slash | dot | arrow (default: chevron)
- `showHome`: Boolean (default: true) - Home icon
- `maxItems`: Number (optional) - Collapse middle items

**Data Binding**: items (state, props, url, computed)

**Use Cases**: Page hierarchy, navigation trail, location indicator

---

### Tabs

**ID**: `nav-tabs`
**Render Mode**: Client
**Description**: Tabbed interface for content organization

**Properties**:
- `tabs`: Array - Tab configuration {id, label, icon}
- `defaultTab`: String (default: tab1)
- `orientation`: horizontal | vertical (default: horizontal) - Responsive
- `variant`: default | pills | underline | bordered (default: default)
- `keepMounted`: Boolean (default: false) - Keep inactive tabs in DOM
- `lazy`: Boolean (default: true) - Lazy load content

**Events**: onTabChange

**Variants**: sm, md, lg sizes

**Use Cases**: Settings pages, content organization, multi-step forms

---

### Pagination

**ID**: `nav-pagination`
**Render Mode**: Client
**Description**: Pagination controls for navigating pages

**Properties**:
- `totalPages`: Number (required) - Data binding supported
- `currentPage`: Number (default: 1) - Data binding supported
- `showFirstLast`: Boolean (default: true)
- `showPrevNext`: Boolean (default: true)
- `siblingCount`: Number (0-3, default: 1)

**Events**: onPageChange

**Variants**: default, outlined, text

**Use Cases**: Table pagination, search results, blog posts

---

## Form Components (7)

### Input

**ID**: `form-input`
**Render Mode**: Client
**Description**: Text input with validation

**Properties**:
- `name`: String (required)
- `type`: text | email | password | number | tel | url | search
- `label`: String
- `placeholder`: String
- `defaultValue`: String - Data binding supported
- `required`: Boolean
- `disabled`: Boolean
- `readonly`: Boolean
- `minLength`: Number
- `maxLength`: Number
- `pattern`: String (regex)
- `helperText`: String
- `errorMessage`: String - Data binding supported

**Events**: onChange, onBlur, onFocus

**Variants**: default, filled, outlined (sm, md, lg sizes)

**Use Cases**: Contact forms, login forms, search inputs

---

### Select

**ID**: `form-select`
**Render Mode**: Client
**Description**: Dropdown select with single/multi-select

**Properties**:
- `name`: String (required)
- `label`: String
- `placeholder`: String
- `options`: Array {value, label} - Data binding supported
- `multiple`: Boolean (default: false)
- `searchable`: Boolean (default: false)
- `clearable`: Boolean (default: false)
- `required`: Boolean
- `disabled`: Boolean

**Events**: onChange

**Data Binding**: value (state, props, context), options (state, props, api, computed)

**Variants**: default, filled, outlined

**Use Cases**: Country selector, category picker, filters

---

### Checkbox

**ID**: `form-checkbox`
**Render Mode**: Client
**Description**: Checkbox input for boolean selections

**Properties**:
- `name`: String (required)
- `label`: String
- `defaultChecked`: Boolean
- `required`: Boolean
- `disabled`: Boolean
- `indeterminate`: Boolean

**Events**: onChange

**Data Binding**: checked (state, props, context)

**Variants**: sm, md, lg sizes

**Use Cases**: Terms agreement, settings toggles, item selection

---

### RadioGroup

**ID**: `form-radio-group`
**Render Mode**: Client
**Description**: Radio button group for single selection

**Properties**:
- `name`: String (required)
- `label`: String
- `options`: Array {value, label} - Data binding supported
- `orientation`: horizontal | vertical (default: vertical)
- `required`: Boolean
- `disabled`: Boolean

**Events**: onChange

**Data Binding**: value (state, props, context)

**Use Cases**: Plan selection, preference settings, quiz questions

---

### DatePicker

**ID**: `form-datepicker`
**Render Mode**: Client
**Description**: Date and time picker with calendar

**Properties**:
- `name`: String (required)
- `label`: String
- `placeholder`: String
- `mode`: single | range | multiple (default: single)
- `includeTime`: Boolean (default: false)
- `format`: String (default: MM/dd/yyyy)
- `minDate`: Date
- `maxDate`: Date
- `required`: Boolean
- `disabled`: Boolean

**Events**: onChange

**Data Binding**: value (state, props, context)

**Use Cases**: Event booking, date filters, scheduling

---

### FileUpload

**ID**: `form-fileupload`
**Render Mode**: Client
**Description**: File upload with drag and drop

**Properties**:
- `name`: String (required)
- `label`: String
- `accept`: String (.jpg,.png,.pdf)
- `multiple`: Boolean (default: false)
- `maxSize`: Number in MB (default: 10)
- `maxFiles`: Number (default: 1)
- `showPreview`: Boolean (default: true)
- `uploadUrl`: String
- `required`: Boolean
- `disabled`: Boolean

**Events**: onFileSelect, onUploadComplete, onUploadError

**Use Cases**: Document upload, image upload, attachment handling

---

### Textarea

**ID**: `form-textarea`
**Render Mode**: Client
**Description**: Multi-line text input

**Properties**:
- `name`: String (required)
- `label`: String
- `placeholder`: String
- `rows`: Number (2-20, default: 4)
- `autoResize`: Boolean (default: false)
- `maxLength`: Number
- `showCount`: Boolean (default: false)
- `required`: Boolean
- `disabled`: Boolean

**Events**: onChange

**Data Binding**: value (state, props, context)

**Use Cases**: Comments, messages, descriptions, feedback

---

## Data Display Components (6)

### Table

**ID**: `data-table`
**Render Mode**: Client
**Description**: Data table with sorting, filtering, pagination

**Properties**:
- `columns`: Array {key, label, sortable} (required)
- `data`: Array - Data binding supported
- `sortable`: Boolean (default: true)
- `filterable`: Boolean (default: false)
- `searchable`: Boolean (default: false)
- `paginated`: Boolean (default: true)
- `pageSize`: Number (5-100, default: 10)
- `selectable`: Boolean (default: false)
- `multiSelect`: Boolean (default: false)
- `striped`: Boolean (default: false)
- `hoverable`: Boolean (default: true)
- `bordered`: Boolean (default: false)
- `compact`: Boolean (default: false)

**Events**: onRowClick, onSort, onSelect, onPageChange

**Data Binding**: data (state, props, api, computed)

**Variants**: sm, md, lg sizes

**Use Cases**: User lists, data grids, admin tables, reports

---

### List

**ID**: `data-list`
**Render Mode**: Server
**Description**: Versatile list with various layouts

**Properties**:
- `items`: Array {id, label} - Data binding supported
- `variant`: default | ordered | unordered | description
- `divider`: Boolean (default: false)
- `spacing`: none | sm | md | lg (default: md)
- `clickable`: Boolean (default: false)
- `showIcon`: Boolean (default: false)

**Events**: onItemClick

**Data Binding**: items (state, props, api, computed)

**Use Cases**: Feature lists, menu items, content lists

---

### Card

**ID**: `data-card`
**Render Mode**: Server
**Description**: Card with header, content, footer

**Properties**:
- `title`: String
- `description`: String
- `image`: String (URL)
- `imagePosition`: top | bottom | left | right
- `hoverable`: Boolean (default: false)
- `clickable`: Boolean (default: false)

**Events**: onClick

**Accepts Children**: header, content, footer components

**Variants**: default, outlined, elevated

**Use Cases**: Product cards, blog posts, user profiles, dashboards

---

### Badge

**ID**: `data-badge`
**Render Mode**: Server
**Description**: Small badge or label for status

**Properties**:
- `content`: String - Data binding supported
- `variant`: default | primary | secondary | success | warning | danger | info
- `size`: sm | md | lg (default: md)
- `shape`: rounded | square | pill
- `icon`: String (icon name)
- `iconPosition`: left | right
- `removable`: Boolean (default: false)

**Events**: onClick, onRemove

**Use Cases**: Status indicators, tags, counts, labels

---

### Avatar

**ID**: `data-avatar`
**Render Mode**: Server
**Description**: User avatar with image or initials

**Properties**:
- `src`: String (image URL) - Data binding supported
- `alt`: String
- `fallback`: String (initials, default: AB)
- `size`: xs | sm | md | lg | xl (default: md)
- `shape`: circle | square | rounded (default: circle)
- `showBadge`: Boolean (default: false)
- `badgeStatus`: online | offline | away | busy

**Use Cases**: User profiles, comment sections, team members

---

### Alert

**ID**: `data-alert`
**Render Mode**: Server
**Description**: Alert message with severity levels

**Properties**:
- `title`: String
- `message`: String - Data binding supported
- `variant`: info | success | warning | error (default: info)
- `showIcon`: Boolean (default: true)
- `dismissible`: Boolean (default: false)

**Events**: onClose

**Variants**: default, bordered, filled

**Use Cases**: Notifications, error messages, success confirmations

---

## Next.js-Specific Components (7)

### NextImage

**ID**: `nextjs-image`
**Render Mode**: Server
**Description**: Optimized image using next/image

**Properties**:
- `src`: String (required) - Data binding supported
- `alt`: String (required)
- `width`: Number (default: 800)
- `height`: Number (default: 600)
- `fill`: Boolean (default: false) - Fill container
- `objectFit`: contain | cover | fill | none | scale-down (default: cover)
- `priority`: Boolean (default: false) - Preload
- `quality`: Number (1-100, default: 75)
- `loading`: lazy | eager (default: lazy)
- `placeholder`: blur | empty (default: blur)
- `rounded`: none | sm | md | lg | full

**Use Cases**: Hero images, product images, thumbnails, galleries

---

### NextLink

**ID**: `nextjs-link`
**Render Mode**: Client
**Description**: Client-side navigation link

**Properties**:
- `href`: String (required) - Data binding supported
- `children`: String (link text)
- `prefetch`: Boolean (default: true)
- `replace`: Boolean (default: false) - Replace history
- `scroll`: Boolean (default: true) - Scroll to top
- `target`: _self | _blank | _parent | _top
- `underline`: none | hover | always (default: hover)

**Events**: onClick

**Variants**: default, primary, secondary

**Use Cases**: Navigation links, CTAs, internal routing

---

### Loading

**ID**: `nextjs-loading`
**Render Mode**: Client
**Description**: Loading state component

**Properties**:
- `variant`: spinner | dots | bars | pulse | skeleton (default: spinner)
- `size`: sm | md | lg | xl (default: md)
- `message`: String (optional)
- `fullscreen`: Boolean (default: false)
- `overlay`: Boolean (default: false)

**Use Cases**: Page loading, data fetching, async operations

---

### ErrorBoundary

**ID**: `nextjs-error-boundary`
**Render Mode**: Client
**Description**: Error boundary with fallback UI

**Properties**:
- `fallbackTitle`: String (default: Something went wrong)
- `fallbackMessage`: String
- `showResetButton`: Boolean (default: true)
- `resetButtonText`: String (default: Try again)
- `logErrors`: Boolean (default: true)

**Events**: onError, onReset

**Accepts Children**: Yes

**Use Cases**: Error handling, component isolation, graceful failures

---

### SuspenseBoundary

**ID**: `nextjs-suspense`
**Render Mode**: Server
**Description**: Suspense boundary for streaming

**Properties**:
- `fallbackType`: spinner | skeleton | custom (default: spinner)
- `fallbackMessage`: String (default: Loading...)

**Accepts Children**: Yes

**Use Cases**: Streaming SSR, lazy loading, code splitting

---

### ServerComponent

**ID**: `nextjs-server-component`
**Render Mode**: Server
**Description**: Wrapper for Server Component content

**Properties**:
- `fetchData`: Boolean (default: false)
- `dataSource`: String (API endpoint) - Data binding supported
- `cache`: default | force-cache | no-store | no-cache
- `revalidate`: Number (seconds, default: 0) - ISR interval

**Data Binding**: data (api)

**Accepts Children**: Yes

**Use Cases**: Data fetching, SEO content, static generation

---

### ClientComponent

**ID**: `nextjs-client-component`
**Render Mode**: Client
**Description**: Wrapper for Client Component content

**Properties**:
- `interactive`: Boolean (default: true)
- `useHooks`: Boolean (default: false)

**Accepts Children**: Yes

**Use Cases**: Interactive widgets, forms, real-time features

---

## Property Groups

Components organize properties into logical groups:

- **basic**: Core properties (name, label, value)
- **content**: Content and data properties
- **layout**: Layout and positioning
- **spacing**: Margin, padding, gap
- **appearance**: Visual styling and variants
- **behavior**: Interaction and functionality
- **validation**: Input validation rules
- **optimization**: Performance settings
- **data**: Data binding and sources

## Responsive System

Many properties support responsive values:

```typescript
{
  property: {
    mobile: 'value1',
    tablet: 'value2',
    desktop: 'value3',
  }
}
```

Breakpoints:
- **mobile**: < 768px
- **tablet**: 768px - 1024px
- **desktop**: 1024px - 1280px
- **wide**: > 1280px

## Accessibility Features

All components include:

- ✅ ARIA labels and attributes
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader compatibility
- ✅ Semantic HTML
- ✅ Color contrast compliance

## Component Compatibility

### Server Components
Safe to use in server-side rendering:
- All Layout components
- Navigation: Breadcrumbs
- Data Display: List, Card, Badge, Avatar, Alert
- Next.js: NextImage, SuspenseBoundary, ServerComponent

### Client Components
Require client-side JavaScript:
- Navigation: Navbar, Sidebar, Tabs, Pagination
- All Form components
- Data Display: Table
- Next.js: NextLink, Loading, ErrorBoundary, ClientComponent
