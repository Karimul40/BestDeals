import React from 'react';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'BestDeals - Buy, Sell & Place Bids on Top Products',
  description: 'Best Deals For Smart Shoppers - Discover the best deals from across the country in one place with live bidding!',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F8F9FA] text-gray-900 antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
