import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Colors } from "@/constants/colors";

interface BadgeProps {
  label: string;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
  size?: "sm" | "md";
}

export function Badge({
  label,
  color = Colors.primaryLight,
  textColor = Colors.primary,
  style,
  size = "md",
}: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color }, size === "sm" && styles.small, style]}>
      <Text style={[styles.text, { color: textColor }, size === "sm" && styles.smallText]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  text: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    letterSpacing: 0.3,
  },
  smallText: {
    fontSize: 10,
  },
});
