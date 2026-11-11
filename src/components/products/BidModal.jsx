'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { X, Gavel, DollarSign, Phone, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

const BidModal = ({ product, isOpen, onClose, onBidSuccess }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [offerPrice, setOfferPrice] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!session) {
      router.push(`/login?callbackUrl=/products/${product._id}`);
      return;
    }

    const priceNum = Number(offerPrice);
    if (!priceNum || priceNum <= 0) {
      setError('Please enter a valid offer price');
      return;
    }

    if (!contact.trim()) {
      setError('Please provide a contact phone number');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          offerPrice: priceNum,
          contact,
          message,
          bidder: {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place your bid');
      }

      setSuccess(true);
      setTimeout(() => {
        if (onBidSuccess) onBidSuccess(data.bid);
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700">
            <Gavel className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Give Seller Your Offered Price
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Submit your offer for &ldquo;{product.title}&rdquo;
            </p>
          </div>
        </div>

        {/* Product Quick Info Banner */}
        <div className="bg-gray-50 rounded-xl p-3.5 mb-6 flex items-center justify-between border border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={product.image || '/images/thumbnail-card.png'}
              alt={product.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <p className="text-xs text-gray-500">Asking Price</p>
              <p className="text-base font-bold text-brand-700">
                ${Number(product.price).toLocaleString()}
              </p>
            </div>
          </div>
          <span className="badge badge-brand">{product.condition}</span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-xs text-green-700">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Bid submitted successfully! Reloading bids...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Bidder Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                disabled
                value={session?.user?.name || 'Please sign in'}
                className="w-full px-3 py-2 text-xs bg-gray-100 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Your Email</label>
              <input
                type="email"
                disabled
                value={session?.user?.email || 'Please sign in'}
                className="w-full px-3 py-2 text-xs bg-gray-100 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Offer Price Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Your Offered Price ($) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="number"
                min="1"
                step="any"
                required
                placeholder="e.g. 950"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-semibold text-gray-900"
              />
            </div>
          </div>

          {/* Contact Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Phone / Contact Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. +880 1712-345678"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Optional Message */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Message to Seller (Optional)
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <textarea
                rows={2}
                placeholder="Can pick up today, payment in cash..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary py-2 px-4 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="btn-primary py-2 px-5 text-xs font-semibold"
            >
              {loading ? 'Submitting...' : 'Submit Bid'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default BidModal;
