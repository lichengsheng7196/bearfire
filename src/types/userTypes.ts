export type UserRole = 
  | 'admin' 
  | 'operations_manager' 
  | 'product_manager' 
  | 'purchasing_specialist' 
  | 'erp_specialist';

export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  role: UserRole;
  department?: string;
  createdAt?: string;
  lastLogin?: string;
  isActive?: boolean;
  permissions?: string[];
}