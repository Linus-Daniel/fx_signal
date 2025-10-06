// File: src/navigation/MainTabNavigator.tsx (Updated to use SignalsNavigator)
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "../context/ThemeContext";
import HomeScreen from "../screens/Home";
import SignalsNavigator from "./SignalsNavigator";
import AnalysisScreen from "../screens/AnalysisScreen.tsx";
import NewsScreen from "../screens/NewsScreen";
import ProfileScreen from "../screens/Profile";
import Ionicons from "react-native-vector-icons/Ionicons";

export type MainTabParamList = {
  Home: undefined;
  Signals: undefined; // This now points to SignalsNavigator
  Analysis: undefined;
  News: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
    id={undefined}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Signals":
              iconName = focused ? "trending-up" : "trending-up-outline";
              break;
            case "Analysis":
              iconName = focused ? "analytics" : "analytics-outline";
              break;
            case "News":
              iconName = focused ? "newspaper" : "newspaper-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "circle";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 0.5,
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
          ...theme.shadows.medium,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Signals" component={SignalsNavigator} />
      {/* <Tab.Screen name="Analysis" component={AnalysisScreen} /> */}
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
