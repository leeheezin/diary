import React from 'react';
import DiaryItem from '@/src/components/DiaryItem';

interface DiaryEntry {
  _id: string;
  title: string;
  content: string;
  emoji: string;
  date: string;
}

interface DiaryListProps {
  data: DiaryEntry[];
  loading: boolean;
}

const DiaryList: React.FC<DiaryListProps> = ({ data, loading }) => (
  <div className="w-full mt-3">
    {loading ? (
      <p className="text-purple-600">로딩 중...</p>
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
      <p className="text-gray-400">등록된 글이 없습니다.</p>
    )}
  </div>
);

export default DiaryList;
