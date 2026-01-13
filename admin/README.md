# Giftee Admin Dashboard

A React-based admin dashboard for the Giftee gift card and loyalty platform. Built with React 18, Vite, Tailwind CSS, and Recharts.

![Giftee Admin](https://via.placeholder.com/800x400/1e3a5f/c9a227?text=Giftee+Admin+Dashboard)

## Features

- **Dashboard Overview**: Real-time metrics, revenue charts, tier distribution, and recent activity
- **User Management**: CRUD operations, role/tier filtering, inline actions, bulk operations
- **Reward Management**: Category-based rewards, stock tracking, tier-based access control
- **Transaction Reports**: Multi-dimensional filtering, revenue trends, hourly patterns
- **Reports & Analytics**: Comprehensive business insights with exportable reports
- **Settings**: System configuration, LINE integration, security settings

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **TanStack Table** - Data tables
- **TanStack Query** - Data fetching
- **Recharts** - Charts and visualizations
- **Lucide React** - Icons
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   cd giftee-admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your API URL:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Login

- **Email**: admin@giftee.com
- **Password**: admin123

## Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.jsx    # Main dashboard with stats & charts
│   │   ├── UserManagement.jsx    # User CRUD table
│   │   ├── RewardManagement.jsx  # Reward CRUD table
│   │   ├── TransactionReports.jsx # Transaction history & reports
│   │   ├── ReportsPage.jsx       # Advanced analytics
│   │   └── SettingsPage.jsx      # System settings
│   ├── auth/
│   │   └── LoginPage.jsx         # Authentication
│   └── common/
│       ├── AdminLayout.jsx       # Layout with sidebar
│       ├── DataTable.jsx         # Reusable table component
│       ├── Modal.jsx             # Modal & confirm dialog
│       └── StatCard.jsx          # Metric display cards
├── services/
│   └── api.js                    # API client & services
├── styles/
│   ├── globals.css               # Tailwind & custom styles
│   └── theme.js                  # Brand colors & design tokens
├── App.jsx                       # Routes configuration
└── main.jsx                      # Entry point
```

## Design System

### Colors

- **Primary**: Navy `#1e3a5f`
- **Secondary**: Gold `#c9a227`
- **Tier Colors**:
  - Bronze: `#cd7f32`
  - Silver: `#9ca3af`
  - Gold: `#fbbf24`
  - Platinum: `#e5e7eb`

### Typography

- **Headings/Body**: DM Sans
- **Monospace**: JetBrains Mono

## API Integration

The dashboard expects a REST API with the following endpoints:

### Users
- `GET /api/users` - List users with pagination
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Rewards
- `GET /api/rewards` - List rewards
- `POST /api/rewards` - Create reward
- `PUT /api/rewards/:id` - Update reward
- `DELETE /api/rewards/:id` - Delete reward

### Transactions
- `GET /api/transactions` - List transactions
- `GET /api/transactions/stats` - Transaction statistics

### Dashboard
- `GET /api/dashboard/stats` - Overview statistics
- `GET /api/dashboard/charts` - Chart data

## Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## License

Proprietary - Giftee Thailand
