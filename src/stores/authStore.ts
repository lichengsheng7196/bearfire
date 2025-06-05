import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'operations_manager' | 'product_manager' | 'purchasing_specialist' | 'erp_specialist';

interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  email?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      
      login: async (username: string, password: string) => {
        // In a real app, this would be an API call
        if (username === 'admin' && password === 'admin123') {
          set({
            isAuthenticated: true,
            user: {
              id: '1',
              username: 'admin',
              name: '管理员',
              role: 'admin'
            },
            token: 'fake-auth-token'
          });
          return;
        }
        
        // Mock users for different roles
        const mockUsers: Record<string, User> = {
          'ops': {
            id: '2',
            username: 'ops',
            name: '袁鹏',
            role: 'operations_manager'
          },
          'product': {
            id: '3',
            username: 'product',
            name: '马少华',
            role: 'product_manager'
          },
          'purchase': {
            id: '4',
            username: 'purchase',
            name: '张晓燕',
            role: 'purchasing_specialist'
          },
          'erp': {
            id: '5',
            username: 'erp',
            name: '刘洋',
            role: 'erp_specialist'
          }
        };
        
        // For demo purposes, if password is 'password', log in as that role
        if (password === 'password' && mockUsers[username]) {
          set({
            isAuthenticated: true,
            user: mockUsers[username],
            token: 'fake-auth-token'
          });
          return;
        }
        
        throw new Error('Invalid credentials');
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null
        });
      },
      
      updateUserProfile: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      }
    }),
    {
      name: 'bearfire-auth-storage'
    }
  )
);