import { create } from 'zustand';
import { ProductPool, WorkflowStatus, EvaluationStatus, Review } from '../types/productTypes';
import { mockProductPools } from '../data/mockData';

interface ProductPoolState {
  productPools: ProductPool[];
  loading: boolean;
  error: string | null;
  
  fetchProductPools: () => Promise<void>;
  getProductPoolById: (id: string) => ProductPool | undefined;
  addProductPool: (productPool: Omit<ProductPool, 'id'>) => Promise<ProductPool>;
  updateProductPool: (id: string, data: Partial<ProductPool>) => Promise<void>;
  updateWorkflowStatus: (id: string, status: WorkflowStatus, data?: any) => Promise<void>;
  addReview: (productPoolId: string, review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  updateEvaluationStatus: (id: string, status: EvaluationStatus) => Promise<void>;
  uploadSampleImages: (id: string, images: string[]) => Promise<void>;
  confirmOrderAndCreateContract: (id: string, contractInfo: any) => Promise<void>;
}

export const useProductPoolStore = create<ProductPoolState>((set, get) => ({
  productPools: [],
  loading: false,
  error: null,
  
  fetchProductPools: async () => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For demo, we'll use mock data
      // Delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ productPools: mockProductPools, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch product pools', 
        loading: false 
      });
    }
  },
  
  getProductPoolById: (id) => {
    return get().productPools.find(pool => pool.id === id);
  },
  
  addProductPool: async (productPool) => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newProductPool: ProductPool = {
        id: `pp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...productPool,
        timeline: [{
          id: `tl-${Date.now()}`,
          date: new Date().toISOString(),
          title: '创建选品池',
          description: `${productPool.createdBy.name} 创建了选品池`,
          status: 'created'
        }],
        reviews: [],
        workflowStatus: 'pending_review'
      };
      
      set(state => ({ 
        productPools: [newProductPool, ...state.productPools],
        loading: false
      }));
      
      return newProductPool;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add product pool', 
        loading: false 
      });
      throw error;
    }
  },
  
  updateProductPool: async (id, data) => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        productPools: state.productPools.map(pool => 
          pool.id === id ? { ...pool, ...data } : pool
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update product pool', 
        loading: false 
      });
      throw error;
    }
  },
  
  updateWorkflowStatus: async (id, status, data) => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { user } = JSON.parse(localStorage.getItem('bearfire-auth-storage') || '{}').state;
      
      const timelineEvent = {
        id: `tl-${Date.now()}`,
        date: new Date().toISOString(),
        status,
        actor: user
      };
      
      // Customize timeline event based on status
      switch (status) {
        case 'pending_review':
          timelineEvent.title = '等待评审';
          timelineEvent.description = `${user.name} 提交产品等待评审`;
          break;
        case 'sample_approved':
          timelineEvent.title = '确认拿样';
          timelineEvent.description = `${user.name} 确认拿样`;
          break;
        case 'sample_rejected':
          timelineEvent.title = '不予采纳';
          timelineEvent.description = `${user.name} 不予采纳该产品`;
          break;
        case 'sample_received':
          timelineEvent.title = '样品签收';
          timelineEvent.description = `${user.name} 签收了样品`;
          break;
        case 'order_approved':
          timelineEvent.title = '确认订货';
          timelineEvent.description = `${user.name} 确认订货`;
          break;
        case 'order_rejected':
          timelineEvent.title = '不予采纳';
          timelineEvent.description = `${user.name} 不予采纳该产品`;
          break;
        case 'contract_uploaded':
          timelineEvent.title = '上传合同';
          timelineEvent.description = `${user.name} 上传了合同`;
          break;
        case 'order_placed':
          timelineEvent.title = '发起订货';
          timelineEvent.description = `${user.name} 发起了订货`;
          break;
        case 'stock_received':
          timelineEvent.title = '确认入仓';
          timelineEvent.description = `${user.name} 确认产品入仓`;
          break;
        case 'launched':
          timelineEvent.title = '产品上架';
          timelineEvent.description = `${user.name} 已上架产品`;
          break;
        case 'restock_needed':
          timelineEvent.title = '库存不足';
          timelineEvent.description = `${user.name} 发起补货`;
          break;
        default:
          timelineEvent.title = '状态更新';
          timelineEvent.description = `${user.name} 更新了状态`;
      }
      
      // Merge additional data if provided
      if (data) {
        Object.assign(timelineEvent, { data });
      }
      
      set(state => ({
        productPools: state.productPools.map(pool => 
          pool.id === id ? { 
            ...pool, 
            workflowStatus: status,
            timeline: [timelineEvent, ...pool.timeline]
          } : pool
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update workflow status', 
        loading: false 
      });
      throw error;
    }
  },
  
  addReview: async (productPoolId, review) => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newReview: Review = {
        id: `review-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...review
      };
      
      set(state => ({
        productPools: state.productPools.map(pool => 
          pool.id === productPoolId ? { 
            ...pool, 
            reviews: [newReview, ...pool.reviews],
            timeline: [{
              id: `tl-${Date.now()}`,
              date: new Date().toISOString(),
              title: '新增评审意见',
              description: `${review.reviewer.name} 新增了评审意见`,
              status: 'reviewed'
            }, ...pool.timeline]
          } : pool
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add review', 
        loading: false 
      });
      throw error;
    }
  },
  
  updateEvaluationStatus: async (id, status) => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        productPools: state.productPools.map(pool => 
          pool.id === id ? { ...pool, evaluationStatus: status } : pool
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update evaluation status', 
        loading: false 
      });
      throw error;
    }
  },
  
  uploadSampleImages: async (id, images) => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        productPools: state.productPools.map(pool => 
          pool.id === id ? { ...pool, sampleImages: [...(pool.sampleImages || []), ...images] } : pool
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to upload sample images', 
        loading: false 
      });
      throw error;
    }
  },
  
  confirmOrderAndCreateContract: async (id, contractInfo) => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        productPools: state.productPools.map(pool => 
          pool.id === id ? { 
            ...pool, 
            contract: {
              ...contractInfo,
              createdAt: new Date().toISOString()
            }
          } : pool
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to confirm order', 
        loading: false 
      });
      throw error;
    }
  }
}));