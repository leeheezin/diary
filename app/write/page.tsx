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
        <div className="flex min-h-screen justify-center p-6">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-3">
                <h4 className="sr-only">오늘의 일기</h4>
                <form action="/api/post/write" method="POST" className="space-y-6" encType="multipart/form-data">
                    <div className="flex gap-2 justify-between items-center">
                        <div className="grow-[2]">
                            <label htmlFor="emoji" className="sr-only">오늘의 기분</label>
                            <select name="emoji" id="emoji" className="w-full h-full px-3 py-2 bg-purple-100 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400">
                                <option value="😄">😄</option>
                                <option value="🥲">🥲</option>
                                <option value="😡">😡</option>
                                <option value="🥳">🥳</option>
                            </select>
                        </div>
                        <div className="grow-[5]">
                            <label htmlFor="title" className="sr-only">제목</label>
                            <input type="text" id="title" name="title" placeholder="제목" className="w-full h-full px-4 py-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400" />
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <label htmlFor="image" className="sr-only">이미지</label>
                        <input
                            type="file"
                            multiple
                            id="image"
                            name="image"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label htmlFor="image" className="cursor-pointer bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out">
                            사진 첨부
                        </label>
                        {selectedFiles && selectedFiles.length > 0 && (
                            <div className="mt-2 text-sm text-purple-400">
                                <p>선택된 파일:</p>
                                <ul className="list-disc list-inside">
                                    {selectedFiles.map((file, index) => (
                                        <li key={index}>{file.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="sr-only">미리보기</label>
                        <div className="grid grid-cols-3 gap-4">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden">
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
                                        className="absolute top-1 right-1 bg-red-400 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                                    >
                                        x
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="sr-only">내용</label>
                        <textarea id="content" name="content" placeholder="내용" rows={6} className="w-full px-4 py-3 border border-purple-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 h-96"></textarea>
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out">
                            저장
                        </button>
                        <Link href="/" className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-center transition duration-200 ease-in-out">
                            취소
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Write;
