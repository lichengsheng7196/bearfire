export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phoneNumber: string;
  email?: string;
  address: {
    province: string;
    city: string;
    address: string;
    postalCode?: string;
  };
  businessLicense?: string;
  taxId?: string;
  bankInfo?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  rating: number;  // 1-5 stars
  performanceMetrics?: {
    onTimeDeliveryRate?: number;
    qualityPassRate?: number;
    responseTime?: number;
    cooperationYears?: number;
  };
  productCategories: string[];
  contracts?: {
    id: string;
    title: string;
    fileUrl?: string;
    signDate: string;
    validUntil: string;
  }[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}