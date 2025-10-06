// File: src/navigation/SignalsNavigator.tsx
import React from "react";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { Signal } from "../components/SignalCard";
import SignalsScreen from "../screens/SignalScreen";
import SignalDetailsScreen from "../screens/SignalDetails";

export type SignalsStackParamList = {
  SignalsList: undefined;
  SignalDetails: {
    signal: Signal;
  };
};

export type SignalsScreenNavigationProp = StackNavigationProp<
  SignalsStackParamList,
  "SignalsList"
>;

export type SignalDetailsScreenNavigationProp = StackNavigationProp<
  SignalsStackParamList,
  "SignalDetails"
>;

export type SignalDetailsScreenRouteProp = RouteProp<
  SignalsStackParamList,
  "SignalDetails"
>;

const Stack = createStackNavigator<SignalsStackParamList>();

const SignalsNavigator = () => {
  return (
    <Stack.Navigator
    id={undefined}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SignalsList" component={SignalsScreen} />
      <Stack.Screen
        name="SignalDetails"
        component={SignalDetailsScreen}
        options={{
          presentation: "card",
        }}
      />
    </Stack.Navigator>
  );
};

export default SignalsNavigator;
