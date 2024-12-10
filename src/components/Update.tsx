"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface UpdateProps {
    editData: {
        _id: string;
        title: string;
        content: string;
        emoji: string;
        date: string;
        imageUrls: string[];
    };
}

const Update: React.FC<UpdateProps> = ({ editData }) => {
    const [title, setTitle] = useState(editData.title);
    const [content, setContent] = useState(editData.content);
    const [emoji, setEmoji] = useState(editData.emoji);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>(editData.imageUrls || []);
    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        setTitle(editData.title);
        setContent(editData.content);
        setEmoji(editData.emoji);
        setPreviewUrls(editData.imageUrls || []);
    }, [editData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case 'title':
                setTitle(value);
                break;
            case 'content':
                setContent(value);
                break;
            case 'emoji':
                setEmoji(value);
                break;
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);

            const newFilePreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(prevUrls => [...prevUrls, ...newFilePreviews]);
        }
    };

    const handleRemoveImage = (index: number) => {
        const removedImageUrl = previewUrls[index];
        setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
        setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setDeletedImages(prevImages => [...prevImages, removedImageUrl]);  // 삭제된 이미지 URL 상태에 저장
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_id', editData._id);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('emoji', emoji);
        formData.append('date', new Date().toISOString());

        selectedFiles.forEach(file => {
            formData.append('images', file);
        });
        // 삭제된 이미지 URL도 함께 전송
        deletedImages.forEach(imageUrl => {
            formData.append('deletedImages', imageUrl);
        });
        try {
            const response = await fetch('/api/post/update', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('네트워크 응답이 올바르지 않습니다.');
            }

            const result = await response.json();
            if (result.data) {
                setTitle(result.data.title);
                setContent(result.data.content);
                setEmoji(result.data.emoji);
                setPreviewUrls(result.data.imageUrls || []);
            }

            // 서버에서 반환된 수정된 데이터로 업데이트
            if (result.imageUrls) {
                setPreviewUrls(result.imageUrls);
            }
            router.push(`/view/${editData._id}`);
        } catch (error) {
            console.error('Error:', error);
            setMessage('수정 중 오류가 발생했습니다.');
        }
    };

    
    return (
        <div className="flex min-h-screen justify-center p-6">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-3">
                <h4 className="sr-only">일기 수정</h4>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="gap-2 mb-4 flex items-end justify-between">
                        <div className='grow-[2]'>
                            <label htmlFor="emoji" className="sr-only">오늘의 기분</label>
                            <select name="emoji" id="emoji" value={emoji} onChange={handleChange} className="w-full h-full px-3 py-2 bg-purple-100 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400">
                                <option value="😄">😄</option>
                                <option value="🥲">🥲</option>
                                <option value="😡">😡</option>
                                <option value="🥳">🥳</option>
                            </select>
                        </div>
                        <div className='grow-[5]'>
                            <label htmlFor="title" className="sr-only">제목</label>
                            <input type="text" id="title" name="title" value={title} onChange={handleChange} className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:border-purple-500" placeholder="제목" />
                        </div>
                    </div>
                    <div className="mb-4 flex gap-4 items-center">
                        <label htmlFor="image" className="sr-only">이미지</label>
                        <input type="file" id="image" name="image" multiple onChange={handleFileChange} className="hidden" />
                        <label htmlFor="image" className="whitespace-nowrap cursor-pointer inline-block bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-md">사진 첨부</label>
                        {selectedFiles.length > 0 && (
                            <div className="mt-2">
                                <ul className="list-disc list-inside">
                                    {selectedFiles.map((file, index) => (
                                        <li key={index} className="text-sm text-gray-500">{file.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    { previewUrls ?<div className="mb-4">
                        <label className="sr-only">미리보기</label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="relative w-full h-32">
                                    <Image src={url}
                                        alt={`Preview ${index + 1}`}
                                        layout="fill"
                                        objectFit="contain"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="rounded-md" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="close absolute top-1 right-1 bg-red-400 text-white rounded-full p-1 w-5 flex items-center justify-center"
                                    >
                                        <span className="text-lg">×</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div> : ''}
                    <div className="mb-4">
                        <label htmlFor="content" className="sr-only">내용</label>
                        <textarea id="content" name="content" value={content} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-purple-300 rounded-md resize-none focus:outline-none focus:border-purple-500 h-96" placeholder="내용"></textarea>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md">수정</button>
                        <Link href={`/view/${editData._id}`} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md">취소</Link>
                    </div>
                </form>
                {message && <p className="mt-4 text-purple-600">{message}</p>}
            </div>
        </div>
    );
    
};

export default Update;
