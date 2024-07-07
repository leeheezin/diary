"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cancel from "@/src/components/Cancel";
import DiaryWriteButton from "@/src/components/Header";
import SearchBar from "@/src/components/SearchBar";
import DiaryList from "@/src/components/DiaryList";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";
import Logout from "@/src/components/Logout";

interface DiaryEntry {
  _id: string;
  title: string;
  content: string;
  emoji: string;
  date: string;
}

interface User {
  userId: string;
  email: string;
  username: string;
}

const Home: React.FC = () => {
  const [data, setData] = useState<DiaryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (user) {
      fetchDiaryEntries();
    }
  }, [user]);

  const fetchDiaryEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/post/get");
      if (!res.ok) {
        throw new Error("Failed to fetch diary entries");
      }
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching diary entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const res = await fetch("/api/auth/user", { credentials: "include" });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setUser(null);
    } finally {
      setCheckingLogin(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/post/search?query=${searchTerm}&userId=${user?.userId}`
      );
      if (!res.ok) {
        throw new Error("Failed to search");
      }
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (confirm("로그아웃 하시겠습니까?")) {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to logout");
        }
        setUser(null);
        router.refresh();
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (checkingLogin) {
    return (
      <main className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      {user ? (
        <>
          <div className="flex items-center w-full p-2 mb-4 justify-between">
            <p className="flex-grow-2 basis-2/3">
              <strong className="text-green-600">{user.username}</strong>님
            </p>
            <div className="flex gap-2 whitespace-nowrap">
              <Logout handleLogout={handleLogout} />
              <Cancel id={user.userId} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            <Link href="/">Diary</Link>
          </h1>
          <DiaryWriteButton />
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
          />
          <DiaryList data={data} loading={loading} />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between text-center mb-8 w-full">
            <h1 className="text-4xl font-bold text-green-600 mb-4">
              <Link href="/">Diary</Link>
            </h1>
            <div className="flex gap-4 font-bold ml-auto">
              <Link href="/login" className="hover:underline">
                로그인
              </Link>
              <Link href="/signup" className="text-gray-400 hover:underline">
                회원가입
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
              <FiCheckCircle className="text-green-600 text-4xl mb-4" />
              <h2 className="text-2xl font-bold mb-2">일상 기록</h2>
              <p className="text-gray-600">
                매일의 생각과 경험을 기록하고 저장하기
              </p>
            </div>
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
              <FiCheckCircle className="text-green-600 text-4xl mb-4" />
              <h2 className="text-2xl font-bold mb-2">생각 정리</h2>
              <p className="text-gray-600">
                과거의 일기를 쉽게 검색하고 추억 돌아보기
              </p>
            </div>
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
              <FiCheckCircle className="text-green-600 text-4xl mb-4" />
              <h2 className="text-2xl font-bold mb-2">꾸준한 습관</h2>
              <p className="text-gray-600">
                매일 일기를 작성하는 습관을 들이기
              </p>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Home;
