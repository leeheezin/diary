"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        console.log("Login successful:", data);
        if (res.ok) {
            router.push("/");
        } else {
            setError(data.message);
        }
    };

    const closeModal = () => {
        setError("");
    };

    return (
        <div className="flex flex-col min-h-screen px-5 py-8">
            <div className="w-full max-w-sm mx-auto">
                <h1 className="text-3xl font-semibold text-purple-700 text-center mb-8">
                    <Link href="/">Diary</Link>
                </h1>
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-purple-700 mb-4 text-center">로그인</h2>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-purple-500">이메일</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 mt-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                                className="w-full px-4 py-2 mt-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                                required
                            />
                        </div>
                        {error && (
                            <p className="text-purple-500 text-sm mb-4 text-center">
                                이메일 또는 비밀번호가 일치하지 않습니다.
                            </p>
                        )}
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-purple-500 rounded-md hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200 ease-in-out"
                        >
                            로그인
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link href="/signup" className="text-purple-400 hover:text-purple-500">
                            회원가입
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
