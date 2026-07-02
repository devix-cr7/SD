import { useEffect } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { TopNav } from "./components/layout/TopNav";
import { TabBar } from "./components/layout/TabBar";
import { StatusBar } from "./components/layout/StatusBar";
import { Workspace } from "./components/layout/Workspace";
import { CommandPalette } from "./components/layout/CommandPalette";
import { useWorkspace } from "./store/workspace";

export default function App() {
  const locale = useWorkspace((s) => s.locale);

  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.body.classList.toggle("font-ar", locale === "ar");
  }, [locale]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-base text-text-primary">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav />
        <TabBar />
        <Workspace />
        <StatusBar />
      </div>
      <CommandPalette />
    </div>
  );
}
