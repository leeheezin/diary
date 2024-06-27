import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ message: 'Logout successful' });
    response.cookies.set('token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 0 });
    return response;
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json({ message: 'Failed to logout user' }, { status: 500 });
  }
}
