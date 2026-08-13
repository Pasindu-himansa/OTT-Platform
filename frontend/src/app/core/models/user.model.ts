export interface User {
  id: string;
  name: string;
  email: string;
  role: 'guest' | 'subscriber' | 'admin' | 'content_manager';
  avatar?: string;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
