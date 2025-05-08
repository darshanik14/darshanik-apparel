import { ReactNode } from "react";
import AppHeader from "./AppHeader";
import BottomNavigation from "./BottomNavigation";

interface AppShellProps {
  children: ReactNode;
  showNavBar?: boolean;
}

export default function AppShell({ children, showNavBar = true }: AppShellProps) {
  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <main className="flex-1 overflow-y-auto bg-neutral-100 pb-16">
        {children}
      </main>
      {showNavBar && <BottomNavigation />}
    </div>
  );
}
