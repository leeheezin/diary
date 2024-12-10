import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../database';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const client = await connectDB;
    const db = client.db('diary');
    const formData = await req.formData();

    // Get the form data values
    const emoji = formData.get('emoji') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const _id = formData.get('_id') as string;
    const imageUrls = JSON.parse(formData.get('imageUrls') as string);
    const date = formData.get('date') ? new Date(formData.get('date') as string) : new Date();
    const utcDate = new Date(date.toISOString());

    // Debugging logs
    console.log('emoji:', emoji, 'title:', title, 'content:', content);

    // Validate the _id field
    if (!_id || typeof _id !== 'string') {
      throw new Error('Invalid or missing _id');
    }

    if (!ObjectId.isValid(_id)) {
      throw new Error('Invalid ObjectId');
    }

    if (typeof emoji !== 'string' || typeof title !== 'string' || typeof content !== 'string') {
      throw new Error('Invalid or missing required fields');
    }


    // Update the database with new imageUrls and other data
    const updatedData = await db.collection('today').findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: { emoji, title, content, date: utcDate, imageUrls } },
      { returnDocument: 'after' } // 업데이트 후의 데이터를 반환
    );
    
    if (!updatedData.value) {
      throw new Error('Document not found');
    }
    
    console.log('Data updated successfully:', updatedData.value);
    // Respond with success
    return NextResponse.json({
      message: "수정 완료",
      data: updatedData.value,
    });
    
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ message: 'Failed to update data' }, { status: 500 });
  }
}
