import React from "react";
import { auth, googleProvider, signInWithPopup, signOut } from "../firebase";
import { User } from "firebase/auth";
import { Building2, Lock, LogOut, ShieldAlert, PhoneCall, FolderGit2 } from "lucide-react";
import { motion } from "motion/react";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: User | null;
  loadingUser: boolean;
}

export default function Navbar({ currentTab, setCurrentTab, user, loadingUser }: NavbarProps) {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div 
          onClick={() => setCurrentTab("home")} 
          className="flex cursor-pointer items-center space-x-2.5"
          id="nav-logo"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white font-black text-[10px] shadow-sm">
            CH
          </div>
          <div>
            <h1 className="text-[20px] font-extrabold tracking-tight text-[#0F172A] font-display leading-none">Ch인터내셔널 스크랩</h1>
            <p className="text-[9px] text-[#64748B] font-bold tracking-widest mt-0.5">METALS EXCHANGE</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => setCurrentTab("about")}
            className={`text-[14px] font-medium transition ${
              currentTab === "about" ? "text-blue-600 font-bold" : "text-[#64748B] hover:text-[#0F172A]"
            }`}
            id="nav-about"
          >
            회사소개
          </button>
          <button
            onClick={() => setCurrentTab("inventory")}
            className={`text-[14px] font-medium transition ${
              currentTab === "inventory" ? "text-blue-600 font-bold" : "text-[#64748B] hover:text-[#0F172A]"
            }`}
            id="nav-inventory"
          >
            판매재고
          </button>
          <button
            onClick={() => setCurrentTab("completed")}
            className={`text-[14px] font-medium transition ${
              currentTab === "completed" ? "text-blue-600 font-bold" : "text-[#64748B] hover:text-[#0F172A]"
            }`}
            id="nav-completed"
          >
            판매완료품
          </button>
          <button
            onClick={() => setCurrentTab("contact")}
            className={`text-[14px] font-medium transition ${
              currentTab === "contact" ? "text-blue-600 font-bold" : "text-[#64748B] hover:text-[#0F172A]"
            }`}
            id="nav-contact"
          >
            문의하기
          </button>
        </nav>

        {/* Auth Actions / Admin Shortcut */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentTab("admin")}
            className={`flex items-center space-x-1.5 px-[16px] py-[8px] rounded-[6px] text-[13px] font-medium tracking-wide transition-all ${
              currentTab === "admin" 
                ? "bg-[#0F172A] text-white" 
                : "bg-[#1E293B] text-white hover:bg-[#0F172A]"
            }`}
            id="nav-admin-portal"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>관리자 대시보드</span>
          </button>

          {!loadingUser && (
            user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-800 leading-none">{user.displayName || "관리자"}</span>
                  <span className="text-[9px] text-blue-600 font-medium">인증됨</span>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="profile" className="h-7 w-7 rounded-full border border-slate-300" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-bold text-xs uppercase">
                    A
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100 transition"
                  title="로그아웃"
                  id="nav-logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="hidden sm:inline-flex text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition"
                id="nav-login-google"
              >
                구글 로그인
              </button>
            )
          )}
        </div>
      </div>

      {/* Mobile navigation bottom bar for responsive comfort */}
      <div className="md:hidden flex h-12 border-t border-slate-100 bg-white justify-around items-center">
        <button
          onClick={() => setCurrentTab("about")}
          className={`flex flex-col items-center justify-center w-1/4 h-full text-[10px] font-bold ${
            currentTab === "about" ? "text-blue-600" : "text-slate-500"
          }`}
        >
          <Building2 className="h-4 w-4 mb-0.5" />
          <span>회사소개</span>
        </button>
        <button
          onClick={() => setCurrentTab("inventory")}
          className={`flex flex-col items-center justify-center w-1/4 h-full text-[10px] font-bold ${
            currentTab === "inventory" ? "text-blue-600" : "text-slate-500"
          }`}
        >
          <FolderGit2 className="h-4 w-4 mb-0.5" />
          <span>판매재고</span>
        </button>
        <button
          onClick={() => setCurrentTab("completed")}
          className={`flex flex-col items-center justify-center w-1/4 h-full text-[10px] font-bold ${
            currentTab === "completed" ? "text-blue-600" : "text-slate-500"
          }`}
        >
          <div className="relative">
            <div className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-blue-600 animate-ping"></div>
            <FolderGit2 className="h-4 w-4 mb-0.5 opacity-60" />
          </div>
          <span>판매완료품</span>
        </button>
        <button
          onClick={() => setCurrentTab("contact")}
          className={`flex flex-col items-center justify-center w-1/4 h-full text-[10px] font-bold ${
            currentTab === "contact" ? "text-blue-600" : "text-slate-500"
          }`}
        >
          <PhoneCall className="h-4 w-4 mb-0.5" />
          <span>문의하기</span>
        </button>
      </div>
    </header>
  );
}
