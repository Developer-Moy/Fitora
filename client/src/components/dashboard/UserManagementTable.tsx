"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  UserRecord,
  INITIAL_BRANCHES,
} from "@/data/dashboardData";
import {
  fetchAllUsers,
  fetchPublicBranches,
  createUserAPI,
  updateUserAPI,
  deleteUserAPI,
  type BranchInfo,
} from "@/services/dashboardService";
import {
  Search,
  Filter,
  Edit3,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Crown,
  User,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  QrCode,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

interface UserManagementTableProps {
  currentRole: string;
  assignedBranch?: string;
}

export default function UserManagementTable({
  currentRole,
  assignedBranch,
}: UserManagementTableProps) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [branches, setBranches] = useState<BranchInfo[]>(INITIAL_BRANCHES);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Add User Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserRecord>>({
    name: "",
    email: "",
    phone: "",
    role: "free_user",
    assignedBranch: "Dhaka - Gulshan-2 Branch (Flagship)",
    plan: "Free Pass",
    status: "active",
    paymentMethod: "None",
  });

  // Success Notification
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  // ── Fetch users from API ──────────────────────────────────────────────────
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    const result = await fetchAllUsers({ limit: 200 });
    if (result) {
      setUsers(result.users);
    } else {
      setFetchError("Could not connect to backend. Showing cached data.");
      // Fallback: leave empty array, UX shows empty state
    }
    setIsLoading(false);
  }, []);

  // ── Fetch branches from API ───────────────────────────────────────────────
  const loadBranches = useCallback(async () => {
    const result = await fetchPublicBranches();
    if (result && result.length > 0) {
      setBranches(result as any);
      setNewUser((prev) => ({ ...prev, assignedBranch: result[0].name }));
    }
    // fallback: keep INITIAL_BRANCHES already set
  }, []);

  useEffect(() => {
    loadUsers();
    loadBranches();
  }, [loadUsers, loadBranches]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter, branchFilter]);


  // Filter Users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery) ||
      user.assignedBranch.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesBranch =
      branchFilter === "all" || user.assignedBranch === branchFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesBranch;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleEditClick = (user: UserRecord) => {
    if (
      user.role === "master_admin" ||
      user.email === "master@fitora.com" ||
      user.id === "USR-1001"
    ) {
      toast.error("Master Admin account is protected and cannot be edited.");
      showToast("Master Admin account is protected and cannot be edited.");
      return;
    }
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (
      editingUser.email === "master@fitora.com" ||
      editingUser.role === "master_admin"
    ) {
      toast.error("Master Admin account cannot be modified.");
      showToast("Master Admin account cannot be modified.");
      setIsEditModalOpen(false);
      return;
    }

    // Optimistic update
    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? editingUser : u)),
    );
    setIsEditModalOpen(false);
    toast.success(`User "${editingUser.name}" details updated successfully!`);
    showToast(`User "${editingUser.name}" details updated successfully!`);

    // Persist to backend
    await updateUserAPI(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      phone: editingUser.phone,
      role: editingUser.role,
      assignedBranch: editingUser.assignedBranch,
      plan: editingUser.plan,
      status: editingUser.status,
      paymentMethod: editingUser.paymentMethod,
      expiryDate: editingUser.expiryDate,
    });
  };

  const handleDeleteUserClick = (user: UserRecord) => {
    if (user.email === "master@fitora.com") {
      toast.error("Master Admin account is permanent and cannot be deleted.");
      showToast("Master Admin account is permanent and cannot be deleted.");
      return;
    }
    setUserToDelete(user);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    // Optimistic remove
    setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    toast.success(`User "${userToDelete.name}" removed from the platform.`);
    showToast(`User "${userToDelete.name}" removed from the platform.`);
    setUserToDelete(null);
    // Persist to backend
    await deleteUserAPI(userToDelete.id);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    if (newUser.role === "master_admin") {
      toast.error("Only one Master Admin account can exist in the platform.");
      return;
    }

    const optimisticUser: UserRecord = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newUser.name!,
      email: newUser.email!,
      phone: newUser.phone!,
      role: (newUser.role as any) || "free_user",
      assignedBranch: newUser.assignedBranch || branches[0]?.name || "Dhaka - Gulshan-2 Branch (Flagship)",
      plan: (newUser.role === "premium_user"
        ? "Pro Athlete"
        : newUser.plan || "Free Pass") as any,
      status: (newUser.status as any) || "active",
      joinDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      totalPaidBDT: newUser.role === "premium_user" ? 4900 : 0,
      paymentMethod: (newUser.paymentMethod as any) || "None",
      attendanceStreakDays: 0,
      lastCheckIn: "Never",
      qrCodeId: `FIT-QR-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    // Optimistic add
    setUsers([optimisticUser, ...users]);
    setIsAddModalOpen(false);
    setNewUser({
      name: "",
      email: "",
      phone: "",
      role: "free_user",
      assignedBranch: branches[0]?.name || "Dhaka - Gulshan-2 Branch (Flagship)",
      plan: "Free Pass",
      status: "active",
    });
    toast.success(`New user "${optimisticUser.name}" created successfully!`);
    showToast(`New user "${optimisticUser.name}" created successfully!`);

    // Persist to backend
    await createUserAPI({
      name: optimisticUser.name,
      email: optimisticUser.email,
      phone: optimisticUser.phone,
      role: optimisticUser.role,
      assignedBranch: optimisticUser.assignedBranch,
      plan: optimisticUser.plan,
      status: optimisticUser.status,
      paymentMethod: optimisticUser.paymentMethod,
    });
  };

  const getRoleBadge = (role: UserRecord["role"]) => {
    switch (role) {
      case "master_admin":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-black shadow-sm">
            <Shield className="w-3 h-3" />
            Master Admin
          </span>
        );
      case "branch_admin":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-white border border-white/20">
            <Building2 className="w-3 h-3 text-white" />
            Branch Admin
          </span>
        );
      case "premium_user":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-white border border-white/30">
            <Crown className="w-3 h-3 text-white" />
            Pro Athlete
          </span>
        );
      case "free_user":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-neutral-950 text-white/50 border border-white/10">
            <User className="w-3 h-3" />
            Free Member
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-full bg-white text-black shadow-2xl border border-white animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-black" />
          <span className="text-xs font-black uppercase tracking-wider">
            {notification}
          </span>
        </div>
      )}

      {/* Control Header & Filters Bar (Homepage Luxury Monochrome) */}
      <div className="p-6 rounded-3xl bg-neutral-950 border border-white/10 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white">
              User & Member Directory
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              Manage accounts, edit roles, and assign nationwide branches across{" "}
              {users.length} registered members.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-gray-100 transition shadow-xl cursor-pointer"
          >
            <span>Add Member</span>
            <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 transition-transform">
              <Plus className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

        {/* Search & Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-white/15 rounded-full text-xs font-medium text-white placeholder:text-white/40 outline-none focus:border-white"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-900 border border-white/15 rounded-full text-xs font-bold text-white outline-none focus:border-white cursor-pointer uppercase"
            >
              <option value="all">All Roles</option>
              <option value="master_admin">Master Admin</option>
              <option value="branch_admin">Branch Admin</option>
              <option value="premium_user">Premium Athlete</option>
              <option value="free_user">Free Member</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-900 border border-white/15 rounded-full text-xs font-bold text-white outline-none focus:border-white cursor-pointer uppercase"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Members</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-900 border border-white/15 rounded-full text-xs font-bold text-white outline-none focus:border-white cursor-pointer truncate uppercase"
            >
              <option value="all">All 64 Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-neutral-950 shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-neutral-900/60 text-white/50 font-black uppercase tracking-widest text-[11px]">
              <th className="py-4 px-5">Member</th>
              <th className="py-4 px-5">Role & Tier</th>
              <th className="py-4 px-5">Assigned Branch</th>
              <th className="py-4 px-5">Payment & Plan</th>
              <th className="py-4 px-5">Attendance</th>
              <th className="py-4 px-5">Status</th>
              <th className="py-4 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-white/40">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-wider">Loading members from backend...</span>
                  </div>
                </td>
              </tr>
            ) : fetchError ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-rose-400 text-xs font-bold uppercase">
                  {fetchError}
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-8 text-center text-white/40 uppercase font-bold"
                >
                  No matching members found.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-neutral-900/40 transition-colors"
                >
                  {/* User Profile */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-black text-xs shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">
                          {user.name}
                        </div>
                        <div className="text-[11px] text-white/50">
                          {user.email} &bull; {user.phone}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-5">{getRoleBadge(user.role)}</td>

                  {/* Branch */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5 font-medium text-white max-w-[200px] truncate">
                      <Building2 className="w-3.5 h-3.5 text-white/40 shrink-0" />
                      <span className="truncate">{user.assignedBranch}</span>
                    </div>
                  </td>

                  {/* Plan & Payment */}
                  <td className="py-4 px-5">
                    <div className="font-bold text-white">{user.plan}</div>
                    <div className="text-[11px] text-white/50">
                      {user.paymentMethod !== "None" ? (
                        <span>
                          ৳{user.totalPaidBDT.toLocaleString()} via{" "}
                          <span className="font-bold text-white">
                            {user.paymentMethod}
                          </span>
                        </span>
                      ) : (
                        "Free Tier / Unpaid"
                      )}
                    </div>
                  </td>

                  {/* Attendance */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1 font-bold text-white">
                      {/* Green number for positive streak */}
                      <span className="text-emerald-400">&#9679;</span>
                      <span className="text-emerald-400 font-black">
                        {user.attendanceStreakDays} Days Streak
                      </span>
                    </div>
                    <div className="text-[10px] text-white/40 font-semibold">
                      Last: {user.lastCheckIn}
                    </div>
                  </td>

                  {/* Status: Green or Red */}
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        user.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {user.status === "active" ? (
                        <UserCheck className="w-3 h-3" />
                      ) : (
                        <UserX className="w-3 h-3" />
                      )}
                      {user.status.toUpperCase()}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    {user.role === "master_admin" ||
                    user.email === "master@fitora.com" ? (
                      <div className="flex items-center justify-end">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-neutral-900 border border-white/20 text-white shadow-sm">
                          <Shield className="w-3 h-3 text-white" />
                          System Master
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="p-2 rounded-full bg-neutral-900 border border-white/15 text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                          title="Edit User Details & Role"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {currentRole === "master_admin" && (
                          <button
                            onClick={() => handleDeleteUserClick(user)}
                            className="p-2 rounded-full bg-neutral-900 border border-white/15 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                            title="Remove User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Footer Controls */}
        {filteredUsers.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs select-none">
            <div className="text-neutral-400 font-medium">
              Showing{" "}
              <strong className="text-white font-bold">
                {(currentPage - 1) * itemsPerPage + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-white font-bold">
                {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
              </strong>{" "}
              of{" "}
              <strong className="text-white font-bold">
                {filteredUsers.length}
              </strong>{" "}
              members
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2 text-neutral-400">
                <span className="text-[11px] font-semibold">Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-neutral-900 border border-white/15 rounded-lg px-2 py-1 text-xs text-white outline-none cursor-pointer focus:border-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-neutral-900 border border-white/15 text-white hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center ${
                        currentPage === pageNum
                          ? "bg-white text-black font-extrabold shadow-md"
                          : "bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white hover:bg-neutral-800"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ),
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-neutral-900 border border-white/15 text-white hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      
      {/* ── DELETE CONFIRMATION MODAL ── */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-neutral-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-black text-rose-500 uppercase tracking-tight">
                Remove User
              </h3>
              <button
                onClick={() => setUserToDelete(null)}
                className="p-2 rounded-full bg-neutral-900 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-300">
              Are you sure you want to completely remove <strong>{userToDelete.name}</strong> from the platform? This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-3 bg-neutral-900 border border-white/15 text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer text-xs uppercase"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="flex-1 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors shadow-lg cursor-pointer text-xs uppercase"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LIVE EDIT USER MODAL (HOMEPAGE LUXURY DARK) ── */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-neutral-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Edit Member & Role Settings
                </h3>
                <p className="text-xs text-white/50">
                  ID: {editingUser.id} &bull; Registered {editingUser.joinDate}
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-full bg-neutral-900 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveEdit}
              className="space-y-4 text-xs font-bold uppercase tracking-wider"
            >
              {/* Full Name */}
              <div>
                <label className="block text-white/50 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-900 border border-white/15 rounded-full text-white outline-none focus:border-white"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/50 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/15 rounded-full text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-white/50 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingUser.phone}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/15 rounded-full text-white outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Role Selection & Assigned Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/50 mb-1.5">
                    Access Role *
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/15 rounded-full text-white outline-none focus:border-white cursor-pointer uppercase font-bold"
                  >
                    <option value="free_user">Free Member (Basic)</option>
                    <option value="premium_user">Premium Athlete (Paid)</option>
                    <option value="branch_admin">
                      Branch Admin (1 Branch)
                    </option>
                    {currentRole === "master_admin" && (
                      <option value="master_admin">Master Admin (Full)</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-white/50 mb-1.5">
                    Assigned Branch *
                  </label>
                  <select
                    value={editingUser.assignedBranch}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        assignedBranch: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/15 rounded-full text-white outline-none focus:border-white cursor-pointer truncate uppercase font-bold"
                  >
                    {INITIAL_BRANCHES.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subscription Plan & Expiry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/50 mb-1.5">
                    Subscription Plan
                  </label>
                  <select
                    value={editingUser.plan}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        plan: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/15 rounded-full text-white outline-none focus:border-white cursor-pointer uppercase font-bold"
                  >
                    <option value="Free Pass">Free Pass (৳0)</option>
                    <option value="Basic Pass">Basic Pass (৳2,500/mo)</option>
                    <option value="Pro Athlete">Pro Athlete (৳4,900/mo)</option>
                    <option value="VIP Ultimate">
                      VIP Ultimate (৳9,900/mo)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/50 mb-1.5">
                    Membership Expiry
                  </label>
                  <input
                    type="date"
                    value={editingUser.expiryDate}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        expiryDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/15 rounded-full text-white outline-none focus:border-white font-bold"
                  />
                </div>
              </div>

              {/* Status & Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/50 mb-1.5">
                    Account Status
                  </label>
                  <select
                    value={editingUser.status}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/15 rounded-full text-white outline-none focus:border-white cursor-pointer uppercase font-bold"
                  >
                    <option value="active">Active (Access Granted)</option>
                    <option value="suspended">Suspended / Banned</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/50 mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={editingUser.paymentMethod}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        paymentMethod: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/15 rounded-full text-white outline-none focus:border-white cursor-pointer uppercase font-bold"
                  >
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Card">Visa / Mastercard</option>
                    <option value="None">None (Free)</option>
                  </select>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-white/20 text-white/60 hover:text-white font-bold transition uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-white text-black font-black uppercase hover:bg-gray-100 transition shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD NEW MEMBER MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-neutral-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Add New Platform Member
                </h3>
                <p className="text-xs text-white/50">
                  Directly register a new member or assign a branch
                  administrator.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full bg-neutral-900 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateUser}
              className="space-y-4 text-xs font-bold uppercase tracking-wider"
            >
              <div>
                <label className="block text-white/50 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asif Mahmud"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-900 border border-white/15 rounded-full text-white outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/50 mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="asif@gmail.com"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/15 rounded-full text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-white/50 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+880 17..."
                    value={newUser.phone}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/15 rounded-full text-white outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/50 mb-1.5">Role *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value as any })
                    }
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/15 rounded-full text-white outline-none focus:border-white cursor-pointer uppercase font-bold"
                  >
                    <option value="free_user">Free Member</option>
                    <option value="premium_user">Premium Athlete</option>
                    <option value="branch_admin">Branch Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/50 mb-1.5">
                    Assigned Branch *
                  </label>
                  <select
                    value={newUser.assignedBranch}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        assignedBranch: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-neutral-900 border border-white/15 rounded-full text-white outline-none focus:border-white cursor-pointer truncate uppercase font-bold"
                  >
                    {INITIAL_BRANCHES.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-white/20 text-white/60 hover:text-white font-bold transition uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-white text-black font-black uppercase hover:bg-gray-100 transition shadow-md cursor-pointer"
                >
                  Create Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
