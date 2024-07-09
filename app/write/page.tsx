// /app/write/page.tsx

import React from 'react';
import Link from 'next/link';

const Write = () => {
    return (
        <div className="flex min-h-screen justify-center p-3 sm:p-6">
            <div className="w-full max-w-lg">
                <h4 className="sr-only">오늘의 일기</h4>
                <form action="/api/post/write" method="POST" className="bg-white rounded-md p-4 sm:p-6">
                    <div className="mb-4">
                        <label htmlFor="emoji" className="block text-sm font-medium text-gray-700">오늘의 기분</label>
                        <select name="emoji" id="emoji" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                            <option value="😄">😄</option>
                            <option value="🥲">🥲</option>
                            <option value="😡">😡</option>
                            <option value="🥳">🥳</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="title" className="sr-only">글 제목</label>
                        <input type="text" id="title" name="title" placeholder="글 제목" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="sr-only">글 내용</label>
                        <textarea id="content" name="content" placeholder="글 내용" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500 h-96"></textarea>
                    </div>
                    <div className="flex sm:flex-row gap-2">
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">저장</button>
                        <Link href="/" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-center">취소</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Write;
