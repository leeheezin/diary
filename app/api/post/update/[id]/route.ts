// /app/api/post/update/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../database';
import { ObjectId } from 'mongodb';

interface CustomNextRequest extends NextRequest {
  query: {
    id: string;
  };
}

export async function POST(req: CustomNextRequest) {
  try {
    const client = await connectDB;
    const db = client.db('diary');

    const formData = await req.formData();
    // const { emoji, title, content } = Object.fromEntries(formData.entries());
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const emoji = formData.get('emoji') as string;

    const id = req.query.id; 

    const result = await db.collection('today').updateOne(
      { _id: new ObjectId(id) }, 
      { $set: { emoji, title, content } }
    );

    console.log('Data updated successfully:', result);

    return NextResponse.redirect(`/view/${id}`); // 수정 후 홈페이지로 리다이렉트
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ message: 'Failed to update data'}, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
