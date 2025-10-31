import { Tabs } from "expo-router";
import { Home, UserPlus, FolderPlus, Shield } from "lucide-react-native";
import React from "react";
import { Colors } from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.secondary.lightBlue,
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.secondary.deepBlue,
        },
        headerTintColor: Colors.dominant.white,
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
        tabBarStyle: {
          backgroundColor: Colors.dominant.white,
          borderTopWidth: 1,
          borderTopColor: Colors.dominant.gray,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-client"
        options={{
          title: "Add Client",
          tabBarIcon: ({ color }) => <UserPlus size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-category"
        options={{
          title: "Categories",
          tabBarIcon: ({ color }) => <FolderPlus size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="privacy"
        options={{
          title: "Privacy",
          tabBarIcon: ({ color }) => <Shield size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
