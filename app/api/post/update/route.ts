// /app/api/post/update/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../database';
import { ObjectId } from 'mongodb';

interface CustomNextRequest extends NextRequest {
  query: {
    id: string;
  };
}

export async function PATCH(req: CustomNextRequest) {
  try {
    const client = await connectDB;
    const db = client.db('diary');

    // const formData = await req.formData();
    // const title = formData.get('title') as string;
    // const content = formData.get('content') as string;
    // const emoji = formData.get('emoji') as string;

    // const id = req.query.id; 
    const { emoji, title, content, _id } = await req.json(); 

    const result = await db.collection('today').updateOne(
      { _id: new ObjectId(_id) }, 
      { $set: { emoji, title, content } }
    );

    console.log('Data updated successfully:', result);

    return NextResponse.json({
      message: "게시글이 성공적으로 수정되었습니다.",
    });
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ message: 'Failed to update data'}, { status: 500 });
  }
}