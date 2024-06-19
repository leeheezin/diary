import DiaryItem from "@/src/components/DiaryItem";
import { fetchData } from "./api/api";
import Link from 'next/link';

export default async function Home() {
  const data = await fetchData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/write">
        <div className="mb-4 text-green-600 hover:underline">오늘의 일기</div>
      </Link>
      <div className="w-full max-w-2xl">
        {data.length > 0 ? (
          data.map((item: any, index: number) => (
            <DiaryItem key={index} title={item.title} content={item.content} emoji={item.emoji} id={item._id}/>
          ))
        ) : (
          <p className="text-gray-600">등록된 글이 없습니다.</p>
        )}
      </div>
    </main>
  );
}
  