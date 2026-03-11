import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";
import { useAppData } from "@/contexts/AppDataContext";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="events">
        <Icon sf={{ default: "calendar", selected: "calendar.fill" }} />
        <Label>Events</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="challenges">
        <Icon sf={{ default: "trophy", selected: "trophy.fill" }} />
        <Label>Challenges</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="moments">
        <Icon sf={{ default: "photo", selected: "photo.fill" }} />
        <Label>Moments</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: "person", selected: "person.fill" }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
  const { unreadCount } = useAppData();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : Colors.surface,
          borderTopWidth: isWeb ? 1 : 0.5,
          borderTopColor: Colors.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={90}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View
              style={[StyleSheet.absoluteFill, { backgroundColor: Colors.surface }]}
            />
          ) : null,
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="house" tintColor={color} size={22} />
            ) : (
              <Feather name="home" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="calendar" tintColor={color} size={22} />
            ) : (
              <Feather name="calendar" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: "Challenges",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="trophy" tintColor={color} size={22} />
            ) : (
              <Ionicons name="trophy-outline" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="moments"
        options={{
          title: "Moments",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="photo" tintColor={color} size={22} />
            ) : (
              <Feather name="image" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="person" tintColor={color} size={22} />
            ) : (
              <Feather name="user" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
