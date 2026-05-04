"use client";

import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import {
  Search,
  UserPlus,
  Pencil,
  Trash2,
  Stethoscope,
  User,
  Loader2,
  X,
  ChevronDown,
  Camera,
  Upload,
} from "lucide-react";

// --- TYPES ---
type Speciality = {
  id: number;
  name: string;
};

type Doctor = {
  id: number;
  name: string;
  image?: string;
  specialtyId: number;
  specialty: Speciality | null;
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  // Form States
  const [name, setName] = useState("");
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    specialty?: string;
    image?: string;
  }>({});

  // Image Upload States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const resolveImageUrl = (img?: string) => {
    if (!img) return null;

    // normalize Windows paths -> URL paths
    const normalized = img.replace(/\\/g, "/");

    // if already absolute
    if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
      return normalized;
    }

    // join safely
    const base = apiUrl.replace(/\/$/, "");
    const path = normalized.startsWith("/") ? normalized : `/${normalized}`;
    return `${base}${path}`;
  };

  // --- DATA FETCHING ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [docRes, specRes] = await Promise.all([
        fetch(`${apiUrl}/doctors`),
        fetch(`${apiUrl}/specialty`),
      ]);
      const docData = await docRes.json();
      const specData = await specRes.json();

      setDoctors(Array.isArray(docData) ? docData : []);
      setSpecialities(Array.isArray(specData) ? specData : []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- IMAGE HANDLING ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // clear possible image error once user selects a file
      if (errors.image) setErrors((prev) => ({ ...prev, image: undefined }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // --- FORM HANDLERS ---
  const resetForm = () => {
    setName("");
    setSelectedSpecialtyId("");
    setImageFile(null);
    setImagePreview(null);
    setEditingDoctor(null);
    setShowModal(false);
    setErrors({});

    // clear actual input value so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setName(doctor.name);
    setSelectedSpecialtyId(doctor.specialtyId?.toString() || "");

    // ensure we don't accidentally re-upload an old selected file
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    setImagePreview(resolveImageUrl(doctor.image));
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    let hasError = false;
    const newErrors: { name?: string; specialty?: string; image?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Doctor name is required.";
      hasError = true;
    }
    if (!selectedSpecialtyId) {
      newErrors.specialty = "Please select a specialty.";
      hasError = true;
    }

    // Image is REQUIRED only when creating
    if (!editingDoctor && !imageFile) {
      newErrors.image = "Doctor image is required.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser.id || 1; // Fallback if no user in storage

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("specialtyId", selectedSpecialtyId);
      formData.append(
        editingDoctor ? "updatedById" : "createdById",
        userId.toString()
      );

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const method = editingDoctor ? "PUT" : "POST";
      const url = editingDoctor
        ? `${apiUrl}/doctors/${editingDoctor.id}`
        : `${apiUrl}/doctors`;

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save");
      }

      await Swal.fire({
        title: editingDoctor ? "Updated!" : "Registered!",
        text: editingDoctor
          ? "Doctor details updated."
          : "New doctor registered.",
        icon: "success",
        confirmButtonColor: "#289276",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchData();
      resetForm();
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err.message || "An unexpected error occurred.",
        icon: "error",
        confirmButtonColor: "#093461",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '<span style="color: #093461;">REMOVE DOCTOR?</span>',
      text: "This will permanently remove the doctor.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        popup: "rounded-[2rem]",
        confirmButton:
          "bg-[#093461] text-white rounded-xl font-bold px-6 py-3 mx-2",
        cancelButton:
          "bg-white text-[#093461] border-2 border-[#093461] rounded-xl font-bold px-6 py-3 mx-2",
      },
    });

    if (result.isConfirmed) {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = storedUser.id || 1;

        const res = await fetch(`${apiUrl}/doctors/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deletedById: userId }),
        });

        if (res.ok) {
          Swal.fire({
            title: "Removed!",
            text: "The record has been deleted.",
            icon: "success",
            confirmButtonColor: "#289276",
            timer: 2000,
            showConfirmButton: false,
          });
          fetchData();
        } else {
          throw new Error("Failed to delete");
        }
      } catch (err) {
        Swal.fire("Error", "Could not delete the record.", "error");
      }
    }
  };

  // --- SEARCH LOGIC ---
  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-2">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#093461] tracking-tight uppercase">
            Doctor Registry
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage hospital specialists, departments, and medical staff.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-[#289276] hover:bg-[#217a63] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-900/10 active:scale-95 flex items-center gap-2 w-fit"
        >
          <UserPlus size={18} />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* FILTERS & STATS */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name or specialty..."
            className="w-full pl-14 pr-6 py-3 rounded-2xl bg-white border border-slate-200 focus:border-[#289276] focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-[#093461] shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-200 text-[#093461] text-sm font-bold shadow-sm">
          <User size={18} className="text-[#289276]" />
          <span>Total Specialists: {doctors.length}</span>
        </div>
      </div>

      {/* MAIN TABLE */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-350px)]  no-scrollbar">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-[#289276]" size={40} />
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                Fetching Medical Registry...
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-50/90 backdrop-blur-md border-b border-slate-100">
                  <th className="py-4 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    #
                  </th>
                  <th className="py-4 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Profile
                  </th>
                  <th className="py-4 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Name
                  </th>
                  <th className="py-4 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Specialty
                  </th>
                  <th className="py-4 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor, index) => (
                    <tr
                      key={doctor.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="py-4 px-8 text-sm font-bold text-slate-400">
                        {(index + 1).toString().padStart(2, "0")}
                      </td>

                      <td className="py-4 px-8">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-slate-100 flex items-center justify-center">
                          {(() => {
                            const imgSrc = resolveImageUrl(doctor.image);

                            return imgSrc ? (
                              <Image
                                src={imgSrc}
                                alt={doctor.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <User size={20} className="text-slate-300" />
                            );
                          })()}
                        </div>
                      </td>

                      <td className="py-4 px-8">
                        <span className="block text-[#093461] text-md font-bold leading-tight group-hover:text-[#289276] transition-colors">
                          {doctor.name}
                        </span>
                      </td>
                      <td className="py-4 px-8">
                        <span className="font-bold text-xs text-[#093461] px-4 py-2 uppercase group-hover:text-[#289276]">
                          {doctor.specialty?.name}
                        </span>
                      </td>
                      <td className="py-4 px-8 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(doctor)}
                            className="p-2.5 text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-xl transition-all"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(doctor.id)}
                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center">
                      <p className="text-slate-500 font-bold">
                        No results matching
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-[#093461]/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full p-10 relative animate-in zoom-in duration-300">
            <button
              onClick={resetForm}
              className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-5 mb-8">
              <h2 className="text-xl font-bold text-[#093461] leading-none uppercase">
                {editingDoctor ? "Update Doctor" : "Register Doctor"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* PROFESSIONAL IMAGE UPLOADER */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div
                  onClick={triggerFileInput}
                  className="relative group cursor-pointer"
                >
                  <div
                    className={`w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 shadow-xl bg-slate-100 flex items-center justify-center transition-all group-hover:border-[#289276]/30 ${
                      errors.image ? "border-red-500" : "border-slate-50"
                    }`}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        <Camera size={32} strokeWidth={1.5} />
                        <span className="text-[10px] font-black uppercase tracking-tighter mt-1">
                          Add Photo
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] flex items-center justify-center">
                    <Upload className="text-white" size={24} />
                  </div>

                  {/* Plus Badge */}
                  <div className="absolute -bottom-1 -right-1 bg-[#289276] text-white p-2 rounded-2xl shadow-lg border-4 border-white">
                    <Pencil size={14} />
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />

                {errors.image && (
                  <p className="text-red-500 text-[10px] font-bold mt-2">
                    {errors.image}
                  </p>
                )}
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-widest">
                  Legal Full Name
                </label>
                <div className="relative">
                  <User
                    className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${
                      errors.name ? "text-red-400" : "text-slate-300"
                    }`}
                    size={18}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Dr. Alexander Pierce"
                    className={`w-full pl-14 pr-6 py-3.5 rounded-2xl bg-slate-50 border outline-none transition-all font-bold text-[#093461] ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-[#289276] focus:ring-4 focus:ring-emerald-500/5"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-[10px] font-bold ml-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Specialty Dropdown */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-widest">
                  Assigned Specialty
                </label>
                <div className="relative">
                  <Stethoscope
                    className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${
                      errors.specialty ? "text-red-400" : "text-slate-300"
                    }`}
                    size={18}
                  />
                  <select
                    value={selectedSpecialtyId}
                    onChange={(e) => {
                      setSelectedSpecialtyId(e.target.value);
                      if (errors.specialty)
                        setErrors((prev) => ({
                          ...prev,
                          specialty: undefined,
                        }));
                    }}
                    className={`w-full pl-14 pr-10 py-3.5 rounded-2xl bg-slate-50 border outline-none transition-all font-bold text-[#093461] appearance-none ${
                      errors.specialty
                        ? "border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-[#289276] focus:ring-4 focus:ring-emerald-500/5"
                    }`}
                  >
                    <option value="" disabled>
                      Choose specialty...
                    </option>
                    {specialities.map((spec) => (
                      <option key={spec.id} value={spec.id.toString()}>
                        {spec.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                </div>
                {errors.specialty && (
                  <p className="text-red-500 text-[10px] font-bold ml-1">
                    {errors.specialty}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#093461] text-white py-5 rounded-[1.8rem] font-bold shadow-xl shadow-blue-900/20 hover:bg-[#289276] transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95 mt-6"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : editingDoctor ? (
                  "Update Details"
                ) : (
                  "Confirm Registration"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}