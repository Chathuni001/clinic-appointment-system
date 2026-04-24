"use client";

import { useEffect, useState } from "react";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // --- NEW: Search State ---
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${apiUrl}/doctors`);
      const data = await res.json();
      setDoctors(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // --- NEW: Search Logic ---
  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setName("");
    setSpecialty("");
    setEditingDoctor(null);
    setShowModal(false);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setName(doctor.name);
    setSpecialty(doctor.specialty);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = editingDoctor ? "PUT" : "POST";
      const url = editingDoctor ? `${apiUrl}/doctors/${editingDoctor.id}` : `${apiUrl}/doctors`;
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, specialty }),
      });

      setSuccessMsg(editingDoctor ? "Doctor updated!" : "Doctor added!");
      fetchDoctors();
      resetForm();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this doctor?")) return;
    await fetch(`${apiUrl}/doctors/${id}`, { method: "DELETE" });
    setSuccessMsg("Doctor removed.");
    fetchDoctors();
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="space-y-6 max-h-[calc(100vh-120px)] flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#093461]">Doctor Registry</h1>
          <p className="text-slate-500 text-sm">Manage specialists and their availability.</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-[#289276] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#217a63] transition-all shadow-lg active:scale-95 flex items-center gap-2 shrink-0"
        >
          <span>+ Add Doctor</span>
        </button>
      </div>

      {/* --- NEW: Search Bar --- */}
      <div className="relative">
        <span className="absolute inset-y-0 left-5 flex items-center text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search by name or specialty..."
          className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-[#289276] focus:ring-4 focus:ring-[#289276]/5 outline-none transition-all shadow-sm text-[#093461]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Success Message Banner */}
      {successMsg && (
        <div className="bg-[#289276]/10 text-[#289276] p-4 rounded-xl font-bold text-sm border border-[#289276]/20 animate-bounce">
          {successMsg}
        </div>
      )}

      {/* --- SCROLLABLE TABLE CONTAINER --- */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-50 shrink-0">
          <h3 className="text-xl font-bold text-[#093461]">Registry List</h3>
        </div>

        {/* Scrollable area starts here */}
        <div className="overflow-y-auto max-h-[500px] custom-scrollbar">
          {loading ? (
            <div className="p-20 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#289276]"></div></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#F8FAFC] z-10 shadow-sm">
                <tr>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Doctor</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Specialty</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#093461]/5 rounded-xl flex items-center justify-center font-bold text-[#093461] group-hover:bg-[#289276] group-hover:text-white transition-all">
                            {doctor.name[4]} {/* Just picking a char for icon */}
                          </div>
                          <span className="font-bold text-[#093461]">{doctor.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border border-slate-200">
                          {doctor.specialty}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(doctor)} className="p-2 text-slate-400 hover:text-[#289276] hover:bg-teal-50 rounded-lg">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button onClick={() => handleDelete(doctor.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-20 text-center text-slate-400">No doctors match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals remain the same... (Omitting for brevity, keep your existing Modal code here) */}
      {/* --- MODAL (Add / Edit Doctor) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">
            <button onClick={resetForm} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">✕</button>
            <div className="mb-8">
              <h2 className="text-2xl font-black text-[#093461]">{editingDoctor ? "Edit" : "Add"} Doctor</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none" required />
              <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none" required>
                <option value="">Select Specialty</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Neurologist">Neurologist</option>
              </select>
              <button type="submit" className="w-full bg-[#093461] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-[#289276] transition-all">
                {submitting ? "Saving..." : "Save Doctor"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}