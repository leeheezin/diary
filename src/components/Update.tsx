//\src\components\Update.tsx
"use client";
import React from 'react'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

interface UpdateProps {
    editData: {
        _id: string;
        title: string;
        content: string;
        emoji: string;
        date: string;
    };
}

const Update: React.FC<UpdateProps> = ({ editData }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");
    const [emoji, setEmoji] = useState("");
    const router = useRouter();

    useEffect(() => {
        setTitle(editData.title);
        setContent(editData.content);
        setEmoji(editData.emoji);
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        if (name === "title") {
            setTitle(value);
        } else if (name === "content") {
            setContent(value);
        } else if (name === "emoji") {
            setEmoji(value);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const _id = e.target._id.value;
        const title = e.target.title.value;
        const content = e.target.content.value;
        const emoji = e.target.emoji.value;
        const updatedDate = new Date().toISOString();

        try {
            const response = await fetch("/api/post/update", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id, emoji, title, content, date: updatedDate }),
            });

            if (!response.ok) {
                throw new Error("네트워크 응답이 올바르지 않습니다.");
            }
            setMessage("글이 수정되었습니다😊");
            router.push(`/view/${_id}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen justify-center">
            <div className="w-full max-w-2xl">
                <div className='flex justify-between'>
                    <h4 className="sr-only">일기 수정</h4>
                </div>
                <form onSubmit={handleSubmit} className="bg-white rounded-md p-4">
                    <div className="mb-4 flex">
                        <input
                            type="hidden"
                            name="_id"
                            defaultValue={editData._id.toString()}
                        />
                        <label htmlFor="emoji" className="block text-sm font-medium text-gray-700">오늘의 기분</label>
                        <select name="emoji" id="emoji" value={emoji} onChange={handleChange}>
                            <option value="😄">😄</option>
                            <option value="🥲">🥲</option>
                            <option value="😡">😡</option>
                            <option value="😊">😊</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700"></label>
                        <input type="text" id="title" name='title' onChange={handleChange} defaultValue={title} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700"></label>
                        <textarea id="content" name='content' onChange={handleChange} defaultValue={content} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500 h-96"></textarea>
                    </div>
                    <div className="flex gap-1 items-center bg-white">
                        <button onClick={() => router.refresh()} type='submit' className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">저장</button>
                        <Link href={`/view/${editData._id}`} className="mx-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                            취소
                        </Link>
                    </div>
                </form>
                
            </div>
        </div>
    );
};
export default Update;