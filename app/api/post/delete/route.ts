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

    return NextResponse.json({ message: '게시글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json({ message: 'Failed to delete data' }, { status: 500 });
  }
}
