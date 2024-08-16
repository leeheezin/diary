"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Write = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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

    return (
        <div className="flex min-h-screen justify-center p-3 sm:p-6">
            <div className="w-full max-w-lg">
                <h4 className="sr-only">오늘의 일기</h4>
                <form action="/api/post/write" method="POST" className="bg-white rounded-md p-4 sm:p-6" encType="multipart/form-data">
                    <div className='flex gap-2 items-end justify-between'>
                        <div className="mb-4">
                            <label htmlFor="emoji" className="sr-only">오늘의 기분</label>
                            <select name="emoji" id="emoji" className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                                <option value="😄">😄</option>
                                <option value="🥲">🥲</option>
                                <option value="😡">😡</option>
                                <option value="🥳">🥳</option>
                            </select>
                        </div>
                        <div className="mb-4 flex-auto">
                            <label htmlFor="title" className="sr-only">제목</label>
                            <input type="text" id="title" name="title" placeholder="제목" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>
                    <div className="mb-4 flex gap-4 items-center">
                        <label htmlFor="image" className="sr-only">이미지</label>
                        <input
                            type="file"
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
                                <p className="sr-only">선택된 파일:</p>
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
                                        objectFit="contain"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="close absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 w-5 flex items-center justify-center"
                                    >
                                        x
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
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">저장</button>
                        <Link href="/" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-center">취소</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Write;