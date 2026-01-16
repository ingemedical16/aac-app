import AuthGate from "@/components/auth/AuthGate";
import BoardEntry from "@/components/boards/BoardEntry";
import { AppShell } from "@/components/layouts";


export default function BoardPage() {
  return (
    <AuthGate>
      <AppShell >
        <BoardEntry />
      </AppShell>
    </AuthGate>
  );
}
