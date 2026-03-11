import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Colors } from "@/constants/colors";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  noPadding?: boolean;
}

export function Card({ children, style, elevated = false, noPadding = false }: CardProps) {
  return (
    <View style={[styles.card, elevated && styles.elevated, noPadding && styles.noPadding, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  elevated: {
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 0,
  },
  noPadding: {
    padding: 0,
  },
});
