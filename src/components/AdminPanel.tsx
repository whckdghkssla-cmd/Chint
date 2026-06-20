import React, { useState, useEffect } from "react";
import { InventoryItem, MetalCategory, ItemStatus, InquiryForm } from "../types";
import { 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem 
} from "../dbService";
import { db, collection, getDocs, deleteDoc, doc, auth } from "../firebase";
import { 
  Plus, Edit2, Trash2, Tag, Layers, FileText, CheckCircle2,
  ListFilter, Sparkles, Scale, Info, Layers3, RefreshCw, BarChart3,
  Clock, Mail, Phone, MessageSquare, ClipboardList, Check, RotateCcw, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  items: InventoryItem[];
  onRefresh: () => void;
}

// Pre-loaded stunning metal scrap asset references
const PRE_LOADED_IMAGES = [
  { label: "Bare Bright 구리선", url: "/src/assets/images/copper_wire_scrap_1781961976592.jpg" },
  { label: "니켈 캐소드 판재", url: "/src/assets/images/nickel_cathode_scrap_1781961992715.jpg" },
  { label: "순수석 주입 잉곳", url: "/src/assets/images/tin_ingot_scrap_1781962009292.jpg" },
  { label: "알루미늄 압출재 프로파일", url: "/src/assets/images/recycled_aluminum_scrap_1781962027243.jpg" }
];

