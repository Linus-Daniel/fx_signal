import React, { useState } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "./Text";
import { useTheme } from "../../context/ThemeContext";
interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  variant?: "default" | "filled";
  size?: "sm" | "md" | "lg";
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = "default",
  size = "md",
  style,
  secureTextEntry,
  ...props
}) => {
  const { theme } = useTheme();
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const getSizeStyles = () => {
    const sizeMap = {
      sm: { height: 40, paddingHorizontal: theme.spacing.sm },
      md: { height: 48, paddingHorizontal: theme.spacing.md },
      lg: { height: 56, paddingHorizontal: theme.spacing.lg },
    };
    return sizeMap[size];
  };

  const getVariantStyles = (): ViewStyle => {
    const baseStyle = {
      borderRadius: theme.borderRadius.md,
      borderWidth: 1.5,
    };

    if (variant === "filled") {
      return {
        ...baseStyle,
        backgroundColor: theme.isDark
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.02)",
        borderColor: error
          ? theme.colors.error
          : isFocused
          ? theme.colors.primary
          : "transparent",
      };
    }

    return {
      ...baseStyle,
      backgroundColor: theme.colors.surface,
      borderColor: error
        ? theme.colors.error
        : isFocused
        ? theme.colors.primary
        : theme.colors.border,
    };
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const containerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    ...sizeStyles,
    ...variantStyles,
  };

  const inputStyle: TextStyle = {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: leftIcon ? theme.spacing.sm : 0,
    marginRight: rightIcon ? theme.spacing.sm : 0,
  };

  const handleRightIconPress = () => {
    if (secureTextEntry) {
      setIsSecure(!isSecure);
    }
    onRightIconPress?.();
  };

  const getRightIconName = (): keyof typeof Ionicons.glyphMap => {
    if (secureTextEntry) {
      return isSecure ? "eye-off" : "eye";
    }
    return rightIcon || "chevron-forward";
  };

  return (
    <View>
      {label && (
        <Text
          variant="caption"
          weight="medium"
          style={{ marginBottom: theme.spacing.xs }}
        >
          {label}
        </Text>
      )}

      <View style={containerStyle}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={
              isFocused ? theme.colors.primary : theme.colors.textSecondary
            }
            style={{ marginLeft: theme.spacing.sm }}
          />
        )}

        <TextInput
          style={inputStyle}
          placeholderTextColor={theme.colors.textTertiary}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            onPress={handleRightIconPress}
            style={{ padding: theme.spacing.xs }}
          >
            <Ionicons
              name={getRightIconName()}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text
          variant="caption"
          color="error"
          style={{ marginTop: theme.spacing.xs }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
