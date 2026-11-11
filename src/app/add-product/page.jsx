'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  PlusCircle, 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  Image as ImageIcon, 
  DollarSign, 
  MapPin, 
  Phone, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const AddProductPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Brand New');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('+880 1700-123456');
  const [location, setLocation] = useState('Dhaka, Bangladesh');

  const [imageMethod, setImageMethod] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const sampleImages = [
    { label: 'iPhone 15', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800' },
    { label: 'MacBook Pro', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800' },
    { label: 'Sony Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' },
    { label: 'Leather Jacket', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800' },
    { label: 'Bike / Vehicle', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800' },
    { label: 'Office Chair', url: 'https://images.unsplash.com/photo-1580481077195-c3a82145be96?w=800' },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file is too large (max 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !category || !price || !image || !description) {
      setError('Please fill in all required fields and provide a product image');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          price: Number(price),
          condition,
          image,
          description,
          seller: {
            name: session?.user?.name || 'Verified Seller',
            email: session?.user?.email || 'seller@example.com',
            image: session?.user?.image || '/images/thumb-profile.png',
            phone,
            location,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to list product');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/products/${data.product._id}`);
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Seller Listing Form</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Post a New Product Deal
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          List your electronics, clothing, vehicles, or items with photos to receive direct inquiries and buyer bids.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-sm text-green-700">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>Product listed successfully! Redirecting to listing page...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-8">
        
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
            1. Product Specifications
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apple MacBook Air M2 16GB / 512GB Midnight"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 text-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 text-gray-900 font-medium"
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Living">Home &amp; Living</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Books">Books</option>
                <option value="Groceries">Groceries</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Asking Price ($) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 899"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 text-gray-900 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Condition <span className="text-red-500">*</span>
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 text-gray-900 font-medium"
              >
                <option value="Brand New">Brand New</option>
                <option value="Like New">Like New</option>
                <option value="Used - Good">Used - Good</option>
                <option value="Used - Fair">Used - Fair</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Image Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">
              2. Product Image <span className="text-red-500">*</span>
            </h2>

            <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setImageMethod('upload')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                  imageMethod === 'upload' ? 'bg-white shadow-sm text-brand-700 font-bold' : 'text-gray-600'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Computer File
              </button>
              <button
                type="button"
                onClick={() => setImageMethod('url')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                  imageMethod === 'url' ? 'bg-white shadow-sm text-brand-700 font-bold' : 'text-gray-600'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Web URL
              </button>
            </div>
          </div>

          {imageMethod === 'upload' ? (
            <div>
              <label className="border-2 border-dashed border-gray-200 hover:border-brand-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 hover:bg-brand-50/20 transition-all text-center">
                <Upload className="w-8 h-8 text-brand-600 mb-2" />
                <span className="text-sm font-semibold text-gray-800">
                  Click to choose an image from your computer
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Supports JPG, PNG, WebP up to 5MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Paste Image Link (Unsplash, ImgBB, etc.)
              </label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 text-gray-900"
                />
              </div>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Or choose from sample images (1-click):</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleImages.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => setImage(sample.url)}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-brand-50 hover:text-brand-700 text-gray-700 rounded-lg transition-colors border border-gray-200"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {image && (
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-4">
              <img
                src={image}
                alt="Product preview"
                className="w-20 h-20 object-cover rounded-xl border border-gray-200"
              />
              <div>
                <p className="text-xs font-bold text-gray-800">Image Ready</p>
                <p className="text-[11px] text-gray-500 truncate max-w-sm">{image.substring(0, 60)}...</p>
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="text-xs text-red-600 hover:underline mt-1 font-semibold"
                >
                  Remove Image
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Description & Contact */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
            3. Description &amp; Location
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Product Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe condition, specifications, accessories included, reason for selling..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 text-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Location / City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={loading || success}
            className="btn-primary py-3 px-8 text-sm font-bold shadow-lg shadow-brand-700/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? 'Publishing Deal...' : 'Publish Product Deal'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddProductPage;
