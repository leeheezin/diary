'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cancel from '@/src/components/Cancel';
import DiaryWriteButton from '@/src/components/Header';
import UserGreeting from '@/src/components/UserGreeting';
import SearchBar from '@/src/components/SearchBar';
import DiaryList from '@/src/components/DiaryList';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
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
      const res = await fetch('/api/post/get');
      if (!res.ok) {
        throw new Error('Failed to fetch diary entries');
      }
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching diary entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const res = await fetch('/api/auth/user', { credentials: 'include' });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/post/search?query=${searchTerm}`);
      if (!res.ok) {
        throw new Error('Failed to search');
      }
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      if (!res.ok) {
        throw new Error('Failed to logout');
      }
      setUser(null);
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <main className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      {user ? (
        <>
          <div className='flex'>
            <UserGreeting user={user} handleLogout={handleLogout} />
            <Cancel id={user.userId} />
          </div>
          <h1 className="text-4xl font-bold text-green-600 mb-4">Diary</h1>

          <DiaryWriteButton />

          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
          <DiaryList data={data} loading={loading} />
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <h1 className="text-4xl font-bold text-green-600 mb-4">Welcome to My Diary</h1>
            <p className="text-lg text-gray-700 mb-6">Sign up or log in to start writing your daily diary entries and keep track of your memories!</p>
            <div className="flex gap-4 mb-4">
              <Link href="/login" className="text-blue-500 hover:underline">로그인</Link>
              <Link href="/signup" className="text-blue-500 hover:underline">회원가입</Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
              <FiCheckCircle className="text-green-600 text-4xl mb-4" />
              <h2 className="text-2xl font-bold mb-2">Daily Entries</h2>
              <p className="text-gray-600">Write and save your daily thoughts and experiences.</p>
            </div>
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
              <FiCheckCircle className="text-green-600 text-4xl mb-4" />
              <h2 className="text-2xl font-bold mb-2">Organize Your Thoughts</h2>
              <p className="text-gray-600">Easily search and find past entries to reflect on your memories.</p>
            </div>
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
              <FiCheckCircle className="text-green-600 text-4xl mb-4" />
              <h2 className="text-2xl font-bold mb-2">Stay Consistent</h2>
              <p className="text-gray-600">Keep up with your daily writing habit and never miss a day.</p>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Home;
