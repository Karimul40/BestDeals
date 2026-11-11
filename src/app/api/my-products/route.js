import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    let query = {};
    if (email) {
      query['seller.email'] = email.toLowerCase();
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, products, count: products.length });
  } catch (error) {
    console.error('Fetch my-products error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch seller products' },
      { status: 500 }
    );
  }
}
