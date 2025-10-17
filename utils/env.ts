import Constants from 'expo-constants';

// Environment configuration utility
export const ENV = {
  // App Configuration
  APP_NAME: Constants.expoConfig?.extra?.appName || process.env.EXPO_PUBLIC_APP_NAME || 'Forex Signals Pro',
  APP_VERSION: Constants.expoConfig?.extra?.appVersion || process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // API Configuration
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.example.com/v1',
  API_TIMEOUT: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '10000'),
  
  // External API Keys
  NEWS_API_KEY: process.env.EXPO_PUBLIC_NEWS_API_KEY,
  ALPHA_VANTAGE_KEY: process.env.EXPO_PUBLIC_ALPHA_VANTAGE_KEY,
  FINAGE_KEY: process.env.EXPO_PUBLIC_FINAGE_KEY,
  TRADING_ECONOMICS_KEY: process.env.EXPO_PUBLIC_TRADING_ECONOMICS_KEY,
  RSS2JSON_KEY: process.env.EXPO_PUBLIC_RSS2JSON_KEY,
  
  // Socket Configuration
  SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL || 'wss://api.example.com/socket',
  SOCKET_RECONNECT_ATTEMPTS: parseInt(process.env.EXPO_PUBLIC_SOCKET_RECONNECT_ATTEMPTS || '5'),
  
  // Notification Configuration
  NOTIFICATION_ENABLED: process.env.EXPO_PUBLIC_NOTIFICATION_ENABLED === 'true',
  PUSH_NOTIFICATION_KEY: process.env.EXPO_PUBLIC_PUSH_NOTIFICATION_KEY,
  
  // Analytics
  ANALYTICS_API_KEY: process.env.EXPO_PUBLIC_ANALYTICS_API_KEY,
  
  // Development flags
  DEBUG_MODE: process.env.EXPO_PUBLIC_DEBUG_MODE === 'true',
  ENABLE_LOGGING: process.env.EXPO_PUBLIC_ENABLE_LOGGING === 'true',
  
  // Environment checks
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isStaging: process.env.NODE_ENV === 'staging',
};

// Validation function to check required environment variables
export const validateEnv = () => {
  const requiredVars = [
    'EXPO_PUBLIC_API_BASE_URL',
    'EXPO_PUBLIC_SOCKET_URL',
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  return missingVars.length === 0;
};

export default ENV;