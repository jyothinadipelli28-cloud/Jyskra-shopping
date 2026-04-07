# 🛍️ JYSKRA — Full-Stack E-Commerce Platform

A production-ready AI-powered smart shopping system built with **Node.js (Express)**, **MongoDB**, and **React (Vite)**. Includes role-based access control, AI product recommendations, cart system, order management, and rich admin dashboards.

---

## 📁 Project Structure

```
smart-shopping/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, logout, profile
│   │   ├── cartController.js      # Cart CRUD
│   │   ├── orderController.js     # Orders + admin stats
│   │   ├── productController.js   # Product CRUD
│   │   ├── recommendationController.js  # AI engine
│   │   └── userController.js      # User management (admin)
│   ├── middleware/
│   │   ├── auth.js                # Session auth + role guards
│   │   └── upload.js              # Multer image upload
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   ├── recommendations.js
│   │   └── users.js
│   ├── uploads/                   # Product images (auto-created)
│   ├── seed.js                    # Demo data seeder
│   ├── server.js                  # Express entry point
│   ├── .env                       # Local dev env vars
│   ├── .env.example               # Template for production
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   └── Sidebar.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx  # Stats + charts
    │   │   │   ├── AdminOrders.jsx     # Order management
    │   │   │   ├── AdminProducts.jsx   # Product CRUD
    │   │   │   └── AdminUsers.jsx      # User management
    │   │   ├── customer/
    │   │   │   ├── CartPage.jsx
    │   │   │   ├── CustomerDashboard.jsx
    │   │   │   ├── OrdersPage.jsx
    │   │   │   ├── ProductDetail.jsx
    │   │   │   └── ProductsPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── api.js                  # Axios instance
    │   ├── App.jsx                 # Router + layout
    │   ├── index.css               # Global styles + design system
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- **Node.js** v18+ — [nodejs.org](https://nodejs.org)
- **MongoDB** — Either local install or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)
- **Git**

---

### Step 1 — Clone & Install

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/smart-shopping.git
cd smart-shopping

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### Step 2 — Configure Environment

The backend `.env` file is pre-configured for local MongoDB. Edit `backend/.env` if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-shopping
SESSION_SECRET=dev_secret_key_smart_shopping_2024
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**For MongoDB Atlas** (cloud):
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → Create free cluster
2. Click **Connect** → **Drivers** → copy the connection string
3. Replace `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smart-shopping?retryWrites=true&w=majority
   ```

---

### Step 3 — Seed Demo Data

```bash
cd backend
node seed.js
```

This creates:
- 👤 **Admin**: `admin@demo.com` / `admin123`
- 👤 **Customer**: `customer@demo.com` / `customer123`
- 📦 **16 products** across all categories
- 📋 **2 sample orders**

---

### Step 4 — Run the Application

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev       # uses nodemon for hot-reload
# or
npm start         # production start
```
Backend runs at: **http://localhost:5000**

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at: **http://localhost:5173**

---

## 🔑 Demo Accounts

| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Admin    | admin@demo.com         | admin123     |
| Customer | customer@demo.com      | customer123  |

---

## 🌟 Features

### Authentication & Security
- Session-based auth with `express-session` + `connect-mongo`
- Passwords hashed with `bcryptjs` (12 salt rounds)
- Role-based access control (Admin / Customer)
- Protected routes on both frontend and backend
- Secure cookie settings for production

### Admin Panel
- 📊 **Dashboard** — Revenue charts (Line/Doughnut via Chart.js), order stats, recent users
- 📦 **Products** — Full CRUD with image upload (multer), search, category filter
- 📋 **Orders** — View all, update status, filter, delete, paginate
- 👥 **Users** — View all, change roles, delete users

### Customer Portal
- 🏠 **Dashboard** — AI recommendations, cart preview, order summary, trending products
- 🛍️ **Shop** — Browse with category filters, search, sort, pagination
- 📄 **Product Detail** — Full info, view tracking, quantity selector, related products
- 🛒 **Cart** — Add/remove/update quantities, checkout modal, shipping address
- 📦 **Order History** — Expandable order cards with full item details

