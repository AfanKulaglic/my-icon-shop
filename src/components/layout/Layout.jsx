import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import MobileNav from "./MobileNav.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col page-gradient-bg">
      {/* Desktop Navbar */}
      <div className="hidden lg:block sticky top-0 z-50 w-full">
        <Navbar />
      </div>
      
      {/* Mobile Navbar */}
      <MobileNav />
      
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
