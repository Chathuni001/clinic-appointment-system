"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Stethoscope,
  LogOut,
  HeartPulse,
  ChevronDown,
  Menu
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/admin/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/admin/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Appointments", path: "", icon: Calendar },
    { name: "Doctors", path: "/admin/dashboard/doctors", icon: Stethoscope },
    { name: "Patients", path: "", icon: HeartPulse },
    { name: "Users", path: "", icon: Users },
    {
      name: "Settings",
      icon: Settings,
      children: [
        { name: "Role", path: "/admin/settings/role" },
        { name: "Clinic Settings", path: "/admin/settings/clinic" },
      ],
    },
  ];

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* OVERLAY (mobile) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`w-64 bg-[#093461] text-white flex flex-col fixed h-screen 
        transform transition-transform duration-300 z-50
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-white rounded-xl p-1">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain p-1"
              />
            </div>
            <span className="text-xl tracking-tight">
              <span className="font-bold">Doco</span>
              <span className="font-bold text-[#289276]">ra</span>
              <span>&nbsp; Clinic</span>
            </span>
          </Link>

          {/* close button mobile */}
          <button
            className="md:hidden text-white text-sm"
            onClick={() => setMobileOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;

            // SETTINGS DROPDOWN
            if (item.children) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => setOpenSettings(!openSettings)}
                    className="flex items-center justify-between w-full px-4 py-4 rounded-2xl font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={18} />
                      {item.name}
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        openSettings ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openSettings && (
                    <div className="ml-10 mt-2 space-y-2">
                      {item.children.map((sub) => {
                        const isActive = pathname === sub.path;

                        return (
                          <Link
                            key={sub.name}
                            href={sub.path}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-4 py-2 rounded-xl text-sm transition-all ${
                              isActive
                                ? "bg-[#289276] text-white"
                                : "text-slate-300 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname === item.path;

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-semibold transition-all ${
                  isActive
                    ? "bg-[#289276] text-white shadow-lg shadow-teal-900/20"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-10 py-4 w-full text-red-300 font-semibold hover:bg-red-500/10 rounded-2xl transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 md:ml-64">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 sticky top-0 z-10">
          {/* hamburger */}
          <button
            className="md:hidden text-[#093461]"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </button>

          <div>
            <p className="text-[#093461] font-bold">
              Welcome back, {user?.name}
            </p>
            <p className="text-slate-400 text-xs">
              You are logged in as {user?.role?.name}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full overflow-hidden border relative">
            <Image
              src={user?.image || "/default-user.png"}
              alt="User"
              fill
              className="object-cover"
            />
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-10">{children}</div>
      </main>
    </div>
  );
}
