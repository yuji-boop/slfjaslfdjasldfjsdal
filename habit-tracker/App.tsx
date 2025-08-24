import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import AddHabitScreen from "./src/screens/AddHabitScreen";

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFFFFF",
    card: "#FFFFFF",
    text: "#1E2A4A",
    primary: "#3B6AFF",
    border: "transparent",
  },
};

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#3B6AFF",
          tabBarInactiveTintColor: "#64748B",
          tabBarStyle: {
            height: 64,
            paddingTop: 6,
            paddingBottom: 10,
            borderTopWidth: 0,
            backgroundColor: "#FFFFFF",
          },
          tabBarIcon: ({ color, size, focused }) => {
            let iconName: string = "home";
            if (route.name === "Welcome") iconName = focused ? "planet" : "planet-outline";
            if (route.name === "Home") iconName = focused ? "home" : "home-outline";
            if (route.name === "Add") iconName = focused ? "add-circle" : "add-circle-outline";
            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Welcome" component={WelcomeScreen} />
        <Tab.Screen name="Home" component={DashboardScreen} />
        <Tab.Screen name="Add" component={AddHabitScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


