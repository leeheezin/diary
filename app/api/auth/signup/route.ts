// /app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../database';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const client = await connectDB;
    const db = client.db('diary');

    const body = await req.json();
    const { email, password, username } = body;

    const user = await db.collection('users').findOne({ email });

    if (user) {
      return NextResponse.json({ message: '이미 가입된 사용자 입니다.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('users').insertOne({ email, password: hashedPassword, username });

    return NextResponse.redirect(new URL('/login', req.url));
  } catch (error) {
    console.error('Error signing up user:', error);
    return NextResponse.json({ message: 'Failed to signup user' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
