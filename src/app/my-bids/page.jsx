'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Gavel, 
  Trash2, 
  Eye, 
  CheckCircle 
} from 'lucide-react';

const MyBidsPage = () => {
  const { data: session } = useSession();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (session?.user?.email) {
      fetchMyBids();
    }
  }, [session]);

  const fetchMyBids = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/bids?email=${encodeURIComponent(session?.user?.email)}`);
      const data = await res.json();
      if (data.bids) {
        setBids(data.bids);
      }
    } catch (error) {
      console.error('Failed to load user bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBid = async (id) => {
    if (!confirm('Are you sure you want to withdraw this bid?')) {
      return;
    }

    try {
      const res = await fetch(`/api/bids/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBids((prev) => prev.filter((b) => b._id !== id));
        setMessage('Bid successfully removed');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to remove bid:', error);
    }
  };

  const totalBids = bids.length;
  const pendingBids = bids.filter((b) => b.status === 'pending').length;
  const acceptedBids = bids.filter((b) => b.status === 'accepted').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
          <Gavel className="w-3.5 h-3.5" />
          <span>Buyer Dashboard</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          My Placed Bids &amp; Offers
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your active offers, seller responses, and withdrawn bids across the marketplace.
        </p>
      </div>

      {message && (
        <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl text-xs font-semibold text-green-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold uppercase">Total Offers</span>
          <p className="text-2xl font-black text-gray-900 mt-1">{totalBids}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-amber-600 font-semibold uppercase">Pending Bids</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{pendingBids}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-success font-semibold uppercase">Accepted Bids</span>
          <p className="text-2xl font-black text-success mt-1">{acceptedBids}</p>
        </div>
      </div>

      {/* Bids Data Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400">Loading your bids...</div>
        ) : bids.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-4">Seller Contact</th>
                  <th className="py-3.5 px-4">My Offer</th>
                  <th className="py-3.5 px-4">Placed Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-medium">
                {bids.map((bid) => (
                  <tr key={bid._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={bid.productImage || '/images/thumbnail-row.png'}
                          alt={bid.productTitle}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100"
                        />
                        <div>
                          <Link
                            href={`/products/${bid.productId}`}
                            className="font-bold text-gray-900 hover:text-brand-700 text-sm line-clamp-1"
                          >
                            {bid.productTitle}
                          </Link>
                          {bid.message && (
                            <p className="text-[11px] text-gray-400 italic truncate max-w-xs">
                              &ldquo;{bid.message}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-600">
                      {bid.sellerEmail}
                    </td>
                    <td className="py-4 px-4 font-black text-brand-700 text-sm">
                      ${Number(bid.offerPrice).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-gray-500">
                      {new Date(bid.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`badge ${
                          bid.status === 'accepted'
                            ? 'badge-success'
                            : bid.status === 'rejected'
                            ? 'badge-danger'
                            : 'badge-warning'
                        }`}
                      >
                        {bid.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/products/${bid.productId}`}
                          className="p-1.5 text-gray-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                          title="View Product Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleRemoveBid(bid._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Withdraw Bid"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <Gavel className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">No active bids placed</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              You haven&apos;t offered any bids on products yet. Explore deals and make your first offer!
            </p>
            <Link href="/products" className="mt-4 btn-primary inline-flex py-2 px-5 text-xs font-semibold">
              Explore Deals to Bid
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default MyBidsPage;
