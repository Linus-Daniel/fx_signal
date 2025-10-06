// File: src/hooks/useNotifications.ts
import { useEffect, useState } from "react";
import { notificationService } from "../services/notificationService";

export const useNotifications = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initNotifications = async () => {
      await notificationService.init();

      const enabled = await notificationService.areNotificationsEnabled();
      setIsEnabled(enabled);

      const pushToken = await notificationService.getToken();
      setToken(pushToken);
    };

    initNotifications();

    // Cleanup on unmount
    return () => {
      notificationService.cleanup();
    };
  }, []);

  const requestPermissions = async () => {
    await notificationService.init();
    const enabled = await notificationService.areNotificationsEnabled();
    setIsEnabled(enabled);
    return enabled;
  };

  const openSettings = () => {
    notificationService.openNotificationSettings();
  };

  return {
    isEnabled,
    token,
    requestPermissions,
    openSettings,
  };
};
