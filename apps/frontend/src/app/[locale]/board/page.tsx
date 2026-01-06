import AuthGate from "@/components/auth/AuthGate";
import BoardEntry from "@/components/boards/BoardEntry";

export default function BoardPage() {
  return <AuthGate>
    <BoardEntry />
  </AuthGate>
}