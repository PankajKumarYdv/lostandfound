import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {Menu, X} from 'lucide-react'; 
import { AuthContext } from "../context/AuthContext";
import {
  Search,
  PlusCircle,
  User as UserIcon,
  LogOut,
  Award,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/60 border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-white flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <Search size={18} className="text-white" />
          </div>
          Findrly
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/leaderboard"
            className="text-slate-300 hover:text-white transition flex items-center gap-1"
          >
            <Award size={18} />
            Leaderboard
          </Link>

          {user ? (
            <>
              <Link
                to="/post-item"
                className="hidden md:flex items-center gap-2 glass-button-primary py-2 px-4 shadow-none"
              >
                <PlusCircle size={18} />
                Post Found Item
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="text-slate-300 hover:text-white transition flex items-center gap-2"
                >
                  <UserIcon size={18} />
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 transition"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="glass-button bg-white/10 py-2 px-4 shadow-none"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
