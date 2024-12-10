'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Signup = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      router.push('/');
      alert('회원가입이 완료되었습니다.')
    } catch (err: any) {
      setError(err.message);
      alert('에러입니다. 다시 시도하세요.')
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-5 py-8">
      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-3xl font-semibold text-purple-700 text-center mb-8">
          <Link href="/">Diary</Link>
        </h1>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4 text-center">회원가입</h2>
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="mb-4">
              <label htmlFor="username" className="block text-purple-500">닉네임</label>
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 mt-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-purple-500">이메일</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-purple-500">비밀번호</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200 ease-in-out"
            >
              회원가입
            </button>
          </form>
          <div className="mt-4 text-center">
              <Link href="/login" className="text-purple-400 hover:text-purple-500">
              로그인
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
