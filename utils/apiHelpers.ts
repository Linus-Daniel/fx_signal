// File: src/utils/apiHelpers.ts
import { ApiError } from "../types";

export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error status
    const { data, status } = error.response;

    if (data?.message) {
      return data.message;
    }

    switch (status) {
      case 400:
        return "Bad request. Please check your input.";
      case 401:
        return "Unauthorized. Please log in again.";
      case 403:
        return "Access forbidden. You don't have permission.";
      case 404:
        return "Resource not found.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return `Request failed with status ${status}`;
    }
  } else if (error.request) {
    // Network error
    return "Network error. Please check your internet connection.";
  } else {
    // Other error
    return error.message || "An unexpected error occurred.";
  }
};

export const createQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((item) => queryParams.append(key, item.toString()));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  return queryParams.toString();
};

export const downloadFile = async (
  url: string,
  filename: string
): Promise<void> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Download failed:", error);
    throw new Error("Failed to download file");
  }
};
