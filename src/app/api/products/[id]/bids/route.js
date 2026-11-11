import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Bid from '@/models/Bid';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query.productId = id;
    }

    const bids = await Bid.find(query).sort({ offerPrice: -1, createdAt: -1 });

    return NextResponse.json({ success: true, bids, count: bids.length });
  } catch (error) {
    console.error('Bids fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bids' },
      { status: 500 }
    );
  }
}
