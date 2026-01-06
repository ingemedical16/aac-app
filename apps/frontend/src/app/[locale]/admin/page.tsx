import AuthGate from "@/components/auth/AuthGate";

export default function AdminPage() {
  return <AuthGate roles={["ADMIN"]}>
  <div>Admin Area (WIP)</div>;
</AuthGate>
}