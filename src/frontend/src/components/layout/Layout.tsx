import { Outlet } from "@tanstack/react-router";
import BottomNav from "./BottomNav";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-[1200px] mx-auto px-4 pt-4 pb-24 md:pb-10">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
