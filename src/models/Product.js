import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Electronics', 'Fashion', 'Home & Living', 'Groceries', 'Vehicles', 'Books'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: ['Brand New', 'Like New', 'Used - Good', 'Used - Fair'],
      default: 'Brand New',
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    seller: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      image: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' },
      phone: { type: String, default: '+880 1700-000000' },
      location: { type: String, default: 'Dhaka, Bangladesh' },
    },
    status: {
      type: String,
      enum: ['available', 'sold'],
      default: 'available',
    },
    bidCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
