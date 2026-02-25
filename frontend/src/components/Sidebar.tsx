import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { SidebarLeftIcon } from "hugeicons-react";
import {
  MdHome,
  MdMap,
  MdAltRoute,
  MdSecurity,
  MdHistory,
  MdInfo,
  MdClose,
  MdLogout
} from "react-icons/md";
import LogoutModal from "./layout/LogoutModal";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navItems = [
    { name: "Home", path: "/", icon: MdHome },
    { name: "Plan Route", path: "/map", icon: MdMap },
    { name: "Route Breakdown", path: "/route-breakdown", icon: MdAltRoute },
    { name: "Safety Tips", path: "/safety-tips", icon: MdSecurity },
    { name: "History", path: "/history", icon: MdHistory },
    { name: "About", path: "/about", icon: MdInfo },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 right-4 z-50 bg-white/80 dark:bg-black/40 backdrop-blur-md p-2 rounded-xl shadow-lg border border-gray-200/50 dark:border-white/10 text-gray-800 dark:text-white"
      >
        {open ? <MdClose size={24} /> : <SidebarLeftIcon size={24} />}
      </button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed md:sticky top-0 h-screen w-72 bg-white/80 dark:bg-black/40 backdrop-blur-2xl border-r border-gray-200/50 dark:border-white/10 flex flex-col p-6 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 shadow-2xl md:shadow-none",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header / Logo */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/logo (1).png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              Safe Route AI
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Navigate Safely
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  active
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 font-bold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-green-500/10 rounded-2xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon
                  size={24}
                  className={cn(
                    "transition-transform group-hover:scale-110",
                    active ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400"
                  )}

                />
                <span className="relative z-10">{item.name}</span>
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-green-500"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Profile */}
        <div className="mt-auto pt-6 border-t border-gray-200/50 dark:border-white/10">
          {user && (
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden ring-2 ring-white dark:ring-white/10 shadow-md">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-lg">
                    {user.displayName?.[0] || "U"}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {user.displayName || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => setLogoutModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
          >
            <MdLogout size={24} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
