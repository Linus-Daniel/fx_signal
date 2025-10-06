// File: src/navigation/AppNavigator.tsx (Updated)
import React from "react";
import AuthNavigator from "./AuthNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../context/ThemeContext";
import MainTabNavigator from "./MainTab";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { theme } = useTheme();

  // For now, we'll always show auth screens
  // Later we'll add authentication state management
  const isAuthenticated = true;

  return (
    <Stack.Navigator
    id={undefined}
      screenOptions={{
        headerShown: false,
        // contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
