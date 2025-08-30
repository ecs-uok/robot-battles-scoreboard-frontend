import { Link, useLocation } from "react-router-dom";
import { ReactNode, useState } from "react";

// You can import a logo if you have one, e.g.:
// import Logo from "../assets/Images/logo.png";

export default function Navbar({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = [
    { to: "/Admin/NewGame", label: "New Game" },
    { to: "/Admin/ControlPanel", label: "Control Panel" },
    { to: "/Admin/AddPoints", label: "Add Points" },
    { to: "/Admin/GameHistory", label: "Game History" },
    { to: "/Admin/Draw", label: "Bracket" },
    { to: "/Admin/ManageTeams", label: "Manage Teams" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg shadow-xl border-b border-blue-100">
      <nav className="flex items-center justify-between px-2 py-1 md:px-8 h-16 relative">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          {/* <img src={Logo} alt="Logo" className="h-9 w-9 rounded-full shadow" /> */}
          <span className="text-2xl md:text-3xl font-extrabold tracking-widest text-blue-700 drop-shadow select-none font-custom">
            ADMIN PANEL
          </span>
        </div>
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-3 py-2 rounded-lg font-bold text-base transition-all duration-150
                ${
                  location.pathname === link.to
                    ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg scale-105"
                    : "text-blue-900 hover:bg-blue-100 hover:text-blue-700"
                }
                `}
              style={{ letterSpacing: "0.04em" }}
            >
              {link.label}
              {location.pathname === link.to && (
                <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full shadow"></span>
              )}
            </Link>
          ))}
        </div>
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center ml-auto">
          <button
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Open menu"
          >
            <svg
              className="w-7 h-7 text-blue-700"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  mobileOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
        {/* Right side: children (e.g., logout) */}
        <div className="hidden md:flex items-center ml-2">
          {children && (
            <div>
              {children}
            </div>
          )}
        </div>
        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg border-b border-blue-100 flex flex-col items-stretch md:hidden animate-fade-in z-50">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-6 py-4 border-b border-blue-50 font-bold text-lg transition-all duration-150 ${
                  location.pathname === link.to
                    ? "bg-blue-100 text-blue-700"
                    : "text-blue-900 hover:bg-blue-50 hover:text-blue-700"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {children && (
              <div className="px-6 py-4">
                {children}
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
