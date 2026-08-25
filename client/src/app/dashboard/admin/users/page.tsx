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
    name: "Master Admin",
    email: "admin@fitora.com",
    role: "Admin",
    status: "Active",
    registered: "Jul 29, 2026",
    initials: "MA",
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
    <div className="space-y-8 select-none font-sans">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-white" />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
              CONTROL CENTER
            </p>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
            USER MANAGEMENT
          </h1>
          <p className="mt-1.5 text-xs text-white/50 font-medium">
            Review members, manage account access, and assign access
            permissions.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 border border-white/10 rounded-full px-4 py-2 bg-neutral-950">
          <ShieldCheck className="h-4 w-4 text-white" />
          <span>ADMINISTRATOR ACCESS</span>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        {metricCards.map(({ label, value, icon: MetricIcon }) => {
          return (
            <div
              key={label}
              className="group rounded-2xl border border-white/10 bg-neutral-950 p-5 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-neutral-900 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                  {label}
                </span>
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <MetricIcon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-black text-white tracking-tight">
                {value}
              </p>
            </div>
          );
        })}
      </section>

      <section className="group rounded-2xl border border-white/10 bg-neutral-950 p-5 transition duration-300 hover:border-white/20 md:p-6 shadow-xl">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center border-b border-white/10 pb-5">
          <div>
            <h2 className="text-base font-black uppercase tracking-wider text-white">
              REGISTERED USERS
            </h2>
            <p className="mt-1 text-xs text-white/40">
              Showing {filteredUsers.length} of {users.length} registered
              accounts
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex min-w-64 items-center gap-2.5 rounded-full border border-white/15 bg-neutral-900 px-4 py-2.5">
              <Search className="h-4 w-4 text-white/40" />
              <span className="sr-only">Search users</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="SEARCH NAME OR EMAIL..."
                className="w-full bg-transparent text-xs font-bold text-white outline-none placeholder:text-white/30 uppercase tracking-wider"
              />
            </label>
            <label className="relative flex items-center rounded-full border border-white/15 bg-neutral-900 px-1">
              <span className="sr-only">Filter by account status</span>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as "All statuses" | AccountStatus,
                  )
                }
                className="appearance-none bg-transparent py-2.5 pl-4 pr-9 text-xs font-extrabold uppercase tracking-wider text-white outline-none cursor-pointer"
              >
                <option
                  className="bg-neutral-950 text-white"
                  value="All statuses"
                >
                  ALL STATUSES
                </option>
                <option className="bg-neutral-950 text-white" value="Active">
                  ACTIVE ONLY
                </option>
                <option className="bg-neutral-950 text-white" value="Blocked">
                  BLOCKED ONLY
                </option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 h-4 w-4 text-white/50" />
            </label>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">
              <tr>
                <th className="pb-4 pr-4">USER</th>
                <th className="pb-4 pr-4">ROLE</th>
                <th className="pb-4 pr-4">STATUS</th>
                <th className="pb-4 pr-4">REGISTERED</th>
                <th className="pb-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => {
                const RoleIcon = roleIcons[user.role];
                return (
                  <tr
                    key={user.id}
                    className="group/row transition-colors duration-200 hover:bg-white/[0.03]"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        {user.email === "admin@fitora.com" ? (
                          <div className="w-9 h-9 rounded-full overflow-hidden border border-white/30 shrink-0 shadow-md">
                            <img src="/coache1.jpg.jpeg" alt="Master Admin" className="w-full h-full object-cover object-top" />
                          </div>
                        ) : (
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black text-xs font-black shrink-0 shadow-md">
                            {user.initials}
                          </span>
                        )}
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-white">
                            {user.name}
                          </p>
                          <p className="mt-0.5 text-xs text-white/40">
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
                        <RoleIcon className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-white/60" />
                        <select
                          value={user.role}
                          onChange={(event) =>
                            updateUser(user.id, {
                              role: event.target.value as UserRole,
                            })
                          }
                          aria-label={`Change role for ${user.name}`}
                          className="appearance-none rounded-full border border-white/15 bg-neutral-900 py-1.5 pl-9 pr-8 text-xs font-bold uppercase tracking-wider text-white outline-none transition-colors hover:border-white/30 cursor-pointer"
                        >
                          <option className="bg-neutral-950">Member</option>
                          <option className="bg-neutral-950">Trainer</option>
                          <option className="bg-neutral-950">Admin</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-white/50" />
                      </label>
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          user.status === "Active"
                            ? "bg-white text-black"
                            : "border border-white/20 text-white/50"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.status === "Active"
                              ? "bg-black"
                              : "bg-white/40"
                          }`}
                        />
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-xs font-medium text-white/50">
                      {user.registered}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-white/70 hover:text-white cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateUser(user.id, {
                              status:
                                user.status === "Active" ? "Blocked" : "Active",
                            })
                          }
                          className="text-xs font-extrabold uppercase tracking-wider text-white/50 hover:text-white cursor-pointer"
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
            <div className="py-12 text-center text-xs font-bold uppercase tracking-wider text-white/40">
              No users match the current filters.
            </div>
          )}
        </div>
      </section>

      {selectedUser && (
        <div className="rounded-2xl border border-white/15 bg-neutral-950 p-6 transition duration-300 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-white" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  USER INSPECTOR DETAILS
                </p>
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">
                {selectedUser.name}
              </h2>
              <p className="mt-1 text-xs text-white/50 font-medium">
                {selectedUser.email}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="px-4 py-1.5 rounded-full border border-white/20 text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black transition cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="grid gap-4 text-xs sm:grid-cols-3 pt-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                ROLE ACCESS
              </p>
              <p className="mt-1.5 font-black uppercase text-white">
                {selectedUser.role}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                ACCOUNT STATUS
              </p>
              <p className="mt-1.5 font-black uppercase text-white">
                {selectedUser.status}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                JOINED DATE
              </p>
              <p className="mt-1.5 font-black uppercase text-white">
                {selectedUser.registered}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
