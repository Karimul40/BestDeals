import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-900 text-gray-300 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                Best<span className="text-brand-400">Deals</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              BestDeals is the premier C2C and verified marketplace platform connecting smart shoppers with genuine sellers across the country. Bid, buy, and sell with confidence.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-brand-600 hover:text-white flex items-center justify-center text-gray-400 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-brand-600 hover:text-white flex items-center justify-center text-gray-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-brand-600 hover:text-white flex items-center justify-center text-gray-400 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-brand-600 hover:text-white flex items-center justify-center text-gray-400 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white text-base font-semibold tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home Page</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">All Products</Link>
              </li>
              <li>
                <Link href="/my-products" className="hover:text-white transition-colors">Seller Dashboard</Link>
              </li>
              <li>
                <Link href="/my-bids" className="hover:text-white transition-colors">Buyer Bids</Link>
              </li>
              <li>
                <Link href="/add-product" className="hover:text-white transition-colors">Create Product</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-white text-base font-semibold tracking-wide">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products?category=Electronics" className="hover:text-white transition-colors">Electronics &amp; Gadgets</Link>
              </li>
              <li>
                <Link href="/products?category=Fashion" className="hover:text-white transition-colors">Fashion &amp; Lifestyle</Link>
              </li>
              <li>
                <Link href="/products?category=Home+%26+Living" className="hover:text-white transition-colors">Home &amp; Living</Link>
              </li>
              <li>
                <Link href="/products?category=Vehicles" className="hover:text-white transition-colors">Vehicles &amp; Bikes</Link>
              </li>
              <li>
                <Link href="/products?category=Books" className="hover:text-white transition-colors">Books &amp; Hobbies</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-white text-base font-semibold tracking-wide">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>123 Commerce Avenue, Gulshan, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+880 1800 123 456</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>support@bestdeals.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom separator */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} BestDeals Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> Next.js App Router &amp; MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
