"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

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
  userPlan: string;
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
    const storedToken = localStorage.getItem("fitora_token");
    const hasLegacyFakeToken =
      storedToken === "fitora_master_dev_token" ||
      storedToken === "fitora_branch_dev_token";

    if (hasLegacyFakeToken) {
      localStorage.removeItem("fitora_token");
      localStorage.removeItem("fitora_auth_token");
      localStorage.removeItem("fitora_user");
      localStorage.removeItem("fitora_user_role");
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }

    const isAuth =
      !hasLegacyFakeToken &&
      (localStorage.getItem(STORAGE_KEY_AUTH) === "true" ||
        !!localStorage.getItem("fitora_token") ||
        !!localStorage.getItem("fitora_auth_token") ||
        !!localStorage.getItem("fitora_user"));

    const savedRole = (localStorage.getItem(STORAGE_KEY_ROLE) ||
      localStorage.getItem("fitora_user_role") ||
      "master_admin") as DashboardRole;

    const savedBranch =
      localStorage.getItem(STORAGE_KEY_BRANCH) ||
      localStorage.getItem("fitora_active_branch");

    if (isAuth && savedRole) {
      // eslint-disable-next-line
      setIsAuthenticated(true);
      if (
        ["master_admin", "branch_admin", "premium_user", "free_user"].includes(
          savedRole,
        )
      ) {
        setRoleState(savedRole);
      } else {
        setRoleState("master_admin");
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
    let localUser = null;
    let userPlan = "";
    if (typeof window !== "undefined") {
      try {
        userPlan = localStorage.getItem("fitora_user_plan") || "";
        const stored = localStorage.getItem("fitora_user");
        if (stored) {
          localUser = JSON.parse(stored);
          if (localUser.plan) userPlan = localUser.plan;
        }
      } catch (e) { }
    }

    if (localUser && localUser.name && localUser.email) {
      return {
        name: localUser.name,
        email: localUser.email,
        plan: userPlan || (role === "premium_user" ? "VIP Ultimate" : "Free Pass"),
      };
    }

    switch (role) {
      case "master_admin":
        return {
          name: "Master",
          email: "master@fitora.com",
          plan: "VIP Ultimate",
        };
      case "branch_admin":
        return {
          name: "Rahim Ahmed (Branch Admin)",
          email: "gulshan.admin@fitora.com.bd",
          plan: "VIP Ultimate",
        };
      case "premium_user":
        return {
          name: "Tanvir Hasan (VIP Athlete)",
          email: "tanvir.athlete@gmail.com",
          plan: userPlan || "Pro Athlete",
        };
      case "free_user":
      default:
        return {
          name: "Sabbir Hossain (Free Member)",
          email: "sabbir.member@gmail.com",
          plan: userPlan || "Free Pass",
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
    userPlan: user.plan,
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
      setRole: () => { },
      assignedBranch: "Dhaka - Gulshan-2 Branch (Flagship)",
      setAssignedBranch: () => { },
      userName: "Master",
      userEmail: "master@fitora.com",
      userPlan: "VIP Ultimate",
      isMasterAdmin: true,
      isBranchAdmin: false,
      isPremium: false,
      isFreeUser: false,
      isAuthenticated: false,
      isLoading: false,
      logout: () => { },
    };
  }
  return context;
}
