import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { Avatar } from "@/components/ui/Avatar";

const ADMIN_ACTIONS = [
  {
    id: "post",
    icon: "edit-2" as const,
    label: "New Post",
    sub: "Update, announcement, or reminder",
    color: Colors.primary,
  },
  {
    id: "event",
    icon: "calendar" as const,
    label: "New Event",
    sub: "Create a new experience",
    color: Colors.accent,
  },
  {
    id: "challenge",
    icon: "award" as const,
    label: "New Challenge",
    sub: "Giveaway or activation",
    color: "#9A7AC9",
  },
  {
    id: "survey",
    icon: "clipboard" as const,
    label: "New Survey / Poll",
    sub: "Collect community feedback",
    color: "#5070B0",
  },
  {
    id: "location",
    icon: "map-pin" as const,
    label: "Live Location Drop",
    sub: "Drop a real-time location",
    color: "#5A8A5A",
  },
  {
    id: "partner",
    icon: "briefcase" as const,
    label: "Partner Spotlight",
    sub: "Promote a venue or brand",
    color: "#A0705A",
  },
  {
    id: "notify",
    icon: "bell" as const,
    label: "Send Notification",
    sub: "Push notification to all members",
    color: "#B07030",
  },
];

export default function AdminDashboard() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { posts, events, challenges, notifications } = useAppData();

  if (!user || user.role !== "admin") {
    return (
      <View style={styles.unauthorized}>
        <Text style={styles.unauthorizedText}>Access denied</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const stats = [
    { label: "Posts", value: posts.length, icon: "edit-2" as const },
    { label: "Events", value: events.length, icon: "calendar" as const },
    { label: "Challenges", value: challenges.length, icon: "award" as const },
    { label: "Notifications", value: notifications.length, icon: "bell" as const },
  ];

  const handleAction = (actionId: string) => {
    if (actionId === "notify") {
      router.push("/admin/send-notification");
    } else {
      router.push({ pathname: "/admin/create", params: { type: actionId } });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 40),
        }}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Feather name="arrow-left" size={20} color="#fff" />
            </Pressable>
            <Avatar name={user.fullName} size={36} />
          </View>

          <Text style={styles.headerLabel}>ADMIN DASHBOARD</Text>
          <Text style={styles.headerTitle}>Welcome back, {user.fullName.split(" ")[0]}</Text>
          <Text style={styles.headerSub}>Your community is thriving</Text>
        </LinearGradient>

        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Feather name={stat.icon} size={16} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create Content</Text>

          <View style={styles.actionsList}>
            {ADMIN_ACTIONS.map((action) => (
              <Pressable
                key={action.id}
                style={styles.actionItem}
                onPress={() => handleAction(action.id)}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + "20" }]}>
                  <Feather name={action.icon} size={20} color={action.color} />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  <Text style={styles.actionSub}>{action.sub}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={Colors.textMuted} />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Analytics</Text>

          <View style={styles.analyticsCard}>
            <View style={styles.analyticsRow}>
              <Text style={styles.analyticsLabel}>Total members</Text>
              <Text style={styles.analyticsValue}>248</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.analyticsRow}>
              <Text style={styles.analyticsLabel}>Event RSVPs this week</Text>
              <Text style={styles.analyticsValue}>67</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.analyticsRow}>
              <Text style={styles.analyticsLabel}>Challenge entries</Text>
              <Text style={styles.analyticsValue}>89</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.analyticsRow}>
              <Text style={styles.analyticsLabel}>Posts reactions</Text>
              <Text style={styles.analyticsValue}>1,847</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.analyticsRow}>
              <Text style={styles.analyticsLabel}>Active notifications</Text>
              <Text style={styles.analyticsValue}>3 unread</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Events</Text>
          <View style={styles.analyticsCard}>
            {events.slice(0, 3).map((event, index) => (
              <React.Fragment key={event.id}>
                <View style={styles.analyticsRow}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.eventItemTitle} numberOfLines={1}>
                      {event.title}
                    </Text>
                    <Text style={styles.eventItemMeta}>
                      {event.rsvpCount} RSVPs
                    </Text>
                  </View>
                  <View style={[styles.statusDot, {
                    backgroundColor: event.status === "upcoming" ? Colors.primary : Colors.textMuted
                  }]} />
                </View>
                {index < 2 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
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
  unauthorized: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  unauthorizedText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    color: Colors.text,
  },
  backLink: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: Colors.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 4,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingTop: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    color: "#fff",
  },
  headerSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    padding: 16,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.backgroundAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  statValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: Colors.text,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
  },
  section: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: Colors.text,
  },
  actionsList: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionInfo: {
    flex: 1,
    gap: 2,
  },
  actionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.text,
  },
  actionSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
  },
  analyticsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  analyticsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  analyticsLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  analyticsValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  eventItemTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  eventItemMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
