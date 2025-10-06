// File: src/screens/profile/EditProfileScreen.tsx
import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  Text,
  Button,
  Input,
  Card,
  Avatar,
  LoadingSpinner,
} from "../components/ui";
import { useTheme } from "../context/ThemeContext";

interface EditProfileScreenProps {
  navigation: any;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Passionate forex trader with 5+ years of experience.",
    avatar: null as string | null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    }, 1500);
  };

  const handleAvatarPress = () => {
    Alert.alert("Change Profile Picture", "Choose an option", [
      { text: "Take Photo", onPress: () => console.log("Take photo") },
      {
        text: "Choose from Gallery",
        onPress: () => console.log("Choose from gallery"),
      },
      {
        text: "Remove Photo",
        onPress: () => setProfileData({ ...profileData, avatar: null }),
        style: "destructive",
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: theme.spacing.xs,
    },
    content: {
      paddingBottom: 120,
    },
    avatarSection: {
      alignItems: "center",
      padding: theme.spacing.xl,
    },
    avatarContainer: {
      position: "relative",
    },
    avatarOverlay: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      ...theme.shadows.medium,
    },
    form: {
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
    },
    nameRow: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    nameInput: {
      flex: 1,
    },
    actionButtons: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
      borderTopWidth: 0.5,
      borderTopColor: theme.colors.border,
      ...theme.shadows.medium,
    },
    actionButton: {
      flex: 1,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Loading profile..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <Text variant="body" weight="semibold">
          Edit Profile
        </Text>

        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleAvatarPress}
          >
            <Avatar
              size="xl"
              name={`${profileData.firstName} ${profileData.lastName}`}
              source={profileData.avatar}
            />
            <View style={styles.avatarOverlay}>
              <Ionicons name="camera" size={16} color={theme.colors.surface} />
            </View>
          </TouchableOpacity>
          <Text
            variant="caption"
            color="primary"
            style={{ marginTop: theme.spacing.sm }}
          >
            Tap to change photo
          </Text>
        </View>

        {/* Form */}
        <Card>
          <View style={styles.form}>
            {/* Name Fields */}
            <View style={styles.nameRow}>
              <View style={styles.nameInput}>
                <Input
                  label="First Name"
                  placeholder="John"
                  value={profileData.firstName}
                  onChangeText={(value) =>
                    handleInputChange("firstName", value)
                  }
                  error={errors.firstName}
                  variant="filled"
                />
              </View>
              <View style={styles.nameInput}>
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  value={profileData.lastName}
                  onChangeText={(value) => handleInputChange("lastName", value)}
                  error={errors.lastName}
                  variant="filled"
                />
              </View>
            </View>

            <Input
              label="Email"
              placeholder="john.doe@example.com"
              value={profileData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              error={errors.email}
              leftIcon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              variant="filled"
            />

            <Input
              label="Phone Number"
              placeholder="+1 (555) 123-4567"
              value={profileData.phone}
              onChangeText={(value) => handleInputChange("phone", value)}
              error={errors.phone}
              leftIcon="call"
              keyboardType="phone-pad"
              variant="filled"
            />

            <View>
              <Text
                variant="caption"
                weight="medium"
                style={{ marginBottom: theme.spacing.xs }}
              >
                Bio
              </Text>
              <Input
                placeholder="Tell us about yourself..."
                value={profileData.bio}
                onChangeText={(value) => handleInputChange("bio", value)}
                variant="filled"
                style={{ height: 80 }}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          variant="outline"
          style={styles.actionButton}
          onPress={() => navigation.goBack()}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          style={styles.actionButton}
          onPress={handleSave}
          loading={saving}
        >
          Save Changes
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
