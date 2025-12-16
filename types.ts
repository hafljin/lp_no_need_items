export enum InquiryStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  address: string;
  preferredDate: string;
  itemsDescription: string;
  imagePreviewUrl?: string; // For display
  imageBase64?: string; // For storage/API
  aiEstimate?: string;
  status: InquiryStatus;
  createdAt: number;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  capacity: string;
  features: string[];
  recommended: boolean;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
