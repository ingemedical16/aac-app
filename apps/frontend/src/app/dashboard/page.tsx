import AuthGate from "@/components/auth/AuthGate";
import { AppShell } from "@/components/layouts";
import { ViewMode } from "@/types/viewMode";

export default function ProfessionalDashboardPage() {
  return (
    <AuthGate roles={["PROFESSIONAL"]}>
      <AppShell viewMode={ViewMode.DASHBOARD}>
        <div>Professional Dashboard (WIP)</div>
      </AppShell>
    </AuthGate>
  );
}
