// /app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../database';

export async function POST(req: NextRequest) {
  try {
    const client = await connectDB;
    const db = client.db('diary');
    
    const formData = await req.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;

    const user = await db.collection('users').findOne({ email });

    if (user) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    await db.collection('users').insertOne({ email, password, username });

    return NextResponse.redirect(new URL('/login', req.url));
  } catch (error) {
    console.error('Error signing up user:', error);
    return NextResponse.json({ message: 'Failed to signup user' }, { status: 500 });
  }
}

export const runtime = 'nodejs'