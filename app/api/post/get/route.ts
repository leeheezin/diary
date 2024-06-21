// /app/api/post/get/route.ts

import { NextResponse } from 'next/server';
import { fetchData } from '../../api';

export async function GET() {
  try {
    const data = await fetchData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: '실패'}, { status: 500 });
  }
}
