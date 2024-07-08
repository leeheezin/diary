// /app/api/post/delete/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/database';
import { ObjectId } from 'mongodb';

export async function DELETE(req: NextRequest) {
  try {
    const { _id } = await req.json();
    const client = await connectDB;
    const db = client.db('diary');

    const result = await db.collection('today').deleteOne({ _id: new ObjectId(_id) });
    console.log(result)

    return NextResponse.json({ message: '성공' });
    // return NextResponse.redirect(new URL('/', req.url));
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json({ message: '실패' }, { status: 500 });
  }
}
