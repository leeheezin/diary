// /app/api/post/search/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../database';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query');
    const userId = url.searchParams.get('userId'); 
    console.log(query, userId);

    if (!query || !userId) {
      return NextResponse.json({ message: 'Query or userId x' }, { status: 400 });
    }

    const client = await connectDB;
    const db = client.db('diary');

    const result = await db.collection('today').find({
      userId: userId, // 로그인한 사용자의 ID로 필터링
      title: { $regex: `.*${query}.*`, $options: 'i' },
      content: { $regex: `.*${query}.*`, $options: 'i' },
    }).toArray();

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to search' }, { status: 500 });
  }
}
