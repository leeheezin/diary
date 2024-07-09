import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../database';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || '9707846b2b70b6fc378da8c720cd65af9690b93334781ee775b94f2903d9119c12a42aa7aea53de9f76950d2fb072d9427d669bc1f1';

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
