'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Gavel, MapPin, Eye, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const {
    _id,
    id,
    title,
    category,
    price,
    condition,
    image,
    seller,
    bidCount = 0,
    rating = 4.8,
    status = 'available',
  } = product;

  const productId = _id || id;
  const isSold = status === 'sold';

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Image & Badges */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        <img
          src={image || '/images/thumbnail-card.png'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status Badge */}
        {isSold ? (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold text-sm px-4 py-1.5 rounded-full shadow-lg tracking-wider uppercase">
              Sold Out
            </span>
          </div>
        ) : (
          /* Category Pill */
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            <span className="bg-white/90 backdrop-blur-md text-brand-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              {category}
            </span>
            {condition && (
              <span className="bg-gray-900/80 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm">
                {condition}
              </span>
            )}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-500 hover:text-red-500 shadow-sm hover:scale-110 active:scale-95 transition-all"
          title="Add to Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Bids Counter Tag */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-1.5">
          <Gavel className="w-3.5 h-3.5 text-brand-600" />
          <span>{bidCount} {bidCount === 1 ? 'Bid' : 'Bids'}</span>
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-semibold text-amber-600 shadow-sm flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{rating}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Seller */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className="flex items-center gap-1 truncate max-w-[140px]">
              <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
              {seller?.location || 'Dhaka, Bangladesh'}
            </span>
            <span className="font-medium text-gray-600 truncate max-w-[100px]">
              {seller?.name}
            </span>
          </div>

          {/* Title */}
          <Link href={`/products/${productId}`}>
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-brand-700 line-clamp-2 transition-colors mb-2">
              {title}
            </h3>
          </Link>
        </div>

        {/* Price & Action Button */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3 mt-3">
          <div>
            <span className="text-[11px] text-gray-500 uppercase tracking-wider block">Price</span>
            <span className="text-xl font-bold text-brand-700 tracking-tight">
              ${Number(price).toLocaleString()}
            </span>
          </div>

          <Link
            href={`/products/${productId}`}
            className="btn-primary py-2 px-4 text-xs font-semibold"
          >
            <Eye className="w-3.5 h-3.5" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
