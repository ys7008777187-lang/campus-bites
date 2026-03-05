# Campus Bites — Store Dashboard Documentation

> A complete admin dashboard for Campus Bites food court store owners, built with **React 19 + Vite 7**.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Architecture](#architecture)
6. [Design System](#design-system)
7. [State Management](#state-management)
8. [Data Models](#data-models)
9. [Pages & Features](#pages--features)
10. [Components](#components)
11. [Routing](#routing)
12. [Responsive Behavior](#responsive-behavior)
13. [Build & Deployment](#build--deployment)
14. [Extending the App](#extending-the-app)

---

## Overview

Campus Bites Store Dashboard is a **single-page frontend application** that provides food court store owners with tools to:

- Monitor live incoming orders and accept/reject them
- Track order history and revenue
- Manage their menu (add items, toggle availability)
- View payments and UPI QR code
- Analyze performance through charts and trends
- Configure store settings, operating hours, and notifications

The app currently uses **mock data** — it is designed to be connected to a real backend API in the future.

---

## Tech Stack

| Technology         | Version  | Purpose                                  |
|--------------------|----------|------------------------------------------|
| React              | ^19.2.0  | UI library (functional components + hooks) |
| React DOM          | ^19.2.0  | DOM rendering                            |
| React Router DOM   | ^7.13.0  | Client-side routing (7 routes)           |
| React Icons        | ^5.5.0   | Icon library (Heroicons outline set)     |
| Vite               | ^7.3.1   | Build tool & dev server                  |
| ESLint             | ^9.39.1  | Code linting                             |
| Vanilla CSS        | —        | Styling (no CSS frameworks)              |

### No Additional Dependencies Required

The app intentionally avoids heavy libraries (no chart.js, no state management libraries). All charts are pure CSS, and state is managed via React's built-in `useReducer`.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
cd "c:\Users\Yash\OneDrive\Desktop\Campus bite Backend"
npm install
```

### Development Server

```bash
npm run dev
```

Opens at `http://localhost:5173` by default.

### Production Build

```bash
npm run build
```

Outputs to `./dist/` — can be served with any static file server.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## Project Structure

```
Campus bite Backend/
├── index.html                  # HTML entry — Outfit font, meta tags
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint configuration
├── public/
│   └── vite.svg                # Favicon
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Router & route definitions
│   ├── index.css               # Global design system (tokens, components, animations)
│   ├── data.js                 # Mock data (store config, menu, orders, payments, analytics)
│   ├── context/
│   │   └── DashboardContext.jsx  # React Context + useReducer state management
│   ├── components/
│   │   ├── DashboardLayout.jsx   # Layout wrapper (Sidebar + TopBar + Outlet)
│   │   ├── Sidebar.jsx           # Left navigation sidebar
│   │   ├── Sidebar.css
│   │   ├── TopBar.jsx            # Top header bar
│   │   └── TopBar.css
│   └── pages/
│       ├── DashboardPage.jsx     # Home — KPIs, live orders, revenue chart
│       ├── DashboardPage.css
│       ├── OrdersPage.jsx        # Live order management
│       ├── OrdersPage.css
│       ├── HistoryPage.jsx       # Past order records
│       ├── HistoryPage.css
│       ├── MenuPage.jsx          # Menu item management
│       ├── MenuPage.css
│       ├── PaymentsPage.jsx      # Revenue & payment tracking
│       ├── PaymentsPage.css
│       ├── AnalyticsPage.jsx     # Performance analytics & charts
│       ├── AnalyticsPage.css
│       ├── SettingsPage.jsx      # Store configuration
│       └── SettingsPage.css
└── dist/                         # Production build output (after npm run build)
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        App.jsx                              │
│                  (BrowserRouter + Routes)                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          DashboardProvider (Context)                   │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │           DashboardLayout                       │  │  │
│  │  │  ┌──────────┐  ┌────────────────────────────┐   │  │  │
│  │  │  │ Sidebar  │  │   TopBar                   │   │  │  │
│  │  │  │          │  ├────────────────────────────┤   │  │  │
│  │  │  │  - Nav   │  │   <Outlet />               │   │  │  │
│  │  │  │  - Toggle│  │   (Routed Page Component)  │   │  │  │
│  │  │  │          │  │                            │   │  │  │
│  │  │  └──────────┘  └────────────────────────────┘   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
data.js (mock data) → DashboardContext (useReducer) → Components (useContext)
                                 ↑
                        dispatch(action) ← User interactions
```

All state mutations flow through the reducer. Components read state via the `useDashboard()` custom hook and dispatch actions to update it.

---

## Design System

The design system is defined in `src/index.css` using CSS Custom Properties. It mirrors the Swiggy-inspired palette from the customer-facing Campus Bites app.

### Color Palette

| Token               | Value       | Usage                          |
|----------------------|-------------|--------------------------------|
| `--bg-primary`       | `#F5F5F5`   | Page background                |
| `--bg-card`          | `#FFFFFF`   | Card backgrounds               |
| `--bg-sidebar`       | `#1B1B2F`   | Sidebar dark background        |
| `--orange`           | `#FC8019`   | Primary brand color            |
| `--orange-dark`      | `#E06C00`   | Hover/active orange            |
| `--green`            | `#60B246`   | Success states                 |
| `--red`              | `#E23744`   | Danger/error states            |
| `--blue`             | `#2563EB`   | Info/preparing states          |
| `--purple`           | `#7C3AED`   | Analytics accent               |

### Typography

- **Font**: Outfit (Google Fonts) — rounded, modern typeface
- **Scale**: `--fs-xs` (0.7rem) → `--fs-3xl` (2rem)
- **Weights**: 300 (light) → 800 (extrabold)

### Component Classes

| Class          | Description                              |
|----------------|------------------------------------------|
| `.card`        | Rounded white card with shadow           |
| `.badge`       | Color-coded status pill                  |
| `.badge--green`| Green success badge                      |
| `.badge--red`  | Red error badge                          |
| `.badge--orange`| Orange warning badge                    |
| `.badge--blue` | Blue info badge                          |
| `.btn`         | Base button styles                       |
| `.btn--primary`| Orange gradient button                   |
| `.btn--success`| Green button                             |
| `.btn--danger` | Red button                               |
| `.btn--secondary`| White bordered button                  |
| `.toggle`      | iOS-style toggle switch                  |
| `.input`       | Form input with focus glow               |
| `.pill-tabs`   | Horizontal filter tabs                   |
| `.table`       | Data table with hover rows               |
| `.kpi-card`    | Stat card with icon, value, change       |
| `.veg-dot`     | Green/red veg/non-veg indicator          |
| `.empty-state` | Centered empty state with icon           |

### Animations

| Keyframe       | Usage                                    |
|----------------|------------------------------------------|
| `fadeIn`       | Page entrance                            |
| `slideUp`      | Card entrance (staggered)                |
| `scaleIn`      | Modal entrance                           |
| `float`        | Empty state icon bob                     |
| `pulse`        | Live order dot                           |
| `ringPulse`    | New order badge glow                     |
| `spin`         | Loading spinner                          |
| `shimmer`      | Skeleton loading                         |

### Layout Tokens

| Token                | Value    | Description              |
|----------------------|----------|--------------------------|
| `--sidebar-width`    | `260px`  | Full sidebar width       |
| `--sidebar-collapsed`| `72px`   | Icon-only sidebar        |
| `--topbar-height`    | `64px`   | Fixed top header height  |

---

## State Management

State is managed via `React.useReducer` inside `DashboardContext.jsx`.

### State Shape

```javascript
{
  orders: Order[],          // All orders (new, preparing, ready, completed, rejected)
  menuItems: MenuItem[],    // Store's menu items
  storeConfig: StoreConfig, // Store profile & settings
  notifications: Notification[] // Toast notifications
}
```

### Available Actions

| Action Type               | Payload                      | Effect                                              |
|---------------------------|------------------------------|------------------------------------------------------|
| `ACCEPT_ORDER`            | `orderId: string`            | Changes order status to `preparing`, sets ETA        |
| `REJECT_ORDER`            | `{ id, reason }`             | Changes order status to `rejected`                   |
| `MARK_READY`              | `orderId: string`            | Changes order status to `ready`                      |
| `COMPLETE_ORDER`          | `orderId: string`            | Changes order status to `completed`, sets timestamp  |
| `TOGGLE_ITEM_AVAILABILITY`| `itemId: string`             | Toggles `isAvailable` on a menu item                 |
| `UPDATE_ITEM`             | `{ id, changes }`            | Merges changes into a menu item                      |
| `ADD_ITEM`                | `MenuItem (without id)`      | Adds new item with auto-generated ID                 |
| `TOGGLE_STORE`            | _none_                       | Toggles `storeConfig.isOpen`                         |
| `UPDATE_STORE`            | `Partial<StoreConfig>`       | Merges updates into store config                     |
| `DISMISS_NOTIFICATION`    | `notificationId: number`     | Removes a notification                               |

### Usage

```jsx
import { useDashboard } from '../context/DashboardContext';

function MyComponent() {
  const { state, dispatch } = useDashboard();

  // Read state
  const openOrders = state.orders.filter(o => o.status === 'new');

  // Dispatch action
  dispatch({ type: 'ACCEPT_ORDER', payload: 'ORD-A1B2C' });
}
```

---

## Data Models

### StoreConfig

```javascript
{
  id: string,              // Store ID (matches customer app)
  courtId: string,         // Food court ID
  name: string,            // Store display name
  image: string,           // Emoji icon
  cuisine: string,         // Cuisine type
  description: string,     // Store description
  rating: number,          // Average rating (1-5)
  totalReviews: number,    // Total review count
  prepTime: string,        // Average prep time range
  isOpen: boolean,         // Whether store is accepting orders
  ownerName: string,       // Owner's display name
  ownerAvatar: string,     // Owner's emoji avatar
  phone: string,           // Contact phone
  upiId: string,           // UPI payment ID
  operatingHours: {        // Per-day schedule
    [day]: { open: string, close: string, isOpen: boolean }
  }
}
```

### MenuItem

```javascript
{
  id: string,              // Unique item ID
  name: string,            // Item name
  category: string,        // Category (Pizzas, Pasta, Sides, Beverages, Desserts)
  price: number,           // Price in ₹
  prepTime: number,        // Prep time in minutes
  isVeg: boolean,          // Vegetarian flag
  image: string,           // Emoji icon
  description: string,     // Short description
  isAvailable: boolean     // Whether item is currently available
}
```

### Order

```javascript
{
  id: string,              // Order ID (e.g., "ORD-A1B2C")
  customerName: string,    // Customer display name
  items: [                 // Ordered items
    { name: string, qty: number, price: number }
  ],
  total: number,           // Order total in ₹
  status: string,          // "new" | "preparing" | "ready" | "completed" | "rejected"
  paymentMethod: string,   // "upi" | "cash" | "card"
  otp: string,             // 4-digit OTP for pickup verification
  placedAt: string,        // ISO timestamp
  estimatedReady: string,  // ISO timestamp (null for new orders)
  completedAt?: string,    // ISO timestamp (set on completion)
  rejectedReason?: string  // Reason string (set on rejection)
}
```

### Payment

```javascript
{
  id: string,              // Payment ID (e.g., "PAY-001")
  orderId: string,         // Linked order ID
  amount: number,          // Amount in ₹
  method: string,          // "upi" | "cash" | "card"
  status: string,          // "settled" | "pending"
  date: string             // ISO timestamp
}
```

### Analytics

```javascript
{
  revenueByDay: [{ day: string, revenue: number }],     // Last 7 days
  ordersByDay: [{ day: string, orders: number }],       // Last 7 days
  popularItems: [{ name: string, orders: number, revenue: number }],
  peakHours: [{ hour: string, orders: number }],        // 9AM-10PM
  summary: {
    todayRevenue: number,
    todayOrders: number,
    avgPrepTime: number,        // Minutes
    rating: number,             // 1-5
    weekRevenue: number,
    weekOrders: number,
    monthRevenue: number,
    monthOrders: number,
    newCustomersPercent: number,
    returningCustomersPercent: number
  }
}
```

---

## Pages & Features

### 1. Dashboard (`/`)

**File**: `DashboardPage.jsx`

The home overview screen showing at-a-glance metrics.

| Section          | Description                                              |
|------------------|----------------------------------------------------------|
| KPI Cards (4)    | Today's Revenue, Orders Today, Avg Prep Time, Store Rating — each with change indicator |
| Live Orders Feed | Latest 5 active orders (new/preparing/ready) with status badges |
| Quick Actions    | 4 shortcut buttons to Orders, Menu, Payments, Analytics  |
| Revenue Chart    | CSS bar chart showing daily revenue for the last 7 days  |

---

### 2. Orders (`/orders`)

**File**: `OrdersPage.jsx`

Real-time order management with a full lifecycle flow.

| Feature              | Description                                            |
|----------------------|--------------------------------------------------------|
| Tab Filters          | New / Preparing / Ready / All Active — with count badges |
| Order Cards          | Shows customer name, items, total, payment method, time elapsed |
| Accept / Reject      | Buttons on **new** orders — accept moves to preparing, reject asks for reason |
| Mark Ready           | Button on **preparing** orders — moves to ready state |
| OTP Display          | Shown on **ready** orders — large monospace code for customer verification |
| Complete             | Button on **ready** orders — marks as completed with timestamp |

**Order Status Flow**:

```
new → (accept) → preparing → (mark ready) → ready → (complete) → completed
  └→ (reject) → rejected
```

---

### 3. Order History (`/history`)

**File**: `HistoryPage.jsx`

Browse and search past completed/rejected orders.

| Feature          | Description                                              |
|------------------|----------------------------------------------------------|
| Date Filter Tabs | Today / This Week / This Month / All                     |
| Search           | Filter by Order ID or customer name                      |
| Summary Stats    | Completed Orders count, Total Revenue, Avg Order Value    |
| Data Table       | Order ID, Customer, Items, Total, Payment method badge, Status badge, Timestamp |

---

### 4. Menu Management (`/menu`)

**File**: `MenuPage.jsx`

Add, edit, and manage menu item availability.

| Feature            | Description                                            |
|--------------------|--------------------------------------------------------|
| Category Tabs      | All / Pizzas / Pasta / Sides / Beverages / Desserts    |
| Item Cards         | Emoji icon, name, veg/non-veg dot, description, price, prep time |
| Availability Toggle| Toggle switch on each card to mark available/unavailable |
| Add Item Modal     | Form with name, category, price, prep time, description, veg toggle |
| Visual Feedback    | Unavailable items are dimmed (opacity: 0.6)            |

---

### 5. Payments (`/payments`)

**File**: `PaymentsPage.jsx`

Revenue tracking and payment records.

| Feature          | Description                                              |
|------------------|----------------------------------------------------------|
| Revenue Cards    | Today / This Week / This Month — amount + order count    |
| UPI QR Section   | QR placeholder + UPI ID display                          |
| Payment Table    | Payment ID, Order ID, Amount, Method badge, Status badge, Date |

---

### 6. Analytics (`/analytics`)

**File**: `AnalyticsPage.jsx`

Performance insights through CSS-based visualizations.

| Chart Type          | Description                                           |
|---------------------|-------------------------------------------------------|
| Revenue Trend       | Vertical bar chart — daily revenue for 7 days         |
| Order Volume        | Vertical bar chart — daily order count for 7 days     |
| Popular Items       | Horizontal bar chart — top 6 items by order count     |
| Peak Hours          | Heatmap grid — orders per hour (9AM–10PM) with color intensity |
| Customer Breakdown  | Stacked bar — new vs returning customers (percentage) |

---

### 7. Settings (`/settings`)

**File**: `SettingsPage.jsx`

Store configuration and preferences.

| Section                | Fields                                              |
|------------------------|-----------------------------------------------------|
| Store Profile          | Name, Cuisine, Description, Phone — with Save button |
| Operating Hours        | 7-day grid with time inputs and open/closed toggle per day |
| Notification Prefs     | New Order Alerts, Low Stock, Reviews, Daily Summary — each with toggle |

---

## Components

### Sidebar (`components/Sidebar.jsx`)

- Fixed left panel with dark background (`#1B1B2F`)
- Store logo + name at top
- 7 navigation items using `NavLink` from React Router
- Active item highlighted with orange accent bar
- **New orders badge** — animated pulse on the Orders nav item showing count
- **Store toggle** at bottom — open/closed switch

### TopBar (`components/TopBar.jsx`)

- Fixed top header with frosted glass background (`backdrop-filter: blur`)
- **Dynamic title** — updates based on current route
- **Search bar** — decorative search input
- **Notification bell** — badge showing notification count
- **Owner avatar** — emoji + name display

### DashboardLayout (`components/DashboardLayout.jsx`)

- Wrapper combining Sidebar + TopBar + React Router `<Outlet />`
- CSS layout: sidebar fixed left, content area with top padding for topbar

---

## Routing

Defined in `App.jsx` using React Router v7.

| Path          | Component        | Page Title       |
|---------------|------------------|------------------|
| `/`           | `DashboardPage`  | Dashboard        |
| `/orders`     | `OrdersPage`     | Live Orders      |
| `/history`    | `HistoryPage`    | Order History    |
| `/menu`       | `MenuPage`       | Menu Management  |
| `/payments`   | `PaymentsPage`   | Payments         |
| `/analytics`  | `AnalyticsPage`  | Analytics        |
| `/settings`   | `SettingsPage`   | Settings         |

All routes are children of `DashboardLayout`, which renders the sidebar and topbar around the page content.

---

## Responsive Behavior

The dashboard adapts to three breakpoints:

| Breakpoint    | Sidebar            | TopBar              | Content             |
|---------------|--------------------|---------------------|---------------------|
| **> 900px**   | Full width (260px) | Full features       | Full grid layouts   |
| **600–900px** | Icon-only (72px)   | Hidden avatar name  | Stacked grids       |
| **< 600px**   | Bottom bar         | No search           | Single column       |

### Sidebar Responsive States

- **Desktop (>900px)**: Full 260px sidebar with icons + labels + badges
- **Tablet (600–900px)**: Collapsed to 72px, icon-only, tooltips on hover
- **Mobile (<600px)**: Transforms to a bottom tab bar (like mobile nav)

---

## Build & Deployment

### Build Output

```bash
npm run build
# Outputs to ./dist/
# dist/index.html + dist/assets/*.js + dist/assets/*.css
```

### Deployment Options

| Platform     | Method                                      |
|-------------|----------------------------------------------|
| **Netlify**  | Connect repo → auto-deploy, or `netlify deploy --prod --dir=dist` |
| **Vercel**   | `vercel --prod`                              |
| **Static**   | Upload `dist/` to any static host            |
| **Docker**   | Serve `dist/` with nginx                     |

### Environment Variables

Currently none required. When connecting to a real backend, add:

```env
VITE_API_BASE_URL=https://api.campusbites.app
```

Access in code via `import.meta.env.VITE_API_BASE_URL`.

---

## Extending the App

### Connecting a Real Backend

1. **Replace mock data** in `data.js` with API fetch calls
2. **Update reducer actions** to dispatch async API calls (consider adding `useEffect` or a data-fetching library)
3. **Add authentication** — wrap routes in an auth guard checking login state
4. **Environment variables** — use `VITE_API_BASE_URL` for the API endpoint

### Adding New Pages

1. Create `NewPage.jsx` + `NewPage.css` in `src/pages/`
2. Add route in `App.jsx` inside the `DashboardLayout` route
3. Add nav item in `Sidebar.jsx` → `navItems` array
4. Add title mapping in `TopBar.jsx` → `routeTitles` object

### Adding New Actions

1. Add a new `case` in the `reducer` function in `DashboardContext.jsx`
2. Dispatch from any component via `dispatch({ type: 'NEW_ACTION', payload: data })`

### Theming

All colors and design tokens are in `:root` CSS custom properties in `index.css`. To create a dark mode:

1. Add a `.dark` class to `<body>` or `#root`
2. Override the tokens: `--bg-primary`, `--bg-card`, `--color-text`, etc.
3. The sidebar is already dark-themed and needs no changes

---

*Built with ❤️ for Campus Bites — February 2026*
