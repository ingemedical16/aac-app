"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { withLocale } from "@/lib/navigation/withLocale";

export default function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isReady, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated) {
      router.replace(withLocale(locale, "/login"));
    }
  }, [isReady, isAuthenticated, locale, router]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
}