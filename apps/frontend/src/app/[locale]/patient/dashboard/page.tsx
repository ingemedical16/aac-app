import PatientDashboard from "@/components/dashboards/PatientDashboard";
import AuthGate from "@/components/auth/AuthGate";

export default function PatientDashboardPage() {
  return (
    <AuthGate roles={["PATIENT"]}>
      <PatientDashboard />
    </AuthGate>
  );
}