// File: src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "../api";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin" | "signal_provider";
  avatar?: string;
  subscription: {
    plan: "free" | "premium" | "professional";
    status: "active" | "cancelled" | "expired" | "past_due";
    expiresAt?: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      signals: boolean;
      news: boolean;
    };
    theme: "light" | "dark" | "auto";
    language: string;
  };
  statistics: {
    signalsCopied: number;
    successfulTrades: number;
    totalProfit: number;
    winRate: number;
  };
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isInitialized: false,
};

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.login(credentials);

      // Store tokens
      await AsyncStorage.multiSet([
        ["auth_token", response.data.token],
        ["refresh_token", response.data.refreshToken],
        ["user_data", JSON.stringify(response.data.user)],
      ]);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await AsyncStorage.multiRemove(["auth_token", "refresh_token", "user_data"]);
  return null;
});

export const refreshAuthToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await authAPI.refreshToken(auth.refreshToken);

      await AsyncStorage.multiSet([
        ["auth_token", response.data.token],
        ["refresh_token", response.data.refreshToken],
      ]);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Token refresh failed"
      );
    }
  }
);

export const loadStoredAuth = createAsyncThunk("auth/loadStored", async () => {
  try {
    const [token, refreshToken, userData] = await AsyncStorage.multiGet([
      "auth_token",
      "refresh_token",
      "user_data",
    ]);

    if (token[1] && refreshToken[1] && userData[1]) {
      return {
        token: token[1],
        refreshToken: refreshToken[1],
        user: JSON.parse(userData[1]),
      };
    }
    return null;
  } catch (error) {
    return null;
  }
});

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (updates: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(updates);

      // Update stored user data
      await AsyncStorage.setItem(
        "user_data",
        JSON.stringify(response.data.user)
      );

      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Profile update failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    });

    // Load stored auth
    builder
      .addCase(loadStoredAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadStoredAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitialized = true;

        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
        } else {
          state.isAuthenticated = false;
        }
      })
      .addCase(loadStoredAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.isInitialized = true;
      });

    // Refresh token
    builder
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshAuthToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateUser, setInitialized } = authSlice.actions;
export default authSlice.reducer;
