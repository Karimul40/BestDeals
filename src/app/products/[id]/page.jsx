'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Heart, 
  Gavel, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Star, 
  Share2, 
  ArrowLeft 
} from 'lucide-react';
import BidModal from '@/components/products/BidModal';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidsLoading, setBidsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProductDetails();
    fetchProductBids();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.product) {
        setProduct(data.product);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductBids = async () => {
    try {
      setBidsLoading(true);
      const res = await fetch(`/api/products/${id}/bids`);
      const data = await res.json();
      if (data.bids) {
        setBids(data.bids);
      }
    } catch (error) {
      console.error('Failed to load bids:', error);
    } finally {
      setBidsLoading(false);
    }
  };

  const handleBidClick = () => {
    if (!session) {
      router.push(`/login?callbackUrl=/products/${id}`);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleBidSuccess = (newBid) => {
    setBids((prev) => [newBid, ...prev]);
    setProduct((prev) => ({
      ...prev,
      bidCount: (prev.bidCount || 0) + 1,
    }));
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-700 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-gray-500 font-medium">Loading product details &amp; bids...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">The listing you are looking for may have been removed or sold.</p>
        <Link href="/products" className="btn-primary inline-flex py-2.5 px-6 text-sm">
          Browse All Products
        </Link>
      </div>
    );
  }

  const isSold = product.status === 'sold';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 py-1.5 px-3 rounded-lg border border-gray-200 bg-white"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Link Copied!' : 'Share Listing'}</span>
        </button>
      </div>

      {/* Main 2-Column Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
        
        {/* Left Column: Image Viewer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
            <img
              src={product.image || '/images/thumbnail-details.png'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {isSold && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-red-500 text-white font-black text-lg px-6 py-2 rounded-full uppercase tracking-widest shadow-xl">
                  SOLD OUT
                </span>
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-white/95 backdrop-blur-md text-brand-700 font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
                {product.category}
              </span>
              <span className="bg-gray-900/90 text-white font-semibold text-xs px-3 py-1.5 rounded-full shadow-sm">
                {product.condition}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Listing Details & CTAs */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Rating & Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating || 4.9}</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">Verified Product Listing</span>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-xs text-brand-700 font-semibold bg-brand-50 px-2.5 py-1 rounded-full">
                <Gavel className="w-3.5 h-3.5" />
                <span>{product.bidCount || bids.length || 0} Bids Placed</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
              {product.title}
            </h1>

            {/* Price Box */}
            <div className="p-4 bg-brand-50/50 rounded-2xl border border-brand-100/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block">
                  Asking Price
                </span>
                <span className="text-3xl font-black text-brand-700 tracking-tight">
                  ${Number(product.price).toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 block">Status</span>
                <span className={`badge ${isSold ? 'badge-danger' : 'badge-success'} text-xs font-bold`}>
                  {isSold ? 'Sold' : 'Available for Bidding'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                Item Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                {product.description}
              </p>
            </div>

            {/* Seller Information Card */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Seller Information
              </h4>
              <div className="flex items-center gap-3">
                <img
                  src={product.seller?.image || '/images/thumb-profile.png'}
                  alt={product.seller?.name || 'Seller'}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-500/20"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-gray-900">{product.seller?.name}</p>
                    <ShieldCheck className="w-4 h-4 text-brand-600" title="Verified Seller" />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {product.seller?.location || 'Dhaka, Bangladesh'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-200/60 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{product.seller?.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{product.seller?.phone || '+880 1700-000000'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleBidClick}
              disabled={isSold}
              className="w-full sm:flex-1 btn-primary py-3.5 text-sm font-bold shadow-md shadow-brand-700/20 disabled:bg-gray-300"
            >
              <Gavel className="w-4 h-4" />
              <span>{isSold ? 'Product Sold' : 'Give Seller Your Offered Price (Bid)'}</span>
            </button>

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="w-full sm:w-auto btn-secondary py-3.5 px-5 text-sm font-semibold"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Community Bids Tracking Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <Gavel className="w-5 h-5 text-brand-700" />
              <h3 className="text-xl font-bold text-gray-900">
                Community Bids History
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Transparent log of all active offers submitted by interested buyers for this item.
            </p>
          </div>

          <div className="bg-brand-50 border border-brand-100 px-4 py-2 rounded-xl text-center">
            <span className="text-[11px] text-gray-500 block uppercase font-medium">Total Bids Placed</span>
            <span className="text-lg font-black text-brand-700">{bids.length}</span>
          </div>
        </div>

        {bidsLoading ? (
          <div className="py-8 text-center text-xs text-gray-400">Loading live bids...</div>
        ) : bids.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                  <th className="py-3 px-4 rounded-l-lg">Bidder</th>
                  <th className="py-3 px-4">Offered Price</th>
                  <th className="py-3 px-4">Contact / Note</th>
                  <th className="py-3 px-4">Placed At</th>
                  <th className="py-3 px-4 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-medium">
                {bids.map((bid) => (
                  <tr key={bid._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={bid.bidder?.image || '/images/thumb-profile.png'}
                          alt={bid.bidder?.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{bid.bidder?.name}</p>
                          <p className="text-[11px] text-gray-400">{bid.bidder?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-black text-brand-700 text-sm">
                      ${Number(bid.offerPrice).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-gray-800 font-semibold">{bid.contact}</p>
                      {bid.message && (
                        <p className="text-gray-500 text-[11px] italic truncate max-w-xs">&ldquo;{bid.message}&rdquo;</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {new Date(bid.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <Gavel className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">No bids placed on this item yet</p>
            <p className="text-xs text-gray-500 mt-0.5">Be the first smart shopper to give the seller an offer!</p>
            <button
              onClick={handleBidClick}
              className="mt-4 btn-primary py-2 px-5 text-xs font-semibold"
            >
              Place First Bid
            </button>
          </div>
        )}
      </section>

      {/* Bid Modal */}
      <BidModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBidSuccess={handleBidSuccess}
      />

    </div>
  );
};

export default ProductDetailsPage;
