// /app/api/post/write/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../database';

export async function POST(req: NextRequest) {
  try {
    const client = await connectDB;
    const db = client.db('diary');

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const emoji = formData.get('emoji') as string;
    const date = formData.get('date') ? new Date(formData.get('date') as string) : new Date();

    const result = await db.collection('today').insertOne({ emoji, title, content, date });
    console.log('Data inserted successfully:', result);

    return NextResponse.redirect(new URL('/', req.url)); // NextResponse.redirect 사용
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ message: 'Failed to insert data' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
