// File: src/screens/main/ProfileScreen.tsx (Updated with full implementation)
import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useTheme,
  useTheme as useThemeContext,
} from "../context/ThemeContext";
import {
  Text,
  Button,
  Card,
  Avatar,

} from "../components/ui";
import SettingsItem from "../components/ProfileItems";
import ProfileHeader from "../components/ProfileHeader";
const ProfileScreen = () => {
  const { theme, themeMode, setThemeMode } = useThemeContext();

  // Mock user data - in production, this would come from Redux/API
  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: null,
    memberSince: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    subscriptionTier: "premium" as const,
    totalSignalsCopied: 147,
    winRate: 78.5,
    totalProfit: 12450,
    isOnline: true,
  };

  const [notificationsSettings, setNotificationsSettings] = useState({
    newSignals: true,
    signalUpdates: true,
    marketNews: false,
    priceAlerts: true,
    push: true,
    email: false,
  });

  const [tradingSettings, setTradingSettings] = useState({
    autoRisk: false,
    defaultLotSize: "0.1",
    maxRisk: "2%",
  });

  const handleEditProfile = () => {
    console.log("Edit profile");
    // Navigate to edit profile screen
  };

  const handleSubscriptionManagement = () => {
    console.log("Manage subscription");
    // Navigate to subscription management
  };

  const handleNotificationSettings = () => {
    console.log("Notification settings");
    // Navigate to detailed notification settings
  };

  const handleTradingPreferences = () => {
    console.log("Trading preferences");
    // Navigate to trading preferences
  };

  const handleSecurity = () => {
    console.log("Security settings");
    // Navigate to security settings
  };

  const handleSupport = () => {
    console.log("Contact support");
    // Open support/help
  };

  const handleAbout = () => {
    console.log("About app");
    // Show about/app info
  };

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            // Implement logout logic
            console.log("Logging out...");
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Confirm Deletion",
              'Type "DELETE" to confirm account deletion',
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Confirm",
                  style: "destructive",
                  onPress: () => console.log("Account deleted"),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const getThemeDisplayValue = () => {
    switch (themeMode) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
      default:
        return "System";
    }
  };

  const handleThemeChange = () => {
    Alert.alert("Choose Theme", "Select your preferred theme", [
      {
        text: "Light",
        onPress: () => setThemeMode("light"),
      },
      {
        text: "Dark",
        onPress: () => setThemeMode("dark"),
      },
      {
        text: "System",
        onPress: () => setThemeMode("system"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      paddingBottom: 100,
    },
    sectionHeader: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
      backgroundColor: theme.colors.background,
    },
    section: {
      marginBottom: theme.spacing.sm,
    },
    upgradeCard: {
      margin: theme.spacing.lg,
      padding: theme.spacing.lg,
      alignItems: "center",
      backgroundColor: theme.colors.primary,
    },
    upgradeTitle: {
      marginBottom: theme.spacing.sm,
      color: theme.colors.surface,
    },
    upgradeSubtitle: {
      marginBottom: theme.spacing.lg,
      color: theme.colors.surface,
      opacity: 0.9,
    },
    upgradeButton: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.xl,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <ProfileHeader user={mockUser} onEditPress={handleEditProfile} />

        {/* Upgrade Card (only for non-professional users) */}
        {mockUser.subscriptionTier !== "professional" && (
          <Card style={styles.upgradeCard}>
            <Text variant="h4" weight="bold" style={styles.upgradeTitle}>
              Unlock Professional Features
            </Text>
            <Text variant="body" align="center" style={styles.upgradeSubtitle}>
              Get unlimited signals, AI insights, and priority support
            </Text>
            <Button
              variant="secondary"
              style={styles.upgradeButton}
              onPress={handleSubscriptionManagement}
            >
              <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
                Upgrade Now
              </Text>
            </Button>
          </Card>
        )}

        {/* Account Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="body" weight="semibold" color="secondary">
              ACCOUNT
            </Text>
          </View>

          <SettingsItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={handleEditProfile}
          />

          <SettingsItem
            icon="card-outline"
            title="Subscription"
            subtitle={`${mockUser.subscriptionTier} plan`}
            value={
              mockUser.subscriptionTier === "free" ? "Free" : "$29.99/month"
            }
            type="value"
            onPress={handleSubscriptionManagement}
            badge={mockUser.subscriptionTier === "free" ? "Upgrade" : undefined}
          />

          <SettingsItem
            icon="shield-checkmark-outline"
            title="Security"
            subtitle="Password, 2FA, and login settings"
            onPress={handleSecurity}
          />
        </View>

        {/* Trading Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="body" weight="semibold" color="secondary">
              TRADING
            </Text>
          </View>

          <SettingsItem
            icon="settings-outline"
            title="Trading Preferences"
            subtitle="Risk management and default settings"
            onPress={handleTradingPreferences}
          />

          <SettingsItem
            icon="calculator-outline"
            title="Auto Risk Management"
            subtitle="Automatically calculate position size"
            type="switch"
            switchValue={tradingSettings.autoRisk}
            onSwitchToggle={(value) =>
              setTradingSettings({ ...tradingSettings, autoRisk: value })
            }
          />

          <SettingsItem
            icon="trending-up-outline"
            title="Default Lot Size"
            value={tradingSettings.defaultLotSize}
            type="value"
            onPress={() => console.log("Change lot size")}
          />
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="body" weight="semibold" color="secondary">
              NOTIFICATIONS
            </Text>
          </View>

          <SettingsItem
            icon="notifications-outline"
            title="Notification Settings"
            subtitle="Customize your alerts and updates"
            onPress={handleNotificationSettings}
          />

          <SettingsItem
            icon="pulse-outline"
            title="New Signals"
            subtitle="Get notified when new signals are posted"
            type="switch"
            switchValue={notificationsSettings.newSignals}
            onSwitchToggle={(value) =>
              setNotificationsSettings({
                ...notificationsSettings,
                newSignals: value,
              })
            }
          />

          <SettingsItem
            icon="refresh-outline"
            title="Signal Updates"
            subtitle="Updates on your copied signals"
            type="switch"
            switchValue={notificationsSettings.signalUpdates}
            onSwitchToggle={(value) =>
              setNotificationsSettings({
                ...notificationsSettings,
                signalUpdates: value,
              })
            }
          />

          <SettingsItem
            icon="newspaper-outline"
            title="Market News"
            subtitle="Important market updates"
            type="switch"
            switchValue={notificationsSettings.marketNews}
            onSwitchToggle={(value) =>
              setNotificationsSettings({
                ...notificationsSettings,
                marketNews: value,
              })
            }
          />
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="body" weight="semibold" color="secondary">
              APP PREFERENCES
            </Text>
          </View>

          <SettingsItem
            icon="color-palette-outline"
            title="Theme"
            value={getThemeDisplayValue()}
            type="value"
            onPress={handleThemeChange}
          />

          <SettingsItem
            icon="language-outline"
            title="Language"
            value="English"
            type="value"
            onPress={() => console.log("Change language")}
          />

          <SettingsItem
            icon="download-outline"
            title="Data Usage"
            subtitle="Manage offline content and data usage"
            onPress={() => console.log("Data usage settings")}
          />
        </View>

        {/* Support & Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="body" weight="semibold" color="secondary">
              SUPPORT & INFO
            </Text>
          </View>

          <SettingsItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="FAQs, contact us, and tutorials"
            onPress={handleSupport}
          />

          <SettingsItem
            icon="document-text-outline"
            title="Terms of Service"
            onPress={() => console.log("Terms of service")}
          />

          <SettingsItem
            icon="shield-outline"
            title="Privacy Policy"
            onPress={() => console.log("Privacy policy")}
          />

          <SettingsItem
            icon="information-circle-outline"
            title="About"
            value="v1.0.0"
            type="value"
            onPress={handleAbout}
          />
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="body" weight="semibold" color="secondary">
              ACCOUNT ACTIONS
            </Text>
          </View>

          <SettingsItem
            icon="log-out-outline"
            title="Sign Out"
            type="action"
            onPress={handleLogout}
            destructive
          />

          <SettingsItem
            icon="trash-outline"
            title="Delete Account"
            subtitle="Permanently delete your account and data"
            type="action"
            onPress={handleDeleteAccount}
            destructive
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