export default function AdminPanel({ items, onRefresh }: AdminPanelProps) {
  // Navigation inside Admin
  const [activeAdminTab, setActiveAdminTab] = useState<"catalog" | "inquiries">("catalog");

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<MetalCategory>("동스크랩");
  const [quantity, setQuantity] = useState<number>(0);
  const [unit, setUnit] = useState("ton");
  const [composition, setComposition] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ItemStatus>("판매중");
  
  // Multiple images logic
  const [selectedImgUrl, setSelectedImgUrl] = useState(PRE_LOADED_IMAGES[0].url);
  const [customImgUrl, setCustomImgUrl] = useState("");

  // Inquiries collection leads from database
  const [inquiries, setInquiries] = useState<(InquiryForm & { id: string; created_at?: string })[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const colRef = collection(db, "inquiries");
      const snapshot = await getDocs(colRef);
      const dataItems: any[] = [];
      snapshot.forEach((d) => {
        dataItems.push({
          id: d.id,
          ...d.data()
        });
      });
      // Sort inquiries by created_at descending if exists
      dataItems.sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeB - timeA;
      });
      setInquiries(dataItems);
    } catch (err) {
      console.error("Error loading inquiries:", err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleDeleteInquiry = async (inqId: string) => {
    if (!window.confirm("이 문의 내역을 정말 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, "inquiries", inqId));
      setInquiries(prev => prev.filter(i => i.id !== inqId));
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleEditClick = (item: InventoryItem) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setComposition(item.composition);
    setDescription(item.description);
    setStatus(item.status);
    
    // Check if the current image is one of the preloaded, otherwise set custom image URL
    const isPreloaded = PRE_LOADED_IMAGES.some(pi => pi.url === item.images[0]);
    if (isPreloaded) {
      setSelectedImgUrl(item.images[0]);
      setCustomImgUrl("");
    } else {
      setSelectedImgUrl("");
      setCustomImgUrl(item.images[0] || "");
    }
    // Scroll to form smoothly
    document.getElementById("admin-form-anchor")?.scrollIntoView({ behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setCategory("동스크랩");
    setQuantity(0);
    setUnit("ton");
    setComposition("");
    setDescription("");
    setStatus("판매중");
    setSelectedImgUrl(PRE_LOADED_IMAGES[0].url);
    setCustomImgUrl("");
    setErrorMsg("");
  };

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);
    
    if (!name || quantity <= 0 || !unit || !composition || !description) {
      setErrorMsg("모든 필수 입력 값을 정확히 작성해 주십시오.");
      setSubmitting(false);
      return;
    }

    const finalImgUrl = customImgUrl.trim().length > 0 ? customImgUrl.trim() : selectedImgUrl;
    if (!finalImgUrl) {
      setErrorMsg("대표 이미지를 미리 지정하거나 사진 URL을 기재해야 합니다.");
      setSubmitting(false);
      return;
    }

    const itemPayload = {
      name,
      category,
      quantity,
      unit,
      composition,
      description,
      status,
      images: [finalImgUrl]
    };

    try {
      if (editingId) {
        await updateInventoryItem(editingId, itemPayload);
        showTemporaryAlert("품목 정보가 안전하게 변경되었습니다!");
      } else {
        await createInventoryItem(itemPayload);
        showTemporaryAlert("새로운 판매 원료 품목이 인벤토리에 등록되었습니다!");
      }
      resetForm();
      onRefresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg("원자재 저장 중 인증 및 권한 제한 오류가 일어났습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = async (itemId: string, itemName: string) => {
    if (!window.confirm(`[${itemName}] 원재료를 정말 목록에서 영구 삭제하시겠습니까?`)) return;
    try {
      await deleteInventoryItem(itemId);
      onRefresh();
      showTemporaryAlert("지정 품목이 안전하게 철거되었습니다.");
    } catch (err) {
      console.error(err);
      alert("품목 제거 중 권한 오류가 발생했습니다.");
    }
  };

  const showTemporaryAlert = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // Dashboard calculations
  const totalCount = items.length;
  const activeCount = items.filter(i => i.status === "판매중").length;
  const reservedCount = items.filter(i => i.status === "예약중").length;
  const completedCount = items.filter(i => i.status === "판매완료").length;

  const currentUser = auth.currentUser;
  const isAuthorizedAdmin = currentUser && (
    currentUser.email === "whckdghkssla@gmail.com" || 
    currentUser.email === "admin@chmetal.com"
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Authentication & Authorization Status Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs ${
        isAuthorizedAdmin 
          ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
          : "bg-amber-50 border-amber-250 text-amber-900"
      }`}>
        <div className="flex items-start md:items-center space-x-2">
          {isAuthorizedAdmin ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5 md:mt-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 md:mt-0" />
          )}
          <div>
            <p className="font-bold">
              {isAuthorizedAdmin 
                ? "관리자 안전 서명 승인됨" 
                : "권한 미승인 또는 제한 상태"
              }
            </p>
            <p className="text-slate-500 font-medium mt-0.5">
              {currentUser 
                ? `현재 서명 접수 계정: ${currentUser.email} (${isAuthorizedAdmin ? "승인 완료" : "인증 오류 - whckdghkssla@gmail.com 계정으로 접속하세요"})`
                : "서명되지 않음 - 게스트로 접속 중이며, 원재료의 생성/수정/삭제 조작이 제한됩니다."
              }
            </p>
          </div>
        </div>
        {!isAuthorizedAdmin && (
          <div className="text-slate-600 leading-normal text-[11px] bg-white border border-amber-200 p-2.5 rounded-xl md:max-w-md">
            <strong>우회 등록 완료 방법:</strong> 파이어베이스 간편 로그인 팝업 제한 우회를 위해 "로그인" 탭으로 가서 <strong>"관리자 신규 등록 (가입)"</strong>을 눌러 <code className="bg-slate-100 font-mono px-1 font-bold">whckdghkssla@gmail.com</code>로 계정을 가입 후 로그인하시면 1초 만에 권한이 자동 동기화됩니다!
          </div>
        )}
      </div>

      {/* Admin Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display flex items-center">
            <Layers className="mr-2 text-blue-600 h-8 w-8" />
            <span>CH 비철 계근 인벤토리 제어판</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            등록된 재고의 가마 투입 성분, 중량 수급 상태 및 온라인 상차 신청 내역을 직관적으로 제어합니다.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveAdminTab("catalog")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition ${
              activeAdminTab === "catalog"
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            대시보드 & 재고 제어
          </button>
          <button
            onClick={() => {
              setActiveAdminTab("inquiries");
              fetchInquiries();
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition relative ${
              activeAdminTab === "inquiries"
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span>상차 문의 접수 리스크</span>
            {inquiries.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold border border-white">
                {inquiries.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification message banner */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-sm rounded-xl font-semibold flex items-center space-x-2 shadow-sm"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {activeAdminTab === "catalog" ? (
        <>
          {/* Dashboard Summary Numbers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-slate-900/10 text-slate-900 rounded-xl">
                <Layers3 className="h-6 w-6" />
              </div>
              <div>
                <dt className="text-xs text-slate-400 font-bold uppercase tracking-tight">전체 등록고</dt>
                <dd className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">{totalCount} <span className="text-xs text-slate-500 font-bold uppercase">종</span></dd>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-emerald-550/10 text-emerald-600 rounded-xl">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <dt className="text-xs text-slate-400 font-bold uppercase tracking-tight">정상 판매중</dt>
                <dd className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-display">{activeCount} <span className="text-xs text-slate-500 font-bold uppercase">종</span></dd>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-amber-550/10 text-amber-600 rounded-xl">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <dt className="text-xs text-slate-400 font-bold uppercase tracking-tight">예약 완료/계류</dt>
                <dd className="text-xl sm:text-2xl font-extrabold text-amber-600 font-display">{reservedCount} <span className="text-xs text-slate-500 font-bold uppercase">종</span></dd>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-slate-200 text-slate-500 rounded-xl">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <dt className="text-xs text-slate-400 font-bold uppercase tracking-tight">총 판매완료품</dt>
                <dd className="text-xl sm:text-2xl font-extrabold text-slate-500 font-display">{completedCount} <span className="text-xs text-slate-500 font-bold uppercase">종</span></dd>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="admin-form-anchor">
            {/* Form Section */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center">
                  <Plus className="mr-1.5 text-blue-600 h-5 w-5" />
                  <span>{editingId ? "원자재 세부 정보 밀착 수정" : "새로운 비철스크랩 물량 입고 등록"}</span>
                </h3>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    취소
                  </button>
                )}
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center space-x-1.5">
                  <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">품목명 (Korean Brand Name) *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: A급 적동 실선, 6063 알루미늄 압출 샤시"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">금속 대분류 카테고리 *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as MetalCategory)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="동스크랩">동스크랩 (Copper)</option>
                      <option value="니켈스크랩">니켈스크랩 (Nickel)</option>
                      <option value="주석스크랩">주석스크랩 (Tin)</option>
                      <option value="알루미늄스크랩">알루미늄스크랩 (Alum)</option>
                      <option value="기타">기타 대형 스크랩</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">현재 수령 중량 *</label>
                    <div className="flex">
                      <input
                        type="number"
                        step="0.01"
                        required
                        min="0.01"
                        placeholder="12.5"
                        value={quantity || ""}
                        onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 border-r-0 rounded-l-xl text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-r-xl text-slate-700 text-xs sm:text-sm font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 border-l-0"
                      >
                        <option value="ton">TON</option>
                        <option value="kg">KG</option>
                        <option value="lbs">LBS</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">성분 상세 분율 *</label>
                    <input
                      type="text"
                      required
                      placeholder="예: Cu 99.9%, Ni 99.88%"
                      value={composition}
                      onChange={(e) => setComposition(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">입고 상차 상태 *</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ItemStatus)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="판매중">정상 판매중</option>
                      <option value="예약중">가계약 예약중</option>
                      <option value="판매완료">상차 인도 완료</option>
                    </select>
                  </div>
                </div>

                {/* Pre-loaded Image Selection list */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase block">추천 대표 사진 대용 적용</label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRE_LOADED_IMAGES.map((pi) => {
                      const isSelected = selectedImgUrl === pi.url && !customImgUrl;
                      return (
                        <div
                          key={pi.label}
                          onClick={() => {
                            setSelectedImgUrl(pi.url);
                            setCustomImgUrl("");
                          }}
                          className={`cursor-pointer h-12 rounded-lg bg-slate-100 overflow-hidden relative border-2 ${
                            isSelected ? "border-blue-600 scale-102 ring-2 ring-blue-500/10" : "border-transparent"
                          }`}
                          title={pi.label}
                        >
                          <img src={pi.url} className="h-full w-full object-cover" alt={pi.label} referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/20" />
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center bg-blue-600/20">
                              <Check className="h-4 w-4 text-white font-bold" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">외부 야적 촬영 사진 URL (선택적 수입)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/metallic-pile.jpg"
                    value={customImgUrl}
                    onChange={(e) => {
                      setCustomImgUrl(e.target.value);
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">성분 및 수율 등 특이 요약 설명 *</label>
                  <textarea
                    required
                    placeholder="예: 피복을 완벽 탈피 청소한 A급 광선 원재료입니다. 제련 가마 및 동관 합금 제조 공장에서 상차 투입하기 매우 안전하며 용해 수율 99% 무하자 보전 보증."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs tracking-wide transition shadow-lg shadow-blue-500/10 flex items-center justify-center space-x-1.5"
                  id="admin-form-submit-btn"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{submitting ? "입하 데이터 처리동기화 중..." : editingId ? "원자재 세부 규격 수정 단행" : "야적장 입하 정식 입고"}</span>
                </button>
              </form>
            </div>

            {/* List & Edit Section */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center">
                    <ClipboardList className="mr-1.5 text-slate-550 h-5 w-5" />
                    <span>실시간 등록고 정밀 관리 현황 ({items.length}종)</span>
                  </h3>
                </div>

                {/* Table for large, smooth scroll area for mobile */}
                <div className="overflow-x-auto border border-slate-200/60 rounded-xl">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3.5">품목 사양 정보</th>
                        <th className="px-4 py-3.5">안정 성분</th>
                        <th className="px-4 py-3.5">입고 중량</th>
                        <th className="px-3 py-3.5">분기 상태</th>
                        <th className="px-4 py-3.5 text-right">제어</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          {/* Info Name */}
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2.5">
                              <img src={item.images && item.images[0]} alt="thumbnail" className="h-8 w-8 object-cover rounded-lg border border-slate-100" referrerPolicy="no-referrer" />
                              <div>
                                <h4 className="font-extrabold text-slate-900 font-display leading-tight">{item.name}</h4>
                                <span className="text-[10px] font-bold text-slate-400">{item.category}</span>
                              </div>
                            </div>
                          </td>

                          {/* Composition */}
                          <td className="px-4 py-3 font-mono font-semibold text-slate-700">
                            {item.composition}
                          </td>

                          {/* Quantity */}
                          <td className="px-4 py-3 font-bold text-slate-900">
                            {item.quantity.toLocaleString(undefined, { minimumFractionDigits: 1 })} <span className="text-[9px] text-slate-400 uppercase">{item.unit}</span>
                          </td>

                          {/* Status */}
                          <td className="px-3 py-3">
                            <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-bold border ${
                              item.status === "판매중" ? "bg-emerald-50 text-emerald-700 border-emerald-250" :
                              item.status === "예약중" ? "bg-amber-50 text-amber-700 border-amber-250" :
                              "bg-slate-50 text-slate-500 border-slate-200"
                            }`}>
                              {item.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => handleEditClick(item)}
                                className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100"
                                title="수정"
                                id={`admin-edit-btn-${item.id}`}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(item.id, item.name)}
                                className="p-1 text-slate-500 hover:text-red-600 rounded hover:bg-slate-100"
                                title="삭제"
                                id={`admin-delete-btn-${item.id}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Security info note */}
              <div className="mt-6 border-t border-slate-100 pt-4 text-[11px] text-slate-400 font-medium flex items-start space-x-1.5 leading-normal">
                <Info className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                <p>
                  인벤토리의 소스 및 이미지가 수정되는 즉시 정교한 클라이언트 쿼리에 갱신되어 배포, 실시간 문의 방문 회원들에게도 차질없는 정확한 정보가 자동 공유됩니다.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Inquiries Received leads panel */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-150 pb-3 flex justify-between items-center">
            <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center">
              <Mail className="mr-1.5 text-blue-600 h-5 w-5" />
              <span>실시간 온라인 상차 단가 문의 리스트 ({inquiries.length}건)</span>
            </h3>
            <button
              onClick={fetchInquiries}
              className="p-1.5 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-50 transition"
              title="새로고침"
              id="admin-refresh-inquiries"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loadingInquiries ? (
              <p className="text-xs text-slate-400 text-center col-span-2 py-10">실시간 문의 목록을 입수하는 중입니다...</p>
            ) : inquiries.length > 0 ? (
              inquiries.map((inq) => (
                <div key={inq.id} className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 space-y-3 shadow-none relative">
                  <button
                    onClick={() => handleDeleteInquiry(inq.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-650 rounded hover:bg-slate-200 p-1 transition"
                    title="문의사항 전량 소각"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">INQUIRY PATH</span>
                    <h4 className="text-xs font-bold text-slate-900 font-display flex items-center">
                      <Layers className="h-3.5 w-3.5 text-slate-400 mr-1 shrink-0" />
                      대상 원료: {inq.itemName}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-150 font-medium leading-relaxed">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-1.5 shrink-0" />
                      <span>의뢰: {inq.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-3.5 w-3.5 text-slate-400 mr-1.5 shrink-0" />
                      <span>{inq.phone}</span>
                    </div>
                    {inq.email && (
                      <div className="flex items-center col-span-2 mt-1 border-t border-slate-50 pt-1 text-[10px] text-slate-500 font-mono">
                        <Mail className="h-3 w-3 mr-1 text-slate-400" />
                        <span>이메일: {inq.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">의뢰 상세 요청사항</span>
                    <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-150 whitespace-pre-wrap leading-relaxed font-semibold">
                      {inq.message}
                    </p>
                  </div>

                  {inq.created_at && (
                    <div className="text-[9px] text-slate-400 font-medium text-right">
                      접수 일시: {new Date(inq.created_at).toLocaleString("ko-KR")}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Mail className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700 text-xs">접수된 실시간 구매 문의가 없습니다.</h4>
                <p className="text-[11px] text-slate-500">
                  메인판매재고 카드 상세정보 하부의 온라인 상차 상담 기능을 사용해 모의 신청을 진행해 보시면 즉시 관제 목록에 표시됩니다.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
