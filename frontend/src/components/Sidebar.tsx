import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdHome,
  MdMap,
  MdAltRoute,
  MdSecurity,
  MdHistory,
  MdInfo,
  MdMenu
} from "react-icons/md";

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 right-3 z-50 bg-green-900 text-green-500 p-1.5 
        rounded-xl shadow-lg"
      >
        <MdMenu className="text-2xl" />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-40"
        ></div>
      )}
      <aside
        className={`fixed md:static flex flex-col w-64 md:w-64 inset-y-0 left-0 z-50 transform 
        transition-transform duration-300 bg-sr-dark p-4 
        border-r border-white/10 h-screen md:sticky md:top-0 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-center px-1">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10">
              <img src="/logo.svg" alt="Safe Route Logo" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-medium leading-normal">
                Safe Route Ai
              </h1>
            </div>
          </div>
          <nav className="flex flex-col gap-2 mt-4">
            <Link
              to="/"
              className={`flex items-center gap-3 px-3 py-2 rounded-4xl font-extrabold transition-colors ${isActive("/")
                  ? "bg-green-800 border-3xl text-green-500"
                  : "text-gray-400"
                }`}
            >
              <MdHome className={`text-2xl ${isActive("/") ? "fill-current" : ""}`} />
              <p className="text-sm font-medium leading-normal">Home</p>
            </Link>
            <Link
              to="/map"
              className={`flex items-center gap-3 px-3 py-2 rounded-4xl font-extrabold transition-colors ${isActive("/map")
                  ? "bg-green-800 border-3xl text-green-500"
                  : "text-gray-400 hover:bg-white/5"
                }`}
            >
              <MdMap className={`text-2xl ${isActive("/map") ? "fill-current" : ""}`} />
              <p className="text-sm font-medium leading-normal">Plan Route</p>
            </Link>
            <Link
              to="/route-breakdown"
              className={`flex items-center gap-3 px-3 py-2 rounded-4xl font-extrabold transition-colors ${isActive("/route-breakdown")
                  ? "bg-green-800 border-3xl text-green-500"
                  : "text-gray-400 hover:bg-white/5"
                }`}
            >
              <MdAltRoute className={`text-2xl ${isActive("/route-breakdown") ? "fill-current" : ""}`} />
              <p className="text-sm font-medium leading-normal">
                Route Breakdown
              </p>
            </Link>
            <Link
              to="/safety-tips"
              className={`flex items-center gap-3 px-3 py-2 rounded-4xl font-extrabold transition-colors ${isActive("/safety-tips")
                  ? "bg-green-800 border-3xl text-green-500"
                  : "text-gray-400 hover:bg-white/5"
                }`}
            >
              <MdSecurity className={`text-2xl ${isActive("/safety-tips") ? "fill-current" : ""}`} />
              <p className="text-sm font-medium leading-normal">Safety Tips</p>
            </Link>
            <Link
              to="/history"
              className={`flex items-center gap-3 px-3 py-2 rounded-4xl font-extrabold transition-colors ${isActive("/history")
                  ? "bg-green-800 border-3xl text-green-500"
                  : "text-gray-400 hover:bg-white/5"
                }`}
            >
              <MdHistory className={`text-2xl ${isActive("/history") ? "fill-current" : ""}`} />
              <p className="text-sm font-medium leading-normal">History</p>
            </Link>
            <Link
              to="/about"
              className={`flex items-center gap-3 px-3 py-2 rounded-4xl font-extrabold transition-colors ${isActive("/about")
                  ? "bg-green-800 text-green-500"
                  : "text-gray-400 hover:bg-white/5"
                }`}
            >
              <MdInfo className={`text-2xl ${isActive("/about") ? "fill-current" : ""}`} />
              <p className="text-sm font-medium leading-normal">About</p>
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
}

