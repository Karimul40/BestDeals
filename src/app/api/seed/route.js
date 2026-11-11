import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { initialProducts } from '@/lib/seedData';

export async function GET() {
  try {
    await connectToDatabase();
    const count = await Product.countDocuments();
    
    if (count === 0) {
      await Product.insertMany(initialProducts);
      return NextResponse.json({
        message: 'Successfully seeded database with initial products',
        count: initialProducts.length,
      });
    }

    return NextResponse.json({
      message: 'Database already has products',
      count,
    });
  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to seed database' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    await connectToDatabase();
    await Product.deleteMany({});
    await Product.insertMany(initialProducts);
    return NextResponse.json({
      message: 'Successfully re-seeded database with fresh initial products',
      count: initialProducts.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to re-seed database' },
      { status: 500 }
    );
  }
}
