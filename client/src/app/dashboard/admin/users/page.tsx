"use client";

import {
  Check,
  ChevronDown,
  Eye,
  Search,
  ShieldCheck,
  UserRound,
  UserRoundX,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { IconType } from "react-icons";
import { FiAward, FiShield, FiUser } from "react-icons/fi";

type UserRole = "Member" | "Trainer" | "Admin";
type AccountStatus = "Active" | "Blocked";

type ManagedUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  registered: string;
  initials: string;
};

type MetricCard = {
  label: string;
  value: string;
  icon: IconType;
};

const roleIcons: Record<UserRole, IconType> = {
  Member: FiUser,
  Trainer: FiAward,
  Admin: FiShield,
};

const initialUsers: ManagedUser[] = [
  {
    id: 1,
    name: "Aarav Rahman",
    email: "aarav.rahman@example.com",
    role: "Member",
    status: "Active",
    registered: "Aug 18, 2026",
    initials: "AR",
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    email: "nusrat.jahan@example.com",
    role: "Trainer",
    status: "Active",
    registered: "Aug 16, 2026",
    initials: "NJ",
  },
  {
    id: 3,
    name: "Tanvir Hossain",
    email: "tanvir.hossain@example.com",
    role: "Member",
    status: "Blocked",
    registered: "Aug 12, 2026",
    initials: "TH",
  },
  {
    id: 4,
    name: "Maliha Chowdhury",
    email: "maliha.chowdhury@example.com",
    role: "Member",
    status: "Active",
    registered: "Aug 08, 2026",
    initials: "MC",
  },
  {
    id: 5,
    name: "Fahim Ahmed",
    email: "fahim.ahmed@example.com",
    role: "Admin",
    status: "Active",
    registered: "Jul 29, 2026",
    initials: "FA",
  },
  {
    id: 6,
    name: "Sadia Akter",
    email: "sadia.akter@example.com",
    role: "Trainer",
    status: "Active",
    registered: "Jul 24, 2026",
    initials: "SA",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All statuses" | AccountStatus
  >("All statuses");
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesQuery = `${user.name} ${user.email}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesStatus =
          statusFilter === "All statuses" || user.status === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [query, statusFilter, users],
  );

  const updateUser = (id: number, updates: Partial<ManagedUser>) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id ? { ...user, ...updates } : user,
      ),
    );
    setSelectedUser((currentUser) =>
      currentUser?.id === id ? { ...currentUser, ...updates } : currentUser,
    );
  };

  const metricCards: MetricCard[] = [
    { label: "All Users", value: users.length.toString(), icon: UserRound },
    {
      label: "Active Accounts",
      value: users.filter((user) => user.status === "Active").length.toString(),
      icon: Check,
    },
    {
      label: "Blocked Accounts",
      value: users
        .filter((user) => user.status === "Blocked")
        .length.toString(),
      icon: UserRoundX,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
            Control Center
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
            User Management
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Review members, manage account access, and keep roles up to date.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
          <ShieldCheck className="h-4 w-4 text-white/70" /> Admin access
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        {metricCards.map(({ label, value, icon: MetricIcon }) => {
          return (
            <div
              key={label}
              className="group rounded-2xl border border-white/8 bg-[#0e0f12] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#14151a] hover:shadow-[0_12px_32px_rgba(0,0,0,0.24)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">{label}</span>
                <MetricIcon className="h-5 w-5 text-white/80 transition-colors group-hover:text-white" />
              </div>
              <p className="mt-5 text-2xl font-black text-white">{value}</p>
            </div>
          );
        })}
      </section>

      <section className="group rounded-2xl border border-white/8 bg-[#0e0f12] p-5 transition duration-300 hover:border-white/20 hover:bg-[#14151a] hover:shadow-[0_12px_32px_rgba(0,0,0,0.24)] md:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-lg font-bold text-white">Registered Users</h2>
            <p className="mt-1 text-xs text-white/40">
              {filteredUsers.length} of {users.length} accounts shown
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex min-w-64 items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5">
              <Search className="h-4 w-4 text-white/40" />
              <span className="sr-only">Search users</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name or email"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
              />
            </label>
            <label className="relative flex items-center rounded-lg border border-white/10 bg-black/30">
              <span className="sr-only">Filter by account status</span>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as "All statuses" | AccountStatus,
                  )
                }
                className="appearance-none bg-transparent py-2.5 pl-3 pr-9 text-sm text-white outline-none"
              >
                <option className="bg-[#0e0f12]" value="All statuses">
                  All statuses
                </option>
                <option className="bg-[#0e0f12]" value="Active">
                  Active
                </option>
                <option className="bg-[#0e0f12]" value="Blocked">
                  Blocked
                </option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-white/50" />
            </label>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-190 text-left">
            <thead className="border-b border-white/8 text-[10px] font-bold uppercase tracking-widest text-white/35">
              <tr>
                <th className="pb-4 pr-4">User</th>
                <th className="pb-4 pr-4">Role</th>
                <th className="pb-4 pr-4">Status</th>
                <th className="pb-4 pr-4">Registered</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {filteredUsers.map((user) => {
                const RoleIcon = roleIcons[user.role];
                return (
                  <tr
                    key={user.id}
                    className="group/row transition-colors duration-200 hover:bg-white/[0.035]"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white transition-transform duration-200 group-hover/row:scale-105">
                          {user.initials}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {user.name}
                          </p>
                          <p className="mt-1 text-xs text-white/40">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <label className="relative inline-flex items-center">
                        <span className="sr-only">
                          Change role for {user.name}
                        </span>
                        <RoleIcon className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-white/45" />
                        <select
                          value={user.role}
                          onChange={(event) =>
                            updateUser(user.id, {
                              role: event.target.value as UserRole,
                            })
                          }
                          aria-label={`Change role for ${user.name}`}
                          className="appearance-none rounded-lg border border-white/10 bg-[#15171b] py-2 pl-8 pr-8 text-xs font-bold text-white outline-none transition-colors hover:border-white/25 focus:border-white/45 focus:ring-2 focus:ring-white/10"
                        >
                          <option className="bg-[#0e0f12]">Member</option>
                          <option className="bg-[#0e0f12]">Trainer</option>
                          <option className="bg-[#0e0f12]">Admin</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-white/45" />
                      </label>
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex items-center gap-2 text-xs font-semibold ${user.status === "Active" ? "text-emerald-400" : "text-red-400"}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-400" : "bg-red-400"}`}
                        />
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-sm text-white/50">
                      {user.registered}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                        <button
                          onClick={() =>
                            updateUser(user.id, {
                              status:
                                user.status === "Active" ? "Blocked" : "Active",
                            })
                          }
                          className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300"
                        >
                          {user.status === "Active" ? "Block" : "Unblock"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-sm text-white/40">
              No users match the current filters.
            </div>
          )}
        </div>
      </section>

      {selectedUser && (
        <div className="group rounded-2xl border border-white/8 bg-[#0e0f12] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#14151a] hover:shadow-[0_12px_32px_rgba(0,0,0,0.24)] md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                User Details
              </p>
              <h2 className="mt-2 text-xl font-bold text-white">
                {selectedUser.name}
              </h2>
              <p className="mt-1 text-sm text-white/45">{selectedUser.email}</p>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              aria-label="Close user details"
              className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/35">
                Role
              </p>
              <p className="mt-2 font-semibold text-white">
                {selectedUser.role}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/35">
                Status
              </p>
              <p className="mt-2 font-semibold text-white">
                {selectedUser.status}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/35">
                Registered
              </p>
              <p className="mt-2 font-semibold text-white">
                {selectedUser.registered}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
