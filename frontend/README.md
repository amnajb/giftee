# Giftee Frontend

Gift Card & Loyalty Platform - React Frontend Application

## Features

- **Cashier Terminal**: QR code scanning, transaction processing (load/charge), customer lookup
- **QR Scanning**: Dual-mode scanner (browser camera + LINE LIFF integration)
- **Role-Based Access**: Protected routes for Cashier, Customer, and Admin roles
- **Theme Support**: Light/Dark theme with localStorage persistence
- **Thai Localization**: Full Thai language support for the Thai market
- **Responsive Design**: Mobile-first design optimized for tablet/mobile cashier use

## Tech Stack

- **React 18** - UI Framework
- **React Router 6** - Client-side routing
- **Axios** - HTTP client with JWT interceptor
- **@zxing/library** - Browser-based QR code scanning
- **@line/liff** - LINE platform integration
- **Vite** - Build tool and dev server
- **CSS Custom Properties** - Theming system

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd giftee-frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update environment variables in .env
```

### Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── QRScanner.jsx
│   ├── cashier/          # Cashier-specific components
│   │   ├── CashierDashboard.jsx
│   │   ├── CustomerInfo.jsx
│   │   ├── TransactionForm.jsx
│   │   ├── ScanInterface.jsx
│   │   └── QuickActions.jsx
│   └── ProtectedRoute.jsx
├── context/
│   ├── AuthContext.jsx   # Authentication state
│   └── ThemeContext.jsx  # Theme management
├── hooks/
│   └── useQRScanner.js   # Camera QR scanning hook
├── pages/
│   ├── auth/
│   │   └── Login.jsx
│   └── cashier/
│       └── CashierHome.jsx
├── services/
│   ├── api.js            # Axios instance
│   ├── auth.service.js   # Authentication API
│   ├── cashier.service.js # Cashier operations API
│   └── line.service.js   # LINE LIFF integration
├── styles/
│   ├── globals.css       # Global styles & CSS variables
│   └── themes/
│       └── index.js      # Theme definitions
├── utils/
│   ├── constants.js      # App constants
│   └── formatters.js     # Formatting utilities
├── App.jsx               # Root component with routing
└── main.jsx              # Entry point
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |
| `VITE_LINE_LIFF_ID` | LINE LIFF App ID | `1234567890-abcdefgh` |

## Available Routes

| Route | Role | Description |
|-------|------|-------------|
| `/login` | Public | Login page |
| `/cashier` | Cashier | Cashier terminal |
| `/customer` | Customer | Customer dashboard (TBD) |
| `/admin` | Admin | Admin dashboard (TBD) |

## API Integration

The frontend expects a backend API with these endpoints:

### Authentication
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/line-login` - LINE OAuth login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - Logout

### Cashier Operations
- `GET /api/cashier/lookup/qr/:code` - Lookup customer by QR
- `GET /api/cashier/lookup/card/:number` - Lookup by card number
- `POST /api/cashier/transactions/load` - Process load transaction
- `POST /api/cashier/transactions/charge` - Process charge transaction
- `GET /api/cashier/daily-summary` - Get daily stats
- `GET /api/cashier/recent-transactions` - Get recent transactions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details
