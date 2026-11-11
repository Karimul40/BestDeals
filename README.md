# 🛒 SmartDeals - C2C Marketplace & Live Bidding Platform

A full-stack, production-grade C2C marketplace application built with **Next.js (App Router, Server Components)**, **MongoDB (Mongoose)**, **NextAuth.js (OAuth 2.0 & Credentials)**, and **Tailwind CSS**, designed meticulously based on the Figma specification.

---

## 🌟 Key Features

### 1. 🌐 Public & Protected Route Architecture
- **Home Page (`/`)**: Completely public for all visitors. Features a search bar with category selectors, quick category chips, recent deal listings, and trust badges.
- **Protected Access**: Clicking **"Show More Products"**, **"All Products"**, **"My Products"**, **"My Bids"**, or **"Add Product"** automatically checks user authentication. If unauthenticated, it redirects to the **Login / Register** page with a return `callbackUrl`.

### 2. 🔐 Authentication & OAuth 2.0
- **Google OAuth 2.0 Single Sign-On** integration via NextAuth.js.
- **Email & Password Registration & Login** with secure `bcryptjs` password hashing.
- Auto-profile sync with MongoDB.
- Quick 1-click demo login buttons for fast reviewer and CV evaluation.

### 3. 🔨 Live Bidding Engine & Product Details (`/products/[id]`)
- **Product Showcase**: High-res image display, asking price, condition tag, verified seller information card, and live bid counter.
- **Bid Modal ("Give Seller Your Offered Price")**: Modal popup allowing buyers to submit their custom price offer, phone number, and a direct note to the seller.
- **Community Bids Tracking Table**: Real-time log right below product details showing all bids placed on that item (Bidder name, offer amount, contact, date, and status).

### 4. 📸 Versatile Image & Listing Management (`/add-product`)
- **Computer File Upload**: Direct image file selector from local storage with instant preview.
- **Direct Image URL**: Support for Unsplash, ImgBB, Cloudinary, etc.
- **1-Click Preset Samples**: Fast demo buttons to quickly fill sample gadgets and fashion items.

### 5. 📊 Seller & Buyer Dashboards
- **Seller Dashboard (`/my-products`)**: Data table displaying all products posted by the user, bids received, and actions to **Toggle Sold/Available** status or **Delete listing**.
- **Buyer Dashboard (`/my-bids`)**: Real-time tracking of placed bids with status badges (`Pending`, `Accepted`, `Rejected`) and the ability to withdraw bids.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
Open your terminal in VS Code inside `Documents/BestDeal`:
```bash
npm install
```

### 2. Configure Environment Variables
Verify `.env.local` contains your MongoDB URI and NextAuth Secret:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=smart_deals_secret_development_key_bestdeal_2026
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```
*(Note: The app includes auto-seed fallback data so you can immediately preview and run the entire UI!)*

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🎨 Design System & Colors (Figma Match)
- **Primary Brand Purple:** `#6941C6` / `#7F56D9`
- **Dark Footer Navy:** `#0B1B2B`
- **Success Green:** `#12B76A` (`#ECFDF3` bg)
- **Warning Amber:** `#F79009` (`#FFFAEB` bg)
- **Surface Background:** `#F8F9FA`
