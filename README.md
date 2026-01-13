# 🎁 Giftee - Complete Gift Card & Loyalty Platform

A full-stack gift card and loyalty rewards platform designed for the Thai market with LINE integration.

## 📁 Project Structure

```
giftee-full-stack/
├── backend/          # Node.js/Express API Server
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth, validation, roles
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   └── server.js      # Entry point
│   ├── scripts/       # Database seeding
│   └── package.json
│
├── frontend/         # Customer & Cashier React App
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── context/       # Auth & Theme providers
│   │   ├── pages/         # Route pages
│   │   ├── services/      # API services
│   │   └── App.jsx
│   └── package.json
│
├── admin/            # Admin Dashboard React App
│   ├── src/
│   │   ├── components/    # Dashboard components
│   │   ├── services/      # API services
│   │   └── App.jsx
│   └── package.json
│
├── docker-compose.yml    # Full stack orchestration
└── README.md
```

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repo
cd giftee-full-stack

# Start all services
docker-compose up -d

# Access the apps:
# - Frontend: http://localhost:5173
# - Admin: http://localhost:5174
# - API: http://localhost:3000
```

### Option 2: Manual Setup

**Prerequisites:**
- Node.js 18+
- MongoDB 6+ (local or MongoDB Atlas)

**1. Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
npm install
npm run seed    # Seed demo data
npm run dev     # Start on port 3000
```

**2. Frontend:**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev     # Start on port 5173
```

**3. Admin:**
```bash
cd admin
cp .env.example .env
npm install
npm run dev     # Start on port 5174
```

## 🔐 Demo Accounts

After running `npm run seed` in the backend:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@giftee.app | Admin123! |
| Cashier | cashier@giftee.app | Cashier123! |
| Customer | customer@giftee.app | Customer123! |

## 🌐 Cloud Deployment

### MongoDB Atlas (Free Database)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free M0 cluster (512MB)
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/giftee`

### Render.com (Free Hosting)

**Backend:**
1. New Web Service → Connect GitHub
2. Build Command: `npm install`
3. Start Command: `node src/server.js`
4. Add environment variables from `.env.example`

**Frontend & Admin:**
1. New Static Site → Connect GitHub
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. Add `VITE_API_URL` environment variable

### Alternative: Koyeb, Railway, or Heroku
See detailed deployment guides in each project's README.

## ⚙️ Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/giftee
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
PORT=3000
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
LINE_CHANNEL_ID=your-line-channel-id
LINE_CHANNEL_SECRET=your-line-channel-secret
LIFF_ID=your-liff-id
QR_SECRET=giftee-qr-secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_LIFF_ID=your-liff-id
VITE_LINE_CHANNEL_ID=your-channel-id
```

### Admin (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/line` - LINE OAuth login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Current user

### Gift Cards
- `GET /api/giftcards` - List cards
- `POST /api/giftcards` - Create card
- `POST /api/giftcards/load` - Load balance
- `POST /api/giftcards/transfer` - Transfer

### Loyalty
- `GET /api/loyalty/points` - Balance
- `GET /api/loyalty/tier` - Tier info
- `GET /api/loyalty/history` - History

### Rewards
- `GET /api/rewards` - List rewards
- `POST /api/rewards/:id/redeem` - Redeem

### Cashier
- `POST /api/cashier/scan` - Scan QR
- `POST /api/cashier/transaction` - Process
- `POST /api/cashier/topup` - Top up

### Admin
- `GET /api/admin/dashboard` - Stats
- `GET /api/admin/users` - Manage users
- `GET /api/admin/reports/*` - Reports

## 🎖️ Loyalty Tiers

| Tier | Points | Multiplier |
|------|--------|------------|
| Bronze | 0+ | 1.0x |
| Silver | 500+ | 1.25x |
| Gold | 2,000+ | 1.5x |
| Platinum | 5,000+ | 2.0x |

## 🔒 Security

- JWT authentication with refresh tokens
- Password hashing (bcrypt)
- Rate limiting
- Helmet security headers
- CORS protection
- Input validation
- QR code signing (HMAC)

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- express-validator

**Frontend:**
- React 18 + Vite
- React Router
- Axios
- LINE LIFF SDK

**Admin:**
- React 18 + Vite
- Tailwind CSS
- Recharts

## 📄 License

MIT License

---
Built with ❤️ for the Thai market
