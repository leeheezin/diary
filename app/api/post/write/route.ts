// /app/api/post/write/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../database';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || '9707846b2b70b6fc378da8c720cd65af9690b93334781ee775b94f2903d9119c12a42aa7aea53de9f76950d2fb072d9427d669bc1f1';

export async function POST(req: NextRequest) {
  try {
    const client = await connectDB;
    const db = client.db('diary');

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const emoji = formData.get('emoji') as string;
    const date = formData.get('date') ? new Date(formData.get('date') as string) : new Date();
    const utcDate = new Date(date.toISOString());
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.token;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    const userId = decoded.userId;

    const result = await db.collection('today').insertOne({ userId, title, content, emoji, date: utcDate });
    console.log('Data inserted successfully:', result);

    const insertedId = result.insertedId
    return NextResponse.redirect(new URL(`/view/${insertedId}`, req.url));
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ message: 'Failed to insert data' }, { status: 500 });
  }
}

export const runtime = 'nodejs'