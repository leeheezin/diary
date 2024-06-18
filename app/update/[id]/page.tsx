// \app\update\[id]\page.tsx

import { ObjectId } from 'mongodb';
import React from 'react';
import Link from 'next/link';
import { connectDB } from '@/app/database';

export default async function Update({ params }: { params: { id: string } }) {
    const id = params.id;
    const client = await connectDB;
    const db = client.db('diary');

    const diaryItem = await db.collection('today').findOne({ _id: new ObjectId(id) });
    
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-2xl">
                <h4 className="mb-4 text-2xl font-bold">일기 수정</h4>
                <form action={`/api/post/update/${id}`} method='POST' className="bg-white shadow-md rounded-md p-4">
                    <div className="mb-4 flex">
                        <label htmlFor="emoji" className="block text-sm font-medium text-gray-700">오늘의 기분</label>
                        <select name="emoji" id="emoji"  defaultValue={diaryItem?.emoji}>
                            <option value="😄">😄</option>
                            <option value="🥲">🥲</option>
                            <option value="😡">😡</option>
                            <option value="😊">😊</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700"></label>
                        <input type="text" id="title" name='title' defaultValue={diaryItem?.title} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700"></label>
                        <textarea id="content" name='content'  defaultValue={diaryItem?.content} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500"></textarea>
                    </div>
                    <button type='submit' className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">저장</button>
                </form>
                <Link href="/">
                    <div className="text-green-700 rounded-md my-4 hover:underline text-right">목록으로 가기</div>
                </Link>
            </div>
        </div>
    );
};

