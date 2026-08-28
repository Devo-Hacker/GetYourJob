import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="min-h-screen w-full bg-[#F4F3FA] flex">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
