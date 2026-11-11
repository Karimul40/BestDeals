'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  PlusCircle, 
  Gavel, 
  Package, 
  Menu, 
  X, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isAuthenticated = status === 'authenticated';
  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';

  const navLinks = [
    { name: 'Home', href: '/', public: true },
    { name: 'All Products', href: '/products', public: false },
    { name: 'My Products', href: '/my-products', public: false },
    { name: 'My Bids', href: '/my-bids', public: false },
    { name: 'Create Product', href: '/add-product', public: false },
  ];

  const handleProtectedNavigation = (e, link) => {
    if (!link.public && !isAuthenticated) {
      e.preventDefault();
      router.push(`/login?callbackUrl=${encodeURIComponent(link.href)}`);
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-2xl font-black tracking-tight text-gray-900">
              Best<span className="text-brand-600">Deals</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleProtectedNavigation(e, link)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'text-[#42307D] font-black'
                      : 'text-gray-600 hover:text-[#42307D] font-medium'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-2.5 rounded-full hover:bg-gray-100 border border-gray-200 transition-colors"
                >
                  <img
                    src={session?.user?.image || '/images/thumb-profile.png'}
                    alt={session?.user?.name || 'User'}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-brand-500/20"
                  />
                  <div className="text-left text-xs hidden sm:block">
                    <p className="font-semibold text-gray-800 leading-tight">
                      {session?.user?.name?.split(' ')[0]}
                    </p>
                    <span className="text-success text-[10px] font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-success inline-block"></span> Online
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{session?.user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                    </div>
                    
                    <Link
                      href="/add-product"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-brand-600" />
                      Create Product
                    </Link>

                    <Link
                      href="/my-products"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                    >
                      <Package className="w-4 h-4 text-brand-600" />
                      My Listed Products
                    </Link>

                    <Link
                      href="/my-bids"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                    >
                      <Gavel className="w-4 h-4 text-brand-600" />
                      My Placed Bids
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isLoginPage
                      ? 'text-white bg-brand-700 hover:bg-brand-800 shadow-sm'
                      : 'text-gray-700 bg-white border border-gray-300 hover:text-brand-700 hover:bg-gray-50'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isLoginPage
                      ? 'text-gray-700 bg-white border border-gray-300 hover:text-brand-700 hover:bg-gray-50'
                      : 'text-white bg-brand-700 hover:bg-brand-800 shadow-sm'
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleProtectedNavigation(e, link)}
                className={`block px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                  isActive
                    ? 'text-[#42307D] bg-purple-50 font-bold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{link.name}</span>
                </div>
              </Link>
            );
          })}

          <div className="pt-4 border-t border-gray-100">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                  <img
                    src={session?.user?.image || '/images/thumb-profile.png'}
                    alt={session?.user?.name || 'User'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{session?.user?.name}</p>
                    <p className="text-xs text-gray-500">{session?.user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isLoginPage
                      ? 'text-white bg-brand-700 shadow-sm'
                      : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isLoginPage
                      ? 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                      : 'text-white bg-brand-700 shadow-sm'
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
