export type MetalCategory = "동스크랩" | "니켈스크랩" | "주석스크랩" | "알루미늄스크랩" | "기타";

export type ItemStatus = "판매중" | "예약중" | "판매완료";

export interface InventoryItem {
  id: string;
  name: string;
  category: MetalCategory;
  quantity: number;
  unit: string;
  composition: string;
  description: string;
  status: ItemStatus;
  images: string[];
  created_at: any; // Firestore timestamp or string
}

export interface InquiryForm {
  name: string;
  phone: string;
  email: string;
  message: string;
  itemName: string;
}
