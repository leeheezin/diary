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

    if (!ObjectId.isValid(_id)) {
      throw new Error('Invalid ObjectId');
    }

    if (typeof emoji !== 'string' || typeof title !== 'string' || typeof content !== 'string') {
      throw new Error('Invalid or missing required fields');
    }

    const images = formData.getAll('images') as File[];
    let imageUrls: string[] = [];

    console.log('Images:', images);

    for (const image of images) {
      if (image && image.size > 0) {
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

        console.log('Image saved at:', imagePath);
      }
    }

    const existingData = await db.collection('today').findOne({ _id: new ObjectId(_id) });
    if (existingData && existingData.imageUrls) {
      imageUrls = [...existingData.imageUrls, ...imageUrls];
    }

    const result = await db.collection('today').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { emoji, title, content, date: utcDate, imageUrls } }
    );

    if (result.matchedCount === 0) {
      throw new Error('Document not found');
    }

    console.log('Data updated successfully:', result);

    return NextResponse.json({
      message: "수정 완료",
      imageUrls, 
    });
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ message: 'Failed to update data' }, { status: 500 });
  }
}
