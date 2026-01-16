import AuthGate from "@/components/auth/AuthGate";
import { AppShell } from "@/components/layouts";


export default function ProfessionalDashboardPage() {
  return (
    <AuthGate >
      <AppShell >
        <div>Professional Dashboard (WIP)</div>
      </AppShell>
    </AuthGate>
  );
}
