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

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Navigate to main app (we'll implement this in the next phase)
      console.log("Login successful");
      navigation.replace("Main");

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
      paddingTop: SCREEN_HEIGHT * 0.08,
      paddingBottom: theme.spacing.xxl,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.lg,
      ...theme.shadows.medium,
    },
    form: {
      gap: theme.spacing.lg,
    },
    inputGroup: {
      gap: theme.spacing.md,
    },
    forgotPassword: {
      alignSelf: "flex-end",
      marginTop: theme.spacing.sm,
    },
    loginButton: {
      marginTop: theme.spacing.md,
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: theme.spacing.xl,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    dividerText: {
      paddingHorizontal: theme.spacing.md,
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
            <View style={styles.logo}>
              <Ionicons
                name="trending-up"
                size={36}
                color={theme.colors.surface}
              />
            </View>
            <Text variant="h1" weight="bold" align="center">
              Welcome Back
            </Text>
            <Text
              variant="body"
              color="secondary"
              align="center"
              style={{ marginTop: theme.spacing.sm }}
            >
              Sign in to continue trading
            </Text>
          </View>

          {/* Form */}
          <Card padding="lg">
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Input
                  label="Email"
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  error={errors.password}
                  leftIcon="lock-closed"
                  secureTextEntry
                  variant="filled"
                />

                <Button
                  variant="ghost"
                  size="sm"
                  style={styles.forgotPassword}
                  onPress={() => {}}
                >
                  Forgot Password?
                </Button>
              </View>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onPress={handleLogin}
                style={styles.loginButton}
              >
                Sign In
              </Button>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text
                  variant="caption"
                  color="tertiary"
                  style={styles.dividerText}
                >
                  OR
                </Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Options */}
              <View style={{ gap: theme.spacing.sm }}>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  leftIcon={
                    <Ionicons
                      name="logo-google"
                      size={20}
                      color={theme.colors.text}
                    />
                  }
                  onPress={() => {}}
                >
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  leftIcon={
                    <Ionicons
                      name="logo-apple"
                      size={20}
                      color={theme.colors.text}
                    />
                  }
                  onPress={() => {}}
                >
                  Continue with Apple
                </Button>
              </View>
            </View>
          </Card>

          {/* Footer */}
          <View style={styles.footer}>
            <Text variant="body" color="secondary">
              Don't have an account?
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => navigation.navigate("Register")}
            >
              Sign Up
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
