import AuthGate from "@/components/auth/AuthGate";
import UserDashboard from "@/components/dashboards/userDashboard";
import { AppShell } from "@/components/layouts";
import { ViewMode } from "@/types/viewMode";


export default function UserDashboardPage() {
  return (
    <AuthGate roles={["USER"]}>
      <AppShell mode={ViewMode.DASHBOARD}>
  <UserDashboard />
</AppShell>
    </AuthGate>
  );
}
