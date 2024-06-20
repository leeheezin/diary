import { ObjectId } from 'mongodb';
import { connectDB } from '../../database';
import Link from 'next/link';
import { HiMiniListBullet } from "react-icons/hi2";

export default async function View({ params }: { params: { id: string } }) {
  const id = params.id;

  const client = await connectDB;
  const db = client.db('diary');

  const diaryItem = await db.collection('today').findOne({ _id: new ObjectId(id) });
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
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-2xl">
        <h4 className="flex items-center gap-1 mb-4 text-2xl font-bold">일기 보기</h4>
        <Link href="/">
          <HiMiniListBullet className="ml-auto text-2xl text-green-700 mt-4" />
        </Link>
        <div className="bg-white shadow-md rounded-md p-4 mb-4">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">{diaryItem?.emoji}</span>
            <span className="text-2xl">{formatDate(diaryItem?.date)}</span>
            <h2 className="text-xl text-green-700 font-bold">{diaryItem?.title}</h2>
          </div>
          <p className="text-gray-700">{diaryItem?.content}</p>
          <Link href={`/update/${id}`} >
            <div className="text-blue-600 hover:underline mt-2">수정</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
