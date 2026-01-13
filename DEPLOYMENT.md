# 🚀 Giftee Deployment Guide for Amnaj

## Your MongoDB Atlas Connection
```
mongodb+srv://amnaj_db_user:A8jvK6oLTA4MVyf4@cluster0.gpvhkn1.mongodb.net/giftee
```

---

## Step 1: Prepare Your Code

### Option A: Push to GitHub (Recommended for Render)
```bash
# Unzip the giftee-full-stack.zip
unzip giftee-full-stack.zip
cd giftee-full-stack

# Initialize git
git init
git add .
git commit -m "Initial Giftee full-stack commit"

# Create GitHub repo and push
# Go to github.com → New Repository → "giftee-platform"
git remote add origin https://github.com/YOUR_USERNAME/giftee-platform.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render.com

1. Go to [render.com](https://render.com) → Sign up/Login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account → Select `giftee-platform` repo
4. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `giftee-api` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node src/server.js` |
| **Instance Type** | Free |

5. Add **Environment Variables** (click "Advanced" → "Add Environment Variable"):

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://amnaj_db_user:A8jvK6oLTA4MVyf4@cluster0.gpvhkn1.mongodb.net/giftee?retryWrites=true&w=majority` |
| `JWT_SECRET` | `giftee-jwt-secret-amnaj-2026-production-key-32chars` |
| `NODE_ENV` | `production` |
| `QR_SECRET` | `giftee-qr-amnaj-secret-2026` |
| `CORS_ORIGINS` | `https://giftee-frontend.onrender.com,https://giftee-admin.onrender.com` |

6. Click **"Create Web Service"**
7. Wait for deployment (3-5 minutes)
8. Note your API URL: `https://giftee-api.onrender.com`

---

## Step 3: Seed the Database

After backend is deployed, seed demo data:

### Option A: Via Render Shell
1. Go to your Render dashboard → `giftee-api` service
2. Click **"Shell"** tab
3. Run: `npm run seed`

### Option B: Local (if you have Node.js installed)
```bash
cd backend
npm install
npm run seed
```

This creates demo accounts:
- **Admin**: admin@giftee.app / Admin123!
- **Cashier**: cashier@giftee.app / Cashier123!
- **Customer**: customer@giftee.app / Customer123!

---

## Step 4: Deploy Frontend to Render

1. Render Dashboard → **"New +"** → **"Static Site"**
2. Connect same GitHub repo
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `giftee-frontend` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

4. Add **Environment Variable**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://giftee-api.onrender.com/api` |

5. Click **"Create Static Site"**

---

## Step 5: Deploy Admin Dashboard to Render

1. Render Dashboard → **"New +"** → **"Static Site"**
2. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `giftee-admin` |
| **Root Directory** | `admin` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

4. Add **Environment Variable**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://giftee-api.onrender.com/api` |

---

## Step 6: Update CORS (Important!)

After all 3 are deployed, update the backend CORS:

1. Go to Render → `giftee-api` → Environment
2. Update `CORS_ORIGINS` with your actual URLs:
```
https://giftee-frontend.onrender.com,https://giftee-admin.onrender.com
```
3. Click "Save Changes" (triggers redeploy)

---

## 🎉 Your URLs

After deployment:

| App | URL |
|-----|-----|
| **API** | https://giftee-api.onrender.com |
| **Frontend** | https://giftee-frontend.onrender.com |
| **Admin** | https://giftee-admin.onrender.com |

---

## ⚠️ Important Notes

### Free Tier Limitations
- Services sleep after 15 min of inactivity
- First request after sleep takes ~30 seconds (cold start)
- 750 hours/month free (enough for 1 service always-on)

### MongoDB Atlas IP Whitelist
Make sure to allow access from anywhere in Atlas:
1. Atlas → Network Access → Add IP Address
2. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
3. Click "Confirm"

### Upgrading Later
When ready for production, upgrade to:
- Render Starter ($7/month) - No sleep, faster
- MongoDB Atlas M2 ($9/month) - 2GB storage, backups

---

## 🧪 Test Your Deployment

1. **API Health Check**: 
   ```
   https://giftee-api.onrender.com/health
   ```
   Should return: `{"status":"ok"}`

2. **Login Test**:
   - Go to https://giftee-frontend.onrender.com
   - Login with: customer@giftee.app / Customer123!

3. **Admin Test**:
   - Go to https://giftee-admin.onrender.com
   - Login with: admin@giftee.app / Admin123!

---

## Need Help?

Common issues:
- **CORS errors**: Update CORS_ORIGINS in backend env
- **Cannot connect to DB**: Check Atlas IP whitelist
- **502 errors**: Check Render logs for errors
- **Slow first load**: Normal for free tier (cold start)