### AI Recommendation Engine
Three-layer strategy:
1. **Category affinity** — Recommends from categories based on purchase/browse history
2. **Collaborative filtering** — "Customers also bought" from users with similar orders
3. **Trending fallback** — Popular products by sales + view count

### Profile System
- Update name and email
- Change password with old-password verification

---

## 🚀 Deploying to Production

### Backend (Railway / Render / Fly.io)

1. Set environment variables on your hosting platform:
   ```
   NODE_ENV=production
   MONGODB_URI=your_atlas_connection_string
   SESSION_SECRET=a_long_random_string_min_32_chars
   CLIENT_URL=https://your-frontend-domain.com
   PORT=5000
   ```
2. Deploy the `backend/` folder
3. Cookie `sameSite: 'none'` and `secure: true` activate automatically in production

### Frontend (Vercel / Netlify)

1. Build command: `npm run build`
2. Output directory: `dist`
3. Set environment variable (if not using Vite proxy):
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   ```
4. Update `api.js` baseURL to use `import.meta.env.VITE_API_URL` for production

---

## 📤 GitHub Upload Steps

```bash
cd smart-shopping

# Initialize repository
git init
git add .
git commit -m "feat: initial commit - ShopSmart AI full-stack app"

# Create repo on GitHub (github.com → New Repository → 'smart-shopping')
git remote add origin https://github.com/YOUR_USERNAME/smart-shopping.git
git branch -M main
git push -u origin main
```

---

## 🛠️ Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Backend    | Node.js, Express.js                             |
| Database   | MongoDB, Mongoose ODM                           |
| Auth       | express-session, connect-mongo, bcryptjs        |
| File Upload| Multer                                          |
| Frontend   | React 18, Vite                                  |
| Routing    | React Router DOM v6                             |
| HTTP       | Axios (with credential support)                 |
| Charts     | Chart.js, react-chartjs-2                       |
| Toasts     | react-hot-toast                                 |
| Styling    | Custom CSS design system (dark theme)           |
| Fonts      | Syne (display), Space Grotesk (body)            |

---

## 📡 API Reference

| Method | Endpoint                        | Auth     | Description               |
|--------|---------------------------------|----------|---------------------------|
| POST   | /api/auth/register              | Public   | Register new user         |
| POST   | /api/auth/login                 | Public   | Login                     |
| POST   | /api/auth/logout                | Any      | Logout                    |
| GET    | /api/auth/me                    | Any      | Get current user          |
| PUT    | /api/auth/profile               | Any      | Update profile            |
| PUT    | /api/auth/change-password       | Any      | Change password           |
| GET    | /api/products                   | Public   | Browse products           |
| GET    | /api/products/:id               | Public   | Product detail            |
| POST   | /api/products                   | Admin    | Create product            |
| PUT    | /api/products/:id               | Admin    | Update product            |
| DELETE | /api/products/:id               | Admin    | Delete product            |
| GET    | /api/cart                       | Customer | Get cart                  |
| POST   | /api/cart/add                   | Customer | Add to cart               |
| PUT    | /api/cart/update                | Customer | Update cart item qty      |
| DELETE | /api/cart/item/:productId       | Customer | Remove cart item          |
| POST   | /api/orders                     | Customer | Place order               |
| GET    | /api/orders/my                  | Customer | My order history          |
| GET    | /api/orders/admin/all           | Admin    | All orders                |
| PUT    | /api/orders/:id/status          | Admin    | Update order status       |
| GET    | /api/recommendations            | Customer | AI recommendations        |
| GET    | /api/recommendations/trending   | Public   | Trending products         |
| GET    | /api/users                      | Admin    | All users                 |
| PUT    | /api/users/:id/role             | Admin    | Change user role          |
| DELETE | /api/users/:id                  | Admin    | Delete user               |

---

## 📝 License

MIT — free to use, modify, and distribute.
