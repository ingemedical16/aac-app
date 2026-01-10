import AuthGate from "@/components/auth/AuthGate";
import BoardEntry from "@/components/boards/BoardEntry";
import { AppShell } from "@/components/layouts";
import { ViewMode } from "@/types/viewMode";

export default function BoardPage() {
  return (
    <AuthGate>
      <AppShell mode={ViewMode.BOARD}>
  <BoardEntry />
</AppShell>
      
    </AuthGate>
  );
}