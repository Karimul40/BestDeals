import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Bid from '@/models/Bid';
import { initialProducts } from '@/lib/seedData';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();

    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    if (!product) {
      const found = initialProducts.find((p, index) => String(index) === id || p.title.toLowerCase().includes(id.toLowerCase()));
      if (found) {
        return NextResponse.json({ success: true, product: { ...found, _id: id } });
      }
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const bidsCount = await Bid.countDocuments({ productId: product._id });
    const productObj = product.toObject();
    productObj.bidCount = Math.max(productObj.bidCount || 0, bidsCount);

    return NextResponse.json({ success: true, product: productObj });
  } catch (error) {
    console.error('Product detail error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();
    const body = await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();

    await Product.findByIdAndDelete(id);
    await Bid.deleteMany({ productId: id });

    return NextResponse.json({ success: true, message: 'Product and associated bids deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
