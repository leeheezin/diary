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
            <div key={index} className="bg-white shadow-md rounded-md p-4 mb-4">
              <Link href={`/view/${item._id}`}>
                <div>
                  <span>{item.emoji}</span>
                  <h2 className="text-xl text-green-700 font-bold">{item.title}</h2>
                  <p className="text-gray-700">{item.content}</p>
                </div>
              </Link>
              <Link href={`/update/${item._id}`}>
                <div className="text-blue-600 hover:underline mt-2">수정</div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-600">등록된 글이 없습니다.</p>
        )}
      </div>
    </main>
  );
}
  