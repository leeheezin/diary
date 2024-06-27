import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../database';
import { ObjectId } from 'mongodb';

export async function DELETE(req: NextRequest) {
  try {
    const { _id } = await req.json();
    const client = await connectDB;
    const db = client.db('diary');

    await db.collection('users').deleteOne({ _id: new ObjectId(_id) });

    const response = NextResponse.json({ message: 'User deleted successfully' });
    response.cookies.set('token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 0 });

    return response;
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 });
  }
}
