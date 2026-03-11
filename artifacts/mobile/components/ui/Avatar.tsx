import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View, ViewStyle, ImageStyle } from "react-native";
import { Colors } from "@/constants/colors";

interface AvatarProps {
  name: string;
  image?: string;
  size?: number;
  style?: ViewStyle | ImageStyle;
}

export function Avatar({ name, image, size = 40, style }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const fontSize = size * 0.38;

  if (image) {
    return (
      <Image
        source={{ uri: image }}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          style as ImageStyle,
        ]}
      />
    );
  }

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.initials,
          { fontSize, color: "#fff" },
        ]}
      >
        {initials}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  initials: {
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
});
