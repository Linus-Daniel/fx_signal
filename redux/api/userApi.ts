// File: src/store/api/userAPI.ts
import { apiClient } from "./ApiClient";

interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    signals: boolean;
    news: boolean;
  };
  theme: "light" | "dark" | "auto";
  language: string;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phoneNumber?: string;
  country?: string;
  broker?: string;
  accountType?: "demo" | "live";
}

export const userAPI = {
  getProfile: () => {
    return apiClient.get("/users/profile");
  },

  updateProfile: (profile: Partial<UserProfile>) => {
    return apiClient.put("/users/profile", profile);
  },

  getUserStats: () => {
    return apiClient.get("/users/stats");
  },

  getPreferences: () => {
    return apiClient.get("/users/preferences");
  },

  updatePreferences: (preferences: Partial<UserPreferences>) => {
    return apiClient.put("/users/preferences", preferences);
  },

  updatePushToken: (token: string) => {
    return apiClient.put("/users/push-token", { token });
  },

  uploadAvatar: (imageUri: string) => {
    const formData = new FormData();
    formData.append("avatar", {
      uri: imageUri,
      type: "image/jpeg",
      name: "avatar.jpg",
    } as any);

    return apiClient.post("/users/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getNotifications: () => {
    return apiClient.get("/users/notifications");
  },

  markNotificationAsRead: (notificationId: string) => {
    return apiClient.put(`/users/notifications/${notificationId}/read`);
  },

  clearAllNotifications: () => {
    return apiClient.delete("/users/notifications");
  },

  getActivityLog: (page: number = 1, limit: number = 20) => {
    return apiClient.get(`/users/activity?page=${page}&limit=${limit}`);
  },

  deleteAccount: () => {
    return apiClient.delete("/users/account");
  },

  exportData: () => {
    return apiClient.get("/users/export-data");
  },
};
