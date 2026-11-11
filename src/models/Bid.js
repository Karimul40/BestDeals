import mongoose from 'mongoose';

const BidSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productTitle: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    sellerEmail: {
      type: String,
      required: true,
    },
    bidder: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      image: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' },
    },
    offerPrice: {
      type: Number,
      required: [true, 'Offered price is required'],
      min: 1,
    },
    contact: {
      type: String,
      required: [true, 'Contact number is required'],
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Bid || mongoose.model('Bid', BidSchema);
