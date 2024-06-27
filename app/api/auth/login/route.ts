// /app/api/auth/login.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function POST(req: NextRequest) {
  try {
    const client = await connectDB;
    const db = client.db('diary');
    
    const formData = await req.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

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

export const config = {
  api: {
    bodyParser: false,
  },
};
