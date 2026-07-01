import { Sidebar } from "./components/layout/Sidebar";
import { TopNav } from "./components/layout/TopNav";
import { TabBar } from "./components/layout/TabBar";
import { StatusBar } from "./components/layout/StatusBar";
import { Workspace } from "./components/layout/Workspace";
import { CommandPalette } from "./components/layout/CommandPalette";

export default function App() {
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
