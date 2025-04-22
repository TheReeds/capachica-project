export interface User {
  id?: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
  roles?: Role[];
}

export interface Role {
  id: number;
  name: string;
  guard_name?: string;
  created_at?: string;
  updated_at?: string;
  permissions?: string[] | Permission[];
  pivot?: any;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at?: string;
  updated_at?: string;
  pivot?: any;
}

export interface RegisterRequest {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

export interface UserPermissions {
  user: {
    id: number;
    name: string;
    email: string;
  };
  direct_permissions: string[];
  permissions_via_roles: string[];
  all_permissions: string[];
}

export interface RoleWithPermissions {
  role: {
    id: number;
    name: string;
  };
  permissions: string[];
}