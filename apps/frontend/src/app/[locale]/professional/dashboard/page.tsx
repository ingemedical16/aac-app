import AuthGate from "@/components/auth/AuthGate";

export default function ProfessionalDashboardPage() {
  return <AuthGate roles={["PROFESSIONAL"]}>
    <div>Professional Dashboard (WIP)</div>
  </AuthGate>;
}