import { io, Socket } from "socket.io-client";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../redux/store/store";
import {
  updateSignalRealtime,
  addSignalRealtime,
} from "../redux/slices/SignalSlice";
import { showNotification } from "./notificationService";

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  async connect(): Promise<void> {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      const token = await AsyncStorage.getItem("auth_token");
      const apiUrl = __DEV__
        ? "http://localhost:3000"
        : "https://api.yourcompany.com";

      this.socket = io(apiUrl, {
        auth: { token },
        transports: ["websocket"],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      this.setupEventListeners();
      this.setupAppStateListener();
    } catch (error) {
      console.error("Socket connection failed:", error);
    } finally {
      this.isConnecting = false;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
      this.reconnectAttempts = 0;

      // Join user-specific room
      this.socket?.emit("join_user_room");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);

      if (reason === "io server disconnect") {
        // Server-initiated disconnect, try to reconnect
        this.socket?.connect();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("Max reconnection attempts reached");
      }
    });

    // Signal events
    this.socket.on("new_signal", (signal) => {
      console.log("New signal received:", signal);
      store.dispatch(addSignalRealtime(signal));

      // Show push notification if app is in background
      if (AppState.currentState !== "active") {
        showNotification({
          title: "🔔 New Trading Signal",
          body: `${signal.currencyPair} - ${signal.signalType} at ${signal.entryPrice}`,
          data: { type: "new_signal", signalId: signal.id },
        });
      }
    });

    this.socket.on("signal_updated", (signal) => {
      console.log("Signal updated:", signal);
      store.dispatch(updateSignalRealtime(signal));

      // Show notification for important updates
      if (signal.status === "closed" && AppState.currentState !== "active") {
        const result =
          signal.resultPips > 0 ? `+${signal.resultPips}` : signal.resultPips;
        showNotification({
          title: "📊 Signal Closed",
          body: `${signal.currencyPair} closed with ${result} pips`,
          data: { type: "signal_update", signalId: signal.id },
        });
      }
    });

    // Market data events
    this.socket.on("price_update", (priceData) => {
      // Handle real-time price updates
      console.log("Price update:", priceData);
      // Dispatch to appropriate slice
    });

    // News events
    this.socket.on("breaking_news", (newsItem) => {
      console.log("Breaking news:", newsItem);

      if (AppState.currentState !== "active") {
        showNotification({
          title: "📰 Breaking News",
          body: newsItem.title,
          data: { type: "news", newsId: newsItem.id },
        });
      }
    });

    // Analysis events
    this.socket.on("ai_analysis_update", (analysis) => {
      console.log("AI analysis update:", analysis);
      // Handle AI analysis updates
    });
  }

  private setupAppStateListener(): void {
    AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        // App became active, ensure socket is connected
        if (!this.socket?.connected) {
          this.connect();
        }
      } else if (nextAppState === "background") {
        // App went to background, keep connection but reduce activity
        this.socket?.emit("user_inactive");
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Send events to server
  copySignal(signalId: string): void {
    this.socket?.emit("copy_signal", { signalId });
  }

  viewSignal(signalId: string): void {
    this.socket?.emit("view_signal", { signalId });
  }

  getUserActivity(): void {
    this.socket?.emit("user_active");
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
