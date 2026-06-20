import React from "react";
import { ArrowRight, ShieldCheck, Cpu, HardHat, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface BannerProps {
  onCheckInventory: () => void;
}

export default function Banner({ onCheckInventory }: BannerProps) {
  return (
    <div className="relative overflow-hidden bg-[#0F172A] text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 shadow-2xl border border-[#1E293B]">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
      
      {/* hero-bg-accent style from design instructions */}
      <div className="absolute -right-[50px] -bottom-[50px] w-[300px] h-[300px] bg-[#2563EB] opacity-[0.1] rounded-full pointer-events-none" />

      {/* Decorative metal colors gradients */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-orange-600/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#2563EB]/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:px-12 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
        {/* Text Content */}
        <div className="flex-1 space-y-6 text-center lg:text-left z-10">
          <div className="inline-flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1 text-xs font-semibold text-blue-400 tracking-wider uppercase">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>2026 비철금속 원재료 직거래 포털</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-slate-100 font-display">
            금속스크랩 <br className="hidden sm:block"/>
            <span className="bg-gradient-to-r from-orange-400 via-amber-200 to-blue-400 bg-clip-text text-transparent">
              전문 유통 & 트레이딩
            </span>
          </h2>
          
          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
            동(Copper), 니켈(Nickel), 주석(Tin), 합금(Alloys) 등 최상급 금속 원자재 스크랩을 실시간 공개합니다. 소규모 주조공장 및 정밀 구매업체를 위한 최고의 B2B 파트너십.
          </p>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={onCheckInventory}
              className="group flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 transform active:scale-95"
              id="hero-check-inventory"
            >
              <span>실시간 재고 확인하기</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <div className="flex items-center space-x-1 text-xs text-slate-400 font-medium bg-slate-800/50 border border-slate-800 px-3 py-2 rounded-xl">
              <ShieldCheck className="h-4 w-4 text-emerald-400 mr-1" />
              <span>정밀 성분 검증 완수물</span>
            </div>
          </div>
        </div>

        {/* Dynamic Showcase Card */}
        <div className="w-full lg:w-[450px] z-10">
          <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative">
            <div className="absolute top-3 right-3 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            
            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Cpu className="h-4 w-4 text-blue-500" />
              <span>실시간 주력 공급 품목</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-lg bg-orange-600/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-xs">
                    Cu
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">A급 고순도 적동선</h4>
                    <p className="text-[10px] text-slate-400">성분: Cu 99.9% 이상</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-200">15.5 ton</div>
                  <span className="inline-flex items-center rounded-full bg-emerald-950 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">판매중</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-lg bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
                    Ni
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">니켈 캐소드 판재</h4>
                    <p className="text-[10px] text-slate-400">성분: Ni 99.98%</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-200">4.8 ton</div>
                  <span className="inline-flex items-center rounded-full bg-emerald-950 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">판매중</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-lg bg-slate-600/10 border border-slate-500/30 flex items-center justify-center text-slate-300 font-bold text-xs">
                    Sn
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">순주석 잉곳 및 설재</h4>
                    <p className="text-[10px] text-slate-400">성분: Sn 99.9%</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-300">2.1 ton</div>
                  <span className="inline-flex items-center rounded-full bg-amber-950 px-2 py-0.5 text-[9px] font-bold text-amber-400 border border-amber-500/30">예약중</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-medium">
              <span className="flex items-center"><HardHat className="h-3 w-3 mr-1 text-amber-400" /> 신속한 수도권 하역 상차</span>
              <span>최종업데이트: 실시간</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
