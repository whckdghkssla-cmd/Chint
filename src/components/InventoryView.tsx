import React, { useState } from "react";
import { InventoryItem, MetalCategory, ItemStatus } from "../types";
import { Search, Filter, Hammer, FileText, Eye, AlertCircle, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";

interface InventoryViewProps {
  items: InventoryItem[];
  showOnlyCompleted?: boolean;
  onSelectItem: (item: InventoryItem) => void;
}

const CATEGORIES: { label: string; value: MetalCategory | "전체" }[] = [
  { label: "전체 품목", value: "전체" },
  { label: "동스크랩", value: "동스크랩" },
  { label: "니켈스크랩", value: "니켈스크랩" },
  { label: "주석스크랩", value: "주석스크랩" },
  { label: "알루미늄스크랩", value: "알루미늄스크랩" },
  { label: "기타 대형 스크랩", value: "기타" }
];

export default function InventoryView({ items, showOnlyCompleted = false, onSelectItem }: InventoryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MetalCategory | "전체">("전체");

  // Filter based on page requirements
  const filteredByStatus = items.filter(item => {
    if (showOnlyCompleted) {
      return item.status === "판매완료";
    } else {
      // Show "판매중" and "예약중" on the active listing
      return item.status !== "판매완료";
    }
  });

  const finalFilteredItems = filteredByStatus.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.composition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = 
      selectedCategory === "전체" || 
      item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getStatusStyle = (status: ItemStatus) => {
    switch (status) {
      case "판매중":
        return "bg-[#ECFDF5] text-[#10B981] border-[#ECFDF5]";
      case "예약중":
        return "bg-[#FFFBEB] text-[#F59E0B] border-[#FFFBEB]";
      case "판매완료":
        return "bg-[#FEF2F2] text-[#EF4444] border-[#FEF2F2]";
      default:
        return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  const getCategoryColor = (category: MetalCategory) => {
    switch (category) {
      case "동스크랩": return "bg-orange-600/10 text-orange-700 border-orange-500/20";
      case "니켈스크랩": return "bg-indigo-600/10 text-indigo-700 border-indigo-500/20";
      case "주석스크랩": return "bg-sky-600/10 text-sky-700 border-sky-500/20";
      case "알루미늄스크랩": return "bg-slate-500/10 text-slate-700 border-slate-500/20";
      default: return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-250 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
            {showOnlyCompleted ? "판매 완료 품목" : "실시간 비철금속 판매 재고"}
          </h2>
          <p className="text-slate-550 text-sm mt-1">
            {showOnlyCompleted 
              ? "계약 상차 및 정산이 전량 완료된 품목 이력입니다." 
              : "공개된 물량은 야적장에 실시간 야적 완료된 검인 완수물입니다."}
          </p>
        </div>
        
        {/* Status display counts */}
        <div className="flex items-center space-x-3 text-xs font-semibold text-slate-600 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200/80">
          <span className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5 inline-block"></span>
            판매중 ({items.filter(i => i.status === "판매중").length})
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-amber-500 mr-1.5 inline-block"></span>
            예약중 ({items.filter(i => i.status === "예약중").length})
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-slate-400 mr-1.5 inline-block"></span>
            판매완료 ({items.filter(i => i.status === "판매완료").length})
          </span>
        </div>
      </div>

      {/* Modern Search & Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left filter side column */}
        <div className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm uppercase tracking-wider border-b border-slate-100 pb-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <span>카테고리 필터</span>
            </div>

            <div className="flex lg:flex-col flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`w-full text-left px-[16px] py-[6px] rounded-[20px] text-[13px] transition flex items-center justify-between border ${
                    selectedCategory === cat.value
                      ? "bg-[#0F172A] text-white border-[#0F172A] font-semibold"
                      : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-slate-100"
                  }`}
                >
                  <span>{cat.label}</span>
                  {selectedCategory === cat.value && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right main listing section */}
        <div className="flex-1 space-y-6">
          {/* Search bar inputs */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="품목명, 성분 (예: Cu, Ni, 압출), 또는 설명으로 검색하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-[8px] bg-white border border-[#E2E8F0] rounded-[6px] text-[#1E293B] placeholder:text-[#64748B] text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-[#2563EB] transition"
              id="inventory-search-input"
            />
          </div>

          {/* Catalog grid */}
          {finalFilteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {finalFilteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(idx * 0.05, 0.4) }}
                  onClick={() => onSelectItem(item)}
                  className="group cursor-pointer bg-white rounded-[12px] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200 overflow-hidden flex flex-col h-full"
                  id={`item-card-${item.id}`}
                >
                  {/* Card Image */}
                  <div className="relative h-[140px] w-full bg-[#CBD5E1] overflow-hidden shrink-0">
                    <img
                      src={item.images && item.images[0] ? item.images[0] : "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=600&auto=format&fit=crop"}
                      alt={item.name}
                      ref-id="card-img"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient mapping */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-[10px] right-[10px]">
                      <span className={`inline-flex items-center rounded-[4px] px-[10px] py-[4px] text-[11px] font-bold tracking-tight border ${getStatusStyle(item.status)}`}>
                        {item.status}
                      </span>
                    </div>

                    {/* Category Overlay */}
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center rounded-[4px] px-2 py-0.5 text-[10px] font-bold border tracking-wider bg-white/90 backdrop-blur-sm border-[#E2E8F0] text-[#64748B]">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-[16px] font-bold text-[#0F172A] leading-snug tracking-tight font-display group-hover:text-[#2563EB] transition duration-150 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-[13px] text-[#64748B] line-clamp-2 leading-relaxed font-medium">
                        {item.description}
                      </p>
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
                        #{item.category.replace("스크랩", "")} #{item.composition.split(" ")[0]}
                      </span>
                      <span className="text-[11px] text-[#64748B] font-medium">
                        입고: {new Date(item.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\s/g, "")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-3">
              <AlertCircle className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800">일치하는 재고 품목이 없습니다</h3>
              <p className="text-slate-500 text-sm">
                검색어나 카테고리 필터를 변경해 보세요. 필요한 원재료 단종 수량이 있으시면 문의란을 통해 맞춤 선별을 신청하실 수 있습니다.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("전체");
                }}
                className="inline-flex text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-xl hover:bg-blue-100 transition"
              >
                검색 초기화
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
