// /app/pages/index.tsx
'use client';
import React, { useState, useEffect } from 'react';
import DiaryItem from '@/src/components/DiaryItem';
import Link from 'next/link';
import { FiEdit } from 'react-icons/fi';

interface DiaryEntry {
  _id: string;
  title: string;
  content: string;
  emoji: string;
  date: string;
}

const Home: React.FC = () => {
  const [data, setData] = useState<DiaryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDiaryEntries();
  }, []);

  const fetchDiaryEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/post/get');
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching diary entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/post/search?query=${searchTerm}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <Link href="/write">
        <div className="flex items-center mb-4 text-green-600 hover:underline">
          <FiEdit className="mr-2" /> 오늘의 일기 작성하기
        </div>
      </Link>
      <div className="w-full max-w-2xl mb-4 flex items-center gap-1">
        <input
          type="text"
          placeholder="검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          검색
        </button>
      </div>
      <div className="w-full max-w-2xl">
        {loading ? (
          <p className="text-gray-600">로딩 중...</p>
        ) : data.length > 0 ? (
          data.map((item) => (
            <DiaryItem
              key={item._id}
              title={item.title}
              content={item.content}
              emoji={item.emoji}
              date={item.date}
              id={item._id}
            />
          ))
        ) : (
          <p className="text-gray-600">등록된 글이 없습니다.</p>
        )}
      </div>
    </main>
  );
};

export default Home;
