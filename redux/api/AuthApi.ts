// File: src/store/api/authAPI.ts
import { apiClient } from "./ApiClient";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  subscription: any;
  preferences: any;
  statistics: any;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

export const authAPI = {
  login: (credentials: LoginCredentials) => {
    return apiClient.post("/auth/login", credentials);
  },

  register: (userData: RegisterData) => {
    return apiClient.post("/auth/register", userData);
  },

  logout: () => {
    return apiClient.post("/auth/logout");
  },

  refreshToken: (refreshToken: string) => {
    return apiClient.post("/auth/refresh-token", { refreshToken });
  },

  forgotPassword: (email: string) => {
    return apiClient.post("/auth/forgot-password", { email });
  },

  resetPassword: (token: string, password: string) => {
    return apiClient.post("/auth/reset-password", { token, password });
  },

  verifyEmail: (token: string) => {
    return apiClient.post("/auth/verify-email", { token });
  },

  resendVerification: () => {
    return apiClient.post("/auth/resend-verification");
  },

  updateProfile: (updates: Partial<User>) => {
    return apiClient.put("/auth/profile", updates);
  },

  changePassword: (currentPassword: string, newPassword: string) => {
    return apiClient.put("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },

  deleteAccount: () => {
    return apiClient.delete("/auth/account");
  },
};
