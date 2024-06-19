// \app\update\[id]\page.tsx

import { ObjectId } from 'mongodb';
import React from 'react';
import Link from 'next/link';
import { connectDB } from '@/app/database';
import Update from '../../../src/components/Update';

interface EditData {
  _id: string;
  title: string;
  content: string;
  emoji: string;
  // 다른 필요한 필드들 추가
}

export default async function UpdatePage({ params }: { params: { id: string } }) {
    const id = params.id;
    const client = await connectDB;
    const db = client.db('diary');

    const data = await db.collection('today').findOne({ _id: new ObjectId(id) });

    if (!data) {
        return <div>데이터를 찾을 수 없습니다</div>; // 데이터가 null인 경우 예외 처리
    }

    const editData: EditData = { 
        _id: data._id.toString(),
        title: data.title,
        content: data.content,
        emoji: data.emoji
        // 다른 필요한 필드들 추가
    };

    

    return (
        <Update editData={editData} />
    );
};
