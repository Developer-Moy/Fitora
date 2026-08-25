"use client";

import React from "react";
import AuthFlowContainer from "@/components/auth/AuthFlowContainer";

export default function LoginPage() {
  return <AuthFlowContainer initialStep="welcome" />;
}