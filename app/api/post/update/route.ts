import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../database';
import { ObjectId } from 'mongodb';
import { promises as fs, constants } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

    // Retrieve existing document
    const existingData = await db.collection('today').findOne({ _id: new ObjectId(_id) });

    if (!existingData) {
      throw new Error('Document not found');
    }

    // Handle images
    const images = formData.getAll('images') as File[];
    const deletedImageUrls = formData.getAll('deletedImages') as string[];  // 삭제된 이미지 URLs 받기

    // Initialize the final imageUrls array
    let imageUrls: string[] = [];

    // Filter out the deleted images from the existing data
    if (existingData.imageUrls) {
      imageUrls = existingData.imageUrls.filter((url: string) => !deletedImageUrls.includes(url));
    }

    // Delete the images from the server
    if (deletedImageUrls.length > 0) {
      for (const imageUrl of deletedImageUrls) {
        const filePath = path.join(process.cwd(), 'public', imageUrl);  // 이미지 파일 경로
        try {
          await fs.access(filePath, constants.F_OK); 
          await fs.unlink(filePath);  // 서버에서 이미지 삭제
          console.log(`Deleted image: ${filePath}`);
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }
    }

    console.log('Images:', images);

    // Save the new images to the filesystem
    for (const image of images) {
      if (image && image.size > 0) {
        const imageExtension = path.extname(image.name);  
        const imageName = `${uuidv4()}${imageExtension}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        // Ensure upload directory exists
        try {
          await fs.access(uploadDir, constants.F_OK);
        } catch (error) {
          await fs.mkdir(uploadDir, { recursive: true });
        }

        const imagePath = path.join(uploadDir, imageName);
        const buffer = Buffer.from(await image.arrayBuffer());
        await fs.writeFile(imagePath, new Uint8Array(buffer));  

        imageUrls.push(`/uploads/${imageName}`);
        console.log('Image saved at:', imagePath);
      }
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
