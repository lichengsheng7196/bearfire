import { create } from 'zustand';
import { Supplier } from '../types/supplyChainTypes';
import { mockSuppliers } from '../data/mockData';

interface SupplyChainState {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  
  fetchSuppliers: () => Promise<void>;
  getSupplierById: (id: string) => Supplier | undefined;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<Supplier>;
  updateSupplier: (id: string, data: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  getSuppliersByRating: (rating: number) => Supplier[];
}

export const useSupplyChainStore = create<SupplyChainState>((set, get) => ({
  suppliers: [],
  loading: false,
  error: null,
  
  fetchSuppliers: async () => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ suppliers: mockSuppliers, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch suppliers', 
        loading: false 
      });
    }
  },
  
  getSupplierById: (id) => {
    return get().suppliers.find(supplier => supplier.id === id);
  },
  
  addSupplier: async (supplier) => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newSupplier: Supplier = {
        id: `supplier-${Date.now()}`,
        ...supplier
      };
      
      set(state => ({ 
        suppliers: [...state.suppliers, newSupplier],
        loading: false
      }));
      
      return newSupplier;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add supplier', 
        loading: false 
      });
      throw error;
    }
  },
  
  updateSupplier: async (id, data) => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        suppliers: state.suppliers.map(supplier => 
          supplier.id === id ? { ...supplier, ...data } : supplier
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update supplier', 
        loading: false 
      });
      throw error;
    }
  },
  
  deleteSupplier: async (id) => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        suppliers: state.suppliers.filter(supplier => supplier.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete supplier', 
        loading: false 
      });
      throw error;
    }
  },
  
  getSuppliersByRating: (rating) => {
    return get().suppliers.filter(supplier => supplier.rating === rating);
  }
}));