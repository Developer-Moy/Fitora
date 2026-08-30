"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";

export type DashboardRole =
  | "master_admin"
  | "branch_admin"
  | "premium_user"
  | "free_user";

export interface DashboardUserContextType {
  role: DashboardRole;
  setRole: (role: DashboardRole) => void;
  assignedBranch: string;
  setAssignedBranch: (branch: string) => void;
  userName: string;
  userEmail: string;
  isMasterAdmin: boolean;
  isBranchAdmin: boolean;
  isPremium: boolean;
  isFreeUser: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const STORAGE_KEY_ROLE = "fitora_active_role";
const STORAGE_KEY_BRANCH = "fitora_active_branch";
const STORAGE_KEY_AUTH = "fitora_auth_session";

const DashboardRoleContext = createContext<
  DashboardUserContextType | undefined
>(undefined);

export function DashboardRoleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRoleState] = useState<DashboardRole>("master_admin");
  const [assignedBranch, setAssignedBranchState] = useState<string>(
    "Dhaka - Gulshan-2 Branch (Flagship)",
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const isAuth = localStorage.getItem(STORAGE_KEY_AUTH) === "true";
    const savedRole = localStorage.getItem(
      STORAGE_KEY_ROLE,
    ) as DashboardRole | null;
    const savedBranch = localStorage.getItem(STORAGE_KEY_BRANCH);

    if (isAuth && savedRole) {
      setIsAuthenticated(true);
      if (
        ["master_admin", "branch_admin", "premium_user", "free_user"].includes(
          savedRole,
        )
      ) {
        setRoleState(savedRole);
      }
      if (savedBranch) {
        setAssignedBranchState(savedBranch);
      }
    } else {
      setIsAuthenticated(false);
      if (pathname !== "/dashboard/login") {
        router.replace("/dashboard/login");
      }
    }
    setIsLoading(false);
  }, [router, pathname]);

  const setRole = (newRole: DashboardRole) => {
    setRoleState(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ROLE, newRole);
    }
  };

  const setAssignedBranch = (newBranch: string) => {
    setAssignedBranchState(newBranch);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_BRANCH, newBranch);
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_AUTH);
      localStorage.removeItem(STORAGE_KEY_ROLE);
      localStorage.removeItem(STORAGE_KEY_BRANCH);
    }
    setIsAuthenticated(false);
    router.replace("/dashboard/login");
  };

  const getUserDetails = () => {
    switch (role) {
      case "master_admin":
        return {
          name: "Master",
          email: "master@fitora.com",
        };
      case "branch_admin":
        return {
          name: "Rahim Ahmed (Branch Admin)",
          email: "gulshan.admin@fitora.com.bd",
        };
      case "premium_user":
        return {
          name: "Tanvir Hasan (VIP Athlete)",
          email: "tanvir.athlete@gmail.com",
        };
      case "free_user":
      default:
        return {
          name: "Sabbir Hossain (Free Member)",
          email: "sabbir.member@gmail.com",
        };
    }
  };

  const user = getUserDetails();

  const value: DashboardUserContextType = {
    role,
    setRole,
    assignedBranch,
    setAssignedBranch,
    userName: user.name,
    userEmail: user.email,
    isMasterAdmin: role === "master_admin",
    isBranchAdmin: role === "branch_admin",
    isPremium: role === "premium_user",
    isFreeUser: role === "free_user",
    isAuthenticated,
    isLoading,
    logout,
  };

  return (
    <DashboardRoleContext.Provider value={value}>
      {children}
    </DashboardRoleContext.Provider>
  );
}

export function useDashboardRole(): DashboardUserContextType {
  const context = useContext(DashboardRoleContext);
  if (!context) {
    return {
      role: "master_admin",
      setRole: () => {},
      assignedBranch: "Dhaka - Gulshan-2 Branch (Flagship)",
      setAssignedBranch: () => {},
      userName: "Master",
      userEmail: "master@fitora.com",
      isMasterAdmin: true,
      isBranchAdmin: false,
      isPremium: false,
      isFreeUser: false,
      isAuthenticated: false,
      isLoading: false,
      logout: () => {},
    };
  }
  return context;
}
