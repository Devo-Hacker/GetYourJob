import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileNavDrawer from "./MobileNavDrawer";

function getInitialCollapsed() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("devsphere-sidebar-collapsed") === "true";
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(getInitialCollapsed);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("devsphere-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <div className="min-h-screen w-full bg-[#F4F3FA] dark:bg-[#0d0f1a] flex">
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
      <MobileNavDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
