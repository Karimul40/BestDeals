'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';

const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          image: image || '/images/thumb-profile.png',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      setSuccess(true);

      const signInRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (!signInRes?.error) {
        setTimeout(() => {
          window.location.href = callbackUrl;
        }, 800);
      } else {
        window.location.href = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      }
    } catch (err) {
      setError(err.message);
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
        window.location.href = callbackUrl;
      }
    } catch (err) {
      console.error('Google register error:', err);
      try {
        await signIn('google-mock', { callbackUrl });
        window.location.href = callbackUrl;
      } catch (fallbackErr) {
        setError('Google sign up failed. Please try again.');
        setGoogleLoading(false);
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl">
        
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <span className="text-2xl font-black tracking-tight text-gray-900">
              Best<span className="text-brand-600">Deals</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Join thousands of smart shoppers and verified sellers today.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-xs text-green-700">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Account created! Signing you in...</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <div>
          <button
            type="button"
            disabled={googleLoading || loading || success}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 shadow-sm transition-all disabled:opacity-60 cursor-pointer"
          >
            <img src="/images/icon-google.png" alt="Google" className="w-4 h-4 object-contain" />
            <span>{googleLoading ? 'Connecting with Google...' : 'Sign up with Google OAuth 2.0'}</span>
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

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                placeholder="Rahim Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-red-500">*</span>
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
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Profile Photo URL (Optional)
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 text-gray-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success || googleLoading}
            className="w-full btn-primary py-3 text-xs font-bold shadow-md shadow-brand-700/20 disabled:opacity-60"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="font-bold text-brand-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

const RegisterPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
};

export default RegisterPage;
