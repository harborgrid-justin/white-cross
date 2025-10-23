# Contact Management UI - Visual Description

## ContactsDashboard Component

### Layout
The dashboard displays contact statistics in a clean, card-based layout.

```
┌─────────────────────────────────────────────────────────────┐
│  Contacts Dashboard                                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│
│  │ Total Contacts  │  │    Guardian     │  │    Staff     ││
│  │                 │  │                 │  │              ││
│  │      145        │  │       89        │  │      32      ││
│  │  [User Icon]    │  │  [Person Icon]  │  │ [Person Icon]││
│  └─────────────────┘  └─────────────────┘  └──────────────┘│
│                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│
│  │    Vendor       │  │    Provider     │  │    Other     ││
│  │                 │  │                 │  │              ││
│  │       15        │  │        7        │  │       2      ││
│  │  [Person Icon]  │  │  [Person Icon]  │  │ [Person Icon]││
│  └─────────────────┘  └─────────────────┘  └──────────────┘│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Visual Features
- **Header**: "Contacts Dashboard" in large, bold text (text-2xl font-bold)
- **Cards**: Grid layout (1 column on mobile, 2 on tablet, 3 on desktop)
- **Total Contacts Card**: 
  - Blue gradient background (from-blue-50 to-blue-100)
  - Blue border and text
  - Icon in circular badge
- **Type Cards**: 
  - Green gradient background (from-green-50 to-green-100)
  - Green border and text
  - Capitalized type name
  - Large number display
  - Icon in circular badge
- **Loading State**: Centered spinner
- **Error State**: Red-bordered alert box with error message

---

## ContactsList Component

### Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│  Contacts List                    [Create Contact] [Refresh]        │
├─────────────────────────────────────────────────────────────────────┤
│  Status: [All ▼]    Type: [All Types ▼]                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ John Doe                          [Guardian] [Active]           ││
│  │ Sunshine Pediatric Clinic                                       ││
│  │ ✉ john.doe@email.com  ☎ (555) 123-4567                        ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ Jane Smith                        [Staff]                       ││
│  │ White Cross School                                              ││
│  │ ✉ jane.smith@school.edu  ☎ (555) 987-6543                     ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ ABC Medical Supplies              [Vendor]                      ││
│  │                                                                  ││
│  │ ✉ orders@abcmedical.com  ☎ (555) 456-7890                     ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                       │
│  Showing 20 of 145 contacts       [Previous] Page 1 of 8 [Next]    │
└─────────────────────────────────────────────────────────────────────┘
```

### Visual Features

**Header Section**:
- Title: "Contacts List" (text-2xl font-bold)
- Two action buttons aligned to the right:
  - **Create Contact** button: Green background (bg-green-600)
  - **Refresh** button: Blue background (bg-blue-600)
  - Both have hover effects and rounded corners

**Filter Section**:
- Two dropdown filters side by side:
  - **Status**: All / Active / Inactive
  - **Type**: All Types / Guardian / Staff / Vendor / Provider / Other
- Both have borders and focus rings for accessibility

**Contact Cards**:
- White background with gray border
- Hover effect: Shadow appears on mouse over
- Each card shows:
  - **Name** (text-lg font-semibold)
  - **Type Badge**: Colored pill-shaped badge
    - Guardian: Blue
    - Staff: Green
    - Vendor: Purple
    - Provider: Orange
    - Other: Gray
  - **Inactive Badge**: Red pill if inactive
  - **Organization**: Gray text below name
  - **Contact Info**: Small icons with email and phone
    - Mail icon (✉) before email
    - Phone icon (☎) before phone number

**Pagination**:
- Bottom section shows:
  - Count: "Showing X of Y contacts"
  - Navigation: Previous button | Page indicator | Next button
  - Disabled state when at first/last page

**Empty State**:
- Large icon (users group)
- Message: "No contacts found"
- Subtitle: "Try adjusting your filters or create a new contact"

**Loading State**:
- Centered spinner

**Error State**:
- Red-bordered alert box with error message

---

