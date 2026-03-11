import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { Avatar } from "@/components/ui/Avatar";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, updateUser } = useAuth();
  const { notifications, markAllNotificationsRead, unreadCount } = useAppData();

  if (!user) return null;

  const joinedDate = new Date(user.joinedAt).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const handleToggleNotifications = async (value: boolean) => {
    await updateUser({ notificationsEnabled: value });
  };

  const recentNotifications = notifications.slice(0, 5);

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
          colors={["#FAF6F1", "#F0E8DC"]}
          style={styles.profileHeader}
        >
          <View style={styles.avatarSection}>
            <Avatar name={user.fullName} size={80} />
            <View style={styles.userInfo}>
              <Text style={styles.fullName}>{user.fullName}</Text>
              <Text style={styles.username}>@{user.username}</Text>
              <Text style={styles.joinDate}>Member since {joinedDate}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.eventsAttended}</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.challengesCompleted}</Text>
              <Text style={styles.statLabel}>Challenges</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {user.role === "admin" ? "Admin" : "Member"}
              </Text>
              <Text style={styles.statLabel}>Role</Text>
            </View>
          </View>

          {user.city && (
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={13} color={Colors.textMuted} />
              <Text style={styles.locationText}>{user.city}</Text>
            </View>
          )}

          {user.instagramHandle && (
            <View style={styles.locationRow}>
              <Feather name="instagram" size={13} color={Colors.textMuted} />
              <Text style={styles.locationText}>{user.instagramHandle}</Text>
            </View>
          )}
        </LinearGradient>

        {user.role === "admin" && (
          <Pressable
            style={styles.adminBanner}
            onPress={() => router.push("/admin")}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.adminBannerGradient}
            >
              <View style={styles.adminBannerLeft}>
                <Feather name="settings" size={20} color="#fff" />
                <View>
                  <Text style={styles.adminBannerTitle}>Admin Dashboard</Text>
                  <Text style={styles.adminBannerSub}>Manage community content</Text>
                </View>
              </View>
              <Feather name="arrow-right" size={18} color="rgba(255,255,255,0.7)" />
            </LinearGradient>
          </Pressable>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Feather name="bell" size={18} color={Colors.primary} />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={user.notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={user.notificationsEnabled ? Colors.primary : Colors.textMuted}
            />
          </View>

          {unreadCount > 0 && (
            <Pressable
              style={styles.clearBtn}
              onPress={markAllNotificationsRead}
            >
              <Text style={styles.clearBtnText}>
                Mark all as read ({unreadCount})
              </Text>
            </Pressable>
          )}
        </View>

        {recentNotifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Notifications</Text>
            <View style={styles.notifList}>
              {recentNotifications.map((notif) => (
                <Pressable
                  key={notif.id}
                  style={[styles.notifItem, !notif.read && styles.notifUnread]}
                >
                  <View style={styles.notifIcon}>
                    <Feather
                      name={
                        notif.type === "event"
                          ? "calendar"
                          : notif.type === "challenge"
                          ? "award"
                          : notif.type === "winner"
                          ? "award"
                          : notif.type === "partner"
                          ? "briefcase"
                          : "bell"
                      }
                      size={14}
                      color={Colors.primary}
                    />
                  </View>
                  <View style={styles.notifContent}>
                    <Text style={styles.notifTitle} numberOfLines={1}>
                      {notif.title}
                    </Text>
                    <Text style={styles.notifBody} numberOfLines={2}>
                      {notif.body}
                    </Text>
                    <Text style={styles.notifTime}>
                      {getTimeAgo(notif.createdAt)}
                    </Text>
                  </View>
                  {!notif.read && <View style={styles.unreadDot} />}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.menuList}>
            <View style={styles.menuItem}>
              <Feather name="mail" size={16} color={Colors.textMuted} />
              <Text style={styles.menuItemText}>{user.email}</Text>
            </View>
            <View style={styles.menuItem}>
              <Feather name="phone" size={16} color={Colors.textMuted} />
              <Text style={styles.menuItemText}>{user.phone}</Text>
            </View>
            {user.city && (
              <View style={styles.menuItem}>
                <Feather name="map-pin" size={16} color={Colors.textMuted} />
                <Text style={styles.menuItemText}>{user.city}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <Feather name="log-out" size={18} color={Colors.error} />
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileHeader: {
    padding: 20,
    paddingBottom: 20,
    gap: 14,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 16,
  },
  userInfo: {
    flex: 1,
    gap: 3,
  },
  fullName: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: Colors.text,
  },
  username: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.textMuted,
  },
  joinDate: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  statNumber: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: Colors.text,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
  },
  adminBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  adminBannerGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  adminBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  adminBannerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#fff",
  },
  adminBannerSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: Colors.text,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  settingLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: Colors.text,
  },
  clearBtn: {
    alignSelf: "flex-start",
  },
  clearBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.primary,
  },
  notifList: {
    gap: 8,
  },
  notifItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notifUnread: {
    backgroundColor: "#FFF5F8",
    borderColor: Colors.primaryLight,
  },
  notifIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.backgroundAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  notifContent: {
    flex: 1,
    gap: 2,
  },
  notifTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.text,
  },
  notifBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  notifTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  menuList: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFDEDE",
  },
  logoutText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.error,
  },
});
