import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Bid from '@/models/Bid';
import Product from '@/models/Product';

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    let query = {};
    if (email) {
      query['bidder.email'] = email.toLowerCase();
    }

    const bids = await Bid.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, bids, count: bids.length });
  } catch (error) {
    console.error('Fetch user bids error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user bids' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { productId, offerPrice, contact, message, bidder } = body;

    if (!productId || !offerPrice || !contact || !bidder?.email) {
      return NextResponse.json(
        { error: 'Product ID, offer price, contact number, and bidder info are required' },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.status === 'sold') {
      return NextResponse.json({ error: 'This product has already been sold' }, { status: 400 });
    }

    const newBid = await Bid.create({
      productId: product._id,
      productTitle: product.title,
      productImage: product.image,
      sellerEmail: product.seller.email,
      bidder: {
        name: bidder.name || 'Anonymous Bidder',
        email: bidder.email.toLowerCase(),
        image: bidder.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(bidder.name || 'User')}&background=7F56D9&color=fff`,
      },
      offerPrice: Number(offerPrice),
      contact,
      message: message || '',
      status: 'pending',
    });

    await Product.findByIdAndUpdate(productId, { $inc: { bidCount: 1 } });

    return NextResponse.json({ success: true, bid: newBid }, { status: 201 });
  } catch (error) {
    console.error('Bid creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to place bid' },
      { status: 500 }
    );
  }
}
