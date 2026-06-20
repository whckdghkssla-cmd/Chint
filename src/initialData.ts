import { InventoryItem } from "./types";

export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: "seed-1",
    name: "A급 적동 선 (A-Grade Copper Wire Scrap)",
    category: "동스크랩",
    quantity: 15.5,
    unit: "ton",
    composition: "Cu 99.9%",
    description: "피복을 완전히 탈피한 광택 광선(A급 적동선, Bare Bright Copper Wire)입니다. 불순물 소량 부착 및 납땜 흔적이 전혀 포함되지 않은 최고급 제련용 동스크랩입니다. 전선 압착 가설재 전용 야적장에서 엄밀히 세척되어 선별 완료되었습니다. 소규모 정밀 주조소 및 청동 합금 제조 공정에 최적의 원재료입니다.",
    status: "판매중",
    images: ["/src/assets/images/copper_wire_scrap_1781961976592.jpg"],
    created_at: "2026-06-18T10:00:00Z"
  },
  {
    id: "seed-2",
    name: "니켈 캐소드 판재 스크랩 (Nickel Cathode Sheet Scrap)",
    category: "니켈스크랩",
    quantity: 4.8,
    unit: "ton",
    composition: "Ni 99.98%",
    description: "고순도 전기 주조용 니켈 캐소드(Cathode) 판재 스크랩입니다. 일정한 플레이트 규격컷팅 단면으로 가공되어 조업 투입 시 도가니 내 충진밀도를 극대화할 수 있습니다. 균일한 부식과 합금 용융성을 보장하며, 특수강 합금 제조 및 고정밀 방산 주물에 추천합니다.",
    status: "판매중",
    images: ["/src/assets/images/nickel_cathode_scrap_1781961992715.jpg"],
    created_at: "2026-06-17T11:30:00Z"
  },
  {
    id: "seed-3",
    name: "99.9% 고순도 주석 잉곳 및 설재 (Pure Tin Ingot & Scrap)",
    category: "주석스크랩",
    quantity: 2.1,
    unit: "ton",
    composition: "Sn 99.91%",
    description: "전기·전자 부품용 솔더합금 및 청동 베어링 주조에 적합한 오리지널 주석 잉곳 설재입니다. 야적 보관에 따른 표면 변색이 없으며 청결한 실내 정밀 보관함에서 방습 포장 처리되어 보전되었습니다. 표면 산화막 발생율이 극도로 마이너스화되어 투입 시 용해 슬래그 손실율이 매우 낮습니다.",
    status: "예약중",
    images: ["/src/assets/images/tin_ingot_scrap_1781962009292.jpg"],
    created_at: "2026-06-19T09:15:00Z"
  },
  {
    id: "seed-4",
    name: "알루미늄 6063 압출 프로파일 (Aluminum Extrusion Scrap)",
    category: "알루미늄스크랩",
    quantity: 22.0,
    unit: "ton",
    composition: "Al 98.5% (Si-Mg 계열)",
    description: "도장 및 실버 피막이 된 고급 건축용 알루미늄 6063 압출 형재 스크랩입니다. 가공 및 구조재용 절단 설재로, 철재 피스, 실리콘 패킹, 아세탈 완충재 등 비철 스크랩 이외의 불순물을 2단계 자력 선별 및 인력 검수로 철저히 완료했습니다.",
    status: "판매중",
    images: ["/src/assets/images/recycled_aluminum_scrap_1781962027243.jpg"],
    created_at: "2026-06-15T14:20:00Z"
  },
  {
    id: "seed-5",
    name: "포금 청동 밸브 주물 스크랩 (Gunmetal Bronze Scrap)",
    category: "기타",
    quantity: 8.5,
    unit: "ton",
    composition: "Cu 85%, Sn 5%, Zn 5%, Pb 5% (CAC406)",
    description: "산업용 배관 청동 밸브 및 대형 펌프 임펠러 주물에서 컷팅 선별해 낸 포금(Gunmetal) 고품질 주조 스크랩입니다. 수입 신주 피팅류가 혼입되지 않은 오리지널 청동 스크랩만을 분해 세척하여 유분 및 흑연 패킹을 제거했습니다. 청동 밸브 가마 투입용 성분 검증 완수품.",
    status: "판매완료",
    images: ["/src/assets/images/copper_wire_scrap_1781961976592.jpg"],
    created_at: "2026-06-10T16:45:00Z"
  },
  {
    id: "seed-6",
    name: "태양광 주석도금 구리 버스바 (Tin-Coated Copper Busbar)",
    category: "동스크랩",
    quantity: 6.2,
    unit: "ton",
    composition: "Cu 97.5%, Sn 2.0%",
    description: "신재생 태양광 패널 및 수배전반 철거 리스크에서 훼손 수거된 순동 주석 주조 Busbar 스크랩 전량입니다. 외면 도금 형태가 균질하여 탈주석 작업 없이 곧바로 동-주석 합금 황동 및 청동 가마에 투입할 수 있습니다.",
    status: "판매완료",
    images: ["/src/assets/images/tin_ingot_scrap_1781962009292.jpg"],
    created_at: "2026-06-08T09:00:00Z"
  }
];
