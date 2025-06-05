export type StoreType = 'pop' | 'self_operated';
export type Category = 'fishing_rod' | 'fishing_reel' | 'fishing_accessory' | 'fishing_clothing';
export type Priority = 'high' | 'medium' | 'low';
export type RequirementStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled';

export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  role: string;
  department?: string;
  createdAt?: string;
  lastLogin?: string;
  isActive?: boolean;
  permissions?: string[];
}

export interface Review {
  id: string;
  content: string;
  createdAt: string;
  createdBy: User;
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  storeType: StoreType;
  category: Category;
  priority: Priority;
  status: RequirementStatus;
  marketPositioning?: string;
  marketingStrategy?: string;
  competitorAnalysis?: string;
  plannedLaunchDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  reviews: Review[];
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: string;
  }[];
  image?: string;
  seoKeyword?: string;
}

export interface RequirementFormData {
  title: string;
  description: string;
  storeType: StoreType;
  category: Category;
  priority: Priority;
  marketPositioning?: string;
  marketingStrategy?: string;
  competitorAnalysis?: string;
  plannedLaunchDate: string;
}

export interface RequirementFilters {
  searchQuery?: string;
  storeType?: StoreType;
  category?: Category;
  priority?: Priority;
  status?: RequirementStatus;
  startDate?: string;
  endDate?: string;
} 