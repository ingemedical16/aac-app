"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";

/* Dashboards */
import ChildDashboard from "@/components/dashboards/ChildDashboard";
import ParentDashboard from "@/components/dashboards/PatientDashboard";
import LoginPage from "@/components/auth/LoginPage";

/**
 * RoleGate
 * Central routing brain of the application
 */
export default function RoleGate() {
  const router = useRouter();
  const { isReady, isAuthenticated, user } = useAuth();
  const { profile } = useUserProfile();

  /* =========================
     WAIT FOR HYDRATION
  ========================= */
  if (!isReady) {
    return null; // or loading skeleton later
  }

  /* =========================
     NOT AUTHENTICATED
  ========================= */
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  /* =========================
     ROLE-BASED RENDERING
  ========================= */

  // 👶 CHILD (direct access)
  if (user.role === "CHILD") {
    return <ChildDashboard />;
  }

  // 👨‍👩‍👧 PARENT
  if (user.role === "PARENT") {
    // Child profile activated → board
    if (profile.role === "child") {
      return <ChildDashboard />;
    }

    // No child selected → parent dashboard
    return <ParentDashboard />;
  }

  // 🧑‍⚕️ PROFESSIONAL (future)
  if (user.role === "PROFESSIONAL") {
    router.replace("/professional");
    return null;
  }

  // 🛡️ ADMIN (future)
  if (user.role === "ADMIN") {
    router.replace("/admin");
    return null;
  }

  /* =========================
     FALLBACK (safety)
  ========================= */
  return <LoginPage />;
}
