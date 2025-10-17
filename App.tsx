// File: App.tsx (Updated with error boundary and connection status)
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useColorScheme } from "react-native";
import ErrorBoundary from "./components/ErrorBoundary";
import { store } from "./redux/store/store";
import { ThemeProvider } from "./context/ThemeContext";
import AppNavigator from "./navigation/AppNavigation";
import ConnectionStatus from "./components/ConnectionStatus";
import { loadStoredAuth } from "./redux/slices/authSlice";
import { NavigationContainer } from "@react-navigation/native";
import "./global.css";

export default function App() {
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    // Load stored authentication on app start
    store.dispatch(loadStoredAuth());
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <SafeAreaProvider>
            <ThemeProvider systemColorScheme={systemColorScheme}>
              <NavigationContainer>
                <StatusBar style="auto" />
                <AppNavigator />
                <ConnectionStatus />
              </NavigationContainer>
            </ThemeProvider>
          </SafeAreaProvider>
        </Provider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
