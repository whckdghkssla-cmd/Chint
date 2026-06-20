import React, { useState } from "react";
import { InventoryItem, InquiryForm } from "../types";
import { db, collection, addDoc } from "../firebase";
import { 
  X, Phone, MessageSquare, Mail, Calendar, Info, 
  ChevronRight, Sparkles, CheckCircle2, ShieldCheck, 
  ExternalLink, Copy, Check 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DetailModalProps {
  item: InventoryItem | null;
  onClose: () => void;
}

export default function DetailModal({ item, onClose }: DetailModalProps) {
  const [inquirySent, setInquirySent] = useState(false);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedKakao, setCopiedKakao] = useState(false);
  
  // Inquiry Form State
  const [form, setForm] = useState<InquiryForm>({
    name: "",
    phone: "",
    email: "",
    message: "",
    itemName: ""
  });

  if (!item) return null;

  // Pre-fill item name
  if (form.itemName !== item.name) {
    setForm(prev => ({ ...prev, itemName: item.name }));
  }

  const handleCopyPhone = () => {
    navigator.clipboard.writeText("010-8223-9333");
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyKakao = () => {
    navigator.clipboard.writeText("dlsqkr123");
    setCopiedKakao(true);
    setTimeout(() => setCopiedKakao(false), 2000);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || (!form.phone && !form.email)) {
      alert("성함과 연락처 또는 이메일을 반드시 입력해 주세요.");
      return;
    }

    setSubmittingInquiry(true);
    try {
      // Save Inquiry to Firestore
      const inquiriesRef = collection(db, "inquiries");
      await addDoc(inquiriesRef, {
        ...form,
        itemId: item.id,
        created_at: new Date().toISOString()
      });
      setInquirySent(true);
    } catch (err) {
      console.error("Error sending inquiry:", err);
      // Fallback alert
      alert("문의 처리 중 오류가 발생했습니다. 직접 이메일/전화로 연락 주시기 바랍니다.");
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const formattedDate = new Date(item.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Modal Card container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-205 flex flex-col md:flex-row max-h-[90vh]"
        id={`detail-modal-container-${item.id}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-900/10 hover:bg-slate-950/25 md:bg-white/80 md:hover:bg-white text-slate-700 hover:text-slate-900 rounded-full shadow transition"
          id="detail-modal-close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side: Photo Frame & Core badges */}
        <div className="w-full md:w-1/2 bg-slate-950 flex flex-col justify-between p-6 relative min-h-[300px] md:min-h-0">
          {/* background representative image */}
          <div className="absolute inset-0 opacity-80">
            <img 
              src={item.images && item.images[0] ? item.images[0] : "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=600&auto=format&fit=crop"} 
              alt={item.name} 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* dark shadow curtain */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40" />
          </div>

          {/* Top badges over image */}
          <div className="relative z-10 flex justify-between items-start">
            <span className="inline-flex items-center rounded-lg bg-white/95 text-slate-900 px-3 py-1 text-xs font-bold shadow-md">
              {item.category}
            </span>
            <span className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-bold tracking-tight shadow-md bg-slate-900 border-slate-700 text-white`}>
              {item.status}
            </span>
          </div>

          {/* Bottom title elements over image */}
          <div className="relative z-10 space-y-2 mt-auto">
            <p className="font-mono text-xs text-blue-400 font-bold tracking-widest uppercase">MATERIAL PROFILE</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug font-display">
              {item.name}
            </h3>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10 mt-3 text-xs text-slate-300">
              <span className="flex items-center bg-white/10 px-2 py-1 rounded-md">
                <Calendar className="h-3.5 w-3.5 mr-1 text-slate-300" />
                입고: {formattedDate}
              </span>
              <span className="flex items-center bg-white/10 px-2 py-1 rounded-md">
                <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                정밀 검사 완료
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Specifications, detailed descriptions and inquiry system */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-blue-600 mb-1">SPECIFICATIONS</p>
              <h4 className="text-lg font-extrabold text-slate-900 font-display">품목 상세 사양</h4>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">재고 중량</span>
                <span className="text-base font-extrabold text-slate-900 block leading-tight">
                  {item.quantity.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} <span className="text-xs text-slate-500 uppercase">{item.unit}</span>
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">분석 성분</span>
                <span className="font-mono text-sm font-bold text-blue-700 bg-blue-100/30 border border-blue-200/50 px-2.5 py-0.5 rounded-lg inline-block">
                  {item.composition}
                </span>
              </div>
            </div>

            {/* Description Text */}
            <div className="space-y-2">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">인벤토리 상세 정보</span>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {item.description}
              </div>
            </div>
          </div>

          {/* Interactive Inquiry Sections */}
          <div className="border-t border-slate-100 pt-6 space-y-5">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-550 mb-0.5">BUY & INQUIRE</p>
              <h4 className="text-sm font-extrabold text-slate-900">구매 및 계약 단가 문의</h4>
            </div>

            {/* Micro-Contact Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleCopyPhone}
                className={`flex items-center justify-center space-x-2 border py-2.5 px-3 rounded-xl text-xs font-bold transition-all relative overflow-hidden ${
                  copiedPhone 
                    ? "bg-slate-900 text-white border-slate-900" 
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                }`}
                title="전화 상담 연결"
              >
                {copiedPhone ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400 animate-scale" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate">010-8223-9333</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyKakao}
                className={`flex items-center justify-center space-x-2 border py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  copiedKakao 
                    ? "bg-amber-500 text-slate-900 border-amber-500" 
                    : "bg-[#FEE500] text-slate-900 border-[#FEE500] hover:bg-[#F3DA00]"
                }`}
                title="카카오톡 ID 추가"
              >
                {copiedKakao ? (
                  <>
                    <Check className="h-4 w-4 text-slate-900 shrink-0 animate-scale" />
                    <span className="truncate">카톡ID 복사 완료!</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 text-slate-900 shrink-0" />
                    <span className="truncate">카톡ID: dlsqkr123</span>
                  </>
                )}
              </button>
            </div>


          </div>
        </div>
      </motion.div>
    </div>
  );
}
