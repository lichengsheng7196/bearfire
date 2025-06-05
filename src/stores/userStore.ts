import { create } from 'zustand';
import { User, UserRole } from '../types/userTypes';
import { mockUsers } from '../data/mockData';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  
  fetchUsers: () => Promise<void>;
  getUserById: (id: string) => User | undefined;
  addUser: (user: Omit<User, 'id'>) => Promise<User>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  resetPassword: (id: string) => Promise<void>;
  getUsersByRole: (role: UserRole) => User[];
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  
  fetchUsers: async () => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ users: mockUsers, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch users', 
        loading: false 
      });
    }
  },
  
  getUserById: (id) => {
    return get().users.find(user => user.id === id);
  },
  
  addUser: async (user) => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        ...user
      };
      
      set(state => ({ 
        users: [...state.users, newUser],
        loading: false
      }));
      
      return newUser;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add user', 
        loading: false 
      });
      throw error;
    }
  },
  
  updateUser: async (id, data) => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, ...data } : user
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update user', 
        loading: false 
      });
      throw error;
    }
  },
  
  deleteUser: async (id) => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        users: state.users.filter(user => user.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete user', 
        loading: false 
      });
      throw error;
    }
  },
  
  resetPassword: async (id) => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock implementation - in real app this would reset the password
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reset password', 
        loading: false 
      });
      throw error;
    }
  },
  
  getUsersByRole: (role) => {
    return get().users.filter(user => user.role === role);
  }
}));