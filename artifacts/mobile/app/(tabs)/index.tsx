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
import { PostCard } from "@/components/PostCard";
import { EventCard } from "@/components/EventCard";
import { Avatar } from "@/components/ui/Avatar";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { posts, events, notifications, unreadCount, reactToPost } = useAppData();

  const upcomingEvents = events.filter((e) => e.status === "upcoming").slice(0, 4);
  const greeting = getGreeting();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 100),
        }}
      >
        <LinearGradient
          colors={["#FAF6F1", "#F5EDE2"]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.userName}>
                {user?.fullName?.split(" ")[0] || "there"}
              </Text>
            </View>

            <View style={styles.headerRight}>
              <Pressable
                style={styles.notifBtn}
                onPress={() => router.push("/(tabs)/profile")}
              >
                <Feather name="bell" size={20} color={Colors.text} />
                {unreadCount > 0 && (
                  <View style={styles.notifBadge}>
                    <Text style={styles.notifBadgeText}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Text>
                  </View>
                )}
              </Pressable>
              <Avatar name={user?.fullName || "U"} size={38} />
            </View>
          </View>

          <View style={styles.clubBanner}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bannerGradient}
            >
              <Text style={styles.bannerLabel}>CONNECT CLUB</Text>
              <Text style={styles.bannerText}>Jenna's Private Community</Text>
            </LinearGradient>
          </View>
        </LinearGradient>

        {upcomingEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
              <Pressable onPress={() => router.push("/(tabs)/events")}>
                <Text style={styles.sectionLink}>See all</Text>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest from Jenna</Text>
          </View>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onReact={(reaction) => reactToPost(post.id, reaction)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 17) return "Good afternoon,";
  return "Good evening,";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  greeting: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  userName: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    color: Colors.text,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  notifBtn: {
    position: "relative",
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notifBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  notifBadgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    color: "#fff",
  },
  clubBanner: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  bannerGradient: {
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  bannerLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 2,
    marginBottom: 3,
  },
  bannerText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: Colors.text,
  },
  sectionLink: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.primary,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
});
