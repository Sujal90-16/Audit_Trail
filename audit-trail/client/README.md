# Audit Trail — Frontend

Enterprise-grade shipment tracking dashboard built with **React**, **Vite**, and **Event Sourcing / CQRS** architecture.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Frontend (React)                    │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │Dashboard │  │Shipments │  │ Timeline │  ...pages  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘           │
│       │              │             │                  │
│  ┌────┴──────────────┴─────────────┴──────┐          │
│  │           Component Library (31)        │          │
│  │  DataTable · CommandPanel · Toast ...   │          │
│  └────────────────┬───────────────────────┘          │
│                   │                                   │
│  ┌────────────────┴───────────────────────┐          │
│  │         Services / Hooks Layer          │          │
│  │  api.js (axios) · useShipment · utils   │          │
│  └────────────────┬───────────────────────┘          │
│                   │                                   │
│              Vite Proxy (/api →:3000)                │
└───────────────────┼──────────────────────────────────┘
                    │
┌───────────────────┼──────────────────────────────────┐
│              Backend (Express + Prisma)               │
│                                                       │
│  Commands ──→ Event Store ──→ Projections ──→ Queries │
└───────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

```bash
cd audit-trail/client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — sign in with any email/password.

## 📁 Project Structure

```
client/src/
├── components/        # 31 reusable UI components
│   ├── ActivityHeatmap.jsx    # GitHub-style event heatmap
│   ├── Avatar.jsx             # User avatars with groups
│   ├── Breadcrumbs.jsx        # Navigation breadcrumbs
│   ├── CommandPanel.jsx       # CQRS command dispatch drawer
│   ├── ConfirmDialog.jsx      # Confirmation modal (danger/warning/info)
│   ├── DataTable.jsx          # Sortable, clickable data table
│   ├── EmptyState.jsx         # Empty state placeholder
│   ├── ErrorBoundary.jsx      # React error boundary
│   ├── ErrorMessage.jsx       # Error display with retry
│   ├── EventBadge.jsx         # Event type badges
│   ├── ExportButton.jsx       # CSV/JSON/PDF export dropdown
│   ├── FilterPanel.jsx        # Multi-criteria filter sidebar
│   ├── KeyboardShortcuts.jsx  # Shortcut reference modal
│   ├── LoadingSpinner.jsx     # Loading indicator
│   ├── Modal.jsx              # Reusable modal with portal
│   ├── NotificationCenter.jsx # Notification bell dropdown
│   ├── PageHeader.jsx         # Page title + subtitle
│   ├── Pagination.jsx         # Smart pagination with ellipsis
│   ├── ProgressBar.jsx        # Animated progress bars
│   ├── RecentActivity.jsx     # Event activity feed
│   ├── SearchBar.jsx          # Shipment ID search
│   ├── ShipmentCard.jsx       # Shipment summary card
│   ├── Sidebar.jsx            # App navigation sidebar
│   ├── SkeletonLoader.jsx     # Shimmer loading placeholders
│   ├── StatusIndicator.jsx    # Connection status badge
│   ├── StatsCard.jsx          # KPI statistics card
│   ├── Tabs.jsx               # Tab navigation
│   ├── Timeline.jsx           # Event timeline
│   ├── Toast.jsx              # Toast notifications (context)
│   ├── Tooltip.jsx            # Hover tooltips
│   └── TopBar.jsx             # Global header bar
├── hooks/
│   ├── useShipment.js         # Shipment data fetching hook
│   └── useUtils.js            # localStorage, mediaQuery, keyPress, etc.
├── pages/
│   ├── Analytics.jsx          # KPI charts and metrics
│   ├── Dashboard.jsx          # Main dashboard with stats, heatmap
│   ├── HelpPage.jsx           # Documentation (events, API, architecture)
│   ├── LoginPage.jsx          # Authentication gate
│   ├── NotFound.jsx           # 404 page
│   ├── Settings.jsx           # App configuration
│   ├── ShipmentDetail.jsx     # Single shipment view with timeline
│   ├── Shipments.jsx          # Shipment list (cards + table view)
│   └── TimelinePage.jsx       # Global event stream
├── services/
│   └── api.js                 # Axios client with JWT interceptors
├── styles/
│   └── globals.css            # Design system (colors, spacing, etc.)
├── App.jsx                    # Root layout with routing
└── main.jsx                   # Entry point
```

## 🎨 Design System

All design tokens are centralized in `globals.css`:

| Token | Example |
|-------|---------|
| Colors | `--color-accent`, `--color-bg-card`, `--color-text-primary` |
| Gradients | `--gradient-primary`, `--gradient-cool` |
| Spacing | `--space-1` through `--space-8` |
| Radii | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full` |
| Typography | `--font-size-xs` through `--font-size-3xl` |
| Shadows | `--shadow-sm`, `--shadow-md`, `--shadow-lg` |
| Transitions | `--transition-fast`, `--transition-base` |

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `?` | Show keyboard shortcuts |
| `Esc` | Close modals/panels |
| `Ctrl+K` | Focus search |

## 🔗 API Integration

The frontend connects to the backend via Vite proxy (`/api` → `localhost:3000`):

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Authenticate user |
| `/api/auth/register` | POST | Register new user |
| `/api/shipments` | GET | List all shipments |
| `/api/shipments/:id` | GET | Get shipment detail |
| `/api/shipments/stats` | GET | Dashboard statistics |
| `/api/events` | GET | Query event stream |
| `/api/events` | POST | Create new event |
| `/api/commands/create` | POST | Dispatch create command |

> **Offline mode:** If the backend is unavailable, all pages fall back to mock data automatically.

## 🛠️ Tech Stack

- **React 18** — UI framework
- **React Router 6** — Client-side routing
- **Axios** — HTTP client with JWT interceptors
- **Recharts** — Data visualization
- **Vite** — Build tool and dev server
- **CSS Variables** — Design system (no CSS framework)
