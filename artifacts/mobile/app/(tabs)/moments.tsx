import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { useAppData } from "@/contexts/AppDataContext";

const { width } = Dimensions.get("window");
const GRID_ITEM_SIZE = (width - 48 - 8) / 2;

function LikeButton({ momentId, likes, userLiked }: { momentId: string; likes: number; userLiked: boolean }) {
  const { likeMoment } = useAppData();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.4, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    likeMoment(momentId);
  };

  return (
    <Pressable onPress={handlePress} style={styles.likeBtn}>
      <Animated.View style={animStyle}>
        <Ionicons
          name={userLiked ? "heart" : "heart-outline"}
          size={18}
          color={userLiked ? "#E84060" : "#fff"}
        />
      </Animated.View>
      <Text style={styles.likeCount}>{likes}</Text>
    </Pressable>
  );
}

export default function MomentsScreen() {
  const insets = useSafeAreaInsets();
  const { moments } = useAppData();
  const [viewMode, setViewMode] = useState<"grid" | "featured">("featured");

  const featured = moments.filter((m) => m.featured);
  const all = moments;

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
          <View>
            <Text style={styles.title}>Moments</Text>
            <Text style={styles.subtitle}>Community memories</Text>
          </View>
          <View style={styles.viewToggle}>
            <Pressable
              onPress={() => setViewMode("featured")}
              style={[styles.toggleBtn, viewMode === "featured" && styles.toggleBtnActive]}
            >
              <Feather name="star" size={14} color={viewMode === "featured" ? "#fff" : Colors.textMuted} />
            </Pressable>
            <Pressable
              onPress={() => setViewMode("grid")}
              style={[styles.toggleBtn, viewMode === "grid" && styles.toggleBtnActive]}
            >
              <Feather name="grid" size={14} color={viewMode === "grid" ? "#fff" : Colors.textMuted} />
            </Pressable>
          </View>
        </View>

        {viewMode === "featured" ? (
          <View style={styles.featuredList}>
            {featured.map((moment) => (
              <View key={moment.id} style={styles.featuredCard}>
                <Image
                  source={{ uri: moment.image }}
                  style={styles.featuredImage}
                  contentFit="cover"
                  transition={300}
                />
                <View style={styles.featuredOverlay}>
                  <View style={styles.featuredBadge}>
                    <Feather name="star" size={10} color={Colors.accent} />
                    <Text style={styles.featuredBadgeText}>Featured</Text>
                  </View>

                  <View style={styles.featuredBottom}>
                    <View style={styles.featuredMeta}>
                      <Text style={styles.featuredAuthor}>{moment.authorName}</Text>
                      {moment.eventTitle && (
                        <Text style={styles.featuredEvent}>{moment.eventTitle}</Text>
                      )}
                      {moment.caption && (
                        <Text style={styles.featuredCaption} numberOfLines={2}>
                          {moment.caption}
                        </Text>
                      )}
                    </View>
                    <LikeButton
                      momentId={moment.id}
                      likes={moment.likes}
                      userLiked={moment.userLiked}
                    />
                  </View>
                </View>
              </View>
            ))}

            <Text style={styles.allMomentsTitle}>All Moments</Text>
            <View style={styles.grid}>
              {all.map((moment) => (
                <View key={moment.id} style={styles.gridItem}>
                  <Image
                    source={{ uri: moment.image }}
                    style={styles.gridImage}
                    contentFit="cover"
                    transition={300}
                  />
                  <View style={styles.gridOverlay}>
                    <LikeButton
                      momentId={moment.id}
                      likes={moment.likes}
                      userLiked={moment.userLiked}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={[styles.grid, { paddingHorizontal: 16 }]}>
            {all.map((moment) => (
              <View key={moment.id} style={styles.gridItem}>
                <Image
                  source={{ uri: moment.image }}
                  style={styles.gridImage}
                  contentFit="cover"
                  transition={300}
                />
                <View style={styles.gridOverlay}>
                  {moment.featured && (
                    <View style={styles.gridFeaturedDot}>
                      <Feather name="star" size={8} color={Colors.accent} />
                    </View>
                  )}
                  <LikeButton
                    momentId={moment.id}
                    likes={moment.likes}
                    userLiked={moment.userLiked}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {all.length === 0 && (
          <View style={styles.empty}>
            <Feather name="image" size={40} color={Colors.border} />
            <Text style={styles.emptyTitle}>No moments yet</Text>
            <Text style={styles.emptyText}>
              Attend an event and share your photos here!
            </Text>
          </View>
        )}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  viewToggle: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  toggleBtn: {
    padding: 10,
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  featuredList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  featuredCard: {
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
  },
  featuredImage: {
    width: "100%",
    height: 260,
    backgroundColor: Colors.backgroundAlt,
  },
  featuredOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    padding: 14,
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    alignSelf: "flex-start",
  },
  featuredBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: Colors.accent,
  },
  featuredBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  featuredMeta: {
    flex: 1,
    gap: 2,
  },
  featuredAuthor: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#fff",
  },
  featuredEvent: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  featuredCaption: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
    maxWidth: "85%",
  },
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
    backdropFilter: "blur(10px)",
  },
  likeCount: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: "#fff",
  },
  allMomentsTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  gridImage: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.backgroundAlt,
  },
  gridOverlay: {
    position: "absolute",
    bottom: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  gridFeaturedDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
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
