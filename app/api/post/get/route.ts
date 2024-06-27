import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../database';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function GET(req: NextRequest) {
  try {
    const client = await connectDB;
    const db = client.db('diary');

    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.token;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
    const userId = decoded.userId;

    const posts = await db.collection('today').find({ userId }).toArray();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}
