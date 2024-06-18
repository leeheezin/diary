// /app/write/page.tsx

import React from 'react';
import Link from 'next/link'
import { TfiWrite } from "react-icons/tfi";
import { HiMiniListBullet } from "react-icons/hi2";

const Write = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-2xl">
                <h4 className="flex items-center gap-1 mb-4 text-2xl font-bold">오늘의 일기<TfiWrite className="font-bold"/></h4>
                <Link href="/"><HiMiniListBullet className="ml-auto text-2xl text-green-700 mt-4"/></Link>
                
                <form action="/api/post/write" method='POST' className="bg-white shadow-md rounded-md p-4">
                    <div className="mb-4 flex">
                        <label htmlFor="emoji" className="block text-sm font-medium text-gray-700">오늘의 기분</label>
                        <select name="emoji" id="emoji">
                            <option value="😄">😄</option>
                            <option value="🥲">🥲</option>
                            <option value="😡">😡</option>
                            <option value="😊">😊</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700"></label>
                        <input type="text" id="title" name='title' placeholder='글 제목' className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700"></label>
                        <textarea id="content" name='content' placeholder='글 내용' rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500"></textarea>
                    </div>
                    <button type='submit' className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">저장</button>
                </form>
            </div>
        </div>
    );
};
export default Write;