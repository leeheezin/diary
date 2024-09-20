// /app/api/post/write/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../database';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { promises as fs, constants } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'sdsejkldsddsdsdszdz';

export async function POST(req: NextRequest) {
  try {
    const client = await connectDB;
    const db = client.db('diary');

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const emoji = formData.get('emoji') as string;
    const imageUrls = JSON.parse(formData.get('imageUrls') as string);  // 이미지 URL 파싱
    const date = formData.get('date') ? new Date(formData.get('date') as string) : new Date();
    const utcDate = new Date(date.toISOString());
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.token;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    const userId = decoded.userId;
    
    // DB에 이미지 URL 배열을 함께 저장합니다.
    const result = await db.collection('today').insertOne({
      userId,
      title,
      content,
      emoji,
      date: utcDate,
      imageUrls, 
    });
    
    console.log('Data successfully:', result);
    const insertedId = result.insertedId;
    return NextResponse.json({ insertedId }, { status: 200 });
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ message: 'Failed to insert data' }, { status: 500 });
  }
}
export const runtime = 'nodejs';
