import { create } from 'zustand';
import { 
  Requirement, 
  RequirementStatus, 
  StoreType, 
  Category, 
  Priority,
  RequirementFilters,
  RequirementFormData,
  User
} from '../types/requirementTypes';
import { mockRequirements } from '../data/mockData';
import { useAuthStore } from './authStore';

interface RequirementState {
  requirements: Requirement[];
  loading: boolean;
  error: string | null;
  filters: RequirementFilters;
  
  fetchRequirements: () => Promise<void>;
  getRequirementById: (id: string) => Requirement | undefined;
  addRequirement: (requirement: RequirementFormData) => Promise<Requirement>;
  updateRequirement: (id: string, data: Partial<RequirementFormData>) => Promise<void>;
  deleteRequirement: (id: string) => Promise<void>;
  addReview: (requirementId: string, content: string) => Promise<void>;
  updateStatus: (id: string, status: RequirementStatus) => Promise<void>;
  setFilters: (filters: Partial<RequirementFilters>) => void;
  clearFilters: () => void;
  getFilteredRequirements: () => Requirement[];
}

export const useRequirementStore = create<RequirementState>((set, get) => ({
  requirements: [],
  loading: false,
  error: null,
  filters: {},
  
  fetchRequirements: async () => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For demo, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ requirements: mockRequirements, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch requirements', 
        loading: false 
      });
    }
  },
  
  getRequirementById: (id) => {
    return get().requirements.find(req => req.id === id);
  },
  
  addRequirement: async (requirement) => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const newRequirement: Requirement = {
        id: `req-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
        reviews: [],
        createdBy: {
          id: currentUser.id,
          username: currentUser.username,
          name: currentUser.name,
          role: currentUser.role
        },
        ...requirement
      };
      
      set(state => ({ 
        requirements: [newRequirement, ...state.requirements],
        loading: false
      }));
      
      return newRequirement;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add requirement', 
        loading: false 
      });
      throw error;
    }
  },
  
  updateRequirement: async (id, data) => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        requirements: state.requirements.map(req => 
          req.id === id 
            ? { 
                ...req, 
                ...data,
                updatedAt: new Date().toISOString()
              } 
            : req
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update requirement', 
        loading: false 
      });
      throw error;
    }
  },

  deleteRequirement: async (id) => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        requirements: state.requirements.filter(req => req.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete requirement', 
        loading: false 
      });
      throw error;
    }
  },

  addReview: async (requirementId, content) => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const newReview = {
        id: `review-${Date.now()}`,
        content,
        createdAt: new Date().toISOString(),
        createdBy: {
          id: currentUser.id,
          username: currentUser.username,
          name: currentUser.name,
          role: currentUser.role
        }
      };
      
      set(state => ({
        requirements: state.requirements.map(req => 
          req.id === requirementId 
            ? { 
                ...req, 
                reviews: [...req.reviews, newReview],
                updatedAt: new Date().toISOString()
              } 
            : req
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

  updateStatus: async (id, status) => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        requirements: state.requirements.map(req => 
          req.id === id 
            ? { 
                ...req, 
                status,
                updatedAt: new Date().toISOString()
              } 
            : req
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update status', 
        loading: false 
      });
      throw error;
    }
  },

  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  getFilteredRequirements: () => {
    const { requirements, filters } = get();
    
    return requirements.filter(req => {
      const matchesSearch = !filters.searchQuery || 
        req.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        req.createdBy.name.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      const matchesStoreType = !filters.storeType || req.storeType === filters.storeType;
      const matchesCategory = !filters.category || req.category === filters.category;
      const matchesPriority = !filters.priority || req.priority === filters.priority;
      const matchesStatus = !filters.status || req.status === filters.status;
      
      const matchesDateRange = !filters.startDate || !filters.endDate || (
        new Date(req.plannedLaunchDate) >= new Date(filters.startDate) &&
        new Date(req.plannedLaunchDate) <= new Date(filters.endDate)
      );
      
      return matchesSearch && matchesStoreType && matchesCategory && 
             matchesPriority && matchesStatus && matchesDateRange;
    });
  }
}));