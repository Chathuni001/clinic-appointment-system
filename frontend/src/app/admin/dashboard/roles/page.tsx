"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Search,
  Pencil,
  Trash2,
  Loader2,
  X,
  ShieldCheck,
} from "lucide-react";

// --- TYPES ---
type Role = {
  id: number;
  name: string;
};

export default function RolePage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fieldError, setFieldError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingrole, seteditingRole] = useState<Role | null>(
    null
  );

  // Form States
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // const [successMsg, setSuccessMsg] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // --- DATA FETCHING ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // Adjusted to /role to match backend controller
      const res = await fetch(`${apiUrl}/roles`);
      const specData = await res.json();
      setRoles(Array.isArray(specData) ? specData : []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- SEARCH LOGIC ---
  const filteredRole = roles.filter((spec) =>
    spec.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- FORM HANDLERS ---
  const resetForm = () => {
    setName("");
    seteditingRole(null);
    setShowModal(false);
    setFieldError("");
  };

  const handleEdit = (role: Role) => {
    seteditingRole(role);
    setName(role.name);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(""); // Clear previous errors on new submit

    const trimmedName = name.trim();

    // Client-side validation
    if (!trimmedName) {
      setFieldError("Role name is required and cannot be empty.");
      return;
    }

    // ---  Get logged in user ID ---
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser.id;

    setSubmitting(true);
    try {
      const method = editingrole ? "PUT" : "POST";
      const url = editingrole
        ? `${apiUrl}/roles/${editingrole.id}`
        : `${apiUrl}/roles`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          [editingrole ? "updatedById" : "createdById"]: userId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errMsg = errorData.message || "Failed to save";

        // If backend sends 400 or 409, show error UNDER the input
        if (res.status === 400 || res.status === 409) {
          setFieldError(errMsg);
          return; // Stop here, do NOT show SweetAlert
        }

        // For 500 errors or network issues, throw to catch block
        throw new Error(errMsg);
      }

      // Success SweetAlert
      await Swal.fire({
        title: editingrole ? "Updated!" : "Created!",
        text: editingrole
          ? "role has been updated successfully."
          : "New role has been created successfully.",
        icon: "success",
        confirmButtonColor: "#289276",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchData();
      resetForm();
    } catch (err: any) {
      // Unexpected Error SweetAlert
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
      title: '<span style="color: #093461;">REMOVE role?</span>',
      text: "This will permanently remove the role.",
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
        const userId = storedUser.id;

        const res = await fetch(`${apiUrl}/roles/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deletedById: userId }),
        });

        // --- NEW: Handle Response Specifically ---
        const data = await res.json();

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
          // This will catch the ConflictException message from NestJS
          throw new Error(data.message || "Could not delete the record.");
        }
      } catch (err: any) {
        // Show the error message (e.g., "Assigned to 3 doctors") in a red Swal
        Swal.fire({
          title: "Cannot Delete",
          text: err.message,
          icon: "error",
          confirmButtonColor: "#093461",
          customClass: {
            popup: "rounded-[2rem]",
            confirmButton: "rounded-xl px-6 py-3 font-bold",
          },
        });
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-2">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#093461] tracking-tight uppercase">
            Role Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
          Define user roles and manage access permissions across the system
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-[#289276] hover:bg-[#217a63] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-900/10 active:scale-95 flex items-center gap-2 w-fit"
        >
          <ShieldCheck size={18} />
          <span>Add New role</span>
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
            placeholder="Search by name or role..."
            className="w-full pl-14 pr-6 py-3 rounded-2xl bg-white border border-slate-200 focus:border-[#289276] focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-[#093461] shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-200 text-[#093461] text-sm font-bold shadow-sm">
          <ShieldCheck size={18} className="text-[#289276]" />
          <span>Total Roles: {roles.length}</span>
        </div>
      </div>

      {/* MAIN TABLE CONTAINER */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        {/* Added 'no-scrollbar' class and kept height restriction */}
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-350px)]  no-scrollbar">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-[#289276]" size={40} />
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                Fetching role Management...
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-separate border-spacing-0">
              <thead className="sticky top-0 z-10">
                {/* Added sticky top-0 */}
                <tr className="bg-slate-50/90 backdrop-blur-md border-b border-slate-100">
                  <th className="py-3 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    #
                  </th>
                  <th className="py-3 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    Name
                  </th>
                  <th className="py-3 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right border-b border-slate-100">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 ">
                {filteredRole.length > 0 ? (
                  filteredRole.map((role, index) => (
                    <tr
                      key={role.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="py-2 px-8 text-sm font-bold text-slate-400">
                        {(index + 1).toString().padStart(2, "0")}
                      </td>
                      <td className="py-2 px-8">
                        <span className="block text-[#093461] text-md font-bold leading-tight group-hover:text-[#289276] transition-colors">
                          {role.name}
                        </span>
                      </td>
                      <td className="py-2 px-8 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(role)}
                            className="p-2.5 text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-xl transition-all"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(role.id)}
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
                    <td colSpan={3} className="py-10 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                          <Search size={32} />
                        </div>
                        <p className="text-slate-500 font-bold">
                          No results matching
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- MODAL (Add / Edit) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-[#093461]/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full p-10 relative animate-in zoom-in duration-300">
            <button
              onClick={resetForm}
              className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-5 mb-3">
              <div>
                <h2 className="text-xl font-bold text-[#093461] leading-none uppercase">
                  {editingrole ? "Update role" : "Create role"}
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-widest">
                  role Name
                </label>
                <div className="relative">
                  <ShieldCheck
                    className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${
                      fieldError ? "text-red-400" : "text-slate-300"
                    }`}
                    size={18}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldError) setFieldError("");
                    }}
                    placeholder="Administrator"
                    // Dynamic classes for red border on error
                    className={`w-full pl-14 pr-6 py-3 rounded-2xl bg-slate-50 border outline-none transition-all font-bold text-[#093461] ${
                      fieldError
                        ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-[#289276] focus:ring-4 focus:ring-emerald-500/5"
                    }`}
                  />
                </div>

                {/* Inline Error Message */}
                {fieldError && (
                  <p className="text-red-500 text-xs font-bold ml-1 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
                    {fieldError}
                  </p>
                )}
              </div>

              <div className="flex justify-end w-full mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 bg-[#093461] text-white py-3 rounded-[1rem] font-bold shadow-xl shadow-blue-900/20 hover:bg-[#289276] transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>Save role</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