## CreateContactDialog Component

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Create New Contact                               [X]        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  First Name *          │  Last Name *                        │
│  [John            ]    │  [Doe              ]                │
│                                                               │
│  Contact Type *                                              │
│  [Guardian ▼]                                                │
│                                                               │
│  Email                 │  Phone                              │
│  [john@email.com ]     │  [(555) 123-4567]                  │
│                                                               │
│  Organization          │  Title                              │
│  [ABC Company    ]     │  [Manager      ]                   │
│                                                               │
│  Address                                                     │
│  [123 Main Street                              ]             │
│                                                               │
│  City                  │  State  │  ZIP Code                │
│  [Springfield    ]     │  [CA]   │  [12345    ]             │
│                                                               │
│  Notes                                                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │                                                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                      [Cancel] [Create Contact]│
└─────────────────────────────────────────────────────────────┘
```

### Visual Features

**Modal Overlay**:
- Semi-transparent black backdrop (bg-black bg-opacity-50)
- Centered modal dialog
- White background with rounded corners
- Shadow effect
- Maximum width constrained (max-w-2xl)
- Scrollable content if too tall

**Header**:
- Title: "Create New Contact" (text-xl font-bold)
- Close button (X) aligned to the right
- Gray separator line below

**Form Fields**:
- Two-column layout where appropriate (responsive)
- Required fields marked with red asterisk (*)
- Labels: Small, medium weight, gray color
- Input fields: 
  - White background
  - Gray border
  - Blue focus ring
  - Rounded corners
  - Full width within column

**Field Groups**:
1. **Basic Info**: First Name, Last Name (side by side)
2. **Type**: Contact Type dropdown (full width)
3. **Contact Info**: Email, Phone (side by side)
4. **Organization**: Organization, Title (side by side)
5. **Address**: Street (full width)
6. **Location**: City, State, ZIP (three columns)
7. **Notes**: Multi-line textarea (full width, 3 rows)

**Contact Type Options**:
- Guardian
- Staff
- Vendor
- Provider
- Other

**Footer**:
- Two buttons aligned to the right:
  - **Cancel**: Gray border, transparent background
  - **Create Contact**: Blue background (bg-blue-600)
  - Both disabled during loading
  - "Creating..." text shown during mutation

**Interaction**:
- Click backdrop to close
- Click X button to close
- Form validation on submit
- Toast notification on success/error
- Auto-closes on successful creation

---

## Color Scheme

### Contact Type Colors
- **Guardian**: Blue (#3B82F6)
- **Staff**: Green (#10B981)
- **Vendor**: Purple (#8B5CF6)
- **Provider**: Orange (#F59E0B)
- **Other**: Gray (#6B7280)

### Status Colors
- **Active**: Default (no special color)
- **Inactive**: Red badge (#EF4444)

### Button Colors
- **Primary Action**: Blue (#2563EB)
- **Secondary Action**: Green (#059669)
- **Danger**: Red (#DC2626)
- **Neutral**: Gray (#6B7280)

### State Colors
- **Loading**: Blue spinner
- **Success**: Green toast
- **Error**: Red alert/toast
- **Info**: Blue alert

---

## Responsive Design

### Mobile (< 768px)
- Statistics cards: 1 column
- Contact cards: Full width
- Form fields: Stack vertically
- Filters: Stack vertically

### Tablet (768px - 1024px)
- Statistics cards: 2 columns
- Contact cards: Full width
- Form fields: 2 columns where appropriate

### Desktop (> 1024px)
- Statistics cards: 3 columns
- Contact cards: Full width with padding
- Form fields: 2 columns optimized layout
- Modal: Centered with max-width

---

## Accessibility Features

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators (blue rings)
- Screen reader friendly
- Color contrast meets WCAG AA standards
- Error messages associated with fields
- Loading states announced

---

## Animations and Transitions

- Button hover: Slight color darkening
- Card hover: Shadow appears
- Modal: Fade in backdrop
- Transitions: 200ms ease for smooth UX
- Loading spinner: Rotation animation

---

## Icons

The UI uses SVG icons for:
- User/People icons in statistics cards
- Email icon (envelope)
- Phone icon
- Close button (X)
- Refresh icon
- Navigation arrows

Icons are from the built-in SVG library or Lucide React.
