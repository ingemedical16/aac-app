import AuthGate from "@/components/auth/AuthGate";
import { AppShell } from "@/components/layouts";
import { ViewMode } from "@/types/viewMode";

export default function AdminPage() {
  return (
  
  <AuthGate roles={["ADMIN"]}>
  <AppShell viewMode={ViewMode.DASHBOARD}>
    <div>Admin Page</div>
</AppShell>
</AuthGate>)
}