// src/components/DiaryItem.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";

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
    const handleDeleteBtnClick = async () => {
        try {
          const response = await fetch("/api/post/delete", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id: id }),
          });
          if (!response.ok) {
            throw new Error("네트워크 응답이 올바르지 않습니다.");
          }
          router.refresh();
        } catch (error) {
          console.error(error);
        }
      };
  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-4">
      <Link href={`/view/${id}`}>
        <div>
          <span>{emoji}</span>
          <p className="text-gray-500">{formatDate(date)}</p>
          <h2 className="text-xl text-green-700 font-bold">{title}</h2>
        </div>
      </Link>
      <Link href={`/update/${id}`}>
        <div className="text-blue-600 hover:underline mt-2">수정</div>
      </Link>
      <button onClick={handleDeleteBtnClick}>
        <div className="text-blue-600 hover:underline mt-2">삭제</div>
      </button>
    </div>
  );
};

export default DiaryItem;
