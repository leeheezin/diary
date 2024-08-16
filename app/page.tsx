"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cancel from "@/src/components/Cancel";
import DiaryWriteButton from "@/src/components/Header";
import SearchBar from "@/src/components/SearchBar";
import DiaryList from "@/src/components/DiaryList";
import Link from "next/link";
import Logout from "@/src/components/Logout";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import '@/src/styles/Calendar.css'; 

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
  const [filteredData, setFilteredData] = useState<DiaryEntry[]>([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [date, setDate] = useState<Date>(new Date());

  const router = useRouter();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (user) {
      fetchDiaryEntries();
    }
  }, [user]);

  useEffect(() => {
    filterDataByDate(date); 
  }, [date, data]);

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
  const tileContent = ({ date }: { date: Date }) => {
    const formattedDate = formatDate(date);
    const entriesForDate = data.filter(entry => {
      return formatDate(new Date(entry.date)) === formattedDate;
    });

    return (
      <div>
        {entriesForDate.map(entry => (
          <Link key={entry._id} href={`/view/${entry._id}`} className="block text-xs text-gray-500 hover:text-blue-600">
            <span className="ellipsis">{entry.title}</span>
          </Link>
        ))}
      </div>
    );
  };
  
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const filterDataByDate = (selectedDate: Date | Date[]) => {
    const localDate = new Date(selectedDate as Date);
    const offset = localDate.getTimezoneOffset() * 60000;
    const correctedDate = new Date(localDate.getTime() - offset);
    const formattedDate = correctedDate.toISOString().split("T")[0];

    const filtered = data.filter((entry) => entry.date.startsWith(formattedDate));
    setFilteredData(filtered);
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
          <Calendar
            onChange={(newDate) => setDate(newDate as Date)} 
            value={date}
            tileContent={tileContent}
          />
          <DiaryList data={filteredData} loading={loading} /> 
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
          <Calendar
          />
        </>
      )}
    </main>
  );
};

export default Home;
