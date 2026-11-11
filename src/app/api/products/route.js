import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { initialProducts } from '@/lib/seedData';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Auto-seed if empty
    const totalCount = await Product.countDocuments();
    if (totalCount === 0) {
      await Product.insertMany(initialProducts);
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const condition = searchParams.get('condition') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'newest';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 0;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All' && category !== 'All Categories') {
      query.category = category;
    }

    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low') sortOptions = { price: 1 };
    if (sort === 'price-high') sortOptions = { price: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };

    let dbQuery = Product.find(query).sort(sortOptions);
    if (limit > 0) {
      dbQuery = dbQuery.limit(limit);
    }

    const products = await dbQuery.exec();

    return NextResponse.json({ success: true, products, count: products.length });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ success: true, products: initialProducts, fallback: true });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { title, category, price, condition, image, description, seller } = body;

    if (!title || !category || !price || !image || !description) {
      return NextResponse.json(
        { error: 'Missing required fields (title, category, price, image, description)' },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      title,
      category,
      price: Number(price),
      condition: condition || 'Brand New',
      image,
      description,
      seller: {
        name: seller?.name || 'Anonymous User',
        email: seller?.email || 'user@example.com',
        image: seller?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        phone: seller?.phone || '+880 1700-000000',
        location: seller?.location || 'Dhaka, Bangladesh',
      },
      status: 'available',
      bidCount: 0,
      rating: 5.0,
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Product create error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
