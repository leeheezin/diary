// /app/api/auth/login.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || '9707846b2b70b6fc378da8c720cd65af9690b93334781ee775b94f2903d9119c12a42aa7aea53de9f76950d2fb072d9427d669bc1f1';

export async function POST(req: NextRequest) {
  try {
    const client = await connectDB;
    const db = client.db('diary');

    const body = await req.json();
    const { email, password } = body;

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    const response = NextResponse.json({ message: 'Login successful' });
    response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600 });

    return response;
  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json({ message: 'Failed to login user' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
