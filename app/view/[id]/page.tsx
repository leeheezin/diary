"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiMiniListBullet } from "react-icons/hi2";
import Image from 'next/image';

const View = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [diaryItem, setDiaryItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDiaryItem = async () => {
      try {
        const response = await fetch(`/api/post/${id}`);
        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다.');
        }
        const data = await response.json();
        setDiaryItem(data);
      } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaryItem();
  }, [id]);

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
      timeZone: 'Asia/Seoul'
    });

    return `${formattedDate} ${formattedTime}`;
  };

  const handleDelete = async () => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      try {
        const response = await fetch('/api/post/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ _id: id }),
        });
        if (!response.ok) {
          throw new Error('삭제 요청이 실패했습니다.');
        }
        router.push('/'); 
      } catch (error) {
        console.error('삭제 중 오류가 발생했습니다:', error);
      } 
    }
  };

  if (loading) return <div className='flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen'>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-3 sm:p-6 bg-purple-50">
      <div className="w-full max-w-2xl flex-grow flex flex-col bg-white rounded-md shadow-md p-6">
        <h4 className="sr-only">일기 보기</h4>
        <div className="mb-4">
          <div className='flex gap-1 items-center'>
            <span className="text-2xl">{diaryItem?.emoji}</span>
            <span>{diaryItem ? formatDate(diaryItem.date) : ''}</span>
            <Link href="/" className='flex-1'>
              <HiMiniListBullet className="ml-auto text-2xl text-purple-700" />
            </Link>
          </div>
          <h2 className="text-xl text-purple-700 font-bold mt-3">{diaryItem?.title}</h2>
        </div>
        {diaryItem?.imageUrls && (
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            {diaryItem.imageUrls.map((imageUrl: string, index: number) => {
              const isWide = index % 3 === 0;
              const isTall = index % 3 === 3; 

              return (
                <div 
                  key={index} 
                  className={`relative ${isWide ? 'col-span-2' : ''} ${isTall ? 'row-span-2' : ''}`}
                  style={{
                    paddingBottom: isWide ? '50%' : isTall ? '200%' : '100%', 
                  }}
                >
                  <Image 
                    src={imageUrl} 
                    alt={`Diary Image ${index + 1}`} 
                    layout="fill" 
                    objectFit="contain" 
                  />
                </div>
              );
            })}
          </div>
        )}
        <p className="text-gray-700">{diaryItem?.content}</p>
        <div className="flex gap-2 mt-10">
          <Link href={`/update/${id}`} className='inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md'>
            수정
          </Link>
          <button 
            onClick={handleDelete} 
            className={`inline-block bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md`}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );

};

export default View;
