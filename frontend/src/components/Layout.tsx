import { ReactNode } from "react";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
  showNav?: boolean;
};

export default function Layout({ children, showNav = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {showNav && <Navbar />}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
