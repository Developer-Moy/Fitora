"use client";

import AuthFlowContainer from "@/components/auth/AuthFlowContainer";

export default function LoginPage() {
  return <AuthFlowContainer initialStep="login" />;
}