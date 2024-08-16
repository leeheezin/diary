// src/components/DiaryItem.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { MouseEvent } from 'react';

interface DiaryItemProps {
  title: string;
  id: string;
  content: string;
  emoji: string;
  date: string;
}

const DiaryItem: React.FC<DiaryItemProps> = ({ title, id, content, emoji, date }) => {
  const router = useRouter();
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const formattedTime = date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return `${formattedDate} ${formattedTime}`;
  };
  
  const handleUpdate = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    router.push(`/update/${id}`)
  }
  return (
    <div className=" bg-white shadow-md rounded-md p-4 mb-4">
      <Link href={`/view/${id}`} className='flex justify-between items-center'>
        <div className='flex flex-col'>
          <h2 className="text-xl mt-2 text-green-700 font-bold">{title}</h2>
          <span>{emoji}</span>
          <p className="text-gray-500">{formatDate(date)}</p>
        </div>
        <div className='flex gap-1 whitespace-nowrap'>
          <button onClick={handleUpdate} className='block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md'>
            <div>수정</div>
          </button>
        </div>
      </Link>
    </div>
  );
};

export default DiaryItem;
