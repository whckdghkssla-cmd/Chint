import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import AboutView from "./components/AboutView";
import InventoryView from "./components/InventoryView";
import DetailModal from "./components/DetailModal";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";
import { fetchInventory } from "./dbService";
import { auth, onAuthStateChanged, User } from "./firebase";
import { InventoryItem } from "./types";
import { 
  Building2, Phone, Mail, MessageSquare, ShieldCheck, 
  MapPin, Clock, Award, CheckCircle, ArrowRight, 
  ExternalLink, Sparkles, TrendingUp, Cpu, Landmark 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Authentication states
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Monitor Auth State
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        // Fallback: Check local storage for direct bypass sign-in
        const savedBypass = localStorage.getItem("ch_admin_bypass");
        if (savedBypass === "whckdghkssla@gmail.com") {
          setUser({ email: "whckdghkssla@gmail.com", uid: "bypass-admin" });
        } else {
          setUser(null);
        }
      }
      setLoadingUser(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    // Fetch items from Firestore
    async function loadData() {
      setLoadingItems(true);
      try {
        const inventoryData = await fetchInventory();
        setItems(inventoryData);
      } catch (err) {
        console.error("Failed to load inventory data:", err);
      } finally {
        setLoadingItems(false);
      }
    }
    loadData();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Quick action from home banner
  const handleHeroClick = () => {
    setCurrentTab("inventory");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans selection:bg-blue-600/10 selection:text-blue-700">
      
      {/* Navigation */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        user={user} 
        loadingUser={loadingUser} 
      />

      {/* Main Container */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {currentTab === "home" && (
            <motion.div
              key="home-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-12 pb-16"
            >
              {/* Promo Banner Hero */}
              <Banner onCheckInventory={handleHeroClick} />

              {/* B2B Advantage Feature row */}
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600/10 text-orange-600 font-bold border border-orange-500/20">
                      1
                    </span>
                    <h3 className="text-sm font-bold text-slate-950 font-display">오류 제로 성분 분석</h3>
                    <p className="text-xs text-slate-500 leading-normal">정밀 XRF 분광기 및 습식 대조로 소수점 둘째자리까지 성분을 품질 검사서와 배출합니다.</p>
                  </div>

                  <div className="space-y-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 font-bold border border-indigo-500/20">
                      2
                    </span>
                    <h3 className="text-sm font-bold text-slate-950 font-display">철저한 유지/불용물 탈공 처리</h3>
                    <p className="text-xs text-slate-500 leading-normal">공장 투입 시 발생 가능한 고열 가스 및 탈황 변색의 원인이 되는 실리콘 고무, 이물 철 스크랩 완벽 청소.</p>
                  </div>

                  <div className="space-y-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600/10 text-sky-600 font-bold border border-sky-500/20">
                      3
                    </span>
                    <h3 className="text-sm font-bold text-slate-950 font-display">상 야적 중량 실시간 투명 계근</h3>
                    <p className="text-xs text-slate-500 leading-normal">모든 입고는 정비된 공인 공인 검량업체의 실차 계근표를 동등 발행하여 양사 간의 타이트한 신뢰를 이룩합니다.</p>
                  </div>

                  <div className="space-y-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/10 text-slate-800 font-bold border border-slate-400/20">
                      4
                    </span>
                    <h3 className="text-sm font-bold text-slate-950 font-display">수도권 당일 용적 배차</h3>
                    <p className="text-xs text-slate-500 leading-normal">남동공단 야적 지사에서 경기, 서울, 충남까지 5톤, 11톤 실시간 직출 상차 네트웍을 완비했습니다.</p>
                  </div>
                </div>
              </div>

              {/* Quick Preview active Inventory */}
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">최근 신규 입고 원자재</h3>
                    <p className="text-xs text-slate-400">오래 대기할 필요 없는 실물 야적 리스트</p>
                  </div>
                  <button 
                    onClick={() => setCurrentTab("inventory")}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    전체 재고 보기
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>

                {loadingItems ? (
                  <p className="text-xs text-slate-400 text-center py-10 font-bold">실시간 야적장 데이터를 통신하는 중입니다...</p>
                ) : items.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.filter(item => item.status !== "판매완료").slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="group cursor-pointer bg-white rounded-[12px] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200 overflow-hidden flex flex-col h-full"
                      >
                        <div className="relative h-[140px] w-full bg-[#CBD5E1] overflow-hidden shrink-0">
                          <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                          <div className="absolute top-[10px] right-[10px]">
                            <span className="inline-flex items-center rounded-[4px] px-[10px] py-[4px] text-[11px] font-bold tracking-tight border bg-[#ECFDF5] text-[#10B981] border-[#ECFDF5]">
                              판매중
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <span className="inline-flex items-center rounded-[4px] px-2 py-0.5 text-[10px] font-bold border tracking-wider bg-white/90 backdrop-blur-sm border-[#E2E8F0] text-[#64748B]">
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1">
                            <h4 className="text-[16px] font-bold text-[#0F172A] leading-snug tracking-tight font-display group-hover:text-[#2563EB] transition duration-150 line-clamp-1">{item.name}</h4>
                            <p className="text-[13px] text-[#64748B] line-clamp-2 leading-relaxed font-medium">{item.description}</p>
                          </div>
                          
                          <div className="space-y-1.5 border-t border-[#E2E8F0] pt-3">
                            <div className="flex justify-between items-center text-[13px] text-[#64748B] font-medium">
                              <span>수량</span>
                              <strong className="text-[#1E293B] font-bold">
                                {item.quantity.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} <span className="text-[10px] uppercase font-bold">{item.unit}</span>
                              </strong>
                            </div>

                            <div className="flex justify-between items-center text-[13px] text-[#64748B] font-medium">
                              <span>성분</span>
                              <strong className="font-mono text-[#1E293B]">
                                {item.composition}
                              </strong>
                            </div>
                          </div>

                          <div className="pt-3 flex items-center justify-between border-t border-[#E2E8F0] mt-auto">
                            <span className="text-[11px] bg-[#F8FAFC] px-[6px] py-[2px] rounded-[4px] text-[#64748B] font-medium">
                              #{item.category.replace("스크랩", "")}
                            </span>
                            <span className="text-[11px] text-[#64748B] font-medium">
                              입고: {new Date(item.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\s/g, "")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6 font-bold">등록고 데이터가 유실되었습니다.</p>
                )}
              </div>
            </motion.div>
          )}

          {currentTab === "about" && (
            <motion.div
              key="about-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <AboutView />
            </motion.div>
          )}

          {currentTab === "inventory" && (
            <motion.div
              key="inventory-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <InventoryView 
                items={items} 
                showOnlyCompleted={false} 
                onSelectItem={setSelectedItem} 
              />
            </motion.div>
          )}

          {currentTab === "completed" && (
            <motion.div
              key="completed-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <InventoryView 
                items={items} 
                showOnlyCompleted={true} 
                onSelectItem={setSelectedItem} 
              />
            </motion.div>
          )}

          {currentTab === "contact" && (
            <motion.div
              key="contact-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="mx-auto max-w-4xl px-4 py-12 space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-extrabold text-slate-900 font-display">Ch인터내셔널 비철금속 원재료 문의 센터</h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">전화, 카카오톡 또는 이메일을 통해 입고 일정 매칭 단가 및 차량 상차 견적을 실시간 받아보세요.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl border border-slate-800">
                  <h3 className="text-lg font-bold font-display border-b border-slate-850 pb-2">Ch인터내셔널 다이렉트 긴급 문의</h3>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="flex items-start space-x-3.5">
                      <div className="p-2.5 bg-blue-600/10 text-blue-400 rounded-xl border border-blue-500/20 shrink-0">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200">24시 야적 및 조업 전화 대응</h4>
                        <p className="font-mono text-base font-extrabold text-blue-400 mt-0.5">010-8223-9333</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">대표이사 이종하 / Tel: 032-544-2092</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5">
                      <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 shrink-0">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200">카카오톡 비철 상담 대표 ID</h4>
                        <p className="font-mono text-base font-extrabold text-amber-400 mt-0.5">dlsqkr123</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">ID 추가 신청 시 간소 상차표 사진 대응 가능</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5">
                      <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200">공식 제휴 및 정밀 시험성적서 수령</h4>
                        <p className="font-mono text-xs font-semibold text-emerald-400 mt-1">chmetalscrap@chmetal.com</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">습식 성분 분석 의뢰 및 선입고 스케출 조정</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-4 text-xs text-slate-400 leading-normal flex items-start space-x-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-450 shrink-0 mt-0.5" />
                    <span>정기 공급 협력 계약 및 중견 기업 전담 상차 파트너십 상시 환영합니다.</span>
                  </div>
                </div>

                {/* Inline General contact Form */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900 font-display">비철금속 정기 공급 및 긴급 구매 요청</h3>
                  <p className="text-xs text-slate-500">기재된 규격 이외의 순은, 특수주석, 초합금 물량이 필요하신 경우 성분 분석 및 계중 조정을 접수해 주십시오.</p>
                  
                  {/* Reuse nice flow or mock sending form */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("문의가 정상 제출되었습니다! 당일 담당자 점검 결과를 기재된 연락망으로 회신하겠습니다.");
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">성함 / 상호명 *</label>
                      <input type="text" required placeholder="예: (주)한라 정밀주조 / 팀장 김동건" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">연락처 *</label>
                        <input type="text" required placeholder="010-XXXX-XXXX" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">이메일 주소</label>
                        <input type="email" placeholder="example@mail.com" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">필요 금속 품종 및 희망 중량톤 *</label>
                      <input type="text" required placeholder="예: 구리 2호 상동 10톤 분량" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">상세 의뢰 내용 *</label>
                      <textarea required placeholder="가마 투입 수율 요청이나 허용 불순물 한도를 입력 주시면 원정 세척 가공이 완료된 최적의 스크랩을 대량 확보하여 드립니다." rows={3} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none" />
                    </div>

                    <button type="submit" className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-3 rounded-xl text-xs transition">
                      정기공급 무료 상담 접수하기
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {currentTab === "admin" && (
            <motion.div
              key="admin-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {loadingUser ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="text-xs text-slate-500 mt-2">파이어베이스 인증 정보를 확인하고 있습니다...</span>
                </div>
              ) : (
                user ? (
                  <AdminPanel 
                    items={items} 
                    onRefresh={handleRefresh} 
                  />
                ) : (
                  <AdminLogin />
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-slate-800 pb-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-bold text-sm">
                  CH
                </div>
                <span className="text-white font-extrabold tracking-tight font-display">Ch인터내셔널 스크랩</span>
              </div>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                Ch인터내셔널 스크랩 {`(`}상호: Ch인터내셔널{`)`}은 첨단 신재생 자원 순환 체계를 지향하며, 엄밀히 선별된 고품위 비철금속을 전국 제조 현장에 중개 공급하는 파트너입니다.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 text-xs sm:text-sm font-medium">
              <div className="space-y-2.5">
                <span className="text-white font-bold text-[10px] uppercase tracking-widest block text-slate-500">QUICK MENU</span>
                <ul className="space-y-1.5 font-semibold text-slate-400">
                  <li><button onClick={() => setCurrentTab("about")} className="hover:text-blue-500 transition">회사소개</button></li>
                  <li><button onClick={() => setCurrentTab("inventory")} className="hover:text-blue-500 transition">판매재고</button></li>
                  <li><button onClick={() => setCurrentTab("completed")} className="hover:text-blue-500 transition">판매완료품</button></li>
                  <li><button onClick={() => setCurrentTab("contact")} className="hover:text-blue-500 transition">문의하기</button></li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <span className="text-white font-bold text-[10px] uppercase tracking-widest block text-slate-500">ADMIN CONTROL</span>
                <ul className="space-y-1.5 font-semibold text-slate-400">
                  <li><button onClick={() => setCurrentTab("admin")} className="hover:text-blue-500 transition flex items-center">관제 콘솔 <ExternalLink className="h-3 w-3 ml-1 text-slate-550" /></button></li>
                  <li><span className="text-[#34A853]">● REALTIME DATA</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-medium">
            <div className="space-y-1 text-center sm:text-left">
              <p>사업자등록번호: 133-14-38820 | 통신판매업신고: 제2026-인천남동-1293호 | 대표이사: 이종하</p>
              <p>본사 및 인천 중앙야적장: 인천광역시 남동구 남동동로 115번길 12 | 연락처: 010-8223-9333 / 직통 032-544-2092</p>
            </div>
            <p className="mt-4 sm:mt-0 font-mono">© 2026 Ch인터내셔널 스크랩. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Slide Drawer Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <DetailModal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
