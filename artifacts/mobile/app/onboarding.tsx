import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { Button } from "@/components/ui/Button";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    icon: "home" as const,
    iconSet: "feather" as const,
    title: "Your private community hub",
    body: "Connect Club is our digital clubhouse — a space just for members. No noise, no spam, just the good stuff.",
    gradient: ["#FFF0F5", "#FAF6F1"] as [string, string],
    accentColor: Colors.primary,
  },
  {
    icon: "calendar" as const,
    iconSet: "feather" as const,
    title: "Exclusive events & experiences",
    body: "Coffee raves, boat cruises, breathwork brunches — discover and RSVP to Connect Club's curated events, all in one place.",
    gradient: ["#FFF5E6", "#FAF6F1"] as [string, string],
    accentColor: Colors.accent,
  },
  {
    icon: "award" as const,
    iconSet: "feather" as const,
    title: "Challenges & giveaways",
    body: "Take part in exclusive challenges to win tickets, VIP access, and surprise prizes. Only Connect Club members get in.",
    gradient: ["#F0F8FF", "#FAF6F1"] as [string, string],
    accentColor: "#7A9AC9",
  },
  {
    icon: "bell" as const,
    iconSet: "feather" as const,
    title: "Never miss a moment",
    body: "Get instant notifications when Connect Club drops something new — a location, an event, a challenge, or a surprise.",
    gradient: ["#F5F0FF", "#FAF6F1"] as [string, string],
    accentColor: "#9A7AC9",
  },
  {
    icon: "heart" as const,
    iconSet: "feather" as const,
    title: "Welcome to Connect Club",
    body: "You're part of something special. This is where the real community lives. Let's go!",
    gradient: ["#FFF0F5", "#FAF6F1"] as [string, string],
    accentColor: Colors.primary,
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      scrollRef.current?.scrollTo({ x: width * next, animated: true });
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        {SLIDES.map((slide, index) => (
          <LinearGradient
            key={index}
            colors={slide.gradient}
            style={[styles.slide, { width }]}
          >
            <View style={[styles.slideContent, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 60), paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 140) }]}>
              <View style={[styles.iconContainer, { backgroundColor: slide.accentColor + "20" }]}>
                <Feather name={slide.icon} size={44} color={slide.accentColor} />
              </View>
              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideBody}>{slide.body}</Text>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 24) }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttons}>
          <Button
            title={currentIndex === SLIDES.length - 1 ? "Get started" : "Next"}
            onPress={handleNext}
            fullWidth
          />
          {currentIndex < SLIDES.length - 1 && (
            <Pressable onPress={handleSkip} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  slideContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  slideTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: Colors.text,
    textAlign: "center",
    lineHeight: 36,
  },
  slideBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface + "F0",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 16,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  buttons: {
    gap: 8,
  },
  skipBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  skipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.textMuted,
  },
});
