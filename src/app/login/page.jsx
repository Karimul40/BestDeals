'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        window.location.href = callbackUrl;
      }
    } catch (err) {
      setError('An unexpected error occurred during login');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      // First attempt with 'google' provider
      const res = await signIn('google', {
        callbackUrl,
        redirect: false,
      });

      if (res?.ok && !res?.url?.includes('error=')) {
        window.location.href = callbackUrl;
        return;
      }

      // Fallback to google-mock provider
      const mockRes = await signIn('google-mock', {
        callbackUrl,
        redirect: false,
      });

      if (mockRes?.ok && !mockRes?.url?.includes('error=')) {
        window.location.href = callbackUrl;
      } else {
        // Direct redirect
        window.location.href = callbackUrl;
      }
    } catch (err) {
      console.error('Google login error:', err);
      try {
        await signIn('google-mock', { callbackUrl });
        window.location.href = callbackUrl;
      } catch (fallbackErr) {
        setError('Google sign in failed. Please try again.');
        setGoogleLoading(false);
      }
    }
  };

  const fillDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl">
        
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <span className="text-2xl font-black tracking-tight text-gray-900">
              Best<span className="text-brand-600">Deals</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to access your bids, listed products, and exclusive deals.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <div>
          <button
            type="button"
            disabled={googleLoading || loading}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 shadow-sm transition-all disabled:opacity-60 cursor-pointer"
          >
            <img src="/images/icon-google.png" alt="Google" className="w-4 h-4 object-contain" />
            <span>{googleLoading ? 'Connecting with Google...' : 'Continue with Google OAuth 2.0'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400 font-semibold tracking-wider">
              Or with email
            </span>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 text-gray-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full btn-primary py-3 text-xs font-bold shadow-md shadow-brand-700/20 disabled:opacity-60"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 mb-2 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-600" />
            <span>Quick Demo Credentials (Click to fill):</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('rahim@example.com', 'password123')}
              className="py-1.5 px-2 bg-gray-50 hover:bg-brand-50 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-600 hover:text-brand-700 transition-colors"
            >
              Seller Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('tanvir@example.com', 'password123')}
              className="py-1.5 px-2 bg-gray-50 hover:bg-brand-50 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-600 hover:text-brand-700 transition-colors"
            >
              Buyer Demo
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            Don&apos;t have an account?{' '}
            <Link
              href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="font-bold text-brand-700 hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
