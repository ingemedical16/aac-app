import AuthGate from "@/components/auth/AuthGate";
import { AppShell } from "@/components/layouts";
import { ViewMode } from "@/types/viewMode";

export default function AdminPage() {
  return (
  
  <AuthGate roles={["ADMIN"]}>
  <AppShell mode={ViewMode.DASHBOARD}>
    <div>Admin Page</div>
</AppShell>
</AuthGate>)
}