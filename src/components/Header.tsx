import React from "react";
import Link from "next/link";
import { FiEdit } from "react-icons/fi";

interface User {
  user: { userId: string; email: string; username: string };
}

const DiaryWriteButton: React.FC<User> = ({ user }) => (
  <header className="flex items-center gap-2 w-full max-w-2xl mb-2">
    <h1 className="sr-only">일기장</h1>
    <p className="">
      <strong className="text-purple-600">{user.username}</strong>님
    </p>
    <Link href="/write" className="flex gap-1 items-center text-purple-700 hover:underline">
      <div className="">
        오늘의 일기 
      </div>
      <FiEdit/>
    </Link>
  </header>
);

export default DiaryWriteButton;
