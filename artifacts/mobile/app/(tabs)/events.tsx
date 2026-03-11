import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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
import { Badge } from "@/components/ui/Badge";
import { Image } from "expo-image";

const FILTERS = ["All", "Upcoming", "Free", "RSVP", "Paid"];

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const { events } = useAppData();
  const [filter, setFilter] = useState("All");

  const filteredEvents = events.filter((e) => {
    if (filter === "All") return true;
    if (filter === "Upcoming") return e.status === "upcoming";
    if (filter === "Free") return e.price === "free";
    if (filter === "RSVP") return e.price === "rsvp";
    if (filter === "Paid") return typeof e.price === "number";
    return true;
  });

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 100),
        }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Events</Text>
          <Text style={styles.subtitle}>Connect Club's upcoming experiences</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterChip,
                f === filter && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  f === filter && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.eventsList}>
          {filteredEvents.map((event) => {
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
            });

            return (
              <Pressable
                key={event.id}
                style={styles.eventRow}
                onPress={() =>
                  router.push({ pathname: "/event/[id]", params: { id: event.id } })
                }
              >
                <View style={styles.eventImageContainer}>
                  {event.image ? (
                    <Image
                      source={{ uri: event.image }}
                      style={styles.eventImage}
                      contentFit="cover"
                      transition={300}
                    />
                  ) : (
                    <View style={[styles.eventImage, styles.eventImagePlaceholder]}>
                      <Feather name="calendar" size={24} color={Colors.primary} />
                    </View>
                  )}
                  {event.userRsvped && (
                    <View style={styles.checkBadge}>
                      <Feather name="check" size={10} color="#fff" />
                    </View>
                  )}
                </View>

                <View style={styles.eventInfo}>
                  <View style={styles.eventTagsRow}>
                    {event.tags.slice(0, 1).map((tag) => (
                      <Badge key={tag} label={tag} size="sm" />
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
                      size="sm"
                    />
                  </View>

                  <Text style={styles.eventTitle} numberOfLines={2}>
                    {event.title}
                  </Text>

                  <View style={styles.eventMeta}>
                    <Feather name="calendar" size={12} color={Colors.textMuted} />
                    <Text style={styles.eventMetaText}>{dateStr}</Text>
                  </View>

                  <View style={styles.eventMeta}>
                    <Feather name="map-pin" size={12} color={Colors.textMuted} />
                    <Text style={styles.eventMetaText} numberOfLines={1}>
                      {event.isSecretLocation ? "Secret Location" : event.location}
                    </Text>
                  </View>

                  {event.spotsLeft !== undefined && event.spotsLeft <= 15 && (
                    <Text style={styles.spotsText}>
                      Only {event.spotsLeft} spots left
                    </Text>
                  )}
                </View>

                <Feather name="chevron-right" size={18} color={Colors.textMuted} />
              </Pressable>
            );
          })}

          {filteredEvents.length === 0 && (
            <View style={styles.empty}>
              <Feather name="calendar" size={40} color={Colors.border} />
              <Text style={styles.emptyTitle}>No events found</Text>
              <Text style={styles.emptyText}>
                Check back soon — Connect Club is planning something special.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: "#fff",
  },
  eventsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  eventImageContainer: {
    position: "relative",
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.backgroundAlt,
  },
  eventImagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  checkBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: Colors.success,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  eventInfo: {
    flex: 1,
    gap: 4,
  },
  eventTagsRow: {
    flexDirection: "row",
    gap: 5,
    flexWrap: "wrap",
  },
  eventTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: Colors.text,
    lineHeight: 21,
    marginTop: 2,
  },
  eventMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  eventMetaText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
    flex: 1,
  },
  spotsText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.primary,
    marginTop: 2,
  },
  empty: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    color: Colors.textSecondary,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});
