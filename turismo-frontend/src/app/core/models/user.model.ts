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
  foto_perfil_url?: string | null;
  avatar?: string | null;
  email_verified_at?: string | null;
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
  permissions?: Permission[];
  pivot?: {
    user_id?: number;
    emprendedor_id?: number;
    es_principal?: boolean;
    rol?: string;
    created_at?: string;
    updated_at?: string;
  };
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
export interface ProfileResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    roles?: string[];
    permissions?: string[];
    administra_emprendimientos?: boolean;
    emprendimientos?: any[];
    email_verified?: boolean;
  };
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
export interface RoleInfo {
  id: number;
  name: string;
  display_name: string;
  permissions_count: number;
}

// Extensión del modelo User existente para incluir los nuevos campos
export interface ExtendedUser extends User {
  country?: string;
  birth_date?: string;
  address?: string;
  gender?: string;
  preferred_language?: string;
  last_login?: string;
  roles_info?: RoleInfo[];
  is_admin?: boolean;
  has_permissions?: boolean;
  administra_emprendimientos?: boolean;
  emprendimientos_count?: number;
  emprendimientos?: UserEnterprise[];
}
export interface UserEnterprise {
  id: number;
  nombre: string;
  es_principal: boolean;
  rol: string;
}
export interface UserResponse {
  success: boolean;
  data: {
    current_page: number;
    data: User[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  available_roles: {
    id: number;
    name: string;
  }[];
}