import { Ionicons } from "@expo/vector-icons";
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
import { ChallengeCard } from "@/components/ChallengeCard";

const FILTERS = ["All", "Active", "Upcoming", "Ended"];

export default function ChallengesScreen() {
  const insets = useSafeAreaInsets();
  const { challenges } = useAppData();
  const [filter, setFilter] = useState("All");

  const filtered = challenges.filter((c) => {
    if (filter === "All") return true;
    if (filter === "Active") return c.status === "active";
    if (filter === "Upcoming") return c.status === "upcoming";
    if (filter === "Ended") return c.status === "ended";
    return true;
  });

  const activeChallenges = challenges.filter((c) => c.status === "active");

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
          <Text style={styles.title}>Challenges</Text>
          <Text style={styles.subtitle}>Win prizes, unlock experiences</Text>
        </View>

        {activeChallenges.length > 0 && (
          <View style={styles.liveBanner}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBannerText}>
              {activeChallenges.length} challenge{activeChallenges.length > 1 ? "s" : ""} active right now
            </Text>
          </View>
        )}

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

        <View style={styles.list}>
          {filtered.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}

          {filtered.length === 0 && (
            <View style={styles.empty}>
              <Ionicons
                name="trophy-outline"
                size={40}
                color={Colors.border}
              />
              <Text style={styles.emptyTitle}>No challenges here</Text>
              <Text style={styles.emptyText}>
                Check back soon — new challenges drop regularly!
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
  liveBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#FFF5F7",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  liveBannerText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.primary,
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
  list: {
    gap: 4,
    paddingBottom: 8,
  },
  empty: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 48,
    paddingHorizontal: 32,
    marginHorizontal: 16,
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
