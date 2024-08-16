// /app/api/post/write/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../database';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { promises as fs, constants } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

export async function POST(req: NextRequest) {
  try {
    const client = await connectDB;
    const db = client.db('diary');

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const emoji = formData.get('emoji') as string;
    const date = formData.get('date') ? new Date(formData.get('date') as string) : new Date();
    const utcDate = new Date(date.toISOString());
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.token;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    const userId = decoded.userId;

    const images = formData.getAll('image') as File[]; // 여러 이미지를 가져옵니다.
    let imageUrls: string[] = [];
    
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
        await fs.writeFile(imagePath, Buffer.from(await image.arrayBuffer()));
        imageUrls.push(`/uploads/${imageName}`); // 각 이미지 URL을 배열에 추가합니다.
      }
    }
    
    // DB에 이미지 URL 배열을 함께 저장합니다.
    const result = await db.collection('today').insertOne({
      userId,
      title,
      content,
      emoji,
      date: utcDate,
      imageUrls, // 단일 URL 대신 이미지 URL 배열을 저장합니다.
    });
    
    console.log('Data inserted successfully:', result);
    const insertedId = result.insertedId;
    return NextResponse.redirect(new URL(`/view/${insertedId}`, req.url));
    
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ message: '포스트 실패' }, { status: 500 });
  }
}
export const runtime = 'nodejs';
