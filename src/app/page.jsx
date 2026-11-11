'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';

const HomePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRecentProducts();
  }, []);

  const fetchRecentProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products?limit=6');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const targetUrl = `/products${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`;
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(targetUrl)}`);
    } else {
      router.push(targetUrl);
    }
  };

  const handleWatchAllProducts = () => {
    if (!isAuthenticated) {
      router.push('/login?callbackUrl=/products');
    } else {
      router.push('/products');
    }
  };

  const handlePostProduct = () => {
    if (!isAuthenticated) {
      router.push('/login?callbackUrl=/add-product');
    } else {
      router.push('/add-product');
    }
  };

  return (
    <div className="space-y-12 pb-24">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#FCE7FF] via-[#F5F3FF] to-[#DDFBF6] pt-16 pb-20 border-b border-gray-100/60">
        
        {/* Left Floating Graphic Illustration */}
        <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <img
            src="/images/bg-hero-left.png"
            alt=""
            className="w-auto h-[480px] object-contain opacity-90"
          />
        </div>

        {/* Right Floating Graphic Illustration */}
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <img
            src="/images/bg-hero-right.png"
            alt=""
            className="w-auto h-[480px] object-contain opacity-90"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
            Deal Your <span className="text-brand-600">Products</span>
            <br />
            In A <span className="text-brand-600">Smart</span> Way !
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-xs sm:text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            BestDeals helps you sell, resell, and shop from trusted local sellers — all in one place!
          </p>

          {/* Pill Search Input */}
          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-lg mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-lg shadow-purple-500/5 border border-gray-200/80 p-1.5 pl-6 transition-all focus-within:ring-2 focus-within:ring-brand-500">
              <input
                type="text"
                placeholder="search For Products, Categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm text-gray-700 bg-transparent focus:outline-none placeholder-gray-400"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-brand-600/30 transition-all hover:scale-105 active:scale-95"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={handleWatchAllProducts}
              className="bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold py-2.5 px-6 rounded-lg shadow-md shadow-brand-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Watch All Products
            </button>
            <button
              onClick={handlePostProduct}
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs sm:text-sm font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Post an Product
            </button>
          </div>

        </div>
      </section>

      {/* Recent Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Recent <span className="text-brand-600">Products</span>
          </h2>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100 p-4"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-sm">No products found at the moment.</p>
          </div>
        )}

        {/* Show More Button */}
        <div className="mt-12 text-center">
          <button
            onClick={handleWatchAllProducts}
            className="btn-primary py-3 px-8 text-sm font-bold shadow-md shadow-brand-600/20"
          >
            Show More Products
          </button>
        </div>

      </section>

    </div>
  );
};

export default HomePage;
