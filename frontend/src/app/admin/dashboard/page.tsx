"use client";

import {
  CalendarDays,
  UserCog,
  Hourglass,
  Users,
} from "lucide-react";

export default function DashboardOverview() {
  const stats = [
    {
      label: "Total Appointments",
      value: "128",
      icon: CalendarDays,
      color: "bg-blue-500",
    },
    {
      label: "Total Doctors",
      value: "12",
      icon: UserCog,
      color: "bg-[#289276]",
    },
    {
      label: "Pending Requests",
      value: "5",
      icon: Hourglass,
      color: "bg-amber-500",
    },
    {
      label: "Total Patients",
      value: "1,240",
      icon: Users,
      color: "bg-[#093461]",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-[#093461]">
          System Overview
        </h1>
        <p className="text-slate-500 mt-1">
          Real-time statistics for Docora Clinic.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}
              >
                <Icon size={22} />
              </div>

              <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">
                {stat.label}
              </p>

              <h3 className="text-3xl font-black text-[#093461] mt-1">
                {stat.value}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#093461]">
            Recent Appointments
          </h3>
          <button className="text-[#289276] font-bold text-sm hover:underline">
            View All
          </button>
        </div>

        <div className="p-8 text-center text-slate-400 italic">
          Fetching recent appointments from database...
        </div>
      </div>
    </div>
  );
}
