"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { uploadImageToFirebase } from '@/imageUpload';
import { useRouter } from 'next/navigation';

const Write = () => {
    const router = useRouter()
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);  // 업로드 상태 추가

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);

            const newFilePreviews = newFiles.map((file) => URL.createObjectURL(file));
            setPreviewUrls((prevUrls) => [...prevUrls, ...newFilePreviews]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);  // 업로드 중으로 상태 설정

        const uploadedImageUrls: string[] = [];
        for (const file of selectedFiles) {
            const downloadURL = await uploadImageToFirebase(file);  // Firebase에 이미지 업로드
            uploadedImageUrls.push(downloadURL);  // URL 배열에 추가
        }

        // 서버로 데이터를 전송합니다.
        const formData = new FormData(e.target as HTMLFormElement);
        formData.append("imageUrls", JSON.stringify(uploadedImageUrls));  // 이미지 URL 추가

        const response = await fetch('/api/post/write', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            setUploading(false);
            const data = await response.json();  
            const postId = data.insertedId;  
            router.push(`/view/${postId}`);  
        }
    };


    return (
        <div className="flex min-h-screen justify-center p-3 sm:p-6">
            <div className="w-full max-w-lg">
                <h4 className="sr-only">오늘의 일기</h4>
                <form onSubmit={handleSubmit} className="bg-white rounded-md p-4 sm:p-6" encType="multipart/form-data">
                    <div className='flex items-end justify-between gap-2'>
                        <div className="mb-4">
                            <label htmlFor="emoji" className="sr-only">오늘의 기분</label>
                            <select name="emoji" id="emoji" className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                                <option value="😄">😄</option>
                                <option value="🥲">🥲</option>
                                <option value="😡">😡</option>
                                <option value="🥳">🥳</option>
                            </select>
                        </div>
                        <div className="mb-4 w-full">
                            <label htmlFor="title" className="sr-only">제목</label>
                            <input type="text" id="title" name="title" placeholder="제목" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>
                    <div className="mb-4 flex gap-4 items-center">
                        <label htmlFor="image" className="sr-only">이미지</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            id="image"
                            name="image"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label htmlFor="image" className="cursor-pointer inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                            사진 첨부
                        </label>
                        {selectedFiles && (
                            <div className="mt-2">
                                <ul className="list-disc list-inside">
                                    {Array.from(selectedFiles).map((file, index) => (
                                        <li key={index} className="text-sm text-gray-500">{file.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label className="sr-only">미리보기</label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="relative w-full h-32">
                                    <Image
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="sr-only">내용</label>
                        <textarea id="content" name="content" placeholder="내용" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500 h-96"></textarea>
                    </div>
                    <div className="flex sm:flex-row gap-2">
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md" disabled={uploading}>
                            {uploading ? '업로드 중...' : '저장'}
                        </button>
                        <Link href="/" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-center">취소</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Write;
