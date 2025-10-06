// File: src/services/notificationService.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: boolean;
  vibrate?: boolean;
  scheduled?: Date;
}

interface PushTokenData {
  token: string;
  type: "expo" | "fcm" | "apn";
}

class NotificationService {
  private initialized = false;
  private notificationListener: any;
  private responseListener: any;

  async init(): Promise<void> {
    if (this.initialized) return;

    // Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
    // Request permissions and get push token
    await this.requestPermissions();
    await this.registerForPushNotificationsAsync();

    // Set up notification listeners
    this.setupNotificationListeners();

    this.initialized = true;
  }

  private setupNotificationListeners(): void {
    // Listen for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
        this.handleNotificationReceived(notification);
      }
    );

    // Listen for user interactions with notifications
    this.responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
        this.handleNotificationResponse(response);
      });
  }

  private async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log("Must use physical device for Push Notifications");
      return false;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return false;
    }

    return true;
  }

  private async registerForPushNotificationsAsync(): Promise<void> {
    try {
      if (!Device.isDevice) {
        console.log("Must use physical device for Push Notifications");
        return;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      console.log("Expo push token:", token.data);

      // Save token locally
      await this.saveToken(token.data);

      // Configure notification channel for Android
      if (Platform.OS === "android") {
        await this.createNotificationChannels();
      }
    } catch (error) {
      console.error("Error getting push token:", error);
    }
  }

  private async createNotificationChannels(): Promise<void> {
    // Default channel
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      description: "Default notifications",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "default",
    });

    // Forex signals channel
    await Notifications.setNotificationChannelAsync("forex-signals", {
      name: "Forex Signals",
      description: "Trading signal notifications",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#2563eb",
      sound: "default",
    });

    // Market alerts channel
    await Notifications.setNotificationChannelAsync("market-alerts", {
      name: "Market Alerts",
      description: "Important market updates",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 500, 250, 500],
      lightColor: "#dc2626",
      sound: "default",
    });

    // News channel
    await Notifications.setNotificationChannelAsync("news", {
      name: "News Updates",
      description: "Market news and analysis",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250],
      lightColor: "#059669",
      sound: "default",
    });
  }

  private async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem("expo_push_token", token);

      // TODO: Send token to your backend
      // await userAPI.updatePushToken(token);
    } catch (error) {
      console.error("Failed to save push token:", error);
    }
  }

  async showNotification(data: NotificationData): Promise<void> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: data.title,
          body: data.body,
          data: data.data || {},
          sound: data.sound !== false ? "default" : undefined,
          badge: 1,
        },
        trigger: data.scheduled ? { date: data.scheduled } : null,
      });

      console.log("Notification scheduled:", notificationId);
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  }

  async showSignalNotification(signal: {
    id: string;
    currencyPair: string;
    type: "BUY" | "SELL";
    entryPrice: number;
  }): Promise<void> {
    await this.showNotification({
      title: "New Trading Signal",
      body: `${signal.currencyPair} ${signal.type} at ${signal.entryPrice}`,
      data: {
        type: "new_signal",
        signalId: signal.id,
        screen: "SignalDetails",
      },
    });
  }

  async showSignalUpdateNotification(update: {
    id: string;
    currencyPair: string;
    status: string;
    message: string;
  }): Promise<void> {
    await this.showNotification({
      title: "Signal Update",
      body: `${update.currencyPair}: ${update.message}`,
      data: {
        type: "signal_update",
        signalId: update.id,
        screen: "SignalDetails",
      },
    });
  }

  async showNewsNotification(news: {
    id: string;
    title: string;
    impact: "low" | "medium" | "high";
  }): Promise<void> {
    const impactEmoji = {
      low: "📝",
      medium: "⚠️",
      high: "🚨",
    };

    await this.showNotification({
      title: `${impactEmoji[news.impact]} Market News`,
      body: news.title,
      data: {
        type: "news",
        newsId: news.id,
        screen: "NewsDetails",
      },
    });
  }

  async scheduleSignalReminder(
    signalId: string,
    scheduledTime: Date
  ): Promise<void> {
    await this.showNotification({
      title: "Signal Reminder",
      body: "Don't forget to check your active trading signals",
      data: {
        type: "reminder",
        signalId,
        screen: "SignalDetails",
      },
      scheduled: scheduledTime,
    });
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("All notifications cancelled");
    } catch (error) {
      console.error("Error cancelling notifications:", error);
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log("Notification cancelled:", notificationId);
    } catch (error) {
      console.error("Error cancelling notification:", error);
    }
  }

  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error("Error getting badge count:", error);
      return 0;
    }
  }

  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error("Error setting badge count:", error);
    }
  }

  async clearBadge(): Promise<void> {
    await this.setBadgeCount(0);
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem("expo_push_token");
    } catch (error) {
      console.error("Error getting push token:", error);
      return null;
    }
  }

  private handleNotificationReceived(
    notification: Notifications.Notification
  ): void {
    // Handle notification received while app is in foreground
    const { data } = notification.request.content;

    console.log("Handling notification:", {
      title: notification.request.content.title,
      body: notification.request.content.body,
      data,
    });

    // You can show custom in-app notification UI here
    // or update app state based on notification data
  }

  private handleNotificationResponse(
    response: Notifications.NotificationResponse
  ): void {
    const { data } = response.notification.request.content;

    console.log("User interacted with notification:", data);

    // Handle navigation based on notification type
    this.handleNotificationNavigation(data);
  }

  private handleNotificationNavigation(data: any): void {
    if (!data) return;

    // Import navigation service if you have one set up
    // NavigationService.navigate(data.screen, { id: data.signalId || data.newsId });

    switch (data.type) {
      case "new_signal":
      case "signal_update":
        console.log("Navigate to signal details:", data.signalId);
        // Navigate to SignalDetails screen with signalId
        break;

      case "news":
        console.log("Navigate to news details:", data.newsId);
        // Navigate to NewsDetails screen with newsId
        break;

      case "reminder":
        console.log("Navigate to signals list");
        // Navigate to Signals screen
        break;

      default:
        console.log("Default notification navigation");
      // Navigate to home screen or handle default case
    }
  }

  async areNotificationsEnabled(): Promise<boolean> {
    try {
      const settings = await Notifications.getPermissionsAsync();
      return settings.granted && settings.status === "granted";
    } catch (error) {
      console.error("Error checking notification permissions:", error);
      return false;
    }
  }

  async openNotificationSettings(): Promise<void> {
    try {
      await Notifications.openSettingsAsync();
    } catch (error) {
      console.error("Error opening notification settings:", error);
    }
  }

  // Clean up listeners when the service is destroyed
  cleanup(): void {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

// Convenience functions
export const showNotification = (data: NotificationData) => {
  return notificationService.showNotification(data);
};

export const showSignalNotification = (signal: any) => {
  return notificationService.showSignalNotification(signal);
};

export const showNewsNotification = (news: any) => {
  return notificationService.showNewsNotification(news);
};
