'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  RotateCcw, 
  ArrowUpDown,
  Layers,
  CheckCircle2
} from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';

const ProductsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [condition, setCondition] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Vehicles', 'Books'];
  const conditions = ['All', 'Brand New', 'Like New', 'Used - Good', 'Used - Fair'];

  useEffect(() => {
    fetchFilteredProducts();
  }, [category, condition, sort]);

  const fetchFilteredProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category && category !== 'All') params.append('category', category);
      if (condition && condition !== 'All') params.append('condition', condition);
      if (search) params.append('search', search);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sort) params.append('sort', sort);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFilteredProducts();
  };

  const handleResetFilters = () => {
    setCategory('All');
    setCondition('All');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    router.replace('/products');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Title & Breadcrumbs */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Explore All Marketplace Deals
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse verified electronics, fashion, vehicles, and accessories available for purchase and live bidding.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filter */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6 sticky top-28">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-brand-700" />
                <span>Filter Listings</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs text-brand-600 hover:text-brand-800 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      category === cat
                        ? 'bg-brand-50 text-brand-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {category === cat && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Condition
              </h3>
              <div className="space-y-1.5">
                {conditions.map((cond) => (
                  <button
                    key={cond}
                    onClick={() => setCondition(cond)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      condition === cond
                        ? 'bg-brand-50 text-brand-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cond}</span>
                    {condition === cond && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Price Range ($)
              </h3>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800"
                />
              </div>
              <button
                onClick={fetchFilteredProducts}
                className="w-full btn-primary py-2 text-xs font-semibold"
              >
                Apply Price
              </button>
            </div>

          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search within products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-gray-900"
              />
            </form>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <span className="text-xs text-gray-500 font-medium">
                Showing <strong className="text-gray-900">{products.length}</strong> items
              </span>

              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="py-1.5 px-2.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="lg:hidden bg-white p-5 rounded-2xl border border-gray-200 space-y-4 shadow-md">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-bold">Filters</span>
                <button onClick={handleResetFilters} className="text-xs text-brand-600 font-medium">Reset</button>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full text-xs p-2 bg-gray-50 border rounded-lg"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="mt-1 w-full text-xs p-2 bg-gray-50 border rounded-lg"
                >
                  {conditions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Product Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100 p-4"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
              <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900">No products found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No items match your active filters. Try adjusting or resetting your filter criteria.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 btn-secondary py-2 px-4 text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

const ProductsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100 p-4"></div>
            ))}
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
};

export default ProductsPage;
