"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if the user is actually logged in
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      // If no token, kick them back to login
      router.push("/admin/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  if (!user) return <p className="p-10">Checking authorization...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#093461]">Welcome to Docora Admin, {user.name}!</h1>
      
      <button 
        onClick={() => {
          localStorage.clear();
          router.push("/admin/login");
        }}
        className="mt-10 text-red-500 font-bold underline"
      >
        Logout
      </button>
    </div>
  );
}