import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { Event } from "@/contexts/AppDataContext";
import { Badge } from "./ui/Badge";

interface EventCardProps {
  event: Event;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function EventCard({ event }: EventCardProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 20, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  };

  const handlePress = () => {
    router.push({ pathname: "/event/[id]", params: { id: event.id } });
  };

  const priceLabel =
    event.price === "free"
      ? "Free"
      : event.price === "rsvp"
      ? "RSVP"
      : `£${event.price}`;

  const dateStr = formatDate(event.date);

  return (
    <AnimatedPressable
      style={[styles.card, animStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.imageContainer}>
        {event.image ? (
          <Image
            source={{ uri: event.image }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Feather name="calendar" size={32} color={Colors.primary} />
          </View>
        )}
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>{priceLabel}</Text>
        </View>
        {event.userRsvped && (
          <View style={styles.rsvpedBadge}>
            <Ionicons name="checkmark" size={12} color="#fff" />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.tagsRow}>
          {event.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} label={tag} size="sm" />
          ))}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.metaRow}>
          <Feather name="calendar" size={13} color={Colors.textMuted} />
          <Text style={styles.metaText}>{dateStr}</Text>
        </View>

        <View style={styles.metaRow}>
          <Feather name="clock" size={13} color={Colors.textMuted} />
          <Text style={styles.metaText}>{event.time}</Text>
        </View>

        <View style={styles.metaRow}>
          <Feather name="map-pin" size={13} color={Colors.textMuted} />
          <Text style={styles.metaText} numberOfLines={1}>
            {event.isSecretLocation ? "Secret Location" : event.location}
          </Text>
        </View>

        {event.spotsLeft !== undefined && event.spotsLeft <= 10 && (
          <View style={styles.spotsRow}>
            <View style={styles.spotsIndicator}>
              <View
                style={[
                  styles.spotsBar,
                  {
                    width: `${Math.max(10, 100 - (event.spotsLeft / (event.totalSpots || 1)) * 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.spotsText}>
              {event.spotsLeft} spots left
            </Text>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

const styles = StyleSheet.create({
  card: {
    width: 240,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
    marginRight: 12,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 150,
    backgroundColor: Colors.backgroundAlt,
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  priceTag: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  priceText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: Colors.primary,
  },
  rsvpedBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: Colors.success,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 14,
    gap: 5,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
  },
  spotsRow: {
    marginTop: 8,
    gap: 4,
  },
  spotsIndicator: {
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  spotsBar: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  spotsText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.primary,
  },
});
