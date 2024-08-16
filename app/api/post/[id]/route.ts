// src/app/api/post/[id]/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '../../../database';
import { ObjectId } from 'mongodb';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const client = await connectDB;
    const db = client.db('diary');
    const diaryItem = await db.collection('today').findOne({ _id: new ObjectId(id) });

    if (!diaryItem) {
      return NextResponse.json({ message: '일기를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(diaryItem);
  } catch (error) {
    console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
