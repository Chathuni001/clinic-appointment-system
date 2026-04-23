"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // For now, we will just log the attempt. 
    // We will connect this to the NestJS Backend in the next step.
    console.log("Logging in with:", { username, password });
    
    if (!username || !password) {
      setError("Please fill in all fields");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="relative w-20 h-20">
              <Image src="/logo_no_bg.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="text-2xl  tracking-tight">
              <span className="font-bold text-[#093461]">Doco</span>
              <span className="font-bold text-[#289276]">ra</span>
              <span className="text-[#093461]">&nbsp; Clinic</span>
            </span>
          </Link>

          <p className="text-slate-500">Enter your credentials to manage the clinic</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-[1rem] shadow-xl shadow-slate-200 border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[#093461] mb-2 ml-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#289276] focus:ring-4 focus:ring-[#289276]/10 outline-none transition-all text-[#093461]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#093461] mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#289276] focus:ring-4 focus:ring-[#289276]/10 outline-none transition-all text-[#093461]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#093461] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#289276] transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}