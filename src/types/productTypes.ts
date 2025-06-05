import { User } from './userTypes';
import { Supplier } from './supplyChainTypes';

export type ProductCategory = 
  | 'fishing_rod' 
  | 'fishing_reel' 
  | 'fishing_line' 
  | 'fishing_hook' 
  | 'fishing_lure' 
  | 'fishing_accessory' 
  | 'fishing_apparel';

export type StoreType = 'pop' | 'self_operated';

export type PriorityLevel = 'high' | 'medium' | 'low';

export type WorkflowStatus = 
  | 'pending_review'
  | 'sample_approved'
  | 'sample_rejected'
  | 'sample_received'
  | 'order_approved'
  | 'order_rejected'
  | 'contract_uploaded'
  | 'order_placed'
  | 'stock_received'
  | 'launched'
  | 'restock_needed';

export type EvaluationStatus = 'pending' | 'approved' | 'rejected';

export type TimelineEventStatus = 
  | 'created'
  | 'updated'
  | 'reviewed'
  | 'sample_approved'
  | 'sample_rejected'
  | 'sample_received'
  | 'order_approved'
  | 'order_rejected'
  | 'contract_uploaded'
  | 'order_placed'
  | 'stock_received'
  | 'launched'
  | 'restock_needed';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  status: TimelineEventStatus;
  actor?: User;
  data?: any;
}

export interface Review {
  id: string;
  reviewer: User;
  content: string;
  createdAt: string;
}

export interface PurchaseInfo {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'partial' | 'completed';
  purchaseDate: string;
  deliveryDate?: string;
  logisticsCompany?: string;
  trackingNumber?: string;
  invoiceInfo?: {
    invoiceType: string;
    invoiceNumber?: string;
    invoiceDate?: string;
  };
}

export interface Contract {
  id?: string;
  fileUrl?: string;
  title: string;
  supplierName: string;
  signDate: string;
  createdAt: string;
  validUntil?: string;
  terms?: string;
}

export interface ProductPool {
  id: string;
  productName: string;
  productImages: string[];
  sampleImages?: string[];
  category: ProductCategory;
  requirementId: string;
  factoryPrice: number;
  tax: number;
  supplier: Supplier;
  description: string;
  customizationRequirements?: string;
  specifications: {
    dimensions?: string;
    weight?: string;
    materials?: string[];
    colors?: string[];
  };
  accessories?: string[];
  packaging?: string;
  sampleTimeframe: string;
  productionTimeframe: string;
  minimumOrderQuantity: number;
  competitorLinks?: string[];
  competitorAnalysis?: string;
  marketAnalysis?: string;
  riskLevel: 'high' | 'medium' | 'low';
  createdAt: string;
  createdBy: User;
  updatedAt?: string;
  evaluationStatus?: EvaluationStatus;
  workflowStatus: WorkflowStatus;
  timeline: TimelineEvent[];
  reviews: Review[];
  purchaseInfo?: PurchaseInfo;
  contract?: Contract;
  productLink?: string;
  inventory?: {
    totalStock: number;
    available: number;
    reserved: number;
    threshold: number;
    lastUpdated: string;
  };
}

export interface Requirement {
  id: string;
  title: string;
  storeType: StoreType;
  category: ProductCategory;
  initialImages?: string[];
  priority: PriorityLevel;
  marketPositioning: string;
  marketingStrategy?: string;
  competitorAnalysis?: string;
  plannedLaunchDate: string;
  createdAt: string;
  createdBy: User;
  updatedAt?: string;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
}