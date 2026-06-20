import React from "react";
import { Building2, ShieldCheck, Factory, Truck, MapPin, Phone, Mail, Award, CheckCircle } from "lucide-react";

export default function AboutView() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Introduction Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
          원재료 금속 스크랩 전문, <br className="sm:hidden"/> 
          <span className="text-blue-600">Ch인터내셔널 스크랩</span> 입니다.
        </h2>
        <p className="text-slate-600 sm:text-lg leading-relaxed">
          저희 Ch인터내셔널 스크랩은 대한민국 대표 비철금속 원재료 유통 기업으로, 국내·외 대형 제련소 및 정밀 주조 공장, 가마 생산업체에 실시간 검증을 거친 최적의 금속 원자재 스크랩을 전문적으로 중개하고 공급합니다.
        </p>
      </div>

      {/* Corporate Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition hover:shadow-md">
          <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">철저한 성분 검증</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            금속 원재료의 가마 투입 손실과 합금 정확도를 결정짓는 핵심 지표는 오차 없는 화학 성분입니다. 당사는 정밀 X-선 형광 분석기(XRF) 및 습식 검사로 100% 성분 입증서를 보증합니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition hover:shadow-md">
          <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 mb-4">
            <Factory className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">원료 이물질 사전 완벽 선별</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            원료 용해 시 유해가스 발생 및 화성 부식의 원인이 되는 유지 성분, 실리콘 고무, 잔재 철 나사 등 비금속 이물질을 다량 세척 및 수작업으로 제로화 선별하여 최고의 투입 수율을 약속합니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition hover:shadow-md">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
            <Truck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">신속한 하차 및 전국 직운송</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            전국 주조 산업 단지(남동공단, 시화공단, 반월, 대구, 주안 등)에 실시간 당일 계근 상차 및 신속한 5톤/11톤 카고 배차 네트워크를 완비하여 공장의 자재 정체 리스크를 해소해 드립니다.
          </p>
        </div>
      </div>

      {/* Substantial Facility Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-1.5 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-xs font-bold text-blue-400">
              <Award className="h-4 w-4" />
              <span>CH SCRAP 경쟁력</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-slate-100">
              안정적인 원자재 수급과 <br/>
              합리적인 투명 단가 체계
            </h3>
            
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Ch인터내셔널 스크랩은 장기 정기공급 계약을 맺은 국내 유수의 전선 철거 단지 및 배전반 반도체 산업 설비 수거라인으로 균질하고 끊김없는 기초 원료 스크랩 수량을 매달 확보하고 있습니다. 국제 LME(런던금속거래소) 시세를 투명하게 매핑하여 양방 신뢰의 가격 규격을 제시합니다.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-2.5">
                <CheckCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300 font-semibold">인천 남동공단 제3비철 야적장 원터치 직출하 제도 운영</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300 font-semibold">동스크랩(A급 적동, 상동, 파동) 상시 대량 축積 준비 완료</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300 font-semibold">니켈 플레이트, 대형 주방 기구, 특수합금 용융 설재 전문 중개</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-800 space-y-6">
            <h4 className="text-sm font-bold tracking-widest text-slate-300 uppercase border-b border-slate-800 pb-2">
              본사 및 야적장 정보
            </h4>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-200">인천 통합 중앙 야적장 (원자재 보관·선별 단지)</h5>
                  <p className="text-slate-400 text-xs mt-0.5">인천광역시 남동구 남동동로 115번길 12 (남동공단 내)</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-200">경기 시흥 한라 지사 야적장 (동/합금 전용 특화지)</h5>
                  <p className="text-slate-400 text-xs mt-0.5">경기도 시흥시 화전로 234번길 18</p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-2 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-slate-400 text-xs"><Phone className="h-4 w-4 mr-2" /> 연락처</span>
                  <span className="font-mono font-bold hover:text-white transition">010-8223-9333 / Tel: 032-544-2092</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-slate-400 text-xs"><Mail className="h-4 w-4 mr-2" /> 이메일</span>
                  <span className="font-mono hover:text-white transition">chmetalscrap@chmetal.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
