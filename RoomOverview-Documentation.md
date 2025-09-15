# RoomOverview Component Documentation

A comprehensive, self-contained React component for managing children's attendance, status tracking, and daily activities in childcare/educational settings.

## 📋 Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Component Props](#component-props)
- [Data Structures](#data-structures)
- [Features](#features)
- [Usage Examples](#usage-examples)
- [Styling](#styling)
- [State Management](#state-management)
- [Event Handlers](#event-handlers)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The `RoomOverview` component provides a complete interface for managing children in a classroom or childcare setting. It includes:

- **Child Management**: Display children with avatars, status indicators, and selection capabilities
- **Status Tracking**: Check-in/out, leave management (sick, absent, holiday), sleep tracking, diaper/toilet records
- **Interactive UI**: Dynamic tabs, modal dialogs, side menus, and status actions
- **Real-time Updates**: Live status updates with toast notifications
- **Responsive Design**: Works on desktop and tablet interfaces

## 🚀 Installation

### Prerequisites

```bash
npm install lucide-react react react-dom
```

### Required Dependencies

- **React**: 18.0.0 or higher
- **lucide-react**: For icons (latest version)
- **Tailwind CSS**: For styling (or custom CSS)

### Installation Steps

1. Copy the `RoomOverview.tsx` file to your project's components directory
2. Ensure you have the required dependencies installed
3. Import and use the component in your project

## ⚡ Quick Start

### Basic Usage

```tsx
import React from 'react';
import { RoomOverview } from './components/RoomOverview';

function App() {
  return (
    <div className="p-6">
      <h1>My Childcare App</h1>
      <RoomOverview />
    </div>
  );
}

export default App;
```

### With Custom Data

```tsx
import React, { useState } from 'react';
import { RoomOverview } from './components/RoomOverview';

function App() {
  const [children, setChildren] = useState([
    {
      id: 1,
      name: "Alice",
      avatar: "/avatars/alice.jpg",
      status: "checked-in",
      checkedInTime: "8:30am",
    },
    {
      id: 2,
      name: "Bob",
      initials: "BJ",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      status: "expected",
      expectedTime: "9:00am",
    }
  ]);

  const handleToast = (message, type) => {
    // Your toast notification system
    console.log(`${type}: ${message}`);
  };

  return (
    <RoomOverview 
      children={children}
      onChildrenUpdate={setChildren}
      onShowToast={handleToast}
      className="max-w-6xl mx-auto"
    />
  );
}
```

## 🔧 Component Props

### RoomOverviewProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `Child[]` | `defaultChildren` | Array of child objects to display |
| `onChildrenUpdate` | `(children: Child[]) => void` | `undefined` | Callback when children data changes |
| `onShowToast` | `(message: string, type?: ToastType) => void` | `undefined` | Callback for toast notifications |
| `className` | `string` | `""` | Additional CSS classes |

### Optional Integration

If you don't provide `onChildrenUpdate` or `onShowToast`, the component will:
- Use internal state management for children data
- Log toast messages to console

## 📊 Data Structures

### Child Interface

```typescript
interface Child {
  id: number;                    // Unique identifier
  name: string;                  // Child's name
  avatar?: string;               // URL to avatar image
  initials?: string;             // Fallback initials (e.g., "AB")
  bgColor?: string;              // Background color for initials (Tailwind class)
  textColor?: string;            // Text color for initials (Tailwind class)
  status: "checked-in" | "expected" | "checked-out";  // Current status
  checkedInTime?: string;        // Time when checked in (e.g., "8:30am")
  expectedTime?: string;         // Expected arrival time (e.g., "9:00am")
}
```

### Example Child Objects

```typescript
// Child with avatar
{
  id: 1,
  name: "Emma Wilson",
  avatar: "/images/emma.jpg",
  status: "checked-in",
  checkedInTime: "8:15am"
}

// Child with initials
{
  id: 2,
  name: "Alex Johnson",
  initials: "AJ",
  bgColor: "bg-green-100",
  textColor: "text-green-800",
  status: "expected",
  expectedTime: "9:30am"
}
```

### Status Records

The component automatically manages several types of records:

```typescript
// Leave records (sick, absent, holiday)
interface LeaveRecord {
  id: string;
  childId: number;
  type: string;                  // 'sick', 'absent', 'holiday'
  dateRange: string;             // "MM/DD/YYYY – MM/DD/YYYY"
  note: string;
  includesCurrentDate: boolean;
}

// Checkout records
interface CheckoutRecord {
  childId: number;
  checkoutTime: string;          // "3:30pm"
}

// Sleep records
interface SleepRecord {
  id: string;
  childId: number;
  sleepTime: string;             // "1:30pm"
  wakeTime?: string;             // "3:00pm"
  isAsleep: boolean;
  isChecked: boolean;
}

// Diaper/Toilet records
interface DiaperToiletRecord {
  id: string;
  childId: number;
  type: string;                  // 'wet', 'soiled', 'both'
  category: 'diaper' | 'toilet';
  time: string;                  // "2:15pm"
  note: string;
}
```

## ✨ Features

### 1. Child Display & Selection

- **Grid Layout**: Children displayed in responsive 4-column grid
- **Avatar Support**: Shows images or colored initials
- **Status Indicators**: Visual badges for different statuses
- **Multi-Selection**: Click to select individual children
- **Select All**: Checkbox to select/deselect all children
- **Visual Feedback**: Selected children highlighted with purple border

### 2. Dynamic Tabs

The component automatically creates tabs based on current data:

- **All**: Shows all children (default)
- **Expected**: Children not yet arrived
- **Checked-in**: Currently present children
- **Dynamic Tabs**: Auto-generated for active leave types and sleep status

### 3. Status Actions

#### Check-in/Check-out
- **Check-out**: Records departure time, marks children as checked out
- **Check-in**: Removes checkout status, returns children to active status
- **Smart Logic**: Button changes based on selection (mixed selections disabled)

#### Leave Management
- **Types**: Sick, Absent, Holiday
- **Date Ranges**: Custom date range selection
- **Notes**: Optional notes for each leave record
- **Current Date Detection**: Automatically detects if leave includes today

#### Sleep Tracking
- **Sleep Time**: Record when children go to sleep
- **Wake Time**: Record when children wake up
- **Status Indicators**: Visual sleep indicators on child cards

#### Diaper/Toilet Records
- **Categories**: Diaper or Toilet
- **Types**: Wet, Soiled, Both
- **Time Tracking**: Specific time recording
- **Notes**: Optional additional information

### 4. Interactive Elements

#### Side Menu
- Appears when children are selected
- **Actions Button**: Opens status menu
- **Message Button**: Ready for messaging integration

#### Status Menu
- **Organized Sections**: Leave and Actions categories
- **Visual Icons**: Each action has a colored icon
- **Disabled States**: Smart disabling of conflicting actions

#### Modal Dialogs
- **Leave Modal**: Date picker, notes, child selection display
- **Sleep Modal**: Time picker with validation
- **Diaper/Toilet Modal**: Category selection, type dropdown, time picker

### 5. Toast Notifications

Automatic success messages for all actions:
- "1 child checked out successfully"
- "3 children checked in successfully"  
- "Sick status added for 2 children"
- "Sleep status updated successfully"
- "Diaper record added successfully"

## 💻 Usage Examples

### Integration with Toast System

```tsx
import { toast } from 'react-hot-toast';

<RoomOverview 
  onShowToast={(message, type = 'success') => {
    if (type === 'success') toast.success(message);
    if (type === 'error') toast.error(message);
    if (type === 'info') toast.info(message);
    if (type === 'warning') toast.warning(message);
  }}
/>
```

### With State Persistence

```tsx
import { useState, useEffect } from 'react';

function App() {
  const [children, setChildren] = useState([]);

  // Load from API or localStorage
  useEffect(() => {
    const savedChildren = localStorage.getItem('children');
    if (savedChildren) {
      setChildren(JSON.parse(savedChildren));
    }
  }, []);

  // Save changes
  const handleChildrenUpdate = (updatedChildren) => {
    setChildren(updatedChildren);
    localStorage.setItem('children', JSON.stringify(updatedChildren));
    
    // Or save to API
    // api.saveChildren(updatedChildren);
  };

  return (
    <RoomOverview 
      children={children}
      onChildrenUpdate={handleChildrenUpdate}
    />
  );
}
```

### Custom Styling

```tsx
<RoomOverview 
  className="
    max-w-7xl 
    mx-auto 
    p-6 
    bg-gray-50 
    rounded-xl 
    shadow-lg
  "
/>
```

## 🎨 Styling

### Default Color Scheme

The component uses a purple-based theme:
- **Primary**: `#8c4ce5` (purple-500)
- **Secondary**: `#6b46c1` (purple-600)
- **Success**: Green tones
- **Warning**: Yellow/orange tones
- **Error**: Red tones

### Customizing Colors

You can override colors by modifying the Tailwind classes in the component:

```typescript
// Find and replace color classes
'bg-purple-600' → 'bg-blue-600'
'text-purple-500' → 'text-blue-500'
'border-purple-200' → 'border-blue-200'
```

### Required CSS Classes

The component relies on Tailwind CSS. If you're not using Tailwind, you'll need to provide equivalent CSS:

```css
/* Essential classes used by the component */
.grid { display: grid; }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-4 { gap: 1rem; }
.p-4 { padding: 1rem; }
.rounded-xl { border-radius: 0.75rem; }
.bg-white { background-color: white; }
.border { border-width: 1px; }
.border-gray-200 { border-color: #e5e7eb; }
.text-sm { font-size: 0.875rem; }
.font-medium { font-weight: 500; }
/* ... and many more */
```

## 🔄 State Management

### Internal State

The component manages several pieces of state internally:

```typescript
// Selection state
const [selectedChildren, setSelectedChildren] = useState<number[]>([]);
const [selectAllChildren, setSelectAllChildren] = useState(false);

// UI state
const [showSideMenu, setShowSideMenu] = useState(false);
const [showStatusMenu, setShowStatusMenu] = useState(false);
const [activeTab, setActiveTab] = useState("all");

// Modal state
const [showLeaveModal, setShowLeaveModal] = useState(false);
const [showSleepModal, setShowSleepModal] = useState(false);
const [showDiaperToiletModal, setShowDiaperToiletModal] = useState(false);

// Data state
const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
const [checkoutRecords, setCheckoutRecords] = useState<CheckoutRecord[]>([]);
const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
const [diaperToiletRecords, setDiaperToiletRecords] = useState<DiaperToiletRecord[]>([]);
```

### External State Integration

You can integrate with external state management:

```tsx
// Redux
import { useSelector, useDispatch } from 'react-redux';

function MyComponent() {
  const children = useSelector(state => state.children);
  const dispatch = useDispatch();

  return (
    <RoomOverview 
      children={children}
      onChildrenUpdate={(children) => dispatch(updateChildren(children))}
    />
  );
}

// Context API
const { children, updateChildren } = useContext(ChildrenContext);

<RoomOverview 
  children={children}
  onChildrenUpdate={updateChildren}
/>
```

## 🎛️ Event Handlers

### Child Selection

```typescript
// Single child selection
const handleChildClick = (childId: number) => {
  // Toggles selection state
  // Updates side menu visibility
};

// Select all toggle
const handleSelectAllChildren = (checked: boolean) => {
  // Selects/deselects all visible children
  // Updates UI state
};
```

### Status Actions

```typescript
// Generic status handler
const handleStatusClick = (statusId: string) => {
  // Routes to appropriate action based on statusId
  // Handles: 'checkout', 'checkin', 'sick', 'absent', 'holiday', 'sleep', 'diaper'
};

// Modal save handlers
const handleLeaveModalSave = (dateRange: string, note: string) => {
  // Creates leave records for selected children
  // Shows success toast
  // Clears selection and closes modal
};
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Icons Not Displaying
**Problem**: Lucide React icons not showing
**Solution**: 
```bash
npm install lucide-react
```

#### 2. Styling Issues
**Problem**: Component looks unstyled
**Solution**: Ensure Tailwind CSS is installed and configured
```bash
npm install tailwindcss
```

#### 3. TypeScript Errors
**Problem**: Type errors with children prop
**Solution**: Ensure your data matches the Child interface:
```typescript
const children: Child[] = [
  {
    id: 1, // number, not string
    name: "John Doe", // required
    status: "checked-in", // must be exact string
    // other optional props
  }
];
```

#### 4. Modal Not Closing
**Problem**: Modals remain open after actions
**Solution**: Check that you're not preventing event propagation:
```typescript
// Don't do this
onClick={(e) => { e.stopPropagation(); handleClick(); }}

// Do this
onClick={handleClick}
```

### Performance Considerations

#### Large Numbers of Children
For 50+ children, consider:

```tsx
// Virtualization for large lists
import { FixedSizeGrid as Grid } from 'react-window';

// Pagination
const [currentPage, setCurrentPage] = useState(0);
const childrenPerPage = 20;
const paginatedChildren = children.slice(
  currentPage * childrenPerPage,
  (currentPage + 1) * childrenPerPage
);
```

#### Memory Management
The component stores all records in memory. For production:

```tsx
// Periodic cleanup of old records
useEffect(() => {
  const cleanup = setInterval(() => {
    // Remove records older than 30 days
    setLeaveRecords(prev => prev.filter(record => 
      isWithinDays(new Date(record.dateRange), 30)
    ));
  }, 24 * 60 * 60 * 1000); // Daily

  return () => clearInterval(cleanup);
}, []);
```

## 📱 Responsive Design

### Breakpoints

The component is designed for tablet and desktop use:
- **Minimum width**: 768px recommended
- **Grid layout**: Automatically adjusts on smaller screens
- **Touch targets**: All buttons are touch-friendly (44px minimum)

### Mobile Adaptations

For mobile use, consider:

```tsx
// Responsive grid columns
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
  {/* Children */}
</div>

// Stack tabs vertically on mobile
<nav className="flex flex-col md:flex-row items-start gap-2">
  {/* Tabs */}
</nav>
```

## 🔒 Security Considerations

### Data Validation

Always validate data before passing to the component:

```typescript
const validateChild = (child: any): child is Child => {
  return (
    typeof child.id === 'number' &&
    typeof child.name === 'string' &&
    ['checked-in', 'expected', 'checked-out'].includes(child.status)
  );
};

const validChildren = rawChildren.filter(validateChild);
```

### XSS Prevention

The component safely handles user input, but always sanitize:

```typescript
import DOMPurify from 'dompurify';

const sanitizeNote = (note: string) => DOMPurify.sanitize(note);
```

## 📈 Performance Optimization

### Memoization

For better performance with large datasets:

```tsx
import { memo, useMemo } from 'react';

const OptimizedRoomOverview = memo(RoomOverview);

// Memoize expensive calculations
const filteredChildren = useMemo(() => {
  return children.filter(child => /* filtering logic */);
}, [children, activeTab]);
```

### Debounced Updates

For real-time sync with backend:

```tsx
import { debounce } from 'lodash';

const debouncedUpdate = useMemo(
  () => debounce((children) => {
    api.updateChildren(children);
  }, 1000),
  []
);

<RoomOverview onChildrenUpdate={debouncedUpdate} />
```

## 🧪 Testing

### Unit Tests

Example test setup:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { RoomOverview } from './RoomOverview';

const mockChildren = [
  { id: 1, name: 'Test Child', status: 'checked-in' }
];

test('renders children correctly', () => {
  render(<RoomOverview children={mockChildren} />);
  expect(screen.getByText('Test Child')).toBeInTheDocument();
});

test('handles child selection', () => {
  const onUpdate = jest.fn();
  render(
    <RoomOverview 
      children={mockChildren} 
      onChildrenUpdate={onUpdate}
    />
  );
  
  fireEvent.click(screen.getByText('Test Child'));
  // Assert selection state
});
```

### Integration Tests

```tsx
test('complete checkout flow', async () => {
  const onToast = jest.fn();
  render(<RoomOverview onShowToast={onToast} />);
  
  // Select child
  fireEvent.click(screen.getByText('Test Child'));
  
  // Open status menu
  fireEvent.click(screen.getByRole('button', { name: /more/i }));
  
  // Click checkout
  fireEvent.click(screen.getByText('Check out'));
  
  // Verify toast
  expect(onToast).toHaveBeenCalledWith(
    '1 child checked out successfully',
    'success'
  );
});
```

## 📞 Support

### Common Questions

**Q: Can I use this with React Native?**
A: No, this component uses DOM-specific features. You'd need to adapt it for React Native.

**Q: How do I add custom status types?**
A: Modify the `statusSections` array in the component to add new status types.

**Q: Can I integrate with a backend API?**
A: Yes, use the `onChildrenUpdate` callback to sync changes with your API.

**Q: How do I customize the colors?**
A: Replace the Tailwind color classes throughout the component with your preferred colors.

### Getting Help

1. Check this documentation first
2. Look for similar issues in your project's issue tracker  
3. Create a minimal reproduction of the problem
4. Include your React version, browser, and error messages

---

## 📄 License

This component is provided as-is for use in your projects. Feel free to modify and customize as needed.

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**React Version**: 18.0.0+  
**Dependencies**: lucide-react, tailwindcss




