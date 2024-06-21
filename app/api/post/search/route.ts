// /app/api/post/search/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../database';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query');
    console.log(query);

    if (!query) {
      return NextResponse.json({ message: 'Query parameter is missing' }, { status: 400 });
    }

    const client = await connectDB;

    const db = client.db('diary');

    const result = await db.collection('today').find({
      title: { $regex: `.*${query}.*`, $options: 'i' }, 
      content: { $regex: `.*${query}.*`, $options: 'i' }, 
    }).toArray();

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '실패' }, { status: 500 });
  }
}
