import React, { useState } from "react";
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "../firebase";
import { ShieldAlert, KeyRound, Mail, Sparkles, Compass, AlertCircle, Info } from "lucide-react";
import { motion } from "motion/react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("이메일 주소 또는 비밀번호가 일치하지 않습니다.");
      } else if (err.code === "auth/weak-password") {
        setError("비밀번호는 최소 6자 이상이어야 합니다.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("이미 사용 중인 이메일 주소입니다. 로그인 탭으로 이전해 주십시오.");
      } else {
        setError(err.message || "인증 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error(err);
      setError("구글 로그인 처리에 오류가 있습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
      >
        {/* Banner header badge */}
        <div className="bg-slate-900 px-6 py-8 text-center text-white space-y-2 border-b border-slate-800">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/30 mb-2">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight font-display">CH 관리자 콘솔 로그인</h2>
          <p className="text-xs text-slate-400 font-medium">관리자 계정으로 실시간 입·출하를 제어하세요.</p>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold mb-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick instructions tool info box */}
          <div className="bg-slate-50 border border-blue-100 p-3.5 rounded-xl space-y-1 text-xs text-slate-600 leading-normal">
            <span className="flex items-center text-blue-600 font-bold mb-1">
              <Info className="h-3.5 w-3.5 mr-1" />
              <span>편리한 어플릿 체험 지원 알림</span>
            </span>
            <p>
              현재 AI Studio 샌드박스에서 <strong>구글 간편 로그인</strong> 또는 신규 이메일 가입 등록을 하시면 즉각 관리 권한을 획득하여 신규 물품 등록, 편집 및 삭제 테스트가 완료됩니다.
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">이메일 주소</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@chmetal.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">비밀번호</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-950 text-white py-2.5 rounded-xl font-bold text-sm tracking-wide transition flex items-center justify-center"
              id="admin-form-submit-cred"
            >
              <span>{loading ? "인증 로딩 처리 중..." : isRegistering ? "신규 관리자 신뢰 계정 등록" : "보안 로그인"}</span>
            </button>
          </form>

          {/* Tab shifter link */}
          <div className="text-center">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
              className="text-xs text-blue-600 font-bold hover:underline"
              id="admin-auth-toggle-tab"
            >
              {isRegistering ? "기존 관리자 계정이 있으신가요? 로그인" : "관리자 신규 가입이 필요하신가요? 등록"}
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-150"></div>
            <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-slate-150"></div>
          </div>

          {/* Google Sign-In helper Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 border border-slate-200 py-2.5 rounded-xl font-bold text-xs tracking-wide transition flex items-center justify-center space-x-2 shadow-sm"
            id="admin-google-login-btn"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.63c-.29 1.5-.14 3.01.69 4.11l3.12-2.42c1.82-1.68 3.3-3.66 1.3-3.54z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.12-2.42c-1.35.9-3.08 1.44-4.84 1.44-3.73 0-6.88-2.52-8.01-5.91L.75 16.54C2.74 20.95 7.08 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M3.99 14.2c-.3-.9-.47-1.87-.47-2.87s.17-1.97.47-2.87L.75 6.04C-.25 8.12-.8 10.38-.8 12.7c0 2.32.55 4.58 1.55 6.66l3.24-2.46z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.08 0 2.74 3.05.75 7.46l3.24 2.46c1.13-3.39 4.28-5.91 8.01-5.91z"
              />
            </svg>
            <span>Google 계정으로 관리자 즉시 로그인</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
