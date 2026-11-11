'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Package, 
  PlusCircle, 
  Trash2, 
  CheckCircle, 
  Eye, 
  Gavel 
} from 'lucide-react';

const MyProductsPage = () => {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    if (session?.user?.email) {
      fetchMyProducts();
    }
  }, [session]);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/my-products?email=${encodeURIComponent(session?.user?.email)}`);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to load my products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSold = async (id, currentStatus) => {
    const newStatus = currentStatus === 'sold' ? 'available' : 'sold';
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
        );
        setActionMessage(`Product marked as ${newStatus}`);
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (error) {
      console.error('Toggle status error:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this listing? All placed bids will also be removed.')) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setActionMessage('Product deleted successfully');
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (error) {
      console.error('Delete product error:', error);
    }
  };

  const totalListed = products.length;
  const activeCount = products.filter((p) => p.status === 'available').length;
  const soldCount = products.filter((p) => p.status === 'sold').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Seller Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            My Listed Products
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your active inventory, update statuses, review bids, and remove listings.
          </p>
        </div>

        <Link href="/add-product" className="btn-primary py-2.5 px-5 text-sm font-semibold shrink-0">
          <PlusCircle className="w-4 h-4" />
          <span>Create Product</span>
        </Link>
      </div>

      {actionMessage && (
        <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl text-xs font-semibold text-green-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold uppercase">Total Listed</span>
          <p className="text-2xl font-black text-gray-900 mt-1">{totalListed}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-success font-semibold uppercase">Active Deals</span>
          <p className="text-2xl font-black text-success mt-1">{activeCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-red-500 font-semibold uppercase">Sold Items</span>
          <p className="text-2xl font-black text-red-600 mt-1">{soldCount}</p>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400">Loading your listings...</div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Bids Received</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-medium">
                {products.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || '/images/thumbnail-card.png'}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100"
                        />
                        <div>
                          <Link
                            href={`/products/${item._id}`}
                            className="font-bold text-gray-900 hover:text-brand-700 text-sm line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <span className="text-[11px] text-gray-400">Condition: {item.condition}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-600">
                      {item.category}
                    </td>
                    <td className="py-4 px-4 font-black text-brand-700 text-sm">
                      ${Number(item.price).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-gray-800">
                        <Gavel className="w-3.5 h-3.5 text-brand-600" />
                        {item.bidCount || 0}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`badge ${
                          item.status === 'sold' ? 'badge-danger' : 'badge-success'
                        }`}
                      >
                        {item.status === 'sold' ? 'Sold' : 'Available'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/products/${item._id}`}
                          className="p-1.5 text-gray-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                          title="View Product Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleSold(item._id, item.status)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                            item.status === 'sold'
                              ? 'bg-green-50 text-green-700 hover:bg-green-100'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          }`}
                        >
                          {item.status === 'sold' ? 'Mark Available' : 'Mark Sold'}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(item._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Listing"
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
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">No products listed yet</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              You haven&apos;t listed any items for sale. Start by posting your first product deal!
            </p>
            <Link href="/add-product" className="mt-4 btn-primary inline-flex py-2 px-5 text-xs font-semibold">
              Post Your First Product
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default MyProductsPage;
