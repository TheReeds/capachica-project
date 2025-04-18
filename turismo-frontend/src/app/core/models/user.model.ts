export interface User {
    id?: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    roles?: Role[];
  }
  
  export interface Role {
    id: number;
    name: string;
    permissions: string[];
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