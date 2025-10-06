// File: src/screens/auth/RegisterScreen.tsx
import React, { useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import Text from "../components/ui/Text";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!acceptTerms) {
      newErrors.terms = "Please accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log("Registration successful");
      navigation.navigate("Login");
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    header: {
      alignItems: "center",
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.xl,
    },
    backButton: {
      position: "absolute",
      left: 0,
      top: theme.spacing.xl,
    },
    logo: {
      width: 60,
      height: 60,
      borderRadius: 15,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.md,
      ...theme.shadows.medium,
    },
    form: {
      gap: theme.spacing.md,
    },
    nameRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    nameInput: {
      flex: 1,
    },
    termsContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 2,
    },
    termsText: {
      flex: 1,
      lineHeight: 20,
    },
    registerButton: {
      marginTop: theme.spacing.lg,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.lg,
      gap: theme.spacing.xs,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Button
              variant="ghost"
              size="sm"
              style={styles.backButton}
              leftIcon={
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={theme.colors.text}
                />
              }
              onPress={() => navigation.goBack()}
            >Back</Button>

            <View style={styles.logo}>
              <Ionicons
                name="trending-up"
                size={28}
                color={theme.colors.surface}
              />
            </View>
            <Text variant="h2" weight="bold" align="center">
              Create Account
            </Text>
            <Text
              variant="body"
              color="secondary"
              align="center"
              style={{ marginTop: theme.spacing.sm }}
            >
              Join thousands of successful traders
            </Text>
          </View>

          {/* Form */}
          <Card padding="lg">
            <View style={styles.form}>
              {/* Name Fields */}
              <View style={styles.nameRow}>
                <View style={styles.nameInput}>
                  <Input
                    label="First Name"
                    placeholder="John"
                    value={formData.firstName}
                    onChangeText={(value) =>
                      handleInputChange("firstName", value)
                    }
                    error={errors.firstName}
                    variant="filled"
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.nameInput}>
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChangeText={(value) =>
                      handleInputChange("lastName", value)
                    }
                    error={errors.lastName}
                    variant="filled"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <Input
                label="Email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                error={errors.email}
                leftIcon="mail"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                variant="filled"
              />

              <Input
                label="Password"
                placeholder="Create a strong password"
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                error={errors.password}
                leftIcon="lock-closed"
                secureTextEntry
                variant="filled"
              />

              <Input
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                error={errors.confirmPassword}
                leftIcon="lock-closed"
                secureTextEntry
                variant="filled"
              />

              {/* Terms and Conditions */}
              <View style={styles.termsContainer}>
                <Button
                  variant="ghost"
                  style={[
                    styles.checkbox,
                    {
                      borderColor: acceptTerms
                        ? theme.colors.primary
                        : theme.colors.border,
                      backgroundColor: acceptTerms
                        ? theme.colors.primary
                        : "transparent",
                    },
                  ]}
                  onPress={() => setAcceptTerms(!acceptTerms)}
                >
                  {acceptTerms && (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={theme.colors.surface}
                    />
                  )}
                </Button>
                <Text
                  variant="caption"
                  color="secondary"
                  style={styles.termsText}
                >
                  I agree to the{" "}
                  <Text variant="caption" color="primary">
                    Terms of Service
                  </Text>{" "}
                  and{" "}
                  <Text variant="caption" color="primary">
                    Privacy Policy
                  </Text>
                </Text>
              </View>

              {errors.terms && (
                <Text variant="caption" color="error">
                  {errors.terms}
                </Text>
              )}

              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onPress={handleRegister}
                style={styles.registerButton}
              >
                Create Account
              </Button>
            </View>
          </Card>

          {/* Footer */}
          <View style={styles.footer}>
            <Text variant="body" color="secondary">
              Already have an account?
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => navigation.navigate("Login")}
            >
              Sign In
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
