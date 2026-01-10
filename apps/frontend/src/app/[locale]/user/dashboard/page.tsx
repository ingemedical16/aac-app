import AuthGate from "@/components/auth/AuthGate";
import UserDashboard from "@/components/dashboards/userDashboard";
import DashboardLayout from "@/components/layouts/DashboardLayout";


export default function UserDashboardPage() {
  return (
    <AuthGate roles={["USER"]}>
      <DashboardLayout aside={<div>Profiles / Settings</div>}>
        <UserDashboard />
      </DashboardLayout>
    </AuthGate>
  );
}
