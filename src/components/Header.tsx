import React from 'react';
import Link from 'next/link';
import { FiEdit } from 'react-icons/fi';

const DiaryWriteButton: React.FC = () => (
  <header className="flex items-center justify-between w-full max-w-2xl mb-4">
    <h1 className="sr-only">일기장</h1>
    <Link href="/write">
      <div className="flex items-center mb-1 text-green-600 hover:underline">
        오늘의 일기 <FiEdit className="mr-2" />
      </div>
    </Link>
  </header>
);

export default DiaryWriteButton;
