import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { useAppData } from "@/contexts/AppDataContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { events, rsvpEvent, checkInEvent } = useAppData();
  const [checkingIn, setCheckingIn] = useState(false);

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <View style={[styles.notFound, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.notFoundText}>Event not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const priceLabel =
    event.price === "free"
      ? "Free"
      : event.price === "rsvp"
      ? "RSVP Required"
      : `R${event.price}`;

  const dateStr = new Date(event.date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleRSVP = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    rsvpEvent(event.id);
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setTimeout(() => {
      checkInEvent(event.id);
      setCheckingIn(false);
      Alert.alert(
        "Checked in!",
        "Welcome to the event! Hope you have an amazing time.",
        [{ text: "Thanks!" }]
      );
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 120),
        }}
      >
        <View style={styles.imageContainer}>
          {event.image ? (
            <Image
              source={{ uri: event.image }}
              style={styles.heroImage}
              contentFit="cover"
              transition={300}
            />
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder]}>
              <Feather name="calendar" size={48} color={Colors.primary} />
            </View>
          )}

          <LinearGradient
            colors={["rgba(0,0,0,0.6)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.heroGradient}
          />

          <Pressable
            style={[styles.closeBtn, { top: insets.top + (Platform.OS === "web" ? 67 : 16) }]}
            onPress={() => router.back()}
          >
            <Feather name="x" size={20} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.tagsRow}>
            {event.tags.map((tag) => (
              <Badge key={tag} label={tag} />
            ))}
            <Badge
              label={priceLabel}
              color={
                event.price === "free"
                  ? "#E8F5E9"
                  : event.price === "rsvp"
                  ? "#E8F0FF"
                  : "#FFF5E6"
              }
              textColor={
                event.price === "free"
                  ? "#4A8A4A"
                  : event.price === "rsvp"
                  ? "#4060A0"
                  : Colors.accent
              }
            />
          </View>

          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.metaCard}>
            <View style={styles.metaRow}>
              <View style={styles.metaIcon}>
                <Feather name="calendar" size={16} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.metaLabel}>Date</Text>
                <Text style={styles.metaValue}>{dateStr}</Text>
              </View>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaRow}>
              <View style={styles.metaIcon}>
                <Feather name="clock" size={16} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.metaLabel}>Time</Text>
                <Text style={styles.metaValue}>{event.time}</Text>
              </View>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaRow}>
              <View style={styles.metaIcon}>
                <Feather
                  name={event.isSecretLocation ? "eye-off" : "map-pin"}
                  size={16}
                  color={Colors.primary}
                />
              </View>
              <View>
                <Text style={styles.metaLabel}>Location</Text>
                <Text style={styles.metaValue}>
                  {event.isSecretLocation
                    ? "Secret — revealed to RSVPs"
                    : event.location}
                </Text>
              </View>
            </View>
          </View>

          {event.spotsLeft !== undefined && (
            <View style={styles.spotsCard}>
              <View style={styles.spotsHeader}>
                <Text style={styles.spotsTitle}>Availability</Text>
                <Text style={styles.spotsCount}>
                  {event.spotsLeft} / {event.totalSpots} spots left
                </Text>
              </View>
              <View style={styles.spotsBar}>
                <View
                  style={[
                    styles.spotsBarFill,
                    {
                      width: `${100 - (event.spotsLeft / (event.totalSpots || 1)) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>
          )}

          <View style={styles.descSection}>
            <Text style={styles.descTitle}>About this event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {event.whatToBring && (
            <View style={styles.descSection}>
              <Text style={styles.descTitle}>What to bring</Text>
              <Text style={styles.description}>{event.whatToBring}</Text>
            </View>
          )}

          <View style={styles.socialProof}>
            <Feather name="users" size={14} color={Colors.textMuted} />
            <Text style={styles.socialProofText}>
              {event.rsvpCount} people are attending
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16),
          },
        ]}
      >
        {event.userCheckedIn ? (
          <View style={styles.checkedInBanner}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            <Text style={styles.checkedInText}>
              You've checked in to this event!
            </Text>
          </View>
        ) : (
          <View style={styles.footerButtons}>
            <Button
              title={event.userRsvped ? "Cancel RSVP" : event.price === "free" ? "RSVP Free" : `RSVP — ${priceLabel}`}
              onPress={handleRSVP}
              variant={event.userRsvped ? "outline" : "primary"}
              fullWidth
            />
            {event.userRsvped && (
              <Button
                title="Check In"
                onPress={handleCheckIn}
                variant="secondary"
                loading={checkingIn}
                fullWidth
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  notFoundText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    color: Colors.text,
  },
  backLink: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: Colors.primary,
  },
  imageContainer: {
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: 280,
    backgroundColor: Colors.backgroundAlt,
  },
  heroPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  heroGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  closeBtn: {
    position: "absolute",
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 20,
    gap: 16,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    color: Colors.text,
    lineHeight: 34,
  },
  metaCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  metaLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaValue: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
    marginTop: 1,
  },
  metaDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  spotsCard: {
    backgroundColor: "#FFF0F5",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    gap: 8,
  },
  spotsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spotsTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.primary,
  },
  spotsCount: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  spotsBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  spotsBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  descSection: {
    gap: 8,
  },
  descTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: Colors.text,
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 23,
  },
  socialProof: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  socialProofText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textMuted,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 10,
  },
  footerButtons: {
    gap: 10,
  },
  checkedInBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#E8F5E9",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  checkedInText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.success,
    flex: 1,
  },
});
