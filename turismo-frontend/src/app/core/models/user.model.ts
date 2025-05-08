export interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
  google_id?: string;
  foto_perfil?: string;
  email_verified_at?: string;
  roles?: Array<{
    id: number;
    name: string;
    permissions?: string[] | Permission[];
  }>;
  country?: string;
  birth_date?: string;
  address?: string;
  gender?: string;
  preferred_language?: string;
  last_login?: string;
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
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  foto_perfil?: File | null;
  country?: string;
  birth_date?: string;
  address?: string;
  gender?: string;
  preferred_language?: string;
  [key: string]: string | File | null | undefined;
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
  email_verified?: boolean;
}
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface VerifyEmailRequest {
  id: number;
  hash: string;
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