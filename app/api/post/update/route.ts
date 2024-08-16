import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../database';
import { ObjectId } from 'mongodb';
import { promises as fs, constants } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function PATCH(req: NextRequest) {
  try {
    const client = await connectDB;
    const db = client.db('diary');
    const formData = await req.formData();

    const emoji = formData.get('emoji') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const _id = formData.get('_id') as string;
    const date = formData.get('date') ? new Date(formData.get('date') as string) : new Date();
    const utcDate = new Date(date.toISOString());

    if (!_id || typeof _id !== 'string') {
      throw new Error('Invalid or missing _id');
    }
    if (typeof emoji !== 'string' || typeof title !== 'string' || typeof content !== 'string') {
      throw new Error('Invalid or missing required fields');
    }

    const images = formData.getAll('images');
    let imageUrls: string[] = [];

    for (const image of images) {
      if (image && image instanceof File && image.size > 0) {
        const imageExtension = path.extname(image.name);  
        const imageName = `${uuidv4()}${imageExtension}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        try {
          await fs.access(uploadDir, constants.F_OK);
        } catch (error) {
          await fs.mkdir(uploadDir, { recursive: true });
        }

        const imagePath = path.join(uploadDir, imageName);
        const buffer = Buffer.from(await image.arrayBuffer());
        await fs.writeFile(imagePath, buffer);
        imageUrls.push(`/uploads/${imageName}`);
      }
    }

    const result = await db.collection('today').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { emoji, title, content, date: utcDate, imageUrls } }
    );

    console.log('Data updated successfully:', result);

    return NextResponse.json({
      message: "수정 완료",
      imageUrls, 
    });
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ message: 'Failed to update data'}, { status: 500 });
  }
}
