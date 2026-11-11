import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Bid from '@/models/Bid';
import Product from '@/models/Product';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();

    const bid = await Bid.findById(id);
    if (!bid) {
      return NextResponse.json({ error: 'Bid not found' }, { status: 404 });
    }

    await Product.findByIdAndUpdate(bid.productId, { $inc: { bidCount: -1 } });
    await Bid.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Bid removed successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to remove bid' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();
    const { status } = await request.json();

    const updatedBid = await Bid.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return NextResponse.json({ success: true, bid: updatedBid });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update bid status' },
      { status: 500 }
    );
  }
}
