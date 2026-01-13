import Home from "@/components/Home";
import { AppShell } from "@/components/ux/components/layout/AppShell";

import { ViewMode } from "@/types/viewMode";

export default function LocaleHomePage() {
  return (
    <AppShell asidePolicy="always-open" >
      <Home />
    </AppShell>
  );
}
