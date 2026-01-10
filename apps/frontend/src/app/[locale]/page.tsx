import Home from "@/components/Home";
import { AppShell } from "@/components/layouts";
import { ViewMode } from "@/types/viewMode";

export default function LocaleHomePage() {
  return ( <AppShell mode={ViewMode.PUBLIC}>
    <Home />
</AppShell>);
}